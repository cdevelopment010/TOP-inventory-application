const express = require("express");
const router = express.Router();

const category_controller = require('../controllers/categoryController');

//GET Homepage
router.get("/", category_controller.index);

// category list
router.get("/categories", category_controller.cateogry_list);




module.exports = router;