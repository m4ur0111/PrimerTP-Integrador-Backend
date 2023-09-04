# 1° Integrador Backend
Primer integrador del curso de backend de CoderHouse orientado a la creación de un ecommerce con Express, MongoDB, Mongoose, Handlebars.

## Instalación
1. Clona el repositorio.
2. Instala las dependencias con `npm install`.
3. Inicia el servidor de express con `npm start`.
4. Inicia el proyecto en el navegador de tu elección introduciendo `http://localhost:8080/`.

## Uso
Para iniciar sesión hay 2 opciones diferentes, registrar un usuario desde 0 o ingresar con un usuario ya registrado.
Hay 2 usuarios de ejemplo, aunque en el formulario pueden registrarse los usuarios que se deseen.

Usuario sin permisos:.
Email: user@gmail.com,
Pass: userCoderHouse,
Rol: user.

Usuario con permisos:.
Email: admin@gmail.com,
Pass: adminCoderHouse,
Rol: admin.

## Información
Los usuarios con permisos son capaces de agregar productos modificarlos e inhabilitarlos teniendo la opcion de visualización de botones que un usuario común no es capaz de visualizar.

Los archivos json de productos.json y carrito.json en este modelo no tienen uso debido a que pueden ser utilizados con FileSystem si fuera necesario
