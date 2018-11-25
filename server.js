var express = require('express');
var fs = require("fs");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('combined'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('abc'));
app.use(express.static(path.join(__dirname, 'public')));

//Mongo Begin 

var mongoClient=require('mongodb').MongoClient;
var mongoDbObj;
var db ;

mongoClient.connect('mongodb://127.0.0.1:27017/test', (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(2010, () => {
    console.log('listening on 2010')
            
      
  })
});


//Mongo End


// EJS Begin

app.set('view engine', 'ejs')

app.get('/get', (req, res) => {
  db.collection('users').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {users: result})
  })
})


// Quotes

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
        res.render('quote.ejs', {quotes: result})
  })
})

app.get('/quote', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
        res.render('quote.ejs', {quotes: result})
  })
})

app.get('/trend', (req, res) => {
  db.collection('quotes').find({name: 'Zig Ziglar'}).toArray((err, result) => {
    if (err) return console.log(err)
        res.render('quote.ejs', {quotes: result})
  })
})

app.post('/update', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Jack Welch'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quotes,
      type: req.body.type
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
  res.render('quote.ejs', {quotes: result})
})


app.post('/insert',(req, res) => {
var quote_data = {
    name: req.body.name
  , quote: req.body.quotes
  , type: req.body.type
};

     db.collection('quotes').insert(quote_data, function(err, result) {
    if(err) { throw err; }
     })

})
// EJS End

module.exports = app;

var debug = require('debug')('request');


app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});