// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);
google.maps.event.addDomListener(window, 'resize', init);

function init() {

    // Basic options for a simple Google Map
    // The latitude and longitude to center the map (always required)
    var center = new google.maps.LatLng(48.856614, 2.352222);
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var isDraggable = $(document).width() > 1024 ? true : false; // If document (your website) is wider than 1024px, isDraggable = true, else isDraggable = false

    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        backgroundColor: "rgba(43,43,43,1)", // for example
        zoom: 3,
        scrollwheel: false,
        draggable: isDraggable,
        center: center,
        streetViewControl: true,
        mapTypeControl: false,

        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions, center);

    var locations = [
        ['<h6>LONDON <small>England</small></h6><p>This is where we are currently, the sun goes down...<br><i class="fa fa-calendar"></i> Present from Nov 8 – Dec 5</p>', 51.507351, -0.127758, 1],
        ['<h6>PARIS <small>France</small></h6><p>This is where we are currently, the sun goes down...<br><i class="fa fa-calendar"></i> Present from Nov 8 – Dec 5</p>', 48.856614, 2.352222, 2],
        ['<h6>ROME <small>Italy</small></h6><p>This is where we are currently, the sun goes down...<br><i class="fa fa-calendar"></i> Present from Nov 8 – Dec 5</p>', 41.902783, 12.496366, 3],
        ['<h6>SYDNEY <small>Australia</small></h6><p>This is where we are currently, the sun goes down...<br><i class="fa fa-calendar"></i> Present from Nov 8 – Dec 5</p>', -33.868820, 151.209296, 4],
        ['<h6>NEW YORK <small>United-states</small></h6><p>This is where we are currently, the sun goes down...<br><i class="fa fa-calendar"></i> Present from Nov 8 – Dec 5</p>', 40.712784, -74.005941, 5],
        ['<h6>KINGSTON <small>Jamaica</small></h6><p>This is where we are currently, the sun goes down...<br><i class="fa fa-calendar"></i> Present from Nov 8 – Dec 5</p>', 18.017874, -76.809904, 6],
        ['<h6>BERLIN <small>Germany</small></h6><p>This is where we are currently, the sun goes down...<br><i class="fa fa-calendar"></i> Present from Nov 8 – Dec 5</p>', 52.520007, 13.404954, 7],
        ['<h6>LOS ANGELES <small>United-states</small></h6><p>This is where we are currently, the sun goes down...<br><i class="fa fa-calendar"></i> Present from Nov 8 – Dec 5</p>', 34.052234, -118.243685, 8],
        ['<h6>TOKYO <small>Japan</small></h6><p>This is where we are currently, the sun goes down...<br><i class="fa fa-calendar"></i> Present from Nov 8 – Dec 5</p>', 35.689487, 139.691706, 9],
        ['<h6>MOSCOW <small>Russia</small></h6><p>This is where we are currently, the sun goes down...<br><i class="fa fa-calendar"></i> Present from Nov 8 – Dec 5</p>', 55.755826, 37.617300, 10],
        ['<h6>DOHA <small>Qatar</small></h6><p>This is where we are currently, the sun goes down...<br><i class="fa fa-calendar"></i> Present from Nov 8 – Dec 5</p>', 25.285447, 51.531040, 11]
    ];

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    var mapIcon = {    
        path: google.maps.SymbolPath.CIRCLE,
        scale: 3,
        fillColor: 'white',
        fillOpacity: 1,
        strokeColor: 'white',   
    };

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            icon: mapIcon
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            };
        })(marker, i));

        marker.addListener('mouseover', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            };
        })(marker, i));

        // assuming you also want to hide the infowindow when user mouses-out
        // marker.addListener('mouseout', (function(marker, i) {
        //     return function() {
        //         infowindow.close();
        //     };
        // })(marker, i));
    }

    // google.maps.event.addListener(marker, 'click', function() {
    //     infowindow.open(map, marker);
    // });

    
}