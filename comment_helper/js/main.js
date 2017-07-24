"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var errorMessage = false;
window.onerror = handleErr;

function handleErr(msg, url, l) {
	if (!errorMessage) {
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
		console.log("Error occur URL： " + $('#enterURL .url').val());
		$(".console .error").append("<br>" + $('#enterURL .url').val());
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
	if (hash.indexOf("ranker") >= 0) {
		var datas = {
			command: 'ranker',
			data: JSON.parse(localStorage.ranker)
		};
		data.raw = datas;
		data.finish(data.raw);
	}

	$("#btn_comments").click(function (e) {
		console.log(e);
		if (e.ctrlKey || e.altKey) {
			config.order = 'chronological';
		}
		fb.getAuth('comments');
	});

	$("#btn_like").click(function (e) {
		if (e.ctrlKey || e.altKey) {
			config.likes = true;
		}
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
		$(".prizeDetail").append("<div class=\"prize\"><div class=\"input_group\">\u54C1\u540D\uFF1A<input type=\"text\"></div><div class=\"input_group\">\u62BD\u734E\u4EBA\u6578\uFF1A<input type=\"number\"></div></div>");
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
		if (e.ctrlKey || e.altKey) {}
	});
	$("#inputJSON").change(function () {
		$(".waiting").removeClass("hide");
		$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
		data.import(this.files[0]);
	});
});

function shareBTN() {
	alert('認真看完跳出來的那頁上面寫了什麼\n\n看完你就會知道你為什麼不能抓分享');
}

var config = {
	field: {
		comments: ['like_count', 'message_tags', 'message', 'from', 'created_time'],
		reactions: [],
		sharedposts: ['story', 'from', 'created_time'],
		url_comments: [],
		feed: [],
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
		sharedposts: 'v2.9',
		url_comments: 'v2.7',
		feed: 'v2.9',
		group: 'v2.7'
	},
	filter: {
		word: '',
		react: 'all',
		endTime: nowDate()
	},
	order: '',
	auth: 'user_photos,user_posts,user_managed_groups',
	likes: false
};

var fb = {
	user_posts: false,
	getAuth: function getAuth(type) {
		FB.login(function (response) {
			fb.callback(response, type);
		}, { scope: config.auth, return_scopes: true });
	},
	callback: function callback(response, type) {
		console.log(response);
		if (response.status === 'connected') {
			var authStr = response.authResponse.grantedScopes;
			if (type == "addScope") {
				if (authStr.indexOf('user_posts') >= 0) {
					swal('付費授權完成，請再次執行抓留言', 'Authorization Finished! Please getComments again.', 'success').done();
				} else {
					swal('付費授權失敗，請聯絡管理員確認', 'Authorization Failed! Please contact the admin.', 'error').done();
				}
			} else if (type == "sharedposts") {
				if (authStr.indexOf("user_posts") < 0) {
					swal({
						title: '抓分享需付費，詳情請見粉絲專頁',
						html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
						type: 'warning'
					}).done();
				} else {
					fb.user_posts = true;
					fbid.init(type);
				}
			} else {
				if (authStr.indexOf("user_posts") >= 0) {
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
			if (response.authResponse.grantedScopes.indexOf("user_posts") < 0) {
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
			if (config.likes) fbid.command = 'likes';
			console.log(config.apiVersion[command] + "/" + fbid.fullID + "/" + fbid.command + "?limit=" + config.limit[fbid.command] + "&fields=" + config.field[fbid.command].toString() + "&debug=all");
			FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/" + fbid.command + "?limit=" + config.limit[fbid.command] + "&order=" + config.order + "&fields=" + config.field[fbid.command].toString() + "&debug=all", function (res) {
				data.nowLength += res.data.length;
				$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = res.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var d = _step.value;

						if (fbid.command == 'reactions' || config.likes) {
							d.from = { id: d.id, name: d.name };
						}
						if (config.likes) d.type = "LIKE";
						if (d.from) {
							datas.push(d);
						} else {
							//event
							d.from = { id: d.id, name: d.id };
							d.created_time = d.updated_time;
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
				var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

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
								if (fbid.command == 'reactions' || config.likes) {
									d.from = { id: d.id, name: d.name };
								}
								if (d.from) {
									datas.push(d);
								} else {
									//event
									d.from = { id: d.id, name: d.id };
									d.created_time = d.updated_time;
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
		var generate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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
		if (rawdata.command === 'reactions' || config.likes) {
			thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u8868\u60C5</td>";
		} else if (rawdata.command === 'sharedposts') {
			thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td width=\"110\">\u7559\u8A00\u6642\u9593</td>";
		} else if (rawdata.command === 'ranker') {
			thead = "<td>\u6392\u540D</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u5206\u6578</td>";
		} else {
			thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t<td class=\"force-break\">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td>\u8B9A</td>\n\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
		}

		var host = 'http://www.facebook.com/';
		if (data.raw.type === 'url_comments') host = $('#enterURL .url').val() + '?fb_comment_id=';

		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = filterdata.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var _step3$value = _slicedToArray(_step3.value, 2),
				    j = _step3$value[0],
				    val = _step3$value[1];

				var picture = '';

				if (pic) {
					picture = "<img src=\"http://graph.facebook.com/" + val.from.id + "/picture?type=small\"><br>";
				}
				var td = "<td>" + (j + 1) + "</td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' target=\"_blank\">" + picture + val.from.name + "</a></td>";
				if (rawdata.command === 'reactions' || config.likes) {
					td += "<td class=\"center\"><span class=\"react " + val.type + "\"></span>" + val.type + "</td>";
				} else if (rawdata.command === 'sharedposts') {
					td += "<td class=\"force-break\"><a href=\"http://www.facebook.com/" + val.id + "\" target=\"_blank\">" + val.story + "</a></td>\n\t\t\t\t<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
				} else if (rawdata.command === 'ranker') {
					td = "<td>" + (j + 1) + "</td>\n\t\t\t\t\t  <td><a href='http://www.facebook.com/" + val.from.id + "' target=\"_blank\">" + val.from.name + "</a></td>\n\t\t\t\t\t  <td>" + val.score + "</td>";
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
		choose.award.map(function (val, index) {
			insert += '<tr title="第' + (index + 1) + '名">' + $('.main_table').DataTable().rows({ search: 'applied' }).nodes()[val].innerHTML + '</tr>';
		});
		$('#awardList table tbody').html(insert);
		$('#awardList table tbody tr').addClass('success');

		if (choose.detail) {
			var now = 0;
			for (var k in choose.list) {
				var tar = $("#awardList tbody tr").eq(now);
				$("<tr><td class=\"prizeName\" colspan=\"5\">\u734E\u54C1\uFF1A " + choose.list[k].name + " <span>\u5171 " + choose.list[k].num + " \u540D</span></td></tr>").insertBefore(tar);
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
			if (url.indexOf('.php?') === -1 && url.indexOf('?') > 0) {
				url = url.substring(0, url.indexOf('?'));
			}
			fbid.get(url, type).then(function (fbid) {
				data.start(fbid);
			});
			// $('.identity').removeClass('hide').html(`登入身份：<img src="http://graph.facebook.com/${res.id}/picture?type=small"><span>${res.name}</span>`);
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
					config.limit['comments'] = '25';
					config.order = '';
					resolve(obj);
				});
			} else {
				var regex = /\d{4,}/g;
				var newurl = url.substr(url.indexOf('/', 28) + 1, 200);
				// https://www.facebook.com/ 共25字元，因此選28開始找/
				var result = newurl.match(regex);
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
						var video = url.indexOf('videos/');
						if (video >= 0) {
							obj.pureID = result[0];
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
						} else if (urltype === 'photo') {
							var _regex = /\d{4,}/g;
							var _result = url.match(_regex);
							obj.pureID = _result[_result.length - 1];
							obj.fullID = obj.pageID + '_' + obj.pureID;
							resolve(obj);
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
		if (posturl.indexOf("/photos/") >= 0) {
			return 'photo';
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
		if (rawdata.command === 'reactions' || config.likes) {
			data = _filter.react(data, react);
		} else if (rawdata.command === 'ranker') {} else {
			data = _filter.time(data, endTime);
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
		if (command === 'reactions' || config.likes) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsInZhbCIsImFwcGVuZCIsImZhZGVJbiIsImRvY3VtZW50IiwicmVhZHkiLCJoYXNoIiwibG9jYXRpb24iLCJzZWFyY2giLCJpbmRleE9mIiwicmVtb3ZlQ2xhc3MiLCJkYXRhIiwiZXh0ZW5zaW9uIiwiY2xpY2siLCJlIiwiZmIiLCJleHRlbnNpb25BdXRoIiwiZGF0YXMiLCJjb21tYW5kIiwiSlNPTiIsInBhcnNlIiwibG9jYWxTdG9yYWdlIiwicmFua2VyIiwicmF3IiwiZmluaXNoIiwiY3RybEtleSIsImFsdEtleSIsImNvbmZpZyIsIm9yZGVyIiwiZ2V0QXV0aCIsImxpa2VzIiwiY2hvb3NlIiwiaW5pdCIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJrZXlkb3duIiwidGV4dCIsImtleXVwIiwib24iLCJ0YWJsZSIsInJlZG8iLCJjaGFuZ2UiLCJmaWx0ZXIiLCJyZWFjdCIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJlbmRUaW1lIiwiZm9ybWF0Iiwic2V0U3RhcnREYXRlIiwibm93RGF0ZSIsImZpbHRlckRhdGEiLCJzdHJpbmdpZnkiLCJvcGVuIiwiZm9jdXMiLCJsZW5ndGgiLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJleGNlbCIsImV4Y2VsU3RyaW5nIiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwic2hhcmVCVE4iLCJhbGVydCIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIndvcmQiLCJhdXRoIiwidXNlcl9wb3N0cyIsInR5cGUiLCJGQiIsImxvZ2luIiwicmVzcG9uc2UiLCJjYWxsYmFjayIsInNjb3BlIiwicmV0dXJuX3Njb3BlcyIsInN0YXR1cyIsImF1dGhTdHIiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwic3dhbCIsImRvbmUiLCJ0aXRsZSIsImh0bWwiLCJmYmlkIiwiZXh0ZW5zaW9uQ2FsbGJhY2siLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImdldCIsInRoZW4iLCJyZXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInByb21pc2VfYXJyYXkiLCJmdWxsSUQiLCJwdXJlSUQiLCJ0b1N0cmluZyIsImFwaSIsImQiLCJmcm9tIiwiaWQiLCJuYW1lIiwicHVzaCIsImNyZWF0ZWRfdGltZSIsInVwZGF0ZWRfdGltZSIsInBhZ2luZyIsIm5leHQiLCJnZXROZXh0IiwicmVwbGFjZSIsImdldEpTT04iLCJmYWlsIiwic2xpZGVVcCIsInNsaWRlRG93biIsInVpIiwicmVzZXQiLCJyYXdEYXRhIiwiZ2VuZXJhdGUiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJpc1RhZyIsIm5ld0RhdGEiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImZpbHRlcmVkIiwibmV3T2JqIiwiZWFjaCIsImkiLCJ0bXAiLCJwb3N0bGluayIsInN0b3J5IiwibGlrZV9jb3VudCIsIm1lc3NhZ2UiLCJ0aW1lQ29udmVydGVyIiwiZmlsZSIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWQiLCJldmVudCIsInN0ciIsInRhcmdldCIsInJlc3VsdCIsInJlYWRBc1RleHQiLCJyYXdkYXRhIiwiZmlsdGVyZGF0YSIsInRoZWFkIiwidGJvZHkiLCJwaWMiLCJob3N0IiwiZW50cmllcyIsImoiLCJwaWN0dXJlIiwidGQiLCJzY29yZSIsInRyIiwiaW5zZXJ0IiwiYWN0aXZlIiwiY29sdW1ucyIsInZhbHVlIiwiZHJhdyIsImF3YXJkIiwibnVtIiwiZGV0YWlsIiwibGlzdCIsIm4iLCJwYXJzZUludCIsImZpbmQiLCJwIiwiZ28iLCJnZW5SYW5kb21BcnJheSIsInNwbGljZSIsIm1hcCIsImluZGV4Iiwicm93cyIsIm5vZGVzIiwiaW5uZXJIVE1MIiwibm93IiwiayIsInRhciIsImVxIiwiaW5zZXJ0QmVmb3JlIiwic3Vic3RyaW5nIiwicG9zdHVybCIsIm9iaiIsIm9nX29iamVjdCIsInJlZ2V4IiwibmV3dXJsIiwic3Vic3RyIiwibWF0Y2giLCJ1cmx0eXBlIiwiY2hlY2tUeXBlIiwiY2hlY2tQYWdlSUQiLCJwYWdlSUQiLCJ2aWRlbyIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJlcnJvciIsInVuaXF1ZSIsInRhZyIsInRpbWUiLCJvdXRwdXQiLCJrZXlzIiwiZm9yRWFjaCIsIml0ZW0iLCJrZXkiLCJuZXdBcnkiLCJncmVwIiwibWVzc2FnZV90YWdzIiwidCIsInRpbWVfYXJ5Iiwic3BsaXQiLCJtb21lbnQiLCJEYXRlIiwiX2QiLCJhIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRhdGUiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsInNlYyIsImdldFNlY29uZHMiLCJVTklYX3RpbWVzdGFtcCIsIm1vbnRocyIsImFycmF5IiwiYXJ5IiwiQXJyYXkiLCJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiSlNPTkRhdGEiLCJSZXBvcnRUaXRsZSIsIlNob3dMYWJlbCIsImFyckRhdGEiLCJDU1YiLCJyb3ciLCJzbGljZSIsImZpbGVOYW1lIiwidXJpIiwiZW5jb2RlVVJJIiwibGluayIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQUMsT0FBT0MsT0FBUCxHQUFlQyxTQUFmOztBQUVBLFNBQVNBLFNBQVQsQ0FBbUJDLEdBQW5CLEVBQXVCQyxHQUF2QixFQUEyQkMsQ0FBM0IsRUFDQTtB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O0FBQ0giLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxuXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxue1xuXHRpZiAoIWVycm9yTWVzc2FnZSl7XG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XG5cdFx0Y29uc29sZS5sb2coXCJFcnJvciBvY2N1ciBVUkzvvJogXCIgKyAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmFwcGVuZChcIjxicj5cIiskKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHRcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRsZXQgaGFzaCA9IGxvY2F0aW9uLnNlYXJjaDtcblx0aWYgKGhhc2guaW5kZXhPZihcImV4dGVuc2lvblwiKSA+PSAwKXtcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblx0XHRkYXRhLmV4dGVuc2lvbiA9IHRydWU7XG5cblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbihlKXtcblx0XHRcdGZiLmV4dGVuc2lvbkF1dGgoKTtcblx0XHR9KTtcblx0fVxuXHRpZiAoaGFzaC5pbmRleE9mKFwicmFua2VyXCIpID49IDApe1xuXHRcdGxldCBkYXRhcyA9IHtcblx0XHRcdGNvbW1hbmQ6ICdyYW5rZXInLFxuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucmFua2VyKVxuXHRcdH1cblx0XHRkYXRhLnJhdyA9IGRhdGFzO1xuXHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcblx0fVxuXG5cblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XG5cdFx0XHRjb25maWcub3JkZXIgPSAnY2hyb25vbG9naWNhbCc7XG5cdFx0fVxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XG5cdH0pO1xuXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XG5cdFx0XHRjb25maWcubGlrZXMgPSB0cnVlO1xuXHRcdH1cblx0XHRmYi5nZXRBdXRoKCdyZWFjdGlvbnMnKTtcblx0fSk7XG5cdCQoXCIjYnRuX3VybFwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGZiLmdldEF1dGgoJ3VybF9jb21tZW50cycpO1xuXHR9KTtcblx0JChcIiNidG5fcGF5XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcblx0fSk7XG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGNob29zZS5pbml0KCk7XG5cdH0pO1xuXHRcblx0JChcIiNtb3JlcHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0XHQkKFwiLmdldHRvdGFsXCIpLnJlbW92ZUNsYXNzKFwiZmFkZW91dFwiKTtcblx0XHRcdCQoJy5wcml6ZURldGFpbCcpLnJlbW92ZUNsYXNzKFwiZmFkZWluXCIpO1xuXHRcdH1lbHNle1xuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikuYWRkQ2xhc3MoXCJmYWRlb3V0XCIpO1xuXHRcdFx0JCgnLnByaXplRGV0YWlsJykuYWRkQ2xhc3MoXCJmYWRlaW5cIik7XG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0fWVsc2V7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdH1cblx0fSk7XG5cblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj5gKTtcblx0fSk7XG5cblx0JCh3aW5kb3cpLmtleWRvd24oZnVuY3Rpb24oZSl7XG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6Ly45Ye6SlNPTlwiKTtcblx0XHR9XG5cdH0pO1xuXHQkKHdpbmRvdykua2V5dXAoZnVuY3Rpb24oZSl7XG5cdFx0aWYgKCFlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukVYQ0VMXCIpO1xuXHRcdH1cblx0fSk7XG5cblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcblx0XHR0YWJsZS5yZWRvKCk7XG5cdH0pO1xuXG5cdCQoXCIudWlwYW5lbCAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XG5cdFx0dGFibGUucmVkbygpO1xuXHR9KTtcblxuXHQkKCcucmFuZ2VEYXRlJykuZGF0ZXJhbmdlcGlja2VyKHtcblx0XHRcInNpbmdsZURhdGVQaWNrZXJcIjogdHJ1ZSxcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcblx0XHRcInRpbWVQaWNrZXIyNEhvdXJcIjogdHJ1ZSxcblx0XHRcImxvY2FsZVwiOiB7XG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVktTU0tREQgICBISDptbVwiLFxuXHRcdFx0XCJzZXBhcmF0b3JcIjogXCItXCIsXG5cdFx0XHRcImFwcGx5TGFiZWxcIjogXCLnorrlrppcIixcblx0XHRcdFwiY2FuY2VsTGFiZWxcIjogXCLlj5bmtohcIixcblx0XHRcdFwiZnJvbUxhYmVsXCI6IFwiRnJvbVwiLFxuXHRcdFx0XCJ0b0xhYmVsXCI6IFwiVG9cIixcblx0XHRcdFwiY3VzdG9tUmFuZ2VMYWJlbFwiOiBcIkN1c3RvbVwiLFxuXHRcdFx0XCJkYXlzT2ZXZWVrXCI6IFtcblx0XHRcdFwi5pelXCIsXG5cdFx0XHRcIuS4gFwiLFxuXHRcdFx0XCLkuoxcIixcblx0XHRcdFwi5LiJXCIsXG5cdFx0XHRcIuWbm1wiLFxuXHRcdFx0XCLkupRcIixcblx0XHRcdFwi5YWtXCJcblx0XHRcdF0sXG5cdFx0XHRcIm1vbnRoTmFtZXNcIjogW1xuXHRcdFx0XCLkuIDmnIhcIixcblx0XHRcdFwi5LqM5pyIXCIsXG5cdFx0XHRcIuS4ieaciFwiLFxuXHRcdFx0XCLlm5vmnIhcIixcblx0XHRcdFwi5LqU5pyIXCIsXG5cdFx0XHRcIuWFreaciFwiLFxuXHRcdFx0XCLkuIPmnIhcIixcblx0XHRcdFwi5YWr5pyIXCIsXG5cdFx0XHRcIuS5neaciFwiLFxuXHRcdFx0XCLljYHmnIhcIixcblx0XHRcdFwi5Y2B5LiA5pyIXCIsXG5cdFx0XHRcIuWNgeS6jOaciFwiXG5cdFx0XHRdLFxuXHRcdFx0XCJmaXJzdERheVwiOiAxXG5cdFx0fSxcblx0fSxmdW5jdGlvbihzdGFydCwgZW5kLCBsYWJlbCkge1xuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERC1ISC1tbS1zcycpO1xuXHRcdHRhYmxlLnJlZG8oKTtcblx0fSk7XG5cdCQoJy5yYW5nZURhdGUnKS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRTdGFydERhdGUobm93RGF0ZSgpKTtcblxuXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGxldCBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpe1xuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0ZjgsJyArIEpTT04uc3RyaW5naWZ5KGZpbHRlckRhdGEpO1xuXHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XG5cdFx0XHR3aW5kb3cuZm9jdXMoKTtcblx0XHR9ZWxzZXtcblx0XHRcdGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA+IDcwMDApe1xuXHRcdFx0XHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblx0XHRcdH1lbHNle1x0XG5cdFx0XHRcdEpTT05Ub0NTVkNvbnZlcnRvcihkYXRhLmV4Y2VsKGZpbHRlckRhdGEpLCBcIkNvbW1lbnRfaGVscGVyXCIsIHRydWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0JChcIiNnZW5FeGNlbFwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdHZhciBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xuXHRcdHZhciBleGNlbFN0cmluZyA9IGRhdGEuZXhjZWwoZmlsdGVyRGF0YSlcblx0XHQkKFwiI2V4Y2VsZGF0YVwiKS52YWwoSlNPTi5zdHJpbmdpZnkoZXhjZWxTdHJpbmcpKTtcblx0fSk7XG5cblx0bGV0IGNpX2NvdW50ZXIgPSAwO1xuXHQkKFwiLmNpXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGNpX2NvdW50ZXIrKztcblx0XHRpZiAoY2lfY291bnRlciA+PSA1KXtcblx0XHRcdCQoXCIuc291cmNlIC51cmwsIC5zb3VyY2UgLmJ0blwiKS5hZGRDbGFzcyhcImhpZGVcIik7XG5cdFx0XHQkKFwiI2lucHV0SlNPTlwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cdFx0fVxuXHRcdGlmKGUuY3RybEtleSB8fCBlLmFsdEtleSl7XG5cdFx0XHRcblx0XHR9XG5cdH0pO1xuXHQkKFwiI2lucHV0SlNPTlwiKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XG5cdFx0JChcIi53YWl0aW5nXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W5a6M5oiQ77yM55Si55Sf6KGo5qC85LitLi4uLuethuaVuOi8g+WkmuaZguacg+mcgOimgeiKsei8g+WkmuaZgumWk++8jOiri+eojeWAmScpO1xuXHRcdGRhdGEuaW1wb3J0KHRoaXMuZmlsZXNbMF0pO1xuXHR9KTtcbn0pO1xuXG5mdW5jdGlvbiBzaGFyZUJUTigpe1xuXHRhbGVydCgn6KqN55yf55yL5a6M6Lez5Ye65L6G55qE6YKj6aCB5LiK6Z2i5a+r5LqG5LuA6bq8XFxuXFxu55yL5a6M5L2g5bCx5pyD55+l6YGT5L2g54K65LuA6bq85LiN6IO95oqT5YiG5LqrJyk7XG59XG5cbmxldCBjb25maWcgPSB7XG5cdGZpZWxkOiB7XG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsJ21lc3NhZ2VfdGFncycsJ21lc3NhZ2UnLCdmcm9tJywnY3JlYXRlZF90aW1lJ10sXG5cdFx0cmVhY3Rpb25zOiBbXSxcblx0XHRzaGFyZWRwb3N0czogWydzdG9yeScsJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcblx0XHRmZWVkOiBbXSxcblx0XHRsaWtlczogWyduYW1lJ11cblx0fSxcblx0bGltaXQ6IHtcblx0XHRjb21tZW50czogJzUwMCcsXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcblx0XHRmZWVkOiAnNTAwJyxcblx0XHRsaWtlczogJzUwMCdcblx0fSxcblx0YXBpVmVyc2lvbjoge1xuXHRcdGNvbW1lbnRzOiAndjIuNycsXG5cdFx0cmVhY3Rpb25zOiAndjIuNycsXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi45Jyxcblx0XHR1cmxfY29tbWVudHM6ICd2Mi43Jyxcblx0XHRmZWVkOiAndjIuOScsXG5cdFx0Z3JvdXA6ICd2Mi43J1xuXHR9LFxuXHRmaWx0ZXI6IHtcblx0XHR3b3JkOiAnJyxcblx0XHRyZWFjdDogJ2FsbCcsXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXG5cdH0sXG5cdG9yZGVyOiAnJyxcblx0YXV0aDogJ3VzZXJfcGhvdG9zLHVzZXJfcG9zdHMsdXNlcl9tYW5hZ2VkX2dyb3VwcycsXG5cdGxpa2VzOiBmYWxzZVxufVxuXG5sZXQgZmIgPSB7XG5cdHVzZXJfcG9zdHM6IGZhbHNlLFxuXHRnZXRBdXRoOiAodHlwZSk9Pntcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcblx0fSxcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSk9Pntcblx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcblx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XG5cdFx0XHRpZiAodHlwZSA9PSBcImFkZFNjb3BlXCIpe1xuXHRcdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKCd1c2VyX3Bvc3RzJykgPj0gMCl7XG5cdFx0XHRcdFx0c3dhbChcblx0XHRcdFx0XHRcdCfku5josrvmjojmrIrlrozmiJDvvIzoq4vlho3mrKHln7fooYzmipPnlZnoqIAnLFxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmluaXNoZWQhIFBsZWFzZSBnZXRDb21tZW50cyBhZ2Fpbi4nLFxuXHRcdFx0XHRcdFx0J3N1Y2Nlc3MnXG5cdFx0XHRcdFx0XHQpLmRvbmUoKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0c3dhbChcblx0XHRcdFx0XHRcdCfku5josrvmjojmrIrlpLHmlZfvvIzoq4voga/ntaHnrqHnkIblk6Hnorroqo0nLFxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmFpbGVkISBQbGVhc2UgY29udGFjdCB0aGUgYWRtaW4uJyxcblx0XHRcdFx0XHRcdCdlcnJvcidcblx0XHRcdFx0XHRcdCkuZG9uZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZSBpZiAodHlwZSA9PSBcInNoYXJlZHBvc3RzXCIpe1xuXHRcdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKFwidXNlcl9wb3N0c1wiKSA8IDApe1xuXHRcdFx0XHRcdHN3YWwoe1xuXHRcdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxuXHRcdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxuXHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXG5cdFx0XHRcdFx0fSkuZG9uZSgpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRmYi51c2VyX3Bvc3RzID0gdHJ1ZTtcblx0XHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1lbHNle1xuXHRcdFx0XHRpZiAoYXV0aFN0ci5pbmRleE9mKFwidXNlcl9wb3N0c1wiKSA+PSAwKXtcblx0XHRcdFx0XHRmYi51c2VyX3Bvc3RzID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmYmlkLmluaXQodHlwZSk7XHRcdFx0XG5cdFx0XHR9XG5cdFx0fWVsc2V7XG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSk7XG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XG5cdFx0fVxuXHR9LFxuXHRleHRlbnNpb25BdXRoOiAoKT0+e1xuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRmYi5leHRlbnNpb25DYWxsYmFjayhyZXNwb25zZSk7XG5cdFx0fSwge3Njb3BlOiBjb25maWcuYXV0aCAscmV0dXJuX3Njb3BlczogdHJ1ZX0pO1xuXHR9LFxuXHRleHRlbnNpb25DYWxsYmFjazogKHJlc3BvbnNlKT0+e1xuXHRcdGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XG5cdFx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZihcInVzZXJfcG9zdHNcIikgPCAwKXtcblx0XHRcdFx0c3dhbCh7XG5cdFx0XHRcdFx0dGl0bGU6ICfmipPliIbkuqvpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlsIjpoIEnLFxuXHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+Jyxcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcblx0XHRcdFx0fSkuZG9uZSgpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdCQoXCIubG9hZGluZy5jaGVja0F1dGhcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdFx0XHRsZXQgZGF0YXMgPSB7XG5cdFx0XHRcdFx0Y29tbWFuZDogJ3NoYXJlZHBvc3RzJyxcblx0XHRcdFx0XHRkYXRhOiBKU09OLnBhcnNlKCQoXCIuY2hyb21lXCIpLnZhbCgpKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGRhdGEucmF3ID0gZGF0YXM7XG5cdFx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcblx0XHR9XG5cdH1cbn1cblxubGV0IGRhdGEgPSB7XG5cdHJhdzogW10sXG5cdHVzZXJpZDogJycsXG5cdG5vd0xlbmd0aDogMCxcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcblx0aW5pdDogKCk9Pntcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XG5cdFx0ZGF0YS5ub3dMZW5ndGggPSAwO1xuXHRcdGRhdGEucmF3ID0gW107XG5cdH0sXG5cdHN0YXJ0OiAoZmJpZCk9Pntcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXHRcdGRhdGEuZ2V0KGZiaWQpLnRoZW4oKHJlcyk9Pntcblx0XHRcdGZiaWQuZGF0YSA9IHJlcztcblx0XHRcdGRhdGEuZmluaXNoKGZiaWQpO1xuXHRcdH0pO1xuXHR9LFxuXHRnZXQ6IChmYmlkKT0+e1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuXHRcdFx0bGV0IGRhdGFzID0gW107XG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xuXHRcdFx0bGV0IGNvbW1hbmQgPSBmYmlkLmNvbW1hbmQ7XG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKSBjb21tYW5kID0gJ2dyb3VwJztcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcgJiYgZmJpZC5jb21tYW5kICE9PSAncmVhY3Rpb25zJykgZmJpZC5mdWxsSUQgPSBmYmlkLnB1cmVJRDtcblx0XHRcdGlmIChjb25maWcubGlrZXMpIGZiaWQuY29tbWFuZCA9ICdsaWtlcyc7XG5cdFx0XHRjb25zb2xlLmxvZyhgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkLmZ1bGxJRH0vJHtmYmlkLmNvbW1hbmR9P2xpbWl0PSR7Y29uZmlnLmxpbWl0W2ZiaWQuY29tbWFuZF19JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JmRlYnVnPWFsbGApO1xuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mb3JkZXI9JHtjb25maWcub3JkZXJ9JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JmRlYnVnPWFsbGAsKHJlcyk9Pntcblx0XHRcdFx0ZGF0YS5ub3dMZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcblx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0XHRpZiAoZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcyl7XG5cdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChjb25maWcubGlrZXMpIGQudHlwZSA9IFwiTElLRVwiO1xuXHRcdFx0XHRcdGlmIChkLmZyb20pe1xuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdC8vZXZlbnRcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5pZH07XG5cdFx0XHRcdFx0XHRkLmNyZWF0ZWRfdGltZSA9IGQudXBkYXRlZF90aW1lO1xuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KXtcblx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwsIGxpbWl0PTApe1xuXHRcdFx0XHRpZiAobGltaXQgIT09IDApe1xuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCdsaW1pdD01MDAnLCdsaW1pdD0nK2xpbWl0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkLmdldEpTT04odXJsLCBmdW5jdGlvbihyZXMpe1xuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLm5vd0xlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcblx0XHRcdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xuXHRcdFx0XHRcdFx0aWYgKGQuaWQpe1xuXHRcdFx0XHRcdFx0XHRpZiAoZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcyl7XG5cdFx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XG5cdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdC8vZXZlbnRcblx0XHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQuaWR9O1xuXHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KS5mYWlsKCgpPT57XG5cdFx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHRmaW5pc2g6IChmYmlkKT0+e1xuXHRcdCQoXCIud2FpdGluZ1wiKS5hZGRDbGFzcyhcImhpZGVcIik7XG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblx0XHQkKFwiLnVwZGF0ZV9hcmVhLC5kb25hdGVfYXJlYVwiKS5zbGlkZVVwKCk7XG5cdFx0JChcIi5yZXN1bHRfYXJlYVwiKS5zbGlkZURvd24oKTtcblx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcblx0XHRkYXRhLnJhdyA9IGZiaWQ7XG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xuXHRcdHVpLnJlc2V0KCk7XG5cdH0sXG5cdGZpbHRlcjogKHJhd0RhdGEsIGdlbmVyYXRlID0gZmFsc2UpPT57XG5cdFx0bGV0IGlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XG5cdFx0bGV0IGlzVGFnID0gJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIik7XG5cdFx0bGV0IG5ld0RhdGEgPSBmaWx0ZXIudG90YWxGaWx0ZXIocmF3RGF0YSwgaXNEdXBsaWNhdGUsIGlzVGFnLCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xuXHRcdHJhd0RhdGEuZmlsdGVyZWQgPSBuZXdEYXRhO1xuXHRcdGlmIChnZW5lcmF0ZSA9PT0gdHJ1ZSl7XG5cdFx0XHR0YWJsZS5nZW5lcmF0ZShyYXdEYXRhKTtcdFxuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIHJhd0RhdGE7XG5cdFx0fVxuXHR9LFxuXHRleGNlbDogKHJhdyk9Pntcblx0XHR2YXIgbmV3T2JqID0gW107XG5cdFx0aWYgKGRhdGEuZXh0ZW5zaW9uKXtcblx0XHRcdCQuZWFjaChyYXcuZGF0YSxmdW5jdGlvbihpKXtcblx0XHRcdFx0dmFyIHRtcCA9IHtcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpKzEsXG5cdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIiA6ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxuXHRcdFx0XHRcdFwi5aeT5ZCNXCIgOiB0aGlzLmZyb20ubmFtZSxcblx0XHRcdFx0XHRcIuWIhuS6q+mAo+e1kFwiIDogdGhpcy5wb3N0bGluayxcblx0XHRcdFx0XHRcIueVmeiogOWFp+WuuVwiIDogdGhpcy5zdG9yeSxcblx0XHRcdFx0XHRcIuipsuWIhuS6q+iumuaVuFwiIDogdGhpcy5saWtlX2NvdW50XG5cdFx0XHRcdH1cblx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcblx0XHRcdH0pO1xuXHRcdH1lbHNle1xuXHRcdFx0JC5lYWNoKHJhdy5kYXRhLGZ1bmN0aW9uKGkpe1xuXHRcdFx0XHR2YXIgdG1wID0ge1xuXHRcdFx0XHRcdFwi5bqP6JmfXCI6IGkrMSxcblx0XHRcdFx0XHRcIuiHieabuOmAo+e1kFwiIDogJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLycgKyB0aGlzLmZyb20uaWQsXG5cdFx0XHRcdFx0XCLlp5PlkI1cIiA6IHRoaXMuZnJvbS5uYW1lLFxuXHRcdFx0XHRcdFwi6KGo5oOFXCIgOiB0aGlzLnR5cGUgfHwgJycsXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIiA6IHRoaXMubWVzc2FnZSB8fCB0aGlzLnN0b3J5LFxuXHRcdFx0XHRcdFwi55WZ6KiA5pmC6ZaTXCIgOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxuXHRcdFx0XHR9XG5cdFx0XHRcdG5ld09iai5wdXNoKHRtcCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIG5ld09iajtcblx0fSxcblx0aW1wb3J0OiAoZmlsZSk9Pntcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuXHRcdHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0bGV0IHN0ciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcblx0XHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcblx0XHR9XG5cblx0XHRyZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcblx0fVxufVxuXG5sZXQgdGFibGUgPSB7XG5cdGdlbmVyYXRlOiAocmF3ZGF0YSk9Pntcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xuXHRcdGxldCBmaWx0ZXJkYXRhID0gcmF3ZGF0YS5maWx0ZXJlZDtcblx0XHRsZXQgdGhlYWQgPSAnJztcblx0XHRsZXQgdGJvZHkgPSAnJztcblx0XHRsZXQgcGljID0gJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xuXHRcdGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycgfHwgY29uZmlnLmxpa2VzKXtcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XG5cdFx0XHQ8dGQ+6KGo5oOFPC90ZD5gO1xuXHRcdH1lbHNlIGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJyl7XG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cblx0XHRcdDx0ZD7lkI3lrZc8L3RkPlxuXHRcdFx0PHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj7nlZnoqIDlhaflrrk8L3RkPlxuXHRcdFx0PHRkIHdpZHRoPVwiMTEwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xuXHRcdH1lbHNlIGlmKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3Jhbmtlcicpe1xuXHRcdFx0dGhlYWQgPSBgPHRkPuaOkuWQjTwvdGQ+XG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cblx0XHRcdDx0ZD7liIbmlbg8L3RkPmA7XG5cdFx0fWVsc2V7XG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cblx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XG5cdFx0XHQ8dGQ+6K6aPC90ZD5cblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcblx0XHR9XG5cblx0XHRsZXQgaG9zdCA9ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nO1xuXHRcdGlmIChkYXRhLnJhdy50eXBlID09PSAndXJsX2NvbW1lbnRzJykgaG9zdCA9ICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkgKyAnP2ZiX2NvbW1lbnRfaWQ9JztcblxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZGF0YS5lbnRyaWVzKCkpe1xuXHRcdFx0bGV0IHBpY3R1cmUgPSAnJztcblx0XHRcdFxuXHRcdFx0aWYgKHBpYyl7XG5cdFx0XHRcdHBpY3R1cmUgPSBgPGltZyBzcmM9XCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxicj5gO1xuXHRcdFx0fVxuXHRcdFx0bGV0IHRkID0gYDx0ZD4ke2orMX08L3RkPlxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyB0YXJnZXQ9XCJfYmxhbmtcIj4ke3BpY3R1cmV9JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XG5cdFx0XHRpZihyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcyl7XG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xuXHRcdFx0fWVsc2UgaWYocmF3ZGF0YS5jb21tYW5kID09PSAnc2hhcmVkcG9zdHMnKXtcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLnN0b3J5fTwvYT48L3RkPlxuXHRcdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xuXHRcdFx0fWVsc2UgaWYocmF3ZGF0YS5jb21tYW5kID09PSAncmFua2VyJyl7XG5cdFx0XHRcdHRkID0gYDx0ZD4ke2orMX08L3RkPlxuXHRcdFx0XHRcdCAgPHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+XG5cdFx0XHRcdFx0ICA8dGQ+JHt2YWwuc2NvcmV9PC90ZD5gO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCIke2hvc3R9JHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwubWVzc2FnZX08L2E+PC90ZD5cblx0XHRcdFx0PHRkPiR7dmFsLmxpa2VfY291bnR9PC90ZD5cblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcblx0XHRcdH1cblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XG5cdFx0XHR0Ym9keSArPSB0cjtcblx0XHR9XG5cdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcblxuXG5cdFx0YWN0aXZlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoe1xuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMTAwMCxcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2Vcblx0XHRcdH0pO1xuXG5cdFx0XHQkKFwiI3NlYXJjaE5hbWVcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dGFibGVcblx0XHRcdFx0LmNvbHVtbnMoMSlcblx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxuXHRcdFx0XHQuZHJhdygpO1xuXHRcdFx0fSk7XG5cdFx0XHQkKFwiI3NlYXJjaENvbW1lbnRcIikub24oICdibHVyIGNoYW5nZSBrZXl1cCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dGFibGVcblx0XHRcdFx0LmNvbHVtbnMoMilcblx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxuXHRcdFx0XHQuZHJhdygpO1xuXHRcdFx0XHRjb25maWcuZmlsdGVyLndvcmQgPSB0aGlzLnZhbHVlO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXHRyZWRvOiAoKT0+e1xuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcblx0fVxufVxuXG5sZXQgY2hvb3NlID0ge1xuXHRkYXRhOiBbXSxcblx0YXdhcmQ6IFtdLFxuXHRudW06IDAsXG5cdGRldGFpbDogZmFsc2UsXG5cdGxpc3Q6IFtdLFxuXHRpbml0OiAoKT0+e1xuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGhlYWQnKS5odG1sKHRoZWFkKTtcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XG5cdFx0Y2hvb3NlLmRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XG5cdFx0Y2hvb3NlLmF3YXJkID0gW107XG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcblx0XHRjaG9vc2UubnVtID0gMDtcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcblx0XHRcdFx0aWYgKG4gPiAwKXtcblx0XHRcdFx0XHRjaG9vc2UubnVtICs9IHBhcnNlSW50KG4pO1xuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1wibmFtZVwiOnAsIFwibnVtXCI6IG59KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xuXHRcdH1cblx0XHRjaG9vc2UuZ28oKTtcblx0fSxcblx0Z286ICgpPT57XG5cdFx0Y2hvb3NlLmF3YXJkID0gZ2VuUmFuZG9tQXJyYXkoY2hvb3NlLmRhdGEuZmlsdGVyZWQubGVuZ3RoKS5zcGxpY2UoMCxjaG9vc2UubnVtKTtcblx0XHRsZXQgaW5zZXJ0ID0gJyc7XG5cdFx0Y2hvb3NlLmF3YXJkLm1hcCgodmFsLCBpbmRleCk9Pntcblx0XHRcdGluc2VydCArPSAnPHRyIHRpdGxlPVwi56ysJysoaW5kZXgrMSkrJ+WQjVwiPicgKyAkKCcubWFpbl90YWJsZScpLkRhdGFUYWJsZSgpLnJvd3Moe3NlYXJjaDonYXBwbGllZCd9KS5ub2RlcygpW3ZhbF0uaW5uZXJIVE1MICsgJzwvdHI+Jztcblx0XHR9KVxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKGluc2VydCk7XG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keSB0cicpLmFkZENsYXNzKCdzdWNjZXNzJyk7XG5cblx0XHRpZihjaG9vc2UuZGV0YWlsKXtcblx0XHRcdGxldCBub3cgPSAwO1xuXHRcdFx0Zm9yKGxldCBrIGluIGNob29zZS5saXN0KXtcblx0XHRcdFx0bGV0IHRhciA9ICQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVxKG5vdyk7XG5cdFx0XHRcdCQoYDx0cj48dGQgY2xhc3M9XCJwcml6ZU5hbWVcIiBjb2xzcGFuPVwiNVwiPueNjuWTge+8miAke2Nob29zZS5saXN0W2tdLm5hbWV9IDxzcGFuPuWFsSAke2Nob29zZS5saXN0W2tdLm51bX0g5ZCNPC9zcGFuPjwvdGQ+PC90cj5gKS5pbnNlcnRCZWZvcmUodGFyKTtcblx0XHRcdFx0bm93ICs9IChjaG9vc2UubGlzdFtrXS5udW0gKyAxKTtcblx0XHRcdH1cblx0XHRcdCQoXCIjbW9yZXByaXplXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdFx0JChcIi5nZXR0b3RhbFwiKS5yZW1vdmVDbGFzcyhcImZhZGVvdXRcIik7XG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcblx0XHR9XG5cdFx0JChcIiNhd2FyZExpc3RcIikuZmFkZUluKDEwMDApO1xuXHR9XG59XG5cbmxldCBmYmlkID0ge1xuXHRmYmlkOiBbXSxcblx0aW5pdDogKHR5cGUpPT57XG5cdFx0ZmJpZC5mYmlkID0gW107XG5cdFx0ZGF0YS5pbml0KCk7XG5cdFx0RkIuYXBpKFwiL21lXCIsZnVuY3Rpb24ocmVzKXtcblx0XHRcdGRhdGEudXNlcmlkID0gcmVzLmlkO1xuXHRcdFx0bGV0IHVybCA9IGZiaWQuZm9ybWF0KCQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xuXHRcdFx0aWYgKHVybC5pbmRleE9mKCcucGhwPycpID09PSAtMSAmJiB1cmwuaW5kZXhPZignPycpID4gMCl7XG5cdFx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoJz8nKSk7XG5cdFx0XHR9XG5cdFx0XHRmYmlkLmdldCh1cmwsIHR5cGUpLnRoZW4oKGZiaWQpPT57XG5cdFx0XHRcdGRhdGEuc3RhcnQoZmJpZCk7XG5cdFx0XHR9KVxuXHRcdFx0Ly8gJCgnLmlkZW50aXR5JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKGDnmbvlhaXouqvku73vvJo8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtyZXMuaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxzcGFuPiR7cmVzLm5hbWV9PC9zcGFuPmApO1xuXHRcdH0pO1xuXHR9LFxuXHRnZXQ6ICh1cmwsIHR5cGUpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRpZiAodHlwZSA9PSAndXJsX2NvbW1lbnRzJyl7XG5cdFx0XHRcdGxldCBwb3N0dXJsID0gdXJsO1xuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiP1wiKSA+IDApe1xuXHRcdFx0XHRcdHBvc3R1cmwgPSBwb3N0dXJsLnN1YnN0cmluZygwLHBvc3R1cmwuaW5kZXhPZihcIj9cIikpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdEZCLmFwaShgLyR7cG9zdHVybH1gLGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtmdWxsSUQ6IHJlcy5vZ19vYmplY3QuaWQsIHR5cGU6IHR5cGUsIGNvbW1hbmQ6ICdjb21tZW50cyd9O1xuXHRcdFx0XHRcdGNvbmZpZy5saW1pdFsnY29tbWVudHMnXSA9ICcyNSc7XG5cdFx0XHRcdFx0Y29uZmlnLm9yZGVyID0gJyc7XG5cdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xuXHRcdFx0XHRsZXQgbmV3dXJsID0gdXJsLnN1YnN0cih1cmwuaW5kZXhPZignLycsMjgpKzEsMjAwKTtcblx0XHRcdFx0Ly8gaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyDlhbEyNeWtl+WFg++8jOWboOatpOmBuDI46ZaL5aeL5om+L1xuXHRcdFx0XHRsZXQgcmVzdWx0ID0gbmV3dXJsLm1hdGNoKHJlZ2V4KTtcblx0XHRcdFx0bGV0IHVybHR5cGUgPSBmYmlkLmNoZWNrVHlwZSh1cmwpO1xuXHRcdFx0XHRmYmlkLmNoZWNrUGFnZUlEKHVybCwgdXJsdHlwZSkudGhlbigoaWQpPT57XG5cdFx0XHRcdFx0aWYgKGlkID09PSAncGVyc29uYWwnKXtcblx0XHRcdFx0XHRcdHVybHR5cGUgPSAncGVyc29uYWwnO1xuXHRcdFx0XHRcdFx0aWQgPSBkYXRhLnVzZXJpZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtwYWdlSUQ6IGlkLCB0eXBlOiB1cmx0eXBlLCBjb21tYW5kOiB0eXBlfTtcblx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3BlcnNvbmFsJyl7XG5cdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZignZmJpZD0nKTtcblx0XHRcdFx0XHRcdGlmKHN0YXJ0ID49IDApe1xuXHRcdFx0XHRcdFx0XHRsZXQgZW5kID0gdXJsLmluZGV4T2YoXCImXCIsc3RhcnQpO1xuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCs1LGVuZCk7XG5cdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ3Bvc3RzLycpO1xuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCs2LHVybC5sZW5ndGgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bGV0IHZpZGVvID0gdXJsLmluZGV4T2YoJ3ZpZGVvcy8nKTtcblx0XHRcdFx0XHRcdGlmICh2aWRlbyA+PSAwKXtcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcblx0XHRcdFx0XHR9ZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3B1cmUnKXtcblx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSB1cmwucmVwbGFjZSgvXFxcIi9nLCcnKTtcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAnZXZlbnQnKXtcblx0XHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSl7XG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reaJgOacieeVmeiogFxuXHRcdFx0XHRcdFx0XHRcdG9iai5jb21tYW5kID0gJ2ZlZWQnO1xuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSByZXN1bHRbMF07XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1x0XG5cdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3mn5Dnr4fnlZnoqIDnmoTnlZnoqIBcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gcmVzdWx0WzFdO1xuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fWVsc2UgaWYgKHVybHR5cGUgPT09ICdncm91cCcpe1xuXHRcdFx0XHRcdFx0XHRpZiAoZmIudXNlcl9wb3N0cyl7XG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xuXHRcdFx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbMF07XG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyBcIl9cIiArb2JqLnB1cmVJRDtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdHN3YWwoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dGl0bGU6ICfnpL7lnJjkvb/nlKjpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlnJgnLFxuXHRcdFx0XHRcdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXG5cdFx0XHRcdFx0XHRcdFx0fSkuZG9uZSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9ZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3Bob3RvJyl7XG5cdFx0XHRcdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XG5cdFx0XHRcdFx0XHRcdGxldCByZXN1bHQgPSB1cmwubWF0Y2gocmVnZXgpO1xuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XG5cdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xuXHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEgfHwgcmVzdWx0Lmxlbmd0aCA9PSAzKXtcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAndW5uYW1lJyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0Y2hlY2tUeXBlOiAocG9zdHVybCk9Pntcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZmJpZD1cIikgPj0gMCl7XG5cdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdwZXJtYWxpbmsnKSA+PSAwKXtcblx0XHRcdFx0cmV0dXJuICd1bm5hbWUnO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHJldHVybiAncGVyc29uYWwnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9ncm91cHMvXCIpID49IDApe1xuXHRcdFx0cmV0dXJuICdncm91cCc7XG5cdFx0fTtcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZXZlbnRzXCIpID49IDApe1xuXHRcdFx0cmV0dXJuICdldmVudCc7XG5cdFx0fTtcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL3Bob3Rvcy9cIikgPj0gMCl7XG5cdFx0XHRyZXR1cm4gJ3Bob3RvJztcblx0XHR9O1xuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ1wiJykgPj0gMCl7XG5cdFx0XHRyZXR1cm4gJ3B1cmUnO1xuXHRcdH07XG5cdFx0cmV0dXJuICdub3JtYWwnO1xuXHR9LFxuXHRjaGVja1BhZ2VJRDogKHBvc3R1cmwsIHR5cGUpPT57XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG5cdFx0XHRsZXQgc3RhcnQgPSBwb3N0dXJsLmluZGV4T2YoXCJmYWNlYm9vay5jb21cIikrMTM7XG5cdFx0XHRsZXQgZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLHN0YXJ0KTtcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XG5cdFx0XHRpZiAoZW5kIDwgMCl7XG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ2ZiaWQ9JykgPj0gMCl7XG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICd1bm5hbWUnKXtcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3VubmFtZScpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHJlc29sdmUocG9zdHVybC5tYXRjaChyZWdleClbMV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0bGV0IGdyb3VwID0gcG9zdHVybC5pbmRleE9mKCcvZ3JvdXBzLycpO1xuXHRcdFx0XHRsZXQgZXZlbnQgPSBwb3N0dXJsLmluZGV4T2YoJy9ldmVudHMvJylcblx0XHRcdFx0aWYgKGdyb3VwID49IDApe1xuXHRcdFx0XHRcdHN0YXJ0ID0gZ3JvdXArODtcblx0XHRcdFx0XHRlbmQgPSBwb3N0dXJsLmluZGV4T2YoXCIvXCIsc3RhcnQpO1xuXHRcdFx0XHRcdGxldCByZWdleDIgPSAvXFxkezYsfS9nO1xuXHRcdFx0XHRcdGxldCB0ZW1wID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsZW5kKTtcblx0XHRcdFx0XHRpZiAocmVnZXgyLnRlc3QodGVtcCkpe1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0ZW1wKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHJlc29sdmUoJ2dyb3VwJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ZWxzZSBpZihldmVudCA+PSAwKXtcblx0XHRcdFx0XHRyZXNvbHZlKCdldmVudCcpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHR2YXIgcGFnZW5hbWUgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCxlbmQpO1xuXHRcdFx0XHRcdEZCLmFwaShgLyR7cGFnZW5hbWV9YCxmdW5jdGlvbihyZXMpe1xuXHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcil7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XG5cdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShyZXMuaWQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdGZvcm1hdDogKHVybCk9Pntcblx0XHRpZiAodXJsLmluZGV4T2YoJ2J1c2luZXNzLmZhY2Vib29rLmNvbS8nKSA+PSAwKXtcblx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoXCI/XCIpKTtcblx0XHRcdHJldHVybiB1cmw7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm4gdXJsO1xuXHRcdH1cblx0fVxufVxuXG5sZXQgZmlsdGVyID0ge1xuXHR0b3RhbEZpbHRlcjogKHJhd2RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIGVuZFRpbWUpPT57XG5cdFx0bGV0IGRhdGEgPSByYXdkYXRhLmRhdGE7XG5cdFx0aWYgKGlzRHVwbGljYXRlKXtcblx0XHRcdGRhdGEgPSBmaWx0ZXIudW5pcXVlKGRhdGEpO1xuXHRcdH1cblx0XHRpZiAod29yZCAhPT0gJycpe1xuXHRcdFx0ZGF0YSA9IGZpbHRlci53b3JkKGRhdGEsIHdvcmQpO1xuXHRcdH1cblx0XHRpZiAoaXNUYWcpe1xuXHRcdFx0ZGF0YSA9IGZpbHRlci50YWcoZGF0YSk7XG5cdFx0fVxuXHRcdGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyZWFjdGlvbnMnIHx8IGNvbmZpZy5saWtlcyl7XG5cdFx0XHRkYXRhID0gZmlsdGVyLnJlYWN0KGRhdGEsIHJlYWN0KTtcdFxuXHRcdH1lbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKXtcblxuXHRcdH1lbHNle1xuXHRcdFx0ZGF0YSA9IGZpbHRlci50aW1lKGRhdGEsIGVuZFRpbWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhO1xuXHR9LFxuXHR1bmlxdWU6IChkYXRhKT0+e1xuXHRcdGxldCBvdXRwdXQgPSBbXTtcblx0XHRsZXQga2V5cyA9IFtdO1xuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xuXHRcdFx0aWYoa2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9LFxuXHR3b3JkOiAoZGF0YSwgd29yZCk9Pntcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XG5cdFx0XHRpZiAobi5tZXNzYWdlLmluZGV4T2Yod29yZCkgPiAtMSl7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBuZXdBcnk7XG5cdH0sXG5cdHRhZzogKGRhdGEpPT57XG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0dGltZTogKGRhdGEsIHQpPT57XG5cdFx0bGV0IHRpbWVfYXJ5ID0gdC5zcGxpdChcIi1cIik7XG5cdFx0bGV0IHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sKHBhcnNlSW50KHRpbWVfYXJ5WzFdKS0xKSx0aW1lX2FyeVsyXSx0aW1lX2FyeVszXSx0aW1lX2FyeVs0XSx0aW1lX2FyeVs1XSkpLl9kO1xuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xuXHRcdFx0aWYgKGNyZWF0ZWRfdGltZSA8IHRpbWUgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIil7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBuZXdBcnk7XG5cdH0sXG5cdHJlYWN0OiAoZGF0YSwgdGFyKT0+e1xuXHRcdGlmICh0YXIgPT0gJ2FsbCcpe1xuXHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0fWVsc2V7XG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKXtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xuXHRcdH1cblx0fVxufVxuXG5sZXQgdWkgPSB7XG5cdGluaXQ6ICgpPT57XG5cblx0fSxcblx0cmVzZXQ6ICgpPT57XG5cdFx0bGV0IGNvbW1hbmQgPSBkYXRhLnJhdy5jb21tYW5kO1xuXHRcdGlmIChjb21tYW5kID09PSAncmVhY3Rpb25zJyB8fCBjb25maWcubGlrZXMpe1xuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5hZGRDbGFzcygnaGlkZScpO1xuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcblx0XHR9ZWxzZXtcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLmFkZENsYXNzKCdoaWRlJyk7XG5cdFx0fVxuXHRcdGlmIChjb21tYW5kID09PSAnY29tbWVudHMnKXtcblx0XHRcdCQoJ2xhYmVsLnRhZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdFx0fWVsc2V7XG5cdFx0XHRpZiAoJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIikpe1xuXHRcdFx0XHQkKFwiI3RhZ1wiKS5jbGljaygpO1xuXHRcdFx0fVxuXHRcdFx0JCgnbGFiZWwudGFnJykuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHR9XG5cdH1cbn1cblxuXG5cblxuZnVuY3Rpb24gbm93RGF0ZSgpe1xuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xuXHRyZXR1cm4geWVhcitcIi1cIittb250aCtcIi1cIitkYXRlK1wiLVwiK2hvdXIrXCItXCIrbWluK1wiLVwiK3NlYztcbn1cblxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCl7XG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XG4gXHQgdmFyIG1vbnRocyA9IFsnMDEnLCcwMicsJzAzJywnMDQnLCcwNScsJzA2JywnMDcnLCcwOCcsJzA5JywnMTAnLCcxMScsJzEyJ107XG4gICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcbiAgICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcbiAgICAgaWYgKGRhdGUgPCAxMCl7XG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XG4gICAgIH1cbiAgICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcbiAgICAgaWYgKG1pbiA8IDEwKXtcbiAgICAgXHRtaW4gPSBcIjBcIittaW47XG4gICAgIH1cbiAgICAgdmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xuICAgICBpZiAoc2VjIDwgMTApe1xuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcbiAgICAgfVxuICAgICB2YXIgdGltZSA9IHllYXIrJy0nK21vbnRoKyctJytkYXRlK1wiIFwiK2hvdXIrJzonK21pbisnOicrc2VjIDtcbiAgICAgcmV0dXJuIHRpbWU7XG4gfVxuXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuIFx0XHRyZXR1cm4gW3ZhbHVlXTtcbiBcdH0pO1xuIFx0cmV0dXJuIGFycmF5O1xuIH1cblxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcbiBcdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcbiBcdHZhciBpLCByLCB0O1xuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XG4gXHRcdGFyeVtpXSA9IGk7XG4gXHR9XG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcbiBcdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xuIFx0XHR0ID0gYXJ5W3JdO1xuIFx0XHRhcnlbcl0gPSBhcnlbaV07XG4gXHRcdGFyeVtpXSA9IHQ7XG4gXHR9XG4gXHRyZXR1cm4gYXJ5O1xuIH1cblxuIGZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xuICAgIC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XG4gICAgdmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xuICAgIFxuICAgIHZhciBDU1YgPSAnJzsgICAgXG4gICAgLy9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXG4gICAgXG4gICAgLy8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XG5cbiAgICAvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxuICAgIGlmIChTaG93TGFiZWwpIHtcbiAgICAgICAgdmFyIHJvdyA9IFwiXCI7XG4gICAgICAgIFxuICAgICAgICAvL1RoaXMgbG9vcCB3aWxsIGV4dHJhY3QgdGhlIGxhYmVsIGZyb20gMXN0IGluZGV4IG9mIG9uIGFycmF5XG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcbiAgICAgICAgICAgIHJvdyArPSBpbmRleCArICcsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XG4gICAgICAgIFxuICAgICAgICAvL2FwcGVuZCBMYWJlbCByb3cgd2l0aCBsaW5lIGJyZWFrXG4gICAgICAgIENTViArPSByb3cgKyAnXFxyXFxuJztcbiAgICB9XG4gICAgXG4gICAgLy8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciByb3cgPSBcIlwiO1xuICAgICAgICBcbiAgICAgICAgLy8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXG4gICAgICAgIGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcbiAgICAgICAgICAgIHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XG4gICAgICAgIFxuICAgICAgICAvL2FkZCBhIGxpbmUgYnJlYWsgYWZ0ZXIgZWFjaCByb3dcbiAgICAgICAgQ1NWICs9IHJvdyArICdcXHJcXG4nO1xuICAgIH1cblxuICAgIGlmIChDU1YgPT0gJycpIHsgICAgICAgIFxuICAgICAgICBhbGVydChcIkludmFsaWQgZGF0YVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH0gICBcbiAgICBcbiAgICAvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXG4gICAgdmFyIGZpbGVOYW1lID0gXCJcIjtcbiAgICAvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcbiAgICBmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csXCJfXCIpOyAgIFxuICAgIFxuICAgIC8vSW5pdGlhbGl6ZSBmaWxlIGZvcm1hdCB5b3Ugd2FudCBjc3Ygb3IgeGxzXG4gICAgdmFyIHVyaSA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsXFx1RkVGRicgKyBlbmNvZGVVUkkoQ1NWKTtcbiAgICBcbiAgICAvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cbiAgICAvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xuICAgIC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xuICAgIC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXG4gICAgXG4gICAgLy90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7ICAgIFxuICAgIGxpbmsuaHJlZiA9IHVyaTtcbiAgICBcbiAgICAvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxuICAgIGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XG4gICAgbGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XG4gICAgXG4gICAgLy90aGlzIHBhcnQgd2lsbCBhcHBlbmQgdGhlIGFuY2hvciB0YWcgYW5kIHJlbW92ZSBpdCBhZnRlciBhdXRvbWF0aWMgY2xpY2tcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgIGxpbmsuY2xpY2soKTtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xufSJdfQ==
