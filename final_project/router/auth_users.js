const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb"); // Ensure correct path
const regd_users = express.Router();

let users = []; // Store registered users
let sessions = {}; // Store active user sessions

// Helper functions
const isValid = (username) => users.some((user) => user.username === username);
const authenticatedUser = (username, password) =>
  users.some(
    (user) => user.username === username && user.password === password
  );

// Task 6: Register new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Task 7: Login as a registered user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  let token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
  sessions[username] = token; // Store session token

  return res.status(200).json({ message: "Login successful", token });
});

// Middleware: Authenticate Requests
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access Denied! No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], "secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

// Task 8: Add/Modify book review (Authenticated Users Only)
regd_users.put("/auth/review/:isbn", authenticate, (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.query;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content required" });
  }

  // Store review under the user's name
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});

// Task 9: Delete book review (Authenticated Users Only)
regd_users.delete("/auth/review/:isbn", authenticate, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn] || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
