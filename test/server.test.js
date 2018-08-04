"use strict";

const app = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Express static", function(){
  it("GET request '/' should return the index page", function() {
    return chai.request(app)
      .get("/")
      .then(function(res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});

describe("404 handler", function() {
  it("should respond with 404 when given a bad path", function() {
    return chai.request(app)
      .get("/DOES/NOT/EXIST")
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});

describe("GET /api/notes", function() {
  it("should return the default of 10 Notes as an array", function() {
    return chai.request(app)
      .get("/api/notes")
      .then(function(res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.equal(10);
      });
  });
  it("should return an array of objects with the id, title, and content", function() {
    return chai.request(app)
      .get("/api/notes")
      .then(function(res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        res.body.forEach(function(item) {
          expect(item).to.be.an("object");
          expect(item).to.have.all.keys("id", "title", "content");
        });
      });
  });
  it("should return correct search result for a valid query", function() {
    return chai.request(app)
      .get("/api/notes/?searchTerm=government")
      .then(function(res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length(1);
        expect(res.body[0].title + " " + res.body[0].content).to.include("government");
      });
  });
  it("should return an empty array for an incorrect query", function() {
    return chai.request(app)
      .get("/api/notes/?searchTerm=ewriusdlfmgb")
      .then(function(res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length(0);
      });
  });
});

describe("GET /api/notes/:id", function() {
  // ask TA's if we understand what they want.... !!!
  it("should return correct note object with id, title, and content for a given id", function() {
    return chai.request(app)
      .get("/api/notes/1001")
      .then(function(res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        const expectedKeys = ["id", "title", "content"];
        expect(res.body).to.include.keys(expectedKeys);
        expect(res.body.id).to.equal(1001);
      });
  });
  // ask TA's if we understand what they want.... !!!
  it("should respond with a 404 for an invalid id", function() {
    return chai.request(app)
      .get("/api/notes/999")
      .then(function(res) {
        expect(res).to.exist;
        expect(res).to.have.status(404);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body).to.include.keys("message");
        expect(res.body.message).to.equal("Not Found");
      });
  });
});

describe("POST /api/notes", function() {
  it("should create and return a new item with location header when provided valid data", function() {
    const newItem = {"title": "Blah Blah","content": "more blah blah"};
    return chai.request(app)
      .post("/api/notes")
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body).to.include.keys("title","content","id");
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(
          Object.assign(newItem, {id: res.body.id})
        );
      });
  });
  it("should return an object with a message property 'Missing title in request body' when missing 'title' field", function() {
    const newItem2 = {"title": "","content": "more blah blah"};
    return chai.request(app)
      .post("/api/notes")
      .send(newItem2)
      .then(function(res) {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body).to.include.keys("message","error");
        expect(res.body.message).to.equal("Missing `title` in request body");
      });
  });
});

describe("PUT /api/notes/:id", function() {
  it("should update and return a note object when given valid data", function() {
    const updatedItem = {"title": "Blah Blah","content": "more blah blah"};
    return chai.request(app)
      .put("/api/notes/1005")
      .send(updatedItem)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body).to.include.keys("id","title","content");
      });
  });
  it("should respond with a 404 for an invalid id", function() {
    const updatedItem2 = {"title": "Blah Blah","content": "more blah blah"};
    return chai.request(app)
      .put("/api/notes/DOESNOTEXIST")
      .send(updatedItem2)
      .then(function(res) {
        expect(res).to.have.status(404);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body).to.include.keys("message");
        expect(res.body.message).to.equal("Not Found");
      });
  });
  it("should return an object with a message property 'Missing title in request body' when missing 'title' field", function() {
    const updatedItem3 = {"title": "","content": "more blah blah"};
    return chai.request(app)
      .put("/api/notes/1006")
      .send(updatedItem3)
      .then(function(res) {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body).to.include.keys("message");
        expect(res.body.message).to.equal("Missing `title` in request body");
      });
  });
});

describe("DELETE /api/notes/:id", function(){
  it("should delete an item by id", function(){
    return chai.request(app)
      .delete("/api/notes/1003")
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});