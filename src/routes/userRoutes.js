const express = require("express");
const userController = require("../controllers/user");

const routes = express.Router();

routes.post("/", userController.createUser);
routes.get("/", userController.listUsers);
routes.get("/:userId", userController.listUser);
routes.patch("/:userId", userController.editUser);
routes.delete("/:userId", userController.deleteUser);

module.exports = routes;
