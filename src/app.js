const express = require('express');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts')

const app = express();
const PORT = 8080;

//Middlewares
app.use(express.json()); 

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter)

//Ruta general
app.get('/', (req, res) => {
    res.send('Bienvenido a la primer preentrega');
});

//Manejo de errores para rutas inexistentes
app.use((req, res, next) => {
    res.status(404).send('Ruta no encontrada');
});

//Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Hubo un error en el servidor');
});

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${PORT}`);
});
