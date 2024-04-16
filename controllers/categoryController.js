const Category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");


exports.index = asyncHandler(async (req, res, next) => {
    // res.send("NOT IMPLEMENTED: Homepage");
    const popularItems = await Item.find().limit(3).exec();

    res.render("index", {
        title: "TOP - Inventory Application", 
        popularItems: popularItems
    })
})

exports.cateogry_list = asyncHandler(async (req, res, next) => {
    const categories = await Category.find().exec();

    res.render("category_list", {
        title: "Categories",
        categories: categories
    })
})

//Display detail page of a category GET
exports.category_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Category detail ${req.params.id}`)
})

//Display form for creating a category GET
exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render("category_form", {
        title: "Create Category"
    })
})

//Handle creating a category POST
exports.category_create_post = [
    body("name")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Category name must be specified"),
    body("description")
        .trim()
        .isLength({min: 3})
        .escape()
        .withMessage("Category description must be specified"),
    
    asyncHandler(async (req, res, next) => {
        //Extract the validation errors from a request.
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
        });

        if (!errors.isEmpty()){
            //There are errors. 
            // send data back to form
            res.render("category_form", {
                title: "Create category",
                category: category,
                errors: errors.array(),
            })
            return;
        } else {
            // data is valid. save and redirect to detail.
            await category.save();
            res.redirect(category.url);
        }

    })
]


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