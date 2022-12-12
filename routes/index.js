const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('sequelize');

// Handler function
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error) {
      res.status(500).send(error);
    }
  }
};

/* GET home page. */
router.get('/', (req, res) => {
  // res.render('index', { title: 'Express' });
    res.redirect('/books');
});
// GET books page
router.get('/books', asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    // console.log(books);
    res.render('index', { books, title: 'Books' });
}));


// GET create a book form
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: 'New Book' });
}));
// POST a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('new-book', { book, errors: error.errors, title: 'New Book' });
    } else {
      throw error;
    }
  }
}));


// GET book detail form
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book, title: 'Update Book' })
  } else {
    res.status(404);
  }
}));
// POST updated book info in the database
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.status(404);
    }
  } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render('update-book', { book, errors: error.errors, title: 'New Book' });
      } else {
        throw error;
      }
  }
}));


// POST delete book
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.status(404);
  }
}));


module.exports = router;
