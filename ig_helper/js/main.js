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
      config.auth_scope = response.authResponse.grantedScopes;
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
  watch: {// step(val, oldval){
    // 	if (val == 2){
    // 		setTimeout(function(){
    // 			flatpickr(".start_time", {
    // 				enableTime: true,
    // 				dateFormat: "Y-m-d H:i",
    // 				time_24hr: true,
    // 				onChange: function(selectedDates, dateStr, instance) {
    // 					vue_comments.start_time = selectedDates;
    // 				}
    // 			});
    // 			flatpickr(".end_time", {
    // 				enableTime: true,
    // 				dateFormat: "Y-m-d H:i",
    // 				time_24hr: true,
    // 				onChange: function(selectedDates, dateStr, instance) {
    // 					vue_comments.end_time = selectedDates;
    // 				}
    // 			});
    // 		}, 300);
    // 	}else if(oldval == 2){
    // 		document.querySelector(".start_time")._flatpickr.destroy();
    // 		document.querySelector(".end_time")._flatpickr.destroy();
    // 	}
    // }
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
    show_reply: []
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiY29uZmlnIiwiYXV0aCIsImF1dGhfc2NvcGUiLCJwYWdlVG9rZW4iLCJmYiIsImdldEF1dGgiLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsImF1dGhfdHlwZSIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInR5cGUiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwiJCIsInJlbW92ZSIsInZ1ZV9zdGVwcyIsImdldFBhZ2VzIiwidnVlX3BvcHVwIiwiVnVlIiwiZWwiLCJkYXRhIiwidGFyZ2V0IiwiYWxsX2xlbmd0aCIsIm1ldGhvZHMiLCJzaG93IiwiY2xvc2UiLCJzdGVwIiwicGFnZXMiLCJwb3N0cyIsIndhdGNoIiwiYXBpIiwicmVzIiwiZ2V0UG9zdHMiLCJwYWdlaWQiLCJnZXRJR2lkIiwidGhlbiIsIklHaWQiLCJ1c2VybmFtZSIsImNob29zZVBvc3QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImluc3RhZ3JhbV9idXNpbmVzc19hY2NvdW50IiwiaWQiLCJhbGVydCIsImdldFBvc3REZXRhaWwiLCJwb3N0IiwidnVlX2NvbW1lbnRzIiwiY29tbWVudHMiLCJtZWRpYWlkIiwiZ2V0RGF0YSIsImFyciIsIm1hcCIsIml0ZW0iLCJyZXBsaWVzIiwic2hvd0NvbW1lbnRzIiwiY29tbWVudHNfYXJyIiwibGVuZ3RoIiwiZm9yRWFjaCIsInB1c2giLCJwYWdpbmciLCJnZXROZXh0IiwibmV4dCIsInVybCIsImdldEpTT04iLCJleHRlbmRfY2FwdGlvbiIsImtleXdvcmQiLCJyZW1vdmVEdXBsaWNhdGUiLCJkZXNjIiwid2lubmVyIiwid2lubmVyX2xpc3QiLCJzdGFydF90aW1lIiwiZW5kX3RpbWUiLCJzaG93VHlwZSIsIm91dHB1dCIsInJlcGx5X2lucHV0IiwiY29tbWVudF9pbnB1dCIsInNob3dfcmVwbHkiLCJjb21wdXRlZCIsImZpbHRlcl9jb21tZW50IiwiZmluYWxfYXJyIiwiZmlsdGVyIiwibW9tZW50IiwidGltZXN0YW1wIiwidGV4dCIsImluZGV4T2YiLCJrZXlzIiwia2V5IiwidXNlciIsInNvcnQiLCJhIiwiYiIsInJlbW92ZUNsYXNzIiwiY2hvb3NlIiwidG90YWwiLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsImkiLCJyZXBseSIsImNvbW1lbnRfaWQiLCJwb3MiLCJnZXRSZXBseSIsInNlbmRSZXBseSIsInRhciIsInZhbCIsImFkZFJlcGx5IiwicmVwbHlfb2JqIiwic2VuZENvbW1lbnQiLCJtZWRpYV9pZCIsImFkZENvbW1lbnQiLCJjb21tZW50X29iaiIsImJhY2tTdGVwIiwicmVsb2FkIiwibW91bnRlZCIsIm9iajJBcnJheSIsIm9iaiIsImFycmF5IiwidmFsdWUiLCJpbmRleCIsIm4iLCJhcnkiLCJBcnJheSIsInIiLCJ0IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLE1BQU0sR0FBRztBQUNaQyxFQUFBQSxJQUFJLEVBQUUsMERBRE07QUFFWkMsRUFBQUEsVUFBVSxFQUFFLEVBRkE7QUFHWkMsRUFBQUEsU0FBUyxFQUFFO0FBSEMsQ0FBYjtBQU1BLElBQUlDLEVBQUUsR0FBRztBQUNSQyxFQUFBQSxPQUFPLEVBQUUsbUJBQU07QUFDZEMsSUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVMsVUFBVUMsUUFBVixFQUFvQjtBQUM1QkosTUFBQUEsRUFBRSxDQUFDSyxRQUFILENBQVlELFFBQVo7QUFDQSxLQUZELEVBRUc7QUFDRkUsTUFBQUEsU0FBUyxFQUFFLFdBRFQ7QUFFRkMsTUFBQUEsS0FBSyxFQUFFWCxNQUFNLENBQUNDLElBRlo7QUFHRlcsTUFBQUEsYUFBYSxFQUFFO0FBSGIsS0FGSDtBQU9BLEdBVE87QUFVUkgsRUFBQUEsUUFBUSxFQUFFLGtCQUFDRCxRQUFELEVBQVdLLElBQVgsRUFBb0I7QUFDN0IsUUFBSUwsUUFBUSxDQUFDTSxNQUFULEtBQW9CLFdBQXhCLEVBQXFDO0FBQ3BD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QUFELENBQUgsR0FBU0EsQ0FBVDtBQUNBOztBQUNELE9BQUtBLENBQUMsR0FBRyxDQUFULEVBQVlBLENBQUMsR0FBR3NCLENBQWhCLEVBQW1CLEVBQUV0QixDQUFyQixFQUF3QjtBQUN2QnlCLElBQUFBLENBQUMsR0FBR0UsSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0UsTUFBTCxLQUFnQlAsQ0FBM0IsQ0FBSjtBQUNBSSxJQUFBQSxDQUFDLEdBQUdILEdBQUcsQ0FBQ0UsQ0FBRCxDQUFQO0FBQ0FGLElBQUFBLEdBQUcsQ0FBQ0UsQ0FBRCxDQUFILEdBQVNGLEdBQUcsQ0FBQ3ZCLENBQUQsQ0FBWjtBQUNBdUIsSUFBQUEsR0FBRyxDQUFDdkIsQ0FBRCxDQUFILEdBQVMwQixDQUFUO0FBQ0E7O0FBQ0QsU0FBT0gsR0FBUDtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGNvbmZpZyA9IHtcclxuXHRhdXRoOiAnaW5zdGFncmFtX2Jhc2ljLCBtYW5hZ2VfcGFnZXMsIGluc3RhZ3JhbV9tYW5hZ2VfY29tbWVudHMnLFxyXG5cdGF1dGhfc2NvcGU6ICcnLFxyXG5cdHBhZ2VUb2tlbjogJycsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHRnZXRBdXRoOiAoKSA9PiB7XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRhdXRoX3R5cGU6ICdyZXJlcXVlc3QnICxcclxuXHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpID0+IHtcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbmZpZy5hdXRoX3Njb3BlID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdCQoJyNsb2dpbicpLnJlbW92ZSgpO1xyXG5cdFx0XHR2dWVfc3RlcHMuZ2V0UGFnZXMoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcbn1cclxuY29uc3QgdnVlX3BvcHVwID0gbmV3IFZ1ZSh7XHJcblx0ZWw6ICcjcG9wdXAnLFxyXG5cdGRhdGE6IHtcclxuXHRcdHRhcmdldDogZmFsc2UsXHJcblx0XHRhbGxfbGVuZ3RoOiAwLFxyXG5cdH0sXHJcblx0bWV0aG9kczoge1xyXG5cdFx0c2hvdyh0YXJnZXQpe1xyXG5cdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdH0sXHJcblx0XHRjbG9zZSgpe1xyXG5cdFx0XHR0aGlzLnRhcmdldCA9IGZhbHNlO1xyXG5cdFx0fSxcclxuXHRcdFxyXG5cdH1cclxufSk7XHJcblxyXG5jb25zdCB2dWVfc3RlcHMgPSBuZXcgVnVlKHtcclxuXHRlbDogJyN2dWVfc3RlcHMnLFxyXG5cdGRhdGE6IHtcclxuXHRcdHN0ZXA6IC0xLFxyXG5cdFx0cGFnZXM6IFtdLFxyXG5cdFx0cG9zdHM6IFtdLFxyXG5cdH0sXHJcblx0d2F0Y2g6e1xyXG5cdFx0Ly8gc3RlcCh2YWwsIG9sZHZhbCl7XHJcblx0XHQvLyBcdGlmICh2YWwgPT0gMil7XHJcblx0XHQvLyBcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0Ly8gXHRcdFx0ZmxhdHBpY2tyKFwiLnN0YXJ0X3RpbWVcIiwge1xyXG5cdFx0Ly8gXHRcdFx0XHRlbmFibGVUaW1lOiB0cnVlLFxyXG5cdFx0Ly8gXHRcdFx0XHRkYXRlRm9ybWF0OiBcIlktbS1kIEg6aVwiLFxyXG5cdFx0Ly8gXHRcdFx0XHR0aW1lXzI0aHI6IHRydWUsXHJcblx0XHQvLyBcdFx0XHRcdG9uQ2hhbmdlOiBmdW5jdGlvbihzZWxlY3RlZERhdGVzLCBkYXRlU3RyLCBpbnN0YW5jZSkge1xyXG5cdFx0Ly8gXHRcdFx0XHRcdHZ1ZV9jb21tZW50cy5zdGFydF90aW1lID0gc2VsZWN0ZWREYXRlcztcclxuXHRcdC8vIFx0XHRcdFx0fVxyXG5cdFx0Ly8gXHRcdFx0fSk7XHJcblx0XHQvLyBcdFx0XHRmbGF0cGlja3IoXCIuZW5kX3RpbWVcIiwge1xyXG5cdFx0Ly8gXHRcdFx0XHRlbmFibGVUaW1lOiB0cnVlLFxyXG5cdFx0Ly8gXHRcdFx0XHRkYXRlRm9ybWF0OiBcIlktbS1kIEg6aVwiLFxyXG5cdFx0Ly8gXHRcdFx0XHR0aW1lXzI0aHI6IHRydWUsXHJcblx0XHQvLyBcdFx0XHRcdG9uQ2hhbmdlOiBmdW5jdGlvbihzZWxlY3RlZERhdGVzLCBkYXRlU3RyLCBpbnN0YW5jZSkge1xyXG5cdFx0Ly8gXHRcdFx0XHRcdHZ1ZV9jb21tZW50cy5lbmRfdGltZSA9IHNlbGVjdGVkRGF0ZXM7XHJcblx0XHQvLyBcdFx0XHRcdH1cclxuXHRcdC8vIFx0XHRcdH0pO1xyXG5cdFx0Ly8gXHRcdH0sIDMwMCk7XHJcblx0XHQvLyBcdH1lbHNlIGlmKG9sZHZhbCA9PSAyKXtcclxuXHRcdC8vIFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0X3RpbWVcIikuX2ZsYXRwaWNrci5kZXN0cm95KCk7XHJcblx0XHQvLyBcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lbmRfdGltZVwiKS5fZmxhdHBpY2tyLmRlc3Ryb3koKTtcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gfVxyXG5cdH0sXHJcblx0bWV0aG9kczoge1xyXG5cdFx0Z2V0UGFnZXMoKXtcclxuXHRcdFx0RkIuYXBpKGAvbWUvYWNjb3VudHM/bGltaXQ9NTBgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5zdGVwID0gMDtcclxuXHRcdFx0XHR0aGlzLnBhZ2VzID0gcmVzLmRhdGE7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdGdldFBvc3RzKHBhZ2VpZCl7XHJcblx0XHRcdGdldElHaWQocGFnZWlkKS50aGVuKElHaWQgPT57XHJcblx0XHRcdFx0RkIuYXBpKGAvJHtJR2lkfT9maWVsZHM9dXNlcm5hbWVgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnVzZXJuYW1lID0gcmVzLnVzZXJuYW1lO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdEZCLmFwaShgLyR7SUdpZH0vbWVkaWE/ZmllbGRzPWxpa2VfY291bnQsY29tbWVudHNfY291bnQscGVybWFsaW5rLG1lZGlhX3R5cGUsY2FwdGlvbixtZWRpYV91cmwsY29tbWVudHN7dXNlcm5hbWUsdGV4dCx0aW1lc3RhbXB9LHRpbWVzdGFtcCZsaW1pdD0xMDBgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0XHQvLyBsb2NhbFN0b3JhZ2UuaWdfcG9zdHMgPSBKU09OLnN0cmluZ2lmeShyZXMuZGF0YSk7XHJcblx0XHRcdFx0XHR0aGlzLmNob29zZVBvc3QocmVzLmRhdGEpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHRmdW5jdGlvbiBnZXRJR2lkKHBhZ2VpZCl7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+e1xyXG5cdFx0XHRcdFx0RkIuYXBpKGAvJHtwYWdlaWR9Lz9maWVsZHM9aW5zdGFncmFtX2J1c2luZXNzX2FjY291bnRgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuaW5zdGFncmFtX2J1c2luZXNzX2FjY291bnQpe1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUocmVzLmluc3RhZ3JhbV9idXNpbmVzc19hY2NvdW50LmlkKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0YWxlcnQoJ+atpOeyiee1suWwiOmggeeEoemAo+e1kCBJbnN0YWdyYW0g5biz6JmfJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Z2V0UG9zdERldGFpbChwb3N0KXtcclxuXHRcdFx0dnVlX2NvbW1lbnRzLmNvbW1lbnRzID0gW107XHJcblx0XHRcdHZ1ZV9wb3B1cC5hbGxfbGVuZ3RoID0gMDtcclxuXHRcdFx0dnVlX3BvcHVwLnNob3coJ2ZldGNoaW5nJyk7XHJcblx0XHRcdGxldCBtZWRpYWlkID0gcG9zdC5pZDtcclxuXHRcdFx0dnVlX2NvbW1lbnRzLnBvc3QgPSBwb3N0O1xyXG5cdFx0XHR0aGlzLmdldERhdGEobWVkaWFpZCkudGhlbihyZXM9PntcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhyZXMpO1xyXG5cdFx0XHRcdGxldCBhcnIgPSByZXMubWFwKGl0ZW09PntcclxuXHRcdFx0XHRcdGlmIChpdGVtLnJlcGxpZXMpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gaXRlbTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRpdGVtLnJlcGxpZXMgPSB7fTtcclxuXHRcdFx0XHRcdFx0aXRlbS5yZXBsaWVzLmRhdGEgPSBbXTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0Ly8gbG9jYWxTdG9yYWdlLmlnX3Bvc3QgPSBKU09OLnN0cmluZ2lmeShhcnIpO1xyXG5cdFx0XHRcdHZ1ZV9wb3B1cC5jbG9zZSgpO1xyXG5cdFx0XHRcdHRoaXMuc2hvd0NvbW1lbnRzKGFycik7XHJcblx0XHRcdH0pXHJcblx0XHR9LFxyXG5cdFx0Z2V0RGF0YShtZWRpYWlkKXtcclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmU9PntcclxuXHRcdFx0XHRsZXQgY29tbWVudHNfYXJyID0gW107XHJcblx0XHRcdFx0RkIuYXBpKGAvJHttZWRpYWlkfS9jb21tZW50cz9maWVsZHM9aWQsdGV4dCxtZWRpYSx0aW1lc3RhbXAsdXNlcix1c2VybmFtZSxyZXBsaWVzLmxpbWl0KDUwKXt0ZXh0LHRpbWVzdGFtcCx1c2VybmFtZX0mbGltaXQ9M2AsIHJlcz0+e1xyXG5cdFx0XHRcdFx0dnVlX3BvcHVwLmFsbF9sZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0cmVzLmRhdGEuZm9yRWFjaChpdGVtPT57XHJcblx0XHRcdFx0XHRcdGNvbW1lbnRzX2Fyci5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRpZiAocmVzLnBhZ2luZyl7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGNvbW1lbnRzX2Fycik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsKXtcclxuXHRcdFx0XHRcdCQuZ2V0SlNPTih1cmwsIHJlcz0+e1xyXG5cdFx0XHRcdFx0XHR2dWVfcG9wdXAuYWxsX2xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdHJlcy5kYXRhLmZvckVhY2goaXRlbT0+e1xyXG5cdFx0XHRcdFx0XHRcdGNvbW1lbnRzX2Fyci5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0aWYgKHJlcy5wYWdpbmcpe1xyXG5cdFx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShjb21tZW50c19hcnIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdGNob29zZVBvc3QoZGF0YSl7XHJcblx0XHRcdHRoaXMucG9zdHMgPSBkYXRhO1xyXG5cdFx0XHR0aGlzLnN0ZXAgPSAxO1xyXG5cdFx0fSxcclxuXHRcdHNob3dDb21tZW50cyhkYXRhKXtcclxuXHRcdFx0dGhpcy5zdGVwID0gMjtcclxuXHRcdFx0dnVlX2NvbW1lbnRzLnNob3cgPSB0cnVlO1xyXG5cdFx0XHR2dWVfY29tbWVudHMuY29tbWVudHMgPSBkYXRhO1xyXG5cdFx0fSxcclxuXHR9XHJcbn0pO1xyXG5cclxuY29uc3QgdnVlX2NvbW1lbnRzID0gbmV3IFZ1ZSh7XHJcblx0ZWw6ICcjdnVlX2NvbW1lbnRzJyxcclxuXHRkYXRhOiB7XHJcblx0XHRzaG93OiBmYWxzZSxcclxuXHRcdHBvc3Q6IHt9LFxyXG5cdFx0ZXh0ZW5kX2NhcHRpb246IGZhbHNlLFxyXG5cdFx0Y29tbWVudHM6IFtdLFxyXG5cdFx0a2V5d29yZDogJycsXHJcblx0XHRyZW1vdmVEdXBsaWNhdGU6IGZhbHNlLFxyXG5cdFx0ZGVzYzogZmFsc2UsXHJcblx0XHR3aW5uZXI6ICcnLFxyXG5cdFx0d2lubmVyX2xpc3Q6IFtdLFxyXG5cdFx0c3RhcnRfdGltZTogJycsXHJcblx0XHRlbmRfdGltZTogJycsXHJcblx0XHRzaG93VHlwZTogJ3N0YW5kYXJkJyxcclxuXHRcdG91dHB1dDoge30sXHJcblx0XHRyZXBseV9pbnB1dDogJycsXHJcblx0XHRjb21tZW50X2lucHV0OiAnJyxcclxuXHRcdHNob3dfcmVwbHk6IFtdLFxyXG5cdH0sXHJcblx0Y29tcHV0ZWQ6IHtcclxuXHRcdGZpbHRlcl9jb21tZW50KCl7XHJcblx0XHRcdGxldCBmaW5hbF9hcnIgPSB0aGlzLmNvbW1lbnRzO1xyXG5cdFx0XHRpZiAodGhpcy5zdGFydF90aW1lICE9PSAnJyl7XHJcblx0XHRcdFx0ZmluYWxfYXJyID0gZmluYWxfYXJyLmZpbHRlcihpdGVtPT57XHJcblx0XHRcdFx0XHRyZXR1cm4gbW9tZW50KGl0ZW0udGltZXN0YW1wKSA+IG1vbWVudCh0aGlzLnN0YXJ0X3RpbWUpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMuZW5kX3RpbWUgIT09ICcnKXtcclxuXHRcdFx0XHRmaW5hbF9hcnIgPSBmaW5hbF9hcnIuZmlsdGVyKGl0ZW09PntcclxuXHRcdFx0XHRcdHJldHVybiBtb21lbnQoaXRlbS50aW1lc3RhbXApIDwgbW9tZW50KHRoaXMuZW5kX3RpbWUpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMua2V5d29yZCAhPT0gJycpe1xyXG5cdFx0XHRcdGZpbmFsX2FyciA9IGZpbmFsX2Fyci5maWx0ZXIoaXRlbT0+e1xyXG5cdFx0XHRcdFx0cmV0dXJuIGl0ZW0udGV4dC5pbmRleE9mKHRoaXMua2V5d29yZCkgPj0gMDtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLnJlbW92ZUR1cGxpY2F0ZSl7XHJcblx0XHRcdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0XHRcdGxldCBrZXlzID0gW107XHJcblx0XHRcdFx0ZmluYWxfYXJyLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdFx0XHRcdGxldCBrZXkgPSBpdGVtLnVzZXIuaWQ7XHJcblx0XHRcdFx0XHRpZiAoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRmaW5hbF9hcnIgPSBvdXRwdXQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmRlc2Mpe1xyXG5cdFx0XHRcdGZpbmFsX2Fyci5zb3J0KGZ1bmN0aW9uKGEsIGIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIG1vbWVudChiLnRpbWVzdGFtcCkgLSBtb21lbnQoYS50aW1lc3RhbXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGZpbmFsX2Fyci5mb3JFYWNoKGl0ZW09PntcclxuXHRcdFx0XHRcdGl0ZW0ucmVwbGllcy5kYXRhLnNvcnQoZnVuY3Rpb24oYSwgYil7XHJcblx0XHRcdFx0XHRcdHJldHVybiBtb21lbnQoYi50aW1lc3RhbXApIC0gbW9tZW50KGEudGltZXN0YW1wKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmaW5hbF9hcnIuc29ydChmdW5jdGlvbihhLCBiKXtcclxuXHRcdFx0XHRcdHJldHVybiBtb21lbnQoYS50aW1lc3RhbXApIC0gbW9tZW50KGIudGltZXN0YW1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRmaW5hbF9hcnIuZm9yRWFjaChpdGVtPT57XHJcblx0XHRcdFx0XHRpdGVtLnJlcGxpZXMuZGF0YS5zb3J0KGZ1bmN0aW9uKGEsIGIpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gbW9tZW50KGEudGltZXN0YW1wKSAtIG1vbWVudChiLnRpbWVzdGFtcCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0JCgnLnJlcGxpZXNbY2lkXScpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblxyXG5cdFx0XHQvLyBsZXQgb3V0cHV0ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShmaW5hbF9hcnIpKTtcclxuXHRcdFx0Ly8gbGV0IGNvbW1lbnRfYXJyID0gW107XHJcblx0XHRcdC8vIGxldCByZXBseV9hcnIgPSBbXTtcclxuXHRcdFx0Ly8gb3V0cHV0LmZvckVhY2goKGl0ZW0saW5kZXgpPT57XHJcblx0XHRcdC8vIFx0aXRlbS5jb21tZW50X2luZGV4ID0gaW5kZXg7XHJcblx0XHRcdC8vIFx0aXRlbS5yZXBseS5mb3JFYWNoKChyZXBseV9pdGVtLCBqKT0+e1xyXG5cdFx0XHQvLyBcdFx0cmVwbHlfaXRlbS5jb21tZW50X2luZGV4ID0gaW5kZXg7XHJcblx0XHRcdC8vIFx0XHRyZXBseV9pdGVtLnJlcGx5X2luZGV4ID0gajtcclxuXHRcdFx0Ly8gXHRcdHJlcGx5X2Fyci5wdXNoKHJlcGx5X2l0ZW0pO1xyXG5cdFx0XHQvLyBcdH0pXHJcblx0XHRcdC8vIFx0ZGVsZXRlIGl0ZW1bJ3JlcGx5J107XHJcblx0XHRcdC8vIFx0Y29tbWVudF9hcnIucHVzaChpdGVtKTtcclxuXHRcdFx0Ly8gfSk7XHJcblx0XHRcdC8vIHRoaXMub3V0cHV0LmNvbW1lbnRzID0gY29tbWVudF9hcnI7XHJcblx0XHRcdC8vIHRoaXMub3V0cHV0LnJlcGx5cyA9IHJlcGx5X2FycjtcclxuXHJcblx0XHRcdHJldHVybiBmaW5hbF9hcnI7XHJcblx0XHR9XHJcblx0fSxcclxuXHR3YXRjaDoge1xyXG5cdFx0Ly8ga2V5d29yZCgpe1xyXG5cdFx0Ly8gXHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHQvLyB9LFxyXG5cdFx0cmVtb3ZlRHVwbGljYXRlKCl7XHJcblx0XHRcdHRoaXMud2lubmVyX2xpc3QgPSBbXTtcclxuXHRcdH0sXHJcblx0XHQvLyBzdGFydF90aW1lKCl7XHJcblx0XHQvLyBcdHRoaXMud2lubmVyX2xpc3QgPSBbXTtcclxuXHRcdC8vIH0sXHJcblx0XHQvLyBlbmRfdGltZSgpe1xyXG5cdFx0Ly8gXHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHQvLyB9LFxyXG5cdFx0d2lubmVyKCl7XHJcblx0XHRcdHRoaXMud2lubmVyX2xpc3QgPSBbXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdG1ldGhvZHM6IHtcclxuXHRcdGNob29zZSgpe1xyXG5cdFx0XHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHRcdGxldCB0b3RhbCA9IHRoaXMuZmlsdGVyX2NvbW1lbnQubGVuZ3RoO1xyXG5cdFx0XHRsZXQgd2lubmVyX2xpc3QgPSBnZW5SYW5kb21BcnJheSh0b3RhbCkuc3BsaWNlKDAsIHRoaXMud2lubmVyKTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIHdpbm5lcl9saXN0KXtcclxuXHRcdFx0XHR0aGlzLndpbm5lcl9saXN0LnB1c2godGhpcy5maWx0ZXJfY29tbWVudFtpXSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRzaG93KHR5cGUpe1xyXG5cdFx0XHR0aGlzLnNob3dUeXBlID0gdHlwZTtcclxuXHRcdH0sXHJcblx0XHRyZXBseShjb21tZW50X2lkKXtcclxuXHRcdFx0bGV0IHBvcyA9IHRoaXMuc2hvd19yZXBseS5pbmRleE9mKGNvbW1lbnRfaWQpO1xyXG5cdFx0XHRpZiAocG9zIDwgMCl7XHJcblx0XHRcdFx0dGhpcy5zaG93X3JlcGx5LnB1c2goY29tbWVudF9pZCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHRoaXMuc2hvd19yZXBseS5zcGxpY2UocG9zLCAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGdldFJlcGx5KGNvbW1lbnRfaWQpe1xyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZT0+e1xyXG5cdFx0XHRcdGxldCBjb21tZW50c19hcnIgPSBbXTtcclxuXHRcdFx0XHRGQi5hcGkoYC8ke2NvbW1lbnRfaWR9L3JlcGxpZXM/ZmllbGRzPXVzZXJuYW1lLHRpbWVzdGFtcCx0ZXh0JmxpbWl0PTNgLCByZXM9PntcclxuXHRcdFx0XHRcdHJlcy5kYXRhLmZvckVhY2goaXRlbT0+e1xyXG5cdFx0XHRcdFx0XHRjb21tZW50c19hcnIucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aWYgKHJlcy5wYWdpbmcpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShjb21tZW50c19hcnIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCl7XHJcblx0XHRcdFx0XHQkLmdldEpTT04odXJsLCByZXM9PntcclxuXHRcdFx0XHRcdFx0cmVzLmRhdGEuZm9yRWFjaChpdGVtPT57XHJcblx0XHRcdFx0XHRcdFx0Y29tbWVudHNfYXJyLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLnBhZ2luZyl7XHJcblx0XHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGNvbW1lbnRzX2Fycik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0c2VuZFJlcGx5KGNvbW1lbnRfaWQpe1xyXG5cdFx0XHRsZXQgdGFyID0gJChgaW5wdXRbY2lkPSR7Y29tbWVudF9pZH1dYCk7XHJcblx0XHRcdHZ1ZV9wb3B1cC5zaG93KCdsb2FkaW5nJyk7XHJcblx0XHRcdEZCLmFwaShgLyR7Y29tbWVudF9pZH0vcmVwbGllc2AsICdQT1NUJywge1wibWVzc2FnZVwiOiB0YXIudmFsKCl9LCBcdChyZXMpID0+IHtcclxuXHRcdFx0XHR2dWVfcG9wdXAuY2xvc2UoKTtcclxuXHRcdFx0XHRpZiAocmVzLmlkKXtcclxuXHRcdFx0XHRcdGFsZXJ0KCfmlrDlop7lm57opobmiJDlip8hJyk7XHJcblx0XHRcdFx0XHR0aGlzLmFkZFJlcGx5KGNvbW1lbnRfaWQsIHRhci52YWwoKSk7XHJcblx0XHRcdFx0XHR0YXIudmFsKCcnKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGFsZXJ0KCfnmbznlJ/pjK/oqqTvvIzoq4vnqI3lvozlho3oqaYnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdGFkZFJlcGx5KGNvbW1lbnRfaWQsIHRleHQpe1xyXG5cdFx0XHR0aGlzLmNvbW1lbnRzLmZvckVhY2goaXRlbT0+e1xyXG5cdFx0XHRcdGlmIChpdGVtLmlkID09IGNvbW1lbnRfaWQpe1xyXG5cdFx0XHRcdFx0bGV0IHJlcGx5X29iaiA9IHtcclxuXHRcdFx0XHRcdFx0dXNlcm5hbWU6IHZ1ZV9zdGVwcy51c2VybmFtZSxcclxuXHRcdFx0XHRcdFx0dGV4dDogdGV4dCxcclxuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiBtb21lbnQoKSxcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGl0ZW0ucmVwbGllcy5kYXRhLnB1c2gocmVwbHlfb2JqKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdHNlbmRDb21tZW50KG1lZGlhX2lkKXtcclxuXHRcdFx0dnVlX3BvcHVwLnNob3coJ2xvYWRpbmcnKTtcclxuXHRcdFx0RkIuYXBpKGAvJHttZWRpYV9pZH0vY29tbWVudHNgLCAnUE9TVCcsIHtcIm1lc3NhZ2VcIjp0aGlzLmNvbW1lbnRfaW5wdXR9LCAocmVzKSA9PiB7XHJcblx0XHRcdFx0dnVlX3BvcHVwLmNsb3NlKCk7XHJcblx0XHRcdFx0aWYgKHJlcy5pZCl7XHJcblx0XHRcdFx0XHRhbGVydCgn5paw5aKe55WZ6KiA5oiQ5YqfIScpO1xyXG5cdFx0XHRcdFx0dGhpcy5hZGRDb21tZW50KG1lZGlhX2lkLCB0aGlzLmNvbW1lbnRfaW5wdXQpO1xyXG5cdFx0XHRcdFx0dGhpcy5jb21tZW50X2lucHV0ID0gJyc7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRhbGVydCgn55m855Sf6Yyv6Kqk77yM6KuL56iN5b6M5YaN6KmmJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRhZGRDb21tZW50KG1lZGlhX2lkLCB0ZXh0KXtcclxuXHRcdFx0bGV0IGNvbW1lbnRfb2JqID0ge1xyXG5cdFx0XHRcdGlkOiBtZWRpYV9pZCxcclxuXHRcdFx0XHR1c2VybmFtZTogdnVlX3N0ZXBzLnVzZXJuYW1lLFxyXG5cdFx0XHRcdHRleHQ6IHRleHQsXHJcblx0XHRcdFx0dGltZXN0YW1wOiBtb21lbnQoKSxcclxuXHRcdFx0XHRyZXBsaWVzOiB7ZGF0YTpbXX0sXHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5jb21tZW50cy5wdXNoKGNvbW1lbnRfb2JqKTtcclxuXHRcdH0sXHJcblx0XHRiYWNrU3RlcCgpe1xyXG5cdFx0XHR0aGlzLnNob3cgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5jb21tZW50cyA9IFtdO1xyXG5cdFx0XHR2dWVfc3RlcHMuc3RlcCA9IDE7XHJcblx0XHR9LFxyXG5cdFx0cmVsb2FkKHBvc3Qpe1xyXG5cdFx0XHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHRcdHZ1ZV9zdGVwcy5nZXRQb3N0RGV0YWlsKHBvc3QpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0bW91bnRlZCgpIHtcclxuXHRcdFxyXG5cdH0sXHJcbn0pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIG9iajJBcnJheShvYmopIHtcclxuXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcclxuXHRcdHJldHVybiBbdmFsdWVdO1xyXG5cdH0pO1xyXG5cdHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG5cdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuXHR2YXIgaSwgciwgdDtcclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRhcnlbaV0gPSBpO1xyXG5cdH1cclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcblx0XHR0ID0gYXJ5W3JdO1xyXG5cdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG5cdFx0YXJ5W2ldID0gdDtcclxuXHR9XHJcblx0cmV0dXJuIGFyeTtcclxufVxyXG4iXSwiZmlsZSI6Im1haW4uanMifQ==
