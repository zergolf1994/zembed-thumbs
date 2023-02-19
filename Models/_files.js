const { DataTypes } = require("sequelize");
const sequelize = require("./conn");

const Lists = sequelize.define(
  "files",
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
      defaultValue: 1,
    },
    type: {
      type: DataTypes.STRING(255),
      defaultValue: "",
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      defaultValue: "",
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING(255),
      defaultValue: "",
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    views: {
      type: DataTypes.BIGINT(255),
      defaultValue: 0,
    },
    size: {
      type: DataTypes.BIGINT(255),
      defaultValue: 0,
    },
    duration: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    e_code: {
      type: DataTypes.INTEGER(3),
      defaultValue: 0,
    },
    s_backup: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    s_video: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    s_convert: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    s_thumbs: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    s_done: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    viewedAt: {
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
        fields: ["type"],
      },
      {
        unique: false,
        fields: ["slug"],
      },
    ],
  }
);
const Datas = sequelize.define(
  "files_data",
  {
    active: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    type: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    name: {
      type: DataTypes.STRING(20),
      defaultValue: "",
    },
    value: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    mimetype: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    mimesize: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    size: {
      type: DataTypes.BIGINT(255),
      defaultValue: 0,
    },
    storageId: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ["type"],
      },
      {
        unique: false,
        fields: ["name"],
      },
      {
        unique: false,
        fields: ["storageId"],
      },
      {
        unique: false,
        fields: ["fileId"],
      },
    ],
  }
);
const Sets = sequelize.define(
  "files_set",
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
        fields: ["fileId"],
      },
    ],
  }
);

Lists.hasMany(Sets, { as: "sets" });
Sets.belongsTo(Lists);

Lists.hasMany(Datas, { as: "datas" });
Datas.belongsTo(Lists);

(async () => {
  await Lists.sync({ force: false });
  await Datas.sync({ force: false });
  await Sets.sync({ force: false });
})();

module.exports = Server = { Lists, Datas, Sets };
