(function(window, $, _){

	//Socket
		/**
		 * Rhok.
		 * Tony Milne, Inlight Media.
		 * June 2011.
		 */

		var webSocket = new io.Socket('g4cx.showoff.io', {port:80});

		/**
		 * Pending requests keyed by guid, with a callback as the value.
		 * E.g. "4FAC90E7-8CF1-4180-B47B-09C3A246CB67": function(err, response) { ... }
		 */
		var pending = {};

		var data = [];

		
		initSocket();

		function bootstrap(url, routes) {
			var parts = url.substring(1).split('/');

			// Traverse the routes, running any functions it finds (and stopping on undefined).

			var path = 'routes';
			var context = routes;
			var called = 0;
			var broke = false;

			for (var i = 0; i < parts.length; i++) {
				var key = parts[i];

				var target = context[key];
				if (typeof target !== 'undefined') {
					if (typeof target === 'function') {
						target();
						called++;
					}
					else if (typeof target === 'object') {
						context = target;

						// Update the path for display purposes on the next loop iteration.
						path += '[' + key + ']';

						// Attempt to call the init function of this object.
						var init = context['init'];
						if (typeof init === 'function') {
							init();
						}
						else {
							$(document).log('Bootstrap route: ' + path + '[init] was undefined or not a function (ignoring this).');
						}
					}
					else {
						$(document).log('Bootstrap route: ' + path + '[' + key + '] was found, but is not a function or object (breaking loop now).');
						broke = true; break;
					}
				}
				else {
					$(document).log('Bootstrap route: ' + path + '[' + key + '] is undefined (breaking loop now).');
					broke = true; break
				}
			}
			if (!broke && called === 0) {
				// Attempt to call index function.
				var index = context['index'];
				if (typeof index === 'function') {
					index();
				}
				else {
					$(document).log('Bootstrap route: ' + path + '[index] was undefined or not a function (ignoring this).');
				}
			}
		}

		/**
		 * Declare bootstrap functions for controllers and actions.
		 * Init functions are run before action functions.
		 * Init functions are run for all actions on a controller.
		 * Action functions are obviously only run for a particular action.
		 */
		var routes = {
			admin: {
				alerts: {
					add: function() {
						// init the map ;)
						initialize();
					}
				}
			},
			alerts: function() {
				alert('hello');
			},
			pages: {
				index: function() {},
				init: function() {},
			},
		};

		function initSocket() {
			// Socket.io
			webSocket.connect();
			webSocket.on('connect', function() {
			});
			webSocket.on('message', function(json) {
				// Attempt to run the callback and delete the response guid from pending requests.
				var msg = JSON.parse(json);

				if (typeof msg.type != 'undefined') {
					// Server subscription pushed message.
					if (msg.type == 'subscription') {
						var now = new Date();
						data.push([now, ++brandViews]);
					}
					else if (msg.type == 'alert') {
						alert('new alert!');
					}
					else if (msg.type == 'response') {
						var guid = msg.echo.identifier;
						if (typeof pending[guid] == 'function') {
							var callback = pending[guid];
							callback(null, msg);
							delete pending[guid];
						}
					}
				}
				else {
					//console.log('Message type is undefined.');
				}
			});
			webSocket.on('disconnect', function() {
				//console.log('web socket disconnect...');
			});
		}

		function socketRequest(url, options, callback) {
			var guid = newGuid();
			var sessionId = getSessionId();

			var parts = url.substring(1).split('/');
			var controller = parts.shift();
			var action = parts.shift();
			var args = parts;

			var method = options.method ? options.method : 'GET';
			var respondAs = options.respondAs ? options.respondAs : 'json';
			var extension = respondAs == 'html' ? 'ejs' : 'json';

			var postParams = options.postParams || {};
			var getParams = {
				extension: extension,
			};

			for (var i = 0; i < args.length; i++) {
				getParams[i] = args[i];
			}

			var request = {
				sessionId: sessionId,
				type: 'request',
				url: url,
				method: method,
				respondAs: respondAs,
				postParams: postParams,
				getParams: getParams,
				echo: {
					identifier: guid,
					expires: null, // iOS devices use this, we don't bother. ;p
				},
			};

			// @TODO: This should just do while... instead of breaking.
			if (typeof pending[guid] != 'undefined') {
				//console.log('Wow. A clash in socket.io request guids occurred... this sure is unexpected!');
			}
			else {
				pending[guid] = callback;
			}

			webSocket.send(request);
		}

		function getSessionId() {
			var sessionId = 'CUEOAxO1VbcW9QivxkxeyI3M.nFMl2KUKXwvgQHOEkDHhjXgMBg7qsaaxmcRPkSCiNTI';

			return sessionId;
		}

		function newGuid() {
			return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());

			function S4() {
			   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			};
		};

		/**
		 * Subscription handlers...
		 * // @TODO: Re-factor these into somewhere better.
		 */

		function newAlert(obj) {

		}

	//Google Maps code
	$(function(){
	
		var mockjson = [{
			_id: 8933563465546,
			alert: {
				status: 'Actual',
				msgType: 'Alert',
			},
			info: {
				headline: 'Building damage in Hawthorn East',
				category: 'Met',
				responseType: 'Evacuate',
				urgency: 'Immediate',
				severity: 'Minor',
				certainty: 'Observed',
			},
			resources: [{
				resourceDesc: 'Website',
				url: 'http://www.bom.gov.au/australia/warnings/index.shtml',
			}],
			area: {
				areaDesc: 'Hawthorn VIC',
				polygon: "-37.817921 145.033951 -37.818463 145.05043 -37.842326 145.053864 -37.842868 145.039444 -37.817921 145.033951"
			}
		},{
			_id: 893264082316,
			alert: {
				status: 'Actual',
				msgType: 'Alert',
			},
			info: {
				headline: 'Flooding in Armadale',
				category: 'Met',
				responseType: 'Evacuate',
				urgency: 'Immediate',
				severity: 'Extreme',
				certainty: 'Observed',
			},
			resources: [{
				resourceDesc: 'Website',
				url: 'http://www.bom.gov.au/australia/warnings/index.shtml',
			}],
			area: {
				areaDesc: 'Hawthorn VIC',
				polygon: '-37.843953 145.020218 -37.851543 145.041504 -37.865097 145.025024 -37.843953 145.020218'
			}
		},{
			_id: 8857578578746,
			alert: {
				status: 'Actual',
				msgType: 'Alert',
			},
			info: {
				headline: 'Severe flooding in Bulleen Park',
				category: 'Met',
				responseType: 'Evacuate',
				urgency: 'Immediate',
				severity: 'Severe',
				certainty: 'Observed',
			},
			resources: [{
				resourceDesc: 'Website',
				url: 'http://www.bom.gov.au/australia/warnings/index.shtml',
			}],
			area: {
				areaDesc: 'Hawthorn VIC',
				polygon: '-37.776142 145.057297 -37.784283 145.067596 -37.769629 145.086823 -37.761487 145.07309 -37.776142 145.057297'
			}
		}];
		
		var warrandyte = [{
			"alert": {
				"status": "Actual",
				"scope": "Public",
				"references": "",
				"note": "",
				"source": "",
				"msgType": "Alert",
				"sent": "",
				"sender": "",
				"identifier": ""
			},
			"info": {
				"language": "en-US",
				"contact": "",
				"web": "",
				"instruction": "",
				"description": "",
				"headline": "Major flooding on the Yarra",
				"senderName": "",
				"expire": "",
				"onset": "",
				"effective": "",
				"certainty": "Observed",
				"severity": "Severe",
				"urgency": "Immediate",
				"responseType": "Evacuate",
				"event": "",
				"category": "Met"
			},
			"resource": [{
				"resourceDesc": 'Website',
				"url": 'http://www.bom.gov.au/australia/warnings/index.shtml',
			}],
			"area": {
				"areaDesc": "Warrandyte",
				"geocode": "-37.723207 145.192738 -37.741942 145.184155 -37.746557 145.198231 -37.743978 145.2178 -37.731218 145.222607 -37.723886 145.212479 -37.723207 145.192738",
				"location": [-37.723207, 145.192738]
			},
			"_id": "4de9daf0ca6f38200e000002"
		},{
			"alert": {
				"status": "Actual",
				"scope": "Public",
				"references": "",
				"note": "",
				"source": "",
				"msgType": "Alert",
				"sent": "",
				"sender": "",
				"identifier": ""
			},
			"info": {
				"language": "en-US",
				"contact": "",
				"web": "",
				"instruction": "",
				"description": "",
				"headline": "Yarra flooding near templestowe parkland",
				"senderName": "",
				"expire": "",
				"onset": "",
				"effective": "",
				"certainty": "Observed",
				"severity": "Moderate",
				"urgency": "Expected",
				"responseType": "Prepare",
				"event": "",
				"category": "Met"
			},
			"resource": [],
			"area": {
				"areaDesc": "Templestowe",
				"geocode": "-37.742078 145.114975 -37.750765 145.133343 -37.744929 145.146904 -37.743707 145.159779 -37.730675 145.163212 -37.732575 145.138321 -37.742078 145.114975",
				"location": [-37.742078, 145.114975]
			},
			"_id": "4de9daf0ca6f38200e000002"
		},{
			"alert": {
				"status": "Actual",
				"scope": "Public",
				"references": "",
				"note": "",
				"source": "",
				"msgType": "Alert",
				"sent": "",
				"sender": "",
				"identifier": ""
			},
			"info": {
				"language": "en-US",
				"contact": "",
				"web": "",
				"instruction": "",
				"description": "",
				"headline": "Yarra floods",
				"senderName": "",
				"expire": "",
				"onset": "",
				"effective": "Observed",
				"certainty": "Likely",
				"severity": "Minor",
				"urgency": "Expected",
				"responseType": "Monitor",
				"event": "",
				"category": "Met"
			},
			"resource": [],
			"area": {
				"areaDesc": "Heidelberg",
				"geocode": "-37.769629 145.066223 -37.772886 145.085964 -37.760808 145.086651 -37.749951 145.076694 -37.760266 145.068111 -37.769629 145.066223",
				"location": [-37.769629, 145.066223]
			},
			"_id": "4de9daf0ca6f38200e000002"
		},
		{
			"alert": {
				"status": "Actual",
				"scope": "Public",
				"references": "",
				"note": "",
				"source": "",
				"msgType": "Alert",
				"sent": "",
				"sender": "",
				"identifier": ""
			},
			"info": {
				"language": "en-US",
				"contact": "",
				"web": "",
				"instruction": "",
				"description": "",
				"headline": "Yarra flooding apocolypse",
				"senderName": "",
				"expire": "",
				"onset": "",
				"effective": "Expected",
				"certainty": "Likely",
				"severity": "Severe",
				"urgency": "Expected",
				"responseType": "Evacuate",
				"event": "",
				"category": "Met"
			},
			"resource": [],
			"area": {
				"areaDesc": "Hawthorn",
				"geocode": "-37.813446 145.00906 -37.820362 145.009575 -37.828226 145.011806 -37.824972 145.028114 -37.818599 145.02039 -37.808292 145.021248 -37.813446 145.00906",
				"location": [-37.813446, 145.00906]
			},
			"_id": "4de9daf0ca6f38200e000002"
		},
		{
			"alert": {
				"status": "Actual",
				"scope": "Public",
				"references": "",
				"note": "",
				"source": "",
				"msgType": "Alert",
				"sent": "",
				"sender": "",
				"identifier": ""
			},
			"info": {
				"language": "en-US",
				"contact": "",
				"web": "",
				"instruction": "",
				"description": "",
				"headline": "Yarra flooding apocolypse",
				"senderName": "",
				"expire": "",
				"onset": "",
				"effective": "Expected",
				"certainty": "Observed",
				"severity": "Extreme",
				"urgency": "Expected",
				"responseType": "Shelter",
				"event": "",
				"category": "Met"
			},
			"resource": [],
			"area": {
				"areaDesc": "Southbank",
				"geocode": "-37.816022 144.972153 -37.821853 144.969234 -37.831616 144.977818 -37.833785 144.986401 -37.829446 144.995327 -37.821446 144.985027 -37.816022 144.972153",
				"location": [-37.816022, 144.972153]
			},
			"_id": "4de9daf0ca6f38200e000002"
		}];
	
		var location;
		var siberia = new google.maps.LatLng(60, 105);
		var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
		var browserSupportFlag =  new Boolean();
		var map;
		var infowindow = new google.maps.InfoWindow();
		var marker;
		var geocoder;
		
		var severityColors = {
			Extreme: "black",
			Severe: "red",
			Moderate: "purple",
			Minor: "blue",
			Unknown: "white"
		};
		  
		function initialize() {
		  var myOptions = {
			zoom: 12,
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
		
		$("#map").height($(window).height() - $("header").outerHeight() - 20);
		
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
			
		var $info = $("#alerts").find("ul");
		
		var activePolygon;
		
		function dropPin(latitude, longitude) {
			var url = '/alerts/nearby/'+latitude.toString().replace(".","_")+'/'+longitude.toString().replace(".","_")+'/10.json';
			
			socketRequest(url, {}, function(err, response){
				console.log(response);
			});
			
			var returndata = warrandyte;
			
			location = new google.maps.LatLng(latitude, longitude);
			marker.setPosition(location);
			map.setCenter(location);
			map.setZoom(12);
			
			if (!circle) {
				circle = new google.maps.Circle({
					clickable: false,
					radius: 10000,
					map: map,
					fillOpacity: 0.1,
					strokeOpacity: 0.5,
					strokeWeight: 1
				  });
			};
			circle.setCenter(location);
			
			clearPolygons();
			
			
			$(document).delegate("header", "click", function(){
				$("#comments").hide();
			});
			$(document).delegate("li.comments", "click", function(event){
				$("#comments").show();
			});
			
			function activatePolygon(polygon, $li, obj) {
				if ($li.hasClass("focus"))
					return;
				
				if (activePolygon) {
					activePolygon.setOptions({fillOpacity: 0.2, strokeWeight: 2});
				}
				activePolygon = polygon;
				polygon.setOptions({fillOpacity: 0.75, strokeWeight: 5});
				$info.children('li.focus').removeClass('focus').children('ul').slideUp();
				$li.addClass('focus').children('ul').slideDown();
				
				ReloadComments(obj._id);
			}
			
			$info.html('');
			
			$.each(returndata, function(){
				var obj = this,
					returnHtml = '';
				
				returnHtml = '<li>' + obj.info.headline + '<ul>'+
					'<li><em>Response Type:</em> '+ obj.info.responseType + '</li>'+
					'<li><em>Urgency:</em> '+ obj.info.urgency + '</li>'+
					'<li><em>Severity:</em> '+ obj.info.severity + '</li>'+
					'<li><em>Certainty:</em> '+ obj.info.certainty + '</li>';
				
				if (obj.resource.length) {
					returnHtml += '<li class="title">Resources</li>';
					$.each(obj.resource, function(){
						returnHtml += '<li><a href="' + this.url + '" target="_blank">' + this.resourceDesc + '</a></li>';
					});
				}
				
				returnHtml += '<li class="comments">Show Comments</li></ul></li>';
				
				var $li = $(returnHtml);
				
				var polygon = drawPolygon(obj.area.geocode, obj.info);
				
				google.maps.event.addListener(polygon, 'click', function() {
					activatePolygon(polygon, $li, obj)
				});
				
				$li.click(function(){
					activatePolygon(polygon, $(this), obj)
				});
				
				$info.append($li);
			});
		}
		
		function clearPolygons() {
			$.each(polygons, function() {
				this.setMap(null);
			});
		}
		
		function setPolygonColor(polygon, color, info) {
			if (color === 'default') {
				color = severityColors[info.severity];
			}
			polygon.setOptions({fillColor: color, strokeColor: color});
		}
		
		function drawPolygon(polystring, info, clickfunction){
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
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillOpacity: 0.2
			});
			
			setPolygonColor(polygon1, 'default', info);
			
			polygon1.setMap(map);

			polygons.push(polygon1);
			
			return polygon1;
		}
		
		
		/* Disqus */
		    //Event Handler to reload comments if the refernence changes. Ie the alert.
			 function ReloadComments(ref) {
				 DISQUS.reset({
					 reload: true,
					 config: function () {
						 this.page.identifier = ref;
						 this.page.url = window.location.href;
					 }
				 });
			 }

			 //Gets an param from  http://www.netlobo.com/url_query_string_javascript.html
			function gup( name )
			{
			  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
			  var regexS = "[\\?&]"+name+"=([^&#]*)";
			  var regex = new RegExp( regexS );
			  var results = regex.exec( window.location.href );
			  if( results == null )
				return "";
			  else
				return results[1];
			}
		  
		  
			var disqus_developer = (/localhost|github|dev/i).test(window.location.href);
			var disqus_identifier = '12234234';
			var disqus_url = window.location.href;
			var disqus_title = 'weatherwarnings';
		
	});

})(this, jQuery, _);





















