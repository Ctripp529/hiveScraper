var axios = require("axios");
var cheerio = require("cheerio");

// Database configuration
var scrape = function(callback) {

    var articlesArray =[];
  
    axios.get("http://www.thechive.com").then(function(response) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);

  $("article.post").each(function(i, element) {

     var result = {};

    //scrapes article title
    result.title = $(this).children("h3.card-title").children().text();
    //scrapes article link
   result.link = $(this).children("h3.card-title").children().attr("href");
   //scrapes article image
  result.image = $(this).children("a.card-img-link").children().attr("src");
    //scrapes article category
    result.category = $(this).children("div.card-categories").children('a').children().text();
   
   if ( result.title !== "" ||  result.link !== "" ||  result.image !== "" ||  result.category !== ""){
       articlesArray.push(result);   
   }
  });
 
callback(articlesArray);

});
};
module.exports = scrape;