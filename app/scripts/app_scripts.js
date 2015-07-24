"use strict"

var initializer = {
    init: function(){
        initializer.buttons();
    },
    buttons: function(){
        var in_search_toggleMenuBtn = document.querySelector('#navbar i[data-href="menu"]');
        var in_menu_toggleMenuBtn = document.querySelector('#menu i[data-href="menu"]');

        in_search_toggleMenuBtn.addEventListener('click', function(ev) {
            console.log('click', this);
            document.getElementById(this.dataset.href).classList.add('active');
        });
        in_menu_toggleMenuBtn.addEventListener('click', function(ev) {
            console.log('click', this);
            document.getElementById(this.dataset.href).classList.remove('active');
        });
    }
}

//Initializing scripts
initializer.init();


//++
//coords.accuracy - dokładność w metrach, rysuj "radar" dokładności

//++
//get address by lat&lng 
//http://maps.googleapis.com/maps/api/geocode/json?latlng=52.2331853,20.9881666&sensor=true