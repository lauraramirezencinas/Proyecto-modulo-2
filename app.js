require('dotenv').config();
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

//Conexion bases de datos
mongoose
  .connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
const crearSession=require('./configs/session.config');
crearSession(app);
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});


// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


hbs.registerPartials(path.join(__dirname, 'views/partials'));
hbs.registerPartials(__dirname + 'views/partials');



// Titulo
app.locals.title = 'MyMenu';



const index = require('./routes/index');
app.use('/', index);

const restaurante = require('./routes/restaurante');
app.use('/', restaurante);

const menu = require('./routes/menu');
app.use('/', menu);

const categoria = require('./routes/categoria');
app.use('/', categoria);

const elementoMenu = require('./routes/elementoMenu');
app.use('/', elementoMenu);

const listado = require('./routes/listado');
app.use('/', listado);




module.exports = app;