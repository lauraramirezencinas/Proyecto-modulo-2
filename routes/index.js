require('dotenv').config();
const express = require('express');
const router = express.Router();
const saltRounds = 10
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require('express-session');
const nodemailer = require('nodemailer');
const passport = require('passport');
const Usuario = require('../models/modelo-usuario');
const Restaurante = require('../models/modelo-restaurante');


/* GET home page */
router.get('/', (req, res, next) => {
  if (req.query.error) {

    res.render('index', { errorMessage: req.query.error })
  }
  res.render('index');
});
//Get user-profile
router.get("/user-Profile", async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ _id: req.session.currentUser });
    const restaurante = await Restaurante.find({ userId: req.session.currentUser });
    res.render("auth/user-profile", { usuario: usuario, restaurante: restaurante })
  } catch (err) {
    next(err)
  }
})

//Ruta GET registro
router.get("/signup", (req, res) => res.render("auth/signup"))

//Ruta POST registro
router.post("/signup", async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body
    //Comprobracion de que todos los campos han sido introducidos
    if (!nombre || !email || !password) {
      res.render("auth/signup", { errorMessage: "Los campos username, email y contraseña son obligatorios" })
      return
    }
    //Validacion password fuerte front-end 
    //La contraseña debe contener al menos 6 caracteres, una mayúscula y un número
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(400).render('auth/signup', {
        errorMessage: 'La contraseña debe contener al menos 6 caracteres, una mayúscula y un número'
      });
      return;
    }
    // Encriptacion de la password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const usuario = await Usuario.create({ nombre: nombre, email: email, passwordHash: hashedPassword })
    req.session.currentUser = usuario;
    let transporter = await nodemailer.createTransport({
      host: "smtp.eu.mailgun.org",
      port: 25,
      auth: {
        user: process.env.USER_MG,
        pass: process.env.PASS_MG
      },
    });
    transporter.sendMail({
      from: 'info@my-menu.site',
      to: email,
      subject: "¡Bienvenido a MyMenu!",
      html: `<h2><b>Hola</b> ${nombre}, </h1>
      <h3>Bienvenido a MyMenu</h3>
      
      <br/>
      <p>Ahora podrás introducir tu carta o menú del dia y mostrarlo a tus clientes de manera inmediata.</p>
      <br/>
      <p>100% higienico y rapido!</p>
      <img src="/images/mymenu.png" alt="logo Mymenu">
      `
      
    }, (err, info) => {
      console.log(err);
  });

    res.redirect("/user-Profile")
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).render('auth/signup', {
        errorMessage: "Formato de email inválido, intentelo de nuevo."
      });
      //Error de duplicidad
    } else if (error.code === 11000) {
      res.status(400).render('auth/signup', {
        errorMessage: 'username o correo ya existen, por favor pruebe uno nuevo.'
      });

    } else {
      next(error);
    }
  }
})

//Ruta GET Inicio sesion
router.get('/login', (req, res) => res.render('auth/login'))

//Ruta POST inicio sesion
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Por favor introduzca ambos campos para continuar'
    });
    return;
  }
  const usuario = await Usuario.findOne({ email })
  if (!usuario) {
    res.render('auth/login', {
      errorMessage: 'Este Email no esta registrado, pruebe otro'
    });
    return;
  } else if (await bcrypt.compare(password, usuario.passwordHash)) {
    req.session.currentUser = usuario
    res.redirect("user-profile")
  } else {
    res.render('auth/login', {
      errorMessage: 'Contraseña incorrecta.'
    });
  }
});

//Ruta google
router.get("/auth/google", passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ]
})
);
router.get("/auth/google/callback", 
passport.authenticate("google", {
  successRedirect: "/user-profile",
  failureRedirect: "/login" // hacia dónde debe ir si falla?

})
);

//Ruta Facebook
router.get('/auth/facebook', passport.authenticate('facebook',
));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/user-profile',
    failureRedirect: '/login'
  }));

//Ruta POST logout
router.post('/logout', (req, res, next) => {
  req.session.destroy();
  console.log(session)
  res.redirect('/');
});


module.exports = router;