const { model, Schema } = require("mongoose");

const ProductSchema = new Schema({
  name: { type: String, required: true, unique: true },
  img: { type: String, required: true },
  inCart: { type: Boolean, default: false },
  price: { type: Number, required: true },
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

module.exports = model("Product", ProductSchema);