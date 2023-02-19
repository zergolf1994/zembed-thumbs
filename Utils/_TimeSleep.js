module.exports = async (sec) => {
    if (!sec) {
      sec = Math.floor(Math.random() * 10);
    }
    return new Promise((rs) => setTimeout(rs, sec * 1000));
  };
  