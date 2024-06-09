const { validationResult, body } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Pet = require('../models/pets');
const Species = require('../models/species');

const multer = require('multer');
const species = require('../models/species');

const storage = multer.memoryStorage(); 
const upload = multer({storage}); 
const cloudinary = require('cloudinary').v2; 
//Set up cloudinary for images
cloudinary.config({
    secure: true
})

//Display list of pets in pet
exports.pet_list = asyncHandler(async (req, res, next) => {
    const filterOptions = req.body; 
    
    if (filterOptions.species == "") {
        delete filterOptions.species; 
    }
    
    console.log(filterOptions);
    
    const [pets, species] = await Promise.all([
        Pet.find(filterOptions).populate("species").sort({name: 1}).exec(),
        Species.find().sort({name: 1}).exec(),
    ]) 

    res.render("pet_list", {
        title: "Pets",
        pets: pets,
        species: species,
        filterOptions: filterOptions,
    })

})

//Display detail page of a pet GET
exports.pet_detail = asyncHandler(async (req, res, next) => {
    const pet = await Pet.findById(req.params.id).populate("species").exec(); 

    if (pet == null){
        const err = new Error("Pet not found");
        err.status = 404; 
        return next(err);
    }

    res.render("pet_detail",{
        title: "Pet Detail",
        pet: pet,
    })
})

//Display form for creating a pet GET
exports.pet_create_get = asyncHandler(async (req, res, next) => {
    const allSpecies = await Species.find().sort({name: 1}).exec();
    res.render("pet_form", {
        title: "Create Pet",
        species: allSpecies,
        pet: undefined
    })
})

//Handle creating a pet POST
exports.pet_create_post = [
    upload.single("pet_image"),


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
    ,body("species","Species must be specified")
        .trim()
        .isLength({ min: 1})
        .escape()

    , asyncHandler(async (req, res, next) => {
        const errors = validationResult(req); 
        const allSpecies = await Species.find().sort({name: 1}).exec();
        const pet = new Pet({
            name: req.body.name,
            description: req.body.description,
            species: req.body.species, 
            dob: req.body.dob,
            gender: req.body.gender,
            num_of_legs: req.body.num_of_legs,
            color: req.body.color,
        })

        if (!errors.isEmpty()){
            //errors with form. Resubmit with errors
            res.render("pet_form", {
                title: "Create Pet",
                pet: pet,
                species: allSpecies,
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
                pet.imageurl = { url, publicId: public_id }
            }
            await pet.save(); 
            res.redirect(pet.url); 
        }
    })
]


//Display pet delete form on GET
exports.pet_delete_get = asyncHandler(async (req, res, next) => {
    const [pet] = await Promise.all([
        Pet.findById(req.params.id).populate("species").exec(),
    ])

    if (pet == null){
        res.redirect("/catalog/pets");
    }

    res.render("pet_delete", {
        title: "Delete Pet",
        pet: pet
    })
})

//Handle delete pet POST
exports.pet_delete_post = asyncHandler(async (req, res, next) => {
    const [pet] = await Promise.all([
        Pet.findById(req.params.id).populate("species").exec()
    ])

    //delete image from cloudinary
    cloudinary.uploader.destroy(pet.imageurl.publicId)
    await Pet.findByIdAndDelete(req.body.pet_id); 
    res.redirect("/catalog/pets");   
})

//Display pet update form on GET
exports.pet_update_get = asyncHandler(async (req, res, next) => {
    const [pet, allSpecies] = await Promise.all([
        Pet.findById(req.params.id).exec(),
        Species.find().sort({name: 1}).exec()
    ])

    if (pet === null){
        // No results.
        const err = new Error("pet not found");
        err.status = 404;
        return next(err);
    }

    res.render("pet_form", {
        title: "Update Pet",
        pet: pet,
        species: allSpecies,
    })
})

//Handle update pet POST
exports.pet_update_post = [
    upload.single("pet_image"),
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
    ,body("species")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Species must be specified")


    , asyncHandler(async (req, res, next) => {
        const errors = validationResult(req); 
        const currentImage = await Pet.findById(req.params.id, "imageurl").exec(); 

        const pet = new Pet({
            name: req.body.name,
            description: req.body.description,
            species: req.body.species, 
            dob: req.body.dob,
            gender: req.body.gender,
            num_of_legs: req.body.num_of_legs,
            color: req.body.color,
            imageurl: currentImage?.imageurl,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            //return form with errors
            const allSpecies = await Species.find().sort({name: 1}).exec();
            res.render("pet_form", {
                title: "Update Pet",
                pet: pet,
                species: allSpecies,
                errors: errors.array()
            })
            return;
        } else {
            if (req.body.clear_image) {
                pet.imageurl = {url: '', publicId: ''}
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
                pet.imageurl = { url, publicId: public_id }

            }

            const updatedpet = await Pet.findByIdAndUpdate(req.params.id, pet, {});
            res.redirect(updatedpet.url);
        }

    })
]