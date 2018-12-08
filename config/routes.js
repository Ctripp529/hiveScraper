var Article = require("../models/Article.js");
var Note = require("../models/Note");
var scrape = require("../scripts/scrape");
var articlesController = require("../controllers/articles.js");
var notesController = require("../controllers/notes.js");

module.exports = function (router) {

router.get("/", function (req, res) {
    Article.find({saved: false}, function (error, found) {
        if (error) {
            console.log(error);
        } else if (found.length === 0) {
            res.render("empty");
        } else {

            var hbsObject = {
                articles: found
            };
            res.render("index", hbsObject);

        }
    });
});


router.get("/scrape", function (req, res) {
    console.log("scraper hit");
    articlesController.fetch(function(err, docs){
        if(!docs || docs.insertedCount === 0) {
            res.json({message: "No New Articles"})
            console.log("1"+docs);

        }else{
            res.json({message: "Added " + docs.insertedCount + " new articles!"});
            console.log("2"+docs);

        }
    });
    });


//retrieves the saved articles
router.get("/saved", function (req, res) {

    articlesController.get({saved: true}, function (data) {
        var hbsObject = {
            articles: data
        };
        res.render("saved", hbsObject);
    });
});

//for saving or unsaving articles
router.patch("/articles", function (req, res) {

    articlesController.update(req.body, function (err, data) {
        //this gets sent back to app.js and the article is either saved or unsaved
        res.json(data);
    });
});

//retrieve the notes attached to saved articles to be displayed in the notes modal
router.get('/notes/:id', function (req, res) {
    //Query to find the matching id to the passed in it
    Article.findOne({
            _id: req.params.id
        })
        .populate("note") //Populate all of the notes associated with it
        .exec(function (error, doc) { //execute the query
            if (error) console.log(error);
            // Otherwise, send the doc to the browser as a json object
            else {
                res.json(doc);
                
            }
        });
});

// Add a note to a saved article
router.post('/notes/:id', function (req, res) {
    //create a new note with req.body
    var newNote = new Note(req.body);
    //save newNote to the db
    newNote.save(function (err, doc) {
        // Log any errors
        if (err) console.log(err);
        //find and update the note
        Article.findOneAndUpdate(
            {_id: req.params.id},// find the _id by req.params.id
            {$push: {note: doc._id}}, //push to the notes array
            {new: true},
            function (err, newdoc) {
                if (err) console.log(err);
                res.send(newdoc);
            });
    });
});

router.get('/deleteNote/:id', function (req, res) {
Note.remove({"_id": req.params.id}, function (err, newdoc) {
    if (err) console.log(err);
    res.redirect('/saved'); //redirect to reload the page
});
});


};