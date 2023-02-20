"use strict";

const express = require("express");
const router = express.Router();
const Control = require("./Controllers");
//data
router.route("/create").get(Control.Server.Create);
router.route("/start").get(Control.Start);
router.route("/cancle").get(Control.Cancle);
router.route("/run").get(Control.RunTask);

router.all("*", async (req, res) => {
  res.status(404).end();
});

module.exports = router;
