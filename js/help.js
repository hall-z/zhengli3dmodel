/* 帮助中心tab切换 */
app.tab({
    top: ".tab ul",
    bottom: ".message ul",
    active: "active",
    callback: function () { },
})
/* 帮助中心tab切换 */
/* 接口 */

var file = {}
var mytoke = app.powerLocal();
let isDoctorType = mytoke.type;

$(function () {
    /* 判断是医生还是员工身份 员工不能新建病例*/
if (isDoctorType == 2) {
        $(".menu-box .menu-list li").eq(1).hide();
        $(".menu-box .menu-list li").eq(3).hide();
        $(".menu-box .menu-list li").eq(4).hide();
    }
    $.ajax({
        type: "get",
        url: app.apiUrl + "/caseInfo/download?t=" + app.random,
        async: false,
        beforeSend: function (xhr) {
            //不携带这个会报错
            xhr.setRequestHeader("Authorization", mytoke.token);
        },
        /* 成功的回调 */
        success: function (res) {
            if (res.code == 200) {
                var data = JSON.parse(res.data);
                file = data;
                // console.log(data)
                $(".file-btn").eq(0).get(0).href = file.order;
                // $(".file-btn").eq(1).get(0).href = file.orthoplus;
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
})
