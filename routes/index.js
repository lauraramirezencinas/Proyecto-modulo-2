const express = require('express');
const router = express.Router();
const saltRounds = 10
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const Usuario = require('../models/modelo-usuario');
const session = require('express-session');
const Restaurante = require('../models/modelo-restaurante');


/* GET home page */
router.get('/', (req, res, next) => {
  if(req.query.error){

    res.render('index',{errorMessage: req.query.error})
  }
  res.render('index');
});
//Get user-profile
router.get("/user-Profile", (req, res) => {
  Usuario.find({
      userId: req.session.currentUser
    })
    .then(usuario => {
      Restaurante.find({
        userId: req.session.currentUser
      })
        .then(restaurante => {
          console.log(usuario, req.session.currentUser)
          console.log(session)
          res.render("auth/user-profile", {
            usuario: req.session.currentUser,
            restaurante: restaurante
          })
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

//Ruta GET registro
router.get("/signup", (req, res) => res.render("auth/signup"))

//Ruta POST registro
router.post("/signup", (req, res) => {

  const {
    nombre,
    email,
    password
  } = req.body
  //Comprobracion de que todos los campos han sido introducidos
  if (!nombre || !email || !password) {
    res.render("auth/signup", {
      errorMessage: "Los campos username, email y contraseña son obligatorios"
    })
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
  bcrypt.genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      console.log("La hash es", hashedPassword)
      //Crear usuario 
      Usuario.create({
          nombre: nombre,
          email: email,
          passwordHash: hashedPassword
        })
        .then(data => {
          console.log("Usuario creado con exito. Datos:", data)
          res.redirect("/user-Profile")
        })
        .catch(error => {
          //Error de validacion
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

        })

    })

})
//Ruta GET Inicio sesion
router.get('/login', (req, res) => res.render('auth/login'))

//Ruta POST inicio sesion
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Por favor introduzca ambos campos para continuar'});
    return;
  }
  const usuario = await Usuario.findOne({ email })
  if (!usuario) {
    res.render('auth/login', {
      errorMessage: 'Este Email no esta registrado, pruebe otro'});
    return;
  } else if (await bcrypt.compare(password, usuario.passwordHash)) {
    req.session.currentUser = usuario
    res.redirect("user-profile")
  } else {
    res.render('auth/login', {
      errorMessage: 'Contraseña incorrecta.'});
  }
});

//Ruta POST logout
router.post('/logout', (req, res, next) => {
  req.session.destroy();
  console.log(session)
  res.redirect('/');
});

module.exports = router;