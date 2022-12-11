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

// GET create book
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: 'New Book' });
}));
// POST create book
router.post('/books/new', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.redirect('/books' + book.id);
}));


// GET book id
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', { book, title: 'Update Book' })
}));
// POST book id
router.post('/books/:id', asyncHandler(async (req, res) => {

}));

// // POST delete book
// router.post(() => {

// })


module.exports = router;
