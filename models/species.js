const mongoose = require("mongoose"); 

const Schema = mongoose.Schema; 

const SpeciesSchema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 100},
    classification: { type: String, required: true, minLength: 3, maxLength: 100},
})

//Virtual for URL
SpeciesSchema.virtual("url").get(function() {
    return `/catalog/species/${this._id}`;
})

module.exports = mongoose.model("Species", SpeciesSchema);