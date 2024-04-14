const ItemInstance = require('../models/item');
const asyncHandler = require('express-async-handler');

//Display list of Item instances
exports.iteminstance_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item Instances List")
})

//Display detail page of a Item GET
exports.iteminstance_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Item Instance detail ${req.params.id}`)
})

//Display form for creating a Item GET
exports.iteminstance_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Create Item Instance GET")
})

//Handle creating a Item POST
exports.iteminstance_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Create Item Instance POST")
})


//Display Item delete form on GET
exports.iteminstance_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Delete Item Instance GET")
})

//Handle delete Item POST
exports.iteminstance_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Delete Item Instance POST")
})

//Display Item update form on GET
exports.iteminstance_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Delete Item Instance GET")
})

//Handle update Item POST
exports.iteminstance_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Update Item Instance POST")
})