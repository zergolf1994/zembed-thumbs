"use strict";

const fs = require("fs-extra");
const path = require("path");
const shell = require("shelljs");
const TimeSleep = require("./_TimeSleep");
module.exports = async (e) => {
  let cacheDir = path.join(global.dir, ".cache"),
    cacheFile = path.join(cacheDir, `server_hostname.txt`);
  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    if (!fs.existsSync(cacheFile)) {
      shell.exec(
        `#!/usr/bin/env bash
      set -e
      hostname=$(hostname)
      printf "$hostname\n"> ${cacheFile}`,
        { async: true, silent: true },
        async function (data) {}
      );
      await TimeSleep(3);
    }

    let sv_name = await fs.readFileSync(cacheFile, "utf8").trim();
    return sv_name;
  } catch (error) {
    console.error(error);
    return;
  }
};
