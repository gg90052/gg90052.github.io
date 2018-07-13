"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var errorMessage = false;
window.onerror = handleErr;

function handleErr(msg, url, l) {
	if (!errorMessage) {
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
		$(".console .error").fadeIn();
		errorMessage = true;
	}
	return false;
}

var config = {
	field: {
		comments: ['from', 'like_count', 'comment_count', 'reactions', 'is_hidden', 'message', 'message_tags'],
		reactions: [],
		sharedposts: ['story', 'from', 'created_time'],
		url_comments: [],
		feed: []
	},
	limit: {
		comments: '500',
		reactions: '500',
		sharedposts: '500',
		url_comments: '500',
		feed: '500'
	},
	apiVersion: {
		comments: 'v2.7',
		reactions: 'v2.7',
		sharedposts: 'v2.3',
		url_comments: 'v2.7',
		feed: 'v2.3',
		group: 'v2.7',
		newest: 'v2.8'
	},
	auth: 'user_photos,user_posts',
	extension: false,
	pageToken: ''
};

var fb = {
	next: '',
	feeds: [],
	getAuth: function getAuth(type) {
		FB.login(function (response) {
			fb.callback(response, type);
		}, { scope: config.auth, return_scopes: true });
	},
	callback: function callback(response, type) {
		if (response.status === 'connected') {
			console.log(response);
			if (type == "addScope") {
				var authStr = response.authResponse.grantedScopes;
				if (authStr.indexOf('user_posts') >= 0) {
					fb.start();
				} else {
					swal('授權失敗，請給予所有權限', 'Authorization Failed! Please contact the admin.', 'error').done();
				}
			} else {
				fbid.init(type);
			}
		} else {
			FB.login(function (response) {
				fb.callback(response, type);
			}, { scope: config.auth, return_scopes: true });
		}
	},
	start: function start() {
		Promise.all([fb.getMe(), fb.getPage(), fb.getGroup()]).then(function (res) {
			sessionStorage.login = JSON.stringify(res);
			fb.genOption(res);
		});
	},
	genOption: function genOption(res) {
		fb.next = '';
		var options = '';
		var type = -1;
		$('aside').addClass('login');
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = res[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var i = _step.value;

				type++;
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = i[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var j = _step2.value;

						options += "<option attr-type=\"" + type + "\" value=\"" + j.id + "\">" + j.name + "</option>";
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		$('aside .step1 select').append(options);
		$('aside select').select2();
		// $('aside select').on('change', function (event) {
		// 	let type = $(this).find('option:selected').attr('attr-type');
		// 	fb.selectPage(event.target.value, type);
		// });
	},
	selectPage: function selectPage() {
		fb.next = '';
		var tar = $('aside select');
		var type = tar.find('option:selected').attr('attr-type');
		if (type == 1) {
			fb.setToken(tar.find('option:selected').attr('value'));
		}
		fb.feed(tar.val(), type, fb.next);
	},
	setToken: function setToken(pageid) {
		var pages = JSON.parse(sessionStorage.login)[1];
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = pages[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var i = _step3.value;

				if (i.id == pageid) {
					config.pageToken = i.access_token;
				}
			}
		} catch (err) {
			_didIteratorError3 = true;
			_iteratorError3 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion3 && _iterator3.return) {
					_iterator3.return();
				}
			} finally {
				if (_didIteratorError3) {
					throw _iteratorError3;
				}
			}
		}
	},
	feed: function feed(pageID, type) {
		var url = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
		var clear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

		$('button.start').addClass('disabled').text('Loading...');
		var command = type == '2' ? 'feed' : 'posts';
		var api = void 0;
		var start = Math.floor(Date.parse($('#start_date').pickadate('picker').get('select', 'yyyy-mm-dd')) / 1000);
		var end = Math.floor(Date.parse($('#end_date').pickadate('picker').get('select', 'yyyy-mm-dd')) / 1000);
		//1468466990097623
		if (url == '') {
			api = pageID + "/" + command + "?since=" + start + "&until=" + end + "&fields=link,full_picture,created_time,message&limit=100";
		} else {
			api = url;
		}
		FB.api(api, function (res) {
			if (res.data.length > 0) {
				fb.feeds = res.data;
				if (res.paging) {
					next(res.paging.next);
				} else {
					data.start();
				}
			} else {
				alert('沒有資料');
			}
		});
		function next(url) {
			if (url) {
				$.get(url, function (res) {
					if (res.data.length > 0) {
						var _iteratorNormalCompletion4 = true;
						var _didIteratorError4 = false;
						var _iteratorError4 = undefined;

						try {
							for (var _iterator4 = res.data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
								var i = _step4.value;

								fb.feeds.push(i);
							}
						} catch (err) {
							_didIteratorError4 = true;
							_iteratorError4 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion4 && _iterator4.return) {
									_iterator4.return();
								}
							} finally {
								if (_didIteratorError4) {
									throw _iteratorError4;
								}
							}
						}

						if (res.paging) {
							next(res.paging.next);
						} else {
							data.start();
						}
					} else {
						data.start();
					}
				});
			} else {
				data.start();
			}
		}
	},
	getMe: function getMe() {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + "/me", function (res) {
				var arr = [res];
				resolve(arr);
			});
		});
	},
	getPage: function getPage() {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + "/me/accounts?limit=100", function (res) {
				resolve(res.data);
			});
		});
	},
	getGroup: function getGroup() {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + "/me/groups?limit=100", function (res) {
				resolve(res.data);
			});
		});
	},
	getName: function getName(ids) {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + "/?ids=" + ids.toString(), function (res) {
				resolve(res);
			});
		});
	}
};

var data = {
	userid: '',
	nowLength: 0,
	extension: false,
	promise_array: [],
	finalArray: [],
	dateRange: {},
	init: function init() {
		$(".console .message").text('');
		data.nowLength = 0;
		data.promise_array = [];
		data.raw = [];
	},
	dateCheck: function dateCheck() {
		var start = $('#start_date').pickadate('picker').get('select', 'yyyy-mm-dd');
		var end = $('#end_date').pickadate('picker').get('select', 'yyyy-mm-dd');
		var message = '';
		if (start == '' || end == '') {
			message = '請選擇日期';
		} else {
			var d1 = new Date($('#start_date').pickadate('picker').get('select').pick);
			var d2 = new Date($('#end_date').pickadate('picker').get('select').pick);
			if (d2 - d1 > 5184000000) {
				message = '日期區間不能超過60天';
			} else if (d2 < d1) {
				var temp = start;
				start = end;
				end = temp;
			}
		}
		if (message == '') {
			return {
				'check': true,
				'range': "since=" + start + "&until=" + end,
				'string': $('#start_date').pickadate('picker').get('select', 'yyyy/mm/dd') + " ~ " + $('#end_date').pickadate('picker').get('select', 'yyyy/mm/dd')
			};
		} else {
			return {
				'check': false,
				'message': message
			};
		}
	},
	start: function start() {
		$('button.start').removeClass('disabled').text('開始');
		data.init();
		var range = data.dateCheck();
		if (range.check === true) {
			(function () {
				data.dateRange = range;
				var all = [];
				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					var _loop = function _loop() {
						var j = _step5.value;

						var obj = {
							fullID: j.id,
							obj: {}
						};
						var promise = data.get(obj).then(function (res) {
							obj.data = res;
							all.push(obj);
						});
						data.promise_array.push(promise);
					};

					for (var _iterator5 = fb.feeds[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						_loop();
					}
				} catch (err) {
					_didIteratorError5 = true;
					_iteratorError5 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion5 && _iterator5.return) {
							_iterator5.return();
						}
					} finally {
						if (_didIteratorError5) {
							throw _iteratorError5;
						}
					}
				}

				$('.loading').addClass('show');
				Promise.all(data.promise_array).then(function () {
					data.count_score(all);
				});
			})();
		} else {
			alert(range.message);
		}
	},
	get: function get(fbid) {
		return new Promise(function (resolve, reject) {
			var datas = [];
			var promise_array = [];
			var command = 'comments';
			FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/comments?" + data.dateRange.range + "&order=chronological&fields=" + config.field[command].toString() + "&access_token=" + config.pageToken, function (res) {
				data.nowLength += res.data.length;
				$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
				// console.log(res);
				var _iteratorNormalCompletion6 = true;
				var _didIteratorError6 = false;
				var _iteratorError6 = undefined;

				try {
					for (var _iterator6 = res.data[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
						var d = _step6.value;

						if (!d.is_hidden) {
							d.cid = d.from.id + '_' + d.id.substr(0, d.id.indexOf('_'));
							datas.push(d);
						}
					}
				} catch (err) {
					_didIteratorError6 = true;
					_iteratorError6 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion6 && _iterator6.return) {
							_iterator6.return();
						}
					} finally {
						if (_didIteratorError6) {
							throw _iteratorError6;
						}
					}
				}

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
					var _iteratorNormalCompletion7 = true;
					var _didIteratorError7 = false;
					var _iteratorError7 = undefined;

					try {
						for (var _iterator7 = res.data[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
							var d = _step7.value;

							datas.push(d);
						}
					} catch (err) {
						_didIteratorError7 = true;
						_iteratorError7 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion7 && _iterator7.return) {
								_iterator7.return();
							}
						} finally {
							if (_didIteratorError7) {
								throw _iteratorError7;
							}
						}
					}

					if (res.data.length > 0 && res.paging.next) {
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
	count_score: function count_score(all) {
		/*
  	留言3分、TAG一個1分，最多3分
  	留言心情2個1分，無條件進位，最多13分
  	留言的留言一個1分，最大6分
  */
		var score_array = [];
		var _iteratorNormalCompletion8 = true;
		var _didIteratorError8 = false;
		var _iteratorError8 = undefined;

		try {
			for (var _iterator8 = all[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
				var i = _step8.value;

				var arr = i.data;
				var score_rule = {
					'comments': 1,
					'comments_max': 6,
					'reactions': 0.5,
					'reactions_max': 13,
					'tag': 1,
					'tag_max': 3
				};
				var score = void 0;
				var _iteratorNormalCompletion10 = true;
				var _didIteratorError10 = false;
				var _iteratorError10 = undefined;

				try {
					for (var _iterator10 = arr[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
						var j = _step10.value;

						score = 3;
						score += j.comment_count * score_rule.comments > score_rule.comments_max ? score_rule.comments_max : j.comment_count * score_rule.comments;
						var user = {
							'id': j.id,
							'userid': j.from.id,
							'username': j.from.name,
							'comment_count': j.comment_count,
							'message': j.message,
							'cid': j.cid
						};
						if (j.reactions) {
							if (j.reactions.data.length === 25) {
								user.like_count = j.like_count;
								score += score_rule.reactions_max;
							} else {
								user.like_count = j.reactions.data.length;
								score += Math.ceil(j.reactions.data.length * score_rule.reactions);
							}
						} else {
							user.like_count = 0;
						}
						if (j.message_tags) {
							user.tag_count = j.message_tags.length;
							score += j.message_tags.length * score_rule.tag >= score_rule.tag_max ? score_rule.tag_max : j.message_tags.length * score_rule.tag;
						} else {
							user.tag_count = 0;
						}
						user.score = score;
						score_array.push(user);
					}
				} catch (err) {
					_didIteratorError10 = true;
					_iteratorError10 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion10 && _iterator10.return) {
							_iterator10.return();
						}
					} finally {
						if (_didIteratorError10) {
							throw _iteratorError10;
						}
					}
				}
			}
			// console.log(score_array);
		} catch (err) {
			_didIteratorError8 = true;
			_iteratorError8 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion8 && _iterator8.return) {
					_iterator8.return();
				}
			} finally {
				if (_didIteratorError8) {
					throw _iteratorError8;
				}
			}
		}

		function remove_duplicate_comment(arr) {
			var cidArray = [];
			var temp = '';
			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = arr[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var i = _step9.value;

					var _obj = i;
					if (i.cid === temp.cid) {
						var thisdata = _obj;
						var last = cidArray.pop();
						if (thisdata.score > last.score) {
							last = thisdata;
						}
						cidArray.push(last);
					} else {
						temp = _obj;
						cidArray.push(_obj);
					}
				}
			} catch (err) {
				_didIteratorError9 = true;
				_iteratorError9 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion9 && _iterator9.return) {
						_iterator9.return();
					}
				} finally {
					if (_didIteratorError9) {
						throw _iteratorError9;
					}
				}
			}

			return cidArray;
		}
		var sort_array = remove_duplicate_comment(score_array.sort(function (a, b) {
			return b.cid - a.cid;
		}));
		data.mergeData(sort_array.sort(function (a, b) {
			return b.userid - a.userid;
		}));
	},
	mergeData: function mergeData(arr) {
		var finalArray = [];
		var temp = '';
		var _iteratorNormalCompletion11 = true;
		var _didIteratorError11 = false;
		var _iteratorError11 = undefined;

		try {
			for (var _iterator11 = arr[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
				var i = _step11.value;

				var _obj2 = i;
				if (i.userid === temp.userid) {
					var thisdata = _obj2;
					var last = finalArray.pop();
					last.id.push(thisdata);
					last.comment_count += _obj2.comment_count;
					last.like_count += _obj2.like_count;
					last.tag_count += _obj2.tag_count;
					last.score += _obj2.score;
					finalArray.push(last);
				} else {
					var _thisdata = {
						'id': _obj2.id,
						'message': _obj2.message,
						'like_count': _obj2.like_count,
						'comment_count': _obj2.comment_count,
						'tag_count': _obj2.tag_count,
						'score': _obj2.score
					};
					_obj2.id = [_thisdata];
					temp = _obj2;
					finalArray.push(_obj2);
				}
			}
		} catch (err) {
			_didIteratorError11 = true;
			_iteratorError11 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion11 && _iterator11.return) {
					_iterator11.return();
				}
			} finally {
				if (_didIteratorError11) {
					throw _iteratorError11;
				}
			}
		}

		data.finalArray = finalArray.sort(function (a, b) {
			return b.score - a.score;
		});
		data.finalArray = data.finalArray.map(function (item) {
			item.from = {
				"id": item.userid,
				"name": item.username
			};
			return item;
		});
		console.log(data.finalArray);
		$('.loading').removeClass('show');

		localStorage.ranker = JSON.stringify(data.finalArray);
		$('aside').addClass('finish');

		table.generate(data.finalArray);
		chart.draw(data.finalArray);
	}
};
var chart = {
	draw: function draw(finalArray) {
		d3.select("svg").remove();
		var arr = [];
		var w = 750;
		var count = 10;
		if (finalArray.length < count) count = finalArray.length;
		for (var i = 0; i < count; i++) {
			finalArray[i].index = i;
			arr.push(finalArray[i]);
		}
		var maxScore = d3.max(arr, function (d) {
			return d.score;
		});
		console.log(maxScore);
		var xScale = d3.scale.linear().domain([0, maxScore]).range([0, w - 80]);

		var c = d3.select('.chart').append('svg');
		c.selectAll('rect').data(arr).enter().append('rect').attr({
			'fill': '#E0972A',
			'width': 0,
			'height': '30',
			'x': function x(d) {
				return 0;
			},
			'y': function y(d) {
				return d.index * 40;
			}
		}).transition().duration(1500).attr({
			'width': function width(d) {
				return xScale(d.score);
			}
		});
		c.selectAll('text.score').data(arr).enter().append('text').text(function (d) {
			return d.score + '分';
		}).attr({
			'fill': '#e0972a',
			'x': 0,
			'y': function y(d) {
				return d.index * 40 + 20;
			}
		}).transition().duration(1500).attr({
			'x': function x(d) {
				return xScale(d.score) + 40;
			}
		});
		c.selectAll('text.name').data(arr).enter().append('text').text(function (d) {
			return d.username;
		}).attr({
			'fill': '#FFF',
			'text-anchor': 'end',
			'x': 0,
			'y': function y(d) {
				return d.index * 40 + 20;
			}
		}).transition().duration(1500).attr({
			'x': function x(d) {
				return xScale(d.score) - 10;
			}
		});
		c.selectAll('img').data(arr).enter().append('svg:image').attr({
			'xlink:href': function xlinkHref(d) {
				return 'http://graph.facebook.com/' + d.userid + '/picture?width=30&height=30';
			},
			'width': 30,
			'height': 30,
			'x': 0,
			'y': function y(d) {
				return d.index * 40;
			}
		}).transition().duration(1500).attr({
			'x': function x(d) {
				return xScale(d.score);
			}
		});
	}
};
var table = {
	generate: function generate(rawdata) {
		$(".tables table").DataTable().destroy();
		$('.result .info .all_people span').text(rawdata.length);
		$('.result .info .date_range span').text(data.dateRange.string);
		var count = 1;
		var tbody = '';
		var _iteratorNormalCompletion12 = true;
		var _didIteratorError12 = false;
		var _iteratorError12 = undefined;

		try {
			for (var _iterator12 = rawdata[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
				var i = _step12.value;

				tbody += "<tr>\n\t\t\t\t\t\t<td>" + count + "</td>\n\t\t\t\t\t\t<td><a href=\"http://www.facebook.com/" + i.userid + "\" target=_blank>" + i.username + "</a></td>\n\t\t\t\t\t\t<td>" + i.score + "</td><td><button onclick=\"popup.show('" + i.userid + "')\">\u8A73\u7D30\u8CC7\u8A0A</button></td>\n\t\t\t\t\t  </tr>";
				count++;
			}
		} catch (err) {
			_didIteratorError12 = true;
			_iteratorError12 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion12 && _iterator12.return) {
					_iterator12.return();
				}
			} finally {
				if (_didIteratorError12) {
					throw _iteratorError12;
				}
			}
		}

		$(".tables table tbody").html('').append(tbody);

		active();

		function active() {
			var table = $(".tables table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
		}
	},
	redo: function redo() {
		data.filter(data.raw, true);
	}
};
var popup = {
	show: function show(tar) {
		var tbody = '';
		var _iteratorNormalCompletion13 = true;
		var _didIteratorError13 = false;
		var _iteratorError13 = undefined;

		try {
			for (var _iterator13 = data.finalArray[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
				var i = _step13.value;

				if (tar == i.userid) {
					var count = 1;
					$('.popup p span').text(i.username);
					var _iteratorNormalCompletion14 = true;
					var _didIteratorError14 = false;
					var _iteratorError14 = undefined;

					try {
						for (var _iterator14 = i.id[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
							var j = _step14.value;

							var message = j.message;
							if (message == '') message = '=====無內文=====';
							tbody += "<tr>\n\t\t\t\t\t\t\t\t<td>" + count + "</td>\n\t\t\t\t\t\t\t\t<td><a href=\"http://www.facebook.com/" + j.id + "\" target=\"_blank\">" + message + "</a></td>\n\t\t\t\t\t\t\t\t<td>" + j.comment_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.tag_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.like_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.score + "</td>\n\t\t\t\t\t\t\t  </tr>";
							count++;
						}
					} catch (err) {
						_didIteratorError14 = true;
						_iteratorError14 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion14 && _iterator14.return) {
								_iterator14.return();
							}
						} finally {
							if (_didIteratorError14) {
								throw _iteratorError14;
							}
						}
					}

					$(".popup table tbody").html('').append(tbody);
				}
			}
		} catch (err) {
			_didIteratorError13 = true;
			_iteratorError13 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion13 && _iterator13.return) {
					_iterator13.return();
				}
			} finally {
				if (_didIteratorError13) {
					throw _iteratorError13;
				}
			}
		}

		$('.popup').addClass('show');
	},
	hide: function hide() {
		$('.popup').removeClass('show');
	}
};

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
	var arrData = (typeof JSONData === "undefined" ? "undefined" : _typeof(JSONData)) != 'object' ? JSON.parse(JSONData) : JSONData;

	var CSV = '';
	//Set Report title in first row or line

	// CSV += ReportTitle + '\r\n\n';

	//This condition will generate the Label/Header
	if (ShowLabel) {
		var row = "";

		//This loop will extract the label from 1st index of on array
		for (var index in arrData[0]) {

			//Now convert each value to string and comma-seprated
			row += index + ',';
		}

		row = row.slice(0, -1);

		//append Label row with line break
		CSV += row + '\r\n';
	}

	//1st loop is to extract each row
	for (var i = 0; i < arrData.length; i++) {
		var row = "";

		//2nd loop will extract each column and convert it in string comma-seprated
		for (var index in arrData[i]) {
			row += '"' + arrData[i][index] + '",';
		}

		row.slice(0, row.length - 1);

		//add a line break after each row
		CSV += row + '\r\n';
	}

	if (CSV == '') {
		alert("Invalid data");
		return;
	}

	//Generate a file name
	var fileName = "";
	//this will remove the blank-spaces from the title and replace it with an underscore
	fileName += ReportTitle.replace(/ /g, "_");

	//Initialize file format you want csv or xls
	var uri = "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(CSV);

	// Now the little tricky part.
	// you can use either>> window.open(uri);
	// but this will not work in some browsers
	// or you will not get the correct file extension    

	//this trick will generate a temp <a /> tag
	var link = document.createElement("a");
	link.href = uri;

	//set the visibility hidden so it will not effect on your web-layout
	link.style = "visibility:hidden";
	link.download = fileName + ".csv";

	//this part will append the anchor tag and remove it after automatic click
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImNvbmZpZyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJmYiIsIm5leHQiLCJmZWVkcyIsImdldEF1dGgiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzdGFydCIsInN3YWwiLCJkb25lIiwiZmJpZCIsImluaXQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0TWUiLCJnZXRQYWdlIiwiZ2V0R3JvdXAiLCJ0aGVuIiwicmVzIiwic2Vzc2lvblN0b3JhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2VuT3B0aW9uIiwib3B0aW9ucyIsImFkZENsYXNzIiwiaSIsImoiLCJpZCIsIm5hbWUiLCJhcHBlbmQiLCJzZWxlY3QyIiwic2VsZWN0UGFnZSIsInRhciIsImZpbmQiLCJhdHRyIiwic2V0VG9rZW4iLCJ2YWwiLCJwYWdlaWQiLCJwYWdlcyIsInBhcnNlIiwiYWNjZXNzX3Rva2VuIiwicGFnZUlEIiwiY2xlYXIiLCJ0ZXh0IiwiY29tbWFuZCIsImFwaSIsIk1hdGgiLCJmbG9vciIsIkRhdGUiLCJwaWNrYWRhdGUiLCJnZXQiLCJlbmQiLCJkYXRhIiwibGVuZ3RoIiwicGFnaW5nIiwiYWxlcnQiLCJwdXNoIiwicmVzb2x2ZSIsInJlamVjdCIsImFyciIsImdldE5hbWUiLCJpZHMiLCJ0b1N0cmluZyIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInByb21pc2VfYXJyYXkiLCJmaW5hbEFycmF5IiwiZGF0ZVJhbmdlIiwicmF3IiwiZGF0ZUNoZWNrIiwibWVzc2FnZSIsImQxIiwicGljayIsImQyIiwidGVtcCIsInJlbW92ZUNsYXNzIiwicmFuZ2UiLCJjaGVjayIsIm9iaiIsImZ1bGxJRCIsInByb21pc2UiLCJjb3VudF9zY29yZSIsImRhdGFzIiwiZCIsImlzX2hpZGRlbiIsImNpZCIsImZyb20iLCJzdWJzdHIiLCJnZXROZXh0IiwicmVwbGFjZSIsImdldEpTT04iLCJmYWlsIiwic2NvcmVfYXJyYXkiLCJzY29yZV9ydWxlIiwic2NvcmUiLCJjb21tZW50X2NvdW50IiwiY29tbWVudHNfbWF4IiwidXNlciIsImxpa2VfY291bnQiLCJyZWFjdGlvbnNfbWF4IiwiY2VpbCIsIm1lc3NhZ2VfdGFncyIsInRhZ19jb3VudCIsInRhZyIsInRhZ19tYXgiLCJyZW1vdmVfZHVwbGljYXRlX2NvbW1lbnQiLCJjaWRBcnJheSIsInRoaXNkYXRhIiwibGFzdCIsInBvcCIsInNvcnRfYXJyYXkiLCJzb3J0IiwiYSIsImIiLCJtZXJnZURhdGEiLCJtYXAiLCJpdGVtIiwidXNlcm5hbWUiLCJsb2NhbFN0b3JhZ2UiLCJyYW5rZXIiLCJ0YWJsZSIsImdlbmVyYXRlIiwiY2hhcnQiLCJkcmF3IiwiZDMiLCJzZWxlY3QiLCJyZW1vdmUiLCJ3IiwiY291bnQiLCJpbmRleCIsIm1heFNjb3JlIiwibWF4IiwieFNjYWxlIiwic2NhbGUiLCJsaW5lYXIiLCJkb21haW4iLCJjIiwic2VsZWN0QWxsIiwiZW50ZXIiLCJ0cmFuc2l0aW9uIiwiZHVyYXRpb24iLCJyYXdkYXRhIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsInN0cmluZyIsInRib2R5IiwiaHRtbCIsImFjdGl2ZSIsInJlZG8iLCJmaWx0ZXIiLCJwb3B1cCIsInNob3ciLCJoaWRlIiwib2JqMkFycmF5IiwiYXJyYXkiLCJ2YWx1ZSIsImdlblJhbmRvbUFycmF5IiwibiIsImFyeSIsIkFycmF5IiwiciIsInQiLCJyYW5kb20iLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJsaW5rIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjbGljayIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBOztBQUVELElBQUlXLFNBQVM7QUFDWkMsUUFBTztBQUNOQyxZQUFVLENBQUMsTUFBRCxFQUFRLFlBQVIsRUFBcUIsZUFBckIsRUFBcUMsV0FBckMsRUFBaUQsV0FBakQsRUFBNkQsU0FBN0QsRUFBdUUsY0FBdkUsQ0FESjtBQUVOQyxhQUFXLEVBRkw7QUFHTkMsZUFBYSxDQUFDLE9BQUQsRUFBUyxNQUFULEVBQWlCLGNBQWpCLENBSFA7QUFJTkMsZ0JBQWMsRUFKUjtBQUtOQyxRQUFNO0FBTEEsRUFESztBQVFaQyxRQUFPO0FBQ05MLFlBQVUsS0FESjtBQUVOQyxhQUFXLEtBRkw7QUFHTkMsZUFBYSxLQUhQO0FBSU5DLGdCQUFjLEtBSlI7QUFLTkMsUUFBTTtBQUxBLEVBUks7QUFlWkUsYUFBWTtBQUNYTixZQUFVLE1BREM7QUFFWEMsYUFBVyxNQUZBO0FBR1hDLGVBQWEs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LE1BQU0sTUFBYjtBQUNIOztBQUVEO0FBQ0EsTUFBSyxJQUFJaEosSUFBSSxDQUFiLEVBQWdCQSxJQUFJOEksUUFBUWxILE1BQTVCLEVBQW9DNUIsR0FBcEMsRUFBeUM7QUFDckMsTUFBSWdKLE1BQU0sRUFBVjs7QUFFQTtBQUNBLE9BQUssSUFBSXhDLEtBQVQsSUFBa0JzQyxRQUFROUksQ0FBUixDQUFsQixFQUE4QjtBQUMxQmdKLFVBQU8sTUFBTUYsUUFBUTlJLENBQVIsRUFBV3dHLEtBQVgsQ0FBTixHQUEwQixJQUFqQztBQUNIOztBQUVEd0MsTUFBSUMsS0FBSixDQUFVLENBQVYsRUFBYUQsSUFBSXBILE1BQUosR0FBYSxDQUExQjs7QUFFQTtBQUNBbUgsU0FBT0MsTUFBTSxNQUFiO0FBQ0g7O0FBRUQsS0FBSUQsT0FBTyxFQUFYLEVBQWU7QUFDWGpILFFBQU0sY0FBTjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxLQUFJb0gsV0FBVyxFQUFmO0FBQ0E7QUFDQUEsYUFBWU4sWUFBWTVFLE9BQVosQ0FBb0IsSUFBcEIsRUFBeUIsR0FBekIsQ0FBWjs7QUFFQTtBQUNBLEtBQUltRixNQUFNLHVDQUF1Q0MsVUFBVUwsR0FBVixDQUFqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUlNLE9BQU9DLFNBQVNDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBRixNQUFLRyxJQUFMLEdBQVlMLEdBQVo7O0FBRUE7QUFDQUUsTUFBS0ksS0FBTCxHQUFhLG1CQUFiO0FBQ0FKLE1BQUtLLFFBQUwsR0FBZ0JSLFdBQVcsTUFBM0I7O0FBRUE7QUFDQUksVUFBU0ssSUFBVCxDQUFjQyxXQUFkLENBQTBCUCxJQUExQjtBQUNBQSxNQUFLUSxLQUFMO0FBQ0FQLFVBQVNLLElBQVQsQ0FBY0csV0FBZCxDQUEwQlQsSUFBMUI7QUFDSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvcj1oYW5kbGVFcnJcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXHJcbntcclxuXHRpZiAoIWVycm9yTWVzc2FnZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2Zyb20nLCdsaWtlX2NvdW50JywnY29tbWVudF9jb3VudCcsJ3JlYWN0aW9ucycsJ2lzX2hpZGRlbicsJ21lc3NhZ2UnLCdtZXNzYWdlX3RhZ3MnXSxcclxuXHRcdHJlYWN0aW9uczogW10sXHJcblx0XHRzaGFyZWRwb3N0czogWydzdG9yeScsJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogW11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3YyLjcnLFxyXG5cdFx0cmVhY3Rpb25zOiAndjIuNycsXHJcblx0XHRzaGFyZWRwb3N0czogJ3YyLjMnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjIuNycsXHJcblx0XHRmZWVkOiAndjIuMycsXHJcblx0XHRncm91cDogJ3YyLjcnLFxyXG5cdFx0bmV3ZXN0OiAndjIuOCdcclxuXHR9LFxyXG5cdGF1dGg6ICd1c2VyX3Bob3Rvcyx1c2VyX3Bvc3RzJyxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHBhZ2VUb2tlbjogJycsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHRuZXh0OiAnJyxcclxuXHRmZWVkczogW10sXHJcblx0Z2V0QXV0aDogKHR5cGUpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpe1xyXG5cdFx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xyXG5cdFx0XHRcdFx0ZmIuc3RhcnQoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfmjojmrIrlpLHmlZfvvIzoq4vntabkuojmiYDmnInmrIrpmZAnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxyXG5cdFx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoKT0+e1xyXG5cdFx0UHJvbWlzZS5hbGwoW2ZiLmdldE1lKCksZmIuZ2V0UGFnZSgpLCBmYi5nZXRHcm91cCgpXSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5sb2dpbiA9IEpTT04uc3RyaW5naWZ5KHJlcyk7XHJcblx0XHRcdGZiLmdlbk9wdGlvbihyZXMpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZW5PcHRpb246IChyZXMpPT57XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgb3B0aW9ucyA9ICcnO1xyXG5cdFx0bGV0IHR5cGUgPSAtMTtcclxuXHRcdCQoJ2FzaWRlJykuYWRkQ2xhc3MoJ2xvZ2luJyk7XHJcblx0XHRmb3IobGV0IGkgb2YgcmVzKXtcclxuXHRcdFx0dHlwZSsrO1xyXG5cdFx0XHRmb3IobGV0IGogb2YgaSl7XHJcblx0XHRcdFx0b3B0aW9ucyArPSBgPG9wdGlvbiBhdHRyLXR5cGU9XCIke3R5cGV9XCIgdmFsdWU9XCIke2ouaWR9XCI+JHtqLm5hbWV9PC9vcHRpb24+YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnYXNpZGUgLnN0ZXAxIHNlbGVjdCcpLmFwcGVuZChvcHRpb25zKTtcclxuXHRcdCQoJ2FzaWRlIHNlbGVjdCcpLnNlbGVjdDIoKTtcclxuXHRcdC8vICQoJ2FzaWRlIHNlbGVjdCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdC8vIFx0bGV0IHR5cGUgPSAkKHRoaXMpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmF0dHIoJ2F0dHItdHlwZScpO1xyXG5cdFx0Ly8gXHRmYi5zZWxlY3RQYWdlKGV2ZW50LnRhcmdldC52YWx1ZSwgdHlwZSk7XHJcblx0XHQvLyB9KTtcclxuXHR9LFxyXG5cdHNlbGVjdFBhZ2U6ICgpPT57XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgdGFyID0gJCgnYXNpZGUgc2VsZWN0Jyk7XHJcblx0XHRsZXQgdHlwZSA9IHRhci5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdGlmICh0eXBlID09IDEpe1xyXG5cdFx0XHRmYi5zZXRUb2tlbih0YXIuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuYXR0cigndmFsdWUnKSk7XHJcblx0XHR9XHJcblx0XHRmYi5mZWVkKHRhci52YWwoKSwgdHlwZSwgZmIubmV4dCk7XHJcblx0fSxcclxuXHRzZXRUb2tlbjogKHBhZ2VpZCk9PntcclxuXHRcdGxldCBwYWdlcyA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UubG9naW4pWzFdO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHBhZ2VzKXtcclxuXHRcdFx0aWYgKGkuaWQgPT0gcGFnZWlkKXtcclxuXHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gaS5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdGZlZWQ6IChwYWdlSUQsIHR5cGUsIHVybCA9ICcnLCBjbGVhciA9IHRydWUpPT57XHJcblx0XHQkKCdidXR0b24uc3RhcnQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKS50ZXh0KCdMb2FkaW5nLi4uJyk7XHJcblx0XHRsZXQgY29tbWFuZCA9ICh0eXBlID09ICcyJykgPyAnZmVlZCc6J3Bvc3RzJztcclxuXHRcdGxldCBhcGk7XHJcblx0XHRsZXQgc3RhcnQgPSBNYXRoLmZsb29yKERhdGUucGFyc2UoJCgnI3N0YXJ0X2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXktbW0tZGQnKSkvMTAwMCk7XHJcblx0XHRsZXQgZW5kID0gTWF0aC5mbG9vcihEYXRlLnBhcnNlKCQoJyNlbmRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS1tbS1kZCcpKS8xMDAwKTtcclxuXHRcdC8vMTQ2ODQ2Njk5MDA5NzYyM1xyXG5cdFx0aWYgKHVybCA9PSAnJyl7XHJcblx0XHRcdGFwaSA9IGAke3BhZ2VJRH0vJHtjb21tYW5kfT9zaW5jZT0ke3N0YXJ0fSZ1bnRpbD0ke2VuZH0mZmllbGRzPWxpbmssZnVsbF9waWN0dXJlLGNyZWF0ZWRfdGltZSxtZXNzYWdlJmxpbWl0PTEwMGA7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0YXBpID0gdXJsO1xyXG5cdFx0fVxyXG5cdFx0RkIuYXBpKGFwaSxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0ZmIuZmVlZHMgPSByZXMuZGF0YTtcclxuXHRcdFx0XHRpZiAocmVzLnBhZ2luZyl7XHJcblx0XHRcdFx0XHRuZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRkYXRhLnN0YXJ0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgn5rKS5pyJ6LOH5paZJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHRmdW5jdGlvbiBuZXh0KHVybCl7XHJcblx0XHRcdGlmICh1cmwpe1xyXG5cdFx0XHRcdCQuZ2V0KHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwKXtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0XHRmYi5mZWVkcy5wdXNoKGkpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChyZXMucGFnaW5nKXtcclxuXHRcdFx0XHRcdFx0XHRuZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGRhdGEuc3RhcnQoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGRhdGEuc3RhcnQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZGF0YS5zdGFydCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXRNZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZWAsIChyZXMpPT57XHJcblx0XHRcdFx0bGV0IGFyciA9IFtyZXNdO1xyXG5cdFx0XHRcdHJlc29sdmUoYXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldFBhZ2U6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvYWNjb3VudHM/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldEdyb3VwOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwcz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0TmFtZTogKGlkcyk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8/aWRzPSR7aWRzLnRvU3RyaW5nKCl9YCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHByb21pc2VfYXJyYXk6IFtdLFxyXG5cdGZpbmFsQXJyYXk6IFtdLFxyXG5cdGRhdGVSYW5nZToge30sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGRhdGEucHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHR9LFxyXG5cdGRhdGVDaGVjazogKCk9PntcclxuXHRcdGxldCBzdGFydCA9ICQoJyNzdGFydF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5LW1tLWRkJyk7XHJcblx0XHRsZXQgZW5kID0gJCgnI2VuZF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5LW1tLWRkJyk7XHJcblx0XHRsZXQgbWVzc2FnZSA9ICcnO1xyXG5cdFx0aWYgKHN0YXJ0ID09ICcnIHx8IGVuZCA9PSAnJyl7XHJcblx0XHRcdG1lc3NhZ2UgPSAn6KuL6YG45pOH5pel5pyfJztcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsZXQgZDEgPSBuZXcgRGF0ZSgkKCcjc3RhcnRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnKS5waWNrKTtcclxuXHRcdFx0bGV0IGQyID0gbmV3IERhdGUoJCgnI2VuZF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcpLnBpY2spO1xyXG5cdFx0XHRpZiAoZDItZDEgPiA1MTg0MDAwMDAwKXtcclxuXHRcdFx0XHRtZXNzYWdlID0gJ+aXpeacn+WNgOmWk+S4jeiDvei2hemBjjYw5aSpJztcclxuXHRcdFx0fWVsc2UgaWYgKGQyPGQxKXtcclxuXHRcdFx0XHRsZXQgdGVtcCA9IHN0YXJ0O1xyXG5cdFx0XHRcdHN0YXJ0ID0gZW5kO1xyXG5cdFx0XHRcdGVuZCA9IHRlbXA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChtZXNzYWdlID09ICcnKXtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHQnY2hlY2snOiB0cnVlLFxyXG5cdFx0XHRcdCdyYW5nZSc6IGBzaW5jZT0ke3N0YXJ0fSZ1bnRpbD0ke2VuZH1gLFxyXG5cdFx0XHRcdCdzdHJpbmcnOiAkKCcjc3RhcnRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS9tbS9kZCcpICsgXCIgfiBcIiArICQoJyNlbmRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS9tbS9kZCcpLFxyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHQnY2hlY2snOiBmYWxzZSxcclxuXHRcdFx0XHQnbWVzc2FnZSc6IG1lc3NhZ2VcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6ICgpPT57XHJcblx0XHQkKCdidXR0b24uc3RhcnQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS50ZXh0KCfplovlp4snKTtcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0bGV0IHJhbmdlID0gZGF0YS5kYXRlQ2hlY2soKTtcclxuXHRcdGlmIChyYW5nZS5jaGVjayA9PT0gdHJ1ZSl7XHJcblx0XHRcdGRhdGEuZGF0ZVJhbmdlID0gcmFuZ2U7XHJcblx0XHRcdGxldCBhbGwgPSBbXTtcclxuXHRcdFx0Zm9yKGxldCBqIG9mIGZiLmZlZWRzKXtcclxuXHRcdFx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRcdFx0ZnVsbElEOiBqLmlkLFxyXG5cdFx0XHRcdFx0b2JqOiB7fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgcHJvbWlzZSA9IGRhdGEuZ2V0KG9iaikudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdFx0b2JqLmRhdGEgPSByZXM7XHJcblx0XHRcdFx0XHRhbGwucHVzaChvYmopO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGRhdGEucHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJy5sb2FkaW5nJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdFx0UHJvbWlzZS5hbGwoZGF0YS5wcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdFx0ZGF0YS5jb3VudF9zY29yZShhbGwpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRhbGVydChyYW5nZS5tZXNzYWdlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldDogKGZiaWQpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBjb21tYW5kID0gJ2NvbW1lbnRzJztcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS9jb21tZW50cz8ke2RhdGEuZGF0ZVJhbmdlLnJhbmdlfSZvcmRlcj1jaHJvbm9sb2dpY2FsJmZpZWxkcz0ke2NvbmZpZy5maWVsZFtjb21tYW5kXS50b1N0cmluZygpfSZhY2Nlc3NfdG9rZW49JHtjb25maWcucGFnZVRva2VufWAsKHJlcyk9PntcclxuXHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2cocmVzKTtcclxuXHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0aWYgKCFkLmlzX2hpZGRlbil7XHJcblx0XHRcdFx0XHRcdGQuY2lkID0gZC5mcm9tLmlkICsgJ18nICsgZC5pZC5zdWJzdHIoMCwgZC5pZC5pbmRleE9mKCdfJykpO1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCk9PntcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNvdW50X3Njb3JlOiAoYWxsKT0+e1xyXG5cdFx0LypcclxuXHRcdFx055WZ6KiAM+WIhuOAgVRBR+S4gOWAizHliIbvvIzmnIDlpJoz5YiGXHJcblx0XHRcdOeVmeiogOW/g+aDhTLlgIsx5YiG77yM54Sh5qKd5Lu26YCy5L2N77yM5pyA5aSaMTPliIZcclxuXHRcdFx055WZ6KiA55qE55WZ6KiA5LiA5YCLMeWIhu+8jOacgOWkpzbliIZcclxuXHRcdCovXHJcblx0XHRsZXQgc2NvcmVfYXJyYXkgPSBbXTtcclxuXHRcdGZvcihsZXQgaSBvZiBhbGwpe1xyXG5cdFx0XHRsZXQgYXJyID0gaS5kYXRhO1xyXG5cdFx0XHRsZXQgc2NvcmVfcnVsZSA9IHtcclxuXHRcdFx0XHQnY29tbWVudHMnOiAxLFxyXG5cdFx0XHRcdCdjb21tZW50c19tYXgnOiA2LFxyXG5cdFx0XHRcdCdyZWFjdGlvbnMnOiAwLjUsXHJcblx0XHRcdFx0J3JlYWN0aW9uc19tYXgnOiAxMyxcclxuXHRcdFx0XHQndGFnJzogMSxcclxuXHRcdFx0XHQndGFnX21heCc6IDNcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgc2NvcmU7XHJcblx0XHRcdGZvcihsZXQgaiBvZiBhcnIpe1xyXG5cdFx0XHRcdHNjb3JlID0gMztcclxuXHRcdFx0XHRzY29yZSArPSAoai5jb21tZW50X2NvdW50KnNjb3JlX3J1bGUuY29tbWVudHMgPiBzY29yZV9ydWxlLmNvbW1lbnRzX21heCkgPyBzY29yZV9ydWxlLmNvbW1lbnRzX21heCA6IGouY29tbWVudF9jb3VudCpzY29yZV9ydWxlLmNvbW1lbnRzO1xyXG5cdFx0XHRcdGxldCB1c2VyID0ge1xyXG5cdFx0XHRcdFx0J2lkJzogai5pZCxcclxuXHRcdFx0XHRcdCd1c2VyaWQnOiBqLmZyb20uaWQsXHJcblx0XHRcdFx0XHQndXNlcm5hbWUnOiBqLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdCdjb21tZW50X2NvdW50Jzogai5jb21tZW50X2NvdW50LFxyXG5cdFx0XHRcdFx0J21lc3NhZ2UnOiBqLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHQnY2lkJzogai5jaWRcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmIChqLnJlYWN0aW9ucyl7XHJcblx0XHRcdFx0XHRpZiAoai5yZWFjdGlvbnMuZGF0YS5sZW5ndGggPT09IDI1KXtcclxuXHRcdFx0XHRcdFx0dXNlci5saWtlX2NvdW50ID0gai5saWtlX2NvdW50O1xyXG5cdFx0XHRcdFx0XHRzY29yZSArPSBzY29yZV9ydWxlLnJlYWN0aW9uc19tYXg7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0dXNlci5saWtlX2NvdW50ID0gai5yZWFjdGlvbnMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdHNjb3JlICs9IE1hdGguY2VpbChqLnJlYWN0aW9ucy5kYXRhLmxlbmd0aCpzY29yZV9ydWxlLnJlYWN0aW9ucyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR1c2VyLmxpa2VfY291bnQgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoai5tZXNzYWdlX3RhZ3Mpe1xyXG5cdFx0XHRcdFx0dXNlci50YWdfY291bnQgPSBqLm1lc3NhZ2VfdGFncy5sZW5ndGhcclxuXHRcdFx0XHRcdHNjb3JlICs9ICAoai5tZXNzYWdlX3RhZ3MubGVuZ3RoICogc2NvcmVfcnVsZS50YWcgPj0gc2NvcmVfcnVsZS50YWdfbWF4KSA/IHNjb3JlX3J1bGUudGFnX21heCA6IGoubWVzc2FnZV90YWdzLmxlbmd0aCAqIHNjb3JlX3J1bGUudGFnO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dXNlci50YWdfY291bnQgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR1c2VyLnNjb3JlID0gc2NvcmU7XHJcblx0XHRcdFx0c2NvcmVfYXJyYXkucHVzaCh1c2VyKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gY29uc29sZS5sb2coc2NvcmVfYXJyYXkpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIHJlbW92ZV9kdXBsaWNhdGVfY29tbWVudChhcnIpe1xyXG5cdFx0XHRsZXQgY2lkQXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IHRlbXAgPSAnJztcclxuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdFx0bGV0IG9iaiA9IGk7XHJcblx0XHRcdFx0aWYgKGkuY2lkID09PSB0ZW1wLmNpZCl7XHJcblx0XHRcdFx0XHRsZXQgdGhpc2RhdGEgPSBvYmo7XHJcblx0XHRcdFx0XHRsZXQgbGFzdCA9IGNpZEFycmF5LnBvcCgpO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXNkYXRhLnNjb3JlID4gbGFzdC5zY29yZSl7XHJcblx0XHRcdFx0XHRcdGxhc3QgPSB0aGlzZGF0YTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNpZEFycmF5LnB1c2gobGFzdCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR0ZW1wID0gb2JqO1xyXG5cdFx0XHRcdFx0Y2lkQXJyYXkucHVzaChvYmopO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gY2lkQXJyYXk7XHJcblx0XHR9XHJcblx0XHRsZXQgc29ydF9hcnJheSA9IHJlbW92ZV9kdXBsaWNhdGVfY29tbWVudChzY29yZV9hcnJheS5zb3J0KChhLCBiKSA9PiBiLmNpZCAtIGEuY2lkKSk7XHJcblx0XHRkYXRhLm1lcmdlRGF0YShzb3J0X2FycmF5LnNvcnQoKGEsIGIpID0+IGIudXNlcmlkIC0gYS51c2VyaWQpKTtcclxuXHR9LFxyXG5cdG1lcmdlRGF0YTogKGFycik9PntcclxuXHRcdGxldCBmaW5hbEFycmF5ID0gW107XHJcblx0XHRsZXQgdGVtcCA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdGxldCBvYmogPSBpO1xyXG5cdFx0XHRpZiAoaS51c2VyaWQgPT09IHRlbXAudXNlcmlkKXtcclxuXHRcdFx0XHRsZXQgdGhpc2RhdGEgPSBvYmo7XHJcblx0XHRcdFx0bGV0IGxhc3QgPSBmaW5hbEFycmF5LnBvcCgpO1xyXG5cdFx0XHRcdGxhc3QuaWQucHVzaCh0aGlzZGF0YSk7XHJcblx0XHRcdFx0bGFzdC5jb21tZW50X2NvdW50ICs9IG9iai5jb21tZW50X2NvdW50O1xyXG5cdFx0XHRcdGxhc3QubGlrZV9jb3VudCArPSBvYmoubGlrZV9jb3VudDtcclxuXHRcdFx0XHRsYXN0LnRhZ19jb3VudCArPSBvYmoudGFnX2NvdW50O1xyXG5cdFx0XHRcdGxhc3Quc2NvcmUgKz0gb2JqLnNjb3JlO1xyXG5cdFx0XHRcdGZpbmFsQXJyYXkucHVzaChsYXN0KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bGV0IHRoaXNkYXRhID0ge1xyXG5cdFx0XHRcdFx0J2lkJzogb2JqLmlkLFxyXG5cdFx0XHRcdFx0J21lc3NhZ2UnOiBvYmoubWVzc2FnZSxcclxuXHRcdFx0XHRcdCdsaWtlX2NvdW50Jzogb2JqLmxpa2VfY291bnQsXHJcblx0XHRcdFx0XHQnY29tbWVudF9jb3VudCc6IG9iai5jb21tZW50X2NvdW50LFxyXG5cdFx0XHRcdFx0J3RhZ19jb3VudCc6IG9iai50YWdfY291bnQsXHJcblx0XHRcdFx0XHQnc2NvcmUnOiBvYmouc2NvcmVcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdG9iai5pZCA9IFt0aGlzZGF0YV07XHJcblx0XHRcdFx0dGVtcCA9IG9iajtcclxuXHRcdFx0XHRmaW5hbEFycmF5LnB1c2gob2JqKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5maW5hbEFycmF5ID0gZmluYWxBcnJheS5zb3J0KChhLCBiKSA9PiBiLnNjb3JlIC0gYS5zY29yZSk7XHJcblx0XHRkYXRhLmZpbmFsQXJyYXkgPSBkYXRhLmZpbmFsQXJyYXkubWFwKChpdGVtKT0+e1xyXG5cdFx0XHRpdGVtLmZyb20gPSB7XHJcblx0XHRcdFx0XCJpZFwiOiBpdGVtLnVzZXJpZCxcclxuXHRcdFx0XHRcIm5hbWVcIjogaXRlbS51c2VybmFtZVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBpdGVtO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmxvZyhkYXRhLmZpbmFsQXJyYXkpO1xyXG5cdFx0JCgnLmxvYWRpbmcnKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cclxuXHRcdGxvY2FsU3RvcmFnZS5yYW5rZXIgPSBKU09OLnN0cmluZ2lmeShkYXRhLmZpbmFsQXJyYXkpO1xyXG5cdFx0JCgnYXNpZGUnKS5hZGRDbGFzcygnZmluaXNoJyk7XHJcblxyXG5cdFx0dGFibGUuZ2VuZXJhdGUoZGF0YS5maW5hbEFycmF5KTtcclxuXHRcdGNoYXJ0LmRyYXcoZGF0YS5maW5hbEFycmF5KTtcclxuXHR9XHJcbn1cclxubGV0IGNoYXJ0ID0ge1xyXG5cdGRyYXc6IChmaW5hbEFycmF5KT0+e1xyXG5cdFx0ZDMuc2VsZWN0KFwic3ZnXCIpLnJlbW92ZSgpO1xyXG5cdFx0bGV0IGFyciA9IFtdO1xyXG5cdFx0bGV0IHcgPSA3NTA7XHJcblx0XHRsZXQgY291bnQgPSAxMDtcclxuXHRcdGlmIChmaW5hbEFycmF5Lmxlbmd0aCA8IGNvdW50KSBjb3VudCA9IGZpbmFsQXJyYXkubGVuZ3RoO1xyXG5cdFx0Zm9yKGxldCBpPTA7IGk8Y291bnQ7IGkrKyl7XHJcblx0XHRcdGZpbmFsQXJyYXlbaV0uaW5kZXggPSBpO1xyXG5cdFx0XHRhcnIucHVzaChmaW5hbEFycmF5W2ldKTtcclxuXHRcdH1cclxuXHRcdHZhciBtYXhTY29yZSA9IGQzLm1heChhcnIsIGZ1bmN0aW9uKGQpe3JldHVybiBkLnNjb3JlfSk7XHJcblx0XHRjb25zb2xlLmxvZyhtYXhTY29yZSlcclxuXHRcdHZhciB4U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxyXG5cdFx0XHRcdFx0ICAgLmRvbWFpbihbMCwgbWF4U2NvcmVdKVxyXG5cdFx0XHRcdFx0ICAgLnJhbmdlKFswLCB3LTgwXSk7XHJcblxyXG5cdFx0dmFyIGMgPSBkMy5zZWxlY3QoJy5jaGFydCcpLmFwcGVuZCgnc3ZnJyk7XHJcblx0XHRjLnNlbGVjdEFsbCgncmVjdCcpXHJcblx0XHQgLmRhdGEoYXJyKVxyXG5cdFx0IC5lbnRlcigpXHJcblx0XHQgLmFwcGVuZCgncmVjdCcpXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J2ZpbGwnOiAnI0UwOTcyQScsXHJcblx0XHQgXHQnd2lkdGgnOiAwLFxyXG5cdFx0IFx0J2hlaWdodCc6ICczMCcsXHJcblx0XHQgXHQneCc6IGZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4gMDtcclxuXHRcdCBcdH0sXHJcblx0XHQgXHQneSc6IGZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4gZC5pbmRleCAqIDQwXHJcblx0XHQgXHR9XHJcblx0XHQgfSlcclxuXHRcdCAudHJhbnNpdGlvbigpXHJcblx0XHQgLmR1cmF0aW9uKDE1MDApXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J3dpZHRoJzpmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIHhTY2FsZShkLnNjb3JlKTtcclxuXHRcdCBcdH1cclxuXHRcdCB9KTtcclxuXHRcdCBjLnNlbGVjdEFsbCgndGV4dC5zY29yZScpXHJcblx0XHQgLmRhdGEoYXJyKVxyXG5cdFx0IC5lbnRlcigpXHJcblx0XHQgLmFwcGVuZCgndGV4dCcpXHJcblx0XHQgLnRleHQoZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRyZXR1cm4gZC5zY29yZSArICfliIYnO1xyXG5cdFx0IH0pXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J2ZpbGwnOicjZTA5NzJhJyxcclxuXHRcdCBcdCd4JzogMCxcclxuXHRcdCBcdCd5JzpmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIGQuaW5kZXggKiA0MCArIDIwXHJcblx0XHQgXHR9XHJcblx0XHQgfSlcclxuXHRcdCAudHJhbnNpdGlvbigpXHJcblx0XHQgLmR1cmF0aW9uKDE1MDApXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J3gnOmZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4geFNjYWxlKGQuc2NvcmUpICsgNDA7XHJcblx0XHQgXHR9XHJcblx0XHQgfSk7XHJcblx0XHQgYy5zZWxlY3RBbGwoJ3RleHQubmFtZScpXHJcblx0XHQgLmRhdGEoYXJyKVxyXG5cdFx0IC5lbnRlcigpXHJcblx0XHQgLmFwcGVuZCgndGV4dCcpXHJcblx0XHQgLnRleHQoZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRyZXR1cm4gZC51c2VybmFtZTtcclxuXHRcdCB9KVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCdmaWxsJzonI0ZGRicsXHJcblx0XHQgXHQndGV4dC1hbmNob3InOiAnZW5kJyxcclxuXHRcdCBcdCd4JzogMCxcclxuXHRcdCBcdCd5JzpmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIGQuaW5kZXggKiA0MCArIDIwXHJcblx0XHQgXHR9XHJcblx0XHQgfSlcclxuXHRcdCAudHJhbnNpdGlvbigpXHJcblx0XHQgLmR1cmF0aW9uKDE1MDApXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J3gnOmZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4geFNjYWxlKGQuc2NvcmUpIC0gMTA7XHJcblx0XHQgXHR9XHJcblx0XHQgfSk7XHJcblx0XHQgYy5zZWxlY3RBbGwoJ2ltZycpXHJcblx0XHQgLmRhdGEoYXJyKVxyXG5cdFx0IC5lbnRlcigpXHJcblx0XHQgLmFwcGVuZCgnc3ZnOmltYWdlJylcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQneGxpbms6aHJlZic6IGZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4gJ2h0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJytkLnVzZXJpZCsnL3BpY3R1cmU/d2lkdGg9MzAmaGVpZ2h0PTMwJ1xyXG5cdFx0IFx0fSxcclxuXHRcdCBcdCd3aWR0aCc6IDMwLFxyXG5cdFx0IFx0J2hlaWdodCc6IDMwLFxyXG5cdFx0IFx0J3gnOiAwLFxyXG5cdFx0IFx0J3knOmZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4gZC5pbmRleCAqIDQwXHJcblx0XHQgXHR9XHJcblx0XHQgfSlcclxuXHRcdCAudHJhbnNpdGlvbigpXHJcblx0XHQgLmR1cmF0aW9uKDE1MDApXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J3gnOmZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4geFNjYWxlKGQuc2NvcmUpO1xyXG5cdFx0IFx0fVxyXG5cdFx0IH0pO1xyXG5cdH1cclxufVxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JCgnLnJlc3VsdCAuaW5mbyAuYWxsX3Blb3BsZSBzcGFuJykudGV4dChyYXdkYXRhLmxlbmd0aCk7XHJcblx0XHQkKCcucmVzdWx0IC5pbmZvIC5kYXRlX3JhbmdlIHNwYW4nKS50ZXh0KGRhdGEuZGF0ZVJhbmdlLnN0cmluZyk7XHJcblx0XHRsZXQgY291bnQgPSAxO1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgcmF3ZGF0YSl7XHJcblx0XHRcdHRib2R5ICs9IGA8dHI+XHJcblx0XHRcdFx0XHRcdDx0ZD4ke2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZD48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9X2JsYW5rPiR7aS51c2VybmFtZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkPiR7aS5zY29yZX08L3RkPjx0ZD48YnV0dG9uIG9uY2xpY2s9XCJwb3B1cC5zaG93KCcke2kudXNlcmlkfScpXCI+6Kmz57Sw6LOH6KiKPC9idXR0b24+PC90ZD5cclxuXHRcdFx0XHRcdCAgPC90cj5gO1xyXG5cdFx0XHRjb3VudCsrO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgdGFibGUgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5KTtcclxuXHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCk9PntcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxubGV0IHBvcHVwID0ge1xyXG5cdHNob3c6ICh0YXIpPT57XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGZvcihsZXQgaSBvZiBkYXRhLmZpbmFsQXJyYXkpe1xyXG5cdFx0XHRpZiAodGFyID09IGkudXNlcmlkKXtcclxuXHRcdFx0XHRsZXQgY291bnQgPSAxO1xyXG5cdFx0XHRcdCQoJy5wb3B1cCBwIHNwYW4nKS50ZXh0KGkudXNlcm5hbWUpO1xyXG5cdFx0XHRcdGZvcihsZXQgaiBvZiBpLmlkKXtcclxuXHRcdFx0XHRcdGxldCBtZXNzYWdlID0gai5tZXNzYWdlO1xyXG5cdFx0XHRcdFx0aWYgKG1lc3NhZ2UgPT0gJycpIG1lc3NhZ2UgPSAnPT09PT3nhKHlhafmloc9PT09PSc7XHJcblx0XHRcdFx0XHR0Ym9keSArPSBgPHRyPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7Y291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHtqLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7bWVzc2FnZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2ouY29tbWVudF9jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai50YWdfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2oubGlrZV9jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai5zY29yZX08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdCAgPC90cj5gO1xyXG5cdFx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JChcIi5wb3B1cCB0YWJsZSB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcucG9wdXAnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdH0sXHJcblx0aGlkZTogKCk9PntcclxuXHRcdCQoJy5wb3B1cCcpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0fVxyXG59XHJcblxyXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XHJcbiBcdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XHJcbiBcdH0pO1xyXG4gXHRyZXR1cm4gYXJyYXk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcbiBcdHZhciBpLCByLCB0O1xyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRhcnlbaV0gPSBpO1xyXG4gXHR9XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuIFx0XHR0ID0gYXJ5W3JdO1xyXG4gXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuIFx0XHRhcnlbaV0gPSB0O1xyXG4gXHR9XHJcbiBcdHJldHVybiBhcnk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG4gICAgXHJcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxyXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcbiAgICBcclxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxyXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gICBcclxuICAgIFxyXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcclxuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcclxuICAgIFxyXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcbiAgICBcclxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuICAgIFxyXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTsgICAgXHJcbiAgICBsaW5rLmhyZWYgPSB1cmk7XHJcbiAgICBcclxuICAgIC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcbiAgICBcclxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgbGluay5jbGljaygpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
