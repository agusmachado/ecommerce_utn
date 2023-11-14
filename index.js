const express = require('express')
//const Products = require('./models/productos')

const passportSetup=require('./config/config')
const mongoose=require('mongoose')
const cookieSession =require('cookie-session');
const passport = require('passport');

const app = express()

require('dotenv').config();
require('express-async-errors')

//----------------------------------------- TRAIGO LA DB

const connectDb = require('./db/conexion')

const rutasAuth = require('./routes/rutasAuth')
const profileRutas = require('./routes/profile.router')
const mainRoutes = require('./routes/mainRoute')

// Creo el middleware que me lee el json para que, después, lo traduzca el express.json()
app.use(express.urlencoded({ extended: true}))

// Creo el middleware que me transforma los json que me llegan desde los formularios a objeto
app.use(express.json())



//---------------------------------------- CONEXIÓN A LA DB

const PORT = process.env.PORT || 3800
const host = process.env.HOST

connectDb()

//---------------------------------------- ARCHIVOS ESTÁTICOS Y ACTIVACIÓN DE LOS EJS

app.use(express.static('public'))
app.set('view engine', 'ejs')

//------------------- Activamos la cookie
app.use(cookieSession({
  maxAge:24*60*60*1000,
  keys:[process.env.COOKIE_KEY]
}))


//------------------- Inicializamos el passport. Ahora sí, comienza a funcionar el passport
app.use(passport.initialize())
//-------------------- Activamos la session.
app.use(passport.session({
  secret:'secreto',
  resave:false,
  saveUninitialized:true
}))



//------------ RUTAS


app.use('/auth',rutasAuth)
app.use('/profile',profileRutas)
app.use('/', mainRoutes)





app.listen(PORT, host, () =>{
    console.log('Se conectó el servidor')
})


