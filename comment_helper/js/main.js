"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var errorMessage = false;
var fberror = '';
window.onerror = handleErr;
var TABLE;
var lastCommand = 'comments';
var addLink = false;
var auth_scope = '';
var jsVersion = '0720';

function handleErr(msg, url, l) {
  if (!errorMessage) {
    var _url = $('#enterURL .url').val();

    console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
    console.log("Error occur URL： " + _url);
    $(".console .error").append("<br><br>".concat(fberror, "<br><br>").concat(_url));
    $(".console .error").fadeIn();
    errorMessage = true;
  }

  return false;
}

$(document).ready(function () {
  var hash = location.search;

  if (hash.indexOf("extension") >= 0) {
    $(".loading.checkAuth").removeClass("hide");
    data.extension = true;
    $(".loading.checkAuth button").click(function (e) {
      fb.extensionAuth();
    });
  }

  $('#pay_token').prop('placeholder', $('#pay_token').prop('placeholder') + '_' + jsVersion);
  $("#btn_page_selector").click(function (e) {
    fb.getAuth('signin');
  }); // $('#btn_reauth').click(function(){
  // 	fb.reauth();
  // });

  var copyurl = new ClipboardJS('.btn_copyurl', {
    text: function text(trigger) {
      return $('input.url').val();
    }
  });
  copyurl.on('success', function (e) {
    alert('已複製\n' + e.text);
  });
  var clipboard = new ClipboardJS('.btn_token', {
    text: function text(trigger) {
      return config.pageToken || config.userToken;
    }
  });
  clipboard.on('success', function (e) {
    alert('已複製\n' + e.text);
  });
  $("#btn_comments").click(function (e) {
    if (e.ctrlKey || e.altKey) {
      config.order = 'chronological';
    }

    fb.user_posts = true; // fbid.init('comments');

    data.start('comments');
  });
  $('#btn_share').click(function () {
    var input = $('input.url').val();
    var fbid = input.split('_')[input.split('_').length - 1];
    window.open("https://m.facebook.com/browse/shares?id=".concat(fbid));
  });
  $("#btn_like").click(function (e) {
    if (e.ctrlKey || e.altKey) {
      config.likes = true;
    }

    fb.user_posts = true;
    data.start('reactions');
  });
  $("#btn_pay").click(function () {
    fb.getAuth('signup');
  });
  $("#btn_choose").click(function () {
    choose.init();
  });
  $("#moreprize").click(function () {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      $(".gettotal").removeClass("fadeout");
      $('.prizeDetail').removeClass("fadein");
    } else {
      $(this).addClass("active");
      $(".gettotal").addClass("fadeout");
      $('.prizeDetail').addClass("fadein");
    }
  });
  $("#endTime").click(function () {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
    } else {
      $(this).addClass("active");
    }
  });
  $("#btn_addPrize").click(function () {
    $(".prizeDetail").append("<div class=\"prize\"><div class=\"input_group\">\u54C1\u540D\uFF1A<input type=\"text\"></div><div class=\"input_group\">\u62BD\u734E\u4EBA\u6578\uFF1A<input type=\"number\"></div></div>");
  });
  $(window).keyup(function (e) {
    if (!e.ctrlKey || e.altKey) {
      $("#btn_excel").text("複製表格內容");
    }
  });
  $("#unique, #tag").on('change', function () {
    table.redo();
  });
  $(".uipanel .react").change(function () {
    config.filter.react = $(this).val();
    table.redo();
  });
  $('.rangeDate').daterangepicker({
    "timePicker": true,
    "timePicker24Hour": true,
    "locale": {
      "format": "YYYY/MM/DD HH:mm",
      "separator": "-",
      "applyLabel": "確定",
      "cancelLabel": "取消",
      "fromLabel": "From",
      "toLabel": "To",
      "customRangeLabel": "Custom",
      "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
      "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      "firstDay": 1
    }
  }, function (start, end, label) {
    config.filter.startTime = start.format('YYYY-MM-DD-HH-mm-ss');
    config.filter.endTime = end.format('YYYY-MM-DD-HH-mm-ss');
    table.redo();
  });
  $('.rangeDate').data('daterangepicker').setStartDate(config.filter.startTime);
  var ci_counter = 0;
  $(".ci").click(function (e) {
    ci_counter++;

    if (ci_counter >= 5) {
      $(".source .url, .source .btn").addClass("hide");
      $("#inputJSON").removeClass("hide");
    }

    if (e.ctrlKey || e.altKey) {}
  });
  $("#inputJSON").change(function () {
    $(".waiting").removeClass("hide");
    $(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
    config.from_extension = true;
    data["import"](this.files[0]);
  });
  cheet('↑ ↑ ↓ ↓ ← → ← → b a', function () {
    $('.input_token').removeClass('hide');
    $('input.url').prop('disabled', false);
    $('.page_target').removeClass('hide');
  });
});
var config = {
  field: {
    comments: ['like_count', 'message_tags', 'message', 'from', 'created_time'],
    reactions: [],
    feed: ['created_time', 'from', 'message', 'story'],
    likes: ['name']
  },
  limit: '30',
  apiVersion: 'v8.0',
  filter: {
    word: '',
    react: 'all',
    startTime: '2000-12-31-00-00-00',
    endTime: nowDate()
  },
  target: '',
  command: '',
  order: 'chronological',
  auth: 'groups_show_list, pages_show_list, pages_read_engagement, pages_read_user_content, groups_access_member_info',
  likes: false,
  pageToken: false,
  userToken: '',
  me: '',
  from_extension: false,
  auth_user: false,
  signin: false
};
var fb = {
  user_posts: false,
  getAuth: function getAuth() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    // if (config.signin === true) {
    // 	page_selector.show();
    // 	return false;
    // }
    FB.login(function (response) {
      fb.callback(response, type);
    }, {
      auth_type: 'rerequest',
      scope: config.auth,
      return_scopes: true
    });
  },
  callback: function callback(response, type) {
    // console.log(response);
    if (response.status === 'connected') {
      config.userToken = response.authResponse.accessToken;
      config.me = response.authResponse.userID;
      config.from_extension = false;

      if (type == 'signup') {
        // 註冊
        var token = $('#pay_token').val() == '' ? '-1' : $('#pay_token').val();
        FB.api("/me?fields=id,name", function (res) {
          var obj = {
            token: token,
            username: res.name,
            app_scope_id: res.id
          };
          $('.waiting').removeClass('hide');
          $.post('https://script.google.com/macros/s/AKfycbzrtUqld8v4IQYjegA6XxmRTYZwLi5Hlkz0dhTBEBYdh5CAFQ8/exec', obj, function (res2) {
            $('.waiting').addClass('hide');

            if (res2.code == 1) {
              alert(res2.message);
              fb.callback(response, 'signin');
            } else {
              alert(res2.message + '\n' + JSON.stringify(obj));
            }
          });
        });
      }

      if (type == 'signin') {
        $('.waiting').removeClass('hide');
        $.get('https://script.google.com/macros/s/AKfycbzrtUqld8v4IQYjegA6XxmRTYZwLi5Hlkz0dhTBEBYdh5CAFQ8/exec?id=' + config.me, function (res2) {
          $('.waiting').addClass('hide');

          if (res2 === 'true') {
            config.auth_user = true;
            $('.page_group').removeClass('hide');
          } else {
            config.auth_user = false;
          }

          page_selector.show();
        });
      }

      if (type == "page_selector") {
        page_selector.show();
      }
    } else {
      FB.login(function (response) {
        fb.callback(response);
      }, {
        scope: config.auth,
        return_scopes: true
      });
    }
  },
  extensionAuth: function extensionAuth() {
    config.from_extension = true;
    FB.login(function (response) {
      fb.extensionCallback(response);
    }, {
      scope: config.auth,
      return_scopes: true
    });
  },
  extensionCallback: function extensionCallback(response) {
    if (response.status === 'connected') {
      config.from_extension = true;
      FB.api("/me?fields=id,name", function (res) {
        $.get('https://script.google.com/macros/s/AKfycbxaGXkaOzT2ADCC8r-A4qBMg69Wz_168AHEr0fZ/exec?id=' + res.id, function (res2) {
          if (res2 === 'true') {
            fb.authOK();
          } else {
            swal({
              title: '抓分享需付費，詳情請見粉絲專頁',
              html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a><br>userID：' + res.id,
              type: 'warning'
            }).done();
          }
        });
      });
    } else {
      FB.login(function (response) {
        fb.extensionCallback(response);
      }, {
        scope: config.auth,
        return_scopes: true
      });
    }
  },
  authOK: function authOK() {
    $(".loading.checkAuth").addClass("hide");
    config.command = JSON.parse(localStorage.postdata).command;
    data.finish(JSON.parse($(".chrome").val()));
  }
};
var data = {
  raw: [],
  filtered: [],
  userid: '',
  nowLength: 0,
  extension: false,
  init: function init() {
    $(".main_table").DataTable().destroy();
    $("#awardList").hide();
    $(".console .message").text('截取資料中...');
    data.nowLength = 0;
  },
  start: function start(command) {
    $(".waiting").removeClass("hide");
    var fbid = $('input.url').val();
    config.command = command;
    $('.pure_fbid').text(fbid);
    var rawdata = [];
    data.get(fbid).then(function (res) {
      // fbid.data = res;
      var _iterator = _createForOfIteratorHelper(res),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var i = _step.value;
          rawdata.push(i);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      data.finish(rawdata);
    });
  },
  get: function get(fbid) {
    return new Promise(function (resolve, reject) {
      var datas = [];
      var token = config.pageToken == '' ? "&access_token=".concat(config.userToken) : "&access_token=".concat(config.pageToken);
      if ($('.input_token').val() !== '') token = "&access_token=".concat($('.input_token').val());
      FB.api("".concat(config.apiVersion, "/").concat(fbid, "/").concat(config.command, "?limit=").concat(config.limit, "&order=").concat(config.order, "&fields=").concat(config.field[config.command].toString()).concat(token, "&debug=all"), function (res) {
        data.nowLength += res.data.length;
        $(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
        groupData(res);

        if (res.data.length > 0 && res.paging.next) {
          getNext(res.paging.next);
        } else {
          $(".console .message").text('');
          resolve(datas);
        }
      });

      function groupData(res) {
        var _iterator2 = _createForOfIteratorHelper(res.data),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var d = _step2.value;

            if (config.command == 'reactions' || config.command == 'likes' || config.likes) {
              d.from = {
                id: d.id,
                name: d.name
              };
            }

            if (config.likes) d.type = "LIKE";

            if (d.from) {
              datas.push(d);
            } else {
              //event
              d.from = {
                id: d.id,
                name: d.id
              };

              if (d.updated_time) {
                d.created_time = d.updated_time;
              }

              datas.push(d);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      function getNext(url) {
        var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (limit !== 0) {
          url = url.replace('limit=500', 'limit=' + limit);
        }

        $.getJSON(url, function (res) {
          groupData(res);

          if (res.data.length > 0 && res.paging.next) {
            // if (data.nowLength < 180) {
            getNext(res.paging.next);
          } else {
            $(".console .message").text('');
            resolve(datas);
          }
        }).fail(function () {
          getNext(url, 200);
        });
      }
    });
  },
  finish: function finish(rawdata) {
    $(".waiting").addClass("hide");
    $(".main_table").removeClass("hide");
    $(".update_area,.donate_area").slideUp();
    $(".result_area").slideDown();
    swal('完成！', 'Done!', 'success').done();
    data.raw = rawdata;
    data.filter();
    ui.reset();
  },
  filter: function filter() {
    var isDuplicate = $("#unique").prop("checked");
    var isTag = $("#tag").prop("checked");
    data.filtered = _filter.totalFilter.apply(_filter, [isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));
    table.generate();
  },
  "import": function _import(file) {
    var reader = new FileReader();

    reader.onload = function (event) {
      var str = event.target.result;
      data.raw = JSON.parse(str);
      data.finish(data.raw);
    };

    reader.readAsText(file);
  }
};
var table = {
  generate: function generate() {
    $(".main_table").DataTable().destroy();
    var filterdata = data.filtered;
    var thead = '';
    var tbody = '';
    var pic = $("#picture").prop("checked");

    if (config.command == 'reactions' || config.command == 'likes' || config.likes) {
      thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u8868\u60C5</td>";
    } else if (config.command === 'sharedposts') {
      thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td width=\"110\">\u7559\u8A00\u6642\u9593</td>";
    } else {
      thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td>\u8B9A</td>\n\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
    }

    var host = 'https://www.facebook.com/';

    var _iterator3 = _createForOfIteratorHelper(filterdata.entries()),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _step3$value = _slicedToArray(_step3.value, 2),
            j = _step3$value[0],
            val = _step3$value[1];

        var picture = '';

        if (pic) {
          picture = "<img src=\"https://graph.facebook.com/".concat(val.from.id, "/picture?type=small\"><br>");
        }

        var td = "<td>".concat(j + 1, "</td>\n\t\t\t<td><a href='https://www.facebook.com/").concat(val.from.id, "' target=\"_blank\">").concat(picture).concat(val.from.name, "</a></td>");

        if (config.command == 'reactions' || config.command == 'likes' || config.likes) {
          td += "<td class=\"center\"><span class=\"react ".concat(val.type, "\"></span>").concat(val.type, "</td>");
        } else if (config.command === 'sharedposts') {
          td += "<td class=\"force-break\"><a href=\"https://www.facebook.com/".concat(val.id, "\" target=\"_blank\">").concat(val.story, "</a></td>\n\t\t\t\t<td class=\"nowrap\">").concat(timeConverter(val.created_time), "</td>");
        } else {
          var postlink = host + val.id;

          if (config.from_extension) {
            postlink = val.postlink;
          }

          td += "<td class=\"force-break\"><a href=\"".concat(postlink, "\" target=\"_blank\">").concat(val.message, "</a></td>\n\t\t\t\t<td>").concat(val.like_count, "</td>\n\t\t\t\t<td class=\"nowrap\">").concat(timeConverter(val.created_time), "</td>");
        }

        var tr = "<tr>".concat(td, "</tr>");
        tbody += tr;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    var insert = "<thead><tr align=\"center\">".concat(thead, "</tr></thead><tbody>").concat(tbody, "</tbody>");
    $(".main_table").html('').append(insert);
    active();

    function active() {
      TABLE = $(".main_table").DataTable({
        "pageLength": 1000,
        "searching": true,
        "lengthChange": false
      });
      $("#searchName").on('blur change keyup', function () {
        TABLE.columns(1).search(this.value).draw();
      });
      $("#searchComment").on('blur change keyup', function () {
        TABLE.columns(2).search(this.value).draw();
        config.filter.word = this.value;
      });
    }
  },
  redo: function redo() {
    data.filter();
  }
};
var choose = {
  data: [],
  award: [],
  num: 0,
  detail: false,
  list: [],
  init: function init() {
    var thead = $('.main_table thead').html();
    $('#awardList table thead').html(thead);
    $('#awardList table tbody').html('');
    choose.award = [];
    choose.list = [];
    choose.num = 0;

    if ($("#searchComment").val() != '') {
      table.redo();
    }

    if ($("#moreprize").hasClass("active")) {
      choose.detail = true;
      $(".prizeDetail .prize").each(function () {
        var n = parseInt($(this).find("input[type='number']").val());
        var p = $(this).find("input[type='text']").val();

        if (n > 0) {
          choose.num += parseInt(n);
          choose.list.push({
            "name": p,
            "num": n
          });
        }
      });
    } else {
      choose.num = $("#howmany").val();
    }

    choose.go();
  },
  go: function go() {
    choose.award = genRandomArray(data.filtered.length).splice(0, choose.num);
    var insert = '';
    choose.award.map(function (val, index) {
      insert += '<tr title="第' + (index + 1) + '名">' + $('.main_table').DataTable().rows({
        search: 'applied'
      }).nodes()[val].innerHTML + '</tr>';
    });
    $('#awardList table tbody').html(insert);
    $('#awardList table tbody tr').addClass('success');

    if (choose.detail) {
      var now = 0;

      for (var k in choose.list) {
        var tar = $("#awardList tbody tr").eq(now);
        $("<tr><td class=\"prizeName\" colspan=\"5\">\u734E\u54C1\uFF1A ".concat(choose.list[k].name, " <span>\u5171 ").concat(choose.list[k].num, " \u540D</span></td></tr>")).insertBefore(tar);
        now += choose.list[k].num + 1;
      }

      $("#moreprize").removeClass("active");
      $(".gettotal").removeClass("fadeout");
      $('.prizeDetail').removeClass("fadein");
    }

    $("#awardList").fadeIn(1000);
  },
  gen_big_award: function gen_big_award() {
    var li = '';
    var awards = [];
    var token = config.pageToken == '' ? config.userToken : config.pageToken;
    $('#awardList tbody tr').each(function (index, val) {
      var award = {};

      if (val.hasAttribute('title')) {
        award.award_name = false;
        award.name = $(val).find('td').eq(1).find('a').text();
        award.userid = $(val).find('td').eq(1).find('a').attr('href').replace('https://www.facebook.com/', '');
        award.message = $(val).find('td').eq(2).find('a').text();
        award.link = $(val).find('td').eq(2).find('a').attr('href');
        award.time = $(val).find('td').eq($(val).find('td').length - 1).text();
      } else {
        award.award_name = true;
        award.name = $(val).find('td').text();
      }

      awards.push(award);
    });

    for (var _i2 = 0, _awards = awards; _i2 < _awards.length; _i2++) {
      var i = _awards[_i2];

      if (i.award_name === true) {
        li += "<li class=\"prizeName\">".concat(i.name, "</li>");
      } else {
        li += "<li>\n\t\t\t\t<a href=\"https://www.facebook.com/".concat(i.userid, "\" target=\"_blank\"><img src=\"https://graph.facebook.com/").concat(i.userid, "/picture?type=large&access_token=").concat(token, "\" alt=\"\"></a>\n\t\t\t\t<div class=\"info\">\n\t\t\t\t<p class=\"name\"><a href=\"https://www.facebook.com/").concat(i.userid, "\" target=\"_blank\">").concat(i.name, "</a></p>\n\t\t\t\t<p class=\"message\"><a href=\"").concat(i.link, "\" target=\"_blank\">").concat(i.message, "</a></p>\n\t\t\t\t<p class=\"time\"><a href=\"").concat(i.link, "\" target=\"_blank\">").concat(i.time, "</a></p>\n\t\t\t\t</div>\n\t\t\t\t</li>");
      }
    }

    $('.big_award ul').append(li);
    $('.big_award').addClass('show');
  },
  close_big_award: function close_big_award() {
    $('.big_award').removeClass('show');
    $('.big_award ul').empty();
  }
};
var _filter = {
  totalFilter: function totalFilter(isDuplicate, isTag, word, react, startTime, endTime) {
    var datas = data.raw;

    if (word !== '') {
      datas = _filter.word(datas, word);
    }

    if (isTag) {
      datas = _filter.tag(datas);
    }

    if (config.command == 'reactions' || config.command == 'likes' || config.likes) {
      datas = _filter.react(datas, react);
    } else {
      datas = _filter.time(datas, startTime, endTime);
    }

    if (isDuplicate) {
      datas = _filter.unique(datas);
    }

    return datas;
  },
  unique: function unique(data) {
    var output = [];
    var keys = [];
    data.forEach(function (item) {
      var key = item.from.id;

      if (keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  },
  word: function word(data, _word) {
    var newAry = $.grep(data, function (n, i) {
      if (n.message === undefined) {
        if (n.story.indexOf(_word) > -1) {
          return true;
        }
      } else {
        if (n.message.indexOf(_word) > -1) {
          return true;
        }
      }
    });
    return newAry;
  },
  tag: function tag(data) {
    var newAry = $.grep(data, function (n, i) {
      if (n.message_tags) {
        return true;
      }
    });
    return newAry;
  },
  time: function time(data, st, t) {
    var time_ary2 = st.split("-");
    var time_ary = t.split("-");

    var endtime = moment(new Date(time_ary[0], parseInt(time_ary[1]) - 1, time_ary[2], time_ary[3], time_ary[4], time_ary[5]))._d;

    var starttime = moment(new Date(time_ary2[0], parseInt(time_ary2[1]) - 1, time_ary2[2], time_ary2[3], time_ary2[4], time_ary2[5]))._d;

    var newAry = $.grep(data, function (n, i) {
      var created_time = moment(n.created_time)._d;

      if (created_time > starttime && created_time < endtime || n.created_time == "") {
        return true;
      }
    });
    return newAry;
  },
  react: function react(data, tar) {
    if (tar == 'all') {
      return data;
    } else {
      var newAry = $.grep(data, function (n, i) {
        if (n.type == tar) {
          return true;
        }
      });
      return newAry;
    }
  }
};
var ui = {
  init: function init() {},
  reset: function reset() {
    var command = config.command;

    if (command == 'reactions' || command == 'likes' || config.likes) {
      $('.limitTime, #searchComment').addClass('hide');
      $('.uipanel .react').removeClass('hide');
    } else {
      $('.limitTime, #searchComment').removeClass('hide');
      $('.uipanel .react').addClass('hide');
    }

    if (command === 'comments') {
      $('label.tag').removeClass('hide');
    } else {
      if ($("#tag").prop("checked")) {
        $("#tag").click();
      }

      $('label.tag').addClass('hide');
    }
  }
};
var page_selector = {
  pages: [],
  groups: [],
  page_id: false,
  show: function show() {
    $('.page_selector').removeClass('hide');
    config.pageToken = false;
    $('#live_id').val('');

    if (config.signin === false) {
      page_selector.getAdmin();
    }
  },
  hide: function hide() {
    $('.page_selector').addClass('hide');
  },
  getAdmin: function getAdmin() {
    Promise.all([page_selector.getPage(), page_selector.getGroup()]).then(function (res) {
      page_selector.genAdmin(res);
    });
  },
  getPage: function getPage() {
    return new Promise(function (resolve, reject) {
      FB.api("".concat(config.apiVersion, "/me/accounts?limit=100"), function (res) {
        resolve(res.data);
      });
    });
  },
  getGroup: function getGroup() {
    return new Promise(function (resolve, reject) {
      FB.api("".concat(config.apiVersion, "/me/groups?fields=name,id,administrator&limit=100"), function (res) {
        resolve(res.data.filter(function (item) {
          return item.administrator === true;
        }));
      });
    });
  },
  genAdmin: function genAdmin(res) {
    var pages = '';
    var groups = '';

    var _iterator4 = _createForOfIteratorHelper(res[0]),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var _i3 = _step4.value;
        pages += "<div class=\"page_btn\" data-type=\"1\" data-value=\"".concat(_i3.id, "\" onclick=\"page_selector.selectPage(this)\">").concat(_i3.name, "</div>");
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }

    if (config.auth_user === true) {
      var _iterator5 = _createForOfIteratorHelper(res[1]),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var i = _step5.value;
          groups += "<div class=\"page_btn\" data-type=\"2\" data-value=\"".concat(i.id, "\" onclick=\"page_selector.selectPage(this)\">").concat(i.name, "</div>");
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }

    $('.select_page').html(pages);
    $('.select_group').html(groups);
    config.signin = true;
  },
  selectPage: function selectPage(target) {
    config.pageToken = false;
    page_selector.page_id = $(target).data('value');

    if ($(target).data('type') == '2') {
      config.target = 'group';
    } else {
      config.target = 'fanpage';
    }

    $('#post_table tbody').html('');
    $('.fb_loading').removeClass('hide');
    FB.api("/".concat(page_selector.page_id, "?fields=access_token"), function (res) {
      if (res.access_token) {
        config.pageToken = res.access_token;
      } else {
        config.pageToken = '';
      }
    });
    FB.api("".concat(config.apiVersion, "/").concat(page_selector.page_id, "/feed?limit=100"), function (res) {
      $('.fb_loading').addClass('hide');
      var tbody = '';

      var _iterator6 = _createForOfIteratorHelper(res.data),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var tr = _step6.value;
          tbody += "<tr><td><button type=\"button\" onclick=\"page_selector.selectPost('".concat(tr.id, "')\">\u9078\u64C7\u8CBC\u6587</button></td><td><a href=\"https://www.facebook.com/").concat(tr.id, "\" target=\"_blank\">").concat(tr.message, "</a></td><td>").concat(timeConverter(tr.created_time), "</td></tr>");
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      $('#post_table tbody').html(tbody);
    });
  },
  golive: function golive() {
    if (config.pageToken === false) {
      alert('請先選擇對應直播的粉絲專頁');
    } else {
      $('.page_selector').addClass('hide');
      $('#post_table tbody').html('');
      $('#enterURL .url').val(page_selector.page_id + '_' + $('#live_id').val());
      $('.page_target').removeClass('hide');
    }
  },
  selectPost: function selectPost(fbid) {
    $('.page_selector').addClass('hide');
    $('#post_table tbody').html('');
    $('#enterURL .url').val(fbid);
    $('.page_target').removeClass('hide');
  }
};

function nowDate() {
  var a = new Date();
  var year = a.getFullYear();
  var month = a.getMonth() + 1;
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  return year + "-" + month + "-" + date + "-" + hour + "-" + min + "-" + sec;
}

function timeConverter(UNIX_timestamp) {
  var a = moment(UNIX_timestamp)._d;

  var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();

  if (date < 10) {
    date = "0" + date;
  }

  var hour = a.getHours();
  var min = a.getMinutes();

  if (min < 10) {
    min = "0" + min;
  }

  var sec = a.getSeconds();

  if (sec < 10) {
    sec = "0" + sec;
  }

  var time = year + '-' + month + '-' + date + " " + hour + ':' + min + ':' + sec;
  return time;
}

function obj2Array(obj) {
  var array = $.map(obj, function (value, index) {
    return [value];
  });
  return array;
}

function genRandomArray(n) {
  var ary = new Array();
  var i, r, t;

  for (i = 0; i < n; ++i) {
    ary[i] = i;
  }

  for (i = 0; i < n; ++i) {
    r = Math.floor(Math.random() * n);
    t = ary[r];
    ary[r] = ary[i];
    ary[i] = t;
  }

  return ary;
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  var arrData = _typeof(JSONData) != 'object' ? JSON.parse(JSONData) : JSONData;
  var CSV = ''; //Set Report title in first row or line
  // CSV += ReportTitle + '\r\n\n';
  //This condition will generate the Label/Header

  if (ShowLabel) {
    var row = ""; //This loop will extract the label from 1st index of on array

    for (var index in arrData[0]) {
      //Now convert each value to string and comma-seprated
      row += index + ',';
    }

    row = row.slice(0, -1); //append Label row with line break

    CSV += row + '\r\n';
  } //1st loop is to extract each row


  for (var i = 0; i < arrData.length; i++) {
    var row = ""; //2nd loop will extract each column and convert it in string comma-seprated

    for (var index in arrData[i]) {
      row += '"' + arrData[i][index] + '",';
    }

    row.slice(0, row.length - 1); //add a line break after each row

    CSV += row + '\r\n';
  }

  if (CSV == '') {
    alert("Invalid data");
    return;
  } //Generate a file name


  var fileName = ""; //this will remove the blank-spaces from the title and replace it with an underscore

  fileName += ReportTitle.replace(/ /g, "_"); //Initialize file format you want csv or xls

  var uri = "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(CSV); // Now the little tricky part.
  // you can use either>> window.open(uri);
  // but this will not work in some browsers
  // or you will not get the correct file extension    
  //this trick will generate a temp <a /> tag

  var link = document.createElement("a");
  link.href = uri; //set the visibility hidden so it will not effect on your web-layout

  link.style = "visibility:hidden";
  link.download = fileName + ".csv"; //this part will append the anchor tag and remove it after automatic click

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}