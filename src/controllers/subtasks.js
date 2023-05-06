const subtasksModals = require("../models/subtasks");

const createSubtask = async (req, res) => {
  try {
    const response = await subtasksModals.createSubtask(req.body);
    res.status(200).json({
      data: response.rows,
      msg: "Create success",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internet server error",
    });
  }
};

const deleteSubtask = async (req, res) => {
  try {
    const response = await subtasksModals.deleteSubtask(req.params);
    res.status(200).json({
      data: response.rows[0],
      msg: "Delete success",
    });
  } catch (error) {
    res.status(500).status({
      msg: "Internet server error",
    });
  }
};

const editSubtask = async (req, res) => {
  try {
    const response = await subtasksModals.editSubtask(req.params, req.body);
    res.status(200).json({
      data: response.rows[0],
      msg: "Update success",
    });
  } catch (error) {}
};

const getSubtasks = async (req, res) => {
  try {
    const response = await subtasksModals.getSubtasks(req.query);
    res.status(200).send(response);
  } catch (obErr) {
    const statusCode = obErr.statusCode || 500;
    res.status(statusCode).json({
      msg: obErr?.msg,
      data: obErr?.data,
    });
  }
};

module.exports = {
  createSubtask,
  deleteSubtask,
  editSubtask,
  getSubtasks,
};
