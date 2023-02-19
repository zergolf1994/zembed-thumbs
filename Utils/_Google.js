"use strict";
const request = require("request");
const queryString = require("query-string");
const { GAuth } = require(`../Models`);
const { Sequelize, Op } = require("sequelize");

exports.GRetoken = async ({ client_id, client_secret, refresh_token }) => {
  try {
    const data_reload = {
      client_id,
      client_secret,
      refresh_token,
      grant_type: "refresh_token",
    };

    const body = "";
    const url = "https://www.googleapis.com/oauth2/v4/token";
    return new Promise(function (resolve, reject) {
      request.post(url, { form: data_reload }, function (err, response, body) {
        const parsed = JSON.parse(response.body);
        //delete parsed.expires_in;
        resolve(parsed);
      });
    });
  } catch (error) {
    console.error(error);
    return;
  }
};
exports.GData = async ({ where }) => {
  try {
    if (!where) return;
    let row = await GAuth.findOne({
      where,
      raw: true,
      attributes: { exclude: ["updatedAt", "createdAt"] },
    });

    if (!row) return;
    return row;
  } catch (error) {
    console.error(error);
    return;
  }
};
exports.GRand = async ({ userId }) => {
  try {
    let where = {
        userId,
        active: 1,
      },
      row;

    row = await GAuth.findOne({
      where,
      attributes: { exclude: ["updatedAt", "createdAt"] },
      order: [[Sequelize.literal("RAND()")]],
    });

    if (!row && userId) {
      where.userId = 0;
      row = await GAuth.findOne({
        where,
        attributes: { exclude: ["updatedAt", "createdAt"] },
        order: [[Sequelize.literal("RAND()")]],
      });
    }

    if (!row) return;
    const date_token = new Date(row?.retokenAt);
    const timenow = Math.floor(Date.now() / 1000);
    const timetoken = Math.floor(date_token.getTime() / 1000);

    let token = JSON.parse(row?.token);

    if (timenow - timetoken > 3500) {
      token = await this.GRetoken(row);

      let data = {};
      if (token?.error) {
        token = "";
        data.active = 0;
      } else {
        data.token = JSON.stringify(token);
        data.retokenAt = new Date();
      }

      await GAuth.update(data, {
        where: { id: row?.id },
      });
    }

    return token;
  } catch (error) {
    console.error(error);
    return;
  }
};

exports.Source = async (file) => {
  try {
    if (!file) return;
    const data = {};
    const url = `https://docs.google.com/get_video_info?docid=${file?.source}`;
    let headers = {},
      proxy;

    let token = await this.GRand({ userId: file?.userId });

    if (token) {
      headers.Authorization = `${token?.token_type} ${token?.access_token}`;
    }
    if (process.env.PROXY) {
      proxy = `${process.env.PROXY}`;
    }

    return new Promise(function (resolve, reject) {
      request({ url, proxy, headers }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const parsed = queryString.parse(body);
          data.status = parsed.status;
          if (parsed.status == "ok") {
            data.title = parsed.title;
            if (parsed.fmt_stream_map) {
              const fmt_stream_map = parsed.fmt_stream_map.split(",");
              fmt_stream_map.forEach((k, i) => {
                const [q, link] = k.split("|");
                const size = q
                  .toString()
                  .replace(37, 1080)
                  .replace(22, 720)
                  .replace(59, 480)
                  .replace(18, 360);
                if (link) {
                  data[size] = link;
                }
                /*if (size == 1080) {
                    data["1080"] = link;
                  }
                  if (size == 720) {
                    data[720] = link;
                  }
                  if (size == 480) {
                    data.file_480 = link;
                  }
                  if (size == 360) {
                    data.file_360 = link;
                  }*/
              });
            }
            data.cookie = JSON.stringify(response.headers["set-cookie"]);
            data.timestamp = Date.now();
          } else {
            data.error_code = parsed.errorcode;
            data.error_text = parsed.reason;
            //console.log(parsed)
          }
        } else {
          data.status = false;
        }
        resolve(data);
      });
    });
  } catch (error) {
    console.error(error);
    return;
  }
};
