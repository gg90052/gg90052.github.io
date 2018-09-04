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
		comments: ['from', 'like_count', 'comment_count', 'is_hidden', 'message', 'message_tags'],
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
				if (authStr.indexOf('manage_pages') >= 0) {
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
			var token = config.pageToken ? '&access_token=' + config.pageToken : '';
			if (token == '') {
				fbid.fullID = fbid.fullID.split('_')[1];
			}
			FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/comments?" + data.dateRange.range + "&order=chronological&fields=" + config.field[command].toString() + token, function (res) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImNvbmZpZyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJmYiIsIm5leHQiLCJmZWVkcyIsImdldEF1dGgiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzdGFydCIsInN3YWwiLCJkb25lIiwiZmJpZCIsImluaXQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwidGhlbiIsInJlcyIsInNlc3Npb25TdG9yYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsImdlbk9wdGlvbiIsIm9wdGlvbnMiLCJhZGRDbGFzcyIsImkiLCJqIiwiaWQiLCJuYW1lIiwiYXBwZW5kIiwic2VsZWN0MiIsInNlbGVjdFBhZ2UiLCJ0YXIiLCJmaW5kIiwiYXR0ciIsInNldFRva2VuIiwidmFsIiwicGFnZWlkIiwicGFnZXMiLCJwYXJzZSIsImFjY2Vzc190b2tlbiIsInBhZ2VJRCIsImNsZWFyIiwidGV4dCIsImNvbW1hbmQiLCJhcGkiLCJNYXRoIiwiZmxvb3IiLCJEYXRlIiwicGlja2FkYXRlIiwiZ2V0IiwiZW5kIiwiZGF0YSIsImxlbmd0aCIsInBhZ2luZyIsImFsZXJ0IiwicmVtb3ZlQ2xhc3MiLCJwdXNoIiwiZ2V0TWUiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXJyIiwiZ3JvdXBzIiwiYWRtaW5pc3RyYXRvciIsImdldE5hbWUiLCJpZHMiLCJ0b1N0cmluZyIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInByb21pc2VfYXJyYXkiLCJmaW5hbEFycmF5IiwiZGF0ZVJhbmdlIiwicmF3IiwiZGF0ZUNoZWNrIiwibWVzc2FnZSIsImQxIiwicGljayIsImQyIiwidGVtcCIsInJhbmdlIiwiY2hlY2siLCJvYmoiLCJmdWxsSUQiLCJwcm9taXNlIiwiY291bnRfc2NvcmUiLCJkYXRhcyIsInRva2VuIiwic3BsaXQiLCJkIiwiaXNfaGlkZGVuIiwiY2lkIiwiZnJvbSIsInN1YnN0ciIsImdldE5leHQiLCJyZXBsYWNlIiwiZ2V0SlNPTiIsImZhaWwiLCJzY29yZV9hcnJheSIsInNjb3JlX3J1bGUiLCJzY29yZSIsImNvbW1lbnRfY291bnQiLCJjb21tZW50c19tYXgiLCJ1c2VyIiwibGlrZV9jb3VudCIsInJlYWN0aW9uc19tYXgiLCJjZWlsIiwibWVzc2FnZV90YWdzIiwidGFnX2NvdW50IiwidGFnIiwidGFnX21heCIsInJlbW92ZV9kdXBsaWNhdGVfY29tbWVudCIsImNpZEFycmF5IiwidGhpc2RhdGEiLCJsYXN0IiwicG9wIiwic29ydF9hcnJheSIsInNvcnQiLCJhIiwiYiIsIm1lcmdlRGF0YSIsIm1hcCIsIml0ZW0iLCJ1c2VybmFtZSIsImxvY2FsU3RvcmFnZSIsInJhbmtlciIsInRhYmxlIiwiZ2VuZXJhdGUiLCJjaGFydCIsImRyYXciLCJkMyIsInNlbGVjdCIsInJlbW92ZSIsInciLCJjb3VudCIsImluZGV4IiwibWF4U2NvcmUiLCJtYXgiLCJ4U2NhbGUiLCJzY2FsZSIsImxpbmVhciIsImRvbWFpbiIsImMiLCJzZWxlY3RBbGwiLCJlbnRlciIsInRyYW5zaXRpb24iLCJkdXJhdGlvbiIsInJhd2RhdGEiLCJEYXRhVGFibGUiLCJkZXN0cm95Iiwic3RyaW5nIiwidGJvZHkiLCJodG1sIiwiYWN0aXZlIiwicmVkbyIsImZpbHRlciIsInBvcHVwIiwic2hvdyIsImhpZGUiLCJvYmoyQXJyYXkiLCJhcnJheSIsInZhbHVlIiwiZ2VuUmFuZG9tQXJyYXkiLCJuIiwiYXJ5IiwiQXJyYXkiLCJyIiwidCIsInJhbmRvbSIsIkpTT05Ub0NTVkNvbnZlcnRvciIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwiQ1NWIiwicm93Iiwic2xpY2UiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImxpbmsiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNsaWNrIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0FDLE9BQU9DLE9BQVAsR0FBaUJDLFNBQWpCOztBQUVBLFNBQVNBLFNBQVQsQ0FBbUJDLEdBQW5CLEVBQXdCQyxHQUF4QixFQUE2QkMsQ0FBN0IsRUFBZ0M7QUFDL0IsS0FBSSxDQUFDTixZQUFMLEVBQW1CO0FBQ2xCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBaUQsNEJBQWpEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBOztBQUVELElBQUlXLFNBQVM7QUFDWkMsUUFBTztBQUNOQyxZQUFVLENBQUMsTUFBRCxFQUFTLFlBQVQsRUFBdUIsZUFBdkIsRUFBd0MsV0FBeEMsRUFBcUQsU0FBckQsRUFBZ0UsY0FBaEUsQ0FESjtBQUVOQyxhQUFXLEVBRkw7QUFHTkMsZUFBYSxDQUFDLE9BQUQsRUFBVSxNQUFWLEVBQWtCLGNBQWxCLENBSFA7QUFJTkMsZ0JBQWMsRUFKUjtBQUtOQyxRQUFNO0FBTEEsRUFESztBQVFaQyxRQUFPO0FBQ05MLFlBQVUsS0FESjtBQUVOQyxhQUFXLEtBRkw7QUFHTkMsZUFBYSxLQUhQO0FBSU5DLGdCQUFjLEtBSlI7QUFLTkMsUUFBTTtBQUxBLEVBUks7QUFlWkUsYUFBWTtBQUNYTixZQUFV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S0FBWCxDQUFOLEdBQTBCLElBQWpDO0FBQ0E7O0FBRUR3QyxNQUFJQyxLQUFKLENBQVUsQ0FBVixFQUFhRCxJQUFJekgsTUFBSixHQUFhLENBQTFCOztBQUVBO0FBQ0F3SCxTQUFPQyxNQUFNLE1BQWI7QUFDQTs7QUFFRCxLQUFJRCxPQUFPLEVBQVgsRUFBZTtBQUNkdEgsUUFBTSxjQUFOO0FBQ0E7QUFDQTs7QUFFRDtBQUNBLEtBQUl5SCxXQUFXLEVBQWY7QUFDQTtBQUNBQSxhQUFZTixZQUFZNUUsT0FBWixDQUFvQixJQUFwQixFQUEwQixHQUExQixDQUFaOztBQUVBO0FBQ0EsS0FBSW1GLE1BQU0sdUNBQXVDQyxVQUFVTCxHQUFWLENBQWpEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSU0sT0FBT0MsU0FBU0MsYUFBVCxDQUF1QixHQUF2QixDQUFYO0FBQ0FGLE1BQUtHLElBQUwsR0FBWUwsR0FBWjs7QUFFQTtBQUNBRSxNQUFLSSxLQUFMLEdBQWEsbUJBQWI7QUFDQUosTUFBS0ssUUFBTCxHQUFnQlIsV0FBVyxNQUEzQjs7QUFFQTtBQUNBSSxVQUFTSyxJQUFULENBQWNDLFdBQWQsQ0FBMEJQLElBQTFCO0FBQ0FBLE1BQUtRLEtBQUw7QUFDQVAsVUFBU0ssSUFBVCxDQUFjRyxXQUFkLENBQTBCVCxJQUExQjtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yID0gaGFuZGxlRXJyXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLCB1cmwsIGwpIHtcclxuXHRpZiAoIWVycm9yTWVzc2FnZSkge1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLCBcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnZnJvbScsICdsaWtlX2NvdW50JywgJ2NvbW1lbnRfY291bnQnLCAnaXNfaGlkZGVuJywgJ21lc3NhZ2UnLCAnbWVzc2FnZV90YWdzJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCAnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjMuMScsXHJcblx0XHRyZWFjdGlvbnM6ICd2My4xJyxcclxuXHRcdGZlZWQ6ICd2My4xJyxcclxuXHRcdGdyb3VwOiAndjMuMScsXHJcblx0XHRuZXdlc3Q6ICd2Mi44J1xyXG5cdH0sXHJcblx0YXV0aDogJ21hbmFnZV9wYWdlcyxncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJyxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHBhZ2VUb2tlbjogJycsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHRuZXh0OiAnJyxcclxuXHRmZWVkczogW10sXHJcblx0Z2V0QXV0aDogKHR5cGUpID0+IHtcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKSA9PiB7XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHRcdGlmICh0eXBlID09IFwiYWRkU2NvcGVcIikge1xyXG5cdFx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCkge1xyXG5cdFx0XHRcdFx0ZmIuc3RhcnQoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+aOiOasiuWkseaVl++8jOiri+e1puS6iOaJgOacieasiumZkCcsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgUGxlYXNlIGNvbnRhY3QgdGhlIGFkbWluLicsXHJcblx0XHRcdFx0XHRcdCdlcnJvcidcclxuXHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6ICgpID0+IHtcclxuXHRcdFByb21pc2UuYWxsKFtmYi5nZXRQYWdlKCksIGZiLmdldEdyb3VwKCldKS50aGVuKChyZXMpID0+IHtcclxuXHRcdFx0c2Vzc2lvblN0b3JhZ2UubG9naW4gPSBKU09OLnN0cmluZ2lmeShyZXMpO1xyXG5cdFx0XHRmYi5nZW5PcHRpb24ocmVzKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2VuT3B0aW9uOiAocmVzKSA9PiB7XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgb3B0aW9ucyA9ICcnO1xyXG5cdFx0bGV0IHR5cGUgPSAtMTtcclxuXHRcdCQoJ2FzaWRlJykuYWRkQ2xhc3MoJ2xvZ2luJyk7XHJcblx0XHRmb3IgKGxldCBpIG9mIHJlcykge1xyXG5cdFx0XHR0eXBlKys7XHJcblx0XHRcdGZvciAobGV0IGogb2YgaSkge1xyXG5cdFx0XHRcdG9wdGlvbnMgKz0gYDxvcHRpb24gYXR0ci10eXBlPVwiJHt0eXBlfVwiIHZhbHVlPVwiJHtqLmlkfVwiPiR7ai5uYW1lfTwvb3B0aW9uPmA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJ2FzaWRlIC5zdGVwMSBzZWxlY3QnKS5hcHBlbmQob3B0aW9ucyk7XHJcblx0XHQkKCdhc2lkZSBzZWxlY3QnKS5zZWxlY3QyKCk7XHJcblx0XHQvLyAkKCdhc2lkZSBzZWxlY3QnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHQvLyBcdGxldCB0eXBlID0gJCh0aGlzKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdC8vIFx0ZmIuc2VsZWN0UGFnZShldmVudC50YXJnZXQudmFsdWUsIHR5cGUpO1xyXG5cdFx0Ly8gfSk7XHJcblx0fSxcclxuXHRzZWxlY3RQYWdlOiAoKSA9PiB7XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgdGFyID0gJCgnYXNpZGUgc2VsZWN0Jyk7XHJcblx0XHRsZXQgdHlwZSA9IHRhci5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdGlmICh0eXBlID09IDEpIHtcclxuXHRcdFx0ZmIuc2V0VG9rZW4odGFyLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmF0dHIoJ3ZhbHVlJykpO1xyXG5cdFx0fVxyXG5cdFx0ZmIuZmVlZCh0YXIudmFsKCksIHR5cGUsIGZiLm5leHQpO1xyXG5cdH0sXHJcblx0c2V0VG9rZW46IChwYWdlaWQpID0+IHtcclxuXHRcdGxldCBwYWdlcyA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UubG9naW4pWzFdO1xyXG5cdFx0Zm9yIChsZXQgaSBvZiBwYWdlcykge1xyXG5cdFx0XHRpZiAoaS5pZCA9PSBwYWdlaWQpIHtcclxuXHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gaS5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdGZlZWQ6IChwYWdlSUQsIHR5cGUsIHVybCA9ICcnLCBjbGVhciA9IHRydWUpID0+IHtcclxuXHRcdCQoJ2J1dHRvbi5zdGFydCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpLnRleHQoJ0xvYWRpbmcuLi4nKTtcclxuXHRcdGxldCBjb21tYW5kID0gJ2ZlZWQnO1xyXG5cdFx0bGV0IGFwaTtcclxuXHRcdGxldCBzdGFydCA9IE1hdGguZmxvb3IoRGF0ZS5wYXJzZSgkKCcjc3RhcnRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS1tbS1kZCcpKSAvIDEwMDApO1xyXG5cdFx0bGV0IGVuZCA9IE1hdGguZmxvb3IoRGF0ZS5wYXJzZSgkKCcjZW5kX2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXktbW0tZGQnKSkgLyAxMDAwKTtcclxuXHRcdC8vMTQ2ODQ2Njk5MDA5NzYyM1xyXG5cdFx0aWYgKHVybCA9PSAnJykge1xyXG5cdFx0XHRhcGkgPSBgJHtwYWdlSUR9LyR7Y29tbWFuZH0/c2luY2U9JHtzdGFydH0mdW50aWw9JHtlbmR9JmZpZWxkcz1saW5rLGZ1bGxfcGljdHVyZSxjcmVhdGVkX3RpbWUsbWVzc2FnZSZsaW1pdD0xMDBgO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YXBpID0gdXJsO1xyXG5cdFx0fVxyXG5cdFx0RkIuYXBpKGAvJHtwYWdlSUR9P2ZpZWxkcz1hY2Nlc3NfdG9rZW5gLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdGlmIChyZXMuYWNjZXNzX3Rva2VuKSB7XHJcblx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0RkIuYXBpKGFwaSwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGZiLmZlZWRzID0gcmVzLmRhdGE7XHJcblx0XHRcdFx0aWYgKHJlcy5wYWdpbmcpIHtcclxuXHRcdFx0XHRcdG5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZGF0YS5zdGFydCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhbGVydCgn5rKS5pyJ6LOH5paZJyk7XHJcblx0XHRcdFx0JCgnYnV0dG9uLnN0YXJ0JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykudGV4dCgn6ZaL5aeLJyk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblxyXG5cdFx0ZnVuY3Rpb24gbmV4dCh1cmwpIHtcclxuXHRcdFx0aWYgKHVybCkge1xyXG5cdFx0XHRcdCQuZ2V0KHVybCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSBvZiByZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRcdGZiLmZlZWRzLnB1c2goaSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKHJlcy5wYWdpbmcpIHtcclxuXHRcdFx0XHRcdFx0XHRuZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YS5zdGFydCgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRkYXRhLnN0YXJ0KCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZGF0YS5zdGFydCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXRNZTogKCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWVgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0bGV0IGFyciA9IFtyZXNdO1xyXG5cdFx0XHRcdHJlc29sdmUoYXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldFBhZ2U6ICgpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2FjY291bnRzP2xpbWl0PTEwMGAsIChyZXMpID0+IHtcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldEdyb3VwOiAoKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9ncm91cHM/bGltaXQ9MTAwJmZpZWxkcz1hZG1pbmlzdHJhdG9yLG5hbWVgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0bGV0IGdyb3VwcyA9IFtdO1xyXG5cdFx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRpZiAoaS5hZG1pbmlzdHJhdG9yKSBncm91cHMucHVzaChpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmVzb2x2ZShncm91cHMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0TmFtZTogKGlkcykgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vP2lkcz0ke2lkcy50b1N0cmluZygpfWAsIChyZXMpID0+IHtcclxuXHRcdFx0XHRyZXNvbHZlKHJlcyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHByb21pc2VfYXJyYXk6IFtdLFxyXG5cdGZpbmFsQXJyYXk6IFtdLFxyXG5cdGRhdGVSYW5nZToge30sXHJcblx0aW5pdDogKCkgPT4ge1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0ZGF0YS5wcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdH0sXHJcblx0ZGF0ZUNoZWNrOiAoKSA9PiB7XHJcblx0XHRsZXQgc3RhcnQgPSAkKCcjc3RhcnRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS1tbS1kZCcpO1xyXG5cdFx0bGV0IGVuZCA9ICQoJyNlbmRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnLCAneXl5eS1tbS1kZCcpO1xyXG5cdFx0bGV0IG1lc3NhZ2UgPSAnJztcclxuXHRcdGlmIChzdGFydCA9PSAnJyB8fCBlbmQgPT0gJycpIHtcclxuXHRcdFx0bWVzc2FnZSA9ICfoq4vpgbjmk4fml6XmnJ8nO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IGQxID0gbmV3IERhdGUoJCgnI3N0YXJ0X2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JykucGljayk7XHJcblx0XHRcdGxldCBkMiA9IG5ldyBEYXRlKCQoJyNlbmRfZGF0ZScpLnBpY2thZGF0ZSgncGlja2VyJykuZ2V0KCdzZWxlY3QnKS5waWNrKTtcclxuXHRcdFx0aWYgKGQyIC0gZDEgPiA1MTg0MDAwMDAwKSB7XHJcblx0XHRcdFx0bWVzc2FnZSA9ICfml6XmnJ/ljYDplpPkuI3og73otoXpgY42MOWkqSc7XHJcblx0XHRcdFx0Ly8gbGV0IHRlbXAgPSBzdGFydDtcclxuXHRcdFx0XHQvLyBzdGFydCA9IGVuZDtcclxuXHRcdFx0XHQvLyBlbmQgPSB0ZW1wO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGQyIDwgZDEpIHtcclxuXHRcdFx0XHRsZXQgdGVtcCA9IHN0YXJ0O1xyXG5cdFx0XHRcdHN0YXJ0ID0gZW5kO1xyXG5cdFx0XHRcdGVuZCA9IHRlbXA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChtZXNzYWdlID09ICcnKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0J2NoZWNrJzogdHJ1ZSxcclxuXHRcdFx0XHQncmFuZ2UnOiBgc2luY2U9JHtzdGFydH0mdW50aWw9JHtlbmR9YCxcclxuXHRcdFx0XHQnc3RyaW5nJzogJCgnI3N0YXJ0X2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXkvbW0vZGQnKSArIFwiIH4gXCIgKyAkKCcjZW5kX2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXkvbW0vZGQnKSxcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHQnY2hlY2snOiBmYWxzZSxcclxuXHRcdFx0XHQnbWVzc2FnZSc6IG1lc3NhZ2VcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6ICgpID0+IHtcclxuXHRcdCQoJ2J1dHRvbi5zdGFydCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnRleHQoJ+mWi+WniycpO1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRsZXQgcmFuZ2UgPSBkYXRhLmRhdGVDaGVjaygpO1xyXG5cdFx0aWYgKHJhbmdlLmNoZWNrID09PSB0cnVlKSB7XHJcblx0XHRcdGRhdGEuZGF0ZVJhbmdlID0gcmFuZ2U7XHJcblx0XHRcdGxldCBhbGwgPSBbXTtcclxuXHRcdFx0Zm9yIChsZXQgaiBvZiBmYi5mZWVkcykge1xyXG5cdFx0XHRcdGxldCBvYmogPSB7XHJcblx0XHRcdFx0XHRmdWxsSUQ6IGouaWQsXHJcblx0XHRcdFx0XHRvYmo6IHt9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBwcm9taXNlID0gZGF0YS5nZXQob2JqKS50aGVuKChyZXMpID0+IHtcclxuXHRcdFx0XHRcdG9iai5kYXRhID0gcmVzO1xyXG5cdFx0XHRcdFx0YWxsLnB1c2gob2JqKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRkYXRhLnByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCcubG9hZGluZycpLmFkZENsYXNzKCdzaG93Jyk7XHJcblx0XHRcdFByb21pc2UuYWxsKGRhdGEucHJvbWlzZV9hcnJheSkudGhlbigocmVzKSA9PiB7XHJcblx0XHRcdFx0ZGF0YS5jb3VudF9zY29yZShhbGwpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFsZXJ0KHJhbmdlLm1lc3NhZ2UpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBjb21tYW5kID0gJ2NvbW1lbnRzJztcclxuXHRcdFx0bGV0IHRva2VuID0gKGNvbmZpZy5wYWdlVG9rZW4pID8gJyZhY2Nlc3NfdG9rZW49JyArIGNvbmZpZy5wYWdlVG9rZW46Jyc7XHJcblx0XHRcdGlmICh0b2tlbiA9PSAnJyl7XHJcblx0XHRcdFx0ZmJpZC5mdWxsSUQgPSBmYmlkLmZ1bGxJRC5zcGxpdCgnXycpWzFdO1xyXG5cdFx0XHR9XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vY29tbWVudHM/JHtkYXRhLmRhdGVSYW5nZS5yYW5nZX0mb3JkZXI9Y2hyb25vbG9naWNhbCZmaWVsZHM9JHtjb25maWcuZmllbGRbY29tbWFuZF0udG9TdHJpbmcoKX0ke3Rva2VufWAsIChyZXMpID0+IHtcclxuXHRcdFx0XHRpZiAocmVzLmRhdGEpIHtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcgKyBkYXRhLm5vd0xlbmd0aCArICcg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhyZXMpO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIWQuaXNfaGlkZGVuKSB7XHJcblx0XHRcdFx0XHRcdFx0ZC5jaWQgPSBkLmZyb20uaWQgKyAnXycgKyBkLmlkLnN1YnN0cigwLCBkLmlkLmluZGV4T2YoJ18nKSk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KSB7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdCA9IDApIHtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApIHtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCAnbGltaXQ9JyArIGxpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJyArIGRhdGEubm93TGVuZ3RoICsgJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdGZvciAobGV0IGQgb2YgcmVzLmRhdGEpIHtcclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCkge1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpID0+IHtcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNvdW50X3Njb3JlOiAoYWxsKSA9PiB7XHJcblx0XHQvKlxyXG5cdFx0XHTnlZnoqIAz5YiG44CBVEFH5LiA5YCLMeWIhu+8jOacgOWkmjPliIZcclxuXHRcdFx055WZ6KiA5b+D5oOFMuWAizHliIbvvIznhKHmop3ku7bpgLLkvY3vvIzmnIDlpJoxM+WIhlxyXG5cdFx0XHTnlZnoqIDnmoTnlZnoqIDkuIDlgIsx5YiG77yM5pyA5aSnNuWIhlxyXG5cdFx0Ki9cclxuXHRcdGxldCBzY29yZV9hcnJheSA9IFtdO1xyXG5cdFx0Zm9yIChsZXQgaSBvZiBhbGwpIHtcclxuXHRcdFx0bGV0IGFyciA9IGkuZGF0YTtcclxuXHRcdFx0bGV0IHNjb3JlX3J1bGUgPSB7XHJcblx0XHRcdFx0J2NvbW1lbnRzJzogMSxcclxuXHRcdFx0XHQnY29tbWVudHNfbWF4JzogNixcclxuXHRcdFx0XHQncmVhY3Rpb25zJzogMC41LFxyXG5cdFx0XHRcdCdyZWFjdGlvbnNfbWF4JzogMTMsXHJcblx0XHRcdFx0J3RhZyc6IDEsXHJcblx0XHRcdFx0J3RhZ19tYXgnOiAzXHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHNjb3JlO1xyXG5cdFx0XHRmb3IgKGxldCBqIG9mIGFycikge1xyXG5cdFx0XHRcdHNjb3JlID0gMztcclxuXHRcdFx0XHRzY29yZSArPSAoai5jb21tZW50X2NvdW50ICogc2NvcmVfcnVsZS5jb21tZW50cyA+IHNjb3JlX3J1bGUuY29tbWVudHNfbWF4KSA/IHNjb3JlX3J1bGUuY29tbWVudHNfbWF4IDogai5jb21tZW50X2NvdW50ICogc2NvcmVfcnVsZS5jb21tZW50cztcclxuXHRcdFx0XHRsZXQgdXNlciA9IHtcclxuXHRcdFx0XHRcdCdpZCc6IGouaWQsXHJcblx0XHRcdFx0XHQndXNlcmlkJzogai5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0J3VzZXJuYW1lJzogai5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHQnY29tbWVudF9jb3VudCc6IGouY29tbWVudF9jb3VudCxcclxuXHRcdFx0XHRcdCdtZXNzYWdlJzogai5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0J2NpZCc6IGouY2lkXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZiAoai5yZWFjdGlvbnMpIHtcclxuXHRcdFx0XHRcdGlmIChqLnJlYWN0aW9ucy5kYXRhLmxlbmd0aCA9PT0gMjUpIHtcclxuXHRcdFx0XHRcdFx0dXNlci5saWtlX2NvdW50ID0gai5saWtlX2NvdW50O1xyXG5cdFx0XHRcdFx0XHRzY29yZSArPSBzY29yZV9ydWxlLnJlYWN0aW9uc19tYXg7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR1c2VyLmxpa2VfY291bnQgPSBqLnJlYWN0aW9ucy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdFx0c2NvcmUgKz0gTWF0aC5jZWlsKGoucmVhY3Rpb25zLmRhdGEubGVuZ3RoICogc2NvcmVfcnVsZS5yZWFjdGlvbnMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR1c2VyLmxpa2VfY291bnQgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoai5tZXNzYWdlX3RhZ3MpIHtcclxuXHRcdFx0XHRcdHVzZXIudGFnX2NvdW50ID0gai5tZXNzYWdlX3RhZ3MubGVuZ3RoXHJcblx0XHRcdFx0XHRzY29yZSArPSAoai5tZXNzYWdlX3RhZ3MubGVuZ3RoICogc2NvcmVfcnVsZS50YWcgPj0gc2NvcmVfcnVsZS50YWdfbWF4KSA/IHNjb3JlX3J1bGUudGFnX21heCA6IGoubWVzc2FnZV90YWdzLmxlbmd0aCAqIHNjb3JlX3J1bGUudGFnO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR1c2VyLnRhZ19jb3VudCA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHVzZXIuc2NvcmUgPSBzY29yZTtcclxuXHRcdFx0XHRzY29yZV9hcnJheS5wdXNoKHVzZXIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBjb25zb2xlLmxvZyhzY29yZV9hcnJheSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gcmVtb3ZlX2R1cGxpY2F0ZV9jb21tZW50KGFycikge1xyXG5cdFx0XHRsZXQgY2lkQXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IHRlbXAgPSAnJztcclxuXHRcdFx0Zm9yIChsZXQgaSBvZiBhcnIpIHtcclxuXHRcdFx0XHRsZXQgb2JqID0gaTtcclxuXHRcdFx0XHRpZiAoaS5jaWQgPT09IHRlbXAuY2lkKSB7XHJcblx0XHRcdFx0XHRsZXQgdGhpc2RhdGEgPSBvYmo7XHJcblx0XHRcdFx0XHRsZXQgbGFzdCA9IGNpZEFycmF5LnBvcCgpO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXNkYXRhLnNjb3JlID4gbGFzdC5zY29yZSkge1xyXG5cdFx0XHRcdFx0XHRsYXN0ID0gdGhpc2RhdGE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjaWRBcnJheS5wdXNoKGxhc3QpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0ZW1wID0gb2JqO1xyXG5cdFx0XHRcdFx0Y2lkQXJyYXkucHVzaChvYmopO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gY2lkQXJyYXk7XHJcblx0XHR9XHJcblx0XHRsZXQgc29ydF9hcnJheSA9IHJlbW92ZV9kdXBsaWNhdGVfY29tbWVudChzY29yZV9hcnJheS5zb3J0KChhLCBiKSA9PiBiLmNpZCAtIGEuY2lkKSk7XHJcblx0XHRkYXRhLm1lcmdlRGF0YShzb3J0X2FycmF5LnNvcnQoKGEsIGIpID0+IGIudXNlcmlkIC0gYS51c2VyaWQpKTtcclxuXHR9LFxyXG5cdG1lcmdlRGF0YTogKGFycikgPT4ge1xyXG5cdFx0bGV0IGZpbmFsQXJyYXkgPSBbXTtcclxuXHRcdGxldCB0ZW1wID0gJyc7XHJcblx0XHRmb3IgKGxldCBpIG9mIGFycikge1xyXG5cdFx0XHRsZXQgb2JqID0gaTtcclxuXHRcdFx0aWYgKGkudXNlcmlkID09PSB0ZW1wLnVzZXJpZCkge1xyXG5cdFx0XHRcdGxldCB0aGlzZGF0YSA9IG9iajtcclxuXHRcdFx0XHRsZXQgbGFzdCA9IGZpbmFsQXJyYXkucG9wKCk7XHJcblx0XHRcdFx0bGFzdC5pZC5wdXNoKHRoaXNkYXRhKTtcclxuXHRcdFx0XHRsYXN0LmNvbW1lbnRfY291bnQgKz0gb2JqLmNvbW1lbnRfY291bnQ7XHJcblx0XHRcdFx0bGFzdC5saWtlX2NvdW50ICs9IG9iai5saWtlX2NvdW50O1xyXG5cdFx0XHRcdGxhc3QudGFnX2NvdW50ICs9IG9iai50YWdfY291bnQ7XHJcblx0XHRcdFx0bGFzdC5zY29yZSArPSBvYmouc2NvcmU7XHJcblx0XHRcdFx0ZmluYWxBcnJheS5wdXNoKGxhc3QpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCB0aGlzZGF0YSA9IHtcclxuXHRcdFx0XHRcdCdpZCc6IG9iai5pZCxcclxuXHRcdFx0XHRcdCdtZXNzYWdlJzogb2JqLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHQnbGlrZV9jb3VudCc6IG9iai5saWtlX2NvdW50LFxyXG5cdFx0XHRcdFx0J2NvbW1lbnRfY291bnQnOiBvYmouY29tbWVudF9jb3VudCxcclxuXHRcdFx0XHRcdCd0YWdfY291bnQnOiBvYmoudGFnX2NvdW50LFxyXG5cdFx0XHRcdFx0J3Njb3JlJzogb2JqLnNjb3JlXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRvYmouaWQgPSBbdGhpc2RhdGFdO1xyXG5cdFx0XHRcdHRlbXAgPSBvYmo7XHJcblx0XHRcdFx0ZmluYWxBcnJheS5wdXNoKG9iaik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGRhdGEuZmluYWxBcnJheSA9IGZpbmFsQXJyYXkuc29ydCgoYSwgYikgPT4gYi5zY29yZSAtIGEuc2NvcmUpO1xyXG5cdFx0ZGF0YS5maW5hbEFycmF5ID0gZGF0YS5maW5hbEFycmF5Lm1hcCgoaXRlbSkgPT4ge1xyXG5cdFx0XHRpdGVtLmZyb20gPSB7XHJcblx0XHRcdFx0XCJpZFwiOiBpdGVtLnVzZXJpZCxcclxuXHRcdFx0XHRcIm5hbWVcIjogaXRlbS51c2VybmFtZVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBpdGVtO1xyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmxvZyhkYXRhLmZpbmFsQXJyYXkpO1xyXG5cdFx0JCgnLmxvYWRpbmcnKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cclxuXHRcdGxvY2FsU3RvcmFnZS5yYW5rZXIgPSBKU09OLnN0cmluZ2lmeShkYXRhLmZpbmFsQXJyYXkpO1xyXG5cdFx0JCgnYXNpZGUnKS5hZGRDbGFzcygnZmluaXNoJyk7XHJcblxyXG5cdFx0dGFibGUuZ2VuZXJhdGUoZGF0YS5maW5hbEFycmF5KTtcclxuXHRcdGNoYXJ0LmRyYXcoZGF0YS5maW5hbEFycmF5KTtcclxuXHR9XHJcbn1cclxubGV0IGNoYXJ0ID0ge1xyXG5cdGRyYXc6IChmaW5hbEFycmF5KSA9PiB7XHJcblx0XHRkMy5zZWxlY3QoXCJzdmdcIikucmVtb3ZlKCk7XHJcblx0XHRsZXQgYXJyID0gW107XHJcblx0XHRsZXQgdyA9IDc1MDtcclxuXHRcdGxldCBjb3VudCA9IDEwO1xyXG5cdFx0aWYgKGZpbmFsQXJyYXkubGVuZ3RoIDwgY291bnQpIGNvdW50ID0gZmluYWxBcnJheS5sZW5ndGg7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuXHRcdFx0ZmluYWxBcnJheVtpXS5pbmRleCA9IGk7XHJcblx0XHRcdGFyci5wdXNoKGZpbmFsQXJyYXlbaV0pO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG1heFNjb3JlID0gZDMubWF4KGFyciwgZnVuY3Rpb24gKGQpIHtcclxuXHRcdFx0cmV0dXJuIGQuc2NvcmVcclxuXHRcdH0pO1xyXG5cdFx0Y29uc29sZS5sb2cobWF4U2NvcmUpXHJcblx0XHR2YXIgeFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcclxuXHRcdFx0LmRvbWFpbihbMCwgbWF4U2NvcmVdKVxyXG5cdFx0XHQucmFuZ2UoWzAsIHcgLSA4MF0pO1xyXG5cclxuXHRcdHZhciBjID0gZDMuc2VsZWN0KCcuY2hhcnQnKS5hcHBlbmQoJ3N2ZycpO1xyXG5cdFx0Yy5zZWxlY3RBbGwoJ3JlY3QnKVxyXG5cdFx0XHQuZGF0YShhcnIpXHJcblx0XHRcdC5lbnRlcigpXHJcblx0XHRcdC5hcHBlbmQoJ3JlY3QnKVxyXG5cdFx0XHQuYXR0cih7XHJcblx0XHRcdFx0J2ZpbGwnOiAnI0UwOTcyQScsXHJcblx0XHRcdFx0J3dpZHRoJzogMCxcclxuXHRcdFx0XHQnaGVpZ2h0JzogJzMwJyxcclxuXHRcdFx0XHQneCc6IGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCd5JzogZnVuY3Rpb24gKGQpIHtcclxuXHRcdFx0XHRcdHJldHVybiBkLmluZGV4ICogNDBcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC50cmFuc2l0aW9uKClcclxuXHRcdFx0LmR1cmF0aW9uKDE1MDApXHJcblx0XHRcdC5hdHRyKHtcclxuXHRcdFx0XHQnd2lkdGgnOiBmdW5jdGlvbiAoZCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHhTY2FsZShkLnNjb3JlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0Yy5zZWxlY3RBbGwoJ3RleHQuc2NvcmUnKVxyXG5cdFx0XHQuZGF0YShhcnIpXHJcblx0XHRcdC5lbnRlcigpXHJcblx0XHRcdC5hcHBlbmQoJ3RleHQnKVxyXG5cdFx0XHQudGV4dChmdW5jdGlvbiAoZCkge1xyXG5cdFx0XHRcdHJldHVybiBkLnNjb3JlICsgJ+WIhic7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hdHRyKHtcclxuXHRcdFx0XHQnZmlsbCc6ICcjZTA5NzJhJyxcclxuXHRcdFx0XHQneCc6IDAsXHJcblx0XHRcdFx0J3knOiBmdW5jdGlvbiAoZCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGQuaW5kZXggKiA0MCArIDIwXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQudHJhbnNpdGlvbigpXHJcblx0XHRcdC5kdXJhdGlvbigxNTAwKVxyXG5cdFx0XHQuYXR0cih7XHJcblx0XHRcdFx0J3gnOiBmdW5jdGlvbiAoZCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHhTY2FsZShkLnNjb3JlKSArIDQwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRjLnNlbGVjdEFsbCgndGV4dC5uYW1lJylcclxuXHRcdFx0LmRhdGEoYXJyKVxyXG5cdFx0XHQuZW50ZXIoKVxyXG5cdFx0XHQuYXBwZW5kKCd0ZXh0JylcclxuXHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcclxuXHRcdFx0XHRyZXR1cm4gZC51c2VybmFtZTtcclxuXHRcdFx0fSlcclxuXHRcdFx0LmF0dHIoe1xyXG5cdFx0XHRcdCdmaWxsJzogJyNGRkYnLFxyXG5cdFx0XHRcdCd0ZXh0LWFuY2hvcic6ICdlbmQnLFxyXG5cdFx0XHRcdCd4JzogMCxcclxuXHRcdFx0XHQneSc6IGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZC5pbmRleCAqIDQwICsgMjBcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC50cmFuc2l0aW9uKClcclxuXHRcdFx0LmR1cmF0aW9uKDE1MDApXHJcblx0XHRcdC5hdHRyKHtcclxuXHRcdFx0XHQneCc6IGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4geFNjYWxlKGQuc2NvcmUpIC0gMTA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdGMuc2VsZWN0QWxsKCdpbWcnKVxyXG5cdFx0XHQuZGF0YShhcnIpXHJcblx0XHRcdC5lbnRlcigpXHJcblx0XHRcdC5hcHBlbmQoJ3N2ZzppbWFnZScpXHJcblx0XHRcdC5hdHRyKHtcclxuXHRcdFx0XHQneGxpbms6aHJlZic6IGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJ2h0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJyArIGQudXNlcmlkICsgJy9waWN0dXJlP3dpZHRoPTMwJmhlaWdodD0zMCdcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdCd3aWR0aCc6IDMwLFxyXG5cdFx0XHRcdCdoZWlnaHQnOiAzMCxcclxuXHRcdFx0XHQneCc6IDAsXHJcblx0XHRcdFx0J3knOiBmdW5jdGlvbiAoZCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGQuaW5kZXggKiA0MFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LnRyYW5zaXRpb24oKVxyXG5cdFx0XHQuZHVyYXRpb24oMTUwMClcclxuXHRcdFx0LmF0dHIoe1xyXG5cdFx0XHRcdCd4JzogZnVuY3Rpb24gKGQpIHtcclxuXHRcdFx0XHRcdHJldHVybiB4U2NhbGUoZC5zY29yZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHR9XHJcbn1cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSkgPT4ge1xyXG5cdFx0JChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JCgnLnJlc3VsdCAuaW5mbyAuYWxsX3Blb3BsZSBzcGFuJykudGV4dChyYXdkYXRhLmxlbmd0aCk7XHJcblx0XHQkKCcucmVzdWx0IC5pbmZvIC5kYXRlX3JhbmdlIHNwYW4nKS50ZXh0KGRhdGEuZGF0ZVJhbmdlLnN0cmluZyk7XHJcblx0XHRsZXQgY291bnQgPSAxO1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRmb3IgKGxldCBpIG9mIHJhd2RhdGEpIHtcclxuXHRcdFx0dGJvZHkgKz0gYDx0cj5cclxuXHRcdFx0XHRcdFx0PHRkPiR7Y291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1fYmxhbms+JHtpLnVzZXJuYW1lfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+JHtpLnNjb3JlfTwvdGQ+PHRkPjxidXR0b24gb25jbGljaz1cInBvcHVwLnNob3coJyR7aS51c2VyaWR9JylcIj7oqbPntLDos4foqIo8L2J1dHRvbj48L3RkPlxyXG5cdFx0XHRcdFx0ICA8L3RyPmA7XHJcblx0XHRcdGNvdW50Kys7XHJcblx0XHR9XHJcblx0XHQkKFwiLnRhYmxlcyB0YWJsZSB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpIHtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCkgPT4ge1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5sZXQgcG9wdXAgPSB7XHJcblx0c2hvdzogKHRhcikgPT4ge1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRmb3IgKGxldCBpIG9mIGRhdGEuZmluYWxBcnJheSkge1xyXG5cdFx0XHRpZiAodGFyID09IGkudXNlcmlkKSB7XHJcblx0XHRcdFx0bGV0IGNvdW50ID0gMTtcclxuXHRcdFx0XHQkKCcucG9wdXAgcCBzcGFuJykudGV4dChpLnVzZXJuYW1lKTtcclxuXHRcdFx0XHRmb3IgKGxldCBqIG9mIGkuaWQpIHtcclxuXHRcdFx0XHRcdGxldCBtZXNzYWdlID0gai5tZXNzYWdlO1xyXG5cdFx0XHRcdFx0aWYgKG1lc3NhZ2UgPT0gJycpIG1lc3NhZ2UgPSAnPT09PT3nhKHlhafmloc9PT09PSc7XHJcblx0XHRcdFx0XHR0Ym9keSArPSBgPHRyPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7Y291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHtqLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7bWVzc2FnZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2ouY29tbWVudF9jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai50YWdfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2oubGlrZV9jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai5zY29yZX08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdCAgPC90cj5gO1xyXG5cdFx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JChcIi5wb3B1cCB0YWJsZSB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcucG9wdXAnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdH0sXHJcblx0aGlkZTogKCkgPT4ge1xyXG5cdFx0JCgnLnBvcHVwJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9iajJBcnJheShvYmopIHtcclxuXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcclxuXHRcdHJldHVybiBbdmFsdWVdO1xyXG5cdH0pO1xyXG5cdHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG5cdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuXHR2YXIgaSwgciwgdDtcclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRhcnlbaV0gPSBpO1xyXG5cdH1cclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcblx0XHR0ID0gYXJ5W3JdO1xyXG5cdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG5cdFx0YXJ5W2ldID0gdDtcclxuXHR9XHJcblx0cmV0dXJuIGFyeTtcclxufVxyXG5cclxuZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcblx0Ly9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuXHR2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcblxyXG5cdHZhciBDU1YgPSAnJztcclxuXHQvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuXHJcblx0Ly8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG5cdC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcblx0aWYgKFNob3dMYWJlbCkge1xyXG5cdFx0dmFyIHJvdyA9IFwiXCI7XHJcblxyXG5cdFx0Ly9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG5cclxuXHRcdFx0Ly9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuXHRcdFx0cm93ICs9IGluZGV4ICsgJywnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcblxyXG5cdFx0Ly9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG5cdFx0Q1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG5cdH1cclxuXHJcblx0Ly8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuXHRcdGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuXHRcdFx0cm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcblxyXG5cdFx0Ly9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHRpZiAoQ1NWID09ICcnKSB7XHJcblx0XHRhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuXHR2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG5cdC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG5cdGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZywgXCJfXCIpO1xyXG5cclxuXHQvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG5cdHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcblxyXG5cdC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG5cdC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcblx0Ly8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcblx0Ly8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuXHJcblx0Ly90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcblx0bGluay5ocmVmID0gdXJpO1xyXG5cclxuXHQvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG5cdGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcblx0bGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcblxyXG5cdC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuXHRsaW5rLmNsaWNrKCk7XHJcblx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
