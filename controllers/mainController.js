const Product = require('../models/productos');
const Cart = require('../models/cart')

/* --- FUNCIONES PARA LOS CONTROLADORES */

// Función para obtener la consulta de rango de precios
const queryRangoPrecios = (range) => {
    switch (range) {
        case '10':
            return { $lt: 10 };
        case '25':
            return { $gte: 10, $lte: 25 };
        case '50':
            return { $gte: 25, $lte: 50 };
        case '100':
            return { $gte: 50, $lte: 100 };
        default:
            return {};
    }
}


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

/* --- MOSTRAR Y BUSCAR PRODUCTOS POR PALABRA CLAVE ---- */

const buscador = async (req, res) => {
    const keyword = req.query.keyword;
    console.log(keyword)
    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { company: { $regex: keyword, $options: 'i' } },
            ],
        });
        res.render('productos', { 
            products,
            user: req.user,
         });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor.' });
    }
}


// ------------------- MOSTRAR Y BUSCAR POR FILTRO ------------------- //

const filtroPrecios = async (req, res) => {
    let minPrice = 0;
    let maxPrice = Number.POSITIVE_INFINITY;

    if (req.query.minPrice) {
        minPrice = parseFloat(req.query.minPrice);
    }
    if (req.query.maxPrice) {
        maxPrice = parseFloat(req.query.maxPrice);
    }

    try {
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });
        res.render('productos', { 
            products,
            user: req.user,
         });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor.' });
    }
}


const filtroGeneral = async (req, res) => {
    const keyword = req.query.keyword;
    const priceRange = req.query.priceRange;
    const company = req.query.company;

    try {
        let query = {
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { company: { $regex: keyword, $options: 'i' } },
            ],
        };

        if (priceRange) {
            query.price = queryRangoPrecios(priceRange);
        }

        if (company) {
            query.company = company;
        }

        const products = await Product.find(query);
        res.render('productos', { 
            products,
            user: req.user,
         });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor.' });
    }
}


// ------------------- MOSTRAR PAGINA DEL CARRITO ------------------- //

const paginaCarrito = async (req, res) => {
    try {
      // Aquí puedes obtener los productos en el carrito desde la base de datos
      // Por ejemplo, si estás utilizando el modelo Cart:
      const cartItems = await Cart.find();
  
      res.render('cart', { cartItems, user: req.user }); // Renderiza la página del carrito con los productos
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  }

module.exports = {
    obtenerProductosHome,
    obtenerProductoPorId,
    buscador,
    filtroPrecios,
    filtroGeneral,
    paginaCarrito
}
