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
	extension: false
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
		fb.feed(tar.val(), type, fb.next);
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
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					var _loop = function _loop() {
						var j = _step3.value;

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

					for (var _iterator3 = fb.feeds[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						_loop();
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
			FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/comments?" + data.dateRange.range + "&order=chronological&fields=" + config.field[command].toString(), function (res) {
				data.nowLength += res.data.length;
				$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
				// console.log(res);
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = res.data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var d = _step4.value;

						if (!d.is_hidden) {
							d.cid = d.from.id + '_' + d.id.substr(0, d.id.indexOf('_'));
							datas.push(d);
						}
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
					var _iteratorNormalCompletion5 = true;
					var _didIteratorError5 = false;
					var _iteratorError5 = undefined;

					try {
						for (var _iterator5 = res.data[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
							var d = _step5.value;

							datas.push(d);
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
		var _iteratorNormalCompletion6 = true;
		var _didIteratorError6 = false;
		var _iteratorError6 = undefined;

		try {
			for (var _iterator6 = all[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
				var i = _step6.value;

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
				var _iteratorNormalCompletion8 = true;
				var _didIteratorError8 = false;
				var _iteratorError8 = undefined;

				try {
					for (var _iterator8 = arr[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
						var j = _step8.value;

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
			}
			// console.log(score_array);
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

		function remove_duplicate_comment(arr) {
			var cidArray = [];
			var temp = '';
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = arr[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var i = _step7.value;

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
		var _iteratorNormalCompletion9 = true;
		var _didIteratorError9 = false;
		var _iteratorError9 = undefined;

		try {
			for (var _iterator9 = arr[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
				var i = _step9.value;

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
		var _iteratorNormalCompletion10 = true;
		var _didIteratorError10 = false;
		var _iteratorError10 = undefined;

		try {
			for (var _iterator10 = rawdata[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
				var i = _step10.value;

				tbody += "<tr>\n\t\t\t\t\t\t<td>" + count + "</td>\n\t\t\t\t\t\t<td><a href=\"http://www.facebook.com/" + i.userid + "\" target=_blank>" + i.username + "</a></td>\n\t\t\t\t\t\t<td>" + i.score + "</td><td><button onclick=\"popup.show('" + i.userid + "')\">\u8A73\u7D30\u8CC7\u8A0A</button></td>\n\t\t\t\t\t  </tr>";
				count++;
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
		var _iteratorNormalCompletion11 = true;
		var _didIteratorError11 = false;
		var _iteratorError11 = undefined;

		try {
			for (var _iterator11 = data.finalArray[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
				var i = _step11.value;

				if (tar == i.userid) {
					var count = 1;
					$('.popup p span').text(i.username);
					var _iteratorNormalCompletion12 = true;
					var _didIteratorError12 = false;
					var _iteratorError12 = undefined;

					try {
						for (var _iterator12 = i.id[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
							var j = _step12.value;

							var message = j.message;
							if (message == '') message = '=====無內文=====';
							tbody += "<tr>\n\t\t\t\t\t\t\t\t<td>" + count + "</td>\n\t\t\t\t\t\t\t\t<td><a href=\"http://www.facebook.com/" + j.id + "\" target=\"_blank\">" + message + "</a></td>\n\t\t\t\t\t\t\t\t<td>" + j.comment_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.tag_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.like_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.score + "</td>\n\t\t\t\t\t\t\t  </tr>";
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

					$(".popup table tbody").html('').append(tbody);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImNvbmZpZyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsImF1dGgiLCJleHRlbnNpb24iLCJmYiIsIm5leHQiLCJmZWVkcyIsImdldEF1dGgiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzdGFydCIsInN3YWwiLCJkb25lIiwiZmJpZCIsImluaXQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0TWUiLCJnZXRQYWdlIiwiZ2V0R3JvdXAiLCJ0aGVuIiwicmVzIiwic2Vzc2lvblN0b3JhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2VuT3B0aW9uIiwib3B0aW9ucyIsImFkZENsYXNzIiwiaSIsImoiLCJpZCIsIm5hbWUiLCJhcHBlbmQiLCJzZWxlY3QyIiwic2VsZWN0UGFnZSIsInRhciIsImZpbmQiLCJhdHRyIiwidmFsIiwicGFnZUlEIiwiY2xlYXIiLCJjb21tYW5kIiwiYXBpIiwiZGF0YSIsInJlc29sdmUiLCJyZWplY3QiLCJhcnIiLCJnZXROYW1lIiwiaWRzIiwidG9TdHJpbmciLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJwcm9taXNlX2FycmF5IiwiZmluYWxBcnJheSIsImRhdGVSYW5nZSIsInRleHQiLCJyYXciLCJkYXRlQ2hlY2siLCJwaWNrYWRhdGUiLCJnZXQiLCJlbmQiLCJtZXNzYWdlIiwiZDEiLCJEYXRlIiwicGljayIsImQyIiwidGVtcCIsInJhbmdlIiwiY2hlY2siLCJvYmoiLCJmdWxsSUQiLCJwcm9taXNlIiwicHVzaCIsImNvdW50X3Njb3JlIiwiYWxlcnQiLCJkYXRhcyIsImxlbmd0aCIsImQiLCJpc19oaWRkZW4iLCJjaWQiLCJmcm9tIiwic3Vic3RyIiwicGFnaW5nIiwiZ2V0TmV4dCIsInJlcGxhY2UiLCJnZXRKU09OIiwiZmFpbCIsInNjb3JlX2FycmF5Iiwic2NvcmVfcnVsZSIsInNjb3JlIiwiY29tbWVudF9jb3VudCIsImNvbW1lbnRzX21heCIsInVzZXIiLCJsaWtlX2NvdW50IiwicmVhY3Rpb25zX21heCIsIk1hdGgiLCJjZWlsIiwibWVzc2FnZV90YWdzIiwidGFnX2NvdW50IiwidGFnIiwidGFnX21heCIsInJlbW92ZV9kdXBsaWNhdGVfY29tbWVudCIsImNpZEFycmF5IiwidGhpc2RhdGEiLCJsYXN0IiwicG9wIiwic29ydF9hcnJheSIsInNvcnQiLCJhIiwiYiIsIm1lcmdlRGF0YSIsIm1hcCIsIml0ZW0iLCJ1c2VybmFtZSIsInJlbW92ZUNsYXNzIiwibG9jYWxTdG9yYWdlIiwicmFua2VyIiwidGFibGUiLCJnZW5lcmF0ZSIsImNoYXJ0IiwiZHJhdyIsImQzIiwic2VsZWN0IiwicmVtb3ZlIiwidyIsImNvdW50IiwiaW5kZXgiLCJtYXhTY29yZSIsIm1heCIsInhTY2FsZSIsInNjYWxlIiwibGluZWFyIiwiZG9tYWluIiwiYyIsInNlbGVjdEFsbCIsImVudGVyIiwidHJhbnNpdGlvbiIsImR1cmF0aW9uIiwicmF3ZGF0YSIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJzdHJpbmciLCJ0Ym9keSIsImh0bWwiLCJhY3RpdmUiLCJyZWRvIiwiZmlsdGVyIiwicG9wdXAiLCJzaG93IiwiaGlkZSIsIm9iajJBcnJheSIsImFycmF5IiwidmFsdWUiLCJnZW5SYW5kb21BcnJheSIsIm4iLCJhcnkiLCJBcnJheSIsInIiLCJ0IiwiZmxvb3IiLCJyYW5kb20iLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsInBhcnNlIiwiQ1NWIiwicm93Iiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImxpbmsiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNsaWNrIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0FDLE9BQU9DLE9BQVAsR0FBZUMsU0FBZjs7QUFFQSxTQUFTQSxTQUFULENBQW1CQyxHQUFuQixFQUF1QkMsR0FBdkIsRUFBMkJDLENBQTNCLEVBQ0E7QUFDQyxLQUFJLENBQUNOLFlBQUwsRUFBa0I7QUFDakJPLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUMsSUFBRSxpQkFBRixFQUFxQkMsTUFBckI7QUFDQVYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7O0FBRUQsSUFBSVcsU0FBUztBQUNaQyxRQUFPO0FBQ05DLFlBQVUsQ0FBQyxNQUFELEVBQVEsWUFBUixFQUFxQixlQUFyQixFQUFxQyxXQUFyQyxFQUFpRCxXQUFqRCxFQUE2RCxTQUE3RCxFQUF1RSxjQUF2RSxDQURKO0FBRU5DLGFBQVcsRUFGTDtBQUdOQyxlQUFhLENBQUMsT0FBRCxFQUFTLE1BQVQsRUFBaUIsY0FBakIsQ0FIUDtBQUlOQyxnQkFBYyxFQUpSO0FBS05DLFFBQU07QUFMQSxFQURLO0FBUVpDLFFBQU87QUFDTkwsWUFBVSxLQURKO0FBRU5DLGFBQVcsS0FGTDtBQUdOQyxlQUFhLEtBSFA7QUFJTkMsZ0JBQWMsS0FKUjtBQUtOQyxRQUFNO0FBTEEsRUFSSztBQWVaRSxhQUFZO0FBQ1hOLFlBQVUsTUFEQztBQUVYQyxhQUFXLE1BRkE7QUFHWEMsZUFBYSxNQUhGO0FBSVhDLGdCQUFjLE1BSkg7QUFLWEMsUUFBTSxNQUxLO0FBTVhHLFNBQU8sTUFOSTtB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QUFkLENBQTBCUCxJQUExQjtBQUNBQSxNQUFLUSxLQUFMO0FBQ0FQLFVBQVNLLElBQVQsQ0FBY0csV0FBZCxDQUEwQlQsSUFBMUI7QUFDSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvcj1oYW5kbGVFcnJcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXHJcbntcclxuXHRpZiAoIWVycm9yTWVzc2FnZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2Zyb20nLCdsaWtlX2NvdW50JywnY29tbWVudF9jb3VudCcsJ3JlYWN0aW9ucycsJ2lzX2hpZGRlbicsJ21lc3NhZ2UnLCdtZXNzYWdlX3RhZ3MnXSxcclxuXHRcdHJlYWN0aW9uczogW10sXHJcblx0XHRzaGFyZWRwb3N0czogWydzdG9yeScsJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogW11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3YyLjcnLFxyXG5cdFx0cmVhY3Rpb25zOiAndjIuNycsXHJcblx0XHRzaGFyZWRwb3N0czogJ3YyLjMnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjIuNycsXHJcblx0XHRmZWVkOiAndjIuMycsXHJcblx0XHRncm91cDogJ3YyLjcnLFxyXG5cdFx0bmV3ZXN0OiAndjIuOCdcclxuXHR9LFxyXG5cdGF1dGg6ICd1c2VyX3Bob3Rvcyx1c2VyX3Bvc3RzLHVzZXJfbWFuYWdlZF9ncm91cHMsbWFuYWdlX3BhZ2VzJyxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0bmV4dDogJycsXHJcblx0ZmVlZHM6IFtdLFxyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX21hbmFnZWRfZ3JvdXBzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcclxuXHRcdFx0XHRcdGZiLnN0YXJ0KCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5o6I5qyK5aSx5pWX77yM6KuL57Wm5LqI5omA5pyJ5qyK6ZmQJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRzdGFydDogKCk9PntcclxuXHRcdFByb21pc2UuYWxsKFtmYi5nZXRNZSgpLGZiLmdldFBhZ2UoKSwgZmIuZ2V0R3JvdXAoKV0pLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0c2Vzc2lvblN0b3JhZ2UubG9naW4gPSBKU09OLnN0cmluZ2lmeShyZXMpO1xyXG5cdFx0XHRmYi5nZW5PcHRpb24ocmVzKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2VuT3B0aW9uOiAocmVzKT0+e1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IG9wdGlvbnMgPSAnJztcclxuXHRcdGxldCB0eXBlID0gLTE7XHJcblx0XHQkKCdhc2lkZScpLmFkZENsYXNzKCdsb2dpbicpO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHJlcyl7XHJcblx0XHRcdHR5cGUrKztcclxuXHRcdFx0Zm9yKGxldCBqIG9mIGkpe1xyXG5cdFx0XHRcdG9wdGlvbnMgKz0gYDxvcHRpb24gYXR0ci10eXBlPVwiJHt0eXBlfVwiIHZhbHVlPVwiJHtqLmlkfVwiPiR7ai5uYW1lfTwvb3B0aW9uPmA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJ2FzaWRlIC5zdGVwMSBzZWxlY3QnKS5hcHBlbmQob3B0aW9ucyk7XHJcblx0XHQkKCdhc2lkZSBzZWxlY3QnKS5zZWxlY3QyKCk7XHJcblx0XHQvLyAkKCdhc2lkZSBzZWxlY3QnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHQvLyBcdGxldCB0eXBlID0gJCh0aGlzKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdC8vIFx0ZmIuc2VsZWN0UGFnZShldmVudC50YXJnZXQudmFsdWUsIHR5cGUpO1xyXG5cdFx0Ly8gfSk7XHJcblx0fSxcclxuXHRzZWxlY3RQYWdlOiAoKT0+e1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IHRhciA9ICQoJ2FzaWRlIHNlbGVjdCcpO1xyXG5cdFx0bGV0IHR5cGUgPSB0YXIuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuYXR0cignYXR0ci10eXBlJyk7XHJcblx0XHRmYi5mZWVkKHRhci52YWwoKSwgdHlwZSwgZmIubmV4dCk7XHJcblx0fSxcclxuXHRmZWVkOiAocGFnZUlELCB0eXBlLCB1cmwgPSAnJywgY2xlYXIgPSB0cnVlKT0+e1xyXG5cdFx0bGV0IGNvbW1hbmQgPSAodHlwZSA9PSAnMicpID8gJ2ZlZWQnOidwb3N0cyc7XHJcblx0XHRsZXQgYXBpO1xyXG5cdFx0Ly8xNDY4NDY2OTkwMDk3NjIzXHJcblx0XHRpZiAodXJsID09ICcnKXtcclxuXHRcdFx0YXBpID0gYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8ke3BhZ2VJRH0vJHtjb21tYW5kfT9maWVsZHM9bGluayxmdWxsX3BpY3R1cmUsY3JlYXRlZF90aW1lLG1lc3NhZ2UmbGltaXQ9NTBgO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGFwaSA9IHVybDtcclxuXHRcdH1cclxuXHRcdEZCLmFwaShhcGksZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0ZmIuZmVlZHMgPSByZXMuZGF0YTtcclxuXHRcdFx0ZGF0YS5zdGFydCgpO1xyXG5cdFx0fSlcclxuXHR9LFxyXG5cdGdldE1lOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lYCwgKHJlcyk9PntcclxuXHRcdFx0XHRsZXQgYXJyID0gW3Jlc107XHJcblx0XHRcdFx0cmVzb2x2ZShhcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0UGFnZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0R3JvdXA6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvZ3JvdXBzP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXROYW1lOiAoaWRzKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9Lz9pZHM9JHtpZHMudG9TdHJpbmcoKX1gLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0cHJvbWlzZV9hcnJheTogW10sXHJcblx0ZmluYWxBcnJheTogW10sXHJcblx0ZGF0ZVJhbmdlOiB7fSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0ZGF0YS5wcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdH0sXHJcblx0ZGF0ZUNoZWNrOiAoKT0+e1xyXG5cdFx0bGV0IHN0YXJ0ID0gJCgnI3N0YXJ0X2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXktbW0tZGQnKTtcclxuXHRcdGxldCBlbmQgPSAkKCcjZW5kX2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXktbW0tZGQnKTtcclxuXHRcdGxldCBtZXNzYWdlID0gJyc7XHJcblx0XHRpZiAoc3RhcnQgPT0gJycgfHwgZW5kID09ICcnKXtcclxuXHRcdFx0bWVzc2FnZSA9ICfoq4vpgbjmk4fml6XmnJ8nO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxldCBkMSA9IG5ldyBEYXRlKCQoJyNzdGFydF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcpLnBpY2spO1xyXG5cdFx0XHRsZXQgZDIgPSBuZXcgRGF0ZSgkKCcjZW5kX2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JykucGljayk7XHJcblx0XHRcdGlmIChkMi1kMSA+IDUxODQwMDAwMDApe1xyXG5cdFx0XHRcdG1lc3NhZ2UgPSAn5pel5pyf5Y2A6ZaT5LiN6IO96LaF6YGONjDlpKknO1xyXG5cdFx0XHR9ZWxzZSBpZiAoZDI8ZDEpe1xyXG5cdFx0XHRcdGxldCB0ZW1wID0gc3RhcnQ7XHJcblx0XHRcdFx0c3RhcnQgPSBlbmQ7XHJcblx0XHRcdFx0ZW5kID0gdGVtcDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKG1lc3NhZ2UgPT0gJycpe1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdCdjaGVjayc6IHRydWUsXHJcblx0XHRcdFx0J3JhbmdlJzogYHNpbmNlPSR7c3RhcnR9JnVudGlsPSR7ZW5kfWAsXHJcblx0XHRcdFx0J3N0cmluZyc6ICQoJyNzdGFydF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5L21tL2RkJykgKyBcIiB+IFwiICsgJCgnI2VuZF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5L21tL2RkJylcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0J2NoZWNrJzogZmFsc2UsXHJcblx0XHRcdFx0J21lc3NhZ2UnOiBtZXNzYWdlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoKT0+e1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRsZXQgcmFuZ2UgPSBkYXRhLmRhdGVDaGVjaygpO1xyXG5cdFx0aWYgKHJhbmdlLmNoZWNrID09PSB0cnVlKXtcclxuXHRcdFx0ZGF0YS5kYXRlUmFuZ2UgPSByYW5nZTtcclxuXHRcdFx0bGV0IGFsbCA9IFtdO1xyXG5cdFx0XHRmb3IobGV0IGogb2YgZmIuZmVlZHMpe1xyXG5cdFx0XHRcdGxldCBvYmogPSB7XHJcblx0XHRcdFx0XHRmdWxsSUQ6IGouaWQsXHJcblx0XHRcdFx0XHRvYmo6IHt9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBwcm9taXNlID0gZGF0YS5nZXQob2JqKS50aGVuKChyZXMpPT57XHJcblx0XHRcdFx0XHRvYmouZGF0YSA9IHJlcztcclxuXHRcdFx0XHRcdGFsbC5wdXNoKG9iaik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0ZGF0YS5wcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnLmxvYWRpbmcnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdFx0XHRQcm9taXNlLmFsbChkYXRhLnByb21pc2VfYXJyYXkpLnRoZW4oKCk9PntcclxuXHRcdFx0XHRkYXRhLmNvdW50X3Njb3JlKGFsbCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGFsZXJ0KHJhbmdlLm1lc3NhZ2UpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IGNvbW1hbmQgPSAnY29tbWVudHMnO1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9L2NvbW1lbnRzPyR7ZGF0YS5kYXRlUmFuZ2UucmFuZ2V9Jm9yZGVyPWNocm9ub2xvZ2ljYWwmZmllbGRzPSR7Y29uZmlnLmZpZWxkW2NvbW1hbmRdLnRvU3RyaW5nKCl9YCwocmVzKT0+e1xyXG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhyZXMpO1xyXG5cdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRpZiAoIWQuaXNfaGlkZGVuKXtcclxuXHRcdFx0XHRcdFx0ZC5jaWQgPSBkLmZyb20uaWQgKyAnXycgKyBkLmlkLnN1YnN0cigwLCBkLmlkLmluZGV4T2YoJ18nKSk7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0PTApe1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCl7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywnbGltaXQ9JytsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y291bnRfc2NvcmU6IChhbGwpPT57XHJcblx0XHQvKlxyXG5cdFx0XHTnlZnoqIAz5YiG44CBVEFH5LiA5YCLMeWIhu+8jOacgOWkmjPliIZcclxuXHRcdFx055WZ6KiA5b+D5oOFMuWAizHliIbvvIznhKHmop3ku7bpgLLkvY3vvIzmnIDlpJoxM+WIhlxyXG5cdFx0XHTnlZnoqIDnmoTnlZnoqIDkuIDlgIsx5YiG77yM5pyA5aSnNuWIhlxyXG5cdFx0Ki9cclxuXHRcdGxldCBzY29yZV9hcnJheSA9IFtdO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGFsbCl7XHJcblx0XHRcdGxldCBhcnIgPSBpLmRhdGE7XHJcblx0XHRcdGxldCBzY29yZV9ydWxlID0ge1xyXG5cdFx0XHRcdCdjb21tZW50cyc6IDEsXHJcblx0XHRcdFx0J2NvbW1lbnRzX21heCc6IDYsXHJcblx0XHRcdFx0J3JlYWN0aW9ucyc6IDAuNSxcclxuXHRcdFx0XHQncmVhY3Rpb25zX21heCc6IDEzLFxyXG5cdFx0XHRcdCd0YWcnOiAxLFxyXG5cdFx0XHRcdCd0YWdfbWF4JzogM1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBzY29yZTtcclxuXHRcdFx0Zm9yKGxldCBqIG9mIGFycil7XHJcblx0XHRcdFx0c2NvcmUgPSAzO1xyXG5cdFx0XHRcdHNjb3JlICs9IChqLmNvbW1lbnRfY291bnQqc2NvcmVfcnVsZS5jb21tZW50cyA+IHNjb3JlX3J1bGUuY29tbWVudHNfbWF4KSA/IHNjb3JlX3J1bGUuY29tbWVudHNfbWF4IDogai5jb21tZW50X2NvdW50KnNjb3JlX3J1bGUuY29tbWVudHM7XHJcblx0XHRcdFx0bGV0IHVzZXIgPSB7XHJcblx0XHRcdFx0XHQnaWQnOiBqLmlkLFxyXG5cdFx0XHRcdFx0J3VzZXJpZCc6IGouZnJvbS5pZCxcclxuXHRcdFx0XHRcdCd1c2VybmFtZSc6IGouZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0J2NvbW1lbnRfY291bnQnOiBqLmNvbW1lbnRfY291bnQsXHJcblx0XHRcdFx0XHQnbWVzc2FnZSc6IGoubWVzc2FnZSxcclxuXHRcdFx0XHRcdCdjaWQnOiBqLmNpZFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYgKGoucmVhY3Rpb25zKXtcclxuXHRcdFx0XHRcdGlmIChqLnJlYWN0aW9ucy5kYXRhLmxlbmd0aCA9PT0gMjUpe1xyXG5cdFx0XHRcdFx0XHR1c2VyLmxpa2VfY291bnQgPSBqLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0XHRcdHNjb3JlICs9IHNjb3JlX3J1bGUucmVhY3Rpb25zX21heDtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHR1c2VyLmxpa2VfY291bnQgPSBqLnJlYWN0aW9ucy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdFx0c2NvcmUgKz0gTWF0aC5jZWlsKGoucmVhY3Rpb25zLmRhdGEubGVuZ3RoKnNjb3JlX3J1bGUucmVhY3Rpb25zKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHVzZXIubGlrZV9jb3VudCA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChqLm1lc3NhZ2VfdGFncyl7XHJcblx0XHRcdFx0XHR1c2VyLnRhZ19jb3VudCA9IGoubWVzc2FnZV90YWdzLmxlbmd0aFxyXG5cdFx0XHRcdFx0c2NvcmUgKz0gIChqLm1lc3NhZ2VfdGFncy5sZW5ndGggKiBzY29yZV9ydWxlLnRhZyA+PSBzY29yZV9ydWxlLnRhZ19tYXgpID8gc2NvcmVfcnVsZS50YWdfbWF4IDogai5tZXNzYWdlX3RhZ3MubGVuZ3RoICogc2NvcmVfcnVsZS50YWc7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR1c2VyLnRhZ19jb3VudCA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHVzZXIuc2NvcmUgPSBzY29yZTtcclxuXHRcdFx0XHRzY29yZV9hcnJheS5wdXNoKHVzZXIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBjb25zb2xlLmxvZyhzY29yZV9hcnJheSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gcmVtb3ZlX2R1cGxpY2F0ZV9jb21tZW50KGFycil7XHJcblx0XHRcdGxldCBjaWRBcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgdGVtcCA9ICcnO1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0XHRsZXQgb2JqID0gaTtcclxuXHRcdFx0XHRpZiAoaS5jaWQgPT09IHRlbXAuY2lkKXtcclxuXHRcdFx0XHRcdGxldCB0aGlzZGF0YSA9IG9iajtcclxuXHRcdFx0XHRcdGxldCBsYXN0ID0gY2lkQXJyYXkucG9wKCk7XHJcblx0XHRcdFx0XHRpZiAodGhpc2RhdGEuc2NvcmUgPiBsYXN0LnNjb3JlKXtcclxuXHRcdFx0XHRcdFx0bGFzdCA9IHRoaXNkYXRhO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2lkQXJyYXkucHVzaChsYXN0KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRlbXAgPSBvYmo7XHJcblx0XHRcdFx0XHRjaWRBcnJheS5wdXNoKG9iaik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBjaWRBcnJheTtcclxuXHRcdH1cclxuXHRcdGxldCBzb3J0X2FycmF5ID0gcmVtb3ZlX2R1cGxpY2F0ZV9jb21tZW50KHNjb3JlX2FycmF5LnNvcnQoKGEsIGIpID0+IGIuY2lkIC0gYS5jaWQpKTtcclxuXHRcdGRhdGEubWVyZ2VEYXRhKHNvcnRfYXJyYXkuc29ydCgoYSwgYikgPT4gYi51c2VyaWQgLSBhLnVzZXJpZCkpO1xyXG5cdH0sXHJcblx0bWVyZ2VEYXRhOiAoYXJyKT0+e1xyXG5cdFx0bGV0IGZpbmFsQXJyYXkgPSBbXTtcclxuXHRcdGxldCB0ZW1wID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0bGV0IG9iaiA9IGk7XHJcblx0XHRcdGlmIChpLnVzZXJpZCA9PT0gdGVtcC51c2VyaWQpe1xyXG5cdFx0XHRcdGxldCB0aGlzZGF0YSA9IG9iajtcclxuXHRcdFx0XHRsZXQgbGFzdCA9IGZpbmFsQXJyYXkucG9wKCk7XHJcblx0XHRcdFx0bGFzdC5pZC5wdXNoKHRoaXNkYXRhKTtcclxuXHRcdFx0XHRsYXN0LmNvbW1lbnRfY291bnQgKz0gb2JqLmNvbW1lbnRfY291bnQ7XHJcblx0XHRcdFx0bGFzdC5saWtlX2NvdW50ICs9IG9iai5saWtlX2NvdW50O1xyXG5cdFx0XHRcdGxhc3QudGFnX2NvdW50ICs9IG9iai50YWdfY291bnQ7XHJcblx0XHRcdFx0bGFzdC5zY29yZSArPSBvYmouc2NvcmU7XHJcblx0XHRcdFx0ZmluYWxBcnJheS5wdXNoKGxhc3QpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgdGhpc2RhdGEgPSB7XHJcblx0XHRcdFx0XHQnaWQnOiBvYmouaWQsXHJcblx0XHRcdFx0XHQnbWVzc2FnZSc6IG9iai5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0J2xpa2VfY291bnQnOiBvYmoubGlrZV9jb3VudCxcclxuXHRcdFx0XHRcdCdjb21tZW50X2NvdW50Jzogb2JqLmNvbW1lbnRfY291bnQsXHJcblx0XHRcdFx0XHQndGFnX2NvdW50Jzogb2JqLnRhZ19jb3VudCxcclxuXHRcdFx0XHRcdCdzY29yZSc6IG9iai5zY29yZVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0b2JqLmlkID0gW3RoaXNkYXRhXTtcclxuXHRcdFx0XHR0ZW1wID0gb2JqO1xyXG5cdFx0XHRcdGZpbmFsQXJyYXkucHVzaChvYmopO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRkYXRhLmZpbmFsQXJyYXkgPSBmaW5hbEFycmF5LnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKTtcclxuXHRcdGRhdGEuZmluYWxBcnJheSA9IGRhdGEuZmluYWxBcnJheS5tYXAoKGl0ZW0pPT57XHJcblx0XHRcdGl0ZW0uZnJvbSA9IHtcclxuXHRcdFx0XHRcImlkXCI6IGl0ZW0udXNlcmlkLFxyXG5cdFx0XHRcdFwibmFtZVwiOiBpdGVtLnVzZXJuYW1lXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHR9KTtcclxuXHRcdGNvbnNvbGUubG9nKGRhdGEuZmluYWxBcnJheSk7XHJcblx0XHQkKCcubG9hZGluZycpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblxyXG5cdFx0bG9jYWxTdG9yYWdlLnJhbmtlciA9IEpTT04uc3RyaW5naWZ5KGRhdGEuZmluYWxBcnJheSk7XHJcblx0XHQkKCdhc2lkZScpLmFkZENsYXNzKCdmaW5pc2gnKTtcclxuXHJcblx0XHR0YWJsZS5nZW5lcmF0ZShkYXRhLmZpbmFsQXJyYXkpO1xyXG5cdFx0Y2hhcnQuZHJhdyhkYXRhLmZpbmFsQXJyYXkpO1xyXG5cdH1cclxufVxyXG5sZXQgY2hhcnQgPSB7XHJcblx0ZHJhdzogKGZpbmFsQXJyYXkpPT57XHJcblx0XHRkMy5zZWxlY3QoXCJzdmdcIikucmVtb3ZlKCk7XHJcblx0XHRsZXQgYXJyID0gW107XHJcblx0XHRsZXQgdyA9IDc1MDtcclxuXHRcdGxldCBjb3VudCA9IDEwO1xyXG5cdFx0aWYgKGZpbmFsQXJyYXkubGVuZ3RoIDwgY291bnQpIGNvdW50ID0gZmluYWxBcnJheS5sZW5ndGg7XHJcblx0XHRmb3IobGV0IGk9MDsgaTxjb3VudDsgaSsrKXtcclxuXHRcdFx0ZmluYWxBcnJheVtpXS5pbmRleCA9IGk7XHJcblx0XHRcdGFyci5wdXNoKGZpbmFsQXJyYXlbaV0pO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG1heFNjb3JlID0gZDMubWF4KGFyciwgZnVuY3Rpb24oZCl7cmV0dXJuIGQuc2NvcmV9KTtcclxuXHRcdGNvbnNvbGUubG9nKG1heFNjb3JlKVxyXG5cdFx0dmFyIHhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXHJcblx0XHRcdFx0XHQgICAuZG9tYWluKFswLCBtYXhTY29yZV0pXHJcblx0XHRcdFx0XHQgICAucmFuZ2UoWzAsIHctODBdKTtcclxuXHJcblx0XHR2YXIgYyA9IGQzLnNlbGVjdCgnLmNoYXJ0JykuYXBwZW5kKCdzdmcnKTtcclxuXHRcdGMuc2VsZWN0QWxsKCdyZWN0JylcclxuXHRcdCAuZGF0YShhcnIpXHJcblx0XHQgLmVudGVyKClcclxuXHRcdCAuYXBwZW5kKCdyZWN0JylcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQnZmlsbCc6ICcjRTA5NzJBJyxcclxuXHRcdCBcdCd3aWR0aCc6IDAsXHJcblx0XHQgXHQnaGVpZ2h0JzogJzMwJyxcclxuXHRcdCBcdCd4JzogZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiAwO1xyXG5cdFx0IFx0fSxcclxuXHRcdCBcdCd5JzogZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiBkLmluZGV4ICogNDBcclxuXHRcdCBcdH1cclxuXHRcdCB9KVxyXG5cdFx0IC50cmFuc2l0aW9uKClcclxuXHRcdCAuZHVyYXRpb24oMTUwMClcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQnd2lkdGgnOmZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4geFNjYWxlKGQuc2NvcmUpO1xyXG5cdFx0IFx0fVxyXG5cdFx0IH0pO1xyXG5cdFx0IGMuc2VsZWN0QWxsKCd0ZXh0LnNjb3JlJylcclxuXHRcdCAuZGF0YShhcnIpXHJcblx0XHQgLmVudGVyKClcclxuXHRcdCAuYXBwZW5kKCd0ZXh0JylcclxuXHRcdCAudGV4dChmdW5jdGlvbihkKXtcclxuXHRcdCBcdHJldHVybiBkLnNjb3JlICsgJ+WIhic7XHJcblx0XHQgfSlcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQnZmlsbCc6JyNlMDk3MmEnLFxyXG5cdFx0IFx0J3gnOiAwLFxyXG5cdFx0IFx0J3knOmZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4gZC5pbmRleCAqIDQwICsgMjBcclxuXHRcdCBcdH1cclxuXHRcdCB9KVxyXG5cdFx0IC50cmFuc2l0aW9uKClcclxuXHRcdCAuZHVyYXRpb24oMTUwMClcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQneCc6ZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiB4U2NhbGUoZC5zY29yZSkgKyA0MDtcclxuXHRcdCBcdH1cclxuXHRcdCB9KTtcclxuXHRcdCBjLnNlbGVjdEFsbCgndGV4dC5uYW1lJylcclxuXHRcdCAuZGF0YShhcnIpXHJcblx0XHQgLmVudGVyKClcclxuXHRcdCAuYXBwZW5kKCd0ZXh0JylcclxuXHRcdCAudGV4dChmdW5jdGlvbihkKXtcclxuXHRcdCBcdHJldHVybiBkLnVzZXJuYW1lO1xyXG5cdFx0IH0pXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J2ZpbGwnOicjRkZGJyxcclxuXHRcdCBcdCd0ZXh0LWFuY2hvcic6ICdlbmQnLFxyXG5cdFx0IFx0J3gnOiAwLFxyXG5cdFx0IFx0J3knOmZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4gZC5pbmRleCAqIDQwICsgMjBcclxuXHRcdCBcdH1cclxuXHRcdCB9KVxyXG5cdFx0IC50cmFuc2l0aW9uKClcclxuXHRcdCAuZHVyYXRpb24oMTUwMClcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQneCc6ZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiB4U2NhbGUoZC5zY29yZSkgLSAxMDtcclxuXHRcdCBcdH1cclxuXHRcdCB9KTtcclxuXHRcdCBjLnNlbGVjdEFsbCgnaW1nJylcclxuXHRcdCAuZGF0YShhcnIpXHJcblx0XHQgLmVudGVyKClcclxuXHRcdCAuYXBwZW5kKCdzdmc6aW1hZ2UnKVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCd4bGluazpocmVmJzogZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiAnaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8nK2QudXNlcmlkKycvcGljdHVyZT93aWR0aD0zMCZoZWlnaHQ9MzAnXHJcblx0XHQgXHR9LFxyXG5cdFx0IFx0J3dpZHRoJzogMzAsXHJcblx0XHQgXHQnaGVpZ2h0JzogMzAsXHJcblx0XHQgXHQneCc6IDAsXHJcblx0XHQgXHQneSc6ZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiBkLmluZGV4ICogNDBcclxuXHRcdCBcdH1cclxuXHRcdCB9KVxyXG5cdFx0IC50cmFuc2l0aW9uKClcclxuXHRcdCAuZHVyYXRpb24oMTUwMClcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQneCc6ZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRcdHJldHVybiB4U2NhbGUoZC5zY29yZSk7XHJcblx0XHQgXHR9XHJcblx0XHQgfSk7XHJcblx0fVxyXG59XHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKHJhd2RhdGEpPT57XHJcblx0XHQkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKCcucmVzdWx0IC5pbmZvIC5hbGxfcGVvcGxlIHNwYW4nKS50ZXh0KHJhd2RhdGEubGVuZ3RoKTtcclxuXHRcdCQoJy5yZXN1bHQgLmluZm8gLmRhdGVfcmFuZ2Ugc3BhbicpLnRleHQoZGF0YS5kYXRlUmFuZ2Uuc3RyaW5nKTtcclxuXHRcdGxldCBjb3VudCA9IDE7XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGZvcihsZXQgaSBvZiByYXdkYXRhKXtcclxuXHRcdFx0dGJvZHkgKz0gYDx0cj5cclxuXHRcdFx0XHRcdFx0PHRkPiR7Y291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1fYmxhbms+JHtpLnVzZXJuYW1lfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+JHtpLnNjb3JlfTwvdGQ+PHRkPjxidXR0b24gb25jbGljaz1cInBvcHVwLnNob3coJyR7aS51c2VyaWR9JylcIj7oqbPntLDos4foqIo8L2J1dHRvbj48L3RkPlxyXG5cdFx0XHRcdFx0ICA8L3RyPmA7XHJcblx0XHRcdGNvdW50Kys7XHJcblx0XHR9XHJcblx0XHQkKFwiLnRhYmxlcyB0YWJsZSB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5sZXQgcG9wdXAgPSB7XHJcblx0c2hvdzogKHRhcik9PntcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGRhdGEuZmluYWxBcnJheSl7XHJcblx0XHRcdGlmICh0YXIgPT0gaS51c2VyaWQpe1xyXG5cdFx0XHRcdGxldCBjb3VudCA9IDE7XHJcblx0XHRcdFx0JCgnLnBvcHVwIHAgc3BhbicpLnRleHQoaS51c2VybmFtZSk7XHJcblx0XHRcdFx0Zm9yKGxldCBqIG9mIGkuaWQpe1xyXG5cdFx0XHRcdFx0bGV0IG1lc3NhZ2UgPSBqLm1lc3NhZ2U7XHJcblx0XHRcdFx0XHRpZiAobWVzc2FnZSA9PSAnJykgbWVzc2FnZSA9ICc9PT09PeeEoeWFp+aWhz09PT09JztcclxuXHRcdFx0XHRcdHRib2R5ICs9IGA8dHI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtjb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke2ouaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHttZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai5jb21tZW50X2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLnRhZ19jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLnNjb3JlfTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0ICA8L3RyPmA7XHJcblx0XHRcdFx0XHRjb3VudCsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkKFwiLnBvcHVwIHRhYmxlIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJy5wb3B1cCcpLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0fSxcclxuXHRoaWRlOiAoKT0+e1xyXG5cdFx0JCgnLnBvcHVwJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHR9XHJcbn1cclxuXHJcbiBmdW5jdGlvbiBvYmoyQXJyYXkob2JqKXtcclxuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuIFx0fSk7XHJcbiBcdHJldHVybiBhcnJheTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuIFx0dmFyIGksIHIsIHQ7XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdGFyeVtpXSA9IGk7XHJcbiBcdH1cclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG4gXHRcdHQgPSBhcnlbcl07XHJcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG4gXHRcdGFyeVtpXSA9IHQ7XHJcbiBcdH1cclxuIFx0cmV0dXJuIGFyeTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcbiAgICB2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcbiAgICBcclxuICAgIHZhciBDU1YgPSAnJzsgICAgXHJcbiAgICAvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuICAgIFxyXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG4gICAgLy9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuICAgIGlmIChTaG93TGFiZWwpIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICAgICAgcm93ICs9IGluZGV4ICsgJywnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuICAgICAgICAgICAgcm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKENTViA9PSAnJykgeyAgICAgICAgXHJcbiAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSAgIFxyXG4gICAgXHJcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcbiAgICB2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG4gICAgLy90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxyXG4gICAgXHJcbiAgICAvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuICAgIFxyXG4gICAgLy8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG4gICAgLy8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcbiAgICAvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG4gICAgXHJcbiAgICAvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcbiAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpOyAgICBcclxuICAgIGxpbmsuaHJlZiA9IHVyaTtcclxuICAgIFxyXG4gICAgLy9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcbiAgICBsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuICAgIFxyXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il19
