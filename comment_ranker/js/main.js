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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImNvbmZpZyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJmYiIsIm5leHQiLCJmZWVkcyIsImdldEF1dGgiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzdGFydCIsInN3YWwiLCJkb25lIiwiZmJpZCIsImluaXQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0TWUiLCJnZXRQYWdlIiwiZ2V0R3JvdXAiLCJ0aGVuIiwicmVzIiwic2Vzc2lvblN0b3JhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2VuT3B0aW9uIiwib3B0aW9ucyIsImFkZENsYXNzIiwiaSIsImoiLCJpZCIsIm5hbWUiLCJhcHBlbmQiLCJzZWxlY3QyIiwic2VsZWN0UGFnZSIsInRhciIsImZpbmQiLCJhdHRyIiwic2V0VG9rZW4iLCJ2YWwiLCJwYWdlaWQiLCJwYWdlcyIsInBhcnNlIiwiYWNjZXNzX3Rva2VuIiwicGFnZUlEIiwiY2xlYXIiLCJjb21tYW5kIiwiYXBpIiwiTWF0aCIsImZsb29yIiwiRGF0ZSIsInBpY2thZGF0ZSIsImdldCIsImVuZCIsImRhdGEiLCJsZW5ndGgiLCJwYWdpbmciLCJhbGVydCIsInB1c2giLCJyZXNvbHZlIiwicmVqZWN0IiwiYXJyIiwiZ2V0TmFtZSIsImlkcyIsInRvU3RyaW5nIiwidXNlcmlkIiwibm93TGVuZ3RoIiwicHJvbWlzZV9hcnJheSIsImZpbmFsQXJyYXkiLCJkYXRlUmFuZ2UiLCJ0ZXh0IiwicmF3IiwiZGF0ZUNoZWNrIiwibWVzc2FnZSIsImQxIiwicGljayIsImQyIiwidGVtcCIsInJhbmdlIiwiY2hlY2siLCJvYmoiLCJmdWxsSUQiLCJwcm9taXNlIiwiY291bnRfc2NvcmUiLCJkYXRhcyIsImQiLCJpc19oaWRkZW4iLCJjaWQiLCJmcm9tIiwic3Vic3RyIiwiZ2V0TmV4dCIsInJlcGxhY2UiLCJnZXRKU09OIiwiZmFpbCIsInNjb3JlX2FycmF5Iiwic2NvcmVfcnVsZSIsInNjb3JlIiwiY29tbWVudF9jb3VudCIsImNvbW1lbnRzX21heCIsInVzZXIiLCJsaWtlX2NvdW50IiwicmVhY3Rpb25zX21heCIsImNlaWwiLCJtZXNzYWdlX3RhZ3MiLCJ0YWdfY291bnQiLCJ0YWciLCJ0YWdfbWF4IiwicmVtb3ZlX2R1cGxpY2F0ZV9jb21tZW50IiwiY2lkQXJyYXkiLCJ0aGlzZGF0YSIsImxhc3QiLCJwb3AiLCJzb3J0X2FycmF5Iiwic29ydCIsImEiLCJiIiwibWVyZ2VEYXRhIiwibWFwIiwiaXRlbSIsInVzZXJuYW1lIiwicmVtb3ZlQ2xhc3MiLCJsb2NhbFN0b3JhZ2UiLCJyYW5rZXIiLCJ0YWJsZSIsImdlbmVyYXRlIiwiY2hhcnQiLCJkcmF3IiwiZDMiLCJzZWxlY3QiLCJyZW1vdmUiLCJ3IiwiY291bnQiLCJpbmRleCIsIm1heFNjb3JlIiwibWF4IiwieFNjYWxlIiwic2NhbGUiLCJsaW5lYXIiLCJkb21haW4iLCJjIiwic2VsZWN0QWxsIiwiZW50ZXIiLCJ0cmFuc2l0aW9uIiwiZHVyYXRpb24iLCJyYXdkYXRhIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsInN0cmluZyIsInRib2R5IiwiaHRtbCIsImFjdGl2ZSIsInJlZG8iLCJmaWx0ZXIiLCJwb3B1cCIsInNob3ciLCJoaWRlIiwib2JqMkFycmF5IiwiYXJyYXkiLCJ2YWx1ZSIsImdlblJhbmRvbUFycmF5IiwibiIsImFyeSIsIkFycmF5IiwiciIsInQiLCJyYW5kb20iLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJsaW5rIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjbGljayIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBOztBQUVELElBQUlXLFNBQVM7QUFDWkMsUUFBTztBQUNOQyxZQUFVLENBQUMsTUFBRCxFQUFRLFlBQVIsRUFBcUIsZUFBckIsRUFBcUMsV0FBckMsRUFBaUQsV0FBakQsRUFBNkQsU0FBN0QsRUFBdUUsY0FBdkUsQ0FESjtBQUVOQyxhQUFXLEVBRkw7QUFHTkMsZUFBYSxDQUFDLE9BQUQsRUFBUyxNQUFULEVBQWlCLGNBQWpCLENBSFA7QUFJTkMsZ0JBQWMsRUFKUjtBQUtOQyxRQUFNO0FBTEEsRUFESztBQVFaQyxRQUFPO0FBQ05MLFlBQVUsS0FESjtBQUVOQyxhQUFXLEtBRkw7QUFHTkMsZUFBYSxLQUhQO0FBSU5DLGdCQUFjLEtBSlI7QUFLTkMsUUFBTTtBQUxBLEVBUks7QUFlWkUsYUFBWTtBQUNYTixZQUFVLE1BREM7QUFFWEMsYUFBVyxNQUZBO0FBR1hDLGVBQWEsTUFIRjtBQUlYQyxnQkFBYyxNQUpIO0FBS1hDLFFBQU0sTUFMSztBQU1YRyxTQUFPLE1BTkk7QUFPWEMsVUFBUTtBQVBHLEVBZkE7QUF3QlpDLE9BQU0seURBeEJNO0FBeUJaQyxZQUFXLEtBekJDO0FBMEJaQyxZQUFXO0FBMUJDLENBQWI7O0FBNkJBLElBQUlDLEtBQUs7QUFDUkMsT0FBTSxFQURFO0FBRVJDLFFBQU8sRUFGQztBQUdSQyxVQUFTLGlCQUFDQyxJQUFELEVBQVE7QUFDaEJDLEtBQUdDLEtBQUgsQ0FBUyxVQUFTQyxRQUFULEVBQW1CO0FBQzNCUCxNQUFHUSxRQUFILENBQVlELFFBQVosRUFBc0JILElBQXRCO0FBQ0EsR0FGRCxFQUVHLEVBQUNLLE9BQU92QixPQUFPVyxJQUFmLEVBQXFCYSxlQUFlLElBQXBDLEVBRkg7QUFHQSxFQVBPO0FBUVJGLFdBQVUsa0JBQUNELFFBQUQsRUFBV0gsSUFBWCxFQUFrQjtBQUMzQixNQUFJRyxTQUFTSSxNQUFULEtBQW9CLFdBQXhCLEVBQXFDO0FBQ3BDN0IsV0FBUUMsR0FBUixDQUFZd0IsUUFBWjtBQUNBLE9BQUlILFFBQVEsVUFBWixFQUF1QjtBQUN0QixRQUFJUSxVQUFVTCxTQUFTTSxZQUFULENBQXNCQyxhQUFwQztBQUNBLFFBQUlGLFFBQVFHLE9BQVIsQ0FBZ0IsY0FBaEIsS0FBbUMsQ0FBbkMsSUFBd0NILFFBQVFHLE9BQVIsQ0FBZ0IscUJBQWhCLEtBQTBDLENBQWxGLElBQXVGSCxRQUFRRyxPQUFSLENBQWdCLFlBQWhCLEtBQWlDLENBQTVILEVBQThIO0FBQzdIZixRQUFHZ0IsS0FBSDtBQUNBLEtBRkQsTUFFSztBQUNKQyxVQUNDLGNBREQsRUFFQyxpREFGRCxFQUdDLE9BSEQsRUFJR0MsSUFKSDtBQUtBO0FBQ0QsSUFYRCxNQVdLO0FBQ0pDLFNBQUtDLElBQUwsQ0FBVWhCLElBQVY7QUFDQTtBQUNELEdBaEJELE1BZ0JLO0FBQ0pDLE1BQUdDLEtBQUgsQ0FBUyxVQUFTQyxRQUFULEVBQW1CO0FBQzNCUCxPQUFHUSxRQUFILENBQVlELFFBQVosRUFBc0JILElBQXRCO0FBQ0EsSUFGRCxFQUVHLEVBQUNLLE9BQU92QixPQUFPVyxJQUFmLEVBQXFCYSxlQUFlLElBQXBDLEVBRkg7QUFHQTtBQUNELEVBOUJPO0FBK0JSTSxRQUFPLGlCQUFJO0FBQ1ZLLFVBQVFDLEdBQVIsQ0FBWSxDQUFDdEIsR0FBR3VCLEtBQUgsRUFBRCxFQUFZdkIsR0FBR3dCLE9BQUgsRUFBWixFQUEwQnhCLEdBQUd5QixRQUFILEVBQTFCLENBQVosRUFBc0RDLElBQXRELENBQTJELFVBQUNDLEdBQUQsRUFBTztBQUNqRUMsa0JBQWV0QixLQUFmLEdBQXVCdUIsS0FBS0MsU0FBTCxDQUFlSCxHQUFmLENBQXZCO0FBQ0EzQixNQUFHK0IsU0FBSCxDQUFhSixHQUFiO0FBQ0EsR0FIRDtBQUlBLEVBcENPO0FBcUNSSSxZQUFXLG1CQUFDSixHQUFELEVBQU87QUFDakIzQixLQUFHQyxJQUFILEdBQVUsRUFBVjtBQUNBLE1BQUkrQixVQUFVLEVBQWQ7QUFDQSxNQUFJNUIsT0FBTyxDQUFDLENBQVo7QUFDQXBCLElBQUUsT0FBRixFQUFXaUQsUUFBWCxDQUFvQixPQUFwQjtBQUppQjtBQUFBO0FBQUE7O0FBQUE7QUFLakIsd0JBQWFOLEdBQWIsOEhBQWlCO0FBQUEsUUFBVE8sQ0FBUzs7QUFDaEI5QjtBQURnQjtBQUFBO0FBQUE7O0FBQUE7QUFFaEIsMkJBQWE4QixDQUFiLG1JQUFlO0FBQUEsVUFBUEMsQ0FBTzs7QUFDZEgsMENBQWlDNUIsSUFBakMsbUJBQWlEK0IsRUFBRUMsRUFBbkQsV0FBMERELEVBQUVFLElBQTVEO0FBQ0E7QUFKZTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS2hCO0FBVmdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBV2pCckQsSUFBRSxxQkFBRixFQUF5QnNELE1BQXpCLENBQWdDTixPQUFoQztBQUNBaEQsSUFBRSxjQUFGLEVBQWtCdUQsT0FBbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBdERPO0FBdURSQyxhQUFZLHNCQUFJO0FBQ2Z4QyxLQUFHQyxJQUFILEdBQVUsRUFBVjtBQUNBLE1BQUl3QyxNQUFNekQsRUFBRSxjQUFGLENBQVY7QUFDQSxNQUFJb0IsT0FBT3FDLElBQUlDLElBQUosQ0FBUyxpQkFBVCxFQUE0QkMsSUFBNUIsQ0FBaUMsV0FBakMsQ0FBWDtBQUNBLE1BQUl2QyxRQUFRLENBQVosRUFBYztBQUNiSixNQUFHNEMsUUFBSCxDQUFZSCxJQUFJQyxJQUFKLENBQVMsaUJBQVQsRUFBNEJDLElBQTVCLENBQWlDLE9BQWpDLENBQVo7QUFDQTtBQUNEM0MsS0FBR1IsSUFBSCxDQUFRaUQsSUFBSUksR0FBSixFQUFSLEVBQW1CekMsSUFBbkIsRUFBeUJKLEdBQUdDLElBQTVCO0FBQ0EsRUEvRE87QUFnRVIyQyxXQUFVLGtCQUFDRSxNQUFELEVBQVU7QUFDbkIsTUFBSUMsUUFBUWxCLEtBQUttQixLQUFMLENBQVdwQixlQUFldEIsS0FBMUIsRUFBaUMsQ0FBakMsQ0FBWjtBQURtQjtBQUFBO0FBQUE7O0FBQUE7QUFFbkIseUJBQWF5QyxLQUFiLG1JQUFtQjtBQUFBLFFBQVhiLENBQVc7O0FBQ2xCLFFBQUlBLEVBQUVFLEVBQUYsSUFBUVUsTUFBWixFQUFtQjtBQUNsQjVELFlBQU9hLFNBQVAsR0FBbUJtQyxFQUFFZSxZQUFyQjtBQUNBO0FBQ0Q7QUFOa0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9uQixFQXZFTztBQXdFUnpELE9BQU0sY0FBQzBELE1BQUQsRUFBUzlDLElBQVQsRUFBd0M7QUFBQSxNQUF6QnhCLEdBQXlCLHVFQUFuQixFQUFtQjtBQUFBLE1BQWZ1RSxLQUFlLHVFQUFQLElBQU87O0FBQzdDLE1BQUlDLFVBQVdoRCxRQUFRLEdBQVQsR0FBZ0IsTUFBaEIsR0FBdUIsT0FBckM7QUFDQSxNQUFJaUQsWUFBSjtBQUNBLE1BQUlyQyxRQUFRc0MsS0FBS0MsS0FBTCxDQUFXQyxLQUFLUixLQUFMLENBQVdoRSxFQUFFLGFBQUYsRUFBaUJ5RSxTQUFqQixDQUEyQixRQUEzQixFQUFxQ0MsR0FBckMsQ0FBeUMsUUFBekMsRUFBbUQsWUFBbkQsQ0FBWCxJQUE2RSxJQUF4RixDQUFaO0FBQ0EsTUFBSUMsTUFBTUwsS0FBS0MsS0FBTCxDQUFXQyxLQUFLUixLQUFMLENBQVdoRSxFQUFFLFdBQUYsRUFBZXlFLFNBQWYsQ0FBeUIsUUFBekIsRUFBbUNDLEdBQW5DLENBQXVDLFFBQXZDLEVBQWlELFlBQWpELENBQVgsSUFBMkUsSUFBdEYsQ0FBVjtBQUNBO0FBQ0EsTUFBSTlFLE9BQU8sRUFBWCxFQUFjO0FBQ2J5RSxTQUFTSCxNQUFULFNBQW1CRSxPQUFuQixlQUFvQ3BDLEtBQXBDLGVBQW1EMkMsR0FBbkQ7QUFDQSxHQUZELE1BRUs7QUFDSk4sU0FBTXpFLEdBQU47QUFDQTtBQUNEeUIsS0FBR2dELEdBQUgsQ0FBT0EsR0FBUCxFQUFXLFVBQVMxQixHQUFULEVBQWE7QUFDdkIsT0FBSUEsSUFBSWlDLElBQUosQ0FBU0MsTUFBVCxHQUFrQixDQUF0QixFQUF3QjtBQUN2QjdELE9BQUdFLEtBQUgsR0FBV3lCLElBQUlpQyxJQUFmO0FBQ0EsUUFBSWpDLElBQUltQyxNQUFSLEVBQWU7QUFDZDdELFVBQUswQixJQUFJbUMsTUFBSixDQUFXN0QsSUFBaEI7QUFDQSxLQUZELE1BRUs7QUFDSjJELFVBQUs1QyxLQUFMO0FBQ0E7QUFDRCxJQVBELE1BT0s7QUFDSitDLFVBQU0sTUFBTjtBQUNBO0FBQ0QsR0FYRDtBQVlBLFdBQVM5RCxJQUFULENBQWNyQixHQUFkLEVBQWtCO0FBQ2pCLE9BQUlBLEdBQUosRUFBUTtBQUNQSSxNQUFFMEUsR0FBRixDQUFNOUUsR0FBTixFQUFXLFVBQVMrQyxHQUFULEVBQWE7QUFDdkIsU0FBSUEsSUFBSWlDLElBQUosQ0FBU0MsTUFBVCxHQUFrQixDQUF0QixFQUF3QjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUN2Qiw2QkFBYWxDLElBQUlpQyxJQUFqQixtSUFBc0I7QUFBQSxZQUFkMUIsQ0FBYzs7QUFDckJsQyxXQUFHRSxLQUFILENBQVM4RCxJQUFULENBQWM5QixDQUFkO0FBQ0E7QUFIc0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFJdkIsVUFBSVAsSUFBSW1DLE1BQVIsRUFBZTtBQUNkN0QsWUFBSzBCLElBQUltQyxNQUFKLENBQVc3RCxJQUFoQjtBQUNBLE9BRkQsTUFFSztBQUNKMkQsWUFBSzVDLEtBQUw7QUFDQTtBQUNELE1BVEQsTUFTSztBQUNKNEMsV0FBSzVDLEtBQUw7QUFDQTtBQUNELEtBYkQ7QUFjQTtBQUNEO0FBQ0QsRUFqSE87QUFrSFJPLFFBQU8saUJBQUk7QUFDVixTQUFPLElBQUlGLE9BQUosQ0FBWSxVQUFDNEMsT0FBRCxFQUFVQyxNQUFWLEVBQW1CO0FBQ3JDN0QsTUFBR2dELEdBQUgsQ0FBVW5FLE9BQU9RLFVBQVAsQ0FBa0JFLE1BQTVCLFVBQXlDLFVBQUMrQixHQUFELEVBQU87QUFDL0MsUUFBSXdDLE1BQU0sQ0FBQ3hDLEdBQUQsQ0FBVjtBQUNBc0MsWUFBUUUsR0FBUjtBQUNBLElBSEQ7QUFJQSxHQUxNLENBQVA7QUFNQSxFQXpITztBQTBIUjNDLFVBQVMsbUJBQUk7QUFDWixTQUFPLElBQUlILE9BQUosQ0FBWSxVQUFDNEMsT0FBRCxFQUFVQyxNQUFWLEVBQW1CO0FBQ3JDN0QsTUFBR2dELEdBQUgsQ0FBVW5FLE9BQU9RLFVBQVAsQ0FBa0JFLE1BQTVCLDZCQUE0RCxVQUFDK0IsR0FBRCxFQUFPO0FBQ2xFc0MsWUFBUXRDLElBQUlpQyxJQUFaO0FBQ0EsSUFGRDtBQUdBLEdBSk0sQ0FBUDtBQUtBLEVBaElPO0FBaUlSbkMsV0FBVSxvQkFBSTtBQUNiLFNBQU8sSUFBSUosT0FBSixDQUFZLFVBQUM0QyxPQUFELEVBQVVDLE1BQVYsRUFBbUI7QUFDckM3RCxNQUFHZ0QsR0FBSCxDQUFVbkUsT0FBT1EsVUFBUCxDQUFrQkUsTUFBNUIsMkJBQTBELFVBQUMrQixHQUFELEVBQU87QUFDaEVzQyxZQUFRdEMsSUFBSWlDLElBQVo7QUFDQSxJQUZEO0FBR0EsR0FKTSxDQUFQO0FBS0EsRUF2SU87QUF3SVJRLFVBQVMsaUJBQUNDLEdBQUQsRUFBTztBQUNmLFNBQU8sSUFBSWhELE9BQUosQ0FBWSxVQUFDNEMsT0FBRCxFQUFVQyxNQUFWLEVBQW1CO0FBQ3JDN0QsTUFBR2dELEdBQUgsQ0FBVW5FLE9BQU9RLFVBQVAsQ0FBa0JFLE1BQTVCLGNBQTJDeUUsSUFBSUMsUUFBSixFQUEzQyxFQUE2RCxVQUFDM0MsR0FBRCxFQUFPO0FBQ25Fc0MsWUFBUXRDLEdBQVI7QUFDQSxJQUZEO0FBR0EsR0FKTSxDQUFQO0FBS0E7QUE5SU8sQ0FBVDs7QUFpSkEsSUFBSWlDLE9BQU87QUFDVlcsU0FBUSxFQURFO0FBRVZDLFlBQVcsQ0FGRDtBQUdWMUUsWUFBVyxLQUhEO0FBSVYyRSxnQkFBZSxFQUpMO0FBS1ZDLGFBQVksRUFMRjtBQU1WQyxZQUFXLEVBTkQ7QUFPVnZELE9BQU0sZ0JBQUk7QUFDVHBDLElBQUUsbUJBQUYsRUFBdUI0RixJQUF2QixDQUE0QixFQUE1QjtBQUNBaEIsT0FBS1ksU0FBTCxHQUFpQixDQUFqQjtBQUNBWixPQUFLYSxhQUFMLEdBQXFCLEVBQXJCO0FBQ0FiLE9BQUtpQixHQUFMLEdBQVcsRUFBWDtBQUNBLEVBWlM7QUFhVkMsWUFBVyxxQkFBSTtBQUNkLE1BQUk5RCxRQUFRaEMsRUFBRSxhQUFGLEVBQWlCeUUsU0FBakIsQ0FBMkIsUUFBM0IsRUFBcUNDLEdBQXJDLENBQXlDLFFBQXpDLEVBQW1ELFlBQW5ELENBQVo7QUFDQSxNQUFJQyxNQUFNM0UsRUFBRSxXQUFGLEVBQWV5RSxTQUFmLENBQXlCLFFBQXpCLEVBQW1DQyxHQUFuQyxDQUF1QyxRQUF2QyxFQUFpRCxZQUFqRCxDQUFWO0FBQ0EsTUFBSXFCLFVBQVUsRUFBZDtBQUNBLE1BQUkvRCxTQUFTLEVBQVQsSUFBZTJDLE9BQU8sRUFBMUIsRUFBNkI7QUFDNUJvQixhQUFVLE9BQVY7QUFDQSxHQUZELE1BRUs7QUFDSixPQUFJQyxLQUFLLElBQUl4QixJQUFKLENBQVN4RSxFQUFFLGFBQUYsRUFBaUJ5RSxTQUFqQixDQUEyQixRQUEzQixFQUFxQ0MsR0FBckMsQ0FBeUMsUUFBekMsRUFBbUR1QixJQUE1RCxDQUFUO0FBQ0EsT0FBSUMsS0FBSyxJQUFJMUIsSUFBSixDQUFTeEUsRUFBRSxXQUFGLEVBQWV5RSxTQUFmLENBQXlCLFFBQXpCLEVBQW1DQyxHQUFuQyxDQUF1QyxRQUF2QyxFQUFpRHVCLElBQTFELENBQVQ7QUFDQSxPQUFJQyxLQUFHRixFQUFILEdBQVEsVUFBWixFQUF1QjtBQUN0QkQsY0FBVSxhQUFWO0FBQ0EsSUFGRCxNQUVNLElBQUlHLEtBQUdGLEVBQVAsRUFBVTtBQUNmLFFBQUlHLE9BQU9uRSxLQUFYO0FBQ0FBLFlBQVEyQyxHQUFSO0FBQ0FBLFVBQU13QixJQUFOO0FBQ0E7QUFDRDtBQUNELE1BQUlKLFdBQVcsRUFBZixFQUFrQjtBQUNqQixVQUFPO0FBQ04sYUFBUyxJQURIO0FBRU4sd0JBQWtCL0QsS0FBbEIsZUFBaUMyQyxHQUYzQjtBQUdOLGNBQVUzRSxFQUFFLGFBQUYsRUFBaUJ5RSxTQUFqQixDQUEyQixRQUEzQixFQUFxQ0MsR0FBckMsQ0FBeUMsUUFBekMsRUFBbUQsWUFBbkQsSUFBbUUsS0FBbkUsR0FBMkUxRSxFQUFFLFdBQUYsRUFBZXlFLFNBQWYsQ0FBeUIsUUFBekIsRUFBbUNDLEdBQW5DLENBQXVDLFFBQXZDLEVBQWlELFlBQWpEO0FBSC9FLElBQVA7QUFLQSxHQU5ELE1BTUs7QUFDSixVQUFPO0FBQ04sYUFBUyxLQURIO0FBRU4sZUFBV3FCO0FBRkwsSUFBUDtBQUlBO0FBQ0QsRUExQ1M7QUEyQ1YvRCxRQUFPLGlCQUFJO0FBQ1Y0QyxPQUFLeEMsSUFBTDtBQUNBLE1BQUlnRSxRQUFReEIsS0FBS2tCLFNBQUwsRUFBWjtBQUNBLE1BQUlNLE1BQU1DLEtBQU4sS0FBZ0IsSUFBcEIsRUFBeUI7QUFBQTtBQUN4QnpCLFNBQUtlLFNBQUwsR0FBaUJTLEtBQWpCO0FBQ0EsUUFBSTlELE1BQU0sRUFBVjtBQUZ3QjtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLFVBR2hCYSxDQUhnQjs7QUFJdkIsVUFBSW1ELE1BQU07QUFDVEMsZUFBUXBELEVBQUVDLEVBREQ7QUFFVGtELFlBQUs7QUFGSSxPQUFWO0FBSUEsVUFBSUUsVUFBVTVCLEtBQUtGLEdBQUwsQ0FBUzRCLEdBQVQsRUFBYzVELElBQWQsQ0FBbUIsVUFBQ0MsR0FBRCxFQUFPO0FBQ3ZDMkQsV0FBSTFCLElBQUosR0FBV2pDLEdBQVg7QUFDQUwsV0FBSTBDLElBQUosQ0FBU3NCLEdBQVQ7QUFDQSxPQUhhLENBQWQ7QUFJQTFCLFdBQUthLGFBQUwsQ0FBbUJULElBQW5CLENBQXdCd0IsT0FBeEI7QUFadUI7O0FBR3hCLDJCQUFheEYsR0FBR0UsS0FBaEIsbUlBQXNCO0FBQUE7QUFVckI7QUFidUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFjeEJsQixNQUFFLFVBQUYsRUFBY2lELFFBQWQsQ0FBdUIsTUFBdkI7QUFDQVosWUFBUUMsR0FBUixDQUFZc0MsS0FBS2EsYUFBakIsRUFBZ0MvQyxJQUFoQyxDQUFxQyxZQUFJO0FBQ3hDa0MsVUFBSzZCLFdBQUwsQ0FBaUJuRSxHQUFqQjtBQUNBLEtBRkQ7QUFmd0I7QUFrQnhCLEdBbEJELE1Ba0JLO0FBQ0p5QyxTQUFNcUIsTUFBTUwsT0FBWjtBQUNBO0FBQ0QsRUFuRVM7QUFvRVZyQixNQUFLLGFBQUN2QyxJQUFELEVBQVE7QUFDWixTQUFPLElBQUlFLE9BQUosQ0FBWSxVQUFDNEMsT0FBRCxFQUFVQyxNQUFWLEVBQW1CO0FBQ3JDLE9BQUl3QixRQUFRLEVBQVo7QUFDQSxPQUFJakIsZ0JBQWdCLEVBQXBCO0FBQ0EsT0FBSXJCLFVBQVUsVUFBZDtBQUNBL0MsTUFBR2dELEdBQUgsQ0FBVW5FLE9BQU9RLFVBQVAsQ0FBa0IwRCxPQUFsQixDQUFWLFNBQXdDakMsS0FBS29FLE1BQTdDLGtCQUFnRTNCLEtBQUtlLFNBQUwsQ0FBZVMsS0FBL0Usb0NBQW1IbEcsT0FBT0MsS0FBUCxDQUFhaUUsT0FBYixFQUFzQmtCLFFBQXRCLEVBQW5ILHNCQUFvS3BGLE9BQU9hLFNBQTNLLEVBQXVMLFVBQUM0QixHQUFELEVBQU87QUFDN0xpQyxTQUFLWSxTQUFMLElBQWtCN0MsSUFBSWlDLElBQUosQ0FBU0MsTUFBM0I7QUFDQTdFLE1BQUUsbUJBQUYsRUFBdUI0RixJQUF2QixDQUE0QixVQUFTaEIsS0FBS1ksU0FBZCxHQUF5QixTQUFyRDtBQUNBO0FBSDZMO0FBQUE7QUFBQTs7QUFBQTtBQUk3TCwyQkFBYTdDLElBQUlpQyxJQUFqQixtSUFBc0I7QUFBQSxVQUFkK0IsQ0FBYzs7QUFDckIsVUFBSSxDQUFDQSxFQUFFQyxTQUFQLEVBQWlCO0FBQ2hCRCxTQUFFRSxHQUFGLEdBQVFGLEVBQUVHLElBQUYsQ0FBTzFELEVBQVAsR0FBWSxHQUFaLEdBQWtCdUQsRUFBRXZELEVBQUYsQ0FBSzJELE1BQUwsQ0FBWSxDQUFaLEVBQWVKLEVBQUV2RCxFQUFGLENBQUtyQixPQUFMLENBQWEsR0FBYixDQUFmLENBQTFCO0FBQ0EyRSxhQUFNMUIsSUFBTixDQUFXMkIsQ0FBWDtBQUNBO0FBQ0Q7QUFUNEw7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFVN0wsUUFBSWhFLElBQUlpQyxJQUFKLENBQVNDLE1BQVQsR0FBa0IsQ0FBbEIsSUFBdUJsQyxJQUFJbUMsTUFBSixDQUFXN0QsSUFBdEMsRUFBMkM7QUFDMUMrRixhQUFRckUsSUFBSW1DLE1BQUosQ0FBVzdELElBQW5CO0FBQ0EsS0FGRCxNQUVLO0FBQ0pnRSxhQUFReUIsS0FBUjtBQUNBO0FBQ0QsSUFmRDs7QUFpQkEsWUFBU00sT0FBVCxDQUFpQnBILEdBQWpCLEVBQThCO0FBQUEsUUFBUmEsS0FBUSx1RUFBRixDQUFFOztBQUM3QixRQUFJQSxVQUFVLENBQWQsRUFBZ0I7QUFDZmIsV0FBTUEsSUFBSXFILE9BQUosQ0FBWSxXQUFaLEVBQXdCLFdBQVN4RyxLQUFqQyxDQUFOO0FBQ0E7QUFDRFQsTUFBRWtILE9BQUYsQ0FBVXRILEdBQVYsRUFBZSxVQUFTK0MsR0FBVCxFQUFhO0FBQzNCaUMsVUFBS1ksU0FBTCxJQUFrQjdDLElBQUlpQyxJQUFKLENBQVNDLE1BQTNCO0FBQ0E3RSxPQUFFLG1CQUFGLEVBQXVCNEYsSUFBdkIsQ0FBNEIsVUFBU2hCLEtBQUtZLFNBQWQsR0FBeUIsU0FBckQ7QUFGMkI7QUFBQTtBQUFBOztBQUFBO0FBRzNCLDRCQUFhN0MsSUFBSWlDLElBQWpCLG1JQUFzQjtBQUFBLFdBQWQrQixDQUFjOztBQUNyQkQsYUFBTTFCLElBQU4sQ0FBVzJCLENBQVg7QUFDQTtBQUwwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU0zQixTQUFJaEUsSUFBSWlDLElBQUosQ0FBU0MsTUFBVCxHQUFrQixDQUFsQixJQUF1QmxDLElBQUltQyxNQUFKLENBQVc3RCxJQUF0QyxFQUEyQztBQUMxQytGLGNBQVFyRSxJQUFJbUMsTUFBSixDQUFXN0QsSUFBbkI7QUFDQSxNQUZELE1BRUs7QUFDSmdFLGNBQVF5QixLQUFSO0FBQ0E7QUFDRCxLQVhELEVBV0dTLElBWEgsQ0FXUSxZQUFJO0FBQ1hILGFBQVFwSCxHQUFSLEVBQWEsR0FBYjtBQUNBLEtBYkQ7QUFjQTtBQUNELEdBeENNLENBQVA7QUF5Q0EsRUE5R1M7QUErR1Y2RyxjQUFhLHFCQUFDbkUsR0FBRCxFQUFPO0FBQ25COzs7OztBQUtBLE1BQUk4RSxjQUFjLEVBQWxCO0FBTm1CO0FBQUE7QUFBQTs7QUFBQTtBQU9uQix5QkFBYTlFLEdBQWIsbUlBQWlCO0FBQUEsUUFBVFksQ0FBUzs7QUFDaEIsUUFBSWlDLE1BQU1qQyxFQUFFMEIsSUFBWjtBQUNBLFFBQUl5QyxhQUFhO0FBQ2hCLGlCQUFZLENBREk7QUFFaEIscUJBQWdCLENBRkE7QUFHaEIsa0JBQWEsR0FIRztBQUloQixzQkFBaUIsRUFKRDtBQUtoQixZQUFPLENBTFM7QUFNaEIsZ0JBQVc7QUFOSyxLQUFqQjtBQVFBLFFBQUlDLGNBQUo7QUFWZ0I7QUFBQTtBQUFBOztBQUFBO0FBV2hCLDRCQUFhbkMsR0FBYix3SUFBaUI7QUFBQSxVQUFUaEMsQ0FBUzs7QUFDaEJtRSxjQUFRLENBQVI7QUFDQUEsZUFBVW5FLEVBQUVvRSxhQUFGLEdBQWdCRixXQUFXakgsUUFBM0IsR0FBc0NpSCxXQUFXRyxZQUFsRCxHQUFrRUgsV0FBV0csWUFBN0UsR0FBNEZyRSxFQUFFb0UsYUFBRixHQUFnQkYsV0FBV2pILFFBQWhJO0FBQ0EsVUFBSXFILE9BQU87QUFDVixhQUFNdEUsRUFBRUMsRUFERTtBQUVWLGlCQUFVRCxFQUFFMkQsSUFBRixDQUFPMUQsRUFGUDtBQUdWLG1CQUFZRCxFQUFFMkQsSUFBRixDQUFPekQsSUFIVDtBQUlWLHdCQUFpQkYsRUFBRW9FLGFBSlQ7QUFLVixrQkFBV3BFLEVBQUU0QyxPQUxIO0FBTVYsY0FBTzVDLEVBQUUwRDtBQU5DLE9BQVg7QUFRQSxVQUFJMUQsRUFBRTlDLFNBQU4sRUFBZ0I7QUFDZixXQUFJOEMsRUFBRTlDLFNBQUYsQ0FBWXVFLElBQVosQ0FBaUJDLE1BQWpCLEtBQTRCLEVBQWhDLEVBQW1DO0FBQ2xDNEMsYUFBS0MsVUFBTCxHQUFrQnZFLEVBQUV1RSxVQUFwQjtBQUNBSixpQkFBU0QsV0FBV00sYUFBcEI7QUFDQSxRQUhELE1BR0s7QUFDSkYsYUFBS0MsVUFBTCxHQUFrQnZFLEVBQUU5QyxTQUFGLENBQVl1RSxJQUFaLENBQWlCQyxNQUFuQztBQUNBeUMsaUJBQVNoRCxLQUFLc0QsSUFBTCxDQUFVekUsRUFBRTlDLFNBQUYsQ0FBWXVFLElBQVosQ0FBaUJDLE1BQWpCLEdBQXdCd0MsV0FBV2hILFNBQTdDLENBQVQ7QUFDQTtBQUNELE9BUkQsTUFRSztBQUNKb0gsWUFBS0MsVUFBTCxHQUFrQixDQUFsQjtBQUNBO0FBQ0QsVUFBSXZFLEVBQUUwRSxZQUFOLEVBQW1CO0FBQ2xCSixZQUFLSyxTQUFMLEdBQWlCM0UsRUFBRTBFLFlBQUYsQ0FBZWhELE1BQWhDO0FBQ0F5QyxnQkFBV25FLEVBQUUwRSxZQUFGLENBQWVoRCxNQUFmLEdBQXdCd0MsV0FBV1UsR0FBbkMsSUFBMENWLFdBQVdXLE9BQXRELEdBQWlFWCxXQUFXVyxPQUE1RSxHQUFzRjdFLEVBQUUwRSxZQUFGLENBQWVoRCxNQUFmLEdBQXdCd0MsV0FBV1UsR0FBbkk7QUFDQSxPQUhELE1BR0s7QUFDSk4sWUFBS0ssU0FBTCxHQUFpQixDQUFqQjtBQUNBO0FBQ0RMLFdBQUtILEtBQUwsR0FBYUEsS0FBYjtBQUNBRixrQkFBWXBDLElBQVosQ0FBaUJ5QyxJQUFqQjtBQUNBO0FBekNlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEwQ2hCO0FBQ0Q7QUFsRG1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBb0RuQixXQUFTUSx3QkFBVCxDQUFrQzlDLEdBQWxDLEVBQXNDO0FBQ3JDLE9BQUkrQyxXQUFXLEVBQWY7QUFDQSxPQUFJL0IsT0FBTyxFQUFYO0FBRnFDO0FBQUE7QUFBQTs7QUFBQTtBQUdyQywwQkFBYWhCLEdBQWIsbUlBQWlCO0FBQUEsU0FBVGpDLENBQVM7O0FBQ2hCLFNBQUlvRCxPQUFNcEQsQ0FBVjtBQUNBLFNBQUlBLEVBQUUyRCxHQUFGLEtBQVVWLEtBQUtVLEdBQW5CLEVBQXVCO0FBQ3RCLFVBQUlzQixXQUFXN0IsSUFBZjtBQUNBLFVBQUk4QixPQUFPRixTQUFTRyxHQUFULEVBQVg7QUFDQSxVQUFJRixTQUFTYixLQUFULEdBQWlCYyxLQUFLZCxLQUExQixFQUFnQztBQUMvQmMsY0FBT0QsUUFBUDtBQUNBO0FBQ0RELGVBQVNsRCxJQUFULENBQWNvRCxJQUFkO0FBQ0EsTUFQRCxNQU9LO0FBQ0pqQyxhQUFPRyxJQUFQO0FBQ0E0QixlQUFTbEQsSUFBVCxDQUFjc0IsSUFBZDtBQUNBO0FBQ0Q7QUFoQm9DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBaUJyQyxVQUFPNEIsUUFBUDtBQUNBO0FBQ0QsTUFBSUksYUFBYUwseUJBQXlCYixZQUFZbUIsSUFBWixDQUFpQixVQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxVQUFVQSxFQUFFNUIsR0FBRixHQUFRMkIsRUFBRTNCLEdBQXBCO0FBQUEsR0FBakIsQ0FBekIsQ0FBakI7QUFDQWpDLE9BQUs4RCxTQUFMLENBQWVKLFdBQVdDLElBQVgsQ0FBZ0IsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsVUFBVUEsRUFBRWxELE1BQUYsR0FBV2lELEVBQUVqRCxNQUF2QjtBQUFBLEdBQWhCLENBQWY7QUFDQSxFQXhMUztBQXlMVm1ELFlBQVcsbUJBQUN2RCxHQUFELEVBQU87QUFDakIsTUFBSU8sYUFBYSxFQUFqQjtBQUNBLE1BQUlTLE9BQU8sRUFBWDtBQUZpQjtBQUFBO0FBQUE7O0FBQUE7QUFHakIsMEJBQWFoQixHQUFiLHdJQUFpQjtBQUFBLFFBQVRqQyxDQUFTOztBQUNoQixRQUFJb0QsUUFBTXBELENBQVY7QUFDQSxRQUFJQSxFQUFFcUMsTUFBRixLQUFhWSxLQUFLWixNQUF0QixFQUE2QjtBQUM1QixTQUFJNEMsV0FBVzdCLEtBQWY7QUFDQSxTQUFJOEIsT0FBTzFDLFdBQVcyQyxHQUFYLEVBQVg7QUFDQUQsVUFBS2hGLEVBQUwsQ0FBUTRCLElBQVIsQ0FBYW1ELFFBQWI7QUFDQUMsVUFBS2IsYUFBTCxJQUFzQmpCLE1BQUlpQixhQUExQjtBQUNBYSxVQUFLVixVQUFMLElBQW1CcEIsTUFBSW9CLFVBQXZCO0FBQ0FVLFVBQUtOLFNBQUwsSUFBa0J4QixNQUFJd0IsU0FBdEI7QUFDQU0sVUFBS2QsS0FBTCxJQUFjaEIsTUFBSWdCLEtBQWxCO0FBQ0E1QixnQkFBV1YsSUFBWCxDQUFnQm9ELElBQWhCO0FBQ0EsS0FURCxNQVNLO0FBQ0osU0FBSUQsWUFBVztBQUNkLFlBQU03QixNQUFJbEQsRUFESTtBQUVkLGlCQUFXa0QsTUFBSVAsT0FGRDtBQUdkLG9CQUFjTyxNQUFJb0IsVUFISjtBQUlkLHVCQUFpQnBCLE1BQUlpQixhQUpQO0FBS2QsbUJBQWFqQixNQUFJd0IsU0FMSDtBQU1kLGVBQVN4QixNQUFJZ0I7QUFOQyxNQUFmO0FBUUFoQixXQUFJbEQsRUFBSixHQUFTLENBQUMrRSxTQUFELENBQVQ7QUFDQWhDLFlBQU9HLEtBQVA7QUFDQVosZ0JBQVdWLElBQVgsQ0FBZ0JzQixLQUFoQjtBQUNBO0FBQ0Q7QUEzQmdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBNEJqQjFCLE9BQUtjLFVBQUwsR0FBa0JBLFdBQVc2QyxJQUFYLENBQWdCLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFVBQVVBLEVBQUVuQixLQUFGLEdBQVVrQixFQUFFbEIsS0FBdEI7QUFBQSxHQUFoQixDQUFsQjtBQUNBMUMsT0FBS2MsVUFBTCxHQUFrQmQsS0FBS2MsVUFBTCxDQUFnQmlELEdBQWhCLENBQW9CLFVBQUNDLElBQUQsRUFBUTtBQUM3Q0EsUUFBSzlCLElBQUwsR0FBWTtBQUNYLFVBQU04QixLQUFLckQsTUFEQTtBQUVYLFlBQVFxRCxLQUFLQztBQUZGLElBQVo7QUFJQSxVQUFPRCxJQUFQO0FBQ0EsR0FOaUIsQ0FBbEI7QUFPQTlJLFVBQVFDLEdBQVIsQ0FBWTZFLEtBQUtjLFVBQWpCO0FBQ0ExRixJQUFFLFVBQUYsRUFBYzhJLFdBQWQsQ0FBMEIsTUFBMUI7O0FBRUFDLGVBQWFDLE1BQWIsR0FBc0JuRyxLQUFLQyxTQUFMLENBQWU4QixLQUFLYyxVQUFwQixDQUF0QjtBQUNBMUYsSUFBRSxPQUFGLEVBQVdpRCxRQUFYLENBQW9CLFFBQXBCOztBQUVBZ0csUUFBTUMsUUFBTixDQUFldEUsS0FBS2MsVUFBcEI7QUFDQXlELFFBQU1DLElBQU4sQ0FBV3hFLEtBQUtjLFVBQWhCO0FBQ0E7QUFyT1MsQ0FBWDtBQXVPQSxJQUFJeUQsUUFBUTtBQUNYQyxPQUFNLGNBQUMxRCxVQUFELEVBQWM7QUFDbkIyRCxLQUFHQyxNQUFILENBQVUsS0FBVixFQUFpQkMsTUFBakI7QUFDQSxNQUFJcEUsTUFBTSxFQUFWO0FBQ0EsTUFBSXFFLElBQUksR0FBUjtBQUNBLE1BQUlDLFFBQVEsRUFBWjtBQUNBLE1BQUkvRCxXQUFXYixNQUFYLEdBQW9CNEUsS0FBeEIsRUFBK0JBLFFBQVEvRCxXQUFXYixNQUFuQjtBQUMvQixPQUFJLElBQUkzQixJQUFFLENBQVYsRUFBYUEsSUFBRXVHLEtBQWYsRUFBc0J2RyxHQUF0QixFQUEwQjtBQUN6QndDLGNBQVd4QyxDQUFYLEVBQWN3RyxLQUFkLEdBQXNCeEcsQ0FBdEI7QUFDQWlDLE9BQUlILElBQUosQ0FBU1UsV0FBV3hDLENBQVgsQ0FBVDtBQUNBO0FBQ0QsTUFBSXlHLFdBQVdOLEdBQUdPLEdBQUgsQ0FBT3pFLEdBQVAsRUFBWSxVQUFTd0IsQ0FBVCxFQUFXO0FBQUMsVUFBT0EsRUFBRVcsS0FBVDtBQUFlLEdBQXZDLENBQWY7QUFDQXhILFVBQVFDLEdBQVIsQ0FBWTRKLFFBQVo7QUFDQSxNQUFJRSxTQUFTUixHQUFHUyxLQUFILENBQVNDLE1BQVQsR0FDTkMsTUFETSxDQUNDLENBQUMsQ0FBRCxFQUFJTCxRQUFKLENBREQsRUFFTnZELEtBRk0sQ0FFQSxDQUFDLENBQUQsRUFBSW9ELElBQUUsRUFBTixDQUZBLENBQWI7O0FBSUEsTUFBSVMsSUFBSVosR0FBR0MsTUFBSCxDQUFVLFFBQVYsRUFBb0JoRyxNQUFwQixDQUEyQixLQUEzQixDQUFSO0FBQ0EyRyxJQUFFQyxTQUFGLENBQVksTUFBWixFQUNFdEYsSUFERixDQUNPTyxHQURQLEVBRUVnRixLQUZGLEdBR0U3RyxNQUhGLENBR1MsTUFIVCxFQUlFSyxJQUpGLENBSU87QUFDTCxXQUFRLFNBREg7QUFFTCxZQUFTLENBRko7QUFHTCxhQUFVLElBSEw7QUFJTCxRQUFLLFdBQVNnRCxDQUFULEVBQVc7QUFDZixXQUFPLENBQVA7QUFDQSxJQU5JO0FBT0wsUUFBSyxXQUFTQSxDQUFULEVBQVc7QUFDZixXQUFPQSxFQUFFK0MsS0FBRixHQUFVLEVBQWpCO0FBQ0E7QUFUSSxHQUpQLEVBZUVVLFVBZkYsR0FnQkVDLFFBaEJGLENBZ0JXLElBaEJYLEVBaUJFMUcsSUFqQkYsQ0FpQk87QUFDTCxZQUFRLGVBQVNnRCxDQUFULEVBQVc7QUFDbEIsV0FBT2tELE9BQU9sRCxFQUFFVyxLQUFULENBQVA7QUFDQTtBQUhJLEdBakJQO0FBc0JDMkMsSUFBRUMsU0FBRixDQUFZLFlBQVosRUFDQ3RGLElBREQsQ0FDTU8sR0FETixFQUVDZ0YsS0FGRCxHQUdDN0csTUFIRCxDQUdRLE1BSFIsRUFJQ3NDLElBSkQsQ0FJTSxVQUFTZSxDQUFULEVBQVc7QUFDaEIsVUFBT0EsRUFBRVcsS0FBRixHQUFVLEdBQWpCO0FBQ0EsR0FORCxFQU9DM0QsSUFQRCxDQU9NO0FBQ0wsV0FBTyxTQURGO0FBRUwsUUFBSyxDQUZBO0FBR0wsUUFBSSxXQUFTZ0QsQ0FBVCxFQUFXO0FBQ2QsV0FBT0EsRUFBRStDLEtBQUYsR0FBVSxFQUFWLEdBQWUsRUFBdEI7QUFDQTtBQUxJLEdBUE4sRUFjQ1UsVUFkRCxHQWVDQyxRQWZELENBZVUsSUFmVixFQWdCQzFHLElBaEJELENBZ0JNO0FBQ0wsUUFBSSxXQUFTZ0QsQ0FBVCxFQUFXO0FBQ2QsV0FBT2tELE9BQU9sRCxFQUFFVyxLQUFULElBQWtCLEVBQXpCO0FBQ0E7QUFISSxHQWhCTjtBQXFCQTJDLElBQUVDLFNBQUYsQ0FBWSxXQUFaLEVBQ0N0RixJQURELENBQ01PLEdBRE4sRUFFQ2dGLEtBRkQsR0FHQzdHLE1BSEQsQ0FHUSxNQUhSLEVBSUNzQyxJQUpELENBSU0sVUFBU2UsQ0FBVCxFQUFXO0FBQ2hCLFVBQU9BLEVBQUVrQyxRQUFUO0FBQ0EsR0FORCxFQU9DbEYsSUFQRCxDQU9NO0FBQ0wsV0FBTyxNQURGO0FBRUwsa0JBQWUsS0FGVjtBQUdMLFFBQUssQ0FIQTtBQUlMLFFBQUksV0FBU2dELENBQVQsRUFBVztBQUNkLFdBQU9BLEVBQUUrQyxLQUFGLEdBQVUsRUFBVixHQUFlLEVBQXRCO0FBQ0E7QUFOSSxHQVBOLEVBZUNVLFVBZkQsR0FnQkNDLFFBaEJELENBZ0JVLElBaEJWLEVBaUJDMUcsSUFqQkQsQ0FpQk07QUFDTCxRQUFJLFdBQVNnRCxDQUFULEVBQVc7QUFDZCxXQUFPa0QsT0FBT2xELEVBQUVXLEtBQVQsSUFBa0IsRUFBekI7QUFDQTtBQUhJLEdBakJOO0FBc0JBMkMsSUFBRUMsU0FBRixDQUFZLEtBQVosRUFDQ3RGLElBREQsQ0FDTU8sR0FETixFQUVDZ0YsS0FGRCxHQUdDN0csTUFIRCxDQUdRLFdBSFIsRUFJQ0ssSUFKRCxDQUlNO0FBQ0wsaUJBQWMsbUJBQVNnRCxDQUFULEVBQVc7QUFDeEIsV0FBTywrQkFBNkJBLEVBQUVwQixNQUEvQixHQUFzQyw2QkFBN0M7QUFDQSxJQUhJO0FBSUwsWUFBUyxFQUpKO0FBS0wsYUFBVSxFQUxMO0FBTUwsUUFBSyxDQU5BO0FBT0wsUUFBSSxXQUFTb0IsQ0FBVCxFQUFXO0FBQ2QsV0FBT0EsRUFBRStDLEtBQUYsR0FBVSxFQUFqQjtBQUNBO0FBVEksR0FKTixFQWVDVSxVQWZELEdBZ0JDQyxRQWhCRCxDQWdCVSxJQWhCVixFQWlCQzFHLElBakJELENBaUJNO0FBQ0wsUUFBSSxXQUFTZ0QsQ0FBVCxFQUFXO0FBQ2QsV0FBT2tELE9BQU9sRCxFQUFFVyxLQUFULENBQVA7QUFDQTtBQUhJLEdBakJOO0FBc0JEO0FBekdVLENBQVo7QUEyR0EsSUFBSTJCLFFBQVE7QUFDWEMsV0FBVSxrQkFBQ29CLE9BQUQsRUFBVztBQUNwQnRLLElBQUUsZUFBRixFQUFtQnVLLFNBQW5CLEdBQStCQyxPQUEvQjtBQUNBeEssSUFBRSxnQ0FBRixFQUFvQzRGLElBQXBDLENBQXlDMEUsUUFBUXpGLE1BQWpEO0FBQ0E3RSxJQUFFLGdDQUFGLEVBQW9DNEYsSUFBcEMsQ0FBeUNoQixLQUFLZSxTQUFMLENBQWU4RSxNQUF4RDtBQUNBLE1BQUloQixRQUFRLENBQVo7QUFDQSxNQUFJaUIsUUFBUSxFQUFaO0FBTG9CO0FBQUE7QUFBQTs7QUFBQTtBQU1wQiwwQkFBYUosT0FBYix3SUFBcUI7QUFBQSxRQUFicEgsQ0FBYTs7QUFDcEJ3SCx3Q0FDU2pCLEtBRFQsaUVBRTBDdkcsRUFBRXFDLE1BRjVDLHlCQUVxRXJDLEVBQUUyRixRQUZ2RSxtQ0FHUzNGLEVBQUVvRSxLQUhYLCtDQUd5RHBFLEVBQUVxQyxNQUgzRDtBQUtBa0U7QUFDQTtBQWJtQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWNwQnpKLElBQUUscUJBQUYsRUFBeUIySyxJQUF6QixDQUE4QixFQUE5QixFQUFrQ3JILE1BQWxDLENBQXlDb0gsS0FBekM7O0FBRUFFOztBQUVBLFdBQVNBLE1BQVQsR0FBaUI7QUFDaEIsT0FBSTNCLFFBQVFqSixFQUFFLGVBQUYsRUFBbUJ1SyxTQUFuQixDQUE2QjtBQUN4QyxrQkFBYyxJQUQwQjtBQUV4QyxpQkFBYSxJQUYyQjtBQUd4QyxvQkFBZ0I7QUFId0IsSUFBN0IsQ0FBWjtBQUtBO0FBQ0QsRUExQlU7QUEyQlhNLE9BQU0sZ0JBQUk7QUFDVGpHLE9BQUtrRyxNQUFMLENBQVlsRyxLQUFLaUIsR0FBakIsRUFBc0IsSUFBdEI7QUFDQTtBQTdCVSxDQUFaO0FBK0JBLElBQUlrRixRQUFRO0FBQ1hDLE9BQU0sY0FBQ3ZILEdBQUQsRUFBTztBQUNaLE1BQUlpSCxRQUFRLEVBQVo7QUFEWTtBQUFBO0FBQUE7O0FBQUE7QUFFWiwwQkFBYTlGLEtBQUtjLFVBQWxCLHdJQUE2QjtBQUFBLFFBQXJCeEMsQ0FBcUI7O0FBQzVCLFFBQUlPLE9BQU9QLEVBQUVxQyxNQUFiLEVBQW9CO0FBQ25CLFNBQUlrRSxRQUFRLENBQVo7QUFDQXpKLE9BQUUsZUFBRixFQUFtQjRGLElBQW5CLENBQXdCMUMsRUFBRTJGLFFBQTFCO0FBRm1CO0FBQUE7QUFBQTs7QUFBQTtBQUduQiw2QkFBYTNGLEVBQUVFLEVBQWYsd0lBQWtCO0FBQUEsV0FBVkQsQ0FBVTs7QUFDakIsV0FBSTRDLFVBQVU1QyxFQUFFNEMsT0FBaEI7QUFDQSxXQUFJQSxXQUFXLEVBQWYsRUFBbUJBLFVBQVUsZUFBVjtBQUNuQjJFLCtDQUNTakIsS0FEVCxxRUFFMEN0RyxFQUFFQyxFQUY1Qyw2QkFFbUUyQyxPQUZuRSx1Q0FHUzVDLEVBQUVvRSxhQUhYLG1DQUlTcEUsRUFBRTJFLFNBSlgsbUNBS1MzRSxFQUFFdUUsVUFMWCxtQ0FNU3ZFLEVBQUVtRSxLQU5YO0FBUUFtQztBQUNBO0FBZmtCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBZ0JuQnpKLE9BQUUsb0JBQUYsRUFBd0IySyxJQUF4QixDQUE2QixFQUE3QixFQUFpQ3JILE1BQWpDLENBQXdDb0gsS0FBeEM7QUFDQTtBQUNEO0FBckJXO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBc0JaMUssSUFBRSxRQUFGLEVBQVlpRCxRQUFaLENBQXFCLE1BQXJCO0FBQ0EsRUF4QlU7QUF5QlhnSSxPQUFNLGdCQUFJO0FBQ1RqTCxJQUFFLFFBQUYsRUFBWThJLFdBQVosQ0FBd0IsTUFBeEI7QUFDQTtBQTNCVSxDQUFaOztBQThCQyxTQUFTb0MsU0FBVCxDQUFtQjVFLEdBQW5CLEVBQXVCO0FBQ3RCLEtBQUk2RSxRQUFRbkwsRUFBRTJJLEdBQUYsQ0FBTXJDLEdBQU4sRUFBVyxVQUFTOEUsS0FBVCxFQUFnQjFCLEtBQWhCLEVBQXVCO0FBQzdDLFNBQU8sQ0FBQzBCLEtBQUQsQ0FBUDtBQUNBLEVBRlcsQ0FBWjtBQUdBLFFBQU9ELEtBQVA7QUFDQTs7QUFFRCxTQUFTRSxjQUFULENBQXdCQyxDQUF4QixFQUEyQjtBQUMxQixLQUFJQyxNQUFNLElBQUlDLEtBQUosRUFBVjtBQUNBLEtBQUl0SSxDQUFKLEVBQU91SSxDQUFQLEVBQVVDLENBQVY7QUFDQSxNQUFLeEksSUFBSSxDQUFULEVBQWFBLElBQUlvSSxDQUFqQixFQUFxQixFQUFFcEksQ0FBdkIsRUFBMEI7QUFDekJxSSxNQUFJckksQ0FBSixJQUFTQSxDQUFUO0FBQ0E7QUFDRCxNQUFLQSxJQUFJLENBQVQsRUFBYUEsSUFBSW9JLENBQWpCLEVBQXFCLEVBQUVwSSxDQUF2QixFQUEwQjtBQUN6QnVJLE1BQUluSCxLQUFLQyxLQUFMLENBQVdELEtBQUtxSCxNQUFMLEtBQWdCTCxDQUEzQixDQUFKO0FBQ0FJLE1BQUlILElBQUlFLENBQUosQ0FBSjtBQUNBRixNQUFJRSxDQUFKLElBQVNGLElBQUlySSxDQUFKLENBQVQ7QUFDQXFJLE1BQUlySSxDQUFKLElBQVN3SSxDQUFUO0FBQ0E7QUFDRCxRQUFPSCxHQUFQO0FBQ0E7O0FBRUQsU0FBU0ssa0JBQVQsQ0FBNEJDLFFBQTVCLEVBQXNDQyxXQUF0QyxFQUFtREMsU0FBbkQsRUFBOEQ7QUFDM0Q7QUFDQSxLQUFJQyxVQUFVLFFBQU9ILFFBQVAseUNBQU9BLFFBQVAsTUFBbUIsUUFBbkIsR0FBOEJoSixLQUFLbUIsS0FBTCxDQUFXNkgsUUFBWCxDQUE5QixHQUFxREEsUUFBbkU7O0FBRUEsS0FBSUksTUFBTSxFQUFWO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxLQUFJRixTQUFKLEVBQWU7QUFDWCxNQUFJRyxNQUFNLEVBQVY7O0FBRUE7QUFDQSxPQUFLLElBQUl4QyxLQUFULElBQWtCc0MsUUFBUSxDQUFSLENBQWxCLEVBQThCOztBQUUxQjtBQUNBRSxVQUFPeEMsUUFBUSxHQUFmO0FBQ0g7O0FBRUR3QyxRQUFNQSxJQUFJQyxLQUFKLENBQVUsQ0FBVixFQUFhLENBQUMsQ0FBZCxDQUFOOztBQUVBO0FBQ0FGLFNBQU9DLE1BQU0sTUFBYjtBQUNIOztBQUVEO0FBQ0EsTUFBSyxJQUFJaEosSUFBSSxDQUFiLEVBQWdCQSxJQUFJOEksUUFBUW5ILE1BQTVCLEVBQW9DM0IsR0FBcEMsRUFBeUM7QUFDckMsTUFBSWdKLE1BQU0sRUFBVjs7QUFFQTtBQUNBLE9BQUssSUFBSXhDLEtBQVQsSUFBa0JzQyxRQUFROUksQ0FBUixDQUFsQixFQUE4QjtBQUMxQmdKLFVBQU8sTUFBTUYsUUFBUTlJLENBQVIsRUFBV3dHLEtBQVgsQ0FBTixHQUEwQixJQUFqQztBQUNIOztBQUVEd0MsTUFBSUMsS0FBSixDQUFVLENBQVYsRUFBYUQsSUFBSXJILE1BQUosR0FBYSxDQUExQjs7QUFFQTtBQUNBb0gsU0FBT0MsTUFBTSxNQUFiO0FBQ0g7O0FBRUQsS0FBSUQsT0FBTyxFQUFYLEVBQWU7QUFDWGxILFFBQU0sY0FBTjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxLQUFJcUgsV0FBVyxFQUFmO0FBQ0E7QUFDQUEsYUFBWU4sWUFBWTdFLE9BQVosQ0FBb0IsSUFBcEIsRUFBeUIsR0FBekIsQ0FBWjs7QUFFQTtBQUNBLEtBQUlvRixNQUFNLHVDQUF1Q0MsVUFBVUwsR0FBVixDQUFqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUlNLE9BQU9DLFNBQVNDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBRixNQUFLRyxJQUFMLEdBQVlMLEdBQVo7O0FBRUE7QUFDQUUsTUFBS0ksS0FBTCxHQUFhLG1CQUFiO0FBQ0FKLE1BQUtLLFFBQUwsR0FBZ0JSLFdBQVcsTUFBM0I7O0FBRUE7QUFDQUksVUFBU0ssSUFBVCxDQUFjQyxXQUFkLENBQTBCUCxJQUExQjtBQUNBQSxNQUFLUSxLQUFMO0FBQ0FQLFVBQVNLLElBQVQsQ0FBY0csV0FBZCxDQUEwQlQsSUFBMUI7QUFDSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvcj1oYW5kbGVFcnJcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXHJcbntcclxuXHRpZiAoIWVycm9yTWVzc2FnZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2Zyb20nLCdsaWtlX2NvdW50JywnY29tbWVudF9jb3VudCcsJ3JlYWN0aW9ucycsJ2lzX2hpZGRlbicsJ21lc3NhZ2UnLCdtZXNzYWdlX3RhZ3MnXSxcclxuXHRcdHJlYWN0aW9uczogW10sXHJcblx0XHRzaGFyZWRwb3N0czogWydzdG9yeScsJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogW11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3YyLjcnLFxyXG5cdFx0cmVhY3Rpb25zOiAndjIuNycsXHJcblx0XHRzaGFyZWRwb3N0czogJ3YyLjMnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjIuNycsXHJcblx0XHRmZWVkOiAndjIuMycsXHJcblx0XHRncm91cDogJ3YyLjcnLFxyXG5cdFx0bmV3ZXN0OiAndjIuOCdcclxuXHR9LFxyXG5cdGF1dGg6ICd1c2VyX3Bob3Rvcyx1c2VyX3Bvc3RzLHVzZXJfbWFuYWdlZF9ncm91cHMsbWFuYWdlX3BhZ2VzJyxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHBhZ2VUb2tlbjogJycsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHRuZXh0OiAnJyxcclxuXHRmZWVkczogW10sXHJcblx0Z2V0QXV0aDogKHR5cGUpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpe1xyXG5cdFx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfbWFuYWdlZF9ncm91cHMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xyXG5cdFx0XHRcdFx0ZmIuc3RhcnQoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfmjojmrIrlpLHmlZfvvIzoq4vntabkuojmiYDmnInmrIrpmZAnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxyXG5cdFx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoKT0+e1xyXG5cdFx0UHJvbWlzZS5hbGwoW2ZiLmdldE1lKCksZmIuZ2V0UGFnZSgpLCBmYi5nZXRHcm91cCgpXSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5sb2dpbiA9IEpTT04uc3RyaW5naWZ5KHJlcyk7XHJcblx0XHRcdGZiLmdlbk9wdGlvbihyZXMpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZW5PcHRpb246IChyZXMpPT57XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgb3B0aW9ucyA9ICcnO1xyXG5cdFx0bGV0IHR5cGUgPSAtMTtcclxuXHRcdCQoJ2FzaWRlJykuYWRkQ2xhc3MoJ2xvZ2luJyk7XHJcblx0XHRmb3IobGV0IGkgb2YgcmVzKXtcclxuXHRcdFx0dHlwZSsrO1xyXG5cdFx0XHRmb3IobGV0IGogb2YgaSl7XHJcblx0XHRcdFx0b3B0aW9ucyArPSBgPG9wdGlvbiBhdHRyLXR5cGU9XCIke3R5cGV9XCIgdmFsdWU9XCIke2ouaWR9XCI+JHtqLm5hbWV9PC9vcHRpb24+YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnYXNpZGUgLnN0ZXAxIHNlbGVjdCcpLmFwcGVuZChvcHRpb25zKTtcclxuXHRcdCQoJ2FzaWRlIHNlbGVjdCcpLnNlbGVjdDIoKTtcclxuXHRcdC8vICQoJ2FzaWRlIHNlbGVjdCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdC8vIFx0bGV0IHR5cGUgPSAkKHRoaXMpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmF0dHIoJ2F0dHItdHlwZScpO1xyXG5cdFx0Ly8gXHRmYi5zZWxlY3RQYWdlKGV2ZW50LnRhcmdldC52YWx1ZSwgdHlwZSk7XHJcblx0XHQvLyB9KTtcclxuXHR9LFxyXG5cdHNlbGVjdFBhZ2U6ICgpPT57XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgdGFyID0gJCgnYXNpZGUgc2VsZWN0Jyk7XHJcblx0XHRsZXQgdHlwZSA9IHRhci5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdGlmICh0eXBlID09IDEpe1xyXG5cdFx0XHRmYi5zZXRUb2tlbih0YXIuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuYXR0cigndmFsdWUnKSk7XHJcblx0XHR9XHJcblx0XHRmYi5mZWVkKHRhci52YWwoKSwgdHlwZSwgZmIubmV4dCk7XHJcblx0fSxcclxuXHRzZXRUb2tlbjogKHBhZ2VpZCk9PntcclxuXHRcdGxldCBwYWdlcyA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UubG9naW4pWzFdO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHBhZ2VzKXtcclxuXHRcdFx0aWYgKGkuaWQgPT0gcGFnZWlkKXtcclxuXHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gaS5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdGZlZWQ6IChwYWdlSUQsIHR5cGUsIHVybCA9ICcnLCBjbGVhciA9IHRydWUpPT57XHJcblx0XHRsZXQgY29tbWFuZCA9ICh0eXBlID09ICcyJykgPyAnZmVlZCc6J3Bvc3RzJztcclxuXHRcdGxldCBhcGk7XHJcblx0XHRsZXQgc3RhcnQgPSBNYXRoLmZsb29yKERhdGUucGFyc2UoJCgnI3N0YXJ0X2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXktbW0tZGQnKSkvMTAwMCk7XHJcblx0XHRsZXQgZW5kID0gTWF0aC5mbG9vcihEYXRlLnBhcnNlKCQoJyNlbmRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS1tbS1kZCcpKS8xMDAwKTtcclxuXHRcdC8vMTQ2ODQ2Njk5MDA5NzYyM1xyXG5cdFx0aWYgKHVybCA9PSAnJyl7XHJcblx0XHRcdGFwaSA9IGAke3BhZ2VJRH0vJHtjb21tYW5kfT9zaW5jZT0ke3N0YXJ0fSZ1bnRpbD0ke2VuZH0mZmllbGRzPWxpbmssZnVsbF9waWN0dXJlLGNyZWF0ZWRfdGltZSxtZXNzYWdlJmxpbWl0PTEwMGA7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0YXBpID0gdXJsO1xyXG5cdFx0fVxyXG5cdFx0RkIuYXBpKGFwaSxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0ZmIuZmVlZHMgPSByZXMuZGF0YTtcclxuXHRcdFx0XHRpZiAocmVzLnBhZ2luZyl7XHJcblx0XHRcdFx0XHRuZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRkYXRhLnN0YXJ0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhbGVydCgn5rKS5pyJ6LOH5paZJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHRmdW5jdGlvbiBuZXh0KHVybCl7XHJcblx0XHRcdGlmICh1cmwpe1xyXG5cdFx0XHRcdCQuZ2V0KHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwKXtcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0XHRmYi5mZWVkcy5wdXNoKGkpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChyZXMucGFnaW5nKXtcclxuXHRcdFx0XHRcdFx0XHRuZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGRhdGEuc3RhcnQoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGRhdGEuc3RhcnQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0TWU6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWVgLCAocmVzKT0+e1xyXG5cdFx0XHRcdGxldCBhcnIgPSBbcmVzXTtcclxuXHRcdFx0XHRyZXNvbHZlKGFycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRQYWdlOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2FjY291bnRzP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRHcm91cDogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9ncm91cHM/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldE5hbWU6IChpZHMpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vP2lkcz0ke2lkcy50b1N0cmluZygpfWAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwcm9taXNlX2FycmF5OiBbXSxcclxuXHRmaW5hbEFycmF5OiBbXSxcclxuXHRkYXRlUmFuZ2U6IHt9LFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0XHRkYXRhLnByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdGRhdGEucmF3ID0gW107XHJcblx0fSxcclxuXHRkYXRlQ2hlY2s6ICgpPT57XHJcblx0XHRsZXQgc3RhcnQgPSAkKCcjc3RhcnRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS1tbS1kZCcpO1xyXG5cdFx0bGV0IGVuZCA9ICQoJyNlbmRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS1tbS1kZCcpO1xyXG5cdFx0bGV0IG1lc3NhZ2UgPSAnJztcclxuXHRcdGlmIChzdGFydCA9PSAnJyB8fCBlbmQgPT0gJycpe1xyXG5cdFx0XHRtZXNzYWdlID0gJ+iri+mBuOaTh+aXpeacnyc7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0bGV0IGQxID0gbmV3IERhdGUoJCgnI3N0YXJ0X2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JykucGljayk7XHJcblx0XHRcdGxldCBkMiA9IG5ldyBEYXRlKCQoJyNlbmRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnKS5waWNrKTtcclxuXHRcdFx0aWYgKGQyLWQxID4gNTE4NDAwMDAwMCl7XHJcblx0XHRcdFx0bWVzc2FnZSA9ICfml6XmnJ/ljYDplpPkuI3og73otoXpgY42MOWkqSc7XHJcblx0XHRcdH1lbHNlIGlmIChkMjxkMSl7XHJcblx0XHRcdFx0bGV0IHRlbXAgPSBzdGFydDtcclxuXHRcdFx0XHRzdGFydCA9IGVuZDtcclxuXHRcdFx0XHRlbmQgPSB0ZW1wO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAobWVzc2FnZSA9PSAnJyl7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0J2NoZWNrJzogdHJ1ZSxcclxuXHRcdFx0XHQncmFuZ2UnOiBgc2luY2U9JHtzdGFydH0mdW50aWw9JHtlbmR9YCxcclxuXHRcdFx0XHQnc3RyaW5nJzogJCgnI3N0YXJ0X2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXkvbW0vZGQnKSArIFwiIH4gXCIgKyAkKCcjZW5kX2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXkvbW0vZGQnKSxcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0J2NoZWNrJzogZmFsc2UsXHJcblx0XHRcdFx0J21lc3NhZ2UnOiBtZXNzYWdlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoKT0+e1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRsZXQgcmFuZ2UgPSBkYXRhLmRhdGVDaGVjaygpO1xyXG5cdFx0aWYgKHJhbmdlLmNoZWNrID09PSB0cnVlKXtcclxuXHRcdFx0ZGF0YS5kYXRlUmFuZ2UgPSByYW5nZTtcclxuXHRcdFx0bGV0IGFsbCA9IFtdO1xyXG5cdFx0XHRmb3IobGV0IGogb2YgZmIuZmVlZHMpe1xyXG5cdFx0XHRcdGxldCBvYmogPSB7XHJcblx0XHRcdFx0XHRmdWxsSUQ6IGouaWQsXHJcblx0XHRcdFx0XHRvYmo6IHt9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBwcm9taXNlID0gZGF0YS5nZXQob2JqKS50aGVuKChyZXMpPT57XHJcblx0XHRcdFx0XHRvYmouZGF0YSA9IHJlcztcclxuXHRcdFx0XHRcdGFsbC5wdXNoKG9iaik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0ZGF0YS5wcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnLmxvYWRpbmcnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdFx0XHRQcm9taXNlLmFsbChkYXRhLnByb21pc2VfYXJyYXkpLnRoZW4oKCk9PntcclxuXHRcdFx0XHRkYXRhLmNvdW50X3Njb3JlKGFsbCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGFsZXJ0KHJhbmdlLm1lc3NhZ2UpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IGNvbW1hbmQgPSAnY29tbWVudHMnO1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9L2NvbW1lbnRzPyR7ZGF0YS5kYXRlUmFuZ2UucmFuZ2V9Jm9yZGVyPWNocm9ub2xvZ2ljYWwmZmllbGRzPSR7Y29uZmlnLmZpZWxkW2NvbW1hbmRdLnRvU3RyaW5nKCl9JmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59YCwocmVzKT0+e1xyXG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhyZXMpO1xyXG5cdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRpZiAoIWQuaXNfaGlkZGVuKXtcclxuXHRcdFx0XHRcdFx0ZC5jaWQgPSBkLmZyb20uaWQgKyAnXycgKyBkLmlkLnN1YnN0cigwLCBkLmlkLmluZGV4T2YoJ18nKSk7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0PTApe1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCl7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywnbGltaXQ9JytsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y291bnRfc2NvcmU6IChhbGwpPT57XHJcblx0XHQvKlxyXG5cdFx0XHTnlZnoqIAz5YiG44CBVEFH5LiA5YCLMeWIhu+8jOacgOWkmjPliIZcclxuXHRcdFx055WZ6KiA5b+D5oOFMuWAizHliIbvvIznhKHmop3ku7bpgLLkvY3vvIzmnIDlpJoxM+WIhlxyXG5cdFx0XHTnlZnoqIDnmoTnlZnoqIDkuIDlgIsx5YiG77yM5pyA5aSnNuWIhlxyXG5cdFx0Ki9cclxuXHRcdGxldCBzY29yZV9hcnJheSA9IFtdO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGFsbCl7XHJcblx0XHRcdGxldCBhcnIgPSBpLmRhdGE7XHJcblx0XHRcdGxldCBzY29yZV9ydWxlID0ge1xyXG5cdFx0XHRcdCdjb21tZW50cyc6IDEsXHJcblx0XHRcdFx0J2NvbW1lbnRzX21heCc6IDYsXHJcblx0XHRcdFx0J3JlYWN0aW9ucyc6IDAuNSxcclxuXHRcdFx0XHQncmVhY3Rpb25zX21heCc6IDEzLFxyXG5cdFx0XHRcdCd0YWcnOiAxLFxyXG5cdFx0XHRcdCd0YWdfbWF4JzogM1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBzY29yZTtcclxuXHRcdFx0Zm9yKGxldCBqIG9mIGFycil7XHJcblx0XHRcdFx0c2NvcmUgPSAzO1xyXG5cdFx0XHRcdHNjb3JlICs9IChqLmNvbW1lbnRfY291bnQqc2NvcmVfcnVsZS5jb21tZW50cyA+IHNjb3JlX3J1bGUuY29tbWVudHNfbWF4KSA/IHNjb3JlX3J1bGUuY29tbWVudHNfbWF4IDogai5jb21tZW50X2NvdW50KnNjb3JlX3J1bGUuY29tbWVudHM7XHJcblx0XHRcdFx0bGV0IHVzZXIgPSB7XHJcblx0XHRcdFx0XHQnaWQnOiBqLmlkLFxyXG5cdFx0XHRcdFx0J3VzZXJpZCc6IGouZnJvbS5pZCxcclxuXHRcdFx0XHRcdCd1c2VybmFtZSc6IGouZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0J2NvbW1lbnRfY291bnQnOiBqLmNvbW1lbnRfY291bnQsXHJcblx0XHRcdFx0XHQnbWVzc2FnZSc6IGoubWVzc2FnZSxcclxuXHRcdFx0XHRcdCdjaWQnOiBqLmNpZFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYgKGoucmVhY3Rpb25zKXtcclxuXHRcdFx0XHRcdGlmIChqLnJlYWN0aW9ucy5kYXRhLmxlbmd0aCA9PT0gMjUpe1xyXG5cdFx0XHRcdFx0XHR1c2VyLmxpa2VfY291bnQgPSBqLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0XHRcdHNjb3JlICs9IHNjb3JlX3J1bGUucmVhY3Rpb25zX21heDtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHR1c2VyLmxpa2VfY291bnQgPSBqLnJlYWN0aW9ucy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdFx0c2NvcmUgKz0gTWF0aC5jZWlsKGoucmVhY3Rpb25zLmRhdGEubGVuZ3RoKnNjb3JlX3J1bGUucmVhY3Rpb25zKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHVzZXIubGlrZV9jb3VudCA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChqLm1lc3NhZ2VfdGFncyl7XHJcblx0XHRcdFx0XHR1c2VyLnRhZ19jb3VudCA9IGoubWVzc2FnZV90YWdzLmxlbmd0aFxyXG5cdFx0XHRcdFx0c2NvcmUgKz0gIChqLm1lc3NhZ2VfdGFncy5sZW5ndGggKiBzY29yZV9ydWxlLnRhZyA+PSBzY29yZV9ydWxlLnRhZ19tYXgpID8gc2NvcmVfcnVsZS50YWdfbWF4IDogai5tZXNzYWdlX3RhZ3MubGVuZ3RoICogc2NvcmVfcnVsZS50YWc7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR1c2VyLnRhZ19jb3VudCA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHVzZXIuc2NvcmUgPSBzY29yZTtcclxuXHRcdFx0XHRzY29yZV9hcnJheS5wdXNoKHVzZXIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBjb25zb2xlLmxvZyhzY29yZV9hcnJheSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gcmVtb3ZlX2R1cGxpY2F0ZV9jb21tZW50KGFycil7XHJcblx0XHRcdGxldCBjaWRBcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgdGVtcCA9ICcnO1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0XHRsZXQgb2JqID0gaTtcclxuXHRcdFx0XHRpZiAoaS5jaWQgPT09IHRlbXAuY2lkKXtcclxuXHRcdFx0XHRcdGxldCB0aGlzZGF0YSA9IG9iajtcclxuXHRcdFx0XHRcdGxldCBsYXN0ID0gY2lkQXJyYXkucG9wKCk7XHJcblx0XHRcdFx0XHRpZiAodGhpc2RhdGEuc2NvcmUgPiBsYXN0LnNjb3JlKXtcclxuXHRcdFx0XHRcdFx0bGFzdCA9IHRoaXNkYXRhO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2lkQXJyYXkucHVzaChsYXN0KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRlbXAgPSBvYmo7XHJcblx0XHRcdFx0XHRjaWRBcnJheS5wdXNoKG9iaik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBjaWRBcnJheTtcclxuXHRcdH1cclxuXHRcdGxldCBzb3J0X2FycmF5ID0gcmVtb3ZlX2R1cGxpY2F0ZV9jb21tZW50KHNjb3JlX2FycmF5LnNvcnQoKGEsIGIpID0+IGIuY2lkIC0gYS5jaWQpKTtcclxuXHRcdGRhdGEubWVyZ2VEYXRhKHNvcnRfYXJyYXkuc29ydCgoYSwgYikgPT4gYi51c2VyaWQgLSBhLnVzZXJpZCkpO1xyXG5cdH0sXHJcblx0bWVyZ2VEYXRhOiAoYXJyKT0+e1xyXG5cdFx0bGV0IGZpbmFsQXJyYXkgPSBbXTtcclxuXHRcdGxldCB0ZW1wID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0bGV0IG9iaiA9IGk7XHJcblx0XHRcdGlmIChpLnVzZXJpZCA9PT0gdGVtcC51c2VyaWQpe1xyXG5cdFx0XHRcdGxldCB0aGlzZGF0YSA9IG9iajtcclxuXHRcdFx0XHRsZXQgbGFzdCA9IGZpbmFsQXJyYXkucG9wKCk7XHJcblx0XHRcdFx0bGFzdC5pZC5wdXNoKHRoaXNkYXRhKTtcclxuXHRcdFx0XHRsYXN0LmNvbW1lbnRfY291bnQgKz0gb2JqLmNvbW1lbnRfY291bnQ7XHJcblx0XHRcdFx0bGFzdC5saWtlX2NvdW50ICs9IG9iai5saWtlX2NvdW50O1xyXG5cdFx0XHRcdGxhc3QudGFnX2NvdW50ICs9IG9iai50YWdfY291bnQ7XHJcblx0XHRcdFx0bGFzdC5zY29yZSArPSBvYmouc2NvcmU7XHJcblx0XHRcdFx0ZmluYWxBcnJheS5wdXNoKGxhc3QpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgdGhpc2RhdGEgPSB7XHJcblx0XHRcdFx0XHQnaWQnOiBvYmouaWQsXHJcblx0XHRcdFx0XHQnbWVzc2FnZSc6IG9iai5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0J2xpa2VfY291bnQnOiBvYmoubGlrZV9jb3VudCxcclxuXHRcdFx0XHRcdCdjb21tZW50X2NvdW50Jzogb2JqLmNvbW1lbnRfY291bnQsXHJcblx0XHRcdFx0XHQndGFnX2NvdW50Jzogb2JqLnRhZ19jb3VudCxcclxuXHRcdFx0XHRcdCdzY29yZSc6IG9iai5zY29yZVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0b2JqLmlkID0gW3RoaXNkYXRhXTtcclxuXHRcdFx0XHR0ZW1wID0gb2JqO1xyXG5cdFx0XHRcdGZpbmFsQXJyYXkucHVzaChvYmopO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRkYXRhLmZpbmFsQXJyYXkgPSBmaW5hbEFycmF5LnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKTtcclxuXHRcdGRhdGEuZmluYWxBcnJheSA9IGRhdGEuZmluYWxBcnJheS5tYXAoKGl0ZW0pPT57XHJcblx0XHRcdGl0ZW0uZnJvbSA9IHtcclxuXHRcdFx0XHRcImlkXCI6IGl0ZW0udXNlcmlkLFxyXG5cdFx0XHRcdFwibmFtZVwiOiBpdGVtLnVzZXJuYW1lXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHR9KTtcclxuXHRcdGNvbnNvbGUubG9nKGRhdGEuZmluYWxBcnJheSk7XHJcblx0XHQkKCcubG9hZGluZycpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblxyXG5cdFx0bG9jYWxTdG9yYWdlLnJhbmtlciA9IEpTT04uc3RyaW5naWZ5KGRhdGEuZmluYWxBcnJheSk7XHJcblx0XHQkKCdhc2lkZScpLmFkZENsYXNzKCdmaW5pc2gnKTtcclxuXHJcblx0XHR0YWJsZS5nZW5lcmF0ZShkYXRhLmZpbmFsQXJyYXkpO1xyXG5cdFx0Y2hhcnQuZHJhdyhkYXRhLmZpbmFsQXJyYXkpO1xyXG5cdH1cclxufVxyXG5sZXQgY2hhcnQgPSB7XHJcblx0ZHJhdzogKGZpbmFsQXJyYXkpPT57XHJcblx0XHRkMy5zZWxlY3QoXCJzdmdcIikucmVtb3ZlKCk7XHJcblx0XHRsZXQgYXJyID0gW107XHJcblx0XHRsZXQgdyA9IDc1MDtcclxuXHRcdGxldCBjb3VudCA9IDEwO1xyXG5cdFx0aWYgKGZpbmFsQXJyYXkubGVuZ3RoIDwgY291bnQpIGNvdW50ID0gZmluYWxBcnJheS5sZW5ndGg7XHJcblx0XHRmb3IobGV0IGk9MDsgaTxjb3VudDsgaSsrKXtcclxuXHRcdFx0ZmluYWxBcnJheVtpXS5pbmRleCA9IGk7XHJcblx0XHRcdGFyci5wdXNoKGZpbmFsQXJyYXlbaV0pO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG1heFNjb3JlID0gZDMubWF4KGFyciwgZnVuY3Rpb24oZCl7cmV0dXJuIGQuc2NvcmV9KTtcclxuXHRcdGNvbnNvbGUubG9nKG1heFNjb3JlKVxyXG5cdFx0dmFyIHhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXHJcblx0XHRcdFx0XHQgICAuZG9tYWluKFswLCBtYXhTY29yZV0pXHJcblx0XHRcdFx0XHQgICAucmFuZ2UoWzAsIHctODBdKTtcclxuXHJcblx0XHR2YXIgYyA9IGQzLnNlbGVjdCgnLmNoYXJ0JykuYXBwZW5kKCdzdmcnKTtcclxuXHRcdGMuc2VsZWN0QWxsKCdyZWN0JylcclxuXHRcdCAuZGF0YShhcnIpXHJcblx0XHQgLmVudGVyKClcclxuXHRcdCAuYXBwZW5kKCdyZWN0JylcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQnZmlsbCc6ICcjRTA5NzJBJyxcclxuXHRcdCBcdCd3aWR0aCc6IDAsXHJcblx0XHQgXHQnaGVpZ2h0JzogJzMwJyxcclxuXHRcdCBcdCd4JzogZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiAwO1xyXG5cdFx0IFx0fSxcclxuXHRcdCBcdCd5JzogZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiBkLmluZGV4ICogNDBcclxuXHRcdCBcdH1cclxuXHRcdCB9KVxyXG5cdFx0IC50cmFuc2l0aW9uKClcclxuXHRcdCAuZHVyYXRpb24oMTUwMClcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQnd2lkdGgnOmZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4geFNjYWxlKGQuc2NvcmUpO1xyXG5cdFx0IFx0fVxyXG5cdFx0IH0pO1xyXG5cdFx0IGMuc2VsZWN0QWxsKCd0ZXh0LnNjb3JlJylcclxuXHRcdCAuZGF0YShhcnIpXHJcblx0XHQgLmVudGVyKClcclxuXHRcdCAuYXBwZW5kKCd0ZXh0JylcclxuXHRcdCAudGV4dChmdW5jdGlvbihkKXtcclxuXHRcdCBcdHJldHVybiBkLnNjb3JlICsgJ+WIhic7XHJcblx0XHQgfSlcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQnZmlsbCc6JyNlMDk3MmEnLFxyXG5cdFx0IFx0J3gnOiAwLFxyXG5cdFx0IFx0J3knOmZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4gZC5pbmRleCAqIDQwICsgMjBcclxuXHRcdCBcdH1cclxuXHRcdCB9KVxyXG5cdFx0IC50cmFuc2l0aW9uKClcclxuXHRcdCAuZHVyYXRpb24oMTUwMClcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQneCc6ZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiB4U2NhbGUoZC5zY29yZSkgKyA0MDtcclxuXHRcdCBcdH1cclxuXHRcdCB9KTtcclxuXHRcdCBjLnNlbGVjdEFsbCgndGV4dC5uYW1lJylcclxuXHRcdCAuZGF0YShhcnIpXHJcblx0XHQgLmVudGVyKClcclxuXHRcdCAuYXBwZW5kKCd0ZXh0JylcclxuXHRcdCAudGV4dChmdW5jdGlvbihkKXtcclxuXHRcdCBcdHJldHVybiBkLnVzZXJuYW1lO1xyXG5cdFx0IH0pXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J2ZpbGwnOicjRkZGJyxcclxuXHRcdCBcdCd0ZXh0LWFuY2hvcic6ICdlbmQnLFxyXG5cdFx0IFx0J3gnOiAwLFxyXG5cdFx0IFx0J3knOmZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4gZC5pbmRleCAqIDQwICsgMjBcclxuXHRcdCBcdH1cclxuXHRcdCB9KVxyXG5cdFx0IC50cmFuc2l0aW9uKClcclxuXHRcdCAuZHVyYXRpb24oMTUwMClcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQneCc6ZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiB4U2NhbGUoZC5zY29yZSkgLSAxMDtcclxuXHRcdCBcdH1cclxuXHRcdCB9KTtcclxuXHRcdCBjLnNlbGVjdEFsbCgnaW1nJylcclxuXHRcdCAuZGF0YShhcnIpXHJcblx0XHQgLmVudGVyKClcclxuXHRcdCAuYXBwZW5kKCdzdmc6aW1hZ2UnKVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCd4bGluazpocmVmJzogZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiAnaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8nK2QudXNlcmlkKycvcGljdHVyZT93aWR0aD0zMCZoZWlnaHQ9MzAnXHJcblx0XHQgXHR9LFxyXG5cdFx0IFx0J3dpZHRoJzogMzAsXHJcblx0XHQgXHQnaGVpZ2h0JzogMzAsXHJcblx0XHQgXHQneCc6IDAsXHJcblx0XHQgXHQneSc6ZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiBkLmluZGV4ICogNDBcclxuXHRcdCBcdH1cclxuXHRcdCB9KVxyXG5cdFx0IC50cmFuc2l0aW9uKClcclxuXHRcdCAuZHVyYXRpb24oMTUwMClcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQneCc6ZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiB4U2NhbGUoZC5zY29yZSk7XHJcblx0XHQgXHR9XHJcblx0XHQgfSk7XHJcblx0fVxyXG59XHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKHJhd2RhdGEpPT57XHJcblx0XHQkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKCcucmVzdWx0IC5pbmZvIC5hbGxfcGVvcGxlIHNwYW4nKS50ZXh0KHJhd2RhdGEubGVuZ3RoKTtcclxuXHRcdCQoJy5yZXN1bHQgLmluZm8gLmRhdGVfcmFuZ2Ugc3BhbicpLnRleHQoZGF0YS5kYXRlUmFuZ2Uuc3RyaW5nKTtcclxuXHRcdGxldCBjb3VudCA9IDE7XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGZvcihsZXQgaSBvZiByYXdkYXRhKXtcclxuXHRcdFx0dGJvZHkgKz0gYDx0cj5cclxuXHRcdFx0XHRcdFx0PHRkPiR7Y291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1fYmxhbms+JHtpLnVzZXJuYW1lfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+JHtpLnNjb3JlfTwvdGQ+PHRkPjxidXR0b24gb25jbGljaz1cInBvcHVwLnNob3coJyR7aS51c2VyaWR9JylcIj7oqbPntLDos4foqIo8L2J1dHRvbj48L3RkPlxyXG5cdFx0XHRcdFx0ICA8L3RyPmA7XHJcblx0XHRcdGNvdW50Kys7XHJcblx0XHR9XHJcblx0XHQkKFwiLnRhYmxlcyB0YWJsZSB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5sZXQgcG9wdXAgPSB7XHJcblx0c2hvdzogKHRhcik9PntcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGRhdGEuZmluYWxBcnJheSl7XHJcblx0XHRcdGlmICh0YXIgPT0gaS51c2VyaWQpe1xyXG5cdFx0XHRcdGxldCBjb3VudCA9IDE7XHJcblx0XHRcdFx0JCgnLnBvcHVwIHAgc3BhbicpLnRleHQoaS51c2VybmFtZSk7XHJcblx0XHRcdFx0Zm9yKGxldCBqIG9mIGkuaWQpe1xyXG5cdFx0XHRcdFx0bGV0IG1lc3NhZ2UgPSBqLm1lc3NhZ2U7XHJcblx0XHRcdFx0XHRpZiAobWVzc2FnZSA9PSAnJykgbWVzc2FnZSA9ICc9PT09PeeEoeWFp+aWhz09PT09JztcclxuXHRcdFx0XHRcdHRib2R5ICs9IGA8dHI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtjb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke2ouaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHttZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai5jb21tZW50X2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLnRhZ19jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLnNjb3JlfTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0ICA8L3RyPmA7XHJcblx0XHRcdFx0XHRjb3VudCsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkKFwiLnBvcHVwIHRhYmxlIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJy5wb3B1cCcpLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0fSxcclxuXHRoaWRlOiAoKT0+e1xyXG5cdFx0JCgnLnBvcHVwJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHR9XHJcbn1cclxuXHJcbiBmdW5jdGlvbiBvYmoyQXJyYXkob2JqKXtcclxuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuIFx0fSk7XHJcbiBcdHJldHVybiBhcnJheTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuIFx0dmFyIGksIHIsIHQ7XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdGFyeVtpXSA9IGk7XHJcbiBcdH1cclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG4gXHRcdHQgPSBhcnlbcl07XHJcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG4gXHRcdGFyeVtpXSA9IHQ7XHJcbiBcdH1cclxuIFx0cmV0dXJuIGFyeTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcbiAgICB2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcbiAgICBcclxuICAgIHZhciBDU1YgPSAnJzsgICAgXHJcbiAgICAvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuICAgIFxyXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG4gICAgLy9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuICAgIGlmIChTaG93TGFiZWwpIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICAgICAgcm93ICs9IGluZGV4ICsgJywnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuICAgICAgICAgICAgcm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKENTViA9PSAnJykgeyAgICAgICAgXHJcbiAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSAgIFxyXG4gICAgXHJcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcbiAgICB2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG4gICAgLy90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxyXG4gICAgXHJcbiAgICAvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuICAgIFxyXG4gICAgLy8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG4gICAgLy8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcbiAgICAvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG4gICAgXHJcbiAgICAvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcbiAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpOyAgICBcclxuICAgIGxpbmsuaHJlZiA9IHVyaTtcclxuICAgIFxyXG4gICAgLy9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcbiAgICBsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuICAgIFxyXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il19
