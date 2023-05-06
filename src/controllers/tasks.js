const tasksModels = require("../models/tasks");
const subtaskModels = require("../models/subtasks");

const createTasks = async (req, res) => {
  try {
    const response = await tasksModels.createTasks(req.userPayload, req.body);
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
    const response = await tasksModels.editTask(
      req.userPayload,
      req.params,
      req.body
    );
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

const deleteTask = async (req, res) => {
  try {
    const resultSubtasksByIdTask = await subtaskModels.getSubtasks(req.params);

    if (resultSubtasksByIdTask.rows.length > 0)
      await subtaskModels.deleteSubtasksByTaskId(req.params);

    const response = await tasksModels.deleteTask(req.params);
    res.status(200).json({
      data: response.rows,
      msg: "Delete task success",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internet server error",
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const response = await tasksModels.getTasks(req.userPayload, req.query);
    // console.log("Get tasks:", response);
    res.status(200).send(response);
  } catch (obErr) {
    const statusCode = obErr.statusCode || 500;
    res.status(statusCode).json({
      msg: obErr?.msg,
      data: obErr?.data,
    });
  }
};

module.exports = { createTasks, editTask, deleteTask, getTasks };
