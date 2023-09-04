const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const session = require('express-session');
const cookieParser = require('cookie-parser');

//Configuración del puerto
const PORT = 8080;

//Configuración de Express
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

//Configura el middleware de cookie-parser
app.use(cookieParser());

// Configura express-session
app.use(session({
    secret: 'clave-secreta-de-mis-cookies', // Cambia esto por una cadena de secreto más segura
    resave: false,
    saveUninitialized: true,
}));

//Conexion a la base de datos
mongoose.connect('mongodb+srv://mauro:admin519070@ecommerce.w3ewem0.mongodb.net/ecommerce', {
}).then(() => {
    console.log("Conectado a la base de datos")
}).catch(error => {
    console.log("Error en la conexion", error)
});

//Rutas
const indexRoutes = require('./routes/index.router');
const usersRoutes = require('./routes/users.router');
const productRoutes = require('./routes/products.router');
const cartRoutes = require('./routes/cart-router');

app.use('/', indexRoutes);
app.use('/', usersRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);

//Iniciar el servidor 
http.listen(PORT, () => {
    console.log("Servidor corriendo correctamente")
});
