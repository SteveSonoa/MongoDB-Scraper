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
let noteId;

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

  // If there's a note in the article
  if (data.note) {
    noteId = data.note._id;
    // Place the comment in a panel in the comments area
    $("#comments").append(
      '<div class="panel panel-default">'
    +   '<div class="panel-body">'
    +     '<p>' + data.note.body + '</p>'
    +     '<br><button class="btn btn-danger active btnDeleteComment" data-id="' + data.note._id + '">Delete This Comment</button>'
    +   '</div>'
    + '</div>'
    );
    // Add the existing note to the textarea for editing
    $("#commentText").val(data.note.body);
  }
  else {
    $("#comments").append('<h3 class="text-center">You have not written a comment yet.</h3>');
  }
});

// When you click the savenote button
$(document).on("click", "#commentBtn", function() {
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/api/articles/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#commentText").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#commentText").val("");
      location.reload();
    });
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

$(document).on("click", ".btnDeleteComment", function() {
  $.ajax({
    method: "DELETE",
    url: "/api/articles/" + thisId,
    data: {
      noteId: noteId
    }
  })
  // With that done
  .then(function(data) {
    // Log the response
    console.log(data);
    // Empty the notes section
    location.reload();
  });
})