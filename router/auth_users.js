const express = require('express');
const books = require('./booksdb.js');
const router = express.Router();

// Add or update a book review
router.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  // Check if the user is authenticated
  if (!req.user || !req.user.username) {
    return res.status(403).json({ message: "User not authenticated." });
  }

  const username = req.user.username;

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for the given ISBN." });
  }

  // Initialize reviews object if it doesn't exist
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update the review for the current user
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added or updated successfully." });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  
    // Verifica se o usuário está autenticado
    if (!req.user || !req.user.username) {
      return res.status(403).json({ message: "User not authenticated." });
    }
  
    const username = req.user.username;
  
    // Verifica se o livro existe
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found for the given ISBN." });
    }
  
    // Verifica se há resenhas e se o usuário tem uma resenha registrada
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully." });
    } else {
      return res.status(404).json({ message: "No review found for this user on the given book." });
    }
  });
  
module.exports.authenticated = router;
