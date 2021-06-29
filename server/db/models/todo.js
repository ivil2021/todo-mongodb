const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true }, //https://en.wikipedia.org/wiki/International_Standard_Book_Number
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
});

//Export model
module.exports = mongoose.model('Book', BookSchema);
