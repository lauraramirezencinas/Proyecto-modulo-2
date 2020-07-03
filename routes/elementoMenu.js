const {
  Router
} = require('express');
const router = new Router();
const mongoose = require('mongoose');
const ElementoMenu = require('../models/modelo-elemento-menu');
const Categoria = require('../models/modelo-categoria');
const Menu = require('../models/modelo-menu');

//Ruta POST elemento menú
router.post('/elemento', async (req, res, next) => {
  try {
    const {
      nombre,
      precio,
      idCategoria
    } = req.body;
    const elemento = await ElementoMenu.create({
      nombre: nombre,
      precio: precio,
      idCategoria: idCategoria
    });
    console.log("Elemento de la categoria creada con exito: ", elemento);
    res.redirect(`/menu/${idCategoria}/editar`)
  } catch (err) {
    next(err)
  }
});

//Ruta GET actualiza los elementos del menu 
router.get('/menu/:id/editar', async (req, res, next) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    const menu = await Menu.findOne({
      _id: categoria.idMenu
    });
    console.log(menu)
    const elementosMenu = await ElementoMenu.find({
      idCategoria: req.params.id
    });
    res.render('menu/editMenu', {
      elementosMenu: elementosMenu,
      categoria: categoria,
      idCategoria: req.params.id,
      menu: menu,
      isCarta: menu.tipoDeMenu == 'carta'
    })
  } catch (err) {
    next(err)
  }
})

//Ruta POST borrar elemento específico del menú
router.post('/elemento/:id/borrar', (req, res, next) => {
  ElementoMenu.findByIdAndRemove(req.params.id)
    .then(elementoMenu => {
      res.redirect(`/menu/${elementoMenu.idCategoria}/editar`)
      console.log("Elemento borrado con exito", elementoMenu)
    })
    .catch(e => console.log(e))
});

// Ruta GET mostrar elemento específico del menú 
router.post('/elemento/:id/editar', async (req, res, next) => {
  try {
    const {
      nombre,
      precio
    } = req.body;
    const elemento = await ElementoMenu.findByIdAndUpdate(req.params.id, {
      $set: {
        nombre,
        precio
      }
    }, {
      new: true
    });
    console.log(elemento)
    res.redirect(`/menu/${elemento.idCategoria}/editar`)
  } catch (err) {
    next(err)
  }
})


module.exports = router;