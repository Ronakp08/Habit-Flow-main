const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
const sequelize = require("./config/db");
const User = require("./models/user.model");
require("./models/association");
const authRoute = require("./routes/authRoutes");
const habitRoute = require("./routes/habitRoutes");
const progressRoute = require("./routes/progressRoutes");
const dashboardRoute = require("./routes/dashboardRoutes");
const aiCoachRoute = require("./routes/aiCoachRoutes");
const settingsRoute = require("./routes/settingsRoutes");
const app = express();
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL || "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const createDefaultSuperAdmin = async () => {
  const email = process.env.DEFAULT_SUPERADMIN_EMAIL;
  const password = process.env.DEFAULT_SUPERADMIN_PASSWORD;
  const name = process.env.DEFAULT_SUPERADMIN_NAME || "Super Admin";

  if (!email || !password) {
    console.warn(
      "Default super admin was not created because DEFAULT_SUPERADMIN_EMAIL or DEFAULT_SUPERADMIN_PASSWORD is missing."
    );
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ where: { email: normalizedEmail } });
  if (existingUser) {
    if (existingUser.role !== "superadmin") {
      await existingUser.update({ role: "superadmin" });
      console.log(`Default super admin promoted: ${normalizedEmail}`);
    }
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name: name.trim() || "Super Admin",
    email: normalizedEmail,
    password: hashedPassword,
    role: "superadmin",
  });
  console.log(`Default super admin created: ${normalizedEmail}`);
};

sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("Database synced");
    await createDefaultSuperAdmin();
  })
  .catch((err) => console.error("Sync error:", err));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "HabitFlow API" });
});

app.use("/api/auth", authRoute);
app.use("/api/habits", habitRoute);
app.use("/api/progress", progressRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/ai", aiCoachRoute);
app.use("/api/settings", settingsRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
