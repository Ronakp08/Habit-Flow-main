const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Register
exports.userRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const trimmedName = name && name.trim();
    const normalizedEmail = email && email.trim().toLowerCase();

    if (!trimmedName || !normalizedEmail || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const userExist = await User.findOne({ where: { email: normalizedEmail } });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "Account with email already exists." });
    }

    const userCount = await User.count();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: userCount === 0 ? "superadmin" : "user",
    });
    res.status(201).json({
      message: "Congratulations, You are now a member of HabitFlow!",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Registration failed !", error);
    res.status(500).json({ message: "Registration Failed!" });
  }
};

// Login
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) {
      return res.status(400).json({ message: "Email is not registered with us." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: `Welcome, ${user.name}`,
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login failed !", error);
    res.status(500).json({ message: "Login Failed!" });
  }
};

// get user GET
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found." });
    }

    res.status(200).json({
      ...userProfile.toJSON(),
      role: userProfile.role || "user",
    });
  } catch (error) {
    console.error("Error while fetching profile:", error);
    res.status(500).json({ message: "Server error while fetching profile." });
  }
};
