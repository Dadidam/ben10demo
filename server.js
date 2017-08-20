'use strict'

let express = require('express');
let bodyParser = require('body-parser');
let MongoClient = require('mongodb').MongoClient;
let ObjectId = require('mongodb').ObjectID;

let app = express();
let db;

app.use(express.static('static'));

app.get('/api/events', function(req, res) {
  let filter = {};
  if (req.query.type)
    filter.eventType = req.query.type;
  if (req.query.company)
    filter.company = req.query.company;

  db.collection("events").find(filter).toArray(function(err, docs) {
    res.json(docs);
  });
});

app.get('/api/types', function(req, res) {
  db.collection("types").find().toArray(function(err, docs) {
    res.json(docs);
  });
});

app.get('/api/companies', function(req, res) {
  db.collection("companies").find().toArray(function(err, docs) {
    res.json(docs);
  });
});

app.use(bodyParser.json());

/*
 * Insert a record
 */
app.post('/api/events/', function(req, res) {
  let newEvent = req.body;
  db.collection("events").insertOne(newEvent, function(err, result) {
    if (err) console.log(err);
    let newId = result.insertedId;
    db.collection("events").find({_id: newId}).next(function(err, doc) {
      if (err) console.log(err);
      res.json(doc);
    });
  });
});

app.post('/api/types/', function(req, res) {
  let newType = req.body;
  db.collection("types").insertOne(newType, function(err, result) {
    if (err) console.log(err);
    let newId = result.insertedId;
    db.collection("types").find({_id: newId}).next(function(err, doc) {
      if (err) console.log(err);
      res.json(doc);
    });
  });
});

app.post('/api/companies/', function(req, res) {
  let newCompany = req.body;
  db.collection("companies").insertOne(newCompany, function(err, result) {
    if (err) console.log(err);
    let newId = result.insertedId;
    db.collection("companies").find({_id: newId}).next(function(err, doc) {
      if (err) console.log(err);
      res.json(doc);
    });
  });
});

/*
 * Get a single record
 */
app.get('/api/events/:id', function(req, res) {
  db.collection("events").findOne({_id: ObjectId(req.params.id)}, function(err, bug) {
    res.json(bug);
  });
});

/*
 * Modify one record, given its ID
 */
app.put('/api/events/:id', function(req, res) {
  let event = req.body;
  delete (event._id);
  let oid = ObjectId(req.params.id);
  db.collection("events").updateOne({_id: oid}, event, function(err, result) {
    if (err) console.log(err);
    db.collection("events").find({_id: oid}).next(function(err, doc) {
      if (err) console.log(err);
      res.send(doc);
    });
  });
});

MongoClient.connect('mongodb://localhost/eventsdb', function(err, dbConnection) {
  db = dbConnection;
  let server = app.listen(3000, function() {
	  let port = server.address().port;
	  console.log("Started server at port", port);
  });
});
