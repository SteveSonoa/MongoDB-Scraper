// Grab the articles as a json
$.getJSON("/articles", function(data) {
  var mid = 1;

  // For each one
  for (var i = data.length-1; i > 0; i--) {
    if(i === data.length-1) {
      $("#big-img").html('<a href="article.html?id=' + data[i]._id + '"><img src="' + data[i].image + '" class="img img-responsive" data-id="' + data[i].id + '" alt="' + data[i].title + '" /></a>');
      $("#big-headline").html('<a href="article.html?id=' + data[i]._id + '"><h2 data-id="' + data[i].id + '">' + data[i].title + '</h2></a>')
    }
    else if(i < data.length - 1 && i > data.length - 8) {
      $("#mid-img-" + mid).html('<a href="article.html?id=' + data[i]._id + '"><img src="' + data[i].image + '" class="img img-responsive" data-id="' + data[i].id + '" alt="' + data[i].title + '" /></a>');
      $("#mid-headline-" + mid).html('<a href="article.html?id=' + data[i]._id + '"><h3 data-id="' + data[i].id + '">' + data[i].title + '</h3></a>');
      mid++;
    }
    else {
      $("#remainders").append('<a href="article.html?id=' + data[i]._id + '"><h2 data-id="' + data[i].id + '">' + data[i].title + '</h2></a>');
    }
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
