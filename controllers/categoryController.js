const Category = require('../models/category');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
    // res.send("NOT IMPLEMENTED: Homepage");
    res.render("index", {
        title: "TOP - Inventory Application"
    })
})

exports.cateogry_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category List")
})

//Display detail page of a category GET
exports.category_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Category detail ${req.params.id}`)
})

//Display form for creating a category GET
exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Create Category GET")
})

//Handle creating a category POST
exports.category_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Create Category POST")
})


//Display category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Delete Category GET")
})

//Handle delete category POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Delete Category POST")
})

//Display category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Delete Category GET")
})

//Handle update category POST
exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Update Category POST")
})