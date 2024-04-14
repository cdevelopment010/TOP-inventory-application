const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const ItemSchema = new Schema({
    name: {type: String, required: true, minLength: 1},
    description: {type: String, required: true, minLength: 1},
    category: {type: Schema.Types.ObjectId, ref: "Category", required: true},
    price: { type: Number, required: true},

});

//Virtual URL
ItemSchema.virtual("url").get(function() {
    return `/catalog/item/${this._id}`;
})

module.exports = mongoose.model("Item", ItemSchema);