//进行本地请求
let myRequestToken = app.powerLocal();
$(function () {
    //判断页面是否填写的函数
    function judge(myData, myText) {
        if (!myData) {
            myData = "";
            layer.open({
                content: myText,
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return 1;
        }
    };

    $.ajax({
        type: "GET",
        url: app.apiUrl + "/doctor/getInfo" + `?t=${Date.now()}`,
        success: function (res) {
            if (res.code == 200) {
                var res_data = JSON.parse(res.data);
                $(".form-big-box .form-tel span").text(res_data.phone)
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
    //获取医生信息并渲染页面 结束
    //点击进行信息验证 开始
    ;
    (function (window) {
        //防止用户重复点击验证码的变量
        let code_flag_pw = 1;
        $(".form-big-box .code-send").click(
            function () {
                var validateVal = $(".form-big-box .form-tel span").text();
                if (judge(validateVal, "请输入电话号码") == 1) return false;
                if (!app.telReg.test(validateVal)) {
                    layer.open({
                        content: "电话号码格式不正确",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                };
                if (code_flag_pw == 0) return false;
                var that = this;
                var saveAddress = {
                    phone: validateVal,
                }
                $.ajax({
                    type: "GET",
                    url: app.apiUrl + "/doctor/getYZM" + `?t=${Date.now()}`,
                    data: saveAddress,
                    success: function (res) {
                        if (res.code == 200) {
                            console.log(res.data);
                        } else {
                            layer.open({
                                content: res.msg,
                                skin: 'msg',
                                time: 2 //2秒后自动关闭
                            });
                        }
                    },
                    error: function (e) {
                        layer.open({
                            content: e.responseJSON.message,
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    }
                })
                var num = 60;
                code_flag_pw = 0;
                var timer = setInterval(function () {
                    that.innerText = num-- + "秒后可重发";
                    if (num < 0) {
                        that.innerText = "发送验证码";
                        code_flag_pw = 1;
                        clearInterval(timer);
                    }
                }, 1000);
            }
        );
        $(".headbox .right-text").click(
            function () {
                var validateVal = $(".form-big-box .form-tel span").text();
                var phone_login = document.querySelector("#test-code").value;
                var oldPw = document.querySelector("#oldPw").value;
                var forget_new_psd = document.querySelector("#newPw").value;
                var forget_psd = document.querySelector("#newPwAgain").value;
                if (judge(validateVal, "请先填写手机号") == 1) return false;
                if (!app.telReg.test(validateVal)) {
                    layer.open({
                        content: "电话号码格式不正确",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                };

                if (judge(oldPw, "请输入旧密码") == 1) return false;
                if (!app.passwordReg.test(oldPw)) {
                    layer.open({
                        content: "旧密码格式不正确",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                };
                if (judge(forget_new_psd, "请输入新密码") == 1) return false;
                if (!app.passwordReg.test(forget_new_psd)) {
                    layer.open({
                        content: "新密码格式不正确",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                };
                if (forget_new_psd != forget_psd) {
                    layer.open({
                        content: "两次输入的密码不一致",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (!/^\d{6}$/.test(phone_login)) {
                    layer.open({
                        content: "验证码必须是六位数字",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                let myKeyPsw = app.changeKey({
                    psw: forget_psd,
                    type: 0
                });
                let myoldKeyPsw = app.changeKey({
                    psw: oldPw,
                    type: 0
                })
                let savePassword = {
                    phone: validateVal,
                    verificationCode: phone_login,
                    newPassword: myKeyPsw,
                    password:myoldKeyPsw,
                    repeatPassword: myKeyPsw,
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json;charset=UTF-8",
                    url: app.apiUrl + "/doctor/findPassword" + `?t=${Date.now()}`,
                    data: JSON.stringify(savePassword),
                    success: function (res) {
                        if (res.code == 200) {
                            location.replace("./management.html");
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
                })
            }
        );

        $(".left-arrow").click(function () {
            location.replace("./management.html");
        })
    })(window);
    //点击进行信息验证 结束
})