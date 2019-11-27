"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var TABLE;
var auth_scope = '';
var all_length = 0;
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
});

function showType() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'standard';
  vue_comments.show(type);
}

function exportJSON() {
  // exportToJsonFile(vue_comments.comments);
  vue_comments.forExport();
}

function exportToJsonFile(jsonData) {
  var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data';
  return new Promise(function (resolve) {
    var dataStr = JSON.stringify(jsonData);
    var blob = new Blob([dataStr], {
      type: 'application/json'
    });
    var dataUri = URL.createObjectURL(blob);
    var linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', "".concat(fileName, ".json"));
    linkElement.click();
    resolve();
  });
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
    end_time: '',
    showType: 'standard',
    output: {}
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
        var _output = [];
        var keys = [];
        final_arr.forEach(function (item) {
          var key = item.from.id;

          if (keys.indexOf(key) === -1) {
            keys.push(key);

            _output.push(item);
          }
        });
        final_arr = _output;
      }

      var output = JSON.parse(JSON.stringify(final_arr));
      var comment_arr = [];
      var reply_arr = [];
      output.forEach(function (item, index) {
        item.comment_index = index;
        item.reply.forEach(function (reply_item, j) {
          reply_item.comment_index = index;
          reply_item.reply_index = j;
          reply_arr.push(reply_item);
        });
        delete item['reply'];
        comment_arr.push(item);
      });
      this.output.comments = comment_arr;
      this.output.replys = reply_arr;
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
    },
    forExport: function forExport() {
      var output = JSON.parse(JSON.stringify(this.comments));
      var comment_arr = [];
      var reply_arr = [];
      output.forEach(function (item, index) {
        item.comment_index = index;
        item.reply.forEach(function (reply_item, j) {
          reply_item.comment_index = index;
          reply_item.reply_index = j;
          reply_arr.push(reply_item);
        });
        delete item['reply'];
        comment_arr.push(item);
      });
      exportToJsonFile(comment_arr, 'comments');
      exportToJsonFile(reply_arr, 'replys');
    },
    show: function show(type) {
      this.showType = type;
    }
  },
  mounted: function mounted() {
    flatpickr(".timepicker", {
      enableTime: true,
      dateFormat: "Y-m-d H:i"
    });
    new Clipboard('.copy_btn');
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
    $("#loading").addClass("show");
    FB.api("/".concat(fbid, "/?fields=").concat(config.field['post'].toString(), "&debug=all"), function (res) {
      var post = $('.post'); // post.find('.from').text(res.from.name);

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
        all_length += res.data.length;
        $("#loading .message span").text(all_length);
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
          all_length += res.data.length;
          $("#loading .message span").text(all_length);
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
    $("#loading").removeClass("show"); // alert('完成');

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiVEFCTEUiLCJhdXRoX3Njb3BlIiwiYWxsX2xlbmd0aCIsIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiY2xpY2siLCJlIiwiY29uc29sZSIsImxvZyIsImN0cmxLZXkiLCJhbHRLZXkiLCJjb25maWciLCJvcmRlciIsImZiIiwiZ2V0QXV0aCIsImxpa2VzIiwiY2hvb3NlIiwiaW5pdCIsImhhc0NsYXNzIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsInNob3dUeXBlIiwidHlwZSIsInZ1ZV9jb21tZW50cyIsInNob3ciLCJleHBvcnRKU09OIiwiZm9yRXhwb3J0IiwiZXhwb3J0VG9Kc29uRmlsZSIsImpzb25EYXRhIiwiZmlsZU5hbWUiLCJQcm9taXNlIiwicmVzb2x2ZSIsImRhdGFTdHIiLCJKU09OIiwic3RyaW5naWZ5IiwiYmxvYiIsIkJsb2IiLCJkYXRhVXJpIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwibGlua0VsZW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwiZmllbGQiLCJwb3N0IiwiY29tbWVudHMiLCJsaW1pdCIsImZpbHRlciIsIndvcmQiLCJyZWFjdCIsInN0YXJ0VGltZSIsImVuZFRpbWUiLCJub3dEYXRlIiwiYXV0aCIsInBhZ2VUb2tlbiIsIkZCIiwibG9naW4iLCJyZXNwb25zZSIsImNhbGxiYWNrIiwiYXV0aF90eXBlIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImZiaWQiLCJWdWUiLCJlbCIsImRhdGEiLCJrZXl3b3JkIiwiaGFzUGhvdG8iLCJyZW1vdmVEdXBsaWNhdGUiLCJ3aW5uZXIiLCJ3aW5uZXJfbGlzdCIsInN0YXJ0X3RpbWUiLCJlbmRfdGltZSIsIm91dHB1dCIsImNvbXB1dGVkIiwiZmlsdGVyX2NvbW1lbnQiLCJmaW5hbF9hcnIiLCJpdGVtIiwibW9tZW50IiwiY3JlYXRlZF90aW1lIiwiYXR0YWNobWVudCIsIm1lc3NhZ2UiLCJpbmRleE9mIiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJmcm9tIiwiaWQiLCJwdXNoIiwicGFyc2UiLCJjb21tZW50X2FyciIsInJlcGx5X2FyciIsImluZGV4IiwiY29tbWVudF9pbmRleCIsInJlcGx5IiwicmVwbHlfaXRlbSIsImoiLCJyZXBseV9pbmRleCIsInJlcGx5cyIsIm1ldGhvZHMiLCJ0b3RhbCIsImxlbmd0aCIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwiaSIsIm1vdW50ZWQiLCJmbGF0cGlja3IiLCJlbmFibGVUaW1lIiwiZGF0ZUZvcm1hdCIsIkNsaXBib2FyZCIsInJhdyIsInVzZXJpZCIsIm5vd0xlbmd0aCIsImV4dGVuc2lvbiIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwidGV4dCIsInN0YXJ0IiwiYXBpIiwidG9TdHJpbmciLCJyZXMiLCJmaW5kIiwiZm9ybWF0IiwiYXR0YWNobWVudHMiLCJzcmMiLCJtZWRpYSIsImltYWdlIiwiaHRtbCIsImdldCIsInRoZW4iLCJzZWNvbmRSb3VuZCIsInJlamVjdCIsImRhdGFzIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJ1cmwiLCJyZXBsYWNlIiwiZ2V0SlNPTiIsImQiLCJmYWlsIiwiYXJyIiwicHJvbWlzZV9hcnIiLCJjb21tZW50IiwiYWxsIiwiZmluaXNoIiwicmF3RGF0YSIsImdlbmVyYXRlIiwiaXNEdXBsaWNhdGUiLCJwcm9wIiwiaXNUYWciLCJuZXdEYXRhIiwidG90YWxGaWx0ZXIiLCJvYmoyQXJyYXkiLCJmaWx0ZXJlZCIsInRhYmxlIiwiZXhjZWwiLCJuZXdPYmoiLCJjb21tYW5kIiwiZWFjaCIsInRtcCIsIm5hbWUiLCJwb3N0bGluayIsInN0b3J5IiwidGltZUNvbnZlcnRlciIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiZXZlbnQiLCJzdHIiLCJ0YXJnZXQiLCJyZXN1bHQiLCJyZWFkQXNUZXh0IiwidmFsIiwicmVnZXgiLCJuZXd1cmwiLCJzdWJzdHIiLCJtYXRjaCIsInVpIiwiYWRkTGluayIsInRhciIsInJlc2V0IiwiYSIsIkRhdGUiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwiX2QiLCJtb250aHMiLCJ0aW1lIiwib2JqIiwiYXJyYXkiLCJtYXAiLCJ2YWx1ZSIsIm4iLCJhcnkiLCJBcnJheSIsInIiLCJ0IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJyb3ciLCJzbGljZSIsImFsZXJ0IiwidXJpIiwiZW5jb2RlVVJJIiwibGluayIsImhyZWYiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLEtBQUo7QUFDQSxJQUFJQyxVQUFVLEdBQUcsRUFBakI7QUFDQSxJQUFJQyxVQUFVLEdBQUcsQ0FBakI7QUFFQUMsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWUMsS0FBWixDQUFrQixZQUFZO0FBQzdCRixFQUFBQSxDQUFDLENBQUMsZUFBRCxDQUFELENBQW1CRyxLQUFuQixDQUF5QixVQUFVQyxDQUFWLEVBQWE7QUFDckNDLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixDQUFaOztBQUNBLFFBQUlBLENBQUMsQ0FBQ0csT0FBRixJQUFhSCxDQUFDLENBQUNJLE1BQW5CLEVBQTJCO0FBQzFCQyxNQUFBQSxNQUFNLENBQUNDLEtBQVAsR0FBZSxlQUFmO0FBQ0E7O0FBQ0RDLElBQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLFVBQVg7QUFDQSxHQU5EO0FBUUFaLEVBQUFBLENBQUMsQ0FBQyxX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T0FBWixDQUFvQixJQUFwQixFQUEwQixHQUExQixDQUFaLENBakQ2RCxDQW1EN0Q7O0FBQ0EsTUFBSXFGLEdBQUcsR0FBRyx1Q0FBdUNDLFNBQVMsQ0FBQ0wsR0FBRCxDQUExRCxDQXBENkQsQ0FzRDdEO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBQ0EsTUFBSU0sSUFBSSxHQUFHak8sUUFBUSxDQUFDc0MsYUFBVCxDQUF1QixHQUF2QixDQUFYO0FBQ0EyTCxFQUFBQSxJQUFJLENBQUNDLElBQUwsR0FBWUgsR0FBWixDQTdENkQsQ0ErRDdEOztBQUNBRSxFQUFBQSxJQUFJLENBQUNFLEtBQUwsR0FBYSxtQkFBYjtBQUNBRixFQUFBQSxJQUFJLENBQUNHLFFBQUwsR0FBZ0IxTSxRQUFRLEdBQUcsTUFBM0IsQ0FqRTZELENBbUU3RDs7QUFDQTFCLEVBQUFBLFFBQVEsQ0FBQ3FPLElBQVQsQ0FBY0MsV0FBZCxDQUEwQkwsSUFBMUI7QUFDQUEsRUFBQUEsSUFBSSxDQUFDL04sS0FBTDtBQUNBRixFQUFBQSxRQUFRLENBQUNxTyxJQUFULENBQWNFLFdBQWQsQ0FBMEJOLElBQTFCO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgVEFCTEU7XHJcbnZhciBhdXRoX3Njb3BlID0gJyc7XHJcbnZhciBhbGxfbGVuZ3RoID0gMDtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGNvbmZpZy5vcmRlciA9ICdjaHJvbm9sb2dpY2FsJztcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0Y29uZmlnLmxpa2VzID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRjaG9vc2UuaW5pdCgpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcbn0pO1xyXG5mdW5jdGlvbiBzaG93VHlwZSh0eXBlID0gJ3N0YW5kYXJkJyl7XHJcblx0dnVlX2NvbW1lbnRzLnNob3codHlwZSk7XHJcbn1cclxuZnVuY3Rpb24gZXhwb3J0SlNPTigpe1xyXG5cdC8vIGV4cG9ydFRvSnNvbkZpbGUodnVlX2NvbW1lbnRzLmNvbW1lbnRzKTtcclxuXHR2dWVfY29tbWVudHMuZm9yRXhwb3J0KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV4cG9ydFRvSnNvbkZpbGUoanNvbkRhdGEsIGZpbGVOYW1lID0gJ2RhdGEnKSB7XHJcblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG5cdFx0dmFyIGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShqc29uRGF0YSk7XHJcblx0XHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtkYXRhU3RyXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vanNvbicgfSk7IFxyXG5cdFx0dmFyIGRhdGFVcmkgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG5cdFx0XHJcblx0XHR2YXIgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcblx0XHRsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBkYXRhVXJpKTtcclxuXHRcdGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBgJHtmaWxlTmFtZX0uanNvbmApO1xyXG5cdFx0bGlua0VsZW1lbnQuY2xpY2soKTtcclxuXHRcdHJlc29sdmUoKTtcclxuXHR9KTtcclxufVxyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0cG9zdDogWydmcm9tJywnbWVzc2FnZScsJ2F0dGFjaG1lbnRzJywnY3JlYXRlZF90aW1lJ10sXHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywgJ2NvbW1lbnRfY291bnQnLCAnbWVzc2FnZScsICdmcm9tJywgJ2NyZWF0ZWRfdGltZScsJ2F0dGFjaG1lbnQnXSxcclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0fSxcclxuXHRmaWx0ZXI6IHtcclxuXHRcdHdvcmQ6ICcnLFxyXG5cdFx0cmVhY3Q6ICdhbGwnLFxyXG5cdFx0c3RhcnRUaW1lOiAnMjAwMC0xMi0zMS0wMC0wMC0wMCcsXHJcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcclxuXHR9LFxyXG5cdG9yZGVyOiAnY2hyb25vbG9naWNhbCcsXHJcblx0YXV0aDogJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nLFxyXG5cdHBhZ2VUb2tlbjogJycsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHRnZXRBdXRoOiAodHlwZSA9ICcnKSA9PiB7XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRhdXRoX3R5cGU6ICdyZXJlcXVlc3QnICxcclxuXHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpID0+IHtcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGF1dGhfc2NvcGUgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0ZmJpZC5pbml0KHR5cGUpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxufVxyXG5cclxuY29uc3QgdnVlX2NvbW1lbnRzID0gbmV3IFZ1ZSh7XHJcblx0ZWw6ICcjdnVlX2NvbW1lbnRzJyxcclxuXHRkYXRhOiB7XHJcblx0XHRjb21tZW50czogW10sXHJcblx0XHRrZXl3b3JkOiAnJyxcclxuXHRcdGhhc1Bob3RvOiBmYWxzZSxcclxuXHRcdHJlbW92ZUR1cGxpY2F0ZTogZmFsc2UsXHJcblx0XHR3aW5uZXI6ICcnLFxyXG5cdFx0d2lubmVyX2xpc3Q6IFtdLFxyXG5cdFx0c3RhcnRfdGltZTogJycsXHJcblx0XHRlbmRfdGltZTogJycsXHJcblx0XHRzaG93VHlwZTogJ3N0YW5kYXJkJyxcclxuXHRcdG91dHB1dDoge30sXHJcblx0fSxcclxuXHRjb21wdXRlZDoge1xyXG5cdFx0ZmlsdGVyX2NvbW1lbnQoKXtcclxuXHRcdFx0bGV0IGZpbmFsX2FyciA9IHRoaXMuY29tbWVudHM7XHJcblx0XHRcdGlmICh0aGlzLnN0YXJ0X3RpbWUgIT09ICcnKXtcclxuXHRcdFx0XHRmaW5hbF9hcnIgPSBmaW5hbF9hcnIuZmlsdGVyKGl0ZW09PntcclxuXHRcdFx0XHRcdHJldHVybiBtb21lbnQoaXRlbS5jcmVhdGVkX3RpbWUpID4gbW9tZW50KHRoaXMuc3RhcnRfdGltZSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGhpcy5lbmRfdGltZSAhPT0gJycpe1xyXG5cdFx0XHRcdGZpbmFsX2FyciA9IGZpbmFsX2Fyci5maWx0ZXIoaXRlbT0+e1xyXG5cdFx0XHRcdFx0cmV0dXJuIG1vbWVudChpdGVtLmNyZWF0ZWRfdGltZSkgPCBtb21lbnQodGhpcy5lbmRfdGltZSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGhpcy5oYXNQaG90byl7XHJcblx0XHRcdFx0ZmluYWxfYXJyID0gZmluYWxfYXJyLmZpbHRlcihpdGVtPT57XHJcblx0XHRcdFx0XHRyZXR1cm4gaXRlbS5hdHRhY2htZW50ICYmIGl0ZW0uYXR0YWNobWVudC50eXBlID09ICdwaG90byc7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGhpcy5rZXl3b3JkICE9PSAnJyl7XHJcblx0XHRcdFx0ZmluYWxfYXJyID0gZmluYWxfYXJyLmZpbHRlcihpdGVtPT57XHJcblx0XHRcdFx0XHRyZXR1cm4gaXRlbS5tZXNzYWdlLmluZGV4T2YodGhpcy5rZXl3b3JkKSA+PSAwO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMucmVtb3ZlRHVwbGljYXRlKXtcclxuXHRcdFx0XHRsZXQgb3V0cHV0ID0gW107XHJcblx0XHRcdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdFx0XHRmaW5hbF9hcnIuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0bGV0IGtleSA9IGl0ZW0uZnJvbS5pZDtcclxuXHRcdFx0XHRcdGlmIChrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGZpbmFsX2FyciA9IG91dHB1dDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IG91dHB1dCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZmluYWxfYXJyKSk7XHJcblx0XHRcdGxldCBjb21tZW50X2FyciA9IFtdO1xyXG5cdFx0XHRsZXQgcmVwbHlfYXJyID0gW107XHJcblx0XHRcdG91dHB1dC5mb3JFYWNoKChpdGVtLGluZGV4KT0+e1xyXG5cdFx0XHRcdGl0ZW0uY29tbWVudF9pbmRleCA9IGluZGV4O1xyXG5cdFx0XHRcdGl0ZW0ucmVwbHkuZm9yRWFjaCgocmVwbHlfaXRlbSwgaik9PntcclxuXHRcdFx0XHRcdHJlcGx5X2l0ZW0uY29tbWVudF9pbmRleCA9IGluZGV4O1xyXG5cdFx0XHRcdFx0cmVwbHlfaXRlbS5yZXBseV9pbmRleCA9IGo7XHJcblx0XHRcdFx0XHRyZXBseV9hcnIucHVzaChyZXBseV9pdGVtKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdGRlbGV0ZSBpdGVtWydyZXBseSddO1xyXG5cdFx0XHRcdGNvbW1lbnRfYXJyLnB1c2goaXRlbSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLm91dHB1dC5jb21tZW50cyA9IGNvbW1lbnRfYXJyO1xyXG5cdFx0XHR0aGlzLm91dHB1dC5yZXBseXMgPSByZXBseV9hcnI7XHJcblxyXG5cdFx0XHRyZXR1cm4gZmluYWxfYXJyO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0bWV0aG9kczoge1xyXG5cdFx0Y2hvb3NlKCl7XHJcblx0XHRcdHRoaXMud2lubmVyX2xpc3QgPSBbXTtcclxuXHRcdFx0bGV0IHRvdGFsID0gdGhpcy5maWx0ZXJfY29tbWVudC5sZW5ndGg7XHJcblx0XHRcdGxldCB3aW5uZXJfbGlzdCA9IGdlblJhbmRvbUFycmF5KHRvdGFsKS5zcGxpY2UoMCwgdGhpcy53aW5uZXIpO1xyXG5cdFx0XHRmb3IobGV0IGkgb2Ygd2lubmVyX2xpc3Qpe1xyXG5cdFx0XHRcdHRoaXMud2lubmVyX2xpc3QucHVzaCh0aGlzLmZpbHRlcl9jb21tZW50W2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGZvckV4cG9ydCgpe1xyXG5cdFx0XHRsZXQgb3V0cHV0ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmNvbW1lbnRzKSk7XHJcblx0XHRcdGxldCBjb21tZW50X2FyciA9IFtdO1xyXG5cdFx0XHRsZXQgcmVwbHlfYXJyID0gW107XHJcblx0XHRcdG91dHB1dC5mb3JFYWNoKChpdGVtLGluZGV4KT0+e1xyXG5cdFx0XHRcdGl0ZW0uY29tbWVudF9pbmRleCA9IGluZGV4O1xyXG5cdFx0XHRcdGl0ZW0ucmVwbHkuZm9yRWFjaCgocmVwbHlfaXRlbSwgaik9PntcclxuXHRcdFx0XHRcdHJlcGx5X2l0ZW0uY29tbWVudF9pbmRleCA9IGluZGV4O1xyXG5cdFx0XHRcdFx0cmVwbHlfaXRlbS5yZXBseV9pbmRleCA9IGo7XHJcblx0XHRcdFx0XHRyZXBseV9hcnIucHVzaChyZXBseV9pdGVtKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdGRlbGV0ZSBpdGVtWydyZXBseSddO1xyXG5cdFx0XHRcdGNvbW1lbnRfYXJyLnB1c2goaXRlbSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRleHBvcnRUb0pzb25GaWxlKGNvbW1lbnRfYXJyLCAnY29tbWVudHMnKTtcclxuXHRcdFx0ZXhwb3J0VG9Kc29uRmlsZShyZXBseV9hcnIsICdyZXBseXMnKTtcclxuXHRcdH0sXHJcblx0XHRzaG93KHR5cGUpe1xyXG5cdFx0XHR0aGlzLnNob3dUeXBlID0gdHlwZTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdG1vdW50ZWQoKSB7XHJcblx0XHRmbGF0cGlja3IoXCIudGltZXBpY2tlclwiLCB7XHJcblx0XHRcdGVuYWJsZVRpbWU6IHRydWUsXHJcblx0XHRcdGRhdGVGb3JtYXQ6IFwiWS1tLWQgSDppXCIsXHJcblx0XHR9KTtcclxuXHRcdG5ldyBDbGlwYm9hcmQoJy5jb3B5X2J0bicpO1xyXG5cdH0sXHJcbn0pO1xyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiBbXSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdGluaXQ6ICgpID0+IHtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W6LOH5paZ5LitLi4uJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0fSxcclxuXHRzdGFydDogKGZiaWQpID0+IHtcclxuXHRcdCQoXCIjbG9hZGluZ1wiKS5hZGRDbGFzcyhcInNob3dcIik7XHJcblx0XHRGQi5hcGkoYC8ke2ZiaWR9Lz9maWVsZHM9JHtjb25maWcuZmllbGRbJ3Bvc3QnXS50b1N0cmluZygpfSZkZWJ1Zz1hbGxgLCAocmVzKSA9PiB7XHJcblx0XHRcdGxldCBwb3N0ID0gJCgnLnBvc3QnKTtcclxuXHRcdFx0Ly8gcG9zdC5maW5kKCcuZnJvbScpLnRleHQocmVzLmZyb20ubmFtZSk7XHJcblx0XHRcdHBvc3QuZmluZCgnLnRpbWUnKS50ZXh0KG1vbWVudChyZXMuY3JlYXRlZF90aW1lKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKSk7XHJcblx0XHRcdHBvc3QuZmluZCgnLm1lc3NhZ2UnKS50ZXh0KHJlcy5tZXNzYWdlKTtcclxuXHRcdFx0aWYgKHJlcy5hdHRhY2htZW50cyl7XHJcblx0XHRcdFx0bGV0IHNyYyA9IHJlcy5hdHRhY2htZW50cy5kYXRhWzBdLm1lZGlhLmltYWdlLnNyYztcclxuXHRcdFx0XHRwb3N0LmZpbmQoJy5pbWcnKS5odG1sKGA8aW1nIHNyYz1cIiR7c3JjfVwiIHdpZHRoPVwiMzYwXCI+YCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0ZGF0YS5nZXQoZmJpZCkudGhlbigocmVzKSA9PiB7XHJcblx0XHRcdC8vIGZiaWQuZGF0YSA9IHJlcztcclxuXHRcdFx0ZGF0YS5zZWNvbmRSb3VuZChyZXMpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coYC8ke2ZiaWR9L2NvbW1lbnRzP2xpbWl0PSR7Y29uZmlnLmxpbWl0Wydjb21tZW50cyddfSZvcmRlcj0ke2NvbmZpZy5vcmRlcn0mZmllbGRzPSR7Y29uZmlnLmZpZWxkWydjb21tZW50cyddLnRvU3RyaW5nKCl9JmRlYnVnPWFsbGApO1xyXG5cclxuXHRcdFx0RkIuYXBpKGAvJHtmYmlkfS9jb21tZW50cz9saW1pdD0ke2NvbmZpZy5saW1pdFsnY29tbWVudHMnXX0mb3JkZXI9JHtjb25maWcub3JkZXJ9JmZpZWxkcz0ke2NvbmZpZy5maWVsZFsnY29tbWVudHMnXS50b1N0cmluZygpfSZkZWJ1Zz1hbGxgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0YWxsX2xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0JChcIiNsb2FkaW5nIC5tZXNzYWdlIHNwYW5cIikudGV4dChhbGxfbGVuZ3RoKTtcclxuXHRcdFx0XHRkYXRhcyA9IHJlcy5kYXRhO1xyXG5cdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCkge1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0ID0gMCkge1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCkge1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsICdsaW1pdD0nICsgbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRhbGxfbGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIjbG9hZGluZyAubWVzc2FnZSBzcGFuXCIpLnRleHQoYWxsX2xlbmd0aCk7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBkIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpIHtcclxuXHRcdFx0XHRcdC8vIGlmIChkYXRhLm5vd0xlbmd0aCA8IDE4MCkge1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpID0+IHtcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHNlY29uZFJvdW5kOiAoYXJyKT0+e1xyXG5cdFx0bGV0IHByb21pc2VfYXJyID0gW107XHJcblx0XHRmb3IobGV0IGNvbW1lbnQgb2YgYXJyKXtcclxuXHRcdFx0cHJvbWlzZV9hcnIucHVzaChkYXRhLmdldChjb21tZW50LmlkKSk7XHJcblx0XHR9XHJcblx0XHRQcm9taXNlLmFsbChwcm9taXNlX2FycikudGhlbihyZXM9PntcclxuXHRcdFx0Zm9yKGxldCBpPTA7IGk8cmVzLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0XHRhcnJbaV0ucmVwbHkgPSByZXNbaV07XHJcblx0XHRcdH1cclxuXHRcdFx0ZGF0YS5maW5pc2goYXJyKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZmluaXNoOiAoZGF0YXMpID0+IHtcclxuXHRcdCQoXCIjbG9hZGluZ1wiKS5yZW1vdmVDbGFzcyhcInNob3dcIik7XHJcblx0XHQvLyBhbGVydCgn5a6M5oiQJyk7XHJcblx0XHRjb25zb2xlLmxvZyhkYXRhcyk7XHJcblx0XHR2dWVfY29tbWVudHMuY29tbWVudHMgPSBkYXRhcztcclxuXHRcdC8vIGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdC8vIGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHRcdC8vIHVpLnJlc2V0KCk7XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKSA9PiB7XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Ly8gaWYgKGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9PT0gZmFsc2UgJiYgcmF3RGF0YS5jb21tYW5kID09PSAnY29tbWVudHMnKSB7XHJcblx0XHQvLyBcdHJhd0RhdGEuZGF0YSA9IHJhd0RhdGEuZGF0YS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHQvLyBcdFx0cmV0dXJuIGl0ZW0uaXNfaGlkZGVuID09PSBmYWxzZVxyXG5cdFx0Ly8gXHR9KTtcclxuXHRcdC8vIH1cclxuXHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdHJhd0RhdGEuZmlsdGVyZWQgPSBuZXdEYXRhO1xyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKSB7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKHJhd0RhdGEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHJhd0RhdGE7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdykgPT4ge1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0Y29uc29sZS5sb2cocmF3KTtcclxuXHRcdGlmIChkYXRhLmV4dGVuc2lvbikge1xyXG5cdFx0XHRpZiAocmF3LmNvbW1hbmQgPT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCI6IHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLooajmg4VcIjogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIueVmeiogOaZgumWk1wiOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXdPYmo7XHJcblx0fSxcclxuXHRpbXBvcnQ6IChmaWxlKSA9PiB7XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZiaWQgPSB7XHJcblx0ZmJpZDogW10sXHJcblx0aW5pdDogKCkgPT4ge1xyXG5cdFx0Y29uZmlnLnBhZ2VUb2tlbiA9ICcnO1xyXG5cdFx0ZmJpZC5mYmlkID0gW107XHJcblx0XHQvLyBkYXRhLmluaXQoKTtcclxuXHRcdGxldCB1cmwgPSAkKCcjdXJsJykudmFsKCk7XHJcblx0XHRmYmlkLmdldCh1cmwpLnRoZW4oKGZiaWQpID0+IHtcclxuXHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdH0pXHJcblx0fSxcclxuXHRnZXQ6ICh1cmwpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdGxldCBuZXd1cmwgPSB1cmwuc3Vic3RyKHVybC5pbmRleE9mKCcvJywgMjgpICsgMSwgMjAwKTtcclxuXHRcdFx0Ly8gaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyDlhbEyNeWtl+WFg++8jOWboOatpOmBuDI46ZaL5aeL5om+L1xyXG5cdFx0XHRsZXQgcmVzdWx0ID0gbmV3dXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0cmVzb2x2ZShyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKSA9PiB7XHJcblxyXG5cdH0sXHJcblx0YWRkTGluazogKCkgPT4ge1xyXG5cdFx0bGV0IHRhciA9ICQoJy5pbnB1dGFyZWEgLm1vcmVsaW5rJyk7XHJcblx0XHRpZiAodGFyLmhhc0NsYXNzKCdzaG93JykpIHtcclxuXHRcdFx0dGFyLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0YXIuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlc2V0OiAoKSA9PiB7XHJcblx0XHRsZXQgY29tbWFuZCA9IGRhdGEucmF3LmNvbW1hbmQ7XHJcblx0XHRpZiAoKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpIHtcclxuXHRcdFx0JCgnbGFiZWwudGFnJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICgkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKSkge1xyXG5cdFx0XHRcdCQoXCIjdGFnXCIpLmNsaWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnbGFiZWwudGFnJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCkge1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkgKyAxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhciArIFwiLVwiICsgbW9udGggKyBcIi1cIiArIGRhdGUgKyBcIi1cIiArIGhvdXIgKyBcIi1cIiArIG1pbiArIFwiLVwiICsgc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKSB7XHJcblx0dmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG5cdHZhciBtb250aHMgPSBbJzAxJywgJzAyJywgJzAzJywgJzA0JywgJzA1JywgJzA2JywgJzA3JywgJzA4JywgJzA5JywgJzEwJywgJzExJywgJzEyJ107XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHRpZiAoZGF0ZSA8IDEwKSB7XHJcblx0XHRkYXRlID0gXCIwXCIgKyBkYXRlO1xyXG5cdH1cclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0aWYgKG1pbiA8IDEwKSB7XHJcblx0XHRtaW4gPSBcIjBcIiArIG1pbjtcclxuXHR9XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdGlmIChzZWMgPCAxMCkge1xyXG5cdFx0c2VjID0gXCIwXCIgKyBzZWM7XHJcblx0fVxyXG5cdHZhciB0aW1lID0geWVhciArICctJyArIG1vbnRoICsgJy0nICsgZGF0ZSArIFwiIFwiICsgaG91ciArICc6JyArIG1pbiArICc6JyArIHNlYztcclxuXHRyZXR1cm4gdGltZTtcclxufVxyXG5cclxuZnVuY3Rpb24gb2JqMkFycmF5KG9iaikge1xyXG5cdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG5cdFx0cmV0dXJuIFt2YWx1ZV07XHJcblx0fSk7XHJcblx0cmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcblx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG5cdHZhciBpLCByLCB0O1xyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdGFyeVtpXSA9IGk7XHJcblx0fVxyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuXHRcdHQgPSBhcnlbcl07XHJcblx0XHRhcnlbcl0gPSBhcnlbaV07XHJcblx0XHRhcnlbaV0gPSB0O1xyXG5cdH1cclxuXHRyZXR1cm4gYXJ5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuXHQvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG5cdHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuXHJcblx0dmFyIENTViA9ICcnO1xyXG5cdC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG5cclxuXHQvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcblx0Ly9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuXHRpZiAoU2hvd0xhYmVsKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcblx0XHRmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcblxyXG5cdFx0XHQvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG5cdFx0XHRyb3cgKz0gaW5kZXggKyAnLCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuXHJcblx0XHQvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHQvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciByb3cgPSBcIlwiO1xyXG5cclxuXHRcdC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG5cdFx0XHRyb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuXHJcblx0XHQvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuXHRcdENTViArPSByb3cgKyAnXFxyXFxuJztcclxuXHR9XHJcblxyXG5cdGlmIChDU1YgPT0gJycpIHtcclxuXHRcdGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG5cdHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcblx0Ly90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcblx0ZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLCBcIl9cIik7XHJcblxyXG5cdC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcblx0dmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuXHJcblx0Ly8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcblx0Ly8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuXHQvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuXHQvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG5cclxuXHQvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuXHRsaW5rLmhyZWYgPSB1cmk7XHJcblxyXG5cdC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcblx0bGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuXHRsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuXHJcblx0Ly90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG5cdGxpbmsuY2xpY2soKTtcclxuXHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il0sImZpbGUiOiJtYWluLmpzIn0=
