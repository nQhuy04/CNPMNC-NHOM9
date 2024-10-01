const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
  // REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // Create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      // Save user to DB
      const user = await newUser.save();
      return res.status(200).json(user); // Add return here
    } catch (err) {
      return res.status(500).json(err); // Add return here
    }
  },

  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30s" }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  // LOGIN
loginUser: async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json("Incorrect username"); // Người dùng không tồn tại
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(404).json("Incorrect password"); // Mật khẩu không hợp lệ
    }
    if (user && validPassword) {
      // Tạo token truy cập
      const accessToken = authController.generateAccessToken(user);
      // Tạo refresh token
      const refreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(refreshToken);
      // Lưu refresh token vào cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      const { password, ...others } = user._doc;
      return res.status(200).json({ ...others, accessToken, refreshToken });
    }
  } catch (err) {
    console.error(err); // Log lỗi ra console để kiểm tra
    return res.status(500).json("Internal server error");
  }
},

  // REQUEST REFRESH TOKEN
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json("You're not authenticated"); // Add return here
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid"); // Add return here
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid"); // Add return here
      }

      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      // Create new access and refresh tokens
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);

      // Store new refresh token in cookie
      res.cookie("refreshToken", newRefreshToken, { // Change to newRefreshToken
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken, // Change to newRefreshToken
      });
    });
  },

  // LOG OUT
  logOut: async (req, res) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.clearCookie("refreshToken");
    return res.status(200).json("Logged out successfully!"); // Add return here
  },
};

module.exports = authController;
