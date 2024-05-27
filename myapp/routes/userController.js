const userService = require("../services/userService");

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is stored in JWT token
    const userProfile = await userService.getUserProfile(userId);
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile };
