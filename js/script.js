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
	
		var location;
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
			marker = new google.maps.Marker({
				map: map
			});
		  
		  // Try W3C Geolocation method (Preferred)
		  if(navigator.geolocation) {
			browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {
			  dropPin(position.coords.latitude,position.coords.longitude);
			}, function() {
			  handleNoGeolocation(browserSupportFlag);
			});
		  } else if (google.gears) {
			// Try Google Gears Geolocation
			browserSupportFlag = true;
			var geo = google.gears.factory.create('beta.geolocation');
			geo.getCurrentPosition(function(position) {
				dropPin(position.latitude,position.longitude);
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
			location = newyork;
			contentString = "Error: The Geolocation service failed.";
		  } else {
			location = siberia;
			contentString = "Error: Your browser doesn't support geolocation. Are you in Siberia?";
		  }
		  map.setCenter(location);
		  infowindow.setContent(contentString);
		  infowindow.setPosition(location);
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
			dropPin(ui.item.latitude, ui.item.longitude);
		  }
		});
		
		var layer,
			circle,
			polygons = [];
		
		function dropPin(latitude, longitude) {
			location = new google.maps.LatLng(latitude, longitude);
			marker.setPosition(location);
			map.setCenter(location);
			map.setZoom(11);
			
			if (!circle) {
				circle = new google.maps.Circle({
					clickable: false,
					radius: 10000,
					map: map,
					fillOpacity: 0.2,
					strokeOpacity: 0.5,
					strokeWeight: 1
				  });
			};
			circle.setCenter(location);
			
			clearPolygons();
			
			drawPolygon("-37.817921 145.033951 -37.818463 145.05043 -37.842326 145.053864 -37.842868 145.039444 -37.817921 145.033951");
			drawPolygon("-37.843953 145.020218 -37.851543 145.041504 -37.865097 145.025024 -37.843953 145.020218");
			drawPolygon("-37.776142 145.057297 -37.784283 145.067596 -37.769629 145.086823 -37.761487 145.07309 -37.776142 145.057297");
		}
		
		function clearPolygons() {
			$.each(polygons, function() {
				this.setMap(null);
			});
		}
		
		function drawPolygon(polystring){
			var polygon1;
			var arr = new Array();
				arr = polystring.split(" ");
			var i=0;
			var j=0;
			var polycoords = new Array();
			while(i<arr.length){
				polycoords[j] = new google.maps.LatLng(arr[i],arr[i+1]);
				
				i = i+2;
				j++;
			}
			
			polygon1 = new google.maps.Polygon({
				paths: polycoords,
				strokeColor: "#FF0000",
				strokeOpacity: 0.8,
				strokeWeight: 3,
				fillColor: "#FF0000",
				fillOpacity: 0.35,
				contentString: "Testing"
			});
			
			polygon1.setMap(map);

			polygons.push(polygon1);
		}
		
	});

})(this, jQuery, _);





















