var express = require('express');
var router = express.Router();
const userControllers = require('../controllers/userControllers');
const multer = require('../middlewares/multer');


router.get('/register', userControllers.showRegister);
router.post('/register',multer("users"), userControllers.register);

router.get('/login', userControllers.showLogin);
router.post('/login', userControllers.login);

router.get('/oneUser/:user_id', userControllers.showOneUser);

router.get('/editUser/:user_id', userControllers.showEditUser);
router.post('/editUser/:user_id/:user_image',multer("users"), userControllers.editUser);

router.get('/deleteUser/:user_id', userControllers.deleteUser);


module.exports = router;
