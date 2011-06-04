(function(window, $, _){

	var WeatherWarning = {
		
		location: {
			init: function() {
				var $container = $("#location");
				this.$input = $container.children("input");
				this.$results = $container.children("ul");
				
				this.$input.keyup(function(event){
					var keycode = event.which;					
				});
			}
		}
		
	};
	
	//Google Maps code
	$(function(){
	
		var initialLocation;
		var siberia = new google.maps.LatLng(60, 105);
		var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
		var browserSupportFlag =  new Boolean();
		var map;
		var infowindow = new google.maps.InfoWindow();
		var marker;
		var geocoder;
		  
		function initialize() {
		  var myOptions = {
			zoom: 11,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		  };
		  map = new google.maps.Map(document.getElementById("map"), myOptions);
		  geocoder = new google.maps.Geocoder();
		  var blueimg = new google.maps.MarkerImage("http://www.google.com/intl/en_us/mapfiles/ms/icons/red-dot.png");
			marker = new google.maps.Marker({
				map: map,
				draggable: true,
				icon: blueimg
				
			});
		  
		  // Try W3C Geolocation method (Preferred)
		  if(navigator.geolocation) {
			browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {
			  initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
			  map.setCenter(initialLocation);
			  infowindow.setPosition(initialLocation);
			  infowindow.open(map);
			}, function() {
			  handleNoGeolocation(browserSupportFlag);
			});
		  } else if (google.gears) {
			// Try Google Gears Geolocation
			browserSupportFlag = true;
			var geo = google.gears.factory.create('beta.geolocation');
			geo.getCurrentPosition(function(position) {
			  initialLocation = new google.maps.LatLng(position.latitude,position.longitude);
			  map.setCenter(initialLocation);
			  infowindow.setPosition(initialLocation);
			  infowindow.open(map);
			}, function() {
			  handleNoGeolocation(browserSupportFlag);
			});
		  } else {
			// Browser doesn't support Geolocation
			browserSupportFlag = false;
			handleNoGeolocation(browserSupportFlag);
		  }
		}
		 
		function handleNoGeolocation(errorFlag) {
		  if (errorFlag == true) {
			initialLocation = newyork;
			contentString = "Error: The Geolocation service failed.";
		  } else {
			initialLocation = siberia;
			contentString = "Error: Your browser doesn't support geolocation. Are you in Siberia?";
		  }
		  map.setCenter(initialLocation);
		  infowindow.setContent(contentString);
		  infowindow.setPosition(initialLocation);
		  infowindow.open(map);
		}
		
		initialize();
		
		$("#location>input").autocomplete({
		  //This bit uses the geocoder to fetch address values
		  source: function(request, response) {
			geocoder.geocode( {'address': request.term }, function(results, status) {
			  response($.map(results, function(item) {
				return {
				  label:  item.formatted_address,
				  value: item.formatted_address,
				  latitude: item.geometry.location.lat(),
				  longitude: item.geometry.location.lng()
				}
			  }));
			})
		  },
		  //This bit is executed upon selection of an address
		  select: function(event, ui) {
			$("#latitude").val(ui.item.latitude);
			$("#longitude").val(ui.item.longitude);
			var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
			marker.setPosition(location);
			map.setCenter(location);
		  }
		});
		
	});

})(this, jQuery, _);





















