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
    const category = await Category.findById(req.params.id).exec(); 
    if (category == null){
        //unable to find category. 
        // throw error
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_detail", {
        title: "Category Detail",
        category: category,
    })
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
            try {
                await category.save();
                res.redirect(category.url);
            } catch (err) {
                console.error(err);
                res.status(500).send("Internal Server Error");
            }
        }

    })
]


//Display category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const [category, categoryItems] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id}, "name description").exec(),
    ])

    if (category == null) {
        res.redirect("/catalog/categories");
    }

    res.render("category_delete", {
        title: "Delete Category",
        category: category, 
        category_items: categoryItems
    })
})

//Handle delete category POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    const [category, categoryItems] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id}, "name description").exec(),
    ])

    if (categoryItems.length > 0){
        //category has item. Must delete items first
        res.render("category_delete", {
            title: "Delete Category",
            category: category, 
            category_items: categoryItems
        });
        return;
    } else {
        await Category.findByIdAndDelete(req.body.category_id); 
        res.redirect("/catalog/categories");
    }
})

//Display category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id); 

    res.render("category_form", {
        title: "Update Category",
        category: category,
    })
})

//Handle update category POST
exports.category_update_post = [
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
            _id: req.params.id
        });

        if (!errors.isEmpty()){
            res.render("category_form", {
                title: "Update Category",
                category: category,
                errors: errors.array(),
            })
            return;

        } else {
            // Data OK
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
            res.redirect(updatedCategory.url);
        }
    })
]