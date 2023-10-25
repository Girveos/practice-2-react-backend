const express = require("express");
const user_model = require("../models/user");
const routes = express.Router();

function validateEmail(email) {
    const emaildomain= /@(gmail|outlook)\.com$/;
    return emaildomain.test(email);
}


routes.post("/",(req,res) =>{
    const new_user = user_model(req.body);

    if (!validateEmail(new_user.email)) {
        return res.status(400).json({ message: "El correo electrónico no es válido" });
    }

    new_user.save()
            .then((data) => res.json(data))
            .catch((err) => res.json({ message:err }));
});

routes.get("/",(req,res) => {
    user_model.find()
    .then((data) => res.json(data))
    .catch((err) => res.json({ message:err }));
});


routes.get("/:userId",(req,res) => {
    const { userId } = req.params;
    user_model.find({_id:userId})
    .then((data) => res.json(data))
    .catch((err) => res.json({ message:err }));
});


routes.put("/:userId",(req,res) => {
    const userId = req.params.userId;
    const query = {_id:userId};
    const update = {$set:req.body};
    user_model.updateOne(query,update)
              .then((data) => res.json(data))
              .catch((err) => res.json({ message:err }));
});


routes.delete("/:userId",(req,res) => {
    const { userId } = req.params;
    user_model.deleteOne({_id:userId})
              .then((data) => res.json(data))
              .catch((err) => res.json({ message:err }));
});

module.exports = routes;
