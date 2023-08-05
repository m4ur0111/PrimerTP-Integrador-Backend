const express = require('express');
const fs = require('fs');
const router = express.Router();

const carritoFile = 'carrito.json';

//Función para cargar los carritos desde el archivo carrito.json
function loadCarts() {
  if (fs.existsSync(carritoFile)) {
    const data = fs.readFileSync(carritoFile, 'utf8');
    return JSON.parse(data);
  } else {
    //Si el archivo no existe, se crea un nuevo array de carritos vacío
    const emptyCarts = [];
    saveCarts(emptyCarts);
    return emptyCarts;
  }
}

//Función para guardar los carritos en el archivo carrito.json
function saveCarts(carts) {
  fs.writeFileSync(carritoFile, JSON.stringify(carts));
  console.log('Carritos guardados correctamente');
}

let carts = loadCarts();

//Obtener todos los carritos
router.get('/', (req, res) => {
  res.json(carts);
});

//Crear un nuevo carrito
router.post('/', (req, res) => {
  const { products } = req.body;

  //Validar que el array de productos esté presente 
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).send('El carrito debe contener al menos un producto.');
  }

  //Generar un nuevo ID para el carrito
  const newCartId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

  //Crear el nuevo carrito
  const newCart = {
    id: newCartId,
    products,
  };

  //Agregar el nuevo carrito al arreglo de carritos
  carts.push(newCart);

  //Guardar los datos actualizados en el archivo carrito.json
  saveCarts(carts);

  //Devolver el nuevo carrito como respuesta
  res.json(newCart);
});

//Obtener los productos de un carrito por su ID
router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const cart = carts.find((c) => c.id === parseInt(cid));
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).send('Carrito no encontrado');
  }
});

//Agregar un producto a un carrito por su ID
router.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  //Validar que el campo quantity esté presente en el cuerpo de la solicitud
  if (!quantity || isNaN(quantity)) {
    return res.status(400).send('El campo "quantity" debe ser un número válido.');
  }

  const cartIndex = carts.findIndex((c) => c.id === parseInt(cid));

  if (cartIndex !== -1) {
    const cart = carts[cartIndex];
    const existingProduct = cart.products.find((p) => p.id === parseInt(pid));

    if (existingProduct) {
      //Si el producto ya existe en el carrito, incrementamos su cantidad
      existingProduct.quantity += parseInt(quantity);
    } else {
      //Si el producto no existe, lo agregamos al carrito
      cart.products.push({ id: parseInt(pid), quantity: parseInt(quantity) });
    }

    saveCarts(carts);

    res.json(cart.products);
  } else {
    res.status(404).send('Carrito no encontrado');
  }
});

module.exports = router;
