var pcx = pcx || {};
$(function () {
    /* 存放登录页面的token */
    var token = localStorage.getItem("requestToken");
    var firstStep = {}; //第一步传递的对象
    var stockpile = {}; //储存第一步的对象
    var secondStep = {} //第二步传递的对象
    var thirdStep = {} //第三步传递的对象
    var fourStep = {} //第四步传递的对象
    var fiveStep = {} //第五步传递的对象
    var restart = false;
    if (app.getQueryString("restart")) {
        /* 重启 */
        restart = true;
        $(".case-management").fadeOut();
        $(".management-box").fadeIn();
        initBrand();
        firstStep.restart = restart;
    }

    pcx = pcx || {};
    pcx.dc = new Lunar(); // 天干地支年份计算 【我们不需要这个功能但没有这两句代码会报错】
    var date1 = new ruiDatepicker().init('#demo1');

    function initBrand() {
        $.ajax({
            type: "post",
            url: app.apiUrl + "/caseInfo/caseBrands",
            contentType: "application/json;charset=UTF-8",
            success: function (res) {
                if (res.code == 200) {
                    var data = JSON.parse(res.data);
                    var dataArray = [];
                    data.forEach(value => {
                        dataArray.push(`<li data-id = ${value.id}>
                        <div class="select">
                            <img src="img/unselected.png" class="unselected">
                            <img src="img/pitch-on.png" class="pitch-on">
                        </div>
                        <div class="ma">
                            <img src="${value.logo}">
                            <p>${value.info}</p>
                        </div>
                    </li>`)
                    });
                    $(".brand>ul").html(dataArray.join(""));
                } else {
                    layer.open({
                        content: res.msg,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            },
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            error: function (e) {
                console.log(e.responseJSON.message);
            }
        })
    }
    /* 品牌页面 开始 */
    /* 病例列表隐藏 新建病例显示 */
    $(".new-case").on("click", function () {
        $(".case-management").fadeOut();
        $(".management-box").fadeIn();
        /* 获取病例品牌列表 */
        initBrand();
    });
    /* 选中当前的页面 ul 里面的 li 注册点击事件 */
    $(".brand ul ").on("click", "li", function () {
        /* 未选中图片隐藏 */
        /* 选中图片显示 */
        /* 给点击的li 添加样式 */
        $(this).children().children(".pitch-on").css("display", "block");
        /* 给其他的 li 隐藏 */
        $(this).siblings().children().children(".pitch-on").css("display", "none");
    });
    var shipping = ""; //储存地址列表
    $(".brand .button .next-step").on("click", function () {
        /* 判断有没有选择品牌 */
        if ($(".brand .pitch-on").eq(0).is(":hidden") && $(".brand .pitch-on").eq(1).is(":hidden")) {
            layer.open({
                content: "请选择品牌",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        $(".brand ul li").each((idx, item) => {
            if (!$(item).children().children(".pitch-on").is(":hidden")) {
                firstStep.brandId = $(item).attr("data-id");
            }
        })
        /* 获取保存第一步 */
        $.ajax({
            /* 请求异步问题 */
            async: false,
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/caseInfo/stepOne",
            //数据，json字符串
            data: JSON.stringify(firstStep),
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    stockpile = JSON.parse(res.data);
                } else {
                    layer.open({
                        content: res.msg,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            },
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                console.log(e.status);
                console.log(e.responseText);
            }
        });
        $(".brand").fadeOut();
        $(".basic-information").fadeIn();
        /* 获取就诊医院 */
        $.ajax({
            //请求方式
            type: "get",
            //请求地址
            url: app.apiUrl + "/hospital/hospitalList",
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    console.log(res);
                    var hospital = JSON.parse(res.data);
                    var hospitalArr = `
                    <p>就诊医院<img src="img/star2.png"></p>
                    <div class="hospital-site">${hospital[0].hospitalName}</div>
                    <div class="amend" data-id="${hospital.id}">
                        <img src="img/right-arrow.png" alt="">
                    </div>`
                    $(".basic-information ul .hospital").html(hospitalArr);
                } else {
                    layer.open({
                        content: res.msg,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            },
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                console.log(e.status);
                console.log(e.responseText);
            }
        });
        /* 获取收货地址 */
        $.ajax({
            //请求方式
            type: "get",
            //请求地址
            url: app.apiUrl + "/deliveryAddress/getAddressList",
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    shipping = JSON.parse(res.data);
                    var shippingArr = `
                    <p>收货地址<img src="img/star2.png"></p>
                    <div class="message" id="messageReceiver">
                        <div class="user">
                        <span>${shipping[0].deliveryName}</span>
                        <span>${shipping[0].contactNumber}</span>
                        </div>
                        <span>${shipping[0].province}${shipping[0].city}${shipping[0].area}${shipping[0].address}</span>
                    </div>
                    <div class="amend" id="${shipping[0].id}">
                        <img src="img/right-arrow.png" alt="">
                    </div>`
                    $(".basic-information ul .delivery-address").html(shippingArr)
                } else {
                    layer.open({
                        content: res.msg,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            },
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                console.log(e.status);
                console.log(e.responseText);
            }
        });
    });
    /* 品牌页面 结束 */
    /* 基本信息页面 开始 */
    /* 点击基本信息页面的上一步基本信息隐藏 品牌页面显示 */
    $(".basic-information .button .last-step").on("click", function () {
        $(".brand").fadeIn();
        $(".basic-information").fadeOut();
    })
    /* 点击基本信息医院右箭头 就诊医院地址显示 */
    $(".basic-information ul .hospital").on("click", ".amend", function () {
        $("#shipping-address-list").fadeIn();
        $(".basic-information").fadeOut();
        /* 获取就诊医院 */
        $.ajax({
            /* 请求异步问题 */
            async: false,
            //请求方式
            type: "get",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/hospital/hospitalList",
            //数据，json字符串
            //    data : JSON.stringify(),
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    var resCo = JSON.parse(res.data);
                    console.log(resCo);
                    var resCos = [];
                    resCo.forEach(function (item) {
                        resCos.push(`
                        <li data-id="${item.id}">
                            <div class="border-bottom-box">
                                <div class="address-name">
                                    <span>${item.hospitalName}</span>
                                </div>
                                <div class="address-position">
                                    <div class="message"> ${item.country} ${item.province} ${item.city} ${item.area}<br><span>${item.address}</span></div>
                                </div>
                                <div class="edit-box">
                                    编辑
                                </div>
                            </div>
                        </li>`)
                    })
                    $("#shipping-address-list .content-bg").append(resCos);

                } else {
                    //提示
                    layer.open({
                        content: res.msg,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                }
            },
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                layer.open({
                    content: e.responseJSON.message,
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });

            }
        });
    });
    $("#shipping-address-list .left-arrow").on("click", function () {
        $("#shipping-address-list").fadeOut();
        $(".basic-information").fadeIn();
    })
    $("#shipping-address-list").on("click", ".edit-box", function () {
        $("#shipping-address-list").fadeOut();
        $(".modification-hospital").fadeIn();
        var hospitalArr = `
        <ul>
            <li>
                <div class="area">
                    <p>地址</p>
                    <div class="linkage">
                        <div class="province">
                            <select id="state"><option>请选择国家</option><option value="1">中国</option><option value="2">美国</option><option value="3">俄国</option><option value="4">日本</option></select>
                            <div class="bottom-arrow">
                                <img src="img/management-jt-x.png" alt="">
                            </div>
                        </div>
                        <div class="province">
                            <select id="provincial">
                                <option>请选择省级</option>
                            </select>
                            <div class="bottom-arrow">
                                <img src="img/management-jt-x.png" alt="">
                            </div>
                        </div>
                        <div class="province">
                            <select id="city">
                                <option>请选择城市</option>
                            </select>
                            <div class="bottom-arrow">
                                <img src="img/management-jt-x.png" alt="">
                            </div>
                        </div>
                        <div class="province">
                            <select id="county">
                                <option>请选择县/区</option>
                            </select>
                            <div class="bottom-arrow">
                                <img src="img/management-jt-x.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="address" id="address">
                    <p>地区</p>
                    <input type="text" class="name">
                </div>
            </li>
            <li id="designation">
                <p>名称</p>
                <input type="text" class="name">
            </li>
        </ul>`
        let stateText = $("#state").find("option:selected").text();
        let provincialText = $("#provincial").find("option:selected").text();
        let cityText = $("#city").find("option:selected").text();
        let countyText = $("#county").find("option:selected").text();
        let addressText = $("#address").children(".name").val();
        let designationText = $("#designation").children(".name").val();
        if (stateText == "请选择国家") {
            layer.open({
                content: "请选择国家",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (provincialText == "请选择省级") {
            layer.open({
                content: "请选择省级",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (cityText == "请选择城市") {
            layer.open({
                content: "请选择城市",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (countyText == "请选择县/区") {
            layer.open({
                content: "请选择县/区",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (addressText == "") {
            layer.open({
                content: "请填写地区",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (designationText == "") {
            layer.open({
                content: "请填写名称",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        $(".hospital-site").text((cityText + designationText));
        $("#shipping-address-list").fadeOut();
        $(".basic-information").fadeIn();
    })
    /* 点击就诊医院收货地址 新建收货地址 */
    $("#shipping-address-list .preserve").on("click", function () {
        $("#shipping-address-list").fadeOut();
        $(".modification-hospital").fadeIn();
        $.ajax({
            //请求方式
            type: "get",
            //请求地址
            url: app.apiUrl + "/region/countryList",
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    var state = JSON.parse(res.data);
                    var stateArr = ["<option>请选择国家</option>"];
                    state.forEach(item => {
                        stateArr.push(`<option value="${item.countriesId}">${item.countriesName}</option>`)
                    })
                    /* 将拼接好的 dom 元素 添加到国家标签中 */
                    $("#state").html(stateArr.join(""));
                } else {
                    layer.open({
                        content: res.msg,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            },
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization");
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                console.log(e.status);
                console.log(e.responseText);
            }
        });
        $("#state").on("change", function () {
            $("#provincial").html(`<option>请选择省级</option>`);
            $("#city").html(`<option>请选择城市</option>`);
            $("#county").html(`<option>请选择县/区</option>`);
            if (this.value == "请选择国家") {
                layer.open({
                    content: "请选择国家",
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
                /* 阻止下面的代码执行 */
                return false;
            }
            $.ajax({
                type: "get",
                url: app.apiUrl + "/region/provinceList",
                data: {
                    countriesId: this.value
                },
                success: function (res) {
                    if (res.code == 200) {
                        var provincial = JSON.parse(res.data);
                        var provincialArr = ["<option>请选择省级</option>"];
                        provincial.forEach(item => {
                            provincialArr.push(`<option value="${item.provinceId}">${item.provinceName}</option>`)
                        })
                        /* 将拼接好的 dom 元素 添加到省级标签中 */
                        $("#provincial").html(provincialArr.join(""));
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                }
            })
        })
        $("#provincial").on("change", function () {
            if (this.value == "请选择省级") {
                layer.open({
                    content: "请选择省级",
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
                /* 阻止下面的代码执行 */
                return false;
            }
            $.ajax({
                type: "get",
                url: app.apiUrl + "/region/cityList",
                data: {
                    provinceId: this.value
                },
                success: function (res) {
                    if (res.code == 200) {
                        var city = JSON.parse(res.data);
                        var cityArr = ["<option>请选择城市</option>"];
                        city.forEach(item => {
                            cityArr.push(`<option value="${item.cityId}">${item.cityName}</option>`)
                        })
                        $("#city").html(cityArr.join(""));
                        $("#county").html(`<option>请选择县/区</option>`);
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                }
            })
        })
        $("#city").on("change", function () {
            if (this.value == "请选择城市") {
                layer.open({
                    content: "请选择城市",
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
                /* 阻止下面的代码执行 */
                return false;
            }
            $.ajax({
                type: "get",
                url: app.apiUrl + "/region/areaList",
                data: {
                    cityId: this.value
                },
                success: function (res) {
                    if (res.code == 200) {
                        var county = JSON.parse(res.data);
                        var countyArr = ["<option>请选择县/区</option>"];
                        county.forEach(item => {
                            countyArr.push(`<option value="${item.areaId}">${item.areaName}</option>`)
                        })
                        $("#county").html(countyArr.join(""));
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                }
            })
        })
    })
    /* 点击就诊医院就诊医院 保存 */
    $(".hospital-address .click .save").on("click", function () {
        let stateText = $("#state").find("option:selected").text();
        let provincialText = $("#provincial").find("option:selected").text();
        let cityText = $("#city").find("option:selected").text();
        let countyText = $("#county").find("option:selected").text();
        let addressText = $("#address").children(".name").val();
        let designationText = $("#designation").children(".name").val();
        if (stateText == "请选择国家") {
            layer.open({
                content: "请选择国家",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (provincialText == "请选择省级") {
            layer.open({
                content: "请选择省级",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (cityText == "请选择城市") {
            layer.open({
                content: "请选择城市",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (countyText == "请选择县/区") {
            layer.open({
                content: "请选择县/区",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (addressText == "") {
            layer.open({
                content: "请填写地区",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (designationText == "") {
            layer.open({
                content: "请填写名称",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        $(".hospital-site").text(designationText);
        $(".modification-hospital").fadeOut();
        $("#shipping-address-list").fadeIn();
        /* 获取就诊医院 */
        $.ajax({
            /* 请求异步问题 */
            async: false,
            //请求方式
            type: "get",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/hospital/hospitalList",
            //数据，json字符串
            //    data : JSON.stringify(),
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    var resCo = JSON.parse(res.data);
                    console.log(resCo);
                    var resCos = [];
                    resCo.forEach(function (item) {
                        resCos.push(`
                        <li data-id="${item.id}">
                            <div class="border-bottom-box">
                                <div class="address-name">
                                    <span>${item.hospitalName}</span>
                                </div>
                                <div class="address-position">
                                    <div class="message"> ${item.country} ${item.province} ${item.city} ${item.area}<br><span>${item.address}</span></div>
                                </div>
                                <div class="edit-box">
                                    编辑
                                </div>
                            </div>
                        </li>`)
                    })
                    $("#shipping-address-list .content-bg").append(resCos);

                } else {
                    //提示
                    layer.open({
                        content: res.msg,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                }
            },
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                layer.open({
                    content: e.responseJSON.message,
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });

            }
        });
    })
    /* 点击就诊医院就诊医院 删除 */
    $(".hospital-address .click .delete").on("click", function () {
        $("#provincial").find("option:selected").text("");
        $("#city").find("option:selected").text("");
        $("#county").find("option:selected").text("");
        $("#address").children(".name").val("");
        $("#designation").children(".name").val("");
    })
    /* 就诊医院地址隐藏 */
    $(".modification-hospital .headbox .left-arrow").on("click", function () {
        $(".modification-hospital").fadeOut();
        $(".basic-information").fadeIn();
    })
    /* 点击基本信息收货地址修改 收货地址显示 */
    $(".basic-information ul").on("click", ".delivery-address .amend", function () {
        $(".shipping-address").fadeIn();
        $(".basic-information").fadeOut();
        var addressArr = `
            <li>
                <label for="receiver">收货人</label>
                <input type="text" id="receiver" value="${shipping[0].deliveryName}
                ">
            </li>
            <li>
                <label for="receiver">手机号</label>
                <input type="tel" id="tel" value="${shipping[0].contactNumber}">
            </li>
            <li id="region">
                <label for="receiver">所在地区</label>
                <div id="district">${shipping[0].province}${shipping[0].city}${shipping[0].area}</div>
            </li>
            <li>
                <label for="receiver">详细地址</label>
                <input type="text" id="detailed-address" value="${shipping[0].address}">
            </li>`
        $(".shipping-address .content-box .content-bg").html(addressArr);
    })
    /* 点击所在地区获取国家省市区 */
    $(".shipping-address .content-box .content-bg ").on("click", "#region", function () {
        $("#ipt-box-addr").fadeIn();
        $.ajax({
            type: "get",
            url: app.apiUrl + "/region/provinceList",
            data: {
                countriesId: 1
            },
            success: function (res) {
                if (res.code == 200) {
                    var provice = JSON.parse(res.data);
                    var proviceArr = ["<option>省份</option>"];
                    provice.forEach(item => {
                        proviceArr.push(`<option value="${item.provinceId}">${item.provinceName}</option>`)
                    })
                    /* 将拼接好的 dom 元素 添加到省级标签中 */
                    $("#provice").html(proviceArr.join(""));
                } else {
                    layer.open({
                        content: res.msg,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            }
        })
        $("#provice").on("change", function () {
            $("#town").html(`<option>城市</option>`);
            $("#area").html(`<option>县/区</option>`);
            if (this.value == "省级") {
                layer.open({
                    content: "请选择省级",
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
                /* 阻止下面的代码执行 */
                return false;
            }
            $.ajax({
                type: "get",
                url: app.apiUrl + "/region/cityList",
                data: {
                    provinceId: this.value
                },
                success: function (res) {
                    if (res.code == 200) {
                        var town = JSON.parse(res.data);
                        var townArr = ["<option>城市</option>"];
                        town.forEach(item => {
                            townArr.push(`<option value="${item.cityId}">${item.cityName}</option>`)
                        })
                        $("#town").html(townArr.join(""));
                        $("#area").html(`<option>县/区</option>`);
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                }
            })
        })
        $("#town").on("change", function () {
            if (this.value == "城市") {
                layer.open({
                    content: "请选择城市",
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
                /* 阻止下面的代码执行 */
                return false;
            }
            $.ajax({
                type: "get",
                url: app.apiUrl + "/region/areaList",
                data: {
                    cityId: this.value
                },
                success: function (res) {
                    if (res.code == 200) {
                        var area = JSON.parse(res.data);
                        var areaArr = [`<option>县/区</option>`];
                        area.forEach(item => {
                            areaArr.push(`<option value="${item.areaId}">${item.areaName}</option>`)
                        })
                        $("#area").html(areaArr.join(""));
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                }
            })
        })
    })
    /* 点击所在地区弹窗的 保存 */
    $("#ipt-box-addr .layer-btn .save").on("click", function () {
        let proviceText = $("#provice").find("option:selected").text();
        let townText = $("#town").find("option:selected").text();
        let areaText = $("#area").find("option:selected").text();
        if (proviceText == "省份") {
            layer.open({
                content: "请选择省份",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (townText == "城市") {
            layer.open({
                content: "请选择城市",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (areaText == "县/区") {
            layer.open({
                content: "请选择县/区",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        $("#district").text((proviceText + townText + areaText));
        $("#ipt-box-addr").fadeOut();
    })
    /* 点击所在地区弹窗的 删除 */
    $("#ipt-box-addr .layer-btn .cancel").on("click", function () {
        $("#town").find("option:selected").text("");
        $("#area").find("option:selected").text("");
    })
    /* 点击收货地址保存 */
    $(".shipping-address .content-box .sub-btn .preserve").on("click", function () {
        let proviceText = $("#provice").find("option:selected").text();
        let townText = $("#town").find("option:selected").text();
        let areaText = $("#area").find("option:selected").text();
        let siteId = $(".delivery-address .amend").attr('id');
        siteId = Number(siteId);
        var consigneeReg = /^[\u4E00-\u9FA5\uf900-\ufa2da-zA-Z ]+$/;
        var telReg = /^1[3456789]\d{9}$/;
        let receiver = $("#receiver").val();
        let tel = $("#tel").val();
        let district = $("#district").text();
        let detailedAddress = $("#detailed-address").val();
        /* 收货人 */
        if (receiver == "") {
            layer.open({
                content: "请输入姓名",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (!consigneeReg.test(receiver)) {
            layer.open({
                content: "请输入正确姓名",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        /* 电话 */
        if (tel == "") {
            layer.open({
                content: "请输入电话",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (!telReg.test(tel)) {
            layer.open({
                content: "请输入正确电话",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (district == "") {
            layer.open({
                content: "请输入所在地区",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (detailedAddress == "") {
            layer.open({
                content: "请输入详细地址",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        /* 点击保存 获取填写信息 */
        $.ajax({
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/deliveryAddress/addDeliveryAddressList",
            //数据，json字符串
            data: JSON.stringify([{
                "address": detailedAddress,
                "area": areaText,
                "city": townText,
                "contactNumber": tel,
                "deliveryName": receiver,
                "id": siteId,
                "province": proviceText
            }]),
            //请求成功
            success: function (res) {
                if (res.code == 200) {} else {
                    layer.open({
                        content: res.msg,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            },
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                console.log(e.status);
                console.log(e.responseText);
            }
        });
        $(".user span").eq(0).text(receiver);
        $(".user span").eq(1).text(tel);
        $(".message>span").text((district + " " + detailedAddress));

        $(".shipping-address").fadeOut();
        $(".basic-information").fadeIn();
    })
    /* 点击收货地址删除 */
    $(".shipping-address .content-box .sub-btn .cancel").on("click", function () {
        $(".content-bg input").val("");
        $(".content-bg #district").text("");
    })
    /* 收货地址隐藏 点击左键头 */
    $(".shipping-address .headbox .left-arrow").on("click", function () {
        $(".shipping-address").fadeOut();
        $(".basic-information").fadeIn();
    })
    /* 性别 */
    $(".basic-information  ul li .patient-sex div").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).children("p").addClass("active");
        /* 给其他的 li 隐藏 */
        $(this).siblings().children("p").removeClass("active");
    })
    /* 基本信息显示 诊断隐藏 */
    $(".teeth-condition .button .last-step").on("click", function () {
        $(".basic-information").fadeIn();
        $(".teeth-condition").fadeOut();
    });
    /* 基本信息 结束 */
    /* 诊断 开始 */
    /* 基本信息隐藏 诊断显示 */
    $(".basic-information .button .next-step").on("click", function () {
        let userName = $(".basic-information ul .user-name").val();
        let hospital = $(".hospital-site").text();
        let deliveryAddress = $(".delivery-address .message").text()
        let userNameReg = /^[\u4E00-\u9FA5\uf900-\ufa2da-zA-Z]+$/;
        if (userName == "") {
            layer.open({
                content: "请输入姓名",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (!userNameReg.test(userName)) {
            layer.open({
                content: "请输入姓名正确格式",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (hospital == "") {
            layer.open({
                content: "请输入就诊医院",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        if (deliveryAddress == "") {
            layer.open({
                content: "请输入收货地址",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        console.log(secondStep);
        secondStep.caseId = stockpile.id; //病例id
        secondStep.hospitalId = stockpile.hospitalId; //医院id
        let siteId = $(".delivery-address .amend").attr('id');
        siteId = Number(siteId); //获取收货地址id
        secondStep.birthday = $(".basic-information #demo1").val(); //日期
        var time = new Date();
        secondStep.birthday = time.getTime(secondStep.birthday);
        secondStep.deliveryAddressId = siteId, /* 储存收货地址ID */
            $(".basic-information .patient-sex div").each((idx, item) => { //判断性别
                if ($(item).children("p").hasClass("active")) {
                    secondStep.sex = $(item).children("p").attr("data-id");
                }
            })
        secondStep.patientName = $(".basic-information .user-name").val(); //病人名称
        /* 获取保存第二步 */
        $.ajax({
            /* 请求异步问题 */
            async: false,
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/caseInfo/stepTwo",
            //数据，json字符串
            data: JSON.stringify(secondStep),
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    console.log(res);
                } else {
                    layer.open({
                        content: res.msg,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            },
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                console.log(e.status);
                console.log(e.responseText);
            }
        });

        $(".basic-information").fadeOut();
        $(".teeth-condition").fadeIn();
    });
    /* 点击磨牙关系右键显示弹层 */
    $(".teeth-condition ul .bruxism .right-arrow").on("click", function () {
        $("#molar-relationship").fadeIn();
        $(".teeth-condition").fadeOut();
        $(".nav").fadeOut();
    })
    /* 磨牙关系左侧 添加排他*/
    $(".molar-box #classify-left li").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).addClass("active");
        /* 给其他的 li 隐藏 */
        $(this).siblings().removeClass("active");
    })
    /* 磨牙关系右侧 添加排他*/
    $(".molar-box #classify-right li").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).addClass("active");
        /* 给其他的 li 隐藏 */
        $(this).siblings().removeClass("active");
    })
    /* 点击磨牙弹窗的保存 */
    $("#molar-relationship .layer-btn .save").on("click", function () {
        if ($(".molar-box #classify-left li").hasClass("active")) {
            $(".bruxism .left-content").text($(".molar-box #classify-left .active").text());
        }
        if ($(".molar-box #classify-right li").hasClass("active")) {
            $(".bruxism .right-content").text($(".molar-box #classify-right .active").text());
        }
        $("#molar-relationship").fadeOut();
        $(".teeth-condition").fadeIn();
    })
    /* 点击磨牙弹窗的取消 */
    $("#molar-relationship .layer-btn .cancel").on("click", function () {
        $("#molar-relationship").fadeOut();
        $(".teeth-condition").fadeIn();
    })
    /* 点击尖牙关系右键显示弹层 */
    $(".teeth-condition ul .cynodontes .right-arrow").on("click", function () {
        $("#fangs-relationship").fadeIn();
        $(".teeth-condition").fadeOut();
        $(".nav").fadeOut();
    })
    /* 尖牙关系左侧 添加排他*/
    $(".fangs-box #classify-left li").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).addClass("active");
        /* 给其他的 li 隐藏 */
        $(this).siblings().removeClass("active");
    })
    /* 尖牙关系右侧 添加排他*/
    $(".fangs-box #classify-right li").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).addClass("active");
        /* 给其他的 li 隐藏 */
        $(this).siblings().removeClass("active");
    })
    /* 点击尖牙弹窗的保存 */
    $("#fangs-relationship .layer-btn .save").on("click", function () {
        if ($(".fangs-box #classify-left li").hasClass("active")) {
            $(".cynodontes .left-content").text($(".fangs-box #classify-left .active").text());
        }
        if ($(".fangs-box #classify-right li").hasClass("active")) {
            $(".cynodontes .right-content").text($(".fangs-box #classify-right .active").text());
        }
        $("#fangs-relationship").fadeOut();
        $(".teeth-condition").fadeIn();
    })
    /* 点击尖牙弹窗的取消 */
    $("#fangs-relationship .layer-btn .cancel").on("click", function () {
        $("#fangs-relationship").fadeOut();
        $(".teeth-condition").fadeIn();
    })
    /* 点击病例分类右键显示弹层 */
    $(".teeth-condition ul .case .right-arrow").on("click", function () {
        $("#case-classification").fadeIn();
        $(".teeth-condition").fadeOut();
        $(".nav").fadeOut();
    })
    /* 病例分类左侧 添加排他*/
    $(".teeth-classify .classify li").on("click", function () {
        /* 给点击的li 添加类名 */
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
        } else {
            $(this).removeClass("active")
        }
    })
    /* 点击病例分类弹窗的保存 */
    $("#case-classification .layer-btn .save").on("click", function () {
        if ($(".teeth-classify .classify li").hasClass("active")) {
            let activeArr = [];
            let actives = document.querySelectorAll(".teeth-classify .classify .active");
            for (var i = 0; i < actives.length; i++) {
                activeArr.push(actives[i].innerText);
            }
            $(".case .case-classification").text(activeArr.join(","));
        }
        $("#case-classification").fadeOut();
        $(".teeth-condition").fadeIn();
    })
    /* 点击病例分类弹窗的取消 */
    $("#case-classification .layer-btn .cancel").on("click", function () {
        $("#case-classification").fadeOut();
        $(".teeth-condition").fadeIn();
    })
    /* 诊断 结束 */
    /* 矫治目标 开始 */
    /* 诊断隐藏 矫治目标显示 */
    $(".teeth-condition .button .next-step").on("click", function () {
        thirdStep.caseId = stockpile.id; //病例id
        thirdStep.stageName = stockpile.stageName; //病例阶段
        thirdStep.stageCount = stockpile.stageCount; //病例阶段次数
        /* 解决磨牙关系 左侧磨牙关系选项（1 Ⅰ类，2 Ⅱ类，3 Ⅲ类） */
        if ($(".bruxism .left-content").text() == "|类") {
            thirdStep.molarLeft = 1;
        } else if ($(".bruxism .left-content").text() == "||类") {
            thirdStep.molarLeft = 2;
        } else if ($(".bruxism .left-content").text() == "|||类") {
            thirdStep.molarLeft = 3;
        }
        /* 解决磨牙关系 右侧磨牙关系选项（1 Ⅰ类，2 Ⅱ类，3 Ⅲ类） */
        if ($(".bruxism .right-content").text() == "|类") {
            thirdStep.molarRight = 1;
        } else if ($(".bruxism .right-content").text() == "||类") {
            thirdStep.molarRight = 2;
        } else if ($(".bruxism .right-content").text() == "|||类") {
            thirdStep.molarRight = 3;
        }
        thirdStep.stageCount = stockpile.stageCount; //病例阶段次数
        /* 解决尖牙关系 左侧尖牙关系选项（1中性，2近中，3远中） */
        if ($(".bruxism .left-content").text() == "|类") {
            thirdStep.canineLeft = 1;
        } else if ($(".bruxism .left-content").text() == "||类") {
            thirdStep.canineLeft = 2;
        } else if ($(".bruxism .left-content").text() == "|||类") {
            thirdStep.canineLeft = 3;
        }
        /* 解决尖牙关系 右侧尖牙关系选项（1中性，2近中，3远中） */
        if ($(".bruxism .right-content").text() == "|类") {
            thirdStep.canineRight = 1;
        } else if ($(".bruxism .right-content").text() == "||类") {
            thirdStep.canineRight = 2;
        } else if ($(".bruxism .right-content").text() == "|||类") {
            thirdStep.canineRight = 3;
        }
        /* 解决病例分类 单选时 值为 2的n次方 n为选中第几个 多选时将值相加*/
        let activeL = document.querySelectorAll("#case-classification .active");
        let target = 0;
        if (activeL.length == 1) {
            target = 2 ** ($("#case-classification .active").index() + 1)
        } else {
            for (var i = 0; i < activeL.length; i++) {
                target += 2 ** ($("#case-classification .active").eq(i).index() + 1);
            }
        }
        thirdStep.diagnosisType = target;
        console.log(target)
        /* 获取保存第三步 */
        $.ajax({
            /* 请求异步问题 */
            async: false,
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/caseInfo/stepThree",
            //数据，json字符串
            data: JSON.stringify(thirdStep),
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    console.log(res);
                } else {
                    layer.open({
                        content: res.msg,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            },
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                console.log(e.status);
                console.log(e.responseText);
            }
        });
        $(".teeth-condition").fadeOut();
        $(".correct-target").fadeIn();
    });
    /* 点击矫治牙列右键显示弹层 */
    $(".correct-target ul .correctional-tooth .right-arrow").on("click", function () {
        $("#correctional-tooth-column").fadeIn();
        $(".correct-target").fadeOut();
        $(".nav").fadeOut();
    })
    /* 矫治牙列 添加排他*/
    $("#cover-classify1 .classify li").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).addClass("active");
        /* 给其他的 li 隐藏 */
        $(this).siblings().removeClass("active");
    })
    /* 点击矫治牙列弹窗的保存 */
    $("#correctional-tooth-column .layer-btn .save").on("click", function () {
        if ($("#cover-classify1 .classify li").hasClass("active")) {
            $(".correctional-tooth .correct").text($("#cover-classify1 .classify .active").text());
        }
        $("#correctional-tooth-column").fadeOut();
        $(".correct-target").fadeIn();
    })
    /* 点击矫治牙列弹窗的取消 */
    $("#correctional-tooth-column .layer-btn .cancel").on("click", function () {
        $("#correctional-tooth-column").fadeOut();
        $(".correct-target").fadeIn();
    })
    /* 点击覆盖右键显示弹层 */
    $(".correct-target ul .overlay .right-arrow").on("click", function () {
        $("#coating").fadeIn();
        $(".correct-target").fadeOut();
        $(".nav").fadeOut();
    })
    /* 覆盖 添加排他*/
    $("#cover-classify2 .classify li").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).addClass("active");
        /* 给其他的 li 隐藏 */
        $(this).siblings().removeClass("active");
        /* 判断如果点击的是第二li 这可以输入input值 */
        if ($("#cover-classify2 .classify .active").index() == 1) {
            $("#text").prop("disabled", false);
        } else {
            $("#text").prop("disabled", true);
            $("#text").val("");
        }
    })
    /* 点击覆盖弹窗的保存 */
    $("#coating .layer-btn .save").on("click", function () {
        if ($("#cover-classify2 .classify li").hasClass("active")) {
            var str = $("#cover-classify2 .classify .active").text();
            var str2 = $(".millimeter #text").val();
            var str3 = $("#cover-classify2 .millimeter span").text()
            if ($("#cover-classify2 .classify .active").index() == 1) {
                /* 判断input输入的值只能输入0-100之内的数 */
                var num = Number($("#text").val());
                console.log(num);
                if (!(num > 0 && num < 101)) {
                    layer.open({
                        content: "请输入0-100的数值",
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    });
                    return false;
                };
                $(".overlay .coverage").text((str + str2 + str3));
            } else {
                $(".overlay .coverage").text((str + str2));
            }
        }
        $("#coating").fadeOut();
        $(".correct-target").fadeIn();
    })
    /* 点击覆盖弹窗的取消 */
    $("#coating .layer-btn .cancel").on("click", function () {
        $("#coating").fadeOut();
        $(".correct-target").fadeIn();
    })
    /* 点击覆颌右键显示弹层 */
    $(".correct-target ul .covering-jaw-box .right-arrow").on("click", function () {
        $("#covering-jaw-popup").fadeIn();
        $(".correct-target").fadeOut();
        $(".nav").fadeOut();
    })
    /* 覆颌 添加排他*/
    $("#cover-classify3 .classify li").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).addClass("active");
        /* 给其他的 li 隐藏 */
        $(this).siblings().removeClass("active");
        /* 判断如果点击的是第二li 这可以输入input值 */
        if ($("#cover-classify3 .classify .active").index() == 1) {
            $("#text2").prop("disabled", false);
        } else {
            $("#text2").prop("disabled", true);
            $("#text2").val("");
        }
    })
    /* 点击覆颌弹窗的保存 */
    $("#covering-jaw-popup .layer-btn .save").on("click", function () {
        if ($("#cover-classify3 .classify li").hasClass("active")) {
            var str = $("#cover-classify3 .classify .active").text();
            var str2 = $("#covering-jaw-popup .millimeter #text2").val();
            var str3 = $("#cover-classify3 .millimeter span").text()
            if ($("#cover-classify3 .classify .active").index() == 1) {
                /* 判断input输入的值只能输入0-100之内的数 */
                var num2 = Number($("#text2").val());
                if (!(num2 > 0 && num2 < 101)) {
                    layer.open({
                        content: "请输入0-100的数值",
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    });
                    return false;
                };
                $(".covering-jaw-box .covering-jaw").text((str + str2 + str3));
            } else {
                $(".covering-jaw-box .covering-jaw").text((str + str2));
            }
        }
        $("#covering-jaw-popup").fadeOut();
        $(".correct-target").fadeIn();
    })
    /* 点击覆颌弹窗的取消 */
    $("#covering-jaw-popup .layer-btn .cancel").on("click", function () {
        $("#covering-jaw-popup").fadeOut();
        $(".correct-target").fadeIn();
    })
    /* 点击磨牙关系2右键显示弹层 */
    $(".bruxism2 .molar .right-arrow").on("click", function () {
        $("#molar-relationship2").fadeIn();
        $(".correct-target").fadeOut();
        $(".nav").fadeOut();
    })
    /* 磨牙关系2 左侧添加排他*/
    $("#molar-relationship2 .molar-box-left .classify li").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).addClass("active");
        /* 给其他的 li 隐藏 */
        $(this).siblings().removeClass("active");
        /* 判断如果点击的是第三li 可以输入input值 */
        if ($("#molar-relationship2 .molar-box-left .classify .active").index() == 2) {
            $("#molar-relationship2 .molar-box-left .text3").prop("disabled", false);
        } else {
            $("#molar-relationship2 .molar-box-left .text3").prop("disabled", true);
            $("#molar-relationship2 .molar-box-left .text3").val("");
        }
    })
    /* 磨牙关系2 右侧添加排他*/
    $("#molar-relationship2 .molar-box-right .classify li").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).addClass("active");
        /* 给其他的 li 隐藏 */
        $(this).siblings().removeClass("active");
        /* 判断如果点击的是第三li 可以输入input值 */
        if ($("#molar-relationship2 .molar-box-right .classify .active").index() == 2) {
            $("#molar-relationship2 .molar-box-right .text3").prop("disabled", false);
        } else {
            $("#molar-relationship2 .molar-box-right .text3").prop("disabled", true);
            $("#molar-relationship2 .molar-box-right .text3").val("");
        }
    })
    /* 点击input另一个兄弟输入的值清空 左侧 */
    $("#molar-relationship2 .molar-box-left .millimeter li").on("click", function () {
        $(this).siblings().children(".text3").val("");
    })
    /* 点击input另一个兄弟输入的值清空 右侧 */
    $("#molar-relationship2 .molar-box-right .millimeter li").on("click", function () {
        $(this).siblings().children(".text3").val("");
    })
    /* 点击input给li添加active 左侧*/
    $("#molar-relationship2 .molar-box-left .millimeter .text3").on("input", function () {
        $(this).parent().addClass("active");
        $(this).parent().siblings().removeClass("active");
        console.log(111)
    })
    /* 给input的值的li添加active 右侧*/
    $("#molar-relationship2 .molar-box-right .millimeter .text3").on("input", function () {
        $(this).parent().addClass("active");
        $(this).parent().siblings().removeClass("active");
    })
    /* 点击磨牙关系弹窗2的保存 */
    $("#molar-relationship2 .layer-btn .save").on("click", function () {
        /* 左侧 */
        if ($("#molar-relationship2 .molar-box-left .classify li").hasClass("active")) {
            var str = $("#molar-relationship2 .molar-box-left .classify .active").text();
            var str2 = $("#molar-relationship2 .molar-box-left .millimeter .active").text().trim().substr(0, 5) + $("#molar-relationship2 .molar-box-left .millimeter .active input").val() + "mm";
            if ($("#molar-relationship2 .molar-box-left .classify .active").index() == 2) {
                /* 判断input输入的值只能输入0-100之内的数 */
                var num3 = Number($("#molar-relationship2 .molar-box-left .millimeter .active input").val());
                if (!(num3 > 0 && num3 < 101)) {
                    layer.open({
                        content: "请输入0-100的数值",
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    });
                    return false;
                };
                $(".bruxism2 .left-content").text((str + str2));
            } else {
                $(".bruxism2 .left-content").text((str));
            }
        };
        /* 右侧 */
        if ($("#molar-relationship2 .molar-box-right .classify li").hasClass("active")) {
            var str = $("#molar-relationship2 .molar-box-right .classify .active").text();
            console.log($("#molar-relationship2 .molar-box-right .millimeter .active").text().trim());
            var str2 = $("#molar-relationship2 .molar-box-right .millimeter .active").text().trim().substr(0, 5) + $("#molar-relationship2 .molar-box-right .millimeter .active input").val() + "mm";
            if ($("#molar-relationship2 .molar-box-right .classify .active").index() == 2) {
                if (!(num3 > 0 && num3 < 101)) {
                    layer.open({
                        content: "请输入0-100的数值",
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    });
                    return false;
                };
                $(".bruxism2 .right-content").text((str + str2));
            } else {
                $(".bruxism2 .right-content").text((str));
            }
        }
        $("#molar-relationship2").fadeOut();
        $(".correct-target").fadeIn();
    })
    /* 点击磨牙关系弹窗2的取消 */
    $("#molar-relationship2 .layer-btn .cancel").on("click", function () {
        $("#molar-relationship2").fadeOut();
        $(".correct-target").fadeIn();
    })
    /* 磨牙关系结束 */
    /* 尖牙关系开始 */
    /* 点击尖牙关系2右键显示弹层 */
    $(".cynodontes2 .molar .right-arrow").on("click", function () {
        $("#fangs-relationship2").fadeIn();
        $(".correct-target").fadeOut();
        $(".nav").fadeOut();
    })
    /* 尖牙关系2 左侧添加排他*/
    $("#fangs-relationship2 .molar-box-left .classify li").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).addClass("active");
        /* 给其他的 li 隐藏 */
        $(this).siblings().removeClass("active");
        /* 判断如果点击的是第三li 可以输入input值 */
        if ($("#fangs-relationship2 .molar-box-left .classify .active").index() == 2) {
            console.log(111);
            $("#fangs-relationship2 .molar-box-left .text4").prop("disabled", false);
        } else {
            $("#fangs-relationship2 .molar-box-left .text4").prop("disabled", true);
            $("#fangs-relationship2 .molar-box-left .text4").val("");
        }
    })
    /* 尖牙关系2 右侧添加排他*/
    $("#fangs-relationship2 .molar-box-right .classify li").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).addClass("active");
        /* 给其他的 li 隐藏 */
        $(this).siblings().removeClass("active");
        /* 判断如果点击的是第三li 可以输入input值 */
        if ($("#fangs-relationship2 .molar-box-right .classify .active").index() == 2) {
            $("#fangs-relationship2 .molar-box-right .text4").prop("disabled", false);
        } else {
            $("#fangs-relationship2 .molar-box-right .text4").prop("disabled", true);
            $("#fangs-relationship2 .molar-box-right .text4").val("");
        }
    })
    /* 点击input另一个兄弟输入的值清空 左侧 */
    $("#fangs-relationship2 .molar-box-left .millimeter li").on("click", function () {
        $(this).siblings().children(".text4").val("");
    })
    /* 点击input另一个兄弟输入的值清空 左侧 */
    $("#fangs-relationship2 .molar-box-right .millimeter li").on("click", function () {
        $(this).siblings().children(".text4").val("");
    })
    /* 点击inpu给i添加active 左侧*/
    $("#fangs-relationship2 .molar-box-left .millimeter .text4").on("input", function () {
        $(this).parent().addClass("active");
        $(this).parent().siblings().removeClass("active");
        console.log(111)
    })
    /* 给inpu的值的li添加active 右侧*/
    $("#fangs-relationship2 .molar-box-right .millimeter .text4").on("input", function () {
        $(this).parent().addClass("active");
        $(this).parent().siblings().removeClass("active");
    })
    /* 点击尖牙关系弹窗2的保存 */
    $("#fangs-relationship2 .layer-btn .save").on("click", function () {
        /* 左侧 */
        if ($("#fangs-relationship2 .molar-box-left .classify li").hasClass("active")) {
            var str = $("#fangs-relationship2 .molar-box-left .classify .active").text();
            console.log($("#fangs-relationship2 .molar-box-left .millimeter .active").text().trim());
            var str2 = $("#fangs-relationship2 .molar-box-left .millimeter .active").text().trim().substr(0, 5) + $("#fangs-relationship2 .molar-box-left .millimeter .active input").val() + "mm";
            if ($("#fangs-relationship2 .molar-box-left .classify .active").index() == 2) {
                var num4 = Number($("#fangs-relationship2 .molar-box-left .millimeter .active input").val());
                if (!(num4 > 0 && num4 < 101)) {
                    layer.open({
                        content: "请输入0-100的数值",
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    });
                    return false;
                };
                $(".cynodontes2 .left-content").text((str + str2));
            } else {
                $(".cynodontes2 .left-content").text((str));
            }
        }
        /* 右侧 */
        if ($("#fangs-relationship2 .molar-box-right .classify li").hasClass("active")) {
            var str = $("#fangs-relationship2 .molar-box-right .classify .active").text();
            console.log($("#fangs-relationship2 .molar-box-right .millimeter .active").text().trim());
            var str2 = $("#fangs-relationship2 .molar-box-right .millimeter .active").text().trim().substr(0, 5) + $("#fangs-relationship2 .molar-box-right .millimeter .active input").val() + "mm";
            if ($("#fangs-relationship2 .molar-box-right .classify .active").index() == 2) {
                if (!(num4 > 0 && num4 < 101)) {
                    layer.open({
                        content: "请输入0-100的数值",
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    });
                    return false;
                };
                $(".cynodontes2 .right-content").text((str + str2));
            } else {
                $(".cynodontes2 .right-content").text((str));
            }
        }
        $("#fangs-relationship2").fadeOut();
        $(".correct-target").fadeIn();
    })
    /* 点击尖牙关系弹窗2的取消 */
    $("#fangs-relationship2 .layer-btn .cancel").on("click", function () {
        $("#fangs-relationship2").fadeOut();
        $(".correct-target").fadeIn();
    })
    /* 尖牙关系 结束 */
    /* 点击后牙反颌右键显示弹层 */
    $(".backteeth .right-arrow").on("click", function () {
        $("#backteeth-box").fadeIn();
        $(".correct-target").fadeOut();
        $(".nav").fadeOut();
    })
    /* 后牙反颌 添加排他*/
    $("#cover-classify4 .classify li").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).addClass("active");
        /* 给其他的 li 隐藏 */
        $(this).siblings().removeClass("active");
    })
    /* 点击后牙反颌列弹窗的保存 */
    $("#backteeth-box .layer-btn .save").on("click", function () {
        if ($("#cover-classify4 .classify li").hasClass("active")) {
            $(".backteeth .lock-jaw-teeth").text($("#cover-classify4 .classify .active").text());
        }
        $("#backteeth-box").fadeOut();
        $(".correct-target").fadeIn();
    })
    /* 点击后牙反颌弹窗的取消 */
    $("#backteeth-box .layer-btn .cancel").on("click", function () {
        $("#cover-classify4 .classify li").removeClass("active")
        $("#backteeth-box").fadeOut();
        $(".correct-target").fadeIn();
    })
    /* 矫治目标隐藏 诊断显示 */
    $(".correct-target .button .last-step").on("click", function () {
        $(".teeth-condition").fadeIn();
        $(".correct-target").fadeOut();
    });
    /* 矫治目标 结束 */
    /* 间隙获得 开始 */
    /* 矫治目标隐藏 间隙获得显示 */
    $(".correct-target .button .next-step").on("click", function () {
        fourStep.caseId = stockpile.id; //病例id
        fourStep.stageName = stockpile.stageName; //病例阶段
        fourStep.stageCount = stockpile.stageCount; //病例阶段次数
        /* 解决矫治牙列 矫治牙列选项（1上颌，2下颌，3全颌）*/
        if ($(".correct-target .correct").text() == "上颌") {
            fourStep.prescpDentition = 1;
        } else if ($(".correct-target .correct").text() == "下颌") {
            fourStep.prescpDentition = 2;
        } else if ($(".correct-target .correct").text() == "全颌") {
            fourStep.prescpDentition = 3;
        }
        /* 解决覆颌 覆颌选项（1保持 2改善） */
        if ($("#cover-classify3 .classify .active").index() == 1) {
            fourStep.prescpOverbite = 2;
            fourStep.prescpOverbiteData = $("#text2").val();
        } else {
            fourStep.prescpOverbite = 1;
        }
        /* 解决覆盖 覆盖选项（1保持 2改善） */
        if ($("#cover-classify2 .classify .active").index() == 1) {
            fourStep.prescpOverjet = 2;
            fourStep.prescpOverjetData = $("#text").val();
        } else {
            fourStep.prescpOverjet = 1;
        }
        /* 解决右侧磨牙关系  (1保持，2理想，3改善)*/
        if ($("#molar-relationship2 .molar-box-right .classify .active").index() == 2) {
            fourStep.prescpMolarRight = 3;
            fourStep.prescpMolarRightData = $("#molar-relationship2 .molar-box-right .millimeter .active .text3").val();
        } else if ($("#molar-relationship2 .molar-box-right .classify .active").index() == 1) {
            fourStep.prescpMolarRight = 2;
        } else if ($("#molar-relationship2 .molar-box-right .classify .active").index() == 0) {
            fourStep.prescpMolarRight = 1;
        }
        /* 解决左侧磨牙关系  (1保持，2理想，3改善)*/
        if ($("#molar-relationship2 .molar-box-left .classify .active").index() == 2) {
            fourStep.prescpMolarLeft = 3;
            fourStep.prescpMolarLeftData = $("#molar-relationship2 .molar-box-left .millimeter .active .text3").val();
        } else if ($("#molar-relationship2 .molar-box-left .classify .active").index() == 1) {
            fourStep.prescpMolarLeft = 2;
        } else if ($("#molar-relationship2 .molar-box-left .classify .active").index() == 0) {
            fourStep.prescpMolarLeft = 1;
        }
        /* 解决右侧尖牙关系  (1保持，2理想，3改善)*/
        if ($("#fangs-relationship2 .molar-box-right .classify .active").index() == 2) {
            fourStep.prescpCanineRight = 3;
            fourStep.prescpCanineRightData = $("#fangs-relationship2 .molar-box-right .millimeter .active .text4").val();
        } else if ($("#fangs-relationship2 .molar-box-right .classify .active").index() == 1) {
            fourStep.prescpCanineRight = 2;
        } else if ($("#fangs-relationship2 .molar-box-right .classify .active").index() == 0) {
            fourStep.prescpCanineRight = 1;
        }
        /* 解决左侧尖牙关系  (1保持，2理想，3改善)*/
        if ($("#fangs-relationship2 .molar-box-left .classify .active").index() == 2) {
            fourStep.prescpCanineLeft = 3;
            fourStep.prescpCanineLeftData = $("#fangs-relationship2 .molar-box-left .millimeter .active .text4").val();
        } else if ($("#fangs-relationship2 .molar-box-left .classify .active").index() == 1) {
            fourStep.prescpCanineLeft = 2;
        } else if ($("#fangs-relationship2 .molar-box-left .classify .active").index() == 0) {
            fourStep.prescpCanineLeft = 1;
        }
        /* 解决后牙反/锁  后牙反/锁 选项（0未选，1保持，2纠正）*/
        if ($(".lock-jaw-teeth").text() == "") {
            fourStep.prescpPosteriorCrossBite = 0;
        } else if ($(".lock-jaw-teeth").text() == "保持") {
            fourStep.prescpPosteriorCrossBite = 1;
        } else if ($(".lock-jaw-teeth").text() == "纠正") {
            fourStep.prescpPosteriorCrossBite = 2;
        }
        fiveStep.caseId = stockpile.id; //病例id
        fiveStep.stageName = stockpile.stageName; //病例阶段
        fiveStep.stageCount = stockpile.stageCount; //病例阶段次数
        // if()
        /* 获取保存第四步 */
        $.ajax({
            /* 请求异步问题 */
            async: false,
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/caseInfo/stepFour",
            //数据，json字符串
            data: JSON.stringify(fourStep),
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    console.log(res);
                } else {
                    layer.open({
                        content: res.msg,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            },
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                console.log(e.status);
                console.log(e.responseText);
            }
        });
        $(".correct-target").fadeOut();
        $(".management-box .interval").fadeIn();
    });
    let that = null;
    /* 点击牙齿 显示间隙获得弹窗 */
    $(".interval .gain .teeth li").on("click", function () {
        that = this;
        $("#interstice").fadeIn();
        $(".interval").fadeOut();
    })
    /* 间隙获得弹窗 排他 */
    $(".backteeth-classify .classify li").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).addClass("active");
        $(".backteeth-classify .classify .reset").removeClass("active")
    })
    /* 点击间隙获得弹窗重置 */
    $(".backteeth-classify .classify .reset").on("click", function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    })
    /* 点击间隙获得弹窗的取消 */
    $("#interstice .layer-btn .cancel").on("click", function () {
        $("#interstice").fadeOut();
        $(".interval").fadeIn();
    })
    /* 点击间隙获得列弹窗的保存 */
    $("#interstice .layer-btn .save").on("click", function () {
        let str = "";
        $(".backteeth-classify .classify li").each((idx, item) => {
            if ($(item).hasClass("active")) {
                str += ("<span>" + $(item).children().text() + "</span>")
            }
        })
        $(that).children("p").html(str);
        $("#interstice").fadeOut();
        $(".interval").fadeIn();
    })
    /* 矫治目标显示 间隙获得隐藏 */
    $(".interval .button .last-step").on("click", function () {
        $(".correct-target").fadeIn();
        $(".interval").fadeOut();
    });
    /* 间隙获得 结束 */
    /* 特殊要求 开始 */
    /* 特殊要求显示 间隙获得隐藏 */
    $(".interval .button .next-step").on("click", function () {
        /* 获取保存第五步 */
        $.ajax({
            /* 请求异步问题 */
            async: false,
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/caseInfo/stepFour",
            //数据，json字符串
            data: JSON.stringify(fourStep),
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    console.log(res);
                } else {
                    layer.open({
                        content: res.msg,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            },
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                console.log(e.status);
                console.log(e.responseText);
            }
        });
        $(".management-box .special").fadeIn();
        $(".interval").fadeOut();
    });
    let thats = null;
    /* 点击牙齿 显示间隙获得弹窗 */
    $(".management-box .special .gain .teeth li").on("click", function () {
        thats = this;
        $("#interstice2").fadeIn();
        $(".management-box .special").fadeOut();
    })
    /* 特殊要求弹窗 排他 */
    $("#backteeth2 .classify li").on("click", function () {
        /* 给点击的li 添加类名 */
        $(this).addClass("active");
        $("#backteeth2 .classify .reset").removeClass("active")
    })
    /* 特殊要求获得弹窗重置 */
    $("#backteeth2 .classify .reset").on("click", function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    })
    /* 特殊要求获得弹窗的取消 */
    $("#interstice2 .layer-btn .cancel").on("click", function () {
        $("#interstice2").fadeOut();
        $(".management-box .special").fadeIn();
    })
    /* 特殊要求获得列弹窗的保存 */
    $("#interstice2 .layer-btn .save").on("click", function () {
        let strs = "";
        $("#backteeth2 .classify li").each((idx, item) => {
            if ($(item).hasClass("active")) {
                strs += ("<span>" + $(item).children().text() + "</span>")
            }
        })
        $(thats).children("p").html(strs);
        $("#interstice2").fadeOut();
        $(".management-box .special").fadeIn();
    })
    /* 间隙获得显示 特殊要求隐藏 */
    $(".management-box .special .button .last-step").on("click", function () {
        $(".interval").fadeIn();
        $(".management-box .special").fadeOut();
    });
    /* 特殊要求 结束 */
    /* 矫治目标2 开始 */
    /* 矫治目标2 隐藏 */
    $(".management-box .special .button .next-step").on("click", function () {
        $(".correct-target2").fadeIn();
        $(".management-box .special").fadeOut();
    });
    /* 返回病例列表 */
    $(".return").on("click", function () {
        $(".management-box").fadeOut();
        $(".case-management").fadeIn();
    });
})