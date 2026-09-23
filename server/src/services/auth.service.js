const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');
const { AppError } = require('../utils/errors');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN,
    }
  );
};

const register = async ({ name, email, password, profileImageUrl }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists', 409, 'EMAIL_ALREADY_EXISTS');
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    name,
    email,
    passwordHash,
    profileImageUrl,
  });

  const accessToken = generateToken(user);
  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
    },
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const accessToken = generateToken(user);
  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
    },
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
};

module.exports = {
  register,
  login,
  getMe,
  generateToken,
};
