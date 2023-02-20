"use strict";

const { Files, Servers, Process } = require(`../Models`);
const shell = require("shelljs");
const path = require("path");

module.exports = async (req, res) => {
  try {
    const { slug } = req.query;

    if (!slug) return res.json({ status: false });

    let row = await Files.Lists.findOne({
      raw: true,
      where: {
        slug,
      },
    });
    if (!row) return res.json({ status: false, msg: "not_exists" });

    let pc = await Process.findOne({
      raw: true,
      where: {
        fileId: row?.id,
        type: "thumbs",
      },
    });

    if (!pc) return res.json({ status: false, msg: "not_exists" });

    await Servers.Lists.update(
      { work: 0 },
      {
        where: { id: pc.serverId },
        silent: true,
      }
    );

    await Files.Lists.update(
      { e_code: 0 },
      {
        where: { id: pc.fileId },
        silent: true,
      }
    );

    let db_delete = await Process.destroy({ where: { id: pc.id } });

    if (db_delete) {
      shell.exec(
        `sudo rm -rf ${path.join(global.dir, "public", ".tmp")}`,
        { async: false, silent: false },
        function (data) {}
      );
      return res.json({ status: true, msg: `canceled` });
    } else {
      return res.json({ status: false, msg: `db_err` });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: error.name });
  }
};
