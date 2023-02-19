const { DataTypes } = require("sequelize");
const sequelize = require("./conn");

const Settings = sequelize.define(
  "setting",
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
    ],
  }
);

(async () => {
  await Settings.sync({ force: false });
})();

module.exports = Settings;
