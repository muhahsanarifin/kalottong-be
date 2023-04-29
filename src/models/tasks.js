const db = require("../configs/postgre");

const createTasks = (payload, body) => {
  const { user_id } = payload;
  const { title, description, created_at } = body;

  return new Promise((resolve, reject) => {
    const query =
      "insert into tasks (user_id, status_id, title, description, created_at) values ($1, $2, $3, $4, $5)";

    const values = [user_id, "1", title, description, created_at];

    db.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      }
      return resolve(result);
    });
  });
};

const editTask = (payload, params, body) => {
  return new Promise((resolve, reject) => {
    const { user_id } = payload;
    const { id } = params;
    let { title, description, status_id, updated_at } = body;

    const getExistTaskQuery =
      "select t.id, t.user_id, t.status_id, t.title, t.description, t.created_at, t.updated_at from tasks t where t.user_id = $1 and t.id = $2 ";

    db.query(getExistTaskQuery, [user_id, id], (error, taskResult) => {
      if (error) {
        return reject(error);
      }

      if (title.length === 0) {
        title = taskResult.rows[0].title;
      }

      if (description.length === 0) {
        description = taskResult.rows[0].description;
      }

      if (status_id.length === 0) {
        status_id = taskResult.rows[0].status_id;
      }

      if (updated_at.length === 0) {
        updated_at = new Date();
      }

      const query =
        "update tasks set title = $2, description = $3, status_id = $4, updated_at = $5 where id = $1 returning *";

      db.query(
        query,
        [id, title, description, status_id, updated_at],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  });
};

const deleteTask = (params) => {
  const { id } = params;
  return new Promise((resolve, reject) => {
    const query = "delete from tasks where id = $1 returning *";
    db.query(query, [id], (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
      // console.log("Result: ", result);
    });
  });
};

const getTasks = (payload, q) => {
  const { user_id } = payload;
  return new Promise((resolve, reject) => {
    let query,
      expression,
      condition,
      link = "?";

    query =
      "select t.id, t.user_id, s.name as status, t.title, t.description, t.created_at, t.updated_at from tasks t join status s on t.status_id = s.id where t.user_id = $1 ";

    switch (q.sort || q.status) {
      // Sort
      case "a-z":
        expression = "order by t.title asc ";
        query += expression;
        link += "sort=" + `${q.sort}` + "&";
        break;
      case "z-a":
        expression = "order by t.title desc ";
        query += expression;
        link += "sort=" + `${q.sort}` + "&";
        break;
      case "old":
        expression = "order by t.created_at asc ";
        query += expression;
        link += "sort=" + `${q.sort}` + "&";
        break;
      case "new":
        expression = "order by t.created_at desc ";
        query += expression;
        link += "sort=" + `${q.sort}` + "&";
        break;
      case "updated":
        expression = "order by t.created_at desc ";
        query += expression;
        link += "sort=" + `${q.sort}` + "&";
        break;
      // Status
      case `${q.status}`:
        query += "and s.name = " + `'${q.status}'`;
        link += "status=" + `${q.status}` + "&";
        break;
      // Sort & Status
      case q.status === "ongoing" && q.sort === "old":
        condition = "and s.name = 'ongoing' ";
        expression = "order by t.created_at asc ";
        query += condition + expression;
        link += "status=" + `${q.status}` + "sort=" + `${q.sort}` + "&";
        break;
      case q.status === "ongoing" && q.sort === "a-z":
        condition = "and s.name = 'ongoing' ";
        expression = "order by t.title asc ";
        query += condition + expression;
        link += "status=" + `${q.status}` + "sort=" + `${q.sort}` + "&";
        break;
      case q.status === "ongoing" && q.sort === "new":
        condition = "and s.name = 'ongoing' ";
        expression = "order by t.created_at desc ";
        link += "status=" + `${q.status}` + "sort=" + `${q.sort}` + "&";
        break;
      case q.status === "ongoing" && q.sort === "updated":
        condition = "and s.name = 'ongoing' ";
        expression = "order by t.updated_at desc ";
        link += "status=" + `${q.status}` + "sort=" + `${q.sort}` + "&";
      default:
        query;
    }

    let limitQuery = "";
    let values = [];

    if (q.page && q.limit) {
      let page = Number(q.page);
      let limit = Number(q.limit);
      let offset = (page - 1) * limit;
      limitQuery += query + "limit $2 offset $3";
      values.push(user_id, limit, offset);
    } else {
      limitQuery = query;
      values.push(user_id);
    }

    db.query(query, [user_id], (error, result) => {
      // console.log("Query:", query);
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
        // console.log("limit Query:", limitQuery);
        if (result.rows.length < 1) {
          return reject({
            data: queryResult.rows,
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

module.exports = { createTasks, editTask, deleteTask, getTasks };
