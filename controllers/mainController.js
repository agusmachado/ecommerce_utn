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
         // Paginación: Obtener productos para la página actual
        let perPage = 8;
        let page = req.params.page || 1;

        const products = await Product
            .find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec();
        // Obtener el número total de productos para la paginación
        const count = await Product.countDocuments(); 

        // Renderizar la página 'home' con los productos y detalles de paginación
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
        // Obtener el ID del producto desde los parámetros de la solicitud
        const productId = req.params.productId;

        // Buscar el producto por su ID
        const product = await Product.findById(productId)

        // Si el producto no existe, devolver un error 404
        if (!product) {
            res.status(404).send('Producto no encontrado')
            return;
        }

        // Renderizar la página 'producto' con los detalles del producto
        res.render('producto', { product, user: req.user })
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar la página')
    }
}

/* --- MOSTRAR Y BUSCAR PRODUCTOS POR PALABRA CLAVE ---- */

const buscador = async (req, res) => {
    // Obtener la palabra clave desde los parámetros de la solicitud
    const keyword = req.query.keyword;
    console.log(keyword)
    try {
        // Buscar productos que coincidan con la palabra clave en nombre, descripción y empresa
        const products = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { company: { $regex: keyword, $options: 'i' } },
            ],
        });

        // Renderizar la página 'productos' con los resultados de la búsqueda
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
    // Establecer valores predeterminados para el rango de precios
    let minPrice = 0;
    let maxPrice = Number.POSITIVE_INFINITY;

    // Actualizar valores si se proporcionan en los parámetros de la solicitud
    if (req.query.minPrice) {
        minPrice = parseFloat(req.query.minPrice);
    }
    if (req.query.maxPrice) {
        maxPrice = parseFloat(req.query.maxPrice);
    }

    try {
        // Filtrar productos por rango de precios
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });
        // Renderizar la página 'productos' con los resultados del filtro por precios
        res.render('productos', { 
            products,
            user: req.user,
         });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor.' });
    }
}


const filtroGeneral = async (req, res) => {
    // Obtener valores de los parámetros de la solicitud
    const keyword = req.query.keyword;
    const priceRange = req.query.priceRange;
    const company = req.query.company;

    try {
        // Construir la consulta con opciones de filtro
        let query = {
            $or: [
               // Utilizamos regex para realizar búsquedas con expresiones regulares y options: 'i' para que la búsqueda no diferencie entre mayúsculas y minúsculas 
                { name: { $regex: keyword, $options: 'i' } },
                { company: { $regex: keyword, $options: 'i' } },
            ],
        };

        // Agregar filtro por rango de precios si se proporciona
        if (priceRange) {
            query.price = queryRangoPrecios(priceRange);
        }

        // Agregar filtro por empresa si se proporciona
        if (company) {
            query.company = company;
        }

        // Buscar productos según la consulta construida
        const products = await Product.find(query);

        // Renderizar la página 'productos' con los resultados del filtro general
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
      const cartItems = await Cart.find();
  
      // Renderizar la página 'cart' con los productos en el carrito
      res.render('cart', { cartItems, user: req.user }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  }


// ------------------- AGREGAR UN PRODUCTO AL CARRITO ------------------- //

const agregarProductoCarrito = async (req, res) => {
    // Obtener el ID del producto desde los parámetros de la solicitud
    const productId = req.params.productId;
    console.log(productId)
    try {
        // Buscar el producto por su ID
        const product = await Product.findById(productId);
  
        // Si el producto no existe, devolver un error 404
        if (!product) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
  
        // Crear un nuevo producto en el carrito con detalles del producto
        const newProductInCart = new Cart({
            name: product.name,
            img: product.img,
            price: product.price,
            amount: 1,
        });
  
        // Guardar el nuevo producto en el carrito en la base de datos
        await newProductInCart.save();
  
        // Obtén todos los productos en el carrito (aquí debes tener lógica según tu modelo)
        const productsInCart = await Cart.find({});
  
        // Si es una solicitud AJAX, responde con JSON
        if (req.xhr || req.accepts('json')) {
            return res.json({ mensaje: "El producto fue agregado al carrito", products: productsInCart });
        }
  
        // Si es una solicitud regular, renderiza la vista 'cart' con los productos en el carrito
        res.render('cart', { productsInCart, user: req.user });
    } catch (error) {
        console.error(error);
  
        // Si es una solicitud AJAX, responde con JSON
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }
  
        // Si es una solicitud regular, redirige a una página de error o realiza otra acción apropiada
        res.status(500).render('error', { mensaje: 'Error en el servidor' });
    }
  }


// ------------------- ELIMINAR UN PRODUCTO DEL CARRITO ------------------- //

const eliminarProductoCarrito = async (req, res) => {
    // Obtener el ID del producto desde los parámetros de la solicitud
    const productId = req.params.productId;
  
    try {
      // Elimina el producto del carrito utilizando el ID
      const removedProduct = await Cart.findByIdAndDelete(productId);
      console.log(removedProduct);
  
      if (!removedProduct) {
        return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
      }
  
      // Devuelve un mensaje JSON indicando que la eliminación fue exitosa
      res.json({ mensaje: "Producto eliminado del carrito" });
  
    } catch (error) {
      console.error(error);
  
      // Si hay un error, responde con un mensaje de error
      res.status(500).json({ mensaje: "Error en el servidor al eliminar producto del carrito" });
    }
  }


/* --- OBTENER PRODUCTOS EN GRACIAS ---- */

const obtenerProductosGracias = async (req, res) => {
    try {
         // Paginación: Obtener productos para la página actual
        let perPage = 8;
        let page = req.params.page || 1;

        const products = await Product
            .find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec();
        // Obtener el número total de productos para la paginación
        const count = await Product.countDocuments(); 

        // Renderizar la página 'home' con los productos y detalles de paginación
        res.render('gracias', {
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



module.exports = {
    obtenerProductosHome,
    obtenerProductoPorId,
    buscador,
    filtroPrecios,
    filtroGeneral,
    paginaCarrito,
    agregarProductoCarrito,
    eliminarProductoCarrito,
    obtenerProductosGracias
}
