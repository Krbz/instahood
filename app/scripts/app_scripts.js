"use strict"

var initializer = {
    init: function(){
        var guide_container = document.getElementById('guide'),
            language_changer = document.getElementById('language-change');

        //check cookies, jezeli sa, #guide.hidden : V
        var today = new Date();

        // var testObject = { 'one': 1, 'two': 2, 'three': 3 };
        localStorage.setItem('data', JSON.stringify(testObject) );
        var retrievedObject = localStorage.getItem('val1');

        console.log('retrievedObject: ', JSON.parse(retrievedObject).two);
        //
        if ( window.location.hash ) {
            if (window.location.hash === '#pl') {
                guide_container.querySelector('div[data-language="pl"]').classList.add('active');
                language_changer.querySelector('span[data-language="pl"]').classList.add('active');
            } else {
                guide_container.querySelector('div[data-language="en"]').classList.add('active');
                language_changer.querySelector('span[data-language="en"]').classList.add('active');
            }
        } else {
            guide_container.querySelector('div[data-language="pl"]').classList.add('active');
            language_changer.querySelector('span[data-language="pl"]').classList.add('active');
        }
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
            language_changer = language_change.querySelectorAll('span[data-language]'),
            skip_btns = guide_container.querySelectorAll('a[data-href="skip"]');

        //count steps-update function
        function language_steps() {
            var active_container = guide_container.querySelector('div[data-language].active'),
                all_steps = active_container.querySelectorAll('div[data-step]');

            active_container.querySelector('div.progress-count').querySelector('span[data-guide-count').innerHTML = all_steps.length;
            update_step_status();
        }
        function update_step_status() {
            var active_container = guide_container.querySelector('div[data-language].active'),
                all_steps = active_container.querySelectorAll('div[data-step]');
                //
            var count = 0;
            for (var i=0; i < all_steps.length; i++) {
                all_steps[i].classList.contains('hidden') ? count++ : 0;
                active_container.querySelector('div.progress-count').querySelector('span[data-progress-count').innerHTML = count;
                count === all_steps.length ? guide_container.classList.add('hidden') : null;
            }
        }
        //count all steps
        language_steps();
        //skip buttons in any langueges 
        for (var i=0; i < skip_btns.length; i++) {
            skip_btns[i].addEventListener('click', function() {
                guide_container.classList.add('hidden');
            })
        }
        //hide guide steps
        for (var i=0; i < language_containers.length; i++) {

            for (var j=0; j < language_containers.length; j++) {

                language_containers[i].querySelectorAll('div[data-step]')[j].querySelector('i.fa-times').addEventListener('click', function() {
                    var node = this.parentNode

                    node.classList.add('hidden');
                    update_step_status();
                });
            }

        }
        //change language
        for (var i=0; i < language_changer.length; i++) {
            language_changer[i].addEventListener('click', function() {

                for (var j=0; j<language_changer.length; j++) {
                    language_changer[j].classList.remove('active');
                }
                this.classList.add('active');

                for (var j=0; j<language_containers.length; j++) {
                    language_containers[j].classList.remove('active');
                }
                //
                var tmp_active_lang = guide_container.querySelector('div[data-language="'+this.dataset.language+'"'),
                    tmp_steps = tmp_active_lang.querySelectorAll('div[data-step]');
                
                tmp_active_lang.classList.add('active');
                
                for (var j=0; j < tmp_active_lang.querySelectorAll('div[data-step]').length; j++) {
                    tmp_steps[j].classList.contains('hidden') ? tmp_steps[j].classList.remove('hidden') : null;
                    update_step_status();
                }

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