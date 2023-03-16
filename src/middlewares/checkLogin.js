const jwt = require("jsonwebtoken");

const authModels = require("../models/auth");

const checkLogin = async (req, res, next) => {
  const bearerToken = req.header("Authorization");

  if (!bearerToken) {
    return res.status(403).json({
      msg: "You have to login first!",
    });
  }

  // console.log("Bearer Token: ", bearerToken);

  const checkToken = await authModels.getToken(bearerToken.split(" ")[1]);

  // console.log("Token", checkToken);

  if (checkToken.rows.length === 0) {
    return res.status(403).json({
      msg: "You have to login first",
    });
  }

  const token = bearerToken.split(" ")[1];

  // console.log("Token: ", token);

  jwt.verify(
    token,
    process.env.SECRET_KEY,
    { issuer: process.env.ISSUER },
    (error, decode) => {
      if (error && error.name) {
        return res.status(403).json({
          msg: error.message,
        });
      }

      if (error) {
        return res.status(500).json({
          msg: error.message,
        });
      }

      req.userPayload = decode;

      next();
    }
  );
};

module.exports = { checkLogin };
