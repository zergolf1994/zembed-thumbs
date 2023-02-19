const { DataTypes } = require("sequelize");
const sequelize = require("./conn");

const Process = sequelize.define(
  "process",
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER(11),
    },
    serverId: {
      type: DataTypes.INTEGER(11),
    },
    fileId: {
      type: DataTypes.INTEGER(11),
    },
    type: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    action: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    quality: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    percent: {
      type: DataTypes.BIGINT(255),
      defaultValue: 0,
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
      {
        unique: false,
        fields: ["serverId"],
      },
      {
        unique: false,
        fields: ["type"],
      },
      {
        unique: false,
        fields: ["action"],
      },
      {
        unique: false,
        fields: ["quality"],
      },
      {
        unique: false,
        fields: ["percent"],
      },
    ],
  }
);

(async () => {
  await Process.sync({ force: false });
})();

module.exports = Process;
