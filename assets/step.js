
  //*******  Google Map  *******//    
  function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);


    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());

    });

    var markers = [];
    // [START region_getplaces]
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      } else {
      // putting input into variable so sqoot can detect it
      var tempCity = places[0].formatted_address;

      // this tells js to look for teh first comma in the string for formatted_address. It then takes whatever is in front of it
      tempCity = tempCity.split(",")[0];
      console.log("this is" + tempCity);
      callCity(tempCity);

      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
    // [END region_getplaces]

  };
  //*******  Finish Google Map  *******//


//***************** START CODING FOR SQOOT API *******************

// ====================== Pseudo Code ========================
// Users can see Sqoot's offerings in two ways:
// when a user types a city name into the map's search bar, use that city for sqoot's query
// OR
// when a user clicks on one of the navigation buttons, Sqoot shows them deals related to that category
// ===========================================================================================



// =============== Global Variabls ===============================

var deals; // shows Sqoot's API parameter for a deal, including some of its sub-information
var image; // shows Sqoot's API image parameter (shows an image related to the deal)
var inputCity = "New York";

// When the page loads, the div holding Sqoot's information should be empty
$('#dealsFromSquoot').empty();

// Ajax call to Sqoot API
var queryURL = 'http://api.sqoot.com/v2/deals?api_key=39zxwo4hbW89U737y87p&query=' + inputCity + '&radius=10';
console.log(queryURL);

function callCity(tempCity, category) {

  queryURL = 'http://api.sqoot.com/v2/deals?api_key=39zxwo4hbW89U737y87p&query=' + tempCity + '&radius=10';

  $.ajax ({
  url: queryURL,
  method: 'GET'
  })
  
  .done(function(response) {

    var results = [];
    var image = [];
    var responseHTML = "";

    // Get 10 results and their related images from Sqoot
    for (var i = 0; i < 5; i++) {

      if (response.deals[i] != null) {

    results.push(response.deals[i].deal.title);
    image.push(response.deals[i].deal.image_url);

      }
        

    }

    for (i = 0; i < 5; i++) {

        responseHTML = responseHTML + "<div class='responseDIV'>";
        responseHTML = responseHTML + "<img src='" + image[i] + "' class='responseIMAGE'/>";
        responseHTML = responseHTML + "<p class='responseTEXT'>" + results[i] + "</p>";
        responseHTML = responseHTML + "</div>";
    }
    //make the results appear on the HTML page
    $('#dealsFromSquoot').html(responseHTML);

    //make new div with class of "item"
    /*var gifDiv = $('<div>');
    gifDiv.addClass('item');

//adds a pragrpah tags and changes the content in the p to Ratings
    var p = $('<p>').text(results);

    // make the image appear      
    var dealImage = $('<img>');
    dealImage.data('static', image);

                   
    //sets image src
    dealImage.attr('src', image);

    //everything above is not being shown yet, now we need to actually put the new div on the page
    gifDiv.append(dealImage)

    //put the results at the beginning of the div
    $('#dealsFromSquoot').append(gifDiv);
    */


  });

}

var catButtons = document.getElementsByClassName("btn btn-default btn-lg");