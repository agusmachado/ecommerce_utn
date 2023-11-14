const Product =require('../models/productos')


const getAllProduct = async (req, res) => {
    console.log(req.query)
    const products = await Product.find(req.query)
    // req.body - me sirve para capturar los valores del input en el formulario
    // req.query - me sirve para capturar los valores que paso como parámetros

    // PROBAMOS - Para ver si funciona enviamos un mensaje que nos muestre que funciona la llamada req.query
    //res.status(200).json({ msg: 'probando testeando rutas DOS' });
    
    // Una vez que hicimos la prueba y que todo está ok, podemos traer los productos de la siguiente forma: http://localhost:4600/pepe?featured=true    
    // res.status(200).json({products});

    // (hago referencia a products.ejs)=> {products : products} <=(hago referencia a la variable products)
    res.render('home', { user: req.user, products: products });
};



module.exports = {
    getAllProduct
}


