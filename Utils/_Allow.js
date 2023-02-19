"use strict";

exports.Files = (source) => {
  try {
    const matchGoogleDrive =
      /(?:https?:\/\/)?(?:[\w\-]+\.)*(?:drive|docs)\.google\.com\/(?:(?:folderview|open|uc)\?(?:[\w\-\%]+=[\w\-\%]*&)*id=|(?:folder|file|document|presentation)\/d\/|spreadsheet\/ccc\?(?:[\w\-\%]+=[\w\-\%]*&)*key=)([\w\-]{28,})/i;
    const matchMP4 = /([\w\-]{1,200})\.(mp4)$/i;
    const setData = {};
    setData.status = true;
    if (matchGoogleDrive.test(source)) {
      const match = source.match(matchGoogleDrive);
      setData.gid = match[1];
      setData.type = "gdrive";
      setData.source = `${match[1]}`;
    } else if (matchMP4.test(source)) {
      const match = source.match(matchMP4);
      setData.title = match[1];
      setData.type = "linkmp4";
      setData.source = source;
    } else {
      setData.status = false;
    }
    return setData;
  } catch (error) {
    return;
  }
};
