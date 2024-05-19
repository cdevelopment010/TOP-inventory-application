const express = require("express");
const router = express.Router();

const species_controller = require('../controllers/speciesController');
const pet_controller = require("../controllers/petController");

//GET Homepage
router.get("/", species_controller.index);


/// species ROUTES ///
// species list
router.get("/specieslist", species_controller.species_list);

//GET for creating species
router.get("/species/create",species_controller.species_create_get);
//POST for creating species
router.post("/species/create", species_controller.species_create_post);

//GET for deleting species
router.get("/species/:id/delete", species_controller.species_delete_get);
//POST for deleting species
router.post("/species/:id/delete", species_controller.species_delete_post);

//GET for updating species
router.get("/species/:id/update", species_controller.species_update_get);
//POST for updating species
router.post("/species/:id/update", species_controller.species_update_post);

//GET for species detail
router.get("/species/:id", species_controller.species_detail);



/// pet ROUTES ///

//GET list of pets
router.get("/pets", pet_controller.pet_list);

//GET for creating pet
router.get("/pet/create", pet_controller.pet_create_get);
//POST for creating pet
router.post("/pet/create", pet_controller.pet_create_post);

//GET for deleting pet
router.get("/pet/:id/delete", pet_controller.pet_delete_get);
//POST for deleting pet
router.post("/pet/:id/delete", pet_controller.pet_delete_post);

//GET for updating pet
router.get("/pet/:id/update", pet_controller.pet_update_get);
//POST for updating pet
router.post("/pet/:id/update", pet_controller.pet_update_post);

//GET for pet detail
router.get("/pet/:id", pet_controller.pet_detail);

module.exports = router;