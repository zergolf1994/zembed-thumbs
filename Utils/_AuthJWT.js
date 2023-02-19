"use strict";

const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
  const token =
    req.body.accessToken ||
    req.query.accessToken ||
    req.headers["x-access-token"];
  try {
    if (!token) {
      req.user = {
        error: "required_token",
      };
    } else {
      const data = jwt.verify(token, process.env.JWT_TOKEN_KEY);
      //เช็ค ระงับใช้งาน

      //เช็ค ตัดออกจากระบบ
      req.user = { ...data };
    }
  } catch (err) {
    req.user = {
      error: "invalid_token.",
    };
  }
  return next();
};
module.exports = verifyToken;
