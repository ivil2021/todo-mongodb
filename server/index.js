//global modules
const express = require("express"); // ПОДКЛЮЧЕНИЕ ЭКСПРЕСС
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express(); // СОЗДАНИЕ ОБЪЕКТА НАШЕГО ПРИЛОЖЕНИЯ

const db = require("./db");
const Todo = require("./db/models/todo");

//local modules
const config = require("./config.json")[process.env.NODE_ENV];

app.use(cors());

/////----- Reading the list of todos -----/////
// app.get("/todos", async (req, res, next) => {
// if (req.body.length !== 0) {
app.get("/todos", bodyParser.json(), async (req, res) => {
  try {
    // const todos = await todos.find();
    const todos = await Todo.find();
    res.send(todos);
  } catch (e) {
    res.status(500).send({ message: "Todo list cannot be read!" });
  }
});
// }
/////----- Reading the list of todos -----/////

/////----- Reading the certain todo -----/////
// if (req.body.length !== 0) {
app.get("/todos/:id", bodyParser.json(), async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });
    res.send(todo);
  } catch (e) {
    console.log(e);
    res.status(404).send({ message: "Todo doesn't exist!" });
  }
});
// }
/////----- Reading the certain todo -----/////

/////----- Adding a new todo -----/////
app.post("/todos", bodyParser.json(), async (req, res, next) => {
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
/////----- Adding a new todo -----/////

/////----- Deleting the certain todo by it's id -----/////
/////-----/////
// app.delete("/todos/:id", async (req, res) => {
//   try {
//     await Todo.deleteOne({ _id: req.params.id });
//     res.status(204).send();
//   } catch (e) {
//     res.status(404).send({ message: "Todo doesn't exist!" });
//   }
// });
/////-----/////
app.delete("/todos", bodyParser.json(), async (req, res) => {
  if (req.body.length !== 0) {
    try {
      for (i = 0; i < req.body.ids.length; i++) {
        await Todo.deleteOne({ _id: req.body.ids[i] });
      }
      res.status(204).send();
    } catch (e) {
      res.status(404).send({ message: "Todo doesn't exist!" });
    }
    return Promise.resolve();
  }

  if (req.body.length === 0) {
    try {
      const collection = db.collection("todos");
      await collection.drop(function (err, result) {
        if (err) {
          return res.status(422).send({ message: "Todo doesn't exist!" });
        }
        res.status(204).send();
      });
    } catch (e) {
      res.status(404).send({ message: "Collection doesn't exist!" });
    }
    return Promise.resolve();
  }
});
/////----- Deleting the certain todo by it's id -----/////

/////----- Updating the certain todo by it's id -----/////
// app.patch("/todos/:id", bodyParser.json(), async (req, res) => {
//   try {
//     const todo = await Todo.findOne({ _id: req.params.id });

//     if (req.body.title) {
//       todo.title = req.body.title;
//       await todo.save();
//     }

//     res.send(todo);
//   } catch (e) {
//     console.log(e);
//     res.status(404).send({ message: "Todo doesn't exist!" });
//   }
// });
// app.patch("/todos/:id", bodyParser.json(), async (req, res) => {

app.patch("/todos/:id", bodyParser.json(), async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });

    todo.isDone = !req.body.isDone;
    await todo.save();

    res.send(todo);
  } catch (e) {
    console.log(e);
    res.status(404).send({ message: "Todo doesn't exist!" });
  }
});
/////----- Updating the certain todo by it's id -----/////

//The 404 Route (ALWAYS Keep this as the last route)
app.use(function (req, res) {
  res.status(404).send({ message: "PAGE NOT FOUND!" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`);
});
