const db = require("../configs/postgre");

const createSubtask = (body) => {
  const { tasks_id, status_id, title } = body;
  return new Promise((resolve, reject) => {
    const query =
      "insert into subtasks (tasks_id, status_id, title, created_at) values ($1, $2, $3, $4) returning *";
    const values = [tasks_id, status_id, title, new Date()];
    db.query(query, values, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const deleteSubtask = (params) => {
  return new Promise((resolve, reject) => {
    const { id } = params;
    const query = "delete from subtasks where id = $1";
    db.query(query, [id], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const editSubtask = (params, body) => {
  return new Promise((resolve, reject) => {
    const { title } = body;
    const { id } = params;

    const query =
      "update subtasks set title = $2, updated_at = $3 where id = $1";

    db.query(query, [id, title, new Date()], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getSubtasks = () => {
  return new Promise((resolve, reject) => {
    const query = "select * from subtasks";

    db.query(query, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

module.exports = { createSubtask, deleteSubtask, editSubtask, getSubtasks };
