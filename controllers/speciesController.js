const Species = require('../models/species');
const Pet = require('../models/pets');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");


exports.index = asyncHandler(async (req, res, next) => {
    //aggregate returns raw data from MongoDB and virtuals aren't applied
    const rawPets = await Pet.aggregate([
        { $sample: { size: 5 } }
    ]);

    const petIds = rawPets.map(doc => doc._id)
    const popularPets = await Pet.find({ _id: { $in: petIds } });
    const [speciesCount, petCount ] = await Promise.all([
        Species.countDocuments(),
        Pet.countDocuments(),
    ])
    
    res.render("index", {
        title: "TOP - Inventory Application", 
        popularPets: popularPets,
        speciesCount: speciesCount,
        petCount: petCount,
    })
})

exports.species_list = asyncHandler(async (req, res, next) => {
    const species = await Species.find().exec();

    res.render("species_list", {
        title: "Species",
        species: species
    })
})

//Display detail page of a species GET
exports.species_detail = asyncHandler(async (req, res, next) => {
    const species = await Species.findById(req.params.id).exec(); 
    if (species == null){
        //unable to find species. 
        // throw error
        const err = new Error("Species not found");
        err.status = 404;
        return next(err);
    }

    res.render("species_detail", {
        title: "Species Detail",
        species: species,
    })
})


//Display form for creating a species GET
exports.species_create_get = asyncHandler(async (req, res, next) => {
    res.render("species_form", {
        title: "Create Species",
        species: undefined
    })
})

//Handle creating a species POST
exports.species_create_post = [
    body("name")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("Species name must be specified"),
    body("classification")
        .trim()
        .isLength({min: 3})
        .escape()
        .withMessage("Species classification must be specified"),
    
    asyncHandler(async (req, res, next) => {
        //Extract the validation errors from a request.
        const errors = validationResult(req);

        const species = new Species({
            name: req.body.name,
            classification: req.body.classification,
        });

        if (!errors.isEmpty()){
            //There are errors. 
            // send data back to form
            res.render("species_form", {
                title: "Create Species",
                species: species,
                errors: errors.array(),
            })
            return;
        } else {
            // data is valid. save and redirect to detail.
            try {
                await species.save();
                res.redirect(species.url);
            } catch (err) {
                console.error(err);
                res.status(500).send("Internal Server Error");
            }
        }

    })
]


//Display species delete form on GET
exports.species_delete_get = asyncHandler(async (req, res, next) => {
    const [species, pets] = await Promise.all([
        Species.findById(req.params.id).exec(),
        Pet.find({ species: req.params.id}).exec(),
    ])

    if (species == null) {
        res.redirect("/catalog/specieslist");
    }

    res.render("species_delete", {
        title: "Delete Species",
        species: species, 
        pets: pets
    })
})

//Handle delete species POST
exports.species_delete_post = asyncHandler(async (req, res, next) => {
    const [species, pets] = await Promise.all([
        Species.findById(req.params.id).exec(),
        Pet.find({ species: req.params.id}, "name description").exec(),
    ])

    if (pets.length > 0){
        //species has Pet. Must delete Pets first
        res.render("species_delete", {
            title: "Delete Species",
            species: species, 
            pets: pets
        });
        return;
    } else {
        await Species.findByIdAndDelete(req.body.species_id); 
        res.redirect("/catalog/specieslist");
    }
})

//Display species update form on GET
exports.species_update_get = asyncHandler(async (req, res, next) => {
    const species = await Species.findById(req.params.id); 

    res.render("species_form", {
        title: "Update species",
        species: species,
    })
})

//Handle update species POST
exports.species_update_post = [
    body("name")
        .trim()
        .isLength({ min: 1})
        .escape()
        .withMessage("species name must be specified"),
    body("classification")
        .trim()
        .isLength({min: 3})
        .escape()
        .withMessage("Species classification must be specified"),
    
    asyncHandler(async (req, res, next) => {
        //Extract the validation errors from a request.
        const errors = validationResult(req);

        const species = new species({
            name: req.body.name,
            classification: req.body.classification,
            _id: req.params.id
        });

        if (!errors.isEmpty()){
            res.render("species_form", {
                title: "Update species",
                species: species,
                errors: errors.array(),
            })
            return;

        } else {
            // Data OK
            const updatedspecies = await species.findByIdAndUpdate(req.params.id, species, {});
            res.redirect(updatedspecies.url);
        }
    })
]