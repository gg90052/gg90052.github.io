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
		feed: 'v2.3'
	},
	filter: {
		word: '',
		react: 'all',
		endTime: nowDate()
	},
	auth: 'read_stream,user_photos,user_posts,user_groups,user_managed_groups'
};

var fb = {
	getAuth: function getAuth(type) {
		if (type == "addScope" || type == "sharedposts") {
			FB.login(function (response) {
				fb.callback(response, type);
			}, { scope: config.auth, return_scopes: true });
		} else {
			FB.getLoginStatus(function (response) {
				fb.callback(response, type);
			});
		}
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
			FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/" + fbid.command + "?limit=" + config.limit[command] + "&fields=" + config.field[command].toString(), function (res) {
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
		var data = rawdata.filtered;
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
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = data.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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
					td += "<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + val.message + "</a></td>\n\t\t\t\t<td>" + val.like_count + "</td>\n\t\t\t\t<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
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

		choose.data = data.filter(data.raw);
		choose.award = [];
		if ($("#moreprize").hasClass("active")) {
			choose.detail = true;
			$(".prizeDetail .prize").each(function () {
				var n = parseInt($(this).find("input[type='number']").val());
				var p = $(this).find("input[type='text']").val();
				if (n > 0) {
					choose.num += n;
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

			var url = $('#enterURL .url').val();
			fbid.get(url, type).then(function (fbid) {
				data.start(fbid);
			});
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
								obj.command = 'feed';
								obj.fullID = result[0];
								resolve(obj);
							} else if (urltype === 'group') {
								obj.pureID = result[1];
								obj.fullID = obj.pageID + '_' + obj.pureID;
								resolve(obj);
							} else {
								if (result.length == 1 || result.length == 3) {
									obj.pureID = result[0];
									obj.fullID = obj.pageID + '_' + obj.pureID;
									resolve(obj);
								} else {
									obj.pureID = result[result.length - 1];
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
			return 'personal';
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
					resolve('personal');
				} else {
					resolve(posturl.match(regex)[1]);
				}
			} else {
				var group = posturl.indexOf('/groups/');
				var event = posturl.indexOf('/events/');
				if (group >= 0) {
					start = group + 8;
					end = posturl.indexOf("/", start);
					resolve(posturl.substring(start, end));
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
			$('.react').removeClass('hide');
		} else {
			$('.limitTime, #searchComment').removeClass('hide');
			$('.react').addClass('hide');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoYXNoIiwibG9jYXRpb24iLCJzZWFyY2giLCJpbmRleE9mIiwicmVtb3ZlQ2xhc3MiLCJkYXRhIiwiZXh0ZW5zaW9uIiwiY2xpY2siLCJlIiwiZmIiLCJleHRlbnNpb25BdXRoIiwiZ2V0QXV0aCIsImNob29zZSIsImluaXQiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwiYXBwZW5kIiwia2V5ZG93biIsImN0cmxLZXkiLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwidmFsIiwiZGF0ZXJhbmdlcGlja2VyIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsImVuZFRpbWUiLCJmb3JtYXQiLCJzZXRTdGFydERhdGUiLCJub3dEYXRlIiwiZmlsdGVyRGF0YSIsInJhdyIsIkpTT04iLCJzdHJpbmdpZnkiLCJvcGVuIiwiZm9jdXMiLCJsZW5ndGgiLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJleGNlbCIsImV4Y2VsU3RyaW5nIiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwiZmllbGQiLCJjb21tZW50cyIsInJlYWN0aW9ucyIsInNoYXJlZHBvc3RzIiwidXJsX2NvbW1lbnRzIiwiZmVlZCIsImxpbWl0IiwiYXBpVmVyc2lvbiIsIndvcmQiLCJhdXRoIiwidHlwZSIsIkZCIiwibG9naW4iLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwiZ2V0TG9naW5TdGF0dXMiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwic3dhbCIsImRvbmUiLCJ0aXRsZSIsImh0bWwiLCJmYmlkIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJkYXRhcyIsImNvbW1hbmQiLCJwYXJzZSIsImZpbmlzaCIsInVzZXJpZCIsIm5vd0xlbmd0aCIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJoaWRlIiwiZ2V0IiwidGhlbiIsInJlcyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicHJvbWlzZV9hcnJheSIsImFwaSIsImZ1bGxJRCIsInRvU3RyaW5nIiwiZCIsImZyb20iLCJpZCIsIm5hbWUiLCJwdXNoIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJyZXBsYWNlIiwiZ2V0SlNPTiIsImZhaWwiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwidWkiLCJyZXNldCIsInJhd0RhdGEiLCJnZW5lcmF0ZSIsImlzRHVwbGljYXRlIiwicHJvcCIsImlzVGFnIiwibmV3RGF0YSIsInRvdGFsRmlsdGVyIiwib2JqMkFycmF5IiwiZmlsdGVyZWQiLCJuZXdPYmoiLCJlYWNoIiwiaSIsInRtcCIsInBvc3RsaW5rIiwic3RvcnkiLCJsaWtlX2NvdW50IiwibWVzc2FnZSIsInRpbWVDb252ZXJ0ZXIiLCJjcmVhdGVkX3RpbWUiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50Iiwic3RyIiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJ0aGVhZCIsInRib2R5IiwicGljIiwiZW50cmllcyIsImoiLCJwaWN0dXJlIiwidGQiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJ2YWx1ZSIsImRyYXciLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJuIiwicGFyc2VJbnQiLCJmaW5kIiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJyb3ciLCJub2RlIiwiaW5uZXJIVE1MIiwibm93IiwiayIsInRhciIsImVxIiwiaW5zZXJ0QmVmb3JlIiwicG9zdHVybCIsInN1YnN0cmluZyIsIm9iaiIsIm9nX29iamVjdCIsInJlZ2V4IiwibWF0Y2giLCJ1cmx0eXBlIiwiY2hlY2tUeXBlIiwiY2hlY2tQYWdlSUQiLCJwYWdlSUQiLCJwdXJlSUQiLCJncm91cCIsInBhZ2VuYW1lIiwiZXJyb3IiLCJ1bmlxdWUiLCJ0YWciLCJ0aW1lIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsInNwbGl0IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwiYSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXRlIiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbiIsImdldE1pbnV0ZXMiLCJzZWMiLCJnZXRTZWNvbmRzIiwiVU5JWF90aW1lc3RhbXAiLCJtb250aHMiLCJhcnJheSIsIm1hcCIsImluZGV4IiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJzbGljZSIsImFsZXJ0IiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJsaW5rIiwiY3JlYXRlRWxlbWVudCIsImhyZWYiLCJzdHlsZSIsImRvd25sb2FkIiwiYm9keSIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0MsS0FBSSxDQUFDTixZQUFMLEVBQWtCO0FBQ2pCTyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBZ0QsNEJBQWhEO0FBQ0FDLElBQUUsaUJBQUYsRUFBcUJDLE1BQXJCO0FBQ0FWLGlCQUFlLElBQWY7QUFDQTtBQUNELFFBQU8sS0FBUDtBQUNBO0FBQ0RTLEVBQUVFLFFBQUYsRUFBWUMsS0FB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O0FBQ0giLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxyXG57XHJcblx0aWYgKCFlcnJvck1lc3NhZ2Upe1xyXG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcdFxyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHRsZXQgaGFzaCA9IGxvY2F0aW9uLnNlYXJjaDtcclxuXHRpZiAoaGFzaC5pbmRleE9mKFwiZXh0ZW5zaW9uXCIpID49IDApe1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRkYXRhLmV4dGVuc2lvbiA9IHRydWU7XHJcblxyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aCBidXR0b25cIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRcdGZiLmV4dGVuc2lvbkF1dGgoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRmYi5nZXRBdXRoKCdjb21tZW50cycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9saWtlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCdyZWFjdGlvbnMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl91cmxcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ3VybF9jb21tZW50cycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3BheVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl9jaG9vc2VcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGNob29zZS5pbml0KCk7XHJcblx0fSk7XHJcblx0XHJcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5hZGRDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLmFkZENsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj5gKTtcclxuXHR9KTtcclxuXHJcblx0JCh3aW5kb3cpLmtleWRvd24oZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoZS5jdHJsS2V5KXtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukpTT05cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JCh3aW5kb3cpLmtleXVwKGZ1bmN0aW9uKGUpe1xyXG5cdFx0aWYgKCFlLmN0cmxLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6RVhDRUxcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5pcXVlLCAjdGFnXCIpLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIudWlwYW5lbCAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRjb25maWcuZmlsdGVyLnJlYWN0ID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGVyYW5nZXBpY2tlcih7XHJcblx0XHRcInNpbmdsZURhdGVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyMjRIb3VyXCI6IHRydWUsXHJcblx0XHRcImxvY2FsZVwiOiB7XHJcblx0XHRcdFwiZm9ybWF0XCI6IFwiWVlZWS1NTS1ERCAgIEhIOm1tXCIsXHJcblx0XHRcdFwic2VwYXJhdG9yXCI6IFwiLVwiLFxyXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcclxuXHRcdFx0XCJjYW5jZWxMYWJlbFwiOiBcIuWPlua2iFwiLFxyXG5cdFx0XHRcImZyb21MYWJlbFwiOiBcIkZyb21cIixcclxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcclxuXHRcdFx0XCJjdXN0b21SYW5nZUxhYmVsXCI6IFwiQ3VzdG9tXCIsXHJcblx0XHRcdFwiZGF5c09mV2Vla1wiOiBbXHJcblx0XHRcdFwi5pelXCIsXHJcblx0XHRcdFwi5LiAXCIsXHJcblx0XHRcdFwi5LqMXCIsXHJcblx0XHRcdFwi5LiJXCIsXHJcblx0XHRcdFwi5ZubXCIsXHJcblx0XHRcdFwi5LqUXCIsXHJcblx0XHRcdFwi5YWtXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJtb250aE5hbWVzXCI6IFtcclxuXHRcdFx0XCLkuIDmnIhcIixcclxuXHRcdFx0XCLkuozmnIhcIixcclxuXHRcdFx0XCLkuInmnIhcIixcclxuXHRcdFx0XCLlm5vmnIhcIixcclxuXHRcdFx0XCLkupTmnIhcIixcclxuXHRcdFx0XCLlha3mnIhcIixcclxuXHRcdFx0XCLkuIPmnIhcIixcclxuXHRcdFx0XCLlhavmnIhcIixcclxuXHRcdFx0XCLkuZ3mnIhcIixcclxuXHRcdFx0XCLljYHmnIhcIixcclxuXHRcdFx0XCLljYHkuIDmnIhcIixcclxuXHRcdFx0XCLljYHkuozmnIhcIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcImZpcnN0RGF5XCI6IDFcclxuXHRcdH0sXHJcblx0fSxmdW5jdGlvbihzdGFydCwgZW5kLCBsYWJlbCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5lbmRUaW1lID0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLURELUhILW1tLXNzJyk7XHJcblx0XHR0YWJsZS5yZWRvKCk7XHJcblx0fSk7XHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGEoJ2RhdGVyYW5nZXBpY2tlcicpLnNldFN0YXJ0RGF0ZShub3dEYXRlKCkpO1xyXG5cclxuXHJcblx0JChcIiNidG5fZXhjZWxcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRsZXQgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGlmIChlLmN0cmxLZXkpe1xyXG5cdFx0XHR2YXIgdXJsID0gJ2RhdGE6dGV4dC9qc29uO2NoYXJzZXQ9dXRmOCwnICsgSlNPTi5zdHJpbmdpZnkoZmlsdGVyRGF0YSk7XHJcblx0XHRcdHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xyXG5cdFx0XHR3aW5kb3cuZm9jdXMoKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRpZiAoZmlsdGVyRGF0YS5sZW5ndGggPiA3MDAwKXtcclxuXHRcdFx0XHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0fWVsc2V7XHRcclxuXHRcdFx0XHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2dlbkV4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcclxuXHRcdCQoXCIjZXhjZWxkYXRhXCIpLnZhbChKU09OLnN0cmluZ2lmeShleGNlbFN0cmluZykpO1xyXG5cdH0pO1xyXG5cclxuXHRsZXQgY2lfY291bnRlciA9IDA7XHJcblx0JChcIi5jaVwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGNpX2NvdW50ZXIrKztcclxuXHRcdGlmIChjaV9jb3VudGVyID49IDUpe1xyXG5cdFx0XHQkKFwiLnNvdXJjZSAudXJsLCAuc291cmNlIC5idG5cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHR9XHJcblx0XHRpZihlLmN0cmxLZXkpe1xyXG5cdFx0XHRmYi5nZXRBdXRoKCdzaGFyZWRwb3N0cycpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdCQoXCIjaW5wdXRKU09OXCIpLmNoYW5nZShmdW5jdGlvbigpIHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W5a6M5oiQ77yM55Si55Sf6KGo5qC85LitLi4uLuethuaVuOi8g+WkmuaZguacg+mcgOimgeiKsei8g+WkmuaZgumWk++8jOiri+eojeWAmScpO1xyXG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsJ21lc3NhZ2VfdGFncycsJ21lc3NhZ2UsZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjIuNycsXHJcblx0XHRyZWFjdGlvbnM6ICd2Mi43JyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjIuMycsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Mi43JyxcclxuXHRcdGZlZWQ6ICd2Mi4zJ1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0YXV0aDogJ3JlYWRfc3RyZWFtLHVzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9ncm91cHMsdXNlcl9tYW5hZ2VkX2dyb3VwcydcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiIHx8IHR5cGUgPT0gXCJzaGFyZWRwb3N0c1wiKXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5nZXRMb2dpblN0YXR1cyhmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZigncmVhZF9zdHJlYW0nKSA+PSAwKXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfku5josrvmjojmrIrlrozmiJDvvIzoq4vlho3mrKHln7fooYzmipPnlZnoqIAnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGaW5pc2hlZCEgUGxlYXNlIGdldENvbW1lbnRzIGFnYWluLicsXHJcblx0XHRcdFx0XHRcdCdzdWNjZXNzJ1xyXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfku5josrvmjojmrIrlpLHmlZfvvIzoq4voga/ntaHnrqHnkIblk6Hnorroqo0nLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxyXG5cdFx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2UgaWYgKHR5cGUgPT0gXCJzaGFyZWRwb3N0c1wiKXtcclxuXHRcdFx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZihcInJlYWRfc3RyZWFtXCIpIDwgMCl7XHJcblx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxyXG5cdFx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1x0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGV4dGVuc2lvbkF1dGg6ICgpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRleHRlbnNpb25DYWxsYmFjazogKHJlc3BvbnNlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0aWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzLmluZGV4T2YoXCJyZWFkX3N0cmVhbVwiKSA8IDApe1xyXG5cdFx0XHRcdHN3YWwoe1xyXG5cdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxyXG5cdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0XHRsZXQgZGF0YXMgPSB7XHJcblx0XHRcdFx0XHRjb21tYW5kOiAnc2hhcmVkcG9zdHMnLFxyXG5cdFx0XHRcdFx0ZGF0YTogSlNPTi5wYXJzZSgkKFwiLmNocm9tZVwiKS52YWwoKSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0cmF3OiBbXSxcclxuXHR1c2VyaWQ6ICcnLFxyXG5cdG5vd0xlbmd0aDogMCxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xyXG5cdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHR9LFxyXG5cdHN0YXJ0OiAoZmJpZCk9PntcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRkYXRhLmdldChmYmlkKS50aGVuKChyZXMpPT57XHJcblx0XHRcdGZiaWQuZGF0YSA9IHJlcztcclxuXHRcdFx0ZGF0YS5maW5pc2goZmJpZCk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKGZiaWQpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBjb21tYW5kID0gZmJpZC5jb21tYW5kO1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9LyR7ZmJpZC5jb21tYW5kfT9saW1pdD0ke2NvbmZpZy5saW1pdFtjb21tYW5kXX0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2NvbW1hbmRdLnRvU3RyaW5nKCl9YCwocmVzKT0+e1xyXG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKT0+e1xyXG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZmluaXNoOiAoZmJpZCk9PntcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi51cGRhdGVfYXJlYSwuZG9uYXRlX2FyZWFcIikuc2xpZGVVcCgpO1xyXG5cdFx0JChcIi5yZXN1bHRfYXJlYVwiKS5zbGlkZURvd24oKTtcclxuXHRcdHN3YWwoJ+WujOaIkO+8gScsICdEb25lIScsICdzdWNjZXNzJykuZG9uZSgpO1xyXG5cdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdFx0dWkucmVzZXQoKTtcclxuXHR9LFxyXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpPT57XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0bGV0IG5ld0RhdGEgPSBmaWx0ZXIudG90YWxGaWx0ZXIocmF3RGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xyXG5cdFx0cmF3RGF0YS5maWx0ZXJlZCA9IG5ld0RhdGE7XHJcblx0XHRpZiAoZ2VuZXJhdGUgPT09IHRydWUpe1xyXG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShyYXdEYXRhKTtcdFxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiByYXdEYXRhO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXhjZWw6IChyYXcpPT57XHJcblx0XHR2YXIgbmV3T2JqID0gW107XHJcblx0XHRpZiAoZGF0YS5leHRlbnNpb24pe1xyXG5cdFx0XHQkLmVhY2gocmF3LmRhdGEsZnVuY3Rpb24oaSl7XHJcblx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCIgOiAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCIgOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCIgOiB0aGlzLnBvc3RsaW5rLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIuipsuWIhuS6q+iumuaVuFwiIDogdGhpcy5saWtlX2NvdW50XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQuZWFjaChyYXcuZGF0YSxmdW5jdGlvbihpKXtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLooajmg4VcIiA6IHRoaXMudHlwZSB8fCAnJyxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCIgOiB0aGlzLm1lc3NhZ2UgfHwgdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCIgOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXdPYmo7XHJcblx0fSxcclxuXHRpbXBvcnQ6IChmaWxlKT0+e1xyXG5cdFx0bGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG5cdFx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSk9PntcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZGF0YSA9IHJhd2RhdGEuZmlsdGVyZWQ7XHJcblx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0bGV0IHBpYyA9ICQoXCIjcGljdHVyZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZD7ooajmg4U8L3RkPmA7XHJcblx0XHR9ZWxzZSBpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdzaGFyZWRwb3N0cycpe1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0PHRkIHdpZHRoPVwiMTEwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZD7orpo8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9XHJcblx0XHRmb3IobGV0IFtqLCB2YWxdIG9mIGRhdGEuZW50cmllcygpKXtcclxuXHRcdFx0bGV0IHBpY3R1cmUgPSAnJztcclxuXHRcdFx0aWYgKHBpYyl7XHJcblx0XHRcdFx0cGljdHVyZSA9IGA8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0aWYocmF3ZGF0YS5jb21tYW5kID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHJcblxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKFwiI3NlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdC5jb2x1bW5zKDEpXHJcblx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQkKFwiI3NlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0YWJsZVxyXG5cdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdC5kcmF3KCk7XHJcblx0XHRcdFx0Y29uZmlnLmZpbHRlci53b3JkID0gdGhpcy52YWx1ZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKT0+e1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cclxuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcclxuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCl7XHJcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IG47XHJcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcIm5hbWVcIjpwLCBcIm51bVwiOiBufSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0fVxyXG5cdFx0Y2hvb3NlLmdvKCk7XHJcblx0fSxcclxuXHRnbzogKCk9PntcclxuXHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGNob29zZS5kYXRhLmZpbHRlcmVkLmxlbmd0aCkuc3BsaWNlKDAsY2hvb3NlLm51bSk7XHJcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgY2hvb3NlLmF3YXJkKXtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHI+JyArICQoJy5tYWluX3RhYmxlJykuRGF0YVRhYmxlKCkucm93KGkpLm5vZGUoKS5pbm5lckhUTUwgKyAnPC90cj4nO1xyXG5cdFx0fVxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdGlmKGNob29zZS5kZXRhaWwpe1xyXG5cdFx0XHRsZXQgbm93ID0gMDtcclxuXHRcdFx0Zm9yKGxldCBrIGluIGNob29zZS5saXN0KXtcclxuXHRcdFx0XHRsZXQgdGFyID0gJChcIiNhd2FyZExpc3QgdGJvZHkgdHJcIikuZXEobm93KTtcclxuXHRcdFx0XHQkKGA8dHI+PHRkIGNsYXNzPVwicHJpemVOYW1lXCIgY29sc3Bhbj1cIjVcIj7njY7lk4HvvJogJHtjaG9vc2UubGlzdFtrXS5uYW1lfSA8c3Bhbj7lhbEgJHtjaG9vc2UubGlzdFtrXS5udW19IOWQjTwvc3Bhbj48L3RkPjwvdHI+YCkuaW5zZXJ0QmVmb3JlKHRhcik7XHJcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiI21vcmVwcml6ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XHJcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xyXG5cdFx0fVxyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGZiaWQgPSB7XHJcblx0ZmJpZDogW10sXHJcblx0aW5pdDogKHR5cGUpPT57XHJcblx0XHRmYmlkLmZiaWQgPSBbXTtcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0RkIuYXBpKFwiL21lXCIsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0ZGF0YS51c2VyaWQgPSByZXMuaWQ7XHJcblxyXG5cdFx0XHRsZXQgdXJsID0gJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKTtcclxuXHRcdFx0ZmJpZC5nZXQodXJsLCB0eXBlKS50aGVuKChmYmlkKT0+e1xyXG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XHJcblx0XHRcdH0pXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKHVybCwgdHlwZSk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRpZiAodHlwZSA9PSAndXJsX2NvbW1lbnRzJyl7XHJcblx0XHRcdFx0bGV0IHBvc3R1cmwgPSB1cmw7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIj9cIikgPiAwKXtcclxuXHRcdFx0XHRcdHBvc3R1cmwgPSBwb3N0dXJsLnN1YnN0cmluZygwLHBvc3R1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRGQi5hcGkoYC8ke3Bvc3R1cmx9YCxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtmdWxsSUQ6IHJlcy5vZ19vYmplY3QuaWQsIHR5cGU6IHR5cGUsIGNvbW1hbmQ6ICdjb21tZW50cyd9O1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSB1cmwubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRcdGxldCB1cmx0eXBlID0gZmJpZC5jaGVja1R5cGUodXJsKTtcclxuXHRcdFx0XHRmYmlkLmNoZWNrUGFnZUlEKHVybCwgdXJsdHlwZSkudGhlbigoaWQpPT57XHJcblx0XHRcdFx0XHRpZiAoaWQgPT09ICdwZXJzb25hbCcpe1xyXG5cdFx0XHRcdFx0XHR1cmx0eXBlID0gJ3BlcnNvbmFsJztcclxuXHRcdFx0XHRcdFx0aWQgPSBkYXRhLnVzZXJpZDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCBvYmogPSB7cGFnZUlEOiBpZCwgdHlwZTogdXJsdHlwZSwgY29tbWFuZDogdHlwZX07XHJcblx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3BlcnNvbmFsJyl7XHJcblx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdmYmlkPScpO1xyXG5cdFx0XHRcdFx0XHRpZihzdGFydCA+PSAwKXtcclxuXHRcdFx0XHRcdFx0XHRsZXQgZW5kID0gdXJsLmluZGV4T2YoXCImXCIsc3RhcnQpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0KzUsZW5kKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ3Bvc3RzLycpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0KzYsdXJsLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHR9ZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3B1cmUnKXtcclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHVybC5yZXBsYWNlKC9cXFwiL2csJycpO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdldmVudCcpe1xyXG5cdFx0XHRcdFx0XHRcdG9iai5jb21tYW5kID0gJ2ZlZWQnO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZSBpZiAodXJsdHlwZSA9PT0gJ2dyb3VwJyl7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFsxXTtcclxuXHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PSAxIHx8IHJlc3VsdC5sZW5ndGggPT0gMyl7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNoZWNrVHlwZTogKHBvc3R1cmwpPT57XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZmJpZD1cIikgPj0gMCl7XHJcblx0XHRcdHJldHVybiAncGVyc29uYWwnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvZ3JvdXBzL1wiKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdncm91cCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImV2ZW50c1wiKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdldmVudCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignXCInKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdwdXJlJztcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJ25vcm1hbCc7XHJcblx0fSxcclxuXHRjaGVja1BhZ2VJRDogKHBvc3R1cmwsIHR5cGUpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IHN0YXJ0ID0gcG9zdHVybC5pbmRleE9mKFwiZmFjZWJvb2suY29tXCIpKzEzO1xyXG5cdFx0XHRsZXQgZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLHN0YXJ0KTtcclxuXHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0aWYgKGVuZCA8IDApe1xyXG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ2ZiaWQ9JykgPj0gMCl7XHJcblx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShwb3N0dXJsLm1hdGNoKHJlZ2V4KVsxXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgZ3JvdXAgPSBwb3N0dXJsLmluZGV4T2YoJy9ncm91cHMvJyk7XHJcblx0XHRcdFx0bGV0IGV2ZW50ID0gcG9zdHVybC5pbmRleE9mKCcvZXZlbnRzLycpXHJcblx0XHRcdFx0aWYgKGdyb3VwID49IDApe1xyXG5cdFx0XHRcdFx0c3RhcnQgPSBncm91cCs4O1xyXG5cdFx0XHRcdFx0ZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLHN0YXJ0KTtcclxuXHRcdFx0XHRcdHJlc29sdmUocG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsZW5kKSk7XHJcblx0XHRcdFx0fWVsc2UgaWYoZXZlbnQgPj0gMCl7XHJcblx0XHRcdFx0XHRyZXNvbHZlKCdldmVudCcpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dmFyIHBhZ2VuYW1lID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsZW5kKTtcclxuXHRcdFx0XHRcdEZCLmFwaShgLyR7cGFnZW5hbWV9YCxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yKXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHJlcy5pZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmlsdGVyID0ge1xyXG5cdHRvdGFsRmlsdGVyOiAocmF3ZGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCB3b3JkLCByZWFjdCwgZW5kVGltZSk9PntcclxuXHRcdGxldCBkYXRhID0gcmF3ZGF0YS5kYXRhO1xyXG5cdFx0aWYgKGlzRHVwbGljYXRlKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci51bmlxdWUoZGF0YSk7XHJcblx0XHR9XHJcblx0XHRpZiAod29yZCAhPT0gJycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLndvcmQoZGF0YSwgd29yZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNUYWcpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmIChyYXdkYXRhLmNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIGVuZFRpbWUpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIucmVhY3QoZGF0YSwgcmVhY3QpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkYXRhO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSk9PntcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHQpPT57XHJcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLChwYXJzZUludCh0aW1lX2FyeVsxXSktMSksdGltZV9hcnlbMl0sdGltZV9hcnlbM10sdGltZV9hcnlbNF0sdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XHJcblx0XHRcdGlmIChjcmVhdGVkX3RpbWUgPCB0aW1lIHx8IG4uY3JlYXRlZF90aW1lID09IFwiXCIpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHRyZWFjdDogKGRhdGEsIHRhcik9PntcclxuXHRcdGlmICh0YXIgPT0gJ2FsbCcpe1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG5ld0FyeTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKT0+e1xyXG5cclxuXHR9LFxyXG5cdHJlc2V0OiAoKT0+e1xyXG5cdFx0bGV0IGNvbW1hbmQgPSBkYXRhLnJhdy5jb21tYW5kO1xyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcucmVhY3QnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnJlYWN0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vd0RhdGUoKXtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpKzE7XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdHJldHVybiB5ZWFyK1wiLVwiK21vbnRoK1wiLVwiK2RhdGUrXCItXCIraG91citcIi1cIittaW4rXCItXCIrc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKXtcclxuXHQgdmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG4gXHQgdmFyIG1vbnRocyA9IFsnMDEnLCcwMicsJzAzJywnMDQnLCcwNScsJzA2JywnMDcnLCcwOCcsJzA5JywnMTAnLCcxMScsJzEyJ107XHJcbiAgICAgdmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcbiAgICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuICAgICBpZiAoZGF0ZSA8IDEwKXtcclxuICAgICBcdGRhdGUgPSBcIjBcIitkYXRlO1xyXG4gICAgIH1cclxuICAgICB2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuICAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcbiAgICAgaWYgKG1pbiA8IDEwKXtcclxuICAgICBcdG1pbiA9IFwiMFwiK21pbjtcclxuICAgICB9XHJcbiAgICAgdmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG4gICAgIGlmIChzZWMgPCAxMCl7XHJcbiAgICAgXHRzZWMgPSBcIjBcIitzZWM7XHJcbiAgICAgfVxyXG4gICAgIHZhciB0aW1lID0geWVhcisnLScrbW9udGgrJy0nK2RhdGUrXCIgXCIraG91cisnOicrbWluKyc6JytzZWMgO1xyXG4gICAgIHJldHVybiB0aW1lO1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIG9iajJBcnJheShvYmope1xyXG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xyXG4gXHRcdHJldHVybiBbdmFsdWVdO1xyXG4gXHR9KTtcclxuIFx0cmV0dXJuIGFycmF5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuIFx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG4gXHR2YXIgaSwgciwgdDtcclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0YXJ5W2ldID0gaTtcclxuIFx0fVxyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcbiBcdFx0dCA9IGFyeVtyXTtcclxuIFx0XHRhcnlbcl0gPSBhcnlbaV07XHJcbiBcdFx0YXJ5W2ldID0gdDtcclxuIFx0fVxyXG4gXHRyZXR1cm4gYXJ5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG4gICAgLy9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuICAgIHZhciBhcnJEYXRhID0gdHlwZW9mIEpTT05EYXRhICE9ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09ORGF0YSkgOiBKU09ORGF0YTtcclxuICAgIFxyXG4gICAgdmFyIENTViA9ICcnOyAgICBcclxuICAgIC8vU2V0IFJlcG9ydCB0aXRsZSBpbiBmaXJzdCByb3cgb3IgbGluZVxyXG4gICAgXHJcbiAgICAvLyBDU1YgKz0gUmVwb3J0VGl0bGUgKyAnXFxyXFxuXFxuJztcclxuXHJcbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG4gICAgaWYgKFNob3dMYWJlbCkge1xyXG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhWzBdKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL05vdyBjb252ZXJ0IGVhY2ggdmFsdWUgdG8gc3RyaW5nIGFuZCBjb21tYS1zZXByYXRlZFxyXG4gICAgICAgICAgICByb3cgKz0gaW5kZXggKyAnLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuICAgICAgICBDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVtpXSkge1xyXG4gICAgICAgICAgICByb3cgKz0gJ1wiJyArIGFyckRhdGFbaV1baW5kZXhdICsgJ1wiLCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoQ1NWID09ICcnKSB7ICAgICAgICBcclxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9ICAgXHJcbiAgICBcclxuICAgIC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuICAgIGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZyxcIl9cIik7ICAgXHJcbiAgICBcclxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXHJcbiAgICB2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG4gICAgXHJcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuICAgIC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcbiAgICAvLyBidXQgdGhpcyB3aWxsIG5vdCB3b3JrIGluIHNvbWUgYnJvd3NlcnNcclxuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcbiAgICBcclxuICAgIC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxyXG4gICAgbGluay5ocmVmID0gdXJpO1xyXG4gICAgXHJcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG4gICAgbGluay5zdHlsZSA9IFwidmlzaWJpbGl0eTpoaWRkZW5cIjtcclxuICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG4gICAgXHJcbiAgICAvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuICAgIGxpbmsuY2xpY2soKTtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
