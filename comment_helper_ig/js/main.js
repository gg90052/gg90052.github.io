"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
$(document).ready(function () {
	var hidearea = 0;
	$('header').click(function () {
		hidearea++;
		if (hidearea >= 5) {
			$('header').off('click');
			$('#fbid_button, #pure_fbid').removeClass('hide');
		}
	});

	var hash = location.hash;
	if (hash.indexOf("access_token") >= 0) {
		config.access_token = window.location.hash.replace('#', '?');
		fb.start();
	}

	$("#btn_start").click(function () {
		fb.getAuth('addScope');
	});

	$("#btn_choose").click(function (e) {
		if (e.ctrlKey || e.altKey) {
			choose.init(true);
		} else {
			choose.init();
		}
	});

	$("#moreprize").click(function () {
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
			$(".gettotal").removeClass("fadeout");
			$('.prizeDetail').removeClass("fadein");
		} else {
			$(this).addClass("active");
			$(".gettotal").addClass("fadeout");
			$('.prizeDetail').addClass("fadein");
		}
	});

	$("#endTime").click(function () {
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
		}
	});

	$("#btn_addPrize").click(function () {
		$(".prizeDetail").append("<div class=\"prize\"><div class=\"input_group\">\u54C1\u540D\uFF1A<input type=\"text\"></div><div class=\"input_group\">\u62BD\u734E\u4EBA\u6578\uFF1A<input type=\"number\"></div></div>");
	});

	$(window).keydown(function (e) {
		if (e.ctrlKey || e.altKey) {
			$("#btn_excel").text("輸出JSON");
		}
	});
	$(window).keyup(function (e) {
		if (!e.ctrlKey || !e.altKey) {
			$("#btn_excel").text("輸出EXCEL");
		}
	});

	$('.tables .total .filters select').change(function () {
		compare.init();
	});

	$('.compare_condition').change(function () {
		$('.tables .total .table_compare').addClass('hide');
		$('.tables .total .table_compare.' + $(this).val()).removeClass('hide');
	});

	$('.rangeDate').daterangepicker({
		"singleDatePicker": true,
		"timePicker": true,
		"timePicker24Hour": true,
		"locale": {
			"format": "YYYY-MM-DD   HH:mm",
			"separator": "-",
			"applyLabel": "確定",
			"cancelLabel": "取消",
			"fromLabel": "From",
			"toLabel": "To",
			"customRangeLabel": "Custom",
			"daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
			"monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			"firstDay": 1
		}
	}, function (start, end, label) {
		config.filter.endTime = start.format('YYYY-MM-DD-HH-mm-ss');
		table.redo();
	});
	$('.rangeDate').data('daterangepicker').setStartDate(nowDate());

	$("#btn_excel").click(function (e) {
		var filterData = data.filter(data.raw);
		if (e.ctrlKey) {
			var dd = void 0;
			if (tab.now === 'compare') {
				dd = JSON.stringify(compare[$('.compare_condition').val()]);
			} else {
				dd = JSON.stringify(filterData[tab.now]);
			}
			var url = 'data:text/json;charset=utf8,' + dd;
			window.open(url, '_blank');
			window.focus();
		} else {
			if (filterData.length > 7000) {
				$(".bigExcel").removeClass("hide");
			} else {
				if (tab.now === 'compare') {
					JSONToCSVConvertor(data.excel(compare[$('.compare_condition').val()]), "Comment_helper", true);
				} else {
					JSONToCSVConvertor(data.excel(filterData[tab.now]), "Comment_helper", true);
				}
			}
		}
	});

	$("#genExcel").click(function () {
		var filterData = data.filter(data.raw);
		var excelString = data.excel(filterData);
		$("#exceldata").val(JSON.stringify(excelString));
	});

	var ci_counter = 0;
	$(".ci").click(function (e) {
		ci_counter++;
		if (ci_counter >= 5) {
			$(".source .url, .source .btn").addClass("hide");
			$("#inputJSON").removeClass("hide");
		}
		if (e.ctrlKey) {
			fb.getAuth('sharedposts');
		}
	});
	$("#inputJSON").change(function () {
		$(".waiting").removeClass("hide");
		$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
		data.import(this.files[0]);
	});
});

var config = {
	field: {
		comments: ['like_count', 'message_tags', 'message', 'from', 'created_time'],
		reactions: [],
		sharedposts: ['story', 'from', 'created_time'],
		url_comments: [],
		feed: ['created_time', 'from', 'message', 'story'],
		likes: ['name']
	},
	limit: {
		comments: '500',
		reactions: '500',
		sharedposts: '500',
		url_comments: '500',
		feed: '500',
		likes: '500'
	},
	apiVersion: {
		comments: 'v2.7',
		reactions: 'v2.7',
		sharedposts: 'v2.3',
		url_comments: 'v2.7',
		feed: 'v2.9',
		group: 'v2.9',
		newest: 'v2.8'
	},
	filter: {
		word: '',
		react: 'all',
		endTime: nowDate()
	},
	order: '',
	auth: 'user_photos,user_posts,user_managed_groups,manage_pages',
	extension: false,
	access_token: ''
};

var fb = {
	next: '',
	getAuth: function getAuth(type) {
		var url = 'https://api.instagram.com/oauth/authorize/?client_id=b8c49f124d8347d68d5c068b8351622c&redirect_uri=http://localhost:8080&response_type=token&scope=public_content';
		location.href = url;
	},
	start: function start() {
		//輸入網址
		// $.get(`https://api.instagram.com/oembed?url=https://www.instagram.com/p/Bgyox8sjnE6/?hl=zh-tw`, function(res){
		// 	console.log(res);
		// })
		step.step1();
		fb.feed();
	},
	feed: function feed() {
		$.get("https://api.instagram.com/v1/users/self/media/recent" + config.access_token + "&count=50", function (res) {
			console.log(res);
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = res.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var i = _step.value;

					var message = i.caption ? i.caption.text : '';
					var card = "\n\t\t\t\t<div class=\"card\">\n\t\t\t\t<img src=\"" + i.images.low_resolution.url + "\">\n\t\t\t\t<p class=\"likes\"><span class=\"fa fa-heart\"></span>" + i.likes.count + "</p>\n\t\t\t\t<p class=\"message\">" + message + "</p>\n\t\t\t\t<button class=\"btn\" onclick=\"step.step2('" + i.id + "')\">\u958B\u59CB</button>\n\t\t\t\t</div>";
					$('.step.step1 .feeds').append(card);
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
		});
	}
};
var step = {
	step1: function step1() {
		$('.section').removeClass('step2');
		$("html, body").scrollTop(0);
	},
	step2: function step2(mediaid) {
		$('.recommands, .feeds').empty();
		$('.section').addClass('step2');
		$("html, body").scrollTop(0);
		data.raw.fullID = mediaid;
		data.raw.data = {};
		Promise.all([getComment(), getLikes()]).then(function (res) {
			data.finish();
		});

		function getComment() {
			return new Promise(function (resolve, reject) {
				$.get("https://api.instagram.com/v1/media/" + mediaid + "/comments" + config.access_token, function (res) {
					var data_arr = [];
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = res.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var i = _step2.value;

							var obj = {
								created_time: i.created_time,
								from: i.from,
								id: i.id,
								message: i.text
							};
							data_arr.push(obj);
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

					data.raw.data.comments = data_arr;
					resolve();
				});
			});
		}
		function getLikes() {
			return new Promise(function (resolve, reject) {
				$.get("https://api.instagram.com/v1/media/" + mediaid + "/likes" + config.access_token, function (res) {
					var data_arr = [];
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = res.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var i = _step3.value;

							var obj = {
								from: {
									id: i.id,
									full_name: i.full_name,
									profile_picture: i.profile_picture,
									username: i.username
								},
								type: 'LOVE'
							};
							data_arr.push(obj);
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

					data.raw.data.reactions = data_arr;
					resolve();
				});
			});
		}
	}
};

var data = {
	raw: {},
	filtered: {},
	userid: '',
	nowLength: 0,
	extension: false,
	promise_array: [],
	test: function test(id) {
		console.log(id);
	},
	init: function init() {
		$(".main_table").DataTable().destroy();
		$("#awardList").hide();
		$(".console .message").text('');
		data.nowLength = 0;
		data.promise_array = [];
		data.raw = [];
	},
	start: function start(fbid) {
		data.init();
		var obj = {
			fullID: fbid
		};
		$(".waiting").removeClass("hide");
		var commands = ['comments', 'reactions', 'sharedposts'];
		var temp_data = obj;
		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			var _loop = function _loop() {
				var i = _step4.value;

				temp_data.data = {};
				var promise = data.get(temp_data, i).then(function (res) {
					temp_data.data[i] = res;
				});
				data.promise_array.push(promise);
			};

			for (var _iterator4 = commands[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
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

		Promise.all(data.promise_array).then(function () {
			data.finish(temp_data);
		});
	},
	get: function get(fbid, command) {
		return new Promise(function (resolve, reject) {
			var datas = [];
			var promise_array = [];
			var shareError = 0;
			if (fbid.type === 'group') command = 'group';
			if (command === 'sharedposts') {
				getShare();
			} else {
				FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/" + command + "?limit=" + config.limit[command] + "&order=chronological&access_token=" + config.pageToken + "&fields=" + config.field[command].toString(), function (res) {
					data.nowLength += res.data.length;
					$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
					var _iteratorNormalCompletion5 = true;
					var _didIteratorError5 = false;
					var _iteratorError5 = undefined;

					try {
						for (var _iterator5 = res.data[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
							var d = _step5.value;

							if (command == 'reactions') {
								d.from = {
									id: d.id,
									name: d.name
								};
							}
							if (d.from) {
								datas.push(d);
							} else {
								//event
								d.from = {
									id: d.id,
									name: d.id
								};
								if (d.updated_time) {
									d.created_time = d.updated_time;
								}
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
			}

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

							if (command == 'reactions') {
								d.from = {
									id: d.id,
									name: d.name
								};
							}
							if (d.from) {
								datas.push(d);
							} else {
								//event
								d.from = {
									id: d.id,
									name: d.id
								};
								if (d.updated_time) {
									d.created_time = d.updated_time;
								}
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
				}).fail(function () {
					getNext(url, 200);
				});
			}

			function getShare() {
				var after = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

				var url = "https://am66ahgtp8.execute-api.ap-northeast-1.amazonaws.com/share?fbid=" + fbid.fullID + "&after=" + after;
				$.getJSON(url, function (res) {
					if (res === 'end') {
						resolve(datas);
					} else {
						if (res.errorMessage) {
							resolve(datas);
						} else if (res.data) {
							// shareError = 0;
							var _iteratorNormalCompletion7 = true;
							var _didIteratorError7 = false;
							var _iteratorError7 = undefined;

							try {
								for (var _iterator7 = res.data[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
									var _i = _step7.value;

									var name = '';
									if (_i.story) {
										name = _i.story.substring(0, _i.story.indexOf(' shared'));
									} else {
										name = _i.id.substring(0, _i.id.indexOf("_"));
									}
									var id = _i.id.substring(0, _i.id.indexOf("_"));
									_i.from = {
										id: id,
										name: name
									};
									datas.push(_i);
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

							getShare(res.after);
						} else {
							resolve(datas);
						}
					}
				});
			}
		});
	},
	finish: function finish() {
		$(".waiting").addClass("hide");
		$(".main_table").removeClass("hide");
		$("body").scrollTop(0);

		swal('完成！', 'Done!', 'success').done();
		console.log(data.raw);
		// data.raw = fbid;
		data.filter(data.raw, true);
	},
	filter: function filter(rawData) {
		var generate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		data.filtered = {};
		var isDuplicate = $("#unique").prop("checked");
		var _iteratorNormalCompletion8 = true;
		var _didIteratorError8 = false;
		var _iteratorError8 = undefined;

		try {
			for (var _iterator8 = Object.keys(rawData.data)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
				var key = _step8.value;

				var newData = _filter.totalFilter.apply(_filter, [rawData.data[key], key, isDuplicate, false].concat(_toConsumableArray(obj2Array(config.filter))));
				data.filtered[key] = newData;
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

		console.log(data.filtered);
		if (generate === true) {
			table.generate(data.filtered);
		} else {
			return data.filtered;
		}
	}
};

var table = {
	generate: function generate(rawdata) {
		$(".tables table").DataTable().destroy();
		var filtered = rawdata;
		var pic = $("#picture").prop("checked");
		var _iteratorNormalCompletion9 = true;
		var _didIteratorError9 = false;
		var _iteratorError9 = undefined;

		try {
			for (var _iterator9 = Object.keys(filtered)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
				var key = _step9.value;

				var thead = '';
				var tbody = '';
				if (key === 'reactions') {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td>\u540D\u5B57</td>\n\t\t\t\t<td>\u5FC3\u60C5</td>";
				} else {
					thead = "<td>\u5E8F\u865F</td>\n\t\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
				}
				var _iteratorNormalCompletion11 = true;
				var _didIteratorError11 = false;
				var _iteratorError11 = undefined;

				try {
					for (var _iterator11 = filtered[key].entries()[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
						var _step11$value = _slicedToArray(_step11.value, 2),
						    j = _step11$value[0],
						    val = _step11$value[1];

						var time = val.created_time + '000';
						var td = "<td>" + (j + 1) + "</td>\n\t\t\t\t<td><a href='http://www.instagram.com/" + val.from.username + "' attr-fbid=\"" + val.from.username + "\" target=\"_blank\">" + val.from.full_name + "</a></td>";
						if (key === 'reactions') {
							td += "<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>LIKE</td>";
						} else {
							td += "<td class=\"force-break\">" + val.message + "</td>\n\t\t\t\t\t<td class=\"nowrap\">" + moment(parseInt(time, 10)).format('YYYY-MM-DD HH:mm:ss') + "</td>";
						}
						var tr = "<tr>" + td + "</tr>";
						tbody += tr;
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

				var insert = "<thead><tr align=\"center\">" + thead + "</tr></thead><tbody>" + tbody + "</tbody>";
				$(".tables ." + key + " table").html('').append(insert);
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

		active();
		tab.init();
		compare.init();

		function active() {
			var table = $(".tables table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
			var arr = ['comments', 'reactions'];
			var _iteratorNormalCompletion10 = true;
			var _didIteratorError10 = false;
			var _iteratorError10 = undefined;

			try {
				var _loop2 = function _loop2() {
					var i = _step10.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator10 = arr[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
					_loop2();
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
	},
	redo: function redo() {
		data.filter(data.raw, true);
	}
};

var compare = {
	and: [],
	or: [],
	raw: [],
	init: function init() {
		compare.and = [];
		compare.or = [];
		compare.raw = data.filter(data.raw);
		var ignore = $('.tables .total .filters select').val();
		var base = [];
		var final = [];
		var compare_num = 1;
		if (ignore === 'ignore') compare_num = 2;

		var _iteratorNormalCompletion12 = true;
		var _didIteratorError12 = false;
		var _iteratorError12 = undefined;

		try {
			for (var _iterator12 = Object.keys(compare.raw)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
				var _key = _step12.value;

				if (_key !== ignore) {
					var _iteratorNormalCompletion15 = true;
					var _didIteratorError15 = false;
					var _iteratorError15 = undefined;

					try {
						for (var _iterator15 = compare.raw[_key][Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
							var _i3 = _step15.value;

							base.push(_i3);
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

		base = base.sort(function (a, b) {
			return a.from.id > b.from.id ? 1 : -1;
		});

		var _iteratorNormalCompletion13 = true;
		var _didIteratorError13 = false;
		var _iteratorError13 = undefined;

		try {
			for (var _iterator13 = base[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
				var _i4 = _step13.value;

				_i4.match = 0;
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

		var temp = '';
		var temp_name = '';
		// console.log(base);
		for (var _i2 in base) {
			var obj = base[_i2];
			if (obj.from.id == temp || data.raw.extension && obj.from.name == temp_name) {
				var tar = final[final.length - 1];
				tar.match++;
				var _iteratorNormalCompletion14 = true;
				var _didIteratorError14 = false;
				var _iteratorError14 = undefined;

				try {
					for (var _iterator14 = Object.keys(obj)[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
						var key = _step14.value;

						if (!tar[key]) tar[key] = obj[key]; //合併資料
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

				if (tar.match == compare_num) {
					temp_name = '';
					temp = '';
				}
			} else {
				final.push(obj);
				temp = obj.from.id;
				temp_name = obj.from.name;
			}
		}

		compare.or = final;
		compare.and = compare.or.filter(function (val) {
			return val.match == compare_num;
		});
		compare.generate();
	},
	generate: function generate() {
		$(".tables .total table").DataTable().destroy();
		var data_and = compare.and;

		var tbody = '';
		var _iteratorNormalCompletion16 = true;
		var _didIteratorError16 = false;
		var _iteratorError16 = undefined;

		try {
			for (var _iterator16 = data_and.entries()[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
				var _step16$value = _slicedToArray(_step16.value, 2),
				    j = _step16$value[0],
				    val = _step16$value[1];

				var time = val.created_time + '000';
				var td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.instagram.com/" + val.from.username + "' attr-fbid=\"" + val.from.username + "\" target=\"_blank\">" + val.from.full_name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>LIKE</td>\n\t\t\t<td class=\"force-break\">" + (val.message || '') + "</td>\n\t\t\t<td class=\"nowrap\">" + moment(parseInt(time, 10)).format('YYYY-MM-DD HH:mm:ss') + "</td>";
				var tr = "<tr>" + td + "</tr>";
				tbody += tr;
			}
		} catch (err) {
			_didIteratorError16 = true;
			_iteratorError16 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion16 && _iterator16.return) {
					_iterator16.return();
				}
			} finally {
				if (_didIteratorError16) {
					throw _iteratorError16;
				}
			}
		}

		$(".tables .total .table_compare.and tbody").html('').append(tbody);

		var data_or = compare.or;
		var tbody2 = '';
		var _iteratorNormalCompletion17 = true;
		var _didIteratorError17 = false;
		var _iteratorError17 = undefined;

		try {
			for (var _iterator17 = data_or.entries()[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
				var _step17$value = _slicedToArray(_step17.value, 2),
				    j = _step17$value[0],
				    val = _step17$value[1];

				var _time = val.created_time + '000';
				var _td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.instagram.com/" + val.from.username + "' attr-fbid=\"" + val.from.username + "\" target=\"_blank\">" + val.from.full_name + "</a></td>\n\t\t\t<td class=\"center\"><span class=\"react " + (val.type || '') + "\"></span>LIKE</td>\n\t\t\t<td class=\"force-break\">" + (val.message || '') + "</td>\n\t\t\t<td class=\"nowrap\">" + moment(parseInt(_time, 10)).format('YYYY-MM-DD HH:mm:ss') + "</td>";
				var _tr = "<tr>" + _td + "</tr>";
				tbody2 += _tr;
			}
		} catch (err) {
			_didIteratorError17 = true;
			_iteratorError17 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion17 && _iterator17.return) {
					_iterator17.return();
				}
			} finally {
				if (_didIteratorError17) {
					throw _iteratorError17;
				}
			}
		}

		$(".tables .total .table_compare.or tbody").html('').append(tbody2);

		active();

		function active() {
			var table = $(".tables .total table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
			var arr = ['and', 'or'];
			var _iteratorNormalCompletion18 = true;
			var _didIteratorError18 = false;
			var _iteratorError18 = undefined;

			try {
				var _loop3 = function _loop3() {
					var i = _step18.value;

					var table = $('.tables .' + i + ' table').DataTable();
					$(".tables ." + i + " .searchName").on('blur change keyup', function () {
						table.columns(1).search(this.value).draw();
					});
					$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
						table.columns(2).search(this.value).draw();
						config.filter.word = this.value;
					});
				};

				for (var _iterator18 = arr[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
					_loop3();
				}
			} catch (err) {
				_didIteratorError18 = true;
				_iteratorError18 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion18 && _iterator18.return) {
						_iterator18.return();
					}
				} finally {
					if (_didIteratorError18) {
						throw _iteratorError18;
					}
				}
			}
		}
	}
};

var choose = {
	data: [],
	award: [],
	num: 0,
	detail: false,
	list: [],
	init: function init() {
		var ctrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		var thead = $('.main_table thead').html();
		$('#awardList table thead').html(thead);
		$('#awardList table tbody').html('');
		choose.data = data.filter(data.raw);
		choose.award = [];
		choose.list = [];
		choose.num = 0;
		if ($("#moreprize").hasClass("active")) {
			choose.detail = true;
			$(".prizeDetail .prize").each(function () {
				var n = parseInt($(this).find("input[type='number']").val());
				var p = $(this).find("input[type='text']").val();
				if (n > 0) {
					choose.num += parseInt(n);
					choose.list.push({
						"name": p,
						"num": n
					});
				}
			});
		} else {
			choose.num = $("#howmany").val();
		}
		choose.go(ctrl);
	},
	go: function go(ctrl) {
		var command = tab.now;
		if (tab.now === 'compare') {
			choose.award = genRandomArray(compare[$('.compare_condition').val()].length).splice(0, choose.num);
		} else {
			choose.award = genRandomArray(choose.data[command].length).splice(0, choose.num);
		}
		var insert = '';
		var tempArr = [];
		if (command === 'comments') {
			$('.tables > div.active table').DataTable().column(2).data().each(function (value, index) {
				var word = $('.searchComment').val();
				if (value.indexOf(word) >= 0) tempArr.push(index);
			});
		}
		var _iteratorNormalCompletion19 = true;
		var _didIteratorError19 = false;
		var _iteratorError19 = undefined;

		try {
			for (var _iterator19 = choose.award[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
				var _i5 = _step19.value;

				var row = tempArr.length == 0 ? _i5 : tempArr[_i5];
				var _tar = $('.tables > div.active table').DataTable().row(row).node().innerHTML;
				insert += '<tr>' + _tar + '</tr>';
			}
		} catch (err) {
			_didIteratorError19 = true;
			_iteratorError19 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion19 && _iterator19.return) {
					_iterator19.return();
				}
			} finally {
				if (_didIteratorError19) {
					throw _iteratorError19;
				}
			}
		}

		$('#awardList table tbody').html(insert);
		if (!ctrl) {
			$("#awardList tbody tr").each(function () {
				// let tar = $(this).find('td').eq(1);
				// let id = tar.find('a').attr('attr-fbid');
				// tar.prepend(`<img src="http://graph.facebook.com/${id}/picture?type=small"><br>`);
			});
		}

		$('#awardList table tbody tr').addClass('success');

		if (choose.detail) {
			var now = 0;
			for (var k in choose.list) {
				var tar = $("#awardList tbody tr").eq(now);
				$("<tr><td class=\"prizeName\" colspan=\"7\">\u734E\u54C1\uFF1A " + choose.list[k].name + " <span>\u5171 " + choose.list[k].num + " \u540D</span></td></tr>").insertBefore(tar);
				now += choose.list[k].num + 1;
			}
			$("#moreprize").removeClass("active");
			$(".gettotal").removeClass("fadeout");
			$('.prizeDetail').removeClass("fadein");
		}
		$("#awardList").fadeIn(1000);
	}
};

var _filter = {
	totalFilter: function totalFilter(raw, command, isDuplicate, isTag, word, react, endTime) {
		var data = raw;
		if (isDuplicate) {
			data = _filter.unique(data);
		}
		if (word !== '' && command == 'comments') {
			data = _filter.word(data, word);
		}

		// if (command !== 'reactions') {
		// 	data = filter.time(data, endTime);
		// } else {
		// 	data = filter.react(data, react);
		// }

		return data;
	},
	unique: function unique(data) {
		var output = [];
		var keys = [];
		data.forEach(function (item) {
			var key = item.from.id;
			if (keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});
		return output;
	},
	word: function word(data, _word) {
		var newAry = $.grep(data, function (n, i) {
			if (n.message.indexOf(_word) > -1) {
				return true;
			}
		});
		return newAry;
	},
	tag: function tag(data) {
		var newAry = $.grep(data, function (n, i) {
			if (n.message_tags) {
				return true;
			}
		});
		return newAry;
	},
	time: function time(data, t) {
		var time_ary = t.split("-");
		var time = moment(new Date(time_ary[0], parseInt(time_ary[1]) - 1, time_ary[2], time_ary[3], time_ary[4], time_ary[5]))._d;
		var newAry = $.grep(data, function (n, i) {
			var created_time = moment(n.created_time)._d;
			if (created_time < time || n.created_time == "") {
				return true;
			}
		});
		return newAry;
	},
	react: function react(data, tar) {
		if (tar == 'all') {
			return data;
		} else {
			var newAry = $.grep(data, function (n, i) {
				if (n.type == tar) {
					return true;
				}
			});
			return newAry;
		}
	}
};

var ui = {
	init: function init() {}
};

var tab = {
	now: "comments",
	init: function init() {
		$('#comment_table .tabs .tab').click(function () {
			$('#comment_table .tabs .tab').removeClass('active');
			$(this).addClass('active');
			tab.now = $(this).attr('attr-type');
			var tar = $(this).index();
			$('.tables > div').removeClass('active');
			$('.tables > div').eq(tar).addClass('active');
			if (tab.now === 'compare') {
				compare.init();
			}
		});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoaWRlYXJlYSIsImNsaWNrIiwib2ZmIiwicmVtb3ZlQ2xhc3MiLCJoYXNoIiwibG9jYXRpb24iLCJpbmRleE9mIiwiY29uZmlnIiwiYWNjZXNzX3Rva2VuIiwicmVwbGFjZSIsImZiIiwic3RhcnQiLCJnZXRBdXRoIiwiZSIsImN0cmxLZXkiLCJhbHRLZXkiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImFwcGVuZCIsImtleWRvd24iLCJ0ZXh0Iiwia2V5dXAiLCJjaGFuZ2UiLCJjb21wYXJlIiwidmFsIiwiZGF0ZXJhbmdlcGlja2VyIiwiZW5kIiwibGFiZWwiLCJmaWx0ZXIiLCJlbmRUaW1lIiwiZm9ybWF0IiwidGFibGUiLCJyZWRvIiwiZGF0YSIsInNldFN0YXJ0RGF0ZSIsIm5vd0RhdGUiLCJmaWx0ZXJEYXRhIiwicmF3IiwiZGQiLCJ0YWIiLCJub3ciLCJKU09OIiwic3RyaW5naWZ5Iiwib3BlbiIsImZvY3VzIiwibGVuZ3RoIiwiSlNPTlRvQ1NWQ29udmVydG9yIiwiZXhjZWwiLCJleGNlbFN0cmluZyIsImNpX2NvdW50ZXIiLCJpbXBvcnQiLCJmaWxlcyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaWtlcyIsImxpbWl0IiwiYXBpVmVyc2lvbiIsImdyb3VwIiwibmV3ZXN0Iiwid29yZCIsInJlYWN0Iiwib3JkZXIiLCJhdXRoIiwiZXh0ZW5zaW9uIiwibmV4dCIsInR5cGUiLCJocmVmIiwic3RlcCIsInN0ZXAxIiwiZ2V0IiwicmVzIiwiaSIsIm1lc3NhZ2UiLCJjYXB0aW9uIiwiY2FyZCIsImltYWdlcyIsImxvd19yZXNvbHV0aW9uIiwiY291bnQiLCJpZCIsInNjcm9sbFRvcCIsInN0ZXAyIiwibWVkaWFpZCIsImVtcHR5IiwiZnVsbElEIiwiUHJvbWlzZSIsImFsbCIsImdldENvbW1lbnQiLCJnZXRMaWtlcyIsInRoZW4iLCJmaW5pc2giLCJyZXNvbHZlIiwicmVqZWN0IiwiZGF0YV9hcnIiLCJvYmoiLCJjcmVhdGVkX3RpbWUiLCJmcm9tIiwicHVzaCIsImZ1bGxfbmFtZSIsInByb2ZpbGVfcGljdHVyZSIsInVzZXJuYW1lIiwiZmlsdGVyZWQiLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJwcm9taXNlX2FycmF5IiwidGVzdCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZmJpZCIsImNvbW1hbmRzIiwidGVtcF9kYXRhIiwicHJvbWlzZSIsImNvbW1hbmQiLCJkYXRhcyIsInNoYXJlRXJyb3IiLCJnZXRTaGFyZSIsIkZCIiwiYXBpIiwicGFnZVRva2VuIiwidG9TdHJpbmciLCJkIiwibmFtZSIsInVwZGF0ZWRfdGltZSIsInBhZ2luZyIsImdldE5leHQiLCJnZXRKU09OIiwiZmFpbCIsImFmdGVyIiwic3RvcnkiLCJzdWJzdHJpbmciLCJzd2FsIiwiZG9uZSIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwicHJvcCIsIk9iamVjdCIsImtleXMiLCJrZXkiLCJuZXdEYXRhIiwidG90YWxGaWx0ZXIiLCJvYmoyQXJyYXkiLCJyYXdkYXRhIiwicGljIiwidGhlYWQiLCJ0Ym9keSIsImVudHJpZXMiLCJqIiwidGltZSIsInRkIiwibW9tZW50IiwicGFyc2VJbnQiLCJ0ciIsImluc2VydCIsImh0bWwiLCJhY3RpdmUiLCJhcnIiLCJvbiIsImNvbHVtbnMiLCJzZWFyY2giLCJ2YWx1ZSIsImRyYXciLCJhbmQiLCJvciIsImlnbm9yZSIsImJhc2UiLCJmaW5hbCIsImNvbXBhcmVfbnVtIiwic29ydCIsImEiLCJiIiwibWF0Y2giLCJ0ZW1wIiwidGVtcF9uYW1lIiwidGFyIiwiZGF0YV9hbmQiLCJkYXRhX29yIiwidGJvZHkyIiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwiY3RybCIsImVhY2giLCJuIiwiZmluZCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwidGVtcEFyciIsImNvbHVtbiIsImluZGV4Iiwicm93Iiwibm9kZSIsImlubmVySFRNTCIsImsiLCJlcSIsImluc2VydEJlZm9yZSIsImlzVGFnIiwidW5pcXVlIiwib3V0cHV0IiwiZm9yRWFjaCIsIml0ZW0iLCJuZXdBcnkiLCJncmVwIiwidGFnIiwibWVzc2FnZV90YWdzIiwidCIsInRpbWVfYXJ5Iiwic3BsaXQiLCJEYXRlIiwiX2QiLCJ1aSIsImF0dHIiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsInRpbWVDb252ZXJ0ZXIiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwibWFwIiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJwYXJzZSIsIkNTViIsInNsaWNlIiwiYWxlcnQiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImxpbmsiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFpQkMsU0FBakI7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBd0JDLEdBQXhCLEVBQTZCQyxDQUE3QixFQUFnQztBQUMvQixLQUFJLENBQUNOLFlBQUwsRUFBbUI7QUFDbEJPLFVBQVFDLEdBQVIsQ0FBWSxtQ0FB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QWdCQSxJQUFJMEssUUFBUXhNLE1BQTVCLEVBQW9DOEIsR0FBcEMsRUFBeUM7QUFDeEMsTUFBSTBILE1BQU0sRUFBVjs7QUFFQTtBQUNBLE9BQUssSUFBSUQsS0FBVCxJQUFrQmlELFFBQVExSyxDQUFSLENBQWxCLEVBQThCO0FBQzdCMEgsVUFBTyxNQUFNZ0QsUUFBUTFLLENBQVIsRUFBV3lILEtBQVgsQ0FBTixHQUEwQixJQUFqQztBQUNBOztBQUVEQyxNQUFJbUQsS0FBSixDQUFVLENBQVYsRUFBYW5ELElBQUl4SixNQUFKLEdBQWEsQ0FBMUI7O0FBRUE7QUFDQTBNLFNBQU9sRCxNQUFNLE1BQWI7QUFDQTs7QUFFRCxLQUFJa0QsT0FBTyxFQUFYLEVBQWU7QUFDZEUsUUFBTSxjQUFOO0FBQ0E7QUFDQTs7QUFFRDtBQUNBLEtBQUlDLFdBQVcsRUFBZjtBQUNBO0FBQ0FBLGFBQVlQLFlBQVk1TyxPQUFaLENBQW9CLElBQXBCLEVBQTBCLEdBQTFCLENBQVo7O0FBRUE7QUFDQSxLQUFJb1AsTUFBTSx1Q0FBdUNDLFVBQVVMLEdBQVYsQ0FBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFJTSxPQUFPalEsU0FBU2tRLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWDtBQUNBRCxNQUFLdkwsSUFBTCxHQUFZcUwsR0FBWjs7QUFFQTtBQUNBRSxNQUFLRSxLQUFMLEdBQWEsbUJBQWI7QUFDQUYsTUFBS0csUUFBTCxHQUFnQk4sV0FBVyxNQUEzQjs7QUFFQTtBQUNBOVAsVUFBU3FRLElBQVQsQ0FBY0MsV0FBZCxDQUEwQkwsSUFBMUI7QUFDQUEsTUFBSzlQLEtBQUw7QUFDQUgsVUFBU3FRLElBQVQsQ0FBY0UsV0FBZCxDQUEwQk4sSUFBMUI7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvciA9IGhhbmRsZUVyclxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZywgdXJsLCBsKSB7XHJcblx0aWYgKCFlcnJvck1lc3NhZ2UpIHtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIiwgXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cdGxldCBoaWRlYXJlYSA9IDA7XHJcblx0JCgnaGVhZGVyJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0aGlkZWFyZWErKztcclxuXHRcdGlmIChoaWRlYXJlYSA+PSA1KSB7XHJcblx0XHRcdCQoJ2hlYWRlcicpLm9mZignY2xpY2snKTtcclxuXHRcdFx0JCgnI2ZiaWRfYnV0dG9uLCAjcHVyZV9mYmlkJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoO1xyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJhY2Nlc3NfdG9rZW5cIikgPj0gMCkge1xyXG5cdFx0Y29uZmlnLmFjY2Vzc190b2tlbiA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnPycpXHJcblx0XHRmYi5zdGFydCgpO1xyXG5cdH1cclxuXHJcblx0JChcIiNidG5fc3RhcnRcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHJcblxyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHRjaG9vc2UuaW5pdCh0cnVlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNob29zZS5pbml0KCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjbW9yZXByaXplXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikuYWRkQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKCFlLmN0cmxLZXkgfHwgIWUuYWx0S2V5KSB7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pFWENFTFwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JCgnLnRhYmxlcyAudG90YWwgLmZpbHRlcnMgc2VsZWN0JykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcuY29tcGFyZV9jb25kaXRpb24nKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnLnRhYmxlcyAudG90YWwgLnRhYmxlX2NvbXBhcmUuJyArICQodGhpcykudmFsKCkpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJzaW5nbGVEYXRlUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxyXG5cdFx0XCJsb2NhbGVcIjoge1xyXG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVktTU0tREQgICBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFx0XCLkuIBcIixcclxuXHRcdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFx0XCLlm5tcIixcclxuXHRcdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XHRcIuS4gOaciFwiLFxyXG5cdFx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XHRcIuWbm+aciFwiLFxyXG5cdFx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XHRcIuS4g+aciFwiLFxyXG5cdFx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XHRcIuWNgeaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSwgZnVuY3Rpb24gKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKG5vd0RhdGUoKSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRpZiAoZS5jdHJsS2V5KSB7XHJcblx0XHRcdGxldCBkZDtcclxuXHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJykge1xyXG5cdFx0XHRcdGRkID0gSlNPTi5zdHJpbmdpZnkoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGRkID0gSlNPTi5zdHJpbmdpZnkoZmlsdGVyRGF0YVt0YWIubm93XSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0ZjgsJyArIGRkO1xyXG5cdFx0XHR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcclxuXHRcdFx0d2luZG93LmZvY3VzKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKSB7XHJcblx0XHRcdFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKHRhYi5ub3cgPT09ICdjb21wYXJlJykge1xyXG5cdFx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoY29tcGFyZVskKCcuY29tcGFyZV9jb25kaXRpb24nKS52YWwoKV0pLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhW3RhYi5ub3ddKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcclxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xyXG5cdH0pO1xyXG5cclxuXHRsZXQgY2lfY291bnRlciA9IDA7XHJcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSkge1xyXG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHR9XHJcblx0XHRpZiAoZS5jdHJsS2V5KSB7XHJcblx0XHRcdGZiLmdldEF1dGgoJ3NoYXJlZHBvc3RzJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W5a6M5oiQ77yM55Si55Sf6KGo5qC85LitLi4uLuethuaVuOi8g+WkmuaZguacg+mcgOimgeiKsei8g+WkmuaZgumWk++8jOiri+eojeWAmScpO1xyXG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsICdtZXNzYWdlX3RhZ3MnLCAnbWVzc2FnZScsICdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywgJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogWydjcmVhdGVkX3RpbWUnLCAnZnJvbScsICdtZXNzYWdlJywgJ3N0b3J5J10sXHJcblx0XHRsaWtlczogWyduYW1lJ11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnLFxyXG5cdFx0bGlrZXM6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3YyLjcnLFxyXG5cdFx0cmVhY3Rpb25zOiAndjIuNycsXHJcblx0XHRzaGFyZWRwb3N0czogJ3YyLjMnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjIuNycsXHJcblx0XHRmZWVkOiAndjIuOScsXHJcblx0XHRncm91cDogJ3YyLjknLFxyXG5cdFx0bmV3ZXN0OiAndjIuOCdcclxuXHR9LFxyXG5cdGZpbHRlcjoge1xyXG5cdFx0d29yZDogJycsXHJcblx0XHRyZWFjdDogJ2FsbCcsXHJcblx0XHRlbmRUaW1lOiBub3dEYXRlKClcclxuXHR9LFxyXG5cdG9yZGVyOiAnJyxcclxuXHRhdXRoOiAndXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX21hbmFnZWRfZ3JvdXBzLG1hbmFnZV9wYWdlcycsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRhY2Nlc3NfdG9rZW46ICcnLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0bmV4dDogJycsXHJcblx0Z2V0QXV0aDogKHR5cGUpID0+IHtcclxuXHRcdGxldCB1cmwgPSAnaHR0cHM6Ly9hcGkuaW5zdGFncmFtLmNvbS9vYXV0aC9hdXRob3JpemUvP2NsaWVudF9pZD1iOGM0OWYxMjRkODM0N2Q2OGQ1YzA2OGI4MzUxNjIyYyZyZWRpcmVjdF91cmk9aHR0cDovL2xvY2FsaG9zdDo4MDgwJnJlc3BvbnNlX3R5cGU9dG9rZW4mc2NvcGU9cHVibGljX2NvbnRlbnQnO1xyXG5cdFx0bG9jYXRpb24uaHJlZiA9IHVybDtcclxuXHR9LFxyXG5cdHN0YXJ0OiAoKSA9PiB7XHJcblx0XHQvL+i8uOWFpee2suWdgFxyXG5cdFx0Ly8gJC5nZXQoYGh0dHBzOi8vYXBpLmluc3RhZ3JhbS5jb20vb2VtYmVkP3VybD1odHRwczovL3d3dy5pbnN0YWdyYW0uY29tL3AvQmd5b3g4c2puRTYvP2hsPXpoLXR3YCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdC8vIFx0Y29uc29sZS5sb2cocmVzKTtcclxuXHRcdC8vIH0pXHJcblx0XHRzdGVwLnN0ZXAxKCk7XHJcblx0XHRmYi5mZWVkKCk7XHJcblxyXG5cdH0sXHJcblx0ZmVlZDogKCkgPT4ge1xyXG5cdFx0JC5nZXQoYGh0dHBzOi8vYXBpLmluc3RhZ3JhbS5jb20vdjEvdXNlcnMvc2VsZi9tZWRpYS9yZWNlbnQke2NvbmZpZy5hY2Nlc3NfdG9rZW59JmNvdW50PTUwYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXMpO1xyXG5cdFx0XHRmb3IgKGxldCBpIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0bGV0IG1lc3NhZ2UgPSAoaS5jYXB0aW9uKSA/IGkuY2FwdGlvbi50ZXh0IDogJyc7XHJcblx0XHRcdFx0bGV0IGNhcmQgPSBgXHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cImNhcmRcIj5cclxuXHRcdFx0XHQ8aW1nIHNyYz1cIiR7aS5pbWFnZXMubG93X3Jlc29sdXRpb24udXJsfVwiPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwibGlrZXNcIj48c3BhbiBjbGFzcz1cImZhIGZhLWhlYXJ0XCI+PC9zcGFuPiR7aS5saWtlcy5jb3VudH08L3A+XHJcblx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5cclxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwiYnRuXCIgb25jbGljaz1cInN0ZXAuc3RlcDIoJyR7aS5pZH0nKVwiPumWi+WnizwvYnV0dG9uPlxyXG5cdFx0XHRcdDwvZGl2PmA7XHJcblx0XHRcdFx0JCgnLnN0ZXAuc3RlcDEgLmZlZWRzJykuYXBwZW5kKGNhcmQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG59XHJcbmxldCBzdGVwID0ge1xyXG5cdHN0ZXAxOiAoKSA9PiB7XHJcblx0XHQkKCcuc2VjdGlvbicpLnJlbW92ZUNsYXNzKCdzdGVwMicpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc2Nyb2xsVG9wKDApO1xyXG5cdH0sXHJcblx0c3RlcDI6IChtZWRpYWlkKSA9PiB7XHJcblx0XHQkKCcucmVjb21tYW5kcywgLmZlZWRzJykuZW1wdHkoKTtcclxuXHRcdCQoJy5zZWN0aW9uJykuYWRkQ2xhc3MoJ3N0ZXAyJyk7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zY3JvbGxUb3AoMCk7XHJcblx0XHRkYXRhLnJhdy5mdWxsSUQgPSBtZWRpYWlkO1xyXG5cdFx0ZGF0YS5yYXcuZGF0YSA9IHt9O1xyXG5cdFx0UHJvbWlzZS5hbGwoW2dldENvbW1lbnQoKSwgZ2V0TGlrZXMoKV0pLnRoZW4ocmVzPT57XHJcblx0XHRcdGRhdGEuZmluaXNoKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRmdW5jdGlvbiBnZXRDb21tZW50KCkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRcdCQuZ2V0KGBodHRwczovL2FwaS5pbnN0YWdyYW0uY29tL3YxL21lZGlhLyR7bWVkaWFpZH0vY29tbWVudHMke2NvbmZpZy5hY2Nlc3NfdG9rZW59YCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0bGV0IGRhdGFfYXJyID0gW107XHJcblx0XHRcdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRcdFx0XHRcdGNyZWF0ZWRfdGltZTogaS5jcmVhdGVkX3RpbWUsXHJcblx0XHRcdFx0XHRcdFx0ZnJvbTogaS5mcm9tLFxyXG5cdFx0XHRcdFx0XHRcdGlkOiBpLmlkLFxyXG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGkudGV4dCxcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRkYXRhX2Fyci5wdXNoKG9iaik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRkYXRhLnJhdy5kYXRhLmNvbW1lbnRzID0gZGF0YV9hcnI7XHJcblx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBnZXRMaWtlcygpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0XHQkLmdldChgaHR0cHM6Ly9hcGkuaW5zdGFncmFtLmNvbS92MS9tZWRpYS8ke21lZGlhaWR9L2xpa2VzJHtjb25maWcuYWNjZXNzX3Rva2VufWAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdGxldCBkYXRhX2FyciA9IFtdO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0bGV0IG9iaiA9IHtcclxuXHRcdFx0XHRcdFx0XHRmcm9tOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZDogaS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogaS5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRwcm9maWxlX3BpY3R1cmU6IGkucHJvZmlsZV9waWN0dXJlLFxyXG5cdFx0XHRcdFx0XHRcdFx0dXNlcm5hbWU6IGkudXNlcm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiAnTE9WRScsXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZGF0YV9hcnIucHVzaChvYmopO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZGF0YS5yYXcuZGF0YS5yZWFjdGlvbnMgPSBkYXRhX2FycjtcclxuXHRcdFx0XHRcdHJlc29sdmUoKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHJhdzoge30sXHJcblx0ZmlsdGVyZWQ6IHt9LFxyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0cHJvbWlzZV9hcnJheTogW10sXHJcblx0dGVzdDogKGlkKSA9PiB7XHJcblx0XHRjb25zb2xlLmxvZyhpZCk7XHJcblx0fSxcclxuXHRpbml0OiAoKSA9PiB7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0ZGF0YS5wcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKSA9PiB7XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdGxldCBvYmogPSB7XHJcblx0XHRcdGZ1bGxJRDogZmJpZFxyXG5cdFx0fVxyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGxldCBjb21tYW5kcyA9IFsnY29tbWVudHMnLCAncmVhY3Rpb25zJywgJ3NoYXJlZHBvc3RzJ107XHJcblx0XHRsZXQgdGVtcF9kYXRhID0gb2JqO1xyXG5cdFx0Zm9yIChsZXQgaSBvZiBjb21tYW5kcykge1xyXG5cdFx0XHR0ZW1wX2RhdGEuZGF0YSA9IHt9O1xyXG5cdFx0XHRsZXQgcHJvbWlzZSA9IGRhdGEuZ2V0KHRlbXBfZGF0YSwgaSkudGhlbigocmVzKSA9PiB7XHJcblx0XHRcdFx0dGVtcF9kYXRhLmRhdGFbaV0gPSByZXM7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRkYXRhLnByb21pc2VfYXJyYXkucHVzaChwcm9taXNlKTtcclxuXHRcdH1cclxuXHJcblx0XHRQcm9taXNlLmFsbChkYXRhLnByb21pc2VfYXJyYXkpLnRoZW4oKCkgPT4ge1xyXG5cdFx0XHRkYXRhLmZpbmlzaCh0ZW1wX2RhdGEpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkLCBjb21tYW5kKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IHNoYXJlRXJyb3IgPSAwO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKSBjb21tYW5kID0gJ2dyb3VwJztcclxuXHRcdFx0aWYgKGNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpIHtcclxuXHRcdFx0XHRnZXRTaGFyZSgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtjb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtjb21tYW5kXX0mb3JkZXI9Y2hyb25vbG9naWNhbCZhY2Nlc3NfdG9rZW49JHtjb25maWcucGFnZVRva2VufSZmaWVsZHM9JHtjb25maWcuZmllbGRbY29tbWFuZF0udG9TdHJpbmcoKX1gLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJykge1xyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogZC5uYW1lXHJcblx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoZC5mcm9tKSB7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBkLmlkXHJcblx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCkge1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0ID0gMCkge1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCkge1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsICdsaW1pdD0nICsgbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZCBvZiByZXMuZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJykge1xyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogZC5uYW1lXHJcblx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoZC5mcm9tKSB7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWQ6IGQuaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRuYW1lOiBkLmlkXHJcblx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZC51cGRhdGVkX3RpbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCkge1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpID0+IHtcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXRTaGFyZShhZnRlciA9ICcnKSB7XHJcblx0XHRcdFx0bGV0IHVybCA9IGBodHRwczovL2FtNjZhaGd0cDguZXhlY3V0ZS1hcGkuYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbS9zaGFyZT9mYmlkPSR7ZmJpZC5mdWxsSUR9JmFmdGVyPSR7YWZ0ZXJ9YDtcclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRpZiAocmVzID09PSAnZW5kJykge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3JNZXNzYWdlKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAocmVzLmRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBzaGFyZUVycm9yID0gMDtcclxuXHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgbmFtZSA9ICcnO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGkuc3RvcnkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZSA9IGkuc3Rvcnkuc3Vic3RyaW5nKDAsIGkuc3RvcnkuaW5kZXhPZignIHNoYXJlZCcpKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWUgPSBpLmlkLnN1YnN0cmluZygwLCBpLmlkLmluZGV4T2YoXCJfXCIpKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGxldCBpZCA9IGkuaWQuc3Vic3RyaW5nKDAsIGkuaWQuaW5kZXhPZihcIl9cIikpO1xyXG5cdFx0XHRcdFx0XHRcdFx0aS5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goaSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGdldFNoYXJlKHJlcy5hZnRlcik7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKCkgPT4ge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiYm9keVwiKS5zY3JvbGxUb3AoMCk7XHJcblx0XHRcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0Y29uc29sZS5sb2coZGF0YS5yYXcpXHJcblx0XHQvLyBkYXRhLnJhdyA9IGZiaWQ7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKSA9PiB7XHJcblx0XHRkYXRhLmZpbHRlcmVkID0ge307XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhyYXdEYXRhLmRhdGEpKSB7XHJcblx0XHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEuZGF0YVtrZXldLCBrZXksIGlzRHVwbGljYXRlLCBmYWxzZSwgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdFx0ZGF0YS5maWx0ZXJlZFtrZXldID0gbmV3RGF0YTtcclxuXHRcdH1cclxuXHRcdGNvbnNvbGUubG9nKGRhdGEuZmlsdGVyZWQpO1xyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKSB7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKGRhdGEuZmlsdGVyZWQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGRhdGEuZmlsdGVyZWQ7XHJcblx0XHR9XHJcblx0fSxcclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSkgPT4ge1xyXG5cdFx0JChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmVkID0gcmF3ZGF0YTtcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoZmlsdGVyZWQpKSB7XHJcblx0XHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdFx0aWYgKGtleSA9PT0gJ3JlYWN0aW9ucycpIHtcclxuXHRcdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0XHQ8dGQ+5b+D5oOFPC90ZD5gO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGxldCBbaiwgdmFsXSBvZiBmaWx0ZXJlZFtrZXldLmVudHJpZXMoKSkge1xyXG5cdFx0XHRcdGxldCB0aW1lID0gdmFsLmNyZWF0ZWRfdGltZSArICcwMDAnO1xyXG5cdFx0XHRcdGxldCB0ZCA9IGA8dGQ+JHtqKzF9PC90ZD5cclxuXHRcdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5pbnN0YWdyYW0uY29tLyR7dmFsLmZyb20udXNlcm5hbWV9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLnVzZXJuYW1lfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20uZnVsbF9uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdFx0aWYgKGtleSA9PT0gJ3JlYWN0aW9ucycpIHtcclxuXHRcdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPkxJS0U8L3RkPmA7XHJcblx0XHRcdFx0fSBlbHNle1xyXG5cdFx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+JHt2YWwubWVzc2FnZX08L3RkPlxyXG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHttb21lbnQocGFyc2VJbnQodGltZSwxMCkpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpfTwvdGQ+YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcblx0XHRcdCQoXCIudGFibGVzIC5cIiArIGtleSArIFwiIHRhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cdFx0dGFiLmluaXQoKTtcclxuXHRcdGNvbXBhcmUuaW5pdCgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpIHtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRsZXQgYXJyID0gWydjb21tZW50cycsICdyZWFjdGlvbnMnXTtcclxuXHRcdFx0Zm9yIChsZXQgaSBvZiBhcnIpIHtcclxuXHRcdFx0XHRsZXQgdGFibGUgPSAkKCcudGFibGVzIC4nICsgaSArICcgdGFibGUnKS5EYXRhVGFibGUoKTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIgKyBpICsgXCIgLnNlYXJjaE5hbWVcIikub24oJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdCQoXCIudGFibGVzIC5cIiArIGkgKyBcIiAuc2VhcmNoQ29tbWVudFwiKS5vbignYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdFx0XHQuY29sdW1ucygyKVxyXG5cdFx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKSA9PiB7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY29tcGFyZSA9IHtcclxuXHRhbmQ6IFtdLFxyXG5cdG9yOiBbXSxcclxuXHRyYXc6IFtdLFxyXG5cdGluaXQ6ICgpID0+IHtcclxuXHRcdGNvbXBhcmUuYW5kID0gW107XHJcblx0XHRjb21wYXJlLm9yID0gW107XHJcblx0XHRjb21wYXJlLnJhdyA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGxldCBpZ25vcmUgPSAkKCcudGFibGVzIC50b3RhbCAuZmlsdGVycyBzZWxlY3QnKS52YWwoKTtcclxuXHRcdGxldCBiYXNlID0gW107XHJcblx0XHRsZXQgZmluYWwgPSBbXTtcclxuXHRcdGxldCBjb21wYXJlX251bSA9IDE7XHJcblx0XHRpZiAoaWdub3JlID09PSAnaWdub3JlJykgY29tcGFyZV9udW0gPSAyO1xyXG5cclxuXHRcdGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhjb21wYXJlLnJhdykpIHtcclxuXHRcdFx0aWYgKGtleSAhPT0gaWdub3JlKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgaSBvZiBjb21wYXJlLnJhd1trZXldKSB7XHJcblx0XHRcdFx0XHRiYXNlLnB1c2goaSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRiYXNlID0gYmFzZS5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdHJldHVybiBhLmZyb20uaWQgPiBiLmZyb20uaWQgPyAxIDogLTE7XHJcblx0XHR9KTtcclxuXHJcblx0XHRmb3IgKGxldCBpIG9mIGJhc2UpIHtcclxuXHRcdFx0aS5tYXRjaCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHRlbXAgPSAnJztcclxuXHRcdGxldCB0ZW1wX25hbWUgPSAnJztcclxuXHRcdC8vIGNvbnNvbGUubG9nKGJhc2UpO1xyXG5cdFx0Zm9yIChsZXQgaSBpbiBiYXNlKSB7XHJcblx0XHRcdGxldCBvYmogPSBiYXNlW2ldO1xyXG5cdFx0XHRpZiAob2JqLmZyb20uaWQgPT0gdGVtcCB8fCAoZGF0YS5yYXcuZXh0ZW5zaW9uICYmIChvYmouZnJvbS5uYW1lID09IHRlbXBfbmFtZSkpKSB7XHJcblx0XHRcdFx0bGV0IHRhciA9IGZpbmFsW2ZpbmFsLmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdHRhci5tYXRjaCsrO1xyXG5cdFx0XHRcdGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKSB7XHJcblx0XHRcdFx0XHRpZiAoIXRhcltrZXldKSB0YXJba2V5XSA9IG9ialtrZXldOyAvL+WQiOS9teizh+aWmVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGFyLm1hdGNoID09IGNvbXBhcmVfbnVtKSB7XHJcblx0XHRcdFx0XHR0ZW1wX25hbWUgPSAnJztcclxuXHRcdFx0XHRcdHRlbXAgPSAnJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZmluYWwucHVzaChvYmopO1xyXG5cdFx0XHRcdHRlbXAgPSBvYmouZnJvbS5pZDtcclxuXHRcdFx0XHR0ZW1wX25hbWUgPSBvYmouZnJvbS5uYW1lO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGNvbXBhcmUub3IgPSBmaW5hbDtcclxuXHRcdGNvbXBhcmUuYW5kID0gY29tcGFyZS5vci5maWx0ZXIoKHZhbCkgPT4ge1xyXG5cdFx0XHRyZXR1cm4gdmFsLm1hdGNoID09IGNvbXBhcmVfbnVtO1xyXG5cdFx0fSk7XHJcblx0XHRjb21wYXJlLmdlbmVyYXRlKCk7XHJcblx0fSxcclxuXHRnZW5lcmF0ZTogKCkgPT4ge1xyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBkYXRhX2FuZCA9IGNvbXBhcmUuYW5kO1xyXG5cclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yIChsZXQgW2osIHZhbF0gb2YgZGF0YV9hbmQuZW50cmllcygpKSB7XHJcblx0XHRcdGxldCB0aW1lID0gdmFsLmNyZWF0ZWRfdGltZSArICcwMDAnO1xyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3Lmluc3RhZ3JhbS5jb20vJHt2YWwuZnJvbS51c2VybmFtZX0nIGF0dHItZmJpZD1cIiR7dmFsLmZyb20udXNlcm5hbWV9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5mdWxsX25hbWV9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZSB8fCAnJ31cIj48L3NwYW4+TElLRTwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+JHt2YWwubWVzc2FnZSB8fCAnJ308L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke21vbWVudChwYXJzZUludCh0aW1lLDEwKSkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyl9PC90ZD5gO1xyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdCQoXCIudGFibGVzIC50b3RhbCAudGFibGVfY29tcGFyZS5hbmQgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5KTtcclxuXHJcblx0XHRsZXQgZGF0YV9vciA9IGNvbXBhcmUub3I7XHJcblx0XHRsZXQgdGJvZHkyID0gJyc7XHJcblx0XHRmb3IgKGxldCBbaiwgdmFsXSBvZiBkYXRhX29yLmVudHJpZXMoKSkge1xyXG5cdFx0XHRsZXQgdGltZSA9IHZhbC5jcmVhdGVkX3RpbWUgKyAnMDAwJztcclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5pbnN0YWdyYW0uY29tLyR7dmFsLmZyb20udXNlcm5hbWV9JyBhdHRyLWZiaWQ9XCIke3ZhbC5mcm9tLnVzZXJuYW1lfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20uZnVsbF9uYW1lfTwvYT48L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGUgfHwgJyd9XCI+PC9zcGFuPkxJS0U8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPiR7dmFsLm1lc3NhZ2UgfHwgJyd9PC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHttb21lbnQocGFyc2VJbnQodGltZSwxMCkpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpfTwvdGQ+YDtcclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkyICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgLnRvdGFsIC50YWJsZV9jb21wYXJlLm9yIHRib2R5XCIpLmh0bWwoJycpLmFwcGVuZCh0Ym9keTIpO1xyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpIHtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi50YWJsZXMgLnRvdGFsIHRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0bGV0IGFyciA9IFsnYW5kJywgJ29yJ107XHJcblx0XHRcdGZvciAobGV0IGkgb2YgYXJyKSB7XHJcblx0XHRcdFx0bGV0IHRhYmxlID0gJCgnLnRhYmxlcyAuJyArIGkgKyAnIHRhYmxlJykuRGF0YVRhYmxlKCk7XHJcblx0XHRcdFx0JChcIi50YWJsZXMgLlwiICsgaSArIFwiIC5zZWFyY2hOYW1lXCIpLm9uKCdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHQkKFwiLnRhYmxlcyAuXCIgKyBpICsgXCIgLnNlYXJjaENvbW1lbnRcIikub24oJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHRcdFx0LmNvbHVtbnMoMilcclxuXHRcdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKGN0cmwgPSBmYWxzZSkgPT4ge1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKSB7XHJcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xyXG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcclxuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcclxuXHRcdFx0XHRpZiAobiA+IDApIHtcclxuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XHJcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XCJuYW1lXCI6IHAsXHJcblx0XHRcdFx0XHRcdFwibnVtXCI6IG5cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0fVxyXG5cdFx0Y2hvb3NlLmdvKGN0cmwpO1xyXG5cdH0sXHJcblx0Z286IChjdHJsKSA9PiB7XHJcblx0XHRsZXQgY29tbWFuZCA9IHRhYi5ub3c7XHJcblx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKSB7XHJcblx0XHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNvbXBhcmVbJCgnLmNvbXBhcmVfY29uZGl0aW9uJykudmFsKCldLmxlbmd0aCkuc3BsaWNlKDAsIGNob29zZS5udW0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGFbY29tbWFuZF0ubGVuZ3RoKS5zcGxpY2UoMCwgY2hvb3NlLm51bSk7XHJcblx0XHR9XHJcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XHJcblx0XHRsZXQgdGVtcEFyciA9IFtdO1xyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpIHtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdi5hY3RpdmUgdGFibGUnKS5EYXRhVGFibGUoKS5jb2x1bW4oMikuZGF0YSgpLmVhY2goZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG5cdFx0XHRcdGxldCB3b3JkID0gJCgnLnNlYXJjaENvbW1lbnQnKS52YWwoKTtcclxuXHRcdFx0XHRpZiAodmFsdWUuaW5kZXhPZih3b3JkKSA+PSAwKSB0ZW1wQXJyLnB1c2goaW5kZXgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGkgb2YgY2hvb3NlLmF3YXJkKSB7XHJcblx0XHRcdGxldCByb3cgPSAodGVtcEFyci5sZW5ndGggPT0gMCkgPyBpIDogdGVtcEFycltpXTtcclxuXHRcdFx0bGV0IHRhciA9ICQoJy50YWJsZXMgPiBkaXYuYWN0aXZlIHRhYmxlJykuRGF0YVRhYmxlKCkucm93KHJvdykubm9kZSgpLmlubmVySFRNTDtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHI+JyArIHRhciArICc8L3RyPic7XHJcblx0XHR9XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0aWYgKCFjdHJsKSB7XHJcblx0XHRcdCQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdC8vIGxldCB0YXIgPSAkKHRoaXMpLmZpbmQoJ3RkJykuZXEoMSk7XHJcblx0XHRcdFx0Ly8gbGV0IGlkID0gdGFyLmZpbmQoJ2EnKS5hdHRyKCdhdHRyLWZiaWQnKTtcclxuXHRcdFx0XHQvLyB0YXIucHJlcGVuZChgPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0aWYgKGNob29zZS5kZXRhaWwpIHtcclxuXHRcdFx0bGV0IG5vdyA9IDA7XHJcblx0XHRcdGZvciAobGV0IGsgaW4gY2hvb3NlLmxpc3QpIHtcclxuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcclxuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjdcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZpbHRlciA9IHtcclxuXHR0b3RhbEZpbHRlcjogKHJhdywgY29tbWFuZCwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgZW5kVGltZSkgPT4ge1xyXG5cdFx0bGV0IGRhdGEgPSByYXc7XHJcblx0XHRpZiAoaXNEdXBsaWNhdGUpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAod29yZCAhPT0gJycgJiYgY29tbWFuZCA9PSAnY29tbWVudHMnKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gaWYgKGNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKSB7XHJcblx0XHQvLyBcdGRhdGEgPSBmaWx0ZXIudGltZShkYXRhLCBlbmRUaW1lKTtcclxuXHRcdC8vIH0gZWxzZSB7XHJcblx0XHQvLyBcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSkgPT4ge1xyXG5cdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZiAoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9LFxyXG5cdHdvcmQ6IChkYXRhLCB3b3JkKSA9PiB7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRhZzogKGRhdGEpID0+IHtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSwgZnVuY3Rpb24gKG4sIGkpIHtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRpbWU6IChkYXRhLCB0KSA9PiB7XHJcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLCAocGFyc2VJbnQodGltZV9hcnlbMV0pIC0gMSksIHRpbWVfYXJ5WzJdLCB0aW1lX2FyeVszXSwgdGltZV9hcnlbNF0sIHRpbWVfYXJ5WzVdKSkuX2Q7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHJlYWN0OiAoZGF0YSwgdGFyKSA9PiB7XHJcblx0XHRpZiAodGFyID09ICdhbGwnKSB7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IHVpID0ge1xyXG5cdGluaXQ6ICgpID0+IHtcclxuXHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFiID0ge1xyXG5cdG5vdzogXCJjb21tZW50c1wiLFxyXG5cdGluaXQ6ICgpID0+IHtcclxuXHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJyNjb21tZW50X3RhYmxlIC50YWJzIC50YWInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHR0YWIubm93ID0gJCh0aGlzKS5hdHRyKCdhdHRyLXR5cGUnKTtcclxuXHRcdFx0bGV0IHRhciA9ICQodGhpcykuaW5kZXgoKTtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0JCgnLnRhYmxlcyA+IGRpdicpLmVxKHRhcikuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHRpZiAodGFiLm5vdyA9PT0gJ2NvbXBhcmUnKSB7XHJcblx0XHRcdFx0Y29tcGFyZS5pbml0KCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCkge1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkgKyAxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhciArIFwiLVwiICsgbW9udGggKyBcIi1cIiArIGRhdGUgKyBcIi1cIiArIGhvdXIgKyBcIi1cIiArIG1pbiArIFwiLVwiICsgc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKSB7XHJcblx0dmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG5cdHZhciBtb250aHMgPSBbJzAxJywgJzAyJywgJzAzJywgJzA0JywgJzA1JywgJzA2JywgJzA3JywgJzA4JywgJzA5JywgJzEwJywgJzExJywgJzEyJ107XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHRpZiAoZGF0ZSA8IDEwKSB7XHJcblx0XHRkYXRlID0gXCIwXCIgKyBkYXRlO1xyXG5cdH1cclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHRpZiAoaG91ciA8IDEwKSB7XHJcblx0XHRob3VyID0gXCIwXCIgKyBob3VyO1xyXG5cdH1cclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0aWYgKG1pbiA8IDEwKSB7XHJcblx0XHRtaW4gPSBcIjBcIiArIG1pbjtcclxuXHR9XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdGlmIChzZWMgPCAxMCkge1xyXG5cdFx0c2VjID0gXCIwXCIgKyBzZWM7XHJcblx0fVxyXG5cdHZhciB0aW1lID0geWVhciArICctJyArIG1vbnRoICsgJy0nICsgZGF0ZSArIFwiIFwiICsgaG91ciArICc6JyArIG1pbiArICc6JyArIHNlYztcclxuXHRyZXR1cm4gdGltZTtcclxufVxyXG5cclxuZnVuY3Rpb24gb2JqMkFycmF5KG9iaikge1xyXG5cdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xyXG5cdFx0cmV0dXJuIFt2YWx1ZV07XHJcblx0fSk7XHJcblx0cmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcblx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG5cdHZhciBpLCByLCB0O1xyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdGFyeVtpXSA9IGk7XHJcblx0fVxyXG5cdGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuXHRcdHQgPSBhcnlbcl07XHJcblx0XHRhcnlbcl0gPSBhcnlbaV07XHJcblx0XHRhcnlbaV0gPSB0O1xyXG5cdH1cclxuXHRyZXR1cm4gYXJ5O1xyXG59XHJcblxyXG5mdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuXHQvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG5cdHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuXHJcblx0dmFyIENTViA9ICcnO1xyXG5cdC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG5cclxuXHQvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcblx0Ly9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuXHRpZiAoU2hvd0xhYmVsKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcblx0XHRmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcblxyXG5cdFx0XHQvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG5cdFx0XHRyb3cgKz0gaW5kZXggKyAnLCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuXHJcblx0XHQvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHQvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciByb3cgPSBcIlwiO1xyXG5cclxuXHRcdC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG5cdFx0XHRyb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuXHJcblx0XHQvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuXHRcdENTViArPSByb3cgKyAnXFxyXFxuJztcclxuXHR9XHJcblxyXG5cdGlmIChDU1YgPT0gJycpIHtcclxuXHRcdGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG5cdHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcblx0Ly90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcblx0ZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLCBcIl9cIik7XHJcblxyXG5cdC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcblx0dmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuXHJcblx0Ly8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcblx0Ly8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuXHQvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuXHQvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG5cclxuXHQvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuXHRsaW5rLmhyZWYgPSB1cmk7XHJcblxyXG5cdC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcblx0bGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuXHRsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuXHJcblx0Ly90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG5cdGxpbmsuY2xpY2soKTtcclxuXHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il19
