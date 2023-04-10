const db = require("../configs/postgre");

const updateProfile = (payload, body) => {
  return new Promise((resolve, reject) => {
    const { user_id } = payload;
    let { firstname, lastname, gender_id } = body;

    const getExistProfileQuery =
      "select firstname, lastname, gender_id from users where id = $1";

    db.query(getExistProfileQuery, [user_id], (error, resultProfile) => {
      if (error) {
        return reject(error);
      }
      if (firstname.length === 0) {
        firstname = resultProfile.rows[0].firstname;
      }
      if (lastname.length === 0) {
        lastname = resultProfile.rows[0].lastname;
      }
      if (gender_id.length === 0) {
        gender_id = resultProfile.rows[0].gender_id;
      }

      const query =
        "update users set firstname = $2, lastname = $3, gender_id = $4, updated_at = $5 where id = $1 returning firstname, lastname, gender_id";

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
  });
};

const uploadImageProfile = (payload, file, body) => {
  // console.log(file);
  const { user_id } = payload;

  let { image } = body;

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

const updateNoTelp = (payload, body) => {
  const { notelp } = body;
  const { user_id } = payload;
  return new Promise((resolve, reject) => {
    const query =
      "update users set notelp = $2, updated_at = $3 where id = $1 returning notelp";

    db.query(query, [user_id, notelp, new Date()], (error, result) => {
      console.log("Result:", result);
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getNoTelp = (body) => {
  const { notelp } = body;
  return new Promise((resolve, reject) => {
    const query = "select notelp from users where notelp = $1";

    db.query(query, [notelp], (error, result) => {
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

module.exports = {
  updateProfile,
  uploadImageProfile,
  getProfile,
  getNoTelp,
  updateNoTelp,
};
