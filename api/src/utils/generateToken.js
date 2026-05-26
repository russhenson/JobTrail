const jwt = require("jsonwebtoken");

// Creates a JWT signed with the secret in .env — expires in 7 days
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;