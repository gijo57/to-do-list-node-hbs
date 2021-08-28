require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./models/todo');
const hbs = require('hbs');

const app = express();

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  Todo.find().then((todos) => res.render('home', { todos }));
});

app.post('/create-to-do-list-item', (req, res) => {
  const task = req.body.task;
  Todo.create({ task })
    .then((task) => {
      return Todo.find();
    })
    .then((todos) => {
      console.log(todos);
      res.redirect('/');
    });
});

app.post('/:id/delete', (req, res) => {
  const id = req.params.id;
  Todo.findByIdAndDelete(id).then(() => {
    res.redirect('/');
  });
});

app.post('/:id/update', (req, res) => {
  const id = req.params.id;
  const task = req.body.task;

  Todo.findByIdAndUpdate(id, { task }).then(() => {
    res.redirect('/');
  });
});

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
