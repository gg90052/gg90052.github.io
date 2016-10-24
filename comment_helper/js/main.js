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

				insert += '<tr>' + $('.main_table').DataTable().rows({ search: 'applied' }).nodes()[i].innerHTML + '</tr>';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoYXNoIiwibG9jYXRpb24iLCJzZWFyY2giLCJpbmRleE9mIiwicmVtb3ZlQ2xhc3MiLCJkYXRhIiwiZXh0ZW5zaW9uIiwiY2xpY2siLCJlIiwiZmIiLCJleHRlbnNpb25BdXRoIiwiZ2V0QXV0aCIsImNob29zZSIsImluaXQiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwiYXBwZW5kIiwia2V5ZG93biIsImN0cmxLZXkiLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiZGF0ZXJhbmdlcGlja2VyIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsImVuZFRpbWUiLCJmb3JtYXQiLCJzZXRTdGFydERhdGUiLCJub3dEYXRlIiwiZmlsdGVyRGF0YSIsInJhdyIsIkpTT04iLCJzdHJpbmdpZnkiLCJvcGVuIiwiZm9jdXMiLCJsZW5ndGgiLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJleGNlbCIsImV4Y2VsU3RyaW5nIiwiY2lfY291bnRlciIsImFsdEtleSIsImltcG9ydCIsImZpbGVzIiwiZmllbGQiLCJjb21tZW50cyIsInJlYWN0aW9ucyIsInNoYXJlZHBvc3RzIiwidXJsX2NvbW1lbnRzIiwiZmVlZCIsImxpbWl0IiwiYXBpVmVyc2lvbiIsImdyb3VwIiwid29yZCIsImF1dGgiLCJ1c2VyX3Bvc3RzIiwidHlwZSIsIkZCIiwibG9naW4iLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsInN3YWwiLCJkb25lIiwidGl0bGUiLCJodG1sIiwiZmJpZCIsImV4dGVuc2lvbkNhbGxiYWNrIiwiZGF0YXMiLCJjb21tYW5kIiwicGFyc2UiLCJmaW5pc2giLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImdldCIsInRoZW4iLCJyZXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInByb21pc2VfYXJyYXkiLCJhcGkiLCJmdWxsSUQiLCJ0b1N0cmluZyIsImQiLCJmcm9tIiwiaWQiLCJuYW1lIiwicHVzaCIsInBhZ2luZyIsIm5leHQiLCJnZXROZXh0IiwicmVwbGFjZSIsImdldEpTT04iLCJmYWlsIiwic2xpZGVVcCIsInNsaWRlRG93biIsInVpIiwicmVzZXQiLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImZpbHRlcmVkIiwibmV3T2JqIiwiZWFjaCIsImkiLCJ0bXAiLCJwb3N0bGluayIsInN0b3J5IiwibGlrZV9jb3VudCIsIm1lc3NhZ2UiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInN0ciIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwiZmlsdGVyZGF0YSIsInRoZWFkIiwidGJvZHkiLCJwaWMiLCJob3N0IiwiZW50cmllcyIsImoiLCJwaWN0dXJlIiwidGQiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJ2YWx1ZSIsImRyYXciLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJuIiwicGFyc2VJbnQiLCJmaW5kIiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJyb3dzIiwibm9kZXMiLCJpbm5lckhUTUwiLCJub3ciLCJrIiwidGFyIiwiZXEiLCJpbnNlcnRCZWZvcmUiLCJwb3N0dXJsIiwic3Vic3RyaW5nIiwib2JqIiwib2dfb2JqZWN0IiwicmVnZXgiLCJtYXRjaCIsInVybHR5cGUiLCJjaGVja1R5cGUiLCJjaGVja1BhZ2VJRCIsInBhZ2VJRCIsInB1cmVJRCIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJlcnJvciIsInVuaXF1ZSIsInRhZyIsInRpbWUiLCJvdXRwdXQiLCJrZXlzIiwiZm9yRWFjaCIsIml0ZW0iLCJrZXkiLCJuZXdBcnkiLCJncmVwIiwibWVzc2FnZV90YWdzIiwidCIsInRpbWVfYXJ5Iiwic3BsaXQiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJhIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwibWFwIiwiaW5kZXgiLCJhcnkiLCJBcnJheSIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiYWxlcnQiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImxpbmsiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0FDLE9BQU9DLE9BQVAsR0FBZUMsU0FBZjs7QUFFQSxTQUFTQSxTQUFULENBQW1CQyxHQUFuQixFQUF1QkMsR0FBdkIsRUFBMkJDLENBQTNCLEVBQ0E7QUFDQyxLQUFJLENBQUNOLFlBQUwsRUFBa0I7QUFDakJPLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUMsSUFBRSxpQkFBRixFQUFxQkMsTUFBckI7QUFDQVYsaUJBQWUs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O0FBRUQ7QUFDQSxNQUFLLElBQUlsSCxJQUFJLENBQWIsRUFBZ0JBLElBQUlnSCxRQUFRak0sTUFBNUIsRUFBb0NpRixHQUFwQyxFQUF5QztBQUNyQyxNQUFJa0gsTUFBTSxFQUFWOztBQUVBO0FBQ0EsT0FBSyxJQUFJWixLQUFULElBQWtCVSxRQUFRaEgsQ0FBUixDQUFsQixFQUE4QjtBQUMxQmtILFVBQU8sTUFBTUYsUUFBUWhILENBQVIsRUFBV3NHLEtBQVgsQ0FBTixHQUEwQixJQUFqQztBQUNIOztBQUVEWSxNQUFJQyxLQUFKLENBQVUsQ0FBVixFQUFhRCxJQUFJbk0sTUFBSixHQUFhLENBQTFCOztBQUVBO0FBQ0FrTSxTQUFPQyxNQUFNLE1BQWI7QUFDSDs7QUFFRCxLQUFJRCxPQUFPLEVBQVgsRUFBZTtBQUNYRyxRQUFNLGNBQU47QUFDQTtBQUNIOztBQUVEO0FBQ0EsS0FBSUMsV0FBVyxFQUFmO0FBQ0E7QUFDQUEsYUFBWVAsWUFBWWhJLE9BQVosQ0FBb0IsSUFBcEIsRUFBeUIsR0FBekIsQ0FBWjs7QUFFQTtBQUNBLEtBQUl3SSxNQUFNLGtDQUF1Q0MsVUFBVU4sR0FBVixDQUFqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUlPLE9BQU90UCxTQUFTdVAsYUFBVCxDQUF1QixHQUF2QixDQUFYO0FBQ0FELE1BQUtFLElBQUwsR0FBWUosR0FBWjs7QUFFQTtBQUNBRSxNQUFLRyxLQUFMLEdBQWEsbUJBQWI7QUFDQUgsTUFBS0ksUUFBTCxHQUFnQlAsV0FBVyxNQUEzQjs7QUFFQTtBQUNBblAsVUFBUzJQLElBQVQsQ0FBY0MsV0FBZCxDQUEwQk4sSUFBMUI7QUFDQUEsTUFBSzdPLEtBQUw7QUFDQVQsVUFBUzJQLElBQVQsQ0FBY0UsV0FBZCxDQUEwQlAsSUFBMUI7QUFDSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG53aW5kb3cub25lcnJvcj1oYW5kbGVFcnJcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXHJcbntcclxuXHRpZiAoIWVycm9yTWVzc2FnZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1x0XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG5cdGxldCBoYXNoID0gbG9jYXRpb24uc2VhcmNoO1xyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJleHRlbnNpb25cIikgPj0gMCl7XHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGRhdGEuZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3VybFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgndXJsX2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fcGF5XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0Y2hvb3NlLmluaXQoKTtcclxuXHR9KTtcclxuXHRcclxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLmFkZENsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykuYWRkQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbihlKXtcclxuXHRcdGlmIChlLmN0cmxLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoIWUuY3RybEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pFWENFTFwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi51aXBhbmVsIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcclxuXHRcdFwic2luZ2xlRGF0ZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcclxuXHRcdFwibG9jYWxlXCI6IHtcclxuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZLU1NLUREICAgSEg6bW1cIixcclxuXHRcdFx0XCJzZXBhcmF0b3JcIjogXCItXCIsXHJcblx0XHRcdFwiYXBwbHlMYWJlbFwiOiBcIueiuuWumlwiLFxyXG5cdFx0XHRcImNhbmNlbExhYmVsXCI6IFwi5Y+W5raIXCIsXHJcblx0XHRcdFwiZnJvbUxhYmVsXCI6IFwiRnJvbVwiLFxyXG5cdFx0XHRcInRvTGFiZWxcIjogXCJUb1wiLFxyXG5cdFx0XHRcImN1c3RvbVJhbmdlTGFiZWxcIjogXCJDdXN0b21cIixcclxuXHRcdFx0XCJkYXlzT2ZXZWVrXCI6IFtcclxuXHRcdFx0XCLml6VcIixcclxuXHRcdFx0XCLkuIBcIixcclxuXHRcdFx0XCLkuoxcIixcclxuXHRcdFx0XCLkuIlcIixcclxuXHRcdFx0XCLlm5tcIixcclxuXHRcdFx0XCLkupRcIixcclxuXHRcdFx0XCLlha1cIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcIm1vbnRoTmFtZXNcIjogW1xyXG5cdFx0XHRcIuS4gOaciFwiLFxyXG5cdFx0XHRcIuS6jOaciFwiLFxyXG5cdFx0XHRcIuS4ieaciFwiLFxyXG5cdFx0XHRcIuWbm+aciFwiLFxyXG5cdFx0XHRcIuS6lOaciFwiLFxyXG5cdFx0XHRcIuWFreaciFwiLFxyXG5cdFx0XHRcIuS4g+aciFwiLFxyXG5cdFx0XHRcIuWFq+aciFwiLFxyXG5cdFx0XHRcIuS5neaciFwiLFxyXG5cdFx0XHRcIuWNgeaciFwiLFxyXG5cdFx0XHRcIuWNgeS4gOaciFwiLFxyXG5cdFx0XHRcIuWNgeS6jOaciFwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwiZmlyc3REYXlcIjogMVxyXG5cdFx0fSxcclxuXHR9LGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKG5vd0RhdGUoKSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0aWYgKGUuY3RybEtleSl7XHJcblx0XHRcdHZhciB1cmwgPSAnZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGY4LCcgKyBKU09OLnN0cmluZ2lmeShmaWx0ZXJEYXRhKTtcclxuXHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XHJcblx0XHRcdHdpbmRvdy5mb2N1cygpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA+IDcwMDApe1xyXG5cdFx0XHRcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHR9ZWxzZXtcdFxyXG5cdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGEpLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZGF0YS5leGNlbChmaWx0ZXJEYXRhKVxyXG5cdFx0JChcIiNleGNlbGRhdGFcIikudmFsKEpTT04uc3RyaW5naWZ5KGV4Y2VsU3RyaW5nKSk7XHJcblx0fSk7XHJcblxyXG5cdGxldCBjaV9jb3VudGVyID0gMDtcclxuXHQkKFwiLmNpXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSl7XHJcblx0XHRcdCQoXCIuc291cmNlIC51cmwsIC5zb3VyY2UgLmJ0blwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdCQoXCIjaW5wdXRKU09OXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdH1cclxuXHRcdGlmKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdGZiLmdldEF1dGgoJ3NoYXJlZHBvc3RzJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywnbWVzc2FnZV90YWdzJywnbWVzc2FnZSxmcm9tJywnY3JlYXRlZF90aW1lJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcclxuXHRcdGZlZWQ6IFtdXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2Mi43JyxcclxuXHRcdHJlYWN0aW9uczogJ3YyLjcnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi4zJyxcclxuXHRcdHVybF9jb21tZW50czogJ3YyLjcnLFxyXG5cdFx0ZmVlZDogJ3YyLjMnLFxyXG5cdFx0Z3JvdXA6ICd2Mi43J1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0YXV0aDogJ3JlYWRfc3RyZWFtLHVzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9ncm91cHMsdXNlcl9tYW5hZ2VkX2dyb3VwcydcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdHVzZXJfcG9zdHM6IGZhbHNlLFxyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZigncmVhZF9zdHJlYW0nKSA+PSAwKXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfku5josrvmjojmrIrlrozmiJDvvIzoq4vlho3mrKHln7fooYzmipPnlZnoqIAnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGaW5pc2hlZCEgUGxlYXNlIGdldENvbW1lbnRzIGFnYWluLicsXHJcblx0XHRcdFx0XHRcdCdzdWNjZXNzJ1xyXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfku5josrvmjojmrIrlpLHmlZfvvIzoq4voga/ntaHnrqHnkIblk6Hnorroqo0nLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxyXG5cdFx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2UgaWYgKHR5cGUgPT0gXCJzaGFyZWRwb3N0c1wiKXtcclxuXHRcdFx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZihcInJlYWRfc3RyZWFtXCIpIDwgMCl7XHJcblx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxyXG5cdFx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzLmluZGV4T2YoXCJyZWFkX3N0cmVhbVwiKSA+PSAwKXtcclxuXHRcdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQXV0aDogKCk9PntcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9LFxyXG5cdGV4dGVuc2lvbkNhbGxiYWNrOiAocmVzcG9uc2UpPT57XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZihcInJlYWRfc3RyZWFtXCIpIDwgMCl7XHJcblx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHRcdGxldCBkYXRhcyA9IHtcclxuXHRcdFx0XHRcdGNvbW1hbmQ6ICdzaGFyZWRwb3N0cycsXHJcblx0XHRcdFx0XHRkYXRhOiBKU09OLnBhcnNlKCQoXCIuY2hyb21lXCIpLnZhbCgpKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhLnJhdyA9IGRhdGFzO1xyXG5cdFx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IFtdLFxyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKT0+e1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGRhdGEuZ2V0KGZiaWQpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0ZmJpZC5kYXRhID0gcmVzO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChmYmlkKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IGNvbW1hbmQgPSBmYmlkLmNvbW1hbmQ7XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcpIGNvbW1hbmQgPSAnZ3JvdXAnO1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7ZmJpZC5jb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtmYmlkLmNvbW1hbmRdfSZmaWVsZHM9JHtjb25maWcuZmllbGRbZmJpZC5jb21tYW5kXS50b1N0cmluZygpfSZkZWJ1Zz1hbGxgLChyZXMpPT57XHJcblx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubm93TGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0PTApe1xyXG5cdFx0XHRcdGlmIChsaW1pdCAhPT0gMCl7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywnbGltaXQ9JytsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpPT57XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmaW5pc2g6IChmYmlkKT0+e1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLnVwZGF0ZV9hcmVhLC5kb25hdGVfYXJlYVwiKS5zbGlkZVVwKCk7XHJcblx0XHQkKFwiLnJlc3VsdF9hcmVhXCIpLnNsaWRlRG93bigpO1xyXG5cdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XHJcblx0XHRkYXRhLnJhdyA9IGZiaWQ7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0XHR1aS5yZXNldCgpO1xyXG5cdH0sXHJcblx0ZmlsdGVyOiAocmF3RGF0YSwgZ2VuZXJhdGUgPSBmYWxzZSk9PntcclxuXHRcdGxldCBpc0R1cGxpY2F0ZSA9ICQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0bGV0IGlzVGFnID0gJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHJcblx0XHRyYXdEYXRhLmZpbHRlcmVkID0gbmV3RGF0YTtcclxuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSl7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKHJhd0RhdGEpO1x0XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHJhd0RhdGE7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdyk9PntcclxuXHRcdHZhciBuZXdPYmogPSBbXTtcclxuXHRcdGlmIChkYXRhLmV4dGVuc2lvbil7XHJcblx0XHRcdCQuZWFjaChyYXcuZGF0YSxmdW5jdGlvbihpKXtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLliIbkuqvpgKPntZBcIiA6IHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiIDogdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi6Kmy5YiG5Lqr6K6a5pW4XCIgOiB0aGlzLmxpa2VfY291bnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JC5lYWNoKHJhdy5kYXRhLGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuihqOaDhVwiIDogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIiA6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpPT57XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBmaWx0ZXJkYXRhID0gcmF3ZGF0YS5maWx0ZXJlZDtcclxuXHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRsZXQgcGljID0gJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0aWYocmF3ZGF0YS5jb21tYW5kID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkPuihqOaDhTwvdGQ+YDtcclxuXHRcdH1lbHNlIGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIxMTBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaG9zdCA9ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nO1xyXG5cdFx0aWYgKGRhdGEucmF3LnR5cGUgPT09ICd1cmxfY29tbWVudHMnKSBob3N0ID0gJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSArICc/ZmJfY29tbWVudF9pZD0nO1xyXG5cclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZGF0YS5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHBpYyl7XHJcblx0XHRcdFx0cGljdHVyZSA9IGA8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0aWYocmF3ZGF0YS5jb21tYW5kID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCIke2hvc3R9JHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZX08L2E+PC90ZD5cclxuXHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHR9XHJcblx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuaHRtbCgnJykuYXBwZW5kKGluc2VydCk7XHJcblxyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JChcIiNzZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0JChcIiNzZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHQuY29sdW1ucygyKVxyXG5cdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCk9PntcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBjaG9vc2UgPSB7XHJcblx0ZGF0YTogW10sXHJcblx0YXdhcmQ6IFtdLFxyXG5cdG51bTogMCxcclxuXHRkZXRhaWw6IGZhbHNlLFxyXG5cdGxpc3Q6IFtdLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XHJcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xyXG5cdFx0Y2hvb3NlLm51bSA9IDA7XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcclxuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCl7XHJcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xyXG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XCJuYW1lXCI6cCwgXCJudW1cIjogbn0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHRcdH1cclxuXHRcdGNob29zZS5nbygpO1xyXG5cdH0sXHJcblx0Z286ICgpPT57XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjaG9vc2UuZGF0YS5maWx0ZXJlZC5sZW5ndGgpLnNwbGljZSgwLGNob29zZS5udW0pO1xyXG5cdFx0bGV0IGluc2VydCA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGNob29zZS5hd2FyZCl7XHJcblx0XHRcdGluc2VydCArPSAnPHRyPicgKyAkKCcubWFpbl90YWJsZScpLkRhdGFUYWJsZSgpLnJvd3Moe3NlYXJjaDonYXBwbGllZCd9KS5ub2RlcygpW2ldLmlubmVySFRNTCArICc8L3RyPic7XHJcblx0XHR9XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0aWYoY2hvb3NlLmRldGFpbCl7XHJcblx0XHRcdGxldCBub3cgPSAwO1xyXG5cdFx0XHRmb3IobGV0IGsgaW4gY2hvb3NlLmxpc3Qpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xyXG5cdFx0XHRcdCQoYDx0cj48dGQgY2xhc3M9XCJwcml6ZU5hbWVcIiBjb2xzcGFuPVwiNVwiPueNjuWTge+8miAke2Nob29zZS5saXN0W2tdLm5hbWV9IDxzcGFuPuWFsSAke2Nob29zZS5saXN0W2tdLm51bX0g5ZCNPC9zcGFuPjwvdGQ+PC90cj5gKS5pbnNlcnRCZWZvcmUodGFyKTtcclxuXHRcdFx0XHRub3cgKz0gKGNob29zZS5saXN0W2tdLm51bSArIDEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIjbW9yZXByaXplXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmJpZCA9IHtcclxuXHRmYmlkOiBbXSxcclxuXHRpbml0OiAodHlwZSk9PntcclxuXHRcdGZiaWQuZmJpZCA9IFtdO1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRGQi5hcGkoXCIvbWVcIixmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRkYXRhLnVzZXJpZCA9IHJlcy5pZDtcclxuXHRcdFx0bGV0IHVybCA9IGZiaWQuZm9ybWF0KCQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0XHRmYmlkLmdldCh1cmwsIHR5cGUpLnRoZW4oKGZiaWQpPT57XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0JCgnLmlkZW50aXR5JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKGDnmbvlhaXouqvku73vvJo8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtyZXMuaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxzcGFuPiR7cmVzLm5hbWV9PC9zcGFuPmApXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKHVybCwgdHlwZSk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRpZiAodHlwZSA9PSAndXJsX2NvbW1lbnRzJyl7XHJcblx0XHRcdFx0bGV0IHBvc3R1cmwgPSB1cmw7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIj9cIikgPiAwKXtcclxuXHRcdFx0XHRcdHBvc3R1cmwgPSBwb3N0dXJsLnN1YnN0cmluZygwLHBvc3R1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRGQi5hcGkoYC8ke3Bvc3R1cmx9YCxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtmdWxsSUQ6IHJlcy5vZ19vYmplY3QuaWQsIHR5cGU6IHR5cGUsIGNvbW1hbmQ6ICdjb21tZW50cyd9O1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSB1cmwubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRcdGxldCB1cmx0eXBlID0gZmJpZC5jaGVja1R5cGUodXJsKTtcclxuXHRcdFx0XHRmYmlkLmNoZWNrUGFnZUlEKHVybCwgdXJsdHlwZSkudGhlbigoaWQpPT57XHJcblx0XHRcdFx0XHRpZiAoaWQgPT09ICdwZXJzb25hbCcpe1xyXG5cdFx0XHRcdFx0XHR1cmx0eXBlID0gJ3BlcnNvbmFsJztcclxuXHRcdFx0XHRcdFx0aWQgPSBkYXRhLnVzZXJpZDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCBvYmogPSB7cGFnZUlEOiBpZCwgdHlwZTogdXJsdHlwZSwgY29tbWFuZDogdHlwZX07XHJcblx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3BlcnNvbmFsJyl7XHJcblx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdmYmlkPScpO1xyXG5cdFx0XHRcdFx0XHRpZihzdGFydCA+PSAwKXtcclxuXHRcdFx0XHRcdFx0XHRsZXQgZW5kID0gdXJsLmluZGV4T2YoXCImXCIsc3RhcnQpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0KzUsZW5kKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ3Bvc3RzLycpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0KzYsdXJsLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHR9ZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3B1cmUnKXtcclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHVybC5yZXBsYWNlKC9cXFwiL2csJycpO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdldmVudCcpe1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEpe1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reaJgOacieeVmeiogFxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmNvbW1hbmQgPSAnZmVlZCc7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1x0XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHQvL+aKk0VWRU5U5Lit5p+Q56+H55WZ6KiA55qE55WZ6KiAXHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gcmVzdWx0WzFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fWVsc2UgaWYgKHVybHR5cGUgPT09ICdncm91cCcpe1xyXG5cdFx0XHRcdFx0XHRcdGlmIChmYi51c2VyX3Bvc3RzKXtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucHVyZUlEO1x0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGl0bGU6ICfnpL7lnJjkvb/nlKjpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlnJgnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSB8fCByZXN1bHQubGVuZ3RoID09IDMpe1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAndW5uYW1lJyl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXTtcclxuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2hlY2tUeXBlOiAocG9zdHVybCk9PntcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJmYmlkPVwiKSA+PSAwKXtcclxuXHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZigncGVybWFsaW5rJykgPj0gMCl7XHJcblx0XHRcdFx0cmV0dXJuICd1bm5hbWUnO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRyZXR1cm4gJ3BlcnNvbmFsJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvZ3JvdXBzL1wiKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdncm91cCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImV2ZW50c1wiKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdldmVudCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignXCInKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdwdXJlJztcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJ25vcm1hbCc7XHJcblx0fSxcclxuXHRjaGVja1BhZ2VJRDogKHBvc3R1cmwsIHR5cGUpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IHN0YXJ0ID0gcG9zdHVybC5pbmRleE9mKFwiZmFjZWJvb2suY29tXCIpKzEzO1xyXG5cdFx0XHRsZXQgZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLHN0YXJ0KTtcclxuXHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0aWYgKGVuZCA8IDApe1xyXG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ2ZiaWQ9JykgPj0gMCl7XHJcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ3VubmFtZScpe1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCd1bm5hbWUnKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShwb3N0dXJsLm1hdGNoKHJlZ2V4KVsxXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgZ3JvdXAgPSBwb3N0dXJsLmluZGV4T2YoJy9ncm91cHMvJyk7XHJcblx0XHRcdFx0bGV0IGV2ZW50ID0gcG9zdHVybC5pbmRleE9mKCcvZXZlbnRzLycpXHJcblx0XHRcdFx0aWYgKGdyb3VwID49IDApe1xyXG5cdFx0XHRcdFx0c3RhcnQgPSBncm91cCs4O1xyXG5cdFx0XHRcdFx0ZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLHN0YXJ0KTtcclxuXHRcdFx0XHRcdGxldCByZWdleDIgPSAvXFxkezYsfS9nO1xyXG5cdFx0XHRcdFx0bGV0IHRlbXAgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCxlbmQpO1xyXG5cdFx0XHRcdFx0aWYgKHJlZ2V4Mi50ZXN0KHRlbXApKXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0ZW1wKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdncm91cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNlIGlmKGV2ZW50ID49IDApe1xyXG5cdFx0XHRcdFx0cmVzb2x2ZSgnZXZlbnQnKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHZhciBwYWdlbmFtZSA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LGVuZCk7XHJcblx0XHRcdFx0XHRGQi5hcGkoYC8ke3BhZ2VuYW1lfWAsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcil7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShyZXMuaWQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Zm9ybWF0OiAodXJsKT0+e1xyXG5cdFx0aWYgKHVybC5pbmRleE9mKCdidXNpbmVzcy5mYWNlYm9vay5jb20vJykgPj0gMCl7XHJcblx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoXCI/XCIpKTtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGZpbHRlciA9IHtcclxuXHR0b3RhbEZpbHRlcjogKHJhd2RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIGVuZFRpbWUpPT57XHJcblx0XHRsZXQgZGF0YSA9IHJhd2RhdGEuZGF0YTtcclxuXHRcdGlmIChpc0R1cGxpY2F0ZSl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHdvcmQgIT09ICcnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci53b3JkKGRhdGEsIHdvcmQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzVGFnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50YWcoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAocmF3ZGF0YS5jb21tYW5kICE9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGltZShkYXRhLCBlbmRUaW1lKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnJlYWN0KGRhdGEsIHJlYWN0KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHR9LFxyXG5cdHVuaXF1ZTogKGRhdGEpPT57XHJcblx0XHRsZXQgb3V0cHV0ID0gW107XHJcblx0XHRsZXQga2V5cyA9IFtdO1xyXG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0bGV0IGtleSA9IGl0ZW0uZnJvbS5pZDtcclxuXHRcdFx0aWYoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XHJcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0b3V0cHV0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9LFxyXG5cdHdvcmQ6IChkYXRhLCB3b3JkKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlLmluZGV4T2Yod29yZCkgPiAtMSl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRhZzogKGRhdGEpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2VfdGFncyl7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHRpbWU6IChkYXRhLCB0KT0+e1xyXG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwocGFyc2VJbnQodGltZV9hcnlbMV0pLTEpLHRpbWVfYXJ5WzJdLHRpbWVfYXJ5WzNdLHRpbWVfYXJ5WzRdLHRpbWVfYXJ5WzVdKSkuX2Q7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XHJcblx0XHRpZiAodGFyID09ICdhbGwnKXtcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKXtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBuZXdBcnk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdWkgPSB7XHJcblx0aW5pdDogKCk9PntcclxuXHJcblx0fSxcclxuXHRyZXNldDogKCk9PntcclxuXHRcdGxldCBjb21tYW5kID0gZGF0YS5yYXcuY29tbWFuZDtcclxuXHRcdGlmIChjb21tYW5kID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJyl7XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0aWYgKCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKXtcclxuXHRcdFx0XHQkKFwiI3RhZ1wiKS5jbGljaygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJ2xhYmVsLnRhZycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBub3dEYXRlKCl7XHJcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IGEuZ2V0TW9udGgoKSsxO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XHJcblx0IHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuIFx0IHZhciBtb250aHMgPSBbJzAxJywnMDInLCcwMycsJzA0JywnMDUnLCcwNicsJzA3JywnMDgnLCcwOScsJzEwJywnMTEnLCcxMiddO1xyXG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG4gICAgIHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG4gICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcbiAgICAgaWYgKGRhdGUgPCAxMCl7XHJcbiAgICAgXHRkYXRlID0gXCIwXCIrZGF0ZTtcclxuICAgICB9XHJcbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcbiAgICAgdmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG4gICAgIGlmIChtaW4gPCAxMCl7XHJcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XHJcbiAgICAgfVxyXG4gICAgIHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuICAgICBpZiAoc2VjIDwgMTApe1xyXG4gICAgIFx0c2VjID0gXCIwXCIrc2VjO1xyXG4gICAgIH1cclxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcclxuICAgICByZXR1cm4gdGltZTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBvYmoyQXJyYXkob2JqKXtcclxuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuIFx0fSk7XHJcbiBcdHJldHVybiBhcnJheTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XHJcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuIFx0dmFyIGksIHIsIHQ7XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdGFyeVtpXSA9IGk7XHJcbiBcdH1cclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG4gXHRcdHQgPSBhcnlbcl07XHJcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG4gXHRcdGFyeVtpXSA9IHQ7XHJcbiBcdH1cclxuIFx0cmV0dXJuIGFyeTtcclxuIH1cclxuXHJcbiBmdW5jdGlvbiBKU09OVG9DU1ZDb252ZXJ0b3IoSlNPTkRhdGEsIFJlcG9ydFRpdGxlLCBTaG93TGFiZWwpIHtcclxuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcbiAgICB2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcbiAgICBcclxuICAgIHZhciBDU1YgPSAnJzsgICAgXHJcbiAgICAvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuICAgIFxyXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG4gICAgLy9UaGlzIGNvbmRpdGlvbiB3aWxsIGdlbmVyYXRlIHRoZSBMYWJlbC9IZWFkZXJcclxuICAgIGlmIChTaG93TGFiZWwpIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICAgICAgcm93ICs9IGluZGV4ICsgJywnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93ID0gcm93LnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLzFzdCBsb29wIGlzIHRvIGV4dHJhY3QgZWFjaCByb3dcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vMm5kIGxvb3Agd2lsbCBleHRyYWN0IGVhY2ggY29sdW1uIGFuZCBjb252ZXJ0IGl0IGluIHN0cmluZyBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuICAgICAgICAgICAgcm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93LnNsaWNlKDAsIHJvdy5sZW5ndGggLSAxKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKENTViA9PSAnJykgeyAgICAgICAgXHJcbiAgICAgICAgYWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSAgIFxyXG4gICAgXHJcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcbiAgICB2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG4gICAgLy90aGlzIHdpbGwgcmVtb3ZlIHRoZSBibGFuay1zcGFjZXMgZnJvbSB0aGUgdGl0bGUgYW5kIHJlcGxhY2UgaXQgd2l0aCBhbiB1bmRlcnNjb3JlXHJcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxyXG4gICAgXHJcbiAgICAvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcclxuICAgIFxyXG4gICAgLy8gTm93IHRoZSBsaXR0bGUgdHJpY2t5IHBhcnQuXHJcbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG4gICAgLy8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcbiAgICAvLyBvciB5b3Ugd2lsbCBub3QgZ2V0IHRoZSBjb3JyZWN0IGZpbGUgZXh0ZW5zaW9uICAgIFxyXG4gICAgXHJcbiAgICAvL3RoaXMgdHJpY2sgd2lsbCBnZW5lcmF0ZSBhIHRlbXAgPGEgLz4gdGFnXHJcbiAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpOyAgICBcclxuICAgIGxpbmsuaHJlZiA9IHVyaTtcclxuICAgIFxyXG4gICAgLy9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcbiAgICBsaW5rLmRvd25sb2FkID0gZmlsZU5hbWUgKyBcIi5jc3ZcIjtcclxuICAgIFxyXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcbiAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xyXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
