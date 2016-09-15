'use strict';
// server.js
// load the things we need
let express = require('express');
let app = express();

const bodyParser = require("body-parser");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "2whg3g": "http://www.pornhub.com"
};

// set the view engine to ejs
app.set('view engine', 'ejs');

// split body?  depricated.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'))

//index page
app.get('/', function(req, res) {
    res.render('urls_index', {
        urls: urlDatabase
    });
});
// +++++   URL LIST PAGE  +++++++++
// URL list page
app.get("/", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

// +++++   FORM PAGE  +++++++++
// setting up for the /new form
app.get("/urls/new", (req, res) => {
 res.render("urls_new");
});


// +++++   SOMETHING PAGE  +++++++++
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
// must have http://www.
//




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
// console.log(generateRandomString(6));
