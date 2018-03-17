# An Introduction to Steve's eSports Scraper
Want to keep up with the eSports scene? My scraper has you covered! Comment as part of the community, mark your favorite stories, and go scrape some more whenever you want!

### How does it work?
My scraper app finds eSports stories from https://www.thescoreesports.com, stores the link URL, headline, and image URL in a MongoDB. The index.html template pulls in all of the available stories (newest entries first) and sorts them into their correct locations on the page.

The first entry will take the featured area; the next 6 will take the mid-size locations, and all remaining entries will be listed as headline only. I cycled through the entries from the newest first using a reverse for loop; the counting iterator begins as the array length and decreases by 1 after each pass.

The scraping button will search the site for all news stories; at this point, it does not error check for any duplicate entries. When a user clicks a story, it brings them to a comment page, where stories can be marked as favorites and commented on. Another click links to the external site to read the full story instead of just the headline. Specific user authentication was outside the scope of this app.

### Who will use this?
Users who enjoy eSports will like the constant updates and smaller community than is found on the larger sites.

### What is the goal?
The goal was to correctly use Cheerio and Axiom to scrape from a website and store the results in a MongoDB for use later.

# Deployment
No special credentials are required; simply upload to a nodeJS server and make sure a MongoDB connection exists. If you're running this locally, make sure to run ```npm i``` at the command line to install the required packages.

# Screen Capture
![Screenshot](http://www.fullstacksteve.com/wp-content/uploads/2018/03/MongoScraper1.png)

# Credits
Steve Marshall, Sole Developer
* [Steve's Online Portfolio](http://fullstacksteve.com/)
* [Steve's GitHub Profile](https://github.com/SteveSonoa)
* [Steve's LinkedIn Profile](https://www.linkedin.com/in/sonoa/)