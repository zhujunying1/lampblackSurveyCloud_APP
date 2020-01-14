
var prevPid = '', curPid = '';

var frameArr = [];
var enterpriseList = [], curenterpriseId = '';

function isOpened(frmName){
    var i = 0, len = frameArr.length;
    var mark = false;
    for(i; i<len; i++){
        if(frameArr[i] === frmName){
            mark = true;
            return mark;
        }
    }
    return mark;
}

//toggle header
function showHeader(type){
    if(!type){return;}
    if(type == 'list'){
      $('#header').hide();
    }else{
      $('#header').show();
    }
    $('#header').find('.active').removeClass('active');
    $('#header .'+type).parent('.header').addClass('active');

}

//open tab
function openTab(type){
    //login
    var userData = $api.getStorage('mine');
		if(!userData){
			api.openWin({
		        name: 'login',
		        url: './html/login.html',
		        opaque: true,
		        vScrollBarEnabled:false
		    });
		    return;
		}

    type = type || 'main';

    $('#nav').find('.active').removeClass('active');
    $('#nav .'+type).addClass('active');

    showHeader(type);
    var width = api.winWidth;
    var nav = $api.byId('nav');
    var navPos = $api.offset(nav);
    var header = $api.byId('header');
    var headerPos = $api.offset(header);
    var height = api.winHeight - navPos.h - headerPos.h;
    //record page id
    prevPid = curPid;
    curPid = type;


    api.setFrameAttr({
        name: 'list-f',
        hidden: true
    });

    if(type == 'list'){
      api.setFrameAttr({
          name: 'list-f',
          hidden: false
      });
    }

    if(prevPid !== curPid){
        if(isOpened(type)){
            api.setFrameAttr({
                name: type,
                hidden: false
            });
        }else{
            api.openFrame({
                name: type,
                url: 'html/'+ type +'.html',
                bounces: false,
                opaque: true,
                bgColor: '#fff',
                pageParam:{ headerHeight: headerPos.h},
                rect: {
                    x: 0,
                    y: headerPos.h,
                    w: width,
                    h: height
                },
                reload: true,
            });
        }
        if(prevPid){
            api.setFrameAttr({
                name: prevPid,
                hidden: true
            });
        }
        if(!isOpened(type)){
            //save frame name
            frameArr.push(type);
        }
    }
}

function openEnterprise(){
  api.openWin({
      name: 'enterprise-select',
      url: 'html/enterprise-select.html',
      opaque: true,
      vScrollBarEnabled:false,
      pageParam: {
        data: enterpriseList,
        id: curenterpriseId
      },
  });
}


function getEnterpriseList(){
  var userData = $api.getStorage('mine');
  api.showProgress({
      title:'加载中',
      modal:false
  });
  ajaxRequest('post', {
      apiCode: "ENTERPRISE_LIST",
      userId: userData.userId,
      requestData: {}
  }, function (ret, err) {
      api.hideProgress();
      if (ret.code == 200) {
        enterpriseList = ret.result || [];
      } else {
        api.toast({
            msg: ret.message,
            location: 'middle'
        });
        return false;
      }
  });
}

var clickCount = 1;
var timePicker;

apiready = function(){
    var header = $api.byId('header');
    $api.fixStatusBar(header);
    api.setStatusBarStyle({
        style: 'light'
    });

    openTab('main');
    //无首页权限是不显示地图按钮
    if(!filterLimit('main')){
        $('#open-map-btn').hide();
    }
    api.addEventListener({
        name: 'indexChange'
    }, function (ret, err) {
      if(ret.value){
        openTab(ret.value.key);
      }
    });

    api.addEventListener({
        name: 'to_login'
    }, function(res, err) {
      $api.clearStorage();
      api.removeLaunchView({
          animation: {
              type: 'fade',
              duration: 500
          }
      });
      var toCloseWin = [
            "main",
            "control",
            "list",
            "user",
        ];
        for (var p in toCloseWin) {
            api.closeWin({
                name: toCloseWin[p]
            });
        }

        api.openWin({
            name: 'login',
            url: 'html/login.html',
            opaque: true,
            vScrollBarEnabled:false
        });

    });
    // api.addEventListener({
  	//     name: 'enterpriseSelect'
  	// }, function(ret, err) {
  	// 	var item = ret.value;
  	// 	curenterpriseId = item.id;
  	// });
    api.addEventListener({
        name: 'keyback'
    }, function (ret, err) {
        clearTimeout(timePicker);
        if (clickCount != 2) {
            api.toast({
                msg: '再按一次返回系统桌面'
            }, 'middle');
            clickCount++;
            timePicker = setTimeout(function () {
                clickCount = 1;
            }, 1000);
        } else {
            clickCount = 1;
            api.toLauncher();
        }
    });
};

function openMapWin(){
  api.openWin({
      name: 'control',
      url: 'html/control.html',
  });
}
