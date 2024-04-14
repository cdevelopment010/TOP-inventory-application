const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const ItemInstanceSchema = new Schema({
    item: {type: mongoose.Types.ObjectId, ref: "Item", required: true},
    sold: {type: Date}, 
    discount: {type: Number}
});

//virtual url
ItemInstanceSchema.virtual("url").get(function() {
    return `/catalog/iteminstance/${this._id}`;
}); 

module.exports = mongoose.model("ItemInstance", ItemInstanceSchema);