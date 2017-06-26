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

		$('.loading').addClass('show');
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
		$('.loading').removeClass('show');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImNvbmZpZyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsImZpbHRlciIsIndvcmQiLCJyZWFjdCIsImVuZFRpbWUiLCJub3dEYXRlIiwiYXV0aCIsImV4dGVuc2lvbiIsImZiIiwibmV4dCIsImZlZWRzIiwiZ2V0QXV0aCIsInR5cGUiLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhTdHIiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwiaW5kZXhPZiIsInN0YXJ0Iiwic3dhbCIsImRvbmUiLCJmYmlkIiwiaW5pdCIsIlByb21pc2UiLCJhbGwiLCJnZXRNZSIsImdldFBhZ2UiLCJnZXRHcm91cCIsInRoZW4iLCJyZXMiLCJzZXNzaW9uU3RvcmFnZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJnZW5PcHRpb24iLCJvcHRpb25zIiwiYWRkQ2xhc3MiLCJpIiwiaiIsImlkIiwibmFtZSIsImFwcGVuZCIsInNlbGVjdDIiLCJzZWxlY3RQYWdlIiwidGFyIiwiZmluZCIsImF0dHIiLCJ2YWwiLCJwYWdlSUQiLCJjbGVhciIsImNvbW1hbmQiLCJhcGkiLCJkYXRhIiwicmVzb2x2ZSIsInJlamVjdCIsImFyciIsImdldE5hbWUiLCJpZHMiLCJ0b1N0cmluZyIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInByb21pc2VfYXJyYXkiLCJmaW5hbEFycmF5IiwidGV4dCIsInJhdyIsInJlbW92ZUNsYXNzIiwib2JqIiwiZnVsbElEIiwicHJvbWlzZSIsImdldCIsInB1c2giLCJjb3VudF9zY29yZSIsImRhdGFzIiwibGVuZ3RoIiwiZCIsImlzX2hpZGRlbiIsInBhZ2luZyIsImdldE5leHQiLCJyZXBsYWNlIiwiZ2V0SlNPTiIsImZhaWwiLCJmaW5pc2giLCJzdGVwIiwic3RlcDIiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwic2NvcmVfYXJyYXkiLCJzY29yZV9ydWxlIiwic2NvcmUiLCJjb21tZW50X2NvdW50IiwiY29tbWVudHNfbWF4IiwidXNlciIsImZyb20iLCJtZXNzYWdlIiwibGlrZV9jb3VudCIsInJlYWN0aW9uc19tYXgiLCJNYXRoIiwiY2VpbCIsIm1lc3NhZ2VfdGFncyIsInRhZ19jb3VudCIsInRhZyIsInRhZ19tYXgiLCJzb3J0X2FycmF5Iiwic29ydCIsImEiLCJiIiwibWVyZ2VEYXRhIiwidGVtcCIsInRoaXNkYXRhIiwibGFzdCIsInBvcCIsInRhYmxlIiwiZ2VuZXJhdGUiLCJyYXdkYXRhIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsImNvdW50IiwidGJvZHkiLCJ1c2VybmFtZSIsImh0bWwiLCJhY3RpdmUiLCJyZWRvIiwicG9wdXAiLCJzaG93IiwiaGlkZSIsIkRhdGUiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsInRpbWVDb252ZXJ0ZXIiLCJVTklYX3RpbWVzdGFtcCIsIm1vbWVudCIsIl9kIiwibW9udGhzIiwidGltZSIsIm9iajJBcnJheSIsImFycmF5IiwibWFwIiwidmFsdWUiLCJpbmRleCIsImdlblJhbmRvbUFycmF5IiwibiIsImFyeSIsIkFycmF5IiwiciIsInQiLCJmbG9vciIsInJhbmRvbSIsIkpTT05Ub0NTVkNvbnZlcnRvciIsIkpTT05EYXRhIiwiUmVwb3J0VGl0bGUiLCJTaG93TGFiZWwiLCJhcnJEYXRhIiwicGFyc2UiLCJDU1YiLCJyb3ciLCJzbGljZSIsImFsZXJ0IiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJsaW5rIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjbGljayIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBOztBQUVELElBQUlXLFNBQVM7QUFDWkMsUUFBTztBQUNOQyxZQUFVLENBQUMsTUFBRCxFQUFRLFlBQVIsRUFBcUIsZUFBckIsRUFBcUMsV0FBckMsRUFBaUQsV0FBakQsRUFBNkQsU0FBN0QsRUFBdUUsY0FBdkUsQ0FESjtBQUVOQyxhQUFXLEVBRkw7QUFHTkMsZUFBYSxDQUFDLE9BQUQsRUFBUyxNQUFULEVBQWlCLGNBQWpCLENBSFA7QUFJTkMsZ0JBQWMsRUFKUjtBQUtOQyxRQUFNO0FBTEEsRUFESztBQVFaQyxRQUFPO0FBQ05MLFlBQVUsS0FESjtBQUVOQyxhQUFXLEtBRkw7QUFHTkMsZUFBYSxLQUhQO0FBSU5DLGdCQUFjLEtBSlI7QUFLTkMsUUFBTTtBQUxBLEVBUks7QUFlWkUsYUFBWTtBQUNYTixZQUFVLE1BREM7QUFFWEMsYUFBVyxNQUZBO0FBR1hDLGVBQWEsTUFIRjtBQUlYQyxnQkFBYyxNQUpIO0FBS1hDLFFBQU0sTUFMSztBQU1YRyxTQUFPLE1BTkk7QUFPWEMsVUFBUTtBQVBHLEVBZkE7QUF3QlpDLFNBQVE7QUFDUEMsUUFBTSxFQURDO0FB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TUFBSUMsS0FBSixDQUFVLENBQVYsRUFBYUQsSUFBSTNGLE1BQUosR0FBYSxDQUExQjs7QUFFQTtBQUNBMEYsU0FBT0MsTUFBTSxNQUFiO0FBQ0g7O0FBRUQsS0FBSUQsT0FBTyxFQUFYLEVBQWU7QUFDWEcsUUFBTSxjQUFOO0FBQ0E7QUFDSDs7QUFFRDtBQUNBLEtBQUlDLFdBQVcsRUFBZjtBQUNBO0FBQ0FBLGFBQVlSLFlBQVlqRixPQUFaLENBQW9CLElBQXBCLEVBQXlCLEdBQXpCLENBQVo7O0FBRUE7QUFDQSxLQUFJMEYsTUFBTSx1Q0FBdUNDLFVBQVVOLEdBQVYsQ0FBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFJTyxPQUFPQyxTQUFTQyxhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQUYsTUFBS0csSUFBTCxHQUFZTCxHQUFaOztBQUVBO0FBQ0FFLE1BQUtJLEtBQUwsR0FBYSxtQkFBYjtBQUNBSixNQUFLSyxRQUFMLEdBQWdCUixXQUFXLE1BQTNCOztBQUVBO0FBQ0FJLFVBQVNLLElBQVQsQ0FBY0MsV0FBZCxDQUEwQlAsSUFBMUI7QUFDQUEsTUFBS1EsS0FBTDtBQUNBUCxVQUFTSyxJQUFULENBQWNHLFdBQWQsQ0FBMEJULElBQTFCO0FBQ0giLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxyXG57XHJcblx0aWYgKCFlcnJvck1lc3NhZ2Upe1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydmcm9tJywnbGlrZV9jb3VudCcsJ2NvbW1lbnRfY291bnQnLCdyZWFjdGlvbnMnLCdpc19oaWRkZW4nLCdtZXNzYWdlJywnbWVzc2FnZV90YWdzJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcclxuXHRcdGZlZWQ6IFtdXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2Mi43JyxcclxuXHRcdHJlYWN0aW9uczogJ3YyLjcnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi4zJyxcclxuXHRcdHVybF9jb21tZW50czogJ3YyLjcnLFxyXG5cdFx0ZmVlZDogJ3YyLjMnLFxyXG5cdFx0Z3JvdXA6ICd2Mi4zJyxcclxuXHRcdG5ld2VzdDogJ3YyLjgnXHJcblx0fSxcclxuXHRmaWx0ZXI6IHtcclxuXHRcdHdvcmQ6ICcnLFxyXG5cdFx0cmVhY3Q6ICdhbGwnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRhdXRoOiAndXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX21hbmFnZWRfZ3JvdXBzLG1hbmFnZV9wYWdlcycsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdG5leHQ6ICcnLFxyXG5cdGZlZWRzOiBbXSxcclxuXHRnZXRBdXRoOiAodHlwZSk9PntcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpPT57XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHRcdGlmICh0eXBlID09IFwiYWRkU2NvcGVcIil7XHJcblx0XHRcdFx0bGV0IGF1dGhTdHIgPSByZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3BlcztcclxuXHRcdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKCdtYW5hZ2VfcGFnZXMnKSA+PSAwICYmIGF1dGhTdHIuaW5kZXhPZigndXNlcl9tYW5hZ2VkX2dyb3VwcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX3Bvc3RzJykgPj0gMCl7XHJcblx0XHRcdFx0XHRmYi5zdGFydCgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+aOiOasiuWkseaVl++8jOiri+e1puS6iOaJgOacieasiumZkCcsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgUGxlYXNlIGNvbnRhY3QgdGhlIGFkbWluLicsXHJcblx0XHRcdFx0XHRcdCdlcnJvcidcclxuXHRcdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6ICgpPT57XHJcblx0XHRQcm9taXNlLmFsbChbZmIuZ2V0TWUoKSxmYi5nZXRQYWdlKCksIGZiLmdldEdyb3VwKCldKS50aGVuKChyZXMpPT57XHJcblx0XHRcdHNlc3Npb25TdG9yYWdlLmxvZ2luID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcclxuXHRcdFx0ZmIuZ2VuT3B0aW9uKHJlcyk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdlbk9wdGlvbjogKHJlcyk9PntcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCBvcHRpb25zID0gJyc7XHJcblx0XHRsZXQgdHlwZSA9IC0xO1xyXG5cdFx0JCgnYXNpZGUnKS5hZGRDbGFzcygnbG9naW4nKTtcclxuXHRcdGZvcihsZXQgaSBvZiByZXMpe1xyXG5cdFx0XHR0eXBlKys7XHJcblx0XHRcdGZvcihsZXQgaiBvZiBpKXtcclxuXHRcdFx0XHRvcHRpb25zICs9IGA8b3B0aW9uIGF0dHItdHlwZT1cIiR7dHlwZX1cIiB2YWx1ZT1cIiR7ai5pZH1cIj4ke2oubmFtZX08L29wdGlvbj5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCdhc2lkZSAuc3RlcDEgc2VsZWN0JykuYXBwZW5kKG9wdGlvbnMpO1xyXG5cdFx0JCgnYXNpZGUgc2VsZWN0Jykuc2VsZWN0MigpO1xyXG5cdFx0Ly8gJCgnYXNpZGUgc2VsZWN0Jykub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0Ly8gXHRsZXQgdHlwZSA9ICQodGhpcykuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuYXR0cignYXR0ci10eXBlJyk7XHJcblx0XHQvLyBcdGZiLnNlbGVjdFBhZ2UoZXZlbnQudGFyZ2V0LnZhbHVlLCB0eXBlKTtcclxuXHRcdC8vIH0pO1xyXG5cdH0sXHJcblx0c2VsZWN0UGFnZTogKCk9PntcclxuXHRcdGZiLm5leHQgPSAnJztcclxuXHRcdGxldCB0YXIgPSAkKCdhc2lkZSBzZWxlY3QnKTtcclxuXHRcdGxldCB0eXBlID0gdGFyLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmF0dHIoJ2F0dHItdHlwZScpO1xyXG5cdFx0ZmIuZmVlZCh0YXIudmFsKCksIHR5cGUsIGZiLm5leHQpO1xyXG5cdH0sXHJcblx0ZmVlZDogKHBhZ2VJRCwgdHlwZSwgdXJsID0gJycsIGNsZWFyID0gdHJ1ZSk9PntcclxuXHRcdGxldCBjb21tYW5kID0gKHR5cGUgPT0gJzInKSA/ICdmZWVkJzoncG9zdHMnO1xyXG5cdFx0bGV0IGFwaTtcclxuXHRcdC8vMTQ2ODQ2Njk5MDA5NzYyM1xyXG5cdFx0aWYgKHVybCA9PSAnJyl7XHJcblx0XHRcdGFwaSA9IGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vJHtwYWdlSUR9LyR7Y29tbWFuZH0/ZmllbGRzPWxpbmssZnVsbF9waWN0dXJlLGNyZWF0ZWRfdGltZSxtZXNzYWdlJmxpbWl0PTI1YDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRhcGkgPSB1cmw7XHJcblx0XHR9XHJcblx0XHRGQi5hcGkoYXBpLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdGZiLmZlZWRzID0gcmVzLmRhdGE7XHJcblx0XHRcdGRhdGEuc3RhcnQoKTtcclxuXHRcdH0pXHJcblx0fSxcclxuXHRnZXRNZTogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZWAsIChyZXMpPT57XHJcblx0XHRcdFx0bGV0IGFyciA9IFtyZXNdO1xyXG5cdFx0XHRcdHJlc29sdmUoYXJyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldFBhZ2U6ICgpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvYWNjb3VudHM/bGltaXQ9MTAwYCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldEdyb3VwOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2dyb3Vwcz9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUocmVzLmRhdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0TmFtZTogKGlkcyk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS8/aWRzPSR7aWRzLnRvU3RyaW5nKCl9YCwgKHJlcyk9PntcclxuXHRcdFx0XHRyZXNvbHZlKHJlcyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHByb21pc2VfYXJyYXk6IFtdLFxyXG5cdGZpbmFsQXJyYXk6IFtdLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0XHRkYXRhLnByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdGRhdGEucmF3ID0gW107XHJcblx0fSxcclxuXHRzdGFydDogKCk9PntcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGxldCBhbGwgPSBbXTtcclxuXHRcdGZvcihsZXQgaiBvZiBmYi5mZWVkcyl7XHJcblx0XHRcdGxldCBvYmogPSB7XHJcblx0XHRcdFx0ZnVsbElEOiBqLmlkLFxyXG5cdFx0XHRcdG9iajoge31cclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgcHJvbWlzZSA9IGRhdGEuZ2V0KG9iaikudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdG9iai5kYXRhID0gcmVzO1xyXG5cdFx0XHRcdGFsbC5wdXNoKG9iaik7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRkYXRhLnByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcclxuXHRcdH1cclxuXHRcdCQoJy5sb2FkaW5nJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdFByb21pc2UuYWxsKGRhdGEucHJvbWlzZV9hcnJheSkudGhlbigoKT0+e1xyXG5cdFx0XHRkYXRhLmNvdW50X3Njb3JlKGFsbCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBjb21tYW5kID0gJ2NvbW1lbnRzJztcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS9jb21tZW50cz9saW1pdD0ke2NvbmZpZy5saW1pdFtjb21tYW5kXX0mb3JkZXI9Y2hyb25vbG9naWNhbCZmaWVsZHM9JHtjb25maWcuZmllbGRbY29tbWFuZF0udG9TdHJpbmcoKX1gLChyZXMpPT57XHJcblx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKHJlcyk7XHJcblx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdGlmICghZC5pc19oaWRkZW4pe1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCk9PntcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpPT57XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdHN0ZXAuc3RlcDIoKTtcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0JCgnLnJlc3VsdF9hcmVhID4gLnRpdGxlIHNwYW4nKS50ZXh0KGZiaWQuZnVsbElEKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmF3XCIsIEpTT04uc3RyaW5naWZ5KGZiaWQpKTtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9LFxyXG5cdGNvdW50X3Njb3JlOiAoYWxsKT0+e1xyXG5cdFx0LypcclxuXHRcdFx055WZ6KiAM+WIhuOAgVRBR+S4gOWAizHliIbvvIzmnIDlpJoz5YiGXHJcblx0XHRcdOeVmeiogOW/g+aDheWNgeWAizHliIbvvIznhKHmop3ku7bpgLLkvY3vvIzmnIDlpJoz5YiGXHJcblx0XHRcdOeVmeiogOeahOeVmeiogOS4gOWAizHliIbvvIzmnIDlpKc25YiGXHJcblx0XHQqL1xyXG5cdFx0bGV0IHNjb3JlX2FycmF5ID0gW107XHJcblx0XHRmb3IobGV0IGkgb2YgYWxsKXtcclxuXHRcdFx0bGV0IGFyciA9IGkuZGF0YTtcclxuXHRcdFx0bGV0IHNjb3JlX3J1bGUgPSB7XHJcblx0XHRcdFx0J2NvbW1lbnRzJzogMSxcclxuXHRcdFx0XHQnY29tbWVudHNfbWF4JzogNixcclxuXHRcdFx0XHQncmVhY3Rpb25zJzogMC4xLFxyXG5cdFx0XHRcdCdyZWFjdGlvbnNfbWF4JzogMyxcclxuXHRcdFx0XHQndGFnJzogMSxcclxuXHRcdFx0XHQndGFnX21heCc6IDNcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgc2NvcmU7XHJcblx0XHRcdGZvcihsZXQgaiBvZiBhcnIpe1xyXG5cdFx0XHRcdHNjb3JlID0gMztcclxuXHRcdFx0XHRzY29yZSArPSAoai5jb21tZW50X2NvdW50KnNjb3JlX3J1bGUuY29tbWVudHMgPiBzY29yZV9ydWxlLmNvbW1lbnRzX21heCkgPyBzY29yZV9ydWxlLmNvbW1lbnRzX21heCA6IGouY29tbWVudF9jb3VudCpzY29yZV9ydWxlLmNvbW1lbnRzO1xyXG5cdFx0XHRcdGxldCB1c2VyID0ge1xyXG5cdFx0XHRcdFx0J2lkJzogai5pZCxcclxuXHRcdFx0XHRcdCd1c2VyaWQnOiBqLmZyb20uaWQsXHJcblx0XHRcdFx0XHQndXNlcm5hbWUnOiBqLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdCdjb21tZW50X2NvdW50Jzogai5jb21tZW50X2NvdW50LFxyXG5cdFx0XHRcdFx0J21lc3NhZ2UnOiBqLm1lc3NhZ2UsXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZiAoai5yZWFjdGlvbnMpe1xyXG5cdFx0XHRcdFx0aWYgKGoucmVhY3Rpb25zLmRhdGEubGVuZ3RoID09PSAyNSl7XHJcblx0XHRcdFx0XHRcdHVzZXIubGlrZV9jb3VudCA9IGoubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0c2NvcmUgKz0gc2NvcmVfcnVsZS5yZWFjdGlvbnNfbWF4O1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHVzZXIubGlrZV9jb3VudCA9IGoucmVhY3Rpb25zLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0XHRzY29yZSArPSBNYXRoLmNlaWwoai5yZWFjdGlvbnMuZGF0YS5sZW5ndGgqc2NvcmVfcnVsZS5yZWFjdGlvbnMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dXNlci5saWtlX2NvdW50ID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGoubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRcdHVzZXIudGFnX2NvdW50ID0gai5tZXNzYWdlX3RhZ3MubGVuZ3RoXHJcblx0XHRcdFx0XHRzY29yZSArPSAgKGoubWVzc2FnZV90YWdzLmxlbmd0aCAqIHNjb3JlX3J1bGUudGFnID49IHNjb3JlX3J1bGUudGFnX21heCkgPyBzY29yZV9ydWxlLnRhZ19tYXggOiBqLm1lc3NhZ2VfdGFncy5sZW5ndGggKiBzY29yZV9ydWxlLnRhZztcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHVzZXIudGFnX2NvdW50ID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dXNlci5zY29yZSA9IHNjb3JlO1xyXG5cdFx0XHRcdHNjb3JlX2FycmF5LnB1c2godXNlcik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIGNvbnNvbGUubG9nKHNjb3JlX2FycmF5KTtcclxuXHRcdGxldCBzb3J0X2FycmF5ID0gc2NvcmVfYXJyYXkuc29ydCgoYSwgYikgPT4gYi51c2VyaWQgLSBhLnVzZXJpZCk7XHJcblx0XHRkYXRhLm1lcmdlRGF0YShzb3J0X2FycmF5KTtcclxuXHR9LFxyXG5cdG1lcmdlRGF0YTogKGFycik9PntcclxuXHRcdGxldCBmaW5hbEFycmF5ID0gW107XHJcblx0XHRsZXQgdGVtcCA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGFycil7XHJcblx0XHRcdGxldCBvYmogPSBpO1xyXG5cdFx0XHRpZiAoaS51c2VyaWQgPT09IHRlbXAudXNlcmlkKXtcclxuXHRcdFx0XHRsZXQgdGhpc2RhdGEgPSBvYmo7XHJcblx0XHRcdFx0bGV0IGxhc3QgPSBmaW5hbEFycmF5LnBvcCgpO1xyXG5cdFx0XHRcdGxhc3QuaWQucHVzaCh0aGlzZGF0YSk7XHJcblx0XHRcdFx0bGFzdC5jb21tZW50X2NvdW50ICs9IG9iai5jb21tZW50X2NvdW50O1xyXG5cdFx0XHRcdGxhc3QubGlrZV9jb3VudCArPSBvYmoubGlrZV9jb3VudDtcclxuXHRcdFx0XHRsYXN0LnRhZ19jb3VudCArPSBvYmoudGFnX2NvdW50O1xyXG5cdFx0XHRcdGxhc3Quc2NvcmUgKz0gb2JqLnNjb3JlO1xyXG5cdFx0XHRcdGZpbmFsQXJyYXkucHVzaChsYXN0KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bGV0IHRoaXNkYXRhID0ge1xyXG5cdFx0XHRcdFx0J2lkJzogb2JqLmlkLFxyXG5cdFx0XHRcdFx0J21lc3NhZ2UnOiBvYmoubWVzc2FnZSxcclxuXHRcdFx0XHRcdCdsaWtlX2NvdW50Jzogb2JqLmxpa2VfY291bnQsXHJcblx0XHRcdFx0XHQnY29tbWVudF9jb3VudCc6IG9iai5jb21tZW50X2NvdW50LFxyXG5cdFx0XHRcdFx0J3RhZ19jb3VudCc6IG9iai50YWdfY291bnQsXHJcblx0XHRcdFx0XHQnc2NvcmUnOiBvYmouc2NvcmVcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdG9iai5pZCA9IFt0aGlzZGF0YV07XHJcblx0XHRcdFx0dGVtcCA9IG9iajtcclxuXHRcdFx0XHRmaW5hbEFycmF5LnB1c2gob2JqKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5maW5hbEFycmF5ID0gZmluYWxBcnJheS5zb3J0KChhLCBiKSA9PiBiLnNjb3JlIC0gYS5zY29yZSk7XHJcblx0XHRjb25zb2xlLmxvZyhkYXRhLmZpbmFsQXJyYXkpO1xyXG5cdFx0JCgnLmxvYWRpbmcnKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdFx0dGFibGUuZ2VuZXJhdGUoZGF0YS5maW5hbEFycmF5KTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKHJhd2RhdGEpPT57XHJcblx0XHQkKFwiLnRhYmxlcyB0YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKCcucmVzdWx0IC5pbmZvIC5hbGxfcGVvcGxlIHNwYW4nKS50ZXh0KHJhd2RhdGEubGVuZ3RoKTtcclxuXHRcdGxldCBjb3VudCA9IDE7XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGZvcihsZXQgaSBvZiByYXdkYXRhKXtcclxuXHRcdFx0dGJvZHkgKz0gYDx0cj5cclxuXHRcdFx0XHRcdFx0PHRkPiR7Y291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke2kudXNlcmlkfVwiIHRhcmdldD1fYmxhbms+JHtpLnVzZXJuYW1lfTwvYT48L3RkPlxyXG5cdFx0XHRcdFx0XHQ8dGQgb25jbGljaz1cInBvcHVwLnNob3coJyR7aS51c2VyaWR9JylcIj4ke2kuc2NvcmV9PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkPjxidXR0b24+6Zqx6JePPC9idXR0b24+PC90ZD5cclxuXHRcdFx0XHRcdCAgPC90cj5gO1xyXG5cdFx0XHRjb3VudCsrO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgdGFibGUgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5KTtcclxuXHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHQvLyBsZXQgYXJyID0gWydjb21tZW50cycsJ3JlYWN0aW9ucycsJ3NoYXJlZHBvc3RzJ107XHJcblx0XHRcdC8vIGZvcihsZXQgaSBvZiBhcnIpe1xyXG5cdFx0XHQvLyBcdGxldCB0YWJsZSA9ICQoJy50YWJsZXMgLicraSsnIHRhYmxlJykuRGF0YVRhYmxlKCk7XHJcblx0XHRcdC8vIFx0JChcIi50YWJsZXMgLlwiK2krXCIgLnNlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Ly8gXHRcdHRhYmxlXHJcblx0XHRcdC8vIFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHQvLyBcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHQvLyBcdFx0LmRyYXcoKTtcclxuXHRcdFx0Ly8gXHR9KTtcclxuXHRcdFx0Ly8gXHQkKFwiLnRhYmxlcyAuXCIraStcIiAuc2VhcmNoQ29tbWVudFwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQvLyBcdFx0dGFibGVcclxuXHRcdFx0Ly8gXHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdC8vIFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdC8vIFx0XHQuZHJhdygpO1xyXG5cdFx0XHQvLyBcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0Ly8gXHR9KTtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCk9PntcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxubGV0IHBvcHVwID0ge1xyXG5cdHNob3c6ICh0YXIpPT57XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGZvcihsZXQgaSBvZiBkYXRhLmZpbmFsQXJyYXkpe1xyXG5cdFx0XHRpZiAodGFyID09IGkudXNlcmlkKXtcclxuXHRcdFx0XHRsZXQgY291bnQgPSAxO1xyXG5cdFx0XHRcdCQoJy5wb3B1cCBwIHNwYW4nKS50ZXh0KGkudXNlcm5hbWUpO1xyXG5cdFx0XHRcdGZvcihsZXQgaiBvZiBpLmlkKXtcclxuXHRcdFx0XHRcdGxldCBtZXNzYWdlID0gai5tZXNzYWdlO1xyXG5cdFx0XHRcdFx0aWYgKG1lc3NhZ2UgPT0gJycpIG1lc3NhZ2UgPSAnPT09PT3nhKHlhafmloc9PT09PSc7XHJcblx0XHRcdFx0XHR0Ym9keSArPSBgPHRyPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7Y291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHtqLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7bWVzc2FnZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2ouY29tbWVudF9jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai50YWdfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2oubGlrZV9jb3VudH08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPiR7ai5zY29yZX08L3RkPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHRkPjxidXR0b24+6Zqx6JePPC9idXR0b24+PC90ZD5cclxuXHRcdFx0XHRcdFx0XHQgIDwvdHI+YDtcclxuXHRcdFx0XHRcdGNvdW50Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQoXCIucG9wdXAgdGFibGUgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnLnBvcHVwJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHR9LFxyXG5cdGhpZGU6ICgpPT57XHJcblx0XHQkKCcucG9wdXAnKS5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vd0RhdGUoKXtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpKzE7XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdHJldHVybiB5ZWFyK1wiLVwiK21vbnRoK1wiLVwiK2RhdGUrXCItXCIraG91citcIi1cIittaW4rXCItXCIrc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKXtcclxuXHQgdmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG4gXHQgdmFyIG1vbnRocyA9IFsnMDEnLCcwMicsJzAzJywnMDQnLCcwNScsJzA2JywnMDcnLCcwOCcsJzA5JywnMTAnLCcxMScsJzEyJ107XHJcbiAgICAgdmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcbiAgICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuICAgICBpZiAoZGF0ZSA8IDEwKXtcclxuICAgICBcdGRhdGUgPSBcIjBcIitkYXRlO1xyXG4gICAgIH1cclxuICAgICB2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuICAgICBpZiAoaG91ciA8IDEwKXtcclxuICAgICBcdGhvdXIgPSBcIjBcIitob3VyO1xyXG4gICAgIH1cclxuICAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcbiAgICAgaWYgKG1pbiA8IDEwKXtcclxuICAgICBcdG1pbiA9IFwiMFwiK21pbjtcclxuICAgICB9XHJcbiAgICAgdmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG4gICAgIGlmIChzZWMgPCAxMCl7XHJcbiAgICAgXHRzZWMgPSBcIjBcIitzZWM7XHJcbiAgICAgfVxyXG4gICAgIHZhciB0aW1lID0geWVhcisnLScrbW9udGgrJy0nK2RhdGUrXCIgXCIraG91cisnOicrbWluKyc6JytzZWMgO1xyXG4gICAgIHJldHVybiB0aW1lO1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIG9iajJBcnJheShvYmope1xyXG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xyXG4gXHRcdHJldHVybiBbdmFsdWVdO1xyXG4gXHR9KTtcclxuIFx0cmV0dXJuIGFycmF5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuIFx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG4gXHR2YXIgaSwgciwgdDtcclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0YXJ5W2ldID0gaTtcclxuIFx0fVxyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcbiBcdFx0dCA9IGFyeVtyXTtcclxuIFx0XHRhcnlbcl0gPSBhcnlbaV07XHJcbiBcdFx0YXJ5W2ldID0gdDtcclxuIFx0fVxyXG4gXHRyZXR1cm4gYXJ5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG4gICAgLy9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuICAgIHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuICAgIFxyXG4gICAgdmFyIENTViA9ICcnOyAgICBcclxuICAgIC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG4gICAgXHJcbiAgICAvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG4gICAgaWYgKFNob3dMYWJlbCkge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgICAgICByb3cgKz0gaW5kZXggKyAnLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG4gICAgICAgICAgICByb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoQ1NWID09ICcnKSB7ICAgICAgICBcclxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9ICAgXHJcbiAgICBcclxuICAgIC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuICAgIGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZyxcIl9cIik7ICAgXHJcbiAgICBcclxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcbiAgICB2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG4gICAgXHJcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuICAgIC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcbiAgICAvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcbiAgICBcclxuICAgIC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxyXG4gICAgbGluay5ocmVmID0gdXJpO1xyXG4gICAgXHJcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG4gICAgbGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG4gICAgXHJcbiAgICAvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgIGxpbmsuY2xpY2soKTtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXX0=
