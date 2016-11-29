

// =============== Begin code to link Goolge city input to Sqoot API ===========================================

      //This script was removed from line 33 of the larger step.js file.
      // look inside Google API object for name of city that user typed
      } else {
      var tempCity = places[0].formatted_address;
     // this tells js to look for teh first comma in the string for formatted_address. It then takes whatever is in front of it (the zero index after the split)
      tempCity = tempCity.split(",")[0];
      console.log("this is" + tempCity);
      // run ajax call to Sqoot API
      inputCity = tempCity;
      callCity(tempCity, "default");

      }
// ================= End code to link Google city input to Sqoot API ==========================================

//***************** START CODING FOR SQOOT API *******************

// ====================== Pseudo Code ========================
// Users can see Sqoot's offerings in two ways:
// when a user types a city name into the map's search bar, use that city for sqoot's query
// OR
// when a user clicks on one of the navigation buttons, Sqoot shows them deals related to that category
// ===========================================================================================



// =============== Global Variabls ===============================

//this scripbt was removed from line bottom of the larger step.js file
var deals; // shows Sqoot's API parameter for a deal, including some of its sub-information
var image; // shows Sqoot's API image parameter (shows an image related to the deal)
var inputCity = "Orlando"; // city deals default to Orlando, FL on page load
var defaultCategory = "default";

// When the page loads, the div holding Sqoot's information should be empty
$('#dealsFromSquoot').empty();

// Ajax call to Sqoot API
// this first call populates the Sqoot Deals div
var queryURL = 'http://api.sqoot.com/v2/deals?api_key=39zxwo4hbW89U737y87p&query=' + inputCity + '&radius=10&per_page=35';
console.log(queryURL);

// this function inserts the search box input from Google as the target for Sqoot's API query
function callCity(tempCity, category) {

  defaultCategory = category;
  queryURL = 'http://api.sqoot.com/v2/deals?api_key=39zxwo4hbW89U737y87p&query=' + inputCity + '&radius=10&per_page=35';

  $.ajax ({
  url: queryURL,
  method: 'GET'
  })
  
  .done(function(response) {

    // these variables will hold the 5 deals for each city; their contents will change as the city changes
    var results = [];
    var image = [];
    var responseHTML = "";
    var slugs = [];
    var dealURL = [];

    // Get 5 results and their related images from Sqoot
    for (var i = 0; i < 35; i++) {

      if (response.deals[i] != null) {


        if (defaultCategory == "default") {
          results.push(response.deals[i].deal.title);
          image.push(response.deals[i].deal.image_url);
          dealURL.push(response.deals[i].deal.untracked_url);
        }


          else if (category.indexOf(",") != -1) {
            slugs = category.split(",");
          }

          if (slugs.length >= 1) {
            for (var j = 0; j < slugs.length; j++) {
              if (response.deals[i].deal.category_slug == slugs[j]) {
                results.push(response.deals[i].deal.title);
                image.push(response.deals[i].deal.image_url);
                dealURL.push(response.deals[i].deal.untracked_url);
              }
            }
          }

          else if (response.deals[i].deal.category_slug == category) {


    // push the first 5 queries into the arrays
        results.push(response.deals[i].deal.title);
        image.push(response.deals[i].deal.image_url);
        dealURL.push(response.deals[i].deal.untracked_url);
        }
      }

      }


    // for every query reply, a div with the class responseDIV is made, inside that div is the image and title
    for (i = 0; i < results.length; i++) {

        responseHTML = responseHTML + "<a href='" + dealURL[i] + "'><div class='responseDIV'>";
        responseHTML = responseHTML + "<img src='" + image[i] + "' class='responseIMAGE'/>";
        responseHTML = responseHTML + "<p class='responseTEXT'>" + results[i] + "</p>";
        responseHTML = responseHTML + "</div></a>";
    }
    //make the results appear on the HTML page
    $('#dealsFromSqoot').html(responseHTML);

    slugs.length = 0;
  });

}

// ============== Begin code for linking Sqoot query by category ======================================

$('#food').click(function() {

  $('.responseDIV').empty();

 callCity(inputCity, "food-grocery,food_alcohol,restaurants,kosher,dining-nightlife");

});

$('#activities').click(function() {
   $('.responseDIV').empty();

 callCity(inputCity, "fitness,gym,activities-events,bowling,city-tours,comedy-clubs,concerts");
});

$('#drinks').click(function() {
   $('.responseDIV').empty();

 callCity(inputCity, "food_alcohol,bars-clubs,dining-nightlife,wine-tasting");
});

$('#shopping').click(function() {
   $('.responseDIV').empty();

 callCity(inputCity, "fashion_accessories,home_goods,luggage,gifts,kitchen,women_fashion,womens-clothing,special-interest,retail-services,movies_music_games,mens-clothing,mens_fashion");
});

$('#parks').click(function() {
   $('.responseDIV').empty();

 callCity(inputCity, "outdoor-adventures,city-tours,golf,skiing,skydiving,yoga");
});

$('#museums').click(function() {
   $('.responseDIV').empty();

 callCity(inputCity, "museums");
});

$('#dealDefault').click(function() {
   $('.responseDIV').empty();

 callCity(inputCity, "default");
});