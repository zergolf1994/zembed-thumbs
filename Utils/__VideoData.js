"use strict";
const ffmpeg = require("fluent-ffmpeg");

module.exports = async (pathVideo) => {
  try {
    return new Promise((resolve, reject) => {
      ffmpeg(pathVideo).ffprobe((err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  } catch (error) {
    console.error(error);
    return;
  }
};
