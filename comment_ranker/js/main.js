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
		comments: 'v3.1',
		reactions: 'v3.1',
		feed: 'v3.1',
		group: 'v3.1',
		newest: 'v2.8'
	},
	auth: 'manage_pages,groups_access_member_info',
	extension: false,
	pageToken: ''
};

var fb = {
	next: '',
	feeds: [],
	getAuth: function getAuth(type) {
		FB.login(function (response) {
			fb.callback(response, type);
		}, {
			scope: config.auth,
			return_scopes: true
		});
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
			}, {
				scope: config.auth,
				return_scopes: true
			});
		}
	},
	start: function start() {
		Promise.all([fb.getPage(), fb.getGroup()]).then(function (res) {
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
		var command = 'feed';
		var api = void 0;
		var start = Math.floor(Date.parse($('#start_date').pickadate('picker').get('select', 'yyyy-mm-dd')) / 1000);
		var end = Math.floor(Date.parse($('#end_date').pickadate('picker').get('select', 'yyyy-mm-dd')) / 1000);
		//1468466990097623
		if (url == '') {
			api = pageID + "/" + command + "?since=" + start + "&until=" + end + "&fields=link,full_picture,created_time,message&limit=100";
		} else {
			api = url;
		}
		FB.api("/" + pageID + "?fields=access_token", function (res) {
			if (res.access_token) {
				config.pageToken = res.access_token;
			}
		});
		FB.api(api, function (res) {
			console.log(res);
			console.log(api);
			if (res.data.length > 0) {
				fb.feeds = res.data;
				if (res.paging) {
					next(res.paging.next);
				} else {
					data.start();
				}
			} else {
				alert('沒有資料');
				$('button.start').removeClass('disabled').text('開始');
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
			FB.api(config.apiVersion.newest + "/me/groups?limit=100&fields=administrator,name", function (res) {
				var groups = [];
				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = res.data[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var i = _step5.value;

						if (i.administrator) groups.push(i);
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

				resolve(groups);
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
				// let temp = start;
				// start = end;
				// end = temp;
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
				var _iteratorNormalCompletion6 = true;
				var _didIteratorError6 = false;
				var _iteratorError6 = undefined;

				try {
					var _loop = function _loop() {
						var j = _step6.value;

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

					for (var _iterator6 = fb.feeds[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
						_loop();
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

				$('.loading').addClass('show');
				Promise.all(data.promise_array).then(function (res) {
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
				if (res.data) {
					data.nowLength += res.data.length;
					$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
					// console.log(res);
					var _iteratorNormalCompletion7 = true;
					var _didIteratorError7 = false;
					var _iteratorError7 = undefined;

					try {
						for (var _iterator7 = res.data[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
							var d = _step7.value;

							if (!d.is_hidden) {
								d.cid = d.from.id + '_' + d.id.substr(0, d.id.indexOf('_'));
								datas.push(d);
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

					if (res.data.length > 0 && res.paging.next) {
						getNext(res.paging.next);
					} else {
						resolve(datas);
					}
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
					var _iteratorNormalCompletion8 = true;
					var _didIteratorError8 = false;
					var _iteratorError8 = undefined;

					try {
						for (var _iterator8 = res.data[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
							var d = _step8.value;

							datas.push(d);
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
		var _iteratorNormalCompletion9 = true;
		var _didIteratorError9 = false;
		var _iteratorError9 = undefined;

		try {
			for (var _iterator9 = all[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
				var i = _step9.value;

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
				var _iteratorNormalCompletion11 = true;
				var _didIteratorError11 = false;
				var _iteratorError11 = undefined;

				try {
					for (var _iterator11 = arr[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
						var j = _step11.value;

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
			}
			// console.log(score_array);
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

		function remove_duplicate_comment(arr) {
			var cidArray = [];
			var temp = '';
			var _iteratorNormalCompletion10 = true;
			var _didIteratorError10 = false;
			var _iteratorError10 = undefined;

			try {
				for (var _iterator10 = arr[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
					var i = _step10.value;

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
		var _iteratorNormalCompletion12 = true;
		var _didIteratorError12 = false;
		var _iteratorError12 = undefined;

		try {
			for (var _iterator12 = arr[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
				var i = _step12.value;

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
		var _iteratorNormalCompletion13 = true;
		var _didIteratorError13 = false;
		var _iteratorError13 = undefined;

		try {
			for (var _iterator13 = rawdata[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
				var i = _step13.value;

				tbody += "<tr>\n\t\t\t\t\t\t<td>" + count + "</td>\n\t\t\t\t\t\t<td><a href=\"http://www.facebook.com/" + i.userid + "\" target=_blank>" + i.username + "</a></td>\n\t\t\t\t\t\t<td>" + i.score + "</td><td><button onclick=\"popup.show('" + i.userid + "')\">\u8A73\u7D30\u8CC7\u8A0A</button></td>\n\t\t\t\t\t  </tr>";
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
		var _iteratorNormalCompletion14 = true;
		var _didIteratorError14 = false;
		var _iteratorError14 = undefined;

		try {
			for (var _iterator14 = data.finalArray[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
				var i = _step14.value;

				if (tar == i.userid) {
					var count = 1;
					$('.popup p span').text(i.username);
					var _iteratorNormalCompletion15 = true;
					var _didIteratorError15 = false;
					var _iteratorError15 = undefined;

					try {
						for (var _iterator15 = i.id[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
							var j = _step15.value;

							var message = j.message;
							if (message == '') message = '=====無內文=====';
							tbody += "<tr>\n\t\t\t\t\t\t\t\t<td>" + count + "</td>\n\t\t\t\t\t\t\t\t<td><a href=\"http://www.facebook.com/" + j.id + "\" target=\"_blank\">" + message + "</a></td>\n\t\t\t\t\t\t\t\t<td>" + j.comment_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.tag_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.like_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.score + "</td>\n\t\t\t\t\t\t\t  </tr>";
							count++;
						}
					} catch (err) {
						_didIteratorError15 = true;
						_iteratorError15 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion15 && _iterator15.return) {
								_iterator15.return();
							}
						} finally {
							if (_didIteratorError15) {
								throw _iteratorError15;
							}
						}
					}

					$(".popup table tbody").html('').append(tbody);
				}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImNvbmZpZyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJmYiIsIm5leHQiLCJmZWVkcyIsImdldEF1dGgiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzdGFydCIsInN3YWwiLCJkb25lIiwiZmJpZCIsImluaXQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwidGhlbiIsInJlcyIsInNlc3Npb25TdG9yYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsImdlbk9wdGlvbiIsIm9wdGlvbnMiLCJhZGRDbGFzcyIsImkiLCJqIiwiaWQiLCJuYW1lIiwiYXBwZW5kIiwic2VsZWN0MiIsInNlbGVjdFBhZ2UiLCJ0YXIiLCJmaW5kIiwiYXR0ciIsInNldFRva2VuIiwidmFsIiwicGFnZWlkIiwicGFnZXMiLCJwYXJzZSIsImFjY2Vzc190b2tlbiIsInBhZ2VJRCIsImNsZWFyIiwidGV4dCIsImNvbW1hbmQiLCJhcGkiLCJNYXRoIiwiZmxvb3IiLCJEYXRlIiwicGlja2FkYXRlIiwiZ2V0IiwiZW5kIiwiZGF0YSIsImxlbmd0aCIsInBhZ2luZyIsImFsZXJ0IiwicmVtb3ZlQ2xhc3MiLCJwdXNoIiwiZ2V0TWUiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXJyIiwiZ3JvdXBzIiwiYWRtaW5pc3RyYXRvciIsImdldE5hbWUiLCJpZHMiLCJ0b1N0cmluZyIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInByb21pc2VfYXJyYXkiLCJmaW5hbEFycmF5IiwiZGF0ZVJhbmdlIiwicmF3IiwiZGF0ZUNoZWNrIiwibWVzc2FnZSIsImQxIiwicGljayIsImQyIiwidGVtcCIsInJhbmdlIiwiY2hlY2siLCJvYmoiLCJmdWxsSUQiLCJwcm9taXNlIiwiY291bnRfc2NvcmUiLCJkYXRhcyIsImQiLCJpc19oaWRkZW4iLCJjaWQiLCJmcm9tIiwic3Vic3RyIiwiZ2V0TmV4dCIsInJlcGxhY2UiLCJnZXRKU09OIiwiZmFpbCIsInNjb3JlX2FycmF5Iiwic2NvcmVfcnVsZSIsInNjb3JlIiwiY29tbWVudF9jb3VudCIsImNvbW1lbnRzX21heCIsInVzZXIiLCJsaWtlX2NvdW50IiwicmVhY3Rpb25zX21heCIsImNlaWwiLCJtZXNzYWdlX3RhZ3MiLCJ0YWdfY291bnQiLCJ0YWciLCJ0YWdfbWF4IiwicmVtb3ZlX2R1cGxpY2F0ZV9jb21tZW50IiwiY2lkQXJyYXkiLCJ0aGlzZGF0YSIsImxhc3QiLCJwb3AiLCJzb3J0X2FycmF5Iiwic29ydCIsImEiLCJiIiwibWVyZ2VEYXRhIiwibWFwIiwiaXRlbSIsInVzZXJuYW1lIiwibG9jYWxTdG9yYWdlIiwicmFua2VyIiwidGFibGUiLCJnZW5lcmF0ZSIsImNoYXJ0IiwiZHJhdyIsImQzIiwic2VsZWN0IiwicmVtb3ZlIiwidyIsImNvdW50IiwiaW5kZXgiLCJtYXhTY29yZSIsIm1heCIsInhTY2FsZSIsInNjYWxlIiwibGluZWFyIiwiZG9tYWluIiwiYyIsInNlbGVjdEFsbCIsImVudGVyIiwidHJhbnNpdGlvbiIsImR1cmF0aW9uIiwicmF3ZGF0YSIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJzdHJpbmciLCJ0Ym9keSIsImh0bWwiLCJhY3RpdmUiLCJyZWRvIiwiZmlsdGVyIiwicG9wdXAiLCJzaG93IiwiaGlkZSIsIm9iajJBcnJheSIsImFycmF5IiwidmFsdWUiLCJnZW5SYW5kb21BcnJheSIsIm4iLCJhcnkiLCJBcnJheSIsInIiLCJ0IiwicmFuZG9tIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJyb3ciLCJzbGljZSIsImZpbGVOYW1lIiwidXJpIiwiZW5jb2RlVVJJIiwibGluayIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImhyZWYiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwiY2xpY2siLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFpQkMsU0FBakI7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBd0JDLEdBQXhCLEVBQTZCQyxDQUE3QixFQUFnQztBQUMvQixLQUFJLENBQUNOLFlBQUwsRUFBbUI7QUFDbEJPLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFpRCw0QkFBakQ7QUFDQUMsSUFBRSxpQkFBRixFQUFxQkMsTUFBckI7QUFDQVYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7O0FBRUQsSUFBSVcsU0FBUztBQUNaQyxRQUFPO0FBQ05DLFlBQVUsQ0FBQyxNQUFELEVBQVMsWUFBVCxFQUF1QixlQUF2QixFQUF3QyxXQUF4QyxFQUFxRCxXQUFyRCxFQUFrRSxTQUFsRSxFQUE2RSxjQUE3RSxDQURKO0FBRU5DLGFBQVcsRUFGTDtBQUdOQyxlQUFhLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsY0FBbEIsQ0FIUDtBQUlOQyxnQkFBYyxFQUpSO0FBS05DLFFBQU07QUFMQSxFQURLO0FBUVpDLFFBQU87QUFDTkwsWUFBVSxLQURKO0FBRU5DLGFBQVcsS0FGTDtBQUdOQyxlQUFhLEtBSFA7QUFJTkMsZ0JBQWMsS0FKUjtBQUtOQyxRQUFNO0FBTEEsRUFSSztBQWVaRSxhQUFZO0FBQ1hOLFlBQVUsTUFE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QUFDQTs7QUFFRCxLQUFJRCxPQUFPLEVBQVgsRUFBZTtBQUNkcEgsUUFBTSxjQUFOO0FBQ0E7QUFDQTs7QUFFRDtBQUNBLEtBQUl1SCxXQUFXLEVBQWY7QUFDQTtBQUNBQSxhQUFZTixZQUFZNUUsT0FBWixDQUFvQixJQUFwQixFQUEwQixHQUExQixDQUFaOztBQUVBO0FBQ0EsS0FBSW1GLE1BQU0sdUNBQXVDQyxVQUFVTCxHQUFWLENBQWpEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSU0sT0FBT0MsU0FBU0MsYUFBVCxDQUF1QixHQUF2QixDQUFYO0FBQ0FGLE1BQUtHLElBQUwsR0FBWUwsR0FBWjs7QUFFQTtBQUNBRSxNQUFLSSxLQUFMLEdBQWEsbUJBQWI7QUFDQUosTUFBS0ssUUFBTCxHQUFnQlIsV0FBVyxNQUEzQjs7QUFFQTtBQUNBSSxVQUFTSyxJQUFULENBQWNDLFdBQWQsQ0FBMEJQLElBQTFCO0FBQ0FBLE1BQUtRLEtBQUw7QUFDQVAsVUFBU0ssSUFBVCxDQUFjRyxXQUFkLENBQTBCVCxJQUExQjtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yID0gaGFuZGxlRXJyXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLCB1cmwsIGwpIHtcclxuXHRpZiAoIWVycm9yTWVzc2FnZSkge1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLCBcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnZnJvbScsICdsaWtlX2NvdW50JywgJ2NvbW1lbnRfY291bnQnLCAncmVhY3Rpb25zJywgJ2lzX2hpZGRlbicsICdtZXNzYWdlJywgJ21lc3NhZ2VfdGFncyddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywgJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogW11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3YzLjEnLFxyXG5cdFx0cmVhY3Rpb25zOiAndjMuMScsXHJcblx0XHRmZWVkOiAndjMuMScsXHJcblx0XHRncm91cDogJ3YzLjEnLFxyXG5cdFx0bmV3ZXN0OiAndjIuOCdcclxuXHR9LFxyXG5cdGF1dGg6ICdtYW5hZ2VfcGFnZXMsZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mbycsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwYWdlVG9rZW46ICcnLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0bmV4dDogJycsXHJcblx0ZmVlZHM6IFtdLFxyXG5cdGdldEF1dGg6ICh0eXBlKSA9PiB7XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSkgPT4ge1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpIHtcclxuXHRcdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKSB7XHJcblx0XHRcdFx0XHRmYi5zdGFydCgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5o6I5qyK5aSx5pWX77yM6KuL57Wm5LqI5omA5pyJ5qyK6ZmQJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRzdGFydDogKCkgPT4ge1xyXG5cdFx0UHJvbWlzZS5hbGwoW2ZiLmdldFBhZ2UoKSwgZmIuZ2V0R3JvdXAoKV0pLnRoZW4oKHJlcykgPT4ge1xyXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5sb2dpbiA9IEpTT04uc3RyaW5naWZ5KHJlcyk7XHJcblx0XHRcdGZiLmdlbk9wdGlvbihyZXMpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZW5PcHRpb246IChyZXMpID0+IHtcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCBvcHRpb25zID0gJyc7XHJcblx0XHRsZXQgdHlwZSA9IC0xO1xyXG5cdFx0JCgnYXNpZGUnKS5hZGRDbGFzcygnbG9naW4nKTtcclxuXHRcdGZvciAobGV0IGkgb2YgcmVzKSB7XHJcblx0XHRcdHR5cGUrKztcclxuXHRcdFx0Zm9yIChsZXQgaiBvZiBpKSB7XHJcblx0XHRcdFx0b3B0aW9ucyArPSBgPG9wdGlvbiBhdHRyLXR5cGU9XCIke3R5cGV9XCIgdmFsdWU9XCIke2ouaWR9XCI+JHtqLm5hbWV9PC9vcHRpb24+YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnYXNpZGUgLnN0ZXAxIHNlbGVjdCcpLmFwcGVuZChvcHRpb25zKTtcclxuXHRcdCQoJ2FzaWRlIHNlbGVjdCcpLnNlbGVjdDIoKTtcclxuXHRcdC8vICQoJ2FzaWRlIHNlbGVjdCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdC8vIFx0bGV0IHR5cGUgPSAkKHRoaXMpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmF0dHIoJ2F0dHItdHlwZScpO1xyXG5cdFx0Ly8gXHRmYi5zZWxlY3RQYWdlKGV2ZW50LnRhcmdldC52YWx1ZSwgdHlwZSk7XHJcblx0XHQvLyB9KTtcclxuXHR9LFxyXG5cdHNlbGVjdFBhZ2U6ICgpID0+IHtcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCB0YXIgPSAkKCdhc2lkZSBzZWxlY3QnKTtcclxuXHRcdGxldCB0eXBlID0gdGFyLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmF0dHIoJ2F0dHItdHlwZScpO1xyXG5cdFx0aWYgKHR5cGUgPT0gMSkge1xyXG5cdFx0XHRmYi5zZXRUb2tlbih0YXIuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuYXR0cigndmFsdWUnKSk7XHJcblx0XHR9XHJcblx0XHRmYi5mZWVkKHRhci52YWwoKSwgdHlwZSwgZmIubmV4dCk7XHJcblx0fSxcclxuXHRzZXRUb2tlbjogKHBhZ2VpZCkgPT4ge1xyXG5cdFx0bGV0IHBhZ2VzID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5sb2dpbilbMV07XHJcblx0XHRmb3IgKGxldCBpIG9mIHBhZ2VzKSB7XHJcblx0XHRcdGlmIChpLmlkID09IHBhZ2VpZCkge1xyXG5cdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSBpLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZmVlZDogKHBhZ2VJRCwgdHlwZSwgdXJsID0gJycsIGNsZWFyID0gdHJ1ZSkgPT4ge1xyXG5cdFx0JCgnYnV0dG9uLnN0YXJ0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJykudGV4dCgnTG9hZGluZy4uLicpO1xyXG5cdFx0bGV0IGNvbW1hbmQgPSAnZmVlZCc7XHJcblx0XHRsZXQgYXBpO1xyXG5cdFx0bGV0IHN0YXJ0ID0gTWF0aC5mbG9vcihEYXRlLnBhcnNlKCQoJyNzdGFydF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5LW1tLWRkJykpIC8gMTAwMCk7XHJcblx0XHRsZXQgZW5kID0gTWF0aC5mbG9vcihEYXRlLnBhcnNlKCQoJyNlbmRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS1tbS1kZCcpKSAvIDEwMDApO1xyXG5cdFx0Ly8xNDY4NDY2OTkwMDk3NjIzXHJcblx0XHRpZiAodXJsID09ICcnKSB7XHJcblx0XHRcdGFwaSA9IGAke3BhZ2VJRH0vJHtjb21tYW5kfT9zaW5jZT0ke3N0YXJ0fSZ1bnRpbD0ke2VuZH0mZmllbGRzPWxpbmssZnVsbF9waWN0dXJlLGNyZWF0ZWRfdGltZSxtZXNzYWdlJmxpbWl0PTEwMGA7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhcGkgPSB1cmw7XHJcblx0XHR9XHJcblx0XHRGQi5hcGkoYC8ke3BhZ2VJRH0/ZmllbGRzPWFjY2Vzc190b2tlbmAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pIHtcclxuXHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gcmVzLmFjY2Vzc190b2tlbjtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRGQi5hcGkoYXBpLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlcyk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGFwaSk7XHJcblx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0ZmIuZmVlZHMgPSByZXMuZGF0YTtcclxuXHRcdFx0XHRpZiAocmVzLnBhZ2luZykge1xyXG5cdFx0XHRcdFx0bmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRkYXRhLnN0YXJ0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFsZXJ0KCfmspLmnInos4fmlpknKTtcclxuXHRcdFx0XHQkKCdidXR0b24uc3RhcnQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS50ZXh0KCfplovlp4snKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0XHRmdW5jdGlvbiBuZXh0KHVybCkge1xyXG5cdFx0XHRpZiAodXJsKSB7XHJcblx0XHRcdFx0JC5nZXQodXJsLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0ZmIuZmVlZHMucHVzaChpKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAocmVzLnBhZ2luZykge1xyXG5cdFx0XHRcdFx0XHRcdG5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRkYXRhLnN0YXJ0KCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGRhdGEuc3RhcnQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkYXRhLnN0YXJ0KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldE1lOiAoKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZWAsIChyZXMpID0+IHtcclxuXHRcdFx0XHRsZXQgYXJyID0gW3Jlc107XHJcblx0XHRcdFx0cmVzb2x2ZShhcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0UGFnZTogKCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvYWNjb3VudHM/bGltaXQ9MTAwYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0R3JvdXA6ICgpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwcz9saW1pdD0xMDAmZmllbGRzPWFkbWluaXN0cmF0b3IsbmFtZWAsIChyZXMpID0+IHtcclxuXHRcdFx0XHRsZXQgZ3JvdXBzID0gW107XHJcblx0XHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdGlmIChpLmFkbWluaXN0cmF0b3IpIGdyb3Vwcy5wdXNoKGkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXNvbHZlKGdyb3Vwcyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXROYW1lOiAoaWRzKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8/aWRzPSR7aWRzLnRvU3RyaW5nKCl9YCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdHJlc29sdmUocmVzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0cHJvbWlzZV9hcnJheTogW10sXHJcblx0ZmluYWxBcnJheTogW10sXHJcblx0ZGF0ZVJhbmdlOiB7fSxcclxuXHRpbml0OiAoKSA9PiB7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0XHRkYXRhLnByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdGRhdGEucmF3ID0gW107XHJcblx0fSxcclxuXHRkYXRlQ2hlY2s6ICgpID0+IHtcclxuXHRcdGxldCBzdGFydCA9ICQoJyNzdGFydF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5LW1tLWRkJyk7XHJcblx0XHRsZXQgZW5kID0gJCgnI2VuZF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5LW1tLWRkJyk7XHJcblx0XHRsZXQgbWVzc2FnZSA9ICcnO1xyXG5cdFx0aWYgKHN0YXJ0ID09ICcnIHx8IGVuZCA9PSAnJykge1xyXG5cdFx0XHRtZXNzYWdlID0gJ+iri+mBuOaTh+aXpeacnyc7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgZDEgPSBuZXcgRGF0ZSgkKCcjc3RhcnRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnKS5waWNrKTtcclxuXHRcdFx0bGV0IGQyID0gbmV3IERhdGUoJCgnI2VuZF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcpLnBpY2spO1xyXG5cdFx0XHRpZiAoZDIgLSBkMSA+IDUxODQwMDAwMDApIHtcclxuXHRcdFx0XHRtZXNzYWdlID0gJ+aXpeacn+WNgOmWk+S4jeiDvei2hemBjjYw5aSpJztcclxuXHRcdFx0XHQvLyBsZXQgdGVtcCA9IHN0YXJ0O1xyXG5cdFx0XHRcdC8vIHN0YXJ0ID0gZW5kO1xyXG5cdFx0XHRcdC8vIGVuZCA9IHRlbXA7XHJcblx0XHRcdH0gZWxzZSBpZiAoZDIgPCBkMSkge1xyXG5cdFx0XHRcdGxldCB0ZW1wID0gc3RhcnQ7XHJcblx0XHRcdFx0c3RhcnQgPSBlbmQ7XHJcblx0XHRcdFx0ZW5kID0gdGVtcDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKG1lc3NhZ2UgPT0gJycpIHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHQnY2hlY2snOiB0cnVlLFxyXG5cdFx0XHRcdCdyYW5nZSc6IGBzaW5jZT0ke3N0YXJ0fSZ1bnRpbD0ke2VuZH1gLFxyXG5cdFx0XHRcdCdzdHJpbmcnOiAkKCcjc3RhcnRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS9tbS9kZCcpICsgXCIgfiBcIiArICQoJyNlbmRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS9tbS9kZCcpLFxyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdCdjaGVjayc6IGZhbHNlLFxyXG5cdFx0XHRcdCdtZXNzYWdlJzogbWVzc2FnZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRzdGFydDogKCkgPT4ge1xyXG5cdFx0JCgnYnV0dG9uLnN0YXJ0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykudGV4dCgn6ZaL5aeLJyk7XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdGxldCByYW5nZSA9IGRhdGEuZGF0ZUNoZWNrKCk7XHJcblx0XHRpZiAocmFuZ2UuY2hlY2sgPT09IHRydWUpIHtcclxuXHRcdFx0ZGF0YS5kYXRlUmFuZ2UgPSByYW5nZTtcclxuXHRcdFx0bGV0IGFsbCA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCBqIG9mIGZiLmZlZWRzKSB7XHJcblx0XHRcdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0XHRcdGZ1bGxJRDogai5pZCxcclxuXHRcdFx0XHRcdG9iajoge31cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHByb21pc2UgPSBkYXRhLmdldChvYmopLnRoZW4oKHJlcykgPT4ge1xyXG5cdFx0XHRcdFx0b2JqLmRhdGEgPSByZXM7XHJcblx0XHRcdFx0XHRhbGwucHVzaChvYmopO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGRhdGEucHJvbWlzZV9hcnJheS5wdXNoKHByb21pc2UpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJy5sb2FkaW5nJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdFx0UHJvbWlzZS5hbGwoZGF0YS5wcm9taXNlX2FycmF5KS50aGVuKChyZXMpID0+IHtcclxuXHRcdFx0XHRkYXRhLmNvdW50X3Njb3JlKGFsbCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YWxlcnQocmFuZ2UubWVzc2FnZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IGNvbW1hbmQgPSAnY29tbWVudHMnO1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9L2NvbW1lbnRzPyR7ZGF0YS5kYXRlUmFuZ2UucmFuZ2V9Jm9yZGVyPWNocm9ub2xvZ2ljYWwmZmllbGRzPSR7Y29uZmlnLmZpZWxkW2NvbW1hbmRdLnRvU3RyaW5nKCl9JmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59YCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdGlmIChyZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJyArIGRhdGEubm93TGVuZ3RoICsgJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKHJlcyk7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBkIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRcdGlmICghZC5pc19oaWRkZW4pIHtcclxuXHRcdFx0XHRcdFx0XHRkLmNpZCA9IGQuZnJvbS5pZCArICdfJyArIGQuaWQuc3Vic3RyKDAsIGQuaWQuaW5kZXhPZignXycpKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpIHtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0ID0gMCkge1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCkge1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsICdsaW1pdD0nICsgbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KSB7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCkgPT4ge1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y291bnRfc2NvcmU6IChhbGwpID0+IHtcclxuXHRcdC8qXHJcblx0XHRcdOeVmeiogDPliIbjgIFUQUfkuIDlgIsx5YiG77yM5pyA5aSaM+WIhlxyXG5cdFx0XHTnlZnoqIDlv4Pmg4Uy5YCLMeWIhu+8jOeEoeaineS7tumAsuS9je+8jOacgOWkmjEz5YiGXHJcblx0XHRcdOeVmeiogOeahOeVmeiogOS4gOWAizHliIbvvIzmnIDlpKc25YiGXHJcblx0XHQqL1xyXG5cdFx0bGV0IHNjb3JlX2FycmF5ID0gW107XHJcblx0XHRmb3IgKGxldCBpIG9mIGFsbCkge1xyXG5cdFx0XHRsZXQgYXJyID0gaS5kYXRhO1xyXG5cdFx0XHRsZXQgc2NvcmVfcnVsZSA9IHtcclxuXHRcdFx0XHQnY29tbWVudHMnOiAxLFxyXG5cdFx0XHRcdCdjb21tZW50c19tYXgnOiA2LFxyXG5cdFx0XHRcdCdyZWFjdGlvbnMnOiAwLjUsXHJcblx0XHRcdFx0J3JlYWN0aW9uc19tYXgnOiAxMyxcclxuXHRcdFx0XHQndGFnJzogMSxcclxuXHRcdFx0XHQndGFnX21heCc6IDNcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgc2NvcmU7XHJcblx0XHRcdGZvciAobGV0IGogb2YgYXJyKSB7XHJcblx0XHRcdFx0c2NvcmUgPSAzO1xyXG5cdFx0XHRcdHNjb3JlICs9IChqLmNvbW1lbnRfY291bnQgKiBzY29yZV9ydWxlLmNvbW1lbnRzID4gc2NvcmVfcnVsZS5jb21tZW50c19tYXgpID8gc2NvcmVfcnVsZS5jb21tZW50c19tYXggOiBqLmNvbW1lbnRfY291bnQgKiBzY29yZV9ydWxlLmNvbW1lbnRzO1xyXG5cdFx0XHRcdGxldCB1c2VyID0ge1xyXG5cdFx0XHRcdFx0J2lkJzogai5pZCxcclxuXHRcdFx0XHRcdCd1c2VyaWQnOiBqLmZyb20uaWQsXHJcblx0XHRcdFx0XHQndXNlcm5hbWUnOiBqLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdCdjb21tZW50X2NvdW50Jzogai5jb21tZW50X2NvdW50LFxyXG5cdFx0XHRcdFx0J21lc3NhZ2UnOiBqLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHQnY2lkJzogai5jaWRcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmIChqLnJlYWN0aW9ucykge1xyXG5cdFx0XHRcdFx0aWYgKGoucmVhY3Rpb25zLmRhdGEubGVuZ3RoID09PSAyNSkge1xyXG5cdFx0XHRcdFx0XHR1c2VyLmxpa2VfY291bnQgPSBqLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0XHRcdHNjb3JlICs9IHNjb3JlX3J1bGUucmVhY3Rpb25zX21heDtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHVzZXIubGlrZV9jb3VudCA9IGoucmVhY3Rpb25zLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0XHRzY29yZSArPSBNYXRoLmNlaWwoai5yZWFjdGlvbnMuZGF0YS5sZW5ndGggKiBzY29yZV9ydWxlLnJlYWN0aW9ucyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHVzZXIubGlrZV9jb3VudCA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChqLm1lc3NhZ2VfdGFncykge1xyXG5cdFx0XHRcdFx0dXNlci50YWdfY291bnQgPSBqLm1lc3NhZ2VfdGFncy5sZW5ndGhcclxuXHRcdFx0XHRcdHNjb3JlICs9IChqLm1lc3NhZ2VfdGFncy5sZW5ndGggKiBzY29yZV9ydWxlLnRhZyA+PSBzY29yZV9ydWxlLnRhZ19tYXgpID8gc2NvcmVfcnVsZS50YWdfbWF4IDogai5tZXNzYWdlX3RhZ3MubGVuZ3RoICogc2NvcmVfcnVsZS50YWc7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHVzZXIudGFnX2NvdW50ID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dXNlci5zY29yZSA9IHNjb3JlO1xyXG5cdFx0XHRcdHNjb3JlX2FycmF5LnB1c2godXNlcik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIGNvbnNvbGUubG9nKHNjb3JlX2FycmF5KTtcclxuXHJcblx0XHRmdW5jdGlvbiByZW1vdmVfZHVwbGljYXRlX2NvbW1lbnQoYXJyKSB7XHJcblx0XHRcdGxldCBjaWRBcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgdGVtcCA9ICcnO1xyXG5cdFx0XHRmb3IgKGxldCBpIG9mIGFycikge1xyXG5cdFx0XHRcdGxldCBvYmogPSBpO1xyXG5cdFx0XHRcdGlmIChpLmNpZCA9PT0gdGVtcC5jaWQpIHtcclxuXHRcdFx0XHRcdGxldCB0aGlzZGF0YSA9IG9iajtcclxuXHRcdFx0XHRcdGxldCBsYXN0ID0gY2lkQXJyYXkucG9wKCk7XHJcblx0XHRcdFx0XHRpZiAodGhpc2RhdGEuc2NvcmUgPiBsYXN0LnNjb3JlKSB7XHJcblx0XHRcdFx0XHRcdGxhc3QgPSB0aGlzZGF0YTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNpZEFycmF5LnB1c2gobGFzdCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRlbXAgPSBvYmo7XHJcblx0XHRcdFx0XHRjaWRBcnJheS5wdXNoKG9iaik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBjaWRBcnJheTtcclxuXHRcdH1cclxuXHRcdGxldCBzb3J0X2FycmF5ID0gcmVtb3ZlX2R1cGxpY2F0ZV9jb21tZW50KHNjb3JlX2FycmF5LnNvcnQoKGEsIGIpID0+IGIuY2lkIC0gYS5jaWQpKTtcclxuXHRcdGRhdGEubWVyZ2VEYXRhKHNvcnRfYXJyYXkuc29ydCgoYSwgYikgPT4gYi51c2VyaWQgLSBhLnVzZXJpZCkpO1xyXG5cdH0sXHJcblx0bWVyZ2VEYXRhOiAoYXJyKSA9PiB7XHJcblx0XHRsZXQgZmluYWxBcnJheSA9IFtdO1xyXG5cdFx0bGV0IHRlbXAgPSAnJztcclxuXHRcdGZvciAobGV0IGkgb2YgYXJyKSB7XHJcblx0XHRcdGxldCBvYmogPSBpO1xyXG5cdFx0XHRpZiAoaS51c2VyaWQgPT09IHRlbXAudXNlcmlkKSB7XHJcblx0XHRcdFx0bGV0IHRoaXNkYXRhID0gb2JqO1xyXG5cdFx0XHRcdGxldCBsYXN0ID0gZmluYWxBcnJheS5wb3AoKTtcclxuXHRcdFx0XHRsYXN0LmlkLnB1c2godGhpc2RhdGEpO1xyXG5cdFx0XHRcdGxhc3QuY29tbWVudF9jb3VudCArPSBvYmouY29tbWVudF9jb3VudDtcclxuXHRcdFx0XHRsYXN0Lmxpa2VfY291bnQgKz0gb2JqLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0bGFzdC50YWdfY291bnQgKz0gb2JqLnRhZ19jb3VudDtcclxuXHRcdFx0XHRsYXN0LnNjb3JlICs9IG9iai5zY29yZTtcclxuXHRcdFx0XHRmaW5hbEFycmF5LnB1c2gobGFzdCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGV0IHRoaXNkYXRhID0ge1xyXG5cdFx0XHRcdFx0J2lkJzogb2JqLmlkLFxyXG5cdFx0XHRcdFx0J21lc3NhZ2UnOiBvYmoubWVzc2FnZSxcclxuXHRcdFx0XHRcdCdsaWtlX2NvdW50Jzogb2JqLmxpa2VfY291bnQsXHJcblx0XHRcdFx0XHQnY29tbWVudF9jb3VudCc6IG9iai5jb21tZW50X2NvdW50LFxyXG5cdFx0XHRcdFx0J3RhZ19jb3VudCc6IG9iai50YWdfY291bnQsXHJcblx0XHRcdFx0XHQnc2NvcmUnOiBvYmouc2NvcmVcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdG9iai5pZCA9IFt0aGlzZGF0YV07XHJcblx0XHRcdFx0dGVtcCA9IG9iajtcclxuXHRcdFx0XHRmaW5hbEFycmF5LnB1c2gob2JqKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5maW5hbEFycmF5ID0gZmluYWxBcnJheS5zb3J0KChhLCBiKSA9PiBiLnNjb3JlIC0gYS5zY29yZSk7XHJcblx0XHRkYXRhLmZpbmFsQXJyYXkgPSBkYXRhLmZpbmFsQXJyYXkubWFwKChpdGVtKSA9PiB7XHJcblx0XHRcdGl0ZW0uZnJvbSA9IHtcclxuXHRcdFx0XHRcImlkXCI6IGl0ZW0udXNlcmlkLFxyXG5cdFx0XHRcdFwibmFtZVwiOiBpdGVtLnVzZXJuYW1lXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHR9KTtcclxuXHRcdGNvbnNvbGUubG9nKGRhdGEuZmluYWxBcnJheSk7XHJcblx0XHQkKCcubG9hZGluZycpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblxyXG5cdFx0bG9jYWxTdG9yYWdlLnJhbmtlciA9IEpTT04uc3RyaW5naWZ5KGRhdGEuZmluYWxBcnJheSk7XHJcblx0XHQkKCdhc2lkZScpLmFkZENsYXNzKCdmaW5pc2gnKTtcclxuXHJcblx0XHR0YWJsZS5nZW5lcmF0ZShkYXRhLmZpbmFsQXJyYXkpO1xyXG5cdFx0Y2hhcnQuZHJhdyhkYXRhLmZpbmFsQXJyYXkpO1xyXG5cdH1cclxufVxyXG5sZXQgY2hhcnQgPSB7XHJcblx0ZHJhdzogKGZpbmFsQXJyYXkpID0+IHtcclxuXHRcdGQzLnNlbGVjdChcInN2Z1wiKS5yZW1vdmUoKTtcclxuXHRcdGxldCBhcnIgPSBbXTtcclxuXHRcdGxldCB3ID0gNzUwO1xyXG5cdFx0bGV0IGNvdW50ID0gMTA7XHJcblx0XHRpZiAoZmluYWxBcnJheS5sZW5ndGggPCBjb3VudCkgY291bnQgPSBmaW5hbEFycmF5Lmxlbmd0aDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG5cdFx0XHRmaW5hbEFycmF5W2ldLmluZGV4ID0gaTtcclxuXHRcdFx0YXJyLnB1c2goZmluYWxBcnJheVtpXSk7XHJcblx0XHR9XHJcblx0XHR2YXIgbWF4U2NvcmUgPSBkMy5tYXgoYXJyLCBmdW5jdGlvbiAoZCkge1xyXG5cdFx0XHRyZXR1cm4gZC5zY29yZVxyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmxvZyhtYXhTY29yZSlcclxuXHRcdHZhciB4U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxyXG5cdFx0XHQuZG9tYWluKFswLCBtYXhTY29yZV0pXHJcblx0XHRcdC5yYW5nZShbMCwgdyAtIDgwXSk7XHJcblxyXG5cdFx0dmFyIGMgPSBkMy5zZWxlY3QoJy5jaGFydCcpLmFwcGVuZCgnc3ZnJyk7XHJcblx0XHRjLnNlbGVjdEFsbCgncmVjdCcpXHJcblx0XHRcdC5kYXRhKGFycilcclxuXHRcdFx0LmVudGVyKClcclxuXHRcdFx0LmFwcGVuZCgncmVjdCcpXHJcblx0XHRcdC5hdHRyKHtcclxuXHRcdFx0XHQnZmlsbCc6ICcjRTA5NzJBJyxcclxuXHRcdFx0XHQnd2lkdGgnOiAwLFxyXG5cdFx0XHRcdCdoZWlnaHQnOiAnMzAnLFxyXG5cdFx0XHRcdCd4JzogZnVuY3Rpb24gKGQpIHtcclxuXHRcdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J3knOiBmdW5jdGlvbiAoZCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGQuaW5kZXggKiA0MFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LnRyYW5zaXRpb24oKVxyXG5cdFx0XHQuZHVyYXRpb24oMTUwMClcclxuXHRcdFx0LmF0dHIoe1xyXG5cdFx0XHRcdCd3aWR0aCc6IGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4geFNjYWxlKGQuc2NvcmUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRjLnNlbGVjdEFsbCgndGV4dC5zY29yZScpXHJcblx0XHRcdC5kYXRhKGFycilcclxuXHRcdFx0LmVudGVyKClcclxuXHRcdFx0LmFwcGVuZCgndGV4dCcpXHJcblx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdFx0cmV0dXJuIGQuc2NvcmUgKyAn5YiGJztcclxuXHRcdFx0fSlcclxuXHRcdFx0LmF0dHIoe1xyXG5cdFx0XHRcdCdmaWxsJzogJyNlMDk3MmEnLFxyXG5cdFx0XHRcdCd4JzogMCxcclxuXHRcdFx0XHQneSc6IGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZC5pbmRleCAqIDQwICsgMjBcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC50cmFuc2l0aW9uKClcclxuXHRcdFx0LmR1cmF0aW9uKDE1MDApXHJcblx0XHRcdC5hdHRyKHtcclxuXHRcdFx0XHQneCc6IGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4geFNjYWxlKGQuc2NvcmUpICsgNDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdGMuc2VsZWN0QWxsKCd0ZXh0Lm5hbWUnKVxyXG5cdFx0XHQuZGF0YShhcnIpXHJcblx0XHRcdC5lbnRlcigpXHJcblx0XHRcdC5hcHBlbmQoJ3RleHQnKVxyXG5cdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xyXG5cdFx0XHRcdHJldHVybiBkLnVzZXJuYW1lO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuYXR0cih7XHJcblx0XHRcdFx0J2ZpbGwnOiAnI0ZGRicsXHJcblx0XHRcdFx0J3RleHQtYW5jaG9yJzogJ2VuZCcsXHJcblx0XHRcdFx0J3gnOiAwLFxyXG5cdFx0XHRcdCd5JzogZnVuY3Rpb24gKGQpIHtcclxuXHRcdFx0XHRcdHJldHVybiBkLmluZGV4ICogNDAgKyAyMFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LnRyYW5zaXRpb24oKVxyXG5cdFx0XHQuZHVyYXRpb24oMTUwMClcclxuXHRcdFx0LmF0dHIoe1xyXG5cdFx0XHRcdCd4JzogZnVuY3Rpb24gKGQpIHtcclxuXHRcdFx0XHRcdHJldHVybiB4U2NhbGUoZC5zY29yZSkgLSAxMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0Yy5zZWxlY3RBbGwoJ2ltZycpXHJcblx0XHRcdC5kYXRhKGFycilcclxuXHRcdFx0LmVudGVyKClcclxuXHRcdFx0LmFwcGVuZCgnc3ZnOmltYWdlJylcclxuXHRcdFx0LmF0dHIoe1xyXG5cdFx0XHRcdCd4bGluazpocmVmJzogZnVuY3Rpb24gKGQpIHtcclxuXHRcdFx0XHRcdHJldHVybiAnaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8nICsgZC51c2VyaWQgKyAnL3BpY3R1cmU/d2lkdGg9MzAmaGVpZ2h0PTMwJ1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0J3dpZHRoJzogMzAsXHJcblx0XHRcdFx0J2hlaWdodCc6IDMwLFxyXG5cdFx0XHRcdCd4JzogMCxcclxuXHRcdFx0XHQneSc6IGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZC5pbmRleCAqIDQwXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQudHJhbnNpdGlvbigpXHJcblx0XHRcdC5kdXJhdGlvbigxNTAwKVxyXG5cdFx0XHQuYXR0cih7XHJcblx0XHRcdFx0J3gnOiBmdW5jdGlvbiAoZCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHhTY2FsZShkLnNjb3JlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdH1cclxufVxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKSA9PiB7XHJcblx0XHQkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKCcucmVzdWx0IC5pbmZvIC5hbGxfcGVvcGxlIHNwYW4nKS50ZXh0KHJhd2RhdGEubGVuZ3RoKTtcclxuXHRcdCQoJy5yZXN1bHQgLmluZm8gLmRhdGVfcmFuZ2Ugc3BhbicpLnRleHQoZGF0YS5kYXRlUmFuZ2Uuc3RyaW5nKTtcclxuXHRcdGxldCBjb3VudCA9IDE7XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGZvciAobGV0IGkgb2YgcmF3ZGF0YSkge1xyXG5cdFx0XHR0Ym9keSArPSBgPHRyPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+JHtjb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7aS51c2VyaWR9XCIgdGFyZ2V0PV9ibGFuaz4ke2kudXNlcm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZD4ke2kuc2NvcmV9PC90ZD48dGQ+PGJ1dHRvbiBvbmNsaWNrPVwicG9wdXAuc2hvdygnJHtpLnVzZXJpZH0nKVwiPuips+e0sOizh+ioijwvYnV0dG9uPjwvdGQ+XHJcblx0XHRcdFx0XHQgIDwvdHI+YDtcclxuXHRcdFx0Y291bnQrKztcclxuXHRcdH1cclxuXHRcdCQoXCIudGFibGVzIHRhYmxlIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keSk7XHJcblxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCkge1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKSA9PiB7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcbmxldCBwb3B1cCA9IHtcclxuXHRzaG93OiAodGFyKSA9PiB7XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGZvciAobGV0IGkgb2YgZGF0YS5maW5hbEFycmF5KSB7XHJcblx0XHRcdGlmICh0YXIgPT0gaS51c2VyaWQpIHtcclxuXHRcdFx0XHRsZXQgY291bnQgPSAxO1xyXG5cdFx0XHRcdCQoJy5wb3B1cCBwIHNwYW4nKS50ZXh0KGkudXNlcm5hbWUpO1xyXG5cdFx0XHRcdGZvciAobGV0IGogb2YgaS5pZCkge1xyXG5cdFx0XHRcdFx0bGV0IG1lc3NhZ2UgPSBqLm1lc3NhZ2U7XHJcblx0XHRcdFx0XHRpZiAobWVzc2FnZSA9PSAnJykgbWVzc2FnZSA9ICc9PT09PeeEoeWFp+aWhz09PT09JztcclxuXHRcdFx0XHRcdHRib2R5ICs9IGA8dHI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtjb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke2ouaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHttZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai5jb21tZW50X2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLnRhZ19jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLnNjb3JlfTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0ICA8L3RyPmA7XHJcblx0XHRcdFx0XHRjb3VudCsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkKFwiLnBvcHVwIHRhYmxlIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJy5wb3B1cCcpLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0fSxcclxuXHRoaWRlOiAoKSA9PiB7XHJcblx0XHQkKCcucG9wdXAnKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gb2JqMkFycmF5KG9iaikge1xyXG5cdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG5cdFx0cmV0dXJuIFt2YWx1ZV07XHJcblx0fSk7XHJcblx0cmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcblx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG5cdHZhciBpLCByLCB0O1xyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdGFyeVtpXSA9IGk7XHJcblx0fVxyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuXHRcdHQgPSBhcnlbcl07XHJcblx0XHRhcnlbcl0gPSBhcnlbaV07XHJcblx0XHRhcnlbaV0gPSB0O1xyXG5cdH1cclxuXHRyZXR1cm4gYXJ5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuXHQvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG5cdHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuXHJcblx0dmFyIENTViA9ICcnO1xyXG5cdC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG5cclxuXHQvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcblx0Ly9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuXHRpZiAoU2hvd0xhYmVsKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcblx0XHRmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcblxyXG5cdFx0XHQvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG5cdFx0XHRyb3cgKz0gaW5kZXggKyAnLCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuXHJcblx0XHQvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHQvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciByb3cgPSBcIlwiO1xyXG5cclxuXHRcdC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG5cdFx0XHRyb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuXHJcblx0XHQvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuXHRcdENTViArPSByb3cgKyAnXFxyXFxuJztcclxuXHR9XHJcblxyXG5cdGlmIChDU1YgPT0gJycpIHtcclxuXHRcdGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG5cdHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcblx0Ly90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcblx0ZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLCBcIl9cIik7XHJcblxyXG5cdC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcblx0dmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuXHJcblx0Ly8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcblx0Ly8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuXHQvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuXHQvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG5cclxuXHQvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuXHRsaW5rLmhyZWYgPSB1cmk7XHJcblxyXG5cdC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcblx0bGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuXHRsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuXHJcblx0Ly90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG5cdGxpbmsuY2xpY2soKTtcclxuXHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il19
