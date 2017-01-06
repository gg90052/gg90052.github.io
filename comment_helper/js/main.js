"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var errorMessage = false;
window.onerror = handleErr;

function handleErr(msg, url, l) {
	if (!errorMessage) {
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
		console.log("Error occur URL： " + $('#enterURL .url').val());
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
		if (e.ctrlKey || e.altKey) {
			$("#btn_excel").text("輸出JSON");
		}
	});
	$(window).keyup(function (e) {
		if (!e.ctrlKey || e.altKey) {
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
		if (e.ctrlKey || e.altKey) {
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
			if (fbid.type === 'group' && fbid.command !== 'reactions') fbid.fullID = fbid.pureID;
			console.log(config.apiVersion[command] + "/" + fbid.fullID + "/" + fbid.command + "?limit=" + config.limit[fbid.command] + "&fields=" + config.field[fbid.command].toString() + "&debug=all");
			FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/" + fbid.command + "?limit=" + config.limit[fbid.command] + "&order=chronological&fields=" + config.field[fbid.command].toString() + "&debug=all", function (res) {
				data.nowLength += res.data.length;
				$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = res.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var d = _step.value;

						if (fbid.command == 'reactions') {
							d.from = { id: d.id, name: d.name };
						}
						if (d.from) {
							datas.push(d);
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

							if (d.id) {
								if (fbid.command == 'reactions') {
									d.from = { id: d.id, name: d.name };
								}
								if (d.from) {
									datas.push(d);
								}
							}
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
								if (_start === -1) _start = url.indexOf('ideos/');
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
									obj.pageID = result[0];
									obj.fullID = obj.pageID + "_" + obj.pureID;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsInZhbCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoYXNoIiwibG9jYXRpb24iLCJzZWFyY2giLCJpbmRleE9mIiwicmVtb3ZlQ2xhc3MiLCJkYXRhIiwiZXh0ZW5zaW9uIiwiY2xpY2siLCJlIiwiZmIiLCJleHRlbnNpb25BdXRoIiwiZ2V0QXV0aCIsImNob29zZSIsImluaXQiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwiYXBwZW5kIiwia2V5ZG93biIsImN0cmxLZXkiLCJhbHRLZXkiLCJ0ZXh0Iiwia2V5dXAiLCJvbiIsInRhYmxlIiwicmVkbyIsImNoYW5nZSIsImNvbmZpZyIsImZpbHRlciIsInJlYWN0IiwiZGF0ZXJhbmdlcGlja2VyIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsImVuZFRpbWUiLCJmb3JtYXQiLCJzZXRTdGFydERhdGUiLCJub3dEYXRlIiwiZmlsdGVyRGF0YSIsInJhdyIsIkpTT04iLCJzdHJpbmdpZnkiLCJvcGVuIiwiZm9jdXMiLCJsZW5ndGgiLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJleGNlbCIsImV4Y2VsU3RyaW5nIiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwiZmllbGQiLCJjb21tZW50cyIsInJlYWN0aW9ucyIsInNoYXJlZHBvc3RzIiwidXJsX2NvbW1lbnRzIiwiZmVlZCIsImxpbWl0IiwiYXBpVmVyc2lvbiIsImdyb3VwIiwid29yZCIsImF1dGgiLCJ1c2VyX3Bvc3RzIiwidHlwZSIsIkZCIiwibG9naW4iLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsInN3YWwiLCJkb25lIiwidGl0bGUiLCJodG1sIiwiZmJpZCIsImV4dGVuc2lvbkNhbGxiYWNrIiwiZGF0YXMiLCJjb21tYW5kIiwicGFyc2UiLCJmaW5pc2giLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImdldCIsInRoZW4iLCJyZXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInByb21pc2VfYXJyYXkiLCJmdWxsSUQiLCJwdXJlSUQiLCJ0b1N0cmluZyIsImFwaSIsImQiLCJmcm9tIiwiaWQiLCJuYW1lIiwicHVzaCIsInBhZ2luZyIsIm5leHQiLCJnZXROZXh0IiwicmVwbGFjZSIsImdldEpTT04iLCJmYWlsIiwic2xpZGVVcCIsInNsaWRlRG93biIsInVpIiwicmVzZXQiLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImZpbHRlcmVkIiwibmV3T2JqIiwiZWFjaCIsImkiLCJ0bXAiLCJwb3N0bGluayIsInN0b3J5IiwibGlrZV9jb3VudCIsIm1lc3NhZ2UiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInN0ciIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwiZmlsdGVyZGF0YSIsInRoZWFkIiwidGJvZHkiLCJwaWMiLCJob3N0IiwiZW50cmllcyIsImoiLCJwaWN0dXJlIiwidGQiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJ2YWx1ZSIsImRyYXciLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJuIiwicGFyc2VJbnQiLCJmaW5kIiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJyb3dzIiwibm9kZXMiLCJpbm5lckhUTUwiLCJub3ciLCJrIiwidGFyIiwiZXEiLCJpbnNlcnRCZWZvcmUiLCJwb3N0dXJsIiwic3Vic3RyaW5nIiwib2JqIiwib2dfb2JqZWN0IiwicmVnZXgiLCJtYXRjaCIsInVybHR5cGUiLCJjaGVja1R5cGUiLCJjaGVja1BhZ2VJRCIsInBhZ2VJRCIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJlcnJvciIsInVuaXF1ZSIsInRhZyIsInRpbWUiLCJvdXRwdXQiLCJrZXlzIiwiZm9yRWFjaCIsIml0ZW0iLCJrZXkiLCJuZXdBcnkiLCJncmVwIiwibWVzc2FnZV90YWdzIiwidCIsInRpbWVfYXJ5Iiwic3BsaXQiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJhIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwibWFwIiwiaW5kZXgiLCJhcnkiLCJBcnJheSIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiYWxlcnQiLCJmaWxlTmFtZSIsInVyaSIsImVuY29kZVVSSSIsImxpbmsiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxlQUFlLEtBQW5CO0FBQ0FDLE9BQU9DLE9BQVAsR0FBZUMsU0FBZjs7QUFFQSxTQUFTQSxTQUFULENBQW1CQyxHQUFuQixFQUF1QkMsR0FBdkIsRUFBMkJDLENBQTNCLEVBQ0E7QUFDQyxLQUFJLENBQUNOLFlBQUwsRUFBa0I7QUFDakJPLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUQsVUFBUUMsR0FBUixDQUFZLHNCQUFzQkMsRUFBRSxnQkFBRixF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LEdBQTBCLElBQWpDO0FBQ0g7O0FBRURZLE1BQUlDLEtBQUosQ0FBVSxDQUFWLEVBQWFELElBQUlsTSxNQUFKLEdBQWEsQ0FBMUI7O0FBRUE7QUFDQWlNLFNBQU9DLE1BQU0sTUFBYjtBQUNIOztBQUVELEtBQUlELE9BQU8sRUFBWCxFQUFlO0FBQ1hHLFFBQU0sY0FBTjtBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxLQUFJQyxXQUFXLEVBQWY7QUFDQTtBQUNBQSxhQUFZUCxZQUFZL0gsT0FBWixDQUFvQixJQUFwQixFQUF5QixHQUF6QixDQUFaOztBQUVBO0FBQ0EsS0FBSXVJLE1BQU0sa0NBQXVDQyxVQUFVTixHQUFWLENBQWpEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSU8sT0FBT3JQLFNBQVNzUCxhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQUQsTUFBS0UsSUFBTCxHQUFZSixHQUFaOztBQUVBO0FBQ0FFLE1BQUtHLEtBQUwsR0FBYSxtQkFBYjtBQUNBSCxNQUFLSSxRQUFMLEdBQWdCUCxXQUFXLE1BQTNCOztBQUVBO0FBQ0FsUCxVQUFTMFAsSUFBVCxDQUFjQyxXQUFkLENBQTBCTixJQUExQjtBQUNBQSxNQUFLNU8sS0FBTDtBQUNBVCxVQUFTMFAsSUFBVCxDQUFjRSxXQUFkLENBQTBCUCxJQUExQjtBQUNIIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRXJyKG1zZyx1cmwsbClcclxue1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKXtcclxuXHRcdGNvbnNvbGUubG9nKFwiJWPnmbznlJ/pjK/oqqTvvIzoq4vlsIflrozmlbTpjK/oqqToqIrmga/miKrlnJblgrPpgIHntabnrqHnkIblk6HvvIzkuKbpmYTkuIrkvaDovLjlhaXnmoTntrLlnYBcIixcImZvbnQtc2l6ZTozMHB4OyBjb2xvcjojRjAwXCIpO1xyXG5cdFx0Y29uc29sZS5sb2coXCJFcnJvciBvY2N1ciBVUkzvvJogXCIgKyAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1x0XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG5cdGxldCBoYXNoID0gbG9jYXRpb24uc2VhcmNoO1xyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJleHRlbnNpb25cIikgPj0gMCl7XHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGRhdGEuZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX3VybFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgndXJsX2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fcGF5XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xyXG5cdH0pO1xyXG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0Y2hvb3NlLmluaXQoKTtcclxuXHR9KTtcclxuXHRcclxuXHQkKFwiI21vcmVwcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLmFkZENsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykuYWRkQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykua2V5ZG93bihmdW5jdGlvbihlKXtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24oZSl7XHJcblx0XHRpZiAoIWUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdCQoXCIjYnRuX2V4Y2VsXCIpLnRleHQoXCLovLjlh7pFWENFTFwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi51aXBhbmVsIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcclxuXHRcdFwic2luZ2xlRGF0ZVBpY2tlclwiOiB0cnVlLFxyXG5cdFx0XCJ0aW1lUGlja2VyXCI6IHRydWUsXHJcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcclxuXHRcdFwibG9jYWxlXCI6IHtcclxuXHRcdFx0XCJmb3JtYXRcIjogXCJZWVlZLU1NLUREICAgSEg6bW1cIixcclxuXHRcdFx0XCJzZXBhcmF0b3JcIjogXCItXCIsXHJcblx0XHRcdFwiYXBwbHlMYWJlbFwiOiBcIueiuuWumlwiLFxyXG5cdFx0XHRcImNhbmNlbExhYmVsXCI6IFwi5Y+W5raIXCIsXHJcblx0XHRcdFwiZnJvbUxhYmVsXCI6IFwiRnJvbVwiLFxyXG5cdFx0XHRcInRvTGFiZWxcIjogXCJUb1wiLFxyXG5cdFx0XHRcImN1c3RvbVJhbmdlTGFiZWxcIjogXCJDdXN0b21cIixcclxuXHRcdFx0XCJkYXlzT2ZXZWVrXCI6IFtcclxuXHRcdFx0XCLml6VcIixcclxuXHRcdFx0XCLkuIBcIixcclxuXHRcdFx0XCLkuoxcIixcclxuXHRcdFx0XCLkuIlcIixcclxuXHRcdFx0XCLlm5tcIixcclxuXHRcdFx0XCLkupRcIixcclxuXHRcdFx0XCLlha1cIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcIm1vbnRoTmFtZXNcIjogW1xyXG5cdFx0XHRcIuS4gOaciFwiLFxyXG5cdFx0XHRcIuS6jOaciFwiLFxyXG5cdFx0XHRcIuS4ieaciFwiLFxyXG5cdFx0XHRcIuWbm+aciFwiLFxyXG5cdFx0XHRcIuS6lOaciFwiLFxyXG5cdFx0XHRcIuWFreaciFwiLFxyXG5cdFx0XHRcIuS4g+aciFwiLFxyXG5cdFx0XHRcIuWFq+aciFwiLFxyXG5cdFx0XHRcIuS5neaciFwiLFxyXG5cdFx0XHRcIuWNgeaciFwiLFxyXG5cdFx0XHRcIuWNgeS4gOaciFwiLFxyXG5cdFx0XHRcIuWNgeS6jOaciFwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwiZmlyc3REYXlcIjogMVxyXG5cdFx0fSxcclxuXHR9LGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKG5vd0RhdGUoKSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9leGNlbFwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdHZhciB1cmwgPSAnZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGY4LCcgKyBKU09OLnN0cmluZ2lmeShmaWx0ZXJEYXRhKTtcclxuXHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XHJcblx0XHRcdHdpbmRvdy5mb2N1cygpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA+IDcwMDApe1xyXG5cdFx0XHRcdCQoXCIuYmlnRXhjZWxcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHR9ZWxzZXtcdFxyXG5cdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGEpLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjZ2VuRXhjZWxcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZGF0YS5leGNlbChmaWx0ZXJEYXRhKVxyXG5cdFx0JChcIiNleGNlbGRhdGFcIikudmFsKEpTT04uc3RyaW5naWZ5KGV4Y2VsU3RyaW5nKSk7XHJcblx0fSk7XHJcblxyXG5cdGxldCBjaV9jb3VudGVyID0gMDtcclxuXHQkKFwiLmNpXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0Y2lfY291bnRlcisrO1xyXG5cdFx0aWYgKGNpX2NvdW50ZXIgPj0gNSl7XHJcblx0XHRcdCQoXCIuc291cmNlIC51cmwsIC5zb3VyY2UgLmJ0blwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdCQoXCIjaW5wdXRKU09OXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdH1cclxuXHRcdGlmKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XHJcblx0XHRcdGZiLmdldEF1dGgoJ3NoYXJlZHBvc3RzJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5blrozmiJDvvIznlKLnlJ/ooajmoLzkuK0uLi4u562G5pW46LyD5aSa5pmC5pyD6ZyA6KaB6Iqx6LyD5aSa5pmC6ZaT77yM6KuL56iN5YCZJyk7XHJcblx0XHRkYXRhLmltcG9ydCh0aGlzLmZpbGVzWzBdKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywnbWVzc2FnZV90YWdzJywnbWVzc2FnZSxmcm9tJywnY3JlYXRlZF90aW1lJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcclxuXHRcdGZlZWQ6IFtdXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2Mi43JyxcclxuXHRcdHJlYWN0aW9uczogJ3YyLjcnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi4zJyxcclxuXHRcdHVybF9jb21tZW50czogJ3YyLjcnLFxyXG5cdFx0ZmVlZDogJ3YyLjMnLFxyXG5cdFx0Z3JvdXA6ICd2Mi43J1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxyXG5cdH0sXHJcblx0YXV0aDogJ3JlYWRfc3RyZWFtLHVzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9ncm91cHMsdXNlcl9tYW5hZ2VkX2dyb3VwcydcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdHVzZXJfcG9zdHM6IGZhbHNlLFxyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKXtcclxuXHRcdFx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZigncmVhZF9zdHJlYW0nKSA+PSAwKXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfku5josrvmjojmrIrlrozmiJDvvIzoq4vlho3mrKHln7fooYzmipPnlZnoqIAnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGaW5pc2hlZCEgUGxlYXNlIGdldENvbW1lbnRzIGFnYWluLicsXHJcblx0XHRcdFx0XHRcdCdzdWNjZXNzJ1xyXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfku5josrvmjojmrIrlpLHmlZfvvIzoq4voga/ntaHnrqHnkIblk6Hnorroqo0nLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxyXG5cdFx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2UgaWYgKHR5cGUgPT0gXCJzaGFyZWRwb3N0c1wiKXtcclxuXHRcdFx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZihcInJlYWRfc3RyZWFtXCIpIDwgMCl7XHJcblx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxyXG5cdFx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzLmluZGV4T2YoXCJyZWFkX3N0cmVhbVwiKSA+PSAwKXtcclxuXHRcdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQXV0aDogKCk9PntcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9LFxyXG5cdGV4dGVuc2lvbkNhbGxiYWNrOiAocmVzcG9uc2UpPT57XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZihcInJlYWRfc3RyZWFtXCIpIDwgMCl7XHJcblx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHR0aXRsZTogJ+aKk+WIhuS6q+mcgOS7mOiyu++8jOips+aDheiri+imi+eyiee1suWwiOmggScsXHJcblx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0XHRcdGxldCBkYXRhcyA9IHtcclxuXHRcdFx0XHRcdGNvbW1hbmQ6ICdzaGFyZWRwb3N0cycsXHJcblx0XHRcdFx0XHRkYXRhOiBKU09OLnBhcnNlKCQoXCIuY2hyb21lXCIpLnZhbCgpKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhLnJhdyA9IGRhdGFzO1xyXG5cdFx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IFtdLFxyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0aW5pdDogKCk9PntcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XHJcblx0XHRkYXRhLm5vd0xlbmd0aCA9IDA7XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKT0+e1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGRhdGEuZ2V0KGZiaWQpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0ZmJpZC5kYXRhID0gcmVzO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChmYmlkKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRsZXQgZGF0YXMgPSBbXTtcclxuXHRcdFx0bGV0IHByb21pc2VfYXJyYXkgPSBbXTtcclxuXHRcdFx0bGV0IGNvbW1hbmQgPSBmYmlkLmNvbW1hbmQ7XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcpIGNvbW1hbmQgPSAnZ3JvdXAnO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnICYmIGZiaWQuY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpIGZiaWQuZnVsbElEID0gZmJpZC5wdXJlSUQ7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0mZGVidWc9YWxsYCk7XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19Jm9yZGVyPWNocm9ub2xvZ2ljYWwmZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0mZGVidWc9YWxsYCwocmVzKT0+e1xyXG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcclxuXHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0aWYgKGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGdldE5leHQodXJsLCBsaW1pdD0wKXtcclxuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJ2xpbWl0PTUwMCcsJ2xpbWl0PScrbGltaXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5ub3dMZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoZC5pZCl7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGZiaWQuY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KS5mYWlsKCgpPT57XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmaW5pc2g6IChmYmlkKT0+e1xyXG5cdFx0JChcIi53YWl0aW5nXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLnVwZGF0ZV9hcmVhLC5kb25hdGVfYXJlYVwiKS5zbGlkZVVwKCk7XHJcblx0XHQkKFwiLnJlc3VsdF9hcmVhXCIpLnNsaWRlRG93bigpO1xyXG5cdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XHJcblx0XHRkYXRhLnJhdyA9IGZiaWQ7XHJcblx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0XHR1aS5yZXNldCgpO1xyXG5cdH0sXHJcblx0ZmlsdGVyOiAocmF3RGF0YSwgZ2VuZXJhdGUgPSBmYWxzZSk9PntcclxuXHRcdGxldCBpc0R1cGxpY2F0ZSA9ICQoXCIjdW5pcXVlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0bGV0IGlzVGFnID0gJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIik7XHJcblx0XHRsZXQgbmV3RGF0YSA9IGZpbHRlci50b3RhbEZpbHRlcihyYXdEYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHJcblx0XHRyYXdEYXRhLmZpbHRlcmVkID0gbmV3RGF0YTtcclxuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSl7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKHJhd0RhdGEpO1x0XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHJhd0RhdGE7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdyk9PntcclxuXHRcdHZhciBuZXdPYmogPSBbXTtcclxuXHRcdGlmIChkYXRhLmV4dGVuc2lvbil7XHJcblx0XHRcdCQuZWFjaChyYXcuZGF0YSxmdW5jdGlvbihpKXtcclxuXHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XCLluo/omZ9cIjogaSsxLFxyXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLliIbkuqvpgKPntZBcIiA6IHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiIDogdGhpcy5zdG9yeSxcclxuXHRcdFx0XHRcdFwi6Kmy5YiG5Lqr6K6a5pW4XCIgOiB0aGlzLmxpa2VfY291bnRcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JC5lYWNoKHJhdy5kYXRhLGZ1bmN0aW9uKGkpe1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXHJcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXHJcblx0XHRcdFx0XHRcIuWnk+WQjVwiIDogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcIuihqOaDhVwiIDogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDmmYLplpNcIiA6IHRpbWVDb252ZXJ0ZXIodGhpcy5jcmVhdGVkX3RpbWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ld09iajtcclxuXHR9LFxyXG5cdGltcG9ydDogKGZpbGUpPT57XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblx0XHRcdGRhdGEucmF3ID0gSlNPTi5wYXJzZShzdHIpO1xyXG5cdFx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6IChyYXdkYXRhKT0+e1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBmaWx0ZXJkYXRhID0gcmF3ZGF0YS5maWx0ZXJlZDtcclxuXHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRsZXQgcGljID0gJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0aWYocmF3ZGF0YS5jb21tYW5kID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkPuihqOaDhTwvdGQ+YDtcclxuXHRcdH1lbHNlIGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIxMTBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0PHRkPuiumjwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaG9zdCA9ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nO1xyXG5cdFx0aWYgKGRhdGEucmF3LnR5cGUgPT09ICd1cmxfY29tbWVudHMnKSBob3N0ID0gJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSArICc/ZmJfY29tbWVudF9pZD0nO1xyXG5cclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZGF0YS5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgcGljdHVyZSA9ICcnO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHBpYyl7XHJcblx0XHRcdFx0cGljdHVyZSA9IGA8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PGJyPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxyXG5cdFx0XHQ8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0aWYocmF3ZGF0YS5jb21tYW5kID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XHJcblx0XHRcdH1lbHNlIGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5fTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCIke2hvc3R9JHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZX08L2E+PC90ZD5cclxuXHRcdFx0XHQ8dGQ+JHt2YWwubGlrZV9jb3VudH08L3RkPlxyXG5cdFx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPiR7dGltZUNvbnZlcnRlcih2YWwuY3JlYXRlZF90aW1lKX08L3RkPmA7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHRyID0gYDx0cj4ke3RkfTwvdHI+YDtcclxuXHRcdFx0dGJvZHkgKz0gdHI7XHJcblx0XHR9XHJcblx0XHRsZXQgaW5zZXJ0ID0gYDx0aGVhZD48dHIgYWxpZ249XCJjZW50ZXJcIj4ke3RoZWFkfTwvdHI+PC90aGVhZD48dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuaHRtbCgnJykuYXBwZW5kKGluc2VydCk7XHJcblxyXG5cclxuXHRcdGFjdGl2ZSgpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGFjdGl2ZSgpe1xyXG5cdFx0XHRsZXQgdGFibGUgPSAkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKHtcclxuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JChcIiNzZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0JChcIiNzZWFyY2hDb21tZW50XCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHQuY29sdW1ucygyKVxyXG5cdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCk9PntcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBjaG9vc2UgPSB7XHJcblx0ZGF0YTogW10sXHJcblx0YXdhcmQ6IFtdLFxyXG5cdG51bTogMCxcclxuXHRkZXRhaWw6IGZhbHNlLFxyXG5cdGxpc3Q6IFtdLFxyXG5cdGluaXQ6ICgpPT57XHJcblx0XHRsZXQgdGhlYWQgPSAkKCcubWFpbl90YWJsZSB0aGVhZCcpLmh0bWwoKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcclxuXHRcdGNob29zZS5kYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XHJcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xyXG5cdFx0Y2hvb3NlLm51bSA9IDA7XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcclxuXHRcdFx0JChcIi5wcml6ZURldGFpbCAucHJpemVcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCl7XHJcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xyXG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XCJuYW1lXCI6cCwgXCJudW1cIjogbn0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y2hvb3NlLm51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHRcdH1cclxuXHRcdGNob29zZS5nbygpO1xyXG5cdH0sXHJcblx0Z286ICgpPT57XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjaG9vc2UuZGF0YS5maWx0ZXJlZC5sZW5ndGgpLnNwbGljZSgwLGNob29zZS5udW0pO1xyXG5cdFx0bGV0IGluc2VydCA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGNob29zZS5hd2FyZCl7XHJcblx0XHRcdGluc2VydCArPSAnPHRyPicgKyAkKCcubWFpbl90YWJsZScpLkRhdGFUYWJsZSgpLnJvd3Moe3NlYXJjaDonYXBwbGllZCd9KS5ub2RlcygpW2ldLmlubmVySFRNTCArICc8L3RyPic7XHJcblx0XHR9XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbChpbnNlcnQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcblxyXG5cdFx0aWYoY2hvb3NlLmRldGFpbCl7XHJcblx0XHRcdGxldCBub3cgPSAwO1xyXG5cdFx0XHRmb3IobGV0IGsgaW4gY2hvb3NlLmxpc3Qpe1xyXG5cdFx0XHRcdGxldCB0YXIgPSAkKFwiI2F3YXJkTGlzdCB0Ym9keSB0clwiKS5lcShub3cpO1xyXG5cdFx0XHRcdCQoYDx0cj48dGQgY2xhc3M9XCJwcml6ZU5hbWVcIiBjb2xzcGFuPVwiNVwiPueNjuWTge+8miAke2Nob29zZS5saXN0W2tdLm5hbWV9IDxzcGFuPuWFsSAke2Nob29zZS5saXN0W2tdLm51bX0g5ZCNPC9zcGFuPjwvdGQ+PC90cj5gKS5pbnNlcnRCZWZvcmUodGFyKTtcclxuXHRcdFx0XHRub3cgKz0gKGNob29zZS5saXN0W2tdLm51bSArIDEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIjbW9yZXByaXplXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcclxuXHRcdFx0JCgnLnByaXplRGV0YWlsJykucmVtb3ZlQ2xhc3MoXCJmYWRlaW5cIik7XHJcblx0XHR9XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmJpZCA9IHtcclxuXHRmYmlkOiBbXSxcclxuXHRpbml0OiAodHlwZSk9PntcclxuXHRcdGZiaWQuZmJpZCA9IFtdO1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRGQi5hcGkoXCIvbWVcIixmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRkYXRhLnVzZXJpZCA9IHJlcy5pZDtcclxuXHRcdFx0bGV0IHVybCA9IGZiaWQuZm9ybWF0KCQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0XHRmYmlkLmdldCh1cmwsIHR5cGUpLnRoZW4oKGZiaWQpPT57XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0JCgnLmlkZW50aXR5JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKGDnmbvlhaXouqvku73vvJo8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtyZXMuaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxzcGFuPiR7cmVzLm5hbWV9PC9zcGFuPmApXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKHVybCwgdHlwZSk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRpZiAodHlwZSA9PSAndXJsX2NvbW1lbnRzJyl7XHJcblx0XHRcdFx0bGV0IHBvc3R1cmwgPSB1cmw7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIj9cIikgPiAwKXtcclxuXHRcdFx0XHRcdHBvc3R1cmwgPSBwb3N0dXJsLnN1YnN0cmluZygwLHBvc3R1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRGQi5hcGkoYC8ke3Bvc3R1cmx9YCxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtmdWxsSUQ6IHJlcy5vZ19vYmplY3QuaWQsIHR5cGU6IHR5cGUsIGNvbW1hbmQ6ICdjb21tZW50cyd9O1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSB1cmwubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRcdGxldCB1cmx0eXBlID0gZmJpZC5jaGVja1R5cGUodXJsKTtcclxuXHRcdFx0XHRmYmlkLmNoZWNrUGFnZUlEKHVybCwgdXJsdHlwZSkudGhlbigoaWQpPT57XHJcblx0XHRcdFx0XHRpZiAoaWQgPT09ICdwZXJzb25hbCcpe1xyXG5cdFx0XHRcdFx0XHR1cmx0eXBlID0gJ3BlcnNvbmFsJztcclxuXHRcdFx0XHRcdFx0aWQgPSBkYXRhLnVzZXJpZDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCBvYmogPSB7cGFnZUlEOiBpZCwgdHlwZTogdXJsdHlwZSwgY29tbWFuZDogdHlwZX07XHJcblx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3BlcnNvbmFsJyl7XHJcblx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdmYmlkPScpO1xyXG5cdFx0XHRcdFx0XHRpZihzdGFydCA+PSAwKXtcclxuXHRcdFx0XHRcdFx0XHRsZXQgZW5kID0gdXJsLmluZGV4T2YoXCImXCIsc3RhcnQpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0KzUsZW5kKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ3Bvc3RzLycpO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChzdGFydCA9PT0gLTEpIHN0YXJ0ID0gdXJsLmluZGV4T2YoJ2lkZW9zLycpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0KzYsdXJsLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHR9ZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3B1cmUnKXtcclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHVybC5yZXBsYWNlKC9cXFwiL2csJycpO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdldmVudCcpe1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEpe1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reaJgOacieeVmeiogFxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmNvbW1hbmQgPSAnZmVlZCc7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1x0XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHQvL+aKk0VWRU5U5Lit5p+Q56+H55WZ6KiA55qE55WZ6KiAXHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gcmVzdWx0WzFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fWVsc2UgaWYgKHVybHR5cGUgPT09ICdncm91cCcpe1xyXG5cdFx0XHRcdFx0XHRcdGlmIChmYi51c2VyX3Bvc3RzKXtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArIFwiX1wiICtvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiAn56S+5ZyY5L2/55So6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5ZyYJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEgfHwgcmVzdWx0Lmxlbmd0aCA9PSAzKXtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3VubmFtZScpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNoZWNrVHlwZTogKHBvc3R1cmwpPT57XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZmJpZD1cIikgPj0gMCl7XHJcblx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ3Blcm1hbGluaycpID49IDApe1xyXG5cdFx0XHRcdHJldHVybiAndW5uYW1lJztcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0cmV0dXJuICdwZXJzb25hbCc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL2dyb3Vwcy9cIikgPj0gMCl7XHJcblx0XHRcdHJldHVybiAnZ3JvdXAnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJldmVudHNcIikgPj0gMCl7XHJcblx0XHRcdHJldHVybiAnZXZlbnQnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ1wiJykgPj0gMCl7XHJcblx0XHRcdHJldHVybiAncHVyZSc7XHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICdub3JtYWwnO1xyXG5cdH0sXHJcblx0Y2hlY2tQYWdlSUQ6IChwb3N0dXJsLCB0eXBlKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGxldCBzdGFydCA9IHBvc3R1cmwuaW5kZXhPZihcImZhY2Vib29rLmNvbVwiKSsxMztcclxuXHRcdFx0bGV0IGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIixzdGFydCk7XHJcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdGlmIChlbmQgPCAwKXtcclxuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdmYmlkPScpID49IDApe1xyXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICd1bm5hbWUnKXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgndW5uYW1lJyk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHJlc29sdmUocG9zdHVybC5tYXRjaChyZWdleClbMV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bGV0IGdyb3VwID0gcG9zdHVybC5pbmRleE9mKCcvZ3JvdXBzLycpO1xyXG5cdFx0XHRcdGxldCBldmVudCA9IHBvc3R1cmwuaW5kZXhPZignL2V2ZW50cy8nKVxyXG5cdFx0XHRcdGlmIChncm91cCA+PSAwKXtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gZ3JvdXArODtcclxuXHRcdFx0XHRcdGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIixzdGFydCk7XHJcblx0XHRcdFx0XHRsZXQgcmVnZXgyID0gL1xcZHs2LH0vZztcclxuXHRcdFx0XHRcdGxldCB0ZW1wID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsZW5kKTtcclxuXHRcdFx0XHRcdGlmIChyZWdleDIudGVzdCh0ZW1wKSl7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUodGVtcCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgnZ3JvdXAnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZSBpZihldmVudCA+PSAwKXtcclxuXHRcdFx0XHRcdHJlc29sdmUoJ2V2ZW50Jyk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR2YXIgcGFnZW5hbWUgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCxlbmQpO1xyXG5cdFx0XHRcdFx0RkIuYXBpKGAvJHtwYWdlbmFtZX1gLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3Ipe1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUocmVzLmlkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZvcm1hdDogKHVybCk9PntcclxuXHRcdGlmICh1cmwuaW5kZXhPZignYnVzaW5lc3MuZmFjZWJvb2suY29tLycpID49IDApe1xyXG5cdFx0XHR1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKFwiP1wiKSk7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBmaWx0ZXIgPSB7XHJcblx0dG90YWxGaWx0ZXI6IChyYXdkYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBlbmRUaW1lKT0+e1xyXG5cdFx0bGV0IGRhdGEgPSByYXdkYXRhLmRhdGE7XHJcblx0XHRpZiAoaXNEdXBsaWNhdGUpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnVuaXF1ZShkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmICh3b3JkICE9PSAnJyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZyl7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIudGFnKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHJhd2RhdGEuY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgZW5kVGltZSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGE7XHJcblx0fSxcclxuXHR1bmlxdWU6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdGlmKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fSxcclxuXHR3b3JkOiAoZGF0YSwgd29yZCk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZS5pbmRleE9mKHdvcmQpID4gLTEpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0YWc6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3Mpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0aW1lOiAoZGF0YSwgdCk9PntcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sKHBhcnNlSW50KHRpbWVfYXJ5WzFdKS0xKSx0aW1lX2FyeVsyXSx0aW1lX2FyeVszXSx0aW1lX2FyeVs0XSx0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRsZXQgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcclxuXHRcdFx0aWYgKGNyZWF0ZWRfdGltZSA8IHRpbWUgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIil7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHJlYWN0OiAoZGF0YSwgdGFyKT0+e1xyXG5cdFx0aWYgKHRhciA9PSAnYWxsJyl7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcil7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IHVpID0ge1xyXG5cdGluaXQ6ICgpPT57XHJcblxyXG5cdH0sXHJcblx0cmVzZXQ6ICgpPT57XHJcblx0XHRsZXQgY29tbWFuZCA9IGRhdGEucmF3LmNvbW1hbmQ7XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpe1xyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGlmICgkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKSl7XHJcblx0XHRcdFx0JChcIiN0YWdcIikuY2xpY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpe1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xyXG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcbiBcdCB2YXIgbW9udGhzID0gWycwMScsJzAyJywnMDMnLCcwNCcsJzA1JywnMDYnLCcwNycsJzA4JywnMDknLCcxMCcsJzExJywnMTInXTtcclxuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuICAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG4gICAgIGlmIChkYXRlIDwgMTApe1xyXG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XHJcbiAgICAgfVxyXG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuICAgICBpZiAobWluIDwgMTApe1xyXG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xyXG4gICAgIH1cclxuICAgICB2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcbiAgICAgaWYgKHNlYyA8IDEwKXtcclxuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcclxuICAgICB9XHJcbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XHJcbiAgICAgcmV0dXJuIHRpbWU7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XHJcbiBcdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XHJcbiBcdH0pO1xyXG4gXHRyZXR1cm4gYXJyYXk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcbiBcdHZhciBpLCByLCB0O1xyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRhcnlbaV0gPSBpO1xyXG4gXHR9XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuIFx0XHR0ID0gYXJ5W3JdO1xyXG4gXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuIFx0XHRhcnlbaV0gPSB0O1xyXG4gXHR9XHJcbiBcdHJldHVybiBhcnk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcbiAgICAvL0lmIEpTT05EYXRhIGlzIG5vdCBhbiBvYmplY3QgdGhlbiBKU09OLnBhcnNlIHdpbGwgcGFyc2UgdGhlIEpTT04gc3RyaW5nIGluIGFuIE9iamVjdFxyXG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG4gICAgXHJcbiAgICB2YXIgQ1NWID0gJyc7ICAgIFxyXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcbiAgICBcclxuICAgIC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuICAgIC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcbiAgICBpZiAoU2hvd0xhYmVsKSB7XHJcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyckRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgcm93ID0gXCJcIjtcclxuICAgICAgICBcclxuICAgICAgICAvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxyXG4gICAgICAgIGFsZXJ0KFwiSW52YWxpZCBkYXRhXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gICBcclxuICAgIFxyXG4gICAgLy9HZW5lcmF0ZSBhIGZpbGUgbmFtZVxyXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcclxuICAgIC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG4gICAgZmlsZU5hbWUgKz0gUmVwb3J0VGl0bGUucmVwbGFjZSgvIC9nLFwiX1wiKTsgICBcclxuICAgIFxyXG4gICAgLy9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuICAgIHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcbiAgICBcclxuICAgIC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG4gICAgLy8geW91IGNhbiB1c2UgZWl0aGVyPj4gd2luZG93Lm9wZW4odXJpKTtcclxuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG4gICAgLy8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuICAgIFxyXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTsgICAgXHJcbiAgICBsaW5rLmhyZWYgPSB1cmk7XHJcbiAgICBcclxuICAgIC8vc2V0IHRoZSB2aXNpYmlsaXR5IGhpZGRlbiBzbyBpdCB3aWxsIG5vdCBlZmZlY3Qgb24geW91ciB3ZWItbGF5b3V0XHJcbiAgICBsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcbiAgICBcclxuICAgIC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgbGluay5jbGljaygpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
