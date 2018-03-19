// Load Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app, path, db) {

	// A GET route for scraping the echojs website
	app.get("/api/scrape", function(req, res) {
	  // console.log("40: Scrape activated");
	  // Load the eSports page
	  axios.get("https://www.thescoreesports.com/home").then(function(response) {
	    // Initialize Cheerio
	    var $ = cheerio.load(response.data);

	    // console.log("46: Scrape started");

	    // Reference every NewsCard class inside a div tag
	    $("div .NewsCard__container--1KkQS").each(function(i, element) {
	      // console.log("--------------------------------");
	      // console.log("50: Scrape loop");

	      // Initialize the result object
	      var result = {};

	      // Find the title, url, and image url of each result
	      result.title = $(this)
	        .find(".NewsCard__title--37vMp")
	        .text();
	      result.link = "https://www.thescoreesports.com" + $(this)
	        .children("a")
	        .attr("href");
	      result.image = $(this)
	        .find("img")
	        .attr("src");

	      // Create a new Article using the `result` object built from scraping
	      db.Article.create(result)
	        .then(function(dbArticle) {
	          // View the added result in the console
	          // console.log(dbArticle);
	        })
	        .catch(function(err) {
	          // If an error occurred, send it to the client
	          return res.json(err);
	        });
	      // console.log(result);
	    });

	    // If we were able to successfully scrape and save an Article, send a message to the client
	    res.redirect("/");
	  });
	});

	// Route for getting all Articles from the db
	app.get("/api/articles", function(req, res) {
	  // Grab every document in the Articles collection
	  db.Article.find({})
	    .then(function(dbArticle) {
	      // If we were able to successfully find Articles, send them back to the client
	      res.json(dbArticle);
	    })
	    .catch(function(err) {
	      // If an error occurred, send it to the client
	      res.json(err);
	    });
	});

	// Route for grabbing a specific Article by id, populate it with it's note
	app.get("/api/articles/:id", function(req, res) {
	  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
	  db.Article.findOne({ _id: req.params.id })
	    // ..and populate all of the notes associated with it
	    .populate("note")
	    .then(function(dbArticle) {
	      // If we were able to successfully find an Article with the given id, send it back to the client
	      res.json(dbArticle);
	    })
	    .catch(function(err) {
	      // If an error occurred, send it to the client
	      res.json(err);
	    });
	});

	// Route for saving/updating an Article's associated Note
	app.post("/api/articles/:id", function(req, res) {
	  // Create a new note and pass the req.body to the entry
	  db.Note.create(req.body)
	    .then(function(dbNote) {
	      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
	      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
	      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
	      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
	    })
	    .then(function(dbArticle) {
	      // If we were able to successfully update an Article, send it back to the client
	      res.json(dbArticle);
	    })
	    .catch(function(err) {
	      // If an error occurred, send it to the client
	      res.json(err);
	    });
	});

	app.put("/api/favorite/:id", function(req, res) {
	  db.Article.update({_id: req.params.id}, {$set: {"favorite":req.body.favorite}})
	  .then(function(dbArticle) {
	    res.end();
	  })
	  .catch(function(err) {
	    res.end();
	  });
	});

	app.delete("/api/articles/:id", function(req, res) {
		db.Note.remove({ _id: req.body.noteId })
		.then(function(dbNote) {
			db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: {new: false} });
			res.end();
		})
		.catch(function(err) {
			res.end();
		});
	});
}