'use strict';
// server.js
// load the things we need
var express = require('express');
var app = express();

const bodyParser = require("body-parser");


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "2whg3g": "http://www.pornhub.com"
};

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

//index page
app.get('/', function(req, res) {

    res.render('urls_index', {
        urls: urlDatabase
    });
});

// URL list page
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// setting up for the /new form
app.get("/urls/new", (req, res) => {
 res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

// indiv
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});


app.listen(8080);
console.log('Server open on :8080');


// http://localhost:8080/urls/b2xVn2



function generateRandomString(len) {
    var text = " ";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789POIUYTREWQLKJHGFDSAMNBVCXZ";
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}
console.log(generateRandomString(6));
