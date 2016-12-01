//******  icon click function  *******//
$('#active').on('click',function(){
  search('gym');
});
$('#food').on('click',function(){
  search('restaurant');
});
$('#drinks').on('click',function(){
  search('night_club');
});
$('#shopping').on('click',function(){
  search('shopping_mall');
});
$('#parks').on('click',function(){
  search('park');
});
$('#museums').on('click',function(){
  search('museum');
});

//*************  Google Map  *************//

var map, places, infoWindow;
var markers = [];
var autocomplete;
var hostnameRegexp = new RegExp('^https?://.+?/');

//map style
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 18.463426, lng: 3.558594},
    mapTypeControl: false,
    panControl: false,
    scrollwheel: false,
    streetViewControl: false,
    zoom: 1


  });
  //map style
  var styles = [
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#9dd68f"
      }
    ]
  },
  {
    "featureType": "transit.station.airport",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd5d6"
      }
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      {
        "color": "#71CDE8"
      }
    ]
  }
];

  map.setOptions({styles: styles});

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
    map.setZoom(14);
  }else {
    var tempCity = places[0].formatted_address;
    // this tells js to look for teh first comma in the string for formatted_address. It then takes whatever is in front of it (the zero index after the split)
    tempCity = tempCity.split(",")[0];
    console.log("this is" + tempCity);
    // run ajax call to Sqoot API
    inputCity = tempCity;
    callCity(tempCity, "default");
  }
};
  
// Search for all buttons activities in the selected city, within the viewport of the map.
function search(x) {
  var search = {
    bounds: map.getBounds(),
    types: [x]
  };

  places.nearbySearch(search, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Create a marker for each place found, and
      // assign image to each marker icon.
      for (var i = 0; i < results.length; i++) {
        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
        });
        // If the user clicks a marker, show the details of their information
        // in a window.
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
      }
    }
  });
  $("#autocomplete").val("");
}


function dropMarker(i) {
  return function() {
    markers[i].setMap(map);
  };
}

//marker design
function addResult(result, i) {
  var results = document.getElementById('results');
  var tr = document.createElement('tr');

  tr.onclick = function() {
    google.maps.event.trigger(markers[i], 'click');
  };
  var name = document.createTextNode(result.name);
}

// Get the place details for a place. Show the information in an info window,
// anchored on the marker for the place that the user selectsed.
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

  // Assign a five-star rating to restaurant, using a black star ('&#10029;')
  // to indicate the rating the restaurant has earned, and a white star ('&#10025;')
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
