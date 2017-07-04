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
		console.log(data.finalArray);
		$('.loading').removeClass('show');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImNvbmZpZyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsImF1dGgiLCJleHRlbnNpb24iLCJmYiIsIm5leHQiLCJmZWVkcyIsImdldEF1dGgiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzdGFydCIsInN3YWwiLCJkb25lIiwiZmJpZCIsImluaXQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0TWUiLCJnZXRQYWdlIiwiZ2V0R3JvdXAiLCJ0aGVuIiwicmVzIiwic2Vzc2lvblN0b3JhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2VuT3B0aW9uIiwib3B0aW9ucyIsImFkZENsYXNzIiwiaSIsImoiLCJpZCIsIm5hbWUiLCJhcHBlbmQiLCJzZWxlY3QyIiwic2VsZWN0UGFnZSIsInRhciIsImZpbmQiLCJhdHRyIiwidmFsIiwicGFnZUlEIiwiY2xlYXIiLCJjb21tYW5kIiwiYXBpIiwiZGF0YSIsInJlc29sdmUiLCJyZWplY3QiLCJhcnIiLCJnZXROYW1lIiwiaWRzIiwidG9TdHJpbmciLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJwcm9taXNlX2FycmF5IiwiZmluYWxBcnJheSIsImRhdGVSYW5nZSIsInRleHQiLCJyYXciLCJkYXRlQ2hlY2siLCJwaWNrYWRhdGUiLCJnZXQiLCJlbmQiLCJtZXNzYWdlIiwiZDEiLCJEYXRlIiwicGljayIsImQyIiwidGVtcCIsInJhbmdlIiwiY2hlY2siLCJvYmoiLCJmdWxsSUQiLCJwcm9taXNlIiwicHVzaCIsImNvdW50X3Njb3JlIiwiYWxlcnQiLCJkYXRhcyIsImxlbmd0aCIsImQiLCJpc19oaWRkZW4iLCJjaWQiLCJmcm9tIiwic3Vic3RyIiwicGFnaW5nIiwiZ2V0TmV4dCIsInJlcGxhY2UiLCJnZXRKU09OIiwiZmFpbCIsInNjb3JlX2FycmF5Iiwic2NvcmVfcnVsZSIsInNjb3JlIiwiY29tbWVudF9jb3VudCIsImNvbW1lbnRzX21heCIsInVzZXIiLCJsaWtlX2NvdW50IiwicmVhY3Rpb25zX21heCIsIk1hdGgiLCJjZWlsIiwibWVzc2FnZV90YWdzIiwidGFnX2NvdW50IiwidGFnIiwidGFnX21heCIsInJlbW92ZV9kdXBsaWNhdGVfY29tbWVudCIsImNpZEFycmF5IiwidGhpc2RhdGEiLCJsYXN0IiwicG9wIiwic29ydF9hcnJheSIsInNvcnQiLCJhIiwiYiIsIm1lcmdlRGF0YSIsInJlbW92ZUNsYXNzIiwidGFibGUiLCJnZW5lcmF0ZSIsImNoYXJ0IiwiZHJhdyIsImQzIiwic2VsZWN0IiwicmVtb3ZlIiwidyIsImNvdW50IiwiaW5kZXgiLCJtYXhTY29yZSIsIm1heCIsInhTY2FsZSIsInNjYWxlIiwibGluZWFyIiwiZG9tYWluIiwiYyIsInNlbGVjdEFsbCIsImVudGVyIiwidHJhbnNpdGlvbiIsImR1cmF0aW9uIiwidXNlcm5hbWUiLCJyYXdkYXRhIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsInN0cmluZyIsInRib2R5IiwiaHRtbCIsImFjdGl2ZSIsInJlZG8iLCJmaWx0ZXIiLCJwb3B1cCIsInNob3ciLCJoaWRlIiwib2JqMkFycmF5IiwiYXJyYXkiLCJtYXAiLCJ2YWx1ZSIsImdlblJhbmRvbUFycmF5IiwibiIsImFyeSIsIkFycmF5IiwiciIsInQiLCJmbG9vciIsInJhbmRvbSIsIkpTT05Ub0NTVkNvbnZlcnRvciIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwicGFyc2UiLCJDU1YiLCJyb3ciLCJzbGljZSIsImZpbGVOYW1lIiwidXJpIiwiZW5jb2RlVVJJIiwibGluayIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImhyZWYiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwiY2xpY2siLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFlQyxTQUFmOztBQUVBLFNBQVNBLFNBQVQsQ0FBbUJDLEdBQW5CLEVBQXVCQyxHQUF2QixFQUEyQkMsQ0FBM0IsRUFDQTtBQUNDLEtBQUksQ0FBQ04sWUFBTCxFQUFrQjtBQUNqQk8sVUFBUUMsR0FBUixDQUFZLG1DQUFaLEVBQWdELDRCQUFoRDtBQUNBQyxJQUFFLGlCQUFGLEVBQXFCQyxNQUFyQjtBQUNBVixpQkFBZSxJQUFmO0FBQ0E7QUFDRCxRQUFPLEtBQVA7QUFDQTs7QUFFRCxJQUFJVyxTQUFTO0FBQ1pDLFFBQU87QUFDTkMsWUFBVSxDQUFDLE1BQUQsRUFBUSxZQUFSLEVBQXFCLGVBQXJCLEVBQXFDLFdBQXJDLEVBQWlELFdBQWpELEVBQTZELFNBQTdELEVBQXVFLGNBQXZFLENBREo7QUFFTkMsYUFBVyxFQUZMO0FBR05DLGVBQWEsQ0FBQyxPQUFELEVBQVMsTUFBVCxFQUFpQixjQUFqQixDQUhQO0FBSU5DLGdCQUFjLEVBSlI7QUFLTkMsUUFBTTtBQUxBLEVBREs7QUFRWkMsUUFBTztBQUNOTCxZQUFVLEtBREo7QUFFTkMsYUFBVyxLQUZMO0FBR05DLGVBQWEsS0FIUDtBQUlOQyxnQkFBYyxLQUpSO0FBS05DLFFBQU07QUFMQSxFQVJLO0FBZVpFLGFBQVk7QUFDWE4sWUFBVSxNQURDO0FBRVhDLGFBQVcsTUFGQTtBQUdYQyxlQUFhLE1BSEY7QUFJWEMsZ0JBQWMsTUFKSDtBQUtYQyxRQUFNLE1BTEs7QUFNWEcsU0FBTyxNQU5JO0FBT1hDLFVBQVE7QUFQRyxFQWZBO0FBd0JaQyxPQUFN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QyxLQUFULElBQWtCeUMsUUFBUXRJLENBQVIsQ0FBbEIsRUFBOEI7QUFDMUJ5SSxVQUFPLE1BQU1ILFFBQVF0SSxDQUFSLEVBQVc2RixLQUFYLENBQU4sR0FBMEIsSUFBakM7QUFDSDs7QUFFRDRDLE1BQUlDLEtBQUosQ0FBVSxDQUFWLEVBQWFELElBQUl6RixNQUFKLEdBQWEsQ0FBMUI7O0FBRUE7QUFDQXdGLFNBQU9DLE1BQU0sTUFBYjtBQUNIOztBQUVELEtBQUlELE9BQU8sRUFBWCxFQUFlO0FBQ1gxRixRQUFNLGNBQU47QUFDQTtBQUNIOztBQUVEO0FBQ0EsS0FBSTZGLFdBQVcsRUFBZjtBQUNBO0FBQ0FBLGFBQVlQLFlBQVk1RSxPQUFaLENBQW9CLElBQXBCLEVBQXlCLEdBQXpCLENBQVo7O0FBRUE7QUFDQSxLQUFJb0YsTUFBTSx1Q0FBdUNDLFVBQVVMLEdBQVYsQ0FBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFJTSxPQUFPQyxTQUFTQyxhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQUYsTUFBS0csSUFBTCxHQUFZTCxHQUFaOztBQUVBO0FBQ0FFLE1BQUtJLEtBQUwsR0FBYSxtQkFBYjtBQUNBSixNQUFLSyxRQUFMLEdBQWdCUixXQUFXLE1BQTNCOztBQUVBO0FBQ0FJLFVBQVNLLElBQVQsQ0FBY0MsV0FBZCxDQUEwQlAsSUFBMUI7QUFDQUEsTUFBS1EsS0FBTDtBQUNBUCxVQUFTSyxJQUFULENBQWNHLFdBQWQsQ0FBMEJULElBQTFCO0FBQ0giLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxyXG57XHJcblx0aWYgKCFlcnJvck1lc3NhZ2Upe1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydmcm9tJywnbGlrZV9jb3VudCcsJ2NvbW1lbnRfY291bnQnLCdyZWFjdGlvbnMnLCdpc19oaWRkZW4nLCdtZXNzYWdlJywnbWVzc2FnZV90YWdzJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcclxuXHRcdGZlZWQ6IFtdXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2Mi43JyxcclxuXHRcdHJlYWN0aW9uczogJ3YyLjcnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi4zJyxcclxuXHRcdHVybF9jb21tZW50czogJ3YyLjcnLFxyXG5cdFx0ZmVlZDogJ3YyLjMnLFxyXG5cdFx0Z3JvdXA6ICd2Mi43JyxcclxuXHRcdG5ld2VzdDogJ3YyLjgnXHJcblx0fSxcclxuXHRhdXRoOiAndXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX21hbmFnZWRfZ3JvdXBzLG1hbmFnZV9wYWdlcycsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdG5leHQ6ICcnLFxyXG5cdGZlZWRzOiBbXSxcclxuXHRnZXRBdXRoOiAodHlwZSk9PntcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpPT57XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHRcdGlmICh0eXBlID09IFwiYWRkU2NvcGVcIil7XHJcblx0XHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKCdtYW5hZ2VfcGFnZXMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9tYW5hZ2VkX2dyb3VwcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX3Bvc3RzJykgPj0gMCl7XHJcblx0XHRcdFx0XHRmYi5zdGFydCgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+aOiOasiuWkseaVl++8jOiri+e1puS6iOaJgOacieasiumZkCcsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgUGxlYXNlIGNvbnRhY3QgdGhlIGFkbWluLicsXHJcblx0XHRcdFx0XHRcdCdlcnJvcidcclxuXHRcdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6ICgpPT57XHJcblx0XHRQcm9taXNlLmFsbChbZmIuZ2V0TWUoKSxmYi5nZXRQYWdlKCksIGZiLmdldEdyb3VwKCldKS50aGVuKChyZXMpPT57XHJcblx0XHRcdHNlc3Npb25TdG9yYWdlLmxvZ2luID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcclxuXHRcdFx0ZmIuZ2VuT3B0aW9uKHJlcyk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdlbk9wdGlvbjogKHJlcyk9PntcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCBvcHRpb25zID0gJyc7XHJcblx0XHRsZXQgdHlwZSA9IC0xO1xyXG5cdFx0JCgnYXNpZGUnKS5hZGRDbGFzcygnbG9naW4nKTtcclxuXHRcdGZvcihsZXQgaSBvZiByZXMpe1xyXG5cdFx0XHR0eXBlKys7XHJcblx0XHRcdGZvcihsZXQgaiBvZiBpKXtcclxuXHRcdFx0XHRvcHRpb25zICs9IGA8b3B0aW9uIGF0dHItdHlwZT1cIiR7dHlwZX1cIiB2YWx1ZT1cIiR7ai5pZH1cIj4ke2oubmFtZX08L29wdGlvbj5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCdhc2lkZSAuc3RlcDEgc2VsZWN0JykuYXBwZW5kKG9wdGlvbnMpO1xyXG5cdFx0JCgnYXNpZGUgc2VsZWN0Jykuc2VsZWN0MigpO1xyXG5cdFx0Ly8gJCgnYXNpZGUgc2VsZWN0Jykub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0Ly8gXHRsZXQgdHlwZSA9ICQodGhpcykuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuYXR0cignYXR0ci10eXBlJyk7XHJcblx0XHQvLyBcdGZiLnNlbGVjdFBhZ2UoZXZlbnQudGFyZ2V0LnZhbHVlLCB0eXBlKTtcclxuXHRcdC8vIH0pO1xyXG5cdH0sXHJcblx0c2VsZWN0UGFnZTogKCk9PntcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCB0YXIgPSAkKCdhc2lkZSBzZWxlY3QnKTtcclxuXHRcdGxldCB0eXBlID0gdGFyLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmF0dHIoJ2F0dHItdHlwZScpO1xyXG5cdFx0ZmIuZmVlZCh0YXIudmFsKCksIHR5cGUsIGZiLm5leHQpO1xyXG5cdH0sXHJcblx0ZmVlZDogKHBhZ2VJRCwgdHlwZSwgdXJsID0gJycsIGNsZWFyID0gdHJ1ZSk9PntcclxuXHRcdGxldCBjb21tYW5kID0gKHR5cGUgPT0gJzInKSA/ICdmZWVkJzoncG9zdHMnO1xyXG5cdFx0bGV0IGFwaTtcclxuXHRcdC8vMTQ2ODQ2Njk5MDA5NzYyM1xyXG5cdFx0aWYgKHVybCA9PSAnJyl7XHJcblx0XHRcdGFwaSA9IGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlSUR9LyR7Y29tbWFuZH0/ZmllbGRzPWxpbmssZnVsbF9waWN0dXJlLGNyZWF0ZWRfdGltZSxtZXNzYWdlJmxpbWl0PTUwYDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRhcGkgPSB1cmw7XHJcblx0XHR9XHJcblx0XHRGQi5hcGkoYXBpLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdGZiLmZlZWRzID0gcmVzLmRhdGE7XHJcblx0XHRcdGRhdGEuc3RhcnQoKTtcclxuXHRcdH0pXHJcblx0fSxcclxuXHRnZXRNZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZWAsIChyZXMpPT57XHJcblx0XHRcdFx0bGV0IGFyciA9IFtyZXNdO1xyXG5cdFx0XHRcdHJlc29sdmUoYXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldFBhZ2U6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvYWNjb3VudHM/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldEdyb3VwOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwcz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0TmFtZTogKGlkcyk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8/aWRzPSR7aWRzLnRvU3RyaW5nKCl9YCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHByb21pc2VfYXJyYXk6IFtdLFxyXG5cdGZpbmFsQXJyYXk6IFtdLFxyXG5cdGRhdGVSYW5nZToge30sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGRhdGEucHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHR9LFxyXG5cdGRhdGVDaGVjazogKCk9PntcclxuXHRcdGxldCBzdGFydCA9ICQoJyNzdGFydF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5LW1tLWRkJyk7XHJcblx0XHRsZXQgZW5kID0gJCgnI2VuZF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5LW1tLWRkJyk7XHJcblx0XHRsZXQgbWVzc2FnZSA9ICcnO1xyXG5cdFx0aWYgKHN0YXJ0ID09ICcnIHx8IGVuZCA9PSAnJyl7XHJcblx0XHRcdG1lc3NhZ2UgPSAn6KuL6YG45pOH5pel5pyfJztcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsZXQgZDEgPSBuZXcgRGF0ZSgkKCcjc3RhcnRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnKS5waWNrKTtcclxuXHRcdFx0bGV0IGQyID0gbmV3IERhdGUoJCgnI2VuZF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcpLnBpY2spO1xyXG5cdFx0XHRpZiAoZDItZDEgPiA1MTg0MDAwMDAwKXtcclxuXHRcdFx0XHRtZXNzYWdlID0gJ+aXpeacn+WNgOmWk+S4jeiDvei2hemBjjYw5aSpJztcclxuXHRcdFx0fWVsc2UgaWYgKGQyPGQxKXtcclxuXHRcdFx0XHRsZXQgdGVtcCA9IHN0YXJ0O1xyXG5cdFx0XHRcdHN0YXJ0ID0gZW5kO1xyXG5cdFx0XHRcdGVuZCA9IHRlbXA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChtZXNzYWdlID09ICcnKXtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHQnY2hlY2snOiB0cnVlLFxyXG5cdFx0XHRcdCdyYW5nZSc6IGBzaW5jZT0ke3N0YXJ0fSZ1bnRpbD0ke2VuZH1gLFxyXG5cdFx0XHRcdCdzdHJpbmcnOiAkKCcjc3RhcnRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS9tbS9kZCcpICsgXCIgfiBcIiArICQoJyNlbmRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS9tbS9kZCcpXHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdCdjaGVjayc6IGZhbHNlLFxyXG5cdFx0XHRcdCdtZXNzYWdlJzogbWVzc2FnZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRzdGFydDogKCk9PntcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0bGV0IHJhbmdlID0gZGF0YS5kYXRlQ2hlY2soKTtcclxuXHRcdGlmIChyYW5nZS5jaGVjayA9PT0gdHJ1ZSl7XHJcblx0XHRcdGRhdGEuZGF0ZVJhbmdlID0gcmFuZ2U7XHJcblx0XHRcdGxldCBhbGwgPSBbXTtcclxuXHRcdFx0Zm9yKGxldCBqIG9mIGZiLmZlZWRzKXtcclxuXHRcdFx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRcdFx0ZnVsbElEOiBqLmlkLFxyXG5cdFx0XHRcdFx0b2JqOiB7fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgcHJvbWlzZSA9IGRhdGEuZ2V0KG9iaikudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdFx0b2JqLmRhdGEgPSByZXM7XHJcblx0XHRcdFx0XHRhbGwucHVzaChvYmopO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGRhdGEucHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJy5sb2FkaW5nJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdFx0UHJvbWlzZS5hbGwoZGF0YS5wcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdFx0ZGF0YS5jb3VudF9zY29yZShhbGwpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRhbGVydChyYW5nZS5tZXNzYWdlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldDogKGZiaWQpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBjb21tYW5kID0gJ2NvbW1lbnRzJztcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS9jb21tZW50cz8ke2RhdGEuZGF0ZVJhbmdlLnJhbmdlfSZvcmRlcj1jaHJvbm9sb2dpY2FsJmZpZWxkcz0ke2NvbmZpZy5maWVsZFtjb21tYW5kXS50b1N0cmluZygpfWAsKHJlcyk9PntcclxuXHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2cocmVzKTtcclxuXHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0aWYgKCFkLmlzX2hpZGRlbil7XHJcblx0XHRcdFx0XHRcdGQuY2lkID0gZC5mcm9tLmlkICsgJ18nICsgZC5pZC5zdWJzdHIoMCwgZC5pZC5pbmRleE9mKCdfJykpO1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCk9PntcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNvdW50X3Njb3JlOiAoYWxsKT0+e1xyXG5cdFx0LypcclxuXHRcdFx055WZ6KiAM+WIhuOAgVRBR+S4gOWAizHliIbvvIzmnIDlpJoz5YiGXHJcblx0XHRcdOeVmeiogOW/g+aDhTLlgIsx5YiG77yM54Sh5qKd5Lu26YCy5L2N77yM5pyA5aSaMTPliIZcclxuXHRcdFx055WZ6KiA55qE55WZ6KiA5LiA5YCLMeWIhu+8jOacgOWkpzbliIZcclxuXHRcdCovXHJcblx0XHRsZXQgc2NvcmVfYXJyYXkgPSBbXTtcclxuXHRcdGZvcihsZXQgaSBvZiBhbGwpe1xyXG5cdFx0XHRsZXQgYXJyID0gaS5kYXRhO1xyXG5cdFx0XHRsZXQgc2NvcmVfcnVsZSA9IHtcclxuXHRcdFx0XHQnY29tbWVudHMnOiAxLFxyXG5cdFx0XHRcdCdjb21tZW50c19tYXgnOiA2LFxyXG5cdFx0XHRcdCdyZWFjdGlvbnMnOiAwLjUsXHJcblx0XHRcdFx0J3JlYWN0aW9uc19tYXgnOiAxMyxcclxuXHRcdFx0XHQndGFnJzogMSxcclxuXHRcdFx0XHQndGFnX21heCc6IDNcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgc2NvcmU7XHJcblx0XHRcdGZvcihsZXQgaiBvZiBhcnIpe1xyXG5cdFx0XHRcdHNjb3JlID0gMztcclxuXHRcdFx0XHRzY29yZSArPSAoai5jb21tZW50X2NvdW50KnNjb3JlX3J1bGUuY29tbWVudHMgPiBzY29yZV9ydWxlLmNvbW1lbnRzX21heCkgPyBzY29yZV9ydWxlLmNvbW1lbnRzX21heCA6IGouY29tbWVudF9jb3VudCpzY29yZV9ydWxlLmNvbW1lbnRzO1xyXG5cdFx0XHRcdGxldCB1c2VyID0ge1xyXG5cdFx0XHRcdFx0J2lkJzogai5pZCxcclxuXHRcdFx0XHRcdCd1c2VyaWQnOiBqLmZyb20uaWQsXHJcblx0XHRcdFx0XHQndXNlcm5hbWUnOiBqLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdCdjb21tZW50X2NvdW50Jzogai5jb21tZW50X2NvdW50LFxyXG5cdFx0XHRcdFx0J21lc3NhZ2UnOiBqLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHQnY2lkJzogai5jaWRcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmIChqLnJlYWN0aW9ucyl7XHJcblx0XHRcdFx0XHRpZiAoai5yZWFjdGlvbnMuZGF0YS5sZW5ndGggPT09IDI1KXtcclxuXHRcdFx0XHRcdFx0dXNlci5saWtlX2NvdW50ID0gai5saWtlX2NvdW50O1xyXG5cdFx0XHRcdFx0XHRzY29yZSArPSBzY29yZV9ydWxlLnJlYWN0aW9uc19tYXg7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0dXNlci5saWtlX2NvdW50ID0gai5yZWFjdGlvbnMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdHNjb3JlICs9IE1hdGguY2VpbChqLnJlYWN0aW9ucy5kYXRhLmxlbmd0aCpzY29yZV9ydWxlLnJlYWN0aW9ucyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR1c2VyLmxpa2VfY291bnQgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoai5tZXNzYWdlX3RhZ3Mpe1xyXG5cdFx0XHRcdFx0dXNlci50YWdfY291bnQgPSBqLm1lc3NhZ2VfdGFncy5sZW5ndGhcclxuXHRcdFx0XHRcdHNjb3JlICs9ICAoai5tZXNzYWdlX3RhZ3MubGVuZ3RoICogc2NvcmVfcnVsZS50YWcgPj0gc2NvcmVfcnVsZS50YWdfbWF4KSA/IHNjb3JlX3J1bGUudGFnX21heCA6IGoubWVzc2FnZV90YWdzLmxlbmd0aCAqIHNjb3JlX3J1bGUudGFnO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dXNlci50YWdfY291bnQgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR1c2VyLnNjb3JlID0gc2NvcmU7XHJcblx0XHRcdFx0c2NvcmVfYXJyYXkucHVzaCh1c2VyKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gY29uc29sZS5sb2coc2NvcmVfYXJyYXkpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIHJlbW92ZV9kdXBsaWNhdGVfY29tbWVudChhcnIpe1xyXG5cdFx0XHRsZXQgY2lkQXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IHRlbXAgPSAnJztcclxuXHRcdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdFx0bGV0IG9iaiA9IGk7XHJcblx0XHRcdFx0aWYgKGkuY2lkID09PSB0ZW1wLmNpZCl7XHJcblx0XHRcdFx0XHRsZXQgdGhpc2RhdGEgPSBvYmo7XHJcblx0XHRcdFx0XHRsZXQgbGFzdCA9IGNpZEFycmF5LnBvcCgpO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXNkYXRhLnNjb3JlID4gbGFzdC5zY29yZSl7XHJcblx0XHRcdFx0XHRcdGxhc3QgPSB0aGlzZGF0YTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNpZEFycmF5LnB1c2gobGFzdCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR0ZW1wID0gb2JqO1xyXG5cdFx0XHRcdFx0Y2lkQXJyYXkucHVzaChvYmopO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gY2lkQXJyYXk7XHJcblx0XHR9XHJcblx0XHRsZXQgc29ydF9hcnJheSA9IHJlbW92ZV9kdXBsaWNhdGVfY29tbWVudChzY29yZV9hcnJheS5zb3J0KChhLCBiKSA9PiBiLmNpZCAtIGEuY2lkKSk7XHJcblx0XHRkYXRhLm1lcmdlRGF0YShzb3J0X2FycmF5LnNvcnQoKGEsIGIpID0+IGIudXNlcmlkIC0gYS51c2VyaWQpKTtcclxuXHR9LFxyXG5cdG1lcmdlRGF0YTogKGFycik9PntcclxuXHRcdGxldCBmaW5hbEFycmF5ID0gW107XHJcblx0XHRsZXQgdGVtcCA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdGxldCBvYmogPSBpO1xyXG5cdFx0XHRpZiAoaS51c2VyaWQgPT09IHRlbXAudXNlcmlkKXtcclxuXHRcdFx0XHRsZXQgdGhpc2RhdGEgPSBvYmo7XHJcblx0XHRcdFx0bGV0IGxhc3QgPSBmaW5hbEFycmF5LnBvcCgpO1xyXG5cdFx0XHRcdGxhc3QuaWQucHVzaCh0aGlzZGF0YSk7XHJcblx0XHRcdFx0bGFzdC5jb21tZW50X2NvdW50ICs9IG9iai5jb21tZW50X2NvdW50O1xyXG5cdFx0XHRcdGxhc3QubGlrZV9jb3VudCArPSBvYmoubGlrZV9jb3VudDtcclxuXHRcdFx0XHRsYXN0LnRhZ19jb3VudCArPSBvYmoudGFnX2NvdW50O1xyXG5cdFx0XHRcdGxhc3Quc2NvcmUgKz0gb2JqLnNjb3JlO1xyXG5cdFx0XHRcdGZpbmFsQXJyYXkucHVzaChsYXN0KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bGV0IHRoaXNkYXRhID0ge1xyXG5cdFx0XHRcdFx0J2lkJzogb2JqLmlkLFxyXG5cdFx0XHRcdFx0J21lc3NhZ2UnOiBvYmoubWVzc2FnZSxcclxuXHRcdFx0XHRcdCdsaWtlX2NvdW50Jzogb2JqLmxpa2VfY291bnQsXHJcblx0XHRcdFx0XHQnY29tbWVudF9jb3VudCc6IG9iai5jb21tZW50X2NvdW50LFxyXG5cdFx0XHRcdFx0J3RhZ19jb3VudCc6IG9iai50YWdfY291bnQsXHJcblx0XHRcdFx0XHQnc2NvcmUnOiBvYmouc2NvcmVcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdG9iai5pZCA9IFt0aGlzZGF0YV07XHJcblx0XHRcdFx0dGVtcCA9IG9iajtcclxuXHRcdFx0XHRmaW5hbEFycmF5LnB1c2gob2JqKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5maW5hbEFycmF5ID0gZmluYWxBcnJheS5zb3J0KChhLCBiKSA9PiBiLnNjb3JlIC0gYS5zY29yZSk7XHJcblx0XHRjb25zb2xlLmxvZyhkYXRhLmZpbmFsQXJyYXkpO1xyXG5cdFx0JCgnLmxvYWRpbmcnKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0dGFibGUuZ2VuZXJhdGUoZGF0YS5maW5hbEFycmF5KTtcclxuXHRcdGNoYXJ0LmRyYXcoZGF0YS5maW5hbEFycmF5KTtcclxuXHR9XHJcbn1cclxubGV0IGNoYXJ0ID0ge1xyXG5cdGRyYXc6IChmaW5hbEFycmF5KT0+e1xyXG5cdFx0ZDMuc2VsZWN0KFwic3ZnXCIpLnJlbW92ZSgpO1xyXG5cdFx0bGV0IGFyciA9IFtdO1xyXG5cdFx0bGV0IHcgPSA3NTA7XHJcblx0XHRsZXQgY291bnQgPSAxMDtcclxuXHRcdGlmIChmaW5hbEFycmF5Lmxlbmd0aCA8IGNvdW50KSBjb3VudCA9IGZpbmFsQXJyYXkubGVuZ3RoO1xyXG5cdFx0Zm9yKGxldCBpPTA7IGk8Y291bnQ7IGkrKyl7XHJcblx0XHRcdGZpbmFsQXJyYXlbaV0uaW5kZXggPSBpO1xyXG5cdFx0XHRhcnIucHVzaChmaW5hbEFycmF5W2ldKTtcclxuXHRcdH1cclxuXHRcdHZhciBtYXhTY29yZSA9IGQzLm1heChhcnIsIGZ1bmN0aW9uKGQpe3JldHVybiBkLnNjb3JlfSk7XHJcblx0XHRjb25zb2xlLmxvZyhtYXhTY29yZSlcclxuXHRcdHZhciB4U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxyXG5cdFx0XHRcdFx0ICAgLmRvbWFpbihbMCwgbWF4U2NvcmVdKVxyXG5cdFx0XHRcdFx0ICAgLnJhbmdlKFswLCB3LTgwXSk7XHJcblxyXG5cdFx0dmFyIGMgPSBkMy5zZWxlY3QoJy5jaGFydCcpLmFwcGVuZCgnc3ZnJyk7XHJcblx0XHRjLnNlbGVjdEFsbCgncmVjdCcpXHJcblx0XHQgLmRhdGEoYXJyKVxyXG5cdFx0IC5lbnRlcigpXHJcblx0XHQgLmFwcGVuZCgncmVjdCcpXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J2ZpbGwnOiAnI0UwOTcyQScsXHJcblx0XHQgXHQnd2lkdGgnOiAwLFxyXG5cdFx0IFx0J2hlaWdodCc6ICczMCcsXHJcblx0XHQgXHQneCc6IGZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4gMDtcclxuXHRcdCBcdH0sXHJcblx0XHQgXHQneSc6IGZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4gZC5pbmRleCAqIDQwXHJcblx0XHQgXHR9XHJcblx0XHQgfSlcclxuXHRcdCAudHJhbnNpdGlvbigpXHJcblx0XHQgLmR1cmF0aW9uKDE1MDApXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J3dpZHRoJzpmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIHhTY2FsZShkLnNjb3JlKTtcclxuXHRcdCBcdH1cclxuXHRcdCB9KTtcclxuXHRcdCBjLnNlbGVjdEFsbCgndGV4dC5zY29yZScpXHJcblx0XHQgLmRhdGEoYXJyKVxyXG5cdFx0IC5lbnRlcigpXHJcblx0XHQgLmFwcGVuZCgndGV4dCcpXHJcblx0XHQgLnRleHQoZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRyZXR1cm4gZC5zY29yZSArICfliIYnO1xyXG5cdFx0IH0pXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J2ZpbGwnOicjZTA5NzJhJyxcclxuXHRcdCBcdCd4JzogMCxcclxuXHRcdCBcdCd5JzpmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIGQuaW5kZXggKiA0MCArIDIwXHJcblx0XHQgXHR9XHJcblx0XHQgfSlcclxuXHRcdCAudHJhbnNpdGlvbigpXHJcblx0XHQgLmR1cmF0aW9uKDE1MDApXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J3gnOmZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4geFNjYWxlKGQuc2NvcmUpICsgNDA7XHJcblx0XHQgXHR9XHJcblx0XHQgfSk7XHJcblx0XHQgYy5zZWxlY3RBbGwoJ3RleHQubmFtZScpXHJcblx0XHQgLmRhdGEoYXJyKVxyXG5cdFx0IC5lbnRlcigpXHJcblx0XHQgLmFwcGVuZCgndGV4dCcpXHJcblx0XHQgLnRleHQoZnVuY3Rpb24oZCl7XHJcblx0XHQgXHRyZXR1cm4gZC51c2VybmFtZTtcclxuXHRcdCB9KVxyXG5cdFx0IC5hdHRyKHtcclxuXHRcdCBcdCdmaWxsJzonI0ZGRicsXHJcblx0XHQgXHQndGV4dC1hbmNob3InOiAnZW5kJyxcclxuXHRcdCBcdCd4JzogMCxcclxuXHRcdCBcdCd5JzpmdW5jdGlvbihkKXtcclxuXHRcdCBcdFx0cmV0dXJuIGQuaW5kZXggKiA0MCArIDIwXHJcblx0XHQgXHR9XHJcblx0XHQgfSlcclxuXHRcdCAudHJhbnNpdGlvbigpXHJcblx0XHQgLmR1cmF0aW9uKDE1MDApXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J3gnOmZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4geFNjYWxlKGQuc2NvcmUpIC0gMTA7XHJcblx0XHQgXHR9XHJcblx0XHQgfSk7XHJcblx0XHQgYy5zZWxlY3RBbGwoJ2ltZycpXHJcblx0XHQgLmRhdGEoYXJyKVxyXG5cdFx0IC5lbnRlcigpXHJcblx0XHQgLmFwcGVuZCgnc3ZnOmltYWdlJylcclxuXHRcdCAuYXR0cih7XHJcblx0XHQgXHQneGxpbms6aHJlZic6IGZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4gJ2h0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJytkLnVzZXJpZCsnL3BpY3R1cmU/d2lkdGg9MzAmaGVpZ2h0PTMwJ1xyXG5cdFx0IFx0fSxcclxuXHRcdCBcdCd3aWR0aCc6IDMwLFxyXG5cdFx0IFx0J2hlaWdodCc6IDMwLFxyXG5cdFx0IFx0J3gnOiAwLFxyXG5cdFx0IFx0J3knOmZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4gZC5pbmRleCAqIDQwXHJcblx0XHQgXHR9XHJcblx0XHQgfSlcclxuXHRcdCAudHJhbnNpdGlvbigpXHJcblx0XHQgLmR1cmF0aW9uKDE1MDApXHJcblx0XHQgLmF0dHIoe1xyXG5cdFx0IFx0J3gnOmZ1bmN0aW9uKGQpe1xyXG5cdFx0IFx0XHRyZXR1cm4geFNjYWxlKGQuc2NvcmUpO1xyXG5cdFx0IFx0fVxyXG5cdFx0IH0pO1xyXG5cdH1cclxufVxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xyXG5cdFx0JChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JCgnLnJlc3VsdCAuaW5mbyAuYWxsX3Blb3BsZSBzcGFuJykudGV4dChyYXdkYXRhLmxlbmd0aCk7XHJcblx0XHQkKCcucmVzdWx0IC5pbmZvIC5kYXRlX3JhbmdlIHNwYW4nKS50ZXh0KGRhdGEuZGF0ZVJhbmdlLnN0cmluZyk7XHJcblx0XHRsZXQgY291bnQgPSAxO1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgcmF3ZGF0YSl7XHJcblx0XHRcdHRib2R5ICs9IGA8dHI+XHJcblx0XHRcdFx0XHRcdDx0ZD4ke2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZD48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9X2JsYW5rPiR7aS51c2VybmFtZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkPiR7aS5zY29yZX08L3RkPjx0ZD48YnV0dG9uIG9uY2xpY2s9XCJwb3B1cC5zaG93KCcke2kudXNlcmlkfScpXCI+6Kmz57Sw6LOH6KiKPC9idXR0b24+PC90ZD5cclxuXHRcdFx0XHRcdCAgPC90cj5gO1xyXG5cdFx0XHRjb3VudCsrO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgdGFibGUgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5KTtcclxuXHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCk9PntcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxubGV0IHBvcHVwID0ge1xyXG5cdHNob3c6ICh0YXIpPT57XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGZvcihsZXQgaSBvZiBkYXRhLmZpbmFsQXJyYXkpe1xyXG5cdFx0XHRpZiAodGFyID09IGkudXNlcmlkKXtcclxuXHRcdFx0XHRsZXQgY291bnQgPSAxO1xyXG5cdFx0XHRcdCQoJy5wb3B1cCBwIHNwYW4nKS50ZXh0KGkudXNlcm5hbWUpO1xyXG5cdFx0XHRcdGZvcihsZXQgaiBvZiBpLmlkKXtcclxuXHRcdFx0XHRcdGxldCBtZXNzYWdlID0gai5tZXNzYWdlO1xyXG5cdFx0XHRcdFx0aWYgKG1lc3NhZ2UgPT0gJycpIG1lc3NhZ2UgPSAnPT09PT3nhKHlhafmloc9PT09PSc7XHJcblx0XHRcdFx0XHR0Ym9keSArPSBgPHRyPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7Y291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHtqLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7bWVzc2FnZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2ouY29tbWVudF9jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai50YWdfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2oubGlrZV9jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai5zY29yZX08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdCAgPC90cj5gO1xyXG5cdFx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JChcIi5wb3B1cCB0YWJsZSB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcucG9wdXAnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdH0sXHJcblx0aGlkZTogKCk9PntcclxuXHRcdCQoJy5wb3B1cCcpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0fVxyXG59XHJcblxyXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XHJcbiBcdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XHJcbiBcdH0pO1xyXG4gXHRyZXR1cm4gYXJyYXk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcbiBcdHZhciBpLCByLCB0O1xyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRhcnlbaV0gPSBpO1xyXG4gXHR9XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuIFx0XHR0ID0gYXJ5W3JdO1xyXG4gXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuIFx0XHRhcnlbaV0gPSB0O1xyXG4gXHR9XHJcbiBcdHJldHVybiBhcnk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG4gICAgXHJcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxyXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcbiAgICBcclxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxyXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gICBcclxuICAgIFxyXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcclxuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcclxuICAgIFxyXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcbiAgICBcclxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuICAgIFxyXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTsgICAgXHJcbiAgICBsaW5rLmhyZWYgPSB1cmk7XHJcbiAgICBcclxuICAgIC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcbiAgICBcclxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgbGluay5jbGljaygpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
