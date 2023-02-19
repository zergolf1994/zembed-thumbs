"use strict";

module.exports = ({ page, total, limit }) => {
  let per_page = parseInt(limit) || 10;
  const currentPage = parseInt(page) ? parseInt(page) : 1;
  const countPage = Math.ceil(total / parseInt(per_page)) || 1;
  const startRow = currentPage == 1 ? 0 : (currentPage - 1) * per_page;
  const endRow = parseInt(per_page);
  const PerPage = parseInt(per_page);
  return { countPage, currentPage, startRow, endRow, PerPage };
};
