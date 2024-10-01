const User = require("../models/User");

const userController = {
  // GET ALL USERS
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      return res.status(200).json(users); // Return to prevent further execution
    } catch (err) {
      console.error(err); // Log the error for debugging
      return res.status(500).json({ message: "Internal server error", error: err }); // Send error response
    }
  },

  // DELETE A USER
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" }); // Handle case when user is not found
      }
      return res.status(200).json({ message: "User deleted" }); // Return after sending response
    } catch (err) {
      console.error(err); // Log the error for debugging
      return res.status(500).json({ message: "Internal server error", error: err }); // Send error response
    }
  },
};

module.exports = userController;
