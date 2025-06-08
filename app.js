const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/cookie1', (req, res) => {
  const currentTimestamp = Date.now();

  if (!req.cookies.token) {
    res.cookie('token', 'abc123', { maxAge: 86400000 });
  }

  const lastVisit = req.cookies.last_visit_timestamp;
  res.cookie('last_visit_timestamp', currentTimestamp.toString(), { maxAge: 86400000 });

  let timeSinceLastVisit = 0;
  if (lastVisit) {
    timeSinceLastVisit = Math.floor((currentTimestamp - parseInt(lastVisit)) / 1000);
  }

  res.render('cookie1', {
    token: req.cookies.token || 'abc123',
    lastVisit,
    timeSinceLastVisit
  });
});


app.get('/remove-cookie', (req, res) => {
  res.render('remove-cookie');
});

app.post('/remove-cookie', (req, res) => {
  const { cookieName } = req.body;

  if (cookieName) {
    res.clearCookie(cookieName);
  }

  res.redirect('/home');
});

app.get('/remove-cookie-ajax', (req, res) => {
  res.render('remove-cookie-ajax');
});

app.post('/remove-cookie-ajax', (req, res) => {
  const { cookieName } = req.body;

  if (!cookieName) {
    return res.status(400).json({ success: false, message: 'Cookie name is required.' });
  }

  res.clearCookie(cookieName);
  res.json({ success: true, message: `Cookie "${cookieName}" has been removed.` });
});

app.get('/display-cookies', (req, res) => {
  const token = req.cookies.token;
  const lastVisit = req.cookies.last_visit_timestamp;

  let timeSinceLastVisit = 0;

  if (lastVisit) {
    const now = Date.now();
    timeSinceLastVisit = Math.floor((now - parseInt(lastVisit)) / 1000);
  }

  res.render('cookie1', {
    token,
    lastVisit,
    timeSinceLastVisit
  });
});

app.get('/add-cookie', (req, res) => {
  res.render('add-cookie');
});

app.post('/add-cookie', (req, res) => {
  const { cookieName, cookieValue } = req.body;

  if (cookieName && cookieValue) {
    res.cookie(cookieName, cookieValue, { maxAge: 86400000 });
  }

  res.redirect('/home');
});



app.get('/show-cookies', (req, res) => {
  const cookies = req.cookies;
  res.render('show-cookies', { cookies });
});

app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
