//var $ = require('./lib/jquery.min');
require('./lib/bootstrap.min');
require('./lib/bootstrap-datetimepicker.min');

$('#datetimepicker').datetimepicker({
    format: 'yyyy-mm-dd'
});

$.ajax({
	type:"post",
	url:"http://192.168.2.15:8081/zlboo-main/bbs/showNoteList",
	data:{
		type : '2',
		pageNum : 1
	},
	async:true,
	success:function (data) {
		console.log(data)
	},
	error:function (a,b,c) {
		console.log(c);
	}
});