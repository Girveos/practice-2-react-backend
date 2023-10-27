const user_model = require("../models/user");

const validateEmail = email => {
    const emaildomain = /@(gmail|outlook)\.com$/;
    return emaildomain.test(email);
};

const createUser = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "No tienes permiso para crear usuarios" });
    }

    const new_user = user_model(req.body);

    if (!validateEmail(new_user.email)) {
        return res.status(400).json({ message: "El correo electrónico no es válido" });
    }

    try {
        const data = await new_user.save();
        if (data) {
            return res.status(201).json(data);
        }
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errorMessages = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({ message: 'Error de validación: ' + errorMessages.join(', ') });
        } else {
            return res.status(500).json({ message: 'Error interno del servidor: ' + err.message });
        }
    }
};


const listUsers = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "No tienes permiso para acceder a esta función" });
    }

    try {
        const data = await user_model.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

const listUser = async (req, res) => {
    const userId = req.user.sub;

    try {
        const data = await user_model.find({ _id: userId });
        if (data.length === 0) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

const editUser = async (req, res) => {
    const userId = req.params.userId;
    const query = { _id: userId };
    const update = { $set: req.body };

    try {
        const userExists = await user_model.exists(query);
        if (!userExists) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }
        if (req.user.role === "admin" || req.user.sub === userId) {
            await user_model.updateOne(query, update);
            const updatedUser = await user_model.findById(userId);
            res.status(200).json(updatedUser);
        } else {
            res.status(403).json({ message: "No tienes permiso para editar este usuario" });
        }
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    const query = { _id: userId };

    try {
        const userExists = await user_model.exists(query);
        if (!userExists) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }
        if (req.user.role === "admin") {
            await user_model.deleteOne(query);
            
            res.status(200).json({ message: "Usuario eliminado correctamente" });
        } else {
            res.status(403).json({ message: "No tienes permiso para eliminar este usuario" });
        }
    } catch (err) {
        res.status(500).json({ message: err +"no"});
    }
};

module.exports = {
    createUser,
    listUsers,
    listUser,
    editUser,
    deleteUser
};
