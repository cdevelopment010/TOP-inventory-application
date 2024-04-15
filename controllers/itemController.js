const Item = require('../models/item');
const asyncHandler = require('express-async-handler');

//Display list of items in Item
exports.item_list = asyncHandler(async (req, res, next) => {
    const items = await Item.find().populate("category").sort({name: 1}).exec();

    res.render("item_list", {
        title: "Items",
        items: items,
    })

})

//Display detail page of a Item GET
exports.item_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Item detail ${req.params.id}`)
})

//Display form for creating a Item GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Create Item GET")
})

//Handle creating a Item POST
exports.item_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Create Item POST")
})


//Display Item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Delete Item GET")
})

//Handle delete Item POST
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Delete Item POST")
})

//Display Item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Delete Item GET")
})

//Handle update Item POST
exports.item_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Update Item POST")
})