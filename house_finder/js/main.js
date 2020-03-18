"use strict";

document.body.addEventListener('touchmove', function (e) {
  if (e._isScroller) return e.preventDefault();
}, {
  passive: false
});
var address_code = [{
  name: '台北市',
  region: '1',
  section: [{
    code: 1,
    name: '中正區'
  }, {
    code: 2,
    name: '大同區'
  }, {
    code: 3,
    name: '中山區'
  }, {
    code: 4,
    name: '松山區'
  }, {
    code: 5,
    name: '大安區'
  }, {
    code: 6,
    name: '萬華區'
  }, {
    code: 7,
    name: '信義區'
  }, {
    code: 8,
    name: '士林區'
  }, {
    code: 9,
    name: '北投區'
  }, {
    code: 10,
    name: '內湖區'
  }, {
    code: 11,
    name: '南港區'
  }, {
    code: 12,
    name: '文山區'
  }]
}, {
  name: '新北市',
  region: '3',
  section: [{
    code: 26,
    name: '板橋區'
  }, {
    code: 38,
    name: '中和區'
  }, {
    code: 44,
    name: '新莊區'
  }, {
    code: 43,
    name: '三重區'
  }, {
    code: 50,
    name: '淡水區'
  }, {
    code: 34,
    name: '新店區'
  }, {
    code: 27,
    name: '汐止區'
  }, {
    code: 37,
    name: '永和區'
  }, {
    code: 39,
    name: '土城區'
  }, {
    code: 47,
    name: '蘆洲區'
  }, {
    code: 41,
    name: '樹林區'
  }]
}];

function readme() {
  var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (e) {
    e.preventDefault();
  }

  $('.popup').toggleClass('show');
}

var app = new Vue({
  el: '#app',
  data: {
    send_login: false,
    have_data: false,
    is_edit: false,
    location: address_code,
    last_time: false,
    region: '1',
    section_list: address_code[0].section,
    section: '0',
    token: '',
    range_top: '10000',
    range_bottom: '0',
    username: '',
    user_id: ''
  },
  watch: {
    region: function region(val) {
      var _this = this;

      this.location.forEach(function (city) {
        if (city.region == val) {
          _this.section_list = city.section;
        }
      });
    },
    is_edit: function is_edit(val) {
      if (val === true) {
        $('.ps').text('');
      }
    }
  },
  computed: {
    placeWord: function placeWord() {
      var _this2 = this;

      var word = '擷取資料中...';
      this.location.forEach(function (item) {
        if (item.region == _this2.region) {
          item.section.forEach(function (sec) {
            if (sec.code == _this2.section) {
              word = item.name + sec.name;
            }
          });
        }
      });
      if (this.have_data) word += "<br>\u9810\u7B97".concat(this.range_bottom, " ~ ").concat(this.range_top);
      return word;
    }
  },
  methods: {
    login: function login() {
      var _this3 = this;

      if (!this.send_login) {
        this.send_login = true;
        FB.getLoginStatus(function (response) {
          if (response.status === 'connected') {
            $('.fb-login-button').remove();

            _this3.init(response.authResponse.userID);
          } else {}
        });
      }
    },
    init: function init(user_id) {
      var _this4 = this;

      $.get('https://script.google.com/macros/s/AKfycbySNDZ11nc1jYQEnaCEDU_vVNKuDKn7rTfze8fJaN9NpZ7_DIU/exec?userID=' + user_id, function (res) {
        if (res.user_id) {
          _this4.have_data = true;
          _this4.username = res.username;
          _this4.user_id = res.user_id;
          _this4.token = res.token;
          _this4.region = res.region;
          _this4.section = res.section;
          _this4.range_bottom = res.range_bottom;
          _this4.range_top = res.range_top;

          if (res.range_top == -1) {
            _this4.is_edit = true;
          }
        } else {
          FB.api('/me', function (response) {
            _this4.username = response.name;
            _this4.user_id = response.id;
            _this4.is_edit = true;
          });
        }
      }); // if (newuser){
      // }else{
      //     $.get('https://script.google.com/macros/s/AKfycbznCv9IL3xLA3J6BGAK3iCxT9r1Iy12Q6lyfUwR/exec?userID=' + user_id, e =>{
      //         e.username = "Teddy Huang"
      //         $.post('https://script.google.com/macros/s/AKfycbySNDZ11nc1jYQEnaCEDU_vVNKuDKn7rTfze8fJaN9NpZ7_DIU/exec', e, function(res){
      //             console.log(res);
      //         })
      //     })
      // }
    },
    send: function send() {
      var _this5 = this;

      if (this.section == 0) {
        alert('請選擇區域');
        return false;
      }

      var regex = /^\+?[1-9][0-9]*$/;

      if (!regex.test(this.range_bottom)) {
        alert('預算範圍須為正整數');
        return false;
      }

      if (!regex.test(this.range_top)) {
        alert('預算範圍須為正整數');
        return false;
      }

      if (parseInt(this.range_bottom, 10) > parseInt(this.range_top, 10)) {
        alert('預算下限不可高於上限');
        return false;
      }

      if (this.range_bottom == '' || this.range_top == '') {
        alert('請輸入預算範圍');
        return false;
      }

      var obj = {
        username: this.username,
        user_id: this.user_id,
        token: this.token,
        region: this.region,
        section: this.section,
        type: 0,
        range_bottom: this.range_bottom,
        range_top: this.range_top
      };
      $('.btn.send').addClass('is_loading');
      $.post('https://script.google.com/macros/s/AKfycbySNDZ11nc1jYQEnaCEDU_vVNKuDKn7rTfze8fJaN9NpZ7_DIU/exec', obj, function (res) {
        $('.btn.send').removeClass('is_loading');
        _this5.have_data = true;
        _this5.is_edit = false;
        $('.ps').text('資料修改完成，您將收到LINE的測試通知，若一分鐘後還沒收到可能代表權杖輸入錯誤');

        _this5.sendTest();
      });
    },
    sendTest: function sendTest() {
      var msg = "\n\u6E2C\u8A66\u901A\u77E5\n".concat(this.placeWord, "\n\u7CFB\u7D71\u6BCF\u4E94\u5206\u9418\u6703\u9032\u884C\u4E00\u6B21\u67E5\u8A62\uFF0C\u5EFA\u8B70\u53EF\u4EE5\u8A2D\u5B9A\u975C\u97F3\u6216\u9650\u7E2E\u9810\u7B97\u7BC4\u570D\u964D\u4F4E\u5E72\u64FE\u3002");
      msg = msg.replace('<br>', '\n');
      var obj = {
        "msg": msg,
        "token": this.token
      };
      $.post('https://script.google.com/macros/s/AKfycbzdIN38XhmaRUxw-5QECsmaTMJc82HCLXKhFdCE/exec', obj);
    },
    unsub: function unsub() {
      var check = confirm('確定要取消通知嗎?');

      if (check === true) {
        var obj = {
          username: this.username,
          user_id: this.user_id,
          token: this.token,
          region: this.region,
          section: this.section,
          type: 0,
          range_bottom: this.range_bottom,
          range_top: -1
        };
        $('.btn').addClass('is_loading');
        $.post('https://script.google.com/macros/s/AKfycbySNDZ11nc1jYQEnaCEDU_vVNKuDKn7rTfze8fJaN9NpZ7_DIU/exec', obj, function (res) {
          alert('已取消通知');
          location.reload();
        });
      }
    }
  },
  mounted: function mounted() {
    var _this6 = this;

    $('#app').removeClass('unmounted');
    $.get('https://script.google.com/macros/s/AKfycbzkb1pjj_3YAoy_SmZ8is5qfFGTJXKz9WbbtNzu7AWfoihcC00/exec?time=-1', function (res) {
      _this6.last_time = d;
    });
  }
});