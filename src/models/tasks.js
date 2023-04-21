const db = require("../configs/postgre");

const createTasks = (user_id, body) => {
  const { title, description, created_at } = body;

  return new Promise((resolve, reject) => {
    const query =
      "insert into tasks (user_id, status_id, title, description, created_at) values ($1, $2, $3, $4, $5)";

    const values = [user_id, "1", title, description, created_at];

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
      if (error) {
        return reject(error);
      }
      return resolve(result);
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

const getTasks = (payload, params) => {
  const { user_id } = payload;
  return new Promise((resolve, reject) => {
    let query;
    let expression;
    let condition;

    query =
      "select t.id, t.user_id, s.name as status, t.title, t.description, t.created_at, t.updated_at from tasks t join status s on t.status_id = s.id where t.user_id = $1 ";

    let link = "/tasks?";

    switch (params.sort || params.status) {
      // Sort
      case "a-z":
        expression = "order by t.title asc ";
        query += expression;
        link += "sort=" + `${params.sort}` + "&";
        break;
      case "z-a":
        expression = "order by t.title desc ";
        query += expression;
        link += "sort=" + `${params.sort}` + "&";
        break;
      case "old":
        expression = "order by t.created_at asc ";
        query += expression;
        link += "sort=" + `${params.sort}` + "&";
        break;
      case "new":
        expression = "order by t.created_at desc ";
        query += expression;
        link += "sort=" + `${params.sort}` + "&";
        break;
      case "updated":
        expression = "order by t.created_at desc ";
        query += expression;
        link += "sort=" + `${params.sort}` + "&";
        break;
      // Status
      case `${params.status}`:
        query += "and s.name = " + `'${params.status}'`;
        link += "status=" + `${params.status}` + "&";
        break;
      // Sort & Status
      case params.status === "ongoing" && params.sort === "old":
        condition = "and s.name = 'ongoing' ";
        expression = "order by t.created_at asc ";
        query += condition + expression;
        link +=
          "status=" + `${params.status}` + "sort=" + `${params.sort}` + "&";
        break;
      case params.status === "ongoing" && params.sort === "a-z":
        condition = "and s.name = 'ongoing' ";
        expression = "order by t.title asc ";
        query += condition + expression;
        link +=
          "status=" + `${params.status}` + "sort=" + `${params.sort}` + "&";
        break;
      case params.status === "ongoing" && params.sort === "new":
        condition = "and s.name = 'ongoing' ";
        expression = "order by t.created_at desc ";
        link +=
          "status=" + `${params.status}` + "sort=" + `${params.sort}` + "&";
        break;
      case params.status === "ongoing" && params.sort === "updated":
        condition = "and s.name = 'ongoing' ";
        expression = "order by t.updated_at desc ";
        link +=
          "status=" + `${params.status}` + "sort=" + `${params.sort}` + "&";
      default:
        query;
    }

    let limitQuery = "";
    let values = [];

    if (params.page && params.limit) {
      let page = Number(params.page);
      let limit = Number(params.limit);
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

        if (params.page && params.limit) {
          let page = parseInt(params.page);
          let limit = parseInt(params.limit);
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
