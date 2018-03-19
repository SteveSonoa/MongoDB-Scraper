// SOURCE: https://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

const thisId = getQueryVariable("id");
console.log(thisId);

// Grab the articles as a json
$.getJSON("/api/articles/" + thisId, function(data) {

  $("#image").html('<a href="' + data.link + '" target="_blank"><img src="' + data.image + '" class="img img-responsive" alt="' + data.title + '" /></a>');
  $("#headline").html('<a href="' + data.link + '" target="_blank"><h2>' + data.title + '</h2></a>');

  // Determine which favorite button (add or remove) is appropriate to display
  if(data.favorite) {
    $("#btnFav").html('<button class="btn btn-danger active pull-right" role="button" data-id="' + thisId + '" data-curState="true">Remove From Favorites</button>');
  }
  else {
    $("#btnFav").html('<button class="btn btn-success active pull-right" role="button" data-id="' + thisId + '" data-curState="false">Add To My Favorites</button>');
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();

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

// When you click the favorites toggle button
$(document).on("click", ".pull-right", function() {
  console.log("button clicked");
  let toggle = true;
  if ($(this).attr("data-curState") === "true") {
    toggle = false;
  }

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "PUT",
    url: "/api/favorite/" + thisId,
    data: {
      // Value taken from title input
      favorite: toggle
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      location.reload();
    });

});
