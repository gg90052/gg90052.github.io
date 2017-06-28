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
		group: 'v2.3',
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
  	留言心情十個1分，無條件進位，最多3分
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
					'reactions': 0.1,
					'reactions_max': 3,
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

				tbody += "<tr>\n\t\t\t\t\t\t<td>" + count + "</td>\n\t\t\t\t\t\t<td><a href=\"http://www.facebook.com/" + i.userid + "\" target=_blank>" + i.username + "</a></td>\n\t\t\t\t\t\t<td onclick=\"popup.show('" + i.userid + "')\">" + i.score + "</td>\n\t\t\t\t\t\t<td><button>\u96B1\u85CF</button></td>\n\t\t\t\t\t  </tr>";
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
							tbody += "<tr>\n\t\t\t\t\t\t\t\t<td>" + count + "</td>\n\t\t\t\t\t\t\t\t<td><a href=\"http://www.facebook.com/" + j.id + "\" target=\"_blank\">" + message + "</a></td>\n\t\t\t\t\t\t\t\t<td>" + j.comment_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.tag_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.like_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.score + "</td>\n\t\t\t\t\t\t\t\t<td><button>\u96B1\u85CF</button></td>\n\t\t\t\t\t\t\t  </tr>";
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImNvbmZpZyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsImF1dGgiLCJleHRlbnNpb24iLCJmYiIsIm5leHQiLCJmZWVkcyIsImdldEF1dGgiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzdGFydCIsInN3YWwiLCJkb25lIiwiZmJpZCIsImluaXQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0TWUiLCJnZXRQYWdlIiwiZ2V0R3JvdXAiLCJ0aGVuIiwicmVzIiwic2Vzc2lvblN0b3JhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2VuT3B0aW9uIiwib3B0aW9ucyIsImFkZENsYXNzIiwiaSIsImoiLCJpZCIsIm5hbWUiLCJhcHBlbmQiLCJzZWxlY3QyIiwic2VsZWN0UGFnZSIsInRhciIsImZpbmQiLCJhdHRyIiwidmFsIiwicGFnZUlEIiwiY2xlYXIiLCJjb21tYW5kIiwiYXBpIiwiZGF0YSIsInJlc29sdmUiLCJyZWplY3QiLCJhcnIiLCJnZXROYW1lIiwiaWRzIiwidG9TdHJpbmciLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJwcm9taXNlX2FycmF5IiwiZmluYWxBcnJheSIsImRhdGVSYW5nZSIsInRleHQiLCJyYXciLCJkYXRlQ2hlY2siLCJwaWNrYWRhdGUiLCJnZXQiLCJlbmQiLCJtZXNzYWdlIiwiZDEiLCJEYXRlIiwicGljayIsImQyIiwidGVtcCIsInJhbmdlIiwiY2hlY2siLCJvYmoiLCJmdWxsSUQiLCJwcm9taXNlIiwicHVzaCIsImNvdW50X3Njb3JlIiwiYWxlcnQiLCJkYXRhcyIsImxlbmd0aCIsImQiLCJpc19oaWRkZW4iLCJjaWQiLCJmcm9tIiwic3Vic3RyIiwicGFnaW5nIiwiZ2V0TmV4dCIsInJlcGxhY2UiLCJnZXRKU09OIiwiZmFpbCIsInNjb3JlX2FycmF5Iiwic2NvcmVfcnVsZSIsInNjb3JlIiwiY29tbWVudF9jb3VudCIsImNvbW1lbnRzX21heCIsInVzZXIiLCJsaWtlX2NvdW50IiwicmVhY3Rpb25zX21heCIsIk1hdGgiLCJjZWlsIiwibWVzc2FnZV90YWdzIiwidGFnX2NvdW50IiwidGFnIiwidGFnX21heCIsInJlbW92ZV9kdXBsaWNhdGVfY29tbWVudCIsImNpZEFycmF5IiwidGhpc2RhdGEiLCJsYXN0IiwicG9wIiwic29ydF9hcnJheSIsInNvcnQiLCJhIiwiYiIsIm1lcmdlRGF0YSIsInJlbW92ZUNsYXNzIiwidGFibGUiLCJnZW5lcmF0ZSIsInJhd2RhdGEiLCJEYXRhVGFibGUiLCJkZXN0cm95Iiwic3RyaW5nIiwiY291bnQiLCJ0Ym9keSIsInVzZXJuYW1lIiwiaHRtbCIsImFjdGl2ZSIsInJlZG8iLCJmaWx0ZXIiLCJwb3B1cCIsInNob3ciLCJoaWRlIiwib2JqMkFycmF5IiwiYXJyYXkiLCJtYXAiLCJ2YWx1ZSIsImluZGV4IiwiZ2VuUmFuZG9tQXJyYXkiLCJuIiwiYXJ5IiwiQXJyYXkiLCJyIiwidCIsImZsb29yIiwicmFuZG9tIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJwYXJzZSIsIkNTViIsInJvdyIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJsaW5rIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hp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LEdBQXBDLEVBQXlDO0FBQ3JDLE1BQUl3SCxNQUFNLEVBQVY7O0FBRUE7QUFDQSxPQUFLLElBQUloQixLQUFULElBQWtCYSxRQUFRckgsQ0FBUixDQUFsQixFQUE4QjtBQUMxQndILFVBQU8sTUFBTUgsUUFBUXJILENBQVIsRUFBV3dHLEtBQVgsQ0FBTixHQUEwQixJQUFqQztBQUNIOztBQUVEZ0IsTUFBSUMsS0FBSixDQUFVLENBQVYsRUFBYUQsSUFBSXhFLE1BQUosR0FBYSxDQUExQjs7QUFFQTtBQUNBdUUsU0FBT0MsTUFBTSxNQUFiO0FBQ0g7O0FBRUQsS0FBSUQsT0FBTyxFQUFYLEVBQWU7QUFDWHpFLFFBQU0sY0FBTjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxLQUFJNEUsV0FBVyxFQUFmO0FBQ0E7QUFDQUEsYUFBWVAsWUFBWTNELE9BQVosQ0FBb0IsSUFBcEIsRUFBeUIsR0FBekIsQ0FBWjs7QUFFQTtBQUNBLEtBQUltRSxNQUFNLHVDQUF1Q0MsVUFBVUwsR0FBVixDQUFqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUlNLE9BQU9DLFNBQVNDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBRixNQUFLRyxJQUFMLEdBQVlMLEdBQVo7O0FBRUE7QUFDQUUsTUFBS0ksS0FBTCxHQUFhLG1CQUFiO0FBQ0FKLE1BQUtLLFFBQUwsR0FBZ0JSLFdBQVcsTUFBM0I7O0FBRUE7QUFDQUksVUFBU0ssSUFBVCxDQUFjQyxXQUFkLENBQTBCUCxJQUExQjtBQUNBQSxNQUFLUSxLQUFMO0FBQ0FQLFVBQVNLLElBQVQsQ0FBY0csV0FBZCxDQUEwQlQsSUFBMUI7QUFDSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvcj1oYW5kbGVFcnJcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXHJcbntcclxuXHRpZiAoIWVycm9yTWVzc2FnZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2Zyb20nLCdsaWtlX2NvdW50JywnY29tbWVudF9jb3VudCcsJ3JlYWN0aW9ucycsJ2lzX2hpZGRlbicsJ21lc3NhZ2UnLCdtZXNzYWdlX3RhZ3MnXSxcclxuXHRcdHJlYWN0aW9uczogW10sXHJcblx0XHRzaGFyZWRwb3N0czogWydzdG9yeScsJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogW11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3YyLjcnLFxyXG5cdFx0cmVhY3Rpb25zOiAndjIuNycsXHJcblx0XHRzaGFyZWRwb3N0czogJ3YyLjMnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjIuNycsXHJcblx0XHRmZWVkOiAndjIuMycsXHJcblx0XHRncm91cDogJ3YyLjMnLFxyXG5cdFx0bmV3ZXN0OiAndjIuOCdcclxuXHR9LFxyXG5cdGF1dGg6ICd1c2VyX3Bob3Rvcyx1c2VyX3Bvc3RzLHVzZXJfbWFuYWdlZF9ncm91cHMsbWFuYWdlX3BhZ2VzJyxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0bmV4dDogJycsXHJcblx0ZmVlZHM6IFtdLFxyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRsZXQgYXV0aFN0ciA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX21hbmFnZWRfZ3JvdXBzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcclxuXHRcdFx0XHRcdGZiLnN0YXJ0KCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5o6I5qyK5aSx5pWX77yM6KuL57Wm5LqI5omA5pyJ5qyK6ZmQJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRzdGFydDogKCk9PntcclxuXHRcdFByb21pc2UuYWxsKFtmYi5nZXRNZSgpLGZiLmdldFBhZ2UoKSwgZmIuZ2V0R3JvdXAoKV0pLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0c2Vzc2lvblN0b3JhZ2UubG9naW4gPSBKU09OLnN0cmluZ2lmeShyZXMpO1xyXG5cdFx0XHRmYi5nZW5PcHRpb24ocmVzKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2VuT3B0aW9uOiAocmVzKT0+e1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IG9wdGlvbnMgPSAnJztcclxuXHRcdGxldCB0eXBlID0gLTE7XHJcblx0XHQkKCdhc2lkZScpLmFkZENsYXNzKCdsb2dpbicpO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHJlcyl7XHJcblx0XHRcdHR5cGUrKztcclxuXHRcdFx0Zm9yKGxldCBqIG9mIGkpe1xyXG5cdFx0XHRcdG9wdGlvbnMgKz0gYDxvcHRpb24gYXR0ci10eXBlPVwiJHt0eXBlfVwiIHZhbHVlPVwiJHtqLmlkfVwiPiR7ai5uYW1lfTwvb3B0aW9uPmA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdCQoJ2FzaWRlIC5zdGVwMSBzZWxlY3QnKS5hcHBlbmQob3B0aW9ucyk7XHJcblx0XHQkKCdhc2lkZSBzZWxlY3QnKS5zZWxlY3QyKCk7XHJcblx0XHQvLyAkKCdhc2lkZSBzZWxlY3QnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHQvLyBcdGxldCB0eXBlID0gJCh0aGlzKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdC8vIFx0ZmIuc2VsZWN0UGFnZShldmVudC50YXJnZXQudmFsdWUsIHR5cGUpO1xyXG5cdFx0Ly8gfSk7XHJcblx0fSxcclxuXHRzZWxlY3RQYWdlOiAoKT0+e1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IHRhciA9ICQoJ2FzaWRlIHNlbGVjdCcpO1xyXG5cdFx0bGV0IHR5cGUgPSB0YXIuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuYXR0cignYXR0ci10eXBlJyk7XHJcblx0XHRmYi5mZWVkKHRhci52YWwoKSwgdHlwZSwgZmIubmV4dCk7XHJcblx0fSxcclxuXHRmZWVkOiAocGFnZUlELCB0eXBlLCB1cmwgPSAnJywgY2xlYXIgPSB0cnVlKT0+e1xyXG5cdFx0bGV0IGNvbW1hbmQgPSAodHlwZSA9PSAnMicpID8gJ2ZlZWQnOidwb3N0cyc7XHJcblx0XHRsZXQgYXBpO1xyXG5cdFx0Ly8xNDY4NDY2OTkwMDk3NjIzXHJcblx0XHRpZiAodXJsID09ICcnKXtcclxuXHRcdFx0YXBpID0gYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8ke3BhZ2VJRH0vJHtjb21tYW5kfT9maWVsZHM9bGluayxmdWxsX3BpY3R1cmUsY3JlYXRlZF90aW1lLG1lc3NhZ2UmbGltaXQ9NTBgO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGFwaSA9IHVybDtcclxuXHRcdH1cclxuXHRcdEZCLmFwaShhcGksZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0ZmIuZmVlZHMgPSByZXMuZGF0YTtcclxuXHRcdFx0ZGF0YS5zdGFydCgpO1xyXG5cdFx0fSlcclxuXHR9LFxyXG5cdGdldE1lOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lYCwgKHJlcyk9PntcclxuXHRcdFx0XHRsZXQgYXJyID0gW3Jlc107XHJcblx0XHRcdFx0cmVzb2x2ZShhcnIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0UGFnZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0R3JvdXA6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvZ3JvdXBzP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXROYW1lOiAoaWRzKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9Lz9pZHM9JHtpZHMudG9TdHJpbmcoKX1gLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0cHJvbWlzZV9hcnJheTogW10sXHJcblx0ZmluYWxBcnJheTogW10sXHJcblx0ZGF0ZVJhbmdlOiB7fSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0ZGF0YS5wcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdH0sXHJcblx0ZGF0ZUNoZWNrOiAoKT0+e1xyXG5cdFx0bGV0IHN0YXJ0ID0gJCgnI3N0YXJ0X2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXktbW0tZGQnKTtcclxuXHRcdGxldCBlbmQgPSAkKCcjZW5kX2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXktbW0tZGQnKTtcclxuXHRcdGxldCBtZXNzYWdlID0gJyc7XHJcblx0XHRpZiAoc3RhcnQgPT0gJycgfHwgZW5kID09ICcnKXtcclxuXHRcdFx0bWVzc2FnZSA9ICfoq4vpgbjmk4fml6XmnJ8nO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxldCBkMSA9IG5ldyBEYXRlKCQoJyNzdGFydF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcpLnBpY2spO1xyXG5cdFx0XHRsZXQgZDIgPSBuZXcgRGF0ZSgkKCcjZW5kX2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JykucGljayk7XHJcblx0XHRcdGlmIChkMi1kMSA+IDUxODQwMDAwMDApe1xyXG5cdFx0XHRcdG1lc3NhZ2UgPSAn5pel5pyf5Y2A6ZaT5LiN6IO96LaF6YGONjDlpKknO1xyXG5cdFx0XHR9ZWxzZSBpZiAoZDI8ZDEpe1xyXG5cdFx0XHRcdGxldCB0ZW1wID0gc3RhcnQ7XHJcblx0XHRcdFx0c3RhcnQgPSBlbmQ7XHJcblx0XHRcdFx0ZW5kID0gdGVtcDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKG1lc3NhZ2UgPT0gJycpe1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdCdjaGVjayc6IHRydWUsXHJcblx0XHRcdFx0J3JhbmdlJzogYHNpbmNlPSR7c3RhcnR9JnVudGlsPSR7ZW5kfWAsXHJcblx0XHRcdFx0J3N0cmluZyc6ICQoJyNzdGFydF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5L21tL2RkJykgKyBcIiB+IFwiICsgJCgnI2VuZF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5L21tL2RkJylcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0J2NoZWNrJzogZmFsc2UsXHJcblx0XHRcdFx0J21lc3NhZ2UnOiBtZXNzYWdlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoKT0+e1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRsZXQgcmFuZ2UgPSBkYXRhLmRhdGVDaGVjaygpO1xyXG5cdFx0aWYgKHJhbmdlLmNoZWNrID09PSB0cnVlKXtcclxuXHRcdFx0ZGF0YS5kYXRlUmFuZ2UgPSByYW5nZTtcclxuXHRcdFx0bGV0IGFsbCA9IFtdO1xyXG5cdFx0XHRmb3IobGV0IGogb2YgZmIuZmVlZHMpe1xyXG5cdFx0XHRcdGxldCBvYmogPSB7XHJcblx0XHRcdFx0XHRmdWxsSUQ6IGouaWQsXHJcblx0XHRcdFx0XHRvYmo6IHt9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBwcm9taXNlID0gZGF0YS5nZXQob2JqKS50aGVuKChyZXMpPT57XHJcblx0XHRcdFx0XHRvYmouZGF0YSA9IHJlcztcclxuXHRcdFx0XHRcdGFsbC5wdXNoKG9iaik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0ZGF0YS5wcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnLmxvYWRpbmcnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdFx0XHRQcm9taXNlLmFsbChkYXRhLnByb21pc2VfYXJyYXkpLnRoZW4oKCk9PntcclxuXHRcdFx0XHRkYXRhLmNvdW50X3Njb3JlKGFsbCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGFsZXJ0KHJhbmdlLm1lc3NhZ2UpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IGNvbW1hbmQgPSAnY29tbWVudHMnO1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9L2NvbW1lbnRzPyR7ZGF0YS5kYXRlUmFuZ2UucmFuZ2V9Jm9yZGVyPWNocm9ub2xvZ2ljYWwmZmllbGRzPSR7Y29uZmlnLmZpZWxkW2NvbW1hbmRdLnRvU3RyaW5nKCl9YCwocmVzKT0+e1xyXG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhyZXMpO1xyXG5cdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRpZiAoIWQuaXNfaGlkZGVuKXtcclxuXHRcdFx0XHRcdFx0ZC5jaWQgPSBkLmZyb20uaWQgKyAnXycgKyBkLmlkLnN1YnN0cigwLCBkLmlkLmluZGV4T2YoJ18nKSk7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0PTApe1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCl7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywnbGltaXQ9JytsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y291bnRfc2NvcmU6IChhbGwpPT57XHJcblx0XHQvKlxyXG5cdFx0XHTnlZnoqIAz5YiG44CBVEFH5LiA5YCLMeWIhu+8jOacgOWkmjPliIZcclxuXHRcdFx055WZ6KiA5b+D5oOF5Y2B5YCLMeWIhu+8jOeEoeaineS7tumAsuS9je+8jOacgOWkmjPliIZcclxuXHRcdFx055WZ6KiA55qE55WZ6KiA5LiA5YCLMeWIhu+8jOacgOWkpzbliIZcclxuXHRcdCovXHJcblx0XHRsZXQgc2NvcmVfYXJyYXkgPSBbXTtcclxuXHRcdGZvcihsZXQgaSBvZiBhbGwpe1xyXG5cdFx0XHRsZXQgYXJyID0gaS5kYXRhO1xyXG5cdFx0XHRsZXQgc2NvcmVfcnVsZSA9IHtcclxuXHRcdFx0XHQnY29tbWVudHMnOiAxLFxyXG5cdFx0XHRcdCdjb21tZW50c19tYXgnOiA2LFxyXG5cdFx0XHRcdCdyZWFjdGlvbnMnOiAwLjEsXHJcblx0XHRcdFx0J3JlYWN0aW9uc19tYXgnOiAzLFxyXG5cdFx0XHRcdCd0YWcnOiAxLFxyXG5cdFx0XHRcdCd0YWdfbWF4JzogM1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBzY29yZTtcclxuXHRcdFx0Zm9yKGxldCBqIG9mIGFycil7XHJcblx0XHRcdFx0c2NvcmUgPSAzO1xyXG5cdFx0XHRcdHNjb3JlICs9IChqLmNvbW1lbnRfY291bnQqc2NvcmVfcnVsZS5jb21tZW50cyA+IHNjb3JlX3J1bGUuY29tbWVudHNfbWF4KSA/IHNjb3JlX3J1bGUuY29tbWVudHNfbWF4IDogai5jb21tZW50X2NvdW50KnNjb3JlX3J1bGUuY29tbWVudHM7XHJcblx0XHRcdFx0bGV0IHVzZXIgPSB7XHJcblx0XHRcdFx0XHQnaWQnOiBqLmlkLFxyXG5cdFx0XHRcdFx0J3VzZXJpZCc6IGouZnJvbS5pZCxcclxuXHRcdFx0XHRcdCd1c2VybmFtZSc6IGouZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0J2NvbW1lbnRfY291bnQnOiBqLmNvbW1lbnRfY291bnQsXHJcblx0XHRcdFx0XHQnbWVzc2FnZSc6IGoubWVzc2FnZSxcclxuXHRcdFx0XHRcdCdjaWQnOiBqLmNpZFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYgKGoucmVhY3Rpb25zKXtcclxuXHRcdFx0XHRcdGlmIChqLnJlYWN0aW9ucy5kYXRhLmxlbmd0aCA9PT0gMjUpe1xyXG5cdFx0XHRcdFx0XHR1c2VyLmxpa2VfY291bnQgPSBqLmxpa2VfY291bnQ7XHJcblx0XHRcdFx0XHRcdHNjb3JlICs9IHNjb3JlX3J1bGUucmVhY3Rpb25zX21heDtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHR1c2VyLmxpa2VfY291bnQgPSBqLnJlYWN0aW9ucy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdFx0c2NvcmUgKz0gTWF0aC5jZWlsKGoucmVhY3Rpb25zLmRhdGEubGVuZ3RoKnNjb3JlX3J1bGUucmVhY3Rpb25zKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHVzZXIubGlrZV9jb3VudCA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChqLm1lc3NhZ2VfdGFncyl7XHJcblx0XHRcdFx0XHR1c2VyLnRhZ19jb3VudCA9IGoubWVzc2FnZV90YWdzLmxlbmd0aFxyXG5cdFx0XHRcdFx0c2NvcmUgKz0gIChqLm1lc3NhZ2VfdGFncy5sZW5ndGggKiBzY29yZV9ydWxlLnRhZyA+PSBzY29yZV9ydWxlLnRhZ19tYXgpID8gc2NvcmVfcnVsZS50YWdfbWF4IDogai5tZXNzYWdlX3RhZ3MubGVuZ3RoICogc2NvcmVfcnVsZS50YWc7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR1c2VyLnRhZ19jb3VudCA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHVzZXIuc2NvcmUgPSBzY29yZTtcclxuXHRcdFx0XHRzY29yZV9hcnJheS5wdXNoKHVzZXIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBjb25zb2xlLmxvZyhzY29yZV9hcnJheSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gcmVtb3ZlX2R1cGxpY2F0ZV9jb21tZW50KGFycil7XHJcblx0XHRcdGxldCBjaWRBcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgdGVtcCA9ICcnO1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0XHRsZXQgb2JqID0gaTtcclxuXHRcdFx0XHRpZiAoaS5jaWQgPT09IHRlbXAuY2lkKXtcclxuXHRcdFx0XHRcdGxldCB0aGlzZGF0YSA9IG9iajtcclxuXHRcdFx0XHRcdGxldCBsYXN0ID0gY2lkQXJyYXkucG9wKCk7XHJcblx0XHRcdFx0XHRpZiAodGhpc2RhdGEuc2NvcmUgPiBsYXN0LnNjb3JlKXtcclxuXHRcdFx0XHRcdFx0bGFzdCA9IHRoaXNkYXRhO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2lkQXJyYXkucHVzaChsYXN0KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRlbXAgPSBvYmo7XHJcblx0XHRcdFx0XHRjaWRBcnJheS5wdXNoKG9iaik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBjaWRBcnJheTtcclxuXHRcdH1cclxuXHRcdGxldCBzb3J0X2FycmF5ID0gcmVtb3ZlX2R1cGxpY2F0ZV9jb21tZW50KHNjb3JlX2FycmF5LnNvcnQoKGEsIGIpID0+IGIuY2lkIC0gYS5jaWQpKTtcclxuXHRcdGRhdGEubWVyZ2VEYXRhKHNvcnRfYXJyYXkuc29ydCgoYSwgYikgPT4gYi51c2VyaWQgLSBhLnVzZXJpZCkpO1xyXG5cdH0sXHJcblx0bWVyZ2VEYXRhOiAoYXJyKT0+e1xyXG5cdFx0bGV0IGZpbmFsQXJyYXkgPSBbXTtcclxuXHRcdGxldCB0ZW1wID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0bGV0IG9iaiA9IGk7XHJcblx0XHRcdGlmIChpLnVzZXJpZCA9PT0gdGVtcC51c2VyaWQpe1xyXG5cdFx0XHRcdGxldCB0aGlzZGF0YSA9IG9iajtcclxuXHRcdFx0XHRsZXQgbGFzdCA9IGZpbmFsQXJyYXkucG9wKCk7XHJcblx0XHRcdFx0bGFzdC5pZC5wdXNoKHRoaXNkYXRhKTtcclxuXHRcdFx0XHRsYXN0LmNvbW1lbnRfY291bnQgKz0gb2JqLmNvbW1lbnRfY291bnQ7XHJcblx0XHRcdFx0bGFzdC5saWtlX2NvdW50ICs9IG9iai5saWtlX2NvdW50O1xyXG5cdFx0XHRcdGxhc3QudGFnX2NvdW50ICs9IG9iai50YWdfY291bnQ7XHJcblx0XHRcdFx0bGFzdC5zY29yZSArPSBvYmouc2NvcmU7XHJcblx0XHRcdFx0ZmluYWxBcnJheS5wdXNoKGxhc3QpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgdGhpc2RhdGEgPSB7XHJcblx0XHRcdFx0XHQnaWQnOiBvYmouaWQsXHJcblx0XHRcdFx0XHQnbWVzc2FnZSc6IG9iai5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0J2xpa2VfY291bnQnOiBvYmoubGlrZV9jb3VudCxcclxuXHRcdFx0XHRcdCdjb21tZW50X2NvdW50Jzogb2JqLmNvbW1lbnRfY291bnQsXHJcblx0XHRcdFx0XHQndGFnX2NvdW50Jzogb2JqLnRhZ19jb3VudCxcclxuXHRcdFx0XHRcdCdzY29yZSc6IG9iai5zY29yZVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0b2JqLmlkID0gW3RoaXNkYXRhXTtcclxuXHRcdFx0XHR0ZW1wID0gb2JqO1xyXG5cdFx0XHRcdGZpbmFsQXJyYXkucHVzaChvYmopO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRkYXRhLmZpbmFsQXJyYXkgPSBmaW5hbEFycmF5LnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKTtcclxuXHRcdGNvbnNvbGUubG9nKGRhdGEuZmluYWxBcnJheSk7XHJcblx0XHQkKCcubG9hZGluZycpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHR0YWJsZS5nZW5lcmF0ZShkYXRhLmZpbmFsQXJyYXkpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSk9PntcclxuXHRcdCQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoJy5yZXN1bHQgLmluZm8gLmFsbF9wZW9wbGUgc3BhbicpLnRleHQocmF3ZGF0YS5sZW5ndGgpO1xyXG5cdFx0JCgnLnJlc3VsdCAuaW5mbyAuZGF0ZV9yYW5nZSBzcGFuJykudGV4dChkYXRhLmRhdGVSYW5nZS5zdHJpbmcpO1xyXG5cdFx0bGV0IGNvdW50ID0gMTtcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHJhd2RhdGEpe1xyXG5cdFx0XHR0Ym9keSArPSBgPHRyPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+JHtjb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7aS51c2VyaWR9XCIgdGFyZ2V0PV9ibGFuaz4ke2kudXNlcm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZCBvbmNsaWNrPVwicG9wdXAuc2hvdygnJHtpLnVzZXJpZH0nKVwiPiR7aS5zY29yZX08L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGJ1dHRvbj7pmrHol488L2J1dHRvbj48L3RkPlxyXG5cdFx0XHRcdFx0ICA8L3RyPmA7XHJcblx0XHRcdGNvdW50Kys7XHJcblx0XHR9XHJcblx0XHQkKFwiLnRhYmxlcyB0YWJsZSB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5sZXQgcG9wdXAgPSB7XHJcblx0c2hvdzogKHRhcik9PntcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGRhdGEuZmluYWxBcnJheSl7XHJcblx0XHRcdGlmICh0YXIgPT0gaS51c2VyaWQpe1xyXG5cdFx0XHRcdGxldCBjb3VudCA9IDE7XHJcblx0XHRcdFx0JCgnLnBvcHVwIHAgc3BhbicpLnRleHQoaS51c2VybmFtZSk7XHJcblx0XHRcdFx0Zm9yKGxldCBqIG9mIGkuaWQpe1xyXG5cdFx0XHRcdFx0bGV0IG1lc3NhZ2UgPSBqLm1lc3NhZ2U7XHJcblx0XHRcdFx0XHRpZiAobWVzc2FnZSA9PSAnJykgbWVzc2FnZSA9ICc9PT09PeeEoeWFp+aWhz09PT09JztcclxuXHRcdFx0XHRcdHRib2R5ICs9IGA8dHI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtjb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke2ouaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHttZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai5jb21tZW50X2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLnRhZ19jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLnNjb3JlfTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+PGJ1dHRvbj7pmrHol488L2J1dHRvbj48L3RkPlxyXG5cdFx0XHRcdFx0XHRcdCAgPC90cj5gO1xyXG5cdFx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JChcIi5wb3B1cCB0YWJsZSB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcucG9wdXAnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdH0sXHJcblx0aGlkZTogKCk9PntcclxuXHRcdCQoJy5wb3B1cCcpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0fVxyXG59XHJcblxyXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XHJcbiBcdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XHJcbiBcdH0pO1xyXG4gXHRyZXR1cm4gYXJyYXk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcbiBcdHZhciBpLCByLCB0O1xyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRhcnlbaV0gPSBpO1xyXG4gXHR9XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuIFx0XHR0ID0gYXJ5W3JdO1xyXG4gXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuIFx0XHRhcnlbaV0gPSB0O1xyXG4gXHR9XHJcbiBcdHJldHVybiBhcnk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG4gICAgXHJcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxyXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcbiAgICBcclxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxyXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gICBcclxuICAgIFxyXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcclxuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcclxuICAgIFxyXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcbiAgICBcclxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuICAgIFxyXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTsgICAgXHJcbiAgICBsaW5rLmhyZWYgPSB1cmk7XHJcbiAgICBcclxuICAgIC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcbiAgICBcclxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgbGluay5jbGljaygpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
