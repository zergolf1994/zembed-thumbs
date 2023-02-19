"use strict";

const shell = require("shelljs");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs-extra");
const http = require("http");
const { Files, Servers, Process } = require(`../Models`);
const { Cache, TimeSleep, GetIP, getSets, CheckDisk } = require(`../Utils`);

const moment = require("moment");
const sizeOf = require("image-size");
const mergeImg = require("merge-img");
const Jimp = require("jimp");

module.exports = async (req, res) => {
  try {
    const { slug } = req.query;

    if (!slug) return res.json({ status: false });
    const sv_ = await GetIP();
    let sets = await getSets();

    let server = await Servers.Lists.findOne({
      raw: true,
      where: {
        sv_ip: sv_,
        active: 1,
        work: 0,
      },
    });

    if (!server) return res.json({ status: false, msg: "server_busy" });

    let row = await Files.Lists.findOne({
      //attributes: ["id", "userId", "slug"],
      where: {
        slug,
        e_code: 0,
        s_video: 1,
        duration: { [Op.ne]: 0 },
      },
      include: [
        {
          model: Files.Datas,
          as: "datas",
          where: {
            active: 1,
            value: {
              [Op.like]: `%.mp4%`,
            },
            type: "video",
          },
          required: true,
        },
      ],
    });

    if (!row) return res.json({ status: false, msg: "not_exists" });
    let vdo_hls = row?.datas.map((r) => {
      return r?.type == "video" && r;
    });

    let storageId = vdo_hls[0]?.storageId;
    let file_name = vdo_hls[0]?.value;
    let sv_ip = await Cache.GetStorage({ storageId: storageId });

    let data_pc = {
      userId: row?.userId,
      serverId: server?.id,
      fileId: row?.id,
      type: "thumbs",
      quality: "vtt",
    };
    let pc_create = await Process.create(data_pc);
    if (!pc_create?.id) {
      return res.json({ status: false, msg: `db_err` });
    }

    await Files.Lists.update(
      { e_code: 1 },
      {
        where: { id: data_pc.fileId },
        silent: true,
      }
    );
    await Servers.Lists.update(
      { work: 1 },
      {
        where: { id: data_pc.serverId },
        silent: true,
      }
    );
    //return res.json({ status: false, msg: "not_exists2" });
    let rowCount = 10,
      colCount = 10;
    let duration = row?.duration - 1;
    let IntervalPerImage = getOptimalInterval(duration);
    let totalImages = Math.floor(duration / IntervalPerImage);
    let totalSpirits = Math.ceil(
      duration / IntervalPerImage / (rowCount * colCount)
    );

    let w = 200;
    let imgdir = path.join(global.dir, "public");
    if (!fs.existsSync(path.join(imgdir, `.tmp`, slug))) {
      fs.rmSync(path.join(imgdir, `.tmp`), { recursive: true, force: true });
    }
    await fs.ensureDir(path.join(imgdir, `.tmp`, slug, `path`));
    await fs.ensureDir(path.join(imgdir, `.tmp`, slug, `sprit`));
    await fs.ensureDir(path.join(imgdir, `thumbs`, slug));

    let start_inv_image = 1;
    console.log("downloading %s", slug, totalImages);
    for (let inv = 1; inv <= totalImages; inv++) {
      let sec = start_inv_image;
      await downloadThumbs({ sv_ip, slug, file_name, sec, w, imgdir });
      console.log("download %s / %s", inv, totalImages);
      start_inv_image += IntervalPerImage;
    }
    console.log("downloaded %s", slug);
    Jimp.read(
      path.join(imgdir, `.tmp`, slug, `path`, `1.jpg`),
      (err, image) => {
        if (err) throw err;
        image
          .greyscale()
          .posterize(2)
          .write(path.join(imgdir, `.tmp`, slug, `path`, `0.jpg`));
      }
    );

    let { width, height } = await getThumbsSize({ slug, imgdir });

    let { table, table_c, file_vtt } = await createVTT({
      totalSpirits,
      totalImages,
      IntervalPerImage,
      rowCount,
      colCount,
      width,
      height,
      slug,
      imgdir,
    });

    let { links } = await createSpriteX({ table, colCount, imgdir, slug });
    let { linksY } = await createSpriteY({ links, imgdir, slug });
    let { link_image } = await resizeJimp({ linksY, imgdir, slug });

    //create file vtt
    let thumb = await Files.Datas.findOne({
      raw: true,
      where: {
        type: "thumbs",
        name: "vtt",
        fileId: row?.id,
      },
    });
    let file_data = {
      active: 1,
      type: "thumbs",
      name: "vtt",
      value: "thumbs.vtt",
      fileId: row?.id,
      storageId: data_pc?.serverId,
      userId: row?.userId,
    };
    if (thumb) {
      console.log("update");
      await Files.Datas.update(file_data, {
        where: {
          id: thumb?.id,
        },
      });
    } else {
      console.log("create");
      await Files.Datas.create({ ...file_data });
    }

    // update s_thumb
    await Files.Lists.update(
      { e_code: 0, s_thumbs: 1 },
      {
        where: { id: data_pc.fileId },
        silent: true,
      }
    );
    let disk = await CheckDisk();
    await Servers.Lists.update(
      { work: 0, ...disk },
      {
        where: { id: data_pc.serverId },
        silent: true,
      }
    );

    await Process.destroy({ where: { id: pc_create?.id } });

    shell.exec(
      `sleep 5 && curl --write-out '%{http_code} cron download' --silent --output /dev/null "http://${sets?.domain_api_admin}/cron/thumbs"`,
      { async: false, silent: false },
      function (data) {}
    );
    return res.status(200).json({ file_vtt, link_image });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ status: false });
  }
};

function getOptimalInterval(duration) {
  if (duration < 120) return 1;
  if (duration < 300) return 2;
  if (duration < 600) return 3;
  if (duration < 1800) return 4;
  if (duration < 3600) return 5;
  if (duration < 7200) return 10;
  return 10;
}
function downloadThumbs({ sv_ip, slug, file_name, sec, w, imgdir }) {
  //let times = sec * 1000;
  const url = `http://${sv_ip}:8889/thumb/${slug}/${file_name}/thumb-${
    sec * 1000
  }-w${w}.jpg`;
  let file_parts = path.join(imgdir, `.tmp`, slug, `path`, `${sec}.jpg`);
  return new Promise(function (resolve, reject) {
    if (fs.existsSync(file_parts)) {
      //file exists
      resolve(true);
    } else {
      http.get(url, function (resp) {
        var buffers = [];
        var length = 0;
        resp.on("data", function (chunk) {
          // store each block of data
          length += chunk.length;
          buffers.push(chunk);
        });
        resp.on("end", async function () {
          var content = Buffer.concat(buffers);
          if (content != "null" || content != null || content != "") {
            fs.writeFileSync(file_parts, content, "utf8");
            resolve(true);
          } else {
            await TimeSleep(1);
            downloadThumbs({ sv_ip, slug, file_name, sec, width, imgdir });
          }
        });
      });
    }
  });
}

function getThumbsSize({ slug, imgdir }) {
  let file_parts = path.join(imgdir, `.tmp`, slug, `path`, `1.jpg`);
  const dimensions = sizeOf(file_parts);
  return new Promise(function (resolve, reject) {
    resolve(dimensions);
  });
}

function createVTT({
  totalSpirits,
  totalImages,
  IntervalPerImage,
  rowCount,
  colCount,
  width,
  height,
  slug,
  imgdir,
}) {
  return new Promise(async function (resolve, reject) {
    const startTime = moment("00:00:00", "HH:mm:ss.SSS");
    const endTime = moment("00:00:00", "HH:mm:ss.SSS").add(
      IntervalPerImage,
      "seconds"
    );
    let thumbOutput = "WEBVTT\n\n";
    let i_break = false;
    let start_inv_image = 1;
    let table = [],
      table_c = [];
    for (let k = 0; k < totalSpirits; k++) {
      let lineX = [];
      for (let i = 0; i < rowCount; i++) {
        let lineY = [];
        for (let j = 0; j < colCount; j++) {
          const currentImageCount = k * rowCount * colCount + i * colCount + j;
          if (currentImageCount >= totalImages) {
            i_break = true;
            break;
          }
          thumbOutput += `${startTime.format(
            "HH:mm:ss.SSS"
          )} --> ${endTime.format("HH:mm:ss.SSS")}\n`;
          thumbOutput += `${slug}-${k < 10 ? `0${k}` : k}.jpg#xywh=${
            j * width
          },${i * height},${width},${height}\n\n`;

          startTime.add(IntervalPerImage, "seconds");
          endTime.add(IntervalPerImage, "seconds");

          lineY.push(start_inv_image);
          start_inv_image += IntervalPerImage;
        }
        lineX.push(lineY);
        if (i_break) {
          break;
        }
      }

      table[k] = lineX;
      table_c[k] = lineX.length;
    }

    await fs.writeFileSync(
      path.join(imgdir, "thumbs", slug, `thumbs.vtt`),
      thumbOutput
    );

    resolve({ table, table_c, file_vtt: `thumbs.vtt` });
  });
}

async function createSpriteX({ table, colCount, imgdir, slug }) {
  return new Promise(async function (resolve, reject) {
    let sprite_row = 0,
      sprite_col = 0;
    let links = [];
    for (const items of table) {
      sprite_col = 0;
      let linkX = [];
      for (const item of items) {
        if (item.length < colCount) {
          let count_add = colCount - item.length;
          for (let index = 0; index < count_add; index++) {
            item.push(0);
          }
        }
        let linksx = await createX({
          item,
          sprite_row,
          sprite_col,
          imgdir,
          slug,
        });
        linkX.push(linksx);
        sprite_col++;
      }
      sprite_row++;
      links.push(linkX);
    }
    resolve({ links });
  });
  //return links;
}

async function createX({ item, sprite_row, sprite_col, imgdir, slug }) {
  let arrayimage = [];
  const outX = path.join(
    imgdir,
    `.tmp`,
    slug,
    "sprit",
    `X_${sprite_row}_${sprite_col}.jpg`
  );
  return new Promise(async function (resolve, reject) {
    item.map((img) => {
      arrayimage.push(path.join(imgdir, `.tmp`, slug, "path", `${img}.jpg`));
    });
    await mergeImg(arrayimage, { direction: false }).then((img) => {
      img.write(outX, () => resolve(outX));
    });
  });
}
async function createSpriteY({ links, imgdir, slug }) {
  let i = 0;
  let linksY = [];
  return new Promise(async function (resolve, reject) {
    for (const link of links) {
      let out = await createY(link, i, imgdir, slug);
      linksY.push(out);
      i++;
    }
    resolve({ linksY });
  });
}

async function createY(items, n, imgdir, slug) {
  let output = path.join(
    imgdir,
    `.tmp`,
    slug,
    `sprit`,
    `${n < 10 ? `0${n}` : n}.jpg`
  );
  return new Promise(function (resolve, reject) {
    mergeImg(items, { direction: true }).then((img) => {
      img.write(output, () => {
        resolve(`${n < 10 ? `0${n}` : n}.jpg`);
      });
    });
  });
}

async function resizeJimp({ linksY, imgdir, slug }) {
  let link_image = [];
  return new Promise(function (resolve, reject) {
    for (const images of linksY) {
      let input = path.join(imgdir, `.tmp`, slug, `sprit`, `${images}`);
      let output = path.join(imgdir, `thumbs`, slug, `thumbs-${images}`);
      Jimp.read(input, async (err, image) => {
        if (err) throw err;
        await image
          .quality(80) // set JPEG quality
          .write(output); // save
      });
      link_image.push(`${images}`);
    }
    resolve({ link_image });
  });
}
