"use strict";
const { Users, Files } = require(`../Models`);

exports.Token = (length = 10) => {
  let result = "",
    characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.auth_token = async (length = 38) => {
  let token = this.Token(length);
  let count = await Users.Auth.count({
    raw: true,
    where: { token },
  });

  if (count) {
    token = this.Token(40);
  }

  return token;
};

exports.file_slug = async (length = 10) => {
  let slug = this.Token(length);
  let count = await Files.Lists.count({ where: { slug } });

  if (count) {
    slug = this.Token(12);
  }

  return slug;
};
