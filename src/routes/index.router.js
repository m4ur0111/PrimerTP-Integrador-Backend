const express = require('express');
const router = express.Router();
const Producto = require('../models/products.models');
const { requireLogin } = require('../middleware/authMiddleware');
const { userModel } = require('../models/user.model'); // Importa el modelo de usuario
const { getUserRoleFromDatabase } = require('../utils/function');

router.get('/', requireLogin, async (req, res) => {
    try {
        const productos = await Producto.find();
        const userId = req.session.userId;

        //Consulto la base de datos para obtener los datos del usuario
        const usuario = await userModel.findById(userId);
        
        //Verifico el rol del usuario
        const userRole = await getUserRoleFromDatabase(userId);

        let message = '';
        let isAdmin = false;

        // Define mensajes personalizados basados en el rol del usuario
        if (userRole === 'admin') {
            message = '¡Bienvenido, administrador!';
            isAdmin = true;
        } else {
            message = '¡Bienvenido, usuario!';
        }

        //Renderizo la vista 'home' y paso los productos y el nombre del usuario como variables
        res.render('home', { productos, nombreUsuario: usuario.nombre, Rol: userRole, isAdmin });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

module.exports = router;
