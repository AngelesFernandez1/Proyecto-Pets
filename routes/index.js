var express = require('express');
var router = express.Router();
const indexControllers = require('../controllers/indexControllers');


router.get('/', indexControllers.showHome);

module.exports = router;
