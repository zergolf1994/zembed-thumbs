const { DataTypes } = require("sequelize");
const sequelize = require("./conn");

const GroupDomain = sequelize.define("group-domain", {
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
  type: {
    type: DataTypes.STRING(50),
    defaultValue: "",
  },
  title: {
    type: DataTypes.STRING(255),
    defaultValue: 0,
  },
  domain_list: {
    type: DataTypes.TEXT(),
    defaultValue: "",
  },
  count_used: {
    type: DataTypes.INTEGER(11),
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
});

(async () => {
  await GroupDomain.sync({ force: false });
})();

module.exports = GroupDomain;
