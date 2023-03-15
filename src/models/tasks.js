const db = require("../configs/postgre");

const createTasks = (user_id, body) => {
  const { title, description } = body;
  return new Promise((resolve, reject) => {
    const query =
      "insert into tasks (user_id, status_id, title, description, created_at) values ($1, $2, $3, $4, $5)";

    const values = [user_id, "1", title, description, new Date()];

    db.query(query, values, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      return resolve(result);
    });
  });
};

const editTask = (params, body) => {
  return new Promise((resolve, reject) => {
    const { title, description } = body;
    const { id } = params;

    const query =
      "update tasks set title = $2, description = $3, updated_at = $4 where id = $1 returning *";

    const values = [id, title, description, new Date()];

    db.query(query, values, (error, result) => {
      // console.log("Query:", query);
      // console.log("Values:", values);
      // console.log("Result:", result);
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

module.exports = { createTasks, editTask };
