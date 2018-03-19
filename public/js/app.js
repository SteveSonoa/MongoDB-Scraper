// Grab the articles as a json
$.getJSON("/api/articles", function(data) {
  var mid = 1;

  // For each one
  for (var i = data.length-1; i > 0; i--) {
    // Populate the hero location with the most recent story
    if(i === data.length-1) {
      $("#big-img").html('<a href="article.html?id=' + data[i]._id + '"><img src="' + data[i].image + '" class="img img-responsive" data-id="' + data[i].id + '" alt="' + data[i].title + '" /></a>');
      $("#big-headline").html('<a href="article.html?id=' + data[i]._id + '"><h2 data-id="' + data[i].id + '">' + data[i].title + '</h2></a>')
    }

    // Populate the mid locations with the next 6 stories
    else if(i < data.length - 1 && i > data.length - 8) {
      $("#mid-img-" + mid).html('<a href="article.html?id=' + data[i]._id + '"><img src="' + data[i].image + '" class="img img-responsive" data-id="' + data[i].id + '" alt="' + data[i].title + '" /></a>');
      $("#mid-headline-" + mid).html('<a href="article.html?id=' + data[i]._id + '"><h3 data-id="' + data[i].id + '">' + data[i].title + '</h3></a>');
      mid++;
    }

    // Populate the remainder of the page with headlines only
    else {
      $("#remainders").append('<a href="article.html?id=' + data[i]._id + '"><h2 data-id="' + data[i].id + '">' + data[i].title + '</h2></a>');
    }

    // Populate the favorites bar with headlines
    if(data[i].favorite) {
      $("#popular").append(
        '<a href="article.html?id=' + data[i]._id + '">'
      +    '<img src="' + data[i].image + '" class="img img-responsive pull-left marginRight" width="75" />'
      +    '<h3 data-id="' + data[i].id + '">' + data[i].title + '</h3>'
      +  '</a><br>');
    }
  }
});