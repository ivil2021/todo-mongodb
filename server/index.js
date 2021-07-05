//global modules
const express = require('express'); // ПОДКЛЮЧЕНИЕ ЭКСПРЕСС
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express(); // СОЗДАНИЕ ОБЪЕКТА НАШЕГО ПРИЛОЖЕНИЯ

const db = require('./db');
// const Todo = require('./db//models/todo');
const Todo = require('./db/models/todo');

//local modules
const config = require('./config.json')[process.env.NODE_ENV];

app.use(cors());

//------------//
app.get('/todos', async (req, res, next) => {
  try {
    // const todos = await todos.find();
    const todos = await Todo.find();
    res.send(todos);
  } catch (e) {
    next(e);
  }
});
//------------//
/////-----/////

// // Function LIST_OF_TODOS_FROM_DB will return the list of todos from server
// const LIST_OF_TODOS_FROM_DB = (req, res, next) => {
//   Todo.find();
//   console.log(Todo.find());
//     .then((response) => {
//       res.json({
//         response,
//       });
//     })
//     .catch((error) => {
//       res.json({
//         message: 'An error occured!',
//       });
//     });
// };
// /////-----/////

//------------//
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });
    res.send(todo);
  } catch (e) {
    console.log(e);
    res.status(404).send({ message: "Todo doesn't exist!" });
  }
});

/////-----/////
// const db = client.db('db_name')
//const TODOS_COLLECTION = client.db('dev_demo_db').createCollection('todos');
/////-----/////

app.post('/todos', bodyParser.json(), async (req, res, next) => {
  try {
    const todo = new Todo({
      name: req.body.name,
    });

    await todo.save();

    res.send(todo);
  } catch (e) {
    next(e);
  }
});
//------------//

//------------//
app.delete('/todos/:id', async (req, res) => {
  try {
    await Todo.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch (e) {
    res.status(404).send({ message: "Todo doesn't exist!" });
  }
});
//------------//

//------------//
app.patch('/todos/:id', bodyParser.json(), async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });

    if (req.body.title) {
      todo.title = req.body.title;
      await todo.save();
    }

    res.send(todo);
  } catch (e) {
    console.log(e);
    res.status(404).send({ message: "Todo doesn't exist!" });
  }
});
//------------//

//------------//
//The 404 Route (ALWAYS Keep this as the last route)
app.use(function (req, res) {
  res.status(404).send({ message: 'PAGE NOT FOUND!' });
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`);
});
