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
        console.log(res);
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
          alert('add reply success!');

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
          alert('add comment success!');

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiY29uZmlnIiwiYXV0aCIsImF1dGhfc2NvcGUiLCJwYWdlVG9rZW4iLCJmYiIsImdldEF1dGgiLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsImF1dGhfdHlwZSIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInR5cGUiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwiJCIsInJlbW92ZSIsInZ1ZV9zdGVwcyIsImdldFBhZ2VzIiwidnVlX3BvcHVwIiwiVnVlIiwiZWwiLCJkYXRhIiwidGFyZ2V0IiwiYWxsX2xlbmd0aCIsIm1ldGhvZHMiLCJzaG93IiwiY2xvc2UiLCJzdGVwIiwicGFnZXMiLCJwb3N0cyIsIndhdGNoIiwiYXBpIiwicmVzIiwiZ2V0UG9zdHMiLCJwYWdlaWQiLCJnZXRJR2lkIiwidGhlbiIsIklHaWQiLCJ1c2VybmFtZSIsImNob29zZVBvc3QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImluc3RhZ3JhbV9idXNpbmVzc19hY2NvdW50IiwiaWQiLCJhbGVydCIsImdldFBvc3REZXRhaWwiLCJwb3N0IiwidnVlX2NvbW1lbnRzIiwiY29tbWVudHMiLCJtZWRpYWlkIiwiZ2V0RGF0YSIsImNvbnNvbGUiLCJsb2ciLCJhcnIiLCJtYXAiLCJpdGVtIiwicmVwbGllcyIsInNob3dDb21tZW50cyIsImNvbW1lbnRzX2FyciIsImxlbmd0aCIsImZvckVhY2giLCJwdXNoIiwicGFnaW5nIiwiZ2V0TmV4dCIsIm5leHQiLCJ1cmwiLCJnZXRKU09OIiwiZXh0ZW5kX2NhcHRpb24iLCJrZXl3b3JkIiwicmVtb3ZlRHVwbGljYXRlIiwiZGVzYyIsIndpbm5lciIsIndpbm5lcl9saXN0Iiwic3RhcnRfdGltZSIsImVuZF90aW1lIiwic2hvd1R5cGUiLCJvdXRwdXQiLCJyZXBseV9pbnB1dCIsImNvbW1lbnRfaW5wdXQiLCJzaG93X3JlcGx5IiwiY29tcHV0ZWQiLCJmaWx0ZXJfY29tbWVudCIsImZpbmFsX2FyciIsImZpbHRlciIsIm1vbWVudCIsInRpbWVzdGFtcCIsInRleHQiLCJpbmRleE9mIiwia2V5cyIsImtleSIsInVzZXIiLCJzb3J0IiwiYSIsImIiLCJyZW1vdmVDbGFzcyIsImNob29zZSIsInRvdGFsIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJpIiwicmVwbHkiLCJjb21tZW50X2lkIiwicG9zIiwiZ2V0UmVwbHkiLCJzZW5kUmVwbHkiLCJ0YXIiLCJ2YWwiLCJhZGRSZXBseSIsInJlcGx5X29iaiIsInNlbmRDb21tZW50IiwibWVkaWFfaWQiLCJhZGRDb21tZW50IiwiY29tbWVudF9vYmoiLCJiYWNrU3RlcCIsInJlbG9hZCIsIm1vdW50ZWQiLCJvYmoyQXJyYXkiLCJvYmoiLCJhcnJheSIsInZhbHVlIiwiaW5kZXgiLCJuIiwiYXJ5IiwiQXJyYXkiLCJyIiwidCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxNQUFNLEdBQUc7QUFDWkMsRUFBQUEsSUFBSSxFQUFFLDBEQURNO0FBRVpDLEVBQUFBLFVBQVUsRUFBRSxFQUZBO0FBR1pDLEVBQUFBLFNBQVMsRUFBRTtBQUhDLENBQWI7QUFNQSxJQUFJQyxFQUFFLEdBQUc7QUFDUkMsRUFBQUEsT0FBTyxFQUFFLG1CQUFNO0FBQ2RDLElBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTLFVBQVVDLFFBQVYsRUFBb0I7QUFDNUJKLE1BQUFBLEVBQUUsQ0FBQ0ssUUFBSCxDQUFZRCxRQUFaO0FBQ0EsS0FGRCxFQUVHO0FBQ0ZFLE1BQUFBLFNBQVMsRUFBRSxXQURUO0FBRUZDLE1BQUFBLEtBQUssRUFBRVgsTUFBTSxDQUFDQyxJQUZaO0FBR0ZXLE1BQUFBLGFBQWEsRUFBRTtBQUhiLEtBRkg7QUFPQSxHQVRPO0FBVVJILEVBQUFBLFFBQVEsRUFBRSxrQkFBQ0QsUUFBRCxFQUFXSyxJQUFYLEVBQW9CO0FBQzdCLFFBQUlMLFFBQVEsQ0FBQ00sTUFBVCxLQUFvQixXQUF4QixFQUFxQztBQUNwQ2QsTUFBQUEsTUFBTSxDQUFDRSxVQUFQLEdBQW9CTSxRQUFRLENBQUNPLFlBQVQsQ0FBc0JDLGFBQTFDO0FBQ0FDLE1BQUFBLENBQUMsQ0FBQyxRQUFELENBQUQsQ0FBWUMsTUFBWjtBQUNBQyxNQUFBQSxTQUFTLENBQUNDLFFBQVY7QUFDQSxLQUpELE1BSU87QUFDTmQsTUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVMsVUFBVUMsUUFBVixFQUFvQjtBQUM1QkosUUFBQUEsRUFBRSxDQUFDSyxRQUFILENBQVlELFFBQVo7QUFDQSxPQUZELEVBRUc7QUFDRkcsUUFBQUEsS0FBSyxFQUFFWCxNQUFNLENBQUNDLElBRFo7QUFFRlcsUUFBQUEsYUFBYSxFQUFFO0FBRmIsT0FGSDtBQU1BO0FBQ0Q7QUF2Qk8sQ0FBVDtBQXlCQSxJQUFNUyxTQUFTLEdBQUcsSUFBSUMsR0FBSixDQUFRO0FBQ3pCQyxFQUFBQSxFQUFFLEVBQUUsUUFEcUI7QUFFekJDLEVBQUFBLElBQUksRUFBRTtBQUNMQyxJQUFBQSxNQUFNLEVBQUUsS0FESDtBQUVMQyxJQUFBQSxVQUFVLEVBQUU7QUFGUCxHQUZtQjtBQU16QkMsRUFBQUEsT0FBTyxFQUFFO0FBQ1JDLElBQUFBLElBRFEsZ0JBQ0hILE1BREcsRUFDSTtBQUNYLFdBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNBLEtBSE87QUFJUkksSUFBQUEsS0FKUSxtQkFJRDtBQUNOLFdBQUtKLE1BQUwsR0FBYyxLQUFkO0FBQ0E7QUFOTztBQU5nQixDQUFSLENBQWxCO0FBaUJBLElBQU1OLFNBQVMsR0FBRyxJQUFJRyxHQUFKLENBQVE7QUFDekJDLEVBQUFBLEVBQUUsRUFBRSxZQURxQjtBQUV6QkMsRUFBQUEsSUFBSSxFQUFFO0FBQ0xNLElBQUFBLElBQUksRUFBRSxDQUFDLENBREY7QUFFTEMsSUFBQUEsS0FBSyxFQUFFLEVBRkY7QUFHTEMsSUFBQUEsS0FBSyxFQUFFO0FBSEYsR0FGbUI7QUFPekJDLEVBQUFBLEtBQUssRUFBQyxDQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBekJLLEdBUG1CO0FBa0N6Qk4sRUFBQUEsT0FBTyxFQUFFO0FBQ1JQLElBQUFBLFFBRFEsc0JBQ0U7QUFBQTs7QUFDVGQsTUFBQUEsRUFBRSxDQUFDNEIsR0FBSCwwQkFBZ0MsVUFBQ0MsR0FBRCxFQUFTO0FBQ3hDLFFBQUEsS0FBSSxDQUFDTCxJQUFMLEdBQVksQ0FBWjtBQUNBLFFBQUEsS0FBSSxDQUFDQyxLQUFMLEdBQWFJLEdBQUcsQ0FBQ1gsSUFBakI7QUFDQSxPQUhEO0FBSUEsS0FOTztBQU9SWSxJQUFBQSxRQVBRLG9CQU9DQyxNQVBELEVBT1E7QUFBQTs7QUFDZkMsTUFBQUEsT0FBTyxDQUFDRCxNQUFELENBQVAsQ0FBZ0JFLElBQWhCLENBQXFCLFVBQUFDLElBQUksRUFBRztBQUMzQmxDLFFBQUFBLEVBQUUsQ0FBQzRCLEdBQUgsWUFBV00sSUFBWCx1QkFBbUMsVUFBQ0wsR0FBRCxFQUFTO0FBQzNDLFVBQUEsTUFBSSxDQUFDTSxRQUFMLEdBQWdCTixHQUFHLENBQUNNLFFBQXBCO0FBQ0EsU0FGRDtBQUdBbkMsUUFBQUEsRUFBRSxDQUFDNEIsR0FBSCxZQUFXTSxJQUFYLDJJQUF1SixVQUFDTCxHQUFELEVBQVM7QUFDL0o7QUFDQSxVQUFBLE1BQUksQ0FBQ08sVUFBTCxDQUFnQlAsR0FBRyxDQUFDWCxJQUFwQjtBQUNBLFNBSEQ7QUFJQSxPQVJEOztBQVNBLGVBQVNjLE9BQVQsQ0FBaUJELE1BQWpCLEVBQXdCO0FBQ3ZCLGVBQU8sSUFBSU0sT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFvQjtBQUN0Q3ZDLFVBQUFBLEVBQUUsQ0FBQzRCLEdBQUgsWUFBV0csTUFBWCwwQ0FBd0QsVUFBQ0YsR0FBRCxFQUFTO0FBQ2hFLGdCQUFJQSxHQUFHLENBQUNXLDBCQUFSLEVBQW1DO0FBQ2xDRixjQUFBQSxPQUFPLENBQUNULEdBQUcsQ0FBQ1csMEJBQUosQ0FBK0JDLEVBQWhDLENBQVA7QUFDQSxhQUZELE1BRUs7QUFDSkMsY0FBQUEsS0FBSyxDQUFDLHVCQUFELENBQUw7QUFDQTtBQUNELFdBTkQ7QUFPQSxTQVJNLENBQVA7QUFTQTtBQUNELEtBNUJPO0FBNkJSQyxJQUFBQSxhQTdCUSx5QkE2Qk1DLElBN0JOLEVBNkJXO0FBQUE7O0FBQ2xCQyxNQUFBQSxZQUFZLENBQUNDLFFBQWIsR0FBd0IsRUFBeEI7QUFDQS9CLE1BQUFBLFNBQVMsQ0FBQ0ssVUFBVixHQUF1QixDQUF2QjtBQUNBTCxNQUFBQSxTQUFTLENBQUNPLElBQVYsQ0FBZSxVQUFmO0FBQ0EsVUFBSXlCLE9BQU8sR0FBR0gsSUFBSSxDQUFDSCxFQUFuQjtBQUNBSSxNQUFBQSxZQUFZLENBQUNELElBQWIsR0FBb0JBLElBQXBCO0FBQ0EsV0FBS0ksT0FBTCxDQUFhRCxPQUFiLEVBQXNCZCxJQUF0QixDQUEyQixVQUFBSixHQUFHLEVBQUU7QUFDL0JvQixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWXJCLEdBQVo7QUFDQSxZQUFJc0IsR0FBRyxHQUFHdEIsR0FBRyxDQUFDdUIsR0FBSixDQUFRLFVBQUFDLElBQUksRUFBRTtBQUN2QixjQUFJQSxJQUFJLENBQUNDLE9BQVQsRUFBaUI7QUFDaEIsbUJBQU9ELElBQVA7QUFDQSxXQUZELE1BRUs7QUFDSkEsWUFBQUEsSUFBSSxDQUFDQyxPQUFMLEdBQWUsRUFBZjtBQUNBRCxZQUFBQSxJQUFJLENBQUNDLE9BQUwsQ0FBYXBDLElBQWIsR0FBb0IsRUFBcEI7QUFDQSxtQkFBT21DLElBQVA7QUFDQTtBQUNELFNBUlMsQ0FBVixDQUYrQixDQVcvQjs7QUFDQXRDLFFBQUFBLFNBQVMsQ0FBQ1EsS0FBVjs7QUFDQSxRQUFBLE1BQUksQ0FBQ2dDLFlBQUwsQ0FBa0JKLEdBQWxCO0FBQ0EsT0FkRDtBQWVBLEtBbERPO0FBbURSSCxJQUFBQSxPQW5EUSxtQkFtREFELE9BbkRBLEVBbURRO0FBQ2YsYUFBTyxJQUFJVixPQUFKLENBQVksVUFBQUMsT0FBTyxFQUFFO0FBQzNCLFlBQUlrQixZQUFZLEdBQUcsRUFBbkI7QUFDQXhELFFBQUFBLEVBQUUsQ0FBQzRCLEdBQUgsWUFBV21CLE9BQVgsZ0hBQStILFVBQUFsQixHQUFHLEVBQUU7QUFDbklkLFVBQUFBLFNBQVMsQ0FBQ0ssVUFBVixJQUF3QlMsR0FBRyxDQUFDWCxJQUFKLENBQVN1QyxNQUFqQztBQUNBNUIsVUFBQUEsR0FBRyxDQUFDWCxJQUFKLENBQVN3QyxPQUFULENBQWlCLFVBQUFMLElBQUksRUFBRTtBQUN0QkcsWUFBQUEsWUFBWSxDQUFDRyxJQUFiLENBQWtCTixJQUFsQjtBQUNBLFdBRkQ7O0FBR0EsY0FBSXhCLEdBQUcsQ0FBQytCLE1BQVIsRUFBZTtBQUNkQyxZQUFBQSxPQUFPLENBQUNoQyxHQUFHLENBQUMrQixNQUFKLENBQVdFLElBQVosQ0FBUDtBQUNBLFdBRkQsTUFFSztBQUNKeEIsWUFBQUEsT0FBTyxDQUFDa0IsWUFBRCxDQUFQO0FBQ0E7QUFDRCxTQVZEOztBQVlBLGlCQUFTSyxPQUFULENBQWlCRSxHQUFqQixFQUFxQjtBQUNwQnBELFVBQUFBLENBQUMsQ0FBQ3FELE9BQUYsQ0FBVUQsR0FBVixFQUFlLFVBQUFsQyxHQUFHLEVBQUU7QUFDbkJkLFlBQUFBLFNBQVMsQ0FBQ0ssVUFBVixJQUF3QlMsR0FBRyxDQUFDWCxJQUFKLENBQVN1QyxNQUFqQztBQUNBNUIsWUFBQUEsR0FBRyxDQUFDWCxJQUFKLENBQVN3QyxPQUFULENBQWlCLFVBQUFMLElBQUksRUFBRTtBQUN0QkcsY0FBQUEsWUFBWSxDQUFDRyxJQUFiLENBQWtCTixJQUFsQjtBQUNBLGFBRkQ7O0FBR0EsZ0JBQUl4QixHQUFHLENBQUMrQixNQUFSLEVBQWU7QUFDZEMsY0FBQUEsT0FBTyxDQUFDaEMsR0FBRyxDQUFDK0IsTUFBSixDQUFXRSxJQUFaLENBQVA7QUFDQSxhQUZELE1BRUs7QUFDSnhCLGNBQUFBLE9BQU8sQ0FBQ2tCLFlBQUQsQ0FBUDtBQUNBO0FBQ0QsV0FWRDtBQVdBO0FBQ0QsT0EzQk0sQ0FBUDtBQTRCQSxLQWhGTztBQWlGUnBCLElBQUFBLFVBakZRLHNCQWlGR2xCLElBakZILEVBaUZRO0FBQ2YsV0FBS1EsS0FBTCxHQUFhUixJQUFiO0FBQ0EsV0FBS00sSUFBTCxHQUFZLENBQVo7QUFDQSxLQXBGTztBQXFGUitCLElBQUFBLFlBckZRLHdCQXFGS3JDLElBckZMLEVBcUZVO0FBQ2pCLFdBQUtNLElBQUwsR0FBWSxDQUFaO0FBQ0FxQixNQUFBQSxZQUFZLENBQUN2QixJQUFiLEdBQW9CLElBQXBCO0FBQ0F1QixNQUFBQSxZQUFZLENBQUNDLFFBQWIsR0FBd0I1QixJQUF4QjtBQUNBO0FBekZPO0FBbENnQixDQUFSLENBQWxCO0FBK0hBLElBQU0yQixZQUFZLEdBQUcsSUFBSTdCLEdBQUosQ0FBUTtBQUM1QkMsRUFBQUEsRUFBRSxFQUFFLGVBRHdCO0FBRTVCQyxFQUFBQSxJQUFJLEVBQUU7QUFDTEksSUFBQUEsSUFBSSxFQUFFLEtBREQ7QUFFTHNCLElBQUFBLElBQUksRUFBRSxFQUZEO0FBR0xxQixJQUFBQSxjQUFjLEVBQUUsS0FIWDtBQUlMbkIsSUFBQUEsUUFBUSxFQUFFLEVBSkw7QUFLTG9CLElBQUFBLE9BQU8sRUFBRSxFQUxKO0FBTUxDLElBQUFBLGVBQWUsRUFBRSxLQU5aO0FBT0xDLElBQUFBLElBQUksRUFBRSxLQVBEO0FBUUxDLElBQUFBLE1BQU0sRUFBRSxFQVJIO0FBU0xDLElBQUFBLFdBQVcsRUFBRSxFQVRSO0FBVUxDLElBQUFBLFVBQVUsRUFBRSxFQVZQO0FBV0xDLElBQUFBLFFBQVEsRUFBRSxFQVhMO0FBWUxDLElBQUFBLFFBQVEsRUFBRSxVQVpMO0FBYUxDLElBQUFBLE1BQU0sRUFBRSxFQWJIO0FBY0xDLElBQUFBLFdBQVcsRUFBRSxFQWRSO0FBZUxDLElBQUFBLGFBQWEsRUFBRSxFQWZWO0FBZ0JMQyxJQUFBQSxVQUFVLEVBQUU7QUFoQlAsR0FGc0I7QUFvQjVCQyxFQUFBQSxRQUFRLEVBQUU7QUFDVEMsSUFBQUEsY0FEUyw0QkFDTztBQUFBOztBQUNmLFVBQUlDLFNBQVMsR0FBRyxLQUFLbEMsUUFBckI7O0FBQ0EsVUFBSSxLQUFLeUIsVUFBTCxLQUFvQixFQUF4QixFQUEyQjtBQUMxQlMsUUFBQUEsU0FBUyxHQUFHQSxTQUFTLENBQUNDLE1BQVYsQ0FBaUIsVUFBQTVCLElBQUksRUFBRTtBQUNsQyxpQkFBTzZCLE1BQU0sQ0FBQzdCLElBQUksQ0FBQzhCLFNBQU4sQ0FBTixHQUF5QkQsTUFBTSxDQUFDLE1BQUksQ0FBQ1gsVUFBTixDQUF0QztBQUNBLFNBRlcsQ0FBWjtBQUdBOztBQUNELFVBQUksS0FBS0MsUUFBTCxLQUFrQixFQUF0QixFQUF5QjtBQUN4QlEsUUFBQUEsU0FBUyxHQUFHQSxTQUFTLENBQUNDLE1BQVYsQ0FBaUIsVUFBQTVCLElBQUksRUFBRTtBQUNsQyxpQkFBTzZCLE1BQU0sQ0FBQzdCLElBQUksQ0FBQzhCLFNBQU4sQ0FBTixHQUF5QkQsTUFBTSxDQUFDLE1BQUksQ0FBQ1YsUUFBTixDQUF0QztBQUNBLFNBRlcsQ0FBWjtBQUdBOztBQUNELFVBQUksS0FBS04sT0FBTCxLQUFpQixFQUFyQixFQUF3QjtBQUN2QmMsUUFBQUEsU0FBUyxHQUFHQSxTQUFTLENBQUNDLE1BQVYsQ0FBaUIsVUFBQTVCLElBQUksRUFBRTtBQUNsQyxpQkFBT0EsSUFBSSxDQUFDK0IsSUFBTCxDQUFVQyxPQUFWLENBQWtCLE1BQUksQ0FBQ25CLE9BQXZCLEtBQW1DLENBQTFDO0FBQ0EsU0FGVyxDQUFaO0FBR0E7O0FBQ0QsVUFBSSxLQUFLQyxlQUFULEVBQXlCO0FBQ3hCLFlBQUlPLE1BQU0sR0FBRyxFQUFiO0FBQ0EsWUFBSVksSUFBSSxHQUFHLEVBQVg7QUFDQU4sUUFBQUEsU0FBUyxDQUFDdEIsT0FBVixDQUFrQixVQUFVTCxJQUFWLEVBQWdCO0FBQ2pDLGNBQUlrQyxHQUFHLEdBQUdsQyxJQUFJLENBQUNtQyxJQUFMLENBQVUvQyxFQUFwQjs7QUFDQSxjQUFJNkMsSUFBSSxDQUFDRCxPQUFMLENBQWFFLEdBQWIsTUFBc0IsQ0FBQyxDQUEzQixFQUE4QjtBQUM3QkQsWUFBQUEsSUFBSSxDQUFDM0IsSUFBTCxDQUFVNEIsR0FBVjtBQUNBYixZQUFBQSxNQUFNLENBQUNmLElBQVAsQ0FBWU4sSUFBWjtBQUNBO0FBQ0QsU0FORDtBQU9BMkIsUUFBQUEsU0FBUyxHQUFHTixNQUFaO0FBQ0E7O0FBRUQsVUFBSSxLQUFLTixJQUFULEVBQWM7QUFDYlksUUFBQUEsU0FBUyxDQUFDUyxJQUFWLENBQWUsVUFBU0MsQ0FBVCxFQUFZQyxDQUFaLEVBQWM7QUFDNUIsaUJBQU9ULE1BQU0sQ0FBQ1MsQ0FBQyxDQUFDUixTQUFILENBQU4sR0FBc0JELE1BQU0sQ0FBQ1EsQ0FBQyxDQUFDUCxTQUFILENBQW5DO0FBQ0EsU0FGRDtBQUdBSCxRQUFBQSxTQUFTLENBQUN0QixPQUFWLENBQWtCLFVBQUFMLElBQUksRUFBRTtBQUN2QkEsVUFBQUEsSUFBSSxDQUFDQyxPQUFMLENBQWFwQyxJQUFiLENBQWtCdUUsSUFBbEIsQ0FBdUIsVUFBU0MsQ0FBVCxFQUFZQyxDQUFaLEVBQWM7QUFDcEMsbUJBQU9ULE1BQU0sQ0FBQ1MsQ0FBQyxDQUFDUixTQUFILENBQU4sR0FBc0JELE1BQU0sQ0FBQ1EsQ0FBQyxDQUFDUCxTQUFILENBQW5DO0FBQ0EsV0FGRDtBQUdBLFNBSkQ7QUFLQSxPQVRELE1BU0s7QUFDSkgsUUFBQUEsU0FBUyxDQUFDUyxJQUFWLENBQWUsVUFBU0MsQ0FBVCxFQUFZQyxDQUFaLEVBQWM7QUFDNUIsaUJBQU9ULE1BQU0sQ0FBQ1EsQ0FBQyxDQUFDUCxTQUFILENBQU4sR0FBc0JELE1BQU0sQ0FBQ1MsQ0FBQyxDQUFDUixTQUFILENBQW5DO0FBQ0EsU0FGRDtBQUdBSCxRQUFBQSxTQUFTLENBQUN0QixPQUFWLENBQWtCLFVBQUFMLElBQUksRUFBRTtBQUN2QkEsVUFBQUEsSUFBSSxDQUFDQyxPQUFMLENBQWFwQyxJQUFiLENBQWtCdUUsSUFBbEIsQ0FBdUIsVUFBU0MsQ0FBVCxFQUFZQyxDQUFaLEVBQWM7QUFDcEMsbUJBQU9ULE1BQU0sQ0FBQ1EsQ0FBQyxDQUFDUCxTQUFILENBQU4sR0FBc0JELE1BQU0sQ0FBQ1MsQ0FBQyxDQUFDUixTQUFILENBQW5DO0FBQ0EsV0FGRDtBQUdBLFNBSkQ7QUFLQTs7QUFFRHhFLE1BQUFBLENBQUMsQ0FBQyxlQUFELENBQUQsQ0FBbUJpRixXQUFuQixDQUErQixNQUEvQixFQWxEZSxDQW9EZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBT1osU0FBUDtBQUNBO0FBdEVRLEdBcEJrQjtBQTRGNUJyRCxFQUFBQSxLQUFLLEVBQUU7QUFDTjtBQUNBO0FBQ0E7QUFDQXdDLElBQUFBLGVBSk0sNkJBSVc7QUFDaEIsV0FBS0csV0FBTCxHQUFtQixFQUFuQjtBQUNBLEtBTks7QUFPTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUQsSUFBQUEsTUFiTSxvQkFhRTtBQUNQLFdBQUtDLFdBQUwsR0FBbUIsRUFBbkI7QUFDQTtBQWZLLEdBNUZxQjtBQTZHNUJqRCxFQUFBQSxPQUFPLEVBQUU7QUFDUndFLElBQUFBLE1BRFEsb0JBQ0E7QUFDUCxXQUFLdkIsV0FBTCxHQUFtQixFQUFuQjtBQUNBLFVBQUl3QixLQUFLLEdBQUcsS0FBS2YsY0FBTCxDQUFvQnRCLE1BQWhDO0FBQ0EsVUFBSWEsV0FBVyxHQUFHeUIsY0FBYyxDQUFDRCxLQUFELENBQWQsQ0FBc0JFLE1BQXRCLENBQTZCLENBQTdCLEVBQWdDLEtBQUszQixNQUFyQyxDQUFsQjtBQUhPO0FBQUE7QUFBQTs7QUFBQTtBQUlQLDZCQUFhQyxXQUFiLDhIQUF5QjtBQUFBLGNBQWpCMkIsQ0FBaUI7QUFDeEIsZUFBSzNCLFdBQUwsQ0FBaUJYLElBQWpCLENBQXNCLEtBQUtvQixjQUFMLENBQW9Ca0IsQ0FBcEIsQ0FBdEI7QUFDQTtBQU5NO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFPUCxLQVJPO0FBU1IzRSxJQUFBQSxJQVRRLGdCQVNIZixJQVRHLEVBU0U7QUFDVCxXQUFLa0UsUUFBTCxHQUFnQmxFLElBQWhCO0FBQ0EsS0FYTztBQVlSMkYsSUFBQUEsS0FaUSxpQkFZRkMsVUFaRSxFQVlTO0FBQ2hCLFVBQUlDLEdBQUcsR0FBRyxLQUFLdkIsVUFBTCxDQUFnQlEsT0FBaEIsQ0FBd0JjLFVBQXhCLENBQVY7O0FBQ0EsVUFBSUMsR0FBRyxHQUFHLENBQVYsRUFBWTtBQUNYLGFBQUt2QixVQUFMLENBQWdCbEIsSUFBaEIsQ0FBcUJ3QyxVQUFyQjtBQUNBLE9BRkQsTUFFSztBQUNKLGFBQUt0QixVQUFMLENBQWdCbUIsTUFBaEIsQ0FBdUJJLEdBQXZCLEVBQTRCLENBQTVCO0FBQ0E7QUFDRCxLQW5CTztBQW9CUkMsSUFBQUEsUUFwQlEsb0JBb0JDRixVQXBCRCxFQW9CWTtBQUNuQixhQUFPLElBQUk5RCxPQUFKLENBQVksVUFBQUMsT0FBTyxFQUFFO0FBQzNCLFlBQUlrQixZQUFZLEdBQUcsRUFBbkI7QUFDQXhELFFBQUFBLEVBQUUsQ0FBQzRCLEdBQUgsWUFBV3VFLFVBQVgsc0RBQXdFLFVBQUF0RSxHQUFHLEVBQUU7QUFDNUVBLFVBQUFBLEdBQUcsQ0FBQ1gsSUFBSixDQUFTd0MsT0FBVCxDQUFpQixVQUFBTCxJQUFJLEVBQUU7QUFDdEJHLFlBQUFBLFlBQVksQ0FBQ0csSUFBYixDQUFrQk4sSUFBbEI7QUFDQSxXQUZEOztBQUdBLGNBQUl4QixHQUFHLENBQUMrQixNQUFSLEVBQWU7QUFDZEMsWUFBQUEsT0FBTyxDQUFDaEMsR0FBRyxDQUFDK0IsTUFBSixDQUFXRSxJQUFaLENBQVA7QUFDQSxXQUZELE1BRUs7QUFDSnhCLFlBQUFBLE9BQU8sQ0FBQ2tCLFlBQUQsQ0FBUDtBQUNBO0FBQ0QsU0FURDs7QUFXQSxpQkFBU0ssT0FBVCxDQUFpQkUsR0FBakIsRUFBcUI7QUFDcEJwRCxVQUFBQSxDQUFDLENBQUNxRCxPQUFGLENBQVVELEdBQVYsRUFBZSxVQUFBbEMsR0FBRyxFQUFFO0FBQ25CQSxZQUFBQSxHQUFHLENBQUNYLElBQUosQ0FBU3dDLE9BQVQsQ0FBaUIsVUFBQUwsSUFBSSxFQUFFO0FBQ3RCRyxjQUFBQSxZQUFZLENBQUNHLElBQWIsQ0FBa0JOLElBQWxCO0FBQ0EsYUFGRDs7QUFHQSxnQkFBSXhCLEdBQUcsQ0FBQytCLE1BQVIsRUFBZTtBQUNkQyxjQUFBQSxPQUFPLENBQUNoQyxHQUFHLENBQUMrQixNQUFKLENBQVdFLElBQVosQ0FBUDtBQUNBLGFBRkQsTUFFSztBQUNKeEIsY0FBQUEsT0FBTyxDQUFDa0IsWUFBRCxDQUFQO0FBQ0E7QUFDRCxXQVREO0FBVUE7QUFDRCxPQXpCTSxDQUFQO0FBMEJBLEtBL0NPO0FBZ0RSOEMsSUFBQUEsU0FoRFEscUJBZ0RFSCxVQWhERixFQWdEYTtBQUFBOztBQUNwQixVQUFJSSxHQUFHLEdBQUc1RixDQUFDLHFCQUFjd0YsVUFBZCxPQUFYO0FBQ0FwRixNQUFBQSxTQUFTLENBQUNPLElBQVYsQ0FBZSxTQUFmO0FBQ0F0QixNQUFBQSxFQUFFLENBQUM0QixHQUFILFlBQVd1RSxVQUFYLGVBQWlDLE1BQWpDLEVBQXlDO0FBQUMsbUJBQVdJLEdBQUcsQ0FBQ0MsR0FBSjtBQUFaLE9BQXpDLEVBQWtFLFVBQUMzRSxHQUFELEVBQVM7QUFDMUVkLFFBQUFBLFNBQVMsQ0FBQ1EsS0FBVjs7QUFDQSxZQUFJTSxHQUFHLENBQUNZLEVBQVIsRUFBVztBQUNWQyxVQUFBQSxLQUFLLENBQUMsb0JBQUQsQ0FBTDs7QUFDQSxVQUFBLE1BQUksQ0FBQytELFFBQUwsQ0FBY04sVUFBZCxFQUEwQkksR0FBRyxDQUFDQyxHQUFKLEVBQTFCOztBQUNBRCxVQUFBQSxHQUFHLENBQUNDLEdBQUosQ0FBUSxFQUFSO0FBQ0EsU0FKRCxNQUlLO0FBQ0o5RCxVQUFBQSxLQUFLLENBQUMsWUFBRCxDQUFMO0FBQ0E7QUFDRCxPQVREO0FBVUEsS0E3RE87QUE4RFIrRCxJQUFBQSxRQTlEUSxvQkE4RENOLFVBOURELEVBOERhZixJQTlEYixFQThEa0I7QUFDekIsV0FBS3RDLFFBQUwsQ0FBY1ksT0FBZCxDQUFzQixVQUFBTCxJQUFJLEVBQUU7QUFDM0IsWUFBSUEsSUFBSSxDQUFDWixFQUFMLElBQVcwRCxVQUFmLEVBQTBCO0FBQ3pCLGNBQUlPLFNBQVMsR0FBRztBQUNmdkUsWUFBQUEsUUFBUSxFQUFFdEIsU0FBUyxDQUFDc0IsUUFETDtBQUVmaUQsWUFBQUEsSUFBSSxFQUFFQSxJQUZTO0FBR2ZELFlBQUFBLFNBQVMsRUFBRUQsTUFBTTtBQUhGLFdBQWhCO0FBS0E3QixVQUFBQSxJQUFJLENBQUNDLE9BQUwsQ0FBYXBDLElBQWIsQ0FBa0J5QyxJQUFsQixDQUF1QitDLFNBQXZCO0FBQ0E7QUFDRCxPQVREO0FBVUEsS0F6RU87QUEwRVJDLElBQUFBLFdBMUVRLHVCQTBFSUMsUUExRUosRUEwRWE7QUFBQTs7QUFDcEI3RixNQUFBQSxTQUFTLENBQUNPLElBQVYsQ0FBZSxTQUFmO0FBQ0F0QixNQUFBQSxFQUFFLENBQUM0QixHQUFILFlBQVdnRixRQUFYLGdCQUFnQyxNQUFoQyxFQUF3QztBQUFDLG1CQUFVLEtBQUtoQztBQUFoQixPQUF4QyxFQUF3RSxVQUFDL0MsR0FBRCxFQUFTO0FBQ2hGZCxRQUFBQSxTQUFTLENBQUNRLEtBQVY7O0FBQ0EsWUFBSU0sR0FBRyxDQUFDWSxFQUFSLEVBQVc7QUFDVkMsVUFBQUEsS0FBSyxDQUFDLHNCQUFELENBQUw7O0FBQ0EsVUFBQSxNQUFJLENBQUNtRSxVQUFMLENBQWdCRCxRQUFoQixFQUEwQixNQUFJLENBQUNoQyxhQUEvQjs7QUFDQSxVQUFBLE1BQUksQ0FBQ0EsYUFBTCxHQUFxQixFQUFyQjtBQUNBLFNBSkQsTUFJSztBQUNKbEMsVUFBQUEsS0FBSyxDQUFDLFlBQUQsQ0FBTDtBQUNBO0FBQ0QsT0FURDtBQVVBLEtBdEZPO0FBdUZSbUUsSUFBQUEsVUF2RlEsc0JBdUZHRCxRQXZGSCxFQXVGYXhCLElBdkZiLEVBdUZrQjtBQUN6QixVQUFJMEIsV0FBVyxHQUFHO0FBQ2pCckUsUUFBQUEsRUFBRSxFQUFFbUUsUUFEYTtBQUVqQnpFLFFBQUFBLFFBQVEsRUFBRXRCLFNBQVMsQ0FBQ3NCLFFBRkg7QUFHakJpRCxRQUFBQSxJQUFJLEVBQUVBLElBSFc7QUFJakJELFFBQUFBLFNBQVMsRUFBRUQsTUFBTSxFQUpBO0FBS2pCNUIsUUFBQUEsT0FBTyxFQUFFO0FBQUNwQyxVQUFBQSxJQUFJLEVBQUM7QUFBTjtBQUxRLE9BQWxCO0FBT0EsV0FBSzRCLFFBQUwsQ0FBY2EsSUFBZCxDQUFtQm1ELFdBQW5CO0FBQ0EsS0FoR087QUFpR1JDLElBQUFBLFFBakdRLHNCQWlHRTtBQUNULFdBQUt6RixJQUFMLEdBQVksS0FBWjtBQUNBLFdBQUt3QixRQUFMLEdBQWdCLEVBQWhCO0FBQ0FqQyxNQUFBQSxTQUFTLENBQUNXLElBQVYsR0FBaUIsQ0FBakI7QUFDQSxLQXJHTztBQXNHUndGLElBQUFBLE1BdEdRLGtCQXNHRHBFLElBdEdDLEVBc0dJO0FBQ1gsV0FBSzBCLFdBQUwsR0FBbUIsRUFBbkI7QUFDQXpELE1BQUFBLFNBQVMsQ0FBQzhCLGFBQVYsQ0FBd0JDLElBQXhCO0FBQ0E7QUF6R08sR0E3R21CO0FBd041QnFFLEVBQUFBLE9BeE40QixxQkF3TmxCLENBRVQ7QUExTjJCLENBQVIsQ0FBckI7O0FBOE5BLFNBQVNDLFNBQVQsQ0FBbUJDLEdBQW5CLEVBQXdCO0FBQ3ZCLE1BQUlDLEtBQUssR0FBR3pHLENBQUMsQ0FBQ3lDLEdBQUYsQ0FBTStELEdBQU4sRUFBVyxVQUFVRSxLQUFWLEVBQWlCQyxLQUFqQixFQUF3QjtBQUM5QyxXQUFPLENBQUNELEtBQUQsQ0FBUDtBQUNBLEdBRlcsQ0FBWjtBQUdBLFNBQU9ELEtBQVA7QUFDQTs7QUFFRCxTQUFTckIsY0FBVCxDQUF3QndCLENBQXhCLEVBQTJCO0FBQzFCLE1BQUlDLEdBQUcsR0FBRyxJQUFJQyxLQUFKLEVBQVY7QUFDQSxNQUFJeEIsQ0FBSixFQUFPeUIsQ0FBUCxFQUFVQyxDQUFWOztBQUNBLE9BQUsxQixDQUFDLEdBQUcsQ0FBVCxFQUFZQSxDQUFDLEdBQUdzQixDQUFoQixFQUFtQixFQUFFdEIsQ0FBckIsRUFBd0I7QUFDdkJ1QixJQUFBQSxHQUFHLENBQUN2QixDQUFELENBQUgsR0FBU0EsQ0FBVDtBQUNBOztBQUNELE9BQUtBLENBQUMsR0FBRyxDQUFULEVBQVlBLENBQUMsR0FBR3NCLENBQWhCLEVBQW1CLEVBQUV0QixDQUFyQixFQUF3QjtBQUN2QnlCLElBQUFBLENBQUMsR0FBR0UsSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0UsTUFBTCxLQUFnQlAsQ0FBM0IsQ0FBSjtBQUNBSSxJQUFBQSxDQUFDLEdBQUdILEdBQUcsQ0FBQ0UsQ0FBRCxDQUFQO0FBQ0FGLElBQUFBLEdBQUcsQ0FBQ0UsQ0FBRCxDQUFILEdBQVNGLEdBQUcsQ0FBQ3ZCLENBQUQsQ0FBWjtBQUNBdUIsSUFBQUEsR0FBRyxDQUFDdkIsQ0FBRCxDQUFILEdBQVMwQixDQUFUO0FBQ0E7O0FBQ0QsU0FBT0gsR0FBUDtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGNvbmZpZyA9IHtcclxuXHRhdXRoOiAnaW5zdGFncmFtX2Jhc2ljLCBtYW5hZ2VfcGFnZXMsIGluc3RhZ3JhbV9tYW5hZ2VfY29tbWVudHMnLFxyXG5cdGF1dGhfc2NvcGU6ICcnLFxyXG5cdHBhZ2VUb2tlbjogJycsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHRnZXRBdXRoOiAoKSA9PiB7XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRhdXRoX3R5cGU6ICdyZXJlcXVlc3QnICxcclxuXHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpID0+IHtcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbmZpZy5hdXRoX3Njb3BlID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdCQoJyNsb2dpbicpLnJlbW92ZSgpO1xyXG5cdFx0XHR2dWVfc3RlcHMuZ2V0UGFnZXMoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcbn1cclxuY29uc3QgdnVlX3BvcHVwID0gbmV3IFZ1ZSh7XHJcblx0ZWw6ICcjcG9wdXAnLFxyXG5cdGRhdGE6IHtcclxuXHRcdHRhcmdldDogZmFsc2UsXHJcblx0XHRhbGxfbGVuZ3RoOiAwLFxyXG5cdH0sXHJcblx0bWV0aG9kczoge1xyXG5cdFx0c2hvdyh0YXJnZXQpe1xyXG5cdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuXHRcdH0sXHJcblx0XHRjbG9zZSgpe1xyXG5cdFx0XHR0aGlzLnRhcmdldCA9IGZhbHNlO1xyXG5cdFx0fSxcclxuXHRcdFxyXG5cdH1cclxufSk7XHJcblxyXG5jb25zdCB2dWVfc3RlcHMgPSBuZXcgVnVlKHtcclxuXHRlbDogJyN2dWVfc3RlcHMnLFxyXG5cdGRhdGE6IHtcclxuXHRcdHN0ZXA6IC0xLFxyXG5cdFx0cGFnZXM6IFtdLFxyXG5cdFx0cG9zdHM6IFtdLFxyXG5cdH0sXHJcblx0d2F0Y2g6e1xyXG5cdFx0Ly8gc3RlcCh2YWwsIG9sZHZhbCl7XHJcblx0XHQvLyBcdGlmICh2YWwgPT0gMil7XHJcblx0XHQvLyBcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0Ly8gXHRcdFx0ZmxhdHBpY2tyKFwiLnN0YXJ0X3RpbWVcIiwge1xyXG5cdFx0Ly8gXHRcdFx0XHRlbmFibGVUaW1lOiB0cnVlLFxyXG5cdFx0Ly8gXHRcdFx0XHRkYXRlRm9ybWF0OiBcIlktbS1kIEg6aVwiLFxyXG5cdFx0Ly8gXHRcdFx0XHR0aW1lXzI0aHI6IHRydWUsXHJcblx0XHQvLyBcdFx0XHRcdG9uQ2hhbmdlOiBmdW5jdGlvbihzZWxlY3RlZERhdGVzLCBkYXRlU3RyLCBpbnN0YW5jZSkge1xyXG5cdFx0Ly8gXHRcdFx0XHRcdHZ1ZV9jb21tZW50cy5zdGFydF90aW1lID0gc2VsZWN0ZWREYXRlcztcclxuXHRcdC8vIFx0XHRcdFx0fVxyXG5cdFx0Ly8gXHRcdFx0fSk7XHJcblx0XHQvLyBcdFx0XHRmbGF0cGlja3IoXCIuZW5kX3RpbWVcIiwge1xyXG5cdFx0Ly8gXHRcdFx0XHRlbmFibGVUaW1lOiB0cnVlLFxyXG5cdFx0Ly8gXHRcdFx0XHRkYXRlRm9ybWF0OiBcIlktbS1kIEg6aVwiLFxyXG5cdFx0Ly8gXHRcdFx0XHR0aW1lXzI0aHI6IHRydWUsXHJcblx0XHQvLyBcdFx0XHRcdG9uQ2hhbmdlOiBmdW5jdGlvbihzZWxlY3RlZERhdGVzLCBkYXRlU3RyLCBpbnN0YW5jZSkge1xyXG5cdFx0Ly8gXHRcdFx0XHRcdHZ1ZV9jb21tZW50cy5lbmRfdGltZSA9IHNlbGVjdGVkRGF0ZXM7XHJcblx0XHQvLyBcdFx0XHRcdH1cclxuXHRcdC8vIFx0XHRcdH0pO1xyXG5cdFx0Ly8gXHRcdH0sIDMwMCk7XHJcblx0XHQvLyBcdH1lbHNlIGlmKG9sZHZhbCA9PSAyKXtcclxuXHRcdC8vIFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0X3RpbWVcIikuX2ZsYXRwaWNrci5kZXN0cm95KCk7XHJcblx0XHQvLyBcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lbmRfdGltZVwiKS5fZmxhdHBpY2tyLmRlc3Ryb3koKTtcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gfVxyXG5cdH0sXHJcblx0bWV0aG9kczoge1xyXG5cdFx0Z2V0UGFnZXMoKXtcclxuXHRcdFx0RkIuYXBpKGAvbWUvYWNjb3VudHM/bGltaXQ9NTBgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5zdGVwID0gMDtcclxuXHRcdFx0XHR0aGlzLnBhZ2VzID0gcmVzLmRhdGE7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdGdldFBvc3RzKHBhZ2VpZCl7XHJcblx0XHRcdGdldElHaWQocGFnZWlkKS50aGVuKElHaWQgPT57XHJcblx0XHRcdFx0RkIuYXBpKGAvJHtJR2lkfT9maWVsZHM9dXNlcm5hbWVgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnVzZXJuYW1lID0gcmVzLnVzZXJuYW1lO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdEZCLmFwaShgLyR7SUdpZH0vbWVkaWE/ZmllbGRzPWxpa2VfY291bnQsY29tbWVudHNfY291bnQscGVybWFsaW5rLG1lZGlhX3R5cGUsY2FwdGlvbixtZWRpYV91cmwsY29tbWVudHN7dXNlcm5hbWUsdGV4dCx0aW1lc3RhbXB9LHRpbWVzdGFtcCZsaW1pdD0xMDBgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0XHQvLyBsb2NhbFN0b3JhZ2UuaWdfcG9zdHMgPSBKU09OLnN0cmluZ2lmeShyZXMuZGF0YSk7XHJcblx0XHRcdFx0XHR0aGlzLmNob29zZVBvc3QocmVzLmRhdGEpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHRmdW5jdGlvbiBnZXRJR2lkKHBhZ2VpZCl7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+e1xyXG5cdFx0XHRcdFx0RkIuYXBpKGAvJHtwYWdlaWR9Lz9maWVsZHM9aW5zdGFncmFtX2J1c2luZXNzX2FjY291bnRgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuaW5zdGFncmFtX2J1c2luZXNzX2FjY291bnQpe1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUocmVzLmluc3RhZ3JhbV9idXNpbmVzc19hY2NvdW50LmlkKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0YWxlcnQoJ+atpOeyiee1suWwiOmggeeEoemAo+e1kCBJbnN0YWdyYW0g5biz6JmfJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Z2V0UG9zdERldGFpbChwb3N0KXtcclxuXHRcdFx0dnVlX2NvbW1lbnRzLmNvbW1lbnRzID0gW107XHJcblx0XHRcdHZ1ZV9wb3B1cC5hbGxfbGVuZ3RoID0gMDtcclxuXHRcdFx0dnVlX3BvcHVwLnNob3coJ2ZldGNoaW5nJyk7XHJcblx0XHRcdGxldCBtZWRpYWlkID0gcG9zdC5pZDtcclxuXHRcdFx0dnVlX2NvbW1lbnRzLnBvc3QgPSBwb3N0O1xyXG5cdFx0XHR0aGlzLmdldERhdGEobWVkaWFpZCkudGhlbihyZXM9PntcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhyZXMpO1xyXG5cdFx0XHRcdGxldCBhcnIgPSByZXMubWFwKGl0ZW09PntcclxuXHRcdFx0XHRcdGlmIChpdGVtLnJlcGxpZXMpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gaXRlbTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRpdGVtLnJlcGxpZXMgPSB7fTtcclxuXHRcdFx0XHRcdFx0aXRlbS5yZXBsaWVzLmRhdGEgPSBbXTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0Ly8gbG9jYWxTdG9yYWdlLmlnX3Bvc3QgPSBKU09OLnN0cmluZ2lmeShhcnIpO1xyXG5cdFx0XHRcdHZ1ZV9wb3B1cC5jbG9zZSgpO1xyXG5cdFx0XHRcdHRoaXMuc2hvd0NvbW1lbnRzKGFycik7XHJcblx0XHRcdH0pXHJcblx0XHR9LFxyXG5cdFx0Z2V0RGF0YShtZWRpYWlkKXtcclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmU9PntcclxuXHRcdFx0XHRsZXQgY29tbWVudHNfYXJyID0gW107XHJcblx0XHRcdFx0RkIuYXBpKGAvJHttZWRpYWlkfS9jb21tZW50cz9maWVsZHM9aWQsdGV4dCxtZWRpYSx0aW1lc3RhbXAsdXNlcix1c2VybmFtZSxyZXBsaWVzLmxpbWl0KDUwKXt0ZXh0LHRpbWVzdGFtcCx1c2VybmFtZX0mbGltaXQ9M2AsIHJlcz0+e1xyXG5cdFx0XHRcdFx0dnVlX3BvcHVwLmFsbF9sZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0cmVzLmRhdGEuZm9yRWFjaChpdGVtPT57XHJcblx0XHRcdFx0XHRcdGNvbW1lbnRzX2Fyci5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRpZiAocmVzLnBhZ2luZyl7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGNvbW1lbnRzX2Fycik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsKXtcclxuXHRcdFx0XHRcdCQuZ2V0SlNPTih1cmwsIHJlcz0+e1xyXG5cdFx0XHRcdFx0XHR2dWVfcG9wdXAuYWxsX2xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdHJlcy5kYXRhLmZvckVhY2goaXRlbT0+e1xyXG5cdFx0XHRcdFx0XHRcdGNvbW1lbnRzX2Fyci5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0aWYgKHJlcy5wYWdpbmcpe1xyXG5cdFx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShjb21tZW50c19hcnIpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdGNob29zZVBvc3QoZGF0YSl7XHJcblx0XHRcdHRoaXMucG9zdHMgPSBkYXRhO1xyXG5cdFx0XHR0aGlzLnN0ZXAgPSAxO1xyXG5cdFx0fSxcclxuXHRcdHNob3dDb21tZW50cyhkYXRhKXtcclxuXHRcdFx0dGhpcy5zdGVwID0gMjtcclxuXHRcdFx0dnVlX2NvbW1lbnRzLnNob3cgPSB0cnVlO1xyXG5cdFx0XHR2dWVfY29tbWVudHMuY29tbWVudHMgPSBkYXRhO1xyXG5cdFx0fSxcclxuXHR9XHJcbn0pO1xyXG5cclxuY29uc3QgdnVlX2NvbW1lbnRzID0gbmV3IFZ1ZSh7XHJcblx0ZWw6ICcjdnVlX2NvbW1lbnRzJyxcclxuXHRkYXRhOiB7XHJcblx0XHRzaG93OiBmYWxzZSxcclxuXHRcdHBvc3Q6IHt9LFxyXG5cdFx0ZXh0ZW5kX2NhcHRpb246IGZhbHNlLFxyXG5cdFx0Y29tbWVudHM6IFtdLFxyXG5cdFx0a2V5d29yZDogJycsXHJcblx0XHRyZW1vdmVEdXBsaWNhdGU6IGZhbHNlLFxyXG5cdFx0ZGVzYzogZmFsc2UsXHJcblx0XHR3aW5uZXI6ICcnLFxyXG5cdFx0d2lubmVyX2xpc3Q6IFtdLFxyXG5cdFx0c3RhcnRfdGltZTogJycsXHJcblx0XHRlbmRfdGltZTogJycsXHJcblx0XHRzaG93VHlwZTogJ3N0YW5kYXJkJyxcclxuXHRcdG91dHB1dDoge30sXHJcblx0XHRyZXBseV9pbnB1dDogJycsXHJcblx0XHRjb21tZW50X2lucHV0OiAnJyxcclxuXHRcdHNob3dfcmVwbHk6IFtdLFxyXG5cdH0sXHJcblx0Y29tcHV0ZWQ6IHtcclxuXHRcdGZpbHRlcl9jb21tZW50KCl7XHJcblx0XHRcdGxldCBmaW5hbF9hcnIgPSB0aGlzLmNvbW1lbnRzO1xyXG5cdFx0XHRpZiAodGhpcy5zdGFydF90aW1lICE9PSAnJyl7XHJcblx0XHRcdFx0ZmluYWxfYXJyID0gZmluYWxfYXJyLmZpbHRlcihpdGVtPT57XHJcblx0XHRcdFx0XHRyZXR1cm4gbW9tZW50KGl0ZW0udGltZXN0YW1wKSA+IG1vbWVudCh0aGlzLnN0YXJ0X3RpbWUpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMuZW5kX3RpbWUgIT09ICcnKXtcclxuXHRcdFx0XHRmaW5hbF9hcnIgPSBmaW5hbF9hcnIuZmlsdGVyKGl0ZW09PntcclxuXHRcdFx0XHRcdHJldHVybiBtb21lbnQoaXRlbS50aW1lc3RhbXApIDwgbW9tZW50KHRoaXMuZW5kX3RpbWUpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMua2V5d29yZCAhPT0gJycpe1xyXG5cdFx0XHRcdGZpbmFsX2FyciA9IGZpbmFsX2Fyci5maWx0ZXIoaXRlbT0+e1xyXG5cdFx0XHRcdFx0cmV0dXJuIGl0ZW0udGV4dC5pbmRleE9mKHRoaXMua2V5d29yZCkgPj0gMDtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLnJlbW92ZUR1cGxpY2F0ZSl7XHJcblx0XHRcdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0XHRcdGxldCBrZXlzID0gW107XHJcblx0XHRcdFx0ZmluYWxfYXJyLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdFx0XHRcdGxldCBrZXkgPSBpdGVtLnVzZXIuaWQ7XHJcblx0XHRcdFx0XHRpZiAoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRmaW5hbF9hcnIgPSBvdXRwdXQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmRlc2Mpe1xyXG5cdFx0XHRcdGZpbmFsX2Fyci5zb3J0KGZ1bmN0aW9uKGEsIGIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIG1vbWVudChiLnRpbWVzdGFtcCkgLSBtb21lbnQoYS50aW1lc3RhbXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGZpbmFsX2Fyci5mb3JFYWNoKGl0ZW09PntcclxuXHRcdFx0XHRcdGl0ZW0ucmVwbGllcy5kYXRhLnNvcnQoZnVuY3Rpb24oYSwgYil7XHJcblx0XHRcdFx0XHRcdHJldHVybiBtb21lbnQoYi50aW1lc3RhbXApIC0gbW9tZW50KGEudGltZXN0YW1wKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmaW5hbF9hcnIuc29ydChmdW5jdGlvbihhLCBiKXtcclxuXHRcdFx0XHRcdHJldHVybiBtb21lbnQoYS50aW1lc3RhbXApIC0gbW9tZW50KGIudGltZXN0YW1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRmaW5hbF9hcnIuZm9yRWFjaChpdGVtPT57XHJcblx0XHRcdFx0XHRpdGVtLnJlcGxpZXMuZGF0YS5zb3J0KGZ1bmN0aW9uKGEsIGIpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gbW9tZW50KGEudGltZXN0YW1wKSAtIG1vbWVudChiLnRpbWVzdGFtcCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0JCgnLnJlcGxpZXNbY2lkXScpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblxyXG5cdFx0XHQvLyBsZXQgb3V0cHV0ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShmaW5hbF9hcnIpKTtcclxuXHRcdFx0Ly8gbGV0IGNvbW1lbnRfYXJyID0gW107XHJcblx0XHRcdC8vIGxldCByZXBseV9hcnIgPSBbXTtcclxuXHRcdFx0Ly8gb3V0cHV0LmZvckVhY2goKGl0ZW0saW5kZXgpPT57XHJcblx0XHRcdC8vIFx0aXRlbS5jb21tZW50X2luZGV4ID0gaW5kZXg7XHJcblx0XHRcdC8vIFx0aXRlbS5yZXBseS5mb3JFYWNoKChyZXBseV9pdGVtLCBqKT0+e1xyXG5cdFx0XHQvLyBcdFx0cmVwbHlfaXRlbS5jb21tZW50X2luZGV4ID0gaW5kZXg7XHJcblx0XHRcdC8vIFx0XHRyZXBseV9pdGVtLnJlcGx5X2luZGV4ID0gajtcclxuXHRcdFx0Ly8gXHRcdHJlcGx5X2Fyci5wdXNoKHJlcGx5X2l0ZW0pO1xyXG5cdFx0XHQvLyBcdH0pXHJcblx0XHRcdC8vIFx0ZGVsZXRlIGl0ZW1bJ3JlcGx5J107XHJcblx0XHRcdC8vIFx0Y29tbWVudF9hcnIucHVzaChpdGVtKTtcclxuXHRcdFx0Ly8gfSk7XHJcblx0XHRcdC8vIHRoaXMub3V0cHV0LmNvbW1lbnRzID0gY29tbWVudF9hcnI7XHJcblx0XHRcdC8vIHRoaXMub3V0cHV0LnJlcGx5cyA9IHJlcGx5X2FycjtcclxuXHJcblx0XHRcdHJldHVybiBmaW5hbF9hcnI7XHJcblx0XHR9XHJcblx0fSxcclxuXHR3YXRjaDoge1xyXG5cdFx0Ly8ga2V5d29yZCgpe1xyXG5cdFx0Ly8gXHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHQvLyB9LFxyXG5cdFx0cmVtb3ZlRHVwbGljYXRlKCl7XHJcblx0XHRcdHRoaXMud2lubmVyX2xpc3QgPSBbXTtcclxuXHRcdH0sXHJcblx0XHQvLyBzdGFydF90aW1lKCl7XHJcblx0XHQvLyBcdHRoaXMud2lubmVyX2xpc3QgPSBbXTtcclxuXHRcdC8vIH0sXHJcblx0XHQvLyBlbmRfdGltZSgpe1xyXG5cdFx0Ly8gXHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHQvLyB9LFxyXG5cdFx0d2lubmVyKCl7XHJcblx0XHRcdHRoaXMud2lubmVyX2xpc3QgPSBbXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdG1ldGhvZHM6IHtcclxuXHRcdGNob29zZSgpe1xyXG5cdFx0XHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHRcdGxldCB0b3RhbCA9IHRoaXMuZmlsdGVyX2NvbW1lbnQubGVuZ3RoO1xyXG5cdFx0XHRsZXQgd2lubmVyX2xpc3QgPSBnZW5SYW5kb21BcnJheSh0b3RhbCkuc3BsaWNlKDAsIHRoaXMud2lubmVyKTtcclxuXHRcdFx0Zm9yKGxldCBpIG9mIHdpbm5lcl9saXN0KXtcclxuXHRcdFx0XHR0aGlzLndpbm5lcl9saXN0LnB1c2godGhpcy5maWx0ZXJfY29tbWVudFtpXSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRzaG93KHR5cGUpe1xyXG5cdFx0XHR0aGlzLnNob3dUeXBlID0gdHlwZTtcclxuXHRcdH0sXHJcblx0XHRyZXBseShjb21tZW50X2lkKXtcclxuXHRcdFx0bGV0IHBvcyA9IHRoaXMuc2hvd19yZXBseS5pbmRleE9mKGNvbW1lbnRfaWQpO1xyXG5cdFx0XHRpZiAocG9zIDwgMCl7XHJcblx0XHRcdFx0dGhpcy5zaG93X3JlcGx5LnB1c2goY29tbWVudF9pZCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHRoaXMuc2hvd19yZXBseS5zcGxpY2UocG9zLCAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGdldFJlcGx5KGNvbW1lbnRfaWQpe1xyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZT0+e1xyXG5cdFx0XHRcdGxldCBjb21tZW50c19hcnIgPSBbXTtcclxuXHRcdFx0XHRGQi5hcGkoYC8ke2NvbW1lbnRfaWR9L3JlcGxpZXM/ZmllbGRzPXVzZXJuYW1lLHRpbWVzdGFtcCx0ZXh0JmxpbWl0PTNgLCByZXM9PntcclxuXHRcdFx0XHRcdHJlcy5kYXRhLmZvckVhY2goaXRlbT0+e1xyXG5cdFx0XHRcdFx0XHRjb21tZW50c19hcnIucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aWYgKHJlcy5wYWdpbmcpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShjb21tZW50c19hcnIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCl7XHJcblx0XHRcdFx0XHQkLmdldEpTT04odXJsLCByZXM9PntcclxuXHRcdFx0XHRcdFx0cmVzLmRhdGEuZm9yRWFjaChpdGVtPT57XHJcblx0XHRcdFx0XHRcdFx0Y29tbWVudHNfYXJyLnB1c2goaXRlbSk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLnBhZ2luZyl7XHJcblx0XHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGNvbW1lbnRzX2Fycik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0c2VuZFJlcGx5KGNvbW1lbnRfaWQpe1xyXG5cdFx0XHRsZXQgdGFyID0gJChgaW5wdXRbY2lkPSR7Y29tbWVudF9pZH1dYCk7XHJcblx0XHRcdHZ1ZV9wb3B1cC5zaG93KCdsb2FkaW5nJyk7XHJcblx0XHRcdEZCLmFwaShgLyR7Y29tbWVudF9pZH0vcmVwbGllc2AsICdQT1NUJywge1wibWVzc2FnZVwiOiB0YXIudmFsKCl9LCBcdChyZXMpID0+IHtcclxuXHRcdFx0XHR2dWVfcG9wdXAuY2xvc2UoKTtcclxuXHRcdFx0XHRpZiAocmVzLmlkKXtcclxuXHRcdFx0XHRcdGFsZXJ0KCdhZGQgcmVwbHkgc3VjY2VzcyEnKTtcclxuXHRcdFx0XHRcdHRoaXMuYWRkUmVwbHkoY29tbWVudF9pZCwgdGFyLnZhbCgpKTtcclxuXHRcdFx0XHRcdHRhci52YWwoJycpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0YWxlcnQoJ+eZvOeUn+mMr+iqpO+8jOiri+eojeW+jOWGjeippicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0YWRkUmVwbHkoY29tbWVudF9pZCwgdGV4dCl7XHJcblx0XHRcdHRoaXMuY29tbWVudHMuZm9yRWFjaChpdGVtPT57XHJcblx0XHRcdFx0aWYgKGl0ZW0uaWQgPT0gY29tbWVudF9pZCl7XHJcblx0XHRcdFx0XHRsZXQgcmVwbHlfb2JqID0ge1xyXG5cdFx0XHRcdFx0XHR1c2VybmFtZTogdnVlX3N0ZXBzLnVzZXJuYW1lLFxyXG5cdFx0XHRcdFx0XHR0ZXh0OiB0ZXh0LFxyXG5cdFx0XHRcdFx0XHR0aW1lc3RhbXA6IG1vbWVudCgpLFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aXRlbS5yZXBsaWVzLmRhdGEucHVzaChyZXBseV9vYmopO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0c2VuZENvbW1lbnQobWVkaWFfaWQpe1xyXG5cdFx0XHR2dWVfcG9wdXAuc2hvdygnbG9hZGluZycpO1xyXG5cdFx0XHRGQi5hcGkoYC8ke21lZGlhX2lkfS9jb21tZW50c2AsICdQT1NUJywge1wibWVzc2FnZVwiOnRoaXMuY29tbWVudF9pbnB1dH0sIChyZXMpID0+IHtcclxuXHRcdFx0XHR2dWVfcG9wdXAuY2xvc2UoKTtcclxuXHRcdFx0XHRpZiAocmVzLmlkKXtcclxuXHRcdFx0XHRcdGFsZXJ0KCdhZGQgY29tbWVudCBzdWNjZXNzIScpO1xyXG5cdFx0XHRcdFx0dGhpcy5hZGRDb21tZW50KG1lZGlhX2lkLCB0aGlzLmNvbW1lbnRfaW5wdXQpO1xyXG5cdFx0XHRcdFx0dGhpcy5jb21tZW50X2lucHV0ID0gJyc7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRhbGVydCgn55m855Sf6Yyv6Kqk77yM6KuL56iN5b6M5YaN6KmmJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHRhZGRDb21tZW50KG1lZGlhX2lkLCB0ZXh0KXtcclxuXHRcdFx0bGV0IGNvbW1lbnRfb2JqID0ge1xyXG5cdFx0XHRcdGlkOiBtZWRpYV9pZCxcclxuXHRcdFx0XHR1c2VybmFtZTogdnVlX3N0ZXBzLnVzZXJuYW1lLFxyXG5cdFx0XHRcdHRleHQ6IHRleHQsXHJcblx0XHRcdFx0dGltZXN0YW1wOiBtb21lbnQoKSxcclxuXHRcdFx0XHRyZXBsaWVzOiB7ZGF0YTpbXX0sXHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5jb21tZW50cy5wdXNoKGNvbW1lbnRfb2JqKTtcclxuXHRcdH0sXHJcblx0XHRiYWNrU3RlcCgpe1xyXG5cdFx0XHR0aGlzLnNob3cgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5jb21tZW50cyA9IFtdO1xyXG5cdFx0XHR2dWVfc3RlcHMuc3RlcCA9IDE7XHJcblx0XHR9LFxyXG5cdFx0cmVsb2FkKHBvc3Qpe1xyXG5cdFx0XHR0aGlzLndpbm5lcl9saXN0ID0gW107XHJcblx0XHRcdHZ1ZV9zdGVwcy5nZXRQb3N0RGV0YWlsKHBvc3QpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0bW91bnRlZCgpIHtcclxuXHRcdFxyXG5cdH0sXHJcbn0pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIG9iajJBcnJheShvYmopIHtcclxuXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcclxuXHRcdHJldHVybiBbdmFsdWVdO1xyXG5cdH0pO1xyXG5cdHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG5cdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuXHR2YXIgaSwgciwgdDtcclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRhcnlbaV0gPSBpO1xyXG5cdH1cclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcblx0XHR0ID0gYXJ5W3JdO1xyXG5cdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG5cdFx0YXJ5W2ldID0gdDtcclxuXHR9XHJcblx0cmV0dXJuIGFyeTtcclxufVxyXG4iXSwiZmlsZSI6Im1haW4uanMifQ==
