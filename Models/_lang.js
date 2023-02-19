const { DataTypes } = require("sequelize");
const sequelize = require("./conn");

const Lists = sequelize.define(
  "lang",
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    active: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    code: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    title: {
      type: DataTypes.STRING(255),
      defaultValue: "",
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

const Texts = sequelize.define(
  "lang_text",
  {
    name: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    value: {
      type: DataTypes.TEXT,
    },
    langId: {
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
        fields: ["langId"],
      },
    ],
  }
);

Lists.hasMany(Texts, { as: "text" });
Texts.belongsTo(Lists);

(async () => {
  await Lists.sync({ force: false });
  await Sets.sync({ force: false });
})();

module.exports = Server = { Lists, Sets };
