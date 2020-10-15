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

  if (hash.indexOf("ranker") >= 0) {
    var datas = {
      command: 'ranker',
      data: JSON.parse(localStorage.ranker)
    };
    data.raw = datas;
    data.finish(data.raw);
  }

  $("#btn_page_selector").click(function (e) {
    fb.getAuth('signin');
  });
  $("#btn_comments").click(function (e) {
    if (e.ctrlKey || e.altKey) {
      config.order = 'chronological';
    }

    fb.user_posts = true;
    fbid.init('comments');
  });
  $("#btn_like").click(function (e) {
    if (e.ctrlKey || e.altKey) {
      config.likes = true;
    }

    fb.user_posts = true;
    fbid.init('reactions');
  });
  $("#btn_url").click(function () {
    fb.getAuth('url_comments');
  });
  $("#btn_pay").click(function () {
    fb.getAuth('signup');
  });
  $("#btn_choose").click(function () {
    choose.init();
  });
  $("#morepost").click(function () {
    ui.addLink();
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
  $("#btn_excel").click(function (e) {
    var filterData = data.filter(data.raw);

    if (e.ctrlKey || e.altKey) {
      exportToJsonFile(filterData);
    } else {// if (filterData.length > 7000) {
      // 	$(".bigExcel").removeClass("hide");
      // } else {
      // 	JSONToCSVConvertor(data.excel(filterData), "Comment_helper", true);
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

    if (e.ctrlKey || e.altKey) {}
  });
  $("#inputJSON").change(function () {
    $(".waiting").removeClass("hide");
    $(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
    config.from_extension = true;
    data["import"](this.files[0]);
  });
});

function exportToJsonFile(jsonData) {
  var dataStr = JSON.stringify(jsonData);
  var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  var exportFileDefaultName = 'data.json';
  var linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

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
    comments: '15',
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
    startTime: '2000-12-31-00-00-00',
    endTime: nowDate()
  },
  order: 'chronological',
  auth: 'groups_show_list, pages_show_list, pages_read_engagement, pages_read_user_content',
  likes: false,
  pageToken: '',
  userToken: '',
  me: '',
  from_extension: false,
  auth_user: false
};
var fb = {
  user_posts: false,
  getAuth: function getAuth() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (type === '') {
      addLink = true;
      type = lastCommand;
    } else {
      addLink = false;
      lastCommand = type;
    }

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
        var token = prompt("請輸入小助手提供給您的序號，若無序號請輸入-1", '-1');
        FB.api("/me?fields=id,name", function (res) {
          var obj = {
            token: token,
            username: res.name,
            app_scope_id: res.id
          };
          $('.waiting').removeClass('hide');
          $.post('https://script.google.com/macros/s/AKfycbzrtUqld8v4IQYjegA6XxmRTYZwLi5Hlkz0dhTBEBYdh5CAFQ8/exec', obj, function (res) {
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
        $.get('https://script.google.com/macros/s/AKfycbzrtUqld8v4IQYjegA6XxmRTYZwLi5Hlkz0dhTBEBYdh5CAFQ8/exec?id=' + config.me, function (res2) {
          $('.waiting').addClass('hide');

          if (res2 === 'true') {
            config.auth_user = true;
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
    fb.authOK();
    config.from_extension = true; // FB.login(function (response) {
    // 	fb.extensionCallback(response);
    // }, {
    // 	scope: config.auth,
    // 	return_scopes: true
    // });
  },
  extensionCallback: function extensionCallback(response) {
    if (response.status === 'connected') {
      config.from_extension = true;
      auth_scope = response.authResponse.grantedScopes;
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
    var postdata = JSON.parse(localStorage.postdata);
    var datas = {
      command: postdata.command,
      data: JSON.parse($(".chrome").val())
    };
    data.raw = datas;
    data.finish(data.raw);
  }
};
var data = {
  raw: [],
  userid: '',
  nowLength: 0,
  extension: false,
  init: function init() {
    $(".main_table").DataTable().destroy();
    $("#awardList").hide();
    $(".console .message").text('截取資料中...');
    data.nowLength = 0;

    if (!addLink) {
      data.raw = [];
    }
  },
  start: function start(fbid) {
    $(".waiting").removeClass("hide");
    $('.pure_fbid').text(fbid.fullID);
    data.get(fbid).then(function (res) {
      // fbid.data = res;
      var _iterator = _createForOfIteratorHelper(res),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var i = _step.value;
          fbid.data.push(i);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      data.finish(fbid);
    });
  },
  get: function get(fbid) {
    return new Promise(function (resolve, reject) {
      var datas = [];
      var promise_array = [];
      var command = fbid.command;

      if (fbid.type === 'group') {
        fbid.fullID = fbid.pureID;
        command = 'group';
      }

      if (fbid.type === 'group' && fbid.command == 'reactions') {
        fbid.fullID = fbid.pureID;
        fbid.command = 'likes';
      }

      if (config.likes) fbid.command = 'likes';
      console.log("".concat(config.apiVersion[command], "/").concat(fbid.fullID, "/").concat(fbid.command, "?limit=").concat(config.limit[fbid.command], "&fields=").concat(config.field[fbid.command].toString(), "&debug=all"));
      var token = config.pageToken == '' ? "&access_token=".concat(config.userToken) : "&access_token=".concat(config.pageToken);
      FB.api("".concat(config.apiVersion[command], "/").concat(fbid.fullID, "/").concat(fbid.command, "?limit=").concat(config.limit[fbid.command], "&order=").concat(config.order, "&fields=").concat(config.field[fbid.command].toString()).concat(token, "&debug=all"), function (res) {
        data.nowLength += res.data.length;
        $(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');

        var _iterator2 = _createForOfIteratorHelper(res.data),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var d = _step2.value;

            if (fbid.command == 'reactions' || fbid.command == 'likes' || config.likes) {
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

        if (res.data.length > 0 && res.paging.next) {
          getNext(res.paging.next);
        } else {
          $(".console .message").text('');
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

          var _iterator3 = _createForOfIteratorHelper(res.data),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var d = _step3.value;

              if (d.id) {
                if (fbid.command == 'reactions' || fbid.command == 'likes' || config.likes) {
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
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

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
  finish: function finish(fbid) {
    $(".waiting").addClass("hide");
    $(".main_table").removeClass("hide");
    $(".update_area,.donate_area").slideUp();
    $(".result_area").slideDown(); // if (data.raw.type == 'group'){
    // 	if (auth_scope.includes('groups_access_member_info')){
    // 		swal('完成！', 'Done!', 'success').done();
    // 		data.raw = fbid;
    // 		data.filter(data.raw, true);
    // 		ui.reset();
    // 	}else{
    // 		swal(
    // 			'付費授權檢查錯誤，抓社團貼文需付費',
    // 			'Authorization Failed! It is a paid feature.',
    // 			'error'
    // 		).done();
    // 	}
    // }else{
    // 	swal('完成！', 'Done!', 'success').done();
    // 	data.raw = fbid;
    // 	data.filter(data.raw, true);
    // 	ui.reset();
    // }

    swal('完成！', 'Done!', 'success').done();
    data.raw = fbid;
    data.filter(data.raw, true);
    ui.reset();
  },
  filter: function filter(rawData) {
    var generate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var isDuplicate = $("#unique").prop("checked");
    var isTag = $("#tag").prop("checked"); // if (config.from_extension === false && rawData.command === 'comments') {
    // 	rawData.data = rawData.data.filter(item => {
    // 		return item.is_hidden === false
    // 	});
    // }

    var newData = _filter.totalFilter.apply(_filter, [rawData, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));

    rawData.filtered = newData;

    if (generate === true) {
      table.generate(rawData);
    } else {
      return rawData;
    }
  },
  excel: function excel(raw) {
    var newObj = [];
    console.log(raw);

    if (data.extension) {
      if (raw.command == 'comments') {
        $.each(raw.filtered, function (i) {
          var tmp = {
            "序號": i + 1,
            "臉書連結": 'https://www.facebook.com/' + this.from.id,
            "姓名": this.from.name,
            "留言連結": 'https://www.facebook.com/' + this.postlink,
            "留言內容": this.message
          };
          newObj.push(tmp);
        });
      } else {
        $.each(raw.filtered, function (i) {
          var tmp = {
            "序號": i + 1,
            "臉書連結": 'https://www.facebook.com/' + this.from.id,
            "姓名": this.from.name,
            "分享連結": this.postlink,
            "留言內容": this.story
          };
          newObj.push(tmp);
        });
      }
    } else {
      $.each(raw.filtered, function (i) {
        var tmp = {
          "序號": i + 1,
          "臉書連結": 'https://www.facebook.com/' + this.from.id,
          "姓名": this.from.name,
          "表情": this.type || '',
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
    $(".main_table").DataTable().destroy();
    var filterdata = rawdata.filtered;
    var thead = '';
    var tbody = '';
    var pic = $("#picture").prop("checked");

    if (rawdata.command == 'reactions' || rawdata.command == 'likes' || config.likes) {
      thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u8868\u60C5</td>";
    } else if (rawdata.command === 'sharedposts') {
      thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td width=\"110\">\u7559\u8A00\u6642\u9593</td>";
    } else if (rawdata.command === 'ranker') {
      thead = "<td>\u6392\u540D</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u5206\u6578</td>";
    } else {
      thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td>\u8B9A</td>\n\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
    }

    var host = 'https://www.facebook.com/';
    if (data.raw.type === 'url_comments') host = $('#enterURL .url').val() + '?fb_comment_id=';

    var _iterator4 = _createForOfIteratorHelper(filterdata.entries()),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var _step4$value = _slicedToArray(_step4.value, 2),
            j = _step4$value[0],
            val = _step4$value[1];

        var picture = '';

        if (pic) {
          picture = "<img src=\"https://graph.facebook.com/".concat(val.from.id, "/picture?type=small\"><br>");
        }

        var td = "<td>".concat(j + 1, "</td>\n\t\t\t<td><a href='https://www.facebook.com/").concat(val.from.id, "' target=\"_blank\">").concat(picture).concat(val.from.name, "</a></td>");

        if (rawdata.command == 'reactions' || rawdata.command == 'likes' || config.likes) {
          td += "<td class=\"center\"><span class=\"react ".concat(val.type, "\"></span>").concat(val.type, "</td>");
        } else if (rawdata.command === 'sharedposts') {
          td += "<td class=\"force-break\"><a href=\"https://www.facebook.com/".concat(val.id, "\" target=\"_blank\">").concat(val.story, "</a></td>\n\t\t\t\t<td class=\"nowrap\">").concat(timeConverter(val.created_time), "</td>");
        } else if (rawdata.command === 'ranker') {
          td = "<td>".concat(j + 1, "</td>\n\t\t\t\t\t  <td><a href='https://www.facebook.com/").concat(val.from.id, "' target=\"_blank\">").concat(val.from.name, "</a></td>\n\t\t\t\t\t  <td>").concat(val.score, "</td>");
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
      _iterator4.e(err);
    } finally {
      _iterator4.f();
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
    data.filter(data.raw, true);
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
    choose.data = data.filter(data.raw);
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
    choose.award = genRandomArray(choose.data.filtered.length).splice(0, choose.num);
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
        li += "<li>\n\t\t\t\t<a href=\"https://www.facebook.com/".concat(i.userid, "\" target=\"_blank\"><img src=\"https://graph.facebook.com/").concat(i.userid, "/picture?type=large&access_token=").concat(config.pageToken, "\" alt=\"\"></a>\n\t\t\t\t<div class=\"info\">\n\t\t\t\t<p class=\"name\"><a href=\"https://www.facebook.com/").concat(i.userid, "\" target=\"_blank\">").concat(i.name, "</a></p>\n\t\t\t\t<p class=\"message\"><a href=\"").concat(i.link, "\" target=\"_blank\">").concat(i.message, "</a></p>\n\t\t\t\t<p class=\"time\"><a href=\"").concat(i.link, "\" target=\"_blank\">").concat(i.time, "</a></p>\n\t\t\t\t</div>\n\t\t\t\t</li>");
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
var fbid = {
  fbid: [],
  init: function init(type) {
    fbid.fbid = [];
    data.init();
    FB.api("/me", function (res) {
      data.userid = res.id;
      var url = '';

      if (addLink) {
        url = fbid.format($('.morelink .addurl').val());
        $('.morelink .addurl').val('');
      } else {
        url = fbid.format($('#enterURL .url').val());
      }

      if (url.indexOf('.php?') === -1 && url.indexOf('?') > 0) {
        url = url.substring(0, url.indexOf('?'));
      }

      fbid.get(url, type).then(function (fbid) {
        data.start(fbid);
      }); // $('.identity').removeClass('hide').html(`登入身份：<img src="https://graph.facebook.com/${res.id}/picture?type=small"><span>${res.name}</span>`);
    });
  },
  get: function get(url, type) {
    return new Promise(function (resolve, reject) {
      var regex = /\d{4,}/g;
      var newurl = url.substr(url.indexOf('/', 28) + 1, 200); // https://www.facebook.com/ 共25字元，因此選28開始找/

      var result = newurl.match(regex);
      var urltype = fbid.checkType(url);
      fbid.checkPageID(url, urltype).then(function (id) {
        if (id === 'personal') {
          urltype = 'personal';
          id = data.userid;
        }

        var obj = {
          pageID: id,
          type: urltype,
          command: type,
          data: []
        };
        if (addLink) obj.data = data.raw.data; //追加貼文

        if (urltype === 'personal') {
          var start = url.indexOf('fbid=');

          if (start >= 0) {
            var end = url.indexOf("&", start);
            obj.pureID = url.substring(start + 5, end);
          } else {
            var _start = url.indexOf('posts/');

            obj.pureID = url.substring(_start + 6, url.length);
          }

          var video = url.indexOf('videos/');

          if (video >= 0) {
            obj.pureID = result[0];
          }

          obj.fullID = obj.pageID + '_' + obj.pureID;
          resolve(obj);
        } else if (urltype === 'pure') {
          obj.fullID = url.replace(/\"/g, '');
          resolve(obj);
        } else {
          if (urltype === 'group') {
            obj.pureID = result[result.length - 1];
            obj.pageID = result[0];
            obj.fullID = obj.pageID + "_" + obj.pureID;
            resolve(obj);
          } else if (urltype === 'photo') {
            var _regex = /\d{4,}/g;

            var _result = url.match(_regex);

            obj.pureID = _result[_result.length - 1];
            obj.fullID = obj.pageID + '_' + obj.pureID;
            resolve(obj);
          } else if (urltype === 'video') {
            obj.pureID = result[result.length - 1];
            FB.api("/".concat(obj.pureID, "?fields=live_status"), function (res) {
              if (res.live_status === 'LIVE') {
                obj.fullID = obj.pureID;
              } else {
                obj.fullID = obj.pageID + '_' + obj.pureID;
              }

              resolve(obj);
            });
          } else {
            if (result.length == 1 || result.length == 3) {
              obj.pureID = result[0];
              obj.fullID = obj.pageID + '_' + obj.pureID;
              resolve(obj);
            } else {
              if (urltype === 'unname') {
                obj.pureID = result[0];
                obj.pageID = result[result.length - 1];
              } else {
                obj.pureID = result[result.length - 1];
              }

              obj.fullID = obj.pageID + '_' + obj.pureID;
              FB.api("/".concat(obj.pageID, "?fields=access_token"), function (res) {
                if (res.error) {
                  resolve(obj);
                } else {
                  if (res.access_token) {
                    config.pageToken = res.access_token;
                  }

                  resolve(obj);
                }
              });
            }
          }
        }
      });
    });
  },
  checkType: function checkType(posturl) {
    if (posturl.indexOf("fbid=") >= 0) {
      if (posturl.indexOf('permalink') >= 0) {
        return 'unname';
      } else {
        return 'personal';
      }
    }

    ;

    if (posturl.indexOf("/groups/") >= 0) {
      return 'group';
    }

    ;

    if (posturl.indexOf("events") >= 0) {
      return 'event';
    }

    ;

    if (posturl.indexOf("/photos/") >= 0) {
      return 'photo';
    }

    ;

    if (posturl.indexOf("/videos/") >= 0) {
      return 'video';
    }

    if (posturl.indexOf('"') >= 0) {
      return 'pure';
    }

    ;
    return 'normal';
  },
  checkPageID: function checkPageID(posturl, type) {
    return new Promise(function (resolve, reject) {
      var start = posturl.indexOf("facebook.com") + 13;
      var end = posturl.indexOf("/", start);
      var regex = /\d{4,}/g;

      if (end < 0) {
        if (posturl.indexOf('fbid=') >= 0) {
          if (type === 'unname') {
            resolve('unname');
          } else {
            resolve('personal');
          }
        } else {
          resolve(posturl.match(regex)[1]);
        }
      } else {
        var group = posturl.indexOf('/groups/');
        var event = posturl.indexOf('/events/');

        if (group >= 0) {
          start = group + 8;
          end = posturl.indexOf("/", start);
          var regex2 = /\d{6,}/g;
          var temp = posturl.substring(start, end);

          if (regex2.test(temp)) {
            resolve(temp);
          } else {
            resolve('group');
          }
        } else if (event >= 0) {
          resolve('event');
        } else {
          var pagename = posturl.substring(start, end);
          FB.api("/".concat(pagename, "?fields=access_token"), function (res) {
            if (res.error) {
              fberror = res.error.message;
              resolve('personal');
            } else {
              if (res.access_token) {
                config.pageToken = res.access_token;
              }

              resolve(res.id);
            }
          });
        }
      }
    });
  },
  format: function format(url) {
    if (url.indexOf('business.facebook.com/') >= 0) {
      url = url.substring(0, url.indexOf("?"));
      return url;
    } else {
      return url;
    }
  }
};
var _filter = {
  totalFilter: function totalFilter(rawdata, isDuplicate, isTag, word, react, startTime, endTime) {
    var data = rawdata.data;

    if (word !== '') {
      data = _filter.word(data, word);
    }

    if (isTag) {
      data = _filter.tag(data);
    }

    if (rawdata.command == 'reactions' || rawdata.command == 'likes' || config.likes) {
      data = _filter.react(data, react);
    } else if (rawdata.command === 'ranker') {} else {
      data = _filter.time(data, startTime, endTime);
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
  addLink: function addLink() {
    var tar = $('.inputarea .morelink');

    if (tar.hasClass('show')) {
      tar.removeClass('show');
    } else {
      tar.addClass('show');
    }
  },
  reset: function reset() {
    var command = data.raw.command;

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
  show: function show() {
    $('.page_selector').removeClass('hide');
    page_selector.getAdmin();
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

    var _iterator5 = _createForOfIteratorHelper(res[0]),
        _step5;

    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var _i3 = _step5.value;
        pages += "<div class=\"page_btn\" data-type=\"1\" data-value=\"".concat(_i3.id, "\" onclick=\"page_selector.selectPage(this)\">").concat(_i3.name, "</div>");
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }

    if (config.auth_user === true) {
      var _iterator6 = _createForOfIteratorHelper(res[1]),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var i = _step6.value;
          groups += "<div class=\"page_btn\" data-type=\"2\" data-value=\"".concat(i.id, "\" onclick=\"page_selector.selectPage(this)\">").concat(i.name, "</div>");
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
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

      var _iterator7 = _createForOfIteratorHelper(res.data),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var tr = _step7.value;

          if (tr.status === 'LIVE') {
            thead += "<tr><td><button type=\"button\" onclick=\"page_selector.selectPost('".concat(tr.id, "')\">\u9078\u64C7\u8CBC\u6587</button>(LIVE)</td><td><a href=\"https://www.facebook.com").concat(tr.permalink_url, "\" target=\"_blank\">").concat(tr.title, "</a></td><td>").concat(timeConverter(tr.created_time), "</td></tr>");
          } else {
            thead += "<tr><td><button type=\"button\" onclick=\"page_selector.selectPost('".concat(tr.id, "')\">\u9078\u64C7\u8CBC\u6587</button></td><td><a href=\"https://www.facebook.com").concat(tr.permalink_url, "\" target=\"_blank\">").concat(tr.title, "</a></td><td>").concat(timeConverter(tr.created_time), "</td></tr>");
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      $('#post_table thead').html(thead);
    });
    FB.api("".concat(config.apiVersion.newest, "/").concat(page_id, "/feed?limit=100"), function (res) {
      $('.fb_loading').addClass('hide');
      var tbody = '';

      var _iterator8 = _createForOfIteratorHelper(res.data),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var tr = _step8.value;
          tbody += "<tr><td><button type=\"button\" onclick=\"page_selector.selectPost('".concat(tr.id, "')\">\u9078\u64C7\u8CBC\u6587</button></td><td><a href=\"https://www.facebook.com/").concat(tr.id, "\" target=\"_blank\">").concat(tr.message, "</a></td><td>").concat(timeConverter(tr.created_time), "</td></tr>");
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }

      $('#post_table tbody').html(tbody);
    });
  },
  selectPost: function selectPost(fbid) {
    $('.page_selector').addClass('hide');
    $('.select_page').html('');
    $('.select_group').html('');
    $('#post_table tbody').html('');
    var id = '"' + fbid + '"';
    $('#enterURL .url').val(id);
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