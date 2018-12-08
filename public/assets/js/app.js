$(document).ready(function() {
    $('.parallax').parallax();
    $('.tooltipped').tooltip();
    console.log("app.js")

    $(".scrape").click(function(event) {
        console.log("scrape click");
        event.preventDefault();
        $.get("/scrape").then(function(data) {
            $(".articles").remove();
            // $.get("/").then(function(){
            //     // bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>", function(result) {
            //       //  location.reload()
            // });
             location.reload();
        });
       
    });
  
    $(".save-article").click(function() {
        var articleSave = {};
        articleSave.id = $(this).data("id");
        articleSave.saved = true;
        $.ajax({
            method: "PATCH",
            url: "/articles",
            data: articleSave
        }).then(function(data) {
            location.reload();
        });
    });
  
    $(".removeSaved").click(function() {
        var removeSaved = {};
        removeSaved.id = $(this).data("id");
        removeSaved.saved = false;
        $.ajax({
            method: "PATCH",
            url: "/articles",
            data: removeSaved
        }).then(function(data) {
            location.reload();
        });
    });
  
    $('.saved-buttons').on('click',  function () {
        // the NEWS article id
        var thisId =$(this).attr("data-value");

        $("#saveButton").attr({"data-value":thisId});
       
        $.get("/notes/" + thisId, function(data){
            console.log(data);
            //empty modal title, textarea and notes
            $('#noteModalLabel').empty();
            $('#notesBody').empty();
            $('#notestext').val('');
            
        //delete button for individual note
  
            //add id of the current NEWS article to modal label
             $('#noteModalLabel').append(' ' + thisId);
            //add notes to body of modal, will loop through if multiple notes
            for(var i = 0; i<data.note.length; i++) {
                var button = ' <a href=/deleteNote/' + data.note[i]._id + '><i class="pull-right fa fa-times fa-2x deletex" aria-hidden="true"></i></a>';
                $('#notesBody').append('<div class="panel panel-default"><div class="noteText panel-body">' + data.note[i].body + '  ' + button + '</div></div>');
            }
        }); 
    });
  // When you click the savenote button
    $(".savenote").click(function() {
    // Grab the id associated with the article from the submit button
      var thisId = $(this).attr("data-value");
  
  
    // Run a POST request to change the note, using what's entered in the inputs
      $.ajax({
        method: "POST",
        url: "/notes/" + thisId,
        data: {
          // Value taken from title input
  
          // Value taken from note textarea
          body: $("#notestext").val().trim()
        }
      })
        // With that done
      .done(function(data) {
          // Log the response
          //console.log(data);
          $('#noteModal').modal('hide');
  
      });
    });
    })

