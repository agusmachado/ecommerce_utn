const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio']
    },
    price: {
        type: Number,
        required: [true, 'El precio del producto es obligatorio']
    },
    description: {
        type: String, 
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 4.5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    company: {
        type: String,
        enum: {
            values: ['Noga', 'Sony', 'Bose', 'Philips', 'Sennheiser'],
            message: '{value} no tiene stock'
        }
    },
    img: {
        type: String
    },
    images: {
        type: [String] // Esto permite almacenar una lista de cadenas (URL de imágenes)
    },
    colors: [
        {
            name: {
                type: String,
                required: [true, 'El nombre del color es obligatorio']
            },
            code: {
                type: String,
                required: [true, 'El código de color es obligatorio']
            },
            img: {
                type: String,
                required: [true, 'La URL de la imagen del color es obligatoria']
            }
        }
    ]
});

module.exports = mongoose.model('Product', productsSchema);