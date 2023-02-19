"use strict";
const { Settings } = require(`../Models`);
const { Op } = require("sequelize");

module.exports = async (attr = []) => {
  try {
    let where = {};
    if (attr.length) where.name = { [Op.or]: attr };
    let rows = await Settings.findAll({ raw: true, where });

    let data = {};

    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        if (rows[key]?.name != "") {
          data[rows[key]?.name] = rows[key]?.value;
        }
      }
    }
    return data;
  } catch (error) {
    return;
  }
};
