var errorMessage = false;
var fberror = '';
window.onerror = handleErr;
var TABLE;
var lastCommand = 'comments';
var addLink = false;
var auth_scope = '';

function handleErr(msg, url, l) {
	if (!errorMessage) {
		let url = $('#enterURL .url').val();
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
		console.log("Error occur URL： " + url);
		$(".console .error").append(`<br><br>${fberror}<br><br>${url}`);
		$(".console .error").fadeIn();
		errorMessage = true;
	}
	return false;
}
$(document).ready(function () {
	let hash = location.search;
	if (hash.indexOf("extension") >= 0) {
		$(".loading.checkAuth").removeClass("hide");
		data.extension = true;

		$(".loading.checkAuth button").click(function (e) {
			fb.extensionAuth();
		});
	}

	$("#btn_page_selector").click(function (e) {
		fb.getAuth('signin');
	});

	$("#btn_comments").click(function (e) {
		if (e.ctrlKey || e.altKey) {
			config.order = 'chronological';
		}
		fb.user_posts = true;
		// fbid.init('comments');
		data.start('comments');
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
		$(".prizeDetail").append(`<div class="prize"><div class="input_group">品名：<input type="text"></div><div class="input_group">抽獎人數：<input type="number"></div></div>`);
	});

	$(window).keyup(function (e) {
		if (!e.ctrlKey || e.altKey) {
			$("#btn_excel").text("複製表格內容");
		}
	});

	$("#unique, #tag").on('change', function () {
		table.redo();
	});
	$('.rangeDate').daterangepicker({
		"timePicker": true,
		"timePicker24Hour": true,
		"locale": {
			"format": "YYYY/MM/DD HH:mm",
			"separator": "-",
			"applyLabel": "確定",
			"cancelLabel": "取消",
			"fromLabel": "From",
			"toLabel": "To",
			"customRangeLabel": "Custom",
			"daysOfWeek": [
				"日",
				"一",
				"二",
				"三",
				"四",
				"五",
				"六"
			],
			"monthNames": [
				"一月",
				"二月",
				"三月",
				"四月",
				"五月",
				"六月",
				"七月",
				"八月",
				"九月",
				"十月",
				"十一月",
				"十二月"
			],
			"firstDay": 1
		},
	}, function (start, end, label) {
		config.filter.startTime = start.format('YYYY-MM-DD-HH-mm-ss');
		config.filter.endTime = end.format('YYYY-MM-DD-HH-mm-ss');
		table.redo();
	});
	$('.rangeDate').data('daterangepicker').setStartDate(config.filter.startTime);

});

let config = {
	field: {
		comments: ['like_count', 'message_tags', 'message', 'from', 'created_time'],
		reactions: [],
		feed: ['created_time', 'from', 'message', 'story'],
		likes: ['name']
	},
	limit: '30',
	apiVersion: 'v8.0',
	filter: {
		word: '',
		react: 'all',
		startTime: '2000-12-31-00-00-00',
		endTime: nowDate()
	},
	target: '',
	command: '',
	order: 'chronological',
	auth: 'groups_show_list, pages_show_list, pages_read_engagement, pages_read_user_content',
	likes: false,
	pageToken: false,
	userToken: '',
	me: '',
	from_extension: false,
	auth_user: false,
	signin: false,
}

let fb = {
	user_posts: false,
	getAuth: (type = '') => {
		if (config.signin === true) {
			page_selector.show();
			return false;
		}
		FB.login(function (response) {
			fb.callback(response, type);
		}, {
			auth_type: 'rerequest',
			scope: config.auth,
			return_scopes: true
		});
	},
	callback: (response, type) => {
		// console.log(response);
		if (response.status === 'connected') {
			config.userToken = response.authResponse.accessToken;
			config.me = response.authResponse.userID;
			config.from_extension = false;

			if (type == 'signin') {
				config.auth_user = true;
				page_selector.show();
			}

			if (type == "page_selector") {
				page_selector.show();
			}
		} else {
			FB.login(function (response) {
				fb.callback(response);
			}, {
				scope: config.auth,
				return_scopes: true
			});
		}
	},
	authOK: () => {
		$(".loading.checkAuth").addClass("hide");
		config.command = JSON.parse(localStorage.postdata).command;
		data.finish(JSON.parse($(".chrome").val()));
	}
}

let data = {
	raw: [],
	filtered: [],
	userid: '',
	nowLength: 0,
	extension: false,
	init: () => {
		$(".main_table").DataTable().destroy();
		$("#awardList").hide();
		$(".console .message").text('截取資料中...');
		data.nowLength = 0;
	},
	start: (command) => {
		$(".waiting").removeClass("hide");
		let fbid = $('input.url').val();
		config.command = command;
		$('.pure_fbid').text(fbid);
		let rawdata = [];
		data.get(fbid).then((res) => {
			// fbid.data = res;
			for (let i of res) {
				rawdata.push(i);
			}
			data.finish(rawdata);
		});
	},
	get: (fbid) => {
		return new Promise((resolve, reject) => {
			let datas = [];
			let token = config.pageToken == '' ? `&access_token=${config.userToken}` : `&access_token=${config.pageToken}`;

			FB.api(`v9.0/${fbid}/${config.command}?&order=${config.order}&fields=from,created_time,comment_count,like_count,reactions,comments.limit(300){message_tags,from,message,id,created_time},message,id&access_token=${token}`, (res) => {
				data.nowLength += res.data.length;
				$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
				groupData(res);
				if (res.data.length > 0 && res.paging.next) {
					getNext(res.paging.next);
				} else {
					$(".console .message").text('');
					resolve(datas);
				}
			});
			function groupData(res) {
				for (let d of res.data) {
					if ((config.command == 'reactions' || config.command == 'likes') || config.likes) {
						d.from = {
							id: d.id,
							name: d.name
						};
					}
					if (config.likes) d.type = "LIKE";
					if (d.from) {
						datas.push(d);
					} else {
						//event
						d.from = {
							id: d.id,
							name: d.id
						};
						if (d.updated_time) {
							d.created_time = d.updated_time;
						}
						datas.push(d);
					}
				}
			}
			function getNext(url, limit = 0) {
				$.getJSON(url, function (res) {
					groupData(res);
					if (res.data.length > 0 && res.paging.next) {
						// if (data.nowLength < 180) {
						getNext(res.paging.next, 25);
					} else {
						$(".console .message").text('');
						resolve(datas);
					}
				}).fail(() => {
					getNext(url, 25);
				});
			}
		});
	},
	finish: (rawdata) => {
		$(".waiting").addClass("hide");
		$(".main_table").removeClass("hide");
		$(".update_area,.donate_area").slideUp();
		$(".result_area").slideDown();

		swal('完成！', 'Done!', 'success').done();

		data.raw = rawdata;
		data.filter();
		ui.reset();
	},
	filter: () => {
		let isDuplicate = $("#unique").prop("checked");
		let isTag = $("#tag").prop("checked");

		data.filtered = filter.totalFilter(isDuplicate, isTag, ...obj2Array(config.filter));
		table.generate();
	},
	import: (file) => {
		let reader = new FileReader();

		reader.onload = function (event) {
			let str = event.target.result;
			data.raw = JSON.parse(str);
			data.finish(data.raw);
		}

		reader.readAsText(file);
	}
}

let table = {
	generate: () => {
		$(".main_table").DataTable().destroy();
		let filterdata = data.filtered;
		let thead = '';
		let tbody = '';
		let pic = $("#picture").prop("checked");
		thead = `<td>序號</td>
			<td width="200">名字</td>
			<td class="force-break">留言內容</td>
			<td>回覆數</td>
			<td>讚</td>
			<td class="nowrap">留言時間</td>`;

		let host = 'https://www.facebook.com/';

		for (let [j, val] of filterdata.entries()) {
			// let picture = `<img src="https://graph.facebook.com/${val.from.id}/picture?type=small&access_token=${config.pageToken}"><br>`;
			let picture = '';
			let td = `<td>${j + 1}</td>
			<td><a href='https://www.facebook.com/${val.from.id}' target="_blank">${picture}${val.from.name}</a></td>
			<td class="force-break"><a href="${host + val.id}" target="_blank">${val.message}</a></td>
				<td><a href="#" onclick="comment_detail.show('${val.id}')">${val.comment_count}</a></td>
				<td>${val.like_count}</td>
				<td class="nowrap">${timeConverter(val.created_time)}</td>`;
			let tr = `<tr>${td}</tr>`;
			tbody += tr;
		}
		let insert = `<thead><tr align="center">${thead}</tr></thead><tbody>${tbody}</tbody>`;
		$(".main_table").html('').append(insert);


		active();

		function active() {
			TABLE = $(".main_table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});

			$("#searchName").on('blur change keyup', function () {
				TABLE
					.columns(1)
					.search(this.value)
					.draw();
			});
			$("#searchComment").on('blur change keyup', function () {
				TABLE
					.columns(2)
					.search(this.value)
					.draw();
				config.filter.word = this.value;
			});
		}
	},
	redo: () => {
		data.filter();
	}
}

let comment_detail = {
	show: (fbid)=>{
		let tar = data.filtered.find(item=>{
			return item.id == fbid;
		});
		console.log(tar);
		let host = 'https://www.facebook.com/';
		let tbody = '';
		let i = 1;
		tar = JSON.parse(JSON.stringify(tar));
		tar.comments.data.forEach(item=>{
			if (item.from){

			}else{
				item.from = {
					name: item.id,
					id: item.id,
				}
			}
		})
		for (let val of tar.comments.data) {
			// let picture = `<img src="https://graph.facebook.com/${val.from.id}/picture?type=small&access_token=${config.pageToken}"><br>`;
			let picture = '';
			let td = `<td>${i}</td>
			<td><a href='https://www.facebook.com/${val.from.id}' target="_blank">${picture}${val.from.name}</a></td>
			<td class="force-break"><a href="${host + val.id}" target="_blank">${val.message}</a></td>
				<td class="nowrap">${timeConverter(val.created_time)}</td>`;
			let tr = `<tr>${td}</tr>`;
			tbody += tr;
			i++;
		}
		$('#comment_detail_table tbody').html(tbody);
		$('.comment_detail').removeClass('hide');
	},
	hide: ()=>{
		$('.comment_detail').addClass('hide');
	}
}


let choose = {
	data: [],
	award: [],
	num: 0,
	detail: false,
	list: [],
	init: () => {
		let thead = $('.main_table thead').html();
		$('#awardList table thead').html(thead);
		$('#awardList table tbody').html('');
		choose.award = [];
		choose.list = [];
		choose.num = 0;
		if ($("#searchComment").val() != '') {
			table.redo();
		}
		if ($("#moreprize").hasClass("active")) {
			choose.detail = true;
			$(".prizeDetail .prize").each(function () {
				var n = parseInt($(this).find("input[type='number']").val());
				var p = $(this).find("input[type='text']").val();
				if (n > 0) {
					choose.num += parseInt(n);
					choose.list.push({
						"name": p,
						"num": n
					});
				}
			});
		} else {
			choose.num = $("#howmany").val();
		}
		choose.go();
	},
	go: () => {
		choose.award = genRandomArray(data.filtered.length).splice(0, choose.num);
		let insert = '';
		choose.award.map((val, index) => {
			insert += '<tr title="第' + (index + 1) + '名">' + $('.main_table').DataTable().rows({
				search: 'applied'
			}).nodes()[val].innerHTML + '</tr>';
		})
		$('#awardList table tbody').html(insert);
		$('#awardList table tbody tr').addClass('success');

		if (choose.detail) {
			let now = 0;
			for (let k in choose.list) {
				let tar = $("#awardList tbody tr").eq(now);
				$(`<tr><td class="prizeName" colspan="5">獎品： ${choose.list[k].name} <span>共 ${choose.list[k].num} 名</span></td></tr>`).insertBefore(tar);
				now += (choose.list[k].num + 1);
			}
			$("#moreprize").removeClass("active");
			$(".gettotal").removeClass("fadeout");
			$('.prizeDetail').removeClass("fadein");
		}
		$("#awardList").fadeIn(1000);
	},
	gen_big_award: () => {
		let li = '';
		let awards = [];
		$('#awardList tbody tr').each(function (index, val) {
			let award = {};
			if (val.hasAttribute('title')) {
				award.award_name = false;
				award.name = $(val).find('td').eq(1).find('a').text();
				award.userid = $(val).find('td').eq(1).find('a').attr('href').replace('https://www.facebook.com/', '');
				award.message = $(val).find('td').eq(2).find('a').text();
				award.link = $(val).find('td').eq(2).find('a').attr('href');
				award.time = $(val).find('td').eq($(val).find('td').length - 1).text();
			} else {
				award.award_name = true;
				award.name = $(val).find('td').text();
			}
			awards.push(award);
		});
		for (let i of awards) {
			if (i.award_name === true) {
				li += `<li class="prizeName">${i.name}</li>`;
			} else {
				li += `<li>
				<a href="https://www.facebook.com/${i.userid}" target="_blank"><img src="https://graph.facebook.com/${i.userid}/picture?type=large&access_token=${config.pageToken}" alt=""></a>
				<div class="info">
				<p class="name"><a href="https://www.facebook.com/${i.userid}" target="_blank">${i.name}</a></p>
				<p class="message"><a href="${i.link}" target="_blank">${i.message}</a></p>
				<p class="time"><a href="${i.link}" target="_blank">${i.time}</a></p>
				</div>
				</li>`;
			}
		}
		$('.big_award ul').append(li);
		$('.big_award').addClass('show');
	},
	close_big_award: () => {
		$('.big_award').removeClass('show');
		$('.big_award ul').empty();
	}
}

let filter = {
	totalFilter: (isDuplicate, isTag, word, react, startTime, endTime) => {
		let datas = data.raw;
		if (word !== '') {
			datas = filter.word(datas, word);
		}
		if (isTag) {
			datas = filter.tag(datas);
		}
		if ((config.command == 'reactions' || config.command == 'likes') || config.likes) {
			datas = filter.react(datas, react);
		} else {
			datas = filter.time(datas, startTime, endTime);
		}
		if (isDuplicate) {
			datas = filter.unique(datas);
		}

		return datas;
	},
	unique: (data) => {
		let output = [];
		let keys = [];
		data.forEach(function (item) {
			let key = item.from.id;
			if (keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});
		return output;
	},
	word: (data, word) => {
		let newAry = $.grep(data, function (n, i) {
			if (n.message === undefined) {
				if (n.story.indexOf(word) > -1) {
					return true;
				}
			} else {
				if (n.message.indexOf(word) > -1) {
					return true;
				}
			}
		});
		return newAry;
	},
	tag: (data) => {
		let newAry = $.grep(data, function (n, i) {
			if (n.message_tags) {
				return true;
			}
		});
		return newAry;
	},
	time: (data, st, t) => {
		let time_ary2 = st.split("-");
		let time_ary = t.split("-");
		let endtime = moment(new Date(time_ary[0], (parseInt(time_ary[1]) - 1), time_ary[2], time_ary[3], time_ary[4], time_ary[5]))._d;
		let starttime = moment(new Date(time_ary2[0], (parseInt(time_ary2[1]) - 1), time_ary2[2], time_ary2[3], time_ary2[4], time_ary2[5]))._d;
		let newAry = $.grep(data, function (n, i) {
			let created_time = moment(n.created_time)._d;
			if ((created_time > starttime && created_time < endtime) || n.created_time == "") {
				return true;
			}
		});
		return newAry;
	},
	react: (data, tar) => {
		if (tar == 'all') {
			return data;
		} else {
			let newAry = $.grep(data, function (n, i) {
				if (n.type == tar) {
					return true;
				}
			});
			return newAry;
		}
	}
}

let ui = {
	init: () => {

	},
	reset: () => {
		let command = config.command;
		if ((command == 'reactions' || command == 'likes') || config.likes) {
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
}
let page_selector = {
	pages: [],
	groups: [],
	page_id: false,
	show: () => {
		$('.page_selector').removeClass('hide');
		config.pageToken = false;
		$('#live_id').val('');
		if (config.signin === false) {
			page_selector.getAdmin();
		}
	},
	hide: ()=>{
		$('.page_selector').addClass('hide');
	},
	getAdmin: () => {
		Promise.all([page_selector.getPage(), page_selector.getGroup()]).then((res) => {
			page_selector.genAdmin(res);
		});
	},
	getPage: () => {
		return new Promise((resolve, reject) => {
			FB.api(`${config.apiVersion}/me/accounts?limit=100`, (res) => {
				resolve(res.data);
			});
		});
	},
	getGroup: () => {
		return new Promise((resolve, reject) => {
			FB.api(`${config.apiVersion}/me/groups?fields=name,id,administrator&limit=100`, (res) => {
				resolve(res.data.filter(item => { return item.administrator === true }));
			});
		});
	},
	genAdmin: (res) => {
		let pages = '';
		let groups = '';
		for (let i of res[0]) {
			pages += `<div class="page_btn" data-type="1" data-value="${i.id}" onclick="page_selector.selectPage(this)">${i.name}</div>`;
		}
		if (config.auth_user === true) {
			for (let i of res[1]) {
				groups += `<div class="page_btn" data-type="2" data-value="${i.id}" onclick="page_selector.selectPage(this)">${i.name}</div>`;
			}
		}
		$('.select_page').html(pages);
		$('.select_group').html(groups);
		config.signin = true;
	},
	selectPage: (target) => {
		page_selector.page_id = $(target).data('value');
		if ($(target).data('type') == '2') {
			config.target = 'group';
		} else {
			config.target = 'fanpage';
		}
		$('#post_table tbody').html('');
		$('.fb_loading').removeClass('hide');
		FB.api(`/${page_selector.page_id}?fields=access_token`, function (res) {
			if (res.access_token) {
				config.pageToken = res.access_token;
			} else {
				config.pageToken = '';
			}
		});
		FB.api(`${config.apiVersion}/${page_selector.page_id}/feed?limit=100`, (res) => {
			$('.fb_loading').addClass('hide');
			let tbody = '';
			for (let tr of res.data) {
				tbody += `<tr><td><button type="button" onclick="page_selector.selectPost('${tr.id}')">選擇貼文</button></td><td><a href="https://www.facebook.com/${tr.id}" target="_blank">${tr.message}</a></td><td>${timeConverter(tr.created_time)}</td></tr>`;
			}
			$('#post_table tbody').html(tbody);
		});
	},
	golive() {
		if (config.pageToken === false) {
			alert('請先選擇對應直播的粉絲專頁');
		} else {
			$('.page_selector').addClass('hide');
			$('#post_table tbody').html('');
			$('#enterURL .url').val(page_selector.page_id + '_' + $('#live_id').val());
		}
	},
	selectPost: (fbid) => {
		$('.page_selector').addClass('hide');
		$('#post_table tbody').html('');
		$('#enterURL .url').val(fbid);
	}
}


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
	let array = $.map(obj, function (value, index) {
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
	var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

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
	var uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(CSV);

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