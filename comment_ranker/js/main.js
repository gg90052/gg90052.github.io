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
		//1468466990097623
		if (url == '') {
			api = config.apiVersion.newest + "/" + pageID + "/" + command + "?fields=link,full_picture,created_time,message&limit=50";
		} else {
			api = url;
		}
		FB.api(api, function (res) {
			fb.feeds = res.data;
			data.start();
		});
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
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					var _loop = function _loop() {
						var j = _step4.value;

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

					for (var _iterator4 = fb.feeds[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						_loop();
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
				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = res.data[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var d = _step5.value;

						if (!d.is_hidden) {
							d.cid = d.from.id + '_' + d.id.substr(0, d.id.indexOf('_'));
							datas.push(d);
						}
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
					var _iteratorNormalCompletion6 = true;
					var _didIteratorError6 = false;
					var _iteratorError6 = undefined;

					try {
						for (var _iterator6 = res.data[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
							var d = _step6.value;

							datas.push(d);
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
		var _iteratorNormalCompletion7 = true;
		var _didIteratorError7 = false;
		var _iteratorError7 = undefined;

		try {
			for (var _iterator7 = all[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
				var i = _step7.value;

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
				var _iteratorNormalCompletion9 = true;
				var _didIteratorError9 = false;
				var _iteratorError9 = undefined;

				try {
					for (var _iterator9 = arr[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
						var j = _step9.value;

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
			}
			// console.log(score_array);
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

		function remove_duplicate_comment(arr) {
			var cidArray = [];
			var temp = '';
			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = arr[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var i = _step8.value;

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
		var _iteratorNormalCompletion10 = true;
		var _didIteratorError10 = false;
		var _iteratorError10 = undefined;

		try {
			for (var _iterator10 = arr[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
				var i = _step10.value;

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
		var _iteratorNormalCompletion11 = true;
		var _didIteratorError11 = false;
		var _iteratorError11 = undefined;

		try {
			for (var _iterator11 = rawdata[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
				var i = _step11.value;

				tbody += "<tr>\n\t\t\t\t\t\t<td>" + count + "</td>\n\t\t\t\t\t\t<td><a href=\"http://www.facebook.com/" + i.userid + "\" target=_blank>" + i.username + "</a></td>\n\t\t\t\t\t\t<td>" + i.score + "</td><td><button onclick=\"popup.show('" + i.userid + "')\">\u8A73\u7D30\u8CC7\u8A0A</button></td>\n\t\t\t\t\t  </tr>";
				count++;
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
		var _iteratorNormalCompletion12 = true;
		var _didIteratorError12 = false;
		var _iteratorError12 = undefined;

		try {
			for (var _iterator12 = data.finalArray[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
				var i = _step12.value;

				if (tar == i.userid) {
					var count = 1;
					$('.popup p span').text(i.username);
					var _iteratorNormalCompletion13 = true;
					var _didIteratorError13 = false;
					var _iteratorError13 = undefined;

					try {
						for (var _iterator13 = i.id[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
							var j = _step13.value;

							var message = j.message;
							if (message == '') message = '=====無內文=====';
							tbody += "<tr>\n\t\t\t\t\t\t\t\t<td>" + count + "</td>\n\t\t\t\t\t\t\t\t<td><a href=\"http://www.facebook.com/" + j.id + "\" target=\"_blank\">" + message + "</a></td>\n\t\t\t\t\t\t\t\t<td>" + j.comment_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.tag_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.like_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.score + "</td>\n\t\t\t\t\t\t\t  </tr>";
							count++;
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

					$(".popup table tbody").html('').append(tbody);
				}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImNvbmZpZyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJmYiIsIm5leHQiLCJmZWVkcyIsImdldEF1dGgiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzdGFydCIsInN3YWwiLCJkb25lIiwiZmJpZCIsImluaXQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0TWUiLCJnZXRQYWdlIiwiZ2V0R3JvdXAiLCJ0aGVuIiwicmVzIiwic2Vzc2lvblN0b3JhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2VuT3B0aW9uIiwib3B0aW9ucyIsImFkZENsYXNzIiwiaSIsImoiLCJpZCIsIm5hbWUiLCJhcHBlbmQiLCJzZWxlY3QyIiwic2VsZWN0UGFnZSIsInRhciIsImZpbmQiLCJhdHRyIiwic2V0VG9rZW4iLCJ2YWwiLCJwYWdlaWQiLCJwYWdlcyIsInBhcnNlIiwiYWNjZXNzX3Rva2VuIiwicGFnZUlEIiwiY2xlYXIiLCJjb21tYW5kIiwiYXBpIiwiZGF0YSIsInJlc29sdmUiLCJyZWplY3QiLCJhcnIiLCJnZXROYW1lIiwiaWRzIiwidG9TdHJpbmciLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJwcm9taXNlX2FycmF5IiwiZmluYWxBcnJheSIsImRhdGVSYW5nZSIsInRleHQiLCJyYXciLCJkYXRlQ2hlY2siLCJwaWNrYWRhdGUiLCJnZXQiLCJlbmQiLCJtZXNzYWdlIiwiZDEiLCJEYXRlIiwicGljayIsImQyIiwidGVtcCIsInJhbmdlIiwiY2hlY2siLCJvYmoiLCJmdWxsSUQiLCJwcm9taXNlIiwicHVzaCIsImNvdW50X3Njb3JlIiwiYWxlcnQiLCJkYXRhcyIsImxlbmd0aCIsImQiLCJpc19oaWRkZW4iLCJjaWQiLCJmcm9tIiwic3Vic3RyIiwicGFnaW5nIiwiZ2V0TmV4dCIsInJlcGxhY2UiLCJnZXRKU09OIiwiZmFpbCIsInNjb3JlX2FycmF5Iiwic2NvcmVfcnVsZSIsInNjb3JlIiwiY29tbWVudF9jb3VudCIsImNvbW1lbnRzX21heCIsInVzZXIiLCJsaWtlX2NvdW50IiwicmVhY3Rpb25zX21heCIsIk1hdGgiLCJjZWlsIiwibWVzc2FnZV90YWdzIiwidGFnX2NvdW50IiwidGFnIiwidGFnX21heCIsInJlbW92ZV9kdXBsaWNhdGVfY29tbWVudCIsImNpZEFycmF5IiwidGhpc2RhdGEiLCJsYXN0IiwicG9wIiwic29ydF9hcnJheSIsInNvcnQiLCJhIiwiYiIsIm1lcmdlRGF0YSIsIm1hcCIsIml0ZW0iLCJ1c2VybmFtZSIsInJlbW92ZUNsYXNzIiwibG9jYWxTdG9yYWdlIiwicmFua2VyIiwidGFibGUiLCJnZW5lcmF0ZSIsImNoYXJ0IiwiZHJhdyIsImQzIiwic2VsZWN0IiwicmVtb3ZlIiwidyIsImNvdW50IiwiaW5kZXgiLCJtYXhTY29yZSIsIm1heCIsInhTY2FsZSIsInNjYWxlIiwibGluZWFyIiwiZG9tYWluIiwiYyIsInNlbGVjdEFsbCIsImVudGVyIiwidHJhbnNpdGlvbiIsImR1cmF0aW9uIiwicmF3ZGF0YSIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJzdHJpbmciLCJ0Ym9keSIsImh0bWwiLCJhY3RpdmUiLCJyZWRvIiwiZmlsdGVyIiwicG9wdXAiLCJzaG93IiwiaGlkZSIsIm9iajJBcnJheSIsImFycmF5IiwidmFsdWUiLCJnZW5SYW5kb21BcnJheSIsIm4iLCJhcnkiLCJBcnJheSIsInIiLCJ0IiwiZmxvb3IiLCJyYW5kb20iLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJsaW5rIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjbGljayIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBOztBQUVELElBQUlXLFNBQVM7QUFDWkMsUUFBTztBQUNOQyxZQUFVLENBQUMsTUFBRCxFQUFRLFlBQVIsRUFBcUIsZUFBckIsRUFBcUMsV0FBckMsRUFBaUQsV0FBakQsRUFBNkQsU0FBN0QsRUFBdUUsY0FBdkUsQ0FESjtBQUVOQyxhQUFXLEVBRkw7QUFHTkMsZUFBYSxDQUFDLE9BQUQsRUFBUyxNQUFULEVBQWlCLGNBQWpCLENBSFA7QUFJTkMsZ0JBQWMsRUFKUjtBQUtOQyxRQUFNO0FBTEEsRUFESztBQVFaQyxRQUFPO0FBQ05MLFlBQVUsS0FESjtBQUVOQyxhQUFXLEtBRkw7QUFHTkMsZUFBYSxLQUhQO0FBSU5DLGdCQUFjLEtBSlI7QUFLTkMsUUFBTTtBQUxBLEVBUks7QUFlWkUsYUFBWTtBQUNYTixZQUFVLE1BREM7QUFFWEMsYUFBVyxNQUZBO0FBR1hDLGVBQWEsTUFIRjtBQUlYQyxnQkFBYyxNQUpIO0FBS1hDLFFBQU0sTUFMSztBQU1YRyxTQUFPLE1BTkk7QUFPWEMsVUFBUTtBQVBHLEVBZkE7QUF3QlpDLE9BQU0seURBeEJNO0FBeUJaQyxZQUFXLEtBekJDO0FBMEJaQyxZQUFXO0FBMUJDLENBQWI7O0FBNkJBLElBQUlDLEtBQUs7QUFDUkMsT0FBTSxFQURFO0FBRVJDLFFBQU8sRUFGQztBQUdSQyxVQUFTLGlCQUFDQyxJQUFELEVBQVE7QUFDaEJDLEtBQUdDLEtBQUgsQ0FBUyxVQUFTQyxRQUFULEVBQW1CO0FBQzNCUCxNQUFHUSxRQUFILENBQVlELFFBQVosRUFBc0JILElBQXRCO0FBQ0EsR0FGRCxFQUVHLEVBQUNLLE9BQU92QixPQUFPVyxJQUFmLEVBQXFCYSxlQUFlLElBQXBDLEVBRkg7QUFHQSxFQVBPO0FBUVJGLFdBQVUsa0JBQUNELFFBQUQsRUFBV0gsSUFBWCxFQUFrQjtBQUMzQixNQUFJRyxTQUFTSSxNQUFULEtBQW9CLFdBQXhCLEVBQXFDO0FBQ3BDN0IsV0FBUUMsR0FBUixDQUFZd0IsUUFBWjtBQUNBLE9BQUlILFFBQVEsVUFBWixFQUF1QjtBQUN0QixRQUFJUSxVQUFVTCxTQUFTTSxZQUFULENBQXNCQyxhQUFwQztBQUNBLFFBQUlGLFFBQVFHLE9BQVIsQ0FBZ0IsY0FBaEIsS0FBbUMsQ0FBbkMsSUFBd0NILFFBQVFHLE9BQVIsQ0FBZ0IscUJBQWhCLEtBQTBDLENBQWxGLElBQXVGSCxRQUFRRyxPQUFSLENBQWdCLFlBQWhCLEtBQWlDLENBQTVILEVBQThIO0FBQzdIZixRQUFHZ0IsS0FBSDtBQUNBLEtBRkQsTUFFSztBQUNKQyxVQUNDLGNBREQsRUFFQyxpREFGRCxFQUdDLE9BSEQsRUFJR0MsSUFKSDtBQUtBO0FBQ0QsSUFYRCxNQVdLO0FBQ0pDLFNBQUtDLElBQUwsQ0FBVWhCLElBQVY7QUFDQTtBQUNELEdBaEJELE1BZ0JLO0FBQ0pDLE1BQUdDLEtBQUgsQ0FBUyxVQUFTQyxRQUFULEVBQW1CO0FBQzNCUCxPQUFHUSxRQUFILENBQVlELFFBQVosRUFBc0JILElBQXRCO0FBQ0EsSUFGRCxFQUVHLEVBQUNLLE9BQU92QixPQUFPVyxJQUFmLEVBQXFCYSxlQUFlLElBQXBDLEVBRkg7QUFHQTtBQUNELEVBOUJPO0FBK0JSTSxRQUFPLGlCQUFJO0FBQ1ZLLFVBQVFDLEdBQVIsQ0FBWSxDQUFDdEIsR0FBR3VCLEtBQUgsRUFBRCxFQUFZdkIsR0FBR3dCLE9BQUgsRUFBWixFQUEwQnhCLEdBQUd5QixRQUFILEVBQTFCLENBQVosRUFBc0RDLElBQXRELENBQTJELFVBQUNDLEdBQUQsRUFBTztBQUNqRUMsa0JBQWV0QixLQUFmLEdBQXVCdUIsS0FBS0MsU0FBTCxDQUFlSCxHQUFmLENBQXZCO0FBQ0EzQixNQUFHK0IsU0FBSCxDQUFhSixHQUFiO0FBQ0EsR0FIRDtBQUlBLEVBcENPO0FBcUNSSSxZQUFXLG1CQUFDSixHQUFELEVBQU87QUFDakIzQixLQUFHQyxJQUFILEdBQVUsRUFBVjtBQUNBLE1BQUkrQixVQUFVLEVBQWQ7QUFDQSxNQUFJNUIsT0FBTyxDQUFDLENBQVo7QUFDQXBCLElBQUUsT0FBRixFQUFXaUQsUUFBWCxDQUFvQixPQUFwQjtBQUppQjtBQUFBO0FBQUE7O0FBQUE7QUFLakIsd0JBQWFOLEdBQWIsOEhBQWlCO0FBQUEsUUFBVE8sQ0FBUzs7QUFDaEI5QjtBQURnQjtBQUFBO0FBQUE7O0FBQUE7QUFFaEIsMkJBQWE4QixDQUFiLG1JQUFlO0FBQUEsVUFBUEMsQ0FBTzs7QUFDZEgsMENBQWlDNUIsSUFBakMsbUJBQWlEK0IsRUFBRUMsRUFBbkQsV0FBMERELEVBQUVFLElBQTVEO0FBQ0E7QUFKZTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS2hCO0FBVmdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBV2pCckQsSUFBRSxxQkFBRixFQUF5QnNELE1BQXpCLENBQWdDTixPQUFoQztBQUNBaEQsSUFBRSxjQUFGLEVBQWtCdUQsT0FBbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBdERPO0FBdURSQyxhQUFZLHNCQUFJO0FBQ2Z4QyxLQUFHQyxJQUFILEdBQVUsRUFBVjtBQUNBLE1BQUl3QyxNQUFNekQsRUFBRSxjQUFGLENBQVY7QUFDQSxNQUFJb0IsT0FBT3FDLElBQUlDLElBQUosQ0FBUyxpQkFBVCxFQUE0QkMsSUFBNUIsQ0FBaUMsV0FBakMsQ0FBWDtBQUNBLE1BQUl2QyxRQUFRLENBQVosRUFBYztBQUNiSixNQUFHNEMsUUFBSCxDQUFZSCxJQUFJQyxJQUFKLENBQVMsaUJBQVQsRUFBNEJDLElBQTVCLENBQWlDLE9BQWpDLENBQVo7QUFDQTtBQUNEM0MsS0FBR1IsSUFBSCxDQUFRaUQsSUFBSUksR0FBSixFQUFSLEVBQW1CekMsSUFBbkIsRUFBeUJKLEdBQUdDLElBQTVCO0FBQ0EsRUEvRE87QUFnRVIyQyxXQUFVLGtCQUFDRSxNQUFELEVBQVU7QUFDbkIsTUFBSUMsUUFBUWxCLEtBQUttQixLQUFMLENBQVdwQixlQUFldEIsS0FBMUIsRUFBaUMsQ0FBakMsQ0FBWjtBQURtQjtBQUFBO0FBQUE7O0FBQUE7QUFFbkIseUJBQWF5QyxLQUFiLG1JQUFtQjtBQUFBLFFBQVhiLENBQVc7O0FBQ2xCLFFBQUlBLEVBQUVFLEVBQUYsSUFBUVUsTUFBWixFQUFtQjtBQUNsQjVELFlBQU9hLFNBQVAsR0FBbUJtQyxFQUFFZSxZQUFyQjtBQUNBO0FBQ0Q7QUFOa0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9uQixFQXZFTztBQXdFUnpELE9BQU0sY0FBQzBELE1BQUQsRUFBUzlDLElBQVQsRUFBd0M7QUFBQSxNQUF6QnhCLEdBQXlCLHVFQUFuQixFQUFtQjtBQUFBLE1BQWZ1RSxLQUFlLHVFQUFQLElBQU87O0FBQzdDLE1BQUlDLFVBQVdoRCxRQUFRLEdBQVQsR0FBZ0IsTUFBaEIsR0FBdUIsT0FBckM7QUFDQSxNQUFJaUQsWUFBSjtBQUNBO0FBQ0EsTUFBSXpFLE9BQU8sRUFBWCxFQUFjO0FBQ2J5RSxTQUFTbkUsT0FBT1EsVUFBUCxDQUFrQkUsTUFBM0IsU0FBcUNzRCxNQUFyQyxTQUErQ0UsT0FBL0M7QUFDQSxHQUZELE1BRUs7QUFDSkMsU0FBTXpFLEdBQU47QUFDQTtBQUNEeUIsS0FBR2dELEdBQUgsQ0FBT0EsR0FBUCxFQUFXLFVBQVMxQixHQUFULEVBQWE7QUFDdkIzQixNQUFHRSxLQUFILEdBQVd5QixJQUFJMkIsSUFBZjtBQUNBQSxRQUFLdEMsS0FBTDtBQUNBLEdBSEQ7QUFJQSxFQXJGTztBQXNGUk8sUUFBTyxpQkFBSTtBQUNWLFNBQU8sSUFBSUYsT0FBSixDQUFZLFVBQUNrQyxPQUFELEVBQVVDLE1BQVYsRUFBbUI7QUFDckNuRCxNQUFHZ0QsR0FBSCxDQUFVbkUsT0FBT1EsVUFBUCxDQUFrQkUsTUFBNUIsVUFBeUMsVUFBQytCLEdBQUQsRUFBTztBQUMvQyxRQUFJOEIsTUFBTSxDQUFDOUIsR0FBRCxDQUFWO0FBQ0E0QixZQUFRRSxHQUFSO0FBQ0EsSUFIRDtBQUlBLEdBTE0sQ0FBUDtBQU1BLEVBN0ZPO0FBOEZSakMsVUFBUyxtQkFBSTtBQUNaLFNBQU8sSUFBSUgsT0FBSixDQUFZLFVBQUNrQyxPQUFELEVBQVVDLE1BQVYsRUFBbUI7QUFDckNuRCxNQUFHZ0QsR0FBSCxDQUFVbkUsT0FBT1EsVUFBUCxDQUFrQkUsTUFBNUIsNkJBQTRELFVBQUMrQixHQUFELEVBQU87QUFDbEU0QixZQUFRNUIsSUFBSTJCLElBQVo7QUFDQSxJQUZEO0FBR0EsR0FKTSxDQUFQO0FBS0EsRUFwR087QUFxR1I3QixXQUFVLG9CQUFJO0FBQ2IsU0FBTyxJQUFJSixPQUFKLENBQVksVUFBQ2tDLE9BQUQsRUFBVUMsTUFBVixFQUFtQjtBQUNyQ25ELE1BQUdnRCxHQUFILENBQVVuRSxPQUFPUSxVQUFQLENBQWtCRSxNQUE1QiwyQkFBMEQsVUFBQytCLEdBQUQsRUFBTztBQUNoRTRCLFlBQVE1QixJQUFJMkIsSUFBWjtBQUNBLElBRkQ7QUFHQSxHQUpNLENBQVA7QUFLQSxFQTNHTztBQTRHUkksVUFBUyxpQkFBQ0MsR0FBRCxFQUFPO0FBQ2YsU0FBTyxJQUFJdEMsT0FBSixDQUFZLFVBQUNrQyxPQUFELEVBQVVDLE1BQVYsRUFBbUI7QUFDckNuRCxNQUFHZ0QsR0FBSCxDQUFVbkUsT0FBT1EsVUFBUCxDQUFrQkUsTUFBNUIsY0FBMkMrRCxJQUFJQyxRQUFKLEVBQTNDLEVBQTZELFVBQUNqQyxHQUFELEVBQU87QUFDbkU0QixZQUFRNUIsR0FBUjtBQUNBLElBRkQ7QUFHQSxHQUpNLENBQVA7QUFLQTtBQWxITyxDQUFUOztBQXFIQSxJQUFJMkIsT0FBTztBQUNWTyxTQUFRLEVBREU7QUFFVkMsWUFBVyxDQUZEO0FBR1ZoRSxZQUFXLEtBSEQ7QUFJVmlFLGdCQUFlLEVBSkw7QUFLVkMsYUFBWSxFQUxGO0FBTVZDLFlBQVcsRUFORDtBQU9WN0MsT0FBTSxnQkFBSTtBQUNUcEMsSUFBRSxtQkFBRixFQUF1QmtGLElBQXZCLENBQTRCLEVBQTVCO0FBQ0FaLE9BQUtRLFNBQUwsR0FBaUIsQ0FBakI7QUFDQVIsT0FBS1MsYUFBTCxHQUFxQixFQUFyQjtBQUNBVCxPQUFLYSxHQUFMLEdBQVcsRUFBWDtBQUNBLEVBWlM7QUFhVkMsWUFBVyxxQkFBSTtBQUNkLE1BQUlwRCxRQUFRaEMsRUFBRSxhQUFGLEVBQWlCcUYsU0FBakIsQ0FBMkIsUUFBM0IsRUFBcUNDLEdBQXJDLENBQXlDLFFBQXpDLEVBQW1ELFlBQW5ELENBQVo7QUFDQSxNQUFJQyxNQUFNdkYsRUFBRSxXQUFGLEVBQWVxRixTQUFmLENBQXlCLFFBQXpCLEVBQW1DQyxHQUFuQyxDQUF1QyxRQUF2QyxFQUFpRCxZQUFqRCxDQUFWO0FBQ0EsTUFBSUUsVUFBVSxFQUFkO0FBQ0EsTUFBSXhELFNBQVMsRUFBVCxJQUFldUQsT0FBTyxFQUExQixFQUE2QjtBQUM1QkMsYUFBVSxPQUFWO0FBQ0EsR0FGRCxNQUVLO0FBQ0osT0FBSUMsS0FBSyxJQUFJQyxJQUFKLENBQVMxRixFQUFFLGFBQUYsRUFBaUJxRixTQUFqQixDQUEyQixRQUEzQixFQUFxQ0MsR0FBckMsQ0FBeUMsUUFBekMsRUFBbURLLElBQTVELENBQVQ7QUFDQSxPQUFJQyxLQUFLLElBQUlGLElBQUosQ0FBUzFGLEVBQUUsV0FBRixFQUFlcUYsU0FBZixDQUF5QixRQUF6QixFQUFtQ0MsR0FBbkMsQ0FBdUMsUUFBdkMsRUFBaURLLElBQTFELENBQVQ7QUFDQSxPQUFJQyxLQUFHSCxFQUFILEdBQVEsVUFBWixFQUF1QjtBQUN0QkQsY0FBVSxhQUFWO0FBQ0EsSUFGRCxNQUVNLElBQUlJLEtBQUdILEVBQVAsRUFBVTtBQUNmLFFBQUlJLE9BQU83RCxLQUFYO0FBQ0FBLFlBQVF1RCxHQUFSO0FBQ0FBLFVBQU1NLElBQU47QUFDQTtBQUNEO0FBQ0QsTUFBSUwsV0FBVyxFQUFmLEVBQWtCO0FBQ2pCLFVBQU87QUFDTixhQUFTLElBREg7QUFFTix3QkFBa0J4RCxLQUFsQixlQUFpQ3VELEdBRjNCO0FBR04sY0FBVXZGLEVBQUUsYUFBRixFQUFpQnFGLFNBQWpCLENBQTJCLFFBQTNCLEVBQXFDQyxHQUFyQyxDQUF5QyxRQUF6QyxFQUFtRCxZQUFuRCxJQUFtRSxLQUFuRSxHQUEyRXRGLEVBQUUsV0FBRixFQUFlcUYsU0FBZixDQUF5QixRQUF6QixFQUFtQ0MsR0FBbkMsQ0FBdUMsUUFBdkMsRUFBaUQsWUFBakQ7QUFIL0UsSUFBUDtBQUtBLEdBTkQsTUFNSztBQUNKLFVBQU87QUFDTixhQUFTLEtBREg7QUFFTixlQUFXRTtBQUZMLElBQVA7QUFJQTtBQUNELEVBMUNTO0FBMkNWeEQsUUFBTyxpQkFBSTtBQUNWc0MsT0FBS2xDLElBQUw7QUFDQSxNQUFJMEQsUUFBUXhCLEtBQUtjLFNBQUwsRUFBWjtBQUNBLE1BQUlVLE1BQU1DLEtBQU4sS0FBZ0IsSUFBcEIsRUFBeUI7QUFBQTtBQUN4QnpCLFNBQUtXLFNBQUwsR0FBaUJhLEtBQWpCO0FBQ0EsUUFBSXhELE1BQU0sRUFBVjtBQUZ3QjtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLFVBR2hCYSxDQUhnQjs7QUFJdkIsVUFBSTZDLE1BQU07QUFDVEMsZUFBUTlDLEVBQUVDLEVBREQ7QUFFVDRDLFlBQUs7QUFGSSxPQUFWO0FBSUEsVUFBSUUsVUFBVTVCLEtBQUtnQixHQUFMLENBQVNVLEdBQVQsRUFBY3RELElBQWQsQ0FBbUIsVUFBQ0MsR0FBRCxFQUFPO0FBQ3ZDcUQsV0FBSTFCLElBQUosR0FBVzNCLEdBQVg7QUFDQUwsV0FBSTZELElBQUosQ0FBU0gsR0FBVDtBQUNBLE9BSGEsQ0FBZDtBQUlBMUIsV0FBS1MsYUFBTCxDQUFtQm9CLElBQW5CLENBQXdCRCxPQUF4QjtBQVp1Qjs7QUFHeEIsMkJBQWFsRixHQUFHRSxLQUFoQixtSUFBc0I7QUFBQTtBQVVyQjtBQWJ1QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWN4QmxCLE1BQUUsVUFBRixFQUFjaUQsUUFBZCxDQUF1QixNQUF2QjtBQUNBWixZQUFRQyxHQUFSLENBQVlnQyxLQUFLUyxhQUFqQixFQUFnQ3JDLElBQWhDLENBQXFDLFlBQUk7QUFDeEM0QixVQUFLOEIsV0FBTCxDQUFpQjlELEdBQWpCO0FBQ0EsS0FGRDtBQWZ3QjtBQWtCeEIsR0FsQkQsTUFrQks7QUFDSitELFNBQU1QLE1BQU1OLE9BQVo7QUFDQTtBQUNELEVBbkVTO0FBb0VWRixNQUFLLGFBQUNuRCxJQUFELEVBQVE7QUFDWixTQUFPLElBQUlFLE9BQUosQ0FBWSxVQUFDa0MsT0FBRCxFQUFVQyxNQUFWLEVBQW1CO0FBQ3JDLE9BQUk4QixRQUFRLEVBQVo7QUFDQSxPQUFJdkIsZ0JBQWdCLEVBQXBCO0FBQ0EsT0FBSVgsVUFBVSxVQUFkO0FBQ0EvQyxNQUFHZ0QsR0FBSCxDQUFVbkUsT0FBT1EsVUFBUCxDQUFrQjBELE9BQWxCLENBQVYsU0FBd0NqQyxLQUFLOEQsTUFBN0Msa0JBQWdFM0IsS0FBS1csU0FBTCxDQUFlYSxLQUEvRSxvQ0FBbUg1RixPQUFPQyxLQUFQLENBQWFpRSxPQUFiLEVBQXNCUSxRQUF0QixFQUFuSCxzQkFBb0sxRSxPQUFPYSxTQUEzSyxFQUF1TCxVQUFDNEIsR0FBRCxFQUFPO0FBQzdMMkIsU0FBS1EsU0FBTCxJQUFrQm5DLElBQUkyQixJQUFKLENBQVNpQyxNQUEzQjtBQUNBdkcsTUFBRSxtQkFBRixFQUF1QmtGLElBQXZCLENBQTRCLFVBQVNaLEtBQUtRLFNBQWQsR0FBeUIsU0FBckQ7QUFDQTtBQUg2TDtBQUFBO0FBQUE7O0FBQUE7QUFJN0wsMkJBQWFuQyxJQUFJMkIsSUFBakIsbUlBQXNCO0FBQUEsVUFBZGtDLENBQWM7O0FBQ3JCLFVBQUksQ0FBQ0EsRUFBRUMsU0FBUCxFQUFpQjtBQUNoQkQsU0FBRUUsR0FBRixHQUFRRixFQUFFRyxJQUFGLENBQU92RCxFQUFQLEdBQVksR0FBWixHQUFrQm9ELEVBQUVwRCxFQUFGLENBQUt3RCxNQUFMLENBQVksQ0FBWixFQUFlSixFQUFFcEQsRUFBRixDQUFLckIsT0FBTCxDQUFhLEdBQWIsQ0FBZixDQUExQjtBQUNBdUUsYUFBTUgsSUFBTixDQUFXSyxDQUFYO0FBQ0E7QUFDRDtBQVQ0TDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVU3TCxRQUFJN0QsSUFBSTJCLElBQUosQ0FBU2lDLE1BQVQsR0FBa0IsQ0FBbEIsSUFBdUI1RCxJQUFJa0UsTUFBSixDQUFXNUYsSUFBdEMsRUFBMkM7QUFDMUM2RixhQUFRbkUsSUFBSWtFLE1BQUosQ0FBVzVGLElBQW5CO0FBQ0EsS0FGRCxNQUVLO0FBQ0pzRCxhQUFRK0IsS0FBUjtBQUNBO0FBQ0QsSUFmRDs7QUFpQkEsWUFBU1EsT0FBVCxDQUFpQmxILEdBQWpCLEVBQThCO0FBQUEsUUFBUmEsS0FBUSx1RUFBRixDQUFFOztBQUM3QixRQUFJQSxVQUFVLENBQWQsRUFBZ0I7QUFDZmIsV0FBTUEsSUFBSW1ILE9BQUosQ0FBWSxXQUFaLEVBQXdCLFdBQVN0RyxLQUFqQyxDQUFOO0FBQ0E7QUFDRFQsTUFBRWdILE9BQUYsQ0FBVXBILEdBQVYsRUFBZSxVQUFTK0MsR0FBVCxFQUFhO0FBQzNCMkIsVUFBS1EsU0FBTCxJQUFrQm5DLElBQUkyQixJQUFKLENBQVNpQyxNQUEzQjtBQUNBdkcsT0FBRSxtQkFBRixFQUF1QmtGLElBQXZCLENBQTRCLFVBQVNaLEtBQUtRLFNBQWQsR0FBeUIsU0FBckQ7QUFGMkI7QUFBQTtBQUFBOztBQUFBO0FBRzNCLDRCQUFhbkMsSUFBSTJCLElBQWpCLG1JQUFzQjtBQUFBLFdBQWRrQyxDQUFjOztBQUNyQkYsYUFBTUgsSUFBTixDQUFXSyxDQUFYO0FBQ0E7QUFMMEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFNM0IsU0FBSTdELElBQUkyQixJQUFKLENBQVNpQyxNQUFULEdBQWtCLENBQWxCLElBQXVCNUQsSUFBSWtFLE1BQUosQ0FBVzVGLElBQXRDLEVBQTJDO0FBQzFDNkYsY0FBUW5FLElBQUlrRSxNQUFKLENBQVc1RixJQUFuQjtBQUNBLE1BRkQsTUFFSztBQUNKc0QsY0FBUStCLEtBQVI7QUFDQTtBQUNELEtBWEQsRUFXR1csSUFYSCxDQVdRLFlBQUk7QUFDWEgsYUFBUWxILEdBQVIsRUFBYSxHQUFiO0FBQ0EsS0FiRDtBQWNBO0FBQ0QsR0F4Q00sQ0FBUDtBQXlDQSxFQTlHUztBQStHVndHLGNBQWEscUJBQUM5RCxHQUFELEVBQU87QUFDbkI7Ozs7O0FBS0EsTUFBSTRFLGNBQWMsRUFBbEI7QUFObUI7QUFBQTtBQUFBOztBQUFBO0FBT25CLHlCQUFhNUUsR0FBYixtSUFBaUI7QUFBQSxRQUFUWSxDQUFTOztBQUNoQixRQUFJdUIsTUFBTXZCLEVBQUVvQixJQUFaO0FBQ0EsUUFBSTZDLGFBQWE7QUFDaEIsaUJBQVksQ0FESTtBQUVoQixxQkFBZ0IsQ0FGQTtBQUdoQixrQkFBYSxHQUhHO0FBSWhCLHNCQUFpQixFQUpEO0FBS2hCLFlBQU8sQ0FMUztBQU1oQixnQkFBVztBQU5LLEtBQWpCO0FBUUEsUUFBSUMsY0FBSjtBQVZnQjtBQUFBO0FBQUE7O0FBQUE7QUFXaEIsMkJBQWEzQyxHQUFiLG1JQUFpQjtBQUFBLFVBQVR0QixDQUFTOztBQUNoQmlFLGNBQVEsQ0FBUjtBQUNBQSxlQUFVakUsRUFBRWtFLGFBQUYsR0FBZ0JGLFdBQVcvRyxRQUEzQixHQUFzQytHLFdBQVdHLFlBQWxELEdBQWtFSCxXQUFXRyxZQUE3RSxHQUE0Rm5FLEVBQUVrRSxhQUFGLEdBQWdCRixXQUFXL0csUUFBaEk7QUFDQSxVQUFJbUgsT0FBTztBQUNWLGFBQU1wRSxFQUFFQyxFQURFO0FBRVYsaUJBQVVELEVBQUV3RCxJQUFGLENBQU92RCxFQUZQO0FBR1YsbUJBQVlELEVBQUV3RCxJQUFGLENBQU90RCxJQUhUO0FBSVYsd0JBQWlCRixFQUFFa0UsYUFKVDtBQUtWLGtCQUFXbEUsRUFBRXFDLE9BTEg7QUFNVixjQUFPckMsRUFBRXVEO0FBTkMsT0FBWDtBQVFBLFVBQUl2RCxFQUFFOUMsU0FBTixFQUFnQjtBQUNmLFdBQUk4QyxFQUFFOUMsU0FBRixDQUFZaUUsSUFBWixDQUFpQmlDLE1BQWpCLEtBQTRCLEVBQWhDLEVBQW1DO0FBQ2xDZ0IsYUFBS0MsVUFBTCxHQUFrQnJFLEVBQUVxRSxVQUFwQjtBQUNBSixpQkFBU0QsV0FBV00sYUFBcEI7QUFDQSxRQUhELE1BR0s7QUFDSkYsYUFBS0MsVUFBTCxHQUFrQnJFLEVBQUU5QyxTQUFGLENBQVlpRSxJQUFaLENBQWlCaUMsTUFBbkM7QUFDQWEsaUJBQVNNLEtBQUtDLElBQUwsQ0FBVXhFLEVBQUU5QyxTQUFGLENBQVlpRSxJQUFaLENBQWlCaUMsTUFBakIsR0FBd0JZLFdBQVc5RyxTQUE3QyxDQUFUO0FBQ0E7QUFDRCxPQVJELE1BUUs7QUFDSmtILFlBQUtDLFVBQUwsR0FBa0IsQ0FBbEI7QUFDQTtBQUNELFVBQUlyRSxFQUFFeUUsWUFBTixFQUFtQjtBQUNsQkwsWUFBS00sU0FBTCxHQUFpQjFFLEVBQUV5RSxZQUFGLENBQWVyQixNQUFoQztBQUNBYSxnQkFBV2pFLEVBQUV5RSxZQUFGLENBQWVyQixNQUFmLEdBQXdCWSxXQUFXVyxHQUFuQyxJQUEwQ1gsV0FBV1ksT0FBdEQsR0FBaUVaLFdBQVdZLE9BQTVFLEdBQXNGNUUsRUFBRXlFLFlBQUYsQ0FBZXJCLE1BQWYsR0FBd0JZLFdBQVdXLEdBQW5JO0FBQ0EsT0FIRCxNQUdLO0FBQ0pQLFlBQUtNLFNBQUwsR0FBaUIsQ0FBakI7QUFDQTtBQUNETixXQUFLSCxLQUFMLEdBQWFBLEtBQWI7QUFDQUYsa0JBQVlmLElBQVosQ0FBaUJvQixJQUFqQjtBQUNBO0FBekNlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEwQ2hCO0FBQ0Q7QUFsRG1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBb0RuQixXQUFTUyx3QkFBVCxDQUFrQ3ZELEdBQWxDLEVBQXNDO0FBQ3JDLE9BQUl3RCxXQUFXLEVBQWY7QUFDQSxPQUFJcEMsT0FBTyxFQUFYO0FBRnFDO0FBQUE7QUFBQTs7QUFBQTtBQUdyQywwQkFBYXBCLEdBQWIsbUlBQWlCO0FBQUEsU0FBVHZCLENBQVM7O0FBQ2hCLFNBQUk4QyxPQUFNOUMsQ0FBVjtBQUNBLFNBQUlBLEVBQUV3RCxHQUFGLEtBQVViLEtBQUthLEdBQW5CLEVBQXVCO0FBQ3RCLFVBQUl3QixXQUFXbEMsSUFBZjtBQUNBLFVBQUltQyxPQUFPRixTQUFTRyxHQUFULEVBQVg7QUFDQSxVQUFJRixTQUFTZCxLQUFULEdBQWlCZSxLQUFLZixLQUExQixFQUFnQztBQUMvQmUsY0FBT0QsUUFBUDtBQUNBO0FBQ0RELGVBQVM5QixJQUFULENBQWNnQyxJQUFkO0FBQ0EsTUFQRCxNQU9LO0FBQ0p0QyxhQUFPRyxJQUFQO0FBQ0FpQyxlQUFTOUIsSUFBVCxDQUFjSCxJQUFkO0FBQ0E7QUFDRDtBQWhCb0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFpQnJDLFVBQU9pQyxRQUFQO0FBQ0E7QUFDRCxNQUFJSSxhQUFhTCx5QkFBeUJkLFlBQVlvQixJQUFaLENBQWlCLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFVBQVVBLEVBQUU5QixHQUFGLEdBQVE2QixFQUFFN0IsR0FBcEI7QUFBQSxHQUFqQixDQUF6QixDQUFqQjtBQUNBcEMsT0FBS21FLFNBQUwsQ0FBZUosV0FBV0MsSUFBWCxDQUFnQixVQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxVQUFVQSxFQUFFM0QsTUFBRixHQUFXMEQsRUFBRTFELE1BQXZCO0FBQUEsR0FBaEIsQ0FBZjtBQUNBLEVBeExTO0FBeUxWNEQsWUFBVyxtQkFBQ2hFLEdBQUQsRUFBTztBQUNqQixNQUFJTyxhQUFhLEVBQWpCO0FBQ0EsTUFBSWEsT0FBTyxFQUFYO0FBRmlCO0FBQUE7QUFBQTs7QUFBQTtBQUdqQiwwQkFBYXBCLEdBQWIsd0lBQWlCO0FBQUEsUUFBVHZCLENBQVM7O0FBQ2hCLFFBQUk4QyxRQUFNOUMsQ0FBVjtBQUNBLFFBQUlBLEVBQUUyQixNQUFGLEtBQWFnQixLQUFLaEIsTUFBdEIsRUFBNkI7QUFDNUIsU0FBSXFELFdBQVdsQyxLQUFmO0FBQ0EsU0FBSW1DLE9BQU9uRCxXQUFXb0QsR0FBWCxFQUFYO0FBQ0FELFVBQUsvRSxFQUFMLENBQVErQyxJQUFSLENBQWErQixRQUFiO0FBQ0FDLFVBQUtkLGFBQUwsSUFBc0JyQixNQUFJcUIsYUFBMUI7QUFDQWMsVUFBS1gsVUFBTCxJQUFtQnhCLE1BQUl3QixVQUF2QjtBQUNBVyxVQUFLTixTQUFMLElBQWtCN0IsTUFBSTZCLFNBQXRCO0FBQ0FNLFVBQUtmLEtBQUwsSUFBY3BCLE1BQUlvQixLQUFsQjtBQUNBcEMsZ0JBQVdtQixJQUFYLENBQWdCZ0MsSUFBaEI7QUFDQSxLQVRELE1BU0s7QUFDSixTQUFJRCxZQUFXO0FBQ2QsWUFBTWxDLE1BQUk1QyxFQURJO0FBRWQsaUJBQVc0QyxNQUFJUixPQUZEO0FBR2Qsb0JBQWNRLE1BQUl3QixVQUhKO0FBSWQsdUJBQWlCeEIsTUFBSXFCLGFBSlA7QUFLZCxtQkFBYXJCLE1BQUk2QixTQUxIO0FBTWQsZUFBUzdCLE1BQUlvQjtBQU5DLE1BQWY7QUFRQXBCLFdBQUk1QyxFQUFKLEdBQVMsQ0FBQzhFLFNBQUQsQ0FBVDtBQUNBckMsWUFBT0csS0FBUDtBQUNBaEIsZ0JBQVdtQixJQUFYLENBQWdCSCxLQUFoQjtBQUNBO0FBQ0Q7QUEzQmdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBNEJqQjFCLE9BQUtVLFVBQUwsR0FBa0JBLFdBQVdzRCxJQUFYLENBQWdCLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFVBQVVBLEVBQUVwQixLQUFGLEdBQVVtQixFQUFFbkIsS0FBdEI7QUFBQSxHQUFoQixDQUFsQjtBQUNBOUMsT0FBS1UsVUFBTCxHQUFrQlYsS0FBS1UsVUFBTCxDQUFnQjBELEdBQWhCLENBQW9CLFVBQUNDLElBQUQsRUFBUTtBQUM3Q0EsUUFBS2hDLElBQUwsR0FBWTtBQUNYLFVBQU1nQyxLQUFLOUQsTUFEQTtBQUVYLFlBQVE4RCxLQUFLQztBQUZGLElBQVo7QUFJQSxVQUFPRCxJQUFQO0FBQ0EsR0FOaUIsQ0FBbEI7QUFPQTdJLFVBQVFDLEdBQVIsQ0FBWXVFLEtBQUtVLFVBQWpCO0FBQ0FoRixJQUFFLFVBQUYsRUFBYzZJLFdBQWQsQ0FBMEIsTUFBMUI7O0FBRUFDLGVBQWFDLE1BQWIsR0FBc0JsRyxLQUFLQyxTQUFMLENBQWV3QixLQUFLVSxVQUFwQixDQUF0QjtBQUNBaEYsSUFBRSxPQUFGLEVBQVdpRCxRQUFYLENBQW9CLFFBQXBCOztBQUVBK0YsUUFBTUMsUUFBTixDQUFlM0UsS0FBS1UsVUFBcEI7QUFDQWtFLFFBQU1DLElBQU4sQ0FBVzdFLEtBQUtVLFVBQWhCO0FBQ0E7QUFyT1MsQ0FBWDtBQXVPQSxJQUFJa0UsUUFBUTtBQUNYQyxPQUFNLGNBQUNuRSxVQUFELEVBQWM7QUFDbkJvRSxLQUFHQyxNQUFILENBQVUsS0FBVixFQUFpQkMsTUFBakI7QUFDQSxNQUFJN0UsTUFBTSxFQUFWO0FBQ0EsTUFBSThFLElBQUksR0FBUjtBQUNBLE1BQUlDLFFBQVEsRUFBWjtBQUNBLE1BQUl4RSxXQUFXdUIsTUFBWCxHQUFvQmlELEtBQXhCLEVBQStCQSxRQUFReEUsV0FBV3VCLE1BQW5CO0FBQy9CLE9BQUksSUFBSXJELElBQUUsQ0FBVixFQUFhQSxJQUFFc0csS0FBZixFQUFzQnRHLEdBQXRCLEVBQTBCO0FBQ3pCOEIsY0FBVzlCLENBQVgsRUFBY3VHLEtBQWQsR0FBc0J2RyxDQUF0QjtBQUNBdUIsT0FBSTBCLElBQUosQ0FBU25CLFdBQVc5QixDQUFYLENBQVQ7QUFDQTtBQUNELE1BQUl3RyxXQUFXTixHQUFHTyxHQUFILENBQU9sRixHQUFQLEVBQVksVUFBUytCLENBQVQsRUFBVztBQUFDLFVBQU9BLEVBQUVZLEtBQVQ7QUFBZSxHQUF2QyxDQUFmO0FBQ0F0SCxVQUFRQyxHQUFSLENBQVkySixRQUFaO0FBQ0EsTUFBSUUsU0FBU1IsR0FBR1MsS0FBSCxDQUFTQyxNQUFULEdBQ05DLE1BRE0sQ0FDQyxDQUFDLENBQUQsRUFBSUwsUUFBSixDQURELEVBRU41RCxLQUZNLENBRUEsQ0FBQyxDQUFELEVBQUl5RCxJQUFFLEVBQU4sQ0FGQSxDQUFiOztBQUlBLE1BQUlTLElBQUlaLEdBQUdDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CL0YsTUFBcEIsQ0FBMkIsS0FBM0IsQ0FBUjtBQUNBMEcsSUFBRUMsU0FBRixDQUFZLE1BQVosRUFDRTNGLElBREYsQ0FDT0csR0FEUCxFQUVFeUYsS0FGRixHQUdFNUcsTUFIRixDQUdTLE1BSFQsRUFJRUssSUFKRixDQUlPO0FBQ0wsV0FBUSxTQURIO0FBRUwsWUFBUyxDQUZKO0FBR0wsYUFBVSxJQUhMO0FBSUwsUUFBSyxXQUFTNkMsQ0FBVCxFQUFXO0FBQ2YsV0FBTyxDQUFQO0FBQ0EsSUFOSTtBQU9MLFFBQUssV0FBU0EsQ0FBVCxFQUFXO0FBQ2YsV0FBT0EsRUFBRWlELEtBQUYsR0FBVSxFQUFqQjtBQUNBO0FBVEksR0FKUCxFQWVFVSxVQWZGLEdBZ0JFQyxRQWhCRixDQWdCVyxJQWhCWCxFQWlCRXpHLElBakJGLENBaUJPO0FBQ0wsWUFBUSxlQUFTNkMsQ0FBVCxFQUFXO0FBQ2xCLFdBQU9vRCxPQUFPcEQsRUFBRVksS0FBVCxDQUFQO0FBQ0E7QUFISSxHQWpCUDtBQXNCQzRDLElBQUVDLFNBQUYsQ0FBWSxZQUFaLEVBQ0MzRixJQURELENBQ01HLEdBRE4sRUFFQ3lGLEtBRkQsR0FHQzVHLE1BSEQsQ0FHUSxNQUhSLEVBSUM0QixJQUpELENBSU0sVUFBU3NCLENBQVQsRUFBVztBQUNoQixVQUFPQSxFQUFFWSxLQUFGLEdBQVUsR0FBakI7QUFDQSxHQU5ELEVBT0N6RCxJQVBELENBT007QUFDTCxXQUFPLFNBREY7QUFFTCxRQUFLLENBRkE7QUFHTCxRQUFJLFdBQVM2QyxDQUFULEVBQVc7QUFDZCxXQUFPQSxFQUFFaUQsS0FBRixHQUFVLEVBQVYsR0FBZSxFQUF0QjtBQUNBO0FBTEksR0FQTixFQWNDVSxVQWRELEdBZUNDLFFBZkQsQ0FlVSxJQWZWLEVBZ0JDekcsSUFoQkQsQ0FnQk07QUFDTCxRQUFJLFdBQVM2QyxDQUFULEVBQVc7QUFDZCxXQUFPb0QsT0FBT3BELEVBQUVZLEtBQVQsSUFBa0IsRUFBekI7QUFDQTtBQUhJLEdBaEJOO0FBcUJBNEMsSUFBRUMsU0FBRixDQUFZLFdBQVosRUFDQzNGLElBREQsQ0FDTUcsR0FETixFQUVDeUYsS0FGRCxHQUdDNUcsTUFIRCxDQUdRLE1BSFIsRUFJQzRCLElBSkQsQ0FJTSxVQUFTc0IsQ0FBVCxFQUFXO0FBQ2hCLFVBQU9BLEVBQUVvQyxRQUFUO0FBQ0EsR0FORCxFQU9DakYsSUFQRCxDQU9NO0FBQ0wsV0FBTyxNQURGO0FBRUwsa0JBQWUsS0FGVjtBQUdMLFFBQUssQ0FIQTtBQUlMLFFBQUksV0FBUzZDLENBQVQsRUFBVztBQUNkLFdBQU9BLEVBQUVpRCxLQUFGLEdBQVUsRUFBVixHQUFlLEVBQXRCO0FBQ0E7QUFOSSxHQVBOLEVBZUNVLFVBZkQsR0FnQkNDLFFBaEJELENBZ0JVLElBaEJWLEVBaUJDekcsSUFqQkQsQ0FpQk07QUFDTCxRQUFJLFdBQVM2QyxDQUFULEVBQVc7QUFDZCxXQUFPb0QsT0FBT3BELEVBQUVZLEtBQVQsSUFBa0IsRUFBekI7QUFDQTtBQUhJLEdBakJOO0FBc0JBNEMsSUFBRUMsU0FBRixDQUFZLEtBQVosRUFDQzNGLElBREQsQ0FDTUcsR0FETixFQUVDeUYsS0FGRCxHQUdDNUcsTUFIRCxDQUdRLFdBSFIsRUFJQ0ssSUFKRCxDQUlNO0FBQ0wsaUJBQWMsbUJBQVM2QyxDQUFULEVBQVc7QUFDeEIsV0FBTywrQkFBNkJBLEVBQUUzQixNQUEvQixHQUFzQyw2QkFBN0M7QUFDQSxJQUhJO0FBSUwsWUFBUyxFQUpKO0FBS0wsYUFBVSxFQUxMO0FBTUwsUUFBSyxDQU5BO0FBT0wsUUFBSSxXQUFTMkIsQ0FBVCxFQUFXO0FBQ2QsV0FBT0EsRUFBRWlELEtBQUYsR0FBVSxFQUFqQjtBQUNBO0FBVEksR0FKTixFQWVDVSxVQWZELEdBZ0JDQyxRQWhCRCxDQWdCVSxJQWhCVixFQWlCQ3pHLElBakJELENBaUJNO0FBQ0wsUUFBSSxXQUFTNkMsQ0FBVCxFQUFXO0FBQ2QsV0FBT29ELE9BQU9wRCxFQUFFWSxLQUFULENBQVA7QUFDQTtBQUhJLEdBakJOO0FBc0JEO0FBekdVLENBQVo7QUEyR0EsSUFBSTRCLFFBQVE7QUFDWEMsV0FBVSxrQkFBQ29CLE9BQUQsRUFBVztBQUNwQnJLLElBQUUsZUFBRixFQUFtQnNLLFNBQW5CLEdBQStCQyxPQUEvQjtBQUNBdkssSUFBRSxnQ0FBRixFQUFvQ2tGLElBQXBDLENBQXlDbUYsUUFBUTlELE1BQWpEO0FBQ0F2RyxJQUFFLGdDQUFGLEVBQW9Da0YsSUFBcEMsQ0FBeUNaLEtBQUtXLFNBQUwsQ0FBZXVGLE1BQXhEO0FBQ0EsTUFBSWhCLFFBQVEsQ0FBWjtBQUNBLE1BQUlpQixRQUFRLEVBQVo7QUFMb0I7QUFBQTtBQUFBOztBQUFBO0FBTXBCLDBCQUFhSixPQUFiLHdJQUFxQjtBQUFBLFFBQWJuSCxDQUFhOztBQUNwQnVILHdDQUNTakIsS0FEVCxpRUFFMEN0RyxFQUFFMkIsTUFGNUMseUJBRXFFM0IsRUFBRTBGLFFBRnZFLG1DQUdTMUYsRUFBRWtFLEtBSFgsK0NBR3lEbEUsRUFBRTJCLE1BSDNEO0FBS0EyRTtBQUNBO0FBYm1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBY3BCeEosSUFBRSxxQkFBRixFQUF5QjBLLElBQXpCLENBQThCLEVBQTlCLEVBQWtDcEgsTUFBbEMsQ0FBeUNtSCxLQUF6Qzs7QUFFQUU7O0FBRUEsV0FBU0EsTUFBVCxHQUFpQjtBQUNoQixPQUFJM0IsUUFBUWhKLEVBQUUsZUFBRixFQUFtQnNLLFNBQW5CLENBQTZCO0FBQ3hDLGtCQUFjLElBRDBCO0FBRXhDLGlCQUFhLElBRjJCO0FBR3hDLG9CQUFnQjtBQUh3QixJQUE3QixDQUFaO0FBS0E7QUFDRCxFQTFCVTtBQTJCWE0sT0FBTSxnQkFBSTtBQUNUdEcsT0FBS3VHLE1BQUwsQ0FBWXZHLEtBQUthLEdBQWpCLEVBQXNCLElBQXRCO0FBQ0E7QUE3QlUsQ0FBWjtBQStCQSxJQUFJMkYsUUFBUTtBQUNYQyxPQUFNLGNBQUN0SCxHQUFELEVBQU87QUFDWixNQUFJZ0gsUUFBUSxFQUFaO0FBRFk7QUFBQTtBQUFBOztBQUFBO0FBRVosMEJBQWFuRyxLQUFLVSxVQUFsQix3SUFBNkI7QUFBQSxRQUFyQjlCLENBQXFCOztBQUM1QixRQUFJTyxPQUFPUCxFQUFFMkIsTUFBYixFQUFvQjtBQUNuQixTQUFJMkUsUUFBUSxDQUFaO0FBQ0F4SixPQUFFLGVBQUYsRUFBbUJrRixJQUFuQixDQUF3QmhDLEVBQUUwRixRQUExQjtBQUZtQjtBQUFBO0FBQUE7O0FBQUE7QUFHbkIsNkJBQWExRixFQUFFRSxFQUFmLHdJQUFrQjtBQUFBLFdBQVZELENBQVU7O0FBQ2pCLFdBQUlxQyxVQUFVckMsRUFBRXFDLE9BQWhCO0FBQ0EsV0FBSUEsV0FBVyxFQUFmLEVBQW1CQSxVQUFVLGVBQVY7QUFDbkJpRiwrQ0FDU2pCLEtBRFQscUVBRTBDckcsRUFBRUMsRUFGNUMsNkJBRW1Fb0MsT0FGbkUsdUNBR1NyQyxFQUFFa0UsYUFIWCxtQ0FJU2xFLEVBQUUwRSxTQUpYLG1DQUtTMUUsRUFBRXFFLFVBTFgsbUNBTVNyRSxFQUFFaUUsS0FOWDtBQVFBb0M7QUFDQTtBQWZrQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWdCbkJ4SixPQUFFLG9CQUFGLEVBQXdCMEssSUFBeEIsQ0FBNkIsRUFBN0IsRUFBaUNwSCxNQUFqQyxDQUF3Q21ILEtBQXhDO0FBQ0E7QUFDRDtBQXJCVztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQXNCWnpLLElBQUUsUUFBRixFQUFZaUQsUUFBWixDQUFxQixNQUFyQjtBQUNBLEVBeEJVO0FBeUJYK0gsT0FBTSxnQkFBSTtBQUNUaEwsSUFBRSxRQUFGLEVBQVk2SSxXQUFaLENBQXdCLE1BQXhCO0FBQ0E7QUEzQlUsQ0FBWjs7QUE4QkMsU0FBU29DLFNBQVQsQ0FBbUJqRixHQUFuQixFQUF1QjtBQUN0QixLQUFJa0YsUUFBUWxMLEVBQUUwSSxHQUFGLENBQU0xQyxHQUFOLEVBQVcsVUFBU21GLEtBQVQsRUFBZ0IxQixLQUFoQixFQUF1QjtBQUM3QyxTQUFPLENBQUMwQixLQUFELENBQVA7QUFDQSxFQUZXLENBQVo7QUFHQSxRQUFPRCxLQUFQO0FBQ0E7O0FBRUQsU0FBU0UsY0FBVCxDQUF3QkMsQ0FBeEIsRUFBMkI7QUFDMUIsS0FBSUMsTUFBTSxJQUFJQyxLQUFKLEVBQVY7QUFDQSxLQUFJckksQ0FBSixFQUFPc0ksQ0FBUCxFQUFVQyxDQUFWO0FBQ0EsTUFBS3ZJLElBQUksQ0FBVCxFQUFhQSxJQUFJbUksQ0FBakIsRUFBcUIsRUFBRW5JLENBQXZCLEVBQTBCO0FBQ3pCb0ksTUFBSXBJLENBQUosSUFBU0EsQ0FBVDtBQUNBO0FBQ0QsTUFBS0EsSUFBSSxDQUFULEVBQWFBLElBQUltSSxDQUFqQixFQUFxQixFQUFFbkksQ0FBdkIsRUFBMEI7QUFDekJzSSxNQUFJOUQsS0FBS2dFLEtBQUwsQ0FBV2hFLEtBQUtpRSxNQUFMLEtBQWdCTixDQUEzQixDQUFKO0FBQ0FJLE1BQUlILElBQUlFLENBQUosQ0FBSjtBQUNBRixNQUFJRSxDQUFKLElBQVNGLElBQUlwSSxDQUFKLENBQVQ7QUFDQW9JLE1BQUlwSSxDQUFKLElBQVN1SSxDQUFUO0FBQ0E7QUFDRCxRQUFPSCxHQUFQO0FBQ0E7O0FBRUQsU0FBU00sa0JBQVQsQ0FBNEJDLFFBQTVCLEVBQXNDQyxXQUF0QyxFQUFtREMsU0FBbkQsRUFBOEQ7QUFDM0Q7QUFDQSxLQUFJQyxVQUFVLFFBQU9ILFFBQVAseUNBQU9BLFFBQVAsTUFBbUIsUUFBbkIsR0FBOEJoSixLQUFLbUIsS0FBTCxDQUFXNkgsUUFBWCxDQUE5QixHQUFxREEsUUFBbkU7O0FBRUEsS0FBSUksTUFBTSxFQUFWO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxLQUFJRixTQUFKLEVBQWU7QUFDWCxNQUFJRyxNQUFNLEVBQVY7O0FBRUE7QUFDQSxPQUFLLElBQUl6QyxLQUFULElBQWtCdUMsUUFBUSxDQUFSLENBQWxCLEVBQThCOztBQUUxQjtBQUNBRSxVQUFPekMsUUFBUSxHQUFmO0FBQ0g7O0FBRUR5QyxRQUFNQSxJQUFJQyxLQUFKLENBQVUsQ0FBVixFQUFhLENBQUMsQ0FBZCxDQUFOOztBQUVBO0FBQ0FGLFNBQU9DLE1BQU0sTUFBYjtBQUNIOztBQUVEO0FBQ0EsTUFBSyxJQUFJaEosSUFBSSxDQUFiLEVBQWdCQSxJQUFJOEksUUFBUXpGLE1BQTVCLEVBQW9DckQsR0FBcEMsRUFBeUM7QUFDckMsTUFBSWdKLE1BQU0sRUFBVjs7QUFFQTtBQUNBLE9BQUssSUFBSXpDLEtBQVQsSUFBa0J1QyxRQUFROUksQ0FBUixDQUFsQixFQUE4QjtBQUMxQmdKLFVBQU8sTUFBTUYsUUFBUTlJLENBQVIsRUFBV3VHLEtBQVgsQ0FBTixHQUEwQixJQUFqQztBQUNIOztBQUVEeUMsTUFBSUMsS0FBSixDQUFVLENBQVYsRUFBYUQsSUFBSTNGLE1BQUosR0FBYSxDQUExQjs7QUFFQTtBQUNBMEYsU0FBT0MsTUFBTSxNQUFiO0FBQ0g7O0FBRUQsS0FBSUQsT0FBTyxFQUFYLEVBQWU7QUFDWDVGLFFBQU0sY0FBTjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxLQUFJK0YsV0FBVyxFQUFmO0FBQ0E7QUFDQUEsYUFBWU4sWUFBWS9FLE9BQVosQ0FBb0IsSUFBcEIsRUFBeUIsR0FBekIsQ0FBWjs7QUFFQTtBQUNBLEtBQUlzRixNQUFNLHVDQUF1Q0MsVUFBVUwsR0FBVixDQUFqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUlNLE9BQU9DLFNBQVNDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBRixNQUFLRyxJQUFMLEdBQVlMLEdBQVo7O0FBRUE7QUFDQUUsTUFBS0ksS0FBTCxHQUFhLG1CQUFiO0FBQ0FKLE1BQUtLLFFBQUwsR0FBZ0JSLFdBQVcsTUFBM0I7O0FBRUE7QUFDQUksVUFBU0ssSUFBVCxDQUFjQyxXQUFkLENBQTBCUCxJQUExQjtBQUNBQSxNQUFLUSxLQUFMO0FBQ0FQLFVBQVNLLElBQVQsQ0FBY0csV0FBZCxDQUEwQlQsSUFBMUI7QUFDSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvcj1oYW5kbGVFcnJcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXHJcbntcclxuXHRpZiAoIWVycm9yTWVzc2FnZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2Zyb20nLCdsaWtlX2NvdW50JywnY29tbWVudF9jb3VudCcsJ3JlYWN0aW9ucycsJ2lzX2hpZGRlbicsJ21lc3NhZ2UnLCdtZXNzYWdlX3RhZ3MnXSxcclxuXHRcdHJlYWN0aW9uczogW10sXHJcblx0XHRzaGFyZWRwb3N0czogWydzdG9yeScsJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogW11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3YyLjcnLFxyXG5cdFx0cmVhY3Rpb25zOiAndjIuNycsXHJcblx0XHRzaGFyZWRwb3N0czogJ3YyLjMnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjIuNycsXHJcblx0XHRmZWVkOiAndjIuMycsXHJcblx0XHRncm91cDogJ3YyLjcnLFxyXG5cdFx0bmV3ZXN0OiAndjIuOCdcclxuXHR9LFxyXG5cdGF1dGg6ICd1c2VyX3Bob3Rvcyx1c2VyX3Bvc3RzLHVzZXJfbWFuYWdlZF9ncm91cHMsbWFuYWdlX3BhZ2VzJyxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHBhZ2VUb2tlbjogJycsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHRuZXh0OiAnJyxcclxuXHRmZWVkczogW10sXHJcblx0Z2V0QXV0aDogKHR5cGUpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpe1xyXG5cdFx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfbWFuYWdlZF9ncm91cHMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xyXG5cdFx0XHRcdFx0ZmIuc3RhcnQoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfmjojmrIrlpLHmlZfvvIzoq4vntabkuojmiYDmnInmrIrpmZAnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxyXG5cdFx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoKT0+e1xyXG5cdFx0UHJvbWlzZS5hbGwoW2ZiLmdldE1lKCksZmIuZ2V0UGFnZSgpLCBmYi5nZXRHcm91cCgpXSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5sb2dpbiA9IEpTT04uc3RyaW5naWZ5KHJlcyk7XHJcblx0XHRcdGZiLmdlbk9wdGlvbihyZXMpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZW5PcHRpb246IChyZXMpPT57XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgb3B0aW9ucyA9ICcnO1xyXG5cdFx0bGV0IHR5cGUgPSAtMTtcclxuXHRcdCQoJ2FzaWRlJykuYWRkQ2xhc3MoJ2xvZ2luJyk7XHJcblx0XHRmb3IobGV0IGkgb2YgcmVzKXtcclxuXHRcdFx0dHlwZSsrO1xyXG5cdFx0XHRmb3IobGV0IGogb2YgaSl7XHJcblx0XHRcdFx0b3B0aW9ucyArPSBgPG9wdGlvbiBhdHRyLXR5cGU9XCIke3R5cGV9XCIgdmFsdWU9XCIke2ouaWR9XCI+JHtqLm5hbWV9PC9vcHRpb24+YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnYXNpZGUgLnN0ZXAxIHNlbGVjdCcpLmFwcGVuZChvcHRpb25zKTtcclxuXHRcdCQoJ2FzaWRlIHNlbGVjdCcpLnNlbGVjdDIoKTtcclxuXHRcdC8vICQoJ2FzaWRlIHNlbGVjdCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdC8vIFx0bGV0IHR5cGUgPSAkKHRoaXMpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmF0dHIoJ2F0dHItdHlwZScpO1xyXG5cdFx0Ly8gXHRmYi5zZWxlY3RQYWdlKGV2ZW50LnRhcmdldC52YWx1ZSwgdHlwZSk7XHJcblx0XHQvLyB9KTtcclxuXHR9LFxyXG5cdHNlbGVjdFBhZ2U6ICgpPT57XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgdGFyID0gJCgnYXNpZGUgc2VsZWN0Jyk7XHJcblx0XHRsZXQgdHlwZSA9IHRhci5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdGlmICh0eXBlID09IDEpe1xyXG5cdFx0XHRmYi5zZXRUb2tlbih0YXIuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuYXR0cigndmFsdWUnKSk7XHJcblx0XHR9XHJcblx0XHRmYi5mZWVkKHRhci52YWwoKSwgdHlwZSwgZmIubmV4dCk7XHJcblx0fSxcclxuXHRzZXRUb2tlbjogKHBhZ2VpZCk9PntcclxuXHRcdGxldCBwYWdlcyA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UubG9naW4pWzFdO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHBhZ2VzKXtcclxuXHRcdFx0aWYgKGkuaWQgPT0gcGFnZWlkKXtcclxuXHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gaS5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdGZlZWQ6IChwYWdlSUQsIHR5cGUsIHVybCA9ICcnLCBjbGVhciA9IHRydWUpPT57XHJcblx0XHRsZXQgY29tbWFuZCA9ICh0eXBlID09ICcyJykgPyAnZmVlZCc6J3Bvc3RzJztcclxuXHRcdGxldCBhcGk7XHJcblx0XHQvLzE0Njg0NjY5OTAwOTc2MjNcclxuXHRcdGlmICh1cmwgPT0gJycpe1xyXG5cdFx0XHRhcGkgPSBgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9LyR7cGFnZUlEfS8ke2NvbW1hbmR9P2ZpZWxkcz1saW5rLGZ1bGxfcGljdHVyZSxjcmVhdGVkX3RpbWUsbWVzc2FnZSZsaW1pdD01MGA7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0YXBpID0gdXJsO1xyXG5cdFx0fVxyXG5cdFx0RkIuYXBpKGFwaSxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRmYi5mZWVkcyA9IHJlcy5kYXRhO1xyXG5cdFx0XHRkYXRhLnN0YXJ0KCk7XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Z2V0TWU6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWVgLCAocmVzKT0+e1xyXG5cdFx0XHRcdGxldCBhcnIgPSBbcmVzXTtcclxuXHRcdFx0XHRyZXNvbHZlKGFycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRQYWdlOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2FjY291bnRzP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRHcm91cDogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9ncm91cHM/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldE5hbWU6IChpZHMpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vP2lkcz0ke2lkcy50b1N0cmluZygpfWAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwcm9taXNlX2FycmF5OiBbXSxcclxuXHRmaW5hbEFycmF5OiBbXSxcclxuXHRkYXRlUmFuZ2U6IHt9LFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0XHRkYXRhLnByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdGRhdGEucmF3ID0gW107XHJcblx0fSxcclxuXHRkYXRlQ2hlY2s6ICgpPT57XHJcblx0XHRsZXQgc3RhcnQgPSAkKCcjc3RhcnRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS1tbS1kZCcpO1xyXG5cdFx0bGV0IGVuZCA9ICQoJyNlbmRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS1tbS1kZCcpO1xyXG5cdFx0bGV0IG1lc3NhZ2UgPSAnJztcclxuXHRcdGlmIChzdGFydCA9PSAnJyB8fCBlbmQgPT0gJycpe1xyXG5cdFx0XHRtZXNzYWdlID0gJ+iri+mBuOaTh+aXpeacnyc7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0bGV0IGQxID0gbmV3IERhdGUoJCgnI3N0YXJ0X2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JykucGljayk7XHJcblx0XHRcdGxldCBkMiA9IG5ldyBEYXRlKCQoJyNlbmRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnKS5waWNrKTtcclxuXHRcdFx0aWYgKGQyLWQxID4gNTE4NDAwMDAwMCl7XHJcblx0XHRcdFx0bWVzc2FnZSA9ICfml6XmnJ/ljYDplpPkuI3og73otoXpgY42MOWkqSc7XHJcblx0XHRcdH1lbHNlIGlmIChkMjxkMSl7XHJcblx0XHRcdFx0bGV0IHRlbXAgPSBzdGFydDtcclxuXHRcdFx0XHRzdGFydCA9IGVuZDtcclxuXHRcdFx0XHRlbmQgPSB0ZW1wO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAobWVzc2FnZSA9PSAnJyl7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0J2NoZWNrJzogdHJ1ZSxcclxuXHRcdFx0XHQncmFuZ2UnOiBgc2luY2U9JHtzdGFydH0mdW50aWw9JHtlbmR9YCxcclxuXHRcdFx0XHQnc3RyaW5nJzogJCgnI3N0YXJ0X2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXkvbW0vZGQnKSArIFwiIH4gXCIgKyAkKCcjZW5kX2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXkvbW0vZGQnKVxyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHQnY2hlY2snOiBmYWxzZSxcclxuXHRcdFx0XHQnbWVzc2FnZSc6IG1lc3NhZ2VcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6ICgpPT57XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdGxldCByYW5nZSA9IGRhdGEuZGF0ZUNoZWNrKCk7XHJcblx0XHRpZiAocmFuZ2UuY2hlY2sgPT09IHRydWUpe1xyXG5cdFx0XHRkYXRhLmRhdGVSYW5nZSA9IHJhbmdlO1xyXG5cdFx0XHRsZXQgYWxsID0gW107XHJcblx0XHRcdGZvcihsZXQgaiBvZiBmYi5mZWVkcyl7XHJcblx0XHRcdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0XHRcdGZ1bGxJRDogai5pZCxcclxuXHRcdFx0XHRcdG9iajoge31cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHByb21pc2UgPSBkYXRhLmdldChvYmopLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHRcdG9iai5kYXRhID0gcmVzO1xyXG5cdFx0XHRcdFx0YWxsLnB1c2gob2JqKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRkYXRhLnByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCcubG9hZGluZycpLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0XHRcdFByb21pc2UuYWxsKGRhdGEucHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRcdGRhdGEuY291bnRfc2NvcmUoYWxsKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0YWxlcnQocmFuZ2UubWVzc2FnZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xyXG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgY29tbWFuZCA9ICdjb21tZW50cyc7XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vY29tbWVudHM/JHtkYXRhLmRhdGVSYW5nZS5yYW5nZX0mb3JkZXI9Y2hyb25vbG9naWNhbCZmaWVsZHM9JHtjb25maWcuZmllbGRbY29tbWFuZF0udG9TdHJpbmcoKX0mYWNjZXNzX3Rva2VuPSR7Y29uZmlnLnBhZ2VUb2tlbn1gLChyZXMpPT57XHJcblx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKHJlcyk7XHJcblx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdGlmICghZC5pc19oaWRkZW4pe1xyXG5cdFx0XHRcdFx0XHRkLmNpZCA9IGQuZnJvbS5pZCArICdfJyArIGQuaWQuc3Vic3RyKDAsIGQuaWQuaW5kZXhPZignXycpKTtcclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQ9MCl7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKXtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCdsaW1pdD0nK2xpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpPT57XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjb3VudF9zY29yZTogKGFsbCk9PntcclxuXHRcdC8qXHJcblx0XHRcdOeVmeiogDPliIbjgIFUQUfkuIDlgIsx5YiG77yM5pyA5aSaM+WIhlxyXG5cdFx0XHTnlZnoqIDlv4Pmg4Uy5YCLMeWIhu+8jOeEoeaineS7tumAsuS9je+8jOacgOWkmjEz5YiGXHJcblx0XHRcdOeVmeiogOeahOeVmeiogOS4gOWAizHliIbvvIzmnIDlpKc25YiGXHJcblx0XHQqL1xyXG5cdFx0bGV0IHNjb3JlX2FycmF5ID0gW107XHJcblx0XHRmb3IobGV0IGkgb2YgYWxsKXtcclxuXHRcdFx0bGV0IGFyciA9IGkuZGF0YTtcclxuXHRcdFx0bGV0IHNjb3JlX3J1bGUgPSB7XHJcblx0XHRcdFx0J2NvbW1lbnRzJzogMSxcclxuXHRcdFx0XHQnY29tbWVudHNfbWF4JzogNixcclxuXHRcdFx0XHQncmVhY3Rpb25zJzogMC41LFxyXG5cdFx0XHRcdCdyZWFjdGlvbnNfbWF4JzogMTMsXHJcblx0XHRcdFx0J3RhZyc6IDEsXHJcblx0XHRcdFx0J3RhZ19tYXgnOiAzXHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHNjb3JlO1xyXG5cdFx0XHRmb3IobGV0IGogb2YgYXJyKXtcclxuXHRcdFx0XHRzY29yZSA9IDM7XHJcblx0XHRcdFx0c2NvcmUgKz0gKGouY29tbWVudF9jb3VudCpzY29yZV9ydWxlLmNvbW1lbnRzID4gc2NvcmVfcnVsZS5jb21tZW50c19tYXgpID8gc2NvcmVfcnVsZS5jb21tZW50c19tYXggOiBqLmNvbW1lbnRfY291bnQqc2NvcmVfcnVsZS5jb21tZW50cztcclxuXHRcdFx0XHRsZXQgdXNlciA9IHtcclxuXHRcdFx0XHRcdCdpZCc6IGouaWQsXHJcblx0XHRcdFx0XHQndXNlcmlkJzogai5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0J3VzZXJuYW1lJzogai5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHQnY29tbWVudF9jb3VudCc6IGouY29tbWVudF9jb3VudCxcclxuXHRcdFx0XHRcdCdtZXNzYWdlJzogai5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0J2NpZCc6IGouY2lkXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZiAoai5yZWFjdGlvbnMpe1xyXG5cdFx0XHRcdFx0aWYgKGoucmVhY3Rpb25zLmRhdGEubGVuZ3RoID09PSAyNSl7XHJcblx0XHRcdFx0XHRcdHVzZXIubGlrZV9jb3VudCA9IGoubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0c2NvcmUgKz0gc2NvcmVfcnVsZS5yZWFjdGlvbnNfbWF4O1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHVzZXIubGlrZV9jb3VudCA9IGoucmVhY3Rpb25zLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0XHRzY29yZSArPSBNYXRoLmNlaWwoai5yZWFjdGlvbnMuZGF0YS5sZW5ndGgqc2NvcmVfcnVsZS5yZWFjdGlvbnMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dXNlci5saWtlX2NvdW50ID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGoubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRcdHVzZXIudGFnX2NvdW50ID0gai5tZXNzYWdlX3RhZ3MubGVuZ3RoXHJcblx0XHRcdFx0XHRzY29yZSArPSAgKGoubWVzc2FnZV90YWdzLmxlbmd0aCAqIHNjb3JlX3J1bGUudGFnID49IHNjb3JlX3J1bGUudGFnX21heCkgPyBzY29yZV9ydWxlLnRhZ19tYXggOiBqLm1lc3NhZ2VfdGFncy5sZW5ndGggKiBzY29yZV9ydWxlLnRhZztcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHVzZXIudGFnX2NvdW50ID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dXNlci5zY29yZSA9IHNjb3JlO1xyXG5cdFx0XHRcdHNjb3JlX2FycmF5LnB1c2godXNlcik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIGNvbnNvbGUubG9nKHNjb3JlX2FycmF5KTtcclxuXHJcblx0XHRmdW5jdGlvbiByZW1vdmVfZHVwbGljYXRlX2NvbW1lbnQoYXJyKXtcclxuXHRcdFx0bGV0IGNpZEFycmF5ID0gW107XHJcblx0XHRcdGxldCB0ZW1wID0gJyc7XHJcblx0XHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRcdGxldCBvYmogPSBpO1xyXG5cdFx0XHRcdGlmIChpLmNpZCA9PT0gdGVtcC5jaWQpe1xyXG5cdFx0XHRcdFx0bGV0IHRoaXNkYXRhID0gb2JqO1xyXG5cdFx0XHRcdFx0bGV0IGxhc3QgPSBjaWRBcnJheS5wb3AoKTtcclxuXHRcdFx0XHRcdGlmICh0aGlzZGF0YS5zY29yZSA+IGxhc3Quc2NvcmUpe1xyXG5cdFx0XHRcdFx0XHRsYXN0ID0gdGhpc2RhdGE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjaWRBcnJheS5wdXNoKGxhc3QpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dGVtcCA9IG9iajtcclxuXHRcdFx0XHRcdGNpZEFycmF5LnB1c2gob2JqKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGNpZEFycmF5O1xyXG5cdFx0fVxyXG5cdFx0bGV0IHNvcnRfYXJyYXkgPSByZW1vdmVfZHVwbGljYXRlX2NvbW1lbnQoc2NvcmVfYXJyYXkuc29ydCgoYSwgYikgPT4gYi5jaWQgLSBhLmNpZCkpO1xyXG5cdFx0ZGF0YS5tZXJnZURhdGEoc29ydF9hcnJheS5zb3J0KChhLCBiKSA9PiBiLnVzZXJpZCAtIGEudXNlcmlkKSk7XHJcblx0fSxcclxuXHRtZXJnZURhdGE6IChhcnIpPT57XHJcblx0XHRsZXQgZmluYWxBcnJheSA9IFtdO1xyXG5cdFx0bGV0IHRlbXAgPSAnJztcclxuXHRcdGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHRsZXQgb2JqID0gaTtcclxuXHRcdFx0aWYgKGkudXNlcmlkID09PSB0ZW1wLnVzZXJpZCl7XHJcblx0XHRcdFx0bGV0IHRoaXNkYXRhID0gb2JqO1xyXG5cdFx0XHRcdGxldCBsYXN0ID0gZmluYWxBcnJheS5wb3AoKTtcclxuXHRcdFx0XHRsYXN0LmlkLnB1c2godGhpc2RhdGEpO1xyXG5cdFx0XHRcdGxhc3QuY29tbWVudF9jb3VudCArPSBvYmouY29tbWVudF9jb3VudDtcclxuXHRcdFx0XHRsYXN0Lmxpa2VfY291bnQgKz0gb2JqLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0bGFzdC50YWdfY291bnQgKz0gb2JqLnRhZ19jb3VudDtcclxuXHRcdFx0XHRsYXN0LnNjb3JlICs9IG9iai5zY29yZTtcclxuXHRcdFx0XHRmaW5hbEFycmF5LnB1c2gobGFzdCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGxldCB0aGlzZGF0YSA9IHtcclxuXHRcdFx0XHRcdCdpZCc6IG9iai5pZCxcclxuXHRcdFx0XHRcdCdtZXNzYWdlJzogb2JqLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHQnbGlrZV9jb3VudCc6IG9iai5saWtlX2NvdW50LFxyXG5cdFx0XHRcdFx0J2NvbW1lbnRfY291bnQnOiBvYmouY29tbWVudF9jb3VudCxcclxuXHRcdFx0XHRcdCd0YWdfY291bnQnOiBvYmoudGFnX2NvdW50LFxyXG5cdFx0XHRcdFx0J3Njb3JlJzogb2JqLnNjb3JlXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRvYmouaWQgPSBbdGhpc2RhdGFdO1xyXG5cdFx0XHRcdHRlbXAgPSBvYmo7XHJcblx0XHRcdFx0ZmluYWxBcnJheS5wdXNoKG9iaik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGRhdGEuZmluYWxBcnJheSA9IGZpbmFsQXJyYXkuc29ydCgoYSwgYikgPT4gYi5zY29yZSAtIGEuc2NvcmUpO1xyXG5cdFx0ZGF0YS5maW5hbEFycmF5ID0gZGF0YS5maW5hbEFycmF5Lm1hcCgoaXRlbSk9PntcclxuXHRcdFx0aXRlbS5mcm9tID0ge1xyXG5cdFx0XHRcdFwiaWRcIjogaXRlbS51c2VyaWQsXHJcblx0XHRcdFx0XCJuYW1lXCI6IGl0ZW0udXNlcm5hbWVcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gaXRlbTtcclxuXHRcdH0pO1xyXG5cdFx0Y29uc29sZS5sb2coZGF0YS5maW5hbEFycmF5KTtcclxuXHRcdCQoJy5sb2FkaW5nJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHJcblx0XHRsb2NhbFN0b3JhZ2UucmFua2VyID0gSlNPTi5zdHJpbmdpZnkoZGF0YS5maW5hbEFycmF5KTtcclxuXHRcdCQoJ2FzaWRlJykuYWRkQ2xhc3MoJ2ZpbmlzaCcpO1xyXG5cclxuXHRcdHRhYmxlLmdlbmVyYXRlKGRhdGEuZmluYWxBcnJheSk7XHJcblx0XHRjaGFydC5kcmF3KGRhdGEuZmluYWxBcnJheSk7XHJcblx0fVxyXG59XHJcbmxldCBjaGFydCA9IHtcclxuXHRkcmF3OiAoZmluYWxBcnJheSk9PntcclxuXHRcdGQzLnNlbGVjdChcInN2Z1wiKS5yZW1vdmUoKTtcclxuXHRcdGxldCBhcnIgPSBbXTtcclxuXHRcdGxldCB3ID0gNzUwO1xyXG5cdFx0bGV0IGNvdW50ID0gMTA7XHJcblx0XHRpZiAoZmluYWxBcnJheS5sZW5ndGggPCBjb3VudCkgY291bnQgPSBmaW5hbEFycmF5Lmxlbmd0aDtcclxuXHRcdGZvcihsZXQgaT0wOyBpPGNvdW50OyBpKyspe1xyXG5cdFx0XHRmaW5hbEFycmF5W2ldLmluZGV4ID0gaTtcclxuXHRcdFx0YXJyLnB1c2goZmluYWxBcnJheVtpXSk7XHJcblx0XHR9XHJcblx0XHR2YXIgbWF4U2NvcmUgPSBkMy5tYXgoYXJyLCBmdW5jdGlvbihkKXtyZXR1cm4gZC5zY29yZX0pO1xyXG5cdFx0Y29uc29sZS5sb2cobWF4U2NvcmUpXHJcblx0XHR2YXIgeFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcclxuXHRcdFx0XHRcdCAgIC5kb21haW4oWzAsIG1heFNjb3JlXSlcclxuXHRcdFx0XHRcdCAgIC5yYW5nZShbMCwgdy04MF0pO1xyXG5cclxuXHRcdHZhciBjID0gZDMuc2VsZWN0KCcuY2hhcnQnKS5hcHBlbmQoJ3N2ZycpO1xyXG5cdFx0Yy5zZWxlY3RBbGwoJ3JlY3QnKVxyXG5cdFx0IC5kYXRhKGFycilcclxuXHRcdCAuZW50ZXIoKVxyXG5cdFx0IC5hcHBlbmQoJ3JlY3QnKVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCdmaWxsJzogJyNFMDk3MkEnLFxyXG5cdFx0IFx0J3dpZHRoJzogMCxcclxuXHRcdCBcdCdoZWlnaHQnOiAnMzAnLFxyXG5cdFx0IFx0J3gnOiBmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIDA7XHJcblx0XHQgXHR9LFxyXG5cdFx0IFx0J3knOiBmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIGQuaW5kZXggKiA0MFxyXG5cdFx0IFx0fVxyXG5cdFx0IH0pXHJcblx0XHQgLnRyYW5zaXRpb24oKVxyXG5cdFx0IC5kdXJhdGlvbigxNTAwKVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCd3aWR0aCc6ZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiB4U2NhbGUoZC5zY29yZSk7XHJcblx0XHQgXHR9XHJcblx0XHQgfSk7XHJcblx0XHQgYy5zZWxlY3RBbGwoJ3RleHQuc2NvcmUnKVxyXG5cdFx0IC5kYXRhKGFycilcclxuXHRcdCAuZW50ZXIoKVxyXG5cdFx0IC5hcHBlbmQoJ3RleHQnKVxyXG5cdFx0IC50ZXh0KGZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0cmV0dXJuIGQuc2NvcmUgKyAn5YiGJztcclxuXHRcdCB9KVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCdmaWxsJzonI2UwOTcyYScsXHJcblx0XHQgXHQneCc6IDAsXHJcblx0XHQgXHQneSc6ZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiBkLmluZGV4ICogNDAgKyAyMFxyXG5cdFx0IFx0fVxyXG5cdFx0IH0pXHJcblx0XHQgLnRyYW5zaXRpb24oKVxyXG5cdFx0IC5kdXJhdGlvbigxNTAwKVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCd4JzpmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIHhTY2FsZShkLnNjb3JlKSArIDQwO1xyXG5cdFx0IFx0fVxyXG5cdFx0IH0pO1xyXG5cdFx0IGMuc2VsZWN0QWxsKCd0ZXh0Lm5hbWUnKVxyXG5cdFx0IC5kYXRhKGFycilcclxuXHRcdCAuZW50ZXIoKVxyXG5cdFx0IC5hcHBlbmQoJ3RleHQnKVxyXG5cdFx0IC50ZXh0KGZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0cmV0dXJuIGQudXNlcm5hbWU7XHJcblx0XHQgfSlcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQnZmlsbCc6JyNGRkYnLFxyXG5cdFx0IFx0J3RleHQtYW5jaG9yJzogJ2VuZCcsXHJcblx0XHQgXHQneCc6IDAsXHJcblx0XHQgXHQneSc6ZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiBkLmluZGV4ICogNDAgKyAyMFxyXG5cdFx0IFx0fVxyXG5cdFx0IH0pXHJcblx0XHQgLnRyYW5zaXRpb24oKVxyXG5cdFx0IC5kdXJhdGlvbigxNTAwKVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCd4JzpmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIHhTY2FsZShkLnNjb3JlKSAtIDEwO1xyXG5cdFx0IFx0fVxyXG5cdFx0IH0pO1xyXG5cdFx0IGMuc2VsZWN0QWxsKCdpbWcnKVxyXG5cdFx0IC5kYXRhKGFycilcclxuXHRcdCAuZW50ZXIoKVxyXG5cdFx0IC5hcHBlbmQoJ3N2ZzppbWFnZScpXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J3hsaW5rOmhyZWYnOiBmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuICdodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLycrZC51c2VyaWQrJy9waWN0dXJlP3dpZHRoPTMwJmhlaWdodD0zMCdcclxuXHRcdCBcdH0sXHJcblx0XHQgXHQnd2lkdGgnOiAzMCxcclxuXHRcdCBcdCdoZWlnaHQnOiAzMCxcclxuXHRcdCBcdCd4JzogMCxcclxuXHRcdCBcdCd5JzpmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIGQuaW5kZXggKiA0MFxyXG5cdFx0IFx0fVxyXG5cdFx0IH0pXHJcblx0XHQgLnRyYW5zaXRpb24oKVxyXG5cdFx0IC5kdXJhdGlvbigxNTAwKVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCd4JzpmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIHhTY2FsZShkLnNjb3JlKTtcclxuXHRcdCBcdH1cclxuXHRcdCB9KTtcclxuXHR9XHJcbn1cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSk9PntcclxuXHRcdCQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoJy5yZXN1bHQgLmluZm8gLmFsbF9wZW9wbGUgc3BhbicpLnRleHQocmF3ZGF0YS5sZW5ndGgpO1xyXG5cdFx0JCgnLnJlc3VsdCAuaW5mbyAuZGF0ZV9yYW5nZSBzcGFuJykudGV4dChkYXRhLmRhdGVSYW5nZS5zdHJpbmcpO1xyXG5cdFx0bGV0IGNvdW50ID0gMTtcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHJhd2RhdGEpe1xyXG5cdFx0XHR0Ym9keSArPSBgPHRyPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+JHtjb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7aS51c2VyaWR9XCIgdGFyZ2V0PV9ibGFuaz4ke2kudXNlcm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZD4ke2kuc2NvcmV9PC90ZD48dGQ+PGJ1dHRvbiBvbmNsaWNrPVwicG9wdXAuc2hvdygnJHtpLnVzZXJpZH0nKVwiPuips+e0sOizh+ioijwvYnV0dG9uPjwvdGQ+XHJcblx0XHRcdFx0XHQgIDwvdHI+YDtcclxuXHRcdFx0Y291bnQrKztcclxuXHRcdH1cclxuXHRcdCQoXCIudGFibGVzIHRhYmxlIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keSk7XHJcblxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlZG86ICgpPT57XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcbmxldCBwb3B1cCA9IHtcclxuXHRzaG93OiAodGFyKT0+e1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgZGF0YS5maW5hbEFycmF5KXtcclxuXHRcdFx0aWYgKHRhciA9PSBpLnVzZXJpZCl7XHJcblx0XHRcdFx0bGV0IGNvdW50ID0gMTtcclxuXHRcdFx0XHQkKCcucG9wdXAgcCBzcGFuJykudGV4dChpLnVzZXJuYW1lKTtcclxuXHRcdFx0XHRmb3IobGV0IGogb2YgaS5pZCl7XHJcblx0XHRcdFx0XHRsZXQgbWVzc2FnZSA9IGoubWVzc2FnZTtcclxuXHRcdFx0XHRcdGlmIChtZXNzYWdlID09ICcnKSBtZXNzYWdlID0gJz09PT0954Sh5YWn5paHPT09PT0nO1xyXG5cdFx0XHRcdFx0dGJvZHkgKz0gYDx0cj5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7ai5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke21lc3NhZ2V9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLmNvbW1lbnRfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2oudGFnX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLmxpa2VfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2ouc2NvcmV9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHQgIDwvdHI+YDtcclxuXHRcdFx0XHRcdGNvdW50Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQoXCIucG9wdXAgdGFibGUgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnLnBvcHVwJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHR9LFxyXG5cdGhpZGU6ICgpPT57XHJcblx0XHQkKCcucG9wdXAnKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdH1cclxufVxyXG5cclxuIGZ1bmN0aW9uIG9iajJBcnJheShvYmope1xyXG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xyXG4gXHRcdHJldHVybiBbdmFsdWVdO1xyXG4gXHR9KTtcclxuIFx0cmV0dXJuIGFycmF5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuIFx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG4gXHR2YXIgaSwgciwgdDtcclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0YXJ5W2ldID0gaTtcclxuIFx0fVxyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcbiBcdFx0dCA9IGFyeVtyXTtcclxuIFx0XHRhcnlbcl0gPSBhcnlbaV07XHJcbiBcdFx0YXJ5W2ldID0gdDtcclxuIFx0fVxyXG4gXHRyZXR1cm4gYXJ5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG4gICAgLy9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuICAgIHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuICAgIFxyXG4gICAgdmFyIENTViA9ICcnOyAgICBcclxuICAgIC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG4gICAgXHJcbiAgICAvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG4gICAgaWYgKFNob3dMYWJlbCkge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgICAgICByb3cgKz0gaW5kZXggKyAnLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG4gICAgICAgICAgICByb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoQ1NWID09ICcnKSB7ICAgICAgICBcclxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9ICAgXHJcbiAgICBcclxuICAgIC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuICAgIGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZyxcIl9cIik7ICAgXHJcbiAgICBcclxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcbiAgICB2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG4gICAgXHJcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuICAgIC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcbiAgICAvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcbiAgICBcclxuICAgIC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxyXG4gICAgbGluay5ocmVmID0gdXJpO1xyXG4gICAgXHJcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG4gICAgbGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG4gICAgXHJcbiAgICAvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgIGxpbmsuY2xpY2soKTtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXX0=
