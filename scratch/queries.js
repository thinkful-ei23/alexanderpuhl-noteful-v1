'use strict';

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);


// notes.delete(1009, (err) => {
//   if (err) {
//     console.error(err);
//   }
// });


// GET Notes with search
notes.filter('cats', (err, list) => {
  if (err) {
    console.error(err);
  }
  console.log(list);
});

// GET Notes by ID
notes.find(1005, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

// PUT (Update) Notes by ID
const updateObj = {
  title: 'New Title',
  content: 'Blah blah blah'
};

notes.update(1005, updateObj, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

// const newObject = {
//   id: 1010,
//   title: 'New Title 2',
//   content: 'Blah Blah Blah Blah'
// };

// notes.create(newObject, (err, item) => {
//   if (err) {
//     console.error(err);
//   }
//   console.log(item);
// });

