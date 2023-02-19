"use strict";

exports.Order = (key) => {
  let data;
  switch (key) {
    case "update":
      data = "updatedAt";
      break;

    default:
      data = "createdAt";
      break;
  }
  return data;
};

exports.Sort = (key) => {
  let data;
  switch (key) {
    case "asc":
      data = "ASC";
      break;

    default:
      data = "DESC";
      break;
  }
  return data;
};