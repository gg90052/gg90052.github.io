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
      post.find('.message').text(res.message); // if (res.attachments){
      // 	let src = res.attachments.data[0].media.image.src;
      // 	post.find('.img').html(`<img src="${src}" width="360">`);
      // }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiVEFCTEUiLCJhdXRoX3Njb3BlIiwiYWxsX2xlbmd0aCIsIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiY2xpY2siLCJlIiwiY29uc29sZSIsImxvZyIsImN0cmxLZXkiLCJhbHRLZXkiLCJjb25maWciLCJvcmRlciIsImZiIiwiZ2V0QXV0aCIsImxpa2VzIiwiY2hvb3NlIiwiaW5pdCIsImhhc0NsYXNzIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsInNob3dUeXBlIiwidHlwZSIsInZ1ZV9jb21tZW50cyIsInNob3ciLCJleHBvcnRKU09OIiwiZm9yRXhwb3J0IiwiZXhwb3J0VG9Kc29uRmlsZSIsImpzb25EYXRhIiwiZmlsZU5hbWUiLCJQcm9taXNlIiwicmVzb2x2ZSIsImRhdGFTdHIiLCJKU09OIiwic3RyaW5naWZ5IiwiYmxvYiIsIkJsb2IiLCJkYXRhVXJpIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwibGlua0VsZW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwiZmllbGQiLCJwb3N0IiwiY29tbWVudHMiLCJsaW1pdCIsImZpbHRlciIsIndvcmQiLCJyZWFjdCIsInN0YXJ0VGltZSIsImVuZFRpbWUiLCJub3dEYXRlIiwiYXV0aCIsInBhZ2VUb2tlbiIsIkZCIiwibG9naW4iLCJyZXNwb25zZSIsImNhbGxiYWNrIiwiYXV0aF90eXBlIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImZiaWQiLCJWdWUiLCJlbCIsImRhdGEiLCJrZXl3b3JkIiwiaGFzUGhvdG8iLCJyZW1vdmVEdXBsaWNhdGUiLCJ3aW5uZXIiLCJ3aW5uZXJfbGlzdCIsInN0YXJ0X3RpbWUiLCJlbmRfdGltZSIsIm91dHB1dCIsImNvbXB1dGVkIiwiZmlsdGVyX2NvbW1lbnQiLCJmaW5hbF9hcnIiLCJpdGVtIiwibW9tZW50IiwiY3JlYXRlZF90aW1lIiwiYXR0YWNobWVudCIsIm1lc3NhZ2UiLCJpbmRleE9mIiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJmcm9tIiwiaWQiLCJwdXNoIiwicGFyc2UiLCJjb21tZW50X2FyciIsInJlcGx5X2FyciIsImluZGV4IiwiY29tbWVudF9pbmRleCIsInJlcGx5IiwicmVwbHlfaXRlbSIsImoiLCJyZXBseV9pbmRleCIsInJlcGx5cyIsIm1ldGhvZHMiLCJ0b3RhbCIsImxlbmd0aCIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwiaSIsIm1vdW50ZWQiLCJmbGF0cGlja3IiLCJlbmFibGVUaW1lIiwiZGF0ZUZvcm1hdCIsIkNsaXBib2FyZCIsInJhdyIsInVzZXJpZCIsIm5vd0xlbmd0aCIsImV4dGVuc2lvbiIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwidGV4dCIsInN0YXJ0IiwiYXBpIiwidG9TdHJpbmciLCJyZXMiLCJmaW5kIiwiZm9ybWF0IiwiZ2V0IiwidGhlbiIsInNlY29uZFJvdW5kIiwicmVqZWN0IiwiZGF0YXMiLCJwYWdpbmciLCJuZXh0IiwiZ2V0TmV4dCIsInVybCIsInJlcGxhY2UiLCJnZXRKU09OIiwiZCIsImZhaWwiLCJhcnIiLCJwcm9taXNlX2FyciIsImNvbW1lbnQiLCJhbGwiLCJmaW5pc2giLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImZpbHRlcmVkIiwidGFibGUiLCJleGNlbCIsIm5ld09iaiIsImNvbW1hbmQiLCJlYWNoIiwidG1wIiwibmFtZSIsInBvc3RsaW5rIiwic3RvcnkiLCJ0aW1lQ29udmVydGVyIiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInN0ciIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJ2YWwiLCJyZWdleCIsIm5ld3VybCIsInN1YnN0ciIsIm1hdGNoIiwidWkiLCJhZGRMaW5rIiwidGFyIiwicmVzZXQiLCJhIiwiRGF0ZSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJfZCIsIm1vbnRocyIsInRpbWUiLCJvYmoiLCJhcnJheSIsIm1hcCIsInZhbHVlIiwibiIsImFyeSIsIkFycmF5IiwiciIsInQiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiYWxlcnQiLCJ1cmkiLCJlbmNvZGVVUkkiLCJsaW5rIiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsS0FBSjtBQUNBLElBQUlDLFVBQVUsR0FBRyxFQUFqQjtBQUNBLElBQUlDLFVBQVUsR0FBRyxDQUFqQjtBQUVBQyxDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZQyxLQUFaLENBQWtCLFlBQVk7QUFDN0JGLEVBQUFBLENBQUMsQ0FBQyxlQUFELENBQUQsQ0FBbUJHLEtBQW5CLENBQXlCLFVBQVVDLENBQVYsRUFBYTtBQUNyQ0MsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlGLENBQVo7O0FBQ0EsUUFBSUEsQ0FBQyxDQUFDRyxPQUFGLElBQWFILENBQUMsQ0FBQ0ksTUFBbkIsRUFBMkI7QUFDMUJDLE1BQUFBLE1BQU0sQ0FBQ0MsS0FBUCxHQUFlLGVBQWY7QUFDQTs7QUFDREMsSUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsVUFBWDtBQUNBLEdBTkQ7QUFRQVosRUFBQUEsQ0FBQyxDQUFDLFdBQUQsQ0FBRCxDQUFlRyxLQUFmLENBQXFCLFVBQVVDLENBQVYsRUFBYTtB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QVosQ0E3RDZELENBK0Q3RDs7QUFDQUUsRUFBQUEsSUFBSSxDQUFDRSxLQUFMLEdBQWEsbUJBQWI7QUFDQUYsRUFBQUEsSUFBSSxDQUFDRyxRQUFMLEdBQWdCck0sUUFBUSxHQUFHLE1BQTNCLENBakU2RCxDQW1FN0Q7O0FBQ0ExQixFQUFBQSxRQUFRLENBQUNnTyxJQUFULENBQWNDLFdBQWQsQ0FBMEJMLElBQTFCO0FBQ0FBLEVBQUFBLElBQUksQ0FBQzFOLEtBQUw7QUFDQUYsRUFBQUEsUUFBUSxDQUFDZ08sSUFBVCxDQUFjRSxXQUFkLENBQTBCTixJQUExQjtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFRBQkxFO1xyXG52YXIgYXV0aF9zY29wZSA9ICcnO1xyXG52YXIgYWxsX2xlbmd0aCA9IDA7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHRjb25maWcub3JkZXIgPSAnY2hyb25vbG9naWNhbCc7XHJcblx0XHR9XHJcblx0XHRmYi5nZXRBdXRoKCdjb21tZW50cycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9saWtlXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGNvbmZpZy5saWtlcyA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmYi5nZXRBdXRoKCdyZWFjdGlvbnMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0Y2hvb3NlLmluaXQoKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59KTtcclxuZnVuY3Rpb24gc2hvd1R5cGUodHlwZSA9ICdzdGFuZGFyZCcpe1xyXG5cdHZ1ZV9jb21tZW50cy5zaG93KHR5cGUpO1xyXG59XHJcbmZ1bmN0aW9uIGV4cG9ydEpTT04oKXtcclxuXHQvLyBleHBvcnRUb0pzb25GaWxlKHZ1ZV9jb21tZW50cy5jb21tZW50cyk7XHJcblx0dnVlX2NvbW1lbnRzLmZvckV4cG9ydCgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBleHBvcnRUb0pzb25GaWxlKGpzb25EYXRhLCBmaWxlTmFtZSA9ICdkYXRhJykge1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuXHRcdHZhciBkYXRhU3RyID0gSlNPTi5zdHJpbmdpZnkoanNvbkRhdGEpO1xyXG5cdFx0dmFyIGJsb2IgPSBuZXcgQmxvYihbZGF0YVN0cl0sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nIH0pOyBcclxuXHRcdHZhciBkYXRhVXJpID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcclxuXHRcdFxyXG5cdFx0dmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG5cdFx0bGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgZGF0YVVyaSk7XHJcblx0XHRsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgYCR7ZmlsZU5hbWV9Lmpzb25gKTtcclxuXHRcdGxpbmtFbGVtZW50LmNsaWNrKCk7XHJcblx0XHRyZXNvbHZlKCk7XHJcblx0fSk7XHJcbn1cclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdHBvc3Q6IFsnZnJvbScsJ21lc3NhZ2UnLCdhdHRhY2htZW50cycsJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsICdjb21tZW50X2NvdW50JywgJ21lc3NhZ2UnLCAnZnJvbScsICdjcmVhdGVkX3RpbWUnLCdhdHRhY2htZW50J10sXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdHN0YXJ0VGltZTogJzIwMDAtMTItMzEtMDAtMDAtMDAnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRvcmRlcjogJ2Nocm9ub2xvZ2ljYWwnLFxyXG5cdGF1dGg6ICdncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJyxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0Z2V0QXV0aDogKHR5cGUgPSAnJykgPT4ge1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdH0sIHtcclxuXHRcdFx0YXV0aF90eXBlOiAncmVyZXF1ZXN0JyAsXHJcblx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKSA9PiB7XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRhdXRoX3Njb3BlID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcbn1cclxuXHJcbmNvbnN0IHZ1ZV9jb21tZW50cyA9IG5ldyBWdWUoe1xyXG5cdGVsOiAnI3Z1ZV9jb21tZW50cycsXHJcblx0ZGF0YToge1xyXG5cdFx0Y29tbWVudHM6IFtdLFxyXG5cdFx0a2V5d29yZDogJycsXHJcblx0XHRoYXNQaG90bzogZmFsc2UsXHJcblx0XHRyZW1vdmVEdXBsaWNhdGU6IGZhbHNlLFxyXG5cdFx0d2lubmVyOiAnJyxcclxuXHRcdHdpbm5lcl9saXN0OiBbXSxcclxuXHRcdHN0YXJ0X3RpbWU6ICcnLFxyXG5cdFx0ZW5kX3RpbWU6ICcnLFxyXG5cdFx0c2hvd1R5cGU6ICdzdGFuZGFyZCcsXHJcblx0XHRvdXRwdXQ6IHt9LFxyXG5cdH0sXHJcblx0Y29tcHV0ZWQ6IHtcclxuXHRcdGZpbHRlcl9jb21tZW50KCl7XHJcblx0XHRcdGxldCBmaW5hbF9hcnIgPSB0aGlzLmNvbW1lbnRzO1xyXG5cdFx0XHRpZiAodGhpcy5zdGFydF90aW1lICE9PSAnJyl7XHJcblx0XHRcdFx0ZmluYWxfYXJyID0gZmluYWxfYXJyLmZpbHRlcihpdGVtPT57XHJcblx0XHRcdFx0XHRyZXR1cm4gbW9tZW50KGl0ZW0uY3JlYXRlZF90aW1lKSA+IG1vbWVudCh0aGlzLnN0YXJ0X3RpbWUpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMuZW5kX3RpbWUgIT09ICcnKXtcclxuXHRcdFx0XHRmaW5hbF9hcnIgPSBmaW5hbF9hcnIuZmlsdGVyKGl0ZW09PntcclxuXHRcdFx0XHRcdHJldHVybiBtb21lbnQoaXRlbS5jcmVhdGVkX3RpbWUpIDwgbW9tZW50KHRoaXMuZW5kX3RpbWUpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMuaGFzUGhvdG8pe1xyXG5cdFx0XHRcdGZpbmFsX2FyciA9IGZpbmFsX2Fyci5maWx0ZXIoaXRlbT0+e1xyXG5cdFx0XHRcdFx0cmV0dXJuIGl0ZW0uYXR0YWNobWVudCAmJiBpdGVtLmF0dGFjaG1lbnQudHlwZSA9PSAncGhvdG8nO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMua2V5d29yZCAhPT0gJycpe1xyXG5cdFx0XHRcdGZpbmFsX2FyciA9IGZpbmFsX2Fyci5maWx0ZXIoaXRlbT0+e1xyXG5cdFx0XHRcdFx0cmV0dXJuIGl0ZW0ubWVzc2FnZS5pbmRleE9mKHRoaXMua2V5d29yZCkgPj0gMDtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLnJlbW92ZUR1cGxpY2F0ZSl7XHJcblx0XHRcdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0XHRcdGxldCBrZXlzID0gW107XHJcblx0XHRcdFx0ZmluYWxfYXJyLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdFx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdFx0XHRpZiAoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRmaW5hbF9hcnIgPSBvdXRwdXQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBvdXRwdXQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGZpbmFsX2FycikpO1xyXG5cdFx0XHRsZXQgY29tbWVudF9hcnIgPSBbXTtcclxuXHRcdFx0bGV0IHJlcGx5X2FyciA9IFtdO1xyXG5cdFx0XHRvdXRwdXQuZm9yRWFjaCgoaXRlbSxpbmRleCk9PntcclxuXHRcdFx0XHRpdGVtLmNvbW1lbnRfaW5kZXggPSBpbmRleDtcclxuXHRcdFx0XHRpdGVtLnJlcGx5LmZvckVhY2goKHJlcGx5X2l0ZW0sIGopPT57XHJcblx0XHRcdFx0XHRyZXBseV9pdGVtLmNvbW1lbnRfaW5kZXggPSBpbmRleDtcclxuXHRcdFx0XHRcdHJlcGx5X2l0ZW0ucmVwbHlfaW5kZXggPSBqO1xyXG5cdFx0XHRcdFx0cmVwbHlfYXJyLnB1c2gocmVwbHlfaXRlbSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHRkZWxldGUgaXRlbVsncmVwbHknXTtcclxuXHRcdFx0XHRjb21tZW50X2Fyci5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5vdXRwdXQuY29tbWVudHMgPSBjb21tZW50X2FycjtcclxuXHRcdFx0dGhpcy5vdXRwdXQucmVwbHlzID0gcmVwbHlfYXJyO1xyXG5cclxuXHRcdFx0cmV0dXJuIGZpbmFsX2FycjtcclxuXHRcdH1cclxuXHR9LFxyXG5cdG1ldGhvZHM6IHtcclxuXHRcdGNob29zZSgpe1xyXG5cdFx0XHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHRcdGxldCB0b3RhbCA9IHRoaXMuZmlsdGVyX2NvbW1lbnQubGVuZ3RoO1xyXG5cdFx0XHRsZXQgd2lubmVyX2xpc3QgPSBnZW5SYW5kb21BcnJheSh0b3RhbCkuc3BsaWNlKDAsIHRoaXMud2lubmVyKTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIHdpbm5lcl9saXN0KXtcclxuXHRcdFx0XHR0aGlzLndpbm5lcl9saXN0LnB1c2godGhpcy5maWx0ZXJfY29tbWVudFtpXSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRmb3JFeHBvcnQoKXtcclxuXHRcdFx0bGV0IG91dHB1dCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5jb21tZW50cykpO1xyXG5cdFx0XHRsZXQgY29tbWVudF9hcnIgPSBbXTtcclxuXHRcdFx0bGV0IHJlcGx5X2FyciA9IFtdO1xyXG5cdFx0XHRvdXRwdXQuZm9yRWFjaCgoaXRlbSxpbmRleCk9PntcclxuXHRcdFx0XHRpdGVtLmNvbW1lbnRfaW5kZXggPSBpbmRleDtcclxuXHRcdFx0XHRpdGVtLnJlcGx5LmZvckVhY2goKHJlcGx5X2l0ZW0sIGopPT57XHJcblx0XHRcdFx0XHRyZXBseV9pdGVtLmNvbW1lbnRfaW5kZXggPSBpbmRleDtcclxuXHRcdFx0XHRcdHJlcGx5X2l0ZW0ucmVwbHlfaW5kZXggPSBqO1xyXG5cdFx0XHRcdFx0cmVwbHlfYXJyLnB1c2gocmVwbHlfaXRlbSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHRkZWxldGUgaXRlbVsncmVwbHknXTtcclxuXHRcdFx0XHRjb21tZW50X2Fyci5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZXhwb3J0VG9Kc29uRmlsZShjb21tZW50X2FyciwgJ2NvbW1lbnRzJyk7XHJcblx0XHRcdGV4cG9ydFRvSnNvbkZpbGUocmVwbHlfYXJyLCAncmVwbHlzJyk7XHJcblx0XHR9LFxyXG5cdFx0c2hvdyh0eXBlKXtcclxuXHRcdFx0dGhpcy5zaG93VHlwZSA9IHR5cGU7XHJcblx0XHR9XHJcblx0fSxcclxuXHRtb3VudGVkKCkge1xyXG5cdFx0ZmxhdHBpY2tyKFwiLnRpbWVwaWNrZXJcIiwge1xyXG5cdFx0XHRlbmFibGVUaW1lOiB0cnVlLFxyXG5cdFx0XHRkYXRlRm9ybWF0OiBcIlktbS1kIEg6aVwiLFxyXG5cdFx0fSk7XHJcblx0XHRuZXcgQ2xpcGJvYXJkKCcuY29weV9idG4nKTtcclxuXHR9LFxyXG59KTtcclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHJhdzogW10sXHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRpbml0OiAoKSA9PiB7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluizh+aWmeS4rS4uLicpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKSA9PiB7XHJcblx0XHQkKFwiI2xvYWRpbmdcIikuYWRkQ2xhc3MoXCJzaG93XCIpO1xyXG5cdFx0RkIuYXBpKGAvJHtmYmlkfS8/ZmllbGRzPSR7Y29uZmlnLmZpZWxkWydwb3N0J10udG9TdHJpbmcoKX0mZGVidWc9YWxsYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRsZXQgcG9zdCA9ICQoJy5wb3N0Jyk7XHJcblx0XHRcdC8vIHBvc3QuZmluZCgnLmZyb20nKS50ZXh0KHJlcy5mcm9tLm5hbWUpO1xyXG5cdFx0XHRwb3N0LmZpbmQoJy50aW1lJykudGV4dChtb21lbnQocmVzLmNyZWF0ZWRfdGltZSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJykpO1xyXG5cdFx0XHRwb3N0LmZpbmQoJy5tZXNzYWdlJykudGV4dChyZXMubWVzc2FnZSk7XHJcblx0XHRcdC8vIGlmIChyZXMuYXR0YWNobWVudHMpe1xyXG5cdFx0XHQvLyBcdGxldCBzcmMgPSByZXMuYXR0YWNobWVudHMuZGF0YVswXS5tZWRpYS5pbWFnZS5zcmM7XHJcblx0XHRcdC8vIFx0cG9zdC5maW5kKCcuaW1nJykuaHRtbChgPGltZyBzcmM9XCIke3NyY31cIiB3aWR0aD1cIjM2MFwiPmApO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9KTtcclxuXHRcdGRhdGEuZ2V0KGZiaWQpLnRoZW4oKHJlcykgPT4ge1xyXG5cdFx0XHQvLyBmYmlkLmRhdGEgPSByZXM7XHJcblx0XHRcdGRhdGEuc2Vjb25kUm91bmQocmVzKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKGAvJHtmYmlkfS9jb21tZW50cz9saW1pdD0ke2NvbmZpZy5saW1pdFsnY29tbWVudHMnXX0mb3JkZXI9JHtjb25maWcub3JkZXJ9JmZpZWxkcz0ke2NvbmZpZy5maWVsZFsnY29tbWVudHMnXS50b1N0cmluZygpfSZkZWJ1Zz1hbGxgKTtcclxuXHJcblx0XHRcdEZCLmFwaShgLyR7ZmJpZH0vY29tbWVudHM/bGltaXQ9JHtjb25maWcubGltaXRbJ2NvbW1lbnRzJ119Jm9yZGVyPSR7Y29uZmlnLm9yZGVyfSZmaWVsZHM9JHtjb25maWcuZmllbGRbJ2NvbW1lbnRzJ10udG9TdHJpbmcoKX0mZGVidWc9YWxsYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdGFsbF9sZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdCQoXCIjbG9hZGluZyAubWVzc2FnZSBzcGFuXCIpLnRleHQoYWxsX2xlbmd0aCk7XHJcblx0XHRcdFx0ZGF0YXMgPSByZXMuZGF0YTtcclxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpIHtcclxuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdCA9IDApIHtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApIHtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCAnbGltaXQ9JyArIGxpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0YWxsX2xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiI2xvYWRpbmcgLm1lc3NhZ2Ugc3BhblwiKS50ZXh0KGFsbF9sZW5ndGgpO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KSB7XHJcblx0XHRcdFx0XHQvLyBpZiAoZGF0YS5ub3dMZW5ndGggPCAxODApIHtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKSA9PiB7XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRzZWNvbmRSb3VuZDogKGFycik9PntcclxuXHRcdGxldCBwcm9taXNlX2FyciA9IFtdO1xyXG5cdFx0Zm9yKGxldCBjb21tZW50IG9mIGFycil7XHJcblx0XHRcdHByb21pc2VfYXJyLnB1c2goZGF0YS5nZXQoY29tbWVudC5pZCkpO1xyXG5cdFx0fVxyXG5cdFx0UHJvbWlzZS5hbGwocHJvbWlzZV9hcnIpLnRoZW4ocmVzPT57XHJcblx0XHRcdGZvcihsZXQgaT0wOyBpPHJlcy5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0YXJyW2ldLnJlcGx5ID0gcmVzW2ldO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRhdGEuZmluaXNoKGFycik7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGRhdGFzKSA9PiB7XHJcblx0XHQkKFwiI2xvYWRpbmdcIikucmVtb3ZlQ2xhc3MoXCJzaG93XCIpO1xyXG5cdFx0Ly8gYWxlcnQoJ+WujOaIkCcpO1xyXG5cdFx0Y29uc29sZS5sb2coZGF0YXMpO1xyXG5cdFx0dnVlX2NvbW1lbnRzLmNvbW1lbnRzID0gZGF0YXM7XHJcblx0XHQvLyBkYXRhLnJhdyA9IGZiaWQ7XHJcblx0XHQvLyBkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0XHQvLyB1aS5yZXNldCgpO1xyXG5cdH0sXHJcblx0ZmlsdGVyOiAocmF3RGF0YSwgZ2VuZXJhdGUgPSBmYWxzZSkgPT4ge1xyXG5cdFx0bGV0IGlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRsZXQgaXNUYWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdC8vIGlmIChjb25maWcuZnJvbV9leHRlbnNpb24gPT09IGZhbHNlICYmIHJhd0RhdGEuY29tbWFuZCA9PT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0Ly8gXHRyYXdEYXRhLmRhdGEgPSByYXdEYXRhLmRhdGEuZmlsdGVyKGl0ZW0gPT4ge1xyXG5cdFx0Ly8gXHRcdHJldHVybiBpdGVtLmlzX2hpZGRlbiA9PT0gZmFsc2VcclxuXHRcdC8vIFx0fSk7XHJcblx0XHQvLyB9XHJcblx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHJcblx0XHRyYXdEYXRhLmZpbHRlcmVkID0gbmV3RGF0YTtcclxuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShyYXdEYXRhKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiByYXdEYXRhO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXhjZWw6IChyYXcpID0+IHtcclxuXHRcdHZhciBuZXdPYmogPSBbXTtcclxuXHRcdGNvbnNvbGUubG9nKHJhdyk7XHJcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pIHtcclxuXHRcdFx0aWYgKHJhdy5jb21tYW5kID09ICdjb21tZW50cycpIHtcclxuXHRcdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA6YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMubWVzc2FnZSxcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JC5lYWNoKHJhdy5maWx0ZXJlZCwgZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkgKyAxLFxyXG5cdFx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiOiB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiOiB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JC5lYWNoKHJhdy5maWx0ZXJlZCwgZnVuY3Rpb24gKGkpIHtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi6KGo5oOFXCI6IHRoaXMudHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIjogdGltZUNvbnZlcnRlcih0aGlzLmNyZWF0ZWRfdGltZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbmV3T2JqO1xyXG5cdH0sXHJcblx0aW1wb3J0OiAoZmlsZSkgPT4ge1xyXG5cdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRsZXQgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuXHRcdFx0ZGF0YS5yYXcgPSBKU09OLnBhcnNlKHN0cik7XHJcblx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBmYmlkID0ge1xyXG5cdGZiaWQ6IFtdLFxyXG5cdGluaXQ6ICgpID0+IHtcclxuXHRcdGNvbmZpZy5wYWdlVG9rZW4gPSAnJztcclxuXHRcdGZiaWQuZmJpZCA9IFtdO1xyXG5cdFx0Ly8gZGF0YS5pbml0KCk7XHJcblx0XHRsZXQgdXJsID0gJCgnI3VybCcpLnZhbCgpO1xyXG5cdFx0ZmJpZC5nZXQodXJsKS50aGVuKChmYmlkKSA9PiB7XHJcblx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Z2V0OiAodXJsKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRsZXQgbmV3dXJsID0gdXJsLnN1YnN0cih1cmwuaW5kZXhPZignLycsIDI4KSArIDEsIDIwMCk7XHJcblx0XHRcdC8vIGh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8g5YWxMjXlrZflhYPvvIzlm6DmraTpgbgyOOmWi+Wni+aJvi9cclxuXHRcdFx0bGV0IHJlc3VsdCA9IG5ld3VybC5tYXRjaChyZWdleCk7XHJcblx0XHRcdHJlc29sdmUocmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG59XHJcblxyXG5sZXQgdWkgPSB7XHJcblx0aW5pdDogKCkgPT4ge1xyXG5cclxuXHR9LFxyXG5cdGFkZExpbms6ICgpID0+IHtcclxuXHRcdGxldCB0YXIgPSAkKCcuaW5wdXRhcmVhIC5tb3JlbGluaycpO1xyXG5cdFx0aWYgKHRhci5oYXNDbGFzcygnc2hvdycpKSB7XHJcblx0XHRcdHRhci5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGFyLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZXNldDogKCkgPT4ge1xyXG5cdFx0bGV0IGNvbW1hbmQgPSBkYXRhLnJhdy5jb21tYW5kO1xyXG5cdFx0aWYgKChjb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGNvbW1hbmQgPT0gJ2xpa2VzJykgfHwgY29uZmlnLmxpa2VzKSB7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHRcdGlmIChjb21tYW5kID09PSAnY29tbWVudHMnKSB7XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIikpIHtcclxuXHRcdFx0XHQkKFwiI3RhZ1wiKS5jbGljaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpIHtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpICsgMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyBkYXRlICsgXCItXCIgKyBob3VyICsgXCItXCIgKyBtaW4gKyBcIi1cIiArIHNlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCkge1xyXG5cdHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuXHR2YXIgbW9udGhzID0gWycwMScsICcwMicsICcwMycsICcwNCcsICcwNScsICcwNicsICcwNycsICcwOCcsICcwOScsICcxMCcsICcxMScsICcxMiddO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0aWYgKGRhdGUgPCAxMCkge1xyXG5cdFx0ZGF0ZSA9IFwiMFwiICsgZGF0ZTtcclxuXHR9XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdGlmIChtaW4gPCAxMCkge1xyXG5cdFx0bWluID0gXCIwXCIgKyBtaW47XHJcblx0fVxyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRpZiAoc2VjIDwgMTApIHtcclxuXHRcdHNlYyA9IFwiMFwiICsgc2VjO1xyXG5cdH1cclxuXHR2YXIgdGltZSA9IHllYXIgKyAnLScgKyBtb250aCArICctJyArIGRhdGUgKyBcIiBcIiArIGhvdXIgKyAnOicgKyBtaW4gKyAnOicgKyBzZWM7XHJcblx0cmV0dXJuIHRpbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9iajJBcnJheShvYmopIHtcclxuXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcclxuXHRcdHJldHVybiBbdmFsdWVdO1xyXG5cdH0pO1xyXG5cdHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG5cdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuXHR2YXIgaSwgciwgdDtcclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRhcnlbaV0gPSBpO1xyXG5cdH1cclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcblx0XHR0ID0gYXJ5W3JdO1xyXG5cdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG5cdFx0YXJ5W2ldID0gdDtcclxuXHR9XHJcblx0cmV0dXJuIGFyeTtcclxufVxyXG5cclxuZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcblx0Ly9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuXHR2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcblxyXG5cdHZhciBDU1YgPSAnJztcclxuXHQvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuXHJcblx0Ly8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG5cdC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcblx0aWYgKFNob3dMYWJlbCkge1xyXG5cdFx0dmFyIHJvdyA9IFwiXCI7XHJcblxyXG5cdFx0Ly9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG5cclxuXHRcdFx0Ly9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuXHRcdFx0cm93ICs9IGluZGV4ICsgJywnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcblxyXG5cdFx0Ly9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG5cdFx0Q1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG5cdH1cclxuXHJcblx0Ly8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuXHRcdGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuXHRcdFx0cm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcblxyXG5cdFx0Ly9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHRpZiAoQ1NWID09ICcnKSB7XHJcblx0XHRhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuXHR2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG5cdC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG5cdGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZywgXCJfXCIpO1xyXG5cclxuXHQvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG5cdHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcblxyXG5cdC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG5cdC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcblx0Ly8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcblx0Ly8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuXHJcblx0Ly90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcblx0bGluay5ocmVmID0gdXJpO1xyXG5cclxuXHQvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG5cdGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcblx0bGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcblxyXG5cdC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuXHRsaW5rLmNsaWNrKCk7XHJcblx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdLCJmaWxlIjoibWFpbi5qcyJ9
