var topics = [''];
var deals;

    

function renderButtons(){ 
   $('#buttons').empty();
        // Loops through the array of movies
        
    for (var i = 0; i < topics.length; i++){
            // Then dynamicaly generates buttons for each movie in the array

            // Note the jQUery syntax here... 
            var a = $('<button>') // This code $('<button>') is all jQuery needs to create the beginning and end tag. (<button></button>)
            a.addClass('movie'); // Added a class 
            a.addClass('newaction');
             a.addClass('btn');
            a.attr("data-person", topics[i]);
            // Added a data-attribute
            a.text("deals");

             // Provided the initial button text
            $('#buttons').append(a); // Added the button to the HTML

}
     $('.btn').on('click', function() {

        $('#gifsAppearHere').empty();
        
        var p = $(this).data('person');

        
        var queryURL = "http://api.sqoot.com/v2/deals?api_key=39zxwo4hbW89U737y87p&per_page=10&_radius=10-&query="+ p ;

        $.ajax({
                url: queryURL,
                method: 'GET'
            })
            .done(function(response) {
                //store data in this variable

                

                console.log(results);
                

                //this will console log the api and the object
                    console.log("#button");

                for (var i = 0; i < 10; i++) {
                    var results = response.deals[i].deal.title;
                var image= response.deals[i].deal.image_url;

                    //creates a new div
                    var gifDiv = $('<div>');
                    gifDiv.addClass('item');

                    console.log(10);
                    var title = results[i].title;
//adds a pragrpah tags and changes the content in the p to Ratings
                    var p = $('<p>').text("Title: " + results);

                    
                    var personImage = $('<img>');
                    personImage.data('static', image);
                   

                    //sets image src
                    personImage.attr('src', image);

                    //this reads the image is static gif

                

                   






                    
                    //gifDiv.appendTo($('<br>'));
                    //eveything above this is not being shwon yet
//the rating and image is now being shown since we we just appended it to the p  just created and the person image on the page
                    gifDiv.append(p)
                    gifDiv.append(personImage)

                    $('#gifsAppearHere').prepend(gifDiv);

                }
            });
    });
        }
    
console.log("b")

        $('#addDance').on('click', function(){
            var movie = $('#dance-input').val().trim();
            topics.push(movie);

            renderButtons();
                return false;
    })
 renderButtons();




