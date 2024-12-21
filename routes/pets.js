var express = require('express');
var router = express.Router();
const petControllers = require('../controllers/petControllers');
const multer = require('../middlewares/multer');

router.get('/', petControllers.showAllPets);

router.get('/addPet', petControllers.showFormAddPet);
router.post('/registerPet',multer('pets'),petControllers.registerPet);

router.get('/editPet/:pet_id', petControllers.showFormEditPet);
router.post('/editPet/:pet_id/:pet_image',multer('pets'), petControllers.editPet);

router.get('/deletedPet/:pet_id', petControllers.deletedPet);

router.get('/onePet/:pet_id', petControllers.showOnePet);

router.post('/onePet/addPost/:pet_id', multer("post"), petControllers.addPost);

router.post('/onePet/addComment/:pet_id', petControllers.addComment);

router.get('/gallery', petControllers.showGallery);

module.exports = router;