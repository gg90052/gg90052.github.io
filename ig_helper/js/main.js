"use strict";

var config = {
  auth: 'instagram_basic, manage_pages, instagram_manage_comments, user_age_range',
  auth_scope: '',
  pageToken: ''
};
var fb = {
  getAuth: function getAuth() {
    FB.login(function (response) {
      fb.callback(response);
    }, {
      auth_type: 'rerequest',
      scope: config.auth,
      return_scopes: true
    });
  },
  callback: function callback(response, type) {
    if (response.status === 'connected') {
      config.auth_scope = response.authResponse.grantedScopes;
      console.log(response);

      if (response.authResponse.grantedScopes.includes('user_age_range')) {
        console.log(response.authResponse.grantedScopes.includes('user_age_range'));
        vue_comments.auth_user = true;
      }

      $('#login').remove();
      vue_steps.getPages();
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
var vue_popup = new Vue({
  el: '#popup',
  data: {
    target: false,
    all_length: 0
  },
  methods: {
    show: function show(target) {
      this.target = target;
    },
    close: function close() {
      this.target = false;
    }
  }
});
var vue_steps = new Vue({
  el: '#vue_steps',
  data: {
    step: -1,
    pages: [],
    posts: []
  },
  watch: {
    step: function step(val, oldval) {
      if (val == 2) {
        setTimeout(function () {
          flatpickr(".start_time", {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            time_24hr: true,
            onChange: function onChange(selectedDates, dateStr, instance) {
              vue_comments.start_time = selectedDates[0];
            }
          });
          flatpickr(".end_time", {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            time_24hr: true,
            onChange: function onChange(selectedDates, dateStr, instance) {
              vue_comments.end_time = selectedDates[0];
            }
          });
        }, 300);
      } else if (oldval == 2) {
        document.querySelector(".start_time")._flatpickr.destroy();

        document.querySelector(".end_time")._flatpickr.destroy();
      }
    }
  },
  methods: {
    getPages: function getPages() {
      var _this = this;

      FB.api("/me/accounts?limit=50", function (res) {
        _this.step = 0;
        _this.pages = res.data;
      });
    },
    getPosts: function getPosts(pageid) {
      var _this2 = this;

      getIGid(pageid).then(function (IGid) {
        FB.api("/".concat(IGid, "?fields=username"), function (res) {
          _this2.username = res.username;
        });
        FB.api("/".concat(IGid, "/media?fields=like_count,comments_count,permalink,media_type,caption,media_url,comments{username,text,timestamp},timestamp&limit=100"), function (res) {
          // localStorage.ig_posts = JSON.stringify(res.data);
          _this2.choosePost(res.data);
        });
      });

      function getIGid(pageid) {
        return new Promise(function (resolve, reject) {
          FB.api("/".concat(pageid, "/?fields=instagram_business_account"), function (res) {
            if (res.instagram_business_account) {
              resolve(res.instagram_business_account.id);
            } else {
              alert('此粉絲專頁無連結 Instagram 帳號');
            }
          });
        });
      }
    },
    getPostDetail: function getPostDetail(post) {
      var _this3 = this;

      vue_comments.comments = [];
      vue_popup.all_length = 0;
      vue_popup.show('fetching');
      var mediaid = post.id;
      vue_comments.post = post;
      this.getData(mediaid).then(function (res) {
        // console.log(res);
        var arr = res.map(function (item) {
          if (item.replies) {
            return item;
          } else {
            item.replies = {};
            item.replies.data = [];
            return item;
          }
        }); // localStorage.ig_post = JSON.stringify(arr);

        vue_popup.close();

        _this3.showComments(arr);
      });
    },
    getData: function getData(mediaid) {
      return new Promise(function (resolve) {
        var comments_arr = [];
        FB.api("/".concat(mediaid, "/comments?fields=id,text,media,timestamp,user,username,replies.limit(50){text,timestamp,username}&limit=3"), function (res) {
          vue_popup.all_length += res.data.length;
          res.data.forEach(function (item) {
            comments_arr.push(item);
          });

          if (res.paging) {
            getNext(res.paging.next);
          } else {
            resolve(comments_arr);
          }
        });

        function getNext(url) {
          $.getJSON(url, function (res) {
            vue_popup.all_length += res.data.length;
            res.data.forEach(function (item) {
              comments_arr.push(item);
            });

            if (res.paging) {
              getNext(res.paging.next);
            } else {
              resolve(comments_arr);
            }
          });
        }
      });
    },
    choosePost: function choosePost(data) {
      this.posts = data;
      this.step = 1;
    },
    showComments: function showComments(data) {
      this.step = 2;
      vue_comments.show = true;
      vue_comments.comments = data;
      vue_comments.init();
    }
  }
});
var vue_comments = new Vue({
  el: '#vue_comments',
  data: {
    show: false,
    post: {},
    extend_caption: false,
    comments: [],
    keyword: '',
    removeDuplicate: false,
    desc: false,
    winner: '',
    winner_list: [],
    start_time: '',
    end_time: '',
    showType: 'standard',
    output: {},
    reply_input: '',
    comment_input: '',
    show_reply: [],
    auth_user: false
  },
  computed: {
    filter_comment: function filter_comment() {
      var _this4 = this;

      var final_arr = this.comments;

      if (this.start_time !== '') {
        final_arr = final_arr.filter(function (item) {
          return moment(item.timestamp) > moment(_this4.start_time);
        });
      }

      if (this.end_time !== '') {
        final_arr = final_arr.filter(function (item) {
          return moment(item.timestamp) < moment(_this4.end_time);
        });
      }

      if (this.keyword !== '') {
        final_arr = final_arr.filter(function (item) {
          return item.text.indexOf(_this4.keyword) >= 0;
        });
      }

      if (this.removeDuplicate) {
        var output = [];
        var keys = [];
        final_arr.forEach(function (item) {
          var key = item.user.id;

          if (keys.indexOf(key) === -1) {
            keys.push(key);
            output.push(item);
          }
        });
        final_arr = output;
      }

      if (this.desc) {
        final_arr.sort(function (a, b) {
          return moment(b.timestamp) - moment(a.timestamp);
        });
        final_arr.forEach(function (item) {
          item.replies.data.sort(function (a, b) {
            return moment(b.timestamp) - moment(a.timestamp);
          });
        });
      } else {
        final_arr.sort(function (a, b) {
          return moment(a.timestamp) - moment(b.timestamp);
        });
        final_arr.forEach(function (item) {
          item.replies.data.sort(function (a, b) {
            return moment(a.timestamp) - moment(b.timestamp);
          });
        });
      }

      $('.replies[cid]').removeClass('show'); // let output = JSON.parse(JSON.stringify(final_arr));
      // let comment_arr = [];
      // let reply_arr = [];
      // output.forEach((item,index)=>{
      // 	item.comment_index = index;
      // 	item.reply.forEach((reply_item, j)=>{
      // 		reply_item.comment_index = index;
      // 		reply_item.reply_index = j;
      // 		reply_arr.push(reply_item);
      // 	})
      // 	delete item['reply'];
      // 	comment_arr.push(item);
      // });
      // this.output.comments = comment_arr;
      // this.output.replys = reply_arr;

      return final_arr;
    }
  },
  watch: {
    // keyword(){
    // 	this.winner_list = [];
    // },
    removeDuplicate: function removeDuplicate() {
      this.winner_list = [];
    },
    // start_time(){
    // 	this.winner_list = [];
    // },
    // end_time(){
    // 	this.winner_list = [];
    // },
    winner: function winner() {
      this.winner_list = [];
    }
  },
  methods: {
    init: function init() {
      this.start_time = '';
      this.end_time = '';
      this.winner_list = [];
    },
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
    show: function show(type) {
      this.showType = type;
    },
    reply: function reply(comment_id) {
      var pos = this.show_reply.indexOf(comment_id);

      if (pos < 0) {
        this.show_reply.push(comment_id);
      } else {
        this.show_reply.splice(pos, 1);
      }
    },
    getReply: function getReply(comment_id) {
      return new Promise(function (resolve) {
        var comments_arr = [];
        FB.api("/".concat(comment_id, "/replies?fields=username,timestamp,text&limit=3"), function (res) {
          res.data.forEach(function (item) {
            comments_arr.push(item);
          });

          if (res.paging) {
            getNext(res.paging.next);
          } else {
            resolve(comments_arr);
          }
        });

        function getNext(url) {
          $.getJSON(url, function (res) {
            res.data.forEach(function (item) {
              comments_arr.push(item);
            });

            if (res.paging) {
              getNext(res.paging.next);
            } else {
              resolve(comments_arr);
            }
          });
        }
      });
    },
    sendReply: function sendReply(comment_id) {
      var _this5 = this;

      var tar = $("input[cid=".concat(comment_id, "]"));
      vue_popup.show('loading');
      FB.api("/".concat(comment_id, "/replies"), 'POST', {
        "message": tar.val()
      }, function (res) {
        vue_popup.close();

        if (res.id) {
          alert('新增回覆成功!');

          _this5.addReply(comment_id, tar.val());

          tar.val('');
        } else {
          alert('發生錯誤，請稍後再試');
        }
      });
    },
    addReply: function addReply(comment_id, text) {
      this.comments.forEach(function (item) {
        if (item.id == comment_id) {
          var reply_obj = {
            username: vue_steps.username,
            text: text,
            timestamp: moment()
          };
          item.replies.data.push(reply_obj);
        }
      });
    },
    sendComment: function sendComment(media_id) {
      var _this6 = this;

      vue_popup.show('loading');
      FB.api("/".concat(media_id, "/comments"), 'POST', {
        "message": this.comment_input
      }, function (res) {
        vue_popup.close();

        if (res.id) {
          alert('新增留言成功!');

          _this6.addComment(media_id, _this6.comment_input);

          _this6.comment_input = '';
        } else {
          alert('發生錯誤，請稍後再試');
        }
      });
    },
    addComment: function addComment(media_id, text) {
      var comment_obj = {
        id: media_id,
        username: vue_steps.username,
        text: text,
        timestamp: moment(),
        replies: {
          data: []
        }
      };
      this.comments.push(comment_obj);
    },
    backStep: function backStep() {
      this.show = false;
      this.comments = [];
      vue_steps.step = 1;
    },
    reload: function reload(post) {
      this.winner_list = [];
      vue_steps.getPostDetail(post);
    }
  },
  mounted: function mounted() {}
});

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiY29uZmlnIiwiYXV0aCIsImF1dGhfc2NvcGUiLCJwYWdlVG9rZW4iLCJmYiIsImdldEF1dGgiLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsImF1dGhfdHlwZSIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInR5cGUiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwiY29uc29sZSIsImxvZyIsImluY2x1ZGVzIiwidnVlX2NvbW1lbnRzIiwiYXV0aF91c2VyIiwiJCIsInJlbW92ZSIsInZ1ZV9zdGVwcyIsImdldFBhZ2VzIiwidnVlX3BvcHVwIiwiVnVlIiwiZWwiLCJkYXRhIiwidGFyZ2V0IiwiYWxsX2xlbmd0aCIsIm1ldGhvZHMiLCJzaG93IiwiY2xvc2UiLCJzdGVwIiwicGFnZXMiLCJwb3N0cyIsIndhdGNoIiwidmFsIiwib2xkdmFsIiwic2V0VGltZW91dCIsImZsYXRwaWNrciIsImVuYWJsZVRpbWUiLCJkYXRlRm9ybWF0IiwidGltZV8yNGhyIiwib25DaGFuZ2UiLCJzZWxlY3RlZERhdGVzIiwiZGF0ZVN0ciIsImluc3RhbmNlIiwic3RhcnRfdGltZSIsImVuZF90aW1lIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiX2ZsYXRwaWNrciIsImRlc3Ryb3kiLCJhcGkiLCJyZXMiLCJnZXRQb3N0cyIsInBhZ2VpZCIsImdldElHaWQiLCJ0aGVuIiwiSUdpZCIsInVzZXJuYW1lIiwiY2hvb3NlUG9zdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiaW5zdGFncmFtX2J1c2luZXNzX2FjY291bnQiLCJpZCIsImFsZXJ0IiwiZ2V0UG9zdERldGFpbCIsInBvc3QiLCJjb21tZW50cyIsIm1lZGlhaWQiLCJnZXREYXRhIiwiYXJyIiwibWFwIiwiaXRlbSIsInJlcGxpZXMiLCJzaG93Q29tbWVudHMiLCJjb21tZW50c19hcnIiLCJsZW5ndGgiLCJmb3JFYWNoIiwicHVzaCIsInBhZ2luZyIsImdldE5leHQiLCJuZXh0IiwidXJsIiwiZ2V0SlNPTiIsImluaXQiLCJleHRlbmRfY2FwdGlvbiIsImtleXdvcmQiLCJyZW1vdmVEdXBsaWNhdGUiLCJkZXNjIiwid2lubmVyIiwid2lubmVyX2xpc3QiLCJzaG93VHlwZSIsIm91dHB1dCIsInJlcGx5X2lucHV0IiwiY29tbWVudF9pbnB1dCIsInNob3dfcmVwbHkiLCJjb21wdXRlZCIsImZpbHRlcl9jb21tZW50IiwiZmluYWxfYXJyIiwiZmlsdGVyIiwibW9tZW50IiwidGltZXN0YW1wIiwidGV4dCIsImluZGV4T2YiLCJrZXlzIiwia2V5IiwidXNlciIsInNvcnQiLCJhIiwiYiIsInJlbW92ZUNsYXNzIiwiY2hvb3NlIiwidG90YWwiLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsImkiLCJyZXBseSIsImNvbW1lbnRfaWQiLCJwb3MiLCJnZXRSZXBseSIsInNlbmRSZXBseSIsInRhciIsImFkZFJlcGx5IiwicmVwbHlfb2JqIiwic2VuZENvbW1lbnQiLCJtZWRpYV9pZCIsImFkZENvbW1lbnQiLCJjb21tZW50X29iaiIsImJhY2tTdGVwIiwicmVsb2FkIiwibW91bnRlZCIsIm9iajJBcnJheSIsIm9iaiIsImFycmF5IiwidmFsdWUiLCJpbmRleCIsIm4iLCJhcnkiLCJBcnJheSIsInIiLCJ0IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLE1BQU0sR0FBRztBQUNaQyxFQUFBQSxJQUFJLEVBQUUsMEVBRE07QUFFWkMsRUFBQUEsVUFBVSxFQUFFLEVBRkE7QUFHWkMsRUFBQUEsU0FBUyxFQUFFO0FBSEMsQ0FBYjtBQU1BLElBQUlDLEVBQUUsR0FBRztBQUNSQyxFQUFBQSxPQUFPLEVBQUUsbUJBQU07QUFDZEMsSUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVMsVUFBVUMsUUFBVixFQUFvQjtBQUM1QkosTUFBQUEsRUFBRSxDQUFDSyxRQUFILENBQVlELFFBQVo7QUFDQSxLQUZE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b25maWcgPSB7XHJcblx0YXV0aDogJ2luc3RhZ3JhbV9iYXNpYywgbWFuYWdlX3BhZ2VzLCBpbnN0YWdyYW1fbWFuYWdlX2NvbW1lbnRzLCB1c2VyX2FnZV9yYW5nZScsXHJcblx0YXV0aF9zY29wZTogJycsXHJcblx0cGFnZVRva2VuOiAnJyxcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdGdldEF1dGg6ICgpID0+IHtcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdGF1dGhfdHlwZTogJ3JlcmVxdWVzdCcgLFxyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSkgPT4ge1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLmF1dGhfc2NvcGUgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpXHJcblx0XHRcdGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmNsdWRlcygndXNlcl9hZ2VfcmFuZ2UnKSl7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5jbHVkZXMoJ3VzZXJfYWdlX3JhbmdlJykpO1xyXG5cdFx0XHRcdHZ1ZV9jb21tZW50cy5hdXRoX3VzZXIgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJyNsb2dpbicpLnJlbW92ZSgpO1xyXG5cdFx0XHR2dWVfc3RlcHMuZ2V0UGFnZXMoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcbn1cclxuY29uc3QgdnVlX3BvcHVwID0gbmV3IFZ1ZSh7XHJcblx0ZWw6ICcjcG9wdXAnLFxyXG5cdGRhdGE6IHtcclxuXHRcdHRhcmdldDogZmFsc2UsXHJcblx0XHRhbGxfbGVuZ3RoOiAwLFxyXG5cdH0sXHJcblx0bWV0aG9kczoge1xyXG5cdFx0c2hvdyh0YXJnZXQpe1xyXG5cdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdH0sXHJcblx0XHRjbG9zZSgpe1xyXG5cdFx0XHR0aGlzLnRhcmdldCA9IGZhbHNlO1xyXG5cdFx0fSxcclxuXHRcdFxyXG5cdH1cclxufSk7XHJcblxyXG5jb25zdCB2dWVfc3RlcHMgPSBuZXcgVnVlKHtcclxuXHRlbDogJyN2dWVfc3RlcHMnLFxyXG5cdGRhdGE6IHtcclxuXHRcdHN0ZXA6IC0xLFxyXG5cdFx0cGFnZXM6IFtdLFxyXG5cdFx0cG9zdHM6IFtdLFxyXG5cdH0sXHJcblx0d2F0Y2g6e1xyXG5cdFx0c3RlcCh2YWwsIG9sZHZhbCl7XHJcblx0XHRcdGlmICh2YWwgPT0gMil7XHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0ZmxhdHBpY2tyKFwiLnN0YXJ0X3RpbWVcIiwge1xyXG5cdFx0XHRcdFx0XHRlbmFibGVUaW1lOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRkYXRlRm9ybWF0OiBcIlktbS1kIEg6aVwiLFxyXG5cdFx0XHRcdFx0XHR0aW1lXzI0aHI6IHRydWUsXHJcblx0XHRcdFx0XHRcdG9uQ2hhbmdlOiBmdW5jdGlvbihzZWxlY3RlZERhdGVzLCBkYXRlU3RyLCBpbnN0YW5jZSkge1xyXG5cdFx0XHRcdFx0XHRcdHZ1ZV9jb21tZW50cy5zdGFydF90aW1lID0gc2VsZWN0ZWREYXRlc1swXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRmbGF0cGlja3IoXCIuZW5kX3RpbWVcIiwge1xyXG5cdFx0XHRcdFx0XHRlbmFibGVUaW1lOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRkYXRlRm9ybWF0OiBcIlktbS1kIEg6aVwiLFxyXG5cdFx0XHRcdFx0XHR0aW1lXzI0aHI6IHRydWUsXHJcblx0XHRcdFx0XHRcdG9uQ2hhbmdlOiBmdW5jdGlvbihzZWxlY3RlZERhdGVzLCBkYXRlU3RyLCBpbnN0YW5jZSkge1xyXG5cdFx0XHRcdFx0XHRcdHZ1ZV9jb21tZW50cy5lbmRfdGltZSA9IHNlbGVjdGVkRGF0ZXNbMF07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0sIDMwMCk7XHJcblx0XHRcdH1lbHNlIGlmKG9sZHZhbCA9PSAyKXtcclxuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0X3RpbWVcIikuX2ZsYXRwaWNrci5kZXN0cm95KCk7XHJcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lbmRfdGltZVwiKS5fZmxhdHBpY2tyLmRlc3Ryb3koKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0bWV0aG9kczoge1xyXG5cdFx0Z2V0UGFnZXMoKXtcclxuXHRcdFx0RkIuYXBpKGAvbWUvYWNjb3VudHM/bGltaXQ9NTBgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5zdGVwID0gMDtcclxuXHRcdFx0XHR0aGlzLnBhZ2VzID0gcmVzLmRhdGE7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdGdldFBvc3RzKHBhZ2VpZCl7XHJcblx0XHRcdGdldElHaWQocGFnZWlkKS50aGVuKElHaWQgPT57XHJcblx0XHRcdFx0RkIuYXBpKGAvJHtJR2lkfT9maWVsZHM9dXNlcm5hbWVgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnVzZXJuYW1lID0gcmVzLnVzZXJuYW1lO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdEZCLmFwaShgLyR7SUdpZH0vbWVkaWE/ZmllbGRzPWxpa2VfY291bnQsY29tbWVudHNfY291bnQscGVybWFsaW5rLG1lZGlhX3R5cGUsY2FwdGlvbixtZWRpYV91cmwsY29tbWVudHN7dXNlcm5hbWUsdGV4dCx0aW1lc3RhbXB9LHRpbWVzdGFtcCZsaW1pdD0xMDBgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0XHQvLyBsb2NhbFN0b3JhZ2UuaWdfcG9zdHMgPSBKU09OLnN0cmluZ2lmeShyZXMuZGF0YSk7XHJcblx0XHRcdFx0XHR0aGlzLmNob29zZVBvc3QocmVzLmRhdGEpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHRmdW5jdGlvbiBnZXRJR2lkKHBhZ2VpZCl7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+e1xyXG5cdFx0XHRcdFx0RkIuYXBpKGAvJHtwYWdlaWR9Lz9maWVsZHM9aW5zdGFncmFtX2J1c2luZXNzX2FjY291bnRgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuaW5zdGFncmFtX2J1c2luZXNzX2FjY291bnQpe1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUocmVzLmluc3RhZ3JhbV9idXNpbmVzc19hY2NvdW50LmlkKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0YWxlcnQoJ+atpOeyiee1suWwiOmggeeEoemAo+e1kCBJbnN0YWdyYW0g5biz6JmfJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Z2V0UG9zdERldGFpbChwb3N0KXtcclxuXHRcdFx0dnVlX2NvbW1lbnRzLmNvbW1lbnRzID0gW107XHJcblx0XHRcdHZ1ZV9wb3B1cC5hbGxfbGVuZ3RoID0gMDtcclxuXHRcdFx0dnVlX3BvcHVwLnNob3coJ2ZldGNoaW5nJyk7XHJcblx0XHRcdGxldCBtZWRpYWlkID0gcG9zdC5pZDtcclxuXHRcdFx0dnVlX2NvbW1lbnRzLnBvc3QgPSBwb3N0O1xyXG5cdFx0XHR0aGlzLmdldERhdGEobWVkaWFpZCkudGhlbihyZXM9PntcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhyZXMpO1xyXG5cdFx0XHRcdGxldCBhcnIgPSByZXMubWFwKGl0ZW09PntcclxuXHRcdFx0XHRcdGlmIChpdGVtLnJlcGxpZXMpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gaXRlbTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRpdGVtLnJlcGxpZXMgPSB7fTtcclxuXHRcdFx0XHRcdFx0aXRlbS5yZXBsaWVzLmRhdGEgPSBbXTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0Ly8gbG9jYWxTdG9yYWdlLmlnX3Bvc3QgPSBKU09OLnN0cmluZ2lmeShhcnIpO1xyXG5cdFx0XHRcdHZ1ZV9wb3B1cC5jbG9zZSgpO1xyXG5cdFx0XHRcdHRoaXMuc2hvd0NvbW1lbnRzKGFycik7XHJcblx0XHRcdH0pXHJcblx0XHR9LFxyXG5cdFx0Z2V0RGF0YShtZWRpYWlkKXtcclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmU9PntcclxuXHRcdFx0XHRsZXQgY29tbWVudHNfYXJyID0gW107XHJcblx0XHRcdFx0RkIuYXBpKGAvJHttZWRpYWlkfS9jb21tZW50cz9maWVsZHM9aWQsdGV4dCxtZWRpYSx0aW1lc3RhbXAsdXNlcix1c2VybmFtZSxyZXBsaWVzLmxpbWl0KDUwKXt0ZXh0LHRpbWVzdGFtcCx1c2VybmFtZX0mbGltaXQ9M2AsIHJlcz0+e1xyXG5cdFx0XHRcdFx0dnVlX3BvcHVwLmFsbF9sZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0cmVzLmRhdGEuZm9yRWFjaChpdGVtPT57XHJcblx0XHRcdFx0XHRcdGNvbW1lbnRzX2Fyci5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRpZiAocmVzLnBhZ2luZyl7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGNvbW1lbnRzX2Fycik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsKXtcclxuXHRcdFx0XHRcdCQuZ2V0SlNPTih1cmwsIHJlcz0+e1xyXG5cdFx0XHRcdFx0XHR2dWVfcG9wdXAuYWxsX2xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdHJlcy5kYXRhLmZvckVhY2goaXRlbT0+e1xyXG5cdFx0XHRcdFx0XHRcdGNvbW1lbnRzX2Fyci5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0aWYgKHJlcy5wYWdpbmcpe1xyXG5cdFx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShjb21tZW50c19hcnIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdGNob29zZVBvc3QoZGF0YSl7XHJcblx0XHRcdHRoaXMucG9zdHMgPSBkYXRhO1xyXG5cdFx0XHR0aGlzLnN0ZXAgPSAxO1xyXG5cdFx0fSxcclxuXHRcdHNob3dDb21tZW50cyhkYXRhKXtcclxuXHRcdFx0dGhpcy5zdGVwID0gMjtcclxuXHRcdFx0dnVlX2NvbW1lbnRzLnNob3cgPSB0cnVlO1xyXG5cdFx0XHR2dWVfY29tbWVudHMuY29tbWVudHMgPSBkYXRhO1xyXG5cdFx0XHR2dWVfY29tbWVudHMuaW5pdCgpO1x0XHRcdFxyXG5cdFx0fSxcclxuXHR9XHJcbn0pO1xyXG5cclxuY29uc3QgdnVlX2NvbW1lbnRzID0gbmV3IFZ1ZSh7XHJcblx0ZWw6ICcjdnVlX2NvbW1lbnRzJyxcclxuXHRkYXRhOiB7XHJcblx0XHRzaG93OiBmYWxzZSxcclxuXHRcdHBvc3Q6IHt9LFxyXG5cdFx0ZXh0ZW5kX2NhcHRpb246IGZhbHNlLFxyXG5cdFx0Y29tbWVudHM6IFtdLFxyXG5cdFx0a2V5d29yZDogJycsXHJcblx0XHRyZW1vdmVEdXBsaWNhdGU6IGZhbHNlLFxyXG5cdFx0ZGVzYzogZmFsc2UsXHJcblx0XHR3aW5uZXI6ICcnLFxyXG5cdFx0d2lubmVyX2xpc3Q6IFtdLFxyXG5cdFx0c3RhcnRfdGltZTogJycsXHJcblx0XHRlbmRfdGltZTogJycsXHJcblx0XHRzaG93VHlwZTogJ3N0YW5kYXJkJyxcclxuXHRcdG91dHB1dDoge30sXHJcblx0XHRyZXBseV9pbnB1dDogJycsXHJcblx0XHRjb21tZW50X2lucHV0OiAnJyxcclxuXHRcdHNob3dfcmVwbHk6IFtdLFxyXG5cdFx0YXV0aF91c2VyOiBmYWxzZSxcclxuXHR9LFxyXG5cdGNvbXB1dGVkOiB7XHJcblx0XHRmaWx0ZXJfY29tbWVudCgpe1xyXG5cdFx0XHRsZXQgZmluYWxfYXJyID0gdGhpcy5jb21tZW50cztcclxuXHRcdFx0aWYgKHRoaXMuc3RhcnRfdGltZSAhPT0gJycpe1xyXG5cdFx0XHRcdGZpbmFsX2FyciA9IGZpbmFsX2Fyci5maWx0ZXIoaXRlbT0+e1xyXG5cdFx0XHRcdFx0cmV0dXJuIG1vbWVudChpdGVtLnRpbWVzdGFtcCkgPiBtb21lbnQodGhpcy5zdGFydF90aW1lKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLmVuZF90aW1lICE9PSAnJyl7XHJcblx0XHRcdFx0ZmluYWxfYXJyID0gZmluYWxfYXJyLmZpbHRlcihpdGVtPT57XHJcblx0XHRcdFx0XHRyZXR1cm4gbW9tZW50KGl0ZW0udGltZXN0YW1wKSA8IG1vbWVudCh0aGlzLmVuZF90aW1lKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLmtleXdvcmQgIT09ICcnKXtcclxuXHRcdFx0XHRmaW5hbF9hcnIgPSBmaW5hbF9hcnIuZmlsdGVyKGl0ZW09PntcclxuXHRcdFx0XHRcdHJldHVybiBpdGVtLnRleHQuaW5kZXhPZih0aGlzLmtleXdvcmQpID49IDA7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGhpcy5yZW1vdmVEdXBsaWNhdGUpe1xyXG5cdFx0XHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdFx0XHRsZXQga2V5cyA9IFtdO1xyXG5cdFx0XHRcdGZpbmFsX2Fyci5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRcdFx0XHRsZXQga2V5ID0gaXRlbS51c2VyLmlkO1xyXG5cdFx0XHRcdFx0aWYgKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0ZmluYWxfYXJyID0gb3V0cHV0O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5kZXNjKXtcclxuXHRcdFx0XHRmaW5hbF9hcnIuc29ydChmdW5jdGlvbihhLCBiKXtcclxuXHRcdFx0XHRcdHJldHVybiBtb21lbnQoYi50aW1lc3RhbXApIC0gbW9tZW50KGEudGltZXN0YW1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRmaW5hbF9hcnIuZm9yRWFjaChpdGVtPT57XHJcblx0XHRcdFx0XHRpdGVtLnJlcGxpZXMuZGF0YS5zb3J0KGZ1bmN0aW9uKGEsIGIpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gbW9tZW50KGIudGltZXN0YW1wKSAtIG1vbWVudChhLnRpbWVzdGFtcCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmluYWxfYXJyLnNvcnQoZnVuY3Rpb24oYSwgYil7XHJcblx0XHRcdFx0XHRyZXR1cm4gbW9tZW50KGEudGltZXN0YW1wKSAtIG1vbWVudChiLnRpbWVzdGFtcCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0ZmluYWxfYXJyLmZvckVhY2goaXRlbT0+e1xyXG5cdFx0XHRcdFx0aXRlbS5yZXBsaWVzLmRhdGEuc29ydChmdW5jdGlvbihhLCBiKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIG1vbWVudChhLnRpbWVzdGFtcCkgLSBtb21lbnQoYi50aW1lc3RhbXApO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCQoJy5yZXBsaWVzW2NpZF0nKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cclxuXHRcdFx0Ly8gbGV0IG91dHB1dCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZmluYWxfYXJyKSk7XHJcblx0XHRcdC8vIGxldCBjb21tZW50X2FyciA9IFtdO1xyXG5cdFx0XHQvLyBsZXQgcmVwbHlfYXJyID0gW107XHJcblx0XHRcdC8vIG91dHB1dC5mb3JFYWNoKChpdGVtLGluZGV4KT0+e1xyXG5cdFx0XHQvLyBcdGl0ZW0uY29tbWVudF9pbmRleCA9IGluZGV4O1xyXG5cdFx0XHQvLyBcdGl0ZW0ucmVwbHkuZm9yRWFjaCgocmVwbHlfaXRlbSwgaik9PntcclxuXHRcdFx0Ly8gXHRcdHJlcGx5X2l0ZW0uY29tbWVudF9pbmRleCA9IGluZGV4O1xyXG5cdFx0XHQvLyBcdFx0cmVwbHlfaXRlbS5yZXBseV9pbmRleCA9IGo7XHJcblx0XHRcdC8vIFx0XHRyZXBseV9hcnIucHVzaChyZXBseV9pdGVtKTtcclxuXHRcdFx0Ly8gXHR9KVxyXG5cdFx0XHQvLyBcdGRlbGV0ZSBpdGVtWydyZXBseSddO1xyXG5cdFx0XHQvLyBcdGNvbW1lbnRfYXJyLnB1c2goaXRlbSk7XHJcblx0XHRcdC8vIH0pO1xyXG5cdFx0XHQvLyB0aGlzLm91dHB1dC5jb21tZW50cyA9IGNvbW1lbnRfYXJyO1xyXG5cdFx0XHQvLyB0aGlzLm91dHB1dC5yZXBseXMgPSByZXBseV9hcnI7XHJcblxyXG5cdFx0XHRyZXR1cm4gZmluYWxfYXJyO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0d2F0Y2g6IHtcclxuXHRcdC8vIGtleXdvcmQoKXtcclxuXHRcdC8vIFx0dGhpcy53aW5uZXJfbGlzdCA9IFtdO1xyXG5cdFx0Ly8gfSxcclxuXHRcdHJlbW92ZUR1cGxpY2F0ZSgpe1xyXG5cdFx0XHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHR9LFxyXG5cdFx0Ly8gc3RhcnRfdGltZSgpe1xyXG5cdFx0Ly8gXHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHQvLyB9LFxyXG5cdFx0Ly8gZW5kX3RpbWUoKXtcclxuXHRcdC8vIFx0dGhpcy53aW5uZXJfbGlzdCA9IFtdO1xyXG5cdFx0Ly8gfSxcclxuXHRcdHdpbm5lcigpe1xyXG5cdFx0XHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHR9XHJcblx0fSxcclxuXHRtZXRob2RzOiB7XHJcblx0XHRpbml0KCl7XHJcblx0XHRcdHRoaXMuc3RhcnRfdGltZSA9ICcnO1xyXG5cdFx0XHR0aGlzLmVuZF90aW1lID0gJyc7XHJcblx0XHRcdHRoaXMud2lubmVyX2xpc3QgPSBbXTtcclxuXHRcdH0sXHJcblx0XHRjaG9vc2UoKXtcclxuXHRcdFx0dGhpcy53aW5uZXJfbGlzdCA9IFtdO1xyXG5cdFx0XHRsZXQgdG90YWwgPSB0aGlzLmZpbHRlcl9jb21tZW50Lmxlbmd0aDtcclxuXHRcdFx0bGV0IHdpbm5lcl9saXN0ID0gZ2VuUmFuZG9tQXJyYXkodG90YWwpLnNwbGljZSgwLCB0aGlzLndpbm5lcik7XHJcblx0XHRcdGZvcihsZXQgaSBvZiB3aW5uZXJfbGlzdCl7XHJcblx0XHRcdFx0dGhpcy53aW5uZXJfbGlzdC5wdXNoKHRoaXMuZmlsdGVyX2NvbW1lbnRbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0c2hvdyh0eXBlKXtcclxuXHRcdFx0dGhpcy5zaG93VHlwZSA9IHR5cGU7XHJcblx0XHR9LFxyXG5cdFx0cmVwbHkoY29tbWVudF9pZCl7XHJcblx0XHRcdGxldCBwb3MgPSB0aGlzLnNob3dfcmVwbHkuaW5kZXhPZihjb21tZW50X2lkKTtcclxuXHRcdFx0aWYgKHBvcyA8IDApe1xyXG5cdFx0XHRcdHRoaXMuc2hvd19yZXBseS5wdXNoKGNvbW1lbnRfaWQpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR0aGlzLnNob3dfcmVwbHkuc3BsaWNlKHBvcywgMSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRnZXRSZXBseShjb21tZW50X2lkKXtcclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmU9PntcclxuXHRcdFx0XHRsZXQgY29tbWVudHNfYXJyID0gW107XHJcblx0XHRcdFx0RkIuYXBpKGAvJHtjb21tZW50X2lkfS9yZXBsaWVzP2ZpZWxkcz11c2VybmFtZSx0aW1lc3RhbXAsdGV4dCZsaW1pdD0zYCwgcmVzPT57XHJcblx0XHRcdFx0XHRyZXMuZGF0YS5mb3JFYWNoKGl0ZW09PntcclxuXHRcdFx0XHRcdFx0Y29tbWVudHNfYXJyLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGlmIChyZXMucGFnaW5nKXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoY29tbWVudHNfYXJyKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwpe1xyXG5cdFx0XHRcdFx0JC5nZXRKU09OKHVybCwgcmVzPT57XHJcblx0XHRcdFx0XHRcdHJlcy5kYXRhLmZvckVhY2goaXRlbT0+e1xyXG5cdFx0XHRcdFx0XHRcdGNvbW1lbnRzX2Fyci5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0aWYgKHJlcy5wYWdpbmcpe1xyXG5cdFx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShjb21tZW50c19hcnIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdHNlbmRSZXBseShjb21tZW50X2lkKXtcclxuXHRcdFx0bGV0IHRhciA9ICQoYGlucHV0W2NpZD0ke2NvbW1lbnRfaWR9XWApO1xyXG5cdFx0XHR2dWVfcG9wdXAuc2hvdygnbG9hZGluZycpO1xyXG5cdFx0XHRGQi5hcGkoYC8ke2NvbW1lbnRfaWR9L3JlcGxpZXNgLCAnUE9TVCcsIHtcIm1lc3NhZ2VcIjogdGFyLnZhbCgpfSwgXHQocmVzKSA9PiB7XHJcblx0XHRcdFx0dnVlX3BvcHVwLmNsb3NlKCk7XHJcblx0XHRcdFx0aWYgKHJlcy5pZCl7XHJcblx0XHRcdFx0XHRhbGVydCgn5paw5aKe5Zue6KaG5oiQ5YqfIScpO1xyXG5cdFx0XHRcdFx0dGhpcy5hZGRSZXBseShjb21tZW50X2lkLCB0YXIudmFsKCkpO1xyXG5cdFx0XHRcdFx0dGFyLnZhbCgnJyk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRhbGVydCgn55m855Sf6Yyv6Kqk77yM6KuL56iN5b6M5YaN6KmmJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRhZGRSZXBseShjb21tZW50X2lkLCB0ZXh0KXtcclxuXHRcdFx0dGhpcy5jb21tZW50cy5mb3JFYWNoKGl0ZW09PntcclxuXHRcdFx0XHRpZiAoaXRlbS5pZCA9PSBjb21tZW50X2lkKXtcclxuXHRcdFx0XHRcdGxldCByZXBseV9vYmogPSB7XHJcblx0XHRcdFx0XHRcdHVzZXJuYW1lOiB2dWVfc3RlcHMudXNlcm5hbWUsXHJcblx0XHRcdFx0XHRcdHRleHQ6IHRleHQsXHJcblx0XHRcdFx0XHRcdHRpbWVzdGFtcDogbW9tZW50KCksXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpdGVtLnJlcGxpZXMuZGF0YS5wdXNoKHJlcGx5X29iaik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRzZW5kQ29tbWVudChtZWRpYV9pZCl7XHJcblx0XHRcdHZ1ZV9wb3B1cC5zaG93KCdsb2FkaW5nJyk7XHJcblx0XHRcdEZCLmFwaShgLyR7bWVkaWFfaWR9L2NvbW1lbnRzYCwgJ1BPU1QnLCB7XCJtZXNzYWdlXCI6dGhpcy5jb21tZW50X2lucHV0fSwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdHZ1ZV9wb3B1cC5jbG9zZSgpO1xyXG5cdFx0XHRcdGlmIChyZXMuaWQpe1xyXG5cdFx0XHRcdFx0YWxlcnQoJ+aWsOWinueVmeiogOaIkOWKnyEnKTtcclxuXHRcdFx0XHRcdHRoaXMuYWRkQ29tbWVudChtZWRpYV9pZCwgdGhpcy5jb21tZW50X2lucHV0KTtcclxuXHRcdFx0XHRcdHRoaXMuY29tbWVudF9pbnB1dCA9ICcnO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0YWxlcnQoJ+eZvOeUn+mMr+iqpO+8jOiri+eojeW+jOWGjeippicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0YWRkQ29tbWVudChtZWRpYV9pZCwgdGV4dCl7XHJcblx0XHRcdGxldCBjb21tZW50X29iaiA9IHtcclxuXHRcdFx0XHRpZDogbWVkaWFfaWQsXHJcblx0XHRcdFx0dXNlcm5hbWU6IHZ1ZV9zdGVwcy51c2VybmFtZSxcclxuXHRcdFx0XHR0ZXh0OiB0ZXh0LFxyXG5cdFx0XHRcdHRpbWVzdGFtcDogbW9tZW50KCksXHJcblx0XHRcdFx0cmVwbGllczoge2RhdGE6W119LFxyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuY29tbWVudHMucHVzaChjb21tZW50X29iaik7XHJcblx0XHR9LFxyXG5cdFx0YmFja1N0ZXAoKXtcclxuXHRcdFx0dGhpcy5zaG93ID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuY29tbWVudHMgPSBbXTtcclxuXHRcdFx0dnVlX3N0ZXBzLnN0ZXAgPSAxO1xyXG5cdFx0fSxcclxuXHRcdHJlbG9hZChwb3N0KXtcclxuXHRcdFx0dGhpcy53aW5uZXJfbGlzdCA9IFtdO1xyXG5cdFx0XHR2dWVfc3RlcHMuZ2V0UG9zdERldGFpbChwb3N0KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdG1vdW50ZWQoKSB7XHJcblx0XHRcclxuXHR9LFxyXG59KTtcclxuXHJcblxyXG5mdW5jdGlvbiBvYmoyQXJyYXkob2JqKSB7XHJcblx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XHJcblx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuXHR9KTtcclxuXHRyZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcblx0dmFyIGksIHIsIHQ7XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0YXJ5W2ldID0gaTtcclxuXHR9XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG5cdFx0dCA9IGFyeVtyXTtcclxuXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuXHRcdGFyeVtpXSA9IHQ7XHJcblx0fVxyXG5cdHJldHVybiBhcnk7XHJcbn1cclxuIl0sImZpbGUiOiJtYWluLmpzIn0=
