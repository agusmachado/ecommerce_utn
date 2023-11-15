const express = require('express');
const passportSetup = require('./config/config');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

require('dotenv').config();

//----------------------------------------- TRAIGO LA DB

const connectDb = require('./db/conexion');


const app = express()

// Creo el middleware que me transforma los json que me llegan desde los formularios a objeto
app.use(express.json());

//---------------------------------------- CONEXIÓN A LA DB

const PORT = process.env.PORT || 3800

connectDb();

//---------------------------------------- ARCHIVOS ESTÁTICOS Y ACTIVACIÓN DE LOS EJS

app.use(express.static('public'));
app.set('view engine', 'ejs');

//------------------- Activamos la cookie
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.COOKIE_KEY]
}));

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


app.get('/', (req, res) => {
    res.render('home',{user:req.user});
});

app.use('/', require('./routes/mainRoute'))

app.listen(PORT, () =>{
    console.log('Se conectó el servidor')
})