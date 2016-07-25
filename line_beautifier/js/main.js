"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var names = [];
$("form button").click(function () {
	var text = $("textarea").val();
	var reg = /\n/g;
	var sep = text.split(reg);
	var day = [];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = sep.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _step$value = _slicedToArray(_step.value, 2);

			var _i = _step$value[0];
			var val = _step$value[1];

			if (val.search(/\d{2}/g) === -1) {
				sep.splice(_i, 1);
			}
			if (val.search(/\d{4}/g) == 0) {
				day.push(_i);
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

	if (day.length === 0 || day[0] !== 0) {
		for (var i in day) {
			day[i]++;
		}
		day.unshift(0);
		var d = new Date();
		var date = d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate() + "(無日期資料，此日期為輸出日期)";
		sep.unshift(date);
	}

	sep_day(sep, day);
});

function sep_day(text, day) {
	var text_array = [];
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = day.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var _step2$value = _slicedToArray(_step2.value, 2);

			var i = _step2$value[0];
			var val = _step2$value[1];

			console.log(text[val]);
			var obj = {};
			obj.day = text[val];
			obj.text = [];
			var next = day[i + 1] || text.length - 1;
			for (var j = val + 1; j < next; j++) {
				if (text[j].search(/\d{2}/g) == 0) {
					obj.text.push(text_analyze(text[j]));
				}
			}
			text_array.push(obj);
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

	finish(text_array);
}

function text_analyze(text) {
	var first = text.indexOf(" ");
	var second = text.indexOf(" ", first + 1);
	var time = text.substring(0, text.indexOf(" "));
	var name = text.substring(first + 1, text.indexOf(" ", first + 1));
	if (names.indexOf(name) === -1) {
		names.push(name);
	}
	var message = text.substring(second + 1, text.length);
	var obj = { time: time, name: name, message: message };
	return obj;
}

function finish(text) {
	var str = "";
	var user = void 0;
	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = names[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var name = _step3.value;

			str += "<li>" + name + "</li>";
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

	$(".set form").addClass("hide");
	$(".set .names").removeClass("hide");
	$(".set .names ul").append(str);

	$(".set .names li").click(function () {
		user = $(this).index();
		gen_conversation(text, names[user]);
		names.splice(user, 1);
		if (names.length > 1) {
			$(".head").text("對話群組");
		} else {
			$(".head").text(names[0]);
		}
	});
}

function gen_conversation(text, user) {
	$(".set").addClass("hide");
	$(".show").removeClass("hide");

	var _iteratorNormalCompletion4 = true;
	var _didIteratorError4 = false;
	var _iteratorError4 = undefined;

	try {
		for (var _iterator4 = text[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
			var day = _step4.value;

			$(".show .messages").append("<p class='date'>" + day.day + "</p>");
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = day.text[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var mess = _step5.value;

					var str = "";
					if (mess.name === user) {
						str = "<div class=\"mess me\"><p class=\"name\">" + mess.name + "</p><span>" + mess.time + "</span><div class=\"text\">" + mess.message + "</div></div>";
					} else {
						str = "<div class=\"mess\"><p class=\"name\">" + mess.name + "</p><div class=\"text\">" + mess.message + "</div><span>" + mess.time + "</span></div>";
					}
					$(".show .messages").append(str);
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
}
//# sourceMappingURL=data:application/json;base64,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LE1BRUs7QUFDSixLQUFFLE9BQUYsRUFBVyxJQUFYLENBQWdCLE1BQU0sQ0FBTixDQUFoQjtBQUNBO0FBQ0QsRUFURDtBQVVBOztBQUVELFNBQVMsZ0JBQVQsQ0FBMEIsSUFBMUIsRUFBZ0MsSUFBaEMsRUFBcUM7QUFDcEMsR0FBRSxNQUFGLEVBQVUsUUFBVixDQUFtQixNQUFuQjtBQUNBLEdBQUUsT0FBRixFQUFXLFdBQVgsQ0FBdUIsTUFBdkI7O0FBRm9DO0FBQUE7QUFBQTs7QUFBQTtBQUlwQyx3QkFBZSxJQUFmLG1JQUFvQjtBQUFBLE9BQVosR0FBWTs7QUFDbkIsS0FBRSxpQkFBRixFQUFxQixNQUFyQixDQUE0QixxQkFBbUIsSUFBSSxHQUF2QixHQUEyQixNQUF2RDtBQURtQjtBQUFBO0FBQUE7O0FBQUE7QUFFbkIsMEJBQWdCLElBQUksSUFBcEIsbUlBQXlCO0FBQUEsU0FBakIsSUFBaUI7O0FBQ3hCLFNBQUksTUFBTSxFQUFWO0FBQ0EsU0FBSSxLQUFLLElBQUwsS0FBYyxJQUFsQixFQUF1QjtBQUNyQiwwREFBOEMsS0FBSyxJQUFuRCxrQkFBb0UsS0FBSyxJQUF6RSxtQ0FBeUcsS0FBSyxPQUE5RztBQUNELE1BRkQsTUFFSztBQUNILHVEQUEyQyxLQUFLLElBQWhELGdDQUE2RSxLQUFLLE9BQWxGLG9CQUF3RyxLQUFLLElBQTdHO0FBQ0Q7QUFDRCxPQUFFLGlCQUFGLEVBQXFCLE1BQXJCLENBQTRCLEdBQTVCO0FBQ0E7QUFWa0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVduQjtBQWZtQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBZ0JwQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG5hbWVzID0gW107XHJcbiQoXCJmb3JtIGJ1dHRvblwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdGxldCB0ZXh0ID0gJChcInRleHRhcmVhXCIpLnZhbCgpO1xyXG5cdGxldCByZWcgPSAvXFxuL2c7XHJcblx0bGV0IHNlcCA9IHRleHQuc3BsaXQocmVnKTtcclxuXHRsZXQgZGF5ID0gW107XHJcblx0Zm9yKGxldCBbaSwgdmFsXSBvZiBzZXAuZW50cmllcygpKXtcclxuXHRcdGlmICh2YWwuc2VhcmNoKC9cXGR7Mn0vZykgPT09IC0xKXtcclxuXHRcdFx0c2VwLnNwbGljZShpLCAxKTtcclxuXHRcdH1cclxuXHRcdGlmICh2YWwuc2VhcmNoKC9cXGR7NH0vZykgPT0gMCl7XHJcblx0XHRcdGRheS5wdXNoKGkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKGRheS5sZW5ndGggPT09IDAgfHwgZGF5WzBdICE9PSAwKXtcclxuXHRcdGZvcihsZXQgaSBpbiBkYXkpe1xyXG5cdFx0XHRkYXlbaV0rKztcclxuXHRcdH1cclxuXHRcdGRheS51bnNoaWZ0KDApO1xyXG5cdFx0bGV0IGQgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0bGV0IGRhdGUgPSBkLmdldEZ1bGxZZWFyKCkgKyBcIi5cIiArIChkLmdldE1vbnRoKCkrMSkgKyBcIi5cIiArIGQuZ2V0RGF0ZSgpICsgXCIo54Sh5pel5pyf6LOH5paZ77yM5q2k5pel5pyf54K66Ly45Ye65pel5pyfKVwiO1xyXG5cdFx0c2VwLnVuc2hpZnQoZGF0ZSk7XHJcblx0fVxyXG5cclxuXHRzZXBfZGF5KHNlcCwgZGF5KTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBzZXBfZGF5KHRleHQsIGRheSl7XHJcblx0bGV0IHRleHRfYXJyYXkgPSBbXTtcclxuXHRmb3IobGV0IFtpLCB2YWxdIG9mIGRheS5lbnRyaWVzKCkpe1xyXG5cdFx0Y29uc29sZS5sb2codGV4dFt2YWxdKTtcclxuXHRcdGxldCBvYmogPSB7fTtcclxuXHRcdG9iai5kYXkgPSB0ZXh0W3ZhbF07XHJcblx0XHRvYmoudGV4dCA9IFtdO1xyXG5cdFx0bGV0IG5leHQgPSBkYXlbaSsxXSB8fCB0ZXh0Lmxlbmd0aC0xO1xyXG5cdFx0Zm9yKGxldCBqPXZhbCsxOyBqPG5leHQ7IGorKyl7XHJcblx0XHRcdGlmICh0ZXh0W2pdLnNlYXJjaCgvXFxkezJ9L2cpID09IDApe1xyXG5cdFx0XHRcdG9iai50ZXh0LnB1c2godGV4dF9hbmFseXplKHRleHRbal0pKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGV4dF9hcnJheS5wdXNoKG9iaik7XHJcblx0fVxyXG5cdGZpbmlzaCh0ZXh0X2FycmF5KTtcclxufVxyXG5cclxuZnVuY3Rpb24gdGV4dF9hbmFseXplKHRleHQpe1xyXG5cdGxldCBmaXJzdCA9IHRleHQuaW5kZXhPZihcIiBcIik7XHJcblx0bGV0IHNlY29uZCA9IHRleHQuaW5kZXhPZihcIiBcIiwgZmlyc3QrMSk7XHJcblx0bGV0IHRpbWUgPSB0ZXh0LnN1YnN0cmluZygwLHRleHQuaW5kZXhPZihcIiBcIikpO1xyXG5cdGxldCBuYW1lID0gdGV4dC5zdWJzdHJpbmcoZmlyc3QrMSx0ZXh0LmluZGV4T2YoXCIgXCIsIGZpcnN0KzEpKTtcclxuXHRpZiAobmFtZXMuaW5kZXhPZihuYW1lKSA9PT0gLTEpe1xyXG5cdFx0bmFtZXMucHVzaChuYW1lKTtcclxuXHR9XHJcblx0bGV0IG1lc3NhZ2UgPSB0ZXh0LnN1YnN0cmluZyhzZWNvbmQrMSx0ZXh0Lmxlbmd0aCk7XHJcblx0bGV0IG9iaiA9IHt0aW1lLCBuYW1lLCBtZXNzYWdlfTtcclxuXHRyZXR1cm4gb2JqO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5pc2godGV4dCl7XHJcblx0bGV0IHN0ciA9IFwiXCI7XHJcblx0bGV0IHVzZXI7XHJcblx0Zm9yKGxldCBuYW1lIG9mIG5hbWVzKXtcclxuXHRcdHN0ciArPSBgPGxpPiR7bmFtZX08L2xpPmBcclxuXHR9XHJcblx0JChcIi5zZXQgZm9ybVwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0JChcIi5zZXQgLm5hbWVzXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHQkKFwiLnNldCAubmFtZXMgdWxcIikuYXBwZW5kKHN0cik7XHJcblxyXG5cdCQoXCIuc2V0IC5uYW1lcyBsaVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dXNlciA9ICQodGhpcykuaW5kZXgoKTtcclxuXHRcdGdlbl9jb252ZXJzYXRpb24odGV4dCwgbmFtZXNbdXNlcl0pO1xyXG5cdFx0bmFtZXMuc3BsaWNlKHVzZXIsIDEpO1xyXG5cdFx0aWYgKG5hbWVzLmxlbmd0aCA+IDEpe1xyXG5cdFx0XHQkKFwiLmhlYWRcIikudGV4dChcIuWwjeipsee+pOe1hFwiKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHQkKFwiLmhlYWRcIikudGV4dChuYW1lc1swXSk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbl9jb252ZXJzYXRpb24odGV4dCwgdXNlcil7XHJcblx0JChcIi5zZXRcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdCQoXCIuc2hvd1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblxyXG5cdGZvcihsZXQgZGF5IG9mIHRleHQpe1xyXG5cdFx0JChcIi5zaG93IC5tZXNzYWdlc1wiKS5hcHBlbmQoXCI8cCBjbGFzcz0nZGF0ZSc+XCIrZGF5LmRheStcIjwvcD5cIik7XHJcblx0XHRmb3IobGV0IG1lc3Mgb2YgZGF5LnRleHQpe1xyXG5cdFx0XHRsZXQgc3RyID0gXCJcIjtcclxuXHRcdFx0aWYgKG1lc3MubmFtZSA9PT0gdXNlcil7XHJcblx0XHRcdFx0IHN0ciA9IGA8ZGl2IGNsYXNzPVwibWVzcyBtZVwiPjxwIGNsYXNzPVwibmFtZVwiPiR7bWVzcy5uYW1lfTwvcD48c3Bhbj4ke21lc3MudGltZX08L3NwYW4+PGRpdiBjbGFzcz1cInRleHRcIj4ke21lc3MubWVzc2FnZX08L2Rpdj48L2Rpdj5gXHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCBzdHIgPSBgPGRpdiBjbGFzcz1cIm1lc3NcIj48cCBjbGFzcz1cIm5hbWVcIj4ke21lc3MubmFtZX08L3A+PGRpdiBjbGFzcz1cInRleHRcIj4ke21lc3MubWVzc2FnZX08L2Rpdj48c3Bhbj4ke21lc3MudGltZX08L3NwYW4+PC9kaXY+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKFwiLnNob3cgLm1lc3NhZ2VzXCIpLmFwcGVuZChzdHIpO1xyXG5cdFx0fVxyXG5cdH1cclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
