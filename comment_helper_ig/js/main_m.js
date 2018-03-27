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
	auth: 'user_photos,user_posts,user_managed_groups,manage_pages',
	pageTokens: []
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
				var authStr = response.authResponse.grantedScopes;
				if (authStr.indexOf('manage_pages') >= 0 && authStr.indexOf('user_managed_groups') >= 0 && authStr.indexOf('user_posts') >= 0) {
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
			config.pageTokens = res.data;
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
		data.pageid = page.id;
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
		var token = '';
		var _iteratorNormalCompletion7 = true;
		var _didIteratorError7 = false;
		var _iteratorError7 = undefined;

		try {
			for (var _iterator7 = config.pageTokens[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
				var _i = _step7.value;

				if (_i.id == data.pageid) {
					token = _i.access_token;
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

		FB.api(config.apiVersion[command] + "/" + fbid + "/" + command + "?access_token=" + token, function (res) {
			console.log(res);
			data.length = res.data.length;
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
		});

		function getNext(url) {
			$.getJSON(url, function (res) {
				data.length += res.data.length;
				$(".console .message").text('已截取  ' + data.length + ' 筆資料...');
				var _iteratorNormalCompletion9 = true;
				var _didIteratorError9 = false;
				var _iteratorError9 = undefined;

				try {
					for (var _iterator9 = res.data[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
						var d = _step9.value;

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
	length: 0,
	pageid: ''
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

		var _iteratorNormalCompletion10 = true;
		var _didIteratorError10 = false;
		var _iteratorError10 = undefined;

		try {
			for (var _iterator10 = filterdata.entries()[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
				var _step10$value = _slicedToArray(_step10.value, 2),
				    j = _step10$value[0],
				    val = _step10$value[1];

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
		var _iteratorNormalCompletion11 = true;
		var _didIteratorError11 = false;
		var _iteratorError11 = undefined;

		try {
			for (var _iterator11 = choose.award[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
				var _i2 = _step11.value;

				insert += '<tr>' + $('.main_table').DataTable().rows({ search: 'applied' }).nodes()[_i2].innerHTML + '</tr>';
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW5fbS5qcyJdLCJuYW1lcyI6WyJlcnJvck1lc3NhZ2UiLCJ3aW5kb3ciLCJvbmVycm9yIiwiaGFuZGxlRXJyIiwibXNnIiwidXJsIiwibCIsIiQiLCJ0ZXh0IiwiSlNPTiIsInN0cmluZ2lmeSIsImxhc3RfY29tbWFuZCIsImNvbnNvbGUiLCJsb2ciLCJ2YWwiLCJmYWRlSW4iLCJkb2N1bWVudCIsInJlYWR5IiwiY2xpY2siLCJmYiIsImdldEF1dGgiLCJjaGFuZ2UiLCJpZCIsIm5hbWUiLCJmaW5kIiwidHlwZSIsImF0dHIiLCJwYWdlIiwic3RlcCIsInN0ZXAyIiwiZSIsImNob29zZSIsImluaXQiLCJoYXNDbGFzcyIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJhcHBlbmQiLCJvbiIsImNvbmZpZyIsImZpbHRlciIsImlzRHVwbGljYXRlIiwicHJvcCIsInRhYmxlIiwicmVkbyIsImRhdGVEcm9wcGVyIiwicmVhY3QiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJpc1RhZyIsIndvcmQiLCJlbmRUaW1lIiwibm93RGF0ZSIsImF1dGgiLCJwYWdlVG9rZW5zIiwidXNlcl9wb3N0cyIsIkZCIiwibG9naW4iLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFN0ciIsImF1dGhSZXNwb25zZSIsImdyYW50ZWRTY29wZXMiLCJpbmRleE9mIiwic3RlcDEiLCJhbGVydCIsInN0ZXAzIiwiZmFucGFnZSIsInNob3J0Y3V0Iiwic2VuZCIsInRhciIsImNvbW1hbmQiLCJwYXJlbnQiLCJzaWJsaW5ncyIsImFwaSIsInJlcyIsImRhdGEiLCJpIiwicHVzaCIsInByZXBlbmQiLCJyZXMyIiwiaiIsIm1lc3NhZ2UiLCJtZXNzIiwicmVwbGFjZSIsImZyb20iLCJodG1sIiwicGFnZWlkIiwic3RlcDJ0bzEiLCJzdGVwM2hpZGUiLCJoaWRlIiwiZmJpZCIsInJhdyIsImZpbHRlcmVkIiwidG9rZW4iLCJhY2Nlc3NfdG9rZW4iLCJsZW5ndGgiLCJkIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImdldEpTT04iLCJmYWlsIiwiY2FyZCIsInNob3ciLCJnZW5lcmF0ZSIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJmaWx0ZXJkYXRhIiwidGhlYWQiLCJ0Ym9keSIsImhvc3QiLCJlbnRyaWVzIiwidGQiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwic2VhcmNoIiwidmFsdWUiLCJkcmF3IiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwiZWFjaCIsIm4iLCJwYXJzZUludCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwicm93cyIsIm5vZGVzIiwiaW5uZXJIVE1MIiwidXNlcmlkIiwiZm9ybWF0IiwiZ2V0IiwidGhlbiIsInN0YXJ0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwb3N0dXJsIiwic3Vic3RyaW5nIiwib2JqIiwiZnVsbElEIiwib2dfb2JqZWN0IiwicmVnZXgiLCJyZXN1bHQiLCJtYXRjaCIsInVybHR5cGUiLCJjaGVja1R5cGUiLCJjaGVja1BhZ2VJRCIsInBhZ2VJRCIsImVuZCIsInB1cmVJRCIsInN3YWwiLCJ0aXRsZSIsImRvbmUiLCJldmVudCIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJlcnJvciIsInJhd2RhdGEiLCJ1bmlxdWUiLCJ0YWciLCJ0aW1lIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsInNwbGl0IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwidWkiLCJyZXNldCIsImEiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJtYXAiLCJpbmRleCIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0NDLEdBQUUsaUJBQUYsRUFBcUJDLElBQXJCLENBQTZCQyxLQUFLQyxTQUFMLENBQWVDLFlBQWYsQ0FBN0I7QUFDQSxLQUFJLENBQUNYLFlBQUwsRUFBa0I7QUFDakJZLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUQsVUFBUUMsR0FBUixDQUFZLHNCQUFzQk4sRUFBRSxnQkFBRixFQUFvQk8sR0FBcEIsRUFBbEM7QUFDQVAsSUFBRSxpQkFBRixFQUFxQlEsTUFBckI7QUFDQWYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRE8sRUFBRVMsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDM0JWLEdBQUUsWUFBRixFQUFnQlcsS0FBaEIsQ0FBc0IsWUFBVTtBQUMvQkMsS0FBR0MsT0FBSCxDQUFXLE9BQVg7QUFDQSxFQUZEO0FBR0FiLEdBQUUsU0FBRixFQUFhYyxNQUFiLENBQW9CLFlBQVU7QUFDN0IsTUFBSUMsS0FBS2YsRUFBRSxJQUFGLEVBQVFPLEdBQVIsRUFBVDtBQUNBLE1BQUlTLE9BQU9oQixFQUFFLElBQUYsRUFBUWlCLElBQVIsQ0FBYSxpQkFBYixFQUFnQ2hCLElBQWhDLEVBQVg7QUFDQSxNQUFJaUIsT0FBT2xCLEVBQUUsSUFB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dmFyIGVycm9yTWVzc2FnZSA9IGZhbHNlO1xud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXG5cbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csdXJsLGwpXG57XG5cdCQoJy5jb25zb2xlIC5lcnJvcicpLnRleHQoYCR7SlNPTi5zdHJpbmdpZnkobGFzdF9jb21tYW5kKX0g55m855Sf6Yyv6Kqk77yM6KuL5oiq5ZyW6YCa55+l566h55CG5ZOhYCk7XG5cdGlmICghZXJyb3JNZXNzYWdlKXtcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcblx0XHRjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VyIFVSTO+8miBcIiArICQoJyNlbnRlclVSTCAudXJsJykudmFsKCkpO1xuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcdFxuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cdCQoXCIjYnRuX2xvZ2luXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0ZmIuZ2V0QXV0aCgnbG9naW4nKTtcblx0fSk7XG5cdCQoJyNzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24oKXtcblx0XHRsZXQgaWQgPSAkKHRoaXMpLnZhbCgpO1xuXHRcdGxldCBuYW1lID0gJCh0aGlzKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnRleHQoKTtcblx0XHRsZXQgdHlwZSA9ICQodGhpcykuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS5hdHRyKCdkYXRhLXR5cGUnKTtcblx0XHRsZXQgcGFnZSA9IHtpZCxuYW1lLHR5cGV9O1xuXHRcdGlmIChwYWdlLmlkICE9PSAnMCcpe1xuXHRcdFx0c3RlcC5zdGVwMihwYWdlKTtcblx0XHR9XG5cdH0pO1xuXG5cblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0ZmIuZ2V0QXV0aCgnY29tbWVudHMnKTtcblx0fSk7XG5cblx0JChcIiNidG5fbGlrZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xuXHR9KTtcblxuXHQkKFwiI2J0bl9wYXlcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRmYi5nZXRBdXRoKCdhZGRTY29wZScpO1xuXHR9KTtcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0Y2hvb3NlLmluaXQoKTtcblx0fSk7XG5cdFxuXG5cdCQoXCIjZW5kVGltZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcblx0XHR9ZWxzZXtcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdCQoXCIucHJpemVEZXRhaWxcIikuYXBwZW5kKGA8ZGl2IGNsYXNzPVwicHJpemVcIj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7lk4HlkI3vvJo8aW5wdXQgdHlwZT1cInRleHRcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaW5wdXRfZ3JvdXBcIj7mir3njY7kurrmlbjvvJo8aW5wdXQgdHlwZT1cIm51bWJlclwiPjwvZGl2PjwvZGl2PmApO1xuXHR9KTtcblxuXHQkKFwiI3VuaXF1ZSwgI3RhZ1wiKS5vbignY2hhbmdlJyxmdW5jdGlvbigpe1xuXHRcdGNvbmZpZy5maWx0ZXIuaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcblx0XHR0YWJsZS5yZWRvKCk7XG5cdH0pO1xuXG5cdCQoJy5vcHRpb25GaWx0ZXIgaW5wdXQnKS5kYXRlRHJvcHBlcigpO1xuXHQkKCcucGljay1zdWJtaXQnKS5vbignY2xpY2snLGZ1bmN0aW9uKCl7XG5cdFx0Ly8gY29uZmlnLmZpbHRlci5lbmRUaW1lID0gJCgnLm9wdGlvbkZpbHRlciBpbnB1dCcpLnZhbCgpK1wiLTIzLTU5LTU5XCI7XG5cdFx0Ly8gdGFibGUucmVkbygpO1xuXHR9KVxuXG5cdCQoXCIudWlwYW5lbCAucmVhY3RcIikuY2hhbmdlKGZ1bmN0aW9uKCl7XG5cdFx0Y29uZmlnLmZpbHRlci5yZWFjdCA9ICQodGhpcykudmFsKCk7XG5cdFx0dGFibGUucmVkbygpO1xuXHR9KTtcblxufSk7XG5cbmxldCBjb25maWcgPSB7XG5cdGZpZWxkOiB7XG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsJ21lc3NhZ2VfdGFncycsJ21lc3NhZ2UsZnJvbScsJ2NyZWF0ZWRfdGltZSddLFxuXHRcdHJlYWN0aW9uczogW10sXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxuXHRcdHVybF9jb21tZW50czogW10sXG5cdFx0ZmVlZDogW11cblx0fSxcblx0bGltaXQ6IHtcblx0XHRjb21tZW50czogJzUwMCcsXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXG5cdFx0dXJsX2NvbW1lbnRzOiAnNTAwJyxcblx0XHRmZWVkOiAnNTAwJ1xuXHR9LFxuXHRhcGlWZXJzaW9uOiB7XG5cdFx0Y29tbWVudHM6ICd2Mi44Jyxcblx0XHRyZWFjdGlvbnM6ICd2Mi44Jyxcblx0XHRzaGFyZWRwb3N0czogJ3YyLjMnLFxuXHRcdHVybF9jb21tZW50czogJ3YyLjgnLFxuXHRcdGZlZWQ6ICd2Mi4zJyxcblx0XHRncm91cDogJ3YyLjgnXG5cdH0sXG5cdGZpbHRlcjoge1xuXHRcdGlzRHVwbGljYXRlOiB0cnVlLFxuXHRcdGlzVGFnOiBmYWxzZSxcblx0XHR3b3JkOiAnJyxcblx0XHRyZWFjdDogJ2FsbCcsXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXG5cdH0sXG5cdGF1dGg6ICd1c2VyX3Bob3Rvcyx1c2VyX3Bvc3RzLHVzZXJfbWFuYWdlZF9ncm91cHMsbWFuYWdlX3BhZ2VzJyxcblx0cGFnZVRva2VuczogW11cbn1cblxubGV0IGZiID0ge1xuXHR1c2VyX3Bvc3RzOiBmYWxzZSxcblx0Z2V0QXV0aDogKHR5cGUpPT57XG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XG5cdH0sXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpPT57XG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcblx0XHRcdGlmICh0eXBlID09IFwibG9naW5cIil7XG5cdFx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX21hbmFnZWRfZ3JvdXBzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcblx0XHRcdFx0XHRzdGVwLnN0ZXAxKCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGFsZXJ0KCfmspLmnInmrIrpmZDmiJbmjojmrIrkuI3lrozmiJAnKTtcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHN0ZXAuc3RlcDMoKTtcdFx0XHRcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcblx0XHR9XG5cdH1cbn1cbmxldCBmYW5wYWdlID0gW107XG5sZXQgZ3JvdXAgPSBbXTtcbmxldCBzaG9ydGN1dCA9IFtdO1xubGV0IGxhc3RfY29tbWFuZCA9IHt9O1xubGV0IHVybCA9IHtcblx0c2VuZDogKHRhciwgY29tbWFuZCk9Pntcblx0XHRsZXQgaWQgPSAkKHRhcikucGFyZW50KCkuc2libGluZ3MoJ3AnKS5maW5kKCdpbnB1dCcpLnZhbCgpO1xuXHRcdHN0ZXAuc3RlcDMoaWQsIGNvbW1hbmQpO1xuXHR9XG59XG5sZXQgc3RlcCA9IHtcblx0c3RlcDE6ICgpPT57XG5cdFx0JCgnLmxvZ2luJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcblx0XHRGQi5hcGkoJ3YyLjgvbWUvYWNjb3VudHMnLCAocmVzKT0+e1xuXHRcdFx0Y29uZmlnLnBhZ2VUb2tlbnMgPSByZXMuZGF0YTtcblx0XHRcdGZvcihsZXQgaSBvZiByZXMuZGF0YSl7XG5cdFx0XHRcdGZhbnBhZ2UucHVzaChpKTtcblx0XHRcdFx0JChcIiNzZWxlY3RcIikucHJlcGVuZChgPG9wdGlvbiBkYXRhLXR5cGU9XCJwb3N0c1wiIHZhbHVlPVwiJHtpLmlkfVwiPiR7aS5uYW1lfTwvb3B0aW9uPmApO1xuXHRcdFx0XHRGQi5hcGkoYHYyLjgvJHtpLmlkfS9wb3N0c2AsIChyZXMyKT0+e1xuXHRcdFx0XHRcdGZvcihsZXQgaiBvZiByZXMyLmRhdGEpe1xuXHRcdFx0XHRcdFx0aWYoai5tZXNzYWdlICYmIGoubWVzc2FnZS5pbmRleE9mKCfmir3njY4nKSA+PTApe1xuXHRcdFx0XHRcdFx0XHRsZXQgbWVzcyA9IGoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKTtcblx0XHRcdFx0XHRcdFx0JCgnLnN0ZXAxIC5jYXJkcycpLmFwcGVuZChgXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhcmRcIiBkYXRhLWZiaWQ9XCIke2ouaWR9XCI+XG5cdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJ0aXRsZVwiPiR7aS5uYW1lfTwvcD5cblx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cIm1lc3NhZ2VcIiBvbmNsaWNrPVwiY2FyZC5zaG93KHRoaXMpXCI+JHttZXNzfTwvcD5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJlYWN0aW9uc1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3JlYWN0aW9ucycpXCI+6K6aPC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbW1lbnRzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnY29tbWVudHMnKVwiPueVmeiogDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzaGFyZWRwb3N0c1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3NoYXJlZHBvc3RzJylcIj7liIbkuqs8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdEZCLmFwaSgndjIuOC9tZS9ncm91cHMnLCAocmVzKT0+e1xuXHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0Z3JvdXAucHVzaChpKTtcblx0XHRcdFx0JChcIiNzZWxlY3RcIikucHJlcGVuZChgPG9wdGlvbiBkYXRhLXR5cGU9XCJmZWVkXCIgdmFsdWU9XCIke2kuaWR9XCI+JHtpLm5hbWV9PC9vcHRpb24+YCk7XG5cdFx0XHRcdEZCLmFwaShgdjIuOC8ke2kuaWR9L2ZlZWQ/ZmllbGRzPWZyb20sbWVzc2FnZSxpZGAsIChyZXMyKT0+e1xuXHRcdFx0XHRcdGZvcihsZXQgaiBvZiByZXMyLmRhdGEpe1xuXHRcdFx0XHRcdFx0aWYoai5tZXNzYWdlICYmIGoubWVzc2FnZS5pbmRleE9mKCfmir3njY4nKSA+PTAgJiYgai5mcm9tLmlkKXtcblx0XHRcdFx0XHRcdFx0bGV0IG1lc3MgPSBqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIik7XG5cdFx0XHRcdFx0XHRcdCQoJy5zdGVwMSAuY2FyZHMnKS5hcHBlbmQoYFxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkXCIgZGF0YS1mYmlkPVwiJHtqLmlkfVwiPlxuXHRcdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwidGl0bGVcIj4ke2kubmFtZX08L3A+XG5cdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCI+JHttZXNzfTwvcD5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJlYWN0aW9uc1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3JlYWN0aW9ucycpXCI+6K6aPC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbW1lbnRzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnY29tbWVudHMnKVwiPueVmeiogDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzaGFyZWRwb3N0c1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3NoYXJlZHBvc3RzJylcIj7liIbkuqs8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHRgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdEZCLmFwaSgndjIuOC9tZScsIChyZXMpPT57XG5cdFx0XHQkKFwiI3NlbGVjdFwiKS5wcmVwZW5kKGA8b3B0aW9uIGRhdGEtdHlwZT1cInBvc3RzXCIgdmFsdWU9XCIke3Jlcy5pZH1cIj4ke3Jlcy5uYW1lfTwvb3B0aW9uPmApO1xuXHRcdFx0RkIuYXBpKGB2Mi44L21lL3Bvc3RzYCwgKHJlczIpPT57XG5cdFx0XHRcdGZvcihsZXQgaiBvZiByZXMyLmRhdGEpe1xuXHRcdFx0XHRcdGlmKGoubWVzc2FnZSAmJiBqLm1lc3NhZ2UuaW5kZXhPZign5oq9542OJykgPj0wKXtcblx0XHRcdFx0XHRcdGxldCBtZXNzID0gai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpO1xuXHRcdFx0XHRcdFx0JCgnLnN0ZXAxIC5jYXJkcycpLmFwcGVuZChgXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkXCIgZGF0YS1mYmlkPVwiJHtqLmlkfVwiPlxuXHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cInRpdGxlXCI+JHtyZXMubmFtZX08L3A+XG5cdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwibWVzc2FnZVwiIG9uY2xpY2s9XCJjYXJkLnNob3codGhpcylcIj4ke21lc3N9PC9wPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyZWFjdGlvbnNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdyZWFjdGlvbnMnKVwiPuiumjwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29tbWVudHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdjb21tZW50cycpXCI+55WZ6KiAPC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzaGFyZWRwb3N0c1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3NoYXJlZHBvc3RzJylcIj7liIbkuqs8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRzdGVwMjogKHBhZ2UpPT57XG5cdFx0JCgnLnN0ZXAyJykuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcblx0XHQkKCcuc3RlcDIgLmNhcmRzJykuaHRtbChcIlwiKTtcblx0XHQkKCcuc3RlcDIgLmhlYWQgc3BhbicpLnRleHQocGFnZS5uYW1lKTtcblx0XHRkYXRhLnBhZ2VpZCA9IHBhZ2UuaWQ7XG5cdFx0bGV0IGNvbW1hbmQgPSBwYWdlLnR5cGU7XG5cdFx0RkIuYXBpKGB2Mi44LyR7cGFnZS5pZH0vJHtjb21tYW5kfWAsIChyZXMpPT57XG5cdFx0XHRmb3IobGV0IGogb2YgcmVzLmRhdGEpe1xuXHRcdFx0XHRsZXQgbWVzcyA9IGoubWVzc2FnZSA/IGoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKSA6IFwiXCI7XG5cdFx0XHRcdCQoJy5zdGVwMiAuY2FyZHMnKS5hcHBlbmQoYFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkXCIgZGF0YS1mYmlkPVwiJHtqLmlkfVwiPlxuXHRcdFx0XHRcdDxwIGNsYXNzPVwibWVzc2FnZVwiIG9uY2xpY2s9XCJjYXJkLnNob3codGhpcylcIj4ke21lc3N9PC9wPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJhY3Rpb25cIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVhY3Rpb25zXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAncmVhY3Rpb25zJylcIj7orpo8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29tbWVudHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdjb21tZW50cycpXCI+55WZ6KiAPC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNoYXJlZHBvc3RzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnc2hhcmVkcG9zdHMnKVwiPuWIhuS6qzwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdGApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHRzdGVwMnRvMTogKCk9Pntcblx0XHQkKCcjc2VsZWN0JykudmFsKDApO1xuXHRcdCQoJy5zdGVwMicpLnJlbW92ZUNsYXNzKCd2aXNpYmxlJyk7XG5cdH0sXG5cdHN0ZXAzaGlkZTogKCk9Pntcblx0XHQkKFwiI2F3YXJkTGlzdFwiKS5oaWRlKCk7XG5cdFx0JCgnLnN0ZXAzJykucmVtb3ZlQ2xhc3MoJ3Zpc2libGUnKTtcblx0fSxcblx0c3RlcDM6IChmYmlkLCBjb21tYW5kKT0+e1xuXHRcdGxhc3RfY29tbWFuZCA9IHtmYmlkLGNvbW1hbmR9O1xuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IG5vd0RhdGUoKTtcblx0XHQkKCcuc3RlcDMnKS5hZGRDbGFzcygndmlzaWJsZScpO1xuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcblx0XHQkKCcubG9hZGluZy53YWl0aW5nJykuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcblx0XHRkYXRhLnJhdyA9IFtdO1xuXHRcdGRhdGEuZmlsdGVyZWQgPSBbXTtcblx0XHRkYXRhLmNvbW1hbmQgPSBjb21tYW5kO1xuXHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcblx0XHRcdCQoJy5vcHRpb25GaWx0ZXIgLnJlYWN0JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcblx0XHRcdCQoJy5vcHRpb25GaWx0ZXIgLnRpbWVsaW1pdCcpLmFkZENsYXNzKCdoaWRlJyk7XG5cdFx0fVxuXHRcdGxldCB0b2tlbiA9ICcnO1xuXHRcdGZvcihsZXQgaSBvZiBjb25maWcucGFnZVRva2Vucyl7XG5cdFx0XHRpZiAoaS5pZCA9PSBkYXRhLnBhZ2VpZCl7XG5cdFx0XHRcdHRva2VuID0gaS5hY2Nlc3NfdG9rZW47XG5cdFx0XHR9XG5cdFx0fVxuXHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbltjb21tYW5kXX0vJHtmYmlkfS8ke2NvbW1hbmR9P2FjY2Vzc190b2tlbj0ke3Rva2VufWAsIChyZXMpPT57XG5cdFx0XHRjb25zb2xlLmxvZyhyZXMpO1xuXHRcdFx0ZGF0YS5sZW5ndGggPSByZXMuZGF0YS5sZW5ndGg7XG5cdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xuXHRcdFx0XHRpZiAoZC5pZCl7XG5cdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcblx0XHRcdFx0XHRcdGRhdGEucmF3LnB1c2goZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xuXHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0ZmlsdGVyLnRvdGFsRmlsdGVyKGRhdGEucmF3LCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwpe1xuXHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcblx0XHRcdFx0ZGF0YS5sZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLmxlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcblx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0XHRpZiAoZC5pZCl7XG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xuXHRcdFx0XHRcdFx0XHRkYXRhLnJhdy5wdXNoKGQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0ZmlsdGVyLnRvdGFsRmlsdGVyKGRhdGEucmF3LCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KS5mYWlsKCgpPT57XG5cdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59XG5cbmxldCBjYXJkID0ge1xuXHRzaG93OiAoZSk9Pntcblx0XHRpZiAoJChlKS5oYXNDbGFzcygndmlzaWJsZScpKXtcblx0XHRcdCQoZSkucmVtb3ZlQ2xhc3MoJ3Zpc2libGUnKTtcblx0XHR9ZWxzZXtcblx0XHRcdCQoZSkuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcblx0XHR9XG5cdH1cbn1cblxubGV0IGRhdGEgPSB7XG5cdHJhdzogW10sXG5cdGZpbHRlcmVkOiBbXSxcblx0Y29tbWFuZDogJycsXG5cdGxlbmd0aDogMCxcblx0cGFnZWlkOiAnJ1xufVxuXG5sZXQgdGFibGUgPSB7XG5cdGdlbmVyYXRlOiAoKT0+e1xuXHRcdCQoJy5sb2FkaW5nLndhaXRpbmcnKS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XG5cdFx0bGV0IGZpbHRlcmRhdGEgPSBkYXRhLmZpbHRlcmVkO1xuXHRcdGxldCB0aGVhZCA9ICcnO1xuXHRcdGxldCB0Ym9keSA9ICcnO1xuXHRcdGlmKGRhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cblx0XHRcdDx0ZD7ooajmg4U8L3RkPmA7XG5cdFx0fWVsc2V7XG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cblx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XG5cdFx0fVxuXG5cdFx0bGV0IGhvc3QgPSAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJztcblxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZGF0YS5lbnRyaWVzKCkpe1xuXHRcdFx0bGV0IHRkID0gYDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7aisxfTwvYT48L3RkPlxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcblx0XHRcdGlmKGRhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcblx0XHRcdH1cblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XG5cdFx0XHR0Ym9keSArPSB0cjtcblx0XHR9XG5cdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcblxuXG5cdFx0YWN0aXZlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoe1xuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMzAwLFxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxuXHRcdFx0fSk7XG5cblx0XHRcdCQoXCIjc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0YWJsZVxuXHRcdFx0XHQuY29sdW1ucygxKVxuXHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXG5cdFx0XHRcdC5kcmF3KCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cdHJlZG86ICgpPT57XG5cdFx0ZmlsdGVyLnRvdGFsRmlsdGVyKGRhdGEucmF3LCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xuXHR9XG59XG5cbmxldCBjaG9vc2UgPSB7XG5cdGRhdGE6IFtdLFxuXHRhd2FyZDogW10sXG5cdG51bTogMCxcblx0ZGV0YWlsOiBmYWxzZSxcblx0bGlzdDogW10sXG5cdGluaXQ6ICgpPT57XG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcblx0XHRjaG9vc2UuYXdhcmQgPSBbXTtcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xuXHRcdGNob29zZS5udW0gPSAwO1xuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xuXHRcdFx0XHRpZiAobiA+IDApe1xuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XCJuYW1lXCI6cCwgXCJudW1cIjogbn0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XG5cdFx0fVxuXHRcdGNob29zZS5nbygpO1xuXHR9LFxuXHRnbzogKCk9Pntcblx0XHRsZXQgbnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xuXHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGRhdGEuZmlsdGVyZWQubGVuZ3RoKS5zcGxpY2UoMCxudW0pO1xuXHRcdGxldCBpbnNlcnQgPSAnJztcblx0XHRmb3IobGV0IGkgb2YgY2hvb3NlLmF3YXJkKXtcblx0XHRcdGluc2VydCArPSAnPHRyPicgKyAkKCcubWFpbl90YWJsZScpLkRhdGFUYWJsZSgpLnJvd3Moe3NlYXJjaDonYXBwbGllZCd9KS5ub2RlcygpW2ldLmlubmVySFRNTCArICc8L3RyPic7XG5cdFx0fVxuXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcblxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcblx0fVxufVxuXG5sZXQgZmJpZCA9IHtcblx0ZmJpZDogW10sXG5cdGluaXQ6ICh0eXBlKT0+e1xuXHRcdGZiaWQuZmJpZCA9IFtdO1xuXHRcdGRhdGEuaW5pdCgpO1xuXHRcdEZCLmFwaShcIi9tZVwiLGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRkYXRhLnVzZXJpZCA9IHJlcy5pZDtcblx0XHRcdGxldCB1cmwgPSBmYmlkLmZvcm1hdCgkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcblx0XHRcdGZiaWQuZ2V0KHVybCwgdHlwZSkudGhlbigoZmJpZCk9Pntcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcblx0XHRcdH0pXG5cdFx0XHQkKCcuaWRlbnRpdHknKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoYOeZu+WFpei6q+S7ve+8mjxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Jlcy5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PHNwYW4+JHtyZXMubmFtZX08L3NwYW4+YClcblx0XHR9KTtcblx0fSxcblx0Z2V0OiAodXJsLCB0eXBlKT0+e1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuXHRcdFx0aWYgKHR5cGUgPT0gJ3VybF9jb21tZW50cycpe1xuXHRcdFx0XHRsZXQgcG9zdHVybCA9IHVybDtcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIj9cIikgPiAwKXtcblx0XHRcdFx0XHRwb3N0dXJsID0gcG9zdHVybC5zdWJzdHJpbmcoMCxwb3N0dXJsLmluZGV4T2YoXCI/XCIpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRGQi5hcGkoYC8ke3Bvc3R1cmx9YCxmdW5jdGlvbihyZXMpe1xuXHRcdFx0XHRcdGxldCBvYmogPSB7ZnVsbElEOiByZXMub2dfb2JqZWN0LmlkLCB0eXBlOiB0eXBlLCBjb21tYW5kOiAnY29tbWVudHMnfTtcblx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XG5cdFx0XHRcdGxldCByZXN1bHQgPSB1cmwubWF0Y2gocmVnZXgpO1xuXHRcdFx0XHRsZXQgdXJsdHlwZSA9IGZiaWQuY2hlY2tUeXBlKHVybCk7XG5cdFx0XHRcdGZiaWQuY2hlY2tQYWdlSUQodXJsLCB1cmx0eXBlKS50aGVuKChpZCk9Pntcblx0XHRcdFx0XHRpZiAoaWQgPT09ICdwZXJzb25hbCcpe1xuXHRcdFx0XHRcdFx0dXJsdHlwZSA9ICdwZXJzb25hbCc7XG5cdFx0XHRcdFx0XHRpZCA9IGRhdGEudXNlcmlkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsZXQgb2JqID0ge3BhZ2VJRDogaWQsIHR5cGU6IHVybHR5cGUsIGNvbW1hbmQ6IHR5cGV9O1xuXHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAncGVyc29uYWwnKXtcblx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdmYmlkPScpO1xuXHRcdFx0XHRcdFx0aWYoc3RhcnQgPj0gMCl7XG5cdFx0XHRcdFx0XHRcdGxldCBlbmQgPSB1cmwuaW5kZXhPZihcIiZcIixzdGFydCk7XG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0KzUsZW5kKTtcblx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZigncG9zdHMvJyk7XG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0KzYsdXJsLmxlbmd0aCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdFx0fWVsc2UgaWYgKHVybHR5cGUgPT09ICdwdXJlJyl7XG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gdXJsLnJlcGxhY2UoL1xcXCIvZywnJyk7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ2V2ZW50Jyl7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEpe1xuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3miYDmnInnlZnoqIBcblx0XHRcdFx0XHRcdFx0XHRvYmouY29tbWFuZCA9ICdmZWVkJztcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gcmVzdWx0WzBdO1xuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcdFxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQvL+aKk0VWRU5U5Lit5p+Q56+H55WZ6KiA55qE55WZ6KiAXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFsxXTtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1lbHNlIGlmICh1cmx0eXBlID09PSAnZ3JvdXAnKXtcblx0XHRcdFx0XHRcdFx0aWYgKGZiLnVzZXJfcG9zdHMpe1xuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXTtcblx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0WzBdO1xuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgXCJfXCIgK29iai5wdXJlSUQ7XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRzd2FsKHtcblx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiAn56S+5ZyY5L2/55So6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5ZyYJyxcblx0XHRcdFx0XHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+Jyxcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xuXHRcdFx0XHRcdFx0XHRcdH0pLmRvbmUoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEgfHwgcmVzdWx0Lmxlbmd0aCA9PSAzKXtcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAndW5uYW1lJyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0Y2hlY2tUeXBlOiAocG9zdHVybCk9Pntcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZmJpZD1cIikgPj0gMCl7XG5cdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdwZXJtYWxpbmsnKSA+PSAwKXtcblx0XHRcdFx0cmV0dXJuICd1bm5hbWUnO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHJldHVybiAncGVyc29uYWwnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9ncm91cHMvXCIpID49IDApe1xuXHRcdFx0cmV0dXJuICdncm91cCc7XG5cdFx0fTtcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZXZlbnRzXCIpID49IDApe1xuXHRcdFx0cmV0dXJuICdldmVudCc7XG5cdFx0fTtcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdcIicpID49IDApe1xuXHRcdFx0cmV0dXJuICdwdXJlJztcblx0XHR9O1xuXHRcdHJldHVybiAnbm9ybWFsJztcblx0fSxcblx0Y2hlY2tQYWdlSUQ6IChwb3N0dXJsLCB0eXBlKT0+e1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuXHRcdFx0bGV0IHN0YXJ0ID0gcG9zdHVybC5pbmRleE9mKFwiZmFjZWJvb2suY29tXCIpKzEzO1xuXHRcdFx0bGV0IGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIixzdGFydCk7XG5cdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xuXHRcdFx0aWYgKGVuZCA8IDApe1xuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdmYmlkPScpID49IDApe1xuXHRcdFx0XHRcdGlmICh0eXBlID09PSAndW5uYW1lJyl7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKCd1bm5hbWUnKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRyZXNvbHZlKHBvc3R1cmwubWF0Y2gocmVnZXgpWzFdKTtcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGxldCBncm91cCA9IHBvc3R1cmwuaW5kZXhPZignL2dyb3Vwcy8nKTtcblx0XHRcdFx0bGV0IGV2ZW50ID0gcG9zdHVybC5pbmRleE9mKCcvZXZlbnRzLycpXG5cdFx0XHRcdGlmIChncm91cCA+PSAwKXtcblx0XHRcdFx0XHRzdGFydCA9IGdyb3VwKzg7XG5cdFx0XHRcdFx0ZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLHN0YXJ0KTtcblx0XHRcdFx0XHRsZXQgcmVnZXgyID0gL1xcZHs2LH0vZztcblx0XHRcdFx0XHRsZXQgdGVtcCA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LGVuZCk7XG5cdFx0XHRcdFx0aWYgKHJlZ2V4Mi50ZXN0KHRlbXApKXtcblx0XHRcdFx0XHRcdHJlc29sdmUodGVtcCk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdncm91cCcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fWVsc2UgaWYoZXZlbnQgPj0gMCl7XG5cdFx0XHRcdFx0cmVzb2x2ZSgnZXZlbnQnKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0dmFyIHBhZ2VuYW1lID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsZW5kKTtcblx0XHRcdFx0XHRGQi5hcGkoYC8ke3BhZ2VuYW1lfWAsZnVuY3Rpb24ocmVzKXtcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3Ipe1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xuXHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUocmVzLmlkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHRmb3JtYXQ6ICh1cmwpPT57XG5cdFx0aWYgKHVybC5pbmRleE9mKCdidXNpbmVzcy5mYWNlYm9vay5jb20vJykgPj0gMCl7XG5cdFx0XHR1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKFwiP1wiKSk7XG5cdFx0XHRyZXR1cm4gdXJsO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIHVybDtcblx0XHR9XG5cdH1cbn1cblxubGV0IGZpbHRlciA9IHtcblx0dG90YWxGaWx0ZXI6IChyYXdkYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBlbmRUaW1lKT0+e1xuXHRcdGxldCBkID0gcmF3ZGF0YTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpe1xuXHRcdFx0ZCA9IGZpbHRlci51bmlxdWUoZCk7XG5cdFx0fVxuXHRcdGlmICh3b3JkICE9PSAnJyl7XG5cdFx0XHRkID0gZmlsdGVyLndvcmQoZCwgd29yZCk7XG5cdFx0fVxuXHRcdGlmIChpc1RhZyl7XG5cdFx0XHRkID0gZmlsdGVyLnRhZyhkKTtcblx0XHR9XG5cdFx0aWYgKGRhdGEuY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0ZCA9IGZpbHRlci50aW1lKGQsIGVuZFRpbWUpO1xuXHRcdH1lbHNle1xuXHRcdFx0ZCA9IGZpbHRlci5yZWFjdChkLCByZWFjdCk7XG5cdFx0fVxuXHRcdGRhdGEuZmlsdGVyZWQgPSBkO1xuXHRcdHRhYmxlLmdlbmVyYXRlKCk7XG5cdH0sXG5cdHVuaXF1ZTogKGRhdGEpPT57XG5cdFx0bGV0IG91dHB1dCA9IFtdO1xuXHRcdGxldCBrZXlzID0gW107XG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH0sXG5cdHdvcmQ6IChkYXRhLCB3b3JkKT0+e1xuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0dGFnOiAoZGF0YSk9Pntcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3Mpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gbmV3QXJ5O1xuXHR9LFxuXHR0aW1lOiAoZGF0YSwgdCk9Pntcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcblx0XHRsZXQgdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwocGFyc2VJbnQodGltZV9hcnlbMV0pLTEpLHRpbWVfYXJ5WzJdLHRpbWVfYXJ5WzNdLHRpbWVfYXJ5WzRdLHRpbWVfYXJ5WzVdKSkuX2Q7XG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XG5cdFx0aWYgKHRhciA9PSAnYWxsJyl7XG5cdFx0XHRyZXR1cm4gZGF0YTtcblx0XHR9ZWxzZXtcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuZXdBcnk7XG5cdFx0fVxuXHR9XG59XG5cbmxldCB1aSA9IHtcblx0aW5pdDogKCk9PntcblxuXHR9LFxuXHRyZXNldDogKCk9Pntcblx0XHRsZXQgY29tbWFuZCA9IGRhdGEucmF3LmNvbW1hbmQ7XG5cdFx0aWYgKGNvbW1hbmQgPT09ICdyZWFjdGlvbnMnKXtcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdFx0fWVsc2V7XG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5hZGRDbGFzcygnaGlkZScpO1xuXHRcdH1cblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJyl7XG5cdFx0XHQkKCdsYWJlbC50YWcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuXHRcdH1lbHNle1xuXHRcdFx0aWYgKCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKXtcblx0XHRcdFx0JChcIiN0YWdcIikuY2xpY2soKTtcblx0XHRcdH1cblx0XHRcdCQoJ2xhYmVsLnRhZycpLmFkZENsYXNzKCdoaWRlJyk7XG5cdFx0fVxuXHR9XG59XG5cblxuXG5cbmZ1bmN0aW9uIG5vd0RhdGUoKXtcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpKzE7XG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XG59XG5cbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xuXHQgdmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xuIFx0IHZhciBtb250aHMgPSBbJzAxJywnMDInLCcwMycsJzA0JywnMDUnLCcwNicsJzA3JywnMDgnLCcwOScsJzEwJywnMTEnLCcxMiddO1xuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcbiAgICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XG4gICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XG4gICAgIGlmIChkYXRlIDwgMTApe1xuICAgICBcdGRhdGUgPSBcIjBcIitkYXRlO1xuICAgICB9XG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xuICAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XG4gICAgIGlmIChtaW4gPCAxMCl7XG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xuICAgICB9XG4gICAgIHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcbiAgICAgaWYgKHNlYyA8IDEwKXtcbiAgICAgXHRzZWMgPSBcIjBcIitzZWM7XG4gICAgIH1cbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XG4gICAgIHJldHVybiB0aW1lO1xuIH1cblxuIGZ1bmN0aW9uIG9iajJBcnJheShvYmope1xuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XG4gXHR9KTtcbiBcdHJldHVybiBhcnJheTtcbiB9XG5cbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XG4gXHR2YXIgaSwgciwgdDtcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xuIFx0XHRhcnlbaV0gPSBpO1xuIFx0fVxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcbiBcdFx0dCA9IGFyeVtyXTtcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xuIFx0XHRhcnlbaV0gPSB0O1xuIFx0fVxuIFx0cmV0dXJuIGFyeTtcbiB9XG4iXX0=
