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

router.get('/', (req, res) => {
  res.render('index', { message: req.flash('error'), success: req.flash('success')[0] });
});

router.post(
  '/log',
  passport.authenticate('local', {
    successRedirect: '/galeria',
    failureRedirect: '/',
    failureFlash: true,
  })
);

router.get('/galeria', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('galeria', { user: req.user });
  } else {
    res.redirect('/');
  }
});

router.get('/logout', (req, res) => {
  const successMessage = 'Você saiu da sua conta';
  req.logout();
  res.render('index', { message: null, success: successMessage });
});

router.get('/signup', (req, res) => {
  res.render('signup', { message: req.flash('error') });
});

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
