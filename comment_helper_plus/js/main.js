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
  var hash = location.hash;

  if (hash.indexOf("clear") >= 0) {
    localStorage.removeItem('raw');
    sessionStorage.removeItem('login');
    alert('已清除暫存，請重新進行登入');
    location.href = 'https://gg90052.github.io/comment_helper_plus';
  }

  var lastData = JSON.parse(localStorage.getItem("raw"));

  if (lastData) {
    data.finish(lastData, true);
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
    }
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
    url_comments: [],
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
  auth: 'pages_show_list, pages_read_engagement, pages_read_user_content',
  likes: false,
  pageToken: false,
  userToken: '',
  from_extension: false,
  auth_user: false,
  signin: false
};
var fb = {
  next: '',
  getAuth: function getAuth(type) {
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
          $.post('https://script.google.com/macros/s/AKfycbzjwRWn_3VkILLnZS3KEISKZBEDiyCRJLJ_Q_vIqn2SqQgoYFk/exec', obj, function (res2) {
            $('.waiting').addClass('hide');

            if (res2.code == 1) {
              alert(res2.message);
              fb.callback(response, 'signin');
            } else {
              alert(res2.message + '\n' + JSON.stringify(obj)); // fb.callback(response, 'signin');
            }
          });
        });
      }

      if (type == 'signin') {
        $('.waiting').removeClass('hide');
        $.get('https://script.google.com/macros/s/AKfycbzjwRWn_3VkILLnZS3KEISKZBEDiyCRJLJ_Q_vIqn2SqQgoYFk/exec?id=' + config.me, function (res2) {
          $('.waiting').addClass('hide');

          if (res2 === 'true') {
            config.auth_user = true;
            fb.start();
          } else {
            config.auth_user = false;
            swal({
              title: 'PLUS為付費產品，詳情請見粉絲專頁',
              html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a><br>userID：' + config.me,
              type: 'warning'
            }).done();
          }
        });
      }

      if (type == "page_selector") {
        page_selector.show();
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

        var _iterator = _createForOfIteratorHelper(extend),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _i7 = _step.value;
            fid.push(_i7.from.id);

            if (fid.length >= 45) {
              ids.push(fid);
              fid = [];
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
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
            var _iterator2 = _createForOfIteratorHelper(extend),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var _i4 = _step2.value;
                delete _i4.story;
                delete _i4.postlink;
                _i4.like_count = 'N/A';
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          } else {
            var _iterator3 = _createForOfIteratorHelper(extend),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var _i5 = _step3.value;
                delete _i5.story;
                delete _i5.postlink;
                _i5.like_count = 'N/A';
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          }
        }

        Promise.all(promise_array).then(function () {
          var _iterator4 = _createForOfIteratorHelper(extend),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var _i6 = _step4.value;
              _i6.from.name = names[_i6.from.id] ? names[_i6.from.id].name : _i6.from.name;
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }

          data.raw[command] = extend;
          data.finish(data.raw);
        });
      };

      config.from_extension = true;
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
      FB.api("".concat(config.apiVersion, "/?ids=").concat(ids.toString()), function (res) {
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
    comments: [],
    reactions: [],
    sharedposts: []
  },
  fullID: '',
  filtered: {},
  userid: '',
  nowLength: 0,
  promise_array: [],
  init: function init() {
    $(".main_table").DataTable().destroy();
    $("#awardList").hide();
    $(".console .message").text('');
    data.raw = {
      comments: [],
      reactions: [],
      sharedposts: []
    };
    data.fullID = '';
    data.nowLength = 0;
    data.promise_array = [];
  },
  start: function start(fbid) {
    data.init();
    data.fullID = fbid;
    $(".waiting").removeClass("hide");
    var commands = ['comments', 'reactions'];

    for (var _i8 = 0, _commands = commands; _i8 < _commands.length; _i8++) {
      var i = _commands[_i8];
      data.promise_array.push(data.get(fbid, i));
    }

    Promise.all(data.promise_array).then(function (res) {
      data.finish(res);
    });
  },
  get: function get(fbid, command) {
    return new Promise(function (resolve, reject) {
      var datas = []; // if ($('.page_btn.active').attr('attr-type') == 2){
      // 	api_fbid = fbid.fullID.split('_')[1];
      // 	if (command === 'reactions') command = 'likes';
      // }

      FB.api("".concat(fbid, "/").concat(command, "?limit=").concat(config.limit, "&order=").concat(config.order, "&access_token=").concat(config.pageToken, "&fields=").concat(config.field[command].toString()), function (res) {
        data.nowLength += res.data.length;
        $(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
        groupData(res);

        if (res.data.length > 0 && res.paging.next) {
          getNext(res.paging.next);
        } else {
          resolve(datas);
        }
      });

      function groupData(res) {
        var _iterator5 = _createForOfIteratorHelper(res.data),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var d = _step5.value;

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
                name: d.name
              };

              if (d.updated_time) {
                d.created_time = d.updated_time;
              }

              datas.push(d);
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }

      function getNext(url) {
        var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (limit !== 0) {
          url = url.replace('limit=500', 'limit=' + limit);
        }

        $.getJSON(url, function (res) {
          data.nowLength += res.data.length;
          $(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
          groupData(res);

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
  finish: function finish(rawdata) {
    var lastData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    $(".waiting").addClass("hide");
    $(".main_table").removeClass("hide");
    step.step2();
    swal('完成！', 'Done!', 'success').done();
    $('.result_area > .title span').text(data.fullID);

    if (lastData === false) {
      if (rawdata.extension) {
        data.raw = rawdata;
        delete rawdata.extension;
      } else {
        data.raw.comments = rawdata[0];
        data.raw.reactions = rawdata[1];
      }

      localStorage.setItem("raw", JSON.stringify(data.raw));
    } else {
      data.raw = JSON.parse(localStorage.raw);
    }

    data.filter(data.raw, true);
  },
  filter: function filter(rawData) {
    var generate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    data.filtered = {};
    var isDuplicate = $("#unique").prop("checked");

    for (var _i9 = 0, _Object$keys2 = Object.keys(rawData); _i9 < _Object$keys2.length; _i9++) {
      var key = _Object$keys2[_i9];
      var isTag = $("#tag").prop("checked");
      if (key === 'reactions') isTag = false;

      var newData = _filter.totalFilter.apply(_filter, [rawData[key], key, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));

      data.filtered[key] = newData;
    }

    if (generate === true) {
      table.generate(data.filtered);
    } else {
      return data.filtered;
    }
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
  generate: function generate(filterData) {
    $(".tables table").DataTable().destroy();
    var filtered = filterData;
    var pic = $("#picture").prop("checked");

    for (var _i10 = 0, _Object$keys3 = Object.keys(filtered); _i10 < _Object$keys3.length; _i10++) {
      var key = _Object$keys3[_i10];
      var thead = '';
      var tbody = '';

      if (key === 'reactions') {
        thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td>\u5FC3\u60C5</td>";
      } else if (key === 'sharedposts') {
        thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td width=\"110\">\u7559\u8A00\u6642\u9593</td>";
      } else {
        thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td>\u8B9A</td>\n\t\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
      }

      var _iterator6 = _createForOfIteratorHelper(filtered[key].entries()),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var _step6$value = _slicedToArray(_step6.value, 2),
              j = _step6$value[0],
              val = _step6$value[1];

          var picture = '';

          if (pic) {// picture = `<img src="https://graph.facebook.com/${val.from.id}/picture?type=small&access_token=${config.pageToken}"><br>`;
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
        _iterator6.e(err);
      } finally {
        _iterator6.f();
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

      var _loop = function _loop() {
        var i = _arr2[_i11];
        var table = $('.tables .' + i + ' table').DataTable();
        $(".tables ." + i + " .searchName").on('blur change keyup', function () {
          table.columns(1).search(this.value).draw();
        });
        $(".tables ." + i + " .searchComment").on('blur change keyup', function () {
          table.columns(2).search(this.value).draw();
          config.filter.word = this.value;
        });
      };

      for (var _i11 = 0, _arr2 = arr; _i11 < _arr2.length; _i11++) {
        _loop();
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

    for (var _i12 = 0, _Object$keys4 = Object.keys(compare.raw); _i12 < _Object$keys4.length; _i12++) {
      var key = _Object$keys4[_i12];

      if (key !== ignore) {
        var _iterator7 = _createForOfIteratorHelper(compare.raw[key]),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var i = _step7.value;
            base.push(i);
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      }
    }

    var sort = data.raw.extension ? 'name' : 'id';
    base = base.sort(function (a, b) {
      return a.from[sort] > b.from[sort] ? 1 : -1;
    });

    var _iterator8 = _createForOfIteratorHelper(base),
        _step8;

    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var _i15 = _step8.value;
        _i15.match = 0;
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }

    var temp = '';
    var temp_name = ''; // console.log(base);

    for (var _i13 in base) {
      var obj = base[_i13];

      if (obj.from.id == temp || data.raw.extension && obj.from.name == temp_name) {
        var tar = _final[_final.length - 1];
        tar.match++;

        for (var _i14 = 0, _Object$keys5 = Object.keys(obj); _i14 < _Object$keys5.length; _i14++) {
          var _key = _Object$keys5[_i14];
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

    var _iterator9 = _createForOfIteratorHelper(data_and.entries()),
        _step9;

    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var _step9$value = _slicedToArray(_step9.value, 2),
            j = _step9$value[0],
            val = _step9$value[1];

        var td = "<td>".concat(j + 1, "</td>\n\t\t\t<td><a href='https://www.facebook.com/").concat(val.from.id, "' attr-fbid=\"").concat(val.from.id, "\" target=\"_blank\">").concat(val.from.name, "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react ").concat(val.type || '', "\"></span>").concat(val.type || '', "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/").concat(val.id, "\" target=\"_blank\">").concat(val.message || '', "</a></td>\n\t\t\t<td>").concat(val.like_count || '0', "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/").concat(val.id, "\" target=\"_blank\">").concat(val.story || '', "</a></td>\n\t\t\t<td class=\"nowrap\">").concat(timeConverter(val.created_time) || '', "</td>");
        var tr = "<tr>".concat(td, "</tr>");
        tbody += tr;
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }

    $(".tables .total .table_compare.and tbody").html('').append(tbody);
    var data_or = compare.or;
    var tbody2 = '';

    var _iterator10 = _createForOfIteratorHelper(data_or.entries()),
        _step10;

    try {
      for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
        var _step10$value = _slicedToArray(_step10.value, 2),
            _j = _step10$value[0],
            _val = _step10$value[1];

        var _td = "<td>".concat(_j + 1, "</td>\n\t\t\t<td><a href='https://www.facebook.com/").concat(_val.from.id, "' attr-fbid=\"").concat(_val.from.id, "\" target=\"_blank\">").concat(_val.from.name, "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react ").concat(_val.type || '', "\"></span>").concat(_val.type || '', "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/").concat(_val.id, "\" target=\"_blank\">").concat(_val.message || '', "</a></td>\n\t\t\t<td>").concat(_val.like_count || '', "</td>\n\t\t\t<td class=\"force-break\"><a href=\"https://www.facebook.com/").concat(_val.id, "\" target=\"_blank\">").concat(_val.story || '', "</a></td>\n\t\t\t<td class=\"nowrap\">").concat(timeConverter(_val.created_time) || '', "</td>");

        var _tr = "<tr>".concat(_td, "</tr>");

        tbody2 += _tr;
      }
    } catch (err) {
      _iterator10.e(err);
    } finally {
      _iterator10.f();
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

      var _loop2 = function _loop2() {
        var i = _arr3[_i16];
        var table = $('.tables .' + i + ' table').DataTable();
        $(".tables ." + i + " .searchName").on('blur change keyup', function () {
          table.columns(1).search(this.value).draw();
        });
        $(".tables ." + i + " .searchComment").on('blur change keyup', function () {
          table.columns(2).search(this.value).draw();
          config.filter.word = this.value;
        });
      };

      for (var _i16 = 0, _arr3 = arr; _i16 < _arr3.length; _i16++) {
        _loop2();
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

    var _iterator11 = _createForOfIteratorHelper(choose.award),
        _step11;

    try {
      for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
        var i = _step11.value;
        var row = tempArr.length == 0 ? i : tempArr[i];
        var _tar = $('.tables > div.active table').DataTable().row(row).node().innerHTML;
        insert += '<tr>' + _tar + '</tr>';
      }
    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
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

    var _iterator12 = _createForOfIteratorHelper(res[0]),
        _step12;

    try {
      for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
        var _i17 = _step12.value;
        pages += "<div class=\"page_btn\" data-type=\"1\" data-value=\"".concat(_i17.id, "\" onclick=\"page_selector.selectPage(this)\">").concat(_i17.name, "</div>");
      }
    } catch (err) {
      _iterator12.e(err);
    } finally {
      _iterator12.f();
    }

    if (config.auth_user === true) {
      var _iterator13 = _createForOfIteratorHelper(res[1]),
          _step13;

      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var i = _step13.value;
          groups += "<div class=\"page_btn\" data-type=\"2\" data-value=\"".concat(i.id, "\" onclick=\"page_selector.selectPage(this)\">").concat(i.name, "</div>");
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
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

      var _iterator14 = _createForOfIteratorHelper(res.data),
          _step14;

      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var tr = _step14.value;
          tbody += "<tr><td><button type=\"button\" onclick=\"page_selector.selectPost('".concat(tr.id, "')\">\u9078\u64C7\u8CBC\u6587</button></td><td><a href=\"https://www.facebook.com/").concat(tr.id, "\" target=\"_blank\">").concat(tr.message, "</a></td><td>").concat(timeConverter(tr.created_time), "</td></tr>");
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
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
      $('.select_page').html('');
      $('.select_group').html('');
      data.start(page_selector.page_id + '_' + $('#live_id').val());
    }
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
  totalFilter: function totalFilter(raw, command, isDuplicate, isTag, word, react, startTime, endTime) {
    var datas = raw;

    if (word !== '' && command == 'comments') {
      datas = _filter.word(datas, word);
    }

    if (isTag && command == 'comments') {
      datas = _filter.tag(datas);
    }

    if (command !== 'reactions') {
      datas = _filter.time(datas, endTime);
    } else {
      datas = _filter.react(datas, react);
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
    var newAry = data.filter(function (item) {
      return item.message.indexOf(_word) > -1;
    });
    return newAry;
  },
  tag: function tag(data) {
    var newAry = data.filter(function (item) {
      return item.message_tags;
    });
    return newAry;
  },
  time: function time(data, t) {
    var time_ary = t.split("-");
    var time = moment(new Date(time_ary[0], parseInt(time_ary[1]) - 1, time_ary[2], time_ary[3], time_ary[4], time_ary[5]));
    var newAry = data.filter(function (item) {
      if (item.created_time == '') {
        return true;
      } else {
        return moment(item.created_time) < time;
      }
    });
    return newAry;
  },
  react: function react(data, tar) {
    if (tar == 'all') {
      return data;
    } else {
      var newAry = data.filter(function (item) {
        return item.type == tar;
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