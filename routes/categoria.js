const {
  Router
} = require('express');
const router = new Router();
const mongoose = require('mongoose');
const Categoria = require('../models/modelo-categoria');
const Menu = require('../models/modelo-menu');
const Restaurante = require('../models/modelo-restaurante');

//Ruta GET restaurante específico
router.get('/restaurante/:id', async (req, res, next) => {
  const restaurante = await Restaurante.findById(req.params.id);
  const menus = await Menu.find({
    idRestaurante: req.params.id
  });

  let categorias = null;
  let idMenu = req.query.idmenu;
  for (let i =0;i<menus.length;i++){
    if (menus[i]._id == idMenu){
      menus[i].seleccionado =true;
    } else{
      menus[i].seleccionado =false;
    }
  }
  let menuSeleccionado=null;
  if (typeof (idMenu) !== "undefined") {
    categorias = await Categoria.find({
      idMenu: idMenu
    });
    menuSeleccionado= await Menu.findById(idMenu);
    menuSeleccionado.isCarta = menuSeleccionado.tipoDeMenu =="carta";
  }

  res.render('menu/crearMenu', {
    categorias: categorias,
    menus: menus,
    menuSeleccionado:menuSeleccionado,
    restaurante: restaurante,
    idMenu: idMenu

  });
})


// Ruta POST crear categorias de restaurante
router.post('/menu/:id/crear', async (req, res, next) => {
  try {
    const nombreCategoria = req.body.nombreCategoria;
    const idRestaurante = req.params.id;
    const idMenu = req.body.idMenu;
    const categoria = await Categoria.create({
      nombreCategoria: nombreCategoria,
      idRestaurante: idRestaurante,
      idMenu: idMenu
    })
    res.redirect(`/restaurante/${idRestaurante}?idmenu=${idMenu}`)
  } catch (err) {
    next(err)
  }
})

//Ruta POST para editar categoria
router.post('/menu/:id', async (req, res, next) => {
  try {
    const nombreCategoria = req.body.nombreCategoria;
    const categoriaEditada = await Categoria.update({
      _id: req.params.id
    }, {
      $set: {
        nombreCategoria
      }
    }, {
      new: true
    });
    const id = req.params.id;
    res.redirect(`/menu/${id}/editar`)
  } catch (err) {
    next(err)
  }
})


//Ruta POST para borrar categoria
router.post('/restaurante/:id/borrar', async (req, res, next) => {
  try {
    const categoriaBorrada = await Categoria.findByIdAndRemove(req.params.id);
    const id = categoriaBorrada.idRestaurante;
    res.redirect(`/restaurante/${id}`)
  } catch (err) {
    next(err)
  }
});


module.exports = router;