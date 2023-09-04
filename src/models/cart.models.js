const mongoose = require('mongoose');

const cartCollection = "carts"

const productoEnCarritoSchema = new mongoose.Schema({
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    cantidad: Number,
    precioUnitario: Number,
    nombre: String, // Agrega el nombre del producto
    imagen: String, // Agrega la URL o nombre de la imagen del producto
});


const carritoSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    productos: [productoEnCarritoSchema], // Utiliza un array de objetos
    total: Number,
});

const Carrito = mongoose.model(cartCollection, carritoSchema);

module.exports = Carrito;
