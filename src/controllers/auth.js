const authModules = require("../modules/auth");

const register = async (req, res) => {
  try {
    const regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    if (regex.test(req.body.email) === false) {
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

    const response = await authModules.register(req.body);
    res.status(201).json({
      msg: "Create account successfully",
    });
    console.log("Result responses: ", response.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

module.exports = { register };
