$(function () {

    app.tab({
        top: ".centre-control .account-box",
        bottom: ".centre-control .account-tab",
        active: "account-box-active",
        callback: function () { },
    });
    // var vConsole = new VConsole();
    /* 个人中心模块 */
    var that = null;
    var getLocalStorage = app.powerLocal();
    var token = getLocalStorage.token;



    class PersonalCenter {
        constructor() {
            that = this;
            /* 医生所有的状态信息 */
            that.statusInfoAll = {};
            /* 医生状态提醒列表 */
            that.statusList = [];
            /* 获取到的所有地址 */
            that.allAddrList = [];
            /* 编辑的第一条信息 */
            that.editAddrInfo = {};
            /* 编辑的地址 */
            /* 修改或新增地址信息初始值 */
            that.editObj = {
                country: "国家",
                province: "省",
                city: "市",
                area: "区"
            };
            /* 修改新建员工信息 */
            that.staffDetailInfo = {};
            /* 设置哪个地方点击的编辑地址按钮 homeEdit true为首页进去 false 为地址列表页进去 */
            that.homeEdit = true;
            /* 记录修改地址还是新增地址 true 修改 false 新增*/
            that.addrStatus = true;
            /* 记录修改员工信息还是新增员工 true 修改 false 新增*/
            that.addStaffInfo = true;


            /* 调用初始化方法 */
            this.init();
        }
        /* 初始化文件 */
        init() {
            /* 设置个人中心模块的高度 */
            let caseMsg = document.querySelector(".account-tab");
            let nav = document.querySelector(".nav");
            let searchBox = document.querySelector(".account-switching");
            caseMsg.style.maxHeight = document.documentElement.clientHeight - nav.clientHeight - searchBox.clientHeight + "px";
            /* /设置个人中心模块的高度 */
            /*除了这个建议在 css 里面加媒体查询*/
            window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {
                //shu
                if (window.orientation === 180 || window.orientation === 0) {
                    setTimeout(function () {
                        caseMsg.style.maxHeight = document.documentElement.clientHeight - nav.clientHeight - searchBox.clientHeight + "px";
                    }, 200)
                }
                //heng
                if (window.orientation === 90 || window.orientation === -90) {
                    setTimeout(() => {
                        caseMsg.style.maxHeight = document.documentElement.clientHeight - nav.clientHeight - searchBox.clientHeight + "px";
                    }, 200);
                }
            }, false);
            that.getAllDoctorInfo();
            that.getAddrList();
            that.getCountry();
            that.doctorEvent();
            that.staffEvent();
            that.getStaffInfo();
            that.getLimintList();
        }
        /* 医生流程事件 */
        doctorEvent() {

            /* 查看所有地址列表 */
            $("#showAllAddrList").on("click", function () {
                $(".centre-control").hide();
                $(".address-list").show();
            });

            /* 查看所有地址列表 -> 返回个人中心 */
            $(".address-list .headbox .left-arrow,.address-list .cancel").on("click", function () {
                $(".centre-control").show();
                $(".address-list").hide();
            });

            /* ================== 修改基本信息 模块 ================== */

            /* 修改基本信息 - 事件 */
            $("#baseName").on("click", function () {
                $("#modifBaseName").show();
            });

            /* 取消弹层 */
            $(".layer-big .cancel").on("click", function () {
                $(".layer-big").hide();
                $(".ipt-box-one input").val("");
            });

            /* 保存修改姓名 */
            $("#saveBaseName").on("click", function () {
                var val = $(".ipt-box-one input").val();
                // 判断是否输入,如果没有输入内容则不请求ajax
                if (!val) {
                    //提示
                    layer.open({
                        content: "请输入用户名",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }


                that.doctorInfo.realname = val;
                that.modifBaseInfo();
                $(".ipt-box-one input").val("");
                $(".layer-big").hide();
            });

            /* 页面 - 基本信息修改返回 */
            $(".modifBack").on("click", function () {
                $(".centre-control").show();
                $(".appliance").hide();
            });
            /* 页面 - 地址信息修改返回 */
            $(".modifTwiceBack").on("click", function () {
                if (that.homeEdit) {
                    $(".centre-control").show();
                    $(".appliance").hide();
                } else {
                    // that.editObj = that.editAddrInfo;
                    $(".address-list").show();
                    $(".address-revise").hide();
                    $(".address-add").hide();
                }

            });

            /* 修改基本信息账户 */
            // $("#baseAccount").on("click", function () {
            //     $(".centre-control").hide();
            //     $(".account-revise").show();
            // });

            /* 保存基本信息账户 */
            // $(".account-revise .right-text").on("click", function () {
            //     var val = $(".account-revise .new-phone input").val();

            //     if (!app.accountNameReg.test(val)) {
            //         //提示未输入
            //         layer.open({
            //             content: "请输入正确的账户",
            //             skin: 'msg',
            //             time: 2 //2秒后自动关闭
            //         });
            //         return false;
            //     }
            //     that.doctorInfo.accountNumber = val;
            //     that.modifBaseInfo();
            //     $(".account-revise .new-phone input").val("");
            //     $(".centre-control").show();
            //     $(".appliance").hide();
            // })

            /* 修改基本信息账户 */
            $("#baseEmail").on("click", function () {
                $(".centre-control").hide();
                $(".postbox-revise").show();
            });

            /* 保存基本信息邮箱修改 */
            $(".postbox-revise .right-text").on("click", function () {
                var val = $(".postbox-revise .new-phone input").val();

                if (!app.emailReg.test(val)) {
                    //提示未输入
                    layer.open({
                        content: "请输入正确的邮箱号码",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                that.doctorInfo.email = val;
                that.modifBaseInfo();
                $(".postbox-revise .new-phone input").val("");
                $(".centre-control").show();
                $(".appliance").hide();
            });

            /* 修改基本信息手机号码 */
            // $("#baseTel").on("click", function () {
            // $(".centre-control").hide();
            // $(".phone-revise").show();
            // });

            /* 保存基本信息邮箱修改 */
            // $(".phone-revise .right-text").on("click", function () {
            //     var val = $(".phone-revise .new-phone input").val();

            //     if (!app.telReg.test(val)) {
            //         //提示未输入
            //         layer.open({
            //             content: "请输入正确的电话号码",
            //             skin: 'msg',
            //             time: 2 //2秒后自动关闭
            //         });
            //         return false;
            //     }
            //     that.doctorInfo.phone = val;
            //     that.modifBaseInfo();
            //     $(".phone-revise .new-phone input").val("");
            //     $(".centre-control").show();
            //     $(".appliance").hide();
            // });

            /* ================== 修改状态信息 模块 ================== */
            /* 修改状态激活通知提醒 */
            $("#statusInfoList li:nth-child(1) .info-right").on("click", function () {
                $(this).toggleClass("active");
                if ($(this).hasClass("active")) {
                    that.statusInfoAll.activation = true;
                } else {
                    that.statusInfoAll.activation = false;
                }
                that.modifStatusInfo();
            });
            /* 修改状态通知方式提醒 */
            $("#statusInfoList li:nth-child(2)").on("click", function () {
                if (that.statusInfoAll.activation) {
                    $("#statusLayer").show();
                }
            });

            /* 状态通知方式tab 所有病例tab*/
            $(".ipt-box-four div").on("click", function () {
                $(this).toggleClass("active");
            });

            /* 通知方式 取消 */
            $("#statusLayer .cancel").on("click", function () {
                $("#statusLayer").hide();
            });

            /* 通知方式弹层保存按钮 */
            $("#statusLayer .save").on("click", function () {
                [...$(".ipt-box-four div")].forEach((item, idx) => {
                    if ($(item).hasClass("active")) {
                        switch (idx) {
                            case 0:
                                that.statusInfoAll.alertType = true;
                                break;
                            case 1:
                                that.statusInfoAll.shortMessage = true;
                                break;

                        }
                    } else {
                        switch (idx) {
                            case 0:
                                that.statusInfoAll.alertType = false;
                                break;
                            case 1:
                                that.statusInfoAll.shortMessage = false;
                                break;


                        }
                    }
                });
                $("#statusLayer").hide();
                that.modifStatusInfo();
            });

            /* 状态通知方式tab 所有病例tab*/
            $(".ipt-box-two div,.limint-list").on("click", "li", function () {
                $(this).toggleClass("active");
            });

            /* 提醒内容 */
            $(".sd").on("click", "li", function () {
                $(this).toggleClass("active");
            });


            /* 修改状态邮箱 */
            $("#statusInfoList li:nth-child(3) .info-right").on("click", function () {
                if (that.statusInfoAll.activation) {
                    $("#emailLayer").show();
                }

            });
            /* 邮箱弹层保存按钮 */
            $("#emailLayer .save").on("click", function () {
                var val = $("#emailLayer input").val();

                if (!app.emailReg.test(val)) {
                    //提示未输入
                    layer.open({
                        content: "请输入正确的邮箱号码",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                that.statusInfoAll.email = val;
                that.modifStatusInfo();
                $("#emailLayer").hide();
                $("#emailLayer input").val("");

            });

            /* 修改状态手机号码 */
            $("#statusInfoList li:nth-child(4)").on("click", function () {
                if (that.statusInfoAll.activation) {
                    $("#statusPhoneLayer").show();
                    $("#statusPhoneLayer input").val("");
                }

            });

            /* 手机号码弹层保存按钮 */
            $("#statusPhoneLayer .save").on("click", function () {
                var val = $(".ipt-box-five input").val();


                if (!app.telReg.test(val)) {
                    //提示未输入
                    layer.open({
                        content: "请输入正确的电话号码",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                that.statusInfoAll.phone = val;
                $("#statusPhoneLayer").hide();
                that.modifStatusInfo();
            });

            /* 修改状态提醒病例 */
            $("#statusInfoList li:nth-child(5) .info-right").on("click", function () {
                if (that.statusInfoAll.activation) {
                    $("#caseLayer").show();
                    $("#caseLayer .ipt-box-two div").eq(that.statusInfoAll.alertCaseType - 1).addClass("active").siblings().removeClass("active");
                }

            });
            $("#caseLayer .ipt-box-two div").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");
            })


            /* 提醒病例弹层保存按钮 */
            $("#caseLayer .save").on("click", function () {


                if ($(".ipt-box-two div").eq(0).hasClass("active")) {
                    that.statusInfoAll.alertCaseType = 1;
                    $("#caseAll").text("所有病例");
                } else {
                    that.statusInfoAll.alertCaseType = 2;
                    $("#caseAll").text("仅限我选择的病例");
                }
                $("#caseLayer").hide();
                that.modifStatusInfo();
            });

            /* 修改状态提醒病例 */
            $("#statusInfoList li:nth-child(6)").on("click", function () {
                // if(that.statusInfoAll.activation){
                if (that.statusInfoAll.activation) {
                    $("#getStatusLayer").show();
                }

                // }else{
                //      //提示未输入
                //      layer.open({
                //         content: "请打开激活通知提醒",
                //         skin: 'msg',
                //         time: 2 //2秒后自动关闭
                //     });
                //     return false;
                // }

            });

            /* 取消提醒病例弹层状态 */
            $("#getStatusLayer .cancel").on("click", function () {
                $(".sd li").removeClass("active");
                [...$(".sd li")].forEach((item, idx) => {
                    that.statusInfoAll.alertContents.forEach((val, key) => {
                        if ($(item).attr("data-id") == val.id) {
                            $(item).addClass("active");
                        }
                    });
                })

            });

            /* 状态提醒病例弹层保存按钮 */
            $("#getStatusLayer .save").on("click", function () {

                /* 如果没选中某个项 就从数组中删除 */
                let dataCount = 0;
                [...$(".sd li")].forEach((item, idx) => {
                    dataCount = 0;
                    that.statusInfoAll.alertContents.forEach((val, key) => {
                        if (!$(item).hasClass("active")) {
                            if (val.id == $(item).attr("data-id")) {
                                that.statusInfoAll.alertContents.splice(key, 1);
                            }
                        }
                        /* 如果选中该选项且保证数组里面没有这条数据 */
                        if ($(item).hasClass("active") && $(item).attr("data-id") != val.id) {
                            dataCount++;
                        }
                    });

                    // console.log(dataCount);
                    // console.log(that.statusInfoAll.alertContents.length);


                    if (dataCount == that.statusInfoAll.alertContents.length) {
                        // console.log($(item).attr("data-id"));
                        that.statusInfoAll.alertContents.push({
                            id: $(item).attr("data-id"),
                            shows: true,
                        });
                    }
                });

                that.modifStatusInfo();
                $("#getStatusLayer").hide();
            });


            /* 医生账户个人中心 编辑 收获地址 */
            $("#editDefaultAddr").on("click", function () {
                that.addrStatus = true;
                /* 医生进去编辑 */
                that.homeEdit = true;
                if (!that.editAddrInfo) {
                    return false;
                }

                that.modifAddrId = $(this).attr("data-id");
                $("#receiverName").val(that.editAddrInfo.deliveryName);
                $("#receiverTel").val(that.editAddrInfo.contactNumber);


                /* 显示当前选中的 地址 */
                $(".countryList").find(`option[value="${that.editAddrInfo.country}"]`).prop("selected", true);
                var countryId = $(".countryList").find(`option[value="${that.editAddrInfo.country}"]`).attr("data-id");

                /* 如果是中国就去请求省市区  */
                if (that.editAddrInfo.country == "中国") {
                    that.getProvince(countryId);

                    $(".provinceList").find(`option[value="${that.editAddrInfo.province}"]`).prop("selected", true);
                    var provinceId = $(".provinceList").find(`option[value="${that.editAddrInfo.province}"]`).attr("data-id");
                    that.getCity(provinceId);

                    $(".cityList").find(`option[value="${that.editAddrInfo.city}"]`).prop("selected", true);
                    var cityId = $(".cityList").find(`option[value="${that.editAddrInfo.city}"]`).attr("data-id");
                    that.getArea(cityId);

                    $(".areaList").find(`option[value="${that.editAddrInfo.area}"]`).prop("selected", true);
                    var areaId = $(".areaList").find(`option[value="${that.editAddrInfo.area}"]`).attr("data-id");
                    that.editObj.province = that.editAddrInfo.province;
                    that.editObj.provinceId = that.editAddrInfo.provinceId;
                    that.editObj.city = that.editAddrInfo.city;
                    that.editObj.cityId = that.editAddrInfo.cityId;
                    that.editObj.area = that.editAddrInfo.area;
                    that.editObj.areaId = that.editAddrInfo.areaId;
                }



                $("#receiverDetail").val(that.editAddrInfo.address);


                that.editObj.countryId = that.editAddrInfo.countryId;
                that.editObj.country = that.editAddrInfo.country;

                $(".address-revise").show();
                $(".centre-control").hide();

                // console.log(that.editObj,that.editAddrInfo);

            });

            /* 点击地址列表 选中哪条 */
            $(".address-list .content-bg").on("click", "li", function () {
                // that.modifAddrId = $(this).attr("data-id");
                // console.log($(this).attr("data-id"));

                that.allAddrList.forEach(val => {
                    if (val.id == $(this).attr("data-id")) {
                        that.showAddrDefault(val);
                        that.editAddrInfo = val;
                    }
                })

                console.log(that.editAddrInfo);

                $(".address-list").hide();
                $(".centre-control").show();
            });

            /* 点击地址列表 编辑 */
            $(".address-list .content-bg").on("click", ".edit-box", function (e) {
                e.stopPropagation();
                that.modifAddrId = $(this).parent().parent().attr("data-id");

                that.homeEdit = false;
                that.allAddrList.forEach(val => {
                    if (val.id == that.modifAddrId) {
                        that.editAddrInfo = val;
                        // that.editObj = val;
                    }
                });
                /* 修改地址 */
                that.addrStatus = true;
                $("#receiverName").val(that.editAddrInfo.deliveryName);
                $("#receiverTel").val(that.editAddrInfo.contactNumber);

                /* 显示当前选中的 地址 */
                $(".countryList").find(`option[value="${that.editAddrInfo.country}"]`).prop("selected", true);
                that.editAddrInfo.countryId = $(".countryList").find(`option[value="${that.editAddrInfo.country}"]`).attr("data-id");


                /* 如果是中国就去请求省市区  */
                if (that.editAddrInfo.country == "中国") {
                    that.getProvince(that.editAddrInfo.countryId);

                    $(".provinceList").find(`option[value="${that.editAddrInfo.province}"]`).prop("selected", true);
                    that.editAddrInfo.provinceId = $(".provinceList").find(`option[value="${that.editAddrInfo.province}"]`).attr("data-id");
                    that.getCity(that.editAddrInfo.provinceId);

                    $(".cityList").find(`option[value="${that.editAddrInfo.city}"]`).prop("selected", true);
                    that.editAddrInfo.cityId = $(".cityList").find(`option[value="${that.editAddrInfo.city}"]`).attr("data-id");
                    that.getArea(that.editAddrInfo.cityId);

                    $(".areaList").find(`option[value="${that.editAddrInfo.area}"]`).prop("selected", true);
                    that.editAddrInfo.areaId = $(".areaList").find(`option[value="${that.editAddrInfo.area}"]`).attr("data-id");


                    that.editObj.country = that.editAddrInfo.country;
                    that.editObj.countryId = that.editAddrInfo.countryId;
                    that.editObj.province = that.editAddrInfo.province;
                    that.editObj.provinceId = that.editAddrInfo.provinceId;
                    that.editObj.city = that.editAddrInfo.city;
                    that.editObj.cityId = that.editAddrInfo.cityId;
                    that.editObj.area = that.editAddrInfo.area;
                    that.editObj.areaId = that.editAddrInfo.areaId;
                }

                $("#receiverDetail").val(that.editAddrInfo.address);

                // console.log(that.editObj);
                // console.log(that.editAddrInfo);

                $(".address-revise").show();
                $(".address-list").hide();
            })

            /* 选择国家数据 */
            $(".countryList").on("change", function () {
                $(".cityList").html(`<option value="市">市</option>`);
                $(".areaList").html(`<option value="区">区</option>`);
                if (!$(this).children('option:selected').attr("data-id") || $(this).children('option:selected').val() == "国家") {
                    $(".provinceList").html(`<option value="">省</option>`);
                    return false;
                }
                that.editObj.country = $(this).children('option:selected').val();
                that.editObj.countriesId = $(this).children('option:selected').attr("data-id");
                that.editObj.province = null;
                that.editObj.provinceId = null;

                that.editObj.city = null;
                that.editObj.cityId = null;

                that.editObj.area = null;
                that.editObj.areaId = null;
                that.getProvince($(this).children('option:selected').attr("data-id"));
            });


            /* 选择省数据 */
            $(".provinceList").on("change", function () {
                $(".areaList").html(`<option value="区">区</option>`);

                if (!$(this).children('option:selected').attr("data-id") || $(this).children('option:selected').val() == "省") {
                    $(".cityList").html(`<option value="市">市</option>`);
                    return false;
                }
                that.editObj.province = $(this).children('option:selected').val();
                that.editObj.provinceId = $(this).children('option:selected').attr("data-id");


                that.editObj.city = null;
                that.editObj.cityId = null;

                that.editObj.area = null;
                that.editObj.areaId = null;
                that.getCity($(this).children('option:selected').attr("data-id"));
            });

            /* 选择市数据 */
            $(".cityList").on("change", function () {
                if (!$(this).children('option:selected').attr("data-id") || $(this).children('option:selected').val() == "市") {
                    $(".areaList").html(`<option value="区">区</option>`);
                    return false;
                }
                that.editObj.city = $(this).children('option:selected').val();
                that.editObj.cityId = $(this).children('option:selected').attr("data-id");

                that.editObj.area = null;
                that.editObj.areaId = null;
                that.getArea($(this).children('option:selected').attr("data-id"));
            });

            /* 选择区数据 */
            $(".areaList").on("change", function () {
                that.editObj.area = $(this).children('option:selected').val();
                that.editObj.areaId = $(this).children('option:selected').attr("data-id");
            })

            /* 修改地址 删除按钮 */
            $(".address-revise .cancel").on("click", function () {
                that.removeAddr(that.modifAddrId);
                $(".address-revise").hide();
                if (that.homeEdit) {
                    $(".centre-control").show();
                } else {
                    $(".address-list").show();
                }
                $("#receiverName").val("");
                $("#receiverTel").val("");
                $('.countryList option').prop('selected', false);
                $('.provinceList option').prop('selected', false);
                $('.cityList option').prop('selected', false);
                $('.areaList option').prop('selected', false);
                $("#receiverDetail").val("");
            });

            /* 新增收获地址 */
            $(".address-list .preserve").on("click", function () {


                $(".provinceList").html(`<option>省</option>`);
                $(".cityList").html(`<option>市</option>`);
                $(".areaList").html(`<option>区</option>`);
                that.addrStatus = false;
                that.homeEdit = false;
                that.editObj = {
                    address: "",
                    contactNumber: "",
                    deliveryName: "",
                    id: "",
                    country: "国家",
                    countriesId: null,
                    province: "省",
                    provinceId: null,
                    city: "市",
                    cityId: null,
                    area: "区",
                    areaId: null,
                };
                $("#addDetail").val("");
                $("#addTel").val("");
                $("#addName").val("");

                $(".countryList").find(`option[value="${that.editObj.country}"]`).prop("selected", true);
                $(".provinceList").find(`option[value="${that.editObj.province}"]`).prop("selected", true);
                $(".cityList").find(`option[value="${that.editObj.city}"]`).prop("selected", true);
                $(".areaList").find(`option[value="${that.editObj.area}"]`).prop("selected", true);
                $(".address-list").hide();
                $(".address-add").show();

            });

            /* 修改地址 新增地址 保存按钮 */
            $(".address-revise .preserve,.address-add .preserve").on("click", function () {
                /* 新增还是修改 true 修改*/
                if (that.addrStatus) {
                    var editObj = {
                        address: $("#receiverDetail").val(),
                        contactNumber: $("#receiverTel").val(),
                        deliveryName: $("#receiverName").val(),
                        id: that.modifAddrId,
                    };
                    // that.editObj = that.editAddrInfo;
                } else {
                    /* 新增 */
                    var editObj = {
                        address: $("#addDetail").val(),
                        contactNumber: $("#addTel").val(),
                        deliveryName: $("#addName").val(),
                    };
                    delete that.editObj.id;
                }


                Object.assign(that.editObj, editObj);
                if (!that.editObj.deliveryName) {
                    //提示
                    layer.open({
                        content: "请输入用户名",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (!app.userNameReg.test(that.editObj.deliveryName)) {
                    //提示
                    layer.open({
                        content: "请输入正确格式的用户名",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (!that.editObj.contactNumber) {
                    //提示未输入
                    layer.open({
                        content: "请输入电话号码",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (!app.telReg.test(that.editObj.contactNumber)) {
                    //提示未输入
                    layer.open({
                        content: "请输入正确的电话号码",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }


                console.log(that.editObj);
                if (that.editObj.country.includes("国家") || !that.editObj.country) {
                    //提示未输入
                    layer.open({
                        content: "请选择国家",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }

                if (that.editObj.country == "中国" &&
                    (that.editObj.province == "省" || that.editObj.city == "市" || that.editObj.area == "区")||
                    (!that.editObj.province || !that.editObj.city || !that.editObj.area)||
                (that.editObj.province.indexOf("省") == 0 || that.editObj.city.indexOf("市") == 0 || that.editObj.area.indexOf("区") == 0))
                {
                    //提示未输入
                    layer.open({
                        content: "请选择省市区",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }

                if (!that.editObj.address) {
                    //提示未输入
                    layer.open({
                        content: "请输入详细地址",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }

                // console.log(that.addrStatus);
                // return false;
                if (that.addrStatus) {
                    that.modifAddr(that.editObj);
                } else {
                    that.addAddr(that.editObj);
                }

                /* 如果医生首页进来 改地址 */
                if (that.homeEdit) {
                    $(".centre-control").show();
                } else {
                    /* 如果地址列表首页进来 改地址 */
                    $(".address-list").show();
                }

                $(".address-revise").hide();
                $(".address-add").hide();
            });

            /* 新增地址取消 按钮 */
            $(".address-add .cancel").on("click", function () {
                $(".address-add").hide();
                $(".address-list").show();

                $("#addName").val("");
                $("#addTel").val("");

                $('.countryList option').prop('selected', false);
                $('.provinceList option').prop('selected', false);
                $('.cityList option').prop('selected', false);
                $('.areaList option').prop('selected', false);
                $("#addDetail").val("");
                that.editObj = that.editAddrInfo;
            });

        }

        /* 员工流程时间 */
        staffEvent() {
            /* 点击员工详情 */
            $(".list-information").on("click", "li", function () {
                that.staffId = $(this).attr("data-id");
                if ($(this).index() == 0 || !that.staffId) return false;
                $(".employee-home").hide();
                $(".employeee-information").show();
                that.getStaffDetailInfo(that.staffId);
            });

            /* 详情页返回 按钮 */
            $(".employeee-information .return-rutton").on("click", function () {
                $(".employee-home").show();
                $(".employeee-information").hide();
            })

            /* 修改员工信息 */
            $(".modify-information").on("click", function () {
                $(".employeee-information").hide();
                $(".create-new-account").show();
                /* 修改员工账户 */
                that.addStaffInfo = true;
                $(".employee-information-account p").html("修改员工账号");
                console.log(that.staffDetailInfo);
                /* 更新列表状态 */
                var strArr = [];
                $(".limint-list li").removeClass("active");
                if (that.staffDetailInfo.rights.length > 0) {
                    that.staffDetailInfo.rights.forEach(item => {
                        strArr.push(`<p data-id="${item.id}">${item.saleName}</p>`)
                        $(".limint-list li").eq(item.rightCode - 1).addClass("active");
                    });
                };

                $(".account-jurisdiction").html(strArr.join(""));

                $("#newStaffName").val(that.staffDetailInfo.name);
                $("#newStaffAccount").val(that.staffDetailInfo.accountNumber);
                $("#newStaffpwd").val(that.staffDetailInfo.password);


            });

            /* 修改员工信息 返回去详情 */
            $(".create-new-account .return-account-rutton,.create-new-account .modify-cancel").on("click", function () {
                $(".create-new-account").hide();
                $(".employeee-information").hide();

                /* 还原之前选中状态 */
                $(".limint-list li").removeClass("active");
                limitsLayerData.forEach(item => {
                    $(".limint-list li").eq(item).addClass("active");
                });

                if (that.addStaffInfo) {
                    $(".employeee-information").show();
                } else {
                    $(".employee-home").show();
                }

            });

            /* 修改信息 注销按钮 */
            $(".employeee-information .modify-cancel").on("click", function () {
                $(".cancel-number").show();
                $(".delete-account-number").val("");
                console.log(that.addStaffInfo);

                if (that.addStaffInfo) {
                    $(".employeee-information").hide();
                } else {
                    $(".employee-home").hide();
                }

            });
            /* 取消 注销账户 按钮 */
            $(".cancel-number .cancel-cancel,.cancel-number .return-account-cancel").on("click", function () {
                $(".cancel-number").hide();
                $(".employeee-information").show();
            });

            /* 保存 注销账户 按钮 */
            $(".cancel-number .cancel-keep-confirm").on("click", function () {
                var doctorPwd = $(".delete-account-number").val();

                if (!doctorPwd) {
                    layer.open({
                        content: "请输入医生账户密码",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }

                // secretKey: app.changeKey({
                //     psw: passwordValue,
                //     type: 0
                // }),
                var staffInfo = {
                    staffId: that.staffId,
                    doctorPassword: app.changeKey({
                        psw: doctorPwd,
                        type: 0
                    })
                }
                that.offStaffInfo(staffInfo);
            });

            let limitsLayerData = [];
            /* 员工权限弹窗 */
            $(".account-title").on("click", function () {
                /* 新建员工账户权限 */
                $("#limitsLayer").show();
                [...$("#limitsLayer li")].forEach((item, val) => {
                    if ($(item).hasClass("active")) {
                        limitsLayerData.push(val);
                    }
                })
            });

            /* 权限取消 */
            $("#limitsLayer .cancel").on("click", function () {
                /* 还原之前选中状态 */
                $(".limint-list li").removeClass("active");
                limitsLayerData.forEach(item => {
                    $(".limint-list li").eq(item).addClass("active");
                });
            });

            /* 权限保存 */
            $("#limitsLayer .save").on("click", function () {

                var limintDomArr = [];
                [...$(".limint-list li")].forEach(item => {
                    if ($(item).hasClass("active")) {
                        limintDomArr.push(`<p>${$(item).text()}</p>`);
                    }
                });
                $("#limitsLayer").hide();
                $(".account-jurisdiction").html(limintDomArr);
            });

            /* 修改信息保存 按钮 */
            $(".modify-keep").on("click", function () {

                if (!that.addStaffInfo) {
                    that.staffDetailInfo = {};
                }
                var rights = [];
                [...$(".limint-list li")].forEach(item => {
                    if ($(item).hasClass("active")) {
                        rights.push({
                            rightCode: $(item).attr("data-code")
                        });
                    }
                });


                that.staffDetailInfo.rights = rights;
                that.staffDetailInfo.name = $("#newStaffName").val();
                that.staffDetailInfo.accountNumber = $("#newStaffAccount").val();

                if (!app.userNameReg.test($("#newStaffName").val())) {
                    //提示
                    layer.open({
                        content: "姓名允许1-16位组成",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }


                if (!app.accountNameReg.test($("#newStaffAccount").val())) {
                    //提示
                    layer.open({
                        content: "账号由4-20位数字和字母组成",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }


                if (app.passwordReg.test($("#newStaffpwd").val())) {
                    that.staffDetailInfo.password = app.changeKey({
                        psw: $("#newStaffpwd").val(),
                        type: 0
                    });
                } else {
                    //提示
                    layer.open({
                        content: "密码由6-12字母和数字组成",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }


                console.log(that.staffDetailInfo);
                if (that.addStaffInfo) {
                    /* 修改 员工信息 */
                    that.updateStaffInfo(that.staffDetailInfo);
                } else {
                    that.staffDetailInfo.password = app.changeKey({
                        psw: $("#newStaffpwd").val(),
                        type: 0
                    });
                    /* 新增 员工信息 */
                    that.addStaff(that.staffDetailInfo);

                }
                $(".create-new-account").hide();
                $(".employee-home").show();
            })

            /* 点击新建账户 */
            $(".new-button").on("click", function () {
                $(".employee-home").hide();
                $(".create-new-account").show();
                limitsLayerData = [];
                $(".limint-list li").removeClass("active");
                $(".account-jurisdiction").html("");
                $(".employee-information-account p").html("新建员工账号");
                $(".create-new-account input").val("");

                /* 新增员工账户 */
                that.addStaffInfo = false;
                that.getLimintList();
            });
        }

        /* 添加员工账户 */
        addStaff(data) {
            $.ajax({
                type: "post",
                url: app.apiUrl + "/staff/registerStaff?t=" + app.random,
                async: false,
                //请求的媒体类型
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(data),
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        that.getStaffInfo();
                        var data = JSON.parse(res.data);
                        // console.log(data);
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
            })
        }
        /* 修改员工信息 */
        updateStaffInfo(data) {
            $.ajax({
                type: "post",
                url: app.apiUrl + "/staff/updateStaff?t=" + app.random,
                async: false,
                //请求的媒体类型
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(data),
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {

                        if (res.data) {
                            var data = JSON.parse(res.data);
                            // console.log(data);
                            var strArr = [];
                            data.forEach(item => {
                                /* 处理权限列表展示 */
                                strArr.push(`<li data-id="${item.id}" data-code="${item.rightCode}">${item.saleName}</li>`);
                            });
                            $(".limint-list").html(strArr.join(""));

                        }
                        that.getStaffInfo();

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
            })
        }

        /* 获取员工权限列表 */
        getLimintList() {
            $.ajax({
                type: "get",
                url: app.apiUrl + "/staff/rightList?t=" + app.random,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {

                        var data = JSON.parse(res.data);
                        // console.log(data);
                        var strArr = [];
                        data.forEach(item => {
                            /* 处理权限列表展示 */
                            strArr.push(`<li data-id="${item.id}" data-code="${item.rightCode}">${item.saleName}</li>`);
                        });
                        $(".limint-list").html(strArr.join(""));
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
            })
        }

        /* 获取当前用户登录的权限 */
        getCurStaffLimint() {
            $.ajax({
                type: "get",
                url: app.apiUrl + "/staff/rights?t=" + app.random,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {

                        var data = JSON.parse(res.data);
                        // console.log(data);
                        var strArr = [];
                        data.forEach(item => {
                            /* 处理权限列表展示 */
                            strArr.push(`<p data-code="${item.rightCode}">${item.saleName}</p>`);
                        });
                        $(".account-jurisdiction").html(strArr.join(""));

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

        /* 获取员工列表信息 */
        getStaffInfo() {
            $.ajax({
                type: "get",
                url: app.apiUrl + "/staff/findAllStaff?t=" + app.random,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                async: false,
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {

                        var data = JSON.parse(res.data);
                        // console.log(data);
                        var strArr = [`<li>
                    <p>姓名</p>
                    <p>账号</p>
                    <p>权限</p>
                </li>`];
                        if (data.length > 0) {
                            data.forEach(item => {
                                var jurisdictionList = [];
                                /* 处理权限列表展示 */
                                if (item.rights.length > 0) {
                                    item.rights.forEach(val => {
                                        jurisdictionList.push(`<span data-id="${val.id}">${val.saleName}</span>`)
                                    })
                                } else {
                                    jurisdictionList.push(`暂无权限`);
                                }
                                var rightStr = jurisdictionList.join("");
                                strArr.push(`<li data-id="${item.staffId}">
                    <p>${item.name}</p>
                    <p>${item.accountNumber}</p>
                    <p>${rightStr}</p>
                </li>`);
                            });
                        }else{
                            strArr.push(`<li>暂无数据</li>`);
                        }
                        $(".list-information").html(strArr.join(""));


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
            })
        }
        /* 获取员工详情信息 */
        getStaffDetailInfo(id) {
            $.ajax({
                type: "get",
                url: app.apiUrl + "/staff/findStaff?t=" + app.random,
                async: false,
                data: {
                    staffId: id
                },
                async: false,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {

                        var data = JSON.parse(res.data);
                        /* 记录当前员工信息 */
                        that.staffDetailInfo = data;

                        $("#staffName").text(data.name);
                        $("#staffAccount").text(data.accountNumber);
                        $("#staffPassword").text(data.password);
                        var strArr = [];
                        $(".limint-list li").removeClass("active");
                        if (data.rights.length > 0) {
                            data.rights.forEach(item => {
                                strArr.push(`<p data-id="${item.id}">${item.saleName}</p>`)
                                $(".limint-list li").eq(item.rightCode - 1).addClass("active");
                            });
                        }
                        $("#staffJurisdiction").html(strArr.join(""));
                        $(".account-jurisdiction").html(strArr.join(""))


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
            })
        }

        /* 注销员工信息 */
        offStaffInfo(data) {
            $.ajax({
                type: "get",
                url: app.apiUrl + "/staff/delStaff?t=" + app.random,
                data: data,
                async: false,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        var data = JSON.parse(res.data);
                        // console.log(data);
                        $(".cancel-number").hide();
                        $(".new-account").show();
                        $(".employee-home").show();
                        that.getStaffInfo();
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
            })
        }

        /* 修改医生基本信息 */
        modifBaseInfo() {
            $.ajax({
                type: "post",
                url: app.apiUrl + "/doctor/updateInfo?t=" + app.random,
                async: false,
                //请求的媒体类型
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(that.doctorInfo),
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        that.getAllDoctorInfo();
                    } else {
                        //提示
                        layer.open({
                            content: res.msg,
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                        that.setTabs(that.layerName)
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
            })

        }
        /* 删除收获地址 */
        removeAddr(id) {
            $.ajax({
                type: "POST",
                url: app.apiUrl + "/deliveryAddress/delAddress?t=" + app.random,
                contentType: "application/json;charset=UTF-8",
                async: false,
                data: JSON.stringify({
                    id: id
                }),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        that.getAddrList();
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
            })
        }
        /* 修改收获地址 */
        modifAddr(data) {
            that.allAddrList.forEach((item, idx) => {
                if (item.id == data.id) {
                    that.allAddrList[idx] = data;
                }
            });
            console.log(that.allAddrList);
            $.ajax({
                type: "POST",
                url: app.apiUrl + "/deliveryAddress/addDeliveryAddressList?t=" + app.random,
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(that.allAddrList),
                async: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        that.getAddrList();
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
            })
        }

        /* 添加收获地址 */
        addAddr(data) {
            $.ajax({
                type: "POST",
                url: app.apiUrl + "/deliveryAddress/saveAddress?t=" + app.random,
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(data),
                async: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        that.getAddrList();
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
            })
        }
        /* 修改医生状态信息 */
        modifStatusInfo() {
            $.ajax({
                type: "POST",
                url: app.apiUrl + "/statusAlert/saveAlert?t=" + app.random,
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(that.statusInfoAll),
                async: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        that.getAllDoctorInfo();
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
            })
        }
        /* 获取医生信息 */
        getAllDoctorInfo() {
            $.ajax({
                type: "get",
                url: app.apiUrl + "/doctor/getInfo?t=" + app.random,
                //请求的媒体类型
                contentType: "application/json;charset=UTF-8",
                async: false,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {

                        var infos = JSON.parse(res.data);

                        /* 记录后台来的基础医生信息 */
                        that.doctorInfo = {
                            realname: infos.realname,
                            phone: infos.phone,
                            email: infos.email,
                            accountNumber: infos.accountNumber,
                        };

                        that.statusInfoAll.phone = infos.phone;
                        that.statusInfoAll.email = infos.email;

                        $("#curInfoTel").get(0).innerHTML = infos.phone;
                        $("#curInfoEmail").get(0).innerHTML = infos.email;
                        $("#accountNumber").get(0).innerHTML = infos.accountNumber;
                        $("#baseName span").text(infos.realname);
                        $("#baseAccount span").text(infos.accountNumber);
                        $("#baseEmail span").text(infos.email);
                        $("#baseTel span").text(that.setTelResFn(infos.phone));
                        $("#remindEmail .info-right span").html(infos.email);
                        $("#remindTel").html(that.setTelResFn(infos.phone));

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
            })

            /* 获取状态提醒列表 */
            $.ajax({
                type: "get",
                url: app.apiUrl + "/statusAlert/alerts?t=" + app.random,
                /* 设置同步 */
                async: false,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        var data = JSON.parse(res.data);
                        var lisLayer = [];
                        that.statusList = data;
                        data.forEach(value => {
                            lisLayer.push(`<li data-id="${value.id}" class="lis">${value.content}</li>`)
                        });
                        $(".sd").html(lisLayer.join(""));

                    } else {
                        //提示
                        layer.open({
                            content: res.msg,
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                        that.setTabs(that.appAccount, that.nav, that.centre);
                    }

                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    // console.log(e);
                    //提示
                    layer.open({
                        content: e.responseJSON.message,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                }
            })

            /* 获取状态提醒数据 */
            $.ajax({
                type: "get",
                url: app.apiUrl + "/statusAlert/alertInfo?t=" + app.random,
                async: false,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        var data = JSON.parse(res.data);

                        that.statusInfoAll.activation = data.activation;
                        that.statusInfoAll.alertCaseType = data.alertCaseType;
                        that.statusInfoAll.alertType = data.alertType;
                        that.statusInfoAll.shortMessage = data.shortMessage;
                        that.statusInfoAll.email = data.email;
                        that.statusInfoAll.phone = data.phone;
                        that.statusInfoAll.alertContents = [];
                        if (data.alertContents) that.statusInfoAll.alertContents = data.alertContents;

                        var lis = [];
                        var diffId = [];
                        var count = 0;
                        /* 遍历状态列表有数据 */
                        if (data.alertContents) {
                            data.alertContents.forEach((value, idx) => {
                                switch (value.id) {
                                    case 1:
                                        diffId.push(value.id);
                                        count++;
                                        lis.push(`<li><span>${count}</span>.<span>3D设计方案更新提醒</span></li>`);
                                        break;
                                    case 5:
                                        diffId.push(value.id);
                                        count++;
                                        lis.push(`<li><span>${count}</span>.<span>保持器换新提醒</span></li>`);
                                        break;
                                    case 2:
                                        diffId.push(value.id);
                                        count++;
                                        lis.push(`<li><span>${count}</span>.<span>矫治器发货</span></li>`);
                                        break;
                                    case 6:
                                        diffId.push(value.id);
                                        count++;
                                        lis.push(`<li><span>${count}</span>.<span>治疗到期日</span></li>`);
                                        break;
                                    case 3:
                                        diffId.push(value.id);
                                        count++;
                                        lis.push(`<li><span>${count}</span>.<span>患者资料缺失/错误</span></li>`);
                                        break;
                                    case 7:
                                        diffId.push(value.id);
                                        count++;
                                        lis.push(`<li><span>${count}</span>.<span>病例更新进度</span></li>`);
                                        break;
                                    case 4:
                                        diffId.push(value.id);
                                        count++;
                                        lis.push(`<li><span>${count}</span>.<span>治疗方案中存在临床问题</span></li>`);
                                        break;
                                }
                            });
                        }

                        /* 选中的状态提醒设置 active 类名 */
                        // console.log(lis, diffId);
                        $(".sd li").removeClass("active");
                        diffId.forEach(item => {
                            [...$(".sd li")].forEach((val, idx) => {
                                if ($(val).attr("data-id") == item) {
                                    $(val).addClass("active");
                                }
                            })
                        });



                        $(".remind-regulations").html(lis.join(""));
                        $("#remindEmail .info-right span").html(data.email);
                        $("#remindTel").html(that.setTelResFn(data.phone));


                        if (data.activation == true) {
                            $("#remind").addClass("active");
                        } else {
                            $("#remind").removeClass("active");
                        }

                        $(".ipt-box-four div").removeClass("active");
                        let showMessStatusStr = "";
                        if (data.alertType) {
                            $(".ipt-box-four div").eq(0).addClass("active");
                            showMessStatusStr = $(".ipt-box-four div").eq(0).text();
                        }
                        if (data.alertType && data.shortMessage) {
                            showMessStatusStr += ",";
                        }
                        if (data.shortMessage) {
                            $(".ipt-box-four div").eq(1).addClass("active");
                            showMessStatusStr += $(".ipt-box-four div").eq(1).text();
                        }

                        $("#informType .info-right span").html(showMessStatusStr);

                        if (data.alertCaseType == 1) {
                            $("#caseLayer .choice").eq(0).addClass("active").siblings().removeClass("active");
                            $("#caseAll").text("所有病例");
                        } else {
                            $("#caseLayer .choice").eq(1).addClass("active").siblings().removeClass("active");
                            $("#caseAll").text("仅限我选择的病例");
                        }

                    } else {
                        //提示
                        layer.open({
                            content: res.msg,
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                        that.setTabs(that.appAccount, that.nav, that.centre);
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
            })
        };
        /* 手机中间四位变成*方法 */
        setTelResFn(options) {
            if (!options) return options;

            var reg = /^(\d{3})\d*(\d{4})$/;
            options = options.replace(reg, '$1****$2')
            return options;
        }
        /* 获取地址列表 */
        getAddrList() {
            $.ajax({
                type: "get",
                url: app.apiUrl + "/deliveryAddress/getAddressList?t=" + app.random,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        res.data = JSON.parse(res.data);
                        that.allAddrList = res.data;
                        var lis = [];
                        if (that.allAddrList.length > 0) that.allAddrList.forEach((value) => {
                            lis.push(`<li data-id="${value.id}"><div class="border-bottom-box"><div class="address-name"><span>${value.deliveryName}</span><span class="phone">${value.contactNumber}</span></div><div class="address-position"><span class="message">${value.province + value.city + value.area + value.address}<span></div><div class="edit-box">编辑</div></div></li>`);
                        });

                        that.showAddrDefault(that.allAddrList[0]);
                        /* 医生进去编辑 展示当前编辑的这一条 */
                        if (that.homeEdit) {
                            that.allAddrList.forEach((item, idx) => {
                                if (item.id == that.modifAddrId) {
                                    that.showAddrDefault(that.allAddrList[idx]);
                                }
                            })
                        }



                        that.editAddrInfo = that.allAddrList[0];
                        $(".address-list .content-bg").html(lis.join(""));
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
            })
        }
        /* 渲染第一条地址 */
        showAddrDefault(options) {
            if (options) {
                $("#defaultAddr span").eq(0).html(options.deliveryName);
                $("#defaultAddr span").eq(1).html(options.contactNumber);
                $("#defaultAddrSpan").html(options.country + options.province + options.city + options.area + options.address);
                $("#editDefaultAddr").attr("data-id", options.id);
            } else {
                $("#editDefaultAddr").hide();
            }
        }
        /* 省市区三级联动 国家 */
        getCountry() {
            $.ajax({
                type: "GET",
                url: app.apiUrl + "/region/countryList?t=" + app.random,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        res.data = JSON.parse(res.data);

                        var arr = [`<option value="国家">国家</option>`];
                        res.data.forEach(value => {
                            arr.push(`<option data-id="${value.countriesId}" value="${value.countriesName}">${value.countriesName}</option>`);
                        })
                        arr = arr.join("");
                        $(".countryList").html(arr);
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
            })
        }
        /* 省市区三级联动 省 */
        getProvince(id) {
            $.ajax({
                type: "GET",
                url: app.apiUrl + "/region/provinceList?t=" + app.random,
                //请求的媒体类型
                data: {
                    countriesId: id,
                },
                async: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        res.data = JSON.parse(res.data);

                        var arr = [`<option value="省">省</option>`];
                        res.data.forEach(value => {
                            arr.push(`<option data-id="${value.provinceId}" value="${value.provinceName}">${value.provinceName}</option>`);
                        })
                        arr = arr.join("");
                        $(".provinceList").html(arr);
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
            })
        }
        /* 省市区三级联动 市 */
        getCity(id) {
            $.ajax({
                type: "GET",
                url: app.apiUrl + "/region/cityList?t=" + app.random,
                //请求的媒体类型
                data: {
                    provinceId: id,
                },
                async: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        res.data = JSON.parse(res.data);
                        var arr = [`<option value="市">市</option>`]
                        res.data.forEach(value => {
                            arr.push(`<option data-id="${value.cityId}" value="${value.cityName}">${value.cityName}</option>`);
                        })
                        arr = arr.join("");
                        $(".cityList").html(arr);

                    } else {
                        //提示
                        layer.open({
                            content: res.msg,
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                        that.setTabs(that.layerName)
                    }
                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    //提示
                    // console.log(e)
                    layer.open({
                        content: e.responseJSON.message,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                }
            })
        }
        /* 省市区三级联动 区 */
        getArea(id) {
            $.ajax({
                type: "GET",
                url: app.apiUrl + "/region/areaList?t=" + app.random,
                data: {
                    cityId: id,
                },
                async: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        res.data = JSON.parse(res.data);
                        var arr = [`<option value="区">区</option>`]
                        res.data.forEach(value => {
                            arr.push(`<option data-id="${value.areaId}" value="${value.areaName}">${value.areaName}</option>`);
                        })
                        arr = arr.join("");
                        $(".areaList").html(arr);
                    } else {
                        //提示
                        layer.open({
                            content: res.msg,
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                        that.setTabs(that.layerName)
                    }
                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    //提示
                    // console.log(e)
                    layer.open({
                        content: e.responseJSON.message,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                }
            })
        }


    };


    new PersonalCenter();
})