"use strict";

var config = {
  auth: 'instagram_basic, manage_pages, instagram_manage_comments',
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
      config.auth_scope = response.authResponse.grantedScopes; // console.log(response)
      // if (response.authResponse.grantedScopes.includes('user_posts')){
      // 	console.log(response.authResponse.grantedScopes.includes('user_posts'));
      // 	vue_comments.auth_user = true;
      // }

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
    auth_user: true
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiY29uZmlnIiwiYXV0aCIsImF1dGhfc2NvcGUiLCJwYWdlVG9rZW4iLCJmYiIsImdldEF1dGgiLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsImF1dGhfdHlwZSIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInR5cGUiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwiJCIsInJlbW92ZSIsInZ1ZV9zdGVwcyIsImdldFBhZ2VzIiwidnVlX3BvcHVwIiwiVnVlIiwiZWwiLCJkYXRhIiwidGFyZ2V0IiwiYWxsX2xlbmd0aCIsIm1ldGhvZHMiLCJzaG93IiwiY2xvc2UiLCJzdGVwIiwicGFnZXMiLCJwb3N0cyIsIndhdGNoIiwidmFsIiwib2xkdmFsIiwic2V0VGltZW91dCIsImZsYXRwaWNrciIsImVuYWJsZVRpbWUiLCJkYXRlRm9ybWF0IiwidGltZV8yNGhyIiwib25DaGFuZ2UiLCJzZWxlY3RlZERhdGVzIiwiZGF0ZVN0ciIsImluc3RhbmNlIiwidnVlX2NvbW1lbnRzIiwic3RhcnRfdGltZSIsImVuZF90aW1lIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiX2ZsYXRwaWNrciIsImRlc3Ryb3kiLCJhcGkiLCJyZXMiLCJnZXRQb3N0cyIsInBhZ2VpZCIsImdldElHaWQiLCJ0aGVuIiwiSUdpZCIsInVzZXJuYW1lIiwiY2hvb3NlUG9zdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiaW5zdGFncmFtX2J1c2luZXNzX2FjY291bnQiLCJpZCIsImFsZXJ0IiwiZ2V0UG9zdERldGFpbCIsInBvc3QiLCJjb21tZW50cyIsIm1lZGlhaWQiLCJnZXREYXRhIiwiYXJyIiwibWFwIiwiaXRlbSIsInJlcGxpZXMiLCJzaG93Q29tbWVudHMiLCJjb21tZW50c19hcnIiLCJsZW5ndGgiLCJmb3JFYWNoIiwicHVzaCIsInBhZ2luZyIsImdldE5leHQiLCJuZXh0IiwidXJsIiwiZ2V0SlNPTiIsImluaXQiLCJleHRlbmRfY2FwdGlvbiIsImtleXdvcmQiLCJyZW1vdmVEdXBsaWNhdGUiLCJkZXNjIiwid2lubmVyIiwid2lubmVyX2xpc3QiLCJzaG93VHlwZSIsIm91dHB1dCIsInJlcGx5X2lucHV0IiwiY29tbWVudF9pbnB1dCIsInNob3dfcmVwbHkiLCJhdXRoX3VzZXIiLCJjb21wdXRlZCIsImZpbHRlcl9jb21tZW50IiwiZmluYWxfYXJyIiwiZmlsdGVyIiwibW9tZW50IiwidGltZXN0YW1wIiwidGV4dCIsImluZGV4T2YiLCJrZXlzIiwia2V5IiwidXNlciIsInNvcnQiLCJhIiwiYiIsInJlbW92ZUNsYXNzIiwiY2hvb3NlIiwidG90YWwiLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsImkiLCJyZXBseSIsImNvbW1lbnRfaWQiLCJwb3MiLCJnZXRSZXBseSIsInNlbmRSZXBseSIsInRhciIsImFkZFJlcGx5IiwicmVwbHlfb2JqIiwic2VuZENvbW1lbnQiLCJtZWRpYV9pZCIsImFkZENvbW1lbnQiLCJjb21tZW50X29iaiIsImJhY2tTdGVwIiwicmVsb2FkIiwibW91bnRlZCIsIm9iajJBcnJheSIsIm9iaiIsImFycmF5IiwidmFsdWUiLCJpbmRleCIsIm4iLCJhcnkiLCJBcnJheSIsInIiLCJ0IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLE1BQU0sR0FBRztBQUNaQyxFQUFBQSxJQUFJLEVBQUUsMERBRE07QUFFWkMsRUFBQUEsVUFBVSxFQUFFLEVBRkE7QUFHWkMsRUFBQUEsU0FBUyxFQUFFO0FBSEMsQ0FBYjtBQU1BLElBQUlDLEVBQUUsR0FBRztBQUNSQyxFQUFBQSxPQUFPLEVBQUUsbUJBQU07QUFDZEMsSUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVMsVUFBVUMsUUFBVixFQUFvQjtBQUM1QkosTUFBQUEsRUFBRSxDQUFDSyxRQUFILENBQVlELFFBQVo7QUFDQSxLQUZELEVBRUc7QUFDRkUsTUFBQUEsU0FBUyxFQUFF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O0FBQ0EsR0FGVyxDQUFaO0FBR0EsU0FBT0QsS0FBUDtBQUNBOztBQUVELFNBQVNwQixjQUFULENBQXdCdUIsQ0FBeEIsRUFBMkI7QUFDMUIsTUFBSUMsR0FBRyxHQUFHLElBQUlDLEtBQUosRUFBVjtBQUNBLE1BQUl2QixDQUFKLEVBQU93QixDQUFQLEVBQVVDLENBQVY7O0FBQ0EsT0FBS3pCLENBQUMsR0FBRyxDQUFULEVBQVlBLENBQUMsR0FBR3FCLENBQWhCLEVBQW1CLEVBQUVyQixDQUFyQixFQUF3QjtBQUN2QnNCLElBQUFBLEdBQUcsQ0FBQ3RCLENBQUQsQ0FBSCxHQUFTQSxDQUFUO0FBQ0E7O0FBQ0QsT0FBS0EsQ0FBQyxHQUFHLENBQVQsRUFBWUEsQ0FBQyxHQUFHcUIsQ0FBaEIsRUFBbUIsRUFBRXJCLENBQXJCLEVBQXdCO0FBQ3ZCd0IsSUFBQUEsQ0FBQyxHQUFHRSxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxNQUFMLEtBQWdCUCxDQUEzQixDQUFKO0FBQ0FJLElBQUFBLENBQUMsR0FBR0gsR0FBRyxDQUFDRSxDQUFELENBQVA7QUFDQUYsSUFBQUEsR0FBRyxDQUFDRSxDQUFELENBQUgsR0FBU0YsR0FBRyxDQUFDdEIsQ0FBRCxDQUFaO0FBQ0FzQixJQUFBQSxHQUFHLENBQUN0QixDQUFELENBQUgsR0FBU3lCLENBQVQ7QUFDQTs7QUFDRCxTQUFPSCxHQUFQO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgY29uZmlnID0ge1xyXG5cdGF1dGg6ICdpbnN0YWdyYW1fYmFzaWMsIG1hbmFnZV9wYWdlcywgaW5zdGFncmFtX21hbmFnZV9jb21tZW50cycsXHJcblx0YXV0aF9zY29wZTogJycsXHJcblx0cGFnZVRva2VuOiAnJyxcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdGdldEF1dGg6ICgpID0+IHtcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdGF1dGhfdHlwZTogJ3JlcmVxdWVzdCcgLFxyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSkgPT4ge1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLmF1dGhfc2NvcGUgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0Ly8gY29uc29sZS5sb2cocmVzcG9uc2UpXHJcblx0XHRcdC8vIGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmNsdWRlcygndXNlcl9wb3N0cycpKXtcclxuXHRcdFx0Ly8gXHRjb25zb2xlLmxvZyhyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmNsdWRlcygndXNlcl9wb3N0cycpKTtcclxuXHRcdFx0Ly8gXHR2dWVfY29tbWVudHMuYXV0aF91c2VyID0gdHJ1ZTtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHQkKCcjbG9naW4nKS5yZW1vdmUoKTtcclxuXHRcdFx0dnVlX3N0ZXBzLmdldFBhZ2VzKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG59XHJcbmNvbnN0IHZ1ZV9wb3B1cCA9IG5ldyBWdWUoe1xyXG5cdGVsOiAnI3BvcHVwJyxcclxuXHRkYXRhOiB7XHJcblx0XHR0YXJnZXQ6IGZhbHNlLFxyXG5cdFx0YWxsX2xlbmd0aDogMCxcclxuXHR9LFxyXG5cdG1ldGhvZHM6IHtcclxuXHRcdHNob3codGFyZ2V0KXtcclxuXHRcdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHR9LFxyXG5cdFx0Y2xvc2UoKXtcclxuXHRcdFx0dGhpcy50YXJnZXQgPSBmYWxzZTtcclxuXHRcdH0sXHJcblx0XHRcclxuXHR9XHJcbn0pO1xyXG5cclxuY29uc3QgdnVlX3N0ZXBzID0gbmV3IFZ1ZSh7XHJcblx0ZWw6ICcjdnVlX3N0ZXBzJyxcclxuXHRkYXRhOiB7XHJcblx0XHRzdGVwOiAtMSxcclxuXHRcdHBhZ2VzOiBbXSxcclxuXHRcdHBvc3RzOiBbXSxcclxuXHR9LFxyXG5cdHdhdGNoOntcclxuXHRcdHN0ZXAodmFsLCBvbGR2YWwpe1xyXG5cdFx0XHRpZiAodmFsID09IDIpe1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdGZsYXRwaWNrcihcIi5zdGFydF90aW1lXCIsIHtcclxuXHRcdFx0XHRcdFx0ZW5hYmxlVGltZTogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0ZGF0ZUZvcm1hdDogXCJZLW0tZCBIOmlcIixcclxuXHRcdFx0XHRcdFx0dGltZV8yNGhyOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRvbkNoYW5nZTogZnVuY3Rpb24oc2VsZWN0ZWREYXRlcywgZGF0ZVN0ciwgaW5zdGFuY2UpIHtcclxuXHRcdFx0XHRcdFx0XHR2dWVfY29tbWVudHMuc3RhcnRfdGltZSA9IHNlbGVjdGVkRGF0ZXNbMF07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0ZmxhdHBpY2tyKFwiLmVuZF90aW1lXCIsIHtcclxuXHRcdFx0XHRcdFx0ZW5hYmxlVGltZTogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0ZGF0ZUZvcm1hdDogXCJZLW0tZCBIOmlcIixcclxuXHRcdFx0XHRcdFx0dGltZV8yNGhyOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRvbkNoYW5nZTogZnVuY3Rpb24oc2VsZWN0ZWREYXRlcywgZGF0ZVN0ciwgaW5zdGFuY2UpIHtcclxuXHRcdFx0XHRcdFx0XHR2dWVfY29tbWVudHMuZW5kX3RpbWUgPSBzZWxlY3RlZERhdGVzWzBdO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LCAzMDApO1xyXG5cdFx0XHR9ZWxzZSBpZihvbGR2YWwgPT0gMil7XHJcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdGFydF90aW1lXCIpLl9mbGF0cGlja3IuZGVzdHJveSgpO1xyXG5cdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZW5kX3RpbWVcIikuX2ZsYXRwaWNrci5kZXN0cm95KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdG1ldGhvZHM6IHtcclxuXHRcdGdldFBhZ2VzKCl7XHJcblx0XHRcdEZCLmFwaShgL21lL2FjY291bnRzP2xpbWl0PTUwYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdHRoaXMuc3RlcCA9IDA7XHJcblx0XHRcdFx0dGhpcy5wYWdlcyA9IHJlcy5kYXRhO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRnZXRQb3N0cyhwYWdlaWQpe1xyXG5cdFx0XHRnZXRJR2lkKHBhZ2VpZCkudGhlbihJR2lkID0+e1xyXG5cdFx0XHRcdEZCLmFwaShgLyR7SUdpZH0/ZmllbGRzPXVzZXJuYW1lYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy51c2VybmFtZSA9IHJlcy51c2VybmFtZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRGQi5hcGkoYC8ke0lHaWR9L21lZGlhP2ZpZWxkcz1saWtlX2NvdW50LGNvbW1lbnRzX2NvdW50LHBlcm1hbGluayxtZWRpYV90eXBlLGNhcHRpb24sbWVkaWFfdXJsLGNvbW1lbnRze3VzZXJuYW1lLHRleHQsdGltZXN0YW1wfSx0aW1lc3RhbXAmbGltaXQ9MTAwYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdFx0Ly8gbG9jYWxTdG9yYWdlLmlnX3Bvc3RzID0gSlNPTi5zdHJpbmdpZnkocmVzLmRhdGEpO1xyXG5cdFx0XHRcdFx0dGhpcy5jaG9vc2VQb3N0KHJlcy5kYXRhKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSlcclxuXHRcdFx0ZnVuY3Rpb24gZ2V0SUdpZChwYWdlaWQpe1xyXG5cdFx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PntcclxuXHRcdFx0XHRcdEZCLmFwaShgLyR7cGFnZWlkfS8/ZmllbGRzPWluc3RhZ3JhbV9idXNpbmVzc19hY2NvdW50YCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmluc3RhZ3JhbV9idXNpbmVzc19hY2NvdW50KXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHJlcy5pbnN0YWdyYW1fYnVzaW5lc3NfYWNjb3VudC5pZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGFsZXJ0KCfmraTnsonntbLlsIjpoIHnhKHpgKPntZAgSW5zdGFncmFtIOW4s+iZnycpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGdldFBvc3REZXRhaWwocG9zdCl7XHJcblx0XHRcdHZ1ZV9jb21tZW50cy5jb21tZW50cyA9IFtdO1xyXG5cdFx0XHR2dWVfcG9wdXAuYWxsX2xlbmd0aCA9IDA7XHJcblx0XHRcdHZ1ZV9wb3B1cC5zaG93KCdmZXRjaGluZycpO1xyXG5cdFx0XHRsZXQgbWVkaWFpZCA9IHBvc3QuaWQ7XHJcblx0XHRcdHZ1ZV9jb21tZW50cy5wb3N0ID0gcG9zdDtcclxuXHRcdFx0dGhpcy5nZXREYXRhKG1lZGlhaWQpLnRoZW4ocmVzPT57XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2cocmVzKTtcclxuXHRcdFx0XHRsZXQgYXJyID0gcmVzLm1hcChpdGVtPT57XHJcblx0XHRcdFx0XHRpZiAoaXRlbS5yZXBsaWVzKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0aXRlbS5yZXBsaWVzID0ge307XHJcblx0XHRcdFx0XHRcdGl0ZW0ucmVwbGllcy5kYXRhID0gW107XHJcblx0XHRcdFx0XHRcdHJldHVybiBpdGVtO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdC8vIGxvY2FsU3RvcmFnZS5pZ19wb3N0ID0gSlNPTi5zdHJpbmdpZnkoYXJyKTtcclxuXHRcdFx0XHR2dWVfcG9wdXAuY2xvc2UoKTtcclxuXHRcdFx0XHR0aGlzLnNob3dDb21tZW50cyhhcnIpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSxcclxuXHRcdGdldERhdGEobWVkaWFpZCl7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlPT57XHJcblx0XHRcdFx0bGV0IGNvbW1lbnRzX2FyciA9IFtdO1xyXG5cdFx0XHRcdEZCLmFwaShgLyR7bWVkaWFpZH0vY29tbWVudHM/ZmllbGRzPWlkLHRleHQsbWVkaWEsdGltZXN0YW1wLHVzZXIsdXNlcm5hbWUscmVwbGllcy5saW1pdCg1MCl7dGV4dCx0aW1lc3RhbXAsdXNlcm5hbWV9JmxpbWl0PTNgLCByZXM9PntcclxuXHRcdFx0XHRcdHZ1ZV9wb3B1cC5hbGxfbGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdHJlcy5kYXRhLmZvckVhY2goaXRlbT0+e1xyXG5cdFx0XHRcdFx0XHRjb21tZW50c19hcnIucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aWYgKHJlcy5wYWdpbmcpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShjb21tZW50c19hcnIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCl7XHJcblx0XHRcdFx0XHQkLmdldEpTT04odXJsLCByZXM9PntcclxuXHRcdFx0XHRcdFx0dnVlX3BvcHVwLmFsbF9sZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0XHRyZXMuZGF0YS5mb3JFYWNoKGl0ZW09PntcclxuXHRcdFx0XHRcdFx0XHRjb21tZW50c19hcnIucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMucGFnaW5nKXtcclxuXHRcdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoY29tbWVudHNfYXJyKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRjaG9vc2VQb3N0KGRhdGEpe1xyXG5cdFx0XHR0aGlzLnBvc3RzID0gZGF0YTtcclxuXHRcdFx0dGhpcy5zdGVwID0gMTtcclxuXHRcdH0sXHJcblx0XHRzaG93Q29tbWVudHMoZGF0YSl7XHJcblx0XHRcdHRoaXMuc3RlcCA9IDI7XHJcblx0XHRcdHZ1ZV9jb21tZW50cy5zaG93ID0gdHJ1ZTtcclxuXHRcdFx0dnVlX2NvbW1lbnRzLmNvbW1lbnRzID0gZGF0YTtcclxuXHRcdFx0dnVlX2NvbW1lbnRzLmluaXQoKTtcdFx0XHRcclxuXHRcdH0sXHJcblx0fVxyXG59KTtcclxuXHJcbmNvbnN0IHZ1ZV9jb21tZW50cyA9IG5ldyBWdWUoe1xyXG5cdGVsOiAnI3Z1ZV9jb21tZW50cycsXHJcblx0ZGF0YToge1xyXG5cdFx0c2hvdzogZmFsc2UsXHJcblx0XHRwb3N0OiB7fSxcclxuXHRcdGV4dGVuZF9jYXB0aW9uOiBmYWxzZSxcclxuXHRcdGNvbW1lbnRzOiBbXSxcclxuXHRcdGtleXdvcmQ6ICcnLFxyXG5cdFx0cmVtb3ZlRHVwbGljYXRlOiBmYWxzZSxcclxuXHRcdGRlc2M6IGZhbHNlLFxyXG5cdFx0d2lubmVyOiAnJyxcclxuXHRcdHdpbm5lcl9saXN0OiBbXSxcclxuXHRcdHN0YXJ0X3RpbWU6ICcnLFxyXG5cdFx0ZW5kX3RpbWU6ICcnLFxyXG5cdFx0c2hvd1R5cGU6ICdzdGFuZGFyZCcsXHJcblx0XHRvdXRwdXQ6IHt9LFxyXG5cdFx0cmVwbHlfaW5wdXQ6ICcnLFxyXG5cdFx0Y29tbWVudF9pbnB1dDogJycsXHJcblx0XHRzaG93X3JlcGx5OiBbXSxcclxuXHRcdGF1dGhfdXNlcjogdHJ1ZSxcclxuXHR9LFxyXG5cdGNvbXB1dGVkOiB7XHJcblx0XHRmaWx0ZXJfY29tbWVudCgpe1xyXG5cdFx0XHRsZXQgZmluYWxfYXJyID0gdGhpcy5jb21tZW50cztcclxuXHRcdFx0aWYgKHRoaXMuc3RhcnRfdGltZSAhPT0gJycpe1xyXG5cdFx0XHRcdGZpbmFsX2FyciA9IGZpbmFsX2Fyci5maWx0ZXIoaXRlbT0+e1xyXG5cdFx0XHRcdFx0cmV0dXJuIG1vbWVudChpdGVtLnRpbWVzdGFtcCkgPiBtb21lbnQodGhpcy5zdGFydF90aW1lKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLmVuZF90aW1lICE9PSAnJyl7XHJcblx0XHRcdFx0ZmluYWxfYXJyID0gZmluYWxfYXJyLmZpbHRlcihpdGVtPT57XHJcblx0XHRcdFx0XHRyZXR1cm4gbW9tZW50KGl0ZW0udGltZXN0YW1wKSA8IG1vbWVudCh0aGlzLmVuZF90aW1lKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLmtleXdvcmQgIT09ICcnKXtcclxuXHRcdFx0XHRmaW5hbF9hcnIgPSBmaW5hbF9hcnIuZmlsdGVyKGl0ZW09PntcclxuXHRcdFx0XHRcdHJldHVybiBpdGVtLnRleHQuaW5kZXhPZih0aGlzLmtleXdvcmQpID49IDA7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGhpcy5yZW1vdmVEdXBsaWNhdGUpe1xyXG5cdFx0XHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdFx0XHRsZXQga2V5cyA9IFtdO1xyXG5cdFx0XHRcdGZpbmFsX2Fyci5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRcdFx0XHRsZXQga2V5ID0gaXRlbS51c2VyLmlkO1xyXG5cdFx0XHRcdFx0aWYgKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0ZmluYWxfYXJyID0gb3V0cHV0O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhpcy5kZXNjKXtcclxuXHRcdFx0XHRmaW5hbF9hcnIuc29ydChmdW5jdGlvbihhLCBiKXtcclxuXHRcdFx0XHRcdHJldHVybiBtb21lbnQoYi50aW1lc3RhbXApIC0gbW9tZW50KGEudGltZXN0YW1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRmaW5hbF9hcnIuZm9yRWFjaChpdGVtPT57XHJcblx0XHRcdFx0XHRpdGVtLnJlcGxpZXMuZGF0YS5zb3J0KGZ1bmN0aW9uKGEsIGIpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gbW9tZW50KGIudGltZXN0YW1wKSAtIG1vbWVudChhLnRpbWVzdGFtcCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmluYWxfYXJyLnNvcnQoZnVuY3Rpb24oYSwgYil7XHJcblx0XHRcdFx0XHRyZXR1cm4gbW9tZW50KGEudGltZXN0YW1wKSAtIG1vbWVudChiLnRpbWVzdGFtcCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0ZmluYWxfYXJyLmZvckVhY2goaXRlbT0+e1xyXG5cdFx0XHRcdFx0aXRlbS5yZXBsaWVzLmRhdGEuc29ydChmdW5jdGlvbihhLCBiKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIG1vbWVudChhLnRpbWVzdGFtcCkgLSBtb21lbnQoYi50aW1lc3RhbXApO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCQoJy5yZXBsaWVzW2NpZF0nKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cclxuXHRcdFx0Ly8gbGV0IG91dHB1dCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZmluYWxfYXJyKSk7XHJcblx0XHRcdC8vIGxldCBjb21tZW50X2FyciA9IFtdO1xyXG5cdFx0XHQvLyBsZXQgcmVwbHlfYXJyID0gW107XHJcblx0XHRcdC8vIG91dHB1dC5mb3JFYWNoKChpdGVtLGluZGV4KT0+e1xyXG5cdFx0XHQvLyBcdGl0ZW0uY29tbWVudF9pbmRleCA9IGluZGV4O1xyXG5cdFx0XHQvLyBcdGl0ZW0ucmVwbHkuZm9yRWFjaCgocmVwbHlfaXRlbSwgaik9PntcclxuXHRcdFx0Ly8gXHRcdHJlcGx5X2l0ZW0uY29tbWVudF9pbmRleCA9IGluZGV4O1xyXG5cdFx0XHQvLyBcdFx0cmVwbHlfaXRlbS5yZXBseV9pbmRleCA9IGo7XHJcblx0XHRcdC8vIFx0XHRyZXBseV9hcnIucHVzaChyZXBseV9pdGVtKTtcclxuXHRcdFx0Ly8gXHR9KVxyXG5cdFx0XHQvLyBcdGRlbGV0ZSBpdGVtWydyZXBseSddO1xyXG5cdFx0XHQvLyBcdGNvbW1lbnRfYXJyLnB1c2goaXRlbSk7XHJcblx0XHRcdC8vIH0pO1xyXG5cdFx0XHQvLyB0aGlzLm91dHB1dC5jb21tZW50cyA9IGNvbW1lbnRfYXJyO1xyXG5cdFx0XHQvLyB0aGlzLm91dHB1dC5yZXBseXMgPSByZXBseV9hcnI7XHJcblxyXG5cdFx0XHRyZXR1cm4gZmluYWxfYXJyO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0d2F0Y2g6IHtcclxuXHRcdC8vIGtleXdvcmQoKXtcclxuXHRcdC8vIFx0dGhpcy53aW5uZXJfbGlzdCA9IFtdO1xyXG5cdFx0Ly8gfSxcclxuXHRcdHJlbW92ZUR1cGxpY2F0ZSgpe1xyXG5cdFx0XHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHR9LFxyXG5cdFx0Ly8gc3RhcnRfdGltZSgpe1xyXG5cdFx0Ly8gXHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHQvLyB9LFxyXG5cdFx0Ly8gZW5kX3RpbWUoKXtcclxuXHRcdC8vIFx0dGhpcy53aW5uZXJfbGlzdCA9IFtdO1xyXG5cdFx0Ly8gfSxcclxuXHRcdHdpbm5lcigpe1xyXG5cdFx0XHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHR9XHJcblx0fSxcclxuXHRtZXRob2RzOiB7XHJcblx0XHRpbml0KCl7XHJcblx0XHRcdHRoaXMuc3RhcnRfdGltZSA9ICcnO1xyXG5cdFx0XHR0aGlzLmVuZF90aW1lID0gJyc7XHJcblx0XHRcdHRoaXMud2lubmVyX2xpc3QgPSBbXTtcclxuXHRcdH0sXHJcblx0XHRjaG9vc2UoKXtcclxuXHRcdFx0dGhpcy53aW5uZXJfbGlzdCA9IFtdO1xyXG5cdFx0XHRsZXQgdG90YWwgPSB0aGlzLmZpbHRlcl9jb21tZW50Lmxlbmd0aDtcclxuXHRcdFx0bGV0IHdpbm5lcl9saXN0ID0gZ2VuUmFuZG9tQXJyYXkodG90YWwpLnNwbGljZSgwLCB0aGlzLndpbm5lcik7XHJcblx0XHRcdGZvcihsZXQgaSBvZiB3aW5uZXJfbGlzdCl7XHJcblx0XHRcdFx0dGhpcy53aW5uZXJfbGlzdC5wdXNoKHRoaXMuZmlsdGVyX2NvbW1lbnRbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0c2hvdyh0eXBlKXtcclxuXHRcdFx0dGhpcy5zaG93VHlwZSA9IHR5cGU7XHJcblx0XHR9LFxyXG5cdFx0cmVwbHkoY29tbWVudF9pZCl7XHJcblx0XHRcdGxldCBwb3MgPSB0aGlzLnNob3dfcmVwbHkuaW5kZXhPZihjb21tZW50X2lkKTtcclxuXHRcdFx0aWYgKHBvcyA8IDApe1xyXG5cdFx0XHRcdHRoaXMuc2hvd19yZXBseS5wdXNoKGNvbW1lbnRfaWQpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR0aGlzLnNob3dfcmVwbHkuc3BsaWNlKHBvcywgMSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRnZXRSZXBseShjb21tZW50X2lkKXtcclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmU9PntcclxuXHRcdFx0XHRsZXQgY29tbWVudHNfYXJyID0gW107XHJcblx0XHRcdFx0RkIuYXBpKGAvJHtjb21tZW50X2lkfS9yZXBsaWVzP2ZpZWxkcz11c2VybmFtZSx0aW1lc3RhbXAsdGV4dCZsaW1pdD0zYCwgcmVzPT57XHJcblx0XHRcdFx0XHRyZXMuZGF0YS5mb3JFYWNoKGl0ZW09PntcclxuXHRcdFx0XHRcdFx0Y29tbWVudHNfYXJyLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGlmIChyZXMucGFnaW5nKXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoY29tbWVudHNfYXJyKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwpe1xyXG5cdFx0XHRcdFx0JC5nZXRKU09OKHVybCwgcmVzPT57XHJcblx0XHRcdFx0XHRcdHJlcy5kYXRhLmZvckVhY2goaXRlbT0+e1xyXG5cdFx0XHRcdFx0XHRcdGNvbW1lbnRzX2Fyci5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0aWYgKHJlcy5wYWdpbmcpe1xyXG5cdFx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShjb21tZW50c19hcnIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdHNlbmRSZXBseShjb21tZW50X2lkKXtcclxuXHRcdFx0bGV0IHRhciA9ICQoYGlucHV0W2NpZD0ke2NvbW1lbnRfaWR9XWApO1xyXG5cdFx0XHR2dWVfcG9wdXAuc2hvdygnbG9hZGluZycpO1xyXG5cdFx0XHRGQi5hcGkoYC8ke2NvbW1lbnRfaWR9L3JlcGxpZXNgLCAnUE9TVCcsIHtcIm1lc3NhZ2VcIjogdGFyLnZhbCgpfSwgXHQocmVzKSA9PiB7XHJcblx0XHRcdFx0dnVlX3BvcHVwLmNsb3NlKCk7XHJcblx0XHRcdFx0aWYgKHJlcy5pZCl7XHJcblx0XHRcdFx0XHRhbGVydCgn5paw5aKe5Zue6KaG5oiQ5YqfIScpO1xyXG5cdFx0XHRcdFx0dGhpcy5hZGRSZXBseShjb21tZW50X2lkLCB0YXIudmFsKCkpO1xyXG5cdFx0XHRcdFx0dGFyLnZhbCgnJyk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRhbGVydCgn55m855Sf6Yyv6Kqk77yM6KuL56iN5b6M5YaN6KmmJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRhZGRSZXBseShjb21tZW50X2lkLCB0ZXh0KXtcclxuXHRcdFx0dGhpcy5jb21tZW50cy5mb3JFYWNoKGl0ZW09PntcclxuXHRcdFx0XHRpZiAoaXRlbS5pZCA9PSBjb21tZW50X2lkKXtcclxuXHRcdFx0XHRcdGxldCByZXBseV9vYmogPSB7XHJcblx0XHRcdFx0XHRcdHVzZXJuYW1lOiB2dWVfc3RlcHMudXNlcm5hbWUsXHJcblx0XHRcdFx0XHRcdHRleHQ6IHRleHQsXHJcblx0XHRcdFx0XHRcdHRpbWVzdGFtcDogbW9tZW50KCksXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpdGVtLnJlcGxpZXMuZGF0YS5wdXNoKHJlcGx5X29iaik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRzZW5kQ29tbWVudChtZWRpYV9pZCl7XHJcblx0XHRcdHZ1ZV9wb3B1cC5zaG93KCdsb2FkaW5nJyk7XHJcblx0XHRcdEZCLmFwaShgLyR7bWVkaWFfaWR9L2NvbW1lbnRzYCwgJ1BPU1QnLCB7XCJtZXNzYWdlXCI6dGhpcy5jb21tZW50X2lucHV0fSwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdHZ1ZV9wb3B1cC5jbG9zZSgpO1xyXG5cdFx0XHRcdGlmIChyZXMuaWQpe1xyXG5cdFx0XHRcdFx0YWxlcnQoJ+aWsOWinueVmeiogOaIkOWKnyEnKTtcclxuXHRcdFx0XHRcdHRoaXMuYWRkQ29tbWVudChtZWRpYV9pZCwgdGhpcy5jb21tZW50X2lucHV0KTtcclxuXHRcdFx0XHRcdHRoaXMuY29tbWVudF9pbnB1dCA9ICcnO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0YWxlcnQoJ+eZvOeUn+mMr+iqpO+8jOiri+eojeW+jOWGjeippicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0YWRkQ29tbWVudChtZWRpYV9pZCwgdGV4dCl7XHJcblx0XHRcdGxldCBjb21tZW50X29iaiA9IHtcclxuXHRcdFx0XHRpZDogbWVkaWFfaWQsXHJcblx0XHRcdFx0dXNlcm5hbWU6IHZ1ZV9zdGVwcy51c2VybmFtZSxcclxuXHRcdFx0XHR0ZXh0OiB0ZXh0LFxyXG5cdFx0XHRcdHRpbWVzdGFtcDogbW9tZW50KCksXHJcblx0XHRcdFx0cmVwbGllczoge2RhdGE6W119LFxyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuY29tbWVudHMucHVzaChjb21tZW50X29iaik7XHJcblx0XHR9LFxyXG5cdFx0YmFja1N0ZXAoKXtcclxuXHRcdFx0dGhpcy5zaG93ID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuY29tbWVudHMgPSBbXTtcclxuXHRcdFx0dnVlX3N0ZXBzLnN0ZXAgPSAxO1xyXG5cdFx0fSxcclxuXHRcdHJlbG9hZChwb3N0KXtcclxuXHRcdFx0dGhpcy53aW5uZXJfbGlzdCA9IFtdO1xyXG5cdFx0XHR2dWVfc3RlcHMuZ2V0UG9zdERldGFpbChwb3N0KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdG1vdW50ZWQoKSB7XHJcblx0XHRcclxuXHR9LFxyXG59KTtcclxuXHJcblxyXG5mdW5jdGlvbiBvYmoyQXJyYXkob2JqKSB7XHJcblx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XHJcblx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuXHR9KTtcclxuXHRyZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcblx0dmFyIGksIHIsIHQ7XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0YXJ5W2ldID0gaTtcclxuXHR9XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG5cdFx0dCA9IGFyeVtyXTtcclxuXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuXHRcdGFyeVtpXSA9IHQ7XHJcblx0fVxyXG5cdHJldHVybiBhcnk7XHJcbn1cclxuIl0sImZpbGUiOiJtYWluLmpzIn0=
