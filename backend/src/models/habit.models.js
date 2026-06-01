const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Habit = sequelize.define("Habit", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "General",
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Daily",
  },
  reminderTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Habit;
