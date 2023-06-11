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
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true,
  })
);

router.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('dashboard', { user: req.user });
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
    };
    users.push(user);
    // Aguarde a conclusão da função writeData antes de redirecionar
    await writeData(users);
    req.flash('success', 'Conta criada com sucesso. Faça login para continuar.');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Ocorreu um erro ao tentar criar a conta');
    res.redirect('/signup');
  }
});

router.get('/data', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const users = await readData();
      res.render('data', { users });
    } catch (err) {
      console.error("Erro ao ler dados do MongoDB:", err);
      res.redirect('/');
    }
  } else {
    res.redirect('/');
  }
});

module.exports = router;
