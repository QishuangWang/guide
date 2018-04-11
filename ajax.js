var my = {  
    createXHR : function(){  
        if(window.XMLHttpRequest){    
            //IE7+、Firefox、Opera、Chrome 和Safari  
            return new XMLHttpRequest();      
        }else if(window.ActiveXObject){  
            //IE6 及以下  
            return new ActiveXObject('Microsoft.XMLHTTP');  
        }else{  
            throw new Error('浏览器不支持XHR对象！');  
        }  
    },  
  
    ajax : function(obj){  
        if(obj.dataType === 'json'){  
            var xhr = this.createXHR();     //创建XHR  
            //通过使用JS随机字符串解决IE浏览器第二次默认获取缓存的问题  
            obj.url = obj.url + '?rand=' + Math.random();  
            obj.data = this.formatParams(obj.data); //通过params()将名值对转换成字符串  
              
            if(obj.method === 'get'){  
                obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;   
            }  
            if(obj.async === true){   //true表示异步，false表示同步  
                //使用异步调用的时候，需要触发readystatechange 事件  
                xhr.onreadystatechange = function () {  
                    if (xhr.readyState == 4) {   //判断对象的状态是否交互完成  
                        callback();      //回调  
                    }  
                };  
            }  
            //在使用XHR对象时，必须先调用open()方法，  
            //它接受三个参数：请求类型(get、post)、请求的URL和表示是否异步。  
            xhr.open(obj.method, obj.url, obj.async);  
            if (obj.method === 'post'){  
                //post方式需要自己设置http的请求头，来模仿表单提交。  
                //放在open方法之后，send方法之前。  
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
                xhr.send(obj.data);     //post方式将数据放在send()方法里  
            } else {  
                xhr.send(null);         //get方式则填null  
            }  
            if(obj.async === false){  //同步  
                callback();  
            }  
  
            var callback = function(){  
                //判断http的交互是否成功，200表示成功  
                if(xhr.status == 200){  
                    obj.success(xhr.responseText);          //回调传递参数  
                } else {  
                    alert('获取数据错误！错误代号：' + xhr.status + '，错误信息：' + xhr.statusText);  
                }     
            };  
        } else if (obj.dataType === "jsonp"){  
            var oHead = document.getElementsByTagName("head")[0];  
            var oScript = document.createElement("script");  
            var callbackName = 'callback' + new Date().getTime();  
            var params = this.formatParams(obj.data) + '&callback=' + callbackName;     //按时间戳拼接字符串  
  
            //拼接好src  
            oScript.src = obj.url.split("?") + '?' + params;  
            //插入script标签  
            oHead.insertBefore(oScript, oHead.firstChild);  
            //jsonp的回调函数  
            window[callbackName] = function(json){  
                var callback = obj.success;  
                callback(json);  
                oHead.removeChild(oScript);  
            };  
        }  
    },  
  
    formatParams : function(data){  
        var arr = [];  
        for(var i in data){  
            //特殊字符传参产生的问题可以使用encodeURIComponent()进行编码处理  
            arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));  
        }  
        return arr.join('&');  
    }  
}; 
//下面是调用时的方法

//my.ajax({  
//  method : 'get',  
//  url : '',  
//  data : {  
//      jian : '',  
//      zhi : '',  
//      dui : ''  
//  },  
//  dataType : 'json/jsonp',  
//  async : 'true/false',  
//  success : function(data){  
//      //.......  
//  }  
//});  











