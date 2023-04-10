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

const uploadImageProfile = async (req, res) => {
  try {
    const response = await usersModels.uploadImageProfile(
      req.userPayload,
      req.file,
      req.body
    );
    res.status(200).json({
      data: response.rows,
      msg: "Success upload",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internet server error",
    });
  }
};

const updateNoTelp = async (req, res) => {
  try {
    const duplicateNoTelp = await usersModels.getNoTelp(req.body);

    if (duplicateNoTelp.rows.length >= 3) {
      return res.status(400).json({
        msg: `${req.body.notelp} is used maximum 3 times. Please, use another phone number.`,
      });
    }

    const response = await usersModels.updateNoTelp(req.userPayload, req.body);
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

const getProfile = async (req, res) => {
  try {
    const response = await usersModels.getProfile(req.userPayload);
    res.status(200).json({
      data: response.rows,
      msg: "Get data success",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internet server error",
    });
  }
};

module.exports = {
  updateProfile,
  uploadImageProfile,
  getProfile,
  updateNoTelp,
};
