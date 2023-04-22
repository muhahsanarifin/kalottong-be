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

const getSubtask = (params, q) => {
  const { taskId } = params;

  return new Promise((resolve, reject) => {
    let query,
      link = "?";

    query = "select * from subtasks where tasks_id = $1 ";

    let limitQuery = "";
    let values = [];

    if (q.page && q.limit) {
      let page = Number(q.page);
      let limit = Number(q.limit);
      let offset = (page - 1) * limit;
      limitQuery = query + "limit $2 offset $3";
      values.push(taskId, limit, offset);
    } else {
      limitQuery = query;
      values.push(taskId);
    }

    db.query(query, [taskId], (error, result) => {
      if (result.rows.length < 1) {
        return reject({
          data: result.rows,
          statusCode: 404,
          msg: "Not Found",
        });
      }
      if (error) {
        return reject(error);
      }
      db.query(limitQuery, values, (error, queryResult) => {
        if (queryResult.rows.length < 1) {
          return reject({
            data: result.rows,
            statusCode: 404,
            msg: "Not Found",
          });
        }
        if (error) {
          return reject(error);
        }
        let nextResponse = null;
        let previousResponse = null;

        if (q.page && q.limit) {
          let page = parseInt(q.page);
          let limit = parseInt(q.limit);
          let start = (page - 1) * limit;
          let end = page * limit;
          let next = "";
          let previous = "";

          const nextData = Math.ceil(result.rowCount / limit);
          if (start <= result.rowCount) {
            next = page + 1;
          }
          if (end > 0) {
            previous = page - 1;
          }
          if (parseInt(next) <= parseInt(nextData)) {
            nextResponse =
              `${link}` + "page=" + `${next}` + "&" + "limit=" + `${limit}`;
          }
          if (parseInt(previous) !== 0) {
            previousResponse =
              `${link}` + "page=" + `${previous}` + "&" + "limit=" + `${limit}`;
          }
          let sendResponse = {
            totalData: result.rowCount,
            next: nextResponse,
            previous: previousResponse,
            totalPages: Math.ceil(result.rowCount / limit),
            data: queryResult.rows,
            msg: "Get data success",
          };
          return resolve(sendResponse);
        }
        let sendResponse = {
          totalData: result.rowCount,
          next: nextResponse,
          previous: previousResponse,
          totalPages: null,
          data: queryResult.rows,
          msg: "Get data success",
        };
        return resolve(sendResponse);
      });
    });
  });
};

module.exports = {
  createSubtask,
  deleteSubtask,
  editSubtask,
  getSubtasks,
  getSubtask,
};
