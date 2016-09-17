'use strict';

const express = require('express');
const app = express();
const connect = require('connect');
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const chalk = require('chalk');
const Reg = new RegExp(/(?:(?=[\s`!()\[\]{};:'".,<>?«»“”‘’])|\b)((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/|[a-z0-9.\-]+[.](?:com|org|net))(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))*(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]|\b))/ig);

const MongoClient = require(`mongodb`).MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/url_shortener";
console.log(chalk.red(`MongoDB running at: ${MONGODB_URI}`));

let collection; // assigned to db.collection('urls') collection in MongoDB below

MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
        console.log(`Could not connect! Unexpected error. Details below.`)
        throw err;
    }
    collection = db.collection('urls');
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

// set static directory
app.use(express.static(__dirname + '/'));

app.use(methodOverride('_method'));

// Home Page (Lander)
app.get('/', (req, res) => {
    res.render("urls_new");
});

// GET /urls
app.get("/urls", (req, res) => {
    collection.find().toArray((err, url) => {
        res.render("urls_index", {
            url: url
        });
    });
});

// create new link, add to database, redirect to /urls
app.post("/urls", (req, res) => {
    var newID = generateRandomString(6);
    if (Reg.test(req.body.thisinput)) {
        collection.insert({
            shortURL: newID,
            longURL: req.body.thisinput
        });
        res.redirect("/urls");
        console.log("someone created a new link with:" + newID)
    } else {
        // res.redirect("/urls");
        console.log("invalidURL!")
    }
});

// y u delete from database? redirects to /urls
app.delete('/urls/:id', (req, res) => {
    collection.remove({
        shortURL: req.params.id
    });
    res.redirect('/urls');
    console.log(`Someone deleted ${req.params.id}`);
});

// update URL using same key
app.put('/urls/:id', (req, res) => {
    if (/www/i.test(req.body.thisinput)) {
        var newID = generateRandomString(6);
        collection.updateOne({
            shortURL: req.params.id
        }, {
            shortURL: req.params.id,
            longURL: `http://${req.body.thisinput}`
        });
        res.redirect("/urls");
        console.log(`somebody changed ${req.params.id} to ${req.body.thisinput}`);
    } else if (Reg.test(req.body.thisinput)) {
        var newID = generateRandomString(6);
        collection.updateOne({
            shortURL: req.params.id
        }, {
            shortURL: req.params.id,
            longURL: req.body.thisinput
        });
        res.redirect("/urls");
        console.log(`somebody changed ${req.params.id} to ${req.ody.thisinput}`);
    } else {
        consoe.log("invalid url")
        res.redirect("/urls");
    }

});

// +++++++++++++   FORM PAGE  +++++++++++++
app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});






// +++++   THIS REDIRECTS TO DESTINATION  +++++++
app.get("/u/:shortURL", (req, res) => {
    var longURL = collection.findOne({
        shortURL: req.params.shortURL
    }, (err, url) => {
      console.log(req)
      console.log("returned url: " + url)
      console.log("error: " + err)
      console.log("Someone Used A Link!");


        res.redirect( 307, url.longURL );
    });
    // console.log(req.params.shortURL)
    // console.log(longURL)
    // console.log("Someone Used A Link!");
});






// this shows a custom page for each record
app.get("/urls/:id", function(req, res) {
    collection.findOne({
        shortURL: req.params.id
    }, (err, urlb) => {
        res.render("urls_show", {
            urlb: urlb
        });
    });
});

app.listen(8080);

console.log(chalk.blue('Server open on :8080'));

function generateRandomString(len) {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789POIUYTREWQLKJHGFDSAMNBVCXZ";
    for (var i = 0; i < len; i++) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return text;
}
