
var isReady=false;var onReadyCallbacks=[];
var __uniConfig = {"pages":["pages/login/login","pages/login/register","pages/index/index","pages/holder/holder","pages/profile/profile","pages/profile/profileDetail/proDetail","pages/profile/profileDetail/changeEmail","pages/profile/profileDetail/changePassword","pages/profile/profileDetail/changeUsername","pages/profile/coffee/coffee","pages/profile/connectus/connectus","pages/service/service","pages/service/message/message","pages/service/message/messageDetail","pages/service/sign/sign","pages/service/sign/addCourse","pages/service/sign/signAccount","pages/service/sign/editCourse","pages/service/sign/addAccount","pages/service/sign/editAccount","pages/profile/coffee/pay","pages/index/update/update","pages/profile/coffee/paycode","pages/index/notice/notice","pages/service/code/code","pages/login/findPassword"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"FastSign","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8"},"tabBar":{"list":[{"text":"首页","pagePath":"pages/index/index","iconPath":"static/iconimg/index.png","selectedIconPath":"static/iconimg/index2.png"},{"text":"服务","pagePath":"pages/service/service","iconPath":"static/iconimg/service.png","selectedIconPath":"static/iconimg/service2.png"},{"text":"我的","pagePath":"pages/profile/profile","iconPath":"static/iconimg/profile.png","selectedIconPath":"static/iconimg/profile2.png"}],"backgroundColor":"#fff","selectedColor":"#333333"},"renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"快签","compilerVersion":"2.6.16","entryPagePath":"pages/login/login","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/login/login","meta":{"isQuit":true},"window":{"navigationBarBackgroundColor":"#fff","navigationStyle":"custom"}},{"path":"/pages/login/register","meta":{},"window":{"navigationStyle":"custom"}},{"path":"/pages/index/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"FastSign","navigationBarBackgroundColor":"#eee","enablePullDownRefresh":true}},{"path":"/pages/holder/holder","meta":{},"window":{}},{"path":"/pages/profile/profile","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"我的","navigationStyle":"custom"}},{"path":"/pages/profile/profileDetail/proDetail","meta":{},"window":{"navigationBarTitleText":"个人信息"}},{"path":"/pages/profile/profileDetail/changeEmail","meta":{},"window":{"navigationBarTitleText":"绑定邮箱"}},{"path":"/pages/profile/profileDetail/changePassword","meta":{},"window":{"navigationBarTitleText":"修改密码"}},{"path":"/pages/profile/profileDetail/changeUsername","meta":{},"window":{"navigationBarTitleText":"更改名字"}},{"path":"/pages/profile/coffee/coffee","meta":{},"window":{"navigationBarTitleText":"赞助"}},{"path":"/pages/profile/connectus/connectus","meta":{},"window":{"navigationBarTitleText":"联系他们"}},{"path":"/pages/service/service","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom"}},{"path":"/pages/service/message/message","meta":{},"window":{"navigationStyle":"custom"}},{"path":"/pages/service/message/messageDetail","meta":{},"window":{"navigationStyle":"custom"}},{"path":"/pages/service/sign/sign","meta":{},"window":{"navigationBarTitleText":"签到课程列表"}},{"path":"/pages/service/sign/addCourse","meta":{},"window":{"navigationBarTitleText":"添加课程"}},{"path":"/pages/service/sign/signAccount","meta":{},"window":{"navigationBarTitleText":"签到账号"}},{"path":"/pages/service/sign/editCourse","meta":{},"window":{"navigationBarTitleText":"编辑课程"}},{"path":"/pages/service/sign/addAccount","meta":{},"window":{"navigationBarTitleText":"添加账号"}},{"path":"/pages/service/sign/editAccount","meta":{},"window":{"navigationBarTitleText":"编辑账号"}},{"path":"/pages/profile/coffee/pay","meta":{},"window":{"navigationBarTitleText":"请喝咖啡"}},{"path":"/pages/index/update/update","meta":{},"window":{}},{"path":"/pages/profile/coffee/paycode","meta":{},"window":{"navigationBarTitleText":"扫码支付"}},{"path":"/pages/index/notice/notice","meta":{},"window":{"navigationBarTitleText":"公告"}},{"path":"/pages/service/code/code","meta":{},"window":{"navigationBarTitleText":"二维码生成器"}},{"path":"/pages/login/findPassword","meta":{},"window":{"navigationBarTitleText":"找回密码"}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});