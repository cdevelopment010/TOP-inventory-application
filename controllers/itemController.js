const { validationResult, body } = require('express-validator');
const Item = require('../models/item');
const ItemInstance = require("../models/itemInstance");
const asyncHandler = require('express-async-handler');
const Category = require('../models/category');

const multer = require('multer');

const storage = multer.memoryStorage(); 
const upload = multer({storage}); 
const cloudinary = require('cloudinary').v2; 
//Set up cloudinary for images
cloudinary.config({
    secure: true
})

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
    const item = await Item.findById(req.params.id).populate("category").exec(); 

    if (item == null){
        const err = new Error("Item not found");
        err.status = 404; 
        return next(err);
    }

    res.render("item_detail",{
        title: "Item Detail",
        item: item,
    })
})

//Display form for creating a Item GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().sort({name: 1}).exec();
    res.render("item_form", {
        title: "Create Item",
        category: allCategories,
        item: undefined
    })
})

//Handle creating a Item POST
exports.item_create_post = [
    upload.single("item_image"),


    body("name")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Name must be specified")
    ,body("description")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Description must be specified")
    ,body("category","Category must be specified")
        .trim()
        .isLength({ min: 1})
        .escape()
    ,body("price")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Price must be specified")
        .isNumeric()
        .withMessage("Price must be numeric")

    , asyncHandler(async (req, res, next) => {
        
        console.log("body create", req.body)
        const errors = validationResult(req); 
        const allCategories = await Category.find().sort({name: 1}).exec();
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category, 
            price: req.body.price,
        })

        if (!errors.isEmpty()){
            //errors with form. Resubmit with errors
            res.render("item_form", {
                title: "Create Item",
                item: item,
                category: allCategories,
                errors: errors.array()
            });
            return;
        } else {
            if (req.file) {
                const cldUpload = await new Promise((res, rej) => {
                    cloudinary.uploader.upload_stream((err, result) => {
                        if (err) { 
                            rej(err)
                        }
                        else {
                            res(result)
                        }
                    })
                    .end(req.file.buffer);
                })
                const { public_id } = cldUpload; 
                const url = cloudinary.url(public_id, {
                    width: 300, 
                    height: 300, 
                    crop: "fill"
                }) 
                item.imageurl = { url, publicId: public_id }
            }
            await item.save(); 
            res.redirect(item.url); 
        }
    })
]


//Display Item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
    const [item, allItemInstances] = await Promise.all([
        Item.findById(req.params.id).populate("category").exec(),
        ItemInstance.find({item: req.params.id}).exec(),
    ])

    if (item == null){
        res.redirect("/catalog/items");
    }

    res.render("item_delete", {
        title: "Delete Item",
        item: item,
        iteminstances: allItemInstances,
    })
})

//Handle delete Item POST
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    const [item, allItemInstances] = await Promise.all([
        Item.findById(req.params.id).populate("category").exec(),
        ItemInstance.find({item: req.params.id}).exec(),
    ])

    if (allItemInstances.length > 0){
        res.render("item_delete", {
            title: "Delete Item",
            item: item,
            iteminstances: allItemInstances,
        })
        return;
    } else {
        //delete image from cloudinary
        cloudinary.uploader.destroy(item.imageurl.publicId)


        await Item.findByIdAndDelete(req.body.item_id); 
        res.redirect("/catalog/items");
    }
})

//Display Item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
    const [item, allCategories] = await Promise.all([
        Item.findById(req.params.id).exec(),
        Category.find().sort({name: 1}).exec()
    ])

    if (item === null){
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    res.render("item_form", {
        title: "Update item",
        item: item,
        category: allCategories,
    })
})

//Handle update Item POST
exports.item_update_post = [
    upload.single("item_image"),
    body("name")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Name must be specified")
    ,body("description")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Description must be specified")
    ,body("category")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Category must be specified")
    ,body("price")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Price must be specified")
        .isNumeric()
        .withMessage("Price must be numeric")

    , asyncHandler(async (req, res, next) => {
        const errors = validationResult(req); 

        const currentImage = await Item.findById(req.params.id, "imageurl").exec(); 

        console.log("currentImage", currentImage?.imageurl)
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category_id, 
            price: req.body.price,
            imageurl: currentImage?.imageurl,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            //return form with errors
            const allCategories = await Category.find().sort({name: 1}).exec();
            res.render("item_form", {
                title: "Update item",
                item: item,
                category: allCategories,
                errors: errors.array()
            })
            return;
        } else {
            if (req.body.clear_image) {
                item.imageurl = {url: '', publicId: ''}
            }
            if (req.file) {
                const publicId = currentImage?.publicId; 
                let uploadOptions = publicId ? 
                    { public_id: publicId, invalidate: true, overwrite: true}
                    : {}
                const cldUpload = await new Promise((res, rej) => {
                    cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
                        if (err) { 
                            rej(err)
                        }
                        else {
                            res(result)
                        }
                    })
                    .end(req.file.buffer);
                })
                let { public_id} = cldUpload; 
                const url = cloudinary.url(public_id, {
                    width: 300, 
                    height: 300, 
                    crop: "fill"
                }) 
                item.imageurl = { url, publicId: public_id }

            }

            const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
            res.redirect(updatedItem.url);
        }

    })
]