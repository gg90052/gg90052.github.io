/*
* PANORAMA - Fullscreen Photography HTML Template
* Release Date: January 2017
* Last Update: January 2017
* Author: Madeon08
* Copyright (C) 2017 Madeon08
* This is a premium product available exclusively here : http://themeforest.net/user/Madeon08/portfolio
*/

/*  TABLE OF CONTENTS
    ---------------------------
    1. Loading / Opening
    2. Pagepiling
    3. Photo gallery
    4. Info and Menu Panels
    5. Contact form hovering
    6. Smooth Scroll
*/

"use strict";

/* ------------------------------------- */
/* 1. Loading / Opening ................ */
/* ------------------------------------- */

function isOnMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
}

function Selector_Cache() {
    var collection = {};

    function get_from_cache( selector ) {
        if ( undefined === collection[ selector ] ) {
            collection[ selector ] = $( selector );
        }

        return collection[ selector ];
    }

    return { get: get_from_cache };
}

var selectors = new Selector_Cache();

function LoadingClass() {
    selectors.get("#menu , .indicator, .intro > *").addClass('opacity-0');
}

LoadingClass();

$(window).load(function(){

    selectors.get("#pagepiling").css({'opacity': '0.3'});

    setTimeout(function(){

        selectors.get("#preloader").addClass('loading-done').removeClass('opacity-0');

    },2400);

    setTimeout(function(){

        selectors.get("#pagepiling").css({'opacity': '1'});
        selectors.get("#loading , .overload-left , .overload-right").addClass('loading-done').removeClass('opacity-0');

    },3000);

    setTimeout(function(){

        selectors.get("#menu").addClass('animated-middle fadeInDown').removeClass('opacity-0').css({'opacity': '1'});
        selectors.get(".indicator").removeClass('opacity-0').css({'opacity': '1'});
        selectors.get(".intro").children().addClass('animated-middle fadeInUp').removeClass('opacity-0');

    },3400);

    setTimeout(function(){

        $( "#loading" ).remove();
        selectors.get(".indicator").removeClass('opacity-0');
        selectors.get("#small-screen-menu").addClass('loading-done').removeClass('opacity-0');

        if (!isOnMobile()) {
            setInterval(checkForChanges, 200);
        }

    },3801);

    setTimeout(function(){

        selectors.get("#menu").removeClass('animated-middle fadeInDown');

    },4601);

});

$(document).ready(function(){

    /* ------------------------------------- */
    /* 2. Pagepiling ....................... */
    /* ------------------------------------- */

    //The effect is a bit different on mobile devices for better performance

    selectors.get('body').toggleClass('mobile-device', isOnMobile());

    selectors.get('#pagepiling').pagepiling({
        menu: '#menu',
        direction: 'horizontal',
        keyboardScrolling: true,
        anchors: ['Home', 'Info', 'Shot1', 'Shot2', 'Shot3', 'Shot4', 'Shot5', 'Shot6', 'Shot7', 'Shot8', 'Shot9'],
        navigation: {
            'position': 'right'
        }
    });

    selectors.get('.pagepil-left').on( "click", function() {
        $.fn.pagepiling.moveSectionUp();
    });

    selectors.get('.pagepil-right').on( "click", function() {
        $.fn.pagepiling.moveSectionDown();
    });

    /* ------------------------------------- */
    /* 3. Photo gallery .................... */
    /* ------------------------------------- */
    
    selectors.get('.swipebox').swipebox({
        useCSS : true, // false will force the use of jQuery for animations
        useSVG : true, // false to force the use of png for buttons
        initialIndexOnArray : 0, // which image index to init when a array is passed
        hideCloseButtonOnMobile : false, // true will hide the close button on mobile devices
        removeBarsOnMobile : true, // false will show top bar on mobile devices
        hideBarsDelay : 0, // delay before hiding bars on desktop
        videoMaxWidth : 1140, // videos max width
        beforeOpen: function() {}, // called before opening
        afterOpen: null, // called after opening
        afterClose: function() {}, // called after closing
        loopAtEnd: true // true will return to the first image after the last image is reached
    });

    /* ------------------------------------- */
    /* 4. Info and Menu Panels ............. */
    /* ------------------------------------- */

    selectors.get('.open-info').on( "click", function() {
        selectors.get("#pagepiling , #info , #menu-link , #menu , .holdscroll").addClass("content-opened");

        $.fn.pagepiling.setKeyboardScrolling(false);
    });

    selectors.get('.close-content').on( "click", function() {
        selectors.get("#pagepiling , #info , #menu-link , #menu , .holdscroll").removeClass("content-opened");
        
        $.fn.pagepiling.setKeyboardScrolling(true);
    });

    selectors.get('#small-screen-menu').on( "click", function() {
        selectors.get("#menu , #pagepiling , .holdscroll").toggleClass("menu-opened");
    });

    selectors.get('#menu a').on( "click", function() {
        selectors.get("#pagepiling , #menu , .holdscroll").removeClass("menu-opened");
    });

    $(window).on('resize', function(){
          var win = $(this); //this = window
          if (win.width() >= 1025) { selectors.get("#pagepiling , #menu , .holdscroll").removeClass("menu-opened"); }
    });

    $(document).on( "click", function(e) {

        if (e.target.id !== 'info' && !selectors.get('#info , #menu-link , #menu , .img-info , .holdscroll').find(e.target).length) {
            selectors.get("#pagepiling , #info , #menu-link , #menu , .holdscroll").removeClass("content-opened");
            $.fn.pagepiling.setKeyboardScrolling(true);
        }

        if (e.target.id !== 'menu' && !selectors.get('#info , #menu-link , #menu , #small-screen-menu , .holdscroll').find(e.target).length) {
            selectors.get("#pagepiling , #menu , .holdscroll").removeClass("menu-opened");
        }
    });

    /* ------------------------------------- */
    /* 5. Contact form hovering ............ */
    /* ------------------------------------- */

    selectors.get('.form-control').on('focusin focusout', function() {
        $(this).siblings( ".icon-fields" ).toggleClass('active');
    });

    /* ------------------------------------- */
    /* 6. Smooth Scroll .................... */
    /* ------------------------------------- */

    function scrollToOffset(el){
        var offset=50;
        var elTop=$(el).offset().top-selectors.get(".mCSB_container").offset().top;
        return elTop-offset;
    }

    selectors.get('a.open-info').on( "click", function() {
        var target = "#" + this.getAttribute('data-target');
        
        selectors.get("#mcs_container").mCustomScrollbar("scrollTo", scrollToOffset(target),{
            scrollInertia:500,
            scrollEasing:"easeOut",
            callbacks:false
        });
    });

    function scrollbar(){

        selectors.get('#info').mCustomScrollbar({
            scrollInertia: 150,
            axis            :"y"
        });
    }
  
    scrollbar();

});