'use strict';
// server.js
// load the things we need
const express = require('express');
const app = express();
const connect = require('connect');
const methodOverride = require('method-override');
const bodyParser = require("body-parser");

let urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com",
    "2whg3g": "http://www.pornhub.com"
};

//
// const MongoClient = require("mongodb").mongoClinet.
// const MONGODB_URL = "";
//



// app.get("....", (req, res) => {
//     Mongo.urls.find("e24e2w").toArray(function(err, result) {
//         res.render("template_page", {
//             url: result
//         })
//     });
// });

// set the view engine to ejs
app.set('view engine', 'ejs');
// split body?  depricated.
app.use(bodyParser.urlencoded({
    extended: true
}));
// set static directory for accessing css files
app.use(express.static(__dirname + '/'))
    //
app.use(methodOverride('_method'))


//index page
app.get('/', (req, res) => {
    //  res.render('urls_index', {    urls: urlDatabase  });
    res.render("urls_new");
});

// +++++   URL LIST PAGE  +++++++++
// URL list page
app.get("/urls", (req, res) => {
    let templateVars = {
        urls: urlDatabase
    };
    res.render("urls_index", templateVars);
});


app.post("/urls", (req, res) => {
    console.log(req.body); // debug statement to see POST parameters
    let newID = generateRandomString(6);
    console.log(newID)
    urlDatabase[newID] = req.body.longURL;
    res.redirect("/urls");

});

app.delete('/urls/:id', (req, res) => {
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
    console.log(`someone deleted ${req.params.id}`);
});

app.put('/urls/:id', (req, res) => {
    //replace(urlDatabase[req.params.id])
    let newID = generateRandomString(6);

    if (urlDatabase.hasOwnProperty(req.params.id)) {
        urlDatabase[newID] = urlDatabase[req.params.id];
        delete urlDatabase[req.params.id];
    }
    res.redirect('/urls');
});


// +++++   FORM PAGE  +++++++++
// setting up for the /new form
app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});


// +++++   THIS REDIRECTS TO DESTINATION  +++++++++
app.get("/u/:shortURL", (req, res) => {
    let longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
    console.log("Someone Used A Link!")
});
// must have http://www.
//


// indiv
app.get("/urls/:id", (req, res) => {
    let templateVars = {
        shortURL: req.params.id,
        urls: urlDatabase
    };
    res.render("urls_show", templateVars);
});


app.listen(8080);
console.log('Server open on :8080');


// http://localhost:8080/urls/b2xVn2

function generateRandomString(len) {
    var text = " ";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789POIUYTREWQLKJHGFDSAMNBVCXZ";
    for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}
// console.log(generateRandomString(6));
