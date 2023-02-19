const { DataTypes } = require("sequelize");
const sequelize = require("./conn");

const GAuth = sequelize.define(
  "gauth",
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER(11),
    },
    active: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    email: {
      type: DataTypes.STRING(255),
    },
    client_id: {
      type: DataTypes.TEXT,
    },
    client_secret: {
      type: DataTypes.TEXT,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
    token: {
      type: DataTypes.TEXT,
    },
    retokenAt: {
      type: DataTypes.DATE,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["userId"],
      },
    ],
  }
);

(async () => {
  await GAuth.sync({ force: false });
})();

module.exports = GAuth;
