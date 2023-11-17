const express = require('express');
const passportSetup = require('./config/config');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const session = require('express-session');  // Agregamos express-session

const app = express();

require('dotenv').config();
require('express-async-errors');

// ----------------------------------------- 1. TRAIGO LA DB
const connectDb = require('./db/conexion');
const rutasAuth = require('./routes/rutasAuth');
const profileRutas = require('./routes/profile.router');
const mainRoutes = require('./routes/mainRoute');

// ----------------------------------------- 2. MIDDLEWARES

// 2.1 Middleware que parsea las solicitudes con cuerpo en formato JSON
app.use(express.urlencoded({ extended: true }));

// 2.2 Middleware que transforma los JSON de los formularios a objetos
app.use(express.json());

// ----------------------------------------- 3. CONEXIÓN A LA DB

const PORT = process.env.PORT || 3800;
const host = process.env.HOST;

// Se conecta a la base de datos
connectDb();

// ----------------------------------------- 4. ARCHIVOS ESTÁTICOS Y ACTIVACIÓN DE LOS EJS

// 4.1 Middleware que sirve archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

// 4.2 Configura el motor de vistas a EJS
app.set('view engine', 'ejs');

// ----------------------------------------- 5. ACTIVACIÓN DE COOKIE

// Middleware para gestionar las cookies de sesión
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, // Duración de la cookie en milisegundos (1 día)
  keys: [process.env.COOKIE_KEY] // Clave secreta para firmar la cookie
}));

// ----------------------------------------- 6. ACTIVACIÓN DE EXPRESS-SESSION

// Configuración del middleware de sesión en Express
app.use(session({
  secret: 'secreto', // Clave secreta para firmar la sesión
  resave: false, // Evita que la sesión se guarde si no hay cambios
  saveUninitialized: true // Crea una sesión nueva automáticamente si no hay una válida
}));

// ----------------------------------------- 7. INICIALIZACIÓN DE PASSPORT

// Inicializa Passport
app.use(passport.initialize());

// ----------------------------------------- 8. ACTIVACIÓN DE SESSION PARA PASSPORT

// Activa el manejo de sesiones para Passport
app.use(passport.session());

// ----------------------------------------- 9. RUTAS

// Rutas para la autenticación
app.use('/auth', rutasAuth);

// Rutas para el perfil
app.use('/profile', profileRutas);

// Rutas principales
app.use('/', mainRoutes);

// ----------------------------------------- 10. INICIO DEL SERVIDOR

app.listen(PORT, host, () => {
  console.log('Se conectó el servidor');
});
