const usersModels = require("../models/users");

const updateProfile = async (req, res) => {
  try {
    const response = await usersModels.updateProfile(req.userPayload, req.body);
    res.status(200).json({
      data: response.rows,
      msg: "Update success",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internet server error",
    });
  }
};

module.exports = { updateProfile };
