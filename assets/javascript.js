<!-- Map -->
    <div class="container3 row">
            <div class="col-lg-12 text-center">
                <h3><b>Where are you going today?</b></h3>
                <input id="pac-input" class="controls" type="text" placeholder="Enter a city, state or zip">
                <button type="button" id="currentLocation">Current location</button>
            </div>
        </div>
        <div class="container4"> 
          <div id="result"></div>
        <div id="map"></div>
      </div>

      <script async defer
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAfjDeIgIBM1FumpRj68zq9Soze0RL2odM&libraries=places&callback=initAutocomplete">
    </script>

    #currentLocation{
  margin:10px 0px 0px 10px;
  height: 40px;
  width: 150px;
  background-color: rgba(255,255,255,0.8);
  border-radius: 5px;
  font-family: 'Josefin Slab', serif;
  font-size:18px;
  color: #416ef4;
}

//******  icon click function  *******//
$("#active").on("click",function(){
  console.log("hi");
});
$("#food").on("click",function(){
  console.log("hi");
});
$("#drinks").on("click",function(){
  console.log("hi");
});
$("#shopping").on("click",function(){
  console.log("hi");
});
$("#parks").on("click",function(){
  console.log("hi");
});
$("#museums").on("click",function(){
  console.log("hi");
});
$("#deals").on("click",function(){
  console.log("hi");
});



//*********  Geo location  **********//
$("#currentLocation").on("click",function(){

  // check for Geolocation support
  if(navigator.geolocation){

    //get current position
    navigator.geolocation.getCurrentPosition(

      //when success 
      function(position){
        console.log(position);
        // data
        var data = position.coords;
        var lat = data.latitude;
        var lng = data.longitude;
        var alt = data.altitude;
        var accLatlng = data.accuracy;
        var accAlt = data.altitudeAccuracy;
        //0=N,90=E,180=S,270=W
        var heading = data.heading;
        var speed = data.speed;

        // bug check
        //console.log(lat+lng) ;

        var latlng = new google.maps.LatLng(lat,lng);

        // update latlng location on google maps
        var map = new google.maps.Map(document.getElementById('map'),{
          zoom: 15,      
          center: latlng,
        });

        // put a pin
        new google.maps.Marker({
          map: map,
          position: latlng,
        } ) ;

        //
      },

      //when error
      function(error)
      {
        //error comment
        var errorInfo =[
          "UNKNOWN ERROR",
          "PERMISSION DENIED",
          "POSITION UNAVAILABLE",
        ];

        //error number
        var errorNo = error.code;

        //error comment
        var errorMessage = "Sorry!!! " + errorInfo[errorNo];

        // bug check
        //console.log(errorMessage);
        document.getElementById("result").innerHTML = errorMessage;
      }
    );
  };
});


//*************  Google Map  *************//   

function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30.463426, lng: -3.558594},
    zoom: 2,
    scrollwheel: false,
    disableDefaultUI: true,
    zoomControl: true,
    scaleControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  
  
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {

    searchBox.setBounds(map.getBounds());
    //clear the textbox 
    $("#pac-input").val("");
  });


  var markers = [];
  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    // =============== Begin code to link Goolge city input to Sqoot API ===========================================
      // look inside Google API object for name of city that user typed
      }else {
      var tempCity = places[0].formatted_address;
     // this tells js to look for teh first comma in the string for formatted_address. It then takes whatever is in front of it (the zero index after the split)
      tempCity = tempCity.split(",")[0];
      console.log("this is" + tempCity);
      // run ajax call to Sqoot API
      callCity(tempCity);

      }
// ================= End code to link Google city input to Sqoot API ==========================================


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

};





//***************** START CODING FOR SQOOT API *******************

//Users can see Sqoot's offerings in two ways:
//when a user types a city name into the map's search bar, use that city for sqoot's query
//OR
//===========================================================================================



//=============== Global Variabls ===============================

var deals; // shows Sqoot's API parameter for a deal, including some of its sub-information
var image; // shows Sqoot's API image parameter (shows an image related to the deal)
var inputCity = "Orlando"; // city deals default to Orlando, FL on page load

// When the page loads, the div holding Sqoot's information should be empty
$('#dealsFromSquoot').empty();

// Ajax call to Sqoot API
// this first call populates the Sqoot Deals div
var queryURL = 'http://api.sqoot.com/v2/deals?api_key=39zxwo4hbW89U737y87p&query=' + inputCity + '&radius=10';
console.log(queryURL);

// this function inserts the search box input from Google as the target for Sqoot's API query
function callCity(tempCity, category) {

  queryURL = 'http://api.sqoot.com/v2/deals?api_key=39zxwo4hbW89U737y87p&query=' + tempCity + '&radius=10';

  $.ajax ({
  url: queryURL,
  method: 'GET'
  })
  
  .done(function(response) {
    // these variables will hold the 5 deals for each city; their contents will change as the city changes
    var results = [];
    var image = [];
    var responseHTML = "";

    // Get 5 results and their related images from Sqoot
    for (var i = 0; i < 5; i++) {

      if (response.deals[i] != null) {

    // push the first 5 queries into the arrays
    results.push(response.deals[i].deal.title);
    image.push(response.deals[i].deal.image_url);

      }
    }


    // for every query reply, a div with the class responseDIV is made, inside that div is the image and title
    for (i = 0; i < 5; i++) {

        responseHTML = responseHTML + "<div class='responseDIV'>";
        responseHTML = responseHTML + "<img src='" + image[i] + "' class='responseIMAGE'/>";
        responseHTML = responseHTML + "<p class='responseTEXT'>" + results[i] + "</p>";
        responseHTML = responseHTML + "</div>";
    }
    //make the results appear on the HTML page
    $('#dealsFromSqoot').html(responseHTML);

  });

};

// ============== Begin code for linking Sqoot query by category ======================================
//var catButtons = document.getElementsByClassName("btn btn-default btn-lg");