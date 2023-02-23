"use strict";

function isMobileDevice() {
  var mobileDevice = ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone'];
  var isMobileDevice = mobileDevice.some(function (e) {
    return navigator.userAgent.match(e);
  });
  return isMobileDevice;
}
function atMobilePage() {
  var path = location.pathname;
  if (path.includes('m_')) {
    return true;
  } else {
    return false;
  }
}
if (!isMobileDevice() && atMobilePage()) {
  location.href = "index.html";
} else if (isMobileDevice() && !atMobilePage()) {
  location.href = "m_index.html";
}
if (isMobileDevice()) {
  document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
}
$('.gotop').click(function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
$('.firstview .scroll').click(function () {
  window.scrollTo({
    top: 800,
    behavior: 'smooth'
  });
});
AOS.init();
$.get('https://script.google.com/macros/s/AKfycbzUKzkDdh7aVz6p19gRIFofh4H8SWcuPT0jeTIIAs6KNHhoZwwlka07RthkStdpdawILw/exec', function (res) {
  res.forEach(function (item, index) {
    var tar = $("#video".concat(index + 1));
    tar.attr('href', item.link);
    tar.find('img').prop('src', item.image);
    tar.find('p').text(item.name);
  });
});
var easeInOut = function easeInOut(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t * t + b;
  t -= 2;
  return c / 2 * (t * t * t + 2) + b;
};
var regions = new countUp.CountUp('regions', 20, {
  duration: 1,
  easingFn: easeInOut
});
var students = new countUp.CountUp('students', 88.89, {
  decimalPlaces: 2,
  duration: 1,
  easingFn: easeInOut
});
var pie64_big = new countUp.CountUp('pie64_big', 64, {
  duration: 1,
  easingFn: easeInOut
});
var pie64_small = new countUp.CountUp('pie64_small', 52, {
  duration: 1,
  easingFn: easeInOut,
  prefix: '.',
  suffix: '%'
});
var pie35_big = new countUp.CountUp('pie35_big', 35, {
  duration: 1,
  easingFn: easeInOut
});
var pie35_small = new countUp.CountUp('pie35_small', 48, {
  duration: 1,
  easingFn: easeInOut,
  prefix: '.',
  suffix: '%'
});
var counterIO = new IntersectionObserver(function (entries) {
  if (entries[0].intersectionRatio >= 0.5) {
    regions.start();
    students.start();
  }
}, {
  threshold: .5
});
counterIO.observe(document.querySelector('#regions'));
var pieIO = new IntersectionObserver(function (entries) {
  if (entries[0].intersectionRatio >= 0.5) {
    pie64_big.start();
    pie64_small.start();
    pie35_big.start();
    pie35_small.start();
  }
}, {
  threshold: .5
});
pieIO.observe(document.querySelector('.block2'));
document.addEventListener('aos:in:point_anchor', function () {
  document.querySelector('section.map').classList.add('showPoint');
});
document.addEventListener('aos:out:point_anchor', function () {
  document.querySelector('section.map').classList.remove('showPoint');
});
var totalSlides = $('.slides .slide').length;
$('.pager .total').text('0' + totalSlides);
var slider = $('.slides').slick({
  fade: true,
  cssEase: 'linear'
});
$('.slides').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
  $('.pager .current').text('0' + (nextSlide + 1));
  $('.slide_titles p').removeClass('show');
  $('.slide_titles p').eq(nextSlide).addClass('show');
  $('.slide_content ul').removeClass('show');
  $('.slide_content ul').eq(nextSlide).addClass('show');
});