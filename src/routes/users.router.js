const express = require('express');
const { userModel } = require('../models/user.model');
const router = express.Router();

//Ruta GET para renderizar la pagina register
router.get('/register', (req, res) => {
    res.render('register');
});

//Ruta POST para agregar un usuario
router.post('/register', async (req, res) => {
    try {
        const { nombre, email, pass } = req.body;

        console.log('Nuevo intento de registro:', nombre, email);

        const usuarioExistente = await userModel.findOne({ email });
        if (usuarioExistente) {
            console.log('Usuario ya existe:', email);
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        console.log('Registrando nuevo usuario:', nombre, email);

        const nuevoUsuario = new userModel({
            nombre,
            email,
            pass,
        });

        await nuevoUsuario.save();
        console.log('Usuario registrado con éxito:', email);

        // Redirigir al usuario a la página de inicio de sesión
        res.redirect('login'); 
        
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

//Ruta GET para obtener la pagina de login
router.get('/login', (req, res) => {
    res.render('login');
});

//Ruta POST para ingresar el usuario 
router.post('/login', async (req, res) => {
    try {
        const { email, pass } = req.body;

        const usuario = await userModel.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }

        if (usuario.pass !== pass) {
            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }

        //Almaceno el ID del usuario en la sesión
        req.session.userId = usuario._id;
        
        res.redirect('/');

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    // Destruye la sesión (elimina la sesión del usuario)
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ mensaje: 'Error al cerrar sesión' });
        }
        // Redirige al usuario a la página de inicio de sesión después de cerrar sesión
        res.redirect('/login');
    });
});

module.exports = router;
