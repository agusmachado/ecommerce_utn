const Product = require('../models/productos');
const Cart = require('../models/cart')
const express = require('express');
const router = express.Router();


const {
    obtenerProductosHome, 
    obtenerProductoPorId,
    buscador,
    filtroPrecios,
    filtroGeneral
} = require('../controllers/mainController')


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





// Ruta para buscar productos según diferentes criterios
router.get('/filtro', filtroGeneral)


// Ruta para mostrar la página del carrito
router.get('/cart', async (req, res) => {
    try {
      // Aquí puedes obtener los productos en el carrito desde la base de datos
      // Por ejemplo, si estás utilizando el modelo Cart:
      const cartItems = await Cart.find();
  
      res.render('cart', { cartItems, user: req.user }); // Renderiza la página del carrito con los productos
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  });
  
  
  // Ajusta la ruta para incluir el parámetro productId
  // Ruta para agregar un producto al carrito
  router.post("/addToCart/:productId", async (req, res) => {
    const productId = req.params.productId;
    console.log(productId)
    try {
        const product = await Product.findById(productId);
  
        if (!product) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
  
        const newProductInCart = new Cart({
            name: product.name,
            img: product.img,
            price: product.price,
            amount: 1,
        });
  
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
  });


module.exports=router