const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  name: { type: String, required: true },
  isDone: { type: Boolean, default: false },
});

//Export model
module.exports = mongoose.model('Todo', TodoSchema);
