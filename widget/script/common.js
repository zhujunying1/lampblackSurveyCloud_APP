var debug = true;
var common_url, static_url;
if (debug) {
    //测试地址
    common_url = 'http://39.97.252.173';
    static_url = 'http://39.97.252.173/lbk/api/file/download/';
} else {
    //正式地址
    common_url = 'http://yyiot.d-shore.cn:8082';
    static_url = 'http://yyiot.d-shore.cn:8082/lbk/api/file/download/';
}
//ajax重写
function ajaxRequest(method, params, callBack, url) {
    var src = '';
    if(url){
      src = url;
    }else{
      src = '/lbk/api/request';
    }
    var headers = {
        'Content-Type': 'application/json;charset=utf-8'
    };
    var data = params;
    var href = common_url + '/' + src;
    api.ajax({
        url: href,
        method: method,
        cache: false,
        timeout: 1200,
        headers: headers,
        data: {
          body: data
        }
    }, function(ret, err) {
        // api.hideProgress();
        api.refreshHeaderLoadDone();
        if(err){
          api.toast({
    					msg: JSON.stringify(err),
    					location: 'middle'
    			});
          return;
        }
        if(ret.code == 1006){
          api.toast({
              msg: '登录失效，请重新登录！',
              location: 'middle'
          });
          out();
          return;
        }
        callBack(ret, err);
    });
}

function out() {
  $api.clearStorage();
  $api.setStorage('mine', {});
  api.removeLaunchView({
      animation: {
          type: 'fade',
          duration: 500
      }
  });
  api.openWin({
      name: 'login',
      url: './login.html',
      opaque: true,
      vScrollBarEnabled:false
  });
}

function openWin(name) {
    api.openWin({
        name: name,
        url: name + '.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

//user
function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}
function edit(el) {
    var del = $api.next(el, '.del');
    if (el.value) {
        $api.addCls(del, 'show');
    }
    $api.addCls(el, 'light');
}
function cancel(el) {
    var del = $api.next(el, '.del');
    $api.removeCls(del, 'show');
    $api.removeCls(el, 'light');
}

function addData(data, str) {
    if (!data) {
        data = str;
    } else {
        if (data.indexOf(str) > -1) {
            return;
        } else {
            data = data + ',' + str;
        }
    }
    return data;
}
//时间戳转换成标准格式
function timestampToTime(timestamp, hasTime) {
  if (!timestamp) {
    return '';
  }
  if (typeof timestamp === 'number' && !isNaN(timestamp)) {

  } else {
    return timestamp;
  }
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  if (hasTime) {
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + ' ' + h + m + s;
  }
  return Y + M + D;
}

function filterLimit(pageName){
  var resources = $api.getStorage('resources');
  var curData = '';
  for(var i=0; i<resources.length; i++){
    if(resources[i].href == pageName){
      curData = resources[i];
    }
  }
  return curData ? true : false;
}
