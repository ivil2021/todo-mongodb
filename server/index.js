//global modules
const express = require('express'); // ПОДКЛЮЧЕНИЕ ЭКСПРЕСС
const bodyParser = require('body-parser');
// const cors = require('cors');
//init app
const app = express(); // СОЗДАНИЕ ОБЪЕКТА НАШЕГО ПРИЛОЖЕНИЯ

//local modules
const config = require('./config.json')[process.env.NODE_ENV];
const route = require('./route');

//------------//
const db = require('./db');

// const Book = require("./db//models/book");
const Todo = require('./db//models/todo');

//------------//

//------------//
app.get('/todos', async (req, res, next) => {
  try {
    const todos = await Todo.find(); //.populate("author").populate('genre');
    res.send(books);
  } catch (e) {
    next(e);
  }
});
//------------//

//top level middlewares
app.use(cors());

app.use(bodyParser.json());

app.use('/', route); // the request should get response here -> all middlewares below will not be executed. But... uncomment the 2nd next() above... :(

//The 404 Route (ALWAYS Keep this as the last route)
app.use(function (req, res) {
  res.status(404).send('wrong way!!!');
});

app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`);
});
