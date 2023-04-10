require('dotenv').config();
require('./config/passport');
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const compression = require('compression');
const helmet = require('helmet');
const router = require('./routes/mainRouter');
const createHandlebarsConfig = require('./config/handlebarsConfig');

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));

const mongoDbUrl = process.env.MONGO_DB_URL;
mongoose.connect(mongoDbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const hbs = exphbs.create(createHandlebarsConfig());
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static('public'));

const sessionStore = new MongoStore({
  mongooseConnection: db,
  collection: 'session',
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 7000 * 60 * 60 * 24,
    },
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(compression());
app.use('/', router);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
});

app.listen(process.env.PORT || 3000);
