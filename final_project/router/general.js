const express = require("express");
let books = require("../router/booksdb");
const axios = require("axios");

const public_users = express.Router();

// Task 1: Get all books
// public_users.get("/", async (req, res) => {
//   try {
//     return res.status(200).json(books);
//   } catch (error) {
//     return res.status(500).json({ message: "Error retrieving books" });
//   }
// });

public_users.get("/", (req, res) => {
  setTimeout(() => {
    return res.status(200).json({ books });
  }, 1000);
});

// Task 2: Get book by ISBN
// public_users.get("/isbn/:isbn", async (req, res) => {
//   let isbn = req.params.isbn;
//   if (books[isbn]) {
//     return res.status(200).json(books[isbn]);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

public_users.get("/isbn/:isbn", (req, res) => {
  setTimeout(() => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).json({ book: books[isbn] });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  }, 1000);
});

// Task 3: Get books by Author
// public_users.get("/author/:author", (req, res) => {
//   const authorName = req.params.author;

//   let booksByAuthor = Object.keys(books)
//     .map((key) => ({ isbn: key, ...books[key] }))
//     .filter((book) => book.author === authorName)
//     .map((book) => ({
//       isbn: book.isbn,
//       title: book.title,
//       reviews: book.reviews,
//     }));

//   if (booksByAuthor.length > 0) {
//     return res.json({ booksbyauthor: booksByAuthor });
//   } else {
//     return res.status(404).json({ message: "No books found for this author" });
//   }
// });

public_users.get("/author/:author", (req, res) => {
  setTimeout(() => {
    const author = req.params.author.toLowerCase();
    let booksByAuthor = Object.entries(books)
      .filter(([_, book]) => book.author.toLowerCase() === author)
      .map(([isbn, book]) => ({ isbn, ...book }));

    if (booksByAuthor.length > 0) {
      return res.status(200).json({ booksByAuthor });
    } else {
      return res
        .status(404)
        .json({ message: "No books found for this author" });
    }
  }, 1000);
});

// Task 4: Get books by Title
// public_users.get("/title/:title", async (req, res) => {
//   let title = req.params.title.toLowerCase();

//   let booksByTitle = Object.keys(books)
//     .map((key) => ({ isbn: key, ...books[key] }))
//     .filter((book) => book.title.toLowerCase() === title)
//     .map((book) => ({
//       isbn: book.isbn,
//       author: book.author,
//       reviews: book.reviews,
//     }));

//   if (booksByTitle.length > 0) {
//     return res.status(200).json({ booksbytitle: booksByTitle });
//   } else {
//     return res.status(404).json({ message: "No books found for this title" });
//   }
// });

public_users.get("/title/:title", (req, res) => {
  setTimeout(() => {
    const title = req.params.title.toLowerCase();
    let booksByTitle = Object.entries(books)
      .filter(([_, book]) => book.title.toLowerCase() === title)
      .map(([isbn, book]) => ({ isbn, ...book }));

    if (booksByTitle.length > 0) {
      return res.status(200).json({ booksByTitle });
    } else {
      return res.status(404).json({ message: "No books found for this title" });
    }
  }, 1000); // محاكاة استجابة غير متزامنة
});

// Task 5: Get book reviews
public_users.get("/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
