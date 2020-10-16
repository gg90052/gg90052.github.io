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
window.onerror = handleErr;

function handleErr(msg, url, l) {
  if (!errorMessage) {
    console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
    $(".console .error").fadeIn();
    errorMessage = true;
  }

  return false;
}

$(document).ready(function () {
  var hidearea = 0;
  $('header').click(function () {
    hidearea++;

    if (hidearea >= 5) {
      $('header').off('click');
      $('#fbid_button, #pure_fbid').removeClass('hide');
    }
  });
  var hash = location.hash;

  if (hash.indexOf("clear") >= 0) {
    localStorage.removeItem('raw');
    sessionStorage.removeItem('login');
    alert('已清除暫存，請重新進行登入');
    location.href = 'https://gg90052.github.io/comment_helper_plus';
  }

  var lastData = JSON.parse(localStorage.getItem("raw"));

  if (lastData) {
    data.finish(lastData);
  } // if (sessionStorage.login){
  // 	fb.genOption(JSON.parse(sessionStorage.login));
  // }
  // $(".tables > .sharedposts button").click(function(e){
  // 	if (e.ctrlKey || e.altKey){
  // 		fb.extensionAuth('import');
  // 	}else{
  // 		fb.extensionAuth();
  // 	}
  // });


  $("#btn_comments").click(function (e) {
    fb.getAuth('comments');
  });
  $("#btn_start").click(function () {
    fb.getAuth('signin');
  });
  $("#btn_auth").click(function () {
    fb.getAuth('signup');
  });
  $("#btn_choose").click(function (e) {
    if (e.ctrlKey || e.altKey) {
      choose.init(true);
    } else {
      choose.init();
    }
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
  $(window).keydown(function (e) {
    if (e.ctrlKey || e.altKey) {
      $("#btn_excel").text("輸出JSON");
    }
  });
  $(window).keyup(function (e) {
    if (!e.ctrlKey || !e.altKey) {
      $("#btn_excel").text("複製表格內容");
    }
  });
  $("#unique, #tag").on('change', function () {
    table.redo();
  });
  $(".tables .filters .react").change(function () {
    config.filter.react = $(this).val();
    table.redo();
  });
  $('.tables .total .filters select').change(function () {
    compare.init();
  });
  $('.compare_condition').change(function () {
    $('.tables .total .table_compare').addClass('hide');
    $('.tables .total .table_compare table').removeClass('table-active');
    $('.tables .total .table_compare.' + $(this).val()).removeClass('hide');
    $('.tables .total .table_compare.' + $(this).val() + ' table').addClass('table-active');
  });
  $('.rangeDate').daterangepicker({
    "singleDatePicker": true,
    "timePicker": true,
    "timePicker24Hour": true,
    "locale": {
      "format": "YYYY-MM-DD   HH:mm",
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
    config.filter.endTime = start.format('YYYY-MM-DD-HH-mm-ss');
    table.redo();
  });
  $('.rangeDate').data('daterangepicker').setStartDate(nowDate());
  $("#btn_excel").click(function (e) {
    var filterData = data.filter(data.raw);

    if (e.ctrlKey) {
      var dd;

      if (tab.now === 'compare') {
        dd = JSON.stringify(compare[$('.compare_condition').val()]);
      } else {
        dd = JSON.stringify(filterData[tab.now]);
      }

      var url = 'data:text/json;charset=utf8,' + dd;
      window.open(url, '_blank');
      window.focus();
    } else {// if (filterData.length > 7000){
      // 	$(".bigExcel").removeClass("hide");
      // }else{
      // 	if (tab.now === 'compare'){
      // 		JSONToCSVConvertor(data.excel(compare[$('.compare_condition').val()]), "Comment_helper", true);
      // 	}else{
      // 		JSONToCSVConvertor(data.excel(filterData[tab.now]), "Comment_helper", true);
      // 	}
      // }
    }
  });
  $("#genExcel").click(function () {
    var filterData = data.filter(data.raw);
    var excelString = data.excel(filterData);
    $("#exceldata").val(JSON.stringify(excelString));
  });
  var ci_counter = 0;
  $(".ci").click(function (e) {
    ci_counter++;

    if (ci_counter >= 5) {
      $(".source .url, .source .btn").addClass("hide");
      $("#inputJSON").removeClass("hide");
    }

    if (e.ctrlKey) {
      fb.getAuth('sharedposts');
    }
  });
  $("#inputJSON").change(function () {
    $(".waiting").removeClass("hide");
    $(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
    data["import"](this.files[0]);
  });
});
var config = {
  field: {
    comments: ['like_count', 'message_tags', 'message', 'from', 'created_time'],
    reactions: [],
    sharedposts: ['story', 'from', 'created_time'],
    url_comments: [],
    feed: ['created_time', 'from', 'message', 'story'],
    likes: ['name']
  },
  limit: {
    comments: '500',
    reactions: '500',
    sharedposts: '500',
    url_comments: '500',
    feed: '500',
    likes: '500'
  },
  apiVersion: {
    comments: 'v7.0',
    reactions: 'v7.0',
    sharedposts: 'v7.0',
    url_comments: 'v7.0',
    feed: 'v7.0',
    group: 'v7.0',
    newest: 'v7.0'
  },
  filter: {
    word: '',
    react: 'all',
    endTime: nowDate()
  },
  order: '',
  auth: 'groups_show_list, pages_show_list, pages_read_engagement, pages_read_user_content',
  extension: false,
  pageToken: '',
  userToken: '',
  me: ''
};
var fb = {
  next: '',
  getAuth: function getAuth(type) {
    FB.login(function (response) {
      fb.callback(response, type);
    }, {
      auth_type: 'rerequest',
      scope: config.auth,
      return_scopes: true
    });
  },
  callback: function callback(response, type) {
    if (response.status === 'connected') {
      console.log(response);
      config.userToken = response.authResponse.accessToken;
      config.me = response.authResponse.userID;
      config.from_extension = false;

      if (type == 'signup') {
        // 註冊
        FB.api("/me?fields=id,name", function (res) {
          var obj = {
            token: $('#import').val() || -1,
            username: res.name,
            app_scope_id: res.id
          };
          $('.waiting').removeClass('hide');
          $.post('https://script.google.com/macros/s/AKfycbzjwRWn_3VkILLnZS3KEISKZBEDiyCRJLJ_Q_vIqn2SqQgoYFk/exec', obj, function (res) {
            $('.waiting').addClass('hide');

            if (res.code == 1) {
              alert(res.message);
              fb.callback(response, 'signin');
            } else {
              alert(res.message); // fb.callback(response, 'signin');
            }
          });
        });
      }

      if (type == 'signin') {
        $('.waiting').removeClass('hide');
        $.get('https://script.google.com/macros/s/AKfycbzjwRWn_3VkILLnZS3KEISKZBEDiyCRJLJ_Q_vIqn2SqQgoYFk/exec?id=' + config.me, function (res2) {
          $('.waiting').addClass('hide');

          if (res2 === 'true') {
            fb.start();
          } else {
            swal({
              title: 'PLUS為付費產品，詳情請見粉絲專頁',
              html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a><br>userID：' + config.me,
              type: 'warning'
            }).done();
          }
        });
      }
    } else {
      FB.login(function (response) {
        fb.callback(response, type);
      }, {
        scope: config.auth,
        return_scopes: true
      });
    }
  },
  start: function start() {
    page_selector.show();
    fb.next = '';
    var options = "\n\t\t<button class=\"btn\" onclick=\"page_selector.show()\">\u5F9E\u7C89\u7D72\u5C08\u9801/\u793E\u5718\u9078\u64C7\u8CBC\u6587</button><br>\n\t\t<input id=\"pure_fbid\">\n\t\t<button id=\"fbid_button\" class=\"btn\" onclick=\"fb.hiddenStart(this)\">\u7531FBID\u64F7\u53D6</button>\n\t\t<a href=\"javascript:;\" onclick=\"data.finish(data.raw)\" style=\"margin-left:20px;\">\u5F37\u5236\u8DF3\u8F49\u5230\u8868\u683C</a><br>";
    var type = -1;
    $('#btn_start').addClass('hide');
    $('#enterURL').html(options).removeClass('hide');
  },
  selectPage: function selectPage(e) {
    $('#enterURL .page_btn').removeClass('active');
    fb.next = '';
    var tar = $(e);
    tar.addClass('active');

    if (tar.attr('attr-type') == 1) {
      fb.setToken(tar.attr('attr-value'));
    }

    fb.feed(tar.attr('attr-value'), tar.attr('attr-type'), fb.next);
    $('.forfb').addClass('hide');
    $('.step1').removeClass('hide');
    step.step1();
  },
  setToken: function setToken(pageid) {
    var pages = JSON.parse(sessionStorage.login)[1];

    var _iterator = _createForOfIteratorHelper(pages),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var i = _step.value;

        if (i.id == pageid) {
          config.pageToken = i.access_token;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  },
  hiddenStart: function hiddenStart(e) {
    var fbid = $('#pure_fbid').val();
    var pageID = fbid.split('_')[0];
    FB.api("/".concat(pageID, "?fields=access_token"), function (res) {
      if (res.error) {
        data.start(fbid);
      } else {
        if (res.access_token) {
          config.pageToken = res.access_token;
        }

        if (e.ctrlKey || e.altKey) {
          data.start(fbid, 'live');
        } else {
          data.start(fbid);
        }
      }
    });
  },
  feed: function feed(pageID, type) {
    var url = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var clear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    if (clear) {
      $('.recommands, .feeds tbody').empty();
      $('.feeds .btn').removeClass('hide');
      $('.feeds .btn').off('click').click(function () {
        var tar = $('#enterURL select').find('option:selected');
        fb.feed(tar.val(), tar.attr('attr-type'), fb.next, false);
      });
    }

    var command = 'feed';
    var api;

    if (url == '') {
      api = "".concat(config.apiVersion.newest, "/").concat(pageID, "/").concat(command, "?fields=full_picture,created_time,message&limit=25");
    } else {
      api = url;
    }

    FB.api(api, function (res) {
      if (res.data.length == 0) {
        $('.feeds .btn').addClass('hide');
      }

      fb.next = res.paging.next;

      var _iterator2 = _createForOfIteratorHelper(res.data),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var i = _step2.value;
          var str = genData(i);
          $('.section .feeds tbody').append(str);

          if (i.message && i.message.indexOf('抽') >= 0) {
            var recommand = genCard(i);
            $('.donate_area .recommands').append(recommand);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    });

    function genData(obj) {
      console.log(obj);
      var ids = obj.id.split("_");
      var link = 'https://www.facebook.com/' + ids[0] + '/posts/' + ids[1];
      var mess = obj.message ? obj.message.replace(/\n/g, "<br />") : "";
      var str = "<tr>\n\t\t\t\t\t\t<td><div class=\"pick\" attr-val=\"".concat(obj.id, "\"  onclick=\"data.start('").concat(obj.id, "')\">\u958B\u59CB</div></td>\n\t\t\t\t\t\t<td><a href=\"").concat(link, "\" target=\"_blank\">").concat(mess, "</a></td>\n\t\t\t\t\t\t<td class=\"nowrap\">").concat(timeConverter(obj.created_time), "</td>\n\t\t\t\t\t\t</tr>");
      return str;
    }

    function genCard(obj) {
      var src = obj.full_picture || 'http://placehold.it/300x225';
      var ids = obj.id.split("_");
      var link = 'https://www.facebook.com/' + ids[0] + '/posts/' + ids[1];
      var mess = obj.message ? obj.message.replace(/\n/g, "<br />") : "";
      var str = "<div class=\"card\">\n\t\t\t<a href=\"".concat(link, "\" target=\"_blank\">\n\t\t\t<div class=\"card-image\">\n\t\t\t<figure class=\"image is-4by3\">\n\t\t\t<img src=\"").concat(src, "\" alt=\"\">\n\t\t\t</figure>\n\t\t\t</div>\n\t\t\t</a>\n\t\t\t<div class=\"card-content\">\n\t\t\t<div class=\"content\">\n\t\t\t").concat(mess, "\n\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"pick\" attr-val=\"").concat(obj.id, "\" onclick=\"data.start('").concat(obj.id, "')\">\u958B\u59CB</div>\n\t\t\t</div>");
      return str;
    }
  },
  getMe: function getMe() {
    return new Promise(function (resolve, reject) {
      FB.api("".concat(config.apiVersion.newest, "/me"), function (res) {
        var arr = [res];
        resolve(arr);
      });
    });
  },
  getPage: function getPage() {
    return new Promise(function (resolve, reject) {
      FB.api("".concat(config.apiVersion.newest, "/me/accounts?limit=100"), function (res) {
        resolve(res.data);
      });
    });
  },
  getGroup: function getGroup() {
    return new Promise(function (resolve, reject) {
      FB.api("".concat(config.apiVersion.newest, "/me/groups?fields=name,id,administrator&limit=100"), function (res) {
        resolve(res.data.filter(function (item) {
          return item.administrator === true;
        }));
      });
    });
  },
  extensionAuth: function extensionAuth() {
    var command = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    FB.login(function (response) {
      fb.extensionCallback(response, command);
    }, {
      scope: config.auth,
      return_scopes: true
    });
  },
  extensionCallback: function extensionCallback(response) {
    var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (response.status === 'connected') {
      var extension_start = function extension_start() {
        data.raw.extension = true;

        if (command == 'import') {
          localStorage.setItem("sharedposts", $('#import').val());
        }

        var extend = JSON.parse(localStorage.getItem("sharedposts"));
        var fid = [];
        var ids = [];

        var _iterator3 = _createForOfIteratorHelper(extend),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _i11 = _step3.value;
            fid.push(_i11.from.id);

            if (fid.length >= 45) {
              ids.push(fid);
              fid = [];
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        ids.push(fid);
        var promise_array = [],
            names = {};

        for (var _i = 0, _ids = ids; _i < _ids.length; _i++) {
          var i = _ids[_i];
          var promise = fb.getName(i).then(function (res) {
            for (var _i2 = 0, _Object$keys = Object.keys(res); _i2 < _Object$keys.length; _i2++) {
              var _i3 = _Object$keys[_i2];
              names[_i3] = res[_i3];
            }
          });
          promise_array.push(promise);
        }

        var postdata = JSON.parse(localStorage.postdata);

        if (command == 'comments') {
          if (postdata.type === 'personal') {
            // FB.api("/me", function (res) {
            // 	if (res.name === postdata.owner) {
            // 		for(let i of extend){
            // 			i.message = i.story;
            // 			delete i.story;
            // 			delete i.postlink;
            // 			i.like_count = 'N/A';
            // 		}
            // 	}else{
            // 		swal({
            // 			title: '個人貼文只有發文者本人能抓',
            // 			html: `貼文帳號名稱：${postdata.owner}<br>目前帳號名稱：${res.name}`,
            // 			type: 'warning'
            // 		}).done();
            // 	}
            // });
            var _iterator4 = _createForOfIteratorHelper(extend),
                _step4;

            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var _i4 = _step4.value;
                delete _i4.story;
                delete _i4.postlink;
                _i4.like_count = 'N/A';
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          } else if (postdata.type === 'group') {
            var _iterator5 = _createForOfIteratorHelper(extend),
                _step5;

            try {
              for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                var _i5 = _step5.value;
                delete _i5.story;
                delete _i5.postlink;
                _i5.like_count = 'N/A';
              }
            } catch (err) {
              _iterator5.e(err);
            } finally {
              _iterator5.f();
            }
          } else {
            var _iterator6 = _createForOfIteratorHelper(extend),
                _step6;

            try {
              for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                var _i6 = _step6.value;
                delete _i6.story;
                delete _i6.postlink;
                _i6.like_count = 'N/A';
              }
            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }
          }
        }

        if (command == 'reactions') {
          if (postdata.type === 'personal') {
            // FB.api("/me", function (res) {
            // 	if (res.name === postdata.owner) {
            // 		for(let i of extend){
            // 			delete i.story;
            // 			delete i.created_time;
            // 			delete i.postlink;
            // 			delete i.like_count;
            // 			i.type = 'LIKE';
            // 		}
            // 	}else{
            // 		swal({
            // 			title: '個人貼文只有發文者本人能抓',
            // 			html: `貼文帳號名稱：${postdata.owner}<br>目前帳號名稱：${res.name}`,
            // 			type: 'warning'
            // 		}).done();
            // 	}
            // });
            var _iterator7 = _createForOfIteratorHelper(extend),
                _step7;

            try {
              for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                var _i7 = _step7.value;
                delete _i7.story;
                delete _i7.created_time;
                delete _i7.postlink;
                delete _i7.like_count;
              }
            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }
          } else if (postdata.type === 'group') {
            var _iterator8 = _createForOfIteratorHelper(extend),
                _step8;

            try {
              for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                var _i8 = _step8.value;
                delete _i8.story;
                delete _i8.created_time;
                delete _i8.postlink;
                delete _i8.like_count;
              }
            } catch (err) {
              _iterator8.e(err);
            } finally {
              _iterator8.f();
            }
          } else {
            var _iterator9 = _createForOfIteratorHelper(extend),
                _step9;

            try {
              for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                var _i9 = _step9.value;
                delete _i9.story;
                delete _i9.created_time;
                delete _i9.postlink;
                delete _i9.like_count;
              }
            } catch (err) {
              _iterator9.e(err);
            } finally {
              _iterator9.f();
            }
          }
        }

        Promise.all(promise_array).then(function () {
          var _iterator10 = _createForOfIteratorHelper(extend),
              _step10;

          try {
            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              var _i10 = _step10.value;
              _i10.from.name = names[_i10.from.id] ? names[_i10.from.id].name : _i10.from.name;
            }
          } catch (err) {
            _iterator10.e(err);
          } finally {
            _iterator10.f();
          }

          data.raw.data[command] = extend;
          data.finish(data.raw);
        });
      };

      var me = response.authResponse.userID;
      $('.waiting').removeClass('hide');
      $.get('https://script.google.com/macros/s/AKfycbzjwRWn_3VkILLnZS3KEISKZBEDiyCRJLJ_Q_vIqn2SqQgoYFk/exec?id=' + me, function (res2) {
        $('.waiting').addClass('hide');

        if (res2 === 'true') {
          extension_start();
        } else {
          swal({
            title: 'PLUS為付費產品，詳情請見粉絲專頁',
            html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a><br>userID：' + me,
            type: 'warning'
          }).done();
        }
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
  getName: function getName(ids) {
    return new Promise(function (resolve, reject) {
      FB.api("".concat(config.apiVersion.newest, "/?ids=").concat(ids.toString()), function (res) {
        resolve(res);
      });
    });
  }
};
var step = {
  step1: function step1() {
    $('.section').removeClass('step2');
    $("html, body").scrollTop(0);
  },
  step2: function step2() {
    $('.forfb').addClass('hide');
    $('.recommands, .feeds tbody').empty();
    $('.section').addClass('step2');
    $("html, body").scrollTop(0);
  }
};
var data = {
  raw: {
    data: {
      fullID: '',
      comments: [],
      reactions: [],
      sharedposts: []
    }
  },
  filtered: {},
  userid: '',
  nowLength: 0,
  extension: false,
  promise_array: [],
  test: function test(id) {
    console.log(id);
  },
  init: function init() {
    $(".main_table").DataTable().destroy();
    $("#awardList").hide();
    $(".console .message").text('');
    data.nowLength = 0;
    data.promise_array = [];
    data.raw = [];
  },
  start: function start(fbid) {
    data.init();
    var obj = {
      fullID: fbid
    };
    $(".waiting").removeClass("hide");
    var commands = ['comments', 'reactions'];
    var temp_data = obj;

    var _loop = function _loop() {
      var i = _commands[_i12];
      temp_data.data = {};
      var promise = data.get(temp_data, i).then(function (res) {
        temp_data.data[i] = res;
      });
      data.promise_array.push(promise);
    };

    for (var _i12 = 0, _commands = commands; _i12 < _commands.length; _i12++) {
      _loop();
    }

    Promise.all(data.promise_array).then(function () {
      data.finish(temp_data);
    });
  },
  get: function get(fbid, command) {
    return new Promise(function (resolve, reject) {
      var datas = [];
      var promise_array = [];
      var shareError = 0;
      var api_fbid = fbid.fullID; // if ($('.page_btn.active').attr('attr-type') == 2){
      // 	api_fbid = fbid.fullID.split('_')[1];
      // 	if (command === 'reactions') command = 'likes';
      // }

      if (fbid.type === 'group') command = 'group';
      FB.api("".concat(api_fbid, "/").concat(command, "?limit=").concat(config.limit[command], "&order=chronological&access_token=").concat(config.pageToken, "&fields=").concat(config.field[command].toString()), function (res) {
        data.nowLength += res.data.length;
        $(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');

        var _iterator11 = _createForOfIteratorHelper(res.data),
            _step11;

        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var d = _step11.value;

            if (command == 'reactions') {
              d.from = {
                id: d.id,
                name: d.name
              };
            }

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
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }

        if (res.data.length > 0 && res.paging.next) {
          getNext(res.paging.next);
        } else {
          resolve(datas);
        }
      });

      function getNext(url) {
        var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (limit !== 0) {
          url = url.replace('limit=500', 'limit=' + limit);
        }

        $.getJSON(url, function (res) {
          data.nowLength += res.data.length;
          $(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');

          var _iterator12 = _createForOfIteratorHelper(res.data),
              _step12;

          try {
            for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
              var d = _step12.value;

              if (command == 'reactions') {
                d.from = {
                  id: d.id,
                  name: d.name
                };
              }

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
            _iterator12.e(err);
          } finally {
            _iterator12.f();
          }

          if (res.data.length > 0 && res.paging.next) {
            getNext(res.paging.next);
          } else {
            resolve(datas);
          }
        }).fail(function () {
          getNext(url, 200);
        });
      }
    });
  },
  finish: function finish(fbid) {
    $(".waiting").addClass("hide");
    $(".main_table").removeClass("hide");
    step.step2();
    swal('完成！', 'Done!', 'success').done();
    $('.result_area > .title span').text(fbid.fullID);
    data.raw = fbid;
    localStorage.setItem("raw", JSON.stringify(fbid));
    data.filter(data.raw, true);
  },
  filter: function filter(rawData) {
    var generate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    data.filtered = {};
    var isDuplicate = $("#unique").prop("checked");

    for (var _i13 = 0, _Object$keys2 = Object.keys(rawData.data); _i13 < _Object$keys2.length; _i13++) {
      var key = _Object$keys2[_i13];
      var isTag = $("#tag").prop("checked");
      if (key === 'reactions') isTag = false;

      var newData = _filter.totalFilter.apply(_filter, [rawData.data[key], key, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));

      data.filtered[key] = newData;
    }

    if (generate === true) {
      table.generate(data.filtered);
    } else {
      return data.filtered;
    }
  },
  excel: function excel(raw) {
    var newObj = [];

    if (data.extension) {
      $.each(raw, function (i) {
        var tmp = {
          "序號": i + 1,
          "臉書連結": 'https://www.facebook.com/' + this.from.id,
          "姓名": this.from.name,
          "分享連結": this.postlink,
          "留言內容": this.story,
          "該分享讚數": this.like_count
        };
        newObj.push(tmp);
      });
    } else {
      $.each(raw, function (i) {
        var tmp = {
          "序號": i + 1,
          "臉書連結": 'https://www.facebook.com/' + this.from.id,
          "姓名": this.from.name,
          "心情": this.type || '',
          "留言內容": this.message || this.story,
          "留言時間": timeConverter(this.created_time)
        };
        newObj.push(tmp);
      });
    }

    return newObj;
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
  generate: function generate(rawdata) {
    $(".tables table").DataTable().destroy();
    var filtered = rawdata;
    var pic = $("#picture").prop("checked");

    for (var _i14 = 0, _Object$keys3 = Object.keys(filtered); _i14 < _Object$keys3.length; _i14++) {
      var key = _Object$keys3[_i14];
      var thead = '';
      var tbody = '';

      if (key === 'reactions') {
        thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td>\u5FC3\u60C5</td>";
      } else if (key === 'sharedposts') {
        thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td width=\"110\">\u7559\u8A00\u6642\u9593</td>";
      } else {
        thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td>\u8B9A</td>\n\t\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
      }

      var _iterator13 = _createForOfIteratorHelper(filtered[key].entries()),
          _step13;

      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var _step13$value = _slicedToArray(_step13.value, 2),
              j = _step13$value[0],
              val = _step13$value[1];

          var picture = '';

          if (pic) {// picture = `<img src="https://graph.facebook.com/${val.from.id}/picture?type=small"><br>`;
          }

          var td = "<td>".concat(j + 1, "</td>\n\t\t\t\t<td><a href='https://www.facebook.com/").concat(val.from.id, "' attr-fbid=\"").concat(val.from.id, "\" target=\"_blank\">").concat(picture).concat(val.from.name, "</a></td>");

          if (key === 'reactions') {
            td += "<td class=\"center\"><span class=\"react ".concat(val.type, "\"></span>").concat(val.type, "</td>");
          } else if (key === 'sharedposts') {
            td += "<td class=\"force-break\"><a href=\"https://www.facebook.com/".concat(val.id, "\" target=\"_blank\">").concat(val.message || val.story, "</a></td>\n\t\t\t\t\t<td class=\"nowrap\">").concat(timeConverter(val.created_time), "</td>");
          } else {
            td += "<td class=\"force-break\"><a href=\"https://www.facebook.com/".concat(val.id, "\" target=\"_blank\">").concat(val.message, "</a></td>\n\t\t\t\t\t<td>").concat(val.like_count, "</td>\n\t\t\t\t\t<td class=\"nowrap\">").concat(timeConverter(val.created_time), "</td>");
          }

          var tr = "<tr>".concat(td, "</tr>");
          tbody += tr;
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }

      var insert = "<thead><tr align=\"center\">".concat(thead, "</tr></thead><tbody>").concat(tbody, "</tbody>");
      $(".tables ." + key + " table").html('').append(insert);
    }

    active();
    tab.init();
    compare.init();

    function active() {
      var table = $(".tables table").DataTable({
        "pageLength": 1000,
        "searching": true,
        "lengthChange": false
      });
      var arr = ['comments', 'reactions', 'sharedposts'];

      var _loop2 = function _loop2() {
        var i = _arr2[_i15];
        var table = $('.tables .' + i + ' table').DataTable();
        $(".tables ." + i + " .searchName").on('blur change keyup', function () {
          table.columns(1).search(this.value).draw();
        });
        $(".tables ." + i + " .searchComment").on('blur change keyup', function () {
          table.columns(2).search(this.value).draw();
          config.filter.word = this.value;
        });
      };

      for (var _i15 = 0, _arr2 = arr; _i15 < _arr2.length; _i15++) {
        _loop2();
      }
    }
  },
  redo: function redo() {
    data.filter(data.raw, true);
  }
};
var compare = {
  and: [],
  or: [],
  raw: [],
  init: function init() {
    compare.and = [];
    compare.or = [];
    compare.raw = data.filter(data.raw);
    var ignore = $('.tables .total .filters select').val();
    var base = [];
    var _final = [];
    var compare_num = 1;
    if (ignore === 'ignore') compare_num = 2;

    for (var _i16 = 0, _Object$keys4 = Object.keys(compare.raw); _i16 < _Object$keys4.length; _i16++) {
      var key = _Object$keys4[_i16];

      if (key !== ignore) {
        var _iterator14 = _createForOfIteratorHelper(compare.raw[key]),
            _step14;

        try {
          for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
            var i = _step14.value;
            base.push(i);
          }
        } catch (err) {
          _iterator14.e(err);
        } finally {
          _iterator14.f();
        }
      }
    }

    var sort = data.raw.extension ? 'name' : 'id';
    base = base.sort(function (a, b) {
      return a.from[sort] > b.from[sort] ? 1 : -1;
    });

    var _iterator15 = _createForOfIteratorHelper(base),
        _step15;

    try {
      for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
        var _i19 = _step15.value;
        _i19.match = 0;
      }
    } catch (err) {
      _iterator15.e(err);
    } finally {
      _iterator15.f();
    }

    var temp = '';
    var temp_name = ''; // console.log(base);

    for (var _i17 in base) {
      var obj = base[_i17];

      if (obj.from.id == temp || data.raw.extension && obj.from.name == temp_name) {
        var tar = _final[_final.length - 1];
        tar.match++;

        for (var _i18 = 0, _Object$keys5 = Object.keys(obj); _i18 < _Object$keys5.length; _i18++) {
          var _key = _Object$keys5[_i18];
          if (!tar[_key]) tar[_key] = obj[_key]; //合併資料
        }

        if (tar.match == compare_num) {
          temp_name = '';
          temp = '';
        }
      } else {
        _final.push(obj);

        temp = obj.from.id;
        temp_name = obj.from.name;
      }
    }

    compare.or = _final;
    compare.and = compare.or.filter(function (val) {
      return val.match == compare_num;
    });
    compare.generate();
  },
  generate: function generate() {
    $(".tables .total table").DataTable().destroy();
    var data_and = compare.and;
    var tbody = '';

    var _iterator16 = _createForOfIteratorHelper(data_and.entries()),
        _step16;

    try {
      for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
        var _step16$value = _slicedToArray(_step16.value, 2),
            j = _step16$value[0],
            val = _step16$value[1];

        var td = "<td>".concat(j + 1, "</td>\n\t\t\t<td><a href='https://www.facebook.com/").concat(val.from.id, "' attr-fbid=\"").concat(val.from.id, "\" target=\"_blank\">").concat(val.from.name, "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react ").concat(val.type || '', "\"></span>").concat(val.type || '', "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/").concat(val.id, "\" target=\"_blank\">").concat(val.message || '', "</a></td>\n\t\t\t<td>").concat(val.like_count || '0', "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/").concat(val.id, "\" target=\"_blank\">").concat(val.story || '', "</a></td>\n\t\t\t<td class=\"nowrap\">").concat(timeConverter(val.created_time) || '', "</td>");
        var tr = "<tr>".concat(td, "</tr>");
        tbody += tr;
      }
    } catch (err) {
      _iterator16.e(err);
    } finally {
      _iterator16.f();
    }

    $(".tables .total .table_compare.and tbody").html('').append(tbody);
    var data_or = compare.or;
    var tbody2 = '';

    var _iterator17 = _createForOfIteratorHelper(data_or.entries()),
        _step17;

    try {
      for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
        var _step17$value = _slicedToArray(_step17.value, 2),
            _j = _step17$value[0],
            _val = _step17$value[1];

        var _td = "<td>".concat(_j + 1, "</td>\n\t\t\t<td><a href='https://www.facebook.com/").concat(_val.from.id, "' attr-fbid=\"").concat(_val.from.id, "\" target=\"_blank\">").concat(_val.from.name, "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react ").concat(_val.type || '', "\"></span>").concat(_val.type || '', "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/").concat(_val.id, "\" target=\"_blank\">").concat(_val.message || '', "</a></td>\n\t\t\t<td>").concat(_val.like_count || '', "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/").concat(_val.id, "\" target=\"_blank\">").concat(_val.story || '', "</a></td>\n\t\t\t<td class=\"nowrap\">").concat(timeConverter(_val.created_time) || '', "</td>");

        var _tr = "<tr>".concat(_td, "</tr>");

        tbody2 += _tr;
      }
    } catch (err) {
      _iterator17.e(err);
    } finally {
      _iterator17.f();
    }

    $(".tables .total .table_compare.or tbody").html('').append(tbody2);
    active();

    function active() {
      var table = $(".tables .total table").DataTable({
        "pageLength": 1000,
        "searching": true,
        "lengthChange": false
      });
      var arr = ['and', 'or'];

      var _loop3 = function _loop3() {
        var i = _arr3[_i20];
        var table = $('.tables .' + i + ' table').DataTable();
        $(".tables ." + i + " .searchName").on('blur change keyup', function () {
          table.columns(1).search(this.value).draw();
        });
        $(".tables ." + i + " .searchComment").on('blur change keyup', function () {
          table.columns(2).search(this.value).draw();
          config.filter.word = this.value;
        });
      };

      for (var _i20 = 0, _arr3 = arr; _i20 < _arr3.length; _i20++) {
        _loop3();
      }
    }
  }
};
var choose = {
  data: [],
  award: [],
  num: 0,
  detail: false,
  list: [],
  init: function init() {
    var ctrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var thead = $('.main_table thead').html();
    $('#awardList table thead').html(thead);
    $('#awardList table tbody').html('');
    choose.data = data.filter(data.raw);
    choose.award = [];
    choose.list = [];
    choose.num = 0;

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

    choose.go(ctrl);
  },
  go: function go(ctrl) {
    var command = tab.now;

    if (tab.now === 'compare') {
      choose.award = genRandomArray(compare[$('.compare_condition').val()].length).splice(0, choose.num);
    } else {
      choose.award = genRandomArray(choose.data[command].length).splice(0, choose.num);
    }

    var insert = '';
    var tempArr = [];

    if (command === 'comments') {
      $('.tables > div.active table').DataTable().column(2).data().each(function (value, index) {
        var word = $('.searchComment').val();
        if (value.indexOf(word) >= 0) tempArr.push(index);
      });
    }

    var _iterator18 = _createForOfIteratorHelper(choose.award),
        _step18;

    try {
      for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
        var i = _step18.value;
        var row = tempArr.length == 0 ? i : tempArr[i];
        var _tar = $('.tables > div.active table').DataTable().row(row).node().innerHTML;
        insert += '<tr>' + _tar + '</tr>';
      }
    } catch (err) {
      _iterator18.e(err);
    } finally {
      _iterator18.f();
    }

    $('#awardList table tbody').html(insert);

    if (!ctrl) {
      $("#awardList tbody tr").each(function () {// let tar = $(this).find('td').eq(1);
        // let id = tar.find('a').attr('attr-fbid');
        // tar.prepend(`<img src="https://graph.facebook.com/${id}/picture?type=small"><br>`);
      });
    }

    $('#awardList table tbody tr').addClass('success');

    if (choose.detail) {
      var now = 0;

      for (var k in choose.list) {
        var tar = $("#awardList tbody tr").eq(now);
        $("<tr><td class=\"prizeName\" colspan=\"7\">\u734E\u54C1\uFF1A ".concat(choose.list[k].name, " <span>\u5171 ").concat(choose.list[k].num, " \u540D</span></td></tr>")).insertBefore(tar);
        now += choose.list[k].num + 1;
      }

      $("#moreprize").removeClass("active");
      $(".gettotal").removeClass("fadeout");
      $('.prizeDetail').removeClass("fadein");
    }

    $("#awardList").fadeIn(1000);
  }
};
var page_selector = {
  pages: [],
  groups: [],
  show: function show() {
    $('.page_selector').removeClass('hide');
    page_selector.getAdmin();
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
      FB.api("".concat(config.apiVersion.newest, "/me/accounts?limit=100"), function (res) {
        resolve(res.data);
      });
    });
  },
  getGroup: function getGroup() {
    return new Promise(function (resolve, reject) {
      FB.api("".concat(config.apiVersion.newest, "/me/groups?fields=name,id,administrator&limit=100"), function (res) {
        resolve(res.data.filter(function (item) {
          return item.administrator === true;
        }));
      });
    });
  },
  genAdmin: function genAdmin(res) {
    var pages = '';
    var groups = '';

    var _iterator19 = _createForOfIteratorHelper(res[0]),
        _step19;

    try {
      for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
        var i = _step19.value;
        pages += "<div class=\"page_btn\" data-type=\"1\" data-value=\"".concat(i.id, "\" onclick=\"page_selector.selectPage(this)\">").concat(i.name, "</div>");
      }
    } catch (err) {
      _iterator19.e(err);
    } finally {
      _iterator19.f();
    }

    var _iterator20 = _createForOfIteratorHelper(res[1]),
        _step20;

    try {
      for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
        var _i21 = _step20.value;
        groups += "<div class=\"page_btn\" data-type=\"2\" data-value=\"".concat(_i21.id, "\" onclick=\"page_selector.selectPage(this)\">").concat(_i21.name, "</div>");
      }
    } catch (err) {
      _iterator20.e(err);
    } finally {
      _iterator20.f();
    }

    $('.select_page').html(pages);
    $('.select_group').html(groups);
  },
  selectPage: function selectPage(target) {
    var page_id = $(target).data('value');
    $('#post_table tbody').html('');
    $('.fb_loading').removeClass('hide');
    FB.api("/".concat(page_id, "?fields=access_token"), function (res) {
      if (res.access_token) {
        config.pageToken = res.access_token;
      } else {
        config.pageToken = '';
      }
    });
    FB.api("".concat(config.apiVersion.newest, "/").concat(page_id, "/live_videos?fields=status,permalink_url,title,creation_time"), function (res) {
      var thead = '';

      var _iterator21 = _createForOfIteratorHelper(res.data),
          _step21;

      try {
        for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
          var tr = _step21.value;

          if (tr.status === 'LIVE') {
            thead += "<tr><td><button type=\"button\" onclick=\"page_selector.selectPost('".concat(tr.id, "')\">\u9078\u64C7\u8CBC\u6587</button>(LIVE)</td><td><a href=\"https://www.facebook.com").concat(tr.permalink_url, "\" target=\"_blank\">").concat(tr.title, "</a></td><td>").concat(timeConverter(tr.created_time), "</td></tr>");
          } else {
            thead += "<tr><td><button type=\"button\" onclick=\"page_selector.selectPost('".concat(tr.id, "')\">\u9078\u64C7\u8CBC\u6587</button></td><td><a href=\"https://www.facebook.com").concat(tr.permalink_url, "\" target=\"_blank\">").concat(tr.title, "</a></td><td>").concat(timeConverter(tr.created_time), "</td></tr>");
          }
        }
      } catch (err) {
        _iterator21.e(err);
      } finally {
        _iterator21.f();
      }

      $('#post_table thead').html(thead);
    });
    FB.api("".concat(config.apiVersion.newest, "/").concat(page_id, "/feed?limit=100"), function (res) {
      $('.fb_loading').addClass('hide');
      var tbody = '';

      var _iterator22 = _createForOfIteratorHelper(res.data),
          _step22;

      try {
        for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
          var tr = _step22.value;
          tbody += "<tr><td><button type=\"button\" onclick=\"page_selector.selectPost('".concat(tr.id, "')\">\u9078\u64C7\u8CBC\u6587</button></td><td><a href=\"https://www.facebook.com/").concat(tr.id, "\" target=\"_blank\">").concat(tr.message, "</a></td><td>").concat(timeConverter(tr.created_time), "</td></tr>");
        }
      } catch (err) {
        _iterator22.e(err);
      } finally {
        _iterator22.f();
      }

      $('#post_table tbody').html(tbody);
    });
  },
  selectPost: function selectPost(fbid) {
    $('.page_selector').addClass('hide');
    $('.select_page').html('');
    $('.select_group').html('');
    $('#post_table tbody').html('');
    data.start(fbid);
  }
};
var _filter = {
  totalFilter: function totalFilter(raw, command, isDuplicate, isTag, word, react, endTime) {
    var data = raw;

    if (word !== '' && command == 'comments') {
      data = _filter.word(data, word);
    }

    if (isTag && command == 'comments') {
      data = _filter.tag(data);
    }

    if (command !== 'reactions') {
      data = _filter.time(data, endTime);
    } else {
      data = _filter.react(data, react);
    }

    if (isDuplicate) {
      data = _filter.unique(data);
    }

    return data;
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
      if (n.message.indexOf(_word) > -1) {
        return true;
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
  time: function time(data, t) {
    var time_ary = t.split("-");

    var time = moment(new Date(time_ary[0], parseInt(time_ary[1]) - 1, time_ary[2], time_ary[3], time_ary[4], time_ary[5]))._d;

    var newAry = $.grep(data, function (n, i) {
      var created_time = moment(n.created_time)._d;

      if (created_time < time || n.created_time == "") {
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
  init: function init() {}
};
var tab = {
  now: "comments",
  init: function init() {
    $('#comment_table .tabs .tab').click(function () {
      $('#comment_table .tabs .tab').removeClass('active');
      $(this).addClass('active');
      tab.now = $(this).attr('attr-type');
      var tar = $(this).index();
      $('.tables > div').removeClass('active');
      $('.tables > div').eq(tar).addClass('active');

      if (tab.now === 'compare') {
        compare.init();
      }
    });
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

  if (hour < 10) {
    hour = "0" + hour;
  }

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