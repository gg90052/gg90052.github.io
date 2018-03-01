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
	auth: 'user_photos,user_posts,user_managed_groups,manage_pages'
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW5fbS5qcyJdLCJuYW1lcyI6WyJlcnJvck1lc3NhZ2UiLCJ3aW5kb3ciLCJvbmVycm9yIiwiaGFuZGxlRXJyIiwibXNnIiwidXJsIiwibCIsIiQiLCJ0ZXh0IiwiSlNPTiIsInN0cmluZ2lmeSIsImxhc3RfY29tbWFuZCIsImNvbnNvbGUiLCJsb2ciLCJ2YWwiLCJmYWRlSW4iLCJkb2N1bWVudCIsInJlYWR5IiwiY2xpY2siLCJmYiIsImdldEF1dGgiLCJjaGFuZ2UiLCJpZCIsIm5hbWUiLCJmaW5kIiwidHlwZSIsImF0dHIiLCJwYWdlIiwic3RlcCIsInN0ZXAyIiwiZSIsImNob29zZSIsImluaXQiLCJoYXNDbGFzcyIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJhcHBlbmQiLCJvbiIsImNvbmZpZyIsImZpbHRlciIsImlzRHVwbGljYXRlIiwicHJvcCIsInRhYmxlIiwicmVkbyIsImRhdGVEcm9wcGVyIiwicmVhY3QiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJpc1RhZyIsIndvcmQiLCJlbmRUaW1lIiwibm93RGF0ZSIsImF1dGgiLCJ1c2VyX3Bvc3RzIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzdGVwMSIsImFsZXJ0Iiwic3RlcDMiLCJmYW5wYWdlIiwic2hvcnRjdXQiLCJzZW5kIiwidGFyIiwiY29tbWFuZCIsInBhcmVudCIsInNpYmxpbmdzIiwiYXBpIiwicmVzIiwiaSIsInB1c2giLCJwcmVwZW5kIiwicmVzMiIsImRhdGEiLCJqIiwibWVzc2FnZSIsIm1lc3MiLCJyZXBsYWNlIiwiZnJvbSIsImh0bWwiLCJzdGVwMnRvMSIsInN0ZXAzaGlkZSIsImhpZGUiLCJmYmlkIiwicmF3IiwiZmlsdGVyZWQiLCJsZW5ndGgiLCJkIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImdldEpTT04iLCJmYWlsIiwiY2FyZCIsInNob3ciLCJnZW5lcmF0ZSIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJmaWx0ZXJkYXRhIiwidGhlYWQiLCJ0Ym9keSIsImhvc3QiLCJlbnRyaWVzIiwidGQiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwic2VhcmNoIiwidmFsdWUiLCJkcmF3IiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwiZWFjaCIsIm4iLCJwYXJzZUludCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwicm93cyIsIm5vZGVzIiwiaW5uZXJIVE1MIiwidXNlcmlkIiwiZm9ybWF0IiwiZ2V0IiwidGhlbiIsInN0YXJ0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwb3N0dXJsIiwic3Vic3RyaW5nIiwib2JqIiwiZnVsbElEIiwib2dfb2JqZWN0IiwicmVnZXgiLCJyZXN1bHQiLCJtYXRjaCIsInVybHR5cGUiLCJjaGVja1R5cGUiLCJjaGVja1BhZ2VJRCIsInBhZ2VJRCIsImVuZCIsInB1cmVJRCIsInN3YWwiLCJ0aXRsZSIsImRvbmUiLCJldmVudCIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJlcnJvciIsInJhd2RhdGEiLCJ1bmlxdWUiLCJ0YWciLCJ0aW1lIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsInNwbGl0IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwidWkiLCJyZXNldCIsImEiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJtYXAiLCJpbmRleCIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0NDLEdBQUUsaUJBQUYsRUFBcUJDLElBQXJCLENBQTZCQyxLQUFLQyxTQUFMLENBQWVDLFlBQWYsQ0FBN0I7QUFDQSxLQUFJLENBQUNYLFlBQUwsRUFBa0I7QUFDakJZLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUQsVUFBUUMsR0FBUixDQUFZLHNCQUFzQk4sRUFBRSxnQkFBRixFQUFvQk8sR0FBcEIsRUFBbEM7QUFDQVAsSUFBRSxpQkFBRixFQUFxQlEsTUFBckI7QUFDQWYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRE8sRUFBRVMsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDM0JWLEdBQUUsWUFBRixFQUFnQlcsS0FBaEIsQ0FBc0IsWUFBVTtBQUMvQkMsS0FBR0MsT0FBSCxDQUFXLE9BQVg7QUFDQSxFQUZEO0FBR0FiLEdBQUUsU0FBRixFQUFhYyxNQUFiLENBQW9CLFlBQVU7QUFDN0IsTUFBSUMsS0FBS2YsRUFBRSxJQUFGLEVBQVFPLEdBQVIsRUFBVDtBQUNBLE1BQUlTLE9BQU9oQixFQUFFLElBQUYsRUFBUWlCLElBQVIsQ0FBYSxpQkFBYixFQUFnQ2hCLElBQWhDLEVBQVg7QUFDQSxNQUFJaUIsT0FBT2xCLEVBQUUsSUFBRixFQUFRaUIsSUFBUixDQUFhLGlCQUFiLEVBQWdDRSxJQUFoQyxDQUFxQyxX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LEVBQVY7QUFDQSxLQUFJbEksQ0FBSixFQUFPbUksQ0FBUCxFQUFVNUIsQ0FBVjtBQUNBLE1BQUt2RyxJQUFJLENBQVQsRUFBYUEsSUFBSW1ELENBQWpCLEVBQXFCLEVBQUVuRCxDQUF2QixFQUEwQjtBQUN6QmlJLE1BQUlqSSxDQUFKLElBQVNBLENBQVQ7QUFDQTtBQUNELE1BQUtBLElBQUksQ0FBVCxFQUFhQSxJQUFJbUQsQ0FBakIsRUFBcUIsRUFBRW5ELENBQXZCLEVBQTBCO0FBQ3pCbUksTUFBSUMsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLEtBQWdCbkYsQ0FBM0IsQ0FBSjtBQUNBb0QsTUFBSTBCLElBQUlFLENBQUosQ0FBSjtBQUNBRixNQUFJRSxDQUFKLElBQVNGLElBQUlqSSxDQUFKLENBQVQ7QUFDQWlJLE1BQUlqSSxDQUFKLElBQVN1RyxDQUFUO0FBQ0E7QUFDRCxRQUFPMEIsR0FBUDtBQUNBIiwiZmlsZSI6Im1haW5fbS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcbndpbmRvdy5vbmVycm9yPWhhbmRsZUVyclxuXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxue1xuXHQkKCcuY29uc29sZSAuZXJyb3InKS50ZXh0KGAke0pTT04uc3RyaW5naWZ5KGxhc3RfY29tbWFuZCl9IOeZvOeUn+mMr+iqpO+8jOiri+aIquWclumAmuefpeeuoeeQhuWToWApO1xuXHRpZiAoIWVycm9yTWVzc2FnZSl7XG5cdFx0Y29uc29sZS5sb2coXCIlY+eZvOeUn+mMr+iqpO+8jOiri+Wwh+WujOaVtOmMr+iqpOioiuaBr+aIquWcluWCs+mAgee1pueuoeeQhuWToe+8jOS4pumZhOS4iuS9oOi8uOWFpeeahOe2suWdgFwiLFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XG5cdFx0Y29uc29sZS5sb2coXCJFcnJvciBvY2N1ciBVUkzvvJogXCIgKyAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xuXHRcdGVycm9yTWVzc2FnZSA9IHRydWU7XHRcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHQkKFwiI2J0bl9sb2dpblwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGZiLmdldEF1dGgoJ2xvZ2luJyk7XG5cdH0pO1xuXHQkKCcjc2VsZWN0JykuY2hhbmdlKGZ1bmN0aW9uKCl7XG5cdFx0bGV0IGlkID0gJCh0aGlzKS52YWwoKTtcblx0XHRsZXQgbmFtZSA9ICQodGhpcykuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS50ZXh0KCk7XG5cdFx0bGV0IHR5cGUgPSAkKHRoaXMpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikuYXR0cignZGF0YS10eXBlJyk7XG5cdFx0bGV0IHBhZ2UgPSB7aWQsbmFtZSx0eXBlfTtcblx0XHRpZiAocGFnZS5pZCAhPT0gJzAnKXtcblx0XHRcdHN0ZXAuc3RlcDIocGFnZSk7XG5cdFx0fVxuXHR9KTtcblxuXG5cdCQoXCIjYnRuX2NvbW1lbnRzXCIpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XG5cdH0pO1xuXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRmYi5nZXRBdXRoKCdyZWFjdGlvbnMnKTtcblx0fSk7XG5cblx0JChcIiNidG5fcGF5XCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0ZmIuZ2V0QXV0aCgnYWRkU2NvcGUnKTtcblx0fSk7XG5cdCQoXCIjYnRuX2Nob29zZVwiKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGNob29zZS5pbml0KCk7XG5cdH0pO1xuXHRcblxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG5cdFx0fWVsc2V7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuXHRcdH1cblx0fSk7XG5cblx0JChcIiNidG5fYWRkUHJpemVcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj5gKTtcblx0fSk7XG5cblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcblx0XHRjb25maWcuZmlsdGVyLmlzRHVwbGljYXRlID0gJChcIiN1bmlxdWVcIikucHJvcChcImNoZWNrZWRcIik7XG5cdFx0dGFibGUucmVkbygpO1xuXHR9KTtcblxuXHQkKCcub3B0aW9uRmlsdGVyIGlucHV0JykuZGF0ZURyb3BwZXIoKTtcblx0JCgnLnBpY2stc3VibWl0Jykub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xuXHRcdC8vIGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9ICQoJy5vcHRpb25GaWx0ZXIgaW5wdXQnKS52YWwoKStcIi0yMy01OS01OVwiO1xuXHRcdC8vIHRhYmxlLnJlZG8oKTtcblx0fSlcblxuXHQkKFwiLnVpcGFuZWwgLnJlYWN0XCIpLmNoYW5nZShmdW5jdGlvbigpe1xuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xuXHRcdHRhYmxlLnJlZG8oKTtcblx0fSk7XG5cbn0pO1xuXG5sZXQgY29uZmlnID0ge1xuXHRmaWVsZDoge1xuXHRcdGNvbW1lbnRzOiBbJ2xpa2VfY291bnQnLCdtZXNzYWdlX3RhZ3MnLCdtZXNzYWdlLGZyb20nLCdjcmVhdGVkX3RpbWUnXSxcblx0XHRyZWFjdGlvbnM6IFtdLFxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcblx0XHR1cmxfY29tbWVudHM6IFtdLFxuXHRcdGZlZWQ6IFtdXG5cdH0sXG5cdGxpbWl0OiB7XG5cdFx0Y29tbWVudHM6ICc1MDAnLFxuXHRcdHJlYWN0aW9uczogJzUwMCcsXG5cdFx0c2hhcmVkcG9zdHM6ICc1MDAnLFxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXG5cdFx0ZmVlZDogJzUwMCdcblx0fSxcblx0YXBpVmVyc2lvbjoge1xuXHRcdGNvbW1lbnRzOiAndjIuOCcsXG5cdFx0cmVhY3Rpb25zOiAndjIuOCcsXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi4zJyxcblx0XHR1cmxfY29tbWVudHM6ICd2Mi44Jyxcblx0XHRmZWVkOiAndjIuMycsXG5cdFx0Z3JvdXA6ICd2Mi44J1xuXHR9LFxuXHRmaWx0ZXI6IHtcblx0XHRpc0R1cGxpY2F0ZTogdHJ1ZSxcblx0XHRpc1RhZzogZmFsc2UsXG5cdFx0d29yZDogJycsXG5cdFx0cmVhY3Q6ICdhbGwnLFxuXHRcdGVuZFRpbWU6IG5vd0RhdGUoKVxuXHR9LFxuXHRhdXRoOiAndXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX21hbmFnZWRfZ3JvdXBzLG1hbmFnZV9wYWdlcydcbn1cblxubGV0IGZiID0ge1xuXHR1c2VyX3Bvc3RzOiBmYWxzZSxcblx0Z2V0QXV0aDogKHR5cGUpPT57XG5cdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlLCB0eXBlKTtcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcblx0XHR9LCB7c2NvcGU6IGNvbmZpZy5hdXRoICxyZXR1cm5fc2NvcGVzOiB0cnVlfSk7XG5cdH0sXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpPT57XG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcblx0XHRcdGlmICh0eXBlID09IFwibG9naW5cIil7XG5cdFx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XG5cdFx0XHRcdGlmIChhdXRoU3RyLmluZGV4T2YoJ21hbmFnZV9wYWdlcycpID49IDAgJiYgYXV0aFN0ci5pbmRleE9mKCd1c2VyX21hbmFnZWRfZ3JvdXBzJykgPj0gMCAmJiBhdXRoU3RyLmluZGV4T2YoJ3VzZXJfcG9zdHMnKSA+PSAwKXtcblx0XHRcdFx0XHRzdGVwLnN0ZXAxKCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGFsZXJ0KCfmspLmnInmrIrpmZDmiJbmjojmrIrkuI3lrozmiJAnKTtcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHN0ZXAuc3RlcDMoKTtcdFx0XHRcblx0XHRcdH1cblx0XHR9ZWxzZXtcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdGZiLmNhbGxiYWNrKHJlc3BvbnNlKTtcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcblx0XHR9XG5cdH1cbn1cbmxldCBmYW5wYWdlID0gW107XG5sZXQgZ3JvdXAgPSBbXTtcbmxldCBzaG9ydGN1dCA9IFtdO1xubGV0IGxhc3RfY29tbWFuZCA9IHt9O1xubGV0IHVybCA9IHtcblx0c2VuZDogKHRhciwgY29tbWFuZCk9Pntcblx0XHRsZXQgaWQgPSAkKHRhcikucGFyZW50KCkuc2libGluZ3MoJ3AnKS5maW5kKCdpbnB1dCcpLnZhbCgpO1xuXHRcdHN0ZXAuc3RlcDMoaWQsIGNvbW1hbmQpO1xuXHR9XG59XG5sZXQgc3RlcCA9IHtcblx0c3RlcDE6ICgpPT57XG5cdFx0JCgnLmxvZ2luJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcblx0XHRGQi5hcGkoJ3YyLjgvbWUvYWNjb3VudHMnLCAocmVzKT0+e1xuXHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0ZmFucGFnZS5wdXNoKGkpO1xuXHRcdFx0XHQkKFwiI3NlbGVjdFwiKS5wcmVwZW5kKGA8b3B0aW9uIGRhdGEtdHlwZT1cInBvc3RzXCIgdmFsdWU9XCIke2kuaWR9XCI+JHtpLm5hbWV9PC9vcHRpb24+YCk7XG5cdFx0XHRcdEZCLmFwaShgdjIuOC8ke2kuaWR9L3Bvc3RzYCwgKHJlczIpPT57XG5cdFx0XHRcdFx0Zm9yKGxldCBqIG9mIHJlczIuZGF0YSl7XG5cdFx0XHRcdFx0XHRpZihqLm1lc3NhZ2UgJiYgai5tZXNzYWdlLmluZGV4T2YoJ+aKveeNjicpID49MCl7XG5cdFx0XHRcdFx0XHRcdGxldCBtZXNzID0gai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpO1xuXHRcdFx0XHRcdFx0XHQkKCcuc3RlcDEgLmNhcmRzJykuYXBwZW5kKGBcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZFwiIGRhdGEtZmJpZD1cIiR7ai5pZH1cIj5cblx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cInRpdGxlXCI+JHtpLm5hbWV9PC9wPlxuXHRcdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwibWVzc2FnZVwiIG9uY2xpY2s9XCJjYXJkLnNob3codGhpcylcIj4ke21lc3N9PC9wPlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJhY3Rpb25cIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVhY3Rpb25zXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAncmVhY3Rpb25zJylcIj7orpo8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29tbWVudHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdjb21tZW50cycpXCI+55WZ6KiAPC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNoYXJlZHBvc3RzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnc2hhcmVkcG9zdHMnKVwiPuWIhuS6qzwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdGApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0RkIuYXBpKCd2Mi44L21lL2dyb3VwcycsIChyZXMpPT57XG5cdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xuXHRcdFx0XHRncm91cC5wdXNoKGkpO1xuXHRcdFx0XHQkKFwiI3NlbGVjdFwiKS5wcmVwZW5kKGA8b3B0aW9uIGRhdGEtdHlwZT1cImZlZWRcIiB2YWx1ZT1cIiR7aS5pZH1cIj4ke2kubmFtZX08L29wdGlvbj5gKTtcblx0XHRcdFx0RkIuYXBpKGB2Mi44LyR7aS5pZH0vZmVlZD9maWVsZHM9ZnJvbSxtZXNzYWdlLGlkYCwgKHJlczIpPT57XG5cdFx0XHRcdFx0Zm9yKGxldCBqIG9mIHJlczIuZGF0YSl7XG5cdFx0XHRcdFx0XHRpZihqLm1lc3NhZ2UgJiYgai5tZXNzYWdlLmluZGV4T2YoJ+aKveeNjicpID49MCAmJiBqLmZyb20uaWQpe1xuXHRcdFx0XHRcdFx0XHRsZXQgbWVzcyA9IGoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKTtcblx0XHRcdFx0XHRcdFx0JCgnLnN0ZXAxIC5jYXJkcycpLmFwcGVuZChgXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhcmRcIiBkYXRhLWZiaWQ9XCIke2ouaWR9XCI+XG5cdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJ0aXRsZVwiPiR7aS5uYW1lfTwvcD5cblx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cIm1lc3NhZ2VcIj4ke21lc3N9PC9wPlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJhY3Rpb25cIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVhY3Rpb25zXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAncmVhY3Rpb25zJylcIj7orpo8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29tbWVudHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdjb21tZW50cycpXCI+55WZ6KiAPC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNoYXJlZHBvc3RzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnc2hhcmVkcG9zdHMnKVwiPuWIhuS6qzwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdGApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0RkIuYXBpKCd2Mi44L21lJywgKHJlcyk9Pntcblx0XHRcdCQoXCIjc2VsZWN0XCIpLnByZXBlbmQoYDxvcHRpb24gZGF0YS10eXBlPVwicG9zdHNcIiB2YWx1ZT1cIiR7cmVzLmlkfVwiPiR7cmVzLm5hbWV9PC9vcHRpb24+YCk7XG5cdFx0XHRGQi5hcGkoYHYyLjgvbWUvcG9zdHNgLCAocmVzMik9Pntcblx0XHRcdFx0Zm9yKGxldCBqIG9mIHJlczIuZGF0YSl7XG5cdFx0XHRcdFx0aWYoai5tZXNzYWdlICYmIGoubWVzc2FnZS5pbmRleE9mKCfmir3njY4nKSA+PTApe1xuXHRcdFx0XHRcdFx0bGV0IG1lc3MgPSBqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIik7XG5cdFx0XHRcdFx0XHQkKCcuc3RlcDEgLmNhcmRzJykuYXBwZW5kKGBcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhcmRcIiBkYXRhLWZiaWQ9XCIke2ouaWR9XCI+XG5cdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwidGl0bGVcIj4ke3Jlcy5uYW1lfTwvcD5cblx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCIgb25jbGljaz1cImNhcmQuc2hvdyh0aGlzKVwiPiR7bWVzc308L3A+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJhY3Rpb25cIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJlYWN0aW9uc1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3JlYWN0aW9ucycpXCI+6K6aPC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb21tZW50c1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ2NvbW1lbnRzJylcIj7nlZnoqIA8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNoYXJlZHBvc3RzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnc2hhcmVkcG9zdHMnKVwiPuWIhuS6qzwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdGApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdHN0ZXAyOiAocGFnZSk9Pntcblx0XHQkKCcuc3RlcDInKS5hZGRDbGFzcygndmlzaWJsZScpO1xuXHRcdCQoJy5zdGVwMiAuY2FyZHMnKS5odG1sKFwiXCIpO1xuXHRcdCQoJy5zdGVwMiAuaGVhZCBzcGFuJykudGV4dChwYWdlLm5hbWUpO1xuXHRcdGxldCBjb21tYW5kID0gcGFnZS50eXBlO1xuXHRcdEZCLmFwaShgdjIuOC8ke3BhZ2UuaWR9LyR7Y29tbWFuZH1gLCAocmVzKT0+e1xuXHRcdFx0Zm9yKGxldCBqIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0bGV0IG1lc3MgPSBqLm1lc3NhZ2UgPyBqLm1lc3NhZ2UucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikgOiBcIlwiO1xuXHRcdFx0XHQkKCcuc3RlcDIgLmNhcmRzJykuYXBwZW5kKGBcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZFwiIGRhdGEtZmJpZD1cIiR7ai5pZH1cIj5cblx0XHRcdFx0XHQ8cCBjbGFzcz1cIm1lc3NhZ2VcIiBvbmNsaWNrPVwiY2FyZC5zaG93KHRoaXMpXCI+JHttZXNzfTwvcD5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJlYWN0aW9uc1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3JlYWN0aW9ucycpXCI+6K6aPC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbW1lbnRzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnY29tbWVudHMnKVwiPueVmeiogDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzaGFyZWRwb3N0c1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3NoYXJlZHBvc3RzJylcIj7liIbkuqs8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0c3RlcDJ0bzE6ICgpPT57XG5cdFx0JCgnI3NlbGVjdCcpLnZhbCgwKTtcblx0XHQkKCcuc3RlcDInKS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xuXHR9LFxuXHRzdGVwM2hpZGU6ICgpPT57XG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xuXHRcdCQoJy5zdGVwMycpLnJlbW92ZUNsYXNzKCd2aXNpYmxlJyk7XG5cdH0sXG5cdHN0ZXAzOiAoZmJpZCwgY29tbWFuZCk9Pntcblx0XHRsYXN0X2NvbW1hbmQgPSB7ZmJpZCxjb21tYW5kfTtcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBub3dEYXRlKCk7XG5cdFx0JCgnLnN0ZXAzJykuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgnJyk7XG5cdFx0JCgnLmxvYWRpbmcud2FpdGluZycpLmFkZENsYXNzKCd2aXNpYmxlJyk7XG5cdFx0ZGF0YS5yYXcgPSBbXTtcblx0XHRkYXRhLmZpbHRlcmVkID0gW107XG5cdFx0ZGF0YS5jb21tYW5kID0gY29tbWFuZDtcblx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XG5cdFx0XHQkKCcub3B0aW9uRmlsdGVyIC5yZWFjdCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdFx0XHQkKCcub3B0aW9uRmlsdGVyIC50aW1lbGltaXQnKS5hZGRDbGFzcygnaGlkZScpO1xuXHRcdH1cblx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZH0vJHtjb21tYW5kfWAsIChyZXMpPT57XG5cdFx0XHRjb25zb2xlLmxvZyhyZXMpO1xuXHRcdFx0ZGF0YS5sZW5ndGggPSByZXMuZGF0YS5sZW5ndGg7XG5cdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xuXHRcdFx0XHRpZiAoZC5pZCl7XG5cdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcblx0XHRcdFx0XHRcdGRhdGEucmF3LnB1c2goZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xuXHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0ZmlsdGVyLnRvdGFsRmlsdGVyKGRhdGEucmF3LCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gZ2V0TmV4dCh1cmwpe1xuXHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcblx0XHRcdFx0ZGF0YS5sZW5ndGggKz0gcmVzLmRhdGEubGVuZ3RoO1xuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnKyBkYXRhLmxlbmd0aCArJyDnrYbos4fmlpkuLi4nKTtcblx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcblx0XHRcdFx0XHRpZiAoZC5pZCl7XG5cdFx0XHRcdFx0XHRpZiAoY29tbWFuZCA9PSAncmVhY3Rpb25zJyl7XG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChkLmZyb20pe1xuXHRcdFx0XHRcdFx0XHRkYXRhLnJhdy5wdXNoKGQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpe1xuXHRcdFx0XHRcdGdldE5leHQocmVzLnBhZ2luZy5uZXh0KTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0ZmlsdGVyLnRvdGFsRmlsdGVyKGRhdGEucmF3LCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KS5mYWlsKCgpPT57XG5cdFx0XHRcdGdldE5leHQodXJsLCAyMDApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59XG5cbmxldCBjYXJkID0ge1xuXHRzaG93OiAoZSk9Pntcblx0XHRpZiAoJChlKS5oYXNDbGFzcygndmlzaWJsZScpKXtcblx0XHRcdCQoZSkucmVtb3ZlQ2xhc3MoJ3Zpc2libGUnKTtcblx0XHR9ZWxzZXtcblx0XHRcdCQoZSkuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcblx0XHR9XG5cdH1cbn1cblxubGV0IGRhdGEgPSB7XG5cdHJhdzogW10sXG5cdGZpbHRlcmVkOiBbXSxcblx0Y29tbWFuZDogJycsXG5cdGxlbmd0aDogMFxufVxuXG5sZXQgdGFibGUgPSB7XG5cdGdlbmVyYXRlOiAoKT0+e1xuXHRcdCQoJy5sb2FkaW5nLndhaXRpbmcnKS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XG5cdFx0bGV0IGZpbHRlcmRhdGEgPSBkYXRhLmZpbHRlcmVkO1xuXHRcdGxldCB0aGVhZCA9ICcnO1xuXHRcdGxldCB0Ym9keSA9ICcnO1xuXHRcdGlmKGRhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0dGhlYWQgPSBgPHRkPuW6j+iZnzwvdGQ+XG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cblx0XHRcdDx0ZD7ooajmg4U8L3RkPmA7XG5cdFx0fWVsc2V7XG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cblx0XHRcdDx0ZCB3aWR0aD1cIjIwMFwiPuWQjeWtlzwvdGQ+XG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XG5cdFx0fVxuXG5cdFx0bGV0IGhvc3QgPSAnaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJztcblxuXHRcdGZvcihsZXQgW2osIHZhbF0gb2YgZmlsdGVyZGF0YS5lbnRyaWVzKCkpe1xuXHRcdFx0bGV0IHRkID0gYDx0ZD48YSBocmVmPSdodHRwOi8vd3d3LmZhY2Vib29rLmNvbS8ke3ZhbC5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7aisxfTwvYT48L3RkPlxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcblx0XHRcdGlmKGRhdGEuY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiY2VudGVyXCI+PHNwYW4gY2xhc3M9XCJyZWFjdCAke3ZhbC50eXBlfVwiPjwvc3Bhbj4ke3ZhbC50eXBlfTwvdGQ+YDtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcblx0XHRcdH1cblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XG5cdFx0XHR0Ym9keSArPSB0cjtcblx0XHR9XG5cdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcblxuXG5cdFx0YWN0aXZlKCk7XG5cblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoe1xuXHRcdFx0XHRcInBhZ2VMZW5ndGhcIjogMzAwLFxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxuXHRcdFx0fSk7XG5cblx0XHRcdCQoXCIjc2VhcmNoTmFtZVwiKS5vbiggJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0YWJsZVxuXHRcdFx0XHQuY29sdW1ucygxKVxuXHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXG5cdFx0XHRcdC5kcmF3KCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cdHJlZG86ICgpPT57XG5cdFx0ZmlsdGVyLnRvdGFsRmlsdGVyKGRhdGEucmF3LCAuLi5vYmoyQXJyYXkoY29uZmlnLmZpbHRlcikpO1xuXHR9XG59XG5cbmxldCBjaG9vc2UgPSB7XG5cdGRhdGE6IFtdLFxuXHRhd2FyZDogW10sXG5cdG51bTogMCxcblx0ZGV0YWlsOiBmYWxzZSxcblx0bGlzdDogW10sXG5cdGluaXQ6ICgpPT57XG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0aGVhZCcpLmh0bWwodGhlYWQpO1xuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHknKS5odG1sKCcnKTtcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcblx0XHRjaG9vc2UuYXdhcmQgPSBbXTtcblx0XHRjaG9vc2UubGlzdCA9IFtdO1xuXHRcdGNob29zZS5udW0gPSAwO1xuXHRcdGlmICgkKFwiI21vcmVwcml6ZVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XG5cdFx0XHRjaG9vc2UuZGV0YWlsID0gdHJ1ZTtcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIG4gPSBwYXJzZUludCgkKHRoaXMpLmZpbmQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKS52YWwoKSk7XG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xuXHRcdFx0XHRpZiAobiA+IDApe1xuXHRcdFx0XHRcdGNob29zZS5udW0gKz0gcGFyc2VJbnQobik7XG5cdFx0XHRcdFx0Y2hvb3NlLmxpc3QucHVzaCh7XCJuYW1lXCI6cCwgXCJudW1cIjogbn0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XG5cdFx0fVxuXHRcdGNob29zZS5nbygpO1xuXHR9LFxuXHRnbzogKCk9Pntcblx0XHRsZXQgbnVtID0gJChcIiNob3dtYW55XCIpLnZhbCgpO1xuXHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGRhdGEuZmlsdGVyZWQubGVuZ3RoKS5zcGxpY2UoMCxudW0pO1xuXHRcdGxldCBpbnNlcnQgPSAnJztcblx0XHRmb3IobGV0IGkgb2YgY2hvb3NlLmF3YXJkKXtcblx0XHRcdGluc2VydCArPSAnPHRyPicgKyAkKCcubWFpbl90YWJsZScpLkRhdGFUYWJsZSgpLnJvd3Moe3NlYXJjaDonYXBwbGllZCd9KS5ub2RlcygpW2ldLmlubmVySFRNTCArICc8L3RyPic7XG5cdFx0fVxuXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5IHRyJykuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcblxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcblx0fVxufVxuXG5sZXQgZmJpZCA9IHtcblx0ZmJpZDogW10sXG5cdGluaXQ6ICh0eXBlKT0+e1xuXHRcdGZiaWQuZmJpZCA9IFtdO1xuXHRcdGRhdGEuaW5pdCgpO1xuXHRcdEZCLmFwaShcIi9tZVwiLGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRkYXRhLnVzZXJpZCA9IHJlcy5pZDtcblx0XHRcdGxldCB1cmwgPSBmYmlkLmZvcm1hdCgkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpKTtcblx0XHRcdGZiaWQuZ2V0KHVybCwgdHlwZSkudGhlbigoZmJpZCk9Pntcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcblx0XHRcdH0pXG5cdFx0XHQkKCcuaWRlbnRpdHknKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoYOeZu+WFpei6q+S7ve+8mjxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Jlcy5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PHNwYW4+JHtyZXMubmFtZX08L3NwYW4+YClcblx0XHR9KTtcblx0fSxcblx0Z2V0OiAodXJsLCB0eXBlKT0+e1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuXHRcdFx0aWYgKHR5cGUgPT0gJ3VybF9jb21tZW50cycpe1xuXHRcdFx0XHRsZXQgcG9zdHVybCA9IHVybDtcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIj9cIikgPiAwKXtcblx0XHRcdFx0XHRwb3N0dXJsID0gcG9zdHVybC5zdWJzdHJpbmcoMCxwb3N0dXJsLmluZGV4T2YoXCI/XCIpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRGQi5hcGkoYC8ke3Bvc3R1cmx9YCxmdW5jdGlvbihyZXMpe1xuXHRcdFx0XHRcdGxldCBvYmogPSB7ZnVsbElEOiByZXMub2dfb2JqZWN0LmlkLCB0eXBlOiB0eXBlLCBjb21tYW5kOiAnY29tbWVudHMnfTtcblx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XG5cdFx0XHRcdGxldCByZXN1bHQgPSB1cmwubWF0Y2gocmVnZXgpO1xuXHRcdFx0XHRsZXQgdXJsdHlwZSA9IGZiaWQuY2hlY2tUeXBlKHVybCk7XG5cdFx0XHRcdGZiaWQuY2hlY2tQYWdlSUQodXJsLCB1cmx0eXBlKS50aGVuKChpZCk9Pntcblx0XHRcdFx0XHRpZiAoaWQgPT09ICdwZXJzb25hbCcpe1xuXHRcdFx0XHRcdFx0dXJsdHlwZSA9ICdwZXJzb25hbCc7XG5cdFx0XHRcdFx0XHRpZCA9IGRhdGEudXNlcmlkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsZXQgb2JqID0ge3BhZ2VJRDogaWQsIHR5cGU6IHVybHR5cGUsIGNvbW1hbmQ6IHR5cGV9O1xuXHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAncGVyc29uYWwnKXtcblx0XHRcdFx0XHRcdGxldCBzdGFydCA9IHVybC5pbmRleE9mKCdmYmlkPScpO1xuXHRcdFx0XHRcdFx0aWYoc3RhcnQgPj0gMCl7XG5cdFx0XHRcdFx0XHRcdGxldCBlbmQgPSB1cmwuaW5kZXhPZihcIiZcIixzdGFydCk7XG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0KzUsZW5kKTtcblx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZigncG9zdHMvJyk7XG5cdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSB1cmwuc3Vic3RyaW5nKHN0YXJ0KzYsdXJsLmxlbmd0aCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdFx0fWVsc2UgaWYgKHVybHR5cGUgPT09ICdwdXJlJyl7XG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gdXJsLnJlcGxhY2UoL1xcXCIvZywnJyk7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ2V2ZW50Jyl7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEpe1xuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3miYDmnInnlZnoqIBcblx0XHRcdFx0XHRcdFx0XHRvYmouY29tbWFuZCA9ICdmZWVkJztcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gcmVzdWx0WzBdO1xuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcdFxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQvL+aKk0VWRU5U5Lit5p+Q56+H55WZ6KiA55qE55WZ6KiAXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IHJlc3VsdFsxXTtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1lbHNlIGlmICh1cmx0eXBlID09PSAnZ3JvdXAnKXtcblx0XHRcdFx0XHRcdFx0aWYgKGZiLnVzZXJfcG9zdHMpe1xuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXTtcblx0XHRcdFx0XHRcdFx0XHRvYmoucGFnZUlEID0gcmVzdWx0WzBdO1xuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgXCJfXCIgK29iai5wdXJlSUQ7XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRzd2FsKHtcblx0XHRcdFx0XHRcdFx0XHRcdHRpdGxlOiAn56S+5ZyY5L2/55So6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5ZyYJyxcblx0XHRcdFx0XHRcdFx0XHRcdGh0bWw6JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29tbWVudGhlbHBlci88L2E+Jyxcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xuXHRcdFx0XHRcdFx0XHRcdH0pLmRvbmUoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09IDEgfHwgcmVzdWx0Lmxlbmd0aCA9PSAzKXtcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XG5cdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAndW5uYW1lJyl7XG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShvYmopO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0Y2hlY2tUeXBlOiAocG9zdHVybCk9Pntcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZmJpZD1cIikgPj0gMCl7XG5cdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdwZXJtYWxpbmsnKSA+PSAwKXtcblx0XHRcdFx0cmV0dXJuICd1bm5hbWUnO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHJldHVybiAncGVyc29uYWwnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9ncm91cHMvXCIpID49IDApe1xuXHRcdFx0cmV0dXJuICdncm91cCc7XG5cdFx0fTtcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZXZlbnRzXCIpID49IDApe1xuXHRcdFx0cmV0dXJuICdldmVudCc7XG5cdFx0fTtcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdcIicpID49IDApe1xuXHRcdFx0cmV0dXJuICdwdXJlJztcblx0XHR9O1xuXHRcdHJldHVybiAnbm9ybWFsJztcblx0fSxcblx0Y2hlY2tQYWdlSUQ6IChwb3N0dXJsLCB0eXBlKT0+e1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuXHRcdFx0bGV0IHN0YXJ0ID0gcG9zdHVybC5pbmRleE9mKFwiZmFjZWJvb2suY29tXCIpKzEzO1xuXHRcdFx0bGV0IGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIixzdGFydCk7XG5cdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xuXHRcdFx0aWYgKGVuZCA8IDApe1xuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdmYmlkPScpID49IDApe1xuXHRcdFx0XHRcdGlmICh0eXBlID09PSAndW5uYW1lJyl7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKCd1bm5hbWUnKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRyZXNvbHZlKHBvc3R1cmwubWF0Y2gocmVnZXgpWzFdKTtcblx0XHRcdFx0fVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGxldCBncm91cCA9IHBvc3R1cmwuaW5kZXhPZignL2dyb3Vwcy8nKTtcblx0XHRcdFx0bGV0IGV2ZW50ID0gcG9zdHVybC5pbmRleE9mKCcvZXZlbnRzLycpXG5cdFx0XHRcdGlmIChncm91cCA+PSAwKXtcblx0XHRcdFx0XHRzdGFydCA9IGdyb3VwKzg7XG5cdFx0XHRcdFx0ZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLHN0YXJ0KTtcblx0XHRcdFx0XHRsZXQgcmVnZXgyID0gL1xcZHs2LH0vZztcblx0XHRcdFx0XHRsZXQgdGVtcCA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LGVuZCk7XG5cdFx0XHRcdFx0aWYgKHJlZ2V4Mi50ZXN0KHRlbXApKXtcblx0XHRcdFx0XHRcdHJlc29sdmUodGVtcCk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdncm91cCcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fWVsc2UgaWYoZXZlbnQgPj0gMCl7XG5cdFx0XHRcdFx0cmVzb2x2ZSgnZXZlbnQnKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0dmFyIHBhZ2VuYW1lID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsZW5kKTtcblx0XHRcdFx0XHRGQi5hcGkoYC8ke3BhZ2VuYW1lfWAsZnVuY3Rpb24ocmVzKXtcblx0XHRcdFx0XHRcdGlmIChyZXMuZXJyb3Ipe1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xuXHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUocmVzLmlkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHRmb3JtYXQ6ICh1cmwpPT57XG5cdFx0aWYgKHVybC5pbmRleE9mKCdidXNpbmVzcy5mYWNlYm9vay5jb20vJykgPj0gMCl7XG5cdFx0XHR1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKFwiP1wiKSk7XG5cdFx0XHRyZXR1cm4gdXJsO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIHVybDtcblx0XHR9XG5cdH1cbn1cblxubGV0IGZpbHRlciA9IHtcblx0dG90YWxGaWx0ZXI6IChyYXdkYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBlbmRUaW1lKT0+e1xuXHRcdGxldCBkID0gcmF3ZGF0YTtcblx0XHRpZiAoaXNEdXBsaWNhdGUpe1xuXHRcdFx0ZCA9IGZpbHRlci51bmlxdWUoZCk7XG5cdFx0fVxuXHRcdGlmICh3b3JkICE9PSAnJyl7XG5cdFx0XHRkID0gZmlsdGVyLndvcmQoZCwgd29yZCk7XG5cdFx0fVxuXHRcdGlmIChpc1RhZyl7XG5cdFx0XHRkID0gZmlsdGVyLnRhZyhkKTtcblx0XHR9XG5cdFx0aWYgKGRhdGEuY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpe1xuXHRcdFx0ZCA9IGZpbHRlci50aW1lKGQsIGVuZFRpbWUpO1xuXHRcdH1lbHNle1xuXHRcdFx0ZCA9IGZpbHRlci5yZWFjdChkLCByZWFjdCk7XG5cdFx0fVxuXHRcdGRhdGEuZmlsdGVyZWQgPSBkO1xuXHRcdHRhYmxlLmdlbmVyYXRlKCk7XG5cdH0sXG5cdHVuaXF1ZTogKGRhdGEpPT57XG5cdFx0bGV0IG91dHB1dCA9IFtdO1xuXHRcdGxldCBrZXlzID0gW107XG5cdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XG5cdFx0XHRpZihrZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcblx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH0sXG5cdHdvcmQ6IChkYXRhLCB3b3JkKT0+e1xuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdGlmIChuLm1lc3NhZ2UuaW5kZXhPZih3b3JkKSA+IC0xKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0dGFnOiAoZGF0YSk9Pntcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsZnVuY3Rpb24obiwgaSl7XG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3Mpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gbmV3QXJ5O1xuXHR9LFxuXHR0aW1lOiAoZGF0YSwgdCk9Pntcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcblx0XHRsZXQgdGltZSA9IG1vbWVudChuZXcgRGF0ZSh0aW1lX2FyeVswXSwocGFyc2VJbnQodGltZV9hcnlbMV0pLTEpLHRpbWVfYXJ5WzJdLHRpbWVfYXJ5WzNdLHRpbWVfYXJ5WzRdLHRpbWVfYXJ5WzVdKSkuX2Q7XG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xuXHRcdFx0bGV0IGNyZWF0ZWRfdGltZSA9IG1vbWVudChuLmNyZWF0ZWRfdGltZSkuX2Q7XG5cdFx0XHRpZiAoY3JlYXRlZF90aW1lIDwgdGltZSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0FyeTtcblx0fSxcblx0cmVhY3Q6IChkYXRhLCB0YXIpPT57XG5cdFx0aWYgKHRhciA9PSAnYWxsJyl7XG5cdFx0XHRyZXR1cm4gZGF0YTtcblx0XHR9ZWxzZXtcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcblx0XHRcdFx0aWYgKG4udHlwZSA9PSB0YXIpe1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBuZXdBcnk7XG5cdFx0fVxuXHR9XG59XG5cbmxldCB1aSA9IHtcblx0aW5pdDogKCk9PntcblxuXHR9LFxuXHRyZXNldDogKCk9Pntcblx0XHRsZXQgY29tbWFuZCA9IGRhdGEucmF3LmNvbW1hbmQ7XG5cdFx0aWYgKGNvbW1hbmQgPT09ICdyZWFjdGlvbnMnKXtcblx0XHRcdCQoJy5saW1pdFRpbWUsICNzZWFyY2hDb21tZW50JykuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdFx0fWVsc2V7XG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5hZGRDbGFzcygnaGlkZScpO1xuXHRcdH1cblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJyl7XG5cdFx0XHQkKCdsYWJlbC50YWcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuXHRcdH1lbHNle1xuXHRcdFx0aWYgKCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKXtcblx0XHRcdFx0JChcIiN0YWdcIikuY2xpY2soKTtcblx0XHRcdH1cblx0XHRcdCQoJ2xhYmVsLnRhZycpLmFkZENsYXNzKCdoaWRlJyk7XG5cdFx0fVxuXHR9XG59XG5cblxuXG5cbmZ1bmN0aW9uIG5vd0RhdGUoKXtcblx0dmFyIGEgPSBuZXcgRGF0ZSgpO1xuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpKzE7XG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xuXHR2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XG59XG5cbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xuXHQgdmFyIGEgPSBtb21lbnQoVU5JWF90aW1lc3RhbXApLl9kO1xuIFx0IHZhciBtb250aHMgPSBbJzAxJywnMDInLCcwMycsJzA0JywnMDUnLCcwNicsJzA3JywnMDgnLCcwOScsJzEwJywnMTEnLCcxMiddO1xuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcbiAgICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XG4gICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XG4gICAgIGlmIChkYXRlIDwgMTApe1xuICAgICBcdGRhdGUgPSBcIjBcIitkYXRlO1xuICAgICB9XG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xuICAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XG4gICAgIGlmIChtaW4gPCAxMCl7XG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xuICAgICB9XG4gICAgIHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcbiAgICAgaWYgKHNlYyA8IDEwKXtcbiAgICAgXHRzZWMgPSBcIjBcIitzZWM7XG4gICAgIH1cbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XG4gICAgIHJldHVybiB0aW1lO1xuIH1cblxuIGZ1bmN0aW9uIG9iajJBcnJheShvYmope1xuIFx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XG4gXHR9KTtcbiBcdHJldHVybiBhcnJheTtcbiB9XG5cbiBmdW5jdGlvbiBnZW5SYW5kb21BcnJheShuKSB7XG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XG4gXHR2YXIgaSwgciwgdDtcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xuIFx0XHRhcnlbaV0gPSBpO1xuIFx0fVxuIFx0Zm9yIChpID0gMCA7IGkgPCBuIDsgKytpKSB7XG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcbiBcdFx0dCA9IGFyeVtyXTtcbiBcdFx0YXJ5W3JdID0gYXJ5W2ldO1xuIFx0XHRhcnlbaV0gPSB0O1xuIFx0fVxuIFx0cmV0dXJuIGFyeTtcbiB9XG4iXX0=
