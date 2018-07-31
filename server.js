'use strict';

// Load array of notes
const express = require('express');
const app = express();
const data = require('./db/notes');
const { PORT } = require('./config');
const { requestLogger } = require('./middleware/logger');

// INSERT EXPRESS APP CODE HERE...

app.use(express.static('public'));
app.use(requestLogger);

app.get('/api/notes', (req, res) => {
  const sTerm = req.query.searchTerm;
  if (sTerm) {
    res.json(data.filter(item => item.title.includes(sTerm)));
  } else {
    res.json(data);
  }
});

app.get('/api/notes/:id', (req, res) => {
  res.json(data.find(item => item.id === Number(req.params.id)));
});

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});


app.listen(PORT, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.log(err);
});