//******  icon click function  *******//
$('#active').on('click',function(){
  search('gym');

  $('.responseDIV').empty();
  callCity(inputCity, "fitness,gym,activities-events,bowling,city-tours,comedy-clubs,concerts");
  
});

$('#food').on('click',function(){
  search('restaurant');

  $('.responseDIV').empty();
  callCity(inputCity, "food-grocery,food_alcohol,restaurants,kosher,dining-nightlife");
});

$('#drinks').on('click',function(){
  search('night_club');

  $('.responseDIV').empty();
  callCity(inputCity, "food_alcohol,bars-clubs,dining-nightlife,wine-tasting");
});

$('#shopping').on('click',function(){
  search('shopping_mall');

  $('.responseDIV').empty();
  callCity(inputCity, "fashion_accessories,home_goods,luggage,gifts,kitchen,women_fashion,womens-clothing,special-interest,retail-services,movies_music_games,mens-clothing,mens_fashion");
});

$('#parks').on('click',function(){
  search('park');

  $('.responseDIV').empty();
  callCity(inputCity, "outdoor-adventures,city-tours,golf,skiing,skydiving,yoga");
});

$('#museums').on('click',function(){
  search('museum');

  $('.responseDIV').empty();
  callCity(inputCity, "museums");
});

$('#deals').on('click',function(){
  sqoot();
  $('.responseDIV').empty();
  callCity(inputCity, "default");

});

//*************  Google Map  *************//

      var map, places, infoWindow;
      var markers = [];
      var autocomplete;
      var countryRestrict = {'country': 'us'};
      var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
      var hostnameRegexp = new RegExp('^https?://.+?/');



      //map style
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 30.463426, lng: -3.558594},
          mapTypeControl: false,
          panControl: false,
          scrollwheel: false,
          zoomControl: false,
          streetViewControl: false,
          zoom: 2


        });
        //shops information
        infoWindow = new google.maps.InfoWindow({
          content: document.getElementById('info-content')
        });

        // Create the autocomplete object and associate it with the UI input control.
        // Restrict the search to the default country, and to place type "cities".
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */ 
            (document.getElementById('autocomplete')), {
              types: ['(cities)'],
              componentRestrictions: countryRestrict
            });
        places = new google.maps.places.PlacesService(map);

        autocomplete.addListener('place_changed', onPlaceChanged);

      } 
 

      // When the user selects a city, get the place details for the city and
      // zoom the map in on the city.
      function onPlaceChanged() {
        var place = autocomplete.getPlace();
        if (place.geometry) {
          map.panTo(place.geometry.location);
          map.setZoom(15);
          search();

           }
      } 

      function sqoot() {
      
        var tempCity = places[0].formatted_address;
          // this tells js to look for teh first comma in the string for formatted_address. It then takes whatever is in front of it (the zero index after the split)
          tempCity = tempCity.split(",")[0];
          console.log("this is" + tempCity);
          // run ajax call to Sqoot API
          inputCity = tempCity;
          callCity(tempCity, "default");
      }
        
      // Search for all buttons activities in the selected city, within the viewport of the map.
      function search(x) {
        var search = {
          bounds: map.getBounds(),
          types: [x]
        };

        places.nearbySearch(search, function(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearResults();
            clearMarkers();
            // Create a marker for each place found, and
            // assign a letter of the alphabetic to each marker icon.
            for (var i = 0; i < results.length; i++) {
              var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
              var markerIcon = MARKER_PATH + markerLetter + '.png';
              // Use marker animation to drop the icons incrementally on the map.
              markers[i] = new google.maps.Marker({
                position: results[i].geometry.location,
                animation: google.maps.Animation.DROP,
                icon: markerIcon
              });
              // If the user clicks a marker, show the details of that hotel
              // in an info window.
              markers[i].placeResult = results[i];
              google.maps.event.addListener(markers[i], 'click', showInfoWindow);
              setTimeout(dropMarker(i), i * 100);
              addResult(results[i], i);
            }
          }
        });
        $("#autocomplete").val("");
      }

  
      function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
          if (markers[i]) {
            markers[i].setMap(null);
          }
        }
        markers = [];
      }


      function dropMarker(i) {
        return function() {
          markers[i].setMap(map);
        };
      }

      //marker design
      function addResult(result, i) {
        var results = document.getElementById('results');
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';

        //border color design
        var tr = document.createElement('tr');
        tr.style.backgroundColor = (i % 2 === 0 ? '#d0e1fb' : '#FFFFFF');
        tr.onclick = function() {
          google.maps.event.trigger(markers[i], 'click');
        };

        var iconTd = document.createElement('td');
        var nameTd = document.createElement('td');
        var icon = document.createElement('img');
        icon.src = markerIcon;
        icon.setAttribute('class', 'placeIcon');
        icon.setAttribute('className', 'placeIcon');
        var name = document.createTextNode(result.name);
        iconTd.appendChild(icon);
        nameTd.appendChild(name);
        tr.appendChild(iconTd);
        tr.appendChild(nameTd);
        results.appendChild(tr);
      }

      function clearResults() {
        var results = document.getElementById('results');
        while (results.childNodes[0]) {
          results.removeChild(results.childNodes[0]);
        }
      }

      // Get the place details for a hotel. Show the information in an info window,
      // anchored on the marker for the hotel that the user selected.
      function showInfoWindow() {
        var marker = this;
        places.getDetails({placeId: marker.placeResult.place_id},
            function(place, status) {
              if (status !== google.maps.places.PlacesServiceStatus.OK) {
                return;
              }
              infoWindow.open(map, marker);
              buildIWContent(place);
            });
      }

      // Load the place information into the HTML elements used by the info window.
      function buildIWContent(place) {
        document.getElementById('iw-icon').innerHTML = '<img class="searchIcon" ' +
            'src="' + place.icon + '"/>';
        document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
            '">' + place.name + '</a></b>';
        document.getElementById('iw-address').textContent = place.vicinity;

        if (place.formatted_phone_number) {
          document.getElementById('iw-phone-row').style.display = '';
          document.getElementById('iw-phone').textContent =
              place.formatted_phone_number;
        } else {
          document.getElementById('iw-phone-row').style.display = 'none';
        }

        // Assign a five-star rating to the hotel, using a black star ('&#10029;')
        // to indicate the rating the hotel has earned, and a white star ('&#10025;')
        // for the rating points not achieved.
        if (place.rating) {
          var ratingHtml = '';
          for (var i = 0; i < 5; i++) {
            if (place.rating < (i + 0.5)) {
              ratingHtml += '&#10025;';
            } else {
              ratingHtml += '&#10029;';
            }
          document.getElementById('iw-rating-row').style.display = '';
          document.getElementById('iw-rating').innerHTML = ratingHtml;
          }
        } else {
          document.getElementById('iw-rating-row').style.display = 'none';
        }

        // The regexp isolates the first part of the URL (domain plus subdomain)
        // to give a short URL for displaying in the info window.
        if (place.website) {
          var fullUrl = place.website;
          var website = hostnameRegexp.exec(place.website);
          if (website === null) {
            website = 'http://' + place.website + '/';
            fullUrl = website;
          }
          document.getElementById('iw-website-row').style.display = '';
          document.getElementById('iw-website').textContent =  website;
        } else {
          document.getElementById('iw-website-row').style.display = 'none';
        }
      }




//***************** START CODING FOR SQOOT API *******************

//Users can see Sqoot's offerings in two ways:
//when a user types a city name into the map's search bar, use that city for sqoot's query
//OR
//===========================================================================================



//=============== Global Variabls ===============================

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

};

// ============== Begin code for linking Sqoot query by category ======================================

// $('#food').click(function() {
// 
  // $('.responseDIV').empty();
// 
 // callCity(inputCity, "food-grocery,food_alcohol,restaurants,kosher,dining-nightlife");
// 
// });
// 
// $('#activities').click(function() {
   // $('.responseDIV').empty();
// 
 // callCity(inputCity, "fitness,gym,activities-events,bowling,city-tours,comedy-clubs,concerts");
// });
// 
// $('#drinks').click(function() {
   // $('.responseDIV').empty();
// 
 // callCity(inputCity, "food_alcohol,bars-clubs,dining-nightlife,wine-tasting");
// });
// 
// $('#shopping').click(function() {
   // $('.responseDIV').empty();
// 
 // callCity(inputCity, "fashion_accessories,home_goods,luggage,gifts,kitchen,women_fashion,womens-clothing,special-interest,retail-services,movies_music_games,mens-clothing,mens_fashion");
// });
// 
// $('#parks').click(function() {
   // $('.responseDIV').empty();
// 
 // callCity(inputCity, "outdoor-adventures,city-tours,golf,skiing,skydiving,yoga");
// });
// 
// $('#museums').click(function() {
   // $('.responseDIV').empty();
// 
 // callCity(inputCity, "museums");
// });
// 
// $('#dealDefault').click(function() {
   // $('.responseDIV').empty();
// 
 // callCity(inputCity, "default");
//});