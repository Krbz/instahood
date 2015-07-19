console.log('\'Allo \'Allo!');


    var app = {
    	distance: 5000,
	    lat: 52.236253, 
    	lng: 20.958109,
    	count: 9999,
    	client_id: 'db896e3e86384b62843853d0b5ecffe7'
    };

	$.ajax({
		url: 'https://api.instagram.com/v1/media/search?client_id='+ app.client_id+ '&lat='+ app.lat+ '&lng='+ app.lng+ '&distance='+ app.distance+ '&count='+app.count+'&callback=JSON_CALLBACK' ,
		dataType: 'jsonp',
		success: function(dataWeGotViaJsonp){
		    console.log('data', dataWeGotViaJsonp.data);
		}
	});

	var map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 6,
	  center: new google.maps.LatLng(52.236253, 20.958109),
	  streetViewControl: true,
	  mapTypeId: google.maps.MapTypeId.ROADMAP,
	  styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}]
	});
 	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('legend'));


	var directionsService = new google.maps.DirectionsService();
	// function geoLocation() {
			// if(navigator.geolocation) {
			// navigator.geolocation.getCurrentPosition(function(position) {
			//   var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			//   app.lat = position.coords.latitude;
			//   app.lng = position.coords.longitude;
			//   new google.maps.Marker({
			//   	//marker - lokalizacja
			//     map: map,
			//     position: pos
			//   });
			// 		//radar option - distance 5km
			// 	var radar = {
			// 		strokeColor: '#FF0000',
			// 		strokeOpacity: 0.8,
			// 		strokeWeight: 2,
			// 		fillColor: '#FF0000',
			// 		fillOpacity: 0.1,
			// 		map: map,
			// 		center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
			// 		radius: Math.sqrt(app.distance) * 100
			//     };
			//   new google.maps.Circle(radar);
			//   map.setCenter(pos);
			// }, function() {
			//   handleNoGeolocation(true);
			// });
			// } else {
			// // Browser doesn't support Geolocation
			// handleNoGeolocation(false);
			// }
			// function handleNoGeolocation(errorFlag) {
			//   if (errorFlag) {
			//     var content = 'Error: The Geolocation service failed.';
			//   } else {
			//     var content = 'Error: Your browser doesn\'t support geolocation.';
			//   }

			//   var options = {
			//     map: map,
			//     zoom: 3,
			//     position: new google.maps.LatLng(60, 105),
			//     content: content
			//   };

			//   var infowindow = new google.maps.InfoWindow(options);
			//   map.setCenter(options.position);
			// }
			//search system
			//https://developers.google.com/maps/documentation/javascript/examples/places-searchbox 
		// }


				//
	 	// var directionsDisplay = new google.maps.DirectionsRenderer();
	 	// function calcRoute(x, y) {
		  // var selectedMode = 'WALKING';
		  // var request = {
		  //     origin: new google.maps.LatLng(app.lat, app.lng),
		  //     destination: new google.maps.LatLng(x, y),
		  //     travelMode: google.maps.TravelMode[selectedMode]
		  // };
		  // directionsService.route(request, function(response, status) {
		  //   if (status == google.maps.DirectionsStatus.OK) {
		  //     directionsDisplay.setDirections(response);
		  //   }
		  // });
		// }


 // 	//json - data
 	// var url = 'https://api.instagram.com/v1/media/search?client_id='+ app.client_id+ '&lat='+ app.lat+ '&lng='+ app.lng+ '&distance='+ app.distance+ '&count='+app.count;
	// var url_json = url+'&callback=JSON_CALLBACK';

	// $http.jsonp(url_json).success(function (data) {
 //        $scope.data = data.data;
 //    	console.log('data', $scope.data);
 //    	//
	//     var infowindow = new google.maps.InfoWindow();
	//     //
	//     for (var i = 0; i < $scope.data.length; i++) {  
	// 		//
	// 		var icon_options = new google.maps.MarkerImage(
	// 			$scope.data[i].user.profile_picture,
	// 			null, //size (e.x spirit image)
	// 			null, //origin
	// 			null, //anchor
	// 			new google.maps.Size(52,52) //size (52px, 52px on map)
	// 		);
	// 		var marker = new google.maps.Marker({
	// 	        animation: google.maps.Animation.DROP,
	// 	        position: new google.maps.LatLng($scope.data[i].location.latitude, $scope.data[i].location.longitude),
	//         	map: map,
	// 	        icon: icon_options,
	// 	        opacity: 0.4,
	// 	        title: $scope.data[i].user.full_name ? $scope.data[i].user.full_name : $scope.data[i].user.username
	//       	});
	//       	//
	// 		google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
	// 			return function() {
	// 				//
	// 				console.log('this', this.opacity);
	// 			}
	// 		})(marker, i));
	// 		google.maps.event.addListener(marker, 'click', (function(marker, i) {
	// 			return function() {
	// 			 	//rysowanie drogi

	// 			 	//obliczanie odleglosci i pokazanie tego nad droga/pinem whateve
	// 			 	//https://developers.google.com/maps/documentation/javascript/examples/distance-matrix

	// 				directionsDisplay.setMap(map);
	// 				calcRoute(marker.getPosition().A, marker.getPosition().F);
	// 				// request.destination = new google.maps.LatLng();
	// 				//
	// 				var pin_content = '<img class="pin_profile-pic" src='
	// 			  		+$scope.data[i].user.profile_picture+
	// 			  	'>'+
	// 			  	'<p class="pin_profile-name">'+
	// 			  		$scope.data[i].user.username
	// 			  	+'</p>'
	// 			  	+'<a href="'+$scope.data[i].images.standard_resolution.url+'">link</a>';
	// 				infowindow.setContent(pin_content);
	// 				infowindow.open(map, marker);
	// 			}
	// 		})(marker, i));
	//     }
 //    });
  // }
// })();


//https://github.com/aFarkas/html5shiv/ + modernizr 
//google-analytics.com
//http://gmap3.net/en/pages/19-demo/
//https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
//https://developers.google.com/maps/documentation/javascript/examples/map-geolocation