var app = {
    distance: 5000,
    lat: 52.236253,
    lng: 20.958109,
    count: 100,
    init: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                app.lat = position.coords.latitude;
                app.lng = position.coords.longitude;
                app.getData(position.coords.latitude, position.coords.longitude);
            }, function() {
                handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        } 
        function handleNoGeolocation(errorFlag) {
            if (errorFlag) {
                var content = 'Error: The Geolocation service failed.';
            } else {
                var content = 'Error: Your browser doesn\'t support geolocation.';
            }
            //Jezeli nie wspiera geo - wyszukiwanie po adresie
            //
            // var map = new google.maps.Map(document.getElementById('map'), {
            //     zoom: 6,
            //     center: new google.maps.LatLng(app.lat, app.lng),
            //     streetViewControl: true,
            //     mapTypeId: google.maps.MapTypeId.ROADMAP,
            //     styles: [{
            //         "featureType": "water",
            //         "elementType": "geometry",
            //         "stylers": [{
            //             "color": "#2D333C"
            //         }]
            //     }]
            // });
			app.getData(app.lat, app.lng);
        }
        // this.createMap();
    },
    //OAUTH2 under the Authentication - do poprawy?
    client_id: 'db896e3e86384b62843853d0b5ecffe7',
    getData: function(posLat, posLng) {
        $.ajax({
            //dodanie walidacji statusu, ponawianie getData();
            url: 'https://api.instagram.com/v1/media/search?client_id=' + app.client_id +
                '&lat=' + posLat + '&lng=' + posLng + '&distance=' + app.distance +
                '&count='+ app.count + '&callback=JSON_CALLBACK',
            dataType: 'jsonp',
            success: function(callback) {
                console.log('data', callback.data);
                app.createMap(callback.data, posLat, posLng);
            }
        });
    },
    createMap: function(callback, posLat, posLng) {
    	//remove geo checker
        // if (navigator.geolocation) {
            // navigator.geolocation.getCurrentPosition(function(position) {
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 6,
                    center: new google.maps.LatLng(posLat, posLng),
                    streetViewControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    styles: [{
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [{
                        	"color": "#2D333C"
                        }]
                    }]
                });
                //Rysuje radar - 5km
                var draw_radar = new google.maps.Circle({
                	strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.1,
                    center: new google.maps.LatLng(posLat, posLng),
                    radius: Math.sqrt(app.distance) * 100
                });
                draw_radar.setMap(map);
                map.setZoom(12);
                //
                for (var i = 0; i < callback.length; i++) {  
                	//
                    var icon_options = new google.maps.MarkerImage(
                    callback[i].user.profile_picture,
                        null, //size (e.x spirit image)
                        null, //origin
                        null, //anchor
                        new google.maps.Size(52,52) //size (52px, 52px on map)
                    );
                    var marker = new google.maps.Marker({
                        animation: google.maps.Animation.DROP,
                        position: new google.maps.LatLng(callback[i].location.latitude, callback[i].location.longitude),
                        map: map,
                        icon: icon_options,
                        zIndex: i,
                        opacity: 0.4,
                        title: callback[i].user.full_name ? callback[i].user.full_name : callback[i].user.username
                    });
                    //
					google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
						return function() {
						//
							console.log('this', this.opacity);
						}
					})(marker, i));
					google.maps.event.addListener(marker, 'click', (function(marker, i) {
						return function() {
							console.log('marker', callback[i]);
							//rysowanie drogi
							//obliczanie odleglosci i pokazanie tego nad droga/pinem whateve
							//https://developers.google.com/maps/documentation/javascript/examples/distance-matrix
							directionsDisplay.setMap(map);
							calcRoute(marker.getPosition().A, marker.getPosition().F);
							// request.destination = new google.maps.LatLng();
							//
							var pin_content = '<img class="pin_profile-pic" src='
							+callback[i].user.profile_picture+
							'>'+
							'<p class="pin_profile-name">'+
							callback[i].user.username
							+'</p>'
							+'<a href="'+callback[i].images.standard_resolution.url+'">link</a>';
							//
							infowindow.setContent(pin_content);
							infowindow.open(map, marker);
						}
					})(marker, i));
                }
                // Marker pozycyjny
                var pos_marker = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(posLat, posLng),
                    zIndex: 99999,
                    draggable: true
                });
                var pos_marker_infowindow = new google.maps.InfoWindow({
                	content: 'You are here',
					shadowStyle: 1,
					padding: 0,
					backgroundColor: 'rgb(57,57,57)',
					borderRadius: 5,
					arrowSize: 10,
					borderWidth: 1,
					borderColor: '#2c2c2c',
					disableAutoPan: true,
					hideCloseButton: true,
					arrowPosition: 30,
					backgroundClassName: 'transparent',
					arrowStyle: 2
                });
                pos_marker_infowindow.open(map, pos_marker);
                google.maps.event.addListener(pos_marker, 'dragend', function(event) {
                	var tmp_pos = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
                	//radar option - distance 5km
                	var tmp_radar = new google.maps.Circle({
	                    strokeColor: '#FF0000',
	                    strokeOpacity: 0.8,
	                    strokeWeight: 2,
	                    fillColor: '#FF0000',
	                    fillOpacity: 0.1,
	                    center: tmp_pos,
	                    radius: Math.sqrt(app.distance) * 100
	                });
	                draw_radar.setMap(null);
	                tmp_radar.setMap(null);
	                tmp_radar.setMap(map);
	                app.getData(event.latLng.lat(), event.latLng.lng())
                });
            // }); 
        // }           
    }
}
//
var directionsService = new google.maps.DirectionsService();
app.init();


//
                
//legend
// map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('legend'));









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
        //     //json - data
        // var url = 'https://api.instagram.com/v1/media/search?client_id='+ app.client_id+ '&lat='+ app.lat+ '&lng='+ app.lng+ '&distance='+ app.distance+ '&count='+app.count;
        // var url_json = url+'&callback=JSON_CALLBACK';
        // $http.jsonp(url_json).success(function (data) {
        //     callback = data.data;
        //     console.log('data', callback);
        //     //
        //     var infowindow = new google.maps.InfoWindow();
        //     //
        //     for (var i = 0; i < callback.length; i++) {  
        //      //
        //      var icon_options = new google.maps.MarkerImage(
        //          callback[i].user.profile_picture,
        //          null, //size (e.x spirit image)
        //          null, //origin
        //          null, //anchor
        //          new google.maps.Size(52,52) //size (52px, 52px on map)
        //      );
        //      var marker = new google.maps.Marker({
        //          animation: google.maps.Animation.DROP,
        //          position: new google.maps.LatLng(callback[i].location.latitude, callback[i].location.longitude),
        //          map: map,
        //          icon: icon_options,
        //          opacity: 0.4,
        //          title: callback[i].user.full_name ? callback[i].user.full_name : callback[i].user.username
        //          });
        //          //
        //      google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
        //          return function() {
        //              //
        //              console.log('this', this.opacity);
        //          }
        //      })(marker, i));
        //      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        //          return function() {
        //              //rysowanie drogi
        //              //obliczanie odleglosci i pokazanie tego nad droga/pinem whateve
        //              //https://developers.google.com/maps/documentation/javascript/examples/distance-matrix
        //              directionsDisplay.setMap(map);
        //              calcRoute(marker.getPosition().A, marker.getPosition().F);
        //              // request.destination = new google.maps.LatLng();
        //              //
        //              var pin_content = '<img class="pin_profile-pic" src='
        //                  +callback[i].user.profile_picture+
        //              '>'+
        //              '<p class="pin_profile-name">'+
        //                  callback[i].user.username
        //              +'</p>'
        //              +'<a href="'+callback[i].images.standard_resolution.url+'">link</a>';
        //              infowindow.setContent(pin_content);
        //              infowindow.open(map, marker);
        //          }
        //      })(marker, i));
        //     }
        //    });
        // }
        // })();



        //https://github.com/aFarkas/html5shiv/ + modernizr 
        //google-analytics.com
        //http://gmap3.net/en/pages/19-demo/
        //https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
        //https://developers.google.com/maps/documentation/javascript/examples/map-geolocation