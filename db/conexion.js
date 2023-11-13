const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        const resultado = await mongoose.connect(process.env.MONGO_URL)

        // ${resultado.connection.host} sirve como referencia para saber a qué DB estamos apuntando. No es obligatorio.
        console.log(`'Se conectó a la base de datos:' ${resultado.connection.host}`)
    } catch (erro) {
        console.log(erro)
    }
    
}

module.exports = connectDb