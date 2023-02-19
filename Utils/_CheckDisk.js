"use strict";
const os = require("os");
const checkDiskSpace = require("check-disk-space").default;

module.exports = async () => {
  try {
    //console.log(os.userInfo().homedir);
    return await checkDiskSpace(os.userInfo().homedir).then((diskSpace) => {
      diskSpace.used = diskSpace?.size - diskSpace?.free;
      diskSpace.percent = (
        (diskSpace.used * 100) / diskSpace?.size ?? 0
      ).toFixed(0);
      let data = {
        disk_used: diskSpace.used,
        disk_total: diskSpace.size,
        disk_percent: Number(diskSpace.percent),
      };
      return data;
    });
  } catch (error) {
    return;
  }
};
