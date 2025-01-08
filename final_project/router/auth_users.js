const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const e = require("express");
const regd_users = express.Router();

let users = [];

const isValid = (username, password) => {
  //returns boolean
  //write code to check is the username is valid
  if (!username || !password) return false;
  // check xem username co ton tai trong list user hay khong
  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  for (let i in users) {
    if (users[i].username === username && users[i].password === password) {
      return true;
    }
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!isValid(username, password)) {
    return res
      .status(400)
      .json({ message: "Username or password not provided" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // Generate JWT access token
  let accessToken = jwt.sign(
    {
      data: { username: username, password: password },
    },
    "access",
    { expiresIn: 60 * 60 }
  ); // expiresIn is in seconds (1 hour)

  // Store access token in session
  req.session.authorization = {
    accessToken,
  };
  return res.status(200).send("User successfully logged in");
});

// Add a book review
// and edit a review if it already exists
regd_users.post("/auth/review/:isbn", (req, res) => {
  // data user posted
  const isbn = req.params.isbn;
  const comment = req.body.comment;
  if (!comment)
    return res.status(400).json({ message: "Comment not provided" });
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

  // username get from authentication token in file index.js
  const username = req.user.data.username;
  let reviewsByisbn = books[isbn].reviews;

  for (let i in reviewsByisbn) {
    if (reviewsByisbn[i].username === username) {
      reviewsByisbn[i].comment = comment;
      return res.status(200).json({ message: "Review edit successfully" });
    }
  }

  reviewsByisbn.push({
    username: username,
    comment: comment,
  });
  return res.status(200).json({ message: "Review added successfully" });
});

// delete review by isbn
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

  const username = req.user.data.username;

  // get array reviews by isbn
  let reviewsByisbn = books[isbn].reviews;

  for (let i in reviewsByisbn) {
    if (reviewsByisbn[i].username === username) {
      //  dòng mã này có nghĩa là: "Loại bỏ 1 phần tử khỏi mảng reviewsByisbn bắt đầu từ vị trí chỉ số i."
      reviewsByisbn.splice(i, 1);
      return res.status(200).json({ message: "Review deleted successfully" });
    }
  }
  return res.status(404).json({ message: "Review not found" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
