const jwt = require('jsonwebtoken');

const generateToken = (res, payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });

  return token;
};

module.exports = generateToken;
