const bcrypt = require("bcrypt");
const db = require("../configs/postgre");

const register = (body) => {
  return new Promise((resolve, reject) => {
    const { email, password } = body;
    bcrypt.hash(password, 10, (error, hashPassword) => {
      if (error) {
        console.log(error);
        return reject(error);
      }

      const query =
        "insert into users (email, password, role_id, created_at) values ($1, $2, $3, $4)";

      const values = [email, hashPassword, "3", new Date()];

      db.query(query, values, (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
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
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

module.exports = { register, getEmail };
