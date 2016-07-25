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

			var i = _step$value[0];
			var val = _step$value[1];

			if (val.search(/\d{4}/g) == 0) {
				day.push(i);
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

			var obj = {};
			obj.day = text[val];
			obj.text = [];
			var next = day[i + 1] || text.length - 1;
			for (var j = val + 1; j < next; j++) {
				obj.text.push(text_analyze(text[j]));
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

	console.log(text_array);
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
//# sourceMappingURL=data:application/json;base64,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SUFBekUsbUNBQXlHLEtBQUssT0FBOUc7QUFDRCxNQUZELE1BRUs7QUFDSCx1REFBMkMsS0FBSyxJQUFoRCxnQ0FBNkUsS0FBSyxPQUFsRixvQkFBd0csS0FBSyxJQUE3RztBQUNEO0FBQ0QsT0FBRSxpQkFBRixFQUFxQixNQUFyQixDQUE0QixHQUE1QjtBQUNBO0FBVmtCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFXbkI7QUFmbUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWdCcEMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBuYW1lcyA9IFtdO1xyXG4kKFwiZm9ybSBidXR0b25cIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRsZXQgdGV4dCA9ICQoXCJ0ZXh0YXJlYVwiKS52YWwoKTtcclxuXHRsZXQgcmVnID0gL1xcbi9nO1xyXG5cdGxldCBzZXAgPSB0ZXh0LnNwbGl0KHJlZyk7XHJcblx0bGV0IGRheSA9IFtdO1xyXG5cdGZvcihsZXQgW2ksIHZhbF0gb2Ygc2VwLmVudHJpZXMoKSl7XHJcblx0XHRpZiAodmFsLnNlYXJjaCgvXFxkezR9L2cpID09IDApe1xyXG5cdFx0XHRkYXkucHVzaChpKTtcclxuXHRcdH1cclxuXHR9XHJcblx0c2VwX2RheShzZXAsIGRheSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gc2VwX2RheSh0ZXh0LCBkYXkpe1xyXG5cdGxldCB0ZXh0X2FycmF5ID0gW107XHJcblx0Zm9yKGxldCBbaSwgdmFsXSBvZiBkYXkuZW50cmllcygpKXtcclxuXHRcdGxldCBvYmogPSB7fTtcclxuXHRcdG9iai5kYXkgPSB0ZXh0W3ZhbF07XHJcblx0XHRvYmoudGV4dCA9IFtdO1xyXG5cdFx0bGV0IG5leHQgPSBkYXlbaSsxXSB8fCB0ZXh0Lmxlbmd0aC0xO1xyXG5cdFx0Zm9yKGxldCBqPXZhbCsxOyBqPG5leHQ7IGorKyl7XHJcblx0XHRcdG9iai50ZXh0LnB1c2godGV4dF9hbmFseXplKHRleHRbal0pKTtcclxuXHRcdH1cclxuXHRcdHRleHRfYXJyYXkucHVzaChvYmopO1xyXG5cdH1cclxuXHRjb25zb2xlLmxvZyh0ZXh0X2FycmF5KTtcclxuXHRmaW5pc2godGV4dF9hcnJheSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRleHRfYW5hbHl6ZSh0ZXh0KXtcclxuXHRsZXQgZmlyc3QgPSB0ZXh0LmluZGV4T2YoXCIgXCIpO1xyXG5cdGxldCBzZWNvbmQgPSB0ZXh0LmluZGV4T2YoXCIgXCIsIGZpcnN0KzEpO1xyXG5cdGxldCB0aW1lID0gdGV4dC5zdWJzdHJpbmcoMCx0ZXh0LmluZGV4T2YoXCIgXCIpKTtcclxuXHRsZXQgbmFtZSA9IHRleHQuc3Vic3RyaW5nKGZpcnN0KzEsdGV4dC5pbmRleE9mKFwiIFwiLCBmaXJzdCsxKSk7XHJcblx0aWYgKG5hbWVzLmluZGV4T2YobmFtZSkgPT09IC0xKXtcclxuXHRcdG5hbWVzLnB1c2gobmFtZSk7XHJcblx0fVxyXG5cdGxldCBtZXNzYWdlID0gdGV4dC5zdWJzdHJpbmcoc2Vjb25kKzEsdGV4dC5sZW5ndGgpO1xyXG5cdGxldCBvYmogPSB7dGltZSwgbmFtZSwgbWVzc2FnZX07XHJcblx0cmV0dXJuIG9iajtcclxufVxyXG5cclxuZnVuY3Rpb24gZmluaXNoKHRleHQpe1xyXG5cdGxldCBzdHIgPSBcIlwiO1xyXG5cdGxldCB1c2VyO1xyXG5cdGZvcihsZXQgbmFtZSBvZiBuYW1lcyl7XHJcblx0XHRzdHIgKz0gYDxsaT4ke25hbWV9PC9saT5gXHJcblx0fVxyXG5cdCQoXCIuc2V0IGZvcm1cIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdCQoXCIuc2V0IC5uYW1lc1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0JChcIi5zZXQgLm5hbWVzIHVsXCIpLmFwcGVuZChzdHIpO1xyXG5cclxuXHQkKFwiLnNldCAubmFtZXMgbGlcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHVzZXIgPSAkKHRoaXMpLmluZGV4KCk7XHJcblx0XHRnZW5fY29udmVyc2F0aW9uKHRleHQsIG5hbWVzW3VzZXJdKTtcclxuXHRcdG5hbWVzLnNwbGljZSh1c2VyLCAxKTtcclxuXHRcdGlmIChuYW1lcy5sZW5ndGggPiAxKXtcclxuXHRcdFx0JChcIi5oZWFkXCIpLnRleHQoXCLlsI3oqbHnvqTntYRcIik7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JChcIi5oZWFkXCIpLnRleHQobmFtZXNbMF0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5fY29udmVyc2F0aW9uKHRleHQsIHVzZXIpe1xyXG5cdCQoXCIuc2V0XCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHQkKFwiLnNob3dcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cclxuXHRmb3IobGV0IGRheSBvZiB0ZXh0KXtcclxuXHRcdCQoXCIuc2hvdyAubWVzc2FnZXNcIikuYXBwZW5kKFwiPHAgY2xhc3M9J2RhdGUnPlwiK2RheS5kYXkrXCI8L3A+XCIpO1xyXG5cdFx0Zm9yKGxldCBtZXNzIG9mIGRheS50ZXh0KXtcclxuXHRcdFx0bGV0IHN0ciA9IFwiXCI7XHJcblx0XHRcdGlmIChtZXNzLm5hbWUgPT09IHVzZXIpe1xyXG5cdFx0XHRcdCBzdHIgPSBgPGRpdiBjbGFzcz1cIm1lc3MgbWVcIj48cCBjbGFzcz1cIm5hbWVcIj4ke21lc3MubmFtZX08L3A+PHNwYW4+JHttZXNzLnRpbWV9PC9zcGFuPjxkaXYgY2xhc3M9XCJ0ZXh0XCI+JHttZXNzLm1lc3NhZ2V9PC9kaXY+PC9kaXY+YFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQgc3RyID0gYDxkaXYgY2xhc3M9XCJtZXNzXCI+PHAgY2xhc3M9XCJuYW1lXCI+JHttZXNzLm5hbWV9PC9wPjxkaXYgY2xhc3M9XCJ0ZXh0XCI+JHttZXNzLm1lc3NhZ2V9PC9kaXY+PHNwYW4+JHttZXNzLnRpbWV9PC9zcGFuPjwvZGl2PmA7XHJcblx0XHRcdH1cclxuXHRcdFx0JChcIi5zaG93IC5tZXNzYWdlc1wiKS5hcHBlbmQoc3RyKTtcclxuXHRcdH1cclxuXHR9XHJcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
