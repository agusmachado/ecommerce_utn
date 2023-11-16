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
    paginaCarrito
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

// ------------------- RUTA PARA BUSCR SEGÚN DIFERENTES CRITERIOS ------------------- //

router.get('/filtro', filtroGeneral)

// ------------------- RUTA PARA MOSTRAR LA PÁGINA DEL CARRITO ------------------- //

router.get('/cart', paginaCarrito);
  
  
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



// Ruta para eliminar un producto del carrito
router.delete('/removeFromCart/:productId', async (req, res) => {
    const productId = req.params.productId;
    console.log(productId);
  
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
  });


module.exports=router