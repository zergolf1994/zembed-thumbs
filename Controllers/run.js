"use strict";
const shell = require("shelljs");

module.exports = async (req, res) => {
  try {
    const { slug } = req.query;
    if (!slug) return res.json({ status: false, msg: "not_slug" });

    shell.exec(
      `curl --write-out '%{http_code} start ${slug} done' --silent --output /dev/null "http://127.0.0.1/start?slug=${slug}"`,
      { async: false, silent: false },
      function (data) {}
    );

    return res.json({ status: true });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: error.name });
  }
};
