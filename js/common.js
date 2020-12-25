window.app = {
    // 获取 屏幕宽高
    winW: window.innerWidth,
    winH: window.innerHeight,
    /* 请求接口的公共地址  */
    apiUrl: "http://210.22.120.218:8605/web",
    imgUrl: "http://210.22.120.218:8605/output",
    teethArr: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
    /* 密码的正则表达式 */
    passwordReg: /^[\da-zA-Z]{6,12}$/,
    /* 账号的正则表达式 */
    // accountNameReg: /^[a-zA-Z]\w{5,11}$/,
    accountNameReg: /^[a-zA-Z\w]{4,20}$/,
    /* 姓名的正则表达式 */
    userNameReg: /^[a-zA-Z\w\u4E00-\u9FA5\uf900-\ufa2d]{1,16}$/,
    /* 电话的正则表达式 */
    telReg: /^1[3456789]\d{9}$/,
    /* 邮箱的正则表达式 */
    emailReg: /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/,
    random: new Date().getTime(),
    init: function () {
        // 默认设备横屏的时候出现提示
        let screenOrientationTip = new LandscapeTip();
        // 解决手机 键盘
        $('input').blur(function () {
            setTimeout(() => {
                var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
                window.scrollTo(0, Math.max(scrollHeight, 0))
            }, 100)
        });

        let winW = document.body.clientWidth;
        let winH = document.body.clientHeight;
        //加载页面时执行一次
        changeMargin();
        //监听浏览器宽度的改变
        window.onresize = function () {
            changeMargin();
        };

        function changeMargin() {
            //获取网页可见区域宽度
            if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                // console.log(navigator.userAgent);
                if (navigator.userAgent.match(/(pad|pod|iPod|iPad)/i)) {
                    // console.log(2222);
                    //移除提示监控
                    screenOrientationTip.removeEventListenerHandle();
                    $("#orientationTipBox").hide();
                } else {
                    // console.log(3333);


                    if (navigator.userAgent.match(/(Android|phone|Mobile|Windows Phone)/i) && winW > winH) {
                        $("#orientationTipBox").show();
                        // 也可以再次加上监控
                        screenOrientationTip.addEventListenerHandle();
                    }
                    //
                }
            } else {
                //pc
                window.location.replace("http://magicalign.h5.yscase.com")
            }
        };

        /* 所有弹窗出现阻止滑动 */
        $("body").on("touchmove", function () {
            // console.log($(this).scrollTop());
            let layerDom = document.querySelectorAll(".layer-big");
            [...layerDom].forEach(item => {
                if (!$(item).is(":hidden")) {
                    $("body").addClass("beyond");
                    return false;
                }
            });
        });
        $("body").on("touchend", function () {

            let layerDom = document.querySelectorAll(".layui-ys-layer");
            if (layerDom.length > 0) {
                $("body").removeClass("beyond");
            }
        });
    },
    image2Base64: function (imgurl, callback) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            // console.log(imgurl);
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var dataURL = canvas.toDataURL("image/png");
            // console.log(dataURL);
            callback && callback(dataURL)
        }
        img.src = imgurl;
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    },
    // 线上图片转file文件类型,返回promise对象
    sendFn: function (img) {
        // function ajax(file) {
        //     const data1 = {
        //         caseId: 764,
        //         stageName: 2,
        //         stageCount: 7,
        //         fileNumber: 3,
        //         add: 'Y',
        //         file: file
        //     }
        //     var eightFormdata = new FormData();
        //     for (var k in data1) {
        //         eightFormdata.append(k, data1[k]);
        //     }
        // }

        // 转换为base4的主要方法
        function getBase64Image(img, width, height) {
            let canvas = document.createElement('canvas');
            canvas.width = width || img.width;
            canvas.height = height || img.height;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let dataURL = canvas.toDataURL();
            return dataURL;
        }

        //转文件对象
        function convertBase64ToBlob(base64) {
            var base64Arr = base64.split(',');
            var imgtype = '';
            var base64String = '';
            if (base64Arr.length > 1) {
                // 如果是图片base64，去掉头信息
                base64String = base64Arr[1];
                imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':') + 1, base64Arr[0].indexOf(';'));
            }
            // 将base64解码，atob() 方法用于解码使用 base-64 编码的字符串。
            var bytes = atob(base64String);
            var bytesCode = new ArrayBuffer(bytes.length);
            // 转换为类型化数组
            var byteArray = new Uint8Array(bytesCode);
            // 将base64转换为ascii码
            for (var i = 0; i < bytes.length; i++) {
                byteArray[i] = bytes.charCodeAt(i);
            }
            // 生成Blob对象（文件对象）
            return new Blob([bytesCode], {
                type: imgtype
            });
        };
        // 实现将项目的图片转化成base64
        return new Promise((resolve, reject) => {
            // 传入图片路径，返回base64
            let picImage = new Image();
            picImage.crossOrigin = 'Anonymous'
            if (img) {
                picImage.onload = function () {
                    const base64 = getBase64Image(picImage)
                    const picFile = new File([convertBase64ToBlob(base64)], img);
                    resolve(picFile); // 将base64传给done上传处理
                };
                picImage.src = img;
            } else {

                reject(new Error('图片路径没传'))

            }
        })
    },

    // base64格式图片 转为Blob
    base64ToBlob: function (urlData, type) {
        let arr = urlData.split(',');
        let mime = arr[0].match(/:(.*?);/)[1] || type;
        // 去掉url的头，并转化为byte
        let bytes = window.atob(arr[1]);
        // 处理异常,将ascii码小于0的转换为大于0
        let ab = new ArrayBuffer(bytes.length);
        // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
        let ia = new Uint8Array(ab);
        for (let i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], {
            type: mime
        });
    },

    tab: function (opt) {
        var opt_top = [...document.querySelector(opt.top).children];
        var opt_bottom = [...document.querySelector(opt.bottom).children];
        opt_top[0].classList.add(opt.active);
        opt_bottom[0].style.display = "block";
        opt_top.forEach((ele, i) => {
            ele.setAttribute("data-index", i);
            ele.onclick = function () {
                event.stopPropagation();
                for (let j = 0; j < opt_top.length; j++) {
                    opt_top[j].classList.remove(opt.active);
                }
                this.classList.add(opt.active);

                for (var t = 0; t < opt_bottom.length; t++) {
                    opt_bottom[t].style.display = "none";
                    if (this.getAttribute("data-index") == t) {
                        opt_bottom[t].style.display = "block";
                    }
                }
                opt.callback && opt.callback();
            }
        })
    },

    /* 
        举例:
        app.tab(
            {
                top : ".tab-top",
                bottom : ".tab-bottom",
                active : "active",
                callback : function(){},
            }
        )
    
        注:
            初始化默认是显示第一个
            top为点击的li的大盒子的类名或者id,如果是类名,请确保唯一
            bottom为下面切换的大盒子的类名或者id,如果是类名,请确保唯一
            重中之重,active 为加在top里的li的类名,一定要确保active的层级不会被覆盖
            callback为回调函数,点击完后执行,可写可不写
            top和bottom的盒子不一定为ul,也可以为div
    */
    //本地请求的接口
    powerLocal: function () {
        var requestToken = localStorage.getItem("requestToken");
        var myRequestToken = JSON.parse(requestToken);
        if (!myRequestToken) {
            location.replace("./index.html");
            return false;
        }
        return myRequestToken;
    },
    //公钥转化
    changeKey: function (myKey) {
        var encrypt = new JSEncrypt();
        if (myKey.type == 0) {
            var PUBLIC_KEY = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANNZMYQCOH5AJttvNgzOx77ALG4Z1Juqw62Pa529pY88i6tSi8UnPY+pIY2EAUTGeqZv1UicXGeVkYqAdRh7zisCAwEAAQ==";
            encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----' + PUBLIC_KEY + '-----END PUBLIC KEY-----');
        }
        if (myKey.type == 1) {
            var PRIVATE_KEY = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALwcyvYIGmhk+be320JWWsq1OYjiM0lzv8eHGMgSIOMLxzM/g9X7jguNe8thxJXR/CLqcTgsfZzk8E8Sc9+qnSDxNl5f5tga93vRxd5713zAeAGqLiTQnRffdzRmdbsmu5+0/K8mj056VhKh8FdBNzAj7e4iX9i+uBBG/oDmZbTVAgMBAAECgYEAmgNU5NTDkj9B+Pnt6UU8doSjw3+3j+bV2K2yS3QUOvAUus/Ax7x6ktjWxzCXvDY9IfUil2RNv9vtKEAqYLCWjc+lf8PV/yH1b7NEgyeAPBXtAJRoOnmYL2bdPW92kP9KgxJruF6Dz/C5AmMOncsvq8ABD+9Darn4p8dwj2ZC4O0CQQDf/AHmZsQokEItfCy4mHS9UbxbfIhEUv1ApPh/+Sr7NkJkHWYCtBQo+8jKO6zurAZQgWBPD1XX2UE4R+VIiZazAkEA1wAqtMvGhccyRZr+6kpkpDIa8+9jOE+nGUzqTDvgCID6as8AzOONFVVK6m/UUqkhcJ8Qu1pF36BGojy5BX2KVwJBAJSFpbji0hXXupowqfLp3RcgmNbNWAp+QUJZYhJx5cdYbmO2fssyH+AhPT6knYJR/YnqkDM8hv6vKCkqu2YDHjMCQAOA8TE5EOclM+CGghj3VWSHnIDVKdzFD4gOBNNxNlltIKeU8AJmwunSFgJ0CBXAw9a+ANvMwM7AIeaK7sj0HskCQAvxfDCq7gaNx+pfu0FHG8Gix08A/A6foggBl1fVu+L9sr9ZuOQ3HbXnl28F9ewuB9xdjnLUDjp7W7U0pB+vKoQ=";
            encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----' + PRIVATE_KEY + '-----END PUBLIC KEY-----');
        }
        var encrypted = encrypt.encrypt(myKey.psw);
        return encrypted;
    },
    /* 获取员工权限 */
    getStaffLimint: function (callback) {
        $.ajax({
            type: "get",
            url: app.apiUrl + "/staff/rights?t=" + app.random,
            // async: false,
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                if (res.code == 200) {
                    var data = JSON.parse(res.data);
                    console.log(data);
                    callback && callback(data);
                } else {
                    //提示
                    layer.open({
                        content: res.msg,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                }
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                //提示
                layer.open({
                    content: e.responseJSON.message,
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            }
        });
    }
};
app.init();

let activeUrl = location.href;
/* 获取菜单按钮 */
let menu = document.querySelector(".menu");
/* 获取菜单元素 */
let menuBox = document.querySelector(".menu-box");
/* 给菜单按钮注册点击事件 */
if (menu) menu.onclick = function () {
    /* 控制导航栏盒子显示 */
    $(".menu-box").fadeIn();
    $(".menu-list").css("animation", "fadeInRight .5s forwards");
    /* 添加选中样式 */
    for (var i = 0; i < menuBox.children[0].children.length; i++) {
        if (activeUrl.includes(menuBox.children[0].children[i].children[0].href) || menuBox.children[0].children[i].children[0].href.includes("javascript:;")) {
            menuBox.children[0].children[i].classList.add("menu-active");
        }
    }
}
/* 注册点击事件 */
if (menuBox) menuBox.onclick = function () {
    /* 控制导航栏盒子隐藏 */
    $(".menu-list").css("animation", "fadeOutRight .5s forwards")
    $(".menu-box").fadeOut();


    /* 清除选中样式 */
    $(".menu-list").on("transitionend", function () {
        for (var i = 0; i < menuBox.children[0].children.length; i++) {
            if (activeUrl.includes(menuBox.children[0].children[i].children[0].href)) {
                menuBox.children[0].children[i].classList.remove("menu-active");
            }
        }
    })

}

/* 点击导航 logo 回首页 */
$(".nav .logo").on("click", function () {
    location.replace("./management.html");
});



/* 退出登录 开始 */
;
(function (window) {
    /* 设置 cookie 储存 */
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /* 获取 cookie 储存 */
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }


    $(".nav .menu-list li:last-child a").click(function (e) {
        e.preventDefault();

        let myRequestToken = app.powerLocal();
        $.ajax({
            type: "GET",
            url: app.apiUrl + "/loginOut" + `?t=${Date.now()}`,
            success: function (res) {
                if (res.code == 200) {
                    //重置所有cookie
                    // setCookie("token", "", 30);
                    // setCookie("password", "", 30);
                    // setCookie("username", "", 30);
                    // setCookie("flag", "", 30);
                    location.replace("./index.html");
                    localStorage.clear();
                } else {
                    layer.open({
                        content: res.msg,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                }
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", myRequestToken.token);
            },
            error: function (e) {
                layer.open({
                    content: e.responseJSON.message,
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            }
        });
    })
})(window);
/* 退出登录 结束 */