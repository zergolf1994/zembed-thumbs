const { DataTypes } = require("sequelize");
const sequelize = require("./conn");

const Lists = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  active: {
    type: DataTypes.TINYINT(1),
    defaultValue: 1,
  },
  role: {
    type: DataTypes.TINYINT(1),
    defaultValue: 1,
  },
  email: {
    type: DataTypes.STRING(255),
    defaultValue: "",
  },
  username: {
    type: DataTypes.STRING(255),
    defaultValue: "",
  },
  password: {
    type: DataTypes.STRING(60),
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
  expiredAt: {
    type: DataTypes.DATE,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
});
const Sets = sequelize.define(
  "user_set",
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
        fields: ["userId"],
      },
    ],
  }
);
const Auth = sequelize.define(
  "user_auth",
  {
    active: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    token: {
      type: DataTypes.STRING(40),
      defaultValue: "",
    },
    client_ip: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    user_agent: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    seenAt: {
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
        fields: ["active"],
      },
      {
        unique: false,
        fields: ["token"],
      },
      {
        unique: false,
        fields: ["userId"],
      },
    ],
  }
);
const Api = sequelize.define(
  "user_api",
  {
    active: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    api_key: {
      type: DataTypes.STRING(40),
      defaultValue: "",
    },
    scopes: {
      type: DataTypes.JSON,
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
        fields: ["active"],
      },
      {
        unique: false,
        fields: ["api_key"],
      },
      {
        unique: false,
        fields: ["userId"],
      },
    ],
  }
);
const Notify = sequelize.define(
  "user_notify",
  {
    status: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    level: {
      type: DataTypes.TINYINT(1),
      defaultValue: 1,
    },
    section: {
      type: DataTypes.STRING(255),
      defaultValue: "",
    },
    contents: {
      type: DataTypes.TEXT("long"),
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
        fields: ["status"],
      },
      {
        unique: false,
        fields: ["userId"],
      },
    ],
  }
);

Lists.hasMany(Sets, { as: "sets" });
Sets.belongsTo(Lists);

Lists.hasMany(Auth, { as: "auths" });
Auth.belongsTo(Lists);

Lists.hasMany(Api, { as: "apis" });
Api.belongsTo(Lists);

Lists.hasMany(Notify, { as: "notifys" });
Notify.belongsTo(Lists);

(async () => {
  await Lists.sync({ force: false });
  await Sets.sync({ force: false });
  await Auth.sync({ force: false });
  await Api.sync({ force: false });
  await Notify.sync({ force: false });
})();

module.exports = USERS = { Lists, Sets, Auth, Api, Notify };
