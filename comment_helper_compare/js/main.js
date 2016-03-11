var data = [];
var allData = [];
var rawData = [];
var totalFile = 0;
var usename = false;

var errorMessage = false;
window.onerror=handleErr

function handleErr(msg,url,l)
{
	limit = 100;
	if (!errorMessage){
		console.log("%c發生錯誤，請點擊錯誤開頭的小三角形箭頭\n並將完整錯誤訊息截圖傳送給管理員","font-size:30px; color:#F00");
		$(".console .error").fadeIn();
		errorMessage = true;	
	}
	return false;
}

function render(file) {
  var reader = new FileReader();

  reader.onload = function(event) {
  	var str = event.target.result;
  	preprocess(JSON.parse(str));
  }

  reader.readAsText(file);
}

$(document).ready(function(){
	$("#btn_comments").click(function(e){
		if (e.ctrlKey){
			usename = true;
		}
		for(var i=0; i<$('.inputJSON').length; i++){
			if ($('.inputJSON')[i].files[0]){
				totalFile++;
			}
		}
		if (totalFile > 1){
			for(var i=0; i<$('.inputJSON').length; i++){
				if ($('.inputJSON')[i].files[0]){
					render($('.inputJSON')[i].files[0]);
				}
			}
		}else{
			bootbox.alert("請至少輸入兩個檔案");
		}
	});

	$(window).keydown(function(e){
		if (e.ctrlKey){
			$("#btn_excel").text("輸出JSON");
		}
	});
	$(window).keyup(function(e){
		if (!e.ctrlKey){
			$("#btn_excel").text("輸出EXCEL");
		}
	});

	$("#btn_pay").click(function(){
		getAuth('addScope');
	});
	$("#btn_choose").click(function(){
		choose();
	});
	$("#btn_excel").click(function(e){
		if (e.ctrlKey){
			var url = 'data:text/json;charset=utf8,' + JSON.stringify(data);
			window.open(url, '_blank');
			window.focus();
		}else{
			if (data.length > 7000){
				$(".bigExcel").removeClass("hide");
			}else{	
				JSONToCSVConvertor(forExcel(data), "Comment_helper", true);
			}
		}
	});
	
	$("#moreprize").click(function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$(".gettotal").removeClass("fadeout");
			$('.prizeDetail').removeClass("fadein");
		}else{
			$(this).addClass("active");
			$(".gettotal").addClass("fadeout");
			$('.prizeDetail').addClass("fadein");
		}
	});
	$("#btn_addPrize").click(function(){
		$(".prizeDetail").append('<div class="prize"><div class="input_group">品名：<input type="text"></div><div class="input_group">抽獎人數：<input type="number"></div></div>');
	});

	$("#genExcel").click(function(){
		var filterData = totalFilter(data,$("#unique").prop("checked"),$("#tag").prop("checked"));
		var excelString = forExcel(filterData);
		$("#exceldata").val(JSON.stringify(excelString));
	});

});

function init(){
	data = [];
	id_array = [];
	length_now = 0;
	$(".main_table").DataTable().destroy();
	$(".main_table tbody").html("");
	$("#awardList tbody").html("");
	$("#awardList").hide();
}

function getAuth(type){
	gettype = type;
	if (type == "addScope" || type == "sharedposts"){
		FB.login(function(response) {
			callback(response);
		}, {scope: 'read_stream,user_photos,user_posts,user_groups',return_scopes: true});
	}else{
		FB.getLoginStatus(function(response) {
			callback(response);
		});
	}
}

function callback(response){
	if (response.status === 'connected') {
		var accessToken = response.authResponse.accessToken;
		if (gettype == "addScope"){
			if (response.authResponse.grantedScopes.indexOf('read_stream') >= 0){
				bootbox.alert("付費授權完成，請再次執行抓留言/讚\nAuthorization Finished! Please getComments or getLikes again.");
			}else{
				bootbox.alert("付費授權失敗，請聯絡管理員進行確認\nAuthorization Failed! Please contact the administrator.");
			}
		}else if (gettype == "sharedposts"){
			if (response.authResponse.grantedScopes.indexOf("read_stream") < 0){
				bootbox.alert("抓分享需要付費，詳情請見粉絲專頁");
			}else{
				getFBID(gettype);
			}
		}else{
			getFBID(gettype);			
		}
	}else{
		FB.login(function(response) {
			callback(response);
		}, {scope: 'read_stream,user_photos,user_posts,user_groups',return_scopes: true});
	}
}

function getJSON(){
	comments = [];
	id_array = [];

	$(".main_table").DataTable().destroy();
	$(".main_table tbody").html("");
	$("#awardList tbody").html("");
	$("#awardList").hide();

	$(".console .message").text('');

	$(".share_post").addClass("hide");
	$(".like_comment").removeClass("hide");
	$(".update_donate").slideUp();

	$(".waiting").removeClass("hide");

	$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
	setTimeout(function(){
		finished();
	},1000);
}

function preprocess(source){
	var fromid = [];
	// console.table(source);
	rawData.push(source);
	$.each(source,function(i, val){
		if (usename){
			fromid.push(val.realname);
		}else{
			fromid.push(val.fromid);
		}
	});
	allData.push(fromid);
	if (allData.length == totalFile){
		getDuplicate(allData);
	}
}
function getDuplicate(array){
	// console.log(array);
	var phase1 = [];
	var phase2 = [];


	$.each(array[0],function(i, val){
		if($.inArray(val, array[1]) > -1) phase1.push(val);
	});
	if (totalFile == 3){
		$.each(phase1,function(i, val){
			if($.inArray(val, array[2]) > -1) phase2.push(val);
		});
		getRaw(phase2);
	}else{
		getRaw(phase1);
	}
}
function getRaw(array) {
	var rawTarget = 0;
	$.each(rawData,function(i, val){
		if (val[0].message){
			rawTarget = i;
		}
	});
	$.each(array,function(i, val){
		$.each(rawData[rawTarget],function(j, val2){
			if (usename){
				if (val2.realname == val){
					data.push(val2);
				}
			}else{
				if (val2.fromid == val){
					data.push(val2);
				}
			}
		});
	});
	finished();
}

function finished(){
	insertTable(data);
	activeDataTable();
	$(".waiting").addClass("hide");
	$(".main_table").removeClass("hide");
	$(".update_area,.donate_area").slideUp();
	$(".result_area").slideDown();
	bootbox.alert("done");	
}

function insertTable(data){
	for(var i=0; i<data.length; i++){
		var insertQuery;
		insertQuery = '<tr><td>'+(i+1)+'</td><td>'+data[i].fromid+'</td><td><a href="'+data[i].link+'" target="_blank">'+data[i].realname+'</a></td><td class="force-break">'+data[i].text+'</a></td><td>'+data[i].realtime+'</td></tr>';
		$(".like_comment").append(insertQuery);
	}
}

function activeDataTable(){
	var table = $(".main_table").DataTable({
		"pageLength": 1000,
		"searching": true,
		"lengthChange": false
	});

	$("#searchName").on( 'blur change keyup', function () {
		table
		.columns(2)
		.search(this.value)
		.draw();
	});
	$("#searchComment").on( 'blur change keyup', function () {
		table
		.columns(3)
		.search(this.value)
		.draw();
	});
}

function choose(){
	$("#awardList tbody").html("");
	award = new Array();
	var list = [];
	var num = 0;
	var detail = false;
	if ($("#moreprize").hasClass("active")){
		detail = true;
		$(".prizeDetail .prize").each(function(){
			var n = parseInt($(this).find("input[type='number']").val());
			var p = $(this).find("input[type='text']").val();
			if (n > 0){
				num += n;
				list.push({"name":p, "num": n});
			}
		});
	}else{
		num = $("#howmany").val();
	}
	

	var unique = $("#unique").prop("checked");
	var istag = $("#tag").prop("checked");

	var temp = genRandomArray(data.length).splice(0,num);
	for (var i=0; i<num; i++){
		award.push(data[temp[i]]);
	}

	for (var j=0; j<num; j++){
		$("<tr align='center' class='success'><td>"+award[j].serial+"</td><td class='fromid"+j+"'>"+award[j].fromid+"</td><td><a href='"+award[j].link+"' target='_blank'>"+award[j].realname+"</a></td><td class='force-break'>"+award[j].text+"</a></td><td>"+award[j].realtime+"</td></tr>").appendTo("#awardList tbody");
	}
	if(detail){
		var now = 0;
		for(var k=0; k<list.length; k++){
			var tar = $("#awardList tbody tr").eq(now);
			$('<tr><td class="prizeName" colspan="5">獎品：'+list[k].name+'<span>共 '+list[k].num+' 名</span></td></tr>').insertBefore(tar);
			now += (list[k].num + 1);
		}
		$("#moreprize").removeClass("active");
		$(".gettotal").removeClass("fadeout");
		$('.prizeDetail').removeClass("fadein");
	}

	$("#awardList").fadeIn(1000);
}



 function genRandomArray(n) {
  var ary = new Array();
  var i, r, t;
  for (i = 0 ; i < n ; ++i) {
   ary[i] = i;
  }
  for (i = 0 ; i < n ; ++i) {
   r = Math.floor(Math.random() * n);
   t = ary[r];
   ary[r] = ary[i];
   ary[i] = t;
  }
  return ary;
}

function forExcel(data){
	var newObj = [];
	$.each(data,function(i){
		var tmp = {
			"序號": this.serial,
			"臉書連結" : this.link,
			"姓名" : this.realname,
			"留言內容" : this.message,
			"留言時間" : this.realtime
		}
		newObj.push(tmp);
	});
	return newObj;
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
    fileName += ReportTitle.replace(/ /g,"_");   
    
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
