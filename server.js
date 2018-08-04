"use strict";
// Load array of notes
const express = require("express");
const app = express();
const { PORT } = require("./config");
// const { requestLogger } = require('./middleware/logger');
const morgan = require("morgan");
const itemsRouter = require("./router/notes.router");

// INSERT EXPRESS APP CODE HERE...

// app.use(requestLogger);
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("common"));
app.use("/api/notes", itemsRouter);

app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  res.status(404).json({ message: "Not Found" });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

if(require.main === module) {
  app.listen(PORT, function() {
    console.info(`Server listening on ${this.address().port}`);
  }).on("error", err => {
    console.log(err);
  });
}

module.exports = app; // Export for testing