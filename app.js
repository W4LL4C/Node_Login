const nodemailer = require('nodemailer');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const app = express();



// Definir EJS como mecanismo de visualização

app.set('view engine', 'ejs');


// Rota principal
app.get('/index', (req, res) => {
    res.render('index');
  });
//Outras Rotas
  app.get('/galeria', (req, res) => {
    res.render('galeria');
  });

  app.get('/eventos', (req, res) => {
    res.render('eventos');
  });

  app.get('/login', (req, res) => {
    res.render('login');
  });

  app.get('/cad', (req, res) => {
    res.render('cad');
  });

  app.get('/cadastrobike', (req, res) => {
    res.render('cadastrobike');
  });

  app.get('/cadastrogeral', (req, res) => {
    res.render('cadastrogeral');
  });
  

// Iniciar o servidor

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
