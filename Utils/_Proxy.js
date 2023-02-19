"use strict";
const GoogleAuth = require(`./_Google`);

exports.Google = async (data) => {
  try {
    let google_data = await GoogleAuth.Source(data);
    return google_data;
  } catch (error) {
    return;
  }
};
