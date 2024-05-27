const { body, param } = require("express-validator");
const validate = require("../middlewares/validationMiddleware");
const bookService = require("../services/bookService");
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const authMiddleware = require("../../middlewares/authMiddleware");

const upload = multer({ dest: "uploads/" });

const getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookById = [
  param("id").isInt().withMessage("Invalid book ID"),
  validate,
  async (req, res) => {
    try {
      const bookId = req.params.id;
      const book = await bookService.getBookById(bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

const uploadCSV = [
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const results = [];
      fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          await bookService.uploadCSV(results, req.user.id);
          fs.unlinkSync(req.file.path);
          res.status(201).json({ message: "Books added successfully" });
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

const createBook = [
  authMiddleware,
  body("title").notEmpty().withMessage("Title is required"),
  body("author").notEmpty().withMessage("Author is required"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  validate,
  async (req, res) => {
    try {
      const { title, author, price } = req.body;
      const book = await bookService.createBook(
        title,
        author,
        price,
        req.user.id
      );
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

const updateBook = [
  authMiddleware,
  param("id").isInt().withMessage("Invalid book ID"),
  body("title").notEmpty().withMessage("Title is required"),
  body("author").notEmpty().withMessage("Author is required"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  validate,
  async (req, res) => {
    try {
      const bookId = req.params.id;
      const { title, author, price } = req.body;
      const updatedBook = await bookService.updateBook(
        bookId,
        title,
        author,
        price,
        req.user.id
      );
      res.json(updatedBook);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];
const deleteBook = [
  authMiddleware,
  async (req, res) => {
    try {
      let deletedBook;
      if (req.params.id) {
        // Delete by ID
        const bookId = req.params.id;
        deletedBook = await bookService.deleteBook(bookId, req.user.id);
      } else if (req.body.name) {
        // Delete by name
        const { name } = req.body;
        deletedBook = await bookService.deleteBookByName(name, req.user.id);
      } else {
        throw new Error('Invalid request. Provide book ID or name to delete.');
      }
      res.json(deletedBook);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];


module.exports = {
  getAllBooks,
  getBookById,
  uploadCSV,
  createBook,
  updateBook,
  deleteBook,
};
