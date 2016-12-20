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
		comments: 'v2.7',
		reactions: 'v2.7',
		sharedposts: 'v2.3',
		url_comments: 'v2.7',
		feed: 'v2.3',
		group: 'v2.7'
	},
	filter: {
		isDuplicate: true,
		isTag: false,
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
		$("#awardList").hide();
		$('.step2, .step3').removeClass('visible');
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
		FB.api("v2.8/" + fbid + "/" + command, function (res) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCIkIiwidGV4dCIsIkpTT04iLCJzdHJpbmdpZnkiLCJsYXN0X2NvbW1hbmQiLCJjb25zb2xlIiwibG9nIiwidmFsIiwiZmFkZUluIiwiZG9jdW1lbnQiLCJyZWFkeSIsImNsaWNrIiwiZmIiLCJnZXRBdXRoIiwiY2hhbmdlIiwiaWQiLCJuYW1lIiwiZmluZCIsInR5cGUiLCJhdHRyIiwicGFnZSIsInN0ZXAiLCJzdGVwMiIsImUiLCJjaG9vc2UiLCJpbml0IiwiaGFzQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiYXBwZW5kIiwib24iLCJjb25maWciLCJmaWx0ZXIiLCJpc0R1cGxpY2F0ZSIsInByb3AiLCJ0YWJsZSIsInJlZG8iLCJkYXRlRHJvcHBlciIsInJlYWN0IiwiZmllbGQiLCJjb21tZW50cyIsInJlYWN0aW9ucyIsInNoYXJlZHBvc3RzIiwidXJsX2NvbW1lbnRzIiwiZmVlZCIsImxpbWl0IiwiYXBpVmVyc2lvbiIsImdyb3VwIiwiaXNUYWciLCJ3b3JkIiwiZW5kVGltZSIsIm5vd0RhdGUiLCJhdXRoIiwidXNlcl9wb3N0cyIsIkZCIiwibG9naW4iLCJyZXNwb25zZSIsImNhbGxiYWNrIiwic2NvcGUiLCJyZXR1cm5fc2NvcGVzIiwic3RhdHVzIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzdGVwMSIsImFsZXJ0Iiwic3RlcDMiLCJmYW5wYWdlIiwic2hvcnRjdXQiLCJzZW5kIiwidGFyIiwiY29tbWFuZCIsInBhcmVudCIsInNpYmxpbmdzIiwiYXBpIiwicmVzIiwiaSIsInB1c2giLCJwcmVwZW5kIiwicmVzMiIsImRhdGEiLCJqIiwibWVzc2FnZSIsIm1lc3MiLCJyZXBsYWNlIiwiZnJvbSIsImh0bWwiLCJzdGVwMnRvMSIsImhpZGUiLCJmYmlkIiwicmF3IiwiZmlsdGVyZWQiLCJsZW5ndGgiLCJkIiwicGFnaW5nIiwibmV4dCIsImdldE5leHQiLCJ0b3RhbEZpbHRlciIsIm9iajJBcnJheSIsImdldEpTT04iLCJmYWlsIiwiY2FyZCIsInNob3ciLCJnZW5lcmF0ZSIsIkRhdGFUYWJsZSIsImRlc3Ryb3kiLCJmaWx0ZXJkYXRhIiwidGhlYWQiLCJ0Ym9keSIsImhvc3QiLCJlbnRyaWVzIiwidGQiLCJ0aW1lQ29udmVydGVyIiwiY3JlYXRlZF90aW1lIiwidHIiLCJpbnNlcnQiLCJhY3RpdmUiLCJjb2x1bW5zIiwic2VhcmNoIiwidmFsdWUiLCJkcmF3IiwiYXdhcmQiLCJudW0iLCJkZXRhaWwiLCJsaXN0IiwiZWFjaCIsIm4iLCJwYXJzZUludCIsInAiLCJnbyIsImdlblJhbmRvbUFycmF5Iiwic3BsaWNlIiwicm93cyIsIm5vZGVzIiwiaW5uZXJIVE1MIiwidXNlcmlkIiwiZm9ybWF0IiwiZ2V0IiwidGhlbiIsInN0YXJ0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwb3N0dXJsIiwic3Vic3RyaW5nIiwib2JqIiwiZnVsbElEIiwib2dfb2JqZWN0IiwicmVnZXgiLCJyZXN1bHQiLCJtYXRjaCIsInVybHR5cGUiLCJjaGVja1R5cGUiLCJjaGVja1BhZ2VJRCIsInBhZ2VJRCIsImVuZCIsInB1cmVJRCIsInN3YWwiLCJ0aXRsZSIsImRvbmUiLCJldmVudCIsInJlZ2V4MiIsInRlbXAiLCJ0ZXN0IiwicGFnZW5hbWUiLCJlcnJvciIsInJhd2RhdGEiLCJ1bmlxdWUiLCJ0YWciLCJ0aW1lIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsIm1lc3NhZ2VfdGFncyIsInQiLCJ0aW1lX2FyeSIsInNwbGl0IiwibW9tZW50IiwiRGF0ZSIsIl9kIiwidWkiLCJyZXNldCIsImEiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJtYXAiLCJpbmRleCIsImFyeSIsIkFycmF5IiwiciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWVDLFNBQWY7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsR0FBbkIsRUFBdUJDLEdBQXZCLEVBQTJCQyxDQUEzQixFQUNBO0FBQ0NDLEdBQUUsaUJBQUYsRUFBcUJDLElBQXJCLENBQTZCQyxLQUFLQyxTQUFMLENBQWVDLFlBQWYsQ0FBN0I7QUFDQSxLQUFJLENBQUNYLFlBQUwsRUFBa0I7QUFDakJZLFVBQVFDLEdBQVIsQ0FBWSxtQ0FBWixFQUFnRCw0QkFBaEQ7QUFDQUQsVUFBUUMsR0FBUixDQUFZLHNCQUFzQk4sRUFBRSxnQkFBRixFQUFvQk8sR0FBcEIsRUFBbEM7QUFDQVAsSUFBRSxpQkFBRixFQUFxQlEsTUFBckI7QUFDQWYsaUJBQWUsSUFBZjtBQUNBO0FBQ0QsUUFBTyxLQUFQO0FBQ0E7QUFDRE8sRUFBRVMsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDM0JWLEdBQUUsWUFBRixFQUFnQlcsS0FBaEIsQ0FBc0IsWUFBVTtBQUMvQkMsS0FBR0MsT0FBSCxDQUFXLE9BQVg7QUFDQSxFQUZEO0FBR0FiLEdBQUUsU0FBRixFQUFhYyxNQUFiLENBQW9CLFlBQVU7QUFDN0IsTUFBSUMsS0FBS2YsRUFBRSxJQUFGLEVBQVFPLEdBQVIsRUFBVDtBQUNBLE1BQUlTLE9BQU9oQixFQUFFLElBQUYsRUFBUWlCLElBQVIsQ0FBYSxpQkFBYixFQUFnQ2hCLElBQWhDLEVBQVg7QUFDQSxNQUFJaUIsT0FBT2xCLEVBQUUsSUFBRixFQUFRaUIsSUFBUixDQUFhLGlCQUFiLEVBQWdDRSxJQUFoQyxDQUFxQyxXQUFyQyxDQUFYO0FBQ0EsTUFBSUMsT0FB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LE1BQUwsS0FBZ0JuRixDQUEzQixDQUFKO0FBQ0FvRCxNQUFJMEIsSUFBSUUsQ0FBSixDQUFKO0FBQ0FGLE1BQUlFLENBQUosSUFBU0YsSUFBSWhJLENBQUosQ0FBVDtBQUNBZ0ksTUFBSWhJLENBQUosSUFBU3NHLENBQVQ7QUFDQTtBQUNELFFBQU8wQixHQUFQO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3I9aGFuZGxlRXJyXHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLHVybCxsKVxyXG57XHJcblx0JCgnLmNvbnNvbGUgLmVycm9yJykudGV4dChgJHtKU09OLnN0cmluZ2lmeShsYXN0X2NvbW1hbmQpfSDnmbznlJ/pjK/oqqTvvIzoq4vmiKrlnJbpgJrnn6XnrqHnkIblk6FgKTtcclxuXHRpZiAoIWVycm9yTWVzc2FnZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsXCJmb250LXNpemU6MzBweDsgY29sb3I6I0YwMFwiKTtcclxuXHRcdGNvbnNvbGUubG9nKFwiRXJyb3Igb2NjdXIgVVJM77yaIFwiICsgJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcdFxyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuXHQkKFwiI2J0bl9sb2dpblwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0ZmIuZ2V0QXV0aCgnbG9naW4nKTtcclxuXHR9KTtcclxuXHQkKCcjc2VsZWN0JykuY2hhbmdlKGZ1bmN0aW9uKCl7XHJcblx0XHRsZXQgaWQgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0bGV0IG5hbWUgPSAkKHRoaXMpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudGV4dCgpO1xyXG5cdFx0bGV0IHR5cGUgPSAkKHRoaXMpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikuYXR0cignZGF0YS10eXBlJyk7XHJcblx0XHRsZXQgcGFnZSA9IHtpZCxuYW1lLHR5cGV9O1xyXG5cdFx0aWYgKHBhZ2UuaWQgIT09ICcwJyl7XHJcblx0XHRcdHN0ZXAuc3RlcDIocGFnZSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxuXHQkKFwiI2J0bl9jb21tZW50c1wiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGZiLmdldEF1dGgoJ2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2xpa2VcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ3JlYWN0aW9ucycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9wYXlcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGZiLmdldEF1dGgoJ2FkZFNjb3BlJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRjaG9vc2UuaW5pdCgpO1xyXG5cdH0pO1xyXG5cdFxyXG5cclxuXHQkKFwiI2VuZFRpbWVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdGlmKCQodGhpcykuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjYnRuX2FkZFByaXplXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj5gKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmlxdWUsICN0YWdcIikub24oJ2NoYW5nZScsZnVuY3Rpb24oKXtcclxuXHRcdGNvbmZpZy5maWx0ZXIuaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLm9wdGlvbkZpbHRlciBpbnB1dCcpLmRhdGVEcm9wcGVyKCk7XHJcblx0JCgnLnBpY2stc3VibWl0Jykub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xyXG5cdFx0Ly8gY29uZmlnLmZpbHRlci5lbmRUaW1lID0gJCgnLm9wdGlvbkZpbHRlciBpbnB1dCcpLnZhbCgpK1wiLTIzLTU5LTU5XCI7XHJcblx0XHQvLyB0YWJsZS5yZWRvKCk7XHJcblx0fSlcclxuXHJcblx0JChcIi51aXBhbmVsIC5yZWFjdFwiKS5jaGFuZ2UoZnVuY3Rpb24oKXtcclxuXHRcdGNvbmZpZy5maWx0ZXIucmVhY3QgPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxufSk7XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydsaWtlX2NvdW50JywnbWVzc2FnZV90YWdzJywnbWVzc2FnZSxmcm9tJywnY3JlYXRlZF90aW1lJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0dXJsX2NvbW1lbnRzOiBbXSxcclxuXHRcdGZlZWQ6IFtdXHJcblx0fSxcclxuXHRsaW1pdDoge1xyXG5cdFx0Y29tbWVudHM6ICc1MDAnLFxyXG5cdFx0cmVhY3Rpb25zOiAnNTAwJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAnNTAwJyxcclxuXHRcdHVybF9jb21tZW50czogJzUwMCcsXHJcblx0XHRmZWVkOiAnNTAwJ1xyXG5cdH0sXHJcblx0YXBpVmVyc2lvbjoge1xyXG5cdFx0Y29tbWVudHM6ICd2Mi43JyxcclxuXHRcdHJlYWN0aW9uczogJ3YyLjcnLFxyXG5cdFx0c2hhcmVkcG9zdHM6ICd2Mi4zJyxcclxuXHRcdHVybF9jb21tZW50czogJ3YyLjcnLFxyXG5cdFx0ZmVlZDogJ3YyLjMnLFxyXG5cdFx0Z3JvdXA6ICd2Mi43J1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHRpc0R1cGxpY2F0ZTogdHJ1ZSxcclxuXHRcdGlzVGFnOiBmYWxzZSxcclxuXHRcdHdvcmQ6ICcnLFxyXG5cdFx0cmVhY3Q6ICdhbGwnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRhdXRoOiAncmVhZF9zdHJlYW0sdXNlcl9waG90b3MsdXNlcl9wb3N0cyx1c2VyX2dyb3Vwcyx1c2VyX21hbmFnZWRfZ3JvdXBzJ1xyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0dXNlcl9wb3N0czogZmFsc2UsXHJcblx0Z2V0QXV0aDogKHR5cGUpPT57XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuXHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHR9LFxyXG5cdGNhbGxiYWNrOiAocmVzcG9uc2UsIHR5cGUpPT57XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRpZiAodHlwZSA9PSBcImxvZ2luXCIpe1xyXG5cdFx0XHRcdGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UuZ3JhbnRlZFNjb3Blcy5pbmRleE9mKCdyZWFkX3N0cmVhbScpID49IDApe1xyXG5cdFx0XHRcdFx0c3RlcC5zdGVwMSgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0YWxlcnQoJ+aykuacieasiumZkOaIluaOiOasiuS4jeWujOaIkCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0c3RlcC5zdGVwMygpO1x0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSk7XHJcblx0XHRcdH0sIHtzY29wZTogY29uZmlnLmF1dGggLHJldHVybl9zY29wZXM6IHRydWV9KTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxubGV0IGZhbnBhZ2UgPSBbXTtcclxubGV0IGdyb3VwID0gW107XHJcbmxldCBzaG9ydGN1dCA9IFtdO1xyXG5sZXQgbGFzdF9jb21tYW5kID0ge307XHJcbmxldCB1cmwgPSB7XHJcblx0c2VuZDogKHRhciwgY29tbWFuZCk9PntcclxuXHRcdGxldCBpZCA9ICQodGFyKS5wYXJlbnQoKS5zaWJsaW5ncygncCcpLmZpbmQoJ2lucHV0JykudmFsKCk7XHJcblx0XHRzdGVwLnN0ZXAzKGlkLCBjb21tYW5kKTtcclxuXHR9XHJcbn1cclxubGV0IHN0ZXAgPSB7XHJcblx0c3RlcDE6ICgpPT57XHJcblx0XHQkKCcubG9naW4nKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cdFx0RkIuYXBpKCd2Mi44L21lL2FjY291bnRzJywgKHJlcyk9PntcclxuXHRcdFx0Zm9yKGxldCBpIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRmYW5wYWdlLnB1c2goaSk7XHJcblx0XHRcdFx0JChcIiNzZWxlY3RcIikucHJlcGVuZChgPG9wdGlvbiBkYXRhLXR5cGU9XCJwb3N0c1wiIHZhbHVlPVwiJHtpLmlkfVwiPiR7aS5uYW1lfTwvb3B0aW9uPmApO1xyXG5cdFx0XHRcdEZCLmFwaShgdjIuOC8ke2kuaWR9L3Bvc3RzYCwgKHJlczIpPT57XHJcblx0XHRcdFx0XHRmb3IobGV0IGogb2YgcmVzMi5kYXRhKXtcclxuXHRcdFx0XHRcdFx0aWYoai5tZXNzYWdlICYmIGoubWVzc2FnZS5pbmRleE9mKCfmir3njY4nKSA+PTApe1xyXG5cdFx0XHRcdFx0XHRcdGxldCBtZXNzID0gai5tZXNzYWdlLnJlcGxhY2UoL1xcbi9nLFwiPGJyIC8+XCIpO1xyXG5cdFx0XHRcdFx0XHRcdCQoJy5zdGVwMSAuY2FyZHMnKS5hcHBlbmQoYFxyXG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhcmRcIiBkYXRhLWZiaWQ9XCIke2ouaWR9XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cInRpdGxlXCI+JHtpLm5hbWV9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJtZXNzYWdlXCIgb25jbGljaz1cImNhcmQuc2hvdyh0aGlzKVwiPiR7bWVzc308L3A+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVhY3Rpb25zXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAncmVhY3Rpb25zJylcIj7orpo8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb21tZW50c1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ2NvbW1lbnRzJylcIj7nlZnoqIA8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzaGFyZWRwb3N0c1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3NoYXJlZHBvc3RzJylcIj7liIbkuqs8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRgKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdEZCLmFwaSgndjIuOC9tZS9ncm91cHMnLCAocmVzKT0+e1xyXG5cdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdGdyb3VwLnB1c2goaSk7XHJcblx0XHRcdFx0JChcIiNzZWxlY3RcIikucHJlcGVuZChgPG9wdGlvbiBkYXRhLXR5cGU9XCJmZWVkXCIgdmFsdWU9XCIke2kuaWR9XCI+JHtpLm5hbWV9PC9vcHRpb24+YCk7XHJcblx0XHRcdFx0RkIuYXBpKGB2Mi44LyR7aS5pZH0vZmVlZD9maWVsZHM9ZnJvbSxtZXNzYWdlLGlkYCwgKHJlczIpPT57XHJcblx0XHRcdFx0XHRmb3IobGV0IGogb2YgcmVzMi5kYXRhKXtcclxuXHRcdFx0XHRcdFx0aWYoai5tZXNzYWdlICYmIGoubWVzc2FnZS5pbmRleE9mKCfmir3njY4nKSA+PTAgJiYgai5mcm9tLmlkKXtcclxuXHRcdFx0XHRcdFx0XHRsZXQgbWVzcyA9IGoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKTtcclxuXHRcdFx0XHRcdFx0XHQkKCcuc3RlcDEgLmNhcmRzJykuYXBwZW5kKGBcclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXJkXCIgZGF0YS1mYmlkPVwiJHtqLmlkfVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJ0aXRsZVwiPiR7aS5uYW1lfTwvcD5cclxuXHRcdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwibWVzc2FnZVwiPiR7bWVzc308L3A+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVhY3Rpb25zXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAncmVhY3Rpb25zJylcIj7orpo8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb21tZW50c1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ2NvbW1lbnRzJylcIj7nlZnoqIA8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzaGFyZWRwb3N0c1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3NoYXJlZHBvc3RzJylcIj7liIbkuqs8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0XHRgKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdEZCLmFwaSgndjIuOC9tZScsIChyZXMpPT57XHJcblx0XHRcdCQoXCIjc2VsZWN0XCIpLnByZXBlbmQoYDxvcHRpb24gZGF0YS10eXBlPVwicG9zdHNcIiB2YWx1ZT1cIiR7cmVzLmlkfVwiPiR7cmVzLm5hbWV9PC9vcHRpb24+YCk7XHJcblx0XHRcdEZCLmFwaShgdjIuOC9tZS9wb3N0c2AsIChyZXMyKT0+e1xyXG5cdFx0XHRcdGZvcihsZXQgaiBvZiByZXMyLmRhdGEpe1xyXG5cdFx0XHRcdFx0aWYoai5tZXNzYWdlICYmIGoubWVzc2FnZS5pbmRleE9mKCfmir3njY4nKSA+PTApe1xyXG5cdFx0XHRcdFx0XHRsZXQgbWVzcyA9IGoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKTtcclxuXHRcdFx0XHRcdFx0JCgnLnN0ZXAxIC5jYXJkcycpLmFwcGVuZChgXHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhcmRcIiBkYXRhLWZiaWQ9XCIke2ouaWR9XCI+XHJcblx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XCJ0aXRsZVwiPiR7cmVzLm5hbWV9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVwibWVzc2FnZVwiIG9uY2xpY2s9XCJjYXJkLnNob3codGhpcylcIj4ke21lc3N9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJhY3Rpb25cIj5cclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVhY3Rpb25zXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAncmVhY3Rpb25zJylcIj7orpo8L2Rpdj5cclxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29tbWVudHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdjb21tZW50cycpXCI+55WZ6KiAPC9kaXY+XHJcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInNoYXJlZHBvc3RzXCIgb25jbGljaz1cInN0ZXAuc3RlcDMoJyR7ai5pZH0nLCAnc2hhcmVkcG9zdHMnKVwiPuWIhuS6qzwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0XHRcdGApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHN0ZXAyOiAocGFnZSk9PntcclxuXHRcdCQoJy5zdGVwMicpLmFkZENsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHQkKCcuc3RlcDIgLmNhcmRzJykuaHRtbChcIlwiKTtcclxuXHRcdCQoJy5zdGVwMiAuaGVhZCBzcGFuJykudGV4dChwYWdlLm5hbWUpO1xyXG5cdFx0bGV0IGNvbW1hbmQgPSBwYWdlLnR5cGU7XHJcblx0XHRGQi5hcGkoYHYyLjgvJHtwYWdlLmlkfS8ke2NvbW1hbmR9YCwgKHJlcyk9PntcclxuXHRcdFx0Zm9yKGxldCBqIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRsZXQgbWVzcyA9IGoubWVzc2FnZSA/IGoubWVzc2FnZS5yZXBsYWNlKC9cXG4vZyxcIjxiciAvPlwiKSA6IFwiXCI7XHJcblx0XHRcdFx0JCgnLnN0ZXAyIC5jYXJkcycpLmFwcGVuZChgXHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2FyZFwiIGRhdGEtZmJpZD1cIiR7ai5pZH1cIj5cclxuXHRcdFx0XHRcdDxwIGNsYXNzPVwibWVzc2FnZVwiIG9uY2xpY2s9XCJjYXJkLnNob3codGhpcylcIj4ke21lc3N9PC9wPlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImFjdGlvblwiPlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJlYWN0aW9uc1wiIG9uY2xpY2s9XCJzdGVwLnN0ZXAzKCcke2ouaWR9JywgJ3JlYWN0aW9ucycpXCI+6K6aPC9kaXY+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29tbWVudHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdjb21tZW50cycpXCI+55WZ6KiAPC9kaXY+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2hhcmVkcG9zdHNcIiBvbmNsaWNrPVwic3RlcC5zdGVwMygnJHtqLmlkfScsICdzaGFyZWRwb3N0cycpXCI+5YiG5LqrPC9kaXY+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0YCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0c3RlcDJ0bzE6ICgpPT57XHJcblx0XHQkKCcjc2VsZWN0JykudmFsKDApO1xyXG5cdFx0JChcIiNhd2FyZExpc3RcIikuaGlkZSgpO1xyXG5cdFx0JCgnLnN0ZXAyLCAuc3RlcDMnKS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xyXG5cdH0sXHJcblx0c3RlcDM6IChmYmlkLCBjb21tYW5kKT0+e1xyXG5cdFx0bGFzdF9jb21tYW5kID0ge2ZiaWQsY29tbWFuZH07XHJcblx0XHRjb25maWcuZmlsdGVyLmVuZFRpbWUgPSBub3dEYXRlKCk7XHJcblx0XHQkKCcuc3RlcDMnKS5hZGRDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJycpO1xyXG5cdFx0JCgnLmxvYWRpbmcud2FpdGluZycpLmFkZENsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdFx0ZGF0YS5maWx0ZXJlZCA9IFtdO1xyXG5cdFx0ZGF0YS5jb21tYW5kID0gY29tbWFuZDtcclxuXHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0JCgnLm9wdGlvbkZpbHRlciAucmVhY3QnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcub3B0aW9uRmlsdGVyIC50aW1lbGltaXQnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdFx0RkIuYXBpKGB2Mi44LyR7ZmJpZH0vJHtjb21tYW5kfWAsIChyZXMpPT57XHJcblx0XHRcdGRhdGEubGVuZ3RoID0gcmVzLmRhdGEubGVuZ3RoO1xyXG5cdFx0XHRmb3IobGV0IGQgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdGlmIChkLmlkKXtcclxuXHRcdFx0XHRcdGlmIChjb21tYW5kID09ICdyZWFjdGlvbnMnKXtcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge2lkOiBkLmlkLCBuYW1lOiBkLm5hbWV9O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKGQuZnJvbSl7XHJcblx0XHRcdFx0XHRcdGRhdGEucmF3LnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRmaWx0ZXIudG90YWxGaWx0ZXIoZGF0YS5yYXcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGdldE5leHQodXJsKXtcclxuXHRcdFx0JC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRkYXRhLmxlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0JChcIi5jb25zb2xlIC5tZXNzYWdlXCIpLnRleHQoJ+W3suaIquWPliAgJysgZGF0YS5sZW5ndGggKycg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0Zm9yKGxldCBkIG9mIHJlcy5kYXRhKXtcclxuXHRcdFx0XHRcdGlmIChkLmlkKXtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1hbmQgPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRcdFx0XHRcdGQuZnJvbSA9IHtpZDogZC5pZCwgbmFtZTogZC5uYW1lfTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoZC5mcm9tKXtcclxuXHRcdFx0XHRcdFx0XHRkYXRhLnJhdy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCl7XHJcblx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRmaWx0ZXIudG90YWxGaWx0ZXIoZGF0YS5yYXcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KS5mYWlsKCgpPT57XHJcblx0XHRcdFx0Z2V0TmV4dCh1cmwsIDIwMCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGNhcmQgPSB7XHJcblx0c2hvdzogKGUpPT57XHJcblx0XHRpZiAoJChlKS5oYXNDbGFzcygndmlzaWJsZScpKXtcclxuXHRcdFx0JChlKS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQoZSkuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBkYXRhID0ge1xyXG5cdHJhdzogW10sXHJcblx0ZmlsdGVyZWQ6IFtdLFxyXG5cdGNvbW1hbmQ6ICcnLFxyXG5cdGxlbmd0aDogMFxyXG59XHJcblxyXG5sZXQgdGFibGUgPSB7XHJcblx0Z2VuZXJhdGU6ICgpPT57XHJcblx0XHQkKCcubG9hZGluZy53YWl0aW5nJykucmVtb3ZlQ2xhc3MoJ3Zpc2libGUnKTtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoKS5kZXN0cm95KCk7XHJcblx0XHRsZXQgZmlsdGVyZGF0YSA9IGRhdGEuZmlsdGVyZWQ7XHJcblx0XHRsZXQgdGhlYWQgPSAnJztcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0aWYoZGF0YS5jb21tYW5kID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkPuihqOaDhTwvdGQ+YDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkIHdpZHRoPVwiMjAwXCI+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBob3N0ID0gJ2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyc7XHJcblxyXG5cdFx0Zm9yKGxldCBbaiwgdmFsXSBvZiBmaWx0ZXJkYXRhLmVudHJpZXMoKSl7XHJcblx0XHRcdGxldCB0ZCA9IGA8dGQ+PGEgaHJlZj0naHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9JyB0YXJnZXQ9XCJfYmxhbmtcIj4ke2orMX08L2E+PC90ZD5cclxuXHRcdFx0PHRkPjxhIGhyZWY9J2h0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7dmFsLmZyb20uaWR9JyB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0aWYoZGF0YS5jb21tYW5kID09PSAncmVhY3Rpb25zJyl7XHJcblx0XHRcdFx0dGQgKz0gYDx0ZCBjbGFzcz1cImNlbnRlclwiPjxzcGFuIGNsYXNzPVwicmVhY3QgJHt2YWwudHlwZX1cIj48L3NwYW4+JHt2YWwudHlwZX08L3RkPmA7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJub3dyYXBcIj4ke3RpbWVDb252ZXJ0ZXIodmFsLmNyZWF0ZWRfdGltZSl9PC90ZD5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCB0ciA9IGA8dHI+JHt0ZH08L3RyPmA7XHJcblx0XHRcdHRib2R5ICs9IHRyO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGluc2VydCA9IGA8dGhlYWQ+PHRyIGFsaWduPVwiY2VudGVyXCI+JHt0aGVhZH08L3RyPjwvdGhlYWQ+PHRib2R5PiR7dGJvZHl9PC90Ym9keT5gO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLmh0bWwoJycpLmFwcGVuZChpbnNlcnQpO1xyXG5cclxuXHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKXtcclxuXHRcdFx0bGV0IHRhYmxlID0gJChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDMwMCxcclxuXHRcdFx0XHRcInNlYXJjaGluZ1wiOiB0cnVlLFxyXG5cdFx0XHRcdFwibGVuZ3RoQ2hhbmdlXCI6IGZhbHNlXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JChcIiNzZWFyY2hOYW1lXCIpLm9uKCAnYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGFibGVcclxuXHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdC5zZWFyY2godGhpcy52YWx1ZSlcclxuXHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlZG86ICgpPT57XHJcblx0XHRmaWx0ZXIudG90YWxGaWx0ZXIoZGF0YS5yYXcsIC4uLm9iajJBcnJheShjb25maWcuZmlsdGVyKSk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgY2hvb3NlID0ge1xyXG5cdGRhdGE6IFtdLFxyXG5cdGF3YXJkOiBbXSxcclxuXHRudW06IDAsXHJcblx0ZGV0YWlsOiBmYWxzZSxcclxuXHRsaXN0OiBbXSxcclxuXHRpbml0OiAoKT0+e1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYgKCQoXCIjbW9yZXByaXplXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgbiA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImlucHV0W3R5cGU9J251bWJlciddXCIpLnZhbCgpKTtcclxuXHRcdFx0XHR2YXIgcCA9ICQodGhpcykuZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKS52YWwoKTtcclxuXHRcdFx0XHRpZiAobiA+IDApe1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1wibmFtZVwiOnAsIFwibnVtXCI6IG59KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oKTtcclxuXHR9LFxyXG5cdGdvOiAoKT0+e1xyXG5cdFx0bGV0IG51bSA9ICQoXCIjaG93bWFueVwiKS52YWwoKTtcclxuXHRcdGNob29zZS5hd2FyZCA9IGdlblJhbmRvbUFycmF5KGRhdGEuZmlsdGVyZWQubGVuZ3RoKS5zcGxpY2UoMCxudW0pO1xyXG5cdFx0bGV0IGluc2VydCA9ICcnO1xyXG5cdFx0Zm9yKGxldCBpIG9mIGNob29zZS5hd2FyZCl7XHJcblx0XHRcdGluc2VydCArPSAnPHRyPicgKyAkKCcubWFpbl90YWJsZScpLkRhdGFUYWJsZSgpLnJvd3Moe3NlYXJjaDonYXBwbGllZCd9KS5ub2RlcygpW2ldLmlubmVySFRNTCArICc8L3RyPic7XHJcblx0XHR9XHJcblxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBmYmlkID0ge1xyXG5cdGZiaWQ6IFtdLFxyXG5cdGluaXQ6ICh0eXBlKT0+e1xyXG5cdFx0ZmJpZC5mYmlkID0gW107XHJcblx0XHRkYXRhLmluaXQoKTtcclxuXHRcdEZCLmFwaShcIi9tZVwiLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdGRhdGEudXNlcmlkID0gcmVzLmlkO1xyXG5cdFx0XHRsZXQgdXJsID0gZmJpZC5mb3JtYXQoJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XHJcblx0XHRcdGZiaWQuZ2V0KHVybCwgdHlwZSkudGhlbigoZmJpZCk9PntcclxuXHRcdFx0XHRkYXRhLnN0YXJ0KGZiaWQpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQkKCcuaWRlbnRpdHknKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoYOeZu+WFpei6q+S7ve+8mjxpbWcgc3JjPVwiaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Jlcy5pZH0vcGljdHVyZT90eXBlPXNtYWxsXCI+PHNwYW4+JHtyZXMubmFtZX08L3NwYW4+YClcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAodXJsLCB0eXBlKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdGlmICh0eXBlID09ICd1cmxfY29tbWVudHMnKXtcclxuXHRcdFx0XHRsZXQgcG9zdHVybCA9IHVybDtcclxuXHRcdFx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiP1wiKSA+IDApe1xyXG5cdFx0XHRcdFx0cG9zdHVybCA9IHBvc3R1cmwuc3Vic3RyaW5nKDAscG9zdHVybC5pbmRleE9mKFwiP1wiKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdEZCLmFwaShgLyR7cG9zdHVybH1gLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHRcdFx0XHRsZXQgb2JqID0ge2Z1bGxJRDogcmVzLm9nX29iamVjdC5pZCwgdHlwZTogdHlwZSwgY29tbWFuZDogJ2NvbW1lbnRzJ307XHJcblx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdFx0bGV0IHJlc3VsdCA9IHVybC5tYXRjaChyZWdleCk7XHJcblx0XHRcdFx0bGV0IHVybHR5cGUgPSBmYmlkLmNoZWNrVHlwZSh1cmwpO1xyXG5cdFx0XHRcdGZiaWQuY2hlY2tQYWdlSUQodXJsLCB1cmx0eXBlKS50aGVuKChpZCk9PntcclxuXHRcdFx0XHRcdGlmIChpZCA9PT0gJ3BlcnNvbmFsJyl7XHJcblx0XHRcdFx0XHRcdHVybHR5cGUgPSAncGVyc29uYWwnO1xyXG5cdFx0XHRcdFx0XHRpZCA9IGRhdGEudXNlcmlkO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bGV0IG9iaiA9IHtwYWdlSUQ6IGlkLCB0eXBlOiB1cmx0eXBlLCBjb21tYW5kOiB0eXBlfTtcclxuXHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAncGVyc29uYWwnKXtcclxuXHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ2ZiaWQ9Jyk7XHJcblx0XHRcdFx0XHRcdGlmKHN0YXJ0ID49IDApe1xyXG5cdFx0XHRcdFx0XHRcdGxldCBlbmQgPSB1cmwuaW5kZXhPZihcIiZcIixzdGFydCk7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHVybC5zdWJzdHJpbmcoc3RhcnQrNSxlbmQpO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRsZXQgc3RhcnQgPSB1cmwuaW5kZXhPZigncG9zdHMvJyk7XHJcblx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHVybC5zdWJzdHJpbmcoc3RhcnQrNix1cmwubGVuZ3RoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdH1lbHNlIGlmICh1cmx0eXBlID09PSAncHVyZScpe1xyXG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gdXJsLnJlcGxhY2UoL1xcXCIvZywnJyk7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ2V2ZW50Jyl7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSl7XHJcblx0XHRcdFx0XHRcdFx0XHQvL+aKk0VWRU5U5Lit5omA5pyJ55WZ6KiAXHJcblx0XHRcdFx0XHRcdFx0XHRvYmouY29tbWFuZCA9ICdmZWVkJztcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHRcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdC8v5oqTRVZFTlTkuK3mn5Dnr4fnlZnoqIDnmoTnlZnoqIBcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSByZXN1bHRbMV07XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9ZWxzZSBpZiAodXJsdHlwZSA9PT0gJ2dyb3VwJyl7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGZiLnVzZXJfcG9zdHMpe1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgXCJfXCIgK29iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGl0bGU6ICfnpL7lnJjkvb/nlKjpnIDku5josrvvvIzoqbPmg4Xoq4vopovnsonntbLlnJgnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRodG1sOic8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHRcdFx0fSkuZG9uZSgpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSB8fCByZXN1bHQubGVuZ3RoID09IDMpe1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAndW5uYW1lJyl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5wYWdlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXTtcclxuXHRcdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV07XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2hlY2tUeXBlOiAocG9zdHVybCk9PntcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJmYmlkPVwiKSA+PSAwKXtcclxuXHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZigncGVybWFsaW5rJykgPj0gMCl7XHJcblx0XHRcdFx0cmV0dXJuICd1bm5hbWUnO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRyZXR1cm4gJ3BlcnNvbmFsJztcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCIvZ3JvdXBzL1wiKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdncm91cCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcImV2ZW50c1wiKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdldmVudCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignXCInKSA+PSAwKXtcclxuXHRcdFx0cmV0dXJuICdwdXJlJztcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJ25vcm1hbCc7XHJcblx0fSxcclxuXHRjaGVja1BhZ2VJRDogKHBvc3R1cmwsIHR5cGUpPT57XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcclxuXHRcdFx0bGV0IHN0YXJ0ID0gcG9zdHVybC5pbmRleE9mKFwiZmFjZWJvb2suY29tXCIpKzEzO1xyXG5cdFx0XHRsZXQgZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLHN0YXJ0KTtcclxuXHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0aWYgKGVuZCA8IDApe1xyXG5cdFx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ2ZiaWQ9JykgPj0gMCl7XHJcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ3VubmFtZScpe1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCd1bm5hbWUnKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShwb3N0dXJsLm1hdGNoKHJlZ2V4KVsxXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsZXQgZ3JvdXAgPSBwb3N0dXJsLmluZGV4T2YoJy9ncm91cHMvJyk7XHJcblx0XHRcdFx0bGV0IGV2ZW50ID0gcG9zdHVybC5pbmRleE9mKCcvZXZlbnRzLycpXHJcblx0XHRcdFx0aWYgKGdyb3VwID49IDApe1xyXG5cdFx0XHRcdFx0c3RhcnQgPSBncm91cCs4O1xyXG5cdFx0XHRcdFx0ZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLHN0YXJ0KTtcclxuXHRcdFx0XHRcdGxldCByZWdleDIgPSAvXFxkezYsfS9nO1xyXG5cdFx0XHRcdFx0bGV0IHRlbXAgPSBwb3N0dXJsLnN1YnN0cmluZyhzdGFydCxlbmQpO1xyXG5cdFx0XHRcdFx0aWYgKHJlZ2V4Mi50ZXN0KHRlbXApKXtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0ZW1wKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdncm91cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNlIGlmKGV2ZW50ID49IDApe1xyXG5cdFx0XHRcdFx0cmVzb2x2ZSgnZXZlbnQnKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHZhciBwYWdlbmFtZSA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LGVuZCk7XHJcblx0XHRcdFx0XHRGQi5hcGkoYC8ke3BhZ2VuYW1lfWAsZnVuY3Rpb24ocmVzKXtcclxuXHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcil7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgncGVyc29uYWwnKTtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShyZXMuaWQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Zm9ybWF0OiAodXJsKT0+e1xyXG5cdFx0aWYgKHVybC5pbmRleE9mKCdidXNpbmVzcy5mYWNlYm9vay5jb20vJykgPj0gMCl7XHJcblx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoXCI/XCIpKTtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IGZpbHRlciA9IHtcclxuXHR0b3RhbEZpbHRlcjogKHJhd2RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgd29yZCwgcmVhY3QsIGVuZFRpbWUpPT57XHJcblx0XHRsZXQgZCA9IHJhd2RhdGE7XHJcblx0XHRpZiAoaXNEdXBsaWNhdGUpe1xyXG5cdFx0XHRkID0gZmlsdGVyLnVuaXF1ZShkKTtcclxuXHRcdH1cclxuXHRcdGlmICh3b3JkICE9PSAnJyl7XHJcblx0XHRcdGQgPSBmaWx0ZXIud29yZChkLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZyl7XHJcblx0XHRcdGQgPSBmaWx0ZXIudGFnKGQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGRhdGEuY29tbWFuZCAhPT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHRkID0gZmlsdGVyLnRpbWUoZCwgZW5kVGltZSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZCA9IGZpbHRlci5yZWFjdChkLCByZWFjdCk7XHJcblx0XHR9XHJcblx0XHRkYXRhLmZpbHRlcmVkID0gZDtcclxuXHRcdHRhYmxlLmdlbmVyYXRlKCk7XHJcblx0fSxcclxuXHR1bmlxdWU6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG91dHB1dCA9IFtdO1xyXG5cdFx0bGV0IGtleXMgPSBbXTtcclxuXHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdGxldCBrZXkgPSBpdGVtLmZyb20uaWQ7XHJcblx0XHRcdGlmKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fSxcclxuXHR3b3JkOiAoZGF0YSwgd29yZCk9PntcclxuXHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0aWYgKG4ubWVzc2FnZS5pbmRleE9mKHdvcmQpID4gLTEpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0YWc6IChkYXRhKT0+e1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlX3RhZ3Mpe1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0aW1lOiAoZGF0YSwgdCk9PntcclxuXHRcdGxldCB0aW1lX2FyeSA9IHQuc3BsaXQoXCItXCIpO1xyXG5cdFx0bGV0IHRpbWUgPSBtb21lbnQobmV3IERhdGUodGltZV9hcnlbMF0sKHBhcnNlSW50KHRpbWVfYXJ5WzFdKS0xKSx0aW1lX2FyeVsyXSx0aW1lX2FyeVszXSx0aW1lX2FyeVs0XSx0aW1lX2FyeVs1XSkpLl9kO1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLGZ1bmN0aW9uKG4sIGkpe1xyXG5cdFx0XHRsZXQgY3JlYXRlZF90aW1lID0gbW9tZW50KG4uY3JlYXRlZF90aW1lKS5fZDtcclxuXHRcdFx0aWYgKGNyZWF0ZWRfdGltZSA8IHRpbWUgfHwgbi5jcmVhdGVkX3RpbWUgPT0gXCJcIil7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHJlYWN0OiAoZGF0YSwgdGFyKT0+e1xyXG5cdFx0aWYgKHRhciA9PSAnYWxsJyl7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxldCBuZXdBcnkgPSAkLmdyZXAoZGF0YSxmdW5jdGlvbihuLCBpKXtcclxuXHRcdFx0XHRpZiAobi50eXBlID09IHRhcil7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IHVpID0ge1xyXG5cdGluaXQ6ICgpPT57XHJcblxyXG5cdH0sXHJcblx0cmVzZXQ6ICgpPT57XHJcblx0XHRsZXQgY29tbWFuZCA9IGRhdGEucmF3LmNvbW1hbmQ7XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ3JlYWN0aW9ucycpe1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JCgnLmxpbWl0VGltZSwgI3NlYXJjaENvbW1lbnQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcudWlwYW5lbCAucmVhY3QnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNvbW1hbmQgPT09ICdjb21tZW50cycpe1xyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGlmICgkKFwiI3RhZ1wiKS5wcm9wKFwiY2hlY2tlZFwiKSl7XHJcblx0XHRcdFx0JChcIiN0YWdcIikuY2xpY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpe1xyXG5cdHZhciBhID0gbmV3IERhdGUoKTtcclxuXHR2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuXHR2YXIgbW9udGggPSBhLmdldE1vbnRoKCkrMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIrXCItXCIrbW9udGgrXCItXCIrZGF0ZStcIi1cIitob3VyK1wiLVwiK21pbitcIi1cIitzZWM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIoVU5JWF90aW1lc3RhbXApe1xyXG5cdCB2YXIgYSA9IG1vbWVudChVTklYX3RpbWVzdGFtcCkuX2Q7XHJcbiBcdCB2YXIgbW9udGhzID0gWycwMScsJzAyJywnMDMnLCcwNCcsJzA1JywnMDYnLCcwNycsJzA4JywnMDknLCcxMCcsJzExJywnMTInXTtcclxuICAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuICAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuICAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG4gICAgIGlmIChkYXRlIDwgMTApe1xyXG4gICAgIFx0ZGF0ZSA9IFwiMFwiK2RhdGU7XHJcbiAgICAgfVxyXG4gICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG4gICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuICAgICBpZiAobWluIDwgMTApe1xyXG4gICAgIFx0bWluID0gXCIwXCIrbWluO1xyXG4gICAgIH1cclxuICAgICB2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcbiAgICAgaWYgKHNlYyA8IDEwKXtcclxuICAgICBcdHNlYyA9IFwiMFwiK3NlYztcclxuICAgICB9XHJcbiAgICAgdmFyIHRpbWUgPSB5ZWFyKyctJyttb250aCsnLScrZGF0ZStcIiBcIitob3VyKyc6JyttaW4rJzonK3NlYyA7XHJcbiAgICAgcmV0dXJuIHRpbWU7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gb2JqMkFycmF5KG9iail7XHJcbiBcdGxldCBhcnJheSA9ICQubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcbiBcdFx0cmV0dXJuIFt2YWx1ZV07XHJcbiBcdH0pO1xyXG4gXHRyZXR1cm4gYXJyYXk7XHJcbiB9XHJcblxyXG4gZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG4gXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcbiBcdHZhciBpLCByLCB0O1xyXG4gXHRmb3IgKGkgPSAwIDsgaSA8IG4gOyArK2kpIHtcclxuIFx0XHRhcnlbaV0gPSBpO1xyXG4gXHR9XHJcbiBcdGZvciAoaSA9IDAgOyBpIDwgbiA7ICsraSkge1xyXG4gXHRcdHIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuKTtcclxuIFx0XHR0ID0gYXJ5W3JdO1xyXG4gXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuIFx0XHRhcnlbaV0gPSB0O1xyXG4gXHR9XHJcbiBcdHJldHVybiBhcnk7XHJcbiB9XHJcbiJdfQ==
