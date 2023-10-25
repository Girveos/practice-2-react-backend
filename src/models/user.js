const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstname: {type: String, required: true },
    lastname: {type: String, required: true },
    country: {type: String, required: true },
    depto: {type: String, required: true },
    municipality: {type: String, required: true },
    documentType: {type: String, required: true },
    document: {type: String, required: true, unique :true },
    email: {type: String, required: true ,unique :true },
    password : {type: String, required: true },
    avatar: {type: String, required: true },
    active: {type: Boolean, default: false},
    role: {type: String, default: "guess"}
})
module.exports = mongoose.model("UserCollection", userSchema);
