const { DataTypes } = require("sequelize");
const sequelize = require("./conn");

const ProxyCache = sequelize.define(
  "proxy-cache",
  {
    name: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    value: {
      type: DataTypes.TEXT("long"),
    },
    token: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    fileId: {
      type: DataTypes.INTEGER(11),
    },
    userId: {
      type: DataTypes.INTEGER(11),
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ["name"],
      },
      {
        unique: false,
        fields: ["token"],
      },
      {
        unique: false,
        fields: ["fileId"],
      },
      {
        unique: false,
        fields: ["userId"],
      },
    ],
  }
);

(async () => {
  await ProxyCache.sync({ force: false });
})();

module.exports = ProxyCache;
