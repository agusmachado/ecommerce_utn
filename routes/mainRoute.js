const Product = require('../models/productos');

const express = require('express');
const router = express.Router();


const {
    obtenerProductosHome, 
    obtenerProductoPorId
} = require('../controllers/mainController')


//// ------------------- VISTAS DE LOS MÓDULOS -------------------- ////


// ------------------- RUTA PARA MOSTRAR MAIN ------------------- //



router.get('/', getProducts);
router.get('/products/:page', getProducts);


router.get('', getProducts);


// ------------------- RUTA PARA MOSTRAR - "ACERCA DE" ------------------- //

router.get('/main/about', (req, res) => {
    res.render('about'); 
});

// ------------------- RUTA PARA MOSTRAR El CARRITO ------------------- //

router.get('/main/carrito', async (req, res) => {
    res.render('carrito')
});

// ------------------- RUTA PARA MOSTRAR El FORMULARIO DE COMPRA ------------------- //

router.get('/main/formcCompra', async (req, res) => {
    res.render('formcCompra')
});

// ------------------- RUTA PARA MOSTRAR LISTADO DE PRODUCTOS ------------------- //

router.get('/main/listadoProductos', async (req, res) => {
    res.render('listadoProductos')
});

// ------------------- RUTA PARA MOSTRAR PRODUCTO ------------------- //

router.get('/main/:productId', getProductsItem);

// ------------------- RUTA PARA MOSTRAR Y BUSCAR PRODUCTOS POR PALABRA CLAVE ------------------- //
router.get('/buscar-por-keyword', buscador)


// ------------------- RUTA PARA MOSTRAR Y BUSCAR PRODUCTOS POR FILTRO ------------------- //
router.get('/filtro', filtro)

// ------------------- RUTA PARA MOSTRAR LA PAGINA DE USUARIO ------------------- //

router.get('/main/usuario', async (req, res) => {
    res.render('usuario')
});


module.exports=router



