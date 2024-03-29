const authModules = require("../models/auth");


const register = async (req, res) => {
  try {
    const emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    if (emailRegex.test(req.body.email) === false) {
      return res.status(400).json({
        msg: "Format email is wrong",
      });
    }

    const preventDuplicateEmail = await authModules.getEmail(req.body);
    if (preventDuplicateEmail.rows.length > 0) {
      return res.status(400).json({
        msg: `Email has been registered`,
      });
    }

    if (req.body.password.length < 8) {
      return res.status(400).json({
        msg: "Password at least eight characters",
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        msg: "Password does not match",
      });
    }

    const response = await authModules.register(req.body);
    res.status(201).json({
      data: response.rows,
      msg: "Create account successfully",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const checkEmail = await authModules.getEmail(req.body);

    if (checkEmail.rows.length === 0) {
      return res.status(401).json({
        msg: "Email is not registered",
      });
    }

    const result = checkEmail.rows[0];

    // console.log("User:", result);

    const response = await authModules.login(result, req.body);
    res.status(200).json({
      data: response,
      msg: "Login success",
    });
  } catch (obErr) {
    const statusCode = obErr.statusCode || 500;
    res.status(statusCode).send(obErr.error);
  }
};

const logout = async (req, res) => {
  try {
    // console.log("User Payload: ", req.userPayload);

    const bearerToken = req.header("Authorization");

    const response = await authModules.logout(bearerToken.split(" ")[1]);

    await authModules.lastLogin(req.userPayload);

    res.status(200).json({
      data: response.rows[0],
      msg: "Logout success",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internet server error",
    });
  }
};

const getRoles = async (req, res) => {
  try {
    const response = await authModules.getRoles();
    res.status(200).json({
      data: response.rows,
      msg: "Success get data",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internet server error",
    });
  }
};

module.exports = { register, login, logout, getRoles };
