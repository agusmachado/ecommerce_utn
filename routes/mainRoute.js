const Product = require('../models/productos');

const express = require('express');
const router = express.Router();


const {
    obtenerProductosHome, 
    obtenerProductoPorId
} = require('../controllers/mainController')


//// ------------------- VISTAS DE LOS MÓDULOS -------------------- ////


// ---- RUTA PARA MOSTRAR PRODUCTOS EN HOME Y PAGINADOR ----- //

router.get('/', obtenerProductosHome )
router.get('/products/:page', obtenerProductosHome);

// ---- RUTA PARA MOSTRAR PRODUCTO POR ID ----- //

router.get('/product/:productId', obtenerProductoPorId)



module.exports=router