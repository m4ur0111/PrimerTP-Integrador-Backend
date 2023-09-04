const express = require('express');
const router = express.Router();
const Producto = require('../models/products.models');
const Carrito = require('../models/cart.models');
const Order = require('../models/order.model');
const { requireLogin } = require('../middleware/authMiddleware');

//////////// CARRITO ROUTES ////////////
router.post('/agregar-al-carrito/:productoId', async (req, res) => {
    try {
        const productoId = req.params.productoId;
        const userId = req.session.userId;

        // Busca el carrito del usuario o crea uno nuevo si no existe
        let carrito = await Carrito.findOne({ usuario: userId });

        if (!carrito) {
            carrito = await Carrito.create({ usuario: userId, productos: [], total: 0 });
        }

        // Verifica si el producto ya está en el carrito
        const productoEnCarrito = carrito.productos.find((item) => item.producto.equals(productoId));

        // Verifica si el producto ya está en el carrito
        if (productoEnCarrito) {
            // Si el producto ya está en el carrito, aumenta la cantidad en lugar de duplicar
            productoEnCarrito.cantidad += 1;
        } else {
            // Recupera el producto que estás agregando para obtener su precio
            const producto = await Producto.findById(productoId);

            if (producto) {
                carrito.productos.push({ producto: productoId, cantidad: 1, precioUnitario: producto.precio, nombre: producto.nombre, imagen: producto.imagen });
            }
        }

        // Actualiza el total del carrito
        carrito.total = carrito.productos.reduce((total, item) => {
            return total + (item.cantidad * item.precioUnitario);
        }, 0);

        // Guarda el carrito actualizado
        await carrito.save();

        res.redirect('/'); // Redirige al usuario a la página de inicio u otra página
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

// Ruta GET para la página de carrito
router.get('/cart', requireLogin, async (req, res) => {
    try {
        const userId = req.session.userId; // Obtén la ID del usuario actual
        // Busca el carrito del usuario utilizando su ID
        const carrito = await Carrito.findOne({ usuario: userId });

        // Si no hay carrito o el carrito está vacío, muestra el mensaje de "No hay productos en el carrito."
        if (!carrito || carrito.productos.length === 0) {
            return res.render('cart', { carrito: null, detallesDelCarrito: [] });
        }

        // Obtén las ID de los productos en el carrito
        const productoIds = carrito.productos.map(item => item.producto);

        // Realiza una consulta a la base de datos para obtener los detalles de los productos
        const detallesDelCarrito = await Producto.find({ _id: { $in: productoIds } });

        // Renderiza la vista 'cart' y pasa el carrito y los detalles como variables
        res.render('cart', { carrito, detallesDelCarrito });

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

router.get('/completado', requireLogin, async (req, res) => {
    res.render('buy-complete'); // Debe renderizar la vista de confirmación de compra
})

// Ruta para finalizar la compra y mostrar la confirmación
router.post('/finalizar-compra', async (req, res) => {
    try {
        const userId = req.session.userId; // Obtén la ID del usuario actual
        const carrito = await Carrito.findOne({ usuario: userId }); // Busca el carrito del usuario

        if (!carrito || carrito.productos.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío' });
        }

        // Crea una nueva orden utilizando el modelo Order
        const nuevaOrden = new Order({
            usuario: userId,
            productos: carrito.productos,
            total: carrito.total,
            estado: 'aprobado',
        });

        // Guarda la nueva orden en la base de datos
        await nuevaOrden.save();

        // Limpia el carrito
        carrito.productos = [];
        carrito.total = 0;
        await carrito.save();
    
        // Redirige al usuario a la página de confirmación de compra
        res.status(201).json({ message: 'Compra completada con éxito', OrderId: nuevaOrden._id });

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Ruta DELETE para limpiar el carrito
router.delete('/limpiar-carrito', async (req, res) => {
    try {
        const userId = req.session.userId; // Obtén la ID del usuario actual

        // Busca el carrito del usuario utilizando su ID y elimínalo
        await Carrito.deleteOne({ usuario: userId });

        res.status(204).send(); // Respuesta exitosa sin contenido (204 No Content)
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

module.exports = router;