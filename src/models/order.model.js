const mongoose = require('mongoose');

const orderCollection = "orders"

const productoEnOrdenSchema = new mongoose.Schema({
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    cantidad: Number,
    precioUnitario: Number,
    nombre: String, // Agrega el nombre del producto
    imagen: String, // Agrega la URL o nombre de la imagen del producto
});

const orderSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    productos: [productoEnOrdenSchema], 
    total: Number,
    fechaCreacion: { type: Date, default: Date.now }, // Agrega la fecha de creación
    estado: { type: String, default: "aprobado" }, 
});

const Order = mongoose.model(orderCollection, orderSchema);

module.exports = Order;
