window.onload = function () {
    /* 存储名字 密码 token 存30分钟  */
    let username = getCookie("username");
    let password = getCookie("password");
    let user_flag = getCookie("flag");
    let token = getCookie("token");
    // var vConsole = new VConsole();

    /* 存储名字 密码 token 存30分钟  */
    // setCookie("username","liting",30);
    // setCookie("password","12345",30);
    // setCookie("token","1234",30);
    // console.log(123);

    /* 设置 cookie 储存 */
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";path=/";
        // document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
    }
    /* 登录首页tab切换 */
    app.tab({
        top: "#login ul",
        bottom: ".login-tab-inner",
        active: "active",
        callback: function () { },
    })
    /* 登录首页tab切换 */

    /* 忘记密码账户tab切换 开始 */
    app.tab({
        top: "#forget ul",
        bottom: ".new-tab-inner",
        active: "active",
        callback: function () { },
    })
    /* 忘记密码账户tab切换 结束*/

    /* 忘记密码账户结果tab切换 开始*/
    app.tab({
        top: "#forgetRes ul",
        bottom: ".forget-tab-inner",
        active: "active",
        callback: function () { },
    })
    /* 忘记密码账户结果tab切换 结束*/

    /* 密码登录与账户登录切换 开始*/
    app.tab({
        top: "#tabLogin",
        bottom: ".bot-tab",
        active: "active-tabLogin",
    })
        /* 密码登录与账户登录切换 结束*/

        /* 忘记账户/密码 开始 */
        ;
    (function (window) {
        /* 忘记账号或密码 */
        $("#login .jump .forget").eq(0).click(
            function () {
                $("#login").hide();
                $("#forgetRes").show();
                //清除忘记账户和密码页面所有input里面的信息
                $("#forgetRes input[type=text]").val("");
                $("#forgetRes input[type=tel]").val("");
                $("#forgetRes input[type=password]").val("");
                $("#forgetRes ul li").eq(0).addClass("active").siblings().removeClass("active");
                $("#forget-pw-test").show().siblings().hide();
            }
        );
        /* 忘记账号 */
        $("#login .jump .forget").eq(1).click(
            function () {
                $("#login").hide();
                $("#forgetRes").show();
                //清除忘记账户和密码页面所有input里面的信息
                $("#forgetRes input[type=text]").val("");
                $("#forgetRes input[type=tel]").val("");
                $("#forgetRes input[type=password]").val("");
                $("#forgetRes ul li").eq(1).addClass("active").siblings().removeClass("active");
                $("#forget-account-test").show().siblings().hide();
            }
        );
        $("#forgetRes .go").click(
            function () {
                $("#forgetRes").hide();
                $("#login").show();
            }
        );
        $("#forget .go").click(
            function () {
                $("#forget").hide();
                $("#login").show();
            }
        );
        //忘记密码确认页 开始
        ;
        (function (window) {
            let code_flag_pw = 1;
            $("#get-test-code").click(
                function () {
                    var validateVal = document.querySelector("#forget-phone-code").value;
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
            )
            $("#forgetRes .content-three #password-yes").click(
                function () {
                    var validateVal = document.querySelector("#forget-phone-code").value;
                    var phone_login = document.querySelector("#forget-test-code").value;
                    var forget_new_psd = document.querySelector("#forget-pw-test .new-psd").value;
                    var forget_psd = document.querySelector("#forget-pw-test .psd").value;
                    if (judge(validateVal, "请先填写手机号") == 1) return false;
                    if (!app.telReg.test(validateVal)) {
                        layer.open({
                            content: "电话号码格式不正确",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                        return false;
                    };
                    if (judge(phone_login, "请先填写验证码") == 1) return false;
                    if (judge(forget_new_psd, "请填写新密码") == 1) return false;
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

                    let forgetKeyPwd = app.changeKey({
                        psw: forget_new_psd,
                        type: 0
                    });


                    let savePassword = {
                        phone: validateVal,
                        verificationCode: phone_login,
                        newPassword: forgetKeyPwd,
                        repeatPassword: forgetKeyPwd,
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json;charset=UTF-8",
                        url: app.apiUrl + "/doctor/findPassword" + `?t=${Date.now()}`,
                        data: JSON.stringify(savePassword),
                        success: function (res) {
                            if (res.code == 200) {
                                $("#forgetRes").hide();
                                $("#forget").show();
                                $("#forget .content-four .new span").text(forget_psd);
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
                }
            )
        })(window);

        //忘记密码确认页 结束

        //忘记账户页 开始
        ;
        (function (window) {
            //限制验证码重复点击的变量
            let code_flag_pw = 1;
            $("#forget-account-test .five-code-wz").click(
                function () {
                    var validateVal = document.querySelector("#forget-account-test .five-tel").value;
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
            $("#forget-account-test .five-yes").click(
                function () {
                    var validateVal = document.querySelector("#forget-account-test .five-tel").value;
                    var phone_login = document.querySelector("#forget-account-test .five-code").value;
                    if (judge(validateVal, "请先填写手机号") == 1) return false;
                    if (!app.telReg.test(validateVal)) {
                        layer.open({
                            content: "电话号码格式不正确",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                        return false;
                    };
                    if (judge(phone_login, "请先填写验证码") == 1) return false;

                    let savePassword = {
                        phone: validateVal,
                        verificationCode: phone_login,
                    };
                    $.ajax({
                        type: "POST",
                        contentType: "application/json;charset=UTF-8",
                        url: app.apiUrl + "/doctor/findAccountNumber" + `?t=${Date.now()}`,
                        data: JSON.stringify(savePassword),
                        success: function (res) {
                            if (res.code == 200) {
                                $("#forgetRes").hide();
                                $("#forget").show();
                                $("#forget .content-sex .new span").text(res.data);
                                $("#forget .click-my-account").click();
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
                }
            )
        })(window);

        //忘记账户页 结束
    })(window);
    /* 忘记账户/密码 结束 */


    /* 记住账号和记住密码 开始*/
    ;
    (function (window) {
        //进行一系列有没有cookie的判断
        if (username) {
            $("#account-yes").show();
            $("#username").val(username);
        } else {
            $("#account-yes").hide();
            $("#username").val("");
        }
        if (password && username) {
            $("#password-yes").show();
            $("#password").val(password);
        } else {
            $("#password-yes").hide();
            $("#password").val("");
        }

        // if (user_flag == 1) {
        //     $("#account-yes").hide();
        //     $("#password-yes").show();
        // }
        // $("#password").focus(
        //     function () {
        //         if ($("#username").val() == username) {
        //             if (user_flag == 1) {
        //                 $("#password").val(password);
        //             } else {
        //                 $("#password").val("");
        //             }
        //         }

        //     }
        // )
        //勾选账户
        $("#account-name").click(
            function () {
                if ($("#account-yes").is(":hidden")) {
                    $("#account-yes").show();
                } else {
                    $("#password-yes").hide();
                    $("#account-yes").hide();
                }
            }
        );
        $("#remember-account").click(
            function () {
                if ($("#account-yes").is(":hidden")) {
                    $("#account-yes").show();
                } else {
                    $("#password-yes").hide();
                    $("#account-yes").hide();
                }
            }
        )
        //勾选密码
        $("#account-pass").click(
            function () {
                if ($("#account-yes").is(":hidden")) {
                    $("#password-yes").show();
                    $("#account-yes").show();
                    return false;
                }
                $("#password-yes").toggle();
            }
        )
        $("#remember-password").click(
            function () {
                if ($("#account-yes").is(":hidden")) {
                    $("#password-yes").show();
                    $("#account-yes").show();
                    return false;
                }
                $("#password-yes").toggle();
            }
        )
    })(window);
    /* 记住账号和记住密码 结束*/
    /* 首页 开始 */

    //账号登录 开始
    ;
    (function (window) {
        $("#doctor-login-btn").click(
            function () {
                var userValue = $(".lis-text #username").val();
                var passwordValue = $(".lis-text #password").val();
                let cookie_flag = 0;
                if (!app.accountNameReg.test(userValue)) {
                    layer.open({
                        content: "账号由4-20位数字和字母组成",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (!app.passwordReg.test(passwordValue)) {
                    layer.open({
                        content: "密码由6-12位数字和字母组成",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (!$("#account-yes").is(":hidden")) {
                    setCookie("username", userValue, 30);
                    cookie_flag++;
                } else {
                    setCookie("username", "", 30);
                }
                if (!$("#password-yes").is(":hidden")) {
                    setCookie("password", passwordValue, 30);
                    cookie_flag++;
                } else {
                    setCookie("password", "", 30);
                }
                // if ($("#account-yes").is(":hidden") && !$("#password-yes").is(":hidden")) {
                //     setCookie("password", passwordValue, 30);
                //     setCookie("username", userValue, 30);
                //     setCookie("flag", 1, 30);
                // }
                // console.log(app.changeKey({psw:passwordValue,type:0}));
                var saveAddress = {
                    userName: userValue,
                    secretKey: app.changeKey({
                        psw: passwordValue,
                        type: 0
                    }),
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json;charset=UTF-8",
                    url: app.apiUrl + "/login" + `?t=${Date.now()}`,
                    data: JSON.stringify(saveAddress),
                    success: function (res) {
                        if (res.code == 200) {
                            if (cookie_flag == 2) {
                                // setCookie("token", res.data.token, 30);
                            } else {
                                // setCookie("token", "", 30);
                            };
                            var t = JSON.parse(res.data);
                            localStorage.setItem("requestToken", JSON.stringify(t));
                            location.replace("./management.html");
                        } else {
                            layer.open({
                                content: res.msg,
                                skin: 'msg',
                                time: 2 //2秒后自动关闭
                            });
                        }
                    },
                    error: function (e) {
                        console.log(e);

                        layer.open({
                            content: e.responseJSON.message,
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    }
                })
            }
        );
    })(window);


    //手机登录 开始
    ;
    (function (window) {
        let code_flag = 1;
        $("#phone-login .getCode").click(
            function () {
                var validateVal = document.querySelector("#login-phone-code").value;
                if (judge(validateVal, "请输入电话号码") == 1) return false;
                if (!app.telReg.test(validateVal)) {
                    layer.open({
                        content: "电话号码格式不正确",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                };
                if (code_flag == 0) return false;
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
                code_flag = 0;
                var timer = setInterval(function () {
                    that.innerText = num-- + "秒后可重发";
                    if (num < 0) {
                        that.innerText = "发送验证码";
                        code_flag = 1;
                        clearInterval(timer);
                    }
                }, 1000);
            }
        )
        $(".logins #login-password-confirm").click(
            function () {
                var validateVal = document.querySelector("#login-phone-code").value;
                var phone_login = document.querySelector("#phone-login .password").value;
                if (judge(validateVal, "请先填写手机号") == 1) return false;
                if (!app.telReg.test(validateVal)) {
                    layer.open({
                        content: "电话号码格式不正确",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                };
                if (judge(phone_login, "请先填写验证码") == 1) return false;
                let saveAccount = {
                    phone: validateVal,
                    verificationCode: phone_login,
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json;charset=UTF-8",
                    url: app.apiUrl + "/loginyzm" + `?t=${Date.now()}`,
                    data: JSON.stringify(saveAccount),
                    success: function (res) {
                        if (res.code == 200) {
                            var t = JSON.parse(res.data);
                            localStorage.setItem("requestToken", JSON.stringify(t));
                            location.replace("management.html");
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
            }
        )

    })(window);
    //手机登录 结束

    //员工账户登录 开始
    ;
    (function (window) {
        $("#staff-login-btn").click(
            function () {
                var doctor_username = $(".staff-account .doctor-username").val();
                var staff_username = $(".staff-account .staff-username").val();
                var password = $(".staff-account .password").val();
                if (!app.accountNameReg.test(doctor_username)) {
                    layer.open({
                        content: "医生账户必须是4-20位数字或字母",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (!app.accountNameReg.test(staff_username)) {
                    layer.open({
                        content: "员工账户必须是4-20位数字或字母",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (!app.passwordReg.test(password)) {
                    $(".staff-account .password").val("")
                    layer.open({
                        content: "密码必须是6-12位的数字或字母",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }


                var saveAddress = {
                    userName: staff_username,
                    secretKey: app.changeKey({
                        psw: password,
                        type: 0
                    }),
                    accountNumber: doctor_username,
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/json;charset=UTF-8",
                    url: app.apiUrl + "/login" + `?t=${Date.now()}`,
                    data: JSON.stringify(saveAddress),
                    success: function (res) {
                        if (res.code == 200) {
                            var t = JSON.parse(res.data);
                            localStorage.setItem("requestToken", JSON.stringify(t));
                            location.href = "management.html";
                        } else {
                            layer.open({
                                content: res.msg,
                                skin: 'msg',
                                time: 2 //2秒后自动关闭
                            });
                        }
                    },
                    // beforeSend:function(xhr) {
                    //     xhr.setRequestHeader("Authorization",token);
                    // },
                    error: function (e) {
                        layer.open({
                            content: e.responseJSON.message,
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    }
                })
            }
        )
    })(window);
    //员工账户登录 结束

    //注册页面的事件 开始
    ;
    (function (window) {
        //限制重复点击注册按钮
        let register_click_flag = 0;
        //注册按钮 开始
        $("#doctor-login #confirm-btn").click(
            function () {
                var doctor_name = $("#doctor-login .doctor-name").val();
                var doctor_hospital = $("#doctor-login .doctor-hospital").val();
                //判断省市区
                var country = $("#doctor-login .country select").val();
                var provice = $("#doctor-login .provice select").val();
                var cityVal = $("#doctor-login .city select").val();
                var areaVal = $("#doctor-login .area select").val();
                var address = $("#doctor-login .address").val();
                var tel = $("#doctor-login .tel").val();
                var code = $("#doctor-login .code").val();
                var mailbox = $("#doctor-login .mailbox").val();
                var new_zh = $("#doctor-login .new-zh").val();
                var new_psd = $("#doctor-login .once_psd").val();
                var psd = $("#doctor-login .repeat_psd").val();
                if (judge(doctor_name, "请填写医生姓名") == 1) return false;
                if (!app.userNameReg.test(doctor_name)) {
                    $("#doctor-login .doctor-name").val("");
                    layer.open({
                        content: "医生姓名格式不正确",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                };
                if (judge(doctor_hospital, "请填写诊所/医院") == 1) return false;
                if (!country) {
                    layer.open({
                        content: "请选择国家",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (country == "中国" && (!provice || !cityVal || !areaVal)) {
                    layer.open({
                        content: "请选择省市区",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (judge(tel, "手机号码没有填写") == 1) return false;
                if (!app.telReg.test(tel)) {
                    layer.open({
                        content: "手机格式不正确",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                };
                if (!/^\d{6}$/.test(code)) {
                    layer.open({
                        content: "验证码必须是六位数字",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (mailbox && !app.emailReg.test(mailbox)) {
                    layer.open({
                        content: "电子邮箱格式不正确",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (!app.accountNameReg.test(new_zh)) {
                    layer.open({
                        content: "账户格式必须是4-20位数字和字母",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (!app.passwordReg.test(new_psd)) {
                    $("#doctor-login .new-zh").val("");
                    layer.open({
                        content: "密码格式必须是6-12位的数字或英文",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (psd != new_psd) {
                    $("#doctor-login .psd").val("");
                    layer.open({
                        content: "两次输入的密码不一致",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                let key_paw = app.changeKey({
                    psw: psd,
                    type: 0
                });
                let saveAddress = {
                    realname: doctor_name,
                    country: country,
                    countriesId: $(".country select").find("option:selected").attr("data-prId"),
                    provinceId: $(".provice select").find("option:selected").attr("data-prId"),
                    cityId: $(".city select").find("option:selected").attr("data-cityId"),
                    areaId: $(".area select").find("option:selected").attr("data-cityId"),
                    hospitalName: doctor_hospital,
                    verificationCode: code,
                    province: provice,
                    city: cityVal,
                    area: areaVal,
                    address: address,
                    phone: tel,
                    email: mailbox,
                    accountNumber: new_zh,
                    password: key_paw,
                    repeatPassword: key_paw
                }
                if (register_click_flag == 1) return false;
                register_click_flag = 1;
                $.ajax({
                    type: "POST",
                    contentType: "application/json;charset=UTF-8",
                    url: app.apiUrl + "/doctor/registerDoctor" + `?t=${Date.now()}`,
                    data: JSON.stringify(saveAddress),
                    success: function (res) {
                        if (res.code == 200) {
                            $("#doctor-login").hide();
                            $("#index-login").show();
                            $("#index-login #login").hide();
                            $("#index-login #register").show();
                            $("#index-login #register .content-eight").show();
                            $("#register").find(".eight-zh span").text(new_zh);
                            $("#register").find(".eight-psd span").text(psd);
                        } else {
                            layer.open({
                                content: res.msg,
                                skin: 'msg',
                                time: 2 //2秒后自动关闭
                            });
                        }
                        register_click_flag = 0;
                    },
                    // beforeSend:function(xhr) {
                    //     xhr.setRequestHeader("Authorization",token);
                    // },
                    error: function (e) {
                        layer.open({
                            content: e.responseJSON.message,
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                        register_click_flag = 0;
                    }
                })
            }
        )
        //注册按钮 结束
        function getCountry() {
            $.ajax({
                type: "GET",
                url: app.apiUrl + "/region/countryList" + `?t=${Date.now()}`,
                success: function (res) {
                    if (res.code == 200) {
                        var res_data = JSON.parse(res.data);
                        let arr = [];
                        res_data.forEach((ele, i) => {
                            let str = `
                                <option value='${ele.countriesName}' data-prId='${ele.countriesId}'>${ele.countriesName}</option>
                            `
                            arr.push(str);
                        });
                        var country = `<option value=''>国家</option>` + arr.join("");
                        $(".country select").html(country);
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
        }

        function requestAddress(myId, myUrl, selectEle, arrName, provinceId) {
            let saveAddress = {
                countriesId: myId,
            }
            $.ajax({
                type: "GET",
                url: app.apiUrl + myUrl + `?t=${Date.now()}`,
                data: saveAddress,
                success: function (res) {
                    if (res.code == 200) {
                        var res_data = JSON.parse(res.data);
                        let arr = [];
                        res_data.forEach((ele, i) => {
                            let str = `
                                <option value='${ele[arrName]}' data-prId='${ele[provinceId]}'>${ele[arrName]}</option>
                            `
                            arr.push(str);
                        });
                        var province = `<option value=''>省</option>` + arr.join("");
                        $(selectEle).html(province);
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
        };
        //页面一开始就对三级联动进行渲染 开始
        /* 点击注册成为医生*/
        $(".jump .register").click(
            function () {
                $("#index-login").hide();
                $("#doctor-login").show();
                // 进入页面就渲染国家级
                getCountry();
            }
        );
        // 国家改变渲染省级
        $(".country select").change(function () {
            // 当国家发生改变时 省市区清除
            $(".provice option").eq(0).attr("selected", "true");
            $(".city option").eq(0).attr("selected", "true");
            $(".area option").eq(0).attr("selected", "true");
            [...$(".provice").find("option")].forEach((item, index) => {
                if (index != 0) {
                    $(item).remove();
                }
            });
            [...$(".city").find("option")].forEach((item, index) => {
                if (index != 0) {
                    $(item).remove();
                }
            });
            [...$(".area").find("option")].forEach((item, index) => {
                if (index != 0) {
                    $(item).remove();
                }
            });
            var prId = $(this).find("option:selected").attr("data-prId");
            if (prId)
                requestAddress(prId, "/region/provinceList", ".municipalities .provice select", "provinceName", "provinceId");
        })

        // 省级改变渲染市级
        $(".municipalities .provice select").change(
            function () {
                var prId = $(this).find("option:selected").attr("data-prId");
                if (prId) {
                    let saveAddress = {
                        provinceId: prId,
                    }
                    $.ajax({
                        type: "GET",
                        url: app.apiUrl + "/region/cityList" + `?t=${Date.now()}`,
                        data: saveAddress,
                        success: function (res) {
                            if (res.code == 200) {
                                var res_data = JSON.parse(res.data);
                                let arr = [];
                                res_data.forEach((ele, i) => {
                                    let str = `
                                        <option value='${ele.cityName}' data-cityId='${ele.cityId}'>${ele.cityName}</option>
                                    `
                                    arr.push(str);
                                });
                                var city = `<option value=''>市</option>` + arr.join("");
                                $(".municipalities .city select").html(city);
                                $(".municipalities .area select").html(`<option value=''>区</option>`);
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
                }

            }
        )
        //市级改变渲染区
        $(".municipalities .city select").change(
            function () {
                var prId = $(this).find("option:selected").attr("data-cityId");
                if (prId) {
                    let saveAddress = {
                        cityId: prId,
                    }
                    $.ajax({
                        type: "GET",
                        url: app.apiUrl + "/region/areaList" + `?t=${Date.now()}`,
                        data: saveAddress,
                        success: function (res) {
                            if (res.code == 200) {
                                var res_data = JSON.parse(res.data);
                                let arr = [];
                                res_data.forEach((ele, i) => {
                                    let str = `
                                        <option value='${ele.areaName}' data-cityId='${ele.areaId}'>${ele.areaName}</option>
                                    `
                                    arr.push(str);
                                });
                                var area = `<option value=''>区</option>` + arr.join("");
                                $(".municipalities .area select").html(area);
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
                }
            }
        )
        //页面一开始就对三级联动进行渲染 结束
        //发送验证码 开始
        function registerCodeClick() {
            let code_flag = 1;
            $("#doctor-login .code-box .code-wz").click(
                function () {
                    var validateVal = document.querySelector(".content-seven .tel").value;
                    var that = this;
                    var saveAddress = {
                        phone: validateVal,
                    }
                    if (validateVal) {
                        if (app.telReg.test(validateVal)) {
                            if (code_flag == 0) return false;
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
                                // beforeSend:function(xhr) {
                                //     xhr.setRequestHeader("Authorization",token);
                                // },
                                error: function (e) {
                                    layer.open({
                                        content: e.responseJSON.message,
                                        skin: 'msg',
                                        time: 2 //2秒后自动关闭
                                    });
                                }
                            })
                            var num = 60;
                            code_flag = 0;
                            var timer = setInterval(function () {
                                that.innerText = num-- + "秒后可重发";
                                if (num < 0) {
                                    that.innerText = "发送验证码";
                                    code_flag = 1;
                                    clearInterval(timer);
                                }
                            }, 1000)
                        } else {
                            layer.open({
                                content: "电话号码格式不正确",
                                skin: 'msg',
                                time: 2 //2秒后自动关闭
                            });
                        }
                    } else {
                        layer.open({
                            content: "请填写电话号码",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    }
                }
            )
        }
        registerCodeClick();
        //发送验证码 结束

        //注册成功展示 开始
        $("#register .go").click(
            function () {
                $("#register").hide();
                $("#index-login #login").show();
            }
        )
        //注册成功展示 结束

        //返回登录页面 开始
        $("#doctor-login .go").click(
            function () {
                $("#doctor-login").hide();
                $("#index-login").show();
            }
        )
        //返回登录页面 结束

        //输入信息,让小红点消失
        $("#doctor-login .tips-box input").on("input onpropertychange", function () {
            $(this).parent().addClass("active");
        })
    })(window);
    //注册页面的事件 结束

}