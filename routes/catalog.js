const express = require("express");
const router = express.Router();

const category_controller = require('../controllers/categoryController');
const item_controller = require("../controllers/itemController");
const iteminstance_controller = require("../controllers/iteminstanceController");

//GET Homepage
router.get("/", category_controller.index);


/// CATEGORY ROUTES ///
// category list
router.get("/categories", category_controller.cateogry_list);

//GET for creating category
router.get("/category/create",category_controller.category_create_get);
//POST for creating category
router.post("/category/create", category_controller.category_create_post);

//GET for deleting category
router.get("/category/:id/delete", category_controller.category_delete_get);
//POST for deleting category
router.post("/category/:id/delete", category_controller.category_delete_post);

//GET for updating category
router.get("/category/:id/update", category_controller.category_update_get);
//POST for updating category
router.post("/category/:id/update", category_controller.category_update_post);

//GET for category detail
router.get("/category/:id", category_controller.category_detail);



/// ITEM ROUTES ///

//GET list of items
router.get("/items", item_controller.item_list);

//GET for creating item
router.get("/item/create", item_controller.item_create_get);
//POST for creating item
router.post("/item/create", item_controller.item_create_post);

//GET for deleting item
router.get("/item/:id/delete", item_controller.item_delete_get);
//POST for deleting item
router.post("/item/:id/delete", item_controller.item_delete_post);

//GET for updating item
router.get("/item/:id/update", item_controller.item_update_get);
//POST for updating item
router.post("/item/:id/update", item_controller.item_update_post);

//GET for item detail
router.get("/item/:id", item_controller.item_detail);

/// ITEM INSTANCE ROUTES ///

//GET list of item instances
router.get("/iteminstances", iteminstance_controller.iteminstance_list);

//GET for creating item
router.get("/iteminstance/create", iteminstance_controller.iteminstance_create_get);
//POST for creating item
router.post("/iteminstance/create", iteminstance_controller.iteminstance_create_post);

//GET for deleting item
router.get("/iteminstance/:id/delete", iteminstance_controller.iteminstance_delete_get);
//POST for deleting item
router.post("/iteminstance/:id/delete", iteminstance_controller.iteminstance_delete_post);

//GET for updating item
router.get("/iteminstance/:id/update", iteminstance_controller.iteminstance_update_get);
//POST for updating item
router.post("/iteminstance/:id/update", iteminstance_controller.iteminstance_update_post);

//GET for item detail
router.get("/iteminstance/:id", iteminstance_controller.iteminstance_detail);

module.exports = router;