const { User } = require('../models');

const userService = {
  getUserProfile: async (userId) => {
    try {
      const userProfile = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });
      return userProfile;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = userService;
