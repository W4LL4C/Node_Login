const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { readData, writeData, deleteData } = require('../filestorage');

let users = [];

// Carregar os dados dos usuários do MongoDB
async function loadUsers() {
  try {
    users = await readData();
  } catch (err) {
    console.error("Erro ao ler dados do MongoDB:", err);
  }
}


loadUsers();

/* ROTA PARA O INDEX UTILIZANDO O GET  
*/
router.get('/', (req, res) => {
  res.render('index', { message: req.flash('error'), success: req.flash('success')[0] });
});

/* ROTA PARA O LOGIN UTILIZANDO O GET  
*/
router.get('/login', (req, res) => {
  res.render('login');
});

/* ROTA PARA O FORMULARIO UTILIZANDO O GET  
*/
router.get('/cadastrogeral', (req, res) => {
  res.render('cadastrogeral');
});

/* ROTA PARA FAZER A AUTENTIFICAÇÃO DO USUARIO,
   SUCESSO DIRECIONA PARA A GALERIA
   FALHA DIRECIONA PARA O INDEX
*/
router.post(
  '/log',
  passport.authenticate('local', {
    successRedirect: '/galeria',
    failureRedirect: '/',
    failureFlash: true,
  })
);

/* ROTA PARA A GALERIA
   FAZ UMA REQUISIÇÃO PARA VER SE O USUARIO ESTÁ AUTENTICADO
   SIM RENDERIZA A GALERIA
   FALHA DIRECIONA PARA O INDEX
*/
router.get('/galeria', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('galeria', { user: req.user });
  } else {
    res.redirect('/');
  }
});

/* ROTA PARA O CADASTRO DAS BIKES
   FAZ UMA REQUISIÇÃO PARA VER SE O USUARIO ESTÁ AUTENTICADO
   SIM RENDERIZA O FORMULARIO DAS BIKES
   FALHA DIRECIONA PARA O INDEX
*/
router.get('/cadbike', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('cadastrobike', { user: req.user });
  } else {
    res.redirect('/');
  }
});

/* ROTA PARA OS EVENTOS
   FAZ UMA REQUISIÇÃO PARA VER SE O USUARIO ESTÁ AUTENTICADO
   SIM RENDERIZA OS EVENTOS
   FALHA DIRECIONA PARA O INDEX
*/

router.get('/eventos', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('eventos', { user: req.user });
  } else {
    res.redirect('/');
  }
});

/* ROTA PARA  SAIR DA CONTA DE USUARIO
   TE ENCAMINHA PARA O INDEX
*/
router.get('/logout', (req, res) => {
  const successMessage = 'Você saiu da sua conta';
  req.logout();
  res.render('index', { message: null, success: successMessage });
});

/*  ROTA PARA O CADASTRO DE USUARIO
    CAPTURA OS DADOS DO FORMULARIO NO ARQUIVO CADASTRO GERAL E SALVA NO BANCO DE DADOS MONGO DB
*/

router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      id: Date.now().toString(),
      email: req.body.email,
      password: hashedPassword,
      fullname: req.body.fullname,
      phone: req.body.phone,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country
    };
    users.push(user);
    // Aguarde a conclusão da função writeData antes de redirecionar
    await writeData(users);
    req.flash('success', 'Conta criada com sucesso. Faça login para continuar.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Ocorreu um erro ao tentar criar a conta');
    res.redirect('/cadastrogeral');
  }
});


module.exports = router;
