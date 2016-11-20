
//*********  Geo location  **********//
$("#currentLocation").on("click",function(){

  // check for Geolocation support
  if(navigator.geolocation){
    //get current position
    navigator.geolocation.getCurrentPosition(

      //when success 
      function(position){
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
      },

      //when error
      function(error)
      {
        //error comment
        var errorInfo =[
          "UNKNOWN ERROR",
          "PERMISSION DENIED",
          "POSITION UNAVAILABLE",
          "TIMEOUT"
        ];

        //error number
        var errorNo = error.code;

        //error comment
        var errorMessage = "Sorry!!! " + errorInfo[errorNo];

        // bug check
        //console.log(errorMessage);
        document.getElementById("result").innerHTML = errorMessage ;
      }
    );
  };
});



//*************  Google Map  *************//    
function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 24.116675, lng: -19.160156},
    zoom: 2,
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

};
//**********  Finish Google Map  *************//


//***************** Code for Sqoot API *******************

  var queryURL = 'http://api.sqoot.com/v2/deals?api_key=39zxwo4hbW89U737y87p&query=orlando';

  $.ajax({url: queryURL, method: 'GET'}).done(function(response) {
       console.log(response.deals[0].deal.image_url);
       console.log(response.deals[2].deal.image_url);
       console.log(response.deals[3].deal.image_url);
       console.log(response.deals[4].deal.image_url);

       $('#showSqootDeals').html(response.deals[0].deal.title);
   
  });

// ****************** Finish Sqoot API *************************