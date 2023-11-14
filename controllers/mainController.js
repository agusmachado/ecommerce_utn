const Product = require('../models/productos');

/* --- FUNCIONES PARA LOS CONTROLADORES */




/* --- CONTROLADORES --- */

/* --- OBTENER PRODUCTOS EN HOME ---- */

const obtenerProductosHome = async (req, res) => {
    try {
        let perPage = 8;
        let page = req.params.page || 1;

        const products = await Product
            .find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec();

        const count = await Product.countDocuments(); // Obtener el número total de productos

        res.render('home', {
            products,
            user: req.user,
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar la página');
    }
};

/* --- OBTENER PRODUCTO POR ID ---- */

const obtenerProductoPorId = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId)

        if (!product) {
            res.status(404).send('Producto no encontrado')
            return;
        }

        res.render('producto', { product, user: req.user })
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar la página')
    }
}

module.exports = {
    obtenerProductosHome,
    obtenerProductoPorId
}