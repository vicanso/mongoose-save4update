const mongoose = require('mongoose');

const save4update = require('.');

const {Schema} = mongoose;

const collection = 'book';
let BookModel = null;
let bookSchema = null;

beforeAll(() => {
  const schema = new Schema(
    {
      name: String,
    },
    {
      timestamps: true,
    },
  );
  schema.plugin(save4update, {
    collection,
  });
  bookSchema = schema;
  BookModel = mongoose.model('Book', schema);
  mongoose.connect('mongodb://localhost/mongoose-stats');
  return BookModel.remove({});
});

afterAll(() => {
  mongoose.disconnect();
});

test('save data', () => {
  let eventData = null;
  bookSchema.on('save4update', data => {
    eventData = data;
  });

  const doc = new BookModel({
    name: 'test',
  });
  // 生成新的数据，不触发 save4update
  return doc.save().then(() => {
    expect(eventData).toBeNull();
    bookSchema.removeAllListeners('save4update');
    expect(doc.name).toBe('test');
  });
});

test('save for no data update', () => {
  let eventData = null;
  bookSchema.on('save4update', data => {
    eventData = data;
  });
  return BookModel.findOne({})
    // 未做数据更新时，不触发 save4update
    .then(doc => doc.save())
    .then(() => {
      expect(eventData).toBeNull();
      bookSchema.removeAllListeners('save4update');
    });
});

test('save for update', () => {
  bookSchema.once('save4update', data => {
    expect(data.collection).toBe(collection);
    expect(data.original.name).toBe('test');
    expect(data.updated.name).toBe('new-test');
  });
  return BookModel.findOne({})
    .then(doc => {
      // eslint-disable-next-line
      doc.name = 'new-test';
      return doc.save();
    })
    .then(doc => {
      expect(doc.name).toBe('new-test');
    });
});
