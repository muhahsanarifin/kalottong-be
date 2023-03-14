const bcrypt = require("bcrypt");
const db = require("../configs/postgre");
const jwt = require("jsonwebtoken");
// const { DateTime } = require("luxon");
// const date = require("../helpers/date");

const register = (body) => {
  return new Promise((resolve, reject) => {
    const { email, password } = body;
    bcrypt.hash(password, 10, (error, hashPassword) => {
      if (error) {
        return reject(error);
      }

      const query =
        "insert into users (email, password, role_id, created_at) values ($1, $2, $3, $4) returning email";

      const values = [email, hashPassword, "3", new Date()];

      db.query(query, values, (error, result) => {
        if (error) {
          return reject(error);
        }

        console.log("Result:", result);
        return resolve(result);
      });
    });
  });
};

const getEmail = (body) => {
  return new Promise((resolve, reject) => {
    const { email } = body;
    const query = "select * from users where email = $1";

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
    const { id, first_name, last_name, password, role_id } = result;

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
        role_id: role_id,
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
          "insert into tokens (user_id, name, created_at) values ($1, $2, $3) returning id";

        db.query(query, [id, token, new Date()], (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        });

        return resolve({
          first_name: payload.first_name,
          last_name: payload.last_name,
          role_id: payload.role_id,
          token,
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

module.exports = { register, getEmail, login, logout, getToken };
