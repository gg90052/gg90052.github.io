"use strict";

function isMobileDevice() {
  var mobileDevice = ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone'];
  var isMobileDevice = mobileDevice.some(function (e) {
    return navigator.userAgent.match(e);
  });
  return isMobileDevice;
}

// if (isMobileDevice()){
//   document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
// }

if (localStorage.cssMode === 'dark') {
  $('body').addClass('darkmode');
}
var slider = $('.slider_container').slick({
  dots: true,
  infinite: true,
  arrows: false
});