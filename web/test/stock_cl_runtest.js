
var g_error_list=[];
(function($) {
	var params = $.common.getUrlParams(window.location.href.replace(/%2F/g,'/'));
	var bDatatableInit=false;
	var g_oTable = null;
	var g_stockurl_list = {};
	var $g_run_target,$g_run_detail;
	$.stock_cl_runtest = {
		//初始化页面
		"init" : function() {
			$g_run_target = $(".run_target").eq(0).clone();
			$g_run_detail = $(".run_detail").eq(0).clone();
			$("#command_list tbody").eq(0).html("");
			$("#stocklist").change(function(){
				vList = $(this).val();
				if ( vList.length>=6 ){
					vArray = vList.split("\n");
					$("#listCount").text(vArray.length);
				}
				else{
					$("#listCount").text(0);
				}
				
			});
			//获取最后的数据日期
			var vLastDate=0;
			/*$.ajax({
		       	 type: "GET",
		        url: "stock_testld.php",
		        async:false,
		        dataType: 'json',
		        cache : false
			}).done(function(data) {
				vLastDate = new Date(data[0].lastdate);
			});*/
			$("#startdate,#enddate").datepicker({
				changeMonth: true,
				changeYear: true,
				maxDate: vLastDate,
				dateFormat : 'yy-mm-dd'
			});
			
			vList = "";
			vStartDate = "";
			vEndDate = "";
			if ( params["stocklist"]!=null ){
				stock_array = params["stocklist"].split(';');
				for ( i in stock_array ){
					if ( stock_array[i].length<6 ) continue;
					if ( i==0 ) vList = stock_array[i];
					else vList += "\n" + stock_array[i];
				}
			}
			if ( params["startdate"]!=null ){
				vStartDate = params["startdate"];
			}
			if ( params["enddate"]!=null ){
				vEndDate = params["enddate"];
			}			
			if ( vList=="" ) vList = $.cookie('stocklist');
			if ( vStartDate=="" ) vStartDate = $.cookie('startdate');
			if ( vEndDate=="" ) vEndDate = $.cookie('enddate');
			if ( vList && vList != "" )
			{
				$("#stocklist").val(vList);
			}
			if ( vStartDate && vStartDate != "" )
			{
				$("#startdate").val(vStartDate);
			}
			if ( vEndDate && vEndDate != "" )
			{
				$("#enddate").val(vEndDate);
			}
			$("#stocklist").trigger('change');
			
			//明细打开与关闭
			$(document).on("click",".showdetail",function(){
				$this = $(this);
				if ( $this.hasClass("ui-icon-circle-minus") ){
					$this.removeClass("ui-icon-circle-minus").addClass("ui-icon-circle-plus");
					$this.parent().parent().next("tr").hide();
				}
				else{
					$this.removeClass("ui-icon-circle-plus").addClass("ui-icon-circle-minus");
					$this.parent().parent().next("tr").show();
				}
			});
			
			//$.stock_cl_runtest.initUrlList();
		},
		//获取服务的URL
		"initUrlList" : function() {
			var trstr = "";
			g_stockurl_list = {};
			$.ajax({
		        type: "GET",
		        url:'ea_report.php',
		        async:false,
		        dataType: 'json',
		        cache : false
			}).done(function(data) {
				for ( i in data ){
					g_stockurl_list[data[i].stockid]=data[i].eaip;
				}
			}).fail(function(data) {
				alert('调用ea_report.php时出错！');
			});
		},
		//测试开始
		"testStart" : function() {
			vList = $("#stocklist").val();
			vStartDate = $("#startdate").val();
			vEndDate = $("#enddate").val();
			vPeriod = $("#period").val();
			vArray = vList.split("\n");
			if ( vList=="" )
			{
				alert("股票列表中没有数据");
				return;
			}
			if ( vStartDate=="" )
			{
				alert("开始日期不能为空");
				return;
			}
			if ( vEndDate=="" )
			{
				alert("结束日期不能为空");
				return;
			}
			if ( vEndDate<vStartDate )
			{
				alert("结束日期要大于等于开始日期");
				return;
			}
			var vStockList=[];
			for (i=0;i<vArray.length;i++)
			{
				if ( vArray[i].length!=8 && vArray[i].length!=6)
				{
					alert("第"+(i+1)+"行的数据("+vArray[i]+")有误");
					return;
				}
				if ( vArray[i].length==6 )
				{
					if ( vArray[i].charAt(0)=="6" )
						vArray[i] = "SH" + vArray[i];
					else
						vArray[i] = "SZ" + vArray[i];
				}
				vStockList.push(vArray[i].toUpperCase());
			}			
			$.cookie('stocklist', vList, { path: "/" });
			$.cookie('startdate', vStartDate, { path: "/" });
			$.cookie('enddate', vEndDate, { path: "/" });
			
			$("#duration").text(vStartDate+" ~ "+vEndDate);
			
			var trstr="";
			$("#command_list tbody").eq(0).html(trstr);
			$(".av_inc").text("0%");
			$("#testtime").text("0");
			var iStartTime=(new Date()).getTime();
			//根据标的号与测试日期，获取缠论买卖点信息
			for(j in vStockList){
				var url = "ea_get.php?stockid="+vStockList[j]+"&since="+vStartDate+"&period="+vPeriod;
				var bs_array=[];
				$.ajax({
	        type: "GET",
	        url: url,
	        async:true,
	        dataType: 'json',
	        cache : false
				}).done(function(data) {
					if ( data.length<=0 ) return;
					$tbody = $("#command_list tbody").eq(0);
					$g_run_target.find(".listno").text($tbody.find(".run_target").length+1);
					$g_run_target.find(".stockid").text(data[0].stockid);
					$g_run_target.find(".stockid").text(data[0].stockid);
					$g_run_target.find(".stockname").text(data[0].stockname);
					$run_detail = $g_run_detail.clone();
					$run_list = $run_detail.find(".run_list").eq(0).clone();
					$run_detail.find("tbody").html("");
					var nSuccess=0,nTotal=0,nSumInc=0,nIncrease=0;
					for ( i in data ){
						$run_list.find(".listno").text(parseInt(i)+1);
						$run_list.find(".stockid").text(data[i].stockid);
						$run_list.find(".stockname").text(data[i].stockname);
						$run_list.find(".starttime").text(data[i].buytime);
						$run_list.find(".startprice").text(data[i].buyprice);
						$run_list.find(".startreason").text(data[i].buyreason);
						$run_list.find(".endtime").text(data[i].saletime);
						$run_list.find(".endprice").text(data[i].saleprice);
						$run_list.find(".endreason").text(data[i].salereason);
						$run_list.find(".buypercent").text(data[i].stockname);
						if ( data[i].saleprice=="" ) nIncrease = 0;
						else nIncrease = (data[i].saleprice-data[i].buyprice)/data[i].buyprice;
						if ( nIncrease >0 ) nSuccess++;
						nTotal++;
						nSumInc += nIncrease; 
						$run_list.find(".increase").text(Math.floor(nIncrease*10000)/100 + '%');
						$run_detail.find("tbody").append($run_list.clone());
					}
					$g_run_target.find(".transtimes").text(parseInt(i)+1);
					$g_run_target.find(".success").text(Math.floor(nSuccess/nTotal*10000)/100 + '%');
					$g_run_target.find(".increase").text(Math.floor(nSumInc*10000)/100 + '%');
					
					$tbody.append($g_run_target.clone());
					$tbody.append($run_detail);
					
					$each_inc=$("#command_list tbody").eq(0).find(".run_target > .increase");
					nTotal=0,nSumInc=0;
					$each_inc.each(function(){
						nIncrease = parseFloat($(this).text());
						nSumInc += nIncrease;
						nTotal++;
					});
					$(".av_inc").text(Math.floor(nSumInc/nTotal*100)/100 + '%');
					$("#testtime").text((new Date().getTime()-iStartTime)/1000);
					$(".showdetail.ui-icon-circle-minus").trigger("click");
				}).fail(function(data) {
					alert(data);
				});
				
			}
			return;	
		}
	};
})(jQuery);
