'use strict';

// Load array of notes
const express = require('express');
const data = require('./db/notes');
const app = express();

// INSERT EXPRESS APP CODE HERE...

app.listen(8080, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.log(err);
});

app.get('/api/notes', (req, res) => {
  res.json(data);
});