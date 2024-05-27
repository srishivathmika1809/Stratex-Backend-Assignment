const authService = require('../services/authService');

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await authService.signup(name, email, password, role);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { signup, login };
