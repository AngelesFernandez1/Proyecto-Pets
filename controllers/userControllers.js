const connection = require("../config/db");
const bcrypt = require("bcrypt");
const deleteFile = require("../utils/deleteFile");

class UserControllers {
  showRegister = (req, res) => {
    res.render("formRegister");
  };

  register = (req, res) => {
    const {
      user_name,
      user_lastname,
      email,
      password,
      repPassword,
      phone_number,
      description,
    } = req.body;

    if (
      !user_name ||
      !user_lastname ||
      !email ||
      !password ||
      !repPassword ||
      !phone_number ||
      !description
    ) {
      res.render("formRegister", {
        message: "Todos los campos deben estar cumplimentados",
      });
    } else if (password == repPassword) {
      bcrypt.hash(password, 10, (errHash, hash) => {
        if (errHash) {
          throw errHash;
        } else {
          let sql =
            "INSERT INTO user (user_name,user_lastname, email, password, phone_number,description) VALUES (?,?,?,?,?,?)";
          let values = [
            user_name,
            user_lastname,
            email,
            hash,
            phone_number,
            description,
          ];

          if (req.file) {
            sql =
              "INSERT INTO user (user_name,user_lastname, email, password, phone_number,description, user_image) VALUES (?,?,?,?,?,?,?)";
            values.push(req.file.filename);
          }

          connection.query(sql, values, (err, result) => {
            if (err) {
              if (err.errno == 1062) {
                res.render("formRegister", { message: "El email ya existe" });
              } else {
                throw err;
              }
            } else {
              res.redirect("/users/login");
            }
          });
        }
      });
    } else {
      res.render("formRegister", { message: "Las contraseñas no coinciden" });
    }
  };

  showLogin = (req, res) => {
    res.render("login");
  };

  login = (req, res) => {
    const { email, password } = req.body;

    let sql = "SELECT * FROM user WHERE email = ? AND user_is_deleted = 0";

    connection.query(sql, [email], (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log("**************",result);
        
        if (!result.length) {
          res.render("login", { message: "Credenciales incorrectas" });
        } else {
          let hash = result[0].password;
          bcrypt.compare(password,hash, (err, resultCompare)=>{
            if(!resultCompare){
              res.render('login', {message: "credenciales incorrectas"})
            }else{
              res.redirect(`/users/oneUser/${result[0].user_id}`);
            }
          });
        }
      }
    });
  };

  
  showOneUser = (req, res) => {
    const { user_id } = req.params;
    let sqlUser =
      "SELECT * FROM user WHERE user_id = ? AND user_is_deleted = 0";
    let sqlPet = "SELECT * FROM pet WHERE user_id = ? AND pet_is_deleted = 0";

    connection.query(sqlUser, [user_id], (errUser, resultUser) => {
      if (errUser) {
        throw errUser;
      } else {
        if (resultUser.length == 0) {
          next();
        } else {
          connection.query(sqlPet, [user_id], (errPet, resultPet) => {
            if (errPet) {
              throw errPet;
            } else {
              res.render("oneUser", { resultUser: resultUser[0], resultPet });
            }
          });
        }
      }
    });
  };

  showEditUser = (req, res) => {
    const { user_id } = req.params;
    let sql = "SELECT * FROM user WHERE user_id = ? AND user_is_deleted = 0";
    connection.query(sql, [user_id], (err, result) => {
      if (err) {
        throw err;
      } else {
        if (!result.length) {
          next();
        } else {
          res.render("editUser", { result: result[0] });
        }
      }
    });
  };

  editUser = (req, res) => {
    const { user_id, user_image } = req.params;
    const { user_name, user_lastname, phone_number, description } = req.body;

    if (!user_name || !user_lastname || !phone_number || !description) {
      let result = {
        user_id: user_id,
        user_name: user_name,
        user_lastname: user_lastname,
        phone_number: phone_number,
        description: description,
      };
      res.render("editUser", {
        result,
        message: "Todos los campos deben estar cumplimentados",
      });
    } else {
      let sql =
        "UPDATE user SET user_name = ?, user_lastname = ?, phone_number = ?, description = ? WHERE user_id = ?";
      let values = [
        user_name,
        user_lastname,
        phone_number,
        description,
        user_id,
      ];
      if (req.file) {
        sql =
          "UPDATE user SET user_name = ?, user_lastname = ?, phone_number = ?, description = ?, user_image = ? WHERE user_id = ?";
        values = [
          user_name,
          user_lastname,
          phone_number,
          description,
          req.file.filename,
          user_id,
        ];
      }
      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        } else {
          if (req.file) {
            if (user_image != "null") {
              deleteFile(user_image, "users");
            }
          }
          res.redirect(`/users/oneUser/${user_id}`);
        }
      });
    }
  };

  deleteUser = (req, res) => {
    const { user_id } = req.params;
    let sql = `UPDATE user LEFT JOIN pet
              ON user.user_id = pet.user_id
              SET
              user_is_deleted = 1, pet_is_deleted = 1
              WHERE user.user_id = ?`;
    connection.query(sql, [user_id], (err, result) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/");
      }
    });
  };
}

module.exports = new UserControllers();
