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
	auth: 'user_photos,user_posts,user_managed_groups,manage_pages',
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
				if (authStr.indexOf('manage_pages') >= 0 && authStr.indexOf('user_managed_groups') >= 0 && authStr.indexOf('user_posts') >= 0) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImNvbmZpZyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJmYiIsIm5leHQiLCJmZWVkcyIsImdldEF1dGgiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzdGFydCIsInN3YWwiLCJkb25lIiwiZmJpZCIsImluaXQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0TWUiLCJnZXRQYWdlIiwiZ2V0R3JvdXAiLCJ0aGVuIiwicmVzIiwic2Vzc2lvblN0b3JhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2VuT3B0aW9uIiwib3B0aW9ucyIsImFkZENsYXNzIiwiaSIsImoiLCJpZCIsIm5hbWUiLCJhcHBlbmQiLCJzZWxlY3QyIiwic2VsZWN0UGFnZSIsInRhciIsImZpbmQiLCJhdHRyIiwic2V0VG9rZW4iLCJ2YWwiLCJwYWdlaWQiLCJwYWdlcyIsInBhcnNlIiwiYWNjZXNzX3Rva2VuIiwicGFnZUlEIiwiY2xlYXIiLCJjb21tYW5kIiwiYXBpIiwiTWF0aCIsImZsb29yIiwiRGF0ZSIsInBpY2thZGF0ZSIsImdldCIsImVuZCIsImRhdGEiLCJsZW5ndGgiLCJwYWdpbmciLCJhbGVydCIsInB1c2giLCJyZXNvbHZlIiwicmVqZWN0IiwiYXJyIiwiZ2V0TmFtZSIsImlkcyIsInRvU3RyaW5nIiwidXNlcmlkIiwibm93TGVuZ3RoIiwicHJvbWlzZV9hcnJheSIsImZpbmFsQXJyYXkiLCJkYXRlUmFuZ2UiLCJ0ZXh0IiwicmF3IiwiZGF0ZUNoZWNrIiwibWVzc2FnZSIsImQxIiwicGljayIsImQyIiwidGVtcCIsInJhbmdlIiwiY2hlY2siLCJvYmoiLCJmdWxsSUQiLCJwcm9taXNlIiwiY291bnRfc2NvcmUiLCJkYXRhcyIsImQiLCJpc19oaWRkZW4iLCJjaWQiLCJmcm9tIiwic3Vic3RyIiwiZ2V0TmV4dCIsInJlcGxhY2UiLCJnZXRKU09OIiwiZmFpbCIsInNjb3JlX2FycmF5Iiwic2NvcmVfcnVsZSIsInNjb3JlIiwiY29tbWVudF9jb3VudCIsImNvbW1lbnRzX21heCIsInVzZXIiLCJsaWtlX2NvdW50IiwicmVhY3Rpb25zX21heCIsImNlaWwiLCJtZXNzYWdlX3RhZ3MiLCJ0YWdfY291bnQiLCJ0YWciLCJ0YWdfbWF4IiwicmVtb3ZlX2R1cGxpY2F0ZV9jb21tZW50IiwiY2lkQXJyYXkiLCJ0aGlzZGF0YSIsImxhc3QiLCJwb3AiLCJzb3J0X2FycmF5Iiwic29ydCIsImEiLCJiIiwibWVyZ2VEYXRhIiwibWFwIiwiaXRlbSIsInVzZXJuYW1lIiwicmVtb3ZlQ2xhc3MiLCJsb2NhbFN0b3JhZ2UiLCJyYW5rZXIiLCJ0YWJsZSIsImdlbmVyYXRlIiwiY2hhcnQiLCJkcmF3IiwiZDMiLCJzZWxlY3QiLCJyZW1vdmUiLCJ3IiwiY291bnQiLCJpbmRleCIsIm1heFNjb3JlIiwibWF4IiwieFNjYWxlIiwic2NhbGUiLCJsaW5lYXIiLCJkb21haW4iLCJjIiwic2VsZWN0QWxsIiwiZW50ZXIiLCJ0cmFuc2l0aW9uIiwiZHVyYXRpb24iLCJyYXdkYXRhIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsInN0cmluZyIsInRib2R5IiwiaHRtbCIsImFjdGl2ZSIsInJlZG8iLCJmaWx0ZXIiLCJwb3B1cCIsInNob3ciLCJoaWRlIiwib2JqMkFycmF5IiwiYXJyYXkiLCJ2YWx1ZSIsImdlblJhbmRvbUFycmF5IiwibiIsImFyeSIsIkFycmF5IiwiciIsInQiLCJyYW5kb20iLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJsaW5rIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjbGljayIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBOztBQUVELElBQUlXLFNBQVM7QUFDWkMsUUFBTztBQUNOQyxZQUFVLENBQUMsTUFBRCxFQUFRLFlBQVIsRUFBcUIsZUFBckIsRUFBcUMsV0FBckMsRUFBaUQsV0FBakQsRUFBNkQsU0FBN0QsRUFBdUUsY0FBdkUsQ0FESjtBQUVOQyxhQUFXLEVBRkw7QUFHTkMsZUFBYSxDQUFDLE9BQUQsRUFBUyxNQUFULEVBQWlCLGNBQWpCLENBSFA7QUFJTkMsZ0JBQWMsRUFKUjtBQUtOQyxRQUFNO0FBTEEsRUFESztBQVFaQyxRQUFPO0FBQ05MLFlBQVUsS0FESjtBQUVOQyxhQUFXLEtBRkw7QUFHTkMsZUFBYSxLQUhQO0FBSU5DLGdCQUFjLEtBSlI7QUFLTkMsUUFBTTtBQUxBLEVBUks7QUFlWkUsYUFBWTtBQUNYTixZQUFVLE1BREM7QUFFWEMsYUFBVyxNQUZBO0FBR1hDLGVBQWEs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SixNQUFNLEVBQVY7O0FBRUE7QUFDQSxPQUFLLElBQUl4QyxLQUFULElBQWtCc0MsUUFBUTlJLENBQVIsQ0FBbEIsRUFBOEI7QUFDMUJnSixVQUFPLE1BQU1GLFFBQVE5SSxDQUFSLEVBQVd3RyxLQUFYLENBQU4sR0FBMEIsSUFBakM7QUFDSDs7QUFFRHdDLE1BQUlDLEtBQUosQ0FBVSxDQUFWLEVBQWFELElBQUlySCxNQUFKLEdBQWEsQ0FBMUI7O0FBRUE7QUFDQW9ILFNBQU9DLE1BQU0sTUFBYjtBQUNIOztBQUVELEtBQUlELE9BQU8sRUFBWCxFQUFlO0FBQ1hsSCxRQUFNLGNBQU47QUFDQTtBQUNIOztBQUVEO0FBQ0EsS0FBSXFILFdBQVcsRUFBZjtBQUNBO0FBQ0FBLGFBQVlOLFlBQVk3RSxPQUFaLENBQW9CLElBQXBCLEVBQXlCLEdBQXpCLENBQVo7O0FBRUE7QUFDQSxLQUFJb0YsTUFBTSx1Q0FBdUNDLFVBQVVMLEdBQVYsQ0FBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFJTSxPQUFPQyxTQUFTQyxhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQUYsTUFBS0csSUFBTCxHQUFZTCxHQUFaOztBQUVBO0FBQ0FFLE1BQUtJLEtBQUwsR0FBYSxtQkFBYjtBQUNBSixNQUFLSyxRQUFMLEdBQWdCUixXQUFXLE1BQTNCOztBQUVBO0FBQ0FJLFVBQVNLLElBQVQsQ0FBY0MsV0FBZCxDQUEwQlAsSUFBMUI7QUFDQUEsTUFBS1EsS0FBTDtBQUNBUCxVQUFTSyxJQUFULENBQWNHLFdBQWQsQ0FBMEJULElBQTFCO0FBQ0giLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxyXG57XHJcblx0aWYgKCFlcnJvck1lc3NhZ2Upe1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydmcm9tJywnbGlrZV9jb3VudCcsJ2NvbW1lbnRfY291bnQnLCdyZWFjdGlvbnMnLCdpc19oaWRkZW4nLCdtZXNzYWdlJywnbWVzc2FnZV90YWdzJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcclxuXHRcdGZlZWQ6IFtdXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2Mi43JyxcclxuXHRcdHJlYWN0aW9uczogJ3YyLjcnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi4zJyxcclxuXHRcdHVybF9jb21tZW50czogJ3YyLjcnLFxyXG5cdFx0ZmVlZDogJ3YyLjMnLFxyXG5cdFx0Z3JvdXA6ICd2Mi43JyxcclxuXHRcdG5ld2VzdDogJ3YyLjgnXHJcblx0fSxcclxuXHRhdXRoOiAndXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX21hbmFnZWRfZ3JvdXBzLG1hbmFnZV9wYWdlcycsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0bmV4dDogJycsXHJcblx0ZmVlZHM6IFtdLFxyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX21hbmFnZWRfZ3JvdXBzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcclxuXHRcdFx0XHRcdGZiLnN0YXJ0KCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5o6I5qyK5aSx5pWX77yM6KuL57Wm5LqI5omA5pyJ5qyK6ZmQJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRzdGFydDogKCk9PntcclxuXHRcdFByb21pc2UuYWxsKFtmYi5nZXRNZSgpLGZiLmdldFBhZ2UoKSwgZmIuZ2V0R3JvdXAoKV0pLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0c2Vzc2lvblN0b3JhZ2UubG9naW4gPSBKU09OLnN0cmluZ2lmeShyZXMpO1xyXG5cdFx0XHRmYi5nZW5PcHRpb24ocmVzKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2VuT3B0aW9uOiAocmVzKT0+e1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IG9wdGlvbnMgPSAnJztcclxuXHRcdGxldCB0eXBlID0gLTE7XHJcblx0XHQkKCdhc2lkZScpLmFkZENsYXNzKCdsb2dpbicpO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHJlcyl7XHJcblx0XHRcdHR5cGUrKztcclxuXHRcdFx0Zm9yKGxldCBqIG9mIGkpe1xyXG5cdFx0XHRcdG9wdGlvbnMgKz0gYDxvcHRpb24gYXR0ci10eXBlPVwiJHt0eXBlfVwiIHZhbHVlPVwiJHtqLmlkfVwiPiR7ai5uYW1lfTwvb3B0aW9uPmA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJ2FzaWRlIC5zdGVwMSBzZWxlY3QnKS5hcHBlbmQob3B0aW9ucyk7XHJcblx0XHQkKCdhc2lkZSBzZWxlY3QnKS5zZWxlY3QyKCk7XHJcblx0XHQvLyAkKCdhc2lkZSBzZWxlY3QnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHQvLyBcdGxldCB0eXBlID0gJCh0aGlzKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdC8vIFx0ZmIuc2VsZWN0UGFnZShldmVudC50YXJnZXQudmFsdWUsIHR5cGUpO1xyXG5cdFx0Ly8gfSk7XHJcblx0fSxcclxuXHRzZWxlY3RQYWdlOiAoKT0+e1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IHRhciA9ICQoJ2FzaWRlIHNlbGVjdCcpO1xyXG5cdFx0bGV0IHR5cGUgPSB0YXIuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuYXR0cignYXR0ci10eXBlJyk7XHJcblx0XHRpZiAodHlwZSA9PSAxKXtcclxuXHRcdFx0ZmIuc2V0VG9rZW4odGFyLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmF0dHIoJ3ZhbHVlJykpO1xyXG5cdFx0fVxyXG5cdFx0ZmIuZmVlZCh0YXIudmFsKCksIHR5cGUsIGZiLm5leHQpO1xyXG5cdH0sXHJcblx0c2V0VG9rZW46IChwYWdlaWQpPT57XHJcblx0XHRsZXQgcGFnZXMgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmxvZ2luKVsxXTtcclxuXHRcdGZvcihsZXQgaSBvZiBwYWdlcyl7XHJcblx0XHRcdGlmIChpLmlkID09IHBhZ2VpZCl7XHJcblx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IGkuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRmZWVkOiAocGFnZUlELCB0eXBlLCB1cmwgPSAnJywgY2xlYXIgPSB0cnVlKT0+e1xyXG5cdFx0bGV0IGNvbW1hbmQgPSAodHlwZSA9PSAnMicpID8gJ2ZlZWQnOidwb3N0cyc7XHJcblx0XHRsZXQgYXBpO1xyXG5cdFx0bGV0IHN0YXJ0ID0gTWF0aC5mbG9vcihEYXRlLnBhcnNlKCQoJyNzdGFydF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5LW1tLWRkJykpLzEwMDApO1xyXG5cdFx0bGV0IGVuZCA9IE1hdGguZmxvb3IoRGF0ZS5wYXJzZSgkKCcjZW5kX2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXktbW0tZGQnKSkvMTAwMCk7XHJcblx0XHQvLzE0Njg0NjY5OTAwOTc2MjNcclxuXHRcdGlmICh1cmwgPT0gJycpe1xyXG5cdFx0XHRhcGkgPSBgJHtwYWdlSUR9LyR7Y29tbWFuZH0/c2luY2U9JHtzdGFydH0mdW50aWw9JHtlbmR9JmZpZWxkcz1saW5rLGZ1bGxfcGljdHVyZSxjcmVhdGVkX3RpbWUsbWVzc2FnZSZsaW1pdD0xMDBgO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGFwaSA9IHVybDtcclxuXHRcdH1cclxuXHRcdEZCLmFwaShhcGksZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDApe1xyXG5cdFx0XHRcdGZiLmZlZWRzID0gcmVzLmRhdGE7XHJcblx0XHRcdFx0aWYgKHJlcy5wYWdpbmcpe1xyXG5cdFx0XHRcdFx0bmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0ZGF0YS5zdGFydCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0YWxlcnQoJ+aykuacieizh+aWmScpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0ZnVuY3Rpb24gbmV4dCh1cmwpe1xyXG5cdFx0XHQkLmdldCh1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDApe1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0ZmIuZmVlZHMucHVzaChpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMucGFnaW5nKXtcclxuXHRcdFx0XHRcdFx0bmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGRhdGEuc3RhcnQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGRhdGEuc3RhcnQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXRNZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZWAsIChyZXMpPT57XHJcblx0XHRcdFx0bGV0IGFyciA9IFtyZXNdO1xyXG5cdFx0XHRcdHJlc29sdmUoYXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldFBhZ2U6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvYWNjb3VudHM/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldEdyb3VwOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwcz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0TmFtZTogKGlkcyk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8/aWRzPSR7aWRzLnRvU3RyaW5nKCl9YCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHByb21pc2VfYXJyYXk6IFtdLFxyXG5cdGZpbmFsQXJyYXk6IFtdLFxyXG5cdGRhdGVSYW5nZToge30sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGRhdGEucHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHR9LFxyXG5cdGRhdGVDaGVjazogKCk9PntcclxuXHRcdGxldCBzdGFydCA9ICQoJyNzdGFydF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5LW1tLWRkJyk7XHJcblx0XHRsZXQgZW5kID0gJCgnI2VuZF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5LW1tLWRkJyk7XHJcblx0XHRsZXQgbWVzc2FnZSA9ICcnO1xyXG5cdFx0aWYgKHN0YXJ0ID09ICcnIHx8IGVuZCA9PSAnJyl7XHJcblx0XHRcdG1lc3NhZ2UgPSAn6KuL6YG45pOH5pel5pyfJztcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsZXQgZDEgPSBuZXcgRGF0ZSgkKCcjc3RhcnRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnKS5waWNrKTtcclxuXHRcdFx0bGV0IGQyID0gbmV3IERhdGUoJCgnI2VuZF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcpLnBpY2spO1xyXG5cdFx0XHRpZiAoZDItZDEgPiA1MTg0MDAwMDAwKXtcclxuXHRcdFx0XHRtZXNzYWdlID0gJ+aXpeacn+WNgOmWk+S4jeiDvei2hemBjjYw5aSpJztcclxuXHRcdFx0fWVsc2UgaWYgKGQyPGQxKXtcclxuXHRcdFx0XHRsZXQgdGVtcCA9IHN0YXJ0O1xyXG5cdFx0XHRcdHN0YXJ0ID0gZW5kO1xyXG5cdFx0XHRcdGVuZCA9IHRlbXA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChtZXNzYWdlID09ICcnKXtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHQnY2hlY2snOiB0cnVlLFxyXG5cdFx0XHRcdCdyYW5nZSc6IGBzaW5jZT0ke3N0YXJ0fSZ1bnRpbD0ke2VuZH1gLFxyXG5cdFx0XHRcdCdzdHJpbmcnOiAkKCcjc3RhcnRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS9tbS9kZCcpICsgXCIgfiBcIiArICQoJyNlbmRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS9tbS9kZCcpLFxyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHQnY2hlY2snOiBmYWxzZSxcclxuXHRcdFx0XHQnbWVzc2FnZSc6IG1lc3NhZ2VcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6ICgpPT57XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdGxldCByYW5nZSA9IGRhdGEuZGF0ZUNoZWNrKCk7XHJcblx0XHRpZiAocmFuZ2UuY2hlY2sgPT09IHRydWUpe1xyXG5cdFx0XHRkYXRhLmRhdGVSYW5nZSA9IHJhbmdlO1xyXG5cdFx0XHRsZXQgYWxsID0gW107XHJcblx0XHRcdGZvcihsZXQgaiBvZiBmYi5mZWVkcyl7XHJcblx0XHRcdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0XHRcdGZ1bGxJRDogai5pZCxcclxuXHRcdFx0XHRcdG9iajoge31cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHByb21pc2UgPSBkYXRhLmdldChvYmopLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHRcdG9iai5kYXRhID0gcmVzO1xyXG5cdFx0XHRcdFx0YWxsLnB1c2gob2JqKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRkYXRhLnByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCcubG9hZGluZycpLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0XHRcdFByb21pc2UuYWxsKGRhdGEucHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRcdGRhdGEuY291bnRfc2NvcmUoYWxsKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0YWxlcnQocmFuZ2UubWVzc2FnZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xyXG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgY29tbWFuZCA9ICdjb21tZW50cyc7XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vY29tbWVudHM/JHtkYXRhLmRhdGVSYW5nZS5yYW5nZX0mb3JkZXI9Y2hyb25vbG9naWNhbCZmaWVsZHM9JHtjb25maWcuZmllbGRbY29tbWFuZF0udG9TdHJpbmcoKX0mYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn1gLChyZXMpPT57XHJcblx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKHJlcyk7XHJcblx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdGlmICghZC5pc19oaWRkZW4pe1xyXG5cdFx0XHRcdFx0XHRkLmNpZCA9IGQuZnJvbS5pZCArICdfJyArIGQuaWQuc3Vic3RyKDAsIGQuaWQuaW5kZXhPZignXycpKTtcclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQ9MCl7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKXtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCdsaW1pdD0nK2xpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpPT57XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjb3VudF9zY29yZTogKGFsbCk9PntcclxuXHRcdC8qXHJcblx0XHRcdOeVmeiogDPliIbjgIFUQUfkuIDlgIsx5YiG77yM5pyA5aSaM+WIhlxyXG5cdFx0XHTnlZnoqIDlv4Pmg4Uy5YCLMeWIhu+8jOeEoeaineS7tumAsuS9je+8jOacgOWkmjEz5YiGXHJcblx0XHRcdOeVmeiogOeahOeVmeiogOS4gOWAizHliIbvvIzmnIDlpKc25YiGXHJcblx0XHQqL1xyXG5cdFx0bGV0IHNjb3JlX2FycmF5ID0gW107XHJcblx0XHRmb3IobGV0IGkgb2YgYWxsKXtcclxuXHRcdFx0bGV0IGFyciA9IGkuZGF0YTtcclxuXHRcdFx0bGV0IHNjb3JlX3J1bGUgPSB7XHJcblx0XHRcdFx0J2NvbW1lbnRzJzogMSxcclxuXHRcdFx0XHQnY29tbWVudHNfbWF4JzogNixcclxuXHRcdFx0XHQncmVhY3Rpb25zJzogMC41LFxyXG5cdFx0XHRcdCdyZWFjdGlvbnNfbWF4JzogMTMsXHJcblx0XHRcdFx0J3RhZyc6IDEsXHJcblx0XHRcdFx0J3RhZ19tYXgnOiAzXHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHNjb3JlO1xyXG5cdFx0XHRmb3IobGV0IGogb2YgYXJyKXtcclxuXHRcdFx0XHRzY29yZSA9IDM7XHJcblx0XHRcdFx0c2NvcmUgKz0gKGouY29tbWVudF9jb3VudCpzY29yZV9ydWxlLmNvbW1lbnRzID4gc2NvcmVfcnVsZS5jb21tZW50c19tYXgpID8gc2NvcmVfcnVsZS5jb21tZW50c19tYXggOiBqLmNvbW1lbnRfY291bnQqc2NvcmVfcnVsZS5jb21tZW50cztcclxuXHRcdFx0XHRsZXQgdXNlciA9IHtcclxuXHRcdFx0XHRcdCdpZCc6IGouaWQsXHJcblx0XHRcdFx0XHQndXNlcmlkJzogai5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0J3VzZXJuYW1lJzogai5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHQnY29tbWVudF9jb3VudCc6IGouY29tbWVudF9jb3VudCxcclxuXHRcdFx0XHRcdCdtZXNzYWdlJzogai5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0J2NpZCc6IGouY2lkXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZiAoai5yZWFjdGlvbnMpe1xyXG5cdFx0XHRcdFx0aWYgKGoucmVhY3Rpb25zLmRhdGEubGVuZ3RoID09PSAyNSl7XHJcblx0XHRcdFx0XHRcdHVzZXIubGlrZV9jb3VudCA9IGoubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0c2NvcmUgKz0gc2NvcmVfcnVsZS5yZWFjdGlvbnNfbWF4O1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHVzZXIubGlrZV9jb3VudCA9IGoucmVhY3Rpb25zLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0XHRzY29yZSArPSBNYXRoLmNlaWwoai5yZWFjdGlvbnMuZGF0YS5sZW5ndGgqc2NvcmVfcnVsZS5yZWFjdGlvbnMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dXNlci5saWtlX2NvdW50ID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGoubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRcdHVzZXIudGFnX2NvdW50ID0gai5tZXNzYWdlX3RhZ3MubGVuZ3RoXHJcblx0XHRcdFx0XHRzY29yZSArPSAgKGoubWVzc2FnZV90YWdzLmxlbmd0aCAqIHNjb3JlX3J1bGUudGFnID49IHNjb3JlX3J1bGUudGFnX21heCkgPyBzY29yZV9ydWxlLnRhZ19tYXggOiBqLm1lc3NhZ2VfdGFncy5sZW5ndGggKiBzY29yZV9ydWxlLnRhZztcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHVzZXIudGFnX2NvdW50ID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dXNlci5zY29yZSA9IHNjb3JlO1xyXG5cdFx0XHRcdHNjb3JlX2FycmF5LnB1c2godXNlcik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIGNvbnNvbGUubG9nKHNjb3JlX2FycmF5KTtcclxuXHJcblx0XHRmdW5jdGlvbiByZW1vdmVfZHVwbGljYXRlX2NvbW1lbnQoYXJyKXtcclxuXHRcdFx0bGV0IGNpZEFycmF5ID0gW107XHJcblx0XHRcdGxldCB0ZW1wID0gJyc7XHJcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRcdGxldCBvYmogPSBpO1xyXG5cdFx0XHRcdGlmIChpLmNpZCA9PT0gdGVtcC5jaWQpe1xyXG5cdFx0XHRcdFx0bGV0IHRoaXNkYXRhID0gb2JqO1xyXG5cdFx0XHRcdFx0bGV0IGxhc3QgPSBjaWRBcnJheS5wb3AoKTtcclxuXHRcdFx0XHRcdGlmICh0aGlzZGF0YS5zY29yZSA+IGxhc3Quc2NvcmUpe1xyXG5cdFx0XHRcdFx0XHRsYXN0ID0gdGhpc2RhdGE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjaWRBcnJheS5wdXNoKGxhc3QpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dGVtcCA9IG9iajtcclxuXHRcdFx0XHRcdGNpZEFycmF5LnB1c2gob2JqKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGNpZEFycmF5O1xyXG5cdFx0fVxyXG5cdFx0bGV0IHNvcnRfYXJyYXkgPSByZW1vdmVfZHVwbGljYXRlX2NvbW1lbnQoc2NvcmVfYXJyYXkuc29ydCgoYSwgYikgPT4gYi5jaWQgLSBhLmNpZCkpO1xyXG5cdFx0ZGF0YS5tZXJnZURhdGEoc29ydF9hcnJheS5zb3J0KChhLCBiKSA9PiBiLnVzZXJpZCAtIGEudXNlcmlkKSk7XHJcblx0fSxcclxuXHRtZXJnZURhdGE6IChhcnIpPT57XHJcblx0XHRsZXQgZmluYWxBcnJheSA9IFtdO1xyXG5cdFx0bGV0IHRlbXAgPSAnJztcclxuXHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRsZXQgb2JqID0gaTtcclxuXHRcdFx0aWYgKGkudXNlcmlkID09PSB0ZW1wLnVzZXJpZCl7XHJcblx0XHRcdFx0bGV0IHRoaXNkYXRhID0gb2JqO1xyXG5cdFx0XHRcdGxldCBsYXN0ID0gZmluYWxBcnJheS5wb3AoKTtcclxuXHRcdFx0XHRsYXN0LmlkLnB1c2godGhpc2RhdGEpO1xyXG5cdFx0XHRcdGxhc3QuY29tbWVudF9jb3VudCArPSBvYmouY29tbWVudF9jb3VudDtcclxuXHRcdFx0XHRsYXN0Lmxpa2VfY291bnQgKz0gb2JqLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0bGFzdC50YWdfY291bnQgKz0gb2JqLnRhZ19jb3VudDtcclxuXHRcdFx0XHRsYXN0LnNjb3JlICs9IG9iai5zY29yZTtcclxuXHRcdFx0XHRmaW5hbEFycmF5LnB1c2gobGFzdCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGxldCB0aGlzZGF0YSA9IHtcclxuXHRcdFx0XHRcdCdpZCc6IG9iai5pZCxcclxuXHRcdFx0XHRcdCdtZXNzYWdlJzogb2JqLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHQnbGlrZV9jb3VudCc6IG9iai5saWtlX2NvdW50LFxyXG5cdFx0XHRcdFx0J2NvbW1lbnRfY291bnQnOiBvYmouY29tbWVudF9jb3VudCxcclxuXHRcdFx0XHRcdCd0YWdfY291bnQnOiBvYmoudGFnX2NvdW50LFxyXG5cdFx0XHRcdFx0J3Njb3JlJzogb2JqLnNjb3JlXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRvYmouaWQgPSBbdGhpc2RhdGFdO1xyXG5cdFx0XHRcdHRlbXAgPSBvYmo7XHJcblx0XHRcdFx0ZmluYWxBcnJheS5wdXNoKG9iaik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGRhdGEuZmluYWxBcnJheSA9IGZpbmFsQXJyYXkuc29ydCgoYSwgYikgPT4gYi5zY29yZSAtIGEuc2NvcmUpO1xyXG5cdFx0ZGF0YS5maW5hbEFycmF5ID0gZGF0YS5maW5hbEFycmF5Lm1hcCgoaXRlbSk9PntcclxuXHRcdFx0aXRlbS5mcm9tID0ge1xyXG5cdFx0XHRcdFwiaWRcIjogaXRlbS51c2VyaWQsXHJcblx0XHRcdFx0XCJuYW1lXCI6IGl0ZW0udXNlcm5hbWVcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gaXRlbTtcclxuXHRcdH0pO1xyXG5cdFx0Y29uc29sZS5sb2coZGF0YS5maW5hbEFycmF5KTtcclxuXHRcdCQoJy5sb2FkaW5nJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHJcblx0XHRsb2NhbFN0b3JhZ2UucmFua2VyID0gSlNPTi5zdHJpbmdpZnkoZGF0YS5maW5hbEFycmF5KTtcclxuXHRcdCQoJ2FzaWRlJykuYWRkQ2xhc3MoJ2ZpbmlzaCcpO1xyXG5cclxuXHRcdHRhYmxlLmdlbmVyYXRlKGRhdGEuZmluYWxBcnJheSk7XHJcblx0XHRjaGFydC5kcmF3KGRhdGEuZmluYWxBcnJheSk7XHJcblx0fVxyXG59XHJcbmxldCBjaGFydCA9IHtcclxuXHRkcmF3OiAoZmluYWxBcnJheSk9PntcclxuXHRcdGQzLnNlbGVjdChcInN2Z1wiKS5yZW1vdmUoKTtcclxuXHRcdGxldCBhcnIgPSBbXTtcclxuXHRcdGxldCB3ID0gNzUwO1xyXG5cdFx0bGV0IGNvdW50ID0gMTA7XHJcblx0XHRpZiAoZmluYWxBcnJheS5sZW5ndGggPCBjb3VudCkgY291bnQgPSBmaW5hbEFycmF5Lmxlbmd0aDtcclxuXHRcdGZvcihsZXQgaT0wOyBpPGNvdW50OyBpKyspe1xyXG5cdFx0XHRmaW5hbEFycmF5W2ldLmluZGV4ID0gaTtcclxuXHRcdFx0YXJyLnB1c2goZmluYWxBcnJheVtpXSk7XHJcblx0XHR9XHJcblx0XHR2YXIgbWF4U2NvcmUgPSBkMy5tYXgoYXJyLCBmdW5jdGlvbihkKXtyZXR1cm4gZC5zY29yZX0pO1xyXG5cdFx0Y29uc29sZS5sb2cobWF4U2NvcmUpXHJcblx0XHR2YXIgeFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcclxuXHRcdFx0XHRcdCAgIC5kb21haW4oWzAsIG1heFNjb3JlXSlcclxuXHRcdFx0XHRcdCAgIC5yYW5nZShbMCwgdy04MF0pO1xyXG5cclxuXHRcdHZhciBjID0gZDMuc2VsZWN0KCcuY2hhcnQnKS5hcHBlbmQoJ3N2ZycpO1xyXG5cdFx0Yy5zZWxlY3RBbGwoJ3JlY3QnKVxyXG5cdFx0IC5kYXRhKGFycilcclxuXHRcdCAuZW50ZXIoKVxyXG5cdFx0IC5hcHBlbmQoJ3JlY3QnKVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCdmaWxsJzogJyNFMDk3MkEnLFxyXG5cdFx0IFx0J3dpZHRoJzogMCxcclxuXHRcdCBcdCdoZWlnaHQnOiAnMzAnLFxyXG5cdFx0IFx0J3gnOiBmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIDA7XHJcblx0XHQgXHR9LFxyXG5cdFx0IFx0J3knOiBmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIGQuaW5kZXggKiA0MFxyXG5cdFx0IFx0fVxyXG5cdFx0IH0pXHJcblx0XHQgLnRyYW5zaXRpb24oKVxyXG5cdFx0IC5kdXJhdGlvbigxNTAwKVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCd3aWR0aCc6ZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiB4U2NhbGUoZC5zY29yZSk7XHJcblx0XHQgXHR9XHJcblx0XHQgfSk7XHJcblx0XHQgYy5zZWxlY3RBbGwoJ3RleHQuc2NvcmUnKVxyXG5cdFx0IC5kYXRhKGFycilcclxuXHRcdCAuZW50ZXIoKVxyXG5cdFx0IC5hcHBlbmQoJ3RleHQnKVxyXG5cdFx0IC50ZXh0KGZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0cmV0dXJuIGQuc2NvcmUgKyAn5YiGJztcclxuXHRcdCB9KVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCdmaWxsJzonI2UwOTcyYScsXHJcblx0XHQgXHQneCc6IDAsXHJcblx0XHQgXHQneSc6ZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiBkLmluZGV4ICogNDAgKyAyMFxyXG5cdFx0IFx0fVxyXG5cdFx0IH0pXHJcblx0XHQgLnRyYW5zaXRpb24oKVxyXG5cdFx0IC5kdXJhdGlvbigxNTAwKVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCd4JzpmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIHhTY2FsZShkLnNjb3JlKSArIDQwO1xyXG5cdFx0IFx0fVxyXG5cdFx0IH0pO1xyXG5cdFx0IGMuc2VsZWN0QWxsKCd0ZXh0Lm5hbWUnKVxyXG5cdFx0IC5kYXRhKGFycilcclxuXHRcdCAuZW50ZXIoKVxyXG5cdFx0IC5hcHBlbmQoJ3RleHQnKVxyXG5cdFx0IC50ZXh0KGZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0cmV0dXJuIGQudXNlcm5hbWU7XHJcblx0XHQgfSlcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQnZmlsbCc6JyNGRkYnLFxyXG5cdFx0IFx0J3RleHQtYW5jaG9yJzogJ2VuZCcsXHJcblx0XHQgXHQneCc6IDAsXHJcblx0XHQgXHQneSc6ZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiBkLmluZGV4ICogNDAgKyAyMFxyXG5cdFx0IFx0fVxyXG5cdFx0IH0pXHJcblx0XHQgLnRyYW5zaXRpb24oKVxyXG5cdFx0IC5kdXJhdGlvbigxNTAwKVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCd4JzpmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIHhTY2FsZShkLnNjb3JlKSAtIDEwO1xyXG5cdFx0IFx0fVxyXG5cdFx0IH0pO1xyXG5cdFx0IGMuc2VsZWN0QWxsKCdpbWcnKVxyXG5cdFx0IC5kYXRhKGFycilcclxuXHRcdCAuZW50ZXIoKVxyXG5cdFx0IC5hcHBlbmQoJ3N2ZzppbWFnZScpXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J3hsaW5rOmhyZWYnOiBmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuICdodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLycrZC51c2VyaWQrJy9waWN0dXJlP3dpZHRoPTMwJmhlaWdodD0zMCdcclxuXHRcdCBcdH0sXHJcblx0XHQgXHQnd2lkdGgnOiAzMCxcclxuXHRcdCBcdCdoZWlnaHQnOiAzMCxcclxuXHRcdCBcdCd4JzogMCxcclxuXHRcdCBcdCd5JzpmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIGQuaW5kZXggKiA0MFxyXG5cdFx0IFx0fVxyXG5cdFx0IH0pXHJcblx0XHQgLnRyYW5zaXRpb24oKVxyXG5cdFx0IC5kdXJhdGlvbigxNTAwKVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCd4JzpmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIHhTY2FsZShkLnNjb3JlKTtcclxuXHRcdCBcdH1cclxuXHRcdCB9KTtcclxuXHR9XHJcbn1cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSk9PntcclxuXHRcdCQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoJy5yZXN1bHQgLmluZm8gLmFsbF9wZW9wbGUgc3BhbicpLnRleHQocmF3ZGF0YS5sZW5ndGgpO1xyXG5cdFx0JCgnLnJlc3VsdCAuaW5mbyAuZGF0ZV9yYW5nZSBzcGFuJykudGV4dChkYXRhLmRhdGVSYW5nZS5zdHJpbmcpO1xyXG5cdFx0bGV0IGNvdW50ID0gMTtcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHJhd2RhdGEpe1xyXG5cdFx0XHR0Ym9keSArPSBgPHRyPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+JHtjb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7aS51c2VyaWR9XCIgdGFyZ2V0PV9ibGFuaz4ke2kudXNlcm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZD4ke2kuc2NvcmV9PC90ZD48dGQ+PGJ1dHRvbiBvbmNsaWNrPVwicG9wdXAuc2hvdygnJHtpLnVzZXJpZH0nKVwiPuips+e0sOizh+ioijwvYnV0dG9uPjwvdGQ+XHJcblx0XHRcdFx0XHQgIDwvdHI+YDtcclxuXHRcdFx0Y291bnQrKztcclxuXHRcdH1cclxuXHRcdCQoXCIudGFibGVzIHRhYmxlIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keSk7XHJcblxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlZG86ICgpPT57XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcbmxldCBwb3B1cCA9IHtcclxuXHRzaG93OiAodGFyKT0+e1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgZGF0YS5maW5hbEFycmF5KXtcclxuXHRcdFx0aWYgKHRhciA9PSBpLnVzZXJpZCl7XHJcblx0XHRcdFx0bGV0IGNvdW50ID0gMTtcclxuXHRcdFx0XHQkKCcucG9wdXAgcCBzcGFuJykudGV4dChpLnVzZXJuYW1lKTtcclxuXHRcdFx0XHRmb3IobGV0IGogb2YgaS5pZCl7XHJcblx0XHRcdFx0XHRsZXQgbWVzc2FnZSA9IGoubWVzc2FnZTtcclxuXHRcdFx0XHRcdGlmIChtZXNzYWdlID09ICcnKSBtZXNzYWdlID0gJz09PT0954Sh5YWn5paHPT09PT0nO1xyXG5cdFx0XHRcdFx0dGJvZHkgKz0gYDx0cj5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7ai5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke21lc3NhZ2V9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLmNvbW1lbnRfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2oudGFnX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLmxpa2VfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2ouc2NvcmV9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHQgIDwvdHI+YDtcclxuXHRcdFx0XHRcdGNvdW50Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQoXCIucG9wdXAgdGFibGUgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnLnBvcHVwJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHR9LFxyXG5cdGhpZGU6ICgpPT57XHJcblx0XHQkKCcucG9wdXAnKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdH1cclxufVxyXG5cclxuIGZ1bmN0aW9uIG9iajJBcnJheShvYmope1xyXG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xyXG4gXHRcdHJldHVybiBbdmFsdWVdO1xyXG4gXHR9KTtcclxuIFx0cmV0dXJuIGFycmF5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuIFx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG4gXHR2YXIgaSwgciwgdDtcclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0YXJ5W2ldID0gaTtcclxuIFx0fVxyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcbiBcdFx0dCA9IGFyeVtyXTtcclxuIFx0XHRhcnlbcl0gPSBhcnlbaV07XHJcbiBcdFx0YXJ5W2ldID0gdDtcclxuIFx0fVxyXG4gXHRyZXR1cm4gYXJ5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG4gICAgLy9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuICAgIHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuICAgIFxyXG4gICAgdmFyIENTViA9ICcnOyAgICBcclxuICAgIC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG4gICAgXHJcbiAgICAvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG4gICAgaWYgKFNob3dMYWJlbCkge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgICAgICByb3cgKz0gaW5kZXggKyAnLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG4gICAgICAgICAgICByb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoQ1NWID09ICcnKSB7ICAgICAgICBcclxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9ICAgXHJcbiAgICBcclxuICAgIC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuICAgIGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZyxcIl9cIik7ICAgXHJcbiAgICBcclxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcbiAgICB2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG4gICAgXHJcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuICAgIC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcbiAgICAvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcbiAgICBcclxuICAgIC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxyXG4gICAgbGluay5ocmVmID0gdXJpO1xyXG4gICAgXHJcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG4gICAgbGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG4gICAgXHJcbiAgICAvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgIGxpbmsuY2xpY2soKTtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXX0=
