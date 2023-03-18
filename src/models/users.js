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

const uploadImageProfile = (payload, file, body) => {
  // console.log(file);
  const { user_id } = payload;
  let { image } = body;

  image = file.secure_url;

  return new Promise((resolve, reject) => {
    const query =
      "update users set image = $2, updated_at = $3 where id = $1 returning image";

    db.query(query, [user_id, image, new Date()], (error, result) => {
      console.log(result);
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getProfile = (payload) => {
  const { user_id } = payload;
  return new Promise((resolve, reject) => {
    const query = "select * from users where id = $1";
    db.query(query, [user_id], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

module.exports = { updateProfile, uploadImageProfile, getProfile };
