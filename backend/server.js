const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// middleware
app.use(bodyParser.json());
app.use(cors());

// Models
const Todo = require('./models/todo');


app.get('/todos', async (req, res) => {
    try {
      const todos = await Todo.find().sort({ order: 1 });
      res.json(todos);
    } catch (err) {
      console.log(err);
    }
  });

app.post('/todo/new', async (req, res) => {
	try {
		const todo = new Todo({
			text: req.body.text
		});

		await todo.save();
		res.status(201).json(todo);
	} catch (err) {
		console.error(err);
	}
});

app.delete('/todo/delete/:id', async (req, res) => {
    try {
      const result = await Todo.findByIdAndDelete(req.params.id);
      res.json({ result });
    } catch (err) {
      console.log(err);
    }
  });

app.get('/todo/complete/:id', async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      todo.complete = !todo.complete;
      const savedTodo = await todo.save();
      res.json(savedTodo);
    } catch (err) {
      console.log(err);
    }
  });


  app.post("/todos/updateOrder", async (req, res) => {
    const { todos } = req.body;
  
    try {
      for (let i = 0; i < todos.length; i++) {
        await Todo.findByIdAndUpdate(todos[i]._id, { order: i });
      }
  
      const updatedTodos = await Todo.find().sort({ order: 1 });
      console.log(updatedTodos)
      res.json(updatedTodos);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });
  

mongoose.connect(
  "mongodb://localhost/todo-DB",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  () => {
    console.log("connected to DB");
  }
);

app.listen(3001, () => {
  console.log("Server is live");
});
