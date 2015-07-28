"use strict"
var map;

var app = {
	  map: false, //is map drawn
    distance: 5000,
    lat: 52.236253,
    lng: 20.958109,
    count: 100,
    //OAUTH2 under the Authentication - do poprawy
    client_id: 'db896e3e86384b62843853d0b5ecffe7',
    //
    init: function() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 6,
            center: new google.maps.LatLng(app.lat, app.lng),
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
        google.maps.event.addDomListener(window, "resize", function() {
            //check rwd
            //console.log('window.size', window.innerWidth);
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });
        //Rysuje radar - 5km
        var draw_radar = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.1,
            center: new google.maps.LatLng(app.lat, app.lng),
            radius: Math.sqrt(app.distance) * 100,
            editable: false
        });
        //opcja zmiany zasiegu radaru
        // google.maps.event.addListener(draw_radar, 'mouseover', function () {
        //     draw_radar.set('editable',true);
        // });

        // google.maps.event.addListener(draw_radar, 'mouseout', function () {
        //     draw_radar.set('editable',false);
        // });
        draw_radar.setMap(map);
        //
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                app.lat = position.coords.latitude;
                app.lng = position.coords.longitude;
                //set new coords
                map.setCenter( {lat:app.lat, lng:app.lng} );
                //reset radar
                draw_radar.setCenter( {lat:app.lat, lng:app.lng} );
                //
                // Marker pozycyjny
                var pos_marker = new google.maps.Marker({
                    position: new google.maps.LatLng(app.lat, app.lng),
                    zIndex: 99999,
                    animation: google.maps.Animation.DROP,
                    draggable: true
                });
                pos_marker.setMap(map)
                var pos_marker_infowindow = new google.maps.InfoWindow({
                    content: 'You are here'
                });
                pos_marker_infowindow.open(map, pos_marker);
                var check_guide_class = setInterval(function(){
                    if ( document.getElementById('guide').classList.contains('hidden') ) {
                        setTimeout(function hide_pos_marker_infowindow() {
                            pos_marker_infowindow.close(map, pos_marker);
                        }, 2000);
                        clearInterval(check_guide_class);
                        console.log('true');
                    } else {
                        console.log('false');
                        return false;
                    }
                }, 1000);
                //
                google.maps.event.addListener(pos_marker, 'dragstart', function(event) {
                    //clear radar
                    draw_radar.setMap(null);
                    pos_marker_infowindow.close(map, pos_marker);
                });
                google.maps.event.addListener(pos_marker, 'dragend', function(event) {
                    app.lat = event.latLng.lat();
                    app.lng = event.latLng.lng();
                    draw_radar.setCenter( {lat:app.lat, lng:app.lng} );
                    draw_radar.setMap(map);
                    pos_marker.setPosition( new google.maps.LatLng(app.lat, app.lng) );
                    map.setCenter( {lat:app.lat, lng:app.lng} );
                    //
                    app.getData(event.latLng.lat(), event.latLng.lng())
                });
                //get new data from instagraam api
                app.getData(position.coords.latitude, position.coords.longitude);
            }, function() {
                handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
        function handleNoGeolocation(errorFlag) {
            var content;
            if (errorFlag) {
                content = 'Error: The Geolocation service failed.';
            } else {
                content = 'Rats! It looks like your browser does not support Geolocation.';
            }
            alert(content);
            // wez coordsy default'owe lub z wyszukiwarki adresu
            //
            app.getData(app.lat, app.lng);
            // Marker pozycyjny
            var pos_marker = new google.maps.Marker({
                position: new google.maps.LatLng(app.lat, app.lng),
                zIndex: 99999,
                animation: google.maps.Animation.DROP,
                draggable: true
            });
            pos_marker.setMap(map)
            var pos_marker_infowindow = new google.maps.InfoWindow({
                content: 'You could be here'
            });
            pos_marker_infowindow.open(map, pos_marker);
            var check_guide_class = setInterval(function(){
                if ( document.getElementById('guide').classList.contains('hidden') ) {
                    setTimeout(function hide_pos_marker_infowindow() {
                        pos_marker_infowindow.close(map, pos_marker);
                    }, 2000);
                    clearInterval(check_guide_class);
                    console.log('true');
                } else {
                    console.log('false');
                    return false;
                }
            }, 1000);
            //
            google.maps.event.addListener(pos_marker, 'dragstart', function(event) {
                //clear radar
                draw_radar.setMap(null);
                pos_marker_infowindow.close(map, pos_marker);
            });
            google.maps.event.addListener(pos_marker, 'dragend', function(event) {
                app.lat = event.latLng.lat();
                app.lng = event.latLng.lng();
                draw_radar.setCenter( {lat:app.lat, lng:app.lng} );
                draw_radar.setMap(map);
                pos_marker.setPosition( new google.maps.LatLng(app.lat, app.lng) );
                map.setCenter( {lat:app.lat, lng:app.lng} );
                //
                app.getData(event.latLng.lat(), event.latLng.lng())
            });
        }
    },
    getData: function(posLat, posLng) {
        $.ajax({
            //dodanie walidacji statusu, ponawianie getData();
            url: 'https://api.instagram.com/v1/media/search?client_id=' + app.client_id +
                '&lat=' + posLat + '&lng=' + posLng + '&distance=' + Math.sqrt(app.distance) * 100 +
                '&count='+ app.count + '&callback=JSON_CALLBACK',
            dataType: 'jsonp',
            success: function(callback) {
            	console.log('callback.data',callback.data)
                app.initMapComponents(callback.data);
            }
        });
    },
    initMapComponents: function(callback) {
        map.setZoom(12);
        //
        var rendererOptions = {
            suppressMarkers : true
        }
        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        function calcRoute(x, y) {
            var request = {
                origin: new google.maps.LatLng(app.lat, app.lng),
                destination: new google.maps.LatLng(x, y),
                travelMode: google.maps.TravelMode['DRIVING']
            };
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    var get_distance = response.routes[0].legs[0].distance.value / 1000;
                    console.log('distance in route', get_distance + ' km');
                    //dodaje dane do navbar div z data-attr
                }
            });
        }
        var infowindow = new google.maps.InfoWindow();
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
                icon: icon_options,
                map: map,
                zIndex: i,
                opacity: 0.4,
                title: callback[i].user.full_name ? callback[i].user.full_name : callback[i].user.username
            });
            //events:
            google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
                return function() {
                //Zmienia opacity, mouseleave - zeruje na default (0,4 opacity)
                    console.log('this', this.opacity);
                }
            })(marker, i));
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    console.log('marker', callback[i].link);
                    //obliczanie odleglosci i pokazanie tego nad droga/pinem whateve
                    //https://developers.google.com/maps/documentation/javascript/examples/distance-matrix
                    //
                    //rysowanie drogi
                    directionsDisplay.setMap(null);
                    calcRoute(marker.getPosition().A, marker.getPosition().F);
                    directionsDisplay.setMap(map);

                    var pin_content = '<img class="pin_profile-pic" src='
                    +callback[i].user.profile_picture+
                    '>'+
                    '<p class="pin_profile-name">'+
                    callback[i].user.username
                    +'</p>'
                    +'<a href="'+callback[i].images.standard_resolution.url+'">link</a>';

                    infowindow.setContent(pin_content);
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }
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


//https://github.com/aFarkas/html5shiv/ + modernizr 
//google-analytics.com
//http://gmap3.net/en/pages/19-demo/
//https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
//https://developers.google.com/maps/documentation/javascript/examples/map-geolocation