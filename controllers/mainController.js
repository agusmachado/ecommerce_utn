const Product =require('../models/productos')

// Función para obtener la consulta de rango de precios
const obtenerPreciosPorRangos = (range) => {
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
};


const getProducts = async (req, res) => {
    try {
        let perPage = 8;
        let page = req.params.page || 1;

        const products = await Product
            .find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec();

        const count = await Product.countDocuments(); // Obtener el número total de productos

        res.render('index', {
            products,
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar la página');
    }
};


const getProductsItem = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).send('Producto no encontrado');
            return;
        }
        res.render('producto', { product }); // Pasa el objeto `product` a la vista
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar la página');
    }
};

const buscador = async (req, res) => {
    const keyword = req.query.keyword;

    try {
        const products = await Productos.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { company: { $regex: keyword, $options: 'i' } },
            ],
        });
        res.render('products', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor.' });
    }
}

const filtro = async (req, res) => {
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
            query.price = obtenerPreciosPorRangos(priceRange);
        }

        if (company) {
            query.company = company;
        }

        const products = await Product.find(query);
        res.render('products', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor.' });
    }
}


module.exports = {
    getProductsItem,
    getProducts,
    buscador,
    filtro
}