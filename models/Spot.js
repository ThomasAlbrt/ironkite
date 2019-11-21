const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const spotSchema = new Schema({
    spotName: String,
    wind: [Number],
    region: String,
    url: String
});

const spotModel = mongoose.model("Spot", spotSchema);

module.exports = spotModel;