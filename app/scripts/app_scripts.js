"use strict"

var initializer = {
    init: function(){
        initializer.buttons();
        initializer.guide();
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
    },
    guide: function() {
        var guide_container = document.getElementById('guide'),
            language_containers = guide_container.querySelectorAll('div[data-language]'),
            language_change = document.getElementById('language-change'),
            language_changer = language_change.querySelectorAll('span[data-language]');

        //hide guide steps
        //
        for (var i=0; i < language_containers.length; i++) {

            for (var j=0; j<language_containers.length; j++) {
                language_containers[i].querySelectorAll('div[data-step]')[j].querySelector('i.fa-times').addEventListener('click', function() {
                    this.parentNode.classList.add('hidden');
                    //add to this.parent.parent counter if (steps_c/all_steps_c) {guide_container.classList.add('hidden') }
                });
            }

        }
        //change language
        for (var i=0; i < language_changer.length; i++) {
            language_changer[i].addEventListener('click', function() {

                for (var k=0; k<language_changer.length; k++) {
                    language_changer[k].classList.remove('active');
                }
                this.classList.add('active');

                for (var j=0; j<language_containers.length; j++) {
                    language_containers[j].classList.remove('active');
                }

                guide_container.querySelector('div[data-language="'+this.dataset.language+'"').classList.add('active')
            })
        }
    }
}

//Initializing scripts
initializer.init();


//++
//coords.accuracy - dokładność w metrach, rysuj "radar" dokładności

//++
//get address by lat&lng 
//http://maps.googleapis.com/maps/api/geocode/json?latlng=52.2331853,20.9881666&sensor=true