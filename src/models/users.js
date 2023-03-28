const db = require("../configs/postgre");

const updateProfile = (payload, body) => {
  const { user_id } = payload;
  const { firstname, lastname, gender_id } = body;

  return new Promise((resolve, reject) => {
    const query =
      "update users set firstname = $2, lastname = $3, gender_id = $4, updated_at = $5 where id = $1 returning *";
    db.query(
      query,
      [user_id, firstname, lastname, gender_id, new Date()],
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

  console.log("Image:", image);

  // Set key as image.
  image = file.secure_url;

  // Get url start from image/upload.
  const sliceUrlImage = image.slice(image.indexOf("image"));

  return new Promise((resolve, reject) => {
    const query =
      "update users set image = $2, updated_at = $3 where id = $1 returning image";

    db.query(query, [user_id, sliceUrlImage, new Date()], (error, result) => {
      // console.log(result);
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
    const query =
      "select u.email, u.firstname, u.lastname, g.name as gender, u.image, r.name as role, u.created_at, u.updated_at, u.last_login, u.key_change_password from users u join roles r on u.role_id =r.id join genders g on u.gender_id = g.id where u.id = $1";
    db.query(query, [user_id], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

module.exports = { updateProfile, uploadImageProfile, getProfile };
