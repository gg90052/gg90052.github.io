"use strict";

var config = {
  auth: 'instagram_basic, manage_pages, instagram_manage_comments, user_posts',
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

      if (response.authResponse.grantedScopes.includes('user_posts')) {
        console.log(response.authResponse.grantedScopes.includes('user_posts'));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiY29uZmlnIiwiYXV0aCIsImF1dGhfc2NvcGUiLCJwYWdlVG9rZW4iLCJmYiIsImdldEF1dGgiLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsImF1dGhfdHlwZSIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInR5cGUiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwiY29uc29sZSIsImxvZyIsImluY2x1ZGVzIiwidnVlX2NvbW1lbnRzIiwiYXV0aF91c2VyIiwiJCIsInJlbW92ZSIsInZ1ZV9zdGVwcyIsImdldFBhZ2VzIiwidnVlX3BvcHVwIiwiVnVlIiwiZWwiLCJkYXRhIiwidGFyZ2V0IiwiYWxsX2xlbmd0aCIsIm1ldGhvZHMiLCJzaG93IiwiY2xvc2UiLCJzdGVwIiwicGFnZXMiLCJwb3N0cyIsIndhdGNoIiwidmFsIiwib2xkdmFsIiwic2V0VGltZW91dCIsImZsYXRwaWNrciIsImVuYWJsZVRpbWUiLCJkYXRlRm9ybWF0IiwidGltZV8yNGhyIiwib25DaGFuZ2UiLCJzZWxlY3RlZERhdGVzIiwiZGF0ZVN0ciIsImluc3RhbmNlIiwic3RhcnRfdGltZSIsImVuZF90aW1lIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiX2ZsYXRwaWNrciIsImRlc3Ryb3kiLCJhcGkiLCJyZXMiLCJnZXRQb3N0cyIsInBhZ2VpZCIsImdldElHaWQiLCJ0aGVuIiwiSUdpZCIsInVzZXJuYW1lIiwiY2hvb3NlUG9zdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiaW5zdGFncmFtX2J1c2luZXNzX2FjY291bnQiLCJpZCIsImFsZXJ0IiwiZ2V0UG9zdERldGFpbCIsInBvc3QiLCJjb21tZW50cyIsIm1lZGlhaWQiLCJnZXREYXRhIiwiYXJyIiwibWFwIiwiaXRlbSIsInJlcGxpZXMiLCJzaG93Q29tbWVudHMiLCJjb21tZW50c19hcnIiLCJsZW5ndGgiLCJmb3JFYWNoIiwicHVzaCIsInBhZ2luZyIsImdldE5leHQiLCJuZXh0IiwidXJsIiwiZ2V0SlNPTiIsImluaXQiLCJleHRlbmRfY2FwdGlvbiIsImtleXdvcmQiLCJyZW1vdmVEdXBsaWNhdGUiLCJkZXNjIiwid2lubmVyIiwid2lubmVyX2xpc3QiLCJzaG93VHlwZSIsIm91dHB1dCIsInJlcGx5X2lucHV0IiwiY29tbWVudF9pbnB1dCIsInNob3dfcmVwbHkiLCJjb21wdXRlZCIsImZpbHRlcl9jb21tZW50IiwiZmluYWxfYXJyIiwiZmlsdGVyIiwibW9tZW50IiwidGltZXN0YW1wIiwidGV4dCIsImluZGV4T2YiLCJrZXlzIiwia2V5IiwidXNlciIsInNvcnQiLCJhIiwiYiIsInJlbW92ZUNsYXNzIiwiY2hvb3NlIiwidG90YWwiLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsImkiLCJyZXBseSIsImNvbW1lbnRfaWQiLCJwb3MiLCJnZXRSZXBseSIsInNlbmRSZXBseSIsInRhciIsImFkZFJlcGx5IiwicmVwbHlfb2JqIiwic2VuZENvbW1lbnQiLCJtZWRpYV9pZCIsImFkZENvbW1lbnQiLCJjb21tZW50X29iaiIsImJhY2tTdGVwIiwicmVsb2FkIiwibW91bnRlZCIsIm9iajJBcnJheSIsIm9iaiIsImFycmF5IiwidmFsdWUiLCJpbmRleCIsIm4iLCJhcnkiLCJBcnJheSIsInIiLCJ0IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLE1BQU0sR0FBRztBQUNaQyxFQUFBQSxJQUFJLEVBQUUsc0VBRE07QUFFWkMsRUFBQUEsVUFBVSxFQUFFLEVBRkE7QUFHWkMsRUFBQUEsU0FBUyxFQUFFO0FBSEMsQ0FBYjtBQU1BLElBQUlDLEVBQUUsR0FBRztBQUNSQyxFQUFBQSxPQUFPLEVBQUUsbUJBQU07QUFDZEMsSUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVMsVUFBVUMsUUFBVixFQUFvQjtBQUM1QkosTUFBQUEsRUFBRSxDQUFDSyxRQUFILENBQVlELFFBQVo7QUFDQSxLQUZE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ZmlnID0ge1xyXG5cdGF1dGg6ICdpbnN0YWdyYW1fYmFzaWMsIG1hbmFnZV9wYWdlcywgaW5zdGFncmFtX21hbmFnZV9jb21tZW50cywgdXNlcl9wb3N0cycsXHJcblx0YXV0aF9zY29wZTogJycsXHJcblx0cGFnZVRva2VuOiAnJyxcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdGdldEF1dGg6ICgpID0+IHtcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdGF1dGhfdHlwZTogJ3JlcmVxdWVzdCcgLFxyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSkgPT4ge1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLmF1dGhfc2NvcGUgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpXHJcblx0XHRcdGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmNsdWRlcygndXNlcl9wb3N0cycpKXtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmNsdWRlcygndXNlcl9wb3N0cycpKTtcclxuXHRcdFx0XHR2dWVfY29tbWVudHMuYXV0aF91c2VyID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCcjbG9naW4nKS5yZW1vdmUoKTtcclxuXHRcdFx0dnVlX3N0ZXBzLmdldFBhZ2VzKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG59XHJcbmNvbnN0IHZ1ZV9wb3B1cCA9IG5ldyBWdWUoe1xyXG5cdGVsOiAnI3BvcHVwJyxcclxuXHRkYXRhOiB7XHJcblx0XHR0YXJnZXQ6IGZhbHNlLFxyXG5cdFx0YWxsX2xlbmd0aDogMCxcclxuXHR9LFxyXG5cdG1ldGhvZHM6IHtcclxuXHRcdHNob3codGFyZ2V0KXtcclxuXHRcdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHR9LFxyXG5cdFx0Y2xvc2UoKXtcclxuXHRcdFx0dGhpcy50YXJnZXQgPSBmYWxzZTtcclxuXHRcdH0sXHJcblx0XHRcclxuXHR9XHJcbn0pO1xyXG5cclxuY29uc3QgdnVlX3N0ZXBzID0gbmV3IFZ1ZSh7XHJcblx0ZWw6ICcjdnVlX3N0ZXBzJyxcclxuXHRkYXRhOiB7XHJcblx0XHRzdGVwOiAtMSxcclxuXHRcdHBhZ2VzOiBbXSxcclxuXHRcdHBvc3RzOiBbXSxcclxuXHR9LFxyXG5cdHdhdGNoOntcclxuXHRcdHN0ZXAodmFsLCBvbGR2YWwpe1xyXG5cdFx0XHRpZiAodmFsID09IDIpe1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdGZsYXRwaWNrcihcIi5zdGFydF90aW1lXCIsIHtcclxuXHRcdFx0XHRcdFx0ZW5hYmxlVGltZTogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0ZGF0ZUZvcm1hdDogXCJZLW0tZCBIOmlcIixcclxuXHRcdFx0XHRcdFx0dGltZV8yNGhyOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRvbkNoYW5nZTogZnVuY3Rpb24oc2VsZWN0ZWREYXRlcywgZGF0ZVN0ciwgaW5zdGFuY2UpIHtcclxuXHRcdFx0XHRcdFx0XHR2dWVfY29tbWVudHMuc3RhcnRfdGltZSA9IHNlbGVjdGVkRGF0ZXNbMF07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0ZmxhdHBpY2tyKFwiLmVuZF90aW1lXCIsIHtcclxuXHRcdFx0XHRcdFx0ZW5hYmxlVGltZTogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0ZGF0ZUZvcm1hdDogXCJZLW0tZCBIOmlcIixcclxuXHRcdFx0XHRcdFx0dGltZV8yNGhyOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRvbkNoYW5nZTogZnVuY3Rpb24oc2VsZWN0ZWREYXRlcywgZGF0ZVN0ciwgaW5zdGFuY2UpIHtcclxuXHRcdFx0XHRcdFx0XHR2dWVfY29tbWVudHMuZW5kX3RpbWUgPSBzZWxlY3RlZERhdGVzWzBdO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LCAzMDApO1xyXG5cdFx0XHR9ZWxzZSBpZihvbGR2YWwgPT0gMil7XHJcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdGFydF90aW1lXCIpLl9mbGF0cGlja3IuZGVzdHJveSgpO1xyXG5cdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZW5kX3RpbWVcIikuX2ZsYXRwaWNrci5kZXN0cm95KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdG1ldGhvZHM6IHtcclxuXHRcdGdldFBhZ2VzKCl7XHJcblx0XHRcdEZCLmFwaShgL21lL2FjY291bnRzP2xpbWl0PTUwYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdHRoaXMuc3RlcCA9IDA7XHJcblx0XHRcdFx0dGhpcy5wYWdlcyA9IHJlcy5kYXRhO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRnZXRQb3N0cyhwYWdlaWQpe1xyXG5cdFx0XHRnZXRJR2lkKHBhZ2VpZCkudGhlbihJR2lkID0+e1xyXG5cdFx0XHRcdEZCLmFwaShgLyR7SUdpZH0/ZmllbGRzPXVzZXJuYW1lYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy51c2VybmFtZSA9IHJlcy51c2VybmFtZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRGQi5hcGkoYC8ke0lHaWR9L21lZGlhP2ZpZWxkcz1saWtlX2NvdW50LGNvbW1lbnRzX2NvdW50LHBlcm1hbGluayxtZWRpYV90eXBlLGNhcHRpb24sbWVkaWFfdXJsLGNvbW1lbnRze3VzZXJuYW1lLHRleHQsdGltZXN0YW1wfSx0aW1lc3RhbXAmbGltaXQ9MTAwYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdFx0Ly8gbG9jYWxTdG9yYWdlLmlnX3Bvc3RzID0gSlNPTi5zdHJpbmdpZnkocmVzLmRhdGEpO1xyXG5cdFx0XHRcdFx0dGhpcy5jaG9vc2VQb3N0KHJlcy5kYXRhKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSlcclxuXHRcdFx0ZnVuY3Rpb24gZ2V0SUdpZChwYWdlaWQpe1xyXG5cdFx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PntcclxuXHRcdFx0XHRcdEZCLmFwaShgLyR7cGFnZWlkfS8/ZmllbGRzPWluc3RhZ3JhbV9idXNpbmVzc19hY2NvdW50YCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmluc3RhZ3JhbV9idXNpbmVzc19hY2NvdW50KXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHJlcy5pbnN0YWdyYW1fYnVzaW5lc3NfYWNjb3VudC5pZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGFsZXJ0KCfmraTnsonntbLlsIjpoIHnhKHpgKPntZAgSW5zdGFncmFtIOW4s+iZnycpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGdldFBvc3REZXRhaWwocG9zdCl7XHJcblx0XHRcdHZ1ZV9jb21tZW50cy5jb21tZW50cyA9IFtdO1xyXG5cdFx0XHR2dWVfcG9wdXAuYWxsX2xlbmd0aCA9IDA7XHJcblx0XHRcdHZ1ZV9wb3B1cC5zaG93KCdmZXRjaGluZycpO1xyXG5cdFx0XHRsZXQgbWVkaWFpZCA9IHBvc3QuaWQ7XHJcblx0XHRcdHZ1ZV9jb21tZW50cy5wb3N0ID0gcG9zdDtcclxuXHRcdFx0dGhpcy5nZXREYXRhKG1lZGlhaWQpLnRoZW4ocmVzPT57XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2cocmVzKTtcclxuXHRcdFx0XHRsZXQgYXJyID0gcmVzLm1hcChpdGVtPT57XHJcblx0XHRcdFx0XHRpZiAoaXRlbS5yZXBsaWVzKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0aXRlbS5yZXBsaWVzID0ge307XHJcblx0XHRcdFx0XHRcdGl0ZW0ucmVwbGllcy5kYXRhID0gW107XHJcblx0XHRcdFx0XHRcdHJldHVybiBpdGVtO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdC8vIGxvY2FsU3RvcmFnZS5pZ19wb3N0ID0gSlNPTi5zdHJpbmdpZnkoYXJyKTtcclxuXHRcdFx0XHR2dWVfcG9wdXAuY2xvc2UoKTtcclxuXHRcdFx0XHR0aGlzLnNob3dDb21tZW50cyhhcnIpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSxcclxuXHRcdGdldERhdGEobWVkaWFpZCl7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlPT57XHJcblx0XHRcdFx0bGV0IGNvbW1lbnRzX2FyciA9IFtdO1xyXG5cdFx0XHRcdEZCLmFwaShgLyR7bWVkaWFpZH0vY29tbWVudHM/ZmllbGRzPWlkLHRleHQsbWVkaWEsdGltZXN0YW1wLHVzZXIsdXNlcm5hbWUscmVwbGllcy5saW1pdCg1MCl7dGV4dCx0aW1lc3RhbXAsdXNlcm5hbWV9JmxpbWl0PTNgLCByZXM9PntcclxuXHRcdFx0XHRcdHZ1ZV9wb3B1cC5hbGxfbGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdHJlcy5kYXRhLmZvckVhY2goaXRlbT0+e1xyXG5cdFx0XHRcdFx0XHRjb21tZW50c19hcnIucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aWYgKHJlcy5wYWdpbmcpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShjb21tZW50c19hcnIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCl7XHJcblx0XHRcdFx0XHQkLmdldEpTT04odXJsLCByZXM9PntcclxuXHRcdFx0XHRcdFx0dnVlX3BvcHVwLmFsbF9sZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0XHRyZXMuZGF0YS5mb3JFYWNoKGl0ZW09PntcclxuXHRcdFx0XHRcdFx0XHRjb21tZW50c19hcnIucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMucGFnaW5nKXtcclxuXHRcdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoY29tbWVudHNfYXJyKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRjaG9vc2VQb3N0KGRhdGEpe1xyXG5cdFx0XHR0aGlzLnBvc3RzID0gZGF0YTtcclxuXHRcdFx0dGhpcy5zdGVwID0gMTtcclxuXHRcdH0sXHJcblx0XHRzaG93Q29tbWVudHMoZGF0YSl7XHJcblx0XHRcdHRoaXMuc3RlcCA9IDI7XHJcblx0XHRcdHZ1ZV9jb21tZW50cy5zaG93ID0gdHJ1ZTtcclxuXHRcdFx0dnVlX2NvbW1lbnRzLmNvbW1lbnRzID0gZGF0YTtcclxuXHRcdFx0dnVlX2NvbW1lbnRzLmluaXQoKTtcdFx0XHRcclxuXHRcdH0sXHJcblx0fVxyXG59KTtcclxuXHJcbmNvbnN0IHZ1ZV9jb21tZW50cyA9IG5ldyBWdWUoe1xyXG5cdGVsOiAnI3Z1ZV9jb21tZW50cycsXHJcblx0ZGF0YToge1xyXG5cdFx0c2hvdzogZmFsc2UsXHJcblx0XHRwb3N0OiB7fSxcclxuXHRcdGV4dGVuZF9jYXB0aW9uOiBmYWxzZSxcclxuXHRcdGNvbW1lbnRzOiBbXSxcclxuXHRcdGtleXdvcmQ6ICcnLFxyXG5cdFx0cmVtb3ZlRHVwbGljYXRlOiBmYWxzZSxcclxuXHRcdGRlc2M6IGZhbHNlLFxyXG5cdFx0d2lubmVyOiAnJyxcclxuXHRcdHdpbm5lcl9saXN0OiBbXSxcclxuXHRcdHN0YXJ0X3RpbWU6ICcnLFxyXG5cdFx0ZW5kX3RpbWU6ICcnLFxyXG5cdFx0c2hvd1R5cGU6ICdzdGFuZGFyZCcsXHJcblx0XHRvdXRwdXQ6IHt9LFxyXG5cdFx0cmVwbHlfaW5wdXQ6ICcnLFxyXG5cdFx0Y29tbWVudF9pbnB1dDogJycsXHJcblx0XHRzaG93X3JlcGx5OiBbXSxcclxuXHRcdGF1dGhfdXNlcjogZmFsc2UsXHJcblx0fSxcclxuXHRjb21wdXRlZDoge1xyXG5cdFx0ZmlsdGVyX2NvbW1lbnQoKXtcclxuXHRcdFx0bGV0IGZpbmFsX2FyciA9IHRoaXMuY29tbWVudHM7XHJcblx0XHRcdGlmICh0aGlzLnN0YXJ0X3RpbWUgIT09ICcnKXtcclxuXHRcdFx0XHRmaW5hbF9hcnIgPSBmaW5hbF9hcnIuZmlsdGVyKGl0ZW09PntcclxuXHRcdFx0XHRcdHJldHVybiBtb21lbnQoaXRlbS50aW1lc3RhbXApID4gbW9tZW50KHRoaXMuc3RhcnRfdGltZSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGhpcy5lbmRfdGltZSAhPT0gJycpe1xyXG5cdFx0XHRcdGZpbmFsX2FyciA9IGZpbmFsX2Fyci5maWx0ZXIoaXRlbT0+e1xyXG5cdFx0XHRcdFx0cmV0dXJuIG1vbWVudChpdGVtLnRpbWVzdGFtcCkgPCBtb21lbnQodGhpcy5lbmRfdGltZSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGhpcy5rZXl3b3JkICE9PSAnJyl7XHJcblx0XHRcdFx0ZmluYWxfYXJyID0gZmluYWxfYXJyLmZpbHRlcihpdGVtPT57XHJcblx0XHRcdFx0XHRyZXR1cm4gaXRlbS50ZXh0LmluZGV4T2YodGhpcy5rZXl3b3JkKSA+PSAwO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMucmVtb3ZlRHVwbGljYXRlKXtcclxuXHRcdFx0XHRsZXQgb3V0cHV0ID0gW107XHJcblx0XHRcdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdFx0XHRmaW5hbF9hcnIuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0bGV0IGtleSA9IGl0ZW0udXNlci5pZDtcclxuXHRcdFx0XHRcdGlmIChrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGZpbmFsX2FyciA9IG91dHB1dDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuZGVzYyl7XHJcblx0XHRcdFx0ZmluYWxfYXJyLnNvcnQoZnVuY3Rpb24oYSwgYil7XHJcblx0XHRcdFx0XHRyZXR1cm4gbW9tZW50KGIudGltZXN0YW1wKSAtIG1vbWVudChhLnRpbWVzdGFtcCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0ZmluYWxfYXJyLmZvckVhY2goaXRlbT0+e1xyXG5cdFx0XHRcdFx0aXRlbS5yZXBsaWVzLmRhdGEuc29ydChmdW5jdGlvbihhLCBiKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIG1vbWVudChiLnRpbWVzdGFtcCkgLSBtb21lbnQoYS50aW1lc3RhbXApO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZpbmFsX2Fyci5zb3J0KGZ1bmN0aW9uKGEsIGIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIG1vbWVudChhLnRpbWVzdGFtcCkgLSBtb21lbnQoYi50aW1lc3RhbXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGZpbmFsX2Fyci5mb3JFYWNoKGl0ZW09PntcclxuXHRcdFx0XHRcdGl0ZW0ucmVwbGllcy5kYXRhLnNvcnQoZnVuY3Rpb24oYSwgYil7XHJcblx0XHRcdFx0XHRcdHJldHVybiBtb21lbnQoYS50aW1lc3RhbXApIC0gbW9tZW50KGIudGltZXN0YW1wKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQkKCcucmVwbGllc1tjaWRdJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHJcblx0XHRcdC8vIGxldCBvdXRwdXQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGZpbmFsX2FycikpO1xyXG5cdFx0XHQvLyBsZXQgY29tbWVudF9hcnIgPSBbXTtcclxuXHRcdFx0Ly8gbGV0IHJlcGx5X2FyciA9IFtdO1xyXG5cdFx0XHQvLyBvdXRwdXQuZm9yRWFjaCgoaXRlbSxpbmRleCk9PntcclxuXHRcdFx0Ly8gXHRpdGVtLmNvbW1lbnRfaW5kZXggPSBpbmRleDtcclxuXHRcdFx0Ly8gXHRpdGVtLnJlcGx5LmZvckVhY2goKHJlcGx5X2l0ZW0sIGopPT57XHJcblx0XHRcdC8vIFx0XHRyZXBseV9pdGVtLmNvbW1lbnRfaW5kZXggPSBpbmRleDtcclxuXHRcdFx0Ly8gXHRcdHJlcGx5X2l0ZW0ucmVwbHlfaW5kZXggPSBqO1xyXG5cdFx0XHQvLyBcdFx0cmVwbHlfYXJyLnB1c2gocmVwbHlfaXRlbSk7XHJcblx0XHRcdC8vIFx0fSlcclxuXHRcdFx0Ly8gXHRkZWxldGUgaXRlbVsncmVwbHknXTtcclxuXHRcdFx0Ly8gXHRjb21tZW50X2Fyci5wdXNoKGl0ZW0pO1xyXG5cdFx0XHQvLyB9KTtcclxuXHRcdFx0Ly8gdGhpcy5vdXRwdXQuY29tbWVudHMgPSBjb21tZW50X2FycjtcclxuXHRcdFx0Ly8gdGhpcy5vdXRwdXQucmVwbHlzID0gcmVwbHlfYXJyO1xyXG5cclxuXHRcdFx0cmV0dXJuIGZpbmFsX2FycjtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHdhdGNoOiB7XHJcblx0XHQvLyBrZXl3b3JkKCl7XHJcblx0XHQvLyBcdHRoaXMud2lubmVyX2xpc3QgPSBbXTtcclxuXHRcdC8vIH0sXHJcblx0XHRyZW1vdmVEdXBsaWNhdGUoKXtcclxuXHRcdFx0dGhpcy53aW5uZXJfbGlzdCA9IFtdO1xyXG5cdFx0fSxcclxuXHRcdC8vIHN0YXJ0X3RpbWUoKXtcclxuXHRcdC8vIFx0dGhpcy53aW5uZXJfbGlzdCA9IFtdO1xyXG5cdFx0Ly8gfSxcclxuXHRcdC8vIGVuZF90aW1lKCl7XHJcblx0XHQvLyBcdHRoaXMud2lubmVyX2xpc3QgPSBbXTtcclxuXHRcdC8vIH0sXHJcblx0XHR3aW5uZXIoKXtcclxuXHRcdFx0dGhpcy53aW5uZXJfbGlzdCA9IFtdO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0bWV0aG9kczoge1xyXG5cdFx0aW5pdCgpe1xyXG5cdFx0XHR0aGlzLnN0YXJ0X3RpbWUgPSAnJztcclxuXHRcdFx0dGhpcy5lbmRfdGltZSA9ICcnO1xyXG5cdFx0XHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHR9LFxyXG5cdFx0Y2hvb3NlKCl7XHJcblx0XHRcdHRoaXMud2lubmVyX2xpc3QgPSBbXTtcclxuXHRcdFx0bGV0IHRvdGFsID0gdGhpcy5maWx0ZXJfY29tbWVudC5sZW5ndGg7XHJcblx0XHRcdGxldCB3aW5uZXJfbGlzdCA9IGdlblJhbmRvbUFycmF5KHRvdGFsKS5zcGxpY2UoMCwgdGhpcy53aW5uZXIpO1xyXG5cdFx0XHRmb3IobGV0IGkgb2Ygd2lubmVyX2xpc3Qpe1xyXG5cdFx0XHRcdHRoaXMud2lubmVyX2xpc3QucHVzaCh0aGlzLmZpbHRlcl9jb21tZW50W2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHNob3codHlwZSl7XHJcblx0XHRcdHRoaXMuc2hvd1R5cGUgPSB0eXBlO1xyXG5cdFx0fSxcclxuXHRcdHJlcGx5KGNvbW1lbnRfaWQpe1xyXG5cdFx0XHRsZXQgcG9zID0gdGhpcy5zaG93X3JlcGx5LmluZGV4T2YoY29tbWVudF9pZCk7XHJcblx0XHRcdGlmIChwb3MgPCAwKXtcclxuXHRcdFx0XHR0aGlzLnNob3dfcmVwbHkucHVzaChjb21tZW50X2lkKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGhpcy5zaG93X3JlcGx5LnNwbGljZShwb3MsIDEpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Z2V0UmVwbHkoY29tbWVudF9pZCl7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlPT57XHJcblx0XHRcdFx0bGV0IGNvbW1lbnRzX2FyciA9IFtdO1xyXG5cdFx0XHRcdEZCLmFwaShgLyR7Y29tbWVudF9pZH0vcmVwbGllcz9maWVsZHM9dXNlcm5hbWUsdGltZXN0YW1wLHRleHQmbGltaXQ9M2AsIHJlcz0+e1xyXG5cdFx0XHRcdFx0cmVzLmRhdGEuZm9yRWFjaChpdGVtPT57XHJcblx0XHRcdFx0XHRcdGNvbW1lbnRzX2Fyci5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRpZiAocmVzLnBhZ2luZyl7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGNvbW1lbnRzX2Fycik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsKXtcclxuXHRcdFx0XHRcdCQuZ2V0SlNPTih1cmwsIHJlcz0+e1xyXG5cdFx0XHRcdFx0XHRyZXMuZGF0YS5mb3JFYWNoKGl0ZW09PntcclxuXHRcdFx0XHRcdFx0XHRjb21tZW50c19hcnIucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMucGFnaW5nKXtcclxuXHRcdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoY29tbWVudHNfYXJyKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRzZW5kUmVwbHkoY29tbWVudF9pZCl7XHJcblx0XHRcdGxldCB0YXIgPSAkKGBpbnB1dFtjaWQ9JHtjb21tZW50X2lkfV1gKTtcclxuXHRcdFx0dnVlX3BvcHVwLnNob3coJ2xvYWRpbmcnKTtcclxuXHRcdFx0RkIuYXBpKGAvJHtjb21tZW50X2lkfS9yZXBsaWVzYCwgJ1BPU1QnLCB7XCJtZXNzYWdlXCI6IHRhci52YWwoKX0sIFx0KHJlcykgPT4ge1xyXG5cdFx0XHRcdHZ1ZV9wb3B1cC5jbG9zZSgpO1xyXG5cdFx0XHRcdGlmIChyZXMuaWQpe1xyXG5cdFx0XHRcdFx0YWxlcnQoJ+aWsOWinuWbnuimhuaIkOWKnyEnKTtcclxuXHRcdFx0XHRcdHRoaXMuYWRkUmVwbHkoY29tbWVudF9pZCwgdGFyLnZhbCgpKTtcclxuXHRcdFx0XHRcdHRhci52YWwoJycpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0YWxlcnQoJ+eZvOeUn+mMr+iqpO+8jOiri+eojeW+jOWGjeippicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0YWRkUmVwbHkoY29tbWVudF9pZCwgdGV4dCl7XHJcblx0XHRcdHRoaXMuY29tbWVudHMuZm9yRWFjaChpdGVtPT57XHJcblx0XHRcdFx0aWYgKGl0ZW0uaWQgPT0gY29tbWVudF9pZCl7XHJcblx0XHRcdFx0XHRsZXQgcmVwbHlfb2JqID0ge1xyXG5cdFx0XHRcdFx0XHR1c2VybmFtZTogdnVlX3N0ZXBzLnVzZXJuYW1lLFxyXG5cdFx0XHRcdFx0XHR0ZXh0OiB0ZXh0LFxyXG5cdFx0XHRcdFx0XHR0aW1lc3RhbXA6IG1vbWVudCgpLFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aXRlbS5yZXBsaWVzLmRhdGEucHVzaChyZXBseV9vYmopO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0c2VuZENvbW1lbnQobWVkaWFfaWQpe1xyXG5cdFx0XHR2dWVfcG9wdXAuc2hvdygnbG9hZGluZycpO1xyXG5cdFx0XHRGQi5hcGkoYC8ke21lZGlhX2lkfS9jb21tZW50c2AsICdQT1NUJywge1wibWVzc2FnZVwiOnRoaXMuY29tbWVudF9pbnB1dH0sIChyZXMpID0+IHtcclxuXHRcdFx0XHR2dWVfcG9wdXAuY2xvc2UoKTtcclxuXHRcdFx0XHRpZiAocmVzLmlkKXtcclxuXHRcdFx0XHRcdGFsZXJ0KCfmlrDlop7nlZnoqIDmiJDlip8hJyk7XHJcblx0XHRcdFx0XHR0aGlzLmFkZENvbW1lbnQobWVkaWFfaWQsIHRoaXMuY29tbWVudF9pbnB1dCk7XHJcblx0XHRcdFx0XHR0aGlzLmNvbW1lbnRfaW5wdXQgPSAnJztcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGFsZXJ0KCfnmbznlJ/pjK/oqqTvvIzoq4vnqI3lvozlho3oqaYnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdGFkZENvbW1lbnQobWVkaWFfaWQsIHRleHQpe1xyXG5cdFx0XHRsZXQgY29tbWVudF9vYmogPSB7XHJcblx0XHRcdFx0aWQ6IG1lZGlhX2lkLFxyXG5cdFx0XHRcdHVzZXJuYW1lOiB2dWVfc3RlcHMudXNlcm5hbWUsXHJcblx0XHRcdFx0dGV4dDogdGV4dCxcclxuXHRcdFx0XHR0aW1lc3RhbXA6IG1vbWVudCgpLFxyXG5cdFx0XHRcdHJlcGxpZXM6IHtkYXRhOltdfSxcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmNvbW1lbnRzLnB1c2goY29tbWVudF9vYmopO1xyXG5cdFx0fSxcclxuXHRcdGJhY2tTdGVwKCl7XHJcblx0XHRcdHRoaXMuc2hvdyA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLmNvbW1lbnRzID0gW107XHJcblx0XHRcdHZ1ZV9zdGVwcy5zdGVwID0gMTtcclxuXHRcdH0sXHJcblx0XHRyZWxvYWQocG9zdCl7XHJcblx0XHRcdHRoaXMud2lubmVyX2xpc3QgPSBbXTtcclxuXHRcdFx0dnVlX3N0ZXBzLmdldFBvc3REZXRhaWwocG9zdCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRtb3VudGVkKCkge1xyXG5cdFx0XHJcblx0fSxcclxufSk7XHJcblxyXG5cclxuZnVuY3Rpb24gb2JqMkFycmF5KG9iaikge1xyXG5cdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG5cdFx0cmV0dXJuIFt2YWx1ZV07XHJcblx0fSk7XHJcblx0cmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcblx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG5cdHZhciBpLCByLCB0O1xyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdGFyeVtpXSA9IGk7XHJcblx0fVxyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuXHRcdHQgPSBhcnlbcl07XHJcblx0XHRhcnlbcl0gPSBhcnlbaV07XHJcblx0XHRhcnlbaV0gPSB0O1xyXG5cdH1cclxuXHRyZXR1cm4gYXJ5O1xyXG59XHJcbiJdLCJmaWxlIjoibWFpbi5qcyJ9
