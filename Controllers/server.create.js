"use strict";

const { Servers } = require(`../Models`);
const { CheckDisk, GetIP, GetHN } = require(`../Utils`);

module.exports = async (req, res) => {
  //const { sv_ip, sv_name } = req.query;

  try {
    const sv_ip = await GetIP();
    const sv_name = await GetHN();
    
    if (!sv_ip) return res.json({ status: false });

    let row = await Servers.Lists.findOne({
      raw: true,
      where: { sv_ip },
    });
    if (row) return res.json({ status: false, msg: "exists" });
    let disk = await CheckDisk();
    let data = {
      sv_name,
      sv_ip,
      type: "thumbs",
      active: 0,
      ...disk,
    };
    let db_create = await Servers.Lists.create(data);

    if (db_create?.id) {
      return res.json({ status: true, msg: `created` });
    } else {
      return res.json({ status: false, msg: `db_err` });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: error.name });
  }
};
