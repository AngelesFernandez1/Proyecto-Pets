const connection = require("../config/db");
const deleteFile = require("../utils/deleteFile");

class PetControllers {
  showAllPets = (req, res) => {
    let sql = "SELECT * FROM pet WHERE pet_is_deleted = 0";
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render("allPets", { result });
      }
    });
  };

  showFormAddPet = (req, res) => {
    let sql = "SELECT user_id, user_name  FROM user WHERE user_is_deleted = 0";
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render("formAddPet", { result });
      }
    });
  };

  registerPet = (req, res) => {
    const { pet_name, description, year_of_adoption, species, user_id } =
      req.body;
    if (
      !pet_name ||
      !description ||
      !year_of_adoption ||
      !species ||
      !user_id
    ) {
      let sql ="SELECT user_id, user_name FROM user WHERE user_is_deleted = 0";
      connection.query(sql, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.render("formAddPet", {result,message: "Necesitas cumplimentar todos los campos"
          });
        }
      });
    } else {
      let sql =
        "INSERT INTO pet (pet_name, description, year_of_adoption,species,user_id) VALUES (?,?,?,?,?)";
      let values = [pet_name, description, year_of_adoption, species, user_id];
      if (req.file) {
        sql =
          "INSERT INTO pet (pet_name, description, year_of_adoption,species,user_id,pet_image) VALUES (?,?,?,?,?,?)";
        values = [
          pet_name,
          description,
          year_of_adoption,
          species,
          user_id,
          req.file.filename,
        ];
      }
      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.redirect(`/users/oneUser/${user_id}`);
        }
      });
    }
  };

  showFormEditPet = (req, res) => {
    const { pet_id } = req.params;
    let sql = "SELECT * FROM pet WHERE pet_id = ? AND pet_is_deleted = 0";
    connection.query(sql, [pet_id], (err, result) => {
      if (err) {
        throw err;
      } else {
        if (!result.length) {
          next();
        } else {
          res.render("formEditPet", { result: result[0] });
        }
      }
    });
  };

  editPet = (req, res) => {
    const { pet_id, pet_image } = req.params;
    const { pet_name, description, year_of_adoption, species } = req.body;

    if (!pet_name || !description || !year_of_adoption || !species) {
      let result = {
        pet_id: pet_id,
        pet_name: pet_name,
        description: description,
        year_of_adoption: year_of_adoption,
        species: species,
      };
      res.render("formEditPet", {
        result,
        message: "Todos los campos deben estar cumplimentados",
      });
    } else {
      let sql =
        "UPDATE pet SET pet_name = ?, description = ?, year_of_adoption = ?, species = ? WHERE pet_id = ?";
      let values = [pet_name, description, year_of_adoption, species, pet_id];
      if (req.file) {
        sql =
          "UPDATE pet SET pet_name = ?, description = ?, year_of_adoption = ?, species = ?, pet_image = ? WHERE pet_id = ?";
        values = [
          pet_name,
          description,
          year_of_adoption,
          species,
          req.file.filename,
          pet_id,
        ];
      }
      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        } else {
          if (req.file) {
            if (pet_image != "null") {
              deleteFile(pet_image, "pets");
            }
          }
          res.redirect(`/pets/onePet/${pet_id}`);
        }
      });
    }
  };

  deletedPet = (req, res) => {
    const {pet_id} = req.params;
    let sqlImages = `select pet.pet_image, GROUP_CONCAT(post.post_image SEPARATOR ',') AS images
    FROM pet 
    LEFT JOIN post 
    ON pet.pet_id = post.pet_id
    WHERE pet.pet_id = ${pet_id}`;
    let sqlDel = "delete from pet where pet_id = ?";
    connection.query(sqlImages, (errImg, resultImg) => {
      if (errImg) {
        throw errImg;
      } else {
        console.log(resultImg);
        let petImg = resultImg[0].pet_image;
        let postImages = [];
        if (resultImg[0].images) {
          postImages = resultImg[0].images.split(",");
        }
        connection.query(sqlDel, [pet_id], (errDel, resultDel) => {
          if (errDel) {
            throw errDel;
          } else {
            if (petImg) {
              deleteFile(petImg, "pets");
            }
            for (const elem of postImages) {
              deleteFile(elem, "post");
            }
            res.redirect("/pets");
          }
        });
      }
    });
  };

  showOnePet = (req, res) => {
    const { pet_id } = req.params;
    let sqlPet = "SELECT * FROM pet WHERE pet_id = ? AND pet_is_deleted = 0";
    let sqlPost = "SELECT * FROM post WHERE pet_id = ? AND post_is_deleted = 0";
    let sqlCom = "SELECT * FROM comment WHERE pet_id = ?";

    connection.query(sqlPet, [pet_id], (errPet, resultPet) => {
      if (errPet) {
        throw errPet;
      } else {
        if (resultPet.length == 0) {
          next();
        } else {
          connection.query(sqlPost, [pet_id], (errPost, resultPost) => {
            if (errPost) {
              throw errPost;
            } else {
              connection.query(sqlCom, [pet_id], (errCom, resultCom) => {
                if (errCom) {
                  throw errCom;
                } else {
                  res.render("onePet", {
                    resultPet: resultPet[0],
                    resultPost,
                    resultCom,
                  });
                }
              });
            }
          });
        }
      }
    });
  };

  addPost = (req, res) => {
    const { pet_id } = req.params;
    const { post_name, post_description } = req.body;

    let sql =
      "INSERT INTO post (post_name, post_description, pet_id) VALUES (?,?,?)";
    let values = [post_name, post_description, pet_id];

    if (req.file) {
      sql =
        "INSERT INTO post (post_name, post_description, pet_id, post_image) VALUES (?,?,?,?)";
      values.push(req.file.filename);
    }
    connection.query(sql, values, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.redirect(`/pets/onePet/${pet_id}`);
      }
    });
  };

  addComment = (req, res) => {
    const { pet_id } = req.params;
    const { comment_name, comment_description } = req.body;

    let sql =
      "INSERT INTO comment (comment_name, comment_description, pet_id) VALUES (?,?,?)";
    let values = [comment_name, comment_description, pet_id];

    connection.query(sql, values, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.redirect(`/pets/onePet/${pet_id}`);
      }
    });
  };

  showGallery = (req, res) => {
    let sql = "SELECT * FROM post WHERE post_is_deleted = 0";

    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render("gallery", { result });
      }
    });
  };
}

module.exports = new PetControllers();
