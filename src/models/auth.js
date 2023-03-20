const bcrypt = require("bcrypt");
const db = require("../configs/postgre");
const jwt = require("jsonwebtoken");
// const { DateTime } = require("luxon");
// const date = require("../helpers/date");

const register = (body) => {
  return new Promise((resolve, reject) => {
    const { email, password, gender_id } = body;
    bcrypt.hash(password, 10, (error, hashPassword) => {
      if (error) {
        return reject(error);
      }

      const query =
        "insert into users (email, password, role_id, gender_id, created_at) values ($1, $2, $3, $4, $5) returning email";

      const values = [email, hashPassword, "3", gender_id, new Date()];

      db.query(query, values, (error, result) => {
        if (error) {
          return reject(error);
        }

        // console.log("Result:", result);
        return resolve(result);
      });
    });
  });
};

const getEmail = (body) => {
  return new Promise((resolve, reject) => {
    const { email } = body;
    const query =
      "select u.id, u.email, u.password, u.firstname, u.lastname, g.name as gender , u.image, r.name as role, u.created_at, u.updated_at, u.last_login, u.key_change_password from users u join roles r on u.role_id  = r.id join genders g on u.gender_id = g.id where u.email = $1";

    db.query(query, [email], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = "select * from tokens where name = $1";
    db.query(query, [token], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const login = (result, body) => {
  return new Promise((resolve, reject) => {
    const { id, first_name, last_name, password, role } = result;

    bcrypt.compare(body.password, password, (error, same) => {
      if (error) {
        return reject({ error });
      }
      if (!same) {
        return reject({
          error: new Error("Email/Password is wrong"),
          statusCode: 401,
        });
      }

      const payload = {
        user_id: id,
        first_name: first_name,
        last_name: last_name,
        role: role,
      };

      const jwtOption = {
        expiresIn: "24h",
        issuer: process.env.ISSUER,
      };

      jwt.sign(payload, process.env.SECRET_KEY, jwtOption, (error, token) => {
        if (error) {
          return reject(error);
        }

        const query =
          "insert into tokens (user_id, name, created_at) values ($1, $2, $3) returning user_id";

        db.query(query, [id, token, new Date()], (error, result) => {
          if (error) {
            return reject(error);
          }
          // console.log("Result:", result);
          return resolve({
            user_id: result.rows[0].user_id,
            first_name: payload.first_name,
            last_name: payload.last_name,
            role: payload.role,
            token,
          });
        });
      });
    });
  });
};

const logout = (token) => {
  return new Promise((resolve, reject) => {
    const query = "delete from tokens where name = $1";
    db.query(query, [token], (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};

const lastLogin = (payload) => {
  const { user_id } = payload;
  return new Promise((resolve, reject) => {
    const query =
      "update users set updated_at = $2, last_login = $3 where id = $1";

    db.query(query, [user_id, new Date(), new Date()], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getRoles = () => {
  return new Promise((resolve, reject) => {
    const query = "select * from roles";
    db.query(query, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

module.exports = {
  register,
  getEmail,
  login,
  logout,
  getToken,
  lastLogin,
  getRoles,
};
