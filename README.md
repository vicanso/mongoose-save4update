# mongoose-save4update

Get the data(new/old) of update fields by save function

[![Build Status](https://travis-ci.org/vicanso/mongoose-save4update.svg?branch=master)](https://travis-ci.org/vicanso/mongoose-save4update)
[![npm](http://img.shields.io/npm/v/mongoose-save4update.svg?style=flat-square)](https://www.npmjs.org/package/mongoose-save4update)
[![npm](http://img.shields.io/npm/v/mongoose-save4update.svg?style=flat-square)](https://www.npmjs.org/package/mongoose-save4update)

## API

save for update event data

- `collection` the mongodb collection
- `original` the original data
- `updated` the update data

```js
const mongoose = require('mongoose');
const save4update = require('mongoose-save4update');

const {Schema} = mongoose;
const schema = new Schema({
  name: String,
}, {
  timestamps: true,
});
const Book = mongoose.model('Book', schema);
schema.plugin(save4update, {
  collection: 'Book',
});
schema.on('save4update', (data) => {
  // { updated: { name: 'new name' },
  //     original: { name: 'name' },
  //     collection: 'Book' }
  console.info(data);
});

(async () => {
  const doc = await Book.findOne({});
  doc.name = 'new name';
  await doc.save();
})();
```