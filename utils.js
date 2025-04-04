
var jwt = require("jsonwebtoken");


function generateToken(user) {

  if (!user) return null;

  var u = {
    id: user.id,
    name: user.name,
    username: user.username,
    password: user.password,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };


  return jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24,
  });
}

function getCleanUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    password: null,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
}

module.exports = {
  generateToken,
  getCleanUser,
};