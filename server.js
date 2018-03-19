// Load required packages
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
mongoose.Promise = Promise;

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Load API routing
require('./controllers/apiRoutes.js')(app, path, db);

// If app changes from direct file names, utilize HTML routing
// app.get("/article/:id", function(req,res) {
//   res.sendFile(path.join(__dirname, "./public/article.html", req.params.id));
// });

// app.get("/", function(req,res) {
//   res.sendFile(path.join(__dirname, "./public/index.html"));
// });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
