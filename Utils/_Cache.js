"use strict";
const path = require("path");
const fs = require("fs-extra");
const request = require("request");
const os = require("os");

const { Files, Storages, GroupDomain } = require(`../Models`);

exports.GetStorage = async ({ storageId }) => {
    
  if (!storageId) return;
  let storageDir = path.join(global.dir, ".storage"),
    storageFile = path.join(storageDir, `storage-${storageId}`);
  try {
    return new Promise(async function (resolve, reject) {
      if (!fs.existsSync(storageFile)) {
        if (!fs.existsSync(storageDir)) {
          fs.mkdirSync(storageDir);
        }
        let storage = await Storages.Lists.findOne({
          where: {
            id: storageId,
          },
          attributes: ["sv_ip"],
        });

        if (!storage) reject();

        let sv_ip = storage?.sv_ip;
        fs.writeFileSync(storageFile, JSON.stringify(storage), "utf8");
        resolve(sv_ip);
      } else {
        let file_read = fs.readFileSync(storageFile, "utf8");
        let storage = JSON.parse(file_read);
        let sv_ip = storage?.sv_ip;
        resolve(sv_ip);
      }
    });
  } catch (error) {
    return;
  }
};