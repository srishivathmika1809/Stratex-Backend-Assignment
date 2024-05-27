const { Book } = require("../../models/book");

const bookService = {
  getAllBooks: async () => {
    return await Book.findAll();
  },

  getBookById: async (id) => {
    return await Book.findByPk(id);
  },

  uploadCSV: async (books, sellerId) => {
    const bookData = books.map((book) => ({ ...book, sellerId }));
    return await Book.bulkCreate(bookData);
  },

  createBook: async (title, author, price, sellerId) => {
    return await Book.create({ title, author, price, sellerId });
  },

  updateBook: async (id, title, author, price, sellerId) => {
    const book = await Book.findOne({ where: { id, sellerId } });
    if (!book) {
      throw new Error("Book not found");
    }
    book.title = title;
    book.author = author;
    book.price = price;
    await book.save();
    return book;
  },

  deleteBook: async (id, sellerId) => {
    const book = await Book.findOne({ where: { id, sellerId } });
    if (!book) {
      throw new Error("Book not found");
    }
    await book.destroy();
    return book;
  },

  deleteBookByName: async (name, sellerId) => {
    const book = await Book.findOne({ where: { name, sellerId } });
    if (!book) {
      throw new Error("Book not found");
    }
    await book.destroy();
    return book;
  },
};

module.exports = bookService;
