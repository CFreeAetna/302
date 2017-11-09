const express = require('express');
const app = express();
var path = require('path');

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/index.html`));
});

let isAuthorized = false;

// Once
app.get('/first', (req, res) => {
  console.log('arrived at first');
  res.redirect('http://localhost:3040/second');
});

// Twice
app.get('/second', (req, res) => {
  console.log('arrived at second');
  res.redirect('http://localhost:3040/third');
});

// Three times
app.get('/third', (req, res) => {
  console.log('arrived at third');
  res.redirect('http://localhost:3040/final');
});

// Final
app.get('/final', (req, res) => {
  console.log('arrived at final');
  res.send({sound: 'meow'});
});

// API link
app.get('/api_request', (req, res) => {
  console.log('arrived at api');

  if (isAuthorized) {
    res.send('Success!');
  } else {
    res.set('Location', 'http://localhost:3040/api_auth');
    res.status(401)
      .send('Unauthorized');
  }
});

// Auth link
app.get('/api_auth', (req, res) => {
  console.log('triggered re-auth, resolve to home page');
  isAuthorized = true;
  res.redirect('http://localhost:3040/');
});

app.listen(3040, () => {
  console.log('Server running');
});