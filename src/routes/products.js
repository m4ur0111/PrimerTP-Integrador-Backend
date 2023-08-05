const express = require('express');
const fs = require('fs');
const router = express.Router();

const productosFile = 'productos.json';

//Función para cargar los productos desde el archivo productos.json
function loadProducts() {
    if (fs.existsSync(productosFile)) {
        const data = fs.readFileSync(productosFile, 'utf8');
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return [];
        }
    }
}

//Función para guardar los productos en el archivo productos.json
function saveProducts(products) {
    fs.writeFile(productosFile, JSON.stringify(products), (err) => {
        if (err) throw err;
        console.log('Productos guardados correctamente');
    });
}

let products = loadProducts();

//Obtener todos los productos 
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit);
    let productList = products;
    if (!isNaN(limit)) {
        productList = products.slice(0, limit);
    }
    res.json(productList);
});

//Obtener un producto por su ID
router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const product = products.find((p) => p.id === parseInt(pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

//Agregar un nuevo producto
router.post('/', (req, res) => {
    const { name, description, code, price, stock, category, thumbnails } = req.body;

    //Validar que ningun campo este vacio
    if (!name || !description || !code || !price || !stock || !category) {
        return res.status(400).send('Todos los campos obligatorios deben estar presentes.');
    }

    //Generar un nuevo ID para el producto 
    const newProductId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
        id: newProductId,
        name,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || [],
    };

    //Agregar el nuevo producto 
    products.push(newProduct);

    saveProducts(products);

    res.json(newProduct);
});

//Actualizar un producto por su ID
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const productIndex = products.findIndex((p) => p.id === parseInt(pid));

    if (productIndex !== -1) {
        const originalProduct = products[productIndex];

        const { name, description, code, price, stock, category, thumbnails } = req.body;

        //Verificar si algún campo a actualizar no existe en el producto original
        const invalidFields = Object.keys(req.body).filter(
            (field) => !Object.prototype.hasOwnProperty.call(originalProduct, field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).send(`Los siguientes campos no existen en el producto con ID ${pid}: ${invalidFields.join(', ')}`);
        }

        //Actualizar los campos del producto original
        products[productIndex] = {
        ...originalProduct,
        name: name || originalProduct.name,
        description: description || originalProduct.description,
        code: code || originalProduct.code,
        price: price || originalProduct.price,
        stock: stock || originalProduct.stock,
        category: category || originalProduct.category,
        thumbnails: thumbnails || originalProduct.thumbnails,
        };

        //Guardar los datos actualizados en el archivo productos.json
        saveProducts(products);

        res.status(200).send('Producto actualizado correctamente')
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

//Eliminar un producto por su ID
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const productIndex = products.findIndex((p) => p.id === parseInt(pid));

    if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1);

        //Guardar los datos actualizados en el archivo productos.json
        saveProducts(products);

        res.status(200).send(`El producto con ID ${pid} fue eliminado correctamente`)
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

module.exports = router;
