const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const url = "http://localhost:5000";
const axios = require('axios').default;

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!isValid(username, password))
    return res.status(400).json({message: "Username or password not provided"});
  if(users[username])
    return res.status(400).json({message: "User already exists"});
  users.push({username: username, password: password});
  return res.status(200).json({message: `User ${username} created`});
});


const getAllBook = async (url) => {
  try {
    const outcome = await axios.get(url);
    let allBook = await outcome["data"];
    console.log(allBook);
  } catch (error) {
    console.log(error);
  }
};
getAllBook(url);

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

const getAllBookDetail = async (url) => {
  try {
    const outcome = await axios.get(url + "/isbn/1");
    let bookDetail = await outcome["data"];
    console.log(bookDetail);
  } catch (error) {
    console.log(error);
  }
};
getAllBookDetail(url);

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
    return res.status(200).json(books[isbn]);
  }else{
    return res.status(404).json({message: "Book not found"});
  }
 });
  

const getAllBookDetailByAuthor = async (url) => {
  try {
    const outcome = await axios.get(url + "/author/Hans Christian Andersen");
    let bookDetail = await outcome["data"];
    console.log(bookDetail[0]);
  } catch (error) {
    console.log(error);
  }
};
getAllBookDetailByAuthor(url);

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const tmpBooks = [];
  if(!author)
    return res.status(400).json({message: "Author not provided"});

  for (let i in books){
    if(books[i].author === author){
      tmpBooks.push(books[i]);
    }
  }
  return res.status(200).json(tmpBooks);
});


const getAllBookDetailByTitle = async (url) => {
  try {
    const outcome = await axios.get(url + "/title/Fairy tales");
    let bookDetail = await outcome["data"];
    console.log(bookDetail[0]);
  } catch (error) {
    console.log(error);
  }
};
getAllBookDetailByTitle(url);

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const tmpBooks = [];
  if(!title)
    return res.status(400).json({message: "Title not provided"});

  for (let i in books){
    if(books[i].title === title){
      tmpBooks.push(books[i]);
    }
  }
  return res.status(200).json(tmpBooks);

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(!books[isbn])
    return res.status(400).json({message: "Isbn not provided"});
  else
    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
