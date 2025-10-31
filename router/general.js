const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists. Please choose another." });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully." });
});

// Get the book list available in the shop (synchronous)
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book list using Promise with 6-second delay and console logs
public_users.get('/books/promise', function (req, res) {
  let getBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books) {
        resolve("Promise resolved with book list");
      } else {
        reject("No books found.");
      }
    }, 6000);
  });

  console.log("Before calling promise");

  getBooks
    .then((message) => {
      console.log("From Callback: " + message);
      res.status(200).send(JSON.stringify(books, null, 2));
    })
    .catch((err) => {
      console.error("Error:", err);
      res.status(500).json({ message: err });
    });

  console.log("After calling promise");
});

// Get book list using async/await
public_users.get('/books/async', async function (req, res) {
  try {
    const data = await new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject("No books found.");
      }
    });
    res.status(200).send(JSON.stringify(data, null, 2));
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn], null, 2));
  } else {
    res.status(404).json({ message: "Book not found for the given ISBN." });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorParam = req.params.author.toLowerCase();
  const matchingBooks = [];

  for (const isbn in books) {
    const book = books[isbn];
    if (book.author.toLowerCase() === authorParam) {
      matchingBooks.push({ isbn, ...book });
    }
  }

  if (matchingBooks.length > 0) {
    res.status(200).send(JSON.stringify(matchingBooks, null, 2));
  } else {
    res.status(404).json({ message: "No books found for the given author." });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const titleParam = req.params.title.toLowerCase();
  const matchingBooks = [];

  for (const isbn in books) {
    const book = books[isbn];
    if (book.title.toLowerCase() === titleParam) {
      matchingBooks.push({ isbn, ...book });
    }
  }

  if (matchingBooks.length > 0) {
    res.status(200).send(JSON.stringify(matchingBooks, null, 2));
  } else {
    res.status(404).json({ message: "No books found with the given title." });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    const reviews = books[isbn].reviews || {};
    res.status(200).send(JSON.stringify(reviews, null, 2));
  } else {
    res.status(404).json({ message: "Book not found for the given ISBN." });
  }
});

// Task 11 — ISBN with Promise
public_users.get('/isbn/promise/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const getBook = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found.");
      }
    }, 3000);
  });

  console.log("Before calling Promise for ISBN:", isbn);

  getBook
    .then((book) => {
      console.log("From Callback (Promise): Book found.");
      res.status(200).send(JSON.stringify(book, null, 2));
    })
    .catch((err) => {
      console.error("Error:", err);
      res.status(404).json({ message: err });
    });

  console.log("After calling Promise");
});

// Task 11 — ISBN with async/await
public_users.get('/isbn/async/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  console.log("Before calling async/await for ISBN:", isbn);

  try {
    const book = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found.");
        }
      }, 3000);
    });

    console.log("From Callback (async/await): Book found.");
    res.status(200).send(JSON.stringify(book, null, 2));
  } catch (err) {
    console.error("Error:", err);
    res.status(404).json({ message: err });
  }

  console.log("After calling async/await");
});

// Task 12 — Author with Promise
public_users.get('/author/promise/:author', function (req, res) {
  const authorParam = req.params.author.toLowerCase();

  const getBooksByAuthor = new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchingBooks = [];
      for (const isbn in books) {
        const book = books[isbn];
        if (book.author.toLowerCase() === authorParam) {
          matchingBooks.push({ isbn, ...book });
        }
      }
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found for the given author.");
      }
    }, 3000);
  });

  console.log("Before calling Promise for author:", authorParam);

  getBooksByAuthor
    .then((books) => {
      console.log("From Callback (Promise): Books found.");
      res.status(200).send(JSON.stringify(books, null, 2));
    })
    .catch((err) => {
      console.error("Error:", err);
      res.status(404).json({ message: err });
    });

  console.log("After calling Promise");
});

// Task 12 — Author with async/await
public_users.get('/author/async/:author', async function (req, res) {
  const authorParam = req.params.author.toLowerCase();

  console.log("Before calling async/await for author:", authorParam);

  try {
    const booksByAuthor = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const matchingBooks = [];
        for (const isbn in books) {
          const book = books[isbn];
          if (book.author.toLowerCase() === authorParam) {
            matchingBooks.push({ isbn, ...book });
          }
        }
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found for the given author.");
        }
      }, 3000);
    });

    console.log("From Callback (async/await): Books found.");
    res.status(200).send(JSON.stringify(booksByAuthor, null, 2));
  } catch (err) {
    console.error("Error:", err);
    res.status(404).json({ message: err });
  }

  console.log("After calling async/await");
});

// ✅ Task 13 — Title with Promise
public_users.get('/title/promise/:title', function (req, res) {
  const titleParam = req.params.title.toLowerCase();

  const getBooksByTitle = new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchingBooks = [];
      for (const isbn in books) {
        const book = books[isbn];
        if (book.title.toLowerCase() === titleParam) {
          matchingBooks.push({ isbn, ...book });
        }
      }
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found for the given title.");
