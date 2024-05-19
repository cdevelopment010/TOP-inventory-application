const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const PetSchema = new Schema({
    name: {type: String, required: true, minLength: 1},
    description: {type: String, required: true, minLength: 1},
    species: {type: Schema.Types.ObjectId, ref: "Species", required: true},
    imageurl: { url: {type: String, default: ""}, publicId: {type: String, defualt: ""} },
    dob: { type: Date, required: true},
    gender: { type: String, required: true },
    num_of_legs: { type: Number, required: true }, 
    color: { type: String, required: true },

});

//Virtual URL
PetSchema.virtual("url").get(function() {
    return `/catalog/pet/${this._id}`;
})

module.exports = mongoose.model("Pet", PetSchema);