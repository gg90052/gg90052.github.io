"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
	var hash = location.search;
	if (hash.indexOf("extension") >= 0) {
		$(".loading.checkAuth").removeClass("hide");
		data.extension = true;

		$(".loading.checkAuth button").click(function (e) {
			fb.extensionAuth();
		});
	}

	$("#btn_comments").click(function (e) {
		fb.getAuth('comments');
	});

	$("#btn_like").click(function () {
		fb.getAuth('reactions');
	});
	$("#btn_url").click(function () {
		fb.getAuth('url_comments');
	});
	$("#btn_pay").click(function () {
		fb.getAuth('addScope');
	});
	$("#btn_choose").click(function () {
		choose.init();
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
		$(".prizeDetail").append("<div class=\"prize\"><div class=\"input_group\">品名：<input type=\"text\"></div><div class=\"input_group\">抽獎人數：<input type=\"number\"></div></div>");
	});

	$(window).keydown(function (e) {
		if (e.ctrlKey) {
			$("#btn_excel").text("輸出JSON");
		}
	});
	$(window).keyup(function (e) {
		if (!e.ctrlKey) {
			$("#btn_excel").text("輸出EXCEL");
		}
	});

	$("#unique, #tag").on('change', function () {
		table.redo();
	});

	$(".uipanel .react").change(function () {
		config.filter.react = $(this).val();
		table.redo();
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
			var url = 'data:text/json;charset=utf8,' + JSON.stringify(filterData);
			window.open(url, '_blank');
			window.focus();
		} else {
			if (filterData.length > 7000) {
				$(".bigExcel").removeClass("hide");
			} else {
				JSONToCSVConvertor(data.excel(filterData), "Comment_helper", true);
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
		if (e.ctrlKey || e.altKey) {
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
		comments: ['like_count', 'message_tags', 'message,from', 'created_time'],
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
		group: 'v2.7'
	},
	filter: {
		word: '',
		react: 'all',
		endTime: nowDate()
	},
	auth: 'read_stream,user_photos,user_posts,user_groups,user_managed_groups'
};

var fb = {
	user_posts: false,
	getAuth: function getAuth(type) {
		FB.login(function (response) {
			fb.callback(response, type);
			console.log(response);
		}, { scope: config.auth, return_scopes: true });
	},
	callback: function callback(response, type) {
		if (response.status === 'connected') {
			if (type == "addScope") {
				if (response.authResponse.grantedScopes.indexOf('read_stream') >= 0) {
					swal('付費授權完成，請再次執行抓留言', 'Authorization Finished! Please getComments again.', 'success').done();
				} else {
					swal('付費授權失敗，請聯絡管理員確認', 'Authorization Failed! Please contact the admin.', 'error').done();
				}
			} else if (type == "sharedposts") {
				if (response.authResponse.grantedScopes.indexOf("read_stream") < 0) {
					swal({
						title: '抓分享需付費，詳情請見粉絲專頁',
						html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
						type: 'warning'
					}).done();
				} else {
					fbid.init(type);
				}
			} else {
				if (response.authResponse.grantedScopes.indexOf("read_stream") >= 0) {
					fb.user_posts = true;
				}
				fbid.init(type);
			}
		} else {
			FB.login(function (response) {
				fb.callback(response);
			}, { scope: config.auth, return_scopes: true });
		}
	},
	extensionAuth: function extensionAuth() {
		FB.login(function (response) {
			fb.extensionCallback(response);
		}, { scope: config.auth, return_scopes: true });
	},
	extensionCallback: function extensionCallback(response) {
		if (response.status === 'connected') {
			if (response.authResponse.grantedScopes.indexOf("read_stream") < 0) {
				swal({
					title: '抓分享需付費，詳情請見粉絲專頁',
					html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
					type: 'warning'
				}).done();
			} else {
				$(".loading.checkAuth").addClass("hide");
				var datas = {
					command: 'sharedposts',
					data: JSON.parse($(".chrome").val())
				};
				data.raw = datas;
				data.finish(data.raw);
			}
		} else {
			FB.login(function (response) {
				fb.extensionCallback(response);
			}, { scope: config.auth, return_scopes: true });
		}
	}
};

var data = {
	raw: [],
	userid: '',
	nowLength: 0,
	extension: false,
	init: function init() {
		$(".main_table").DataTable().destroy();
		$("#awardList").hide();
		$(".console .message").text('');
		data.nowLength = 0;
		data.raw = [];
	},
	start: function start(fbid) {
		$(".waiting").removeClass("hide");
		data.get(fbid).then(function (res) {
			fbid.data = res;
			data.finish(fbid);
		});
	},
	get: function get(fbid) {
		return new Promise(function (resolve, reject) {
			var datas = [];
			var promise_array = [];
			var command = fbid.command;
			if (fbid.type === 'group') command = 'group';
			FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/" + fbid.command + "?limit=" + config.limit[fbid.command] + "&fields=" + config.field[fbid.command].toString() + "&debug=all", function (res) {
				data.nowLength += res.data.length;
				$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = res.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var d = _step.value;

						if (command == 'reactions') {
							d.from = { id: d.id, name: d.name };
						}
						datas.push(d);
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

				if (res.data.length > 0 && res.paging.next) {
					getNext(res.paging.next);
				} else {
					resolve(datas);
				}
			});

			function getNext(url) {
				var limit = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

				if (limit !== 0) {
					url = url.replace('limit=500', 'limit=' + limit);
				}
				$.getJSON(url, function (res) {
					data.nowLength += res.data.length;
					$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = res.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var d = _step2.value;

							if (command == 'reactions') {
								d.from = { id: d.id, name: d.name };
							}
							datas.push(d);
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
		$(".update_area,.donate_area").slideUp();
		$(".result_area").slideDown();
		swal('完成！', 'Done!', 'success').done();
		data.raw = fbid;
		data.filter(data.raw, true);
		ui.reset();
	},
	filter: function filter(rawData) {
		var generate = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

		var isDuplicate = $("#unique").prop("checked");
		var isTag = $("#tag").prop("checked");
		var newData = _filter.totalFilter.apply(_filter, [rawData, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));
		rawData.filtered = newData;
		if (generate === true) {
			table.generate(rawData);
		} else {
			return rawData;
		}
	},
	excel: function excel(raw) {
		var newObj = [];
		if (data.extension) {
			$.each(raw.data, function (i) {
				var tmp = {
					"序號": i + 1,
					"臉書連結": 'http://www.facebook.com/' + this.from.id,
					"姓名": this.from.name,
					"分享連結": this.postlink,
					"留言內容": this.story,
					"該分享讚數": this.like_count
				};
				newObj.push(tmp);
			});
		} else {
			$.each(raw.data, function (i) {
				var tmp = {
					"序號": i + 1,
					"臉書連結": 'http://www.facebook.com/' + this.from.id,
					"姓名": this.from.name,
					"表情": this.type || '',
					"留言內容": this.message || this.story,
					"留言時間": timeConverter(this.created_time)
				};
				newObj.push(tmp);
			});
		}
		return newObj;
	},
	import: function _import(file) {
		var reader = new FileReader();

		reader.onload = function (event) {
			var str = event.target.result;
			data.raw = JSON.parse(str);
			data.finish(data.raw);
		};

		reader.readAsText(file);
	}
};

var table = {
	generate: function generate(rawdata) {
		$(".main_table").DataTable().destroy();
		var filterdata = rawdata.filtered;
		var thead = '';
		var tbody = '';
		var pic = $("#picture").prop("checked");
		if (rawdata.command === 'reactions') {
			thead = "<td>序號</td>\n\t\t\t<td>名字</td>\n\t\t\t<td>表情</td>";
		} else if (rawdata.command === 'sharedposts') {
			thead = "<td>序號</td>\n\t\t\t<td>名字</td>\n\t\t\t<td class=\"force-break\">留言內容</td>\n\t\t\t<td width=\"110\">留言時間</td>";
		} else {
			thead = "<td>序號</td>\n\t\t\t<td width=\"200\">名字</td>\n\t\t\t<td class=\"force-break\">留言內容</td>\n\t\t\t<td>讚</td>\n\t\t\t<td class=\"nowrap\">留言時間</td>";
		}

		var host = 'http://www.facebook.com/';
		if (data.raw.type === 'url_comments') host = $('#enterURL .url').val() + '?fb_comment_id=';

		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = filterdata.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var _step3$value = _slicedToArray(_step3.value, 2);

				var j = _step3$value[0];
				var val = _step3$value[1];

				var picture = '';

				if (pic) {
					picture = "<img src=\"http://graph.facebook.com/" + val.from.id + "/picture?type=small\"><br>";
				}
				var td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' target=\"_blank\">" + picture + val.from.name + "</a></td>";
				if (rawdata.command === 'reactions') {
					td += "<td class=\"center\"><span class=\"react " + val.type + "\"></span>" + val.type + "</td>";
				} else if (rawdata.command === 'sharedposts') {
					td += "<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + val.story + "</a></td>\n\t\t\t\t<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
				} else {
					td += "<td class=\"force-break\"><a href=\"" + host + val.id + "\" target=\"_blank\">" + val.message + "</a></td>\n\t\t\t\t<td>" + val.like_count + "</td>\n\t\t\t\t<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
				}
				var tr = "<tr>" + td + "</tr>";
				tbody += tr;
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

		var insert = "<thead><tr align=\"center\">" + thead + "</tr></thead><tbody>" + tbody + "</tbody>";
		$(".main_table").html('').append(insert);

		active();

		function active() {
			var table = $(".main_table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});

			$("#searchName").on('blur change keyup', function () {
				table.columns(1).search(this.value).draw();
			});
			$("#searchComment").on('blur change keyup', function () {
				table.columns(2).search(this.value).draw();
				config.filter.word = this.value;
			});
		}
	},
	redo: function redo() {
		data.filter(data.raw, true);
	}
};

var choose = {
	data: [],
	award: [],
	num: 0,
	detail: false,
	list: [],
	init: function init() {
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
					choose.list.push({ "name": p, "num": n });
				}
			});
		} else {
			choose.num = $("#howmany").val();
		}
		choose.go();
	},
	go: function go() {
		choose.award = genRandomArray(choose.data.filtered.length).splice(0, choose.num);
		var insert = '';
		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			for (var _iterator4 = choose.award[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var i = _step4.value;

				insert += '<tr>' + $('.main_table').DataTable().row(i).node().innerHTML + '</tr>';
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

		$('#awardList table tbody').html(insert);
		$('#awardList table tbody tr').addClass('success');

		if (choose.detail) {
			var now = 0;
			for (var k in choose.list) {
				var tar = $("#awardList tbody tr").eq(now);
				$("<tr><td class=\"prizeName\" colspan=\"5\">獎品： " + choose.list[k].name + " <span>共 " + choose.list[k].num + " 名</span></td></tr>").insertBefore(tar);
				now += choose.list[k].num + 1;
			}
			$("#moreprize").removeClass("active");
			$(".gettotal").removeClass("fadeout");
			$('.prizeDetail').removeClass("fadein");
		}
		$("#awardList").fadeIn(1000);
	}
};

var fbid = {
	fbid: [],
	init: function init(type) {
		fbid.fbid = [];
		data.init();
		FB.api("/me", function (res) {
			data.userid = res.id;
			var url = fbid.format($('#enterURL .url').val());
			fbid.get(url, type).then(function (fbid) {
				data.start(fbid);
			});
			$('.identity').removeClass('hide').html("登入身份：<img src=\"http://graph.facebook.com/" + res.id + "/picture?type=small\"><span>" + res.name + "</span>");
		});
	},
	get: function get(url, type) {
		return new Promise(function (resolve, reject) {
			if (type == 'url_comments') {
				var posturl = url;
				if (posturl.indexOf("?") > 0) {
					posturl = posturl.substring(0, posturl.indexOf("?"));
				}
				FB.api("/" + posturl, function (res) {
					var obj = { fullID: res.og_object.id, type: type, command: 'comments' };
					resolve(obj);
				});
			} else {
				(function () {
					var regex = /\d{4,}/g;
					var result = url.match(regex);
					var urltype = fbid.checkType(url);
					fbid.checkPageID(url, urltype).then(function (id) {
						if (id === 'personal') {
							urltype = 'personal';
							id = data.userid;
						}
						var obj = { pageID: id, type: urltype, command: type };
						if (urltype === 'personal') {
							var start = url.indexOf('fbid=');
							if (start >= 0) {
								var end = url.indexOf("&", start);
								obj.pureID = url.substring(start + 5, end);
							} else {
								var _start = url.indexOf('posts/');
								obj.pureID = url.substring(_start + 6, url.length);
							}
							obj.fullID = obj.pageID + '_' + obj.pureID;
							resolve(obj);
						} else if (urltype === 'pure') {
							obj.fullID = url.replace(/\"/g, '');
							resolve(obj);
						} else {
							if (urltype === 'event') {
								if (result.length == 1) {
									//抓EVENT中所有留言
									obj.command = 'feed';
									obj.fullID = result[0];
									resolve(obj);
								} else {
									//抓EVENT中某篇留言的留言
									obj.fullID = result[1];
									resolve(obj);
								}
							} else if (urltype === 'group') {
								if (fb.user_posts) {
									obj.pureID = result[result.length - 1];
									obj.fullID = obj.pureID;
									resolve(obj);
								} else {
									swal({
										title: '社團使用需付費，詳情請見粉絲團',
										html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
										type: 'warning'
									}).done();
								}
							} else {
								if (result.length == 1 || result.length == 3) {
									obj.pureID = result[0];
									obj.fullID = obj.pageID + '_' + obj.pureID;
									resolve(obj);
								} else {
									if (urltype === 'unname') {
										obj.pureID = result[0];
										obj.pageID = result[result.length - 1];
									} else {
										obj.pureID = result[result.length - 1];
									}
									obj.fullID = obj.pageID + '_' + obj.pureID;
									resolve(obj);
								}
							}
						}
					});
				})();
			}
		});
	},
	checkType: function checkType(posturl) {
		if (posturl.indexOf("fbid=") >= 0) {
			if (posturl.indexOf('permalink') >= 0) {
				return 'unname';
			} else {
				return 'personal';
			}
		};
		if (posturl.indexOf("/groups/") >= 0) {
			return 'group';
		};
		if (posturl.indexOf("events") >= 0) {
			return 'event';
		};
		if (posturl.indexOf('"') >= 0) {
			return 'pure';
		};
		return 'normal';
	},
	checkPageID: function checkPageID(posturl, type) {
		return new Promise(function (resolve, reject) {
			var start = posturl.indexOf("facebook.com") + 13;
			var end = posturl.indexOf("/", start);
			var regex = /\d{4,}/g;
			if (end < 0) {
				if (posturl.indexOf('fbid=') >= 0) {
					if (type === 'unname') {
						resolve('unname');
					} else {
						resolve('personal');
					}
				} else {
					resolve(posturl.match(regex)[1]);
				}
			} else {
				var group = posturl.indexOf('/groups/');
				var event = posturl.indexOf('/events/');
				if (group >= 0) {
					start = group + 8;
					end = posturl.indexOf("/", start);
					var regex2 = /\d{6,}/g;
					var temp = posturl.substring(start, end);
					if (regex2.test(temp)) {
						resolve(temp);
					} else {
						resolve('group');
					}
				} else if (event >= 0) {
					resolve('event');
				} else {
					var pagename = posturl.substring(start, end);
					FB.api("/" + pagename, function (res) {
						if (res.error) {
							resolve('personal');
						} else {
							resolve(res.id);
						}
					});
				}
			}
		});
	},
	format: function format(url) {
		if (url.indexOf('business.facebook.com/') >= 0) {
			url = url.substring(0, url.indexOf("?"));
			return url;
		} else {
			return url;
		}
	}
};

var _filter = {
	totalFilter: function totalFilter(rawdata, isDuplicate, isTag, word, react, endTime) {
		var data = rawdata.data;
		if (isDuplicate) {
			data = _filter.unique(data);
		}
		if (word !== '') {
			data = _filter.word(data, word);
		}
		if (isTag) {
			data = _filter.tag(data);
		}
		if (rawdata.command !== 'reactions') {
			data = _filter.time(data, endTime);
		} else {
			data = _filter.react(data, react);
		}

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
	init: function init() {},
	reset: function reset() {
		var command = data.raw.command;
		if (command === 'reactions') {
			$('.limitTime, #searchComment').addClass('hide');
			$('.uipanel .react').removeClass('hide');
		} else {
			$('.limitTime, #searchComment').removeClass('hide');
			$('.uipanel .react').addClass('hide');
		}
		if (command === 'comments') {
			$('label.tag').removeClass('hide');
		} else {
			if ($("#tag").prop("checked")) {
				$("#tag").click();
			}
			$('label.tag').addClass('hide');
		}
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
	var uri = "data:text/csv;charset=utf-8,﻿" + encodeURI(CSV);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoYXNoIiwibG9jYXRpb24iLCJzZWFyY2giLCJpbmRleE9mIiwicmVtb3ZlQ2xhc3MiLCJkYXRhIiwiZXh0ZW5zaW9uIiwiY2xpY2siLCJlIiwiZmIiLCJleHRlbnNpb25BdXRoIiwiZ2V0QXV0aCIsImNob29zZSIsImluaXQiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwiYXBwZW5kIiwia2V5ZG93biIsImN0cmxLZXkiLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiZGF0ZXJhbmdlcGlja2VyIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsImVuZFRpbWUiLCJmb3JtYXQiLCJzZXRTdGFydERhdGUiLCJub3dEYXRlIiwiZmlsdGVyRGF0YSIsInJhdyIsIkpTT04iLCJzdHJpbmdpZnkiLCJvcGVuIiwiZm9jdXMiLCJsZW5ndGgiLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJleGNlbCIsImV4Y2VsU3RyaW5nIiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwiZmllbGQiLCJjb21tZW50cyIsInJlYWN0aW9ucyIsInNoYXJlZHBvc3RzIiwidXJsX2NvbW1lbnRzIiwiZmVlZCIsImxpbWl0IiwiYXBpVmVyc2lvbiIsImdyb3VwIiwid29yZCIsImF1dGgiLCJ1c2VyX3Bvc3RzIiwidHlwZSIsIkZCIiwibG9naW4iLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsInN3YWwiLCJkb25lIiwidGl0bGUiLCJodG1sIiwiZmJpZCIsImV4dGVuc2lvbkNhbGxiYWNrIiwiZGF0YXMiLCJjb21tYW5kIiwicGFyc2UiLCJmaW5pc2giLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImdldCIsInRoZW4iLCJyZXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInByb21pc2VfYXJyYXkiLCJhcGkiLCJmdWxsSUQiLCJ0b1N0cmluZyIsImQiLCJmcm9tIiwiaWQiLCJuYW1lIiwicHVzaCIsInBhZ2luZyIsIm5leHQiLCJnZXROZXh0IiwicmVwbGFjZSIsImdldEpTT04iLCJmYWlsIiwic2xpZGVVcCIsInNsaWRlRG93biIsInVpIiwicmVzZXQiLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImZpbHRlcmVkIiwibmV3T2JqIiwiZWFjaCIsImkiLCJ0bXAiLCJwb3N0bGluayIsInN0b3J5IiwibGlrZV9jb3VudCIsIm1lc3NhZ2UiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInN0ciIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwiZmlsdGVyZGF0YSIsInRoZWFkIiwidGJvZHkiLCJwaWMiLCJob3N0IiwiZW50cmllcyIsImoiLCJwaWN0dXJlIiwidGQiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJ2YWx1ZSIsImRyYXciLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJuIiwicGFyc2VJbnQiLCJmaW5kIiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJyb3ciLCJub2RlIiwiaW5uZXJIVE1MIiwibm93IiwiayIsInRhciIsImVxIiwiaW5zZXJ0QmVmb3JlIiwicG9zdHVybCIsInN1YnN0cmluZyIsIm9iaiIsIm9nX29iamVjdCIsInJlZ2V4IiwibWF0Y2giLCJ1cmx0eXBlIiwiY2hlY2tUeXBlIiwiY2hlY2tQYWdlSUQiLCJwYWdlSUQiLCJwdXJlSUQiLCJyZWdleDIiLCJ0ZW1wIiwidGVzdCIsInBhZ2VuYW1lIiwiZXJyb3IiLCJ1bmlxdWUiLCJ0YWciLCJ0aW1lIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsInNwbGl0IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwiYSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsIm1hcCIsImluZGV4IiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJzbGljZSIsImFsZXJ0IiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJsaW5rIiwiY3JlYXRlRWxlbWVudCIsImhyZWYiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFB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QW9DZ0YsR0FBcEMsRUFBeUM7QUFDckMsTUFBSTRDLE1BQU0sRUFBVjs7QUFFQTtBQUNBLE9BQUssSUFBSTBELEtBQVQsSUFBa0JVLFFBQVFoSCxDQUFSLENBQWxCLEVBQThCO0FBQzFCNEMsVUFBTyxNQUFNb0UsUUFBUWhILENBQVIsRUFBV3NHLEtBQVgsQ0FBTixHQUEwQixJQUFqQztBQUNIOztBQUVEMUQsTUFBSXNFLEtBQUosQ0FBVSxDQUFWLEVBQWF0RSxJQUFJNUgsTUFBSixHQUFhLENBQTFCOztBQUVBO0FBQ0FpTSxTQUFPckUsTUFBTSxNQUFiO0FBQ0g7O0FBRUQsS0FBSXFFLE9BQU8sRUFBWCxFQUFlO0FBQ1hFLFFBQU0sY0FBTjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxLQUFJQyxXQUFXLEVBQWY7QUFDQTtBQUNBQSxhQUFZTixZQUFZaEksT0FBWixDQUFvQixJQUFwQixFQUF5QixHQUF6QixDQUFaOztBQUVBO0FBQ0EsS0FBSXVJLE1BQU0sa0NBQXVDQyxVQUFVTCxHQUFWLENBQWpEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSU0sT0FBT3BQLFNBQVNxUCxhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQUQsTUFBS0UsSUFBTCxHQUFZSixHQUFaOztBQUVBO0FBQ0FFLE1BQUtHLEtBQUwsR0FBYSxtQkFBYjtBQUNBSCxNQUFLSSxRQUFMLEdBQWdCUCxXQUFXLE1BQTNCOztBQUVBO0FBQ0FqUCxVQUFTeVAsSUFBVCxDQUFjQyxXQUFkLENBQTBCTixJQUExQjtBQUNBQSxNQUFLM08sS0FBTDtBQUNBVCxVQUFTeVAsSUFBVCxDQUFjRSxXQUFkLENBQTBCUCxJQUExQjtBQUNIIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZyx1cmwsbClcclxue1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKXtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIixcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5lcnJvclwiKS5mYWRlSW4oKTtcclxuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHRcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblx0bGV0IGhhc2ggPSBsb2NhdGlvbi5zZWFyY2g7XHJcblx0aWYgKGhhc2guaW5kZXhPZihcImV4dGVuc2lvblwiKSA+PSAwKXtcclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0ZGF0YS5leHRlbnNpb24gPSB0cnVlO1xyXG5cclxuXHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGggYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRmYi5leHRlbnNpb25BdXRoKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fbGlrZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgncmVhY3Rpb25zJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fdXJsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCd1cmxfY29tbWVudHMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9wYXlcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ2FkZFNjb3BlJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRjaG9vc2UuaW5pdCgpO1xyXG5cdH0pO1xyXG5cdFxyXG5cdCQoXCIjbW9yZXByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikuYWRkQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5wcml6ZURldGFpbFwiKS5hcHBlbmQoYDxkaXYgY2xhc3M9XCJwcml6ZVwiPjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuWTgeWQje+8mjxpbnB1dCB0eXBlPVwidGV4dFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJpbnB1dF9ncm91cFwiPuaKveeNjuS6uuaVuO+8mjxpbnB1dCB0eXBlPVwibnVtYmVyXCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5rZXlkb3duKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKGUuY3RybEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pKU09OXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQod2luZG93KS5rZXl1cChmdW5jdGlvbihlKXtcclxuXHRcdGlmICghZS5jdHJsS2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukVYQ0VMXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuaXF1ZSwgI3RhZ1wiKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLnVpcGFuZWwgLnJlYWN0XCIpLmNoYW5nZShmdW5jdGlvbigpe1xyXG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRlcmFuZ2VwaWNrZXIoe1xyXG5cdFx0XCJzaW5nbGVEYXRlUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxyXG5cdFx0XCJsb2NhbGVcIjoge1xyXG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVktTU0tREQgICBISDptbVwiLFxyXG5cdFx0XHRcInNlcGFyYXRvclwiOiBcIi1cIixcclxuXHRcdFx0XCJhcHBseUxhYmVsXCI6IFwi56K65a6aXCIsXHJcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcclxuXHRcdFx0XCJmcm9tTGFiZWxcIjogXCJGcm9tXCIsXHJcblx0XHRcdFwidG9MYWJlbFwiOiBcIlRvXCIsXHJcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxyXG5cdFx0XHRcImRheXNPZldlZWtcIjogW1xyXG5cdFx0XHRcIuaXpVwiLFxyXG5cdFx0XHRcIuS4gFwiLFxyXG5cdFx0XHRcIuS6jFwiLFxyXG5cdFx0XHRcIuS4iVwiLFxyXG5cdFx0XHRcIuWbm1wiLFxyXG5cdFx0XHRcIuS6lFwiLFxyXG5cdFx0XHRcIuWFrVwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXHJcblx0XHRcdFwi5LiA5pyIXCIsXHJcblx0XHRcdFwi5LqM5pyIXCIsXHJcblx0XHRcdFwi5LiJ5pyIXCIsXHJcblx0XHRcdFwi5Zub5pyIXCIsXHJcblx0XHRcdFwi5LqU5pyIXCIsXHJcblx0XHRcdFwi5YWt5pyIXCIsXHJcblx0XHRcdFwi5LiD5pyIXCIsXHJcblx0XHRcdFwi5YWr5pyIXCIsXHJcblx0XHRcdFwi5Lmd5pyIXCIsXHJcblx0XHRcdFwi5Y2B5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LiA5pyIXCIsXHJcblx0XHRcdFwi5Y2B5LqM5pyIXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJmaXJzdERheVwiOiAxXHJcblx0XHR9LFxyXG5cdH0sZnVuY3Rpb24oc3RhcnQsIGVuZCwgbGFiZWwpIHtcclxuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUobm93RGF0ZSgpKTtcclxuXHJcblxyXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0bGV0IGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRpZiAoZS5jdHJsS2V5KXtcclxuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0ZjgsJyArIEpTT04uc3RyaW5naWZ5KGZpbHRlckRhdGEpO1xyXG5cdFx0XHR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcclxuXHRcdFx0d2luZG93LmZvY3VzKCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0aWYgKGZpbHRlckRhdGEubGVuZ3RoID4gNzAwMCl7XHJcblx0XHRcdFx0JChcIi5iaWdFeGNlbFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdH1lbHNle1x0XHJcblx0XHRcdFx0SlNPTlRvQ1NWQ29udmVydG9yKGRhdGEuZXhjZWwoZmlsdGVyRGF0YSksIFwiQ29tbWVudF9oZWxwZXJcIiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGZpbHRlckRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHR2YXIgZXhjZWxTdHJpbmcgPSBkYXRhLmV4Y2VsKGZpbHRlckRhdGEpXHJcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcclxuXHR9KTtcclxuXHJcblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xyXG5cdCQoXCIuY2lcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRjaV9jb3VudGVyKys7XHJcblx0XHRpZiAoY2lfY291bnRlciA+PSA1KXtcclxuXHRcdFx0JChcIi5zb3VyY2UgLnVybCwgLnNvdXJjZSAuYnRuXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0JChcIiNpbnB1dEpTT05cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYoZS5jdHJsS2V5KXtcclxuXHRcdFx0ZmIuZ2V0QXV0aCgnc2hhcmVkcG9zdHMnKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+aIquWPluWujOaIkO+8jOeUoueUn+ihqOagvOS4rS4uLi7nrYbmlbjovIPlpJrmmYLmnIPpnIDopoHoirHovIPlpJrmmYLplpPvvIzoq4vnqI3lgJknKTtcclxuXHRcdGRhdGEuaW1wb3J0KHRoaXMuZmlsZXNbMF0pO1xyXG5cdH0pO1xyXG59KTtcclxuXHJcbmxldCBjb25maWcgPSB7XHJcblx0ZmllbGQ6IHtcclxuXHRcdGNvbW1lbnRzOiBbJ2xpa2VfY291bnQnLCdtZXNzYWdlX3RhZ3MnLCdtZXNzYWdlLGZyb20nLCdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHJlYWN0aW9uczogW10sXHJcblx0XHRzaGFyZWRwb3N0czogWydzdG9yeScsJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogW11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzUwMCcsXHJcblx0XHRyZWFjdGlvbnM6ICc1MDAnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcclxuXHRcdGZlZWQ6ICc1MDAnXHJcblx0fSxcclxuXHRhcGlWZXJzaW9uOiB7XHJcblx0XHRjb21tZW50czogJ3YyLjcnLFxyXG5cdFx0cmVhY3Rpb25zOiAndjIuNycsXHJcblx0XHRzaGFyZWRwb3N0czogJ3YyLjMnLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiAndjIuNycsXHJcblx0XHRmZWVkOiAndjIuMycsXHJcblx0XHRncm91cDogJ3YyLjcnXHJcblx0fSxcclxuXHRmaWx0ZXI6IHtcclxuXHRcdHdvcmQ6ICcnLFxyXG5cdFx0cmVhY3Q6ICdhbGwnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRhdXRoOiAncmVhZF9zdHJlYW0sdXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX2dyb3Vwcyx1c2VyX21hbmFnZWRfZ3JvdXBzJ1xyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0dXNlcl9wb3N0czogZmFsc2UsXHJcblx0Z2V0QXV0aDogKHR5cGUpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpPT57XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpe1xyXG5cdFx0XHRcdGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmRleE9mKCdyZWFkX3N0cmVhbScpID49IDApe1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+S7mOiyu+aOiOasiuWujOaIkO+8jOiri+WGjeasoeWft+ihjOaKk+eVmeiogCcsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZpbmlzaGVkISBQbGVhc2UgZ2V0Q29tbWVudHMgYWdhaW4uJyxcclxuXHRcdFx0XHRcdFx0J3N1Y2Nlc3MnXHJcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+S7mOiyu+aOiOasiuWkseaVl++8jOiri+iBr+e1oeeuoeeQhuWToeeiuuiqjScsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgUGxlYXNlIGNvbnRhY3QgdGhlIGFkbWluLicsXHJcblx0XHRcdFx0XHRcdCdlcnJvcidcclxuXHRcdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZSBpZiAodHlwZSA9PSBcInNoYXJlZHBvc3RzXCIpe1xyXG5cdFx0XHRcdGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmRleE9mKFwicmVhZF9zdHJlYW1cIikgPCAwKXtcclxuXHRcdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZihcInJlYWRfc3RyZWFtXCIpID49IDApe1xyXG5cdFx0XHRcdFx0ZmIudXNlcl9wb3N0cyA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSk9PntcclxuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XHJcblx0XHRcdGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmRleE9mKFwicmVhZF9zdHJlYW1cIikgPCAwKXtcclxuXHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+JyxcclxuXHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdFx0bGV0IGRhdGFzID0ge1xyXG5cdFx0XHRcdFx0Y29tbWFuZDogJ3NoYXJlZHBvc3RzJyxcclxuXHRcdFx0XHRcdGRhdGE6IEpTT04ucGFyc2UoJChcIi5jaHJvbWVcIikudmFsKCkpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEucmF3ID0gZGF0YXM7XHJcblx0XHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHJhdzogW10sXHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGRhdGEucmF3ID0gW107XHJcblx0fSxcclxuXHRzdGFydDogKGZiaWQpPT57XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0ZGF0YS5nZXQoZmJpZCkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRmYmlkLmRhdGEgPSByZXM7XHJcblx0XHRcdGRhdGEuZmluaXNoKGZiaWQpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6IChmYmlkKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xyXG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgY29tbWFuZCA9IGZiaWQuY29tbWFuZDtcclxuXHRcdFx0aWYgKGZiaWQudHlwZSA9PT0gJ2dyb3VwJykgY29tbWFuZCA9ICdncm91cCc7XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JmRlYnVnPWFsbGAsKHJlcyk9PntcclxuXHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQ9MCl7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKXtcclxuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCdsaW1pdD0nK2xpbWl0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pLmZhaWwoKCk9PntcclxuXHRcdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZpbmlzaDogKGZiaWQpPT57XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIudXBkYXRlX2FyZWEsLmRvbmF0ZV9hcmVhXCIpLnNsaWRlVXAoKTtcclxuXHRcdCQoXCIucmVzdWx0X2FyZWFcIikuc2xpZGVEb3duKCk7XHJcblx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdGRhdGEucmF3ID0gZmJpZDtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHRcdHVpLnJlc2V0KCk7XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKT0+e1xyXG5cdFx0bGV0IGlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRsZXQgaXNUYWcgPSAkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdHJhd0RhdGEuZmlsdGVyZWQgPSBuZXdEYXRhO1xyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKXtcclxuXHRcdFx0dGFibGUuZ2VuZXJhdGUocmF3RGF0YSk7XHRcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gcmF3RGF0YTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGV4Y2VsOiAocmF3KT0+e1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKXtcclxuXHRcdFx0JC5lYWNoKHJhdy5kYXRhLGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiIDogdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLoqbLliIbkuqvorprmlbhcIiA6IHRoaXMubGlrZV9jb3VudFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkLmVhY2gocmF3LmRhdGEsZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCIgOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi6KGo5oOFXCIgOiB0aGlzLnR5cGUgfHwgJycsXHJcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiIDogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIueVmeiogOaZgumWk1wiIDogdGltZUNvbnZlcnRlcih0aGlzLmNyZWF0ZWRfdGltZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbmV3T2JqO1xyXG5cdH0sXHJcblx0aW1wb3J0OiAoZmlsZSk9PntcclxuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuXHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRsZXQgc3RyID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuXHRcdFx0ZGF0YS5yYXcgPSBKU09OLnBhcnNlKHN0cik7XHJcblx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKHJhd2RhdGEpPT57XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmRhdGEgPSByYXdkYXRhLmZpbHRlcmVkO1xyXG5cdFx0bGV0IHRoZWFkID0gJyc7XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGxldCBwaWMgPSAkKFwiI3BpY3R1cmVcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQ+6KGo5oOFPC90ZD5gO1xyXG5cdFx0fWVsc2UgaWYocmF3ZGF0YS5jb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKXtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjExMFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHQ8dGQ+6K6aPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBob3N0ID0gJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyc7XHJcblx0XHRpZiAoZGF0YS5yYXcudHlwZSA9PT0gJ3VybF9jb21tZW50cycpIGhvc3QgPSAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpICsgJz9mYl9jb21tZW50X2lkPSc7XHJcblxyXG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBmaWx0ZXJkYXRhLmVudHJpZXMoKSl7XHJcblx0XHRcdGxldCBwaWN0dXJlID0gJyc7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAocGljKXtcclxuXHRcdFx0XHRwaWN0dXJlID0gYDxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgdGFyZ2V0PVwiX2JsYW5rXCI+JHtwaWN0dXJlfSR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5gO1xyXG5cdFx0XHRpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcclxuXHRcdFx0fWVsc2UgaWYocmF3ZGF0YS5jb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKXtcclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3Rvcnl9PC9hPjwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cIiR7aG9zdH0ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHJcblxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKFwiI3NlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQkKFwiI3NlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0Y2hvb3NlLmRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBbXTtcclxuXHRcdGNob29zZS5saXN0ID0gW107XHJcblx0XHRjaG9vc2UubnVtID0gMDtcclxuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xyXG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XHJcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XHJcblx0XHRcdFx0aWYgKG4gPiAwKXtcclxuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XHJcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcIm5hbWVcIjpwLCBcIm51bVwiOiBufSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0fVxyXG5cdFx0Y2hvb3NlLmdvKCk7XHJcblx0fSxcclxuXHRnbzogKCk9PntcclxuXHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhLmZpbHRlcmVkLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHJcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgY2hvb3NlLmF3YXJkKXtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHI+JyArICQoJy5tYWluX3RhYmxlJykuRGF0YVRhYmxlKCkucm93KGkpLm5vZGUoKS5pbm5lckhUTUwgKyAnPC90cj4nO1xyXG5cdFx0fVxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdGlmKGNob29zZS5kZXRhaWwpe1xyXG5cdFx0XHRsZXQgbm93ID0gMDtcclxuXHRcdFx0Zm9yKGxldCBrIGluIGNob29zZS5saXN0KXtcclxuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcclxuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjVcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZiaWQgPSB7XHJcblx0ZmJpZDogW10sXHJcblx0aW5pdDogKHR5cGUpPT57XHJcblx0XHRmYmlkLmZiaWQgPSBbXTtcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0RkIuYXBpKFwiL21lXCIsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0ZGF0YS51c2VyaWQgPSByZXMuaWQ7XHJcblx0XHRcdGxldCB1cmwgPSBmYmlkLmZvcm1hdCgkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdFx0ZmJpZC5nZXQodXJsLCB0eXBlKS50aGVuKChmYmlkKT0+e1xyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdCQoJy5pZGVudGl0eScpLnJlbW92ZUNsYXNzKCdoaWRlJykuaHRtbChg55m75YWl6Lqr5Lu977yaPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7cmVzLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48c3Bhbj4ke3Jlcy5uYW1lfTwvc3Bhbj5gKVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXQ6ICh1cmwsIHR5cGUpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0aWYgKHR5cGUgPT0gJ3VybF9jb21tZW50cycpe1xyXG5cdFx0XHRcdGxldCBwb3N0dXJsID0gdXJsO1xyXG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCI/XCIpID4gMCl7XHJcblx0XHRcdFx0XHRwb3N0dXJsID0gcG9zdHVybC5zdWJzdHJpbmcoMCxwb3N0dXJsLmluZGV4T2YoXCI/XCIpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0RkIuYXBpKGAvJHtwb3N0dXJsfWAsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdGxldCBvYmogPSB7ZnVsbElEOiByZXMub2dfb2JqZWN0LmlkLCB0eXBlOiB0eXBlLCBjb21tYW5kOiAnY29tbWVudHMnfTtcclxuXHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0XHRsZXQgcmVzdWx0ID0gdXJsLm1hdGNoKHJlZ2V4KTtcclxuXHRcdFx0XHRsZXQgdXJsdHlwZSA9IGZiaWQuY2hlY2tUeXBlKHVybCk7XHJcblx0XHRcdFx0ZmJpZC5jaGVja1BhZ2VJRCh1cmwsIHVybHR5cGUpLnRoZW4oKGlkKT0+e1xyXG5cdFx0XHRcdFx0aWYgKGlkID09PSAncGVyc29uYWwnKXtcclxuXHRcdFx0XHRcdFx0dXJsdHlwZSA9ICdwZXJzb25hbCc7XHJcblx0XHRcdFx0XHRcdGlkID0gZGF0YS51c2VyaWQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsZXQgb2JqID0ge3BhZ2VJRDogaWQsIHR5cGU6IHVybHR5cGUsIGNvbW1hbmQ6IHR5cGV9O1xyXG5cdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdwZXJzb25hbCcpe1xyXG5cdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZignZmJpZD0nKTtcclxuXHRcdFx0XHRcdFx0aWYoc3RhcnQgPj0gMCl7XHJcblx0XHRcdFx0XHRcdFx0bGV0IGVuZCA9IHVybC5pbmRleE9mKFwiJlwiLHN0YXJ0KTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCs1LGVuZCk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdwb3N0cy8nKTtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCs2LHVybC5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fWVsc2UgaWYgKHVybHR5cGUgPT09ICdwdXJlJyl7XHJcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSB1cmwucmVwbGFjZSgvXFxcIi9nLCcnKTtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAnZXZlbnQnKXtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxKXtcclxuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3miYDmnInnlZnoqIBcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5jb21tYW5kID0gJ2ZlZWQnO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcdFxyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reafkOevh+eVmeiogOeahOeVmeiogFxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFsxXTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1lbHNlIGlmICh1cmx0eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZmIudXNlcl9wb3N0cyl7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnB1cmVJRDtcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiAn56S+5ZyY5L2/55So6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5ZyYJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEgfHwgcmVzdWx0Lmxlbmd0aCA9PSAzKXtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3VubmFtZScpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNoZWNrVHlwZTogKHBvc3R1cmwpPT57XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZmJpZD1cIikgPj0gMCl7XHJcblx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ3Blcm1hbGluaycpID49IDApe1xyXG5cdFx0XHRcdHJldHVybiAndW5uYW1lJztcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0cmV0dXJuICdwZXJzb25hbCc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL2dyb3Vwcy9cIikgPj0gMCl7XHJcblx0XHRcdHJldHVybiAnZ3JvdXAnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJldmVudHNcIikgPj0gMCl7XHJcblx0XHRcdHJldHVybiAnZXZlbnQnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ1wiJykgPj0gMCl7XHJcblx0XHRcdHJldHVybiAncHVyZSc7XHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICdub3JtYWwnO1xyXG5cdH0sXHJcblx0Y2hlY2tQYWdlSUQ6IChwb3N0dXJsLCB0eXBlKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGxldCBzdGFydCA9IHBvc3R1cmwuaW5kZXhPZihcImZhY2Vib29rLmNvbVwiKSsxMztcclxuXHRcdFx0bGV0IGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIixzdGFydCk7XHJcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdGlmIChlbmQgPCAwKXtcclxuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdmYmlkPScpID49IDApe1xyXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICd1bm5hbWUnKXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgndW5uYW1lJyk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHJlc29sdmUocG9zdHVybC5tYXRjaChyZWdleClbMV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bGV0IGdyb3VwID0gcG9zdHVybC5pbmRleE9mKCcvZ3JvdXBzLycpO1xyXG5cdFx0XHRcdGxldCBldmVudCA9IHBvc3R1cmwuaW5kZXhPZignL2V2ZW50cy8nKVxyXG5cdFx0XHRcdGlmIChncm91cCA+PSAwKXtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gZ3JvdXArODtcclxuXHRcdFx0XHRcdGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIixzdGFydCk7XHJcblx0XHRcdFx0XHRsZXQgcmVnZXgyID0gL1xcZHs2LH0vZztcclxuXHRcdFx0XHRcdGxldCB0ZW1wID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsZW5kKTtcclxuXHRcdFx0XHRcdGlmIChyZWdleDIudGVzdCh0ZW1wKSl7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUodGVtcCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgnZ3JvdXAnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZSBpZihldmVudCA+PSAwKXtcclxuXHRcdFx0XHRcdHJlc29sdmUoJ2V2ZW50Jyk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR2YXIgcGFnZW5hbWUgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCxlbmQpO1xyXG5cdFx0XHRcdFx0RkIuYXBpKGAvJHtwYWdlbmFtZX1gLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3Ipe1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUocmVzLmlkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZvcm1hdDogKHVybCk9PntcclxuXHRcdGlmICh1cmwuaW5kZXhPZignYnVzaW5lc3MuZmFjZWJvb2suY29tLycpID49IDApe1xyXG5cdFx0XHR1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKFwiP1wiKSk7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBmaWx0ZXIgPSB7XHJcblx0dG90YWxGaWx0ZXI6IChyYXdkYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBlbmRUaW1lKT0+e1xyXG5cdFx0bGV0IGRhdGEgPSByYXdkYXRhLmRhdGE7XHJcblx0XHRpZiAoaXNEdXBsaWNhdGUpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnVuaXF1ZShkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmICh3b3JkICE9PSAnJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHJhd2RhdGEuY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgZW5kVGltZSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHR1bmlxdWU6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdGlmKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fSxcclxuXHR3b3JkOiAoZGF0YSwgd29yZCk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZS5pbmRleE9mKHdvcmQpID4gLTEpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0YWc6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3Mpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0aW1lOiAoZGF0YSwgdCk9PntcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sKHBhcnNlSW50KHRpbWVfYXJ5WzFdKS0xKSx0aW1lX2FyeVsyXSx0aW1lX2FyeVszXSx0aW1lX2FyeVs0XSx0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRsZXQgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcclxuXHRcdFx0aWYgKGNyZWF0ZWRfdGltZSA8IHRpbWUgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIil7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHJlYWN0OiAoZGF0YSwgdGFyKT0+e1xyXG5cdFx0aWYgKHRhciA9PSAnYWxsJyl7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcil7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IHVpID0ge1xyXG5cdGluaXQ6ICgpPT57XHJcblxyXG5cdH0sXHJcblx0cmVzZXQ6ICgpPT57XHJcblx0XHRsZXQgY29tbWFuZCA9IGRhdGEucmF3LmNvbW1hbmQ7XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpe1xyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGlmICgkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKSl7XHJcblx0XHRcdFx0JChcIiN0YWdcIikuY2xpY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpe1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xyXG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcbiBcdCB2YXIgbW9udGhzID0gWycwMScsJzAyJywnMDMnLCcwNCcsJzA1JywnMDYnLCcwNycsJzA4JywnMDknLCcxMCcsJzExJywnMTInXTtcclxuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuICAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG4gICAgIGlmIChkYXRlIDwgMTApe1xyXG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XHJcbiAgICAgfVxyXG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuICAgICBpZiAobWluIDwgMTApe1xyXG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xyXG4gICAgIH1cclxuICAgICB2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcbiAgICAgaWYgKHNlYyA8IDEwKXtcclxuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcclxuICAgICB9XHJcbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XHJcbiAgICAgcmV0dXJuIHRpbWU7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XHJcbiBcdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XHJcbiBcdH0pO1xyXG4gXHRyZXR1cm4gYXJyYXk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcbiBcdHZhciBpLCByLCB0O1xyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRhcnlbaV0gPSBpO1xyXG4gXHR9XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuIFx0XHR0ID0gYXJ5W3JdO1xyXG4gXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuIFx0XHRhcnlbaV0gPSB0O1xyXG4gXHR9XHJcbiBcdHJldHVybiBhcnk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG4gICAgXHJcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxyXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcbiAgICBcclxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxyXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gICBcclxuICAgIFxyXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcclxuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcclxuICAgIFxyXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcbiAgICBcclxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuICAgIFxyXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTsgICAgXHJcbiAgICBsaW5rLmhyZWYgPSB1cmk7XHJcbiAgICBcclxuICAgIC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcbiAgICBcclxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgbGluay5jbGljaygpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
