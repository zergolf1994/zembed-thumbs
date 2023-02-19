const { DataTypes } = require("sequelize");
const sequelize = require("./conn");

const Lists = sequelize.define(
  "servers",
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    type: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    active: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    work: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    sv_name: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    sv_ip: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    disk_percent: {
      type: DataTypes.INTEGER(3),
      defaultValue: 0,
    },
    disk_used: {
      type: DataTypes.BIGINT(255),
      defaultValue: 0,
    },
    disk_total: {
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
        fields: ["sv_ip"],
      },
      {
        unique: false,
        fields: ["disk_used"],
      },
      {
        unique: false,
        fields: ["disk_total"],
      },
    ],
  }
);

const Sets = sequelize.define(
  "server_set",
  {
    name: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    value: {
      type: DataTypes.TEXT("long"),
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
        fields: ["serverId"],
      },
    ],
  }
);

Lists.hasMany(Sets, { as: "sets" });
Sets.belongsTo(Lists);

(async () => {
  await Lists.sync({ force: false });
  await Sets.sync({ force: false });
})();

module.exports = Server = { Lists, Sets };
