"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var errorMessage = false;
window.onerror = handleErr;

function handleErr(msg, url, l) {
	$('.console .error').text(JSON.stringify(last_command) + " \u767C\u751F\u932F\u8AA4\uFF0C\u8ACB\u622A\u5716\u901A\u77E5\u7BA1\u7406\u54E1");
	if (!errorMessage) {
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
		console.log("Error occur URL： " + $('#enterURL .url').val());
		$(".console .error").fadeIn();
		errorMessage = true;
	}
	return false;
}
$(document).ready(function () {
	$("#btn_login").click(function () {
		fb.getAuth('login');
	});
	$('#select').change(function () {
		var id = $(this).val();
		var name = $(this).find("option:selected").text();
		var type = $(this).find("option:selected").attr('data-type');
		var page = { id: id, name: name, type: type };
		if (page.id !== '0') {
			step.step2(page);
		}
	});

	$("#btn_comments").click(function (e) {
		fb.getAuth('comments');
	});

	$("#btn_like").click(function () {
		fb.getAuth('reactions');
	});

	$("#btn_pay").click(function () {
		fb.getAuth('addScope');
	});
	$("#btn_choose").click(function () {
		choose.init();
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

	$("#unique, #tag").on('change', function () {
		config.filter.isDuplicate = $("#unique").prop("checked");
		table.redo();
	});

	$('.optionFilter input').dateDropper();
	$('.pick-submit').on('click', function () {
		// config.filter.endTime = $('.optionFilter input').val()+"-23-59-59";
		// table.redo();
	});

	$(".uipanel .react").change(function () {
		config.filter.react = $(this).val();
		table.redo();
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
		comments: 'v2.8',
		reactions: 'v2.8',
		sharedposts: 'v2.3',
		url_comments: 'v2.8',
		feed: 'v2.3',
		group: 'v2.8'
	},
	filter: {
		isDuplicate: true,
		isTag: false,
		word: '',
		react: 'all',
		endTime: nowDate()
	},
	auth: 'read_stream,user_photos,user_posts,user_groups,user_managed_groups,pages_show_list'
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
			if (type == "login") {
				if (response.authResponse.grantedScopes.indexOf('read_stream') >= 0) {
					step.step1();
				} else {
					alert('沒有權限或授權不完成');
				}
			} else {
				step.step3();
			}
		} else {
			FB.login(function (response) {
				fb.callback(response);
			}, { scope: config.auth, return_scopes: true });
		}
	}
};
var fanpage = [];
var group = [];
var shortcut = [];
var last_command = {};
var url = {
	send: function send(tar, command) {
		var id = $(tar).parent().siblings('p').find('input').val();
		step.step3(id, command);
	}
};
var step = {
	step1: function step1() {
		$('.login').addClass('success');
		FB.api('v2.8/me/accounts', function (res) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				var _loop = function _loop() {
					var i = _step.value;

					fanpage.push(i);
					$("#select").prepend("<option data-type=\"posts\" value=\"" + i.id + "\">" + i.name + "</option>");
					FB.api("v2.8/" + i.id + "/posts", function (res2) {
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = res2.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var j = _step2.value;

								if (j.message && j.message.indexOf('抽獎') >= 0) {
									var mess = j.message.replace(/\n/g, "<br />");
									$('.step1 .cards').append("\n\t\t\t\t\t\t\t\t<div class=\"card\" data-fbid=\"" + j.id + "\">\n\t\t\t\t\t\t\t\t<p class=\"title\">" + i.name + "</p>\n\t\t\t\t\t\t\t\t<p class=\"message\" onclick=\"card.show(this)\">" + mess + "</p>\n\t\t\t\t\t\t\t\t<div class=\"action\">\n\t\t\t\t\t\t\t\t<div class=\"reactions\" onclick=\"step.step3('" + j.id + "', 'reactions')\">\u8B9A</div>\n\t\t\t\t\t\t\t\t<div class=\"comments\" onclick=\"step.step3('" + j.id + "', 'comments')\">\u7559\u8A00</div>\n\t\t\t\t\t\t\t\t<div class=\"sharedposts\" onclick=\"step.step3('" + j.id + "', 'sharedposts')\">\u5206\u4EAB</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t");
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
					});
				};

				for (var _iterator = res.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					_loop();
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
		FB.api('v2.8/me/groups', function (res) {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				var _loop2 = function _loop2() {
					var i = _step3.value;

					group.push(i);
					$("#select").prepend("<option data-type=\"feed\" value=\"" + i.id + "\">" + i.name + "</option>");
					FB.api("v2.8/" + i.id + "/feed?fields=from,message,id", function (res2) {
						var _iteratorNormalCompletion4 = true;
						var _didIteratorError4 = false;
						var _iteratorError4 = undefined;

						try {
							for (var _iterator4 = res2.data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
								var j = _step4.value;

								if (j.message && j.message.indexOf('抽獎') >= 0 && j.from.id) {
									var mess = j.message.replace(/\n/g, "<br />");
									$('.step1 .cards').append("\n\t\t\t\t\t\t\t\t<div class=\"card\" data-fbid=\"" + j.id + "\">\n\t\t\t\t\t\t\t\t<p class=\"title\">" + i.name + "</p>\n\t\t\t\t\t\t\t\t<p class=\"message\">" + mess + "</p>\n\t\t\t\t\t\t\t\t<div class=\"action\">\n\t\t\t\t\t\t\t\t<div class=\"reactions\" onclick=\"step.step3('" + j.id + "', 'reactions')\">\u8B9A</div>\n\t\t\t\t\t\t\t\t<div class=\"comments\" onclick=\"step.step3('" + j.id + "', 'comments')\">\u7559\u8A00</div>\n\t\t\t\t\t\t\t\t<div class=\"sharedposts\" onclick=\"step.step3('" + j.id + "', 'sharedposts')\">\u5206\u4EAB</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t");
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
					});
				};

				for (var _iterator3 = res.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					_loop2();
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
		});
		FB.api('v2.8/me', function (res) {
			$("#select").prepend("<option data-type=\"posts\" value=\"" + res.id + "\">" + res.name + "</option>");
			FB.api("v2.8/me/posts", function (res2) {
				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = res2.data[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var j = _step5.value;

						if (j.message && j.message.indexOf('抽獎') >= 0) {
							var mess = j.message.replace(/\n/g, "<br />");
							$('.step1 .cards').append("\n\t\t\t\t\t\t\t<div class=\"card\" data-fbid=\"" + j.id + "\">\n\t\t\t\t\t\t\t<p class=\"title\">" + res.name + "</p>\n\t\t\t\t\t\t\t<p class=\"message\" onclick=\"card.show(this)\">" + mess + "</p>\n\t\t\t\t\t\t\t<div class=\"action\">\n\t\t\t\t\t\t\t<div class=\"reactions\" onclick=\"step.step3('" + j.id + "', 'reactions')\">\u8B9A</div>\n\t\t\t\t\t\t\t<div class=\"comments\" onclick=\"step.step3('" + j.id + "', 'comments')\">\u7559\u8A00</div>\n\t\t\t\t\t\t\t<div class=\"sharedposts\" onclick=\"step.step3('" + j.id + "', 'sharedposts')\">\u5206\u4EAB</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t");
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
			});
		});
	},
	step2: function step2(page) {
		$('.step2').addClass('visible');
		$('.step2 .cards').html("");
		$('.step2 .head span').text(page.name);
		var command = page.type;
		FB.api("v2.8/" + page.id + "/" + command, function (res) {
			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = res.data[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var j = _step6.value;

					var mess = j.message ? j.message.replace(/\n/g, "<br />") : "";
					$('.step2 .cards').append("\n\t\t\t\t\t<div class=\"card\" data-fbid=\"" + j.id + "\">\n\t\t\t\t\t<p class=\"message\" onclick=\"card.show(this)\">" + mess + "</p>\n\t\t\t\t\t<div class=\"action\">\n\t\t\t\t\t<div class=\"reactions\" onclick=\"step.step3('" + j.id + "', 'reactions')\">\u8B9A</div>\n\t\t\t\t\t<div class=\"comments\" onclick=\"step.step3('" + j.id + "', 'comments')\">\u7559\u8A00</div>\n\t\t\t\t\t<div class=\"sharedposts\" onclick=\"step.step3('" + j.id + "', 'sharedposts')\">\u5206\u4EAB</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t");
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
		});
	},
	step2to1: function step2to1() {
		$('#select').val(0);
		$('.step2').removeClass('visible');
	},
	step3hide: function step3hide() {
		$("#awardList").hide();
		$('.step3').removeClass('visible');
	},
	step3: function step3(fbid, command) {
		last_command = { fbid: fbid, command: command };
		config.filter.endTime = nowDate();
		$('.step3').addClass('visible');
		$(".console .message").text('');
		$('.loading.waiting').addClass('visible');
		data.raw = [];
		data.filtered = [];
		data.command = command;
		if (command == 'reactions') {
			$('.optionFilter .react').removeClass('hide');
			$('.optionFilter .timelimit').addClass('hide');
		}
		FB.api(config.apiVersion[command] + "/" + fbid + "/" + command, function (res) {
			console.log(res);
			data.length = res.data.length;
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = res.data[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var d = _step7.value;

					if (d.id) {
						if (command == 'reactions') {
							d.from = { id: d.id, name: d.name };
						}
						if (d.from) {
							data.raw.push(d);
						}
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
				filter.totalFilter.apply(filter, [data.raw].concat(_toConsumableArray(obj2Array(config.filter))));
			}
		});

		function getNext(url) {
			$.getJSON(url, function (res) {
				data.length += res.data.length;
				$(".console .message").text('已截取  ' + data.length + ' 筆資料...');
				var _iteratorNormalCompletion8 = true;
				var _didIteratorError8 = false;
				var _iteratorError8 = undefined;

				try {
					for (var _iterator8 = res.data[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
						var d = _step8.value;

						if (d.id) {
							if (command == 'reactions') {
								d.from = { id: d.id, name: d.name };
							}
							if (d.from) {
								data.raw.push(d);
							}
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

				if (res.data.length > 0 && res.paging.next) {
					getNext(res.paging.next);
				} else {
					filter.totalFilter.apply(filter, [data.raw].concat(_toConsumableArray(obj2Array(config.filter))));
				}
			}).fail(function () {
				getNext(url, 200);
			});
		}
	}
};

var card = {
	show: function show(e) {
		if ($(e).hasClass('visible')) {
			$(e).removeClass('visible');
		} else {
			$(e).addClass('visible');
		}
	}
};

var data = {
	raw: [],
	filtered: [],
	command: '',
	length: 0
};

var table = {
	generate: function generate() {
		$('.loading.waiting').removeClass('visible');
		$(".main_table").DataTable().destroy();
		var filterdata = data.filtered;
		var thead = '';
		var tbody = '';
		if (data.command === 'reactions') {
			thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u8868\u60C5</td>";
		} else {
			thead = "<td>\u5E8F\u865F</td>\n\t\t\t<td width=\"200\">\u540D\u5B57</td>\n\t\t\t<td class=\"nowrap\">\u7559\u8A00\u6642\u9593</td>";
		}

		var host = 'http://www.facebook.com/';

		var _iteratorNormalCompletion9 = true;
		var _didIteratorError9 = false;
		var _iteratorError9 = undefined;

		try {
			for (var _iterator9 = filterdata.entries()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
				var _step9$value = _slicedToArray(_step9.value, 2),
				    j = _step9$value[0],
				    val = _step9$value[1];

				var td = "<td><a href='http://www.facebook.com/" + val.id + "' target=\"_blank\">" + (j + 1) + "</a></td>\n\t\t\t<td><a href='http://www.facebook.com/" + val.from.id + "' target=\"_blank\">" + val.from.name + "</a></td>";
				if (data.command === 'reactions') {
					td += "<td class=\"center\"><span class=\"react " + val.type + "\"></span>" + val.type + "</td>";
				} else {
					td += "<td class=\"nowrap\">" + timeConverter(val.created_time) + "</td>";
				}
				var tr = "<tr>" + td + "</tr>";
				tbody += tr;
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

		var insert = "<thead><tr align=\"center\">" + thead + "</tr></thead><tbody>" + tbody + "</tbody>";
		$(".main_table").html('').append(insert);

		active();

		function active() {
			var table = $(".main_table").DataTable({
				"pageLength": 300,
				"searching": true,
				"lengthChange": false
			});

			$("#searchName").on('blur change keyup', function () {
				table.columns(1).search(this.value).draw();
			});
		}
	},
	redo: function redo() {
		filter.totalFilter.apply(filter, [data.raw].concat(_toConsumableArray(obj2Array(config.filter))));
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
		var num = $("#howmany").val();
		choose.award = genRandomArray(data.filtered.length).splice(0, num);
		var insert = '';
		var _iteratorNormalCompletion10 = true;
		var _didIteratorError10 = false;
		var _iteratorError10 = undefined;

		try {
			for (var _iterator10 = choose.award[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
				var _i = _step10.value;

				insert += '<tr>' + $('.main_table').DataTable().rows({ search: 'applied' }).nodes()[_i].innerHTML + '</tr>';
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

		$('#awardList table tbody').html(insert);
		$('#awardList table tbody tr').addClass('success');

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
			$('.identity').removeClass('hide').html("\u767B\u5165\u8EAB\u4EFD\uFF1A<img src=\"http://graph.facebook.com/" + res.id + "/picture?type=small\"><span>" + res.name + "</span>");
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
				var _group = posturl.indexOf('/groups/');
				var event = posturl.indexOf('/events/');
				if (_group >= 0) {
					start = _group + 8;
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

var filter = {
	totalFilter: function totalFilter(rawdata, isDuplicate, isTag, word, react, endTime) {
		var d = rawdata;
		if (isDuplicate) {
			d = filter.unique(d);
		}
		if (word !== '') {
			d = filter.word(d, word);
		}
		if (isTag) {
			d = filter.tag(d);
		}
		if (data.command !== 'reactions') {
			d = filter.time(d, endTime);
		} else {
			d = filter.react(d, react);
		}
		data.filtered = d;
		table.generate();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCIkIiwidGV4dCIsIkpTT04iLCJzdHJpbmdpZnkiLCJsYXN0X2NvbW1hbmQiLCJjb25zb2xlIiwibG9nIiwidmFsIiwiZmFkZUluIiwiZG9jdW1lbnQiLCJyZWFkeSIsImNsaWNrIiwiZmIiLCJnZXRBdXRoIiwiY2hhbmdlIiwiaWQiLCJuYW1lIiwiZmluZCIsInR5cGUiLCJhdHRyIiwicGFnZSIsInN0ZXAiLCJzdGVwMiIsImUiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiYXBwZW5kIiwib24iLCJjb25maWciLCJmaWx0ZXIiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJ0YWJsZSIsInJlZG8iLCJkYXRlRHJvcHBlciIsInJlYWN0IiwiZmllbGQiLCJjb21tZW50cyIsInJlYWN0aW9ucyIsInNoYXJlZHBvc3RzIiwidXJsX2NvbW1lbnRzIiwiZmVlZCIsImxpbWl0IiwiYXBpVmVyc2lvbiIsImdyb3VwIiwiaXNUYWciLCJ3b3JkIiwiZW5kVGltZSIsIm5vd0RhdGUiLCJhdXRoIiwidXNlcl9wb3N0cyIsIkZCIiwibG9naW4iLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzdGVwMSIsImFsZXJ0Iiwic3RlcDMiLCJmYW5wYWdlIiwic2hvcnRjdXQiLCJzZW5kIiwidGFyIiwiY29tbWFuZCIsInBhcmVudCIsInNpYmxpbmdzIiwiYXBpIiwicmVzIiwiaSIsInB1c2giLCJwcmVwZW5kIiwicmVzMiIsImRhdGEiLCJqIiwibWVzc2FnZSIsIm1lc3MiLCJyZXBsYWNlIiwiZnJvbSIsImh0bWwiLCJzdGVwMnRvMSIsInN0ZXAzaGlkZSIsImhpZGUiLCJmYmlkIiwicmF3IiwiZmlsdGVyZWQiLCJsZW5ndGgiLCJkIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImdldEpTT04iLCJmYWlsIiwiY2FyZCIsInNob3ciLCJnZW5lcmF0ZSIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJmaWx0ZXJkYXRhIiwidGhlYWQiLCJ0Ym9keSIsImhvc3QiLCJlbnRyaWVzIiwidGQiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwic2VhcmNoIiwidmFsdWUiLCJkcmF3IiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwiZWFjaCIsIm4iLCJwYXJzZUludCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwicm93cyIsIm5vZGVzIiwiaW5uZXJIVE1MIiwidXNlcmlkIiwiZm9ybWF0IiwiZ2V0IiwidGhlbiIsInN0YXJ0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwb3N0dXJsIiwic3Vic3RyaW5nIiwib2JqIiwiZnVsbElEIiwib2dfb2JqZWN0IiwicmVnZXgiLCJyZXN1bHQiLCJtYXRjaCIsInVybHR5cGUiLCJjaGVja1R5cGUiLCJjaGVja1BhZ2VJRCIsInBhZ2VJRCIsImVuZCIsInB1cmVJRCIsInN3YWwiLCJ0aXRsZSIsImRvbmUiLCJldmVudCIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJlcnJvciIsInJhd2RhdGEiLCJ1bmlxdWUiLCJ0YWciLCJ0aW1lIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsInNwbGl0IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwidWkiLCJyZXNldCIsImEiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJtYXAiLCJpbmRleCIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0NDLEdBQUUsaUJBQUYsRUFBcUJDLElBQXJCLENBQTZCQyxLQUFLQyxTQUFMLENBQWVDLFlBQWYsQ0FBN0I7QUFDQSxLQUFJLENBQUNYLFlBQUwsRUFBa0I7QUFDakJZLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUQsVUFBUUMsR0FBUixDQUFZLHNCQUFzQk4sRUFBRSxnQkFBRixFQUFvQk8sR0FBcEIsRUFBbEM7QUFDQVAsSUFBRSxpQkFBRixFQUFxQlEsTUFBckI7QUFDQWYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRE8sRUFBRVMsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDM0JWLEdBQUUsWUFBRixFQUFnQlcsS0FBaEIsQ0FBc0IsWUFBVTtBQUMvQkMsS0FBR0MsT0FBSCxDQUFXLE9BQVg7QUFDQSxFQUZEO0FBR0FiLEdBQUUsU0FBRixFQUFhYyxNQUFiLENBQW9CLFlBQVU7QUFDN0IsTUFBSUMsS0FBS2YsRUFBRSxJQUFGLEVBQVFPLEdBQVIsRUFBVDtBQUNBLE1BQUlTLE9BQU9oQixFQUFFLElBQUYsRUFBUWlCLElBQVIsQ0FBYSxpQkFBYixFQUFnQ2hCLElBQWhDLEVBQVg7QUFDQSxNQUFJaUIsT0FBT2xCLEVBQUUsSUFBRixFQUFRaUIsSUFBUixDQUFhLGlCQUFiLEVBQWdDRSxJQUFoQyxDQUFxQyxXQUFyQyxDQUFYO0FB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LENBQXZCLEVBQTBCO0FBQ3pCaUksTUFBSWpJLENBQUosSUFBU0EsQ0FBVDtBQUNBO0FBQ0QsTUFBS0EsSUFBSSxDQUFULEVBQWFBLElBQUltRCxDQUFqQixFQUFxQixFQUFFbkQsQ0FBdkIsRUFBMEI7QUFDekJtSSxNQUFJQyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0JuRixDQUEzQixDQUFKO0FBQ0FvRCxNQUFJMEIsSUFBSUUsQ0FBSixDQUFKO0FBQ0FGLE1BQUlFLENBQUosSUFBU0YsSUFBSWpJLENBQUosQ0FBVDtBQUNBaUksTUFBSWpJLENBQUosSUFBU3VHLENBQVQ7QUFDQTtBQUNELFFBQU8wQixHQUFQO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxyXG57XHJcblx0JCgnLmNvbnNvbGUgLmVycm9yJykudGV4dChgJHtKU09OLnN0cmluZ2lmeShsYXN0X2NvbW1hbmQpfSDnmbznlJ/pjK/oqqTvvIzoq4vmiKrlnJbpgJrnn6XnrqHnkIblk6FgKTtcclxuXHRpZiAoIWVycm9yTWVzc2FnZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdGNvbnNvbGUubG9nKFwiRXJyb3Igb2NjdXIgVVJM77yaIFwiICsgJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcdFxyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHQkKFwiI2J0bl9sb2dpblwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnbG9naW4nKTtcclxuXHR9KTtcclxuXHQkKCcjc2VsZWN0JykuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRsZXQgaWQgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0bGV0IG5hbWUgPSAkKHRoaXMpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudGV4dCgpO1xyXG5cdFx0bGV0IHR5cGUgPSAkKHRoaXMpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikuYXR0cignZGF0YS10eXBlJyk7XHJcblx0XHRsZXQgcGFnZSA9IHtpZCxuYW1lLHR5cGV9O1xyXG5cdFx0aWYgKHBhZ2UuaWQgIT09ICcwJyl7XHJcblx0XHRcdHN0ZXAuc3RlcDIocGFnZSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9wYXlcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ2FkZFNjb3BlJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRjaG9vc2UuaW5pdCgpO1xyXG5cdH0pO1xyXG5cdFxyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj5gKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcclxuXHRcdGNvbmZpZy5maWx0ZXIuaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLm9wdGlvbkZpbHRlciBpbnB1dCcpLmRhdGVEcm9wcGVyKCk7XHJcblx0JCgnLnBpY2stc3VibWl0Jykub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xyXG5cdFx0Ly8gY29uZmlnLmZpbHRlci5lbmRUaW1lID0gJCgnLm9wdGlvbkZpbHRlciBpbnB1dCcpLnZhbCgpK1wiLTIzLTU5LTU5XCI7XHJcblx0XHQvLyB0YWJsZS5yZWRvKCk7XHJcblx0fSlcclxuXHJcblx0JChcIi51aXBhbmVsIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxufSk7XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywnbWVzc2FnZV90YWdzJywnbWVzc2FnZSxmcm9tJywnY3JlYXRlZF90aW1lJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcclxuXHRcdGZlZWQ6IFtdXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2Mi44JyxcclxuXHRcdHJlYWN0aW9uczogJ3YyLjgnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi4zJyxcclxuXHRcdHVybF9jb21tZW50czogJ3YyLjgnLFxyXG5cdFx0ZmVlZDogJ3YyLjMnLFxyXG5cdFx0Z3JvdXA6ICd2Mi44J1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHRpc0R1cGxpY2F0ZTogdHJ1ZSxcclxuXHRcdGlzVGFnOiBmYWxzZSxcclxuXHRcdHdvcmQ6ICcnLFxyXG5cdFx0cmVhY3Q6ICdhbGwnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRhdXRoOiAncmVhZF9zdHJlYW0sdXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX2dyb3Vwcyx1c2VyX21hbmFnZWRfZ3JvdXBzLHBhZ2VzX3Nob3dfbGlzdCdcclxufVxyXG5cclxubGV0IGZiID0ge1xyXG5cdHVzZXJfcG9zdHM6IGZhbHNlLFxyXG5cdGdldEF1dGg6ICh0eXBlKT0+e1xyXG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UsIHR5cGUpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKT0+e1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJsb2dpblwiKXtcclxuXHRcdFx0XHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXMuaW5kZXhPZigncmVhZF9zdHJlYW0nKSA+PSAwKXtcclxuXHRcdFx0XHRcdHN0ZXAuc3RlcDEoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGFsZXJ0KCfmspLmnInmrIrpmZDmiJbmjojmrIrkuI3lrozmiJAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHN0ZXAuc3RlcDMoKTtcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbmxldCBmYW5wYWdlID0gW107XHJcbmxldCBncm91cCA9IFtdO1xyXG5sZXQgc2hvcnRjdXQgPSBbXTtcclxubGV0IGxhc3RfY29tbWFuZCA9IHt9O1xyXG5sZXQgdXJsID0ge1xyXG5cdHNlbmQ6ICh0YXIsIGNvbW1hbmQpPT57XHJcblx0XHRsZXQgaWQgPSAkKHRhcikucGFyZW50KCkuc2libGluZ3MoJ3AnKS5maW5kKCdpbnB1dCcpLnZhbCgpO1xyXG5cdFx0c3RlcC5zdGVwMyhpZCwgY29tbWFuZCk7XHJcblx0fVxyXG59XHJcbmxldCBzdGVwID0ge1xyXG5cdHN0ZXAxOiAoKT0+e1xyXG5cdFx0JCgnLmxvZ2luJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuXHRcdEZCLmFwaSgndjIuOC9tZS9hY2NvdW50cycsIChyZXMpPT57XHJcblx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0ZmFucGFnZS5wdXNoKGkpO1xyXG5cdFx0XHRcdCQoXCIjc2VsZWN0XCIpLnByZXBlbmQoYDxvcHRpb24gZGF0YS10eXBlPVwicG9zdHNcIiB2YWx1ZT1cIiR7aS5pZH1cIj4ke2kubmFtZX08L29wdGlvbj5gKTtcclxuXHRcdFx0XHRGQi5hcGkoYHYyLjgvJHtpLmlkfS9wb3N0c2AsIChyZXMyKT0+e1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBqIG9mIHJlczIuZGF0YSl7XHJcblx0XHRcdFx0XHRcdGlmKGoubWVzc2FnZSAmJiBqLm1lc3NhZ2UuaW5kZXhPZign5oq9542OJykgPj0wKXtcclxuXHRcdFx0XHRcdFx0XHRsZXQgbWVzcyA9IGoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKTtcclxuXHRcdFx0XHRcdFx0XHQkKCcuc3RlcDEgLmNhcmRzJykuYXBwZW5kKGBcclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkXCIgZGF0YS1mYmlkPVwiJHtqLmlkfVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJ0aXRsZVwiPiR7aS5uYW1lfTwvcD5cclxuXHRcdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwibWVzc2FnZVwiIG9uY2xpY2s9XCJjYXJkLnNob3codGhpcylcIj4ke21lc3N9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImFjdGlvblwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJlYWN0aW9uc1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3JlYWN0aW9ucycpXCI+6K6aPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29tbWVudHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdjb21tZW50cycpXCI+55WZ6KiAPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2hhcmVkcG9zdHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdzaGFyZWRwb3N0cycpXCI+5YiG5LqrPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0YCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRGQi5hcGkoJ3YyLjgvbWUvZ3JvdXBzJywgKHJlcyk9PntcclxuXHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRncm91cC5wdXNoKGkpO1xyXG5cdFx0XHRcdCQoXCIjc2VsZWN0XCIpLnByZXBlbmQoYDxvcHRpb24gZGF0YS10eXBlPVwiZmVlZFwiIHZhbHVlPVwiJHtpLmlkfVwiPiR7aS5uYW1lfTwvb3B0aW9uPmApO1xyXG5cdFx0XHRcdEZCLmFwaShgdjIuOC8ke2kuaWR9L2ZlZWQ/ZmllbGRzPWZyb20sbWVzc2FnZSxpZGAsIChyZXMyKT0+e1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBqIG9mIHJlczIuZGF0YSl7XHJcblx0XHRcdFx0XHRcdGlmKGoubWVzc2FnZSAmJiBqLm1lc3NhZ2UuaW5kZXhPZign5oq9542OJykgPj0wICYmIGouZnJvbS5pZCl7XHJcblx0XHRcdFx0XHRcdFx0bGV0IG1lc3MgPSBqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIik7XHJcblx0XHRcdFx0XHRcdFx0JCgnLnN0ZXAxIC5jYXJkcycpLmFwcGVuZChgXHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZFwiIGRhdGEtZmJpZD1cIiR7ai5pZH1cIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwidGl0bGVcIj4ke2kubmFtZX08L3A+XHJcblx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cIm1lc3NhZ2VcIj4ke21lc3N9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImFjdGlvblwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJlYWN0aW9uc1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3JlYWN0aW9ucycpXCI+6K6aPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29tbWVudHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdjb21tZW50cycpXCI+55WZ6KiAPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2hhcmVkcG9zdHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdzaGFyZWRwb3N0cycpXCI+5YiG5LqrPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0YCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRGQi5hcGkoJ3YyLjgvbWUnLCAocmVzKT0+e1xyXG5cdFx0XHQkKFwiI3NlbGVjdFwiKS5wcmVwZW5kKGA8b3B0aW9uIGRhdGEtdHlwZT1cInBvc3RzXCIgdmFsdWU9XCIke3Jlcy5pZH1cIj4ke3Jlcy5uYW1lfTwvb3B0aW9uPmApO1xyXG5cdFx0XHRGQi5hcGkoYHYyLjgvbWUvcG9zdHNgLCAocmVzMik9PntcclxuXHRcdFx0XHRmb3IobGV0IGogb2YgcmVzMi5kYXRhKXtcclxuXHRcdFx0XHRcdGlmKGoubWVzc2FnZSAmJiBqLm1lc3NhZ2UuaW5kZXhPZign5oq9542OJykgPj0wKXtcclxuXHRcdFx0XHRcdFx0bGV0IG1lc3MgPSBqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIik7XHJcblx0XHRcdFx0XHRcdCQoJy5zdGVwMSAuY2FyZHMnKS5hcHBlbmQoYFxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkXCIgZGF0YS1mYmlkPVwiJHtqLmlkfVwiPlxyXG5cdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwidGl0bGVcIj4ke3Jlcy5uYW1lfTwvcD5cclxuXHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cIm1lc3NhZ2VcIiBvbmNsaWNrPVwiY2FyZC5zaG93KHRoaXMpXCI+JHttZXNzfTwvcD5cclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJlYWN0aW9uc1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3JlYWN0aW9ucycpXCI+6K6aPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbW1lbnRzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnY29tbWVudHMnKVwiPueVmeiogDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzaGFyZWRwb3N0c1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3NoYXJlZHBvc3RzJylcIj7liIbkuqs8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRzdGVwMjogKHBhZ2UpPT57XHJcblx0XHQkKCcuc3RlcDInKS5hZGRDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0JCgnLnN0ZXAyIC5jYXJkcycpLmh0bWwoXCJcIik7XHJcblx0XHQkKCcuc3RlcDIgLmhlYWQgc3BhbicpLnRleHQocGFnZS5uYW1lKTtcclxuXHRcdGxldCBjb21tYW5kID0gcGFnZS50eXBlO1xyXG5cdFx0RkIuYXBpKGB2Mi44LyR7cGFnZS5pZH0vJHtjb21tYW5kfWAsIChyZXMpPT57XHJcblx0XHRcdGZvcihsZXQgaiBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0bGV0IG1lc3MgPSBqLm1lc3NhZ2UgPyBqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xyXG5cdFx0XHRcdCQoJy5zdGVwMiAuY2FyZHMnKS5hcHBlbmQoYFxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhcmRcIiBkYXRhLWZiaWQ9XCIke2ouaWR9XCI+XHJcblx0XHRcdFx0XHQ8cCBjbGFzcz1cIm1lc3NhZ2VcIiBvbmNsaWNrPVwiY2FyZC5zaG93KHRoaXMpXCI+JHttZXNzfTwvcD5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJhY3Rpb25cIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyZWFjdGlvbnNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdyZWFjdGlvbnMnKVwiPuiumjwvZGl2PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbW1lbnRzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnY29tbWVudHMnKVwiPueVmeiogDwvZGl2PlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNoYXJlZHBvc3RzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnc2hhcmVkcG9zdHMnKVwiPuWIhuS6qzwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdGApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHN0ZXAydG8xOiAoKT0+e1xyXG5cdFx0JCgnI3NlbGVjdCcpLnZhbCgwKTtcclxuXHRcdCQoJy5zdGVwMicpLnJlbW92ZUNsYXNzKCd2aXNpYmxlJyk7XHJcblx0fSxcclxuXHRzdGVwM2hpZGU6ICgpPT57XHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XHJcblx0XHQkKCcuc3RlcDMnKS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xyXG5cdH0sXHJcblx0c3RlcDM6IChmYmlkLCBjb21tYW5kKT0+e1xyXG5cdFx0bGFzdF9jb21tYW5kID0ge2ZiaWQsY29tbWFuZH07XHJcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBub3dEYXRlKCk7XHJcblx0XHQkKCcuc3RlcDMnKS5hZGRDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0JCgnLmxvYWRpbmcud2FpdGluZycpLmFkZENsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdFx0ZGF0YS5maWx0ZXJlZCA9IFtdO1xyXG5cdFx0ZGF0YS5jb21tYW5kID0gY29tbWFuZDtcclxuXHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0JCgnLm9wdGlvbkZpbHRlciAucmVhY3QnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcub3B0aW9uRmlsdGVyIC50aW1lbGltaXQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWR9LyR7Y29tbWFuZH1gLCAocmVzKT0+e1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXMpO1xyXG5cdFx0XHRkYXRhLmxlbmd0aCA9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRpZiAoZC5pZCl7XHJcblx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChkLmZyb20pe1xyXG5cdFx0XHRcdFx0XHRkYXRhLnJhdy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZmlsdGVyLnRvdGFsRmlsdGVyKGRhdGEucmF3LCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCl7XHJcblx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0ZGF0YS5sZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcrIGRhdGEubGVuZ3RoICsnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdGZvcihsZXQgZCBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0XHRpZiAoZC5pZCl7XHJcblx0XHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7aWQ6IGQuaWQsIG5hbWU6IGQubmFtZX07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKGQuZnJvbSl7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YS5yYXcucHVzaChkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xyXG5cdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0ZmlsdGVyLnRvdGFsRmlsdGVyKGRhdGEucmF3LCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSkuZmFpbCgoKT0+e1xyXG5cdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBjYXJkID0ge1xyXG5cdHNob3c6IChlKT0+e1xyXG5cdFx0aWYgKCQoZSkuaGFzQ2xhc3MoJ3Zpc2libGUnKSl7XHJcblx0XHRcdCQoZSkucmVtb3ZlQ2xhc3MoJ3Zpc2libGUnKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKGUpLmFkZENsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IFtdLFxyXG5cdGZpbHRlcmVkOiBbXSxcclxuXHRjb21tYW5kOiAnJyxcclxuXHRsZW5ndGg6IDBcclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAoKT0+e1xyXG5cdFx0JCgnLmxvYWRpbmcud2FpdGluZycpLnJlbW92ZUNsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHQkKFwiLm1haW5fdGFibGVcIikuRGF0YVRhYmxlKCkuZGVzdHJveSgpO1xyXG5cdFx0bGV0IGZpbHRlcmRhdGEgPSBkYXRhLmZpbHRlcmVkO1xyXG5cdFx0bGV0IHRoZWFkID0gJyc7XHJcblx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdGlmKGRhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZD7ooajmg4U8L3RkPmA7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XHJcblx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cIm5vd3JhcFwiPueVmeiogOaZgumWkzwvdGQ+YDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaG9zdCA9ICdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8nO1xyXG5cclxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZGF0YS5lbnRyaWVzKCkpe1xyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmlkfScgdGFyZ2V0PVwiX2JsYW5rXCI+JHtqKzF9PC9hPjwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfScgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuZnJvbS5uYW1lfTwvYT48L3RkPmA7XHJcblx0XHRcdGlmKGRhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHJcblxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCl7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAzMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQoXCIjc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRhYmxlXHJcblx0XHRcdFx0LmNvbHVtbnMoMSlcclxuXHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWRvOiAoKT0+e1xyXG5cdFx0ZmlsdGVyLnRvdGFsRmlsdGVyKGRhdGEucmF3LCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKCk9PntcclxuXHRcdGxldCB0aGVhZCA9ICQoJy5tYWluX3RhYmxlIHRoZWFkJykuaHRtbCgpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0Y2hvb3NlLmRhdGEgPSBkYXRhLmZpbHRlcihkYXRhLnJhdyk7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBbXTtcclxuXHRcdGNob29zZS5saXN0ID0gW107XHJcblx0XHRjaG9vc2UubnVtID0gMDtcclxuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcblx0XHRcdGNob29zZS5kZXRhaWwgPSB0cnVlO1xyXG5cdFx0XHQkKFwiLnByaXplRGV0YWlsIC5wcml6ZVwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XHJcblx0XHRcdFx0dmFyIHAgPSAkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIikudmFsKCk7XHJcblx0XHRcdFx0aWYgKG4gPiAwKXtcclxuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XHJcblx0XHRcdFx0XHRjaG9vc2UubGlzdC5wdXNoKHtcIm5hbWVcIjpwLCBcIm51bVwiOiBufSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjaG9vc2UubnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xyXG5cdFx0fVxyXG5cdFx0Y2hvb3NlLmdvKCk7XHJcblx0fSxcclxuXHRnbzogKCk9PntcclxuXHRcdGxldCBudW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShkYXRhLmZpbHRlcmVkLmxlbmd0aCkuc3BsaWNlKDAsbnVtKTtcclxuXHRcdGxldCBpbnNlcnQgPSAnJztcclxuXHRcdGZvcihsZXQgaSBvZiBjaG9vc2UuYXdhcmQpe1xyXG5cdFx0XHRpbnNlcnQgKz0gJzx0cj4nICsgJCgnLm1haW5fdGFibGUnKS5EYXRhVGFibGUoKS5yb3dzKHtzZWFyY2g6J2FwcGxpZWQnfSkubm9kZXMoKVtpXS5pbm5lckhUTUwgKyAnPC90cj4nO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKGluc2VydCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuXHJcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5mYWRlSW4oMTAwMCk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZmJpZCA9IHtcclxuXHRmYmlkOiBbXSxcclxuXHRpbml0OiAodHlwZSk9PntcclxuXHRcdGZiaWQuZmJpZCA9IFtdO1xyXG5cdFx0ZGF0YS5pbml0KCk7XHJcblx0XHRGQi5hcGkoXCIvbWVcIixmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRkYXRhLnVzZXJpZCA9IHJlcy5pZDtcclxuXHRcdFx0bGV0IHVybCA9IGZiaWQuZm9ybWF0KCQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xyXG5cdFx0XHRmYmlkLmdldCh1cmwsIHR5cGUpLnRoZW4oKGZiaWQpPT57XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0JCgnLmlkZW50aXR5JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKGDnmbvlhaXouqvku73vvJo8aW1nIHNyYz1cImh0dHA6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHtyZXMuaWR9L3BpY3R1cmU/dHlwZT1zbWFsbFwiPjxzcGFuPiR7cmVzLm5hbWV9PC9zcGFuPmApXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldDogKHVybCwgdHlwZSk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRpZiAodHlwZSA9PSAndXJsX2NvbW1lbnRzJyl7XHJcblx0XHRcdFx0bGV0IHBvc3R1cmwgPSB1cmw7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIj9cIikgPiAwKXtcclxuXHRcdFx0XHRcdHBvc3R1cmwgPSBwb3N0dXJsLnN1YnN0cmluZygwLHBvc3R1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRGQi5hcGkoYC8ke3Bvc3R1cmx9YCxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtmdWxsSUQ6IHJlcy5vZ19vYmplY3QuaWQsIHR5cGU6IHR5cGUsIGNvbW1hbmQ6ICdjb21tZW50cyd9O1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSB1cmwubWF0Y2gocmVnZXgpO1xyXG5cdFx0XHRcdGxldCB1cmx0eXBlID0gZmJpZC5jaGVja1R5cGUodXJsKTtcclxuXHRcdFx0XHRmYmlkLmNoZWNrUGFnZUlEKHVybCwgdXJsdHlwZSkudGhlbigoaWQpPT57XHJcblx0XHRcdFx0XHRpZiAoaWQgPT09ICdwZXJzb25hbCcpe1xyXG5cdFx0XHRcdFx0XHR1cmx0eXBlID0gJ3BlcnNvbmFsJztcclxuXHRcdFx0XHRcdFx0aWQgPSBkYXRhLnVzZXJpZDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCBvYmogPSB7cGFnZUlEOiBpZCwgdHlwZTogdXJsdHlwZSwgY29tbWFuZDogdHlwZX07XHJcblx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3BlcnNvbmFsJyl7XHJcblx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdmYmlkPScpO1xyXG5cdFx0XHRcdFx0XHRpZihzdGFydCA+PSAwKXtcclxuXHRcdFx0XHRcdFx0XHRsZXQgZW5kID0gdXJsLmluZGV4T2YoXCImXCIsc3RhcnQpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0KzUsZW5kKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ3Bvc3RzLycpO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0KzYsdXJsLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHR9ZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3B1cmUnKXtcclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHVybC5yZXBsYWNlKC9cXFwiL2csJycpO1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICdldmVudCcpe1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEpe1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly/mipNFVkVOVOS4reaJgOacieeVmeiogFxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmNvbW1hbmQgPSAnZmVlZCc7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1x0XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHQvL+aKk0VWRU5U5Lit5p+Q56+H55WZ6KiA55qE55WZ6KiAXHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gcmVzdWx0WzFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fWVsc2UgaWYgKHVybHR5cGUgPT09ICdncm91cCcpe1xyXG5cdFx0XHRcdFx0XHRcdGlmIChmYi51c2VyX3Bvc3RzKXtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArIFwiX1wiICtvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0c3dhbCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiAn56S+5ZyY5L2/55So6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5ZyYJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aHRtbDonPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyL1wiIHRhcmdldD1cIl9ibGFua1wiPmh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9jb21tZW50aGVscGVyLzwvYT4nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdFx0XHRcdH0pLmRvbmUoKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEgfHwgcmVzdWx0Lmxlbmd0aCA9PSAzKXtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3VubmFtZScpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNoZWNrVHlwZTogKHBvc3R1cmwpPT57XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZmJpZD1cIikgPj0gMCl7XHJcblx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ3Blcm1hbGluaycpID49IDApe1xyXG5cdFx0XHRcdHJldHVybiAndW5uYW1lJztcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0cmV0dXJuICdwZXJzb25hbCc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL2dyb3Vwcy9cIikgPj0gMCl7XHJcblx0XHRcdHJldHVybiAnZ3JvdXAnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJldmVudHNcIikgPj0gMCl7XHJcblx0XHRcdHJldHVybiAnZXZlbnQnO1xyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ1wiJykgPj0gMCl7XHJcblx0XHRcdHJldHVybiAncHVyZSc7XHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuICdub3JtYWwnO1xyXG5cdH0sXHJcblx0Y2hlY2tQYWdlSUQ6IChwb3N0dXJsLCB0eXBlKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGxldCBzdGFydCA9IHBvc3R1cmwuaW5kZXhPZihcImZhY2Vib29rLmNvbVwiKSsxMztcclxuXHRcdFx0bGV0IGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIixzdGFydCk7XHJcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdGlmIChlbmQgPCAwKXtcclxuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdmYmlkPScpID49IDApe1xyXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09ICd1bm5hbWUnKXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgndW5uYW1lJyk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHJlc29sdmUocG9zdHVybC5tYXRjaChyZWdleClbMV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bGV0IGdyb3VwID0gcG9zdHVybC5pbmRleE9mKCcvZ3JvdXBzLycpO1xyXG5cdFx0XHRcdGxldCBldmVudCA9IHBvc3R1cmwuaW5kZXhPZignL2V2ZW50cy8nKVxyXG5cdFx0XHRcdGlmIChncm91cCA+PSAwKXtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gZ3JvdXArODtcclxuXHRcdFx0XHRcdGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIixzdGFydCk7XHJcblx0XHRcdFx0XHRsZXQgcmVnZXgyID0gL1xcZHs2LH0vZztcclxuXHRcdFx0XHRcdGxldCB0ZW1wID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsZW5kKTtcclxuXHRcdFx0XHRcdGlmIChyZWdleDIudGVzdCh0ZW1wKSl7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUodGVtcCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgnZ3JvdXAnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZSBpZihldmVudCA+PSAwKXtcclxuXHRcdFx0XHRcdHJlc29sdmUoJ2V2ZW50Jyk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR2YXIgcGFnZW5hbWUgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCxlbmQpO1xyXG5cdFx0XHRcdFx0RkIuYXBpKGAvJHtwYWdlbmFtZX1gLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3Ipe1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUocmVzLmlkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGZvcm1hdDogKHVybCk9PntcclxuXHRcdGlmICh1cmwuaW5kZXhPZignYnVzaW5lc3MuZmFjZWJvb2suY29tLycpID49IDApe1xyXG5cdFx0XHR1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKFwiP1wiKSk7XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBmaWx0ZXIgPSB7XHJcblx0dG90YWxGaWx0ZXI6IChyYXdkYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBlbmRUaW1lKT0+e1xyXG5cdFx0bGV0IGQgPSByYXdkYXRhO1xyXG5cdFx0aWYgKGlzRHVwbGljYXRlKXtcclxuXHRcdFx0ZCA9IGZpbHRlci51bmlxdWUoZCk7XHJcblx0XHR9XHJcblx0XHRpZiAod29yZCAhPT0gJycpe1xyXG5cdFx0XHRkID0gZmlsdGVyLndvcmQoZCwgd29yZCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNUYWcpe1xyXG5cdFx0XHRkID0gZmlsdGVyLnRhZyhkKTtcclxuXHRcdH1cclxuXHRcdGlmIChkYXRhLmNvbW1hbmQgIT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0ZCA9IGZpbHRlci50aW1lKGQsIGVuZFRpbWUpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGQgPSBmaWx0ZXIucmVhY3QoZCwgcmVhY3QpO1xyXG5cdFx0fVxyXG5cdFx0ZGF0YS5maWx0ZXJlZCA9IGQ7XHJcblx0XHR0YWJsZS5nZW5lcmF0ZSgpO1xyXG5cdH0sXHJcblx0dW5pcXVlOiAoZGF0YSk9PntcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRsZXQga2V5ID0gaXRlbS5mcm9tLmlkO1xyXG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuXHRcdFx0XHRrZXlzLnB1c2goa2V5KTtcclxuXHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0d29yZDogKGRhdGEsIHdvcmQpPT57XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGFnOiAoZGF0YSk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZV90YWdzKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdH0sXHJcblx0dGltZTogKGRhdGEsIHQpPT57XHJcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCB0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLChwYXJzZUludCh0aW1lX2FyeVsxXSktMSksdGltZV9hcnlbMl0sdGltZV9hcnlbM10sdGltZV9hcnlbNF0sdGltZV9hcnlbNV0pKS5fZDtcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XHJcblx0XHRcdGlmIChjcmVhdGVkX3RpbWUgPCB0aW1lIHx8IG4uY3JlYXRlZF90aW1lID09IFwiXCIpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHRyZWFjdDogKGRhdGEsIHRhcik9PntcclxuXHRcdGlmICh0YXIgPT0gJ2FsbCcpe1xyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XHJcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG5ld0FyeTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCB1aSA9IHtcclxuXHRpbml0OiAoKT0+e1xyXG5cclxuXHR9LFxyXG5cdHJlc2V0OiAoKT0+e1xyXG5cdFx0bGV0IGNvbW1hbmQgPSBkYXRhLnJhdy5jb21tYW5kO1xyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0JCgnLnVpcGFuZWwgLnJlYWN0JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHRcdGlmIChjb21tYW5kID09PSAnY29tbWVudHMnKXtcclxuXHRcdFx0JCgnbGFiZWwudGFnJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRpZiAoJChcIiN0YWdcIikucHJvcChcImNoZWNrZWRcIikpe1xyXG5cdFx0XHRcdCQoXCIjdGFnXCIpLmNsaWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnbGFiZWwudGFnJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vd0RhdGUoKXtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpKzE7XHJcblx0dmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuXHR2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcblx0dmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG5cdHJldHVybiB5ZWFyK1wiLVwiK21vbnRoK1wiLVwiK2RhdGUrXCItXCIraG91citcIi1cIittaW4rXCItXCIrc2VjO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lQ29udmVydGVyKFVOSVhfdGltZXN0YW1wKXtcclxuXHQgdmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xyXG4gXHQgdmFyIG1vbnRocyA9IFsnMDEnLCcwMicsJzAzJywnMDQnLCcwNScsJzA2JywnMDcnLCcwOCcsJzA5JywnMTAnLCcxMScsJzEyJ107XHJcbiAgICAgdmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcbiAgICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuICAgICBpZiAoZGF0ZSA8IDEwKXtcclxuICAgICBcdGRhdGUgPSBcIjBcIitkYXRlO1xyXG4gICAgIH1cclxuICAgICB2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuICAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcbiAgICAgaWYgKG1pbiA8IDEwKXtcclxuICAgICBcdG1pbiA9IFwiMFwiK21pbjtcclxuICAgICB9XHJcbiAgICAgdmFyIHNlYyA9IGEuZ2V0U2Vjb25kcygpO1xyXG4gICAgIGlmIChzZWMgPCAxMCl7XHJcbiAgICAgXHRzZWMgPSBcIjBcIitzZWM7XHJcbiAgICAgfVxyXG4gICAgIHZhciB0aW1lID0geWVhcisnLScrbW9udGgrJy0nK2RhdGUrXCIgXCIraG91cisnOicrbWluKyc6JytzZWMgO1xyXG4gICAgIHJldHVybiB0aW1lO1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIG9iajJBcnJheShvYmope1xyXG4gXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xyXG4gXHRcdHJldHVybiBbdmFsdWVdO1xyXG4gXHR9KTtcclxuIFx0cmV0dXJuIGFycmF5O1xyXG4gfVxyXG5cclxuIGZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuIFx0dmFyIGFyeSA9IG5ldyBBcnJheSgpO1xyXG4gXHR2YXIgaSwgciwgdDtcclxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XHJcbiBcdFx0YXJ5W2ldID0gaTtcclxuIFx0fVxyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcbiBcdFx0dCA9IGFyeVtyXTtcclxuIFx0XHRhcnlbcl0gPSBhcnlbaV07XHJcbiBcdFx0YXJ5W2ldID0gdDtcclxuIFx0fVxyXG4gXHRyZXR1cm4gYXJ5O1xyXG4gfVxyXG4iXX0=
