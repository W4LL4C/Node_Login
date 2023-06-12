const nodemailer = require('nodemailer');//nao
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const app = express();
const indexRouter = require('./routes/index');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/', indexRouter);

const { readData, writeData, findUserByEmail, findUserById } = require('./filestorage'); // Adicione 'findUserByEmail' na importação

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await findUserByEmail(email); // Use a função findUserByEmail aqui
      if (!user) {
        return done(null, false, { message: 'Usuário não encontrado' });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Senha incorreta' });
        }
      });
    } catch (err) {
      console.error(err);
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id); // Use a função findUserById aqui
    done(null, user);
  } catch (err) {
    console.error(err);
    done(err, null);
  }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

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

