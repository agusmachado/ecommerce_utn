const Product = require('../models/productos');
const express = require('express');
const router = express.Router();



const obtenerProductos = async () => {
    try {
        // Aquí puedes personalizar tu lógica para obtener productos desde tu base de datos
        const productos = await Product.find().exec();
        return productos;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
};

//// ------------------- VISTAS DE LOS MÓDULOS -------------------- ////


// En tu archivo de ruta (por ejemplo, mainRoute.js)
router.get('/', async (req, res) => {
    try {
        const products = await obtenerProductos(); // Asegúrate de tener una función para obtener tus productos
        res.render('home', { products, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar la página');
    }
});



module.exports=router