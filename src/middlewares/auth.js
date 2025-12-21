const jwt = require("jsonwebtoken");
const USER = require("../configs/databaseSchema");

async function auth(req, res, next) {
  try {
    const decoded = jwt.verify(req.cookies.token, process.env.jwtPrivateKey);
    if (decoded) {
      req.userData = await USER.findById(decoded._id);
      next();
    } else {
      throw new Error("Invalid TOKEN!!");
    }
  } catch (error) {
    res.status(403).send(error.message);
  }
}

module.exports = auth;
