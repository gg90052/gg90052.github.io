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
	filter: {
		word: '',
		react: 'all',
		endTime: nowDate()
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
			api = config.apiVersion.newest + "/" + pageID + "/" + command + "?fields=link,full_picture,created_time,message&limit=25";
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
	init: function init() {
		$(".console .message").text('');
		data.nowLength = 0;
		data.promise_array = [];
		data.raw = [];
	},
	start: function start() {
		data.init();
		$(".waiting").removeClass("hide");
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

		Promise.all(data.promise_array).then(function () {
			data.count_score(all);
		});
	},
	get: function get(fbid) {
		return new Promise(function (resolve, reject) {
			var datas = [];
			var promise_array = [];
			var command = 'comments';
			FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/comments?limit=" + config.limit[command] + "&order=chronological&fields=" + config.field[command].toString(), function (res) {
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
	finish: function finish(fbid) {
		$(".waiting").addClass("hide");
		$(".main_table").removeClass("hide");
		step.step2();
		swal('完成！', 'Done!', 'success').done();
		$('.result_area > .title span').text(fbid.fullID);
		data.raw = fbid;
		localStorage.setItem("raw", JSON.stringify(fbid));
		data.filter(data.raw, true);
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
				var _iteratorNormalCompletion7 = true;
				var _didIteratorError7 = false;
				var _iteratorError7 = undefined;

				try {
					for (var _iterator7 = arr[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
						var j = _step7.value;

						score = 3;
						score += j.comment_count * score_rule.comments > score_rule.comments_max ? score_rule.comments_max : j.comment_count * score_rule.comments;
						var user = {
							'id': j.id,
							'userid': j.from.id,
							'username': j.from.name,
							'comment_count': j.comment_count,
							'message': j.message
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

		var sort_array = score_array.sort(function (a, b) {
			return b.userid - a.userid;
		});
		data.mergeData(sort_array);
	},
	mergeData: function mergeData(arr) {
		var finalArray = [];
		var temp = '';
		var _iteratorNormalCompletion8 = true;
		var _didIteratorError8 = false;
		var _iteratorError8 = undefined;

		try {
			for (var _iterator8 = arr[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
				var i = _step8.value;

				var _obj = i;
				if (i.userid === temp.userid) {
					var thisdata = _obj;
					var last = finalArray.pop();
					last.id.push(thisdata);
					last.comment_count += _obj.comment_count;
					last.like_count += _obj.like_count;
					last.tag_count += _obj.tag_count;
					last.score += _obj.score;
					finalArray.push(last);
				} else {
					var _thisdata = {
						'id': _obj.id,
						'message': _obj.message,
						'like_count': _obj.like_count,
						'comment_count': _obj.comment_count,
						'tag_count': _obj.tag_count,
						'score': _obj.score
					};
					_obj.id = [_thisdata];
					temp = _obj;
					finalArray.push(_obj);
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

		data.finalArray = finalArray.sort(function (a, b) {
			return b.score - a.score;
		});
		console.log(data.finalArray);
		table.generate(data.finalArray);
	}
};

var table = {
	generate: function generate(rawdata) {
		$(".tables table").DataTable().destroy();
		$('.result .info .all_people span').text(rawdata.length);
		var count = 1;
		var tbody = '';
		var _iteratorNormalCompletion9 = true;
		var _didIteratorError9 = false;
		var _iteratorError9 = undefined;

		try {
			for (var _iterator9 = rawdata[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
				var i = _step9.value;

				tbody += "<tr>\n\t\t\t\t\t\t<td>" + count + "</td>\n\t\t\t\t\t\t<td><a href=\"http://www.facebook.com/" + i.userid + "\" target=_blank>" + i.username + "</a></td>\n\t\t\t\t\t\t<td onclick=\"popup.show('" + i.userid + "')\">" + i.score + "</td>\n\t\t\t\t\t\t<td><button>\u96B1\u85CF</button></td>\n\t\t\t\t\t  </tr>";
				count++;
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

		$(".tables table tbody").html('').append(tbody);

		active();

		function active() {
			var table = $(".tables table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
			// let arr = ['comments','reactions','sharedposts'];
			// for(let i of arr){
			// 	let table = $('.tables .'+i+' table').DataTable();
			// 	$(".tables ."+i+" .searchName").on( 'blur change keyup', function () {
			// 		table
			// 		.columns(1)
			// 		.search(this.value)
			// 		.draw();
			// 	});
			// 	$(".tables ."+i+" .searchComment").on( 'blur change keyup', function () {
			// 		table
			// 		.columns(2)
			// 		.search(this.value)
			// 		.draw();
			// 		config.filter.word = this.value;
			// 	});
			// }
		}
	},
	redo: function redo() {
		data.filter(data.raw, true);
	}
};
var popup = {
	show: function show(tar) {
		var tbody = '';
		var _iteratorNormalCompletion10 = true;
		var _didIteratorError10 = false;
		var _iteratorError10 = undefined;

		try {
			for (var _iterator10 = data.finalArray[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
				var i = _step10.value;

				if (tar == i.userid) {
					var count = 1;
					$('.popup p span').text(i.username);
					var _iteratorNormalCompletion11 = true;
					var _didIteratorError11 = false;
					var _iteratorError11 = undefined;

					try {
						for (var _iterator11 = i.id[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
							var j = _step11.value;

							var message = j.message;
							if (message == '') message = '=====無內文=====';
							tbody += "<tr>\n\t\t\t\t\t\t\t\t<td>" + count + "</td>\n\t\t\t\t\t\t\t\t<td><a href=\"http://www.facebook.com/" + j.id + "\" target=\"_blank\">" + message + "</a></td>\n\t\t\t\t\t\t\t\t<td>" + j.comment_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.tag_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.like_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.score + "</td>\n\t\t\t\t\t\t\t\t<td><button>\u96B1\u85CF</button></td>\n\t\t\t\t\t\t\t  </tr>";
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

					$(".popup table tbody").html('').append(tbody);
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

		$('.popup').addClass('show');
	},
	hide: function hide() {
		$('.popup').removeClass('show');
	}
};

function nowDate() {
	var a = new Date();
	var year = a.getFullYear();
	var month = a.getMonth() + 1;
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	return year + "-" + month + "-" + date + "-" + hour + "-" + min + "-" + sec;
}

function timeConverter(UNIX_timestamp) {
	var a = moment(UNIX_timestamp)._d;
	var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	if (date < 10) {
		date = "0" + date;
	}
	var hour = a.getHours();
	if (hour < 10) {
		hour = "0" + hour;
	}
	var min = a.getMinutes();
	if (min < 10) {
		min = "0" + min;
	}
	var sec = a.getSeconds();
	if (sec < 10) {
		sec = "0" + sec;
	}
	var time = year + '-' + month + '-' + date + " " + hour + ':' + min + ':' + sec;
	return time;
}

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImNvbmZpZyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsImZpbHRlciIsIndvcmQiLCJyZWFjdCIsImVuZFRpbWUiLCJub3dEYXRlIiwiYXV0aCIsImV4dGVuc2lvbiIsImZiIiwibmV4dCIsImZlZWRzIiwiZ2V0QXV0aCIsInR5cGUiLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhTdHIiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwiaW5kZXhPZiIsInN0YXJ0Iiwic3dhbCIsImRvbmUiLCJmYmlkIiwiaW5pdCIsIlByb21pc2UiLCJhbGwiLCJnZXRNZSIsImdldFBhZ2UiLCJnZXRHcm91cCIsInRoZW4iLCJyZXMiLCJzZXNzaW9uU3RvcmFnZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJnZW5PcHRpb24iLCJvcHRpb25zIiwiYWRkQ2xhc3MiLCJpIiwiaiIsImlkIiwibmFtZSIsImFwcGVuZCIsInNlbGVjdDIiLCJzZWxlY3RQYWdlIiwidGFyIiwiZmluZCIsImF0dHIiLCJ2YWwiLCJwYWdlSUQiLCJjbGVhciIsImNvbW1hbmQiLCJhcGkiLCJkYXRhIiwicmVzb2x2ZSIsInJlamVjdCIsImFyciIsImdldE5hbWUiLCJpZHMiLCJ0b1N0cmluZyIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInByb21pc2VfYXJyYXkiLCJmaW5hbEFycmF5IiwidGV4dCIsInJhdyIsInJlbW92ZUNsYXNzIiwib2JqIiwiZnVsbElEIiwicHJvbWlzZSIsImdldCIsInB1c2giLCJjb3VudF9zY29yZSIsImRhdGFzIiwibGVuZ3RoIiwiZCIsImlzX2hpZGRlbiIsInBhZ2luZyIsImdldE5leHQiLCJyZXBsYWNlIiwiZ2V0SlNPTiIsImZhaWwiLCJmaW5pc2giLCJzdGVwIiwic3RlcDIiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwic2NvcmVfYXJyYXkiLCJzY29yZV9ydWxlIiwic2NvcmUiLCJjb21tZW50X2NvdW50IiwiY29tbWVudHNfbWF4IiwidXNlciIsImZyb20iLCJtZXNzYWdlIiwibGlrZV9jb3VudCIsInJlYWN0aW9uc19tYXgiLCJNYXRoIiwiY2VpbCIsIm1lc3NhZ2VfdGFncyIsInRhZ19jb3VudCIsInRhZyIsInRhZ19tYXgiLCJzb3J0X2FycmF5Iiwic29ydCIsImEiLCJiIiwibWVyZ2VEYXRhIiwidGVtcCIsInRoaXNkYXRhIiwibGFzdCIsInBvcCIsInRhYmxlIiwiZ2VuZXJhdGUiLCJyYXdkYXRhIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImNvdW50IiwidGJvZHkiLCJ1c2VybmFtZSIsImh0bWwiLCJhY3RpdmUiLCJyZWRvIiwicG9wdXAiLCJzaG93IiwiaGlkZSIsIkRhdGUiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsInRpbWVDb252ZXJ0ZXIiLCJVTklYX3RpbWVzdGFtcCIsIm1vbWVudCIsIl9kIiwibW9udGhzIiwidGltZSIsIm9iajJBcnJheSIsImFycmF5IiwibWFwIiwidmFsdWUiLCJpbmRleCIsImdlblJhbmRvbUFycmF5IiwibiIsImFyeSIsIkFycmF5IiwiciIsInQiLCJmbG9vciIsInJhbmRvbSIsIkpTT05Ub0NTVkNvbnZlcnRvciIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwicGFyc2UiLCJDU1YiLCJyb3ciLCJzbGljZSIsImFsZXJ0IiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJsaW5rIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjbGljayIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBOztBQUVELElBQUlXLFNBQVM7QUFDWkMsUUFBTztBQUNOQyxZQUFVLENBQUMsTUFBRCxFQUFRLFlBQVIsRUFBcUIsZUFBckIsRUFBcUMsV0FBckMsRUFBaUQsV0FBakQsRUFBNkQsU0FBN0QsRUFBdUUsY0FBdkUsQ0FESjtBQUVOQyxhQUFXLEVBRkw7QUFHTkMsZUFBYSxDQUFDLE9BQUQsRUFBUyxNQUFULEVBQWlCLGNBQWpCLENBSFA7QUFJTkMsZ0JBQWMsRUFKUjtBQUtOQyxRQUFNO0FBTEEsRUFESztBQVFaQyxRQUFPO0FBQ05MLFlBQVUsS0FESjtBQUVOQyxhQUFXLEtBRkw7QUFHTkMsZUFBYSxLQUhQO0FBSU5DLGdCQUFjLEtBSlI7QUFLTkMsUUFBTTtBQUxBLEVBUks7QUFlWkUsYUFBWTtBQUNYTixZQUFVLE1BREM7QUFFWEMsYUFBVyxNQUZBO0FBR1hDLGVBQWEsTUFIRjtBQUlYQyxnQkFBYyxNQUpIO0FBS1hDLFFBQU0sTUFMSztBQU1YRyxTQUFPLE1BTkk7QUFPWEMsVUFBUTtBQVBHLEVBZkE7QUF3QlpDLFNBQVE7QUFDUEMsUUFBTSxFQURDO0FB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QUNIOztBQUVELEtBQUlELE9BQU8sRUFBWCxFQUFlO0FBQ1hHLFFBQU0sY0FBTjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxLQUFJQyxXQUFXLEVBQWY7QUFDQTtBQUNBQSxhQUFZUixZQUFZakYsT0FBWixDQUFvQixJQUFwQixFQUF5QixHQUF6QixDQUFaOztBQUVBO0FBQ0EsS0FBSTBGLE1BQU0sdUNBQXVDQyxVQUFVTixHQUFWLENBQWpEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSU8sT0FBT0MsU0FBU0MsYUFBVCxDQUF1QixHQUF2QixDQUFYO0FBQ0FGLE1BQUtHLElBQUwsR0FBWUwsR0FBWjs7QUFFQTtBQUNBRSxNQUFLSSxLQUFMLEdBQWEsbUJBQWI7QUFDQUosTUFBS0ssUUFBTCxHQUFnQlIsV0FBVyxNQUEzQjs7QUFFQTtBQUNBSSxVQUFTSyxJQUFULENBQWNDLFdBQWQsQ0FBMEJQLElBQTFCO0FBQ0FBLE1BQUtRLEtBQUw7QUFDQVAsVUFBU0ssSUFBVCxDQUFjRyxXQUFkLENBQTBCVCxJQUExQjtBQUNIIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZyx1cmwsbClcclxue1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKXtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIixcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnZnJvbScsJ2xpa2VfY291bnQnLCdjb21tZW50X2NvdW50JywncmVhY3Rpb25zJywnaXNfaGlkZGVuJywnbWVzc2FnZScsJ21lc3NhZ2VfdGFncyddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjIuNycsXHJcblx0XHRyZWFjdGlvbnM6ICd2Mi43JyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjIuMycsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Mi43JyxcclxuXHRcdGZlZWQ6ICd2Mi4zJyxcclxuXHRcdGdyb3VwOiAndjIuMycsXHJcblx0XHRuZXdlc3Q6ICd2Mi44J1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0YXV0aDogJ3VzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9tYW5hZ2VkX2dyb3VwcyxtYW5hZ2VfcGFnZXMnLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHRuZXh0OiAnJyxcclxuXHRmZWVkczogW10sXHJcblx0Z2V0QXV0aDogKHR5cGUpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpe1xyXG5cdFx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZignbWFuYWdlX3BhZ2VzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfbWFuYWdlZF9ncm91cHMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApe1xyXG5cdFx0XHRcdFx0ZmIuc3RhcnQoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfmjojmrIrlpLHmlZfvvIzoq4vntabkuojmiYDmnInmrIrpmZAnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxyXG5cdFx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoKT0+e1xyXG5cdFx0UHJvbWlzZS5hbGwoW2ZiLmdldE1lKCksZmIuZ2V0UGFnZSgpLCBmYi5nZXRHcm91cCgpXSkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5sb2dpbiA9IEpTT04uc3RyaW5naWZ5KHJlcyk7XHJcblx0XHRcdGZiLmdlbk9wdGlvbihyZXMpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZW5PcHRpb246IChyZXMpPT57XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgb3B0aW9ucyA9ICcnO1xyXG5cdFx0bGV0IHR5cGUgPSAtMTtcclxuXHRcdCQoJ2FzaWRlJykuYWRkQ2xhc3MoJ2xvZ2luJyk7XHJcblx0XHRmb3IobGV0IGkgb2YgcmVzKXtcclxuXHRcdFx0dHlwZSsrO1xyXG5cdFx0XHRmb3IobGV0IGogb2YgaSl7XHJcblx0XHRcdFx0b3B0aW9ucyArPSBgPG9wdGlvbiBhdHRyLXR5cGU9XCIke3R5cGV9XCIgdmFsdWU9XCIke2ouaWR9XCI+JHtqLm5hbWV9PC9vcHRpb24+YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnYXNpZGUgLnN0ZXAxIHNlbGVjdCcpLmFwcGVuZChvcHRpb25zKTtcclxuXHRcdCQoJ2FzaWRlIHNlbGVjdCcpLnNlbGVjdDIoKTtcclxuXHRcdC8vICQoJ2FzaWRlIHNlbGVjdCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdC8vIFx0bGV0IHR5cGUgPSAkKHRoaXMpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmF0dHIoJ2F0dHItdHlwZScpO1xyXG5cdFx0Ly8gXHRmYi5zZWxlY3RQYWdlKGV2ZW50LnRhcmdldC52YWx1ZSwgdHlwZSk7XHJcblx0XHQvLyB9KTtcclxuXHR9LFxyXG5cdHNlbGVjdFBhZ2U6ICgpPT57XHJcblx0XHRmYi5uZXh0ID0gJyc7XHJcblx0XHRsZXQgdGFyID0gJCgnYXNpZGUgc2VsZWN0Jyk7XHJcblx0XHRsZXQgdHlwZSA9IHRhci5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdGZiLmZlZWQodGFyLnZhbCgpLCB0eXBlLCBmYi5uZXh0KTtcclxuXHR9LFxyXG5cdGZlZWQ6IChwYWdlSUQsIHR5cGUsIHVybCA9ICcnLCBjbGVhciA9IHRydWUpPT57XHJcblx0XHRsZXQgY29tbWFuZCA9ICh0eXBlID09ICcyJykgPyAnZmVlZCc6J3Bvc3RzJztcclxuXHRcdGxldCBhcGk7XHJcblx0XHQvLzE0Njg0NjY5OTAwOTc2MjNcclxuXHRcdGlmICh1cmwgPT0gJycpe1xyXG5cdFx0XHRhcGkgPSBgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9LyR7cGFnZUlEfS8ke2NvbW1hbmR9P2ZpZWxkcz1saW5rLGZ1bGxfcGljdHVyZSxjcmVhdGVkX3RpbWUsbWVzc2FnZSZsaW1pdD0yNWA7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0YXBpID0gdXJsO1xyXG5cdFx0fVxyXG5cdFx0RkIuYXBpKGFwaSxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRmYi5mZWVkcyA9IHJlcy5kYXRhO1xyXG5cdFx0XHRkYXRhLnN0YXJ0KCk7XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0Z2V0TWU6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWVgLCAocmVzKT0+e1xyXG5cdFx0XHRcdGxldCBhcnIgPSBbcmVzXTtcclxuXHRcdFx0XHRyZXNvbHZlKGFycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRQYWdlOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2FjY291bnRzP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRHcm91cDogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9ncm91cHM/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldE5hbWU6IChpZHMpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vP2lkcz0ke2lkcy50b1N0cmluZygpfWAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwcm9taXNlX2FycmF5OiBbXSxcclxuXHRmaW5hbEFycmF5OiBbXSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0ZGF0YS5wcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdH0sXHJcblx0c3RhcnQ6ICgpPT57XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRsZXQgYWxsID0gW107XHJcblx0XHRmb3IobGV0IGogb2YgZmIuZmVlZHMpe1xyXG5cdFx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRcdGZ1bGxJRDogai5pZCxcclxuXHRcdFx0XHRvYmo6IHt9XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHByb21pc2UgPSBkYXRhLmdldChvYmopLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHRvYmouZGF0YSA9IHJlcztcclxuXHRcdFx0XHRhbGwucHVzaChvYmopO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZGF0YS5wcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0UHJvbWlzZS5hbGwoZGF0YS5wcm9taXNlX2FycmF5KS50aGVuKCgpPT57XHJcblx0XHRcdGRhdGEuY291bnRfc2NvcmUoYWxsKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IGNvbW1hbmQgPSAnY29tbWVudHMnO1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9L2NvbW1lbnRzP2xpbWl0PSR7Y29uZmlnLmxpbWl0W2NvbW1hbmRdfSZvcmRlcj1jaHJvbm9sb2dpY2FsJmZpZWxkcz0ke2NvbmZpZy5maWVsZFtjb21tYW5kXS50b1N0cmluZygpfWAsKHJlcyk9PntcclxuXHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2cocmVzKTtcclxuXHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0aWYgKCFkLmlzX2hpZGRlbil7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0PTApe1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCl7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywnbGltaXQ9JytsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZmluaXNoOiAoZmJpZCk9PntcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0c3RlcC5zdGVwMigpO1xyXG5cdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XHJcblx0XHQkKCcucmVzdWx0X2FyZWEgPiAudGl0bGUgc3BhbicpLnRleHQoZmJpZC5mdWxsSUQpO1xyXG5cdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyYXdcIiwgSlNPTi5zdHJpbmdpZnkoZmJpZCkpO1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH0sXHJcblx0Y291bnRfc2NvcmU6IChhbGwpPT57XHJcblx0XHQvKlxyXG5cdFx0XHTnlZnoqIAz5YiG44CBVEFH5LiA5YCLMeWIhu+8jOacgOWkmjPliIZcclxuXHRcdFx055WZ6KiA5b+D5oOF5Y2B5YCLMeWIhu+8jOeEoeaineS7tumAsuS9je+8jOacgOWkmjPliIZcclxuXHRcdFx055WZ6KiA55qE55WZ6KiA5LiA5YCLMeWIhu+8jOacgOWkpzbliIZcclxuXHRcdCovXHJcblx0XHRsZXQgc2NvcmVfYXJyYXkgPSBbXTtcclxuXHRcdGZvcihsZXQgaSBvZiBhbGwpe1xyXG5cdFx0XHRsZXQgYXJyID0gaS5kYXRhO1xyXG5cdFx0XHRsZXQgc2NvcmVfcnVsZSA9IHtcclxuXHRcdFx0XHQnY29tbWVudHMnOiAxLFxyXG5cdFx0XHRcdCdjb21tZW50c19tYXgnOiA2LFxyXG5cdFx0XHRcdCdyZWFjdGlvbnMnOiAwLjEsXHJcblx0XHRcdFx0J3JlYWN0aW9uc19tYXgnOiAzLFxyXG5cdFx0XHRcdCd0YWcnOiAxLFxyXG5cdFx0XHRcdCd0YWdfbWF4JzogM1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBzY29yZTtcclxuXHRcdFx0Zm9yKGxldCBqIG9mIGFycil7XHJcblx0XHRcdFx0c2NvcmUgPSAzO1xyXG5cdFx0XHRcdHNjb3JlICs9IChqLmNvbW1lbnRfY291bnQqc2NvcmVfcnVsZS5jb21tZW50cyA+IHNjb3JlX3J1bGUuY29tbWVudHNfbWF4KSA/IHNjb3JlX3J1bGUuY29tbWVudHNfbWF4IDogai5jb21tZW50X2NvdW50KnNjb3JlX3J1bGUuY29tbWVudHM7XHJcblx0XHRcdFx0bGV0IHVzZXIgPSB7XHJcblx0XHRcdFx0XHQnaWQnOiBqLmlkLFxyXG5cdFx0XHRcdFx0J3VzZXJpZCc6IGouZnJvbS5pZCxcclxuXHRcdFx0XHRcdCd1c2VybmFtZSc6IGouZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0J2NvbW1lbnRfY291bnQnOiBqLmNvbW1lbnRfY291bnQsXHJcblx0XHRcdFx0XHQnbWVzc2FnZSc6IGoubWVzc2FnZSxcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmIChqLnJlYWN0aW9ucyl7XHJcblx0XHRcdFx0XHRpZiAoai5yZWFjdGlvbnMuZGF0YS5sZW5ndGggPT09IDI1KXtcclxuXHRcdFx0XHRcdFx0dXNlci5saWtlX2NvdW50ID0gai5saWtlX2NvdW50O1xyXG5cdFx0XHRcdFx0XHRzY29yZSArPSBzY29yZV9ydWxlLnJlYWN0aW9uc19tYXg7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0dXNlci5saWtlX2NvdW50ID0gai5yZWFjdGlvbnMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdHNjb3JlICs9IE1hdGguY2VpbChqLnJlYWN0aW9ucy5kYXRhLmxlbmd0aCpzY29yZV9ydWxlLnJlYWN0aW9ucyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR1c2VyLmxpa2VfY291bnQgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoai5tZXNzYWdlX3RhZ3Mpe1xyXG5cdFx0XHRcdFx0dXNlci50YWdfY291bnQgPSBqLm1lc3NhZ2VfdGFncy5sZW5ndGhcclxuXHRcdFx0XHRcdHNjb3JlICs9ICAoai5tZXNzYWdlX3RhZ3MubGVuZ3RoICogc2NvcmVfcnVsZS50YWcgPj0gc2NvcmVfcnVsZS50YWdfbWF4KSA/IHNjb3JlX3J1bGUudGFnX21heCA6IGoubWVzc2FnZV90YWdzLmxlbmd0aCAqIHNjb3JlX3J1bGUudGFnO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dXNlci50YWdfY291bnQgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR1c2VyLnNjb3JlID0gc2NvcmU7XHJcblx0XHRcdFx0c2NvcmVfYXJyYXkucHVzaCh1c2VyKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gY29uc29sZS5sb2coc2NvcmVfYXJyYXkpO1xyXG5cdFx0bGV0IHNvcnRfYXJyYXkgPSBzY29yZV9hcnJheS5zb3J0KChhLCBiKSA9PiBiLnVzZXJpZCAtIGEudXNlcmlkKTtcclxuXHRcdGRhdGEubWVyZ2VEYXRhKHNvcnRfYXJyYXkpO1xyXG5cdH0sXHJcblx0bWVyZ2VEYXRhOiAoYXJyKT0+e1xyXG5cdFx0bGV0IGZpbmFsQXJyYXkgPSBbXTtcclxuXHRcdGxldCB0ZW1wID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgYXJyKXtcclxuXHRcdFx0bGV0IG9iaiA9IGk7XHJcblx0XHRcdGlmIChpLnVzZXJpZCA9PT0gdGVtcC51c2VyaWQpe1xyXG5cdFx0XHRcdGxldCB0aGlzZGF0YSA9IG9iajtcclxuXHRcdFx0XHRsZXQgbGFzdCA9IGZpbmFsQXJyYXkucG9wKCk7XHJcblx0XHRcdFx0bGFzdC5pZC5wdXNoKHRoaXNkYXRhKTtcclxuXHRcdFx0XHRsYXN0LmNvbW1lbnRfY291bnQgKz0gb2JqLmNvbW1lbnRfY291bnQ7XHJcblx0XHRcdFx0bGFzdC5saWtlX2NvdW50ICs9IG9iai5saWtlX2NvdW50O1xyXG5cdFx0XHRcdGxhc3QudGFnX2NvdW50ICs9IG9iai50YWdfY291bnQ7XHJcblx0XHRcdFx0bGFzdC5zY29yZSArPSBvYmouc2NvcmU7XHJcblx0XHRcdFx0ZmluYWxBcnJheS5wdXNoKGxhc3QpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgdGhpc2RhdGEgPSB7XHJcblx0XHRcdFx0XHQnaWQnOiBvYmouaWQsXHJcblx0XHRcdFx0XHQnbWVzc2FnZSc6IG9iai5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0J2xpa2VfY291bnQnOiBvYmoubGlrZV9jb3VudCxcclxuXHRcdFx0XHRcdCdjb21tZW50X2NvdW50Jzogb2JqLmNvbW1lbnRfY291bnQsXHJcblx0XHRcdFx0XHQndGFnX2NvdW50Jzogb2JqLnRhZ19jb3VudCxcclxuXHRcdFx0XHRcdCdzY29yZSc6IG9iai5zY29yZVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0b2JqLmlkID0gW3RoaXNkYXRhXTtcclxuXHRcdFx0XHR0ZW1wID0gb2JqO1xyXG5cdFx0XHRcdGZpbmFsQXJyYXkucHVzaChvYmopO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRkYXRhLmZpbmFsQXJyYXkgPSBmaW5hbEFycmF5LnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKTtcclxuXHRcdGNvbnNvbGUubG9nKGRhdGEuZmluYWxBcnJheSk7XHJcblx0XHR0YWJsZS5nZW5lcmF0ZShkYXRhLmZpbmFsQXJyYXkpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSk9PntcclxuXHRcdCQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoJy5yZXN1bHQgLmluZm8gLmFsbF9wZW9wbGUgc3BhbicpLnRleHQocmF3ZGF0YS5sZW5ndGgpO1xyXG5cdFx0bGV0IGNvdW50ID0gMTtcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIHJhd2RhdGEpe1xyXG5cdFx0XHR0Ym9keSArPSBgPHRyPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+JHtjb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7aS51c2VyaWR9XCIgdGFyZ2V0PV9ibGFuaz4ke2kudXNlcm5hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZCBvbmNsaWNrPVwicG9wdXAuc2hvdygnJHtpLnVzZXJpZH0nKVwiPiR7aS5zY29yZX08L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQ+PGJ1dHRvbj7pmrHol488L2J1dHRvbj48L3RkPlxyXG5cdFx0XHRcdFx0ICA8L3RyPmA7XHJcblx0XHRcdGNvdW50Kys7XHJcblx0XHR9XHJcblx0XHQkKFwiLnRhYmxlcyB0YWJsZSB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblx0XHRcdC8vIGxldCBhcnIgPSBbJ2NvbW1lbnRzJywncmVhY3Rpb25zJywnc2hhcmVkcG9zdHMnXTtcclxuXHRcdFx0Ly8gZm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdC8vIFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJytpKycgdGFibGUnKS5EYXRhVGFibGUoKTtcclxuXHRcdFx0Ly8gXHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQvLyBcdFx0dGFibGVcclxuXHRcdFx0Ly8gXHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdC8vIFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdC8vIFx0XHQuZHJhdygpO1xyXG5cdFx0XHQvLyBcdH0pO1xyXG5cdFx0XHQvLyBcdCQoXCIudGFibGVzIC5cIitpK1wiIC5zZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdC8vIFx0XHR0YWJsZVxyXG5cdFx0XHQvLyBcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0Ly8gXHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0Ly8gXHRcdC5kcmF3KCk7XHJcblx0XHRcdC8vIFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHQvLyBcdH0pO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5sZXQgcG9wdXAgPSB7XHJcblx0c2hvdzogKHRhcik9PntcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGRhdGEuZmluYWxBcnJheSl7XHJcblx0XHRcdGlmICh0YXIgPT0gaS51c2VyaWQpe1xyXG5cdFx0XHRcdGxldCBjb3VudCA9IDE7XHJcblx0XHRcdFx0JCgnLnBvcHVwIHAgc3BhbicpLnRleHQoaS51c2VybmFtZSk7XHJcblx0XHRcdFx0Zm9yKGxldCBqIG9mIGkuaWQpe1xyXG5cdFx0XHRcdFx0bGV0IG1lc3NhZ2UgPSBqLm1lc3NhZ2U7XHJcblx0XHRcdFx0XHRpZiAobWVzc2FnZSA9PSAnJykgbWVzc2FnZSA9ICc9PT09PeeEoeWFp+aWhz09PT09JztcclxuXHRcdFx0XHRcdHRib2R5ICs9IGA8dHI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtjb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke2ouaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHttZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai5jb21tZW50X2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLnRhZ19jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLnNjb3JlfTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+PGJ1dHRvbj7pmrHol488L2J1dHRvbj48L3RkPlxyXG5cdFx0XHRcdFx0XHRcdCAgPC90cj5gO1xyXG5cdFx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JChcIi5wb3B1cCB0YWJsZSB0Ym9keVwiKS5odG1sKCcnKS5hcHBlbmQodGJvZHkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCcucG9wdXAnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdH0sXHJcblx0aGlkZTogKCk9PntcclxuXHRcdCQoJy5wb3B1cCcpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpe1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xyXG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcbiBcdCB2YXIgbW9udGhzID0gWycwMScsJzAyJywnMDMnLCcwNCcsJzA1JywnMDYnLCcwNycsJzA4JywnMDknLCcxMCcsJzExJywnMTInXTtcclxuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuICAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG4gICAgIGlmIChkYXRlIDwgMTApe1xyXG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XHJcbiAgICAgfVxyXG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG4gICAgIGlmIChob3VyIDwgMTApe1xyXG4gICAgIFx0aG91ciA9IFwiMFwiK2hvdXI7XHJcbiAgICAgfVxyXG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuICAgICBpZiAobWluIDwgMTApe1xyXG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xyXG4gICAgIH1cclxuICAgICB2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcbiAgICAgaWYgKHNlYyA8IDEwKXtcclxuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcclxuICAgICB9XHJcbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XHJcbiAgICAgcmV0dXJuIHRpbWU7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XHJcbiBcdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XHJcbiBcdH0pO1xyXG4gXHRyZXR1cm4gYXJyYXk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcbiBcdHZhciBpLCByLCB0O1xyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRhcnlbaV0gPSBpO1xyXG4gXHR9XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuIFx0XHR0ID0gYXJ5W3JdO1xyXG4gXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuIFx0XHRhcnlbaV0gPSB0O1xyXG4gXHR9XHJcbiBcdHJldHVybiBhcnk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG4gICAgXHJcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxyXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcbiAgICBcclxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxyXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gICBcclxuICAgIFxyXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcclxuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcclxuICAgIFxyXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcbiAgICBcclxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuICAgIFxyXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTsgICAgXHJcbiAgICBsaW5rLmhyZWYgPSB1cmk7XHJcbiAgICBcclxuICAgIC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcbiAgICBcclxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgbGluay5jbGljaygpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
