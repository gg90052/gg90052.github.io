"use strict";

$(document).ready(function () {
  $('.home .btn').click(function () {
    $('section').removeClass('show');
    $('.q1').addClass('show');
  });
  $('.q1 .q1a').click(function () {
    $('section').removeClass('show');
    $('.q2').addClass('show');
  });
  $('.q2 .q2a').click(function () {
    $('section').removeClass('show');
    $('.end').addClass('show');
  });
  $('.option.error').click(function () {
    $('.errorModal').addClass('show');
  });
  $('.errorModal .content').click(function () {
    $('.errorModal').removeClass('show');
  });
});