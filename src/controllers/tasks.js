const tasksModels = require("../models/tasks");

const createTasks = async (req, res) => {
  try {
    const response = await tasksModels.createTasks(
      req.userPayload.user_id,
      req.body
    );
    res.status(200).json({
      data: response.rows[0],
      msg: "create success",
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

const editTask = async (req, res) => {
  try {
    const response = await tasksModels.editTask(req.params, req.body);
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

module.exports = { createTasks, editTask };
