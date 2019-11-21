const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    lastname: String,
    email: String,
    password: String,
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Spot"
    }]
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;