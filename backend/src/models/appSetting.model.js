const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AppSetting = sequelize.define("AppSetting", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  value: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  tableName: "appSettings",
});

module.exports = AppSetting;
