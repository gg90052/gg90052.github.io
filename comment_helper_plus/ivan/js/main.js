"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var TABLE;
var auth_scope = '';
$(document).ready(function () {
  $("#btn_comments").click(function (e) {
    console.log(e);

    if (e.ctrlKey || e.altKey) {
      config.order = 'chronological';
    }

    fb.getAuth('comments');
  });
  $("#btn_like").click(function (e) {
    if (e.ctrlKey || e.altKey) {
      config.likes = true;
    }

    fb.getAuth('reactions');
  });
  $("#btn_choose").click(function () {
    choose.init();
  });
  $("#endTime").click(function () {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
    } else {
      $(this).addClass("active");
    }
  });
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
    post: ['from', 'message', 'attachments', 'created_time'],
    comments: ['like_count', 'comment_count', 'message', 'from', 'created_time', 'attachment']
  },
  limit: {
    comments: '500'
  },
  filter: {
    word: '',
    react: 'all',
    startTime: '2000-12-31-00-00-00',
    endTime: nowDate()
  },
  order: 'chronological',
  auth: 'groups_access_member_info',
  pageToken: ''
};
var fb = {
  getAuth: function getAuth() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
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
      auth_scope = response.authResponse.grantedScopes;
      fbid.init(type);
    } else {
      FB.login(function (response) {
        fb.callback(response);
      }, {
        scope: config.auth,
        return_scopes: true
      });
    }
  }
};
var vue_comments = new Vue({
  el: '#vue_comments',
  data: {
    comments: [],
    keyword: '',
    hasPhoto: false,
    removeDuplicate: false,
    winner: '',
    winner_list: [],
    start_time: '',
    end_time: ''
  },
  computed: {
    filter_comment: function filter_comment() {
      var _this = this;

      var final_arr = this.comments;

      if (this.start_time !== '') {
        final_arr = final_arr.filter(function (item) {
          return moment(item.created_time) > moment(_this.start_time);
        });
      }

      if (this.end_time !== '') {
        final_arr = final_arr.filter(function (item) {
          return moment(item.created_time) < moment(_this.end_time);
        });
      }

      if (this.hasPhoto) {
        final_arr = final_arr.filter(function (item) {
          return item.attachment && item.attachment.type == 'photo';
        });
      }

      if (this.keyword !== '') {
        final_arr = final_arr.filter(function (item) {
          return item.message.indexOf(_this.keyword) >= 0;
        });
      }

      if (this.removeDuplicate) {
        var output = [];
        var keys = [];
        final_arr.forEach(function (item) {
          var key = item.from.id;

          if (keys.indexOf(key) === -1) {
            keys.push(key);
            output.push(item);
          }
        });
        final_arr = output;
      }

      return final_arr;
    }
  },
  methods: {
    choose: function choose() {
      this.winner_list = [];
      var total = this.filter_comment.length;
      var winner_list = genRandomArray(total).splice(0, this.winner);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = winner_list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;
          this.winner_list.push(this.filter_comment[i]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  },
  mounted: function mounted() {
    flatpickr(".timepicker", {
      enableTime: true,
      dateFormat: "Y-m-d H:i"
    });
  }
});
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
  },
  start: function start(fbid) {
    // $(".waiting").removeClass("hide");
    FB.api("/".concat(fbid, "/?fields=").concat(config.field['post'].toString(), "&debug=all"), function (res) {
      var post = $('.post');
      post.find('.from').text(res.from.name);
      post.find('.time').text(moment(res.created_time).format('YYYY-MM-DD HH:mm:ss'));
      post.find('.message').text(res.message);

      if (res.attachments) {
        var src = res.attachments.data[0].media.image.src;
        post.find('.img').html("<img src=\"".concat(src, "\" width=\"360\">"));
      }
    });
    data.get(fbid).then(function (res) {
      // fbid.data = res;
      data.secondRound(res);
    });
  },
  get: function get(fbid) {
    return new Promise(function (resolve, reject) {
      var datas = []; // console.log(`/${fbid}/comments?limit=${config.limit['comments']}&order=${config.order}&fields=${config.field['comments'].toString()}&debug=all`);

      FB.api("/".concat(fbid, "/comments?limit=").concat(config.limit['comments'], "&order=").concat(config.order, "&fields=").concat(config.field['comments'].toString(), "&debug=all"), function (res) {
        data.nowLength += res.data.length;
        $(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
        datas = res.data;

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
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = res.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var d = _step2.value;
              datas.push(d);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          if (res.data.length > 0 && res.paging.next) {
            // if (data.nowLength < 180) {
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
  secondRound: function secondRound(arr) {
    var promise_arr = [];
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = arr[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var comment = _step3.value;
        promise_arr.push(data.get(comment.id));
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    Promise.all(promise_arr).then(function (res) {
      for (var i = 0; i < res.length; i++) {
        arr[i].reply = res[i];
      }

      data.finish(arr);
    });
  },
  finish: function finish(datas) {
    $(".waiting").addClass("hide"); // alert('完成');

    console.log(datas);
    vue_comments.comments = datas; // data.raw = fbid;
    // data.filter(data.raw, true);
    // ui.reset();
  },
  filter: function (_filter) {
    function filter(_x) {
      return _filter.apply(this, arguments);
    }

    filter.toString = function () {
      return _filter.toString();
    };

    return filter;
  }(function (rawData) {
    var _filter2;

    var generate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var isDuplicate = $("#unique").prop("checked");
    var isTag = $("#tag").prop("checked"); // if (config.from_extension === false && rawData.command === 'comments') {
    // 	rawData.data = rawData.data.filter(item => {
    // 		return item.is_hidden === false
    // 	});
    // }

    var newData = (_filter2 = filter).totalFilter.apply(_filter2, [rawData, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));

    rawData.filtered = newData;

    if (generate === true) {
      table.generate(rawData);
    } else {
      return rawData;
    }
  }),
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
var fbid = {
  fbid: [],
  init: function init() {
    config.pageToken = '';
    fbid.fbid = []; // data.init();

    var url = $('#url').val();
    fbid.get(url).then(function (fbid) {
      data.start(fbid);
    });
  },
  get: function get(url) {
    return new Promise(function (resolve, reject) {
      var regex = /\d{4,}/g;
      var newurl = url.substr(url.indexOf('/', 28) + 1, 200); // https://www.facebook.com/ 共25字元，因此選28開始找/

      var result = newurl.match(regex);
      resolve(result[result.length - 1]);
    });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiVEFCTEUiLCJhdXRoX3Njb3BlIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJjbGljayIsImUiLCJjb25zb2xlIiwibG9nIiwiY3RybEtleSIsImFsdEtleSIsImNvbmZpZyIsIm9yZGVyIiwiZmIiLCJnZXRBdXRoIiwibGlrZXMiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiZmlsdGVyRGF0YSIsImRhdGEiLCJmaWx0ZXIiLCJyYXciLCJleHBvcnRUb0pzb25GaWxlIiwiZXhjZWxTdHJpbmciLCJleGNlbCIsInZhbCIsIkpTT04iLCJzdHJpbmdpZnkiLCJqc29uRGF0YSIsImRhdGFTdHIiLCJkYXRhVXJpIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiZXhwb3J0RmlsZURlZmF1bHROYW1lIiwibGlua0VsZW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwiZmllbGQiLCJwb3N0IiwiY29tbWVudHMiLCJsaW1pdCIsIndvcmQiLCJyZWFjdCIsInN0YXJ0VGltZSIsImVuZFRpbWUiLCJub3dEYXRlIiwiYXV0aCIsInBhZ2VUb2tlbiIsInR5cGUiLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsImF1dGhfdHlwZSIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhSZXNwb25zZSIsImdyYW50ZWRTY29wZXMiLCJmYmlkIiwidnVlX2NvbW1lbnRzIiwiVnVlIiwiZWwiLCJrZXl3b3JkIiwiaGFzUGhvdG8iLCJyZW1vdmVEdXBsaWNhdGUiLCJ3aW5uZXIiLCJ3aW5uZXJfbGlzdCIsInN0YXJ0X3RpbWUiLCJlbmRfdGltZSIsImNvbXB1dGVkIiwiZmlsdGVyX2NvbW1lbnQiLCJmaW5hbF9hcnIiLCJpdGVtIiwibW9tZW50IiwiY3JlYXRlZF90aW1lIiwiYXR0YWNobWVudCIsIm1lc3NhZ2UiLCJpbmRleE9mIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJmcm9tIiwiaWQiLCJwdXNoIiwibWV0aG9kcyIsInRvdGFsIiwibGVuZ3RoIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJpIiwibW91bnRlZCIsImZsYXRwaWNrciIsImVuYWJsZVRpbWUiLCJkYXRlRm9ybWF0IiwidXNlcmlkIiwibm93TGVuZ3RoIiwiZXh0ZW5zaW9uIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImhpZGUiLCJ0ZXh0Iiwic3RhcnQiLCJhcGkiLCJ0b1N0cmluZyIsInJlcyIsImZpbmQiLCJuYW1lIiwiZm9ybWF0IiwiYXR0YWNobWVudHMiLCJzcmMiLCJtZWRpYSIsImltYWdlIiwiaHRtbCIsImdldCIsInRoZW4iLCJzZWNvbmRSb3VuZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZGF0YXMiLCJwYWdpbmciLCJuZXh0IiwiZ2V0TmV4dCIsInVybCIsInJlcGxhY2UiLCJnZXRKU09OIiwiZCIsImZhaWwiLCJhcnIiLCJwcm9taXNlX2FyciIsImNvbW1lbnQiLCJhbGwiLCJyZXBseSIsImZpbmlzaCIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwicHJvcCIsImlzVGFnIiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwiZmlsdGVyZWQiLCJ0YWJsZSIsIm5ld09iaiIsImNvbW1hbmQiLCJlYWNoIiwidG1wIiwicG9zdGxpbmsiLCJzdG9yeSIsInRpbWVDb252ZXJ0ZXIiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50Iiwic3RyIiwidGFyZ2V0IiwicmVzdWx0IiwicGFyc2UiLCJyZWFkQXNUZXh0IiwicmVnZXgiLCJuZXd1cmwiLCJzdWJzdHIiLCJtYXRjaCIsInVpIiwiYWRkTGluayIsInRhciIsInJlc2V0IiwiYSIsIkRhdGUiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwiX2QiLCJtb250aHMiLCJ0aW1lIiwib2JqIiwiYXJyYXkiLCJtYXAiLCJ2YWx1ZSIsImluZGV4IiwibiIsImFyeSIsIkFycmF5IiwiciIsInQiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiYWxlcnQiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImxpbmsiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxLQUFKO0FBQ0EsSUFBSUMsVUFBVSxHQUFHLEVBQWpCO0FBRUFDLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBWTtBQUM3QkYsRUFBQUEsQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQkcsS0FBbkIsQ0FBeUIsVUFBVUMsQ0FBVixFQUFhO0FBQ3JDQyxJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUYsQ0FBWjs7QUFDQSxRQUFJQSxDQUFDLENBQUNHLE9BQUYsSUFBYUgsQ0FBQyxDQUFDSSxNQUFuQixFQUEyQjtBQUMxQkMsTUFBQUEsTUFBTSxDQUFDQyxLQUFQLEdBQWUsZUFBZjtBQUNBOztBQUNEQyxJQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxVQUFYO0FBQ0EsR0FORDtBQVFBWixFQUFBQSxDQUFDLENBQUMsV0FBRCxDQUFELENBQWVHLEtBQWYsQ0FBcUIsVUFBVUMsQ0FBVixFQUFhO0FBQ2pDLFFBQUlBLENBQUMsQ0FBQ0csT0FBRixJQUFhSCxDQUFDLENBQUNJLE1BQW5CLEVBQTJCO0FBQzFCQyxNQUFBQSxNQUFNLENBQUNJLEtBQVAsR0FBZSxJQUFmO0FBQ0E7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QUFkLENBQTBCTCxJQUExQjtBQUNBQSxFQUFBQSxJQUFJLENBQUNuTixLQUFMO0FBQ0FGLEVBQUFBLFFBQVEsQ0FBQ3lOLElBQVQsQ0FBY0UsV0FBZCxDQUEwQk4sSUFBMUI7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbInZhciBUQUJMRTtcclxudmFyIGF1dGhfc2NvcGUgPSAnJztcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGNvbmZpZy5vcmRlciA9ICdjaHJvbm9sb2dpY2FsJztcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0Y29uZmlnLmxpa2VzID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRjaG9vc2UuaW5pdCgpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRsZXQgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0ZXhwb3J0VG9Kc29uRmlsZShmaWx0ZXJEYXRhKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA+IDcwMDApIHtcclxuXHRcdFx0Ly8gXHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0Ly8gfSBlbHNlIHtcclxuXHRcdFx0Ly8gXHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2dlbkV4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZGF0YS5leGNlbChmaWx0ZXJEYXRhKVxyXG5cdFx0JChcIiNleGNlbGRhdGFcIikudmFsKEpTT04uc3RyaW5naWZ5KGV4Y2VsU3RyaW5nKSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZXhwb3J0VG9Kc29uRmlsZShqc29uRGF0YSkge1xyXG4gICAgbGV0IGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShqc29uRGF0YSk7XHJcbiAgICBsZXQgZGF0YVVyaSA9ICdkYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCwnKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVN0cik7XHJcbiAgICBcclxuICAgIGxldCBleHBvcnRGaWxlRGVmYXVsdE5hbWUgPSAnZGF0YS5qc29uJztcclxuICAgIFxyXG4gICAgbGV0IGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgZGF0YVVyaSk7XHJcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZXhwb3J0RmlsZURlZmF1bHROYW1lKTtcclxuICAgIGxpbmtFbGVtZW50LmNsaWNrKCk7XHJcbn1cclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdHBvc3Q6IFsnZnJvbScsJ21lc3NhZ2UnLCdhdHRhY2htZW50cycsJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsICdjb21tZW50X2NvdW50JywgJ21lc3NhZ2UnLCAnZnJvbScsICdjcmVhdGVkX3RpbWUnLCdhdHRhY2htZW50J10sXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdHN0YXJ0VGltZTogJzIwMDAtMTItMzEtMDAtMDAtMDAnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRvcmRlcjogJ2Nocm9ub2xvZ2ljYWwnLFxyXG5cdGF1dGg6ICdncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJyxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0Z2V0QXV0aDogKHR5cGUgPSAnJykgPT4ge1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdH0sIHtcclxuXHRcdFx0YXV0aF90eXBlOiAncmVyZXF1ZXN0JyAsXHJcblx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKSA9PiB7XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRhdXRoX3Njb3BlID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcbn1cclxuXHJcbmNvbnN0IHZ1ZV9jb21tZW50cyA9IG5ldyBWdWUoe1xyXG5cdGVsOiAnI3Z1ZV9jb21tZW50cycsXHJcblx0ZGF0YToge1xyXG5cdFx0Y29tbWVudHM6IFtdLFxyXG5cdFx0a2V5d29yZDogJycsXHJcblx0XHRoYXNQaG90bzogZmFsc2UsXHJcblx0XHRyZW1vdmVEdXBsaWNhdGU6IGZhbHNlLFxyXG5cdFx0d2lubmVyOiAnJyxcclxuXHRcdHdpbm5lcl9saXN0OiBbXSxcclxuXHRcdHN0YXJ0X3RpbWU6ICcnLFxyXG5cdFx0ZW5kX3RpbWU6ICcnLFxyXG5cdH0sXHJcblx0Y29tcHV0ZWQ6IHtcclxuXHRcdGZpbHRlcl9jb21tZW50KCl7XHJcblx0XHRcdGxldCBmaW5hbF9hcnIgPSB0aGlzLmNvbW1lbnRzO1xyXG5cdFx0XHRpZiAodGhpcy5zdGFydF90aW1lICE9PSAnJyl7XHJcblx0XHRcdFx0ZmluYWxfYXJyID0gZmluYWxfYXJyLmZpbHRlcihpdGVtPT57XHJcblx0XHRcdFx0XHRyZXR1cm4gbW9tZW50KGl0ZW0uY3JlYXRlZF90aW1lKSA+IG1vbWVudCh0aGlzLnN0YXJ0X3RpbWUpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMuZW5kX3RpbWUgIT09ICcnKXtcclxuXHRcdFx0XHRmaW5hbF9hcnIgPSBmaW5hbF9hcnIuZmlsdGVyKGl0ZW09PntcclxuXHRcdFx0XHRcdHJldHVybiBtb21lbnQoaXRlbS5jcmVhdGVkX3RpbWUpIDwgbW9tZW50KHRoaXMuZW5kX3RpbWUpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMuaGFzUGhvdG8pe1xyXG5cdFx0XHRcdGZpbmFsX2FyciA9IGZpbmFsX2Fyci5maWx0ZXIoaXRlbT0+e1xyXG5cdFx0XHRcdFx0cmV0dXJuIGl0ZW0uYXR0YWNobWVudCAmJiBpdGVtLmF0dGFjaG1lbnQudHlwZSA9PSAncGhvdG8nO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMua2V5d29yZCAhPT0gJycpe1xyXG5cdFx0XHRcdGZpbmFsX2FyciA9IGZpbmFsX2Fyci5maWx0ZXIoaXRlbT0+e1xyXG5cdFx0XHRcdFx0cmV0dXJuIGl0ZW0ubWVzc2FnZS5pbmRleE9mKHRoaXMua2V5d29yZCkgPj0gMDtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLnJlbW92ZUR1cGxpY2F0ZSl7XHJcblx0XHRcdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0XHRcdGxldCBrZXlzID0gW107XHJcblx0XHRcdFx0ZmluYWxfYXJyLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdFx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdFx0XHRpZiAoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRmaW5hbF9hcnIgPSBvdXRwdXQ7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZpbmFsX2FycjtcclxuXHRcdH1cclxuXHR9LFxyXG5cdG1ldGhvZHM6IHtcclxuXHRcdGNob29zZSgpe1xyXG5cdFx0XHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHRcdGxldCB0b3RhbCA9IHRoaXMuZmlsdGVyX2NvbW1lbnQubGVuZ3RoO1xyXG5cdFx0XHRsZXQgd2lubmVyX2xpc3QgPSBnZW5SYW5kb21BcnJheSh0b3RhbCkuc3BsaWNlKDAsIHRoaXMud2lubmVyKTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIHdpbm5lcl9saXN0KXtcclxuXHRcdFx0XHR0aGlzLndpbm5lcl9saXN0LnB1c2godGhpcy5maWx0ZXJfY29tbWVudFtpXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdG1vdW50ZWQoKSB7XHJcblx0XHRmbGF0cGlja3IoXCIudGltZXBpY2tlclwiLCB7XHJcblx0XHRcdGVuYWJsZVRpbWU6IHRydWUsXHJcblx0XHRcdGRhdGVGb3JtYXQ6IFwiWS1tLWQgSDppXCIsXHJcblx0XHR9KTtcclxuXHR9LFxyXG59KTtcclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHJhdzogW10sXHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRpbml0OiAoKSA9PiB7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluizh+aWmeS4rS4uLicpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKSA9PiB7XHJcblx0XHQvLyAkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0RkIuYXBpKGAvJHtmYmlkfS8/ZmllbGRzPSR7Y29uZmlnLmZpZWxkWydwb3N0J10udG9TdHJpbmcoKX0mZGVidWc9YWxsYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRsZXQgcG9zdCA9ICQoJy5wb3N0Jyk7XHJcblx0XHRcdHBvc3QuZmluZCgnLmZyb20nKS50ZXh0KHJlcy5mcm9tLm5hbWUpO1xyXG5cdFx0XHRwb3N0LmZpbmQoJy50aW1lJykudGV4dChtb21lbnQocmVzLmNyZWF0ZWRfdGltZSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJykpO1xyXG5cdFx0XHRwb3N0LmZpbmQoJy5tZXNzYWdlJykudGV4dChyZXMubWVzc2FnZSk7XHJcblx0XHRcdGlmIChyZXMuYXR0YWNobWVudHMpe1xyXG5cdFx0XHRcdGxldCBzcmMgPSByZXMuYXR0YWNobWVudHMuZGF0YVswXS5tZWRpYS5pbWFnZS5zcmM7XHJcblx0XHRcdFx0cG9zdC5maW5kKCcuaW1nJykuaHRtbChgPGltZyBzcmM9XCIke3NyY31cIiB3aWR0aD1cIjM2MFwiPmApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdGRhdGEuZ2V0KGZiaWQpLnRoZW4oKHJlcykgPT4ge1xyXG5cdFx0XHQvLyBmYmlkLmRhdGEgPSByZXM7XHJcblx0XHRcdGRhdGEuc2Vjb25kUm91bmQocmVzKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKGAvJHtmYmlkfS9jb21tZW50cz9saW1pdD0ke2NvbmZpZy5saW1pdFsnY29tbWVudHMnXX0mb3JkZXI9JHtjb25maWcub3JkZXJ9JmZpZWxkcz0ke2NvbmZpZy5maWVsZFsnY29tbWVudHMnXS50b1N0cmluZygpfSZkZWJ1Zz1hbGxgKTtcclxuXHJcblx0XHRcdEZCLmFwaShgLyR7ZmJpZH0vY29tbWVudHM/bGltaXQ9JHtjb25maWcubGltaXRbJ2NvbW1lbnRzJ119Jm9yZGVyPSR7Y29uZmlnLm9yZGVyfSZmaWVsZHM9JHtjb25maWcuZmllbGRbJ2NvbW1lbnRzJ10udG9TdHJpbmcoKX0mZGVidWc9YWxsYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdGRhdGFzID0gcmVzLmRhdGE7XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KSB7XHJcblx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQgPSAwKSB7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKSB7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywgJ2xpbWl0PScgKyBsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcgKyBkYXRhLm5vd0xlbmd0aCArICcg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBkIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpIHtcclxuXHRcdFx0XHRcdC8vIGlmIChkYXRhLm5vd0xlbmd0aCA8IDE4MCkge1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpID0+IHtcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHNlY29uZFJvdW5kOiAoYXJyKT0+e1xyXG5cdFx0bGV0IHByb21pc2VfYXJyID0gW107XHJcblx0XHRmb3IobGV0IGNvbW1lbnQgb2YgYXJyKXtcclxuXHRcdFx0cHJvbWlzZV9hcnIucHVzaChkYXRhLmdldChjb21tZW50LmlkKSk7XHJcblx0XHR9XHJcblx0XHRQcm9taXNlLmFsbChwcm9taXNlX2FycikudGhlbihyZXM9PntcclxuXHRcdFx0Zm9yKGxldCBpPTA7IGk8cmVzLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0XHRhcnJbaV0ucmVwbHkgPSByZXNbaV07XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YS5maW5pc2goYXJyKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZmluaXNoOiAoZGF0YXMpID0+IHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHQvLyBhbGVydCgn5a6M5oiQJyk7XHJcblx0XHRjb25zb2xlLmxvZyhkYXRhcyk7XHJcblx0XHR2dWVfY29tbWVudHMuY29tbWVudHMgPSBkYXRhcztcclxuXHRcdC8vIGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdC8vIGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHRcdC8vIHVpLnJlc2V0KCk7XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKSA9PiB7XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Ly8gaWYgKGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9PT0gZmFsc2UgJiYgcmF3RGF0YS5jb21tYW5kID09PSAnY29tbWVudHMnKSB7XHJcblx0XHQvLyBcdHJhd0RhdGEuZGF0YSA9IHJhd0RhdGEuZGF0YS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHQvLyBcdFx0cmV0dXJuIGl0ZW0uaXNfaGlkZGVuID09PSBmYWxzZVxyXG5cdFx0Ly8gXHR9KTtcclxuXHRcdC8vIH1cclxuXHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdHJhd0RhdGEuZmlsdGVyZWQgPSBuZXdEYXRhO1xyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKSB7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKHJhd0RhdGEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHJhd0RhdGE7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdykgPT4ge1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0Y29uc29sZS5sb2cocmF3KTtcclxuXHRcdGlmIChkYXRhLmV4dGVuc2lvbikge1xyXG5cdFx0XHRpZiAocmF3LmNvbW1hbmQgPT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCI6IHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLooajmg4VcIjogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIueVmeiogOaZgumWk1wiOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXdPYmo7XHJcblx0fSxcclxuXHRpbXBvcnQ6IChmaWxlKSA9PiB7XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZiaWQgPSB7XHJcblx0ZmJpZDogW10sXHJcblx0aW5pdDogKCkgPT4ge1xyXG5cdFx0Y29uZmlnLnBhZ2VUb2tlbiA9ICcnO1xyXG5cdFx0ZmJpZC5mYmlkID0gW107XHJcblx0XHQvLyBkYXRhLmluaXQoKTtcclxuXHRcdGxldCB1cmwgPSAkKCcjdXJsJykudmFsKCk7XHJcblx0XHRmYmlkLmdldCh1cmwpLnRoZW4oKGZiaWQpID0+IHtcclxuXHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdH0pXHJcblx0fSxcclxuXHRnZXQ6ICh1cmwpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdGxldCBuZXd1cmwgPSB1cmwuc3Vic3RyKHVybC5pbmRleE9mKCcvJywgMjgpICsgMSwgMjAwKTtcclxuXHRcdFx0Ly8gaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyDlhbEyNeWtl+WFg++8jOWboOatpOmBuDI46ZaL5aeL5om+L1xyXG5cdFx0XHRsZXQgcmVzdWx0ID0gbmV3dXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0cmVzb2x2ZShyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKSA9PiB7XHJcblxyXG5cdH0sXHJcblx0YWRkTGluazogKCkgPT4ge1xyXG5cdFx0bGV0IHRhciA9ICQoJy5pbnB1dGFyZWEgLm1vcmVsaW5rJyk7XHJcblx0XHRpZiAodGFyLmhhc0NsYXNzKCdzaG93JykpIHtcclxuXHRcdFx0dGFyLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0YXIuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlc2V0OiAoKSA9PiB7XHJcblx0XHRsZXQgY29tbWFuZCA9IGRhdGEucmF3LmNvbW1hbmQ7XHJcblx0XHRpZiAoKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpIHtcclxuXHRcdFx0JCgnbGFiZWwudGFnJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICgkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKSkge1xyXG5cdFx0XHRcdCQoXCIjdGFnXCIpLmNsaWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnbGFiZWwudGFnJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCkge1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkgKyAxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhciArIFwiLVwiICsgbW9udGggKyBcIi1cIiArIGRhdGUgKyBcIi1cIiArIGhvdXIgKyBcIi1cIiArIG1pbiArIFwiLVwiICsgc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKSB7XHJcblx0dmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG5cdHZhciBtb250aHMgPSBbJzAxJywgJzAyJywgJzAzJywgJzA0JywgJzA1JywgJzA2JywgJzA3JywgJzA4JywgJzA5JywgJzEwJywgJzExJywgJzEyJ107XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHRpZiAoZGF0ZSA8IDEwKSB7XHJcblx0XHRkYXRlID0gXCIwXCIgKyBkYXRlO1xyXG5cdH1cclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0aWYgKG1pbiA8IDEwKSB7XHJcblx0XHRtaW4gPSBcIjBcIiArIG1pbjtcclxuXHR9XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdGlmIChzZWMgPCAxMCkge1xyXG5cdFx0c2VjID0gXCIwXCIgKyBzZWM7XHJcblx0fVxyXG5cdHZhciB0aW1lID0geWVhciArICctJyArIG1vbnRoICsgJy0nICsgZGF0ZSArIFwiIFwiICsgaG91ciArICc6JyArIG1pbiArICc6JyArIHNlYztcclxuXHRyZXR1cm4gdGltZTtcclxufVxyXG5cclxuZnVuY3Rpb24gb2JqMkFycmF5KG9iaikge1xyXG5cdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG5cdFx0cmV0dXJuIFt2YWx1ZV07XHJcblx0fSk7XHJcblx0cmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcblx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG5cdHZhciBpLCByLCB0O1xyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdGFyeVtpXSA9IGk7XHJcblx0fVxyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuXHRcdHQgPSBhcnlbcl07XHJcblx0XHRhcnlbcl0gPSBhcnlbaV07XHJcblx0XHRhcnlbaV0gPSB0O1xyXG5cdH1cclxuXHRyZXR1cm4gYXJ5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuXHQvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG5cdHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuXHJcblx0dmFyIENTViA9ICcnO1xyXG5cdC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG5cclxuXHQvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcblx0Ly9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuXHRpZiAoU2hvd0xhYmVsKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcblx0XHRmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcblxyXG5cdFx0XHQvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG5cdFx0XHRyb3cgKz0gaW5kZXggKyAnLCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuXHJcblx0XHQvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHQvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciByb3cgPSBcIlwiO1xyXG5cclxuXHRcdC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG5cdFx0XHRyb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuXHJcblx0XHQvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuXHRcdENTViArPSByb3cgKyAnXFxyXFxuJztcclxuXHR9XHJcblxyXG5cdGlmIChDU1YgPT0gJycpIHtcclxuXHRcdGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG5cdHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcblx0Ly90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcblx0ZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLCBcIl9cIik7XHJcblxyXG5cdC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcblx0dmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuXHJcblx0Ly8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcblx0Ly8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuXHQvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuXHQvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG5cclxuXHQvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuXHRsaW5rLmhyZWYgPSB1cmk7XHJcblxyXG5cdC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcblx0bGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuXHRsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuXHJcblx0Ly90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG5cdGxpbmsuY2xpY2soKTtcclxuXHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il0sImZpbGUiOiJtYWluLmpzIn0=
