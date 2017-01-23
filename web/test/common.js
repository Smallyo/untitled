//鏈嶅姟鍣ㄥ湴鍧€
var baseIp="http://203.156.207.30";


var mFlight="";

//閫€鍑�
function userClose(){
	$.ajax({
		type : "GET",
		url : "/b2b/B2bClose",
		data : {

		},
		dataType : "json",
		success : function(data) {
			alert("鎮ㄥ凡閫€鍑虹櫥褰�");
			window.location.href = "index.html";
		}
	});
}

(function($){
	$.common={
			"getUrlParams":function(url){
				var parr = url.split('?');
				if(parr.length<2)
					return "";
				var pairs=parr[1].split('&');
				var result={};
				for(var i=0;i<pairs.length;i++){
					var pair=pairs[i].split('=');
					//console.log(pair);
					result[pair[0]]=pair[1];
				}
				return result;
			},
			"getUrlParamsStr":function(url){//鍙朥RL涓殑鍙傛暟閮ㄥ垎
				var parr = url.split('?');
				if(parr.length<2)
					return "";
				return parr[1];
			},
			"getUrlParamsToStr":function(params){//灏嗗弬鏁板璞¤浆鎹负URL
				return $.map(params,function(v,k){return k+"="+v;}).join("&");
			},
			
			"round":function (v,e){//淇濈暀鏈夋晥鏁板瓧
				var t=1;
				var c=e;
				for(;e>0;t*=10,e--);
				for(;e<0;t/=10,e++);
				if(isNaN(Math.round(v*t)/t)){
					return Math.round(0,e);
				}else{
					var f_x = Math.round(v*t)/t;
					var s_x = f_x.toString();
					var pos_decimal = s_x.indexOf(".");
					if(pos_decimal < 0){
						pos_decimal = s_x.length;
						s_x += ".";
					}
					while(s_x.length <= pos_decimal + c){
						s_x += "0";
					}
					return s_x;
				}
			},
			"LockScreen":function(msg,backgroundColor){//鍔犺浇鎴栬繍琛屾椂椤甸潰閿佸畾
				var $LockScreen=$("#_LockScreen_");
				var bgc;
				if ( !backgroundColor ) bgc="background-color:#123E65;";
				else bgc="background-color:"+backgroundColor+";";
				if ( $LockScreen.length==0 ){
					$LockScreen = $("<div id='_LockScreen_' style='opacity:0.5;position:fixed;top:0;left:0;width:100%;height:100%;text-align:center;"+bgc+"'><img src='image/loading.gif'></img></div>");
					$("body").append($LockScreen);
				}
				h=$(document).height();
				h=(h<200)?200:h;
				$LockScreen.height(h);
				$parentIframe=$(window.parent.document).find("iframe[name=subSearch]");
			  var $top=0;
			  if ($parentIframe.length>0){
				  $top = $(window.parent.document).scrollTop()-$parentIframe.position().top;
			  }
			  else{
				  $top = (h) / 2 + $(document).scrollTop();
				}
			  if ( $top<0 ) $top=0;
				$LockScreen.css("padding-top",$top);
				$LockScreen.show();
			},
			"UnLockScreen":function(){//鍔犺浇鎴栬繍琛屾椂椤甸潰閿佸畾
				$("#_LockScreen_").hide();
			}
			
	};
	Date.prototype.format=function(fmt) {        
    var o = {
    "M+" : this.getMonth()+1, //鏈堜唤        
    "d+" : this.getDate(), //鏃�        
    "h+" : this.getHours() == 0 ? 12 : this.getHours(), //灏忔椂        
    "H+" : this.getHours(), //灏忔椂        
    "m+" : this.getMinutes(), //鍒�        
    "s+" : this.getSeconds(), //绉�        
    "q+" : Math.floor((this.getMonth()+3)/3), //瀛ｅ害        
    "S" : this.getMilliseconds() //姣        
    };        
    var week = {        
    "0" : "\u65e5",        
    "1" : "\u4e00",        
    "2" : "\u4e8c",        
    "3" : "\u4e09",        
    "4" : "\u56db",        
    "5" : "\u4e94",        
    "6" : "\u516d"       
    };        
    if(/(y+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));        
    }        
    if(/(E+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);        
    }        
    for(var k in o){        
        if(new RegExp("("+ k +")").test(fmt)){        
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));        
        }        
    }        
    return fmt;        
	};
})(jQuery);