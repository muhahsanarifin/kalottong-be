const db = require("../configs/postgre");

const updateProfile = (payload, body) => {
  const { user_id } = payload;
  const { firstname, lastname } = body;

  return new Promise((resolve, reject) => {
    const query =
      "update users set firstname = $2, lastname = $3, updated_at = $4 where id = $1 returning *";
    db.query(
      query,
      [user_id, firstname, lastname, new Date()],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

module.exports = { updateProfile };
