const Product = require('../models/productos');
const Cart = require('../models/cart')
const express = require('express');
const router = express.Router();


const {
    obtenerProductosHome, 
    obtenerProductoPorId,
    buscador,
    filtroPrecios,
    filtroGeneral,
    paginaCarrito,
    agregarProductoCarrito,
    eliminarProductoCarrito
} = require('../controllers/mainController');
const { route } = require('express/lib/router');


//// ------------------- VISTAS DE LOS MÓDULOS -------------------- ////


// ---- RUTA PARA MOSTRAR PRODUCTOS EN HOME Y PAGINADOR ----- //

router.get('/', obtenerProductosHome )
router.get('/products/:page', obtenerProductosHome);

// ---- RUTA PARA MOSTRAR PRODUCTO POR ID ----- //

router.get('/product/:productId', obtenerProductoPorId)

// ------------------- RUTA PARA MOSTRAR Y BUSCAR PRODUCTOS POR PALABRA CLAVE ------------------- //

router.get('/buscar-por-keyword', buscador)

// ------------------- RUTA PARA MOSTRAR Y BUSCAR POR FILTRO ------------------- //
 
router.get('/search-by-price', filtroPrecios);

// ------------------- RUTA PARA BUSCR SEGÚN DIFERENTES CRITERIOS ------------------- //

router.get('/filtro', filtroGeneral)

// ------------------- RUTA PARA MOSTRAR LA PÁGINA DEL CARRITO ------------------- //

router.get('/cart', paginaCarrito);
  
// ------------------- RUTA PARA AGREGAR UN PRODUCTO AL CARRITO ------------------- //

router.post("/addToCart/:productId", agregarProductoCarrito);

// ------------------- RUTA PARA ELIMINAR UN PRODUCTO DEL CARRITO ------------------- //

router.delete('/removeFromCart/:productId', eliminarProductoCarrito);

// ------------------- RUTAS PARA VER EL FORMULARIO ------------------- //

router.get('/formulario', (req, res) => {
  res.render('formCompra', { user: req.user })
})

// ------------------- RUTAS ESTÁTICAS ------------------- //

router.get('/estaticas/envios', (req, res) => {
  res.render('envios', { user: req.user })
})

router.get('/estaticas/nuevo', (req, res) => {
  res.render('nuevo', { user: req.user })
})

router.get('/estaticas/gamers', (req, res) => {
  res.render('gamers', { user: req.user })
})

router.get('/estaticas/run', (req, res) => {
  res.render('run', { user: req.user })
})

router.get('/estaticas/desktop', (req, res) => {
  res.render('desktop', { user: req.user })
})


module.exports=router