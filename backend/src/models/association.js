const User = require("./user.model");
const Habit = require("./habit.models");
const Progress = require("./progress.model");
const AppSetting = require("./appSetting.model");

User.hasMany(Habit, {
  foreignKey: "userId",
  as: "habits",
});

Habit.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Habit.hasMany(Progress, { foreignKey: "habitId", as: "progresses" });
Progress.belongsTo(Habit, { foreignKey: "habitId", as: "habit" });

module.exports = { User, Habit, Progress, AppSetting };
