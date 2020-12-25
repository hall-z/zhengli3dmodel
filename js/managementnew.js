/* 年月日插件 */
var pcx = pcx || {};
var that = null;
/* 获取本地存储的数据 */

var getLocalStorage = JSON.parse(localStorage.getItem("requestToken"));
var token = getLocalStorage.token;
var isDoctorType = getLocalStorage.type;
// var vConsole = new VConsole();

/* 替换小数点文字 */
function replaceDotNumber(data) {
    let reg = /^\d{1,4}[\.]?[\d]*$/;
    let res = reg.test(data) ? data : "";
    event.target.value = res;
}
$(function () {
    /* 渲染日期 */
    pcx.dc = new Lunar();
    var date1 = new ruiDatepicker().init("#demo1");
    /* 点击保存 */
    let clickFlagSave = true;
    /*******************************************************************新建病例 开始 ******************************************************************* */
    /* 新建病例 开始 */
    class CreateCase {
        constructor() {
            that = this;
            //第一步传递的对象
            that.firstStep = {};
            //第二步传递的对象
            that.secondStep = {}
            //第三步传递的对象
            that.thirdStep = {}
            //第四步传递的对象
            that.fourStep = {}
            //第五步传递的对象
            that.fiveStep = {}
            //第6步传递的对象
            that.sixStep = {}
            //第7步传递的对象
            that.sevenStep = {}
            //第8步传递的对象
            that.eightStep = {}
            /* 修改地址对象 存姓名 电话 省市区 */
            that.editObj = {};
            /* 第二步基本信息 收货信息还是修改 true 修改 false 新增*/
            that.addrStatus = true;
            /* 修改地址的id */
            that.modifAddrId = "";
            /* 第二步基本信息 到修改地址 1 */
            that.baseEditInfo = 1;
            /* 第二步基本信息 新建医院信息还是修改 true 修改 false 新增*/
            that.addrHospitalStatus = true;
            /* 新增或修改医院地址 传递给服务器端的数据 */
            that.updateHospitalData = {};
            /* 记录是否重启病例 false 新建*/
            that.isBegianCase = false;
            /* 记录重启病例的 id */
            that.againCaseId = null;
            /* 第八步所有数据数组 */
            that.eightStepArr = [];
            /* 记录病例重启时删除过的照片 */
            that.againSet = new Set();
            /* 记录第八步上传次数 */
            that.eightCount = 0;
            /* 记录第8步上传的弹层编号 */
            that.eightLayer = [];
            /* 记录重启获取数据数组 */
            that.caseStatusCodeArr = [1, 1, 1, 1, 1, 1, 1];
            that.init();
        }
        init() {
            that.getCountry();
            that.stepOneEvent();
            that.stepTwoEvent();
            that.stepThreeEvent();
            that.stepFourEvent();
            that.stepFiveEvent();
            that.stepSixEvent();
            that.stepSevenEvent();
            that.stepEightEvent();
            that.stepNineEvent();


            let newCard = app.getQueryString("new");
            /* 新建病例 */
            console.log(newCard);
            if (newCard == 1) {
                // that.getCancelCase();
                that.createCaseBegin();
                $(".basic-information .user-name").attr("disabled", false);

            } else if (newCard == 2) {
                /* 继续新建病例 */
                let data = app.getQueryString("data");
                data = JSON.parse(data);
                that.createCaseAgain(data);
                $(".basic-information .user-name").attr("disabled", false);

            } else if (newCard == 3) {
                /* 重启病例 */
                that.isBegianCase = true;
                let caseId = app.getQueryString("caseId");
                that.againCaseId = {
                    caseId: caseId
                }
                $(".basic-information .user-name").attr("disabled", true);
                that.createCaseBegin(caseId);
            }


            /*点击导航栏跳转 判断是否在新建病例页面中 开始 zxl修改 */
            $(".menu-list li a").on("click", function (e) {
                let that1 = this;
                if (!$(".management-box").is(":hidden")) {
                    let contentTitle = '您确定要退出新建的病例？';
                    if (that.isBegianCase) {
                        contentTitle = '您确定要退出重启的病例？';
                    }
                    layer.open({
                        content: contentTitle,
                        btn: ['确定', '取消'],
                        yes: function (index) {
                            layer.close(index);
                            location.href = $(that1).attr("href");
                            $(".management-box").hide();
                        },
                        no: function (index) {
                            layer.close(index);
                        }
                    });
                    e.preventDefault();
                }
            })
            /*点击导航栏跳转 判断是否在新建病例页面中 结束 */

        }
        /* 新建病例第一步里面的所有事件 */
        stepOneEvent() {
            /* 给所有弹层的取消按钮注册点击事件 当前弹层隐藏 */
            $(".layer-big .cancel").on("click", function () {
                $("body").removeClass("beyond");
                $(this).parents(".layer-big").hide();
            });
            /* 给所有弹层的保存按钮注册点击事件 当前弹层隐藏 */
            $(".layer-big .save").on("click", function () {
                $("body").removeClass("beyond");
                // $(this).parents(".layer-big").hide();
            })
            // /* 点击重启病例*/
            // $("#supplementRestart").on("click", function () {
            //     $(".case-particulars").hide();
            //     $(".management-box").show();
            //     /* 删除之前未完成的病例 重新启动 */
            //     that.isBegianCase = true;
            //     let caseId = $(this).attr("data-id");
            //     that.againCaseId = {
            //         caseId: caseId
            //     }
            //     that.createCaseBegin(caseId);
            // });

            /* 病例列表隐藏 新建病例显示 */
            // $(".new-case").on("click", function () {
            //     that.isBegianCase = false;
            //     that.againCaseId = null;
            //     that.getNoCompleteCase();
            // });

            /* 品牌里面的 li 注册点击事件 */
            $(".brand ul").on("click", "li", function () {
                /* 未选中图片隐藏 */
                /* 选中图片显示 */
                /* 给点击的li 添加样式 */
                $(this).children().children(".pitch-on").show();
                /* 给其他的 li 隐藏 */
                $(this).siblings().children().children(".pitch-on").hide();
            });

            /* 返回病例列表 */
            $(".return").on("click", function () {
                let contentTitle = '您确定要退出新建的病例？';
                if (that.isBegianCase) {
                    contentTitle = '您确定要退出重启的病例？';
                }
                $("body").addClass("beyond");
                //询问框
                layer.open({
                    content: contentTitle,
                    btn: ['确定', '取消'],
                    yes: function (index) {
                        layer.close(index);
                        $("body").removeClass("beyond");
                        if (that.isBegianCase) {
                            // $(".case-particulars").show();
                        } else {
                            // $(".case-management").show();
                        }
                        window.history.go(-1);
                        // $(".management-box").hide();
                    },
                    no: function (index) {
                        $("body").removeClass("beyond");
                        layer.close(index);
                    }
                });
                // if (that.isBegianCase) {
                //     $(".case-particulars").show();
                // } else {
                //     $(".case-management").show();
                // }

            });

            /* 品牌选择下一步 */
            $(".brand .button .next-step").on("click", function () {
                /* 判断有没有选择品牌 */
                var brandCheckedCount = 0;
                $(".brand .pitch-on").each((idx, item) => {
                    if ($(item).is(":hidden")) {
                        brandCheckedCount++;
                    } else {
                        that.firstStep.brandId = $(item).parent().parent().attr("data-id");
                    }
                });

                if (brandCheckedCount >= $(".brand .pitch-on").length) {
                    layer.open({
                        content: "请选择品牌",
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                    return false;
                }
                /* 传递数据 */
                /* that.isBegianCase false 新建病例传递每一步数据 */
                if (!that.isBegianCase) {
                    that.postBrandData(that.firstStep);
                }
                $(".brand").hide();

                /* 有重启的 id 并且 第一次请求 */

                if (that.againCaseId && that.caseStatusCodeArr[0]) {
                    that.getBaseData(that.againCaseId);
                } else {
                    if (!that.againCaseId) {
                        console.log("hhhh");

                        that.getHospitalInfo();
                        that.getAddrList();
                    }
                }

                $(".basic-information").show();


            });

        }

        /* 新建病例第二步里面的所有事件 */
        stepTwoEvent() {
            /* 基本信息选择性别 */
            $(".basic-information  ul li .patient-sex div").on("click", function () {
                /* 给点击的li 添加类名 */
                $(this).children("p").addClass("active");
                /* 给其他的 li 隐藏 */
                $(this).siblings().children("p").removeClass("active");
            });

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

                that.updateHospitalData.country = $(this).children('option:selected').val();
                that.updateHospitalData.countriesId = $(this).children('option:selected').attr("data-id");

                that.updateHospitalData.province = null;
                that.updateHospitalData.provinceId = null;

                that.updateHospitalData.city = null;
                that.updateHospitalData.cityId = null;

                that.updateHospitalData.area = null;
                that.updateHospitalData.areaId = null;
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


                that.updateHospitalData.province = $(this).children('option:selected').val();
                that.updateHospitalData.provinceId = $(this).children('option:selected').attr("data-id");



                that.updateHospitalData.city = null;
                that.updateHospitalData.cityId = null;

                that.updateHospitalData.area = null;
                that.updateHospitalData.areaId = null;
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

                that.updateHospitalData.city = $(this).children('option:selected').val();
                that.updateHospitalData.cityId = $(this).children('option:selected').attr("data-id");

                that.updateHospitalData.area = null;
                that.updateHospitalData.areaId = null;
                that.getArea($(this).children('option:selected').attr("data-id"));
            });

            /* 选择区数据 */
            $(".areaList").on("change", function () {
                that.editObj.area = $(this).children('option:selected').val();
                that.editObj.areaId = $(this).children('option:selected').attr("data-id");
                that.updateHospitalData.area = $(this).children('option:selected').val();
                that.updateHospitalData.areaId = $(this).children('option:selected').attr("data-id");
            });

            /* 进入医院地址 去地址列表 */
            $(".hospital div").on("click", function () {
                /* 共有地址列表 */
                $("#hospital-address-list").show();
                $(".basic-information").hide();
            });


            /* 地址列表 点返回 */
            $("#hospital-address-list .left-arrow").on("click", function () {
                $("#hospital-address-list").hide();
                $(".basic-information").show();
            });



            /* 医院列表点击确认为哪条 */
            $("#hospital-address-list .content-bg").on("click", "li", function () {
                /* 显示选中的地址 */
                that.hospitalListArr.forEach(item => {
                    if (item.id == $(this).attr("data-id")) {
                        that.showHospitalDefault(item)
                    }
                });
                $("#hospital-address-list").hide();
                $(".basic-information").show();
            });


            /* 医院列表点击 编辑 */
            $("#hospital-address-list .content-bg").on("click", ".edit-box", function (e) {
                e.stopPropagation();
                $(".delete").show();
                $("#hospital-address-list").hide();
                $("#modification-hospital").show();
                $("#modification-hospital .centre-text").text("修改就诊医院");
                that.addrHospitalStatus = true;
                /* 显示选中的地址 */
                that.hospitalListArr.forEach(item => {
                    if (item.id == $(this).parent().parent().attr("data-id")) {
                        that.updateHospitalData = item;
                        that.setCurHosptialAddr(item);
                    }
                });

            });

            /* 点击医院地址修改里面 保存按钮 也可能新增保存 */
            $("#modification-hospital .save").on("click", function () {
                var updateHospitalData = {};
                /* 新增还是修改 true 修改*/
                if (that.addrHospitalStatus) {
                    that.hospitalListArr.forEach(item => {
                        if (item.id == $(this).attr("data-id")) {
                            // updateHospitalData = item;
                            updateHospitalData.hospitalId = $(this).attr("data-id");
                        }
                    });
                }
                that.updateHospitalData.address = $("#hospitalAddrnew input").val();
                that.updateHospitalData.hospitalName = $("#designationnew input").val();

                Object.assign(that.updateHospitalData, updateHospitalData);

                if (!that.updateHospitalData.country || that.updateHospitalData.country.includes("国家")) {
                    //提示未输入
                    layer.open({
                        content: "请选择国家",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }

                if (that.updateHospitalData.country == "中国" &&
                    (!that.updateHospitalData.province || !that.updateHospitalData.city || !that.updateHospitalData.area)
                    || (that.updateHospitalData.province == "省" || that.updateHospitalData.area == "区")
                ) {
                    //提示未输入
                    layer.open({
                        content: "请选择省市区",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }



                if (!that.updateHospitalData.address) {
                    //提示未输入
                    layer.open({
                        content: "请输入详细地址",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }

                if (!that.updateHospitalData.hospitalName) {
                    //提示未输入
                    layer.open({
                        content: "请输入医院名称",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }

                console.log(that.updateHospitalData);

                // return false;
                /* 修改 改地址 */
                if (that.addrHospitalStatus) {
                    that.updateHospital(that.updateHospitalData);
                } else {
                    /* 新增 改地址 */
                    that.saveHospital(that.updateHospitalData);
                }
                $("#hospital-address-list").show();
                $("#modification-hospital").hide();

            })

            /* 点击医院地址修改里面的 删除按钮 */
            $(".delete").on("click", function () {
                // console.log($(this).attr("data-id"));
                that.delHospitalAddr({
                    hospitalId: $(this).attr("data-id")
                });

                $("#hospital-address-list").show();
                $("#modification-hospital").hide();
            });

            /* 点击 新建医院地址 */
            $("#hospital-address-list .preserve").on("click", function () {
                $("#hospital-address-list").hide();
                $("#modification-hospital").show();
                $(".delete").hide();
                that.clearCurHosptialAddr();
                that.addrHospitalStatus = false;
                $("#hospitalAddrnew input").val("");
                $("#designationnew input").val("");
                $("#modification-hospital .centre-text").text("新建就诊医院");
            });

            /* 修改或新建医院地址 返回 */
            $("#modification-hospital .left-arrow").on("click", function () {
                $("#modification-hospital").hide();
                $("#hospital-address-list").show();
            });


            /* 第二步基本信息 点击箭头显示地址列表 */
            $(".delivery-address div").click(function () {
                $("#address-list").show();
                $(".management-box").hide();
            });

            /* 医院列表点击确认为哪条 */
            $("#address-list .content-bg").on("click", "li", function () {
                /* 显示选中的地址 */
                console.log(that.allAddrList, $(this).attr("data-id"));
                that.allAddrList.forEach(item => {
                    if (item.id == $(this).attr("data-id")) {
                        that.showAddrDefault(item);
                    }
                });
                $("#address-list").hide();
                $(".management-box").show();
            });




            /* 页面 - 地址信息修改返回 */
            $("#address-list .left-arrow").on("click", function () {
                $(".management-box").show();
                $("#address-list").hide();
            });

            /* 地址列表点击 编辑 */
            $("#address-list .content-bg").on("click", ".edit-box", function (e) {
                e.stopPropagation();
                $("#address-revise .cancel").show();
                $("#address-list").hide();
                $("#address-revise").show();
                $("#address-revise .centre-text").text("修改收货地址");
                that.modifAddrId = $(this).parent().parent().attr("data-id");
                that.addrStatus = true;
                /* 显示选中的地址 */
                that.allAddrList.forEach(item => {
                    if (item.id == $(this).parent().parent().attr("data-id")) {
                        that.showAddrDefault(item);
                    }
                });

            });

            /*  修改或新建收货地址 -返回按钮 */
            $("#address-revise .left-arrow").on("click", function () {
                $("#address-revise").hide();
                $("#address-list").show();
            });

            /* 新增地址 */
            $("#address-list .preserve").on("click", function () {
                $("#address-revise").show();
                $("#address-list").hide();
                $("#address-revise .cancel").hide();
                $("#address-revise .centre-text").text("新增收货地址");
                $(".provinceList").html(`<option>省</option>`);
                $(".cityList").html(`<option>市</option>`);
                $(".areaList").html(`<option>区</option>`);
                $(".countryList").find('option[value="国家"]').prop("selected", true);
                $("#receiverDetail").val("");
                $("#receiverTel").val("");
                $("#receiverName").val("");
                that.addrStatus = false;
            })

            /* 修改地址 删除按钮 */
            $("#address-revise .cancel").on("click", function () {
                that.removeAddr(that.modifAddrId);
                $("#address-revise").hide();
                if (that.baseEditInfo == 1) {
                    $("#address-list").show();
                } else {
                    // $("#address-list").show();
                }

            });

            /* 修改地址 新增地址 保存按钮 */
            $("#address-revise .preserve").on("click", function () {

                /* 新增还是修改 true 修改*/
                if (that.addrStatus) {
                    var editObj = {
                        address: $("#receiverDetail").val(),
                        contactNumber: $("#receiverTel").val(),
                        deliveryName: $("#receiverName").val(),
                        id: that.modifAddrId,
                    };
                } else {
                    var editObj = {
                        address: $("#receiverDetail").val(),
                        contactNumber: $("#receiverTel").val(),
                        deliveryName: $("#receiverName").val(),
                    };
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
                // that.editObj.country = $(".countryList").val();

                console.log(that.editObj.country);
                if (!that.editObj.country || that.editObj.country.includes("国家")) {
                    //提示未输入
                    layer.open({
                        content: "请选择国家",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }

                if (that.editObj.country == "中国" &&
                    (!that.editObj.province || !that.editObj.city || !that.editObj.area) ||
                    //|| (that.editObj.province == "省" || that.editObj.city == "市" || that.editObj.area == "区" ||
                    (that.editObj.province.indexOf("省") == 0 || that.editObj.area.indexOf("区") == 0)
                ) {
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

                console.log(that.editObj);

                if (that.addrStatus) {
                    that.modifAddr(that.editObj);
                } else {
                    that.addAddr(that.editObj);
                }



                /* 如果新建病例第二步基本信息 改地址 */
                if (that.baseEditInfo == 1) {
                    $("#address-list").show();
                } else {

                }

                $("#address-revise").hide();
            });


            /* 基本信息 -> 品牌 上一步 */
            $(".basic-information .button .last-step").on("click", function () {
                if (that.postData) {
                    that.initBrand();
                }
                $(".brand").show();
                $(".basic-information").hide();
            });

            /* 基本信息下一步 -> 诊断信息 */
            $(".basic-information .button .next-step").on("click", function () {
                let userName = $(".basic-information ul .user-name").val();
                let hospital = $(".hospital-site").text();
                let deliveryAddress = $(".delivery-address .message").text()
                if (userName == "") {
                    layer.open({
                        content: "请输入姓名",
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                    return false;
                }
                if (!app.userNameReg.test(userName)) {
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

                that.secondStep.birthday = $(".basic-information #demo1").attr("data-date"); //日期
                /* tbea */
                that.secondStep.birthday = that.secondStep.birthday.replace("-", "/").replace("-", "/");


                that.secondStep.birthday = new Date(that.secondStep.birthday).getTime();
                let curTime = new Date().getTime();
                if (that.secondStep.birthday > curTime) {
                    layer.open({
                        content: "请选择正确的出生日期",
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                    return false;
                }
                // console.log(that.modifAddrId);

                that.secondStep.deliveryAddressId = that.modifAddrId; /* 储存收货地址ID */
                $(".basic-information .patient-sex div").each((idx, item) => { //判断性别
                    if ($(item).children("p").hasClass("active")) {
                        that.secondStep.sex = $(item).children("p").attr("data-id");
                    }
                })
                that.secondStep.patientName = $(".basic-information .user-name").val(); //病人名称
                that.secondStep.hospitalId = $(".hospital").attr("data-id");
                if (!that.secondStep.hospitalId) {
                    layer.open({
                        content: "请选择就诊医院",
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                    return false;
                }
                that.secondStep.addressId = $(".delivery-address").attr("data-id");
                if (!that.secondStep.addressId) {
                    layer.open({
                        content: "请选择收货地址",
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                    return false;
                }
                /* that.isBegianCase false 新建病例传递每一步数据 */
                if (!that.isBegianCase) {
                    that.postSecondStep();
                }

                $(".basic-information").hide();
                /* 有重启的 id 并且 第一次请求 */
                if (that.againCaseId && that.caseStatusCodeArr[1]) {
                    that.getThreeStepData(that.againCaseId);
                }
                $(".teeth-condition").show();
                that.thirdStep.caseId = that.secondStep.caseId;
                that.thirdStep.stageName = that.secondStep.stageName;
                that.thirdStep.stageCount = that.secondStep.stageCount;
            });

        }

        /* 新建病例第三步诊断所有事件 */
        stepThreeEvent() {
            /* 点击磨牙关系显示弹层 */
            let newStep3Molarcancel = [];
            $(".teeth-condition ul .bruxism .molar").on("click", function () {
                $("#newStep3Molar").fadeIn();
                $("body").addClass("beyond");
                newStep3Molarcancel = [];
                /* 记录磨牙关系弹窗当前状态 */
                newStep3Molarcancel.push(
                    $("#newStep3Molar .classify-left .active").index(),
                    $("#newStep3Molar .classify-right .active").index()
                );
            });

            /* 点击磨牙关系取消弹层 */
            $("#newStep3Molar .cancel").on("click", function () {
                $("#newStep3Molar .classify-left li").eq(newStep3Molarcancel[0]).addClass("active").siblings().removeClass("active");
                $("#newStep3Molar .classify-right li").eq(newStep3Molarcancel[1]).addClass("active").siblings().removeClass("active");
            });

            /* 磨牙关系左侧右侧 添加排他*/
            $("#newStep3Molar .classify li").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");
            });

            /* 点击磨牙弹窗的保存 */
            $("#newStep3Molar .layer-btn .save").on("click", function () {
                if ($("#newStep3Molar .classify-left li").hasClass("active")) {
                    $(".bruxism .left-content").text($("#newStep3Molar .classify-left .active").text());
                }
                if ($("#newStep3Molar .classify-right li").hasClass("active")) {
                    $(".bruxism .right-content").text($("#newStep3Molar .classify-right .active").text());
                }
                $("#newStep3Molar").fadeOut();
            });


            /* 点击尖牙关系右键显示弹层 */
            let newStep3Fangscancel = [];
            $(".teeth-condition ul .cynodontes .molar").on("click", function () {
                $("#newStep3Fangs").fadeIn();
                $("body").addClass("beyond");
                newStep3Fangscancel = [];
                /* 记录尖牙关系弹窗当前状态 */
                newStep3Fangscancel.push(
                    $("#newStep3Fangs .classify-left .active").index(),
                    $("#newStep3Fangs .classify-right .active").index()
                );
            });

            /* 点击尖牙关系取消弹层 */
            $("#newStep3Fangs .cancel").on("click", function () {
                $("#newStep3Fangs .classify-left li").eq(newStep3Fangscancel[0]).addClass("active").siblings().removeClass("active");
                $("#newStep3Fangs .classify-right li").eq(newStep3Fangscancel[1]).addClass("active").siblings().removeClass("active");
            });

            /* 尖牙关系左侧 添加排他*/
            $("#newStep3Fangs .classify li").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");
            })

            /* 点击尖牙弹窗的保存 */
            $("#newStep3Fangs .layer-btn .save").on("click", function () {
                if ($("#newStep3Fangs .classify-left li").hasClass("active")) {
                    $(".cynodontes .left-content").text($("#newStep3Fangs .classify-left .active").text());
                }
                if ($("#newStep3Fangs .classify-right li").hasClass("active")) {
                    $(".cynodontes .right-content").text($("#newStep3Fangs .classify-right .active").text());
                }
                $("#newStep3Fangs").fadeOut();
            });

            /* 点击病例分类右键显示弹层 */
            let newStep3Casecancel = [];
            $(".teeth-condition ul .case .case-classification").on("click", function () {
                $("#newStep3Case").fadeIn();
                $("body").addClass("beyond");
                newStep3Casecancel = [];
                /* 记录病例分类弹窗当前状态 */
                [...$("#newStep3Case .classify li")].forEach((item, idx) => {
                    if ($(item).hasClass("active")) {
                        newStep3Casecancel.push(idx);
                    }
                });

            });

            /* 点击病例分类取消弹层 */
            $("#newStep3Case .cancel").on("click", function () {
                $("#newStep3Case .classify li").removeClass("active");
                newStep3Casecancel.forEach((k) => {
                    $("#newStep3Case .classify li").eq(k).addClass("active");
                })
            });

            /* 病例分类左侧 添加排他*/
            $("#newStep3Case .classify li").on("click", function () {
                /* 给点击的li 添加类名 */
                $(this).toggleClass("active");
            });

            /* 点击病例分类弹窗的保存 */
            $("#newStep3Case .layer-btn .save").on("click", function () {
                let activeArr = [];
                [...$("#newStep3Case .classify li")].forEach(item => {
                    if ($(item).hasClass("active")) {
                        activeArr.push(item.innerText);
                    }
                });
                $(".case .case-classification span").text(activeArr.join(","));
                $("#newStep3Case").fadeOut();
            });

            /* 诊断显示 基本信息隐藏 上一步*/
            $(".teeth-condition .button .last-step").on("click", function () {

                if (that.postData) {
                    that.getBaseData(that.postData);
                }
                $(".basic-information").show();
                $(".teeth-condition").hide();
            });


            /* 诊断隐藏 矫治目标显示 下一步*/
            $(".teeth-condition .button .next-step").on("click", function () {


                let molarRight = $("#newStep3Molar .classify-right .active").index() + 1;
                let molarLeft = $("#newStep3Molar .classify-left .active").index() + 1;
                let canineRight = $("#newStep3Fangs .classify-right .active").index() + 1;
                let canineLeft = $("#newStep3Fangs .classify-left .active").index() + 1;
                let diagnosisType = 0;
                [...$("#newStep3Case .classify li")].forEach((item, idx) => {
                    if ($(item).hasClass("active")) {
                        diagnosisType += Math.pow(2, (idx));
                    }
                });

                that.thirdStep.molarRight = molarRight;
                that.thirdStep.molarLeft = molarLeft;
                that.thirdStep.canineRight = canineRight;
                that.thirdStep.canineLeft = canineLeft;
                that.thirdStep.diagnosisType = diagnosisType;
                console.log(that.thirdStep);
                /* that.isBegianCase false 新建病例传递每一步数据 */
                if (!that.isBegianCase) {
                    that.postThirdStep();
                }

                $(".teeth-condition").hide();
                /* 有重启的 id 并且 第一次请求 */
                if (that.againCaseId && that.caseStatusCodeArr[2]) {
                    that.getFourStepData(that.againCaseId);
                }
                $(".correct-target").show();


                that.fourStep.caseId = that.thirdStep.caseId;
                that.fourStep.stageName = that.thirdStep.stageName;
                that.fourStep.stageCount = that.thirdStep.stageCount;
            });



        }
        /* 新建病例第四步矫治目标所有事件 */
        stepFourEvent() {

            /* 点击矫治牙列右键显示弹层 */
            let newStep4correctionalcancel = [];
            $(".correct-target .correctional-tooth").on("click", function () {
                $("#newStep4correctional").fadeIn();
                $("body").addClass("beyond");
                newStep4correctionalcancel = [];
                /* 记录磨牙关系弹窗当前状态 */
                newStep4correctionalcancel.push(
                    $("#newStep4correctional .classify .active").index()
                );
            });

            /* 点击矫治牙列取消弹层 */
            $("#newStep4correctional .cancel").on("click", function () {
                $("#newStep4correctional .classify li").eq(newStep4correctionalcancel[0]).addClass("active").siblings().removeClass("active");
            });


            /* 矫治牙列 添加排他*/
            $("#newStep4correctional .classify li").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");

            })

            /* 点击矫治牙列弹窗的保存 */
            $("#newStep4correctional .layer-btn .save").on("click", function () {
                if ($("#newStep4correctional .classify li").hasClass("active")) {
                    $(".correctional-tooth .correct span").text($("#newStep4correctional .classify .active").text());
                }
                $("#newStep4correctional").fadeOut();
            });


            /* 点击覆盖右键显示弹层 */
            let newStep4coatingcancel = {};
            $(".correct-target .overlay").on("click", function () {
                $("#newStep4coating").fadeIn();
                $("body").addClass("beyond");
                /* 记录改善li状态 输入框状态 输入框值 */
                newStep4coatingcancel = {};
                newStep4coatingcancel.idx = $("#newStep4coating .classify .active").index();
                newStep4coatingcancel.dis = true;
                if (newStep4coatingcancel.idx == 1) {
                    newStep4coatingcancel.dis = false;
                    newStep4coatingcancel.val = $("#newStep4coating input").val();
                } else {
                    newStep4coatingcancel.val = "";
                }


            });

            /* 点击覆盖取消弹层 */
            $("#newStep4coating .cancel").on("click", function () {
                $("#newStep4coating .classify li").eq(newStep4coatingcancel.idx).addClass("active").siblings().removeClass("active");
                $("#newStep4coating input").prop("disabled", newStep4coatingcancel.dis);
                $("#newStep4coating input").val(newStep4coatingcancel.val);

            });


            /* 覆盖 添加排他*/
            $("#newStep4coating .classify li").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");

                /* 判断如果点击的是第二li 这可以输入input值 */
                if ($("#newStep4coating .classify .active").index() == 1) {
                    $("#newStep4coating input").prop("disabled", false);
                } else {
                    $("#newStep4coating input").prop("disabled", true);
                    $("#newStep4coating input").val("");
                }
            });

            /* 点击覆盖弹窗的保存 */
            $("#newStep4coating .layer-btn .save").on("click", function () {
                if ($("#newStep4coating .classify li").hasClass("active")) {
                    var str = $("#newStep4coating .classify .active").text();
                    if ($("#newStep4coating .classify .active").index() == 1) {
                        /* 判断input输入的值只能输入0-100之内的数 */
                        var num = Number($("#newStep4coating input").val());
                        if (!num) {
                            $("#newStep4coating input").val(0);
                            num = 0;
                        }

                        if (!(num >= 0 && num < 101)) {
                            layer.open({
                                content: "请输入0-100的数值",
                                skin: "msg",
                                time: 2 //2秒自动关闭
                            });
                            return false;
                        };
                        $(".overlay .coverage span").text((str + num + "mm"));
                    } else {
                        $(".overlay .coverage span").text((str));
                    }
                }
                $("#newStep4coating").fadeOut();
            });



            /* 点击覆颌右键显示弹层 */
            let newStep4jawPopupcancel = {};
            $(".correct-target .covering-jaw-box").on("click", function () {
                $("#newStep4jawPopup").fadeIn();
                $("body").addClass("beyond");
                /* 记录改善li状态 输入框状态 输入框值 */
                newStep4jawPopupcancel = {};
                newStep4jawPopupcancel.idx = $("#newStep4jawPopup .classify .active").index();
                newStep4jawPopupcancel.dis = true;
                if (newStep4jawPopupcancel.idx == 1) {
                    newStep4jawPopupcancel.dis = false;
                    newStep4jawPopupcancel.val = $("#newStep4jawPopup input").val();
                } else {
                    newStep4jawPopupcancel.val = "";
                }

            });


            /* 点击覆颌取消弹层 */
            $("#newStep4jawPopup .cancel").on("click", function () {
                $("#newStep4jawPopup .classify li").eq(newStep4jawPopupcancel.idx).addClass("active").siblings().removeClass("active");
                $("#newStep4jawPopup input").prop("disabled", newStep4jawPopupcancel.dis);
                $("#newStep4jawPopup input").val(newStep4jawPopupcancel.val);

            });


            /* 覆颌 添加排他*/
            $("#newStep4jawPopup .classify li").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");
                /* 判断如果点击的是第二li 这可以输入input值 */
                if ($("#newStep4jawPopup .classify .active").index() == 1) {
                    $("#newStep4jawPopup input").prop("disabled", false);
                } else {
                    $("#newStep4jawPopup input").prop("disabled", true);
                    $("#newStep4jawPopup input").val("");
                }
            });

            /* 点击覆颌弹窗的保存 */
            $("#newStep4jawPopup .layer-btn .save").on("click", function () {
                if ($("#newStep4jawPopup .classify li").hasClass("active")) {
                    var str = $("#newStep4jawPopup .classify .active").text();
                    if ($("#newStep4jawPopup .classify .active").index() == 1) {
                        /* 判断input输入的值只能输入0-100之内的数 */
                        var num2 = Number($("#newStep4jawPopup input").val());
                        if (!num2) {
                            $("#newStep4jawPopup input").val(0);
                            num2 = 0;
                        }
                        if (!(num2 >= 0 && num2 < 101)) {
                            layer.open({
                                content: "请输入0-100的数值",
                                skin: "msg",
                                time: 2 //2秒自动关闭
                            });
                            return false;
                        };
                        $(".covering-jaw-box .covering-jaw span").text((str + num2 + "mm"));
                    } else {
                        $(".covering-jaw-box .covering-jaw span").text(str);
                    }
                }
                $("#newStep4jawPopup").fadeOut();
            })



            /* 点击磨牙关系2右键显示弹层 */
            let newStep4MolarcancelLeft = {};
            let newStep4MolarcancelRight = {};
            $(".bruxism2 .molar").on("click", function () {
                $("#newStep4Molar").fadeIn();
                $("body").addClass("beyond");
                /* 记录改善li状态 输入框状态 输入框值 左侧*/
                newStep4MolarcancelLeft = {};
                newStep4MolarcancelLeft.idx = $("#newStep4Molar .molar-box-left .classify .active").index();
                if (!newStep4MolarcancelLeft.idx2) {
                    newStep4MolarcancelLeft.idx2 = $("#newStep4Molar .molar-box-left .millimeter .active").index();
                }

                console.log(newStep4MolarcancelLeft.idx)
                newStep4MolarcancelLeft.dis = true;
                if (newStep4MolarcancelLeft.idx == 2) {
                    newStep4MolarcancelLeft.dis = false;
                    console.log($("#newStep4Molar .molar-box-left .millimeter .active").children("input").val())
                    newStep4MolarcancelLeft.val = $("#newStep4Molar .molar-box-left .millimeter .active").children("input").val();
                } else {
                    newStep4MolarcancelLeft.val = "";
                }
                console.log(newStep4MolarcancelLeft.idx)
                console.log(newStep4MolarcancelLeft.val);
                /* 记录改善li状态 输入框状态 输入框值 右侧*/
                newStep4MolarcancelRight = {};
                newStep4MolarcancelRight.idx = $("#newStep4Molar .molar-box-right .classify .active").index();
                if (!newStep4MolarcancelRight.idx2) {
                    newStep4MolarcancelRight.idx2 = $("#newStep4Molar .molar-box-right .millimeter .active").index();
                }
                newStep4MolarcancelRight.dis = true;
                if (newStep4MolarcancelRight.idx == 2) {
                    newStep4MolarcancelRight.dis = false;
                    newStep4MolarcancelRight.val = $("#newStep4Molar .molar-box-right .millimeter .active").children("input").val();
                } else {
                    newStep4MolarcancelRight.val = "";
                }
                $("#newStep4Molar .molar-box-left input").prop("disabled", newStep4MolarcancelLeft.dis);
                $("#newStep4Molar .molar-box-right input").prop("disabled", newStep4MolarcancelRight.dis);
                console.log(newStep4MolarcancelLeft);
                console.log(newStep4MolarcancelRight);
            });

            /* 点击磨牙关系取消弹层 */
            $("#newStep4Molar .cancel").on("click", function () {
                console.log($("#newStep4Molar .molar-box-left input").val())
                console.log(newStep4MolarcancelLeft.val)
                $("#newStep4Molar .molar-box-left .classify li").eq(newStep4MolarcancelLeft.idx).addClass("active").siblings().removeClass("active");
                $("#newStep4Molar .molar-box-left .millimeter li").eq(newStep4MolarcancelLeft.idx2).addClass("active").siblings().removeClass("active");
                // $("#newStep4Molar .molar-box-left .millimeter li").children("input").val("");
                $("#newStep4Molar .molar-box-left .millimeter li").eq(newStep4MolarcancelLeft.idx2).children("input").val(newStep4MolarcancelLeft.val);
                $("#newStep4Molar .molar-box-left .millimeter li").eq(newStep4MolarcancelLeft.idx2).siblings().children("input").val("");


                $("#newStep4Molar .molar-box-right .classify li").eq(newStep4MolarcancelRight.idx).addClass("active").siblings().removeClass("active");
                $("#newStep4Molar .molar-box-right .millimeter li").eq(newStep4MolarcancelRight.idx2).addClass("active").siblings().removeClass("active");
                // $("#newStep4Molar .molar-box-left .millimeter li").children("input").val("");
                $("#newStep4Molar .molar-box-right .millimeter li").eq(newStep4MolarcancelRight.idx2).children("input").val(newStep4MolarcancelRight.val);
                $("#newStep4Molar .molar-box-right .millimeter li").eq(newStep4MolarcancelRight.idx2).siblings().children("input").val("");

                $("#newStep4Molar .molar-box-right input").prop("disabled", newStep4MolarcancelLeft.dis);
                $("#newStep4Molar .molar-box-right input").prop("disabled", newStep4MolarcancelRight.dis);
                console.log(newStep4MolarcancelLeft);
            });



            /* 磨牙关系2 左侧添加排他*/
            $("#newStep4Molar .molar-box-left .classify li").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");;
                /* 判断如果点击的是第三li 可以输入input值 */
                if ($("#newStep4Molar .molar-box-left .classify .active").index() == 2) {
                    $("#newStep4Molar .molar-box-left input").prop("disabled", false);
                } else {
                    $("#newStep4Molar .molar-box-left input").prop("disabled", true);
                    $("#newStep4Molar .molar-box-left input").val("");
                }
            })
            /* 磨牙关系2 右侧添加排他*/
            $("#newStep4Molar .molar-box-right .classify li").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");
                /* 判断如果点击的是第三li 可以输入input值 */
                if ($("#newStep4Molar .molar-box-right .classify .active").index() == 2) {
                    $("#newStep4Molar .molar-box-right input").prop("disabled", false);
                } else {
                    $("#newStep4Molar .molar-box-right input").prop("disabled", true);
                    $("#newStep4Molar .molar-box-right input").val("");
                }
            });

            /* 点击input另一个兄弟输入的值清空 左侧 */
            $("#newStep4Molar .molar-box-left .millimeter li").on("click", function () {
                $(this).siblings().children("input").val("");
            });
            /* 点击input另一个兄弟输入的值清空 右侧 */
            $("#newStep4Molar .molar-box-right .millimeter li").on("click", function () {
                $(this).siblings().children("input").val("");
            });
            /* 点击input给li添加active 左侧*/
            $("#newStep4Molar .molar-box-left .millimeter input").on("input", function () {
                $(this).parent().addClass("active");
                $(this).parent().siblings().removeClass("active");
            });
            /* 给input的值的li添加active 右侧*/
            $("#newStep4Molar .molar-box-right .millimeter input").on("input", function () {
                $(this).parent().addClass("active");
                $(this).parent().siblings().removeClass("active");
            });

            /* 点击磨牙关系弹窗2的保存 */
            $("#newStep4Molar .layer-btn .save").on("click", function () {
                /* 左侧 */
                if ($("#newStep4Molar .molar-box-left .classify li").hasClass("active")) {
                    var str = $("#newStep4Molar .molar-box-left .classify .active").text();
                    var str2 = $("#newStep4Molar .molar-box-left .millimeter .active").text().trim().substr(0, 5);
                    if ($("#newStep4Molar .molar-box-left .classify .active").index() == 2) {
                        /* 判断input输入的值只能输入0-100之内的数 */
                        var num3 = Number($("#newStep4Molar .molar-box-left .millimeter .active input").val());

                        if (!num3) {
                            $("#newStep4Molar .molar-box-left .millimeter li").eq(0).find("input").val(0);
                            num3 = 0;
                        }
                        if (!(num3 >= 0 && num3 < 101)) {
                            layer.open({
                                content: "请输入0-100的数值",
                                skin: "msg",
                                time: 2 //2秒自动关闭
                            });
                            return false;
                        };
                        $(".bruxism2 .left-content").text((str + str2 + num3 + "mm"));
                    } else {
                        $(".bruxism2 .left-content").text(str);
                    }
                };
                /* 右侧 */
                if ($("#newStep4Molar .molar-box-right .classify li").hasClass("active")) {
                    var str = $("#newStep4Molar .molar-box-right .classify .active").text();

                    var str2 = $("#newStep4Molar .molar-box-right .millimeter .active").text().trim().substr(0, 5);
                    console.log(str2);
                    if ($("#newStep4Molar .molar-box-right .classify .active").index() == 2) {
                        var num3 = Number($("#newStep4Molar .molar-box-right .millimeter .active input").val());
                        if (!num3) {
                            $("#newStep4Molar .molar-box-right .millimeter li").eq(0).find("input").val(0);
                            num3 = 0;
                        }
                        if (!(num3 >= 0 && num3 < 101)) {
                            layer.open({
                                content: "请输入0-100的数值",
                                skin: "msg",
                                time: 2 //2秒自动关闭
                            });
                            return false;
                        };
                        $(".bruxism2 .right-content").text((str + str2 + num3 + "mm"));
                    } else {
                        $(".bruxism2 .right-content").text(str);
                    }
                }
                $("#newStep4Molar").fadeOut();
            });
            let newStep4FangsLeft = null;
            let newStep4FangsRight = null;
            /* 点击尖牙关系2右键显示弹层 */
            $(".cynodontes2 .molar").on("click", function () {
                $("#newStep4Fangs").fadeIn();
                $("body").addClass("beyond");
                newStep4FangsLeft = {};
                newStep4FangsLeft.idx = $("#newStep4Fangs .molar-box-left .classify .active").index();
                if (!newStep4FangsLeft.idx2) {
                    newStep4FangsLeft.idx2 = $("#newStep4Fangs .molar-box-left .millimeter .active").index();
                }

                newStep4FangsLeft.dis = true;
                if (newStep4FangsLeft.idx == 2) {
                    newStep4FangsLeft.dis = false;
                    console.log($("#newStep4Fangs .molar-box-left .millimeter .active").children("input").val())
                    newStep4FangsLeft.val = $("#newStep4Fangs .molar-box-left .millimeter .active").children("input").val();
                } else {
                    newStep4FangsLeft.val = "";
                }
                /* 记录改善li状态 输入框状态 输入框值 右侧*/
                newStep4FangsRight = {};
                newStep4FangsRight.idx = $("#newStep4Fangs .molar-box-right .classify .active").index();
                if (!newStep4FangsRight.idx2) {
                    newStep4FangsRight.idx2 = $("#newStep4Fangs .molar-box-right .millimeter .active").index();
                }
                newStep4FangsRight.dis = true;
                if (newStep4FangsRight.idx == 2) {
                    newStep4FangsRight.dis = false;
                    newStep4FangsRight.val = $("#newStep4Fangs .molar-box-right .millimeter .active").children("input").val();
                } else {
                    newStep4FangsRight.val = "";
                }
                $("#newStep4Fangs .molar-box-left input").prop("disabled", newStep4FangsLeft.dis);
                $("#newStep4Fangs .molar-box-right input").prop("disabled", newStep4FangsRight.dis);

            });

            /*尖牙关系弹窗中的取消按钮 开始*/
            $("#newStep4Fangs .cancel").on("click", function () {
                $("#newStep4Fangs .molar-box-left .classify li").eq(newStep4FangsLeft.idx).addClass("active").siblings().removeClass("active");
                $("#newStep4Fangs .molar-box-left .millimeter li").eq(newStep4FangsLeft.idx2).addClass("active").siblings().removeClass("active");
                // $("#newStep4Molar .molar-box-left .millimeter li").children("input").val("");
                $("#newStep4Fangs .molar-box-left .millimeter li").eq(newStep4FangsLeft.idx2).children("input").val(newStep4FangsLeft.val);
                $("#newStep4Fangs .molar-box-left .millimeter li").eq(newStep4FangsLeft.idx2).siblings().children("input").val("");


                $("#newStep4Fangs .molar-box-right .classify li").eq(newStep4FangsRight.idx).addClass("active").siblings().removeClass("active");
                $("#newStep4Fangs .molar-box-right .millimeter li").eq(newStep4FangsRight.idx2).addClass("active").siblings().removeClass("active");
                // $("#newStep4Molar .molar-box-left .millimeter li").children("input").val("");
                $("#newStep4Fangs .molar-box-right .millimeter li").eq(newStep4FangsRight.idx2).children("input").val(newStep4FangsRight.val);
                $("#newStep4Fangs .molar-box-right .millimeter li").eq(newStep4FangsRight.idx2).siblings().children("input").val("");

                $("#newStep4Fangs .molar-box-right input").prop("disabled", newStep4FangsLeft.dis);
                $("#newStep4Fangs .molar-box-right input").prop("disabled", newStep4MolarcancelRight.dis);
                $("#newStep4Fangs").fadeOut();
            })
            /*尖牙关系弹窗中的取消按钮 结束*/


            /* 尖牙关系2 左侧添加排他*/
            $("#newStep4Fangs .molar-box-left .classify li").on("click", function () {
                /* 给点击的li 添加类名 */
                $(this).addClass("active").siblings().removeClass("active");
                /* 判断如果点击的是第三li 可以输入input值 */
                if ($("#newStep4Fangs .molar-box-left .classify .active").index() == 2) {
                    $("#newStep4Fangs .molar-box-left input").prop("disabled", false);
                } else {
                    $("#newStep4Fangs .molar-box-left input").prop("disabled", true);
                    $("#newStep4Fangs .molar-box-left input").val("");
                }
            });

            /* 尖牙关系2 右侧添加排他*/
            $("#newStep4Fangs .molar-box-right .classify li").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");
                /* 判断如果点击的是第三li 可以输入input值 */
                if ($("#newStep4Fangs .molar-box-right .classify .active").index() == 2) {
                    $("#newStep4Fangs .molar-box-right input").prop("disabled", false);
                } else {
                    $("#newStep4Fangs .molar-box-right input").prop("disabled", true);
                    $("#newStep4Fangs .molar-box-right input").val("");
                }
            });
            /* 点击input另一个兄弟输入的值清空 左侧 */
            $("#newStep4Fangs .molar-box-left .millimeter li").on("click", function () {
                $(this).siblings().children("input").val("");
            });
            /* 点击input另一个兄弟输入的值清空 左侧 */
            $("#newStep4Fangs .molar-box-right .millimeter li").on("click", function () {
                $(this).siblings().children("input").val("");
            });
            /* 点击inpu给i添加active 左侧*/
            $("#newStep4Fangs .molar-box-left .millimeter input").on("input", function () {
                $(this).parent().addClass("active");
                $(this).parent().siblings().removeClass("active");
            });
            /* 给inpu的值的li添加active 右侧*/
            $("#newStep4Fangs .molar-box-right .millimeter input").on("input", function () {
                $(this).parent().addClass("active");
                $(this).parent().siblings().removeClass("active");
            });

            /* 点击尖牙关系弹窗2的保存 */
            $("#newStep4Fangs .layer-btn .save").on("click", function () {
                /* 左侧 */
                if ($("#newStep4Fangs .molar-box-left .classify li").hasClass("active")) {
                    var str = $("#newStep4Fangs .molar-box-left .classify .active").text();
                    var str2 = $("#newStep4Fangs .molar-box-left .millimeter .active").text().trim().substr(0, 5);
                    if ($("#newStep4Fangs .molar-box-left .classify .active").index() == 2) {
                        var num4 = Number($("#newStep4Fangs .molar-box-left .millimeter .active input").val());
                        if (!num4) {
                            $("#newStep4Fangs .molar-box-left .millimeter li").eq(0).find("input").val(0);
                            num4 = 0;
                        }
                        if (!(num4 >= 0 && num4 < 101)) {
                            layer.open({
                                content: "请输入0-100的数值",
                                skin: "msg",
                                time: 2 //2秒自动关闭
                            });
                            return false;
                        };
                        $(".cynodontes2 .left-content").text((str + str2 + num4 + "mm"));
                    } else {
                        $(".cynodontes2 .left-content").text(str);
                    }
                }
                /* 右侧 */
                if ($("#newStep4Fangs .molar-box-right .classify li").hasClass("active")) {
                    var str = $("#newStep4Fangs .molar-box-right .classify .active").text();
                    var str2 = $("#newStep4Fangs .molar-box-right .millimeter .active").text().trim().substr(0, 5);
                    if ($("#newStep4Fangs .molar-box-right .classify .active").index() == 2) {
                        var num4 = Number($("#newStep4Fangs .molar-box-right .millimeter .active input").val());
                        if (!num4) {
                            $("#newStep4Fangs .molar-box-right .millimeter li").eq(0).find("input").val(0);
                            num4 = 0;
                        }
                        if (!(num4 >= 0 && num4 < 101)) {
                            layer.open({
                                content: "请输入0-100的数值",
                                skin: "msg",
                                time: 2 //2秒自动关闭
                            });
                            return false;
                        };
                        $(".cynodontes2 .right-content").text((str + str2 + num4 + "mm"));
                    } else {
                        $(".cynodontes2 .right-content").text(str);
                    }
                }
                $("#newStep4Fangs").fadeOut();
            })

            /* 点击后牙反颌右键显示弹层 */
            let backteethActive = null;
            $(".backteeth").on("click", function () {
                backteethActive = $("#newStep4Backteeth .classify").children(".active").index();
                console.log(backteethActive)
                $("#newStep4Backteeth").fadeIn();
                $("body").addClass("beyond");
            });
            /* 点击后牙反颌弹层中的取消按钮 */
            $("#newStep4Backteeth .cancel").on("click", function () {
                $("#newStep4Backteeth .classify li").eq(backteethActive).addClass("active").siblings().removeClass("active");
                $("#newStep4Backteeth").fadeOut();
            })
            /* 后牙反颌 添加排他*/
            $("#newStep4Backteeth .classify li").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");
            });

            /* 点击后牙反颌列弹窗的保存 */
            $("#newStep4Backteeth .layer-btn .save").on("click", function () {
                if ($("#newStep4Backteeth .classify li").hasClass("active")) {
                    $(".backteeth .lock-jaw-teeth span").text($("#newStep4Backteeth .classify .active").text());
                }
                $("#newStep4Backteeth").fadeOut();
            })


            /* 诊断显示 矫治目标隐藏 */
            $(".correct-target .button .last-step").on("click", function () {

                if (that.postData) {
                    that.getThreeStepData(that.postData);
                }
                $(".correct-target").hide();
                $(".teeth-condition").show();
            });

            /* 基本信息显示 诊断隐藏 */
            $(".correct-target .button .next-step").on("click", function () {
                /* 解决矫治牙列 矫治牙列选项（1上颌，2下颌，3全颌）*/
                if ($(".correct-target .correct span").text() == "上颌") {
                    that.fourStep.prescpDentition = 1;
                } else if ($(".correct-target .correct span").text() == "下颌") {
                    that.fourStep.prescpDentition = 2;
                } else if ($(".correct-target .correct span").text() == "全颌") {
                    that.fourStep.prescpDentition = 3;
                }

                /* 解决覆盖 覆盖选项（1保持 2改善） */
                that.fourStep.prescpOverjetData = 0;
                if ($("#newStep4coating .classify .active").index() == 1) {
                    that.fourStep.prescpOverjet = 2;
                    that.fourStep.prescpOverjetData = $("#newStep4coating input").val();

                } else {
                    that.fourStep.prescpOverjet = 1;
                }
                /* 解决覆颌 覆颌选项（1保持 2改善） */
                that.fourStep.prescpOverbiteData = 0;
                if ($("#newStep4jawPopup .classify .active").index() == 1) {
                    that.fourStep.prescpOverbite = 2;
                    that.fourStep.prescpOverbiteData = $("#newStep4jawPopup input").val();
                } else {
                    that.fourStep.prescpOverbite = 1;
                }

                /* 解决右侧磨牙关系  (1保持，2理想，3改善)*/
                that.fourStep.prescpMolarRightData = 0;
                if ($("#newStep4Molar .molar-box-right .classify .active").index() == 2) {
                    that.fourStep.prescpMolarRight = 3;
                    let addReduce = "";

                    if ($("#newStep4Molar .molar-box-right .millimeter .active").index() == 0) {
                        addReduce = "+";
                    } else {
                        addReduce = "-";
                    }
                    let curprescpMolarRightData = $("#newStep4Molar .molar-box-right .millimeter .active input").val();
                    curprescpMolarRightData = curprescpMolarRightData ? curprescpMolarRightData : 0;
                    that.fourStep.prescpMolarRightData = Number(addReduce + Number(curprescpMolarRightData));

                } else if ($("#newStep4Molar .molar-box-right .classify .active").index() == 1) {
                    that.fourStep.prescpMolarRight = 2;
                } else if ($("#newStep4Molar .molar-box-right .classify .active").index() == 0) {
                    that.fourStep.prescpMolarRight = 1;
                }

                /* 解决左侧磨牙关系  (1保持，2理想，3改善)*/
                that.fourStep.prescpMolarLeftData = 0;
                if ($("#newStep4Molar .molar-box-left .classify .active").index() == 2) {
                    that.fourStep.prescpMolarLeft = 3;

                    let addReduce = "";
                    if ($("#newStep4Molar .molar-box-left .millimeter .active").index() == 0) {
                        addReduce = "+";
                    } else {
                        addReduce = "-";
                    }
                    let curprescpMolarLeftData = $("#newStep4Molar .molar-box-left .millimeter .active input").val();
                    curprescpMolarLeftData = curprescpMolarLeftData ? curprescpMolarLeftData : 0;
                    that.fourStep.prescpMolarLeftData = Number(addReduce + Number(curprescpMolarLeftData));
                } else if ($("#newStep4Molar .molar-box-left .classify .active").index() == 1) {
                    that.fourStep.prescpMolarLeft = 2;

                } else if ($("#newStep4Molar .molar-box-left .classify .active").index() == 0) {
                    that.fourStep.prescpMolarLeft = 1;

                }
                /* 解决右侧尖牙关系  (1保持，2理想，3改善)*/
                that.fourStep.prescpCanineRightData = 0;
                if ($("#newStep4Fangs .molar-box-right .classify .active").index() == 2) {
                    that.fourStep.prescpCanineRight = 3;
                    let addReduce = "";
                    if ($("#newStep4Fangs .molar-box-right .millimeter .active").index() == 0) {
                        addReduce = "+";
                    } else {
                        addReduce = "-";
                    }

                    let curprescpCanineRightData = $("#newStep4Fangs .molar-box-right .millimeter .active input").val();
                    curprescpCanineRightData = curprescpCanineRightData ? curprescpCanineRightData : 0;
                    that.fourStep.prescpCanineRightData = Number(addReduce + Number(curprescpCanineRightData));

                } else if ($("#newStep4Fangs .molar-box-right .classify .active").index() == 1) {
                    that.fourStep.prescpCanineRight = 2;

                } else if ($("#newStep4Fangs .molar-box-right .classify .active").index() == 0) {
                    that.fourStep.prescpCanineRight = 1;
                }
                /* 解决左侧尖牙关系  (1保持，2理想，3改善)*/
                that.fourStep.prescpCanineLeftData = 0;
                if ($("#newStep4Fangs .molar-box-left .classify .active").index() == 2) {
                    that.fourStep.prescpCanineLeft = 3;
                    let addReduce = "";
                    if ($("#newStep4Fangs .molar-box-left .millimeter .active").index() == 0) {
                        addReduce = "+";
                    } else {
                        addReduce = "-";
                    }
                    let curprescpCanineLeftData = $("#newStep4Fangs .molar-box-left .millimeter .active input").val();
                    curprescpCanineLeftData = curprescpCanineLeftData ? curprescpCanineLeftData : 0;
                    that.fourStep.prescpCanineLeftData = Number(addReduce + Number(curprescpCanineLeftData));
                } else if ($("#newStep4Fangs .molar-box-left .classify .active").index() == 1) {
                    that.fourStep.prescpCanineLeft = 2;

                } else if ($("#newStep4Fangs .molar-box-left .classify .active").index() == 0) {
                    that.fourStep.prescpCanineLeft = 1;
                }
                /* 解决后牙反/锁  后牙反/锁 选项（0未选，1保持，2纠正）*/
                if ($(".lock-jaw-teeth span").text() == "") {
                    that.fourStep.prescpPosteriorCrossBite = 0;
                } else if ($(".lock-jaw-teeth span").text() == "保持") {
                    that.fourStep.prescpPosteriorCrossBite = 1;
                } else if ($(".lock-jaw-teeth span").text() == "纠正") {
                    that.fourStep.prescpPosteriorCrossBite = 2;
                }
                that.fiveStep.caseId = that.fourStep.caseId;
                that.fiveStep.stageName = that.fourStep.stageName;
                that.fiveStep.stageCount = that.fourStep.stageCount;
                console.log(that.fourStep);
                /* 发起ajax请求保存第四步 */
                console.log(that.isBegianCase);
                /* that.isBegianCase false 新建病例传递每一步数据 */
                if (!that.isBegianCase) {
                    that.postFourStep();
                }

                $(".correct-target").hide();
                /* 有重启的 id 并且 第一次请求 */
                if (that.againCaseId && that.caseStatusCodeArr[3]) {
                    that.getFiveStepData(that.againCaseId);
                }
                $(".interval").show();
            });

        }

        /* 新建病例第五步间隙获得所有事件 */
        stepFiveEvent() {
            /* 记录点的是哪个牙齿 */
            let curTeethDom = null;
            /* 点击牙齿 显示间隙获得弹窗 */
            $(".interval .gain .teeth li").on("click", function () {
                $("#newStep5Interstice").fadeIn();
                $("body").addClass("beyond");
                curTeethDom = this;
                /* 清除弹窗所有li选中状态 */
                $("#newStep5Interstice .classify li").removeClass("active");
                /* 牙齿选项弹层出现 根据当前牙齿选中状态判断弹层内容选中状态 */
                $("#newStep5Interstice .classify li").each((i, k) => {
                    if ($(this).children("p").children().length > 0) {
                        $(this).children("p").children().each((idx, item) => {
                            if ($(item).text() == $(k).attr("data-text")) {
                                $(k).addClass("active");
                            }
                        });
                    }
                });

            });
            /* 间隙获得弹窗 排他 */
            $("#newStep5Interstice .classify li").on("click", function () {
                /* 给点击的li 添加类名 */
                $(this).toggleClass("active");
                $("#newStep5Interstice .classify .reset").removeClass("active");
            });
            /* 点击间隙获得弹窗重置 */
            $("#newStep5Interstice .classify .reset").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");
            });
            /* 点击间隙获得列弹窗的保存 */
            $("#newStep5Interstice .layer-btn .save").on("click", function () {
                let str = "";
                $("#newStep5Interstice .classify li").each((idx, item) => {
                    if ($(item).hasClass("active") && $(item).text() != "重置") {
                        str += ("<span>" + $(item).attr("data-text") + "</span>")
                    }
                });
                console.log(str);
                $(curTeethDom).children("p").html(str);
                $("#newStep5Interstice").fadeOut();
            });

            /* 矫治目标显示 间隙获得隐藏 */
            $(".interval .button .last-step").on("click", function () {

                if (that.postData) {
                    that.getFourStepData(that.postData);
                }
                $(".interval").hide();
                $(".correct-target").show();
            });

            /* 间隙获得2显示 间隙获得隐藏 */
            $(".interval .button .next-step").on("click", function () {
                /* 获取牙齿对应下标和标记整理数据给后台 */
                let clearances = [];
                $(".interval .up li").each((idx, item) => {
                    clearances.push({
                        teethIndex: app.teethArr[(idx)],
                        "dm": false,
                        "ex": false,
                        "exp": false,
                        "ipr": false,
                    });
                    /* 如果当前牙齿p标签里面有牙齿对应的标记 */
                    if ($(item).children("p").children().length > 0) {
                        $(item).children("p").children().each((k, dom) => {

                            if ($(dom).text() == "DM") {
                                clearances[clearances.length - 1].dm = true;
                            }

                            if ($(dom).text() == "EX") {
                                clearances[clearances.length - 1].ex = true;
                            }

                            if ($(dom).text() == "EXP") {
                                clearances[clearances.length - 1].exp = true;
                            }

                            if ($(dom).text() == "IPR") {
                                clearances[clearances.length - 1].ipr = true;
                            }

                        })
                    } else {
                        /* 如果没改过牙齿状态 没必要存这条数据 */
                        clearances.pop();
                    }




                })
                $(".interval .down li").each((idx, item) => {
                    clearances.push({
                        teethIndex: app.teethArr[((idx + $(".interval .up li").length))],
                        "dm": false,
                        "ex": false,
                        "exp": false,
                        "ipr": false,
                    });
                    /* 如果当前牙齿p标签里面有牙齿对应的标记 */
                    if ($(item).children("p").children().length > 0) {
                        $(item).children("p").children().each((k, dom) => {

                            if ($(dom).text() == "DM") {
                                clearances[clearances.length - 1].dm = true;
                            }

                            if ($(dom).text() == "EX") {
                                clearances[clearances.length - 1].ex = true;
                            }

                            if ($(dom).text() == "EXP") {
                                clearances[clearances.length - 1].exp = true;
                            }

                            if ($(dom).text() == "IPR") {
                                clearances[clearances.length - 1].ipr = true;
                            }
                        })
                    } else {
                        /* 如果没改过牙齿状态 没必要存这条数据 */
                        clearances.pop();
                    }
                })

                that.fiveStep.clearances = clearances;
                console.log(that.fiveStep);

                that.sixStep.caseId = that.fiveStep.caseId;
                that.sixStep.stageName = that.fiveStep.stageName;
                that.sixStep.stageCount = that.fiveStep.stageCount;
                // console.log(that.fiveStep);
                /* that.isBegianCase false 新建病例传递每一步数据 */
                if (!that.isBegianCase) {
                    that.postFiveStep();
                }

                $(".management-box .special").show();
                /* 有重启的 id 并且 第一次请求 */
                if (that.againCaseId && that.caseStatusCodeArr[4]) {
                    that.getSixStepData(that.againCaseId);
                }
                $(".interval").hide();
            });
        }

        /* 新建病例第六步间隙获得所有事件 */
        stepSixEvent() {
            /* 记录点的是哪个牙齿 */
            let curTeethDom = null;
            /* 点击牙齿 显示间隙获得弹窗 */
            $(".management-box .special .gain .teeth li").on("click", function () {
                $("#newStep6special").fadeIn();
                $("body").addClass("beyond");
                curTeethDom = this;
                /* 清除弹窗所有li选中状态 */
                $("#newStep6special .classify li").removeClass("active");
                /* 牙齿选项弹层出现 根据当前牙齿选中状态判断弹层内容选中状态 */
                $("#newStep6special .classify li").each((i, k) => {
                    if ($(this).children("p").children().length > 0) {
                        $(this).children("p").children().each((idx, item) => {
                            // console.log("p里面的内容：" + $(item).text());
                            if ($(item).text() == $(k).attr("data-text")) {
                                $(k).addClass("active");
                            }
                        });
                    }
                });

            });
            /* 间隙获得弹窗 排他 */
            $("#newStep6special .classify li").on("click", function () {
                /* 给点击的li 添加类名 */
                if ($(this).text() == "缺失牙") {
                    $(this).addClass("active").siblings().removeClass("active");
                } else {
                    $("#newStep6special .classify li").eq(2).removeClass("active");
                    $(this).toggleClass("active");
                }

                $("#newStep6special .classify .reset").removeClass("active");
            });
            /* 点击间隙获得弹窗重置 */
            $("#newStep6special .classify .reset").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");
            });
            /* 点击间隙获得列弹窗的保存 */
            $("#newStep6special .layer-btn .save").on("click", function () {
                let str = "";
                $("#newStep6special .classify li").each((idx, item) => {
                    if ($(item).hasClass("active") && $(item).text() != "重置") {
                        str += ("<span>" + $(item).attr("data-text") + "</span>")
                    }
                });
                $(curTeethDom).children("p").html(str);
                $("#newStep6special").fadeOut();
            });

            /* 间隙获得1显示 间隙获得2隐藏 */
            $(".management-box .special .last-step").on("click", function () {

                if (that.postData) {
                    that.getFiveStepData(that.postData);
                }
                $(".management-box .special").hide();
                $(".interval").show();
            });

            /* 矫治目标2显示 间隙获得2隐藏 */
            $(".management-box .special .next-step").on("click", function () {
                /* 获取牙齿对应下标和标记整理数据给后台 */
                let teethVOS = [];
                $(".management-box .special .up li").each((idx, item) => {
                    teethVOS.push({
                        teethIndex: app.teethArr[(idx)],
                        "m": false,
                        "na": false,
                        "nm": false,
                    });
                    /* 如果当前牙齿p标签里面有牙齿对应的标记 */
                    if ($(item).children("p").children().length > 0) {
                        $(item).children("p").children().each((k, dom) => {
                            if ($(dom).text() == "M") {
                                teethVOS[teethVOS.length - 1].m = true;
                            }
                            if ($(dom).text() == "Na") {
                                teethVOS[teethVOS.length - 1].na = true;
                            }

                            if ($(dom).text() == "Nm") {
                                teethVOS[teethVOS.length - 1].nm = true;
                            }
                        })
                    } else {
                        teethVOS.pop();
                    }
                })
                $(".management-box .special .down li").each((idx, item) => {
                    teethVOS.push({
                        teethIndex: app.teethArr[(idx + $(".management-box .special .up li").length)],
                        "m": false,
                        "na": false,
                        "nm": false,
                    });
                    /* 如果当前牙齿p标签里面有牙齿对应的标记 */
                    if ($(item).children("p").children().length > 0) {
                        $(item).children("p").children().each((k, dom) => {
                            if ($(dom).text() == "M") {
                                teethVOS[teethVOS.length - 1].m = true;
                            }
                            if ($(dom).text() == "Na") {
                                teethVOS[teethVOS.length - 1].na = true;
                            }

                            if ($(dom).text() == "Nm") {
                                teethVOS[teethVOS.length - 1].nm = true;
                            }
                        })
                    } else {
                        teethVOS.pop();
                    }

                })

                that.sixStep.teethVOS = teethVOS;
                // console.log(that.sixStep);

                that.sevenStep.caseId = that.sixStep.caseId;
                that.sevenStep.stageName = that.sixStep.stageName;
                that.sevenStep.stageCount = that.sixStep.stageCount;
                /* that.isBegianCase false 新建病例传递每一步数据 */
                if (!that.isBegianCase) {
                    that.postSixStep();
                }

                $(".management-box .special").hide();
                /* 有重启的 id 并且 第一次请求 */
                if (that.againCaseId && that.caseStatusCodeArr[5]) {
                    that.getSevenStepData(that.againCaseId);
                }
                $(".correct-target2").show();
                /* 处理第七步中线关系填写 */
                let sevenCenterStatus = $("#newStep4correctional .classify .active").index();
                if (sevenCenterStatus == 0) {
                    /* 上 */
                    $("#newStep7Center .molar-box-right").css({
                        "pointer-events": "none",
                        "cursor": "not-allowed"
                    });
                    $("#newStep7Center .molar-box-left").css({
                        "pointer-events": "auto",
                        "cursor": "pointer"
                    });
                    $(".correct-target2 .molar-right .right-content").text("");
                } else if (sevenCenterStatus == 1) {
                    /* 下 */
                    $("#newStep7Center .molar-box-left").css({
                        "pointer-events": "none",
                        "cursor": "not-allowed"
                    });
                    $("#newStep7Center .molar-box-right").css({
                        "pointer-events": "auto",
                        "cursor": "pointer"
                    });
                    $(".correct-target2 .molar-left .left-content").text("");
                } else {
                    /* 全颌 */
                    $("#newStep7Center .molar-box-left").css({
                        "pointer-events": "auto",
                        "cursor": "pointer"
                    });
                    $("#newStep7Center .molar-box-right").css({
                        "pointer-events": "auto",
                        "cursor": "pointer"
                    });
                }

            });

        }

        /* 新建病例第七步矫治目标2所有事件 */
        stepSevenEvent() {
            /* 点击中线关系- 出弹窗 */
            let newStep7CenterTop = null;
            let newStep7CenterBom = null;
            $(".correct-target2 .molar").on("click", function () {
                $("#newStep7Center").fadeIn();
                $("body").addClass("beyond");
                newStep7CenterTop = {};
                newStep7CenterTop.idx = $("#newStep7Center .molar-box-left .classify .active").index();
                // if(!newStep7CenterTop.idx2) {
                //     newStep7CenterTop.idx2 = $("#newStep7Center .molar-box-left .millimeter .active").index();
                // }

                newStep7CenterTop.disleft = true;
                newStep7CenterTop.disright = true;
                newStep7CenterTop.valLeft = "";
                newStep7CenterTop.valRight = "";
                // console.log(newStep7CenterTop.idx);
                if (newStep7CenterTop.idx == 1) {
                    newStep7CenterTop.disleft = false;
                    newStep7CenterTop.valLeft = $("#newStep7Center .molar-box-left .millimeter input").eq(0).val();
                } else if (newStep7CenterTop.idx == 2) {
                    newStep7CenterTop.disright = false;
                    newStep7CenterTop.valRight = $("#newStep7Center .molar-box-left .millimeter input").eq(1).val();
                }

                /* 记录改善li状态 输入框状态 输入框值 右侧*/
                newStep7CenterBom = {};
                newStep7CenterBom.idx = $("#newStep7Center .molar-box-right .classify .active").index();
                // if(!newStep7CenterBom.idx2) {
                //     newStep7CenterBom.idx2 = $("#newStep7Center .molar-box-right .millimeter .active").index();
                // }
                newStep7CenterBom.disleft = true;
                newStep7CenterBom.disright = true;
                newStep7CenterBom.valLeft = "";
                newStep7CenterBom.valRight = "";
                if (newStep7CenterBom.idx == 1) {
                    newStep7CenterBom.disleft = false;
                    newStep7CenterBom.valLeft = $("#newStep7Center .molar-box-right .millimeter input").eq(0).val();
                } else if (newStep7CenterBom.idx == 2) {
                    newStep7CenterBom.disright = false;
                    newStep7CenterBom.valRight = $("#newStep7Center .molar-box-right .millimeter input").eq(1).val();
                }
                // $("#newStep7Center .molar-box-left input").eq(0).prop("disabled", newStep7CenterTop.disleft);
                // $("#newStep7Center .molar-box-left input").eq(1).prop("disabled", newStep7CenterTop.disright);
                // $("#newStep7Center .molar-box-right input").eq(0).prop("disabled", newStep7CenterBom.disleft);
                // $("#newStep7Center .molar-box-right input").eq(1).prop("disabled", newStep7CenterBom.disright);
            });


            $("#newStep7Center .cancel").on("click", function () {
                $("#newStep7Center").fadeOut();
                // console.log(newStep7CenterTop);
                $("#newStep7Center .molar-box-left .classify li").eq(newStep7CenterTop.idx).addClass("active").siblings().removeClass("active");
                // $("#newStep7Center .molar-box-left .millimeter li").eq(newStep7CenterTop.idx2).addClass("active").siblings().removeClass("active");
                // $("#newStep4Molar .molar-box-left .millimeter li").children("input").val("");
                $("#newStep7Center .molar-box-left .millimeter li input").eq(0).val(newStep7CenterTop.valLeft);
                $("#newStep7Center .molar-box-left .millimeter li input").eq(1).val(newStep7CenterTop.valRight);
                $("#newStep7Center .molar-box-left input").eq(0).prop("disabled", newStep7CenterTop.disleft);
                $("#newStep7Center .molar-box-left input").eq(1).prop("disabled", newStep7CenterTop.disright);
                // $("#newStep7Center .molar-box-left .millimeter li").eq(newStep7CenterTop.idx2).siblings().children("input").val("");

                console.log(newStep7CenterBom);
                $("#newStep7Center .molar-box-right .classify li").eq(newStep7CenterBom.idx).addClass("active").siblings().removeClass("active");
                // $("#newStep7Center .molar-box-right .millimeter li").eq(newStep7CenterBom.idx2).addClass("active").siblings().removeClass("active");
                // // $("#newStep4Molar .molar-box-left .millimeter li").children("input").val("");
                $("#newStep7Center .molar-box-right .millimeter li input").eq(0).val(newStep7CenterBom.valLeft);
                $("#newStep7Center .molar-box-right .millimeter li input").eq(1).val(newStep7CenterBom.valRight);

                $("#newStep7Center .molar-box-right input").eq(0).prop("disabled", newStep7CenterBom.disleft);
                $("#newStep7Center .molar-box-right input").eq(1).prop("disabled", newStep7CenterBom.disright);
            })


            /* 尖牙关系2 左侧添加排他*/
            $("#newStep7Center .molar-box-left .classify li").on("click", function () {
                /* 给点击的li 添加类名 */
                $(this).addClass("active").siblings().removeClass("active");
                /* 判断如果点击的是第三li 可以输入input值 */
                if ($("#newStep7Center .molar-box-left .classify .active").index() == 1) {
                    $("#newStep7Center .molar-box-left input").eq(1).prop("disabled", true);
                    $("#newStep7Center .molar-box-left input").eq(0).prop("disabled", false);
                    $("#newStep7Center .molar-box-left input").eq(1).val("");
                } else if ($("#newStep7Center .molar-box-left .classify .active").index() == 2) {
                    $("#newStep7Center .molar-box-left input").eq(0).prop("disabled", true);
                    $("#newStep7Center .molar-box-left input").eq(1).prop("disabled", false);
                    $("#newStep7Center .molar-box-left input").eq(0).val("");
                } else {
                    $("#newStep7Center .molar-box-left input").eq(1).prop("disabled", true);
                    $("#newStep7Center .molar-box-left input").eq(0).prop("disabled", true);
                    $("#newStep7Center .molar-box-left input").eq(0).val("");
                    $("#newStep7Center .molar-box-left input").eq(1).val("");
                }
            });

            /* 尖牙关系2 右侧添加排他*/
            $("#newStep7Center .molar-box-right .classify li").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");
                /* 判断如果点击的是第三li 可以输入input值 */
                if ($("#newStep7Center .molar-box-right .classify .active").index() == 1) {
                    $("#newStep7Center .molar-box-right input").eq(1).prop("disabled", true);
                    $("#newStep7Center .molar-box-right input").eq(0).prop("disabled", false);
                    $("#newStep7Center .molar-box-right input").eq(1).val("");
                } else if ($("#newStep7Center .molar-box-right .classify .active").index() == 2) {
                    $("#newStep7Center .molar-box-right input").eq(0).prop("disabled", true);
                    $("#newStep7Center .molar-box-right input").eq(1).prop("disabled", false);
                    $("#newStep7Center .molar-box-right input").eq(0).val("");
                } else {
                    $("#newStep7Center .molar-box-right input").eq(1).prop("disabled", true);
                    $("#newStep7Center .molar-box-right input").eq(0).prop("disabled", true);
                    $("#newStep7Center .molar-box-right input").eq(0).val("");
                    $("#newStep7Center .molar-box-right input").eq(1).val("");
                }
            });

            // /* 点击input另一个兄弟输入的值清空 左侧 */
            // $("#newStep7Center .molar-box-left .millimeter li").on("click", function () {
            //     $(this).siblings().children("input").val("");
            // });
            // /* 点击input另一个兄弟输入的值清空 右侧 */
            // $("#newStep7Center .molar-box-right .millimeter li").on("click", function () {
            //     $(this).siblings().children("input").val("");
            // });
            /* 点击input给li添加active 左侧*/
            $("#newStep7Center .molar-box-left .millimeter input").on("input", function () {
                $(this).parent().addClass("active").siblings().removeClass("active");
                $(this).parent().siblings().children("input").val("");
            });
            /* 给input的值的li添加active 右侧*/
            $("#newStep7Center .molar-box-right .millimeter input").on("input", function () {
                $(this).parent().addClass("active").siblings().removeClass("active");
                $(this).parent().siblings().children("input").val("");
            });

            /* 点击尖牙关系弹窗2的保存 */
            $("#newStep7Center .layer-btn .save").on("click", function () {
                /* 左侧 */
                if ($("#newStep7Center .molar-box-left .classify li").hasClass("active")) {
                    var str = $("#newStep7Center .molar-box-left .classify .active").text();
                    var str2 = $("#newStep7Center .molar-box-left .millimeter .active").text().trim().substr(0, 5);

                    if ($("#newStep7Center .molar-box-left .classify .active").index() == 2 || $("#newStep7Center .molar-box-left .classify .active").index() == 1) {
                        var idx = $("#newStep7Center .molar-box-left .classify .active").index();
                        var num4 = Number($("#newStep7Center .molar-box-left .millimeter input").eq(idx - 1).val());
                        if (!num4) {
                            $("#newStep7Center .molar-box-left .millimeter input").eq(idx - 1).val(0);
                            num4 = 0;
                        }
                        if (!(num4 >= 0 && num4 < 101)) {
                            layer.open({
                                content: "请输入0-100的数值",
                                skin: "msg",
                                time: 2 //2秒自动关闭
                            });
                            return false;
                        };

                        $(".correct-target2 .left-content").text(str2 + num4 + 'mm');
                        if (idx == 1) {
                            that.sevenStep.fprescpUpperMiddle = "+" + num4;
                        } else if (idx == 2) {
                            that.sevenStep.fprescpUpperMiddle = "-" + num4;
                        }
                    } else {
                        $(".correct-target2 .left-content").text(str);
                        /* 上颌保持 */
                        that.sevenStep.fprescpUpperMiddle = 34;
                    }
                }


                /* 右侧 */
                if ($("#newStep7Center .molar-box-right .classify li").hasClass("active")) {
                    var str = $("#newStep7Center .molar-box-right .classify .active").text();
                    var str2 = $("#newStep7Center .molar-box-right .millimeter .active").text().trim().substr(0, 5);
                    if ($("#newStep7Center .molar-box-right .classify .active").index() == 2 || $("#newStep7Center .molar-box-right .classify .active").index() == 1) {
                        var idx = $("#newStep7Center .molar-box-right .classify .active").index();
                        var num4 = Number($("#newStep7Center .molar-box-right .millimeter input").eq(idx - 1).val());
                        if (!num4) {
                            $("#newStep7Center .molar-box-right .millimeter input").eq(idx - 1).val(0); num4 = 0;
                        }
                        if (!(num4 >= 0 && num4 < 101)) {
                            layer.open({
                                content: "请输入0-100的数值",
                                skin: "msg",
                                time: 2 //2秒自动关闭
                            });
                            return false;
                        };

                        $(".correct-target2 .right-content").text(str2 + num4 + 'mm');
                        if (idx == 1) {
                            that.sevenStep.fprescpLowerMiddle = "+" + num4;
                        } else if (idx == 2) {
                            that.sevenStep.fprescpLowerMiddle = "-" + num4;
                        }
                    } else {
                        $(".correct-target2 .right-content").text(str);
                        /* 上颌保持 */
                        that.sevenStep.fprescpLowerMiddle = 34;
                    }
                }
                $("#newStep7Center").fadeOut();
            })


            /* 点击牙列间隙-出弹窗 */
            let newStep7denturecancel = null;
            $(".correct-target2 li").eq(1).on("click", function () {
                $("#newStep7denture").fadeIn();
                $("body").addClass("beyond");
                newStep7denturecancel = $("#newStep7denture .classify .active").index();
            });

            $("#newStep7denture .cancel").on("click", function () {
                $("#newStep7denture .classify li").eq(newStep7denturecancel).addClass("active").siblings().removeClass("active");
            })

            /* 点击牙列间隙-li tab切换 */
            $("#newStep7denture li").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active");
            });

            /* 点击牙列间隙保存按钮 */
            $("#newStep7denture .save").on("click", function () {
                if ($("#newStep7denture .classify li").hasClass("active")) {
                    $(".correct-target2 .teeth-clearance").text($("#newStep7denture .classify .active").text());
                }

                $("#newStep7denture").fadeOut();
            });

            /* 间隙获得2显示 矫治目标2隐藏 */
            $(".correct-target2 .last-step").on("click", function () {

                if (that.postData) {
                    that.getSixStepData(that.postData);
                }
                $(".correct-target2").hide();
                $(".management-box .special").show();
            });

            /* 牙况照片显示 牙况照片隐藏 */
            $(".correct-target2 .next-step").on("click", function () {

                /* 左侧 */
                if ($("#newStep7Center .molar-box-left .classify li").hasClass("active")) {
                    if ($("#newStep7Center .molar-box-left .classify .active").index() == 2 || $("#newStep7Center .molar-box-left .classify .active").index() == 1) {
                        var idx = $("#newStep7Center .molar-box-left .classify .active").index();
                        var num4 = Number($("#newStep7Center .molar-box-left .millimeter input").eq(idx - 1).val());
                        if (idx == 1) {
                            that.sevenStep.fprescpUpperMiddle = "+" + num4;
                        } else if (idx == 2) {
                            that.sevenStep.fprescpUpperMiddle = "-" + num4;
                        }
                    } else {
                        /* 上颌保持 */
                        that.sevenStep.fprescpUpperMiddle = 34;
                    }
                }


                /* 右侧 */
                if ($("#newStep7Center .molar-box-right .classify li").hasClass("active")) {
                    if ($("#newStep7Center .molar-box-right .classify .active").index() == 2 || $("#newStep7Center .molar-box-right .classify .active").index() == 1) {
                        var idx = $("#newStep7Center .molar-box-right .classify .active").index();
                        var num4 = Number($("#newStep7Center .molar-box-right .millimeter input").eq(idx - 1).val());
                        if (idx == 1) {
                            that.sevenStep.fprescpLowerMiddle = "+" + num4;
                        } else if (idx == 2) {
                            that.sevenStep.fprescpLowerMiddle = "-" + num4;
                        }
                    } else {
                        /* 上颌保持 */
                        that.sevenStep.fprescpLowerMiddle = 34;
                    }
                }
                that.sevenStep.strPrescpInstruction = $(".correct-target2 .objective textarea").val().replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');

                if ($(".correct-target2 .teeth-clearance").text() == "全部关闭") {
                    that.sevenStep.nprescpSpacing = 1;
                } else {
                    that.sevenStep.nprescpSpacing = 2;
                    /* 保留间隙必须输入附加说明 */
                    if (!that.sevenStep.strPrescpInstruction) {
                        layer.open({
                            content: "请输入附加说明",
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        });
                        return false;
                    }
                }




                console.log(that.sevenStep);
                that.eightStep.caseId = that.sevenStep.caseId;
                that.eightStep.stageName = that.sevenStep.stageName;
                that.eightStep.stageCount = that.sevenStep.stageCount;

                /* that.isBegianCase false 新建病例传递每一步数据 */
                if (!that.isBegianCase) {
                    that.postSevenStep();
                }
                $(".teeth-phone").show();
                /* 有重启的 id 并且 第一次请求 */
                if (that.againCaseId && that.caseStatusCodeArr[6]) {
                    that.getEightStepData(that.againCaseId);
                }
                $(".correct-target2").hide();
            });
        }

        /* 新建病例第八步牙况照片所有事件 */
        stepEightEvent() {
            /* 点击弹层空白处 隐藏 */
            $("#deletePhotos").on("click", function () {
                $(this).hide();
                $("body").removeClass("beyond");
            });

            /* 点击上传图片的 外面的 div 判断里面的 input 是否存在no-event */
            $('.teeth-phone .phone div,.teeth-phone .x-ray-film div').on("click", function (e) {
                e.stopPropagation();
                /* 如果上传过图片 就可以点击出现弹层 */
                if ($(this).children("input").hasClass("no-event")) {
                    $("#deletePhotos").show();
                    $("body").addClass("beyond");
                    $("#deletePhotos input").attr("data-index", $(this).attr("data-index"));
                }
            });

            /* 替换照片 */
            $("#deletePhotos input").on("change", function () {
                var file = this.files[0];
                // var filetypes = [".jpg", ".png", ".jpeg", ".svg", '.gif'];
                var filepath = this.value;
                if (filepath) {
                    // var isnext = false;
                    // var fileend = filepath.substring(filepath.lastIndexOf("."));

                    // for (var i = 0; i < filetypes.length; i++) {
                    //     if (filetypes[i] == fileend) {
                    //         isnext = true;
                    //         break;
                    //     }
                    // }

                    // if (!isnext) {
                    //     //提示
                    //     layer.open({
                    //         content: "仅允许上传图片",
                    //         skin: 'msg',
                    //         time: 2 //2秒后自动关闭
                    //     });
                    //     this.value = "";
                    //     return false;
                    // }else{

                    // }
                } else {
                    return false;
                }
                let idx = $('#deletePhotos input').attr("data-index");
                $(".teeth-phone li input").eq(idx - 1).get(0).saveFiles = file;
                /* 删除记录后台传过来的标记 */
                // $('.teeth-phone li input').eq(idx - 1).attr("data-front", "");
                if (window.FileReader) {
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    //监听文件读取结束后事件
                    reader.onloadend = function (e) {

                        /* 第几个input下面对应的图片展示路径 */
                        $(".teeth-phone li input").eq(idx - 1).next().attr("src", e.target.result);
                        $("#deletePhotos input").val("");
                    };
                }
            });

            /* 删除照片 */
            $("#create-del").on("click", function () {
                let postData = {
                    "caseId": that.sevenStep.caseId,
                    "fileNumber": null,
                    "stageCount": that.sevenStep.stageCount,
                    "stageName": that.sevenStep.stageName
                };
                let idx = $('#deletePhotos input').attr("data-index");
                $(".teeth-phone li input").eq(idx - 1).removeClass("no-event");
                $(".teeth-phone li input").eq(idx - 1).get(0).saveFiles = "";
                $(".teeth-phone li input").eq(idx - 1).prev().show();
                $(".teeth-phone li input").eq(idx - 1).next().attr("src", "");
                postData.fileNumber = idx;
                /* 清空上传文件数据 */
                $('.teeth-phone li input').eq(idx - 1).val("");
                $('#deletePhotos input').val("");
                /* 判断是病例重启删除的图片 记录删除过的 filename  */
                if ($(".teeth-phone li input").eq(idx - 1).attr("data-front")) {
                    that.againSet.add(idx);
                    // postData.fileNumber = $(this).parent().attr("data-index");
                    // that.delImg(postData);
                    // $('.teeth-phone li input').eq(idx - 1).attr("data-front", "");
                }
                /* 新建病例删除图片 */
                if (!that.isBegianCase) {
                    that.delImg(postData);
                }

            });

            /* 上传所有图片 input */
            $('.teeth-phone li input').on("change", function (e) {
                var file = this.files[0];
                // var filetypes = [".jpg", ".png", ".jpeg", ".svg", '.gif'];
                var filepath = this.value;
                if (!filepath) {
                    return false;
                }
                this.saveFiles = this.files[0];
                // console.log(file);
                let iptDom = this;
                if (window.FileReader) {
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    //监听文件读取结束后事件
                    reader.onloadend = function (e) {
                        $(iptDom).prev().hide();
                        $(iptDom).addClass("no-event");
                        $(iptDom).next().attr("src", e.target.result);
                    };
                }
                that.eightStep.file = file;
                that.eightStep.fileNumber = $(this).parent().attr("data-index");
                that.eightStep.add = "Y";
                /* that.isBegianCase false 新建病例传递每一步数据 */
                if (!that.isBegianCase) {
                    /* 请求上传的接口 */
                    that.postEightStep(that.eightStep);
                }
            })

            /* 牙况照片显示 矫治目标2隐藏 */
            $(".teeth-phone .button .last-step").on("click", function () {

                if (that.postData) {
                    that.getSevenStepData(that.postData);
                }
                $(".teeth-phone").hide();
                $(".correct-target2").show();
            });

            /* 矫治目标2显示 牙况照片隐藏 */
            $(".teeth-phone .button .next-step").on("click", function () {
                let srcCount = 0;
                [...$(".teeth-phone input").next()].forEach(item => {
                    // console.log($(item));
                    // console.log($(item).attr("src"));
                    if (!$(item).attr("src")) {
                        srcCount++;
                    }
                });

                if (!that.eightStep.fileNumber && srcCount == $(".teeth-phone input").next().length) {
                    layer.open({
                        content: "请至少上传一张图片",
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    });

                    return false;
                }
                /* 新建病例 下一步上传所有 */
                //   if (!that.isBegianCase) {
                /* 获取所有上传文件 一次性点保存 处理上传功能 */
                // that.eightStepArr = [];
                // that.eightCount = 0;
                /* 仅需上传修改的部分input */
                // console.log(that.eightStep);
                // [...$(".teeth-phone input")].forEach(item => {
                //     if ($(item).val()) {
                //         that.eightStepArr.push({
                //             fileNumber: $(item).parent().attr("data-index"),
                //             add: "Y",
                //             file: $(item).get(0).saveFiles,
                //             caseId: that.eightStep.caseId,
                //             stageCount: that.eightStep.stageCount,
                //             stageName: that.eightStep.stageName,
                //         });

                //     }
                // });

                // console.log(that.eightStepArr);
                // if (that.eightStepArr.length > 0) {
                //     that.eightStepArr.forEach(val => {
                //         that.postEightStep(val);
                //     })
                // }
                // }

                $(".uploading").show();
                $(".teeth-phone").hide();
            });
        }
        /* 新建病例第九步上传文件所有事件 */
        stepNineEvent() {
            /* 上传文件 */
            $('.uploading .file input').on("change", function (e) {
                e.stopPropagation();
                var file = this.files[0];
                let iptDom = this;
                var filetypes = [".rar", ".zip"];
                var filepath = this.value;
                var filemaxsize = 1024 * 100;//100M
                console.log(file);
                if (filepath) {
                    var isnext = false;
                    var fileend = filepath.substring(filepath.lastIndexOf("."));

                    for (var i = 0; i < filetypes.length; i++) {
                        if (filetypes[i] == fileend) {
                            isnext = true;
                            break;
                        }
                    }

                    if (!isnext) {
                        //提示
                        layer.open({
                            content: "仅允许上传zip或rar文件",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                        this.value = "";
                        return false;
                    }
                } else {
                    return false;
                }
                // console.log(file.name);
                // that.eightStep.fileNumber = $(this).parent().attr("data-index");
                // that.eightStep.add = "Y";
                // that.eightStep.file = file;
                var size = file.size / 1024;
                if (size > filemaxsize) {
                    layer.closeAll();
                    //提示
                    layer.open({
                        content: "文件大小不能大于" + filemaxsize / 1024 + "M！",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    this.value = "";
                    return false;
                } else {
                    layer.closeAll();
                }
                $(".uploading .add-file-tips").hide();
                $(".uploading .del-file-tips").show();
                $(".uploading .del-file-tips p").html(file.name);
                $(".del-tips").show();
                $('.uploading .file input').addClass("no-event");

                if (!that.isBegianCase) {
                    /* 病例新增文件直接请求接口 */
                    if ($('.uploading .file input').val() && that.eightStep.caseId) {
                        that.eightStepObjLast = {
                            fileNumber: 12,
                            add: "Y",
                            file: $('.uploading .file input').get(0).files[0],
                            caseId: that.eightStep.caseId,
                            stageCount: that.eightStep.stageCount,
                            stageName: that.eightStep.stageName,
                        };
                        that.postEightStep(that.eightStepObjLast);

                    } else {
                        that.postCompleteStep();
                    }
                }
            });

            /* 点击删除上传的文件 */
            $(".uploading .del-file-tips").on("click", function () {
                $(".uploading .del-file-tips").hide();
                $(".uploading .add-file-tips").show();
                $('.uploading .file input').removeClass("no-event");
                $('.uploading .file input').val("");
                $(".uploading .del-file-tips p").html("");
                $(".del-tips").hide();
                // if (that.isBegianCase) {
                //     that.againSet.add(12);
                // }
            })

            /* 牙况照片显示 上传文件隐藏 */
            $(".uploading .button .last-step").on("click", function () {

                if (!that.postData && !that.isBegianCase) {
                    //     that.getEightStepData(that.postData);
                    // }else{
                    /* 新建上一步请求获取接口 清空input val 防止反复上传 */
                    let newPostData = {
                        caseId: that.eightStep.caseId,
                    }
                    that.getEightStepData(newPostData);
                }
                $(".uploading").hide();
                $(".teeth-phone").show();
            });


            $(".uploading .save").on("click", function () {
                // console.log(that.againSet);
                if (!clickFlagSave) return false;
                clickFlagSave = false;

                new Promise(function (resolve, reject) {
                    //loading带文字
                    layer.open({
                        type: 2,
                        content: '处理中，请稍候',
                        shadeClose: false,
                    });
                    resolve();
                }).then(function () {
                    /* 上传最后一步 文件 fileNumber 12 */
                    that.eightStepObjLast = {};

                    if (that.isBegianCase) {
                        /* 重启病例 请求重启接口 提交所有数据 */
                        that.caseRestart(that.againCaseId);
                    }
                    else {
                        that.postCompleteStep();
                        // /* 病例新增文件直接请求接口 */
                        // if ($('.uploading .file input').val() && that.eightStep.caseId) {
                        //     that.eightStepObjLast = {
                        //         fileNumber: 12,
                        //         add: "Y",
                        //         file: $('.uploading .file input').get(0).files[0],
                        //         caseId: that.eightStep.caseId,
                        //         stageCount: that.eightStep.stageCount,
                        //         stageName: that.eightStep.stageName,
                        //     };
                        //     that.postEightStep(that.eightStepObjLast);

                        // } else {
                        //     that.postCompleteStep();
                        // }
                    }

                })



            });

            /* 点击取消 */
            $(".uploading .cancel").on("click", function () {
                //询问框
                $("body").addClass("beyond");
                layer.open({
                    content: '您确定要退出新建的病例？',
                    btn: ['确定', '取消'],
                    yes: function (index) {
                        layer.close(index);
                        $("body").removeClass("beyond");
                        $(".uploading").hide();
                        // $(".management-box").hide();
                        location.replace("./management.html");
                    },
                    no: function (index) {
                        layer.close(index);
                        $("body").removeClass("beyond");
                    }
                });
            })


        }

        /* 获取地址列表 */
        getAddrList() {
            $.ajax({
                type: "get",
                url: app.apiUrl + "/deliveryAddress/getAddressList?t=" + app.random,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", token);
                },
                async: false,
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        res.data = JSON.parse(res.data);
                        that.allAddrList = res.data;
                        var lis = [];
                        if (that.allAddrList.length > 0) that.allAddrList.forEach((value) => {
                            lis.push(`<li data-id="${value.id}"><div class="border-bottom-box"><div class="address-name"><span>${value.deliveryName}</span><span class="phone">${value.contactNumber}</span></div><div class="address-position"><span class="message">${value.country + value.province + value.city + value.area + value.address}<span></div><div class="edit-box">编辑</div></div></li>`);
                        })

                        that.editAddrInfo = that.allAddrList[0];
                        $("#address-list .content-bg").html(lis.join(""));

                        /* 如果有地址 id 进去修改的 就渲染对应的数据 */
                        if (that.allAddrList.length > 0) {
                            that.showAddrDefault(that.allAddrList[0]);
                        }

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
        /* 省市区三级联动 国家 */
        getCountry() {
            // var indexFlag = layer.open({
            //     type: 2,
            //     content: '处理中，请稍候',
            //     shadeClose: false,
            // });
            $.ajax({
                type: "GET",
                url: app.apiUrl + "/region/countryList?t=" + app.random,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", token);
                },
                async: false,
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
                        // layer.close(indexFlag);
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
            // var indexFlag = layer.open({
            //     type: 2,
            //     content: '处理中，请稍候',
            //     shadeClose: false,
            // });
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
                        // layer.close(indexFlag);
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
            // var indexFlag = layer.open({
            //     type: 2,
            //     content: '处理中，请稍候',
            //     shadeClose: false,
            // });
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
                        var arr = [`<option>市</option>`]
                        res.data.forEach(value => {
                            arr.push(`<option data-id="${value.cityId}" value="${value.cityName}">${value.cityName}</option>`);
                        })
                        arr = arr.join("");
                        $(".cityList").html(arr);
                        // layer.close(indexFlag);
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
                    console.log(e)
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
            // var indexFlag = layer.open({
            //     type: 2,
            //     content: '处理中，请稍候',
            //     shadeClose: false,
            // });
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
                        var arr = [`<option>区</option>`]
                        res.data.forEach(value => {
                            arr.push(`<option data-id="${value.areaId}" value="${value.areaName}">${value.areaName}</option>`);
                        })
                        arr = arr.join("");
                        $(".areaList").html(arr);
                        // layer.close(indexFlag);
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
                    console.log(e)
                    layer.open({
                        content: e.responseJSON.message,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                }
            })
        }
        /* 获取就诊医院 */
        getHospitalInfo() {
            $.ajax({
                //请求方式
                type: "get",
                //请求地址
                url: app.apiUrl + "/hospital/hospitalList?t=" + app.random,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                async: false,
                //请求成功
                success: function (res) {
                    if (res.code == 200) {

                        var data = JSON.parse(res.data);
                        // console.log(data);
                        /* 记录医院地址列表 */
                        that.hospitalListArr = data;
                        that.showHospitalDefault(that.hospitalListArr[0]);
                        /* 渲染所有医院地址 */
                        var strArr = [];
                        if (data.length > 0) data.forEach(function (item) {
                            strArr.push(`
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
                        });
                        $("#hospital-address-list .content-bg").html(strArr.join(""));
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            });
        }

        /* 获取未完成的病例 */
        // getNoCompleteCase() {
        //     $.ajax({
        //         /* 请求异步问题 */
        //         async: false,
        //         //请求方式
        //         type: "GET",
        //         //请求地址
        //         url: app.apiUrl + "/caseInfo/getCaseNotComplete",
        //         beforeSend: function (xhr) {
        //             //不携带这个会报错
        //             xhr.setRequestHeader("Authorization", token);
        //         },
        //         //请求成功
        //         success: function (res) {
        //             if (res.code == 200) {

        //                 if (res.data != "您没有未完成病例") {
        //                     var data = JSON.parse(res.data);
        //                     console.log(data);
        //                     $("body").addClass("beyond");
        //                     //询问框
        //                     layer.open({
        //                         content: '上次新建病例未完成，已帮您保存数据，是否从离开时继续？',
        //                         btn: ['否，新建病例', '是，继续新建'],
        //                         yes: function (index) {
        //                             layer.close(index);
        //                             $("body").removeClass("beyond");
        //                             that.getCancelCase();
        //                             that.createCaseBegin();
        //                         },
        //                         no: function (index) {
        //                             layer.close(index);
        //                             $("body").removeClass("beyond");
        //                             that.createCaseAgain(data);
        //                         }
        //                     });
        //                 } else {
        //                     /* 没有未完成的病例 直接去新建 */
        //                     that.createCaseBegin();

        //                 }

        //             } else {
        //                 layer.open({
        //                     content: res.msg,
        //                     skin: "msg",
        //                     time: 2 //2秒自动关闭
        //                 })
        //             }
        //         },
        //         //请求失败，包含具体的错误信息
        //         error: function (e) {
        //             layer.open({
        //                 content: e.responseJSON.message,
        //                 skin: "msg",
        //                 time: 2 //2秒自动关闭
        //             })
        //         }
        //     });
        // }

        /* 不要新建病例 确认接口让后台删数据 */
        getCancelCase() {
            $.ajax({
                /* 请求异步问题 */
                async: false,
                //请求方式
                type: "GET",
                //请求地址
                url: app.apiUrl + "/caseInfo/cancelCase?t=" + app.random,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
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
                //请求失败，包含具体的错误信息
                error: function (e) {
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            });
        }

        /* 新建病例正常流程 */
        createCaseBegin(data) {
            $(".case-management").hide();
            // $(".management-box").show();
            $(".management-box>div").hide();
            $(".brand").show();
            /* 获取病例品牌列表 */
            that.initBrand();

            /* 重启病例记忆功能 */
            if (that.isBegianCase && that.againCaseId) {
                /* 记录重启获取数据数组 */
                that.caseStatusCodeArr = [1, 1, 1, 1, 1, 1, 1];

            } else {
                /* 获取病例品牌列表 */
                // that.initBrand();
                that.initStepTwoData();
                that.initStepThreeData();
                that.initStepFourData();
                that.initStepFiveData();
                that.initStepSixData();
                that.initStepSevenData();
                that.initStepEightData();
            }
        }

        /* 清空第2步数据 */
        initStepTwoData() {
            $(".basic-information .user-name").val("");
            /* 渲染性别选中 */
            $(".basic-information .patient-sex div").children("p").removeClass("active");
            $(".basic-information .patient-sex div").eq(0).children("p").addClass("active");
            let birthday = that.timestampToTime("2020-09-07");
            $(".basic-information #demo1").val(birthday.year + birthday.month + birthday.day);
            $(".basic-information #demo1").attr("data-date", birthday.year + birthday.month + birthday.day);
        }

        /* 清空第3步数据 */
        initStepThreeData() {
            $("#newStep3Molar .classify-left li").eq(0).addClass("active").siblings().removeClass("active");
            $("#newStep3Molar .classify-right li").eq(0).addClass("active").siblings().removeClass("active");
            if ($("#newStep3Molar .classify-left li").hasClass("active")) {
                $(".bruxism .left-content").text($("#newStep3Molar .classify-left .active").text());
            }
            if ($("#newStep3Molar .classify-right li").hasClass("active")) {
                $(".bruxism .right-content").text($("#newStep3Molar .classify-right .active").text());
            }

            /* 尖牙关系 */
            $("#newStep3Fangs .classify-left li").eq(0).addClass("active").siblings().removeClass("active");
            $("#newStep3Fangs .classify-right li").eq(0).addClass("active").siblings().removeClass("active");
            if ($("#newStep3Fangs .classify-left li").hasClass("active")) {
                $(".cynodontes .left-content").text($("#newStep3Fangs .classify-left .active").text());
            }
            if ($("#newStep3Fangs .classify-right li").hasClass("active")) {
                $(".cynodontes .right-content").text($("#newStep3Fangs .classify-right .active").text());
            }

            /* 病例分类 */
            let diagnosisRes = [1];
            let activeArr = [];
            diagnosisRes.forEach(k => {
                $("#newStep3Case .classify li").eq(k - 1).addClass("active").siblings().removeClass("active");
                activeArr.push($("#newStep3Case .classify li").eq(k - 1).text());
            })

            $(".case .case-classification span").text(activeArr.join(","));
        }

        /* 清空第4部数据 */
        initStepFourData() {
            /* 矫治牙列渲染 矫治牙列选项（1上颌，2下颌，3全颌）*/
            $("#newStep4correctional .classify li").eq(0).addClass("active").siblings().removeClass("active");
            let prescpDentitionstr = $("#newStep4correctional .classify li").eq(0).text();
            $(".correct-target .correct span").text(prescpDentitionstr);

            /* 覆盖渲染 覆盖选项（1保持 2改善） */
            $("newStep4coating .classify li").eq(0).addClass("active").siblings().removeClass("active");
            // $(".overlay .coverage span").text();
            $("#newStep4coating input").val("");
            $("#newStep4coating input").attr("disabled", true);

            let prescpOverjetstr = $("#newStep4coating .classify li").eq(0).text()
            $(".overlay .coverage span").text(prescpOverjetstr);


            /* 覆颌渲染 覆颌选项（1保持 2改善） */
            $("#newStep4jawPopup .classify li").eq(0).addClass("active").siblings().removeClass("active");
            $("#newStep4jawPopup input").val("");
            $("#newStep4jawPopup input").attr("disabled", true);
            let prescpOverbitestr = $("#newStep4jawPopup .classify .active").text();
            $(".covering-jaw-box .covering-jaw span").text(prescpOverbitestr);

            /* 右侧磨牙关系渲染  (1保持，2理想，3改善)*/
            $("#newStep4Molar .molar-box-right .classify li").eq(0).addClass("active").siblings().removeClass("active");
            $("#newStep4Molar .molar-box-right .millimeter li").removeClass("active");
            $("#newStep4Molar .molar-box-right .millimeter li input").val("");
            $("#newStep4Molar .molar-box-right .millimeter li input").attr("disabled", true);
            let prescpMolarRightstr = $("#newStep4Molar .molar-box-right .classify .active").text();
            $(".bruxism2 .right-content").text(prescpMolarRightstr);



            /* 左侧磨牙关系渲染  (1保持，2理想，3改善)*/
            $("#newStep4Molar .molar-box-left .classify li").eq(0).addClass("active").siblings().removeClass("active");
            $("#newStep4Molar .molar-box-left .millimeter li").removeClass("active");
            $("#newStep4Molar .molar-box-left .millimeter li input").val("");
            $("#newStep4Molar .molar-box-left .millimeter li input").attr("disabled", true);
            let prescpMolarLeftstr = $("#newStep4Molar .molar-box-left .classify .active").text();
            $(".bruxism2 .left-content").text(prescpMolarLeftstr);


            /* 右侧尖牙关系渲染  (1保持，2理想，3改善)*/
            $("#newStep4Fangs .molar-box-right .classify li").eq(0).addClass("active").siblings().removeClass("active");
            $("#newStep4Fangs .molar-box-right .millimeter li").removeClass("active");
            $("#newStep4Fangs .molar-box-right .millimeter li input").val("");
            $("#newStep4Fangs .molar-box-right .millimeter li input").attr("disabled", true);
            let prescpCanineRightstr = $("#newStep4Fangs .molar-box-right .classify .active").text();
            $(".cynodontes2 .right-content").text((prescpCanineRightstr));


            /* 解决左侧尖牙关系  (1保持，2理想，3改善)*/
            $("#newStep4Fangs .molar-box-left .classify li").eq(0).addClass("active").siblings().removeClass("active");
            $("#newStep4Fangs .molar-box-left .millimeter li").removeClass("active");
            $("#newStep4Fangs .molar-box-left .millimeter li input").val("");
            $("#newStep4Fangs .molar-box-left .millimeter li input").attr("disabled", true);
            let prescpCanineLeftstr = $("#newStep4Fangs .molar-box-left .classify .active").text();
            $(".cynodontes2 .left-content").text((prescpCanineLeftstr));


            /* 后牙反颌渲染 */
            $("#newStep4Backteeth .classify li").eq(0).addClass("active").siblings().removeClass("active");
            $(".backteeth .lock-jaw-teeth span").text();

        }

        /* 清空第5部数据 */
        initStepFiveData() {

            $(".interval .teeth .up li p").html("");
            /* 下排牙齿 */
            $(".interval .teeth .down li p").html("");
        }

        /* 清空第6部数据 */
        initStepSixData() {
            $(".special .teeth .up li p").html("");
            /* 下排牙齿 */
            $(".special .teeth .down li p").html("");
        }

        /* 清空第7部数据 */
        initStepSevenData() {
            /* 中线关系 上颌状态渲染 */
            $("#newStep7Center .molar-box-left .classify li").eq(0).addClass("active").siblings().removeClass("active");
            $("#newStep7Center .molar-box-left .millimeter li").removeClass("active");
            $("#newStep7Center .molar-box-left .millimeter li input").attr("disabled", true);
            $("#newStep7Center .molar-box-left .millimeter li input").val("");
            let fprescpUpperMiddlestr = $("#newStep7Center .molar-box-left .classify .active").text();
            $(".correct-target2 .left-content").html(fprescpUpperMiddlestr);


            /* 中线关系 下颌状态渲染 */

            $("#newStep7Center .molar-box-right .classify li").eq(0).addClass("active").siblings().removeClass("active");
            $("#newStep7Center .molar-box-right .millimeter li").eq(0).removeClass("active");
            $("#newStep7Center .molar-box-right .millimeter .active input").attr("disabled", true);
            $("#newStep7Center .molar-box-right .millimeter .active input").val("");
            let fprescpLowerMiddlestr = $("#newStep7Center .molar-box-right .classify .active").text();
            $(".correct-target2 .right-content").text(fprescpLowerMiddlestr);

            /* 牙列间隙渲染 */
            $("#newStep7denture .classify li").eq(0).addClass("active").siblings().removeClass("active");
            $(".correct-target2 .teeth-clearance").text($("#newStep7denture .classify .active").text());


            /* 附加说明渲染 */
            $(".correct-target2 .objective textarea").val("");


        }

        /* 清空第8部数据 */
        initStepEightData() {
            /* 重置所有列表 input 数据 */
            $('.teeth-phone li input').prev().show();
            $('.teeth-phone li input').attr("data-front", "");
            $('.teeth-phone li input').removeClass("no-event");
            $('.teeth-phone li input').next().attr("src", "");

            $(".uploading .del-file-tips").hide();
            $(".uploading .add-file-tips").show();
            $(".del-tips").hide();
            $(".uploading .del-file-tips p").html("");
            $(".uploading .file input").removeClass("no-event");
            $(".uploading .file input").attr("data-front", "");
        }


        /* 新建病例未完成继续流程 */
        createCaseAgain(data) {
            console.log(data);
            that.postData = {
                caseId: data.id
            }
            /* 继续确保每一步都有 caseid  */
            that.secondStep.caseId = data.id;
            that.thirdStep.caseId = data.id;
            that.fourStep.caseId = data.id;
            that.fiveStep.caseId = data.id;
            that.sixStep.caseId = data.id;
            that.sevenStep.caseId = data.id;
            that.eightStep.caseId = data.id;

            that.secondStep.stageCount = data.stageCount;
            that.secondStep.stageName = data.stageName;

            that.thirdStep.stageCount = data.stageCount;
            that.thirdStep.stageName = data.stageName;

            that.fourStep.stageCount = data.stageCount;
            that.fourStep.stageName = data.stageName;

            that.fiveStep.stageCount = data.stageCount;
            that.fiveStep.stageName = data.stageName;

            that.sixStep.stageCount = data.stageCount;
            that.sixStep.stageName = data.stageName;

            that.sevenStep.stageCount = data.stageCount;
            that.sevenStep.stageName = data.stageName;

            that.eightStep.stageCount = data.stageCount;
            that.eightStep.stageName = data.stageName;

            $(".case-management").hide();
            // $(".management-box").show();
            $(".management-box>div").hide();
            $(".brand").hide();
            // console.log(data.createIndex);

            switch (data.createIndex) {
                case 1:
                    that.getBrandData(that.postData);
                    // $(".brand").show();
                    $(".basic-information").show();
                    that.getHospitalInfo();
                    that.getAddrList();
                    // console.log("第二步");
                    break;
                case 2:
                    that.getBaseData(that.postData);
                    $(".teeth-condition").show();
                    // console.log("第3步");
                    break;
                case 3:
                    that.getThreeStepData(that.postData);
                    $(".correct-target").show();
                    // console.log("第4步");
                    break;
                case 4:
                    that.getFourStepData(that.postData);
                    $(".interval").show();
                    // console.log("第5步");
                    break;
                case 5:
                    that.getFiveStepData(that.postData);
                    $(".special").show();
                    // console.log("第6步");
                    break;
                case 6:
                    that.getSixStepData(that.postData);
                    $(".correct-target2").show();
                    // console.log("第7步");
                    break;
                case 7:
                    that.getSevenStepData(that.postData);
                    that.getEightStepData(that.postData);
                    $(".teeth-phone").show();
                    // console.log("第8步");
                    break;
                case 8:
                    that.getEightStepData(that.postData);
                    $(".uploading").show();
                    // console.log("第9步");
                    break;
                case 9:
                    that.getEightStepData(that.postData);
                    $(".uploading").show();
                    // console.log("第9步");
                    break;
            }
        }

        /* 初始化品牌列表 */
        initBrand() {
            var indexFlag = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            $.ajax({
                type: "post",
                url: app.apiUrl + "/caseInfo/caseBrands?t=" + app.random,
                contentType: "application/json;charset=UTF-8",
                // async: false,
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
                        console.log(that.againCaseId, that.postData);

                        /* 病例重启 */
                        if (that.againCaseId) {
                            that.getBrandData(that.againCaseId);
                        }
                        if (that.postData) {
                            that.getBrandData(that.postData);
                        }
                        layer.close(indexFlag);
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

        /* 重启病例接口 */
        caseRestart(data) {
            $.ajax({
                type: "post",
                url: app.apiUrl + "/caseInfo/restart?t=" + app.random,
                data: JSON.stringify(data),
                // async: true,
                contentType: "application/json",
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                success: function (res) {
                    if (res.code == 200) {
                        var data = JSON.parse(res.data);
                        console.log(data);
                        /* 继续更新确保每一步都有 caseid  */
                        that.secondStep.caseId = data.caseId;
                        that.thirdStep.caseId = data.caseId;
                        that.fourStep.caseId = data.caseId;
                        that.fiveStep.caseId = data.caseId;
                        that.sixStep.caseId = data.caseId;
                        that.sevenStep.caseId = data.caseId;
                        that.eightStep.caseId = data.caseId;

                        that.secondStep.stageCount = data.stageCount;
                        that.secondStep.stageName = data.stageName;

                        that.thirdStep.stageCount = data.stageCount;
                        that.thirdStep.stageName = data.stageName;

                        that.fourStep.stageCount = data.stageCount;
                        that.fourStep.stageName = data.stageName;

                        that.fiveStep.stageCount = data.stageCount;
                        that.fiveStep.stageName = data.stageName;

                        that.sixStep.stageCount = data.stageCount;
                        that.sixStep.stageName = data.stageName;

                        that.sevenStep.stageCount = data.stageCount;
                        that.sevenStep.stageName = data.stageName;

                        that.eightStep.stageCount = data.stageCount;
                        that.eightStep.stageName = data.stageName;

                        console.log(that.againSet);

                        /* 如果重启病例 删除数据所需接口 需要请求接口 */
                        that.againSet.forEach(item => {
                            let postData = {
                                "caseId": data.caseId,
                                "fileNumber": item,
                                "stageCount": data.stageCount,
                                "stageName": data.stageName
                            };
                            that.delImg(postData);
                        });

                        that.postBrandData(that.firstStep);
                        that.postSecondStep();
                        that.postThirdStep();
                        that.postFourStep();
                        that.postFiveStep();
                        that.postSixStep();
                        that.postSevenStep();

                        /* 获取所有上传文件 一次性点保存 处理上传功能 */
                        that.eightStepArr = [];
                        that.eightCount = 0;
                        /* 仅需上传修改的部分input */
                        // console.log(that.eightStep);
                        [...$(".teeth-phone input")].forEach(item => {
                            if ($(item).get(0).saveFiles) {
                                that.eightStepArr.push({
                                    fileNumber: $(item).parent().attr("data-index"),
                                    add: "N",
                                    file: $(item).get(0).saveFiles,
                                    caseId: that.eightStep.caseId,
                                    stageCount: that.eightStep.stageCount,
                                    stageName: that.eightStep.stageName,
                                })
                            }
                        });

                        console.log(that.eightStepArr);
                        if (that.eightStepArr.length > 0) {
                            that.eightStepArr.forEach(val => {
                                that.postEightStep(val);
                            })
                        };

                        /* 重启上传的文件 */
                        if ($('.uploading .file input').val() && that.eightStep.caseId) {
                            that.eightStepObjLast = {
                                fileNumber: 12,
                                add: "N",
                                file: $('.uploading .file input').get(0).files[0],
                                caseId: that.eightStep.caseId,
                                stageCount: that.eightStep.stageCount,
                                stageName: that.eightStep.stageName,
                            };
                            that.postEightStep(that.eightStepObjLast);
                        }

                        // that.postCompleteStep();
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                },
                error: function (e) {
                    console.log(e.responseJSON.message);
                }
            })
        }

        /* 获取1品牌信息接口 */
        getBrandData(data) {
            var indexFlag = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            $.ajax({
                type: "get",
                url: app.apiUrl + "/caseInfo/getStepOne?t=" + app.random,
                data: data,
                success: function (res) {
                    if (res.code == 200) {
                        var data = JSON.parse(res.data);
                        console.log(data); // brandId: 2

                        /* 处理第一个品牌展示的数据 */
                        var index = data.brandId - 1;
                        $(".pitch-on").hide();
                        $(".pitch-on").eq(index).show();
                        layer.close(indexFlag);
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
                    // console.log(e.responseJSON.message);
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            })
        }

        /* 处理时间戳转为年月日的方法 */
        timestampToTime(timestamp) {
            var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '/';

            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';

            let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '';

            let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';

            let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';

            let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());

            return {
                year: Y,
                month: M,
                day: D,
                hour: h,
                minutes: m,
                seconds: s
            }; //时分秒可以根据自己的需求加上

        }

        /* 获取第2步基本信息接口 */
        getBaseData(data) {
            //loading带文字
            var indexFlag = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            $.ajax({
                type: "get",
                url: app.apiUrl + "/caseInfo/getStepTwo?t=" + app.random,
                data: data,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                success: function (res) {
                    if (res.code == 200) {
                        var data = JSON.parse(res.data);
                        /* 重置第2部数据 */
                        that.initStepTwoData();
                        that.getAddrList();
                        that.getHospitalInfo();
                        // console.log(data);
                        $(".basic-information .user-name").val(data.patientName);
                        /* 渲染性别选中 */
                        $(".basic-information .patient-sex div").children("p").removeClass("active");
                        $(".basic-information .patient-sex div").eq(data.sex - 1).children("p").addClass("active");
                        let birthday = that.timestampToTime(data.birthday);
                        $(".basic-information #demo1").val(birthday.year + birthday.month + birthday.day);
                        $(".basic-information #demo1").attr("data-date", birthday.year + birthday.month + birthday.day);
                        //addressId: 95
                        // birthday: 1598979588522
                        // caseId: 379
                        // hospitalId: 1
                        // patientName: "hah"
                        // sex: 1
                        that.allAddrList.forEach(item => {
                            if (item.id == data.addressId) {
                                that.setAddrDefault(item);
                            }
                        });

                        that.hospitalListArr.forEach(dom => {
                            if (dom.id == data.hospitalId) {
                                that.showHospitalDefault(dom);
                            }
                        });
                        layer.close(indexFlag);
                        /* 有重启的 id 并且 第一次请求 */
                        if (that.againCaseId && that.caseStatusCodeArr[0]) {
                            that.caseStatusCodeArr[0] = 0;
                        }
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                },
                error: function (e) {
                    // console.log(e.responseJSON.message);
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            })
        }

        /* 解码病例分类 */
        calculator(val) {

            let result = [];

            for (let i = 8; i >= 0; i--) {
                let n = Math.pow(2, i);
                // console.log(val,n);


                if (val >= n) {
                    result.push(i);
                    val -= n;
                }
            }

            return result;
        }

        /* 获取第3步接口 */
        getThreeStepData(data) {
            //loading带文字
            var indexFlag = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            $.ajax({
                type: "get",
                url: app.apiUrl + "/caseInfo/getStepThree?t=" + app.random,
                data: data,
                success: function (res) {
                    if (res.code == 200) {
                        var data = JSON.parse(res.data);
                        console.log(data);
                        /* 重置所有数据 */
                        that.initStepThreeData();
                        that.thirdStep.stageCount = data.stageCount;
                        that.thirdStep.stageName = data.stageName;
                        // molarLeft: 1
                        // molarRight: 1
                        //canineLeft: 1
                        // canineRight: 1
                        // caseId: 0
                        // diagnosisId: 0
                        // diagnosisType: 2
                        // 磨牙关系渲染
                        $("#newStep3Molar .classify-left li").eq(data.molarLeft - 1).addClass("active").siblings().removeClass("active");
                        $("#newStep3Molar .classify-right li").eq(data.molarRight - 1).addClass("active").siblings().removeClass("active");
                        if ($("#newStep3Molar .classify-left li").hasClass("active")) {
                            $(".bruxism .left-content").text($("#newStep3Molar .classify-left .active").text());
                        }
                        if ($("#newStep3Molar .classify-right li").hasClass("active")) {
                            $(".bruxism .right-content").text($("#newStep3Molar .classify-right .active").text());
                        }

                        /* 尖牙关系 */
                        $("#newStep3Fangs .classify-left li").eq(data.canineLeft - 1).addClass("active").siblings().removeClass("active");
                        $("#newStep3Fangs .classify-right li").eq(data.canineRight - 1).addClass("active").siblings().removeClass("active");
                        if ($("#newStep3Fangs .classify-left li").hasClass("active")) {
                            $(".cynodontes .left-content").text($("#newStep3Fangs .classify-left .active").text());
                        }
                        if ($("#newStep3Fangs .classify-right li").hasClass("active")) {
                            $(".cynodontes .right-content").text($("#newStep3Fangs .classify-right .active").text());
                        }

                        /* 病例分类 */
                        let diagnosisRes = that.calculator(data.diagnosisType);
                        let activeArr = [];
                        diagnosisRes.reverse().forEach(k => {
                            $("#newStep3Case .classify li").eq(k).addClass("active");
                            activeArr.push($("#newStep3Case .classify li").eq(k).text());
                        })

                        $(".case .case-classification span").text(activeArr.join(","));

                        layer.close(indexFlag);
                        /* 有重启的 id 并且 第一次请求 */
                        if (that.againCaseId && that.caseStatusCodeArr[1]) {
                            that.caseStatusCodeArr[1] = 0;
                        }
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
                    // console.log(e.responseJSON.message);
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            })
        }

        /* 获取第4步接口 */
        getFourStepData(data) {
            //loading带文字
            var indexFlag = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            $.ajax({
                type: "get",
                url: app.apiUrl + "/caseInfo/getStepFour?t=" + app.random,
                data: data,
                success: function (res) {
                    if (res.code == 200) {
                        var data = JSON.parse(res.data);
                        data = data[0];
                        console.log(data);
                        /* 重置所有数据 */
                        that.initStepFourData();

                        /* 矫治牙列渲染 矫治牙列选项（1上颌，2下颌，3全颌）*/
                        $("#newStep4correctional .classify li").eq(data.prescpDentition - 1).addClass("active").siblings().removeClass("active");
                        let prescpDentitionstr = $("#newStep4correctional .classify li").eq(data.prescpDentition - 1).text();
                        $(".correct-target .correct span").text(prescpDentitionstr);

                        /* 覆盖渲染 覆盖选项（1保持 2改善） */
                        $("newStep4coating .classify li").eq(data.prescpOverjet - 1).addClass("active").siblings().removeClass("active");
                        let prescpOverjetstr = "",
                            prescpOverjetDatastr = "";
                        $(".overlay .coverage span").text();
                        if (data.prescpOverjet == 2) {
                            $("#newStep4coating input").val(data.prescpOverjetData);
                            $("#newStep4coating input").prop("disabled", false);
                            prescpOverjetDatastr = data.prescpOverjetData + "mm";
                        }
                        prescpOverjetstr = $("#newStep4coating .classify li").eq(data.prescpOverjet - 1).text()
                        $(".overlay .coverage span").text(prescpOverjetstr + prescpOverjetDatastr);


                        /* 覆颌渲染 覆颌选项（1保持 2改善） */
                        $("#newStep4jawPopup .classify li").eq(data.prescpOverbite - 1).addClass("active").siblings().removeClass("active");
                        let prescpOverbitestr = "",
                            prescpOverbiteDatastr = "";
                        if (data.prescpOverbite == 2) {
                            $("#newStep4jawPopup input").val(data.prescpOverbiteData);
                            $("#newStep4jawPopup input").prop("disabled", false);
                            prescpOverbiteDatastr = data.prescpOverbiteData + "mm";
                        }
                        prescpOverbitestr = $("#newStep4jawPopup .classify .active").text();
                        $(".covering-jaw-box .covering-jaw span").text(prescpOverbitestr + prescpOverbiteDatastr);

                        /* 右侧磨牙关系渲染  (1保持，2理想，3改善)*/
                        $("#newStep4Molar .molar-box-right .classify li").eq(data.prescpMolarRight - 1).addClass("active").siblings().removeClass("active");
                        let prescpMolarRightstr = "",
                            prescpMolarRightDatastr = "";
                        if (data.prescpMolarRight == 3) {
                            if (data.prescpMolarRightData > 0) {
                                $("#newStep4Molar .molar-box-right .millimeter li").eq(0).addClass("active").siblings().removeClass("active");
                            } else {
                                data.prescpMolarRightData = Math.abs(data.prescpMolarRightData);
                                $("#newStep4Molar .molar-box-right .millimeter li").eq(1).addClass("active").siblings().removeClass("active");
                            }
                            $("#newStep4Molar .molar-box-right .millimeter .active input").val(data.prescpMolarRightData);
                            $("#newStep4Molar .molar-box-right .millimeter .active input").attr("disabled", false);
                            prescpMolarRightDatastr = $("#newStep4Molar .molar-box-right .millimeter .active").text().trim().substr(0, 5) + $("#newStep4Molar .molar-box-right .millimeter .active input").val() + "mm";
                        }
                        prescpMolarRightstr = $("#newStep4Molar .molar-box-right .classify .active").text();
                        $(".bruxism2 .right-content").text(prescpMolarRightstr + prescpMolarRightDatastr);



                        /* 左侧磨牙关系渲染  (1保持，2理想，3改善)*/
                        $("#newStep4Molar .molar-box-left .classify li").eq(data.prescpMolarLeft - 1).addClass("active").siblings().removeClass("active");
                        let prescpMolarLeftstr = "",
                            prescpMolarLeftDatastr = "";
                        if (data.prescpMolarLeft == 3) {
                            if (data.prescpMolarLeftData > 0) {
                                $("#newStep4Molar .molar-box-left .millimeter li").eq(0).addClass("active").siblings().removeClass("active");

                            } else {
                                data.prescpMolarLeftData = Math.abs(data.prescpMolarLeftData);
                                $("#newStep4Molar .molar-box-left .millimeter li").eq(1).addClass("active").siblings().removeClass("active");
                            }
                            $("#newStep4Molar .molar-box-left .millimeter .active input").val(data.prescpMolarLeftData);
                            $("#newStep4Molar .molar-box-left .millimeter .active input").attr("disabled", false);
                            prescpMolarLeftDatastr = $("#newStep4Molar .molar-box-left .millimeter .active").text().trim().substr(0, 5) + $("#newStep4Molar .molar-box-left .millimeter .active input").val() + "mm";
                        }
                        prescpMolarLeftstr = $("#newStep4Molar .molar-box-left .classify .active").text();
                        $(".bruxism2 .left-content").text(prescpMolarLeftstr + prescpMolarLeftDatastr);




                        /* 右侧尖牙关系渲染  (1保持，2理想，3改善)*/
                        $("#newStep4Fangs .molar-box-right .classify li").eq(data.prescpCanineRight - 1).addClass("active").siblings().removeClass("active");
                        let prescpCanineRightstr = "",
                            prescpCanineRightDatastr = "";
                        if (data.prescpCanineRight == 3) {
                            if (data.prescpCanineRightData > 0) {
                                $("#newStep4Fangs .molar-box-right .millimeter li").eq(0).addClass("active").siblings().removeClass("active");
                            } else {
                                data.prescpCanineRightData = Math.abs(data.prescpCanineRightData);
                                $("#newStep4Fangs .molar-box-right .millimeter li").eq(1).addClass("active").siblings().removeClass("active");
                            }
                            $("#newStep4Fangs .molar-box-right .millimeter .active input").val(data.prescpCanineRightData);
                            $("#newStep4Fangs .molar-box-right .millimeter .active input").attr("disabled", false);
                            prescpCanineRightDatastr = $("#newStep4Fangs .molar-box-right .millimeter .active").text().trim().substr(0, 5) + $("#newStep4Fangs .molar-box-right .millimeter .active input").val() + "mm";
                        }
                        prescpCanineRightstr = $("#newStep4Fangs .molar-box-right .classify .active").text();
                        $(".cynodontes2 .right-content").text((prescpCanineRightstr + prescpCanineRightDatastr));


                        /* 解决左侧尖牙关系  (1保持，2理想，3改善)*/
                        $("#newStep4Fangs .molar-box-left .classify li").eq(data.prescpCanineLeft - 1).addClass("active").siblings().removeClass("active");
                        let prescpCanineLeftstr = "",
                            prescpCanineLeftDatastr = "";
                        if (data.prescpCanineLeft == 3) {
                            if (data.prescpCanineLeftData > 0) {
                                $("#newStep4Fangs .molar-box-left .millimeter li").eq(0).addClass("active").siblings().removeClass("active");
                            } else {
                                data.prescpCanineLeftData = Math.abs(data.prescpCanineLeftData);
                                $("#newStep4Fangs .molar-box-left .millimeter li").eq(1).addClass("active").siblings().removeClass("active");
                            }
                            $("#newStep4Fangs .molar-box-left .millimeter .active input").val(data.prescpCanineLeftData);
                            $("#newStep4Fangs .molar-box-left .millimeter .active input").attr("disabled", false);
                            prescpCanineLeftDatastr = $("#newStep4Fangs .molar-box-left .millimeter .active").text().trim().substr(0, 5) + $("#newStep4Fangs .molar-box-left .millimeter .active input").val() + "mm";
                        }
                        prescpCanineLeftstr = $("#newStep4Fangs .molar-box-left .classify .active").text();
                        $(".cynodontes2 .left-content").text((prescpCanineLeftstr + prescpCanineLeftDatastr));


                        /* 后牙反颌渲染 */
                        if (data.prescpPosteriorCrossBite != 0) {
                            $("#newStep4Backteeth .classify li").eq(data.prescpPosteriorCrossBite - 1).addClass("active").siblings().removeClass("active");
                            $(".backteeth .lock-jaw-teeth span").text($("#newStep4Backteeth .classify .active").text());
                        } else {
                            $("#newStep4Backteeth .classify li").eq(0).addClass("active").siblings().removeClass("active");
                            $(".backteeth .lock-jaw-teeth span").text();
                        }

                        layer.close(indexFlag);
                        /* 有重启的 id 并且 第一次请求 */
                        if (that.againCaseId && that.caseStatusCodeArr[2]) {
                            that.caseStatusCodeArr[2] = 0;
                        }
                        // prescpCanineLeft: 1
                        // prescpCanineLeftData: 0
                        // prescpCanineRight: 1
                        // prescpCanineRightData: 0
                        // prescpDentition: 1
                        // prescpMolarLeft: 1
                        // prescpMolarLeftData: 0
                        // prescpMolarRight: 1
                        // prescpMolarRightData: 0
                        // prescpOverbite: 1
                        // prescpOverbiteData: 0
                        // prescpOverjet: 1
                        // prescpOverjetData: 0
                        // prescpPosteriorCrossBite: 0
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
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            })
        }

        /* 获取第5步接口 */
        getFiveStepData(data) {
            //loading带文字
            var indexFlag = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            $.ajax({
                type: "get",
                url: app.apiUrl + "/caseInfo/getStepFive?t=" + app.random,
                data: data,
                success: function (res) {
                    if (res.code == 200) {
                        var data = JSON.parse(res.data);
                        console.log(data);
                        /* 重置所有数据 */
                        that.initStepFiveData();
                        // [{
                        //         teethIndex ":0,"
                        //         ex ":true,"
                        //         exp ":true,"
                        //         dm ":true,"
                        //         ipr ":false
                        // }, {
                        //             "
                        //             teethIndex ":15,"
                        //             ex ":false,"
                        //             exp ":true,"
                        //             dm ":false,"
                        //             ipr ":false},{"
                        //             teethIndex ":20,"
                        //             ex ":true,"
                        //             exp ":true,"
                        //             dm ":true,"
                        //             ipr ":false},{"
                        //             teethIndex ":23,"
                        //             ex ":false,"
                        //             exp ":false,"
                        //             dm ":true,"
                        //             ipr ":true}
                        //         ]
                        data.forEach(item => {
                            /* 获取对应牙齿下标 */
                            let teethIdx = app.teethArr.indexOf(item.teethIndex);
                            if (teethIdx < 0) return false;
                            let x = teethIdx >= $(".interval .teeth .up li").length ? teethIdx - $(".interval .teeth .up li").length : teethIdx;
                            let teethArr = [];
                            /* 上排牙齿 */
                            if (item.ex) {
                                teethArr.push(`<span>EX</span>`);
                            }

                            if (item.exp) {
                                teethArr.push(`<span>EXP</span>`);
                            }

                            if (item.dm) {
                                teethArr.push(`<span>DM</span>`);
                            }

                            if (item.ipr) {
                                teethArr.push(`<span>IPR</span>`);
                            }

                            if (teethIdx < $(".interval .teeth .up li").length) {

                                $(".interval .teeth .up li").eq(x).children("p").html(teethArr.join(""));
                            } else {
                                /* 下排牙齿 */
                                $(".interval .teeth .down li").eq(x).children("p").html(teethArr.join(""));
                            }

                        });
                        layer.close(indexFlag);
                        /* 有重启的 id 并且 第一次请求 */
                        if (that.againCaseId && that.caseStatusCodeArr[3]) {
                            that.caseStatusCodeArr[3] = 0;
                        }
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
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            })
        }

        /* 获取第6步接口 */
        getSixStepData(data) {
            //loading带文字
            var indexFlag = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            $.ajax({
                type: "get",
                url: app.apiUrl + "/caseInfo/getStepSix?t=" + app.random,
                data: data,
                success: function (res) {
                    if (res.code == 200) {
                        var data = JSON.parse(res.data);
                        console.log(data);
                        /* 重置所有数据 */
                        that.initStepSixData();
                        // [{
                        //     "teethIndex": 0,
                        //     "nm": true,
                        //     "na": false,
                        //     "m": false
                        // }, {
                        //     "teethIndex": 12,
                        //     "nm": false,
                        //     "na": true,
                        //     "m": false
                        // }, {
                        //     "teethIndex": 24,
                        //     "nm": true,
                        //     "na": true,
                        //     "m": false
                        // }, {
                        //     "teethIndex": 28,
                        //     "nm": false,
                        //     "na": false,
                        //     "m": true
                        // }]
                        data.forEach(item => {
                            /* 获取对应牙齿下标 */
                            let teethIdx = app.teethArr.indexOf(item.teethIndex);
                            if (teethIdx < 0) return false;
                            let x = (teethIdx >= $(".special .teeth .up li").length) ? (teethIdx - $(".special .teeth .up li").length) : teethIdx;
                            let teethArr = [];
                            /* 上排牙齿 */
                            if (item.nm) {
                                teethArr.push(`<span>Nm</span>`);
                            }

                            if (item.na) {
                                teethArr.push(`<span>Na</span>`);
                            }

                            if (item.m) {
                                teethArr.push(`<span>M</span>`);
                            }

                            if (teethIdx < $(".special .teeth .up li").length) {

                                $(".special .teeth .up li").eq(x).children("p").html(teethArr.join(""));
                            } else {
                                /* 下排牙齿 */
                                $(".special .teeth .down li").eq(x).children("p").html(teethArr.join(""));
                            }

                        });

                        layer.close(indexFlag);
                        /* 有重启的 id 并且 第一次请求 */
                        if (that.againCaseId && that.caseStatusCodeArr[4]) {
                            that.caseStatusCodeArr[4] = 0;
                        }
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
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            })
        }

        /* 获取第7步接口 */
        getSevenStepData(data) {
            //loading带文字
            var indexFlag = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            $.ajax({
                type: "get",
                url: app.apiUrl + "/caseInfo/getStepSeven?t=" + app.random,
                data: data,
                success: function (res) {
                    if (res.code == 200) {
                        var data = JSON.parse(res.data);
                        console.log(data);
                        data = data[0];
                        // [{
                        //     "fprescpUpperMiddle": 12.0,
                        //     "fprescpLowerMiddle": -12.0,
                        //     "nprescpSpacing": 1,
                        //     "strPrescpInstruction": "abab"
                        // }]
                        /* 重置所有数据 */
                        that.initStepSevenData();
                        /* 中线关系 上颌状态渲染 */
                        let fprescpUpperMiddlestr = "";
                        if (data.fprescpUpperMiddle == 34 || data.fprescpUpperMiddle == 0) {
                            $("#newStep7Center .molar-box-left .classify li").eq(0).addClass("active").siblings().removeClass("active");
                            fprescpUpperMiddlestr = $("#newStep7Center .molar-box-left .classify .active").text();
                        } else {
                            // var idx = $("#newStep7Center .molar-box-left .classify .active").index();
                            // var num4 = Number($("#newStep7Center .molar-box-left .millimeter input").eq(idx - 1).val());
                            if (data.fprescpUpperMiddle > 0) {
                                $("#newStep7Center .molar-box-left .millimeter li").eq(0).addClass("active").siblings().removeClass("active");
                                $("#newStep7Center .molar-box-left .classify li").eq(1).addClass("active").siblings().removeClass("active");
                            } else {
                                $("#newStep7Center .molar-box-left .millimeter li").eq(1).addClass("active").siblings().removeClass("active");
                                $("#newStep7Center .molar-box-left .classify li").eq(2).addClass("active").siblings().removeClass("active");
                            }

                            $("#newStep7Center .molar-box-left .millimeter .active input").attr("disabled", false);
                            $("#newStep7Center .molar-box-left .millimeter .active input").val(Math.abs(data.fprescpUpperMiddle));

                            fprescpUpperMiddlestr = $("#newStep7Center .molar-box-left .millimeter .active").text().trim().substr(0, 5) + $("#newStep7Center .molar-box-left .millimeter .active input").val() + "mm";
                        }
                        $(".correct-target2 .left-content").html(fprescpUpperMiddlestr);


                        /* 中线关系 下颌状态渲染 */
                        let fprescpLowerMiddlestr = "";
                        if (data.fprescpLowerMiddle == 34 || data.fprescpLowerMiddle == 0) {
                            $("#newStep7Center .molar-box-right .classify li").eq(0).addClass("active").siblings().removeClass("active");
                            fprescpLowerMiddlestr = $("#newStep7Center .molar-box-right .classify .active").text();
                        } else {
                            if (data.fprescpLowerMiddle > 0) {
                                $("#newStep7Center .molar-box-right .millimeter li").eq(0).addClass("active").siblings().removeClass("active");
                                $("#newStep7Center .molar-box-right .classify li").eq(1).addClass("active").siblings().removeClass("active");
                            } else {
                                $("#newStep7Center .molar-box-right .millimeter li").eq(1).addClass("active").siblings().removeClass("active");
                                $("#newStep7Center .molar-box-right .classify li").eq(2).addClass("active").siblings().removeClass("active");
                            }

                            $("#newStep7Center .molar-box-right .millimeter .active input").attr("disabled", false);
                            $("#newStep7Center .molar-box-right .millimeter .active input").val(Math.abs(data.fprescpLowerMiddle));

                            fprescpLowerMiddlestr = $("#newStep7Center .molar-box-right .millimeter .active").text().trim().substr(0, 5) + $("#newStep7Center .molar-box-right .millimeter .active input").val() + "mm";
                        }
                        $(".correct-target2 .right-content").text(fprescpLowerMiddlestr);

                        /* 牙列间隙渲染 */
                        $("#newStep7denture .classify li").eq(1).addClass("active").siblings().removeClass("active");
                        if (data.nprescpSpacing == 0 || data.nprescpSpacing == 1) {
                            $("#newStep7denture .classify li").eq(0).addClass("active").siblings().removeClass("active");
                        }
                        $(".correct-target2 .teeth-clearance").text($("#newStep7denture .classify .active").text());


                        /* 附加说明渲染 */
                        data.strPrescpInstruction = data.strPrescpInstruction.replace(/<br\/>/g, '\r\n').replace(/\&nbsp\;/g, '\s');
                        $(".correct-target2 .objective textarea").val(data.strPrescpInstruction);

                        layer.close(indexFlag);
                        /* 有重启的 id 并且 第一次请求 */
                        if (that.againCaseId && that.caseStatusCodeArr[5]) {
                            that.caseStatusCodeArr[5] = 0;
                        }
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
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            })
        }

        /* 获取第8步接口 */
        getEightStepData(data) {
            //loading带文字
            var indexFlag = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            $.ajax({
                type: "get",
                url: app.apiUrl + "/caseInfo/getStepEight?t=" + app.random,
                data: data,
                success: function (res) {
                    if (res.code == 200) {
                        var data = JSON.parse(res.data);
                        console.log(data);
                        /* 重置所有列表 input 数据 */
                        that.initStepEightData();
                        let eightCount = 0;
                        if (data.length > 0) {
                            data.forEach(item => {
                                if (Number(item.fileNumber) <= 11) {
                                    $('.teeth-phone li input').eq(Number(item.fileNumber) - 1).prev().hide();
                                    /* 记录后台来的图片 */
                                    $('.teeth-phone li input').eq(Number(item.fileNumber) - 1).attr("data-front", "no");
                                    $('.teeth-phone li input').eq(Number(item.fileNumber) - 1).addClass("no-event");
                                    $('.teeth-phone li input').eq(Number(item.fileNumber) - 1).next().attr("src", app.imgUrl + item.path);
                                    app.sendFn(app.imgUrl + item.path).then(function (res) {
                                        console.log(res);
                                        eightCount++;
                                        if (eightCount >= data.length) {
                                            layer.close(indexFlag);
                                        }
                                        /* 保存图片路径 */
                                        $('.teeth-phone li input').eq(Number(item.fileNumber) - 1).get(0).saveFiles = res;
                                    });
                                    $(".teeth-phone input").eq(Number(item.fileNumber) - 1).val("");
                                } else {
                                    eightCount++;
                                    if (eightCount >= data.length) {
                                        layer.close(indexFlag);
                                    }
                                }
                                // else 
                                if (Number(item.fileNumber) == 12) {
                                    $(".uploading .del-file-tips").show();
                                    $(".uploading .add-file-tips").hide();
                                    $(".del-tips").show();
                                    $(".uploading .del-file-tips p").html(item.fileName);
                                    $(".uploading .file input").addClass("no-event");
                                    $(".uploading .file input").attr("data-front", "no");
                                }
                            })
                        }


                        if (eightCount >= data.length) {
                            layer.close(indexFlag);
                        }
                        /* 有重启的 id 并且 第一次请求 */
                        if (that.againCaseId && that.caseStatusCodeArr[6]) {
                            that.caseStatusCodeArr[6] = 0;
                        }
                        //     that.eightStep.fileNumber = $(this).parent().attr("data-index");
                        //     that.eightStep.add = "Y";
                        // })
                        // [{
                        //     "type": "X",
                        //     "fileNumber": "11",
                        //     "path": "/MA20090200083/FirstDesign/1/PHOTO/1599040833527.png",
                        //     "mTime": "Sep 2, 2020 6:00:33 PM",
                        //     "modify": true
                        // }, {
                        //     "type": "X",
                        //     "fileNumber": "9",
                        //     "path": "/MA20090200083/FirstDesign/1/PHOTO/1599041197308.png",
                        //     "mTime": "Sep 2, 2020 6:06:37 PM",
                        //     "modify": true
                        // }, {
                        //     "type": "F",
                        //     "fileNumber": "3",
                        //     "path": "/MA20090200083/FirstDesign/1/PHOTO/1599041920634.png",
                        //     "mTime": "Sep 2, 2020 6:18:40 PM",
                        //     "modify": true
                        // }, {
                        //     "type": "F",
                        //     "fileNumber": "1",
                        //     "path": "/MA20090200083/FirstDesign/1/PHOTO/1599042288247.png",
                        //     "mTime": "Sep 2, 2020 6:24:48 PM",
                        //     "modify": true
                        // }]
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
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            })
        }

        /* 删除图片 */
        delImg(data) {
            /* 获取保存第一步 */
            $.ajax({
                /* 请求异步问题 */
                async: false,
                //请求方式
                type: "POST",
                //请求的媒体类型
                contentType: "application/json;charset=UTF-8",
                //请求地址
                url: app.apiUrl + "/caseInfo/delPhoto?t=" + app.random,
                //数据，json字符串
                data: JSON.stringify(data),
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                //请求成功
                success: function (res) {
                    if (res.code == 200) {
                        // var data = JSON.parse(res.data);
                        console.log(data.fileNumber);
                        /* 删除之后清空图片 */
                        $(".teeth-phone input").eq(Number(data.fileNumber) - 1).val("");
                        $(".teeth-phone input").eq(Number(data.fileNumber) - 1).attr("data-front", "");
                        $(".teeth-phone input").eq(Number(data.fileNumber) - 1).next().attr("src", "");
                        $(".teeth-phone input").eq(Number(data.fileNumber) - 1).prev().show();
                        // $(".teeth-phone .phone-close").eq(Number(data.fileNumber) - 1).hide();
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            });
        }


        /* 品牌选择上传数据 */
        postBrandData(data) {
            // console.log(data);
            //loading带文字
            var index = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            /* 获取保存第一步 */
            $.ajax({
                /* 请求异步问题 */
                // async: false,
                //请求方式
                type: "POST",
                //请求的媒体类型
                contentType: "application/json;charset=UTF-8",
                //请求地址
                url: app.apiUrl + "/caseInfo/stepOne?t=" + app.random,
                //数据，json字符串
                data: JSON.stringify(data),
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                //请求成功
                success: function (res) {
                    if (res.code == 200) {
                        var data = JSON.parse(res.data);
                        // console.log(data);
                        /* 如果新建病例就获取第一步返回的 id和 stageCount */
                        if (!that.isBegianCase) {
                            that.secondStep.caseId = data.id;
                            that.secondStep.stageCount = data.stageCount;
                            that.secondStep.stageName = data.stageName;
                        }
                        layer.close(index);
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            });
        }
        /* 传递第二步数据 */
        postSecondStep() {
            // console.log(that.secondStep);
            //loading带文字
            var index = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            /* 获取保存第二步 */
            $.ajax({
                /* 请求异步问题 */
                // async: false,
                //请求方式
                type: "POST",
                //请求的媒体类型
                contentType: "application/json;charset=UTF-8",
                //请求地址
                url: app.apiUrl + "/caseInfo/stepTwo?t=" + app.random,
                //数据，json字符串
                data: JSON.stringify(that.secondStep),
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                //请求成功
                success: function (res) {
                    if (res.code == 200) {
                        console.log(res);
                        layer.close(index);
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            });
        }

        /* 传递第三部数据 */
        postThirdStep() {
            //loading带文字
            var index = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            /* 获取保存第二步 */
            $.ajax({
                /* 请求异步问题 */
                // async: false,
                //请求方式
                type: "POST",
                //请求的媒体类型
                contentType: "application/json;charset=UTF-8",
                //请求地址
                url: app.apiUrl + "/caseInfo/stepThree?t=" + app.random,
                //数据，json字符串
                data: JSON.stringify(that.thirdStep),
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                //请求成功
                success: function (res) {
                    if (res.code == 200) {
                        console.log(res);
                        layer.close(index);
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            });
        }
        /* 传递第四部数据 */
        postFourStep() {
            //loading带文字
            var index = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            /* 获取保存第二步 */
            $.ajax({
                /* 请求异步问题 */
                // async: false,
                //请求方式
                type: "POST",
                //请求的媒体类型
                contentType: "application/json;charset=UTF-8",
                //请求地址
                url: app.apiUrl + "/caseInfo/stepFour?t=" + app.random,
                //数据，json字符串
                data: JSON.stringify(that.fourStep),
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                //请求成功
                success: function (res) {
                    if (res.code == 200) {
                        console.log(res);
                        layer.close(index);
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            });
        }

        /* 传递第五部数据 */
        postFiveStep() {
            //loading带文字
            var index = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            /* 获取保存第二步 */
            $.ajax({
                /* 请求异步问题 */
                // async: false,
                //请求方式
                type: "POST",
                //请求的媒体类型
                contentType: "application/json;charset=UTF-8",
                //请求地址
                url: app.apiUrl + "/caseInfo/stepFive?t=" + app.random,
                //数据，json字符串
                data: JSON.stringify(that.fiveStep),
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                //请求成功
                success: function (res) {
                    if (res.code == 200) {
                        console.log(res);
                        layer.close(index);
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            });
        }
        /* 传递第6部数据 */
        postSixStep() {
            //loading带文字
            var index = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            /* 获取保存第二步 */
            $.ajax({
                /* 请求异步问题 */
                // async: false,
                //请求方式
                type: "POST",
                //请求的媒体类型
                contentType: "application/json;charset=UTF-8",
                //请求地址
                url: app.apiUrl + "/caseInfo/stepSix?t=" + app.random,
                //数据，json字符串
                data: JSON.stringify(that.sixStep),
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                //请求成功
                success: function (res) {
                    if (res.code == 200) {
                        console.log(res);
                        layer.close(index);
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            });
        }
        /* 传递第7步 */
        postSevenStep() {
            //loading带文字
            var index = layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            /* 获取保存第二步 */
            $.ajax({
                /* 请求异步问题 */
                // async: false,
                //请求方式
                type: "POST",
                //请求的媒体类型
                contentType: "application/json;charset=UTF-8",
                //请求地址
                url: app.apiUrl + "/caseInfo/stepSeven?t=" + app.random,
                //数据，json字符串
                data: JSON.stringify(that.sevenStep),
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                //请求成功
                success: function (res) {
                    if (res.code == 200) {
                        console.log(res);
                        layer.close(index);
                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            });
        }
        /* 传递第8步 */
        postEightStep(data) {
            var eightFormdata = new FormData();
            for (var k in data) {
                eightFormdata.append(k, data[k]);
            }
            //loading带文字
            layer.open({
                type: 2,
                content: '处理中，请稍候',
                shadeClose: false,
            });
            /* 获取保存第二步 */
            $.ajax({
                /* 请求异步问题 */
                // async: false,
                //请求方式
                type: "POST",
                dataType: 'JSON',
                cache: false, // 不缓存
                processData: false, // jQuery不要去处理发送的数据
                contentType: false,
                //请求地址
                url: app.apiUrl + "/caseInfo/stepEight?t=" + app.random,
                //数据，json字符串
                data: eightFormdata,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                //请求成功
                success: function (res) {
                    if (res.code == 200) {
                        console.log(res);
                        // that.postCompleteStep();
                        that.eightCount++;
                        console.log(that.eightCount, that.eightStepArr.length);

                        /*  新建病例完成时请求 有第十二步时
                            重启时每一个文件都上传完也可请求 没有文件 11
                            重启时每一个文件都上传完也可请求有文件 12
                        */
                       
                        if ((!that.isBegianCase && that.eightStepObjLast && that.eightStepObjLast.file) ||
                            (that.isBegianCase && that.eightStepObjLast && that.eightStepObjLast.file && that.eightCount == that.eightStepArr.length + 1) ||
                            (that.isBegianCase && that.eightCount == that.eightStepArr.length && that.eightStepObjLast && !that.eightStepObjLast.file)) {
                            console.log("keyi wanhceng");
                            layer.closeAll();
                            // that.postCompleteStep();
                        } else if (!that.isBegianCase || that.eightCount == that.eightStepArr.length) {
                            layer.closeAll();
                        }



                        // that.eightLayer.forEach(function(idx){


                        // })

                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    });
                }
            });
        }

        /* 完成所有的病例 */
        postCompleteStep() {
            /* 获取保存第二步 */
            $.ajax({
                /* 请求异步问题 */
                // async: false,
                //请求方式
                type: "POST",
                //请求的媒体类型
                contentType: "application/json;charset=UTF-8",
                //请求地址
                url: app.apiUrl + "/caseInfo/createComplete?t=" + app.random,
                //数据，json字符串
                data: JSON.stringify({
                    caseId: that.eightStep.caseId
                }),
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                //请求成功
                success: function (res) {
                    if (res.code == 200) {
                        console.log(res);
                        location.replace("./management.html");

                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        });
                    }
                    clickFlagSave = true;
                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    });
                    clickFlagSave = true;
                }
            });
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
            // var dataArr = [];
            // dataArr.push(data);
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

        /* 渲染基本信息地址第一条地址 */
        showAddrDefault(options) {
            console.log(options);
            $("#messageReceiver span").eq(0).html(options.deliveryName);
            $("#messageReceiver span").eq(1).html(options.contactNumber);
            $("#messageReceiver span").eq(2).html(options.country + options.province + options.city + options.area + options.address);
            $(".delivery-address").attr("data-id", options.id);
            that.editObj.country = options.country;
            that.editObj.province = options.province;
            that.editObj.city = options.city;
            that.editObj.area = options.area;
            that.editObj.address = options.address;
            that.setAddrDefault(options);

        }

        /* 设置修改地址的默认选中地址值 */
        setAddrDefault(options) {
            $("#receiverName").val(options.deliveryName);
            $("#receiverTel").val(options.contactNumber);
            $("#receiverDetail").val(options.address);
            if (options.country) {
                /* 显示当前选中的 地址 */
                $(".countryList").find(`option[value="${options.country}"]`).prop("selected", true);
                var countryId = $(".countryList").find(`option[value="${options.country}"]`).attr("data-id");
            }

            /* 如果是中国就去请求省市区  */
            if (options.country == "中国") {
                that.getProvince(countryId);

                $(".provinceList").find(`option[value="${options.province}"]`).attr("selected", true);
                var provinceId = $(".provinceList").find(`option[value="${options.province}"]`).attr("data-id");
                that.getCity(provinceId);

                $(".cityList").find(`option[value="${options.city}"]`).attr("selected", true);
                var cityId = $(".cityList").find(`option[value="${options.city}"]`).attr("data-id");
                that.getArea(cityId);

                $(".areaList").find(`option[value="${options.area}"]`).attr("selected", true);

            }
        }

        /* 删除就诊医院地址 */
        delHospitalAddr(data) {
            $.ajax({
                //请求方式
                type: "get",
                //请求地址
                url: app.apiUrl + "/hospital/delHospital?t=" + app.random,
                data: data,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                //请求成功
                success: function (res) {
                    if (res.code == 200) {

                        // var data = JSON.parse(res.data);
                        // console.log(data);
                        that.getHospitalInfo();


                    } else {
                        layer.open({
                            content: res.msg,
                            skin: "msg",
                            time: 2 //2秒自动关闭
                        })
                    }
                },
                //请求失败，包含具体的错误信息
                error: function (e) {
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            });
        }

        /* 修改医院地址 */
        updateHospital(data) {

            $.ajax({
                type: "POST",
                url: app.apiUrl + "/hospital/updateHospital?t=" + app.random,
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(data),
                async: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        that.getHospitalInfo();
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

        /* 新增医院地址 */
        saveHospital(data) {
            $.ajax({
                type: "POST",
                url: app.apiUrl + "/hospital/saveHospital?t=" + app.random,
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(data),
                async: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", token);
                },
                /* 成功的回调 */
                success: function (res) {
                    if (res.code == 200) {
                        that.getHospitalInfo();
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

        /* 渲染医院第一条地址 */
        showHospitalDefault(options) {
            if (options) {
                $(".hospital-site").html(options.country + options.province + options.city + options.area + options.address + options.hospitalName);
                $(".hospital").attr("data-id", options.id);
            }

        }

        /* 设置地址状态 */
        setCurHosptialAddr(options) {
            console.log(options);
            $("#hospitalAddrnew input").val(options.address);
            $("#designationnew input").val(options.hospitalName)

            $(".delete").attr("data-id", options.id);
            $("#modification-hospital .save").attr("data-id", options.id);
            if (options.country != "中国") {
                that.clearCurHosptialAddr();
            } else {
                /* 显示当前选中的 地址 */
                $(".countryList").find(`option[value="${options.country}"]`).attr("selected", true);

                /* 如果是中国就去请求省市区  */
                if (options.country == "中国") {
                    that.getProvince(options.countriesId);

                    $(".provinceList").find(`option[value="${options.province}"]`).attr("selected", true);
                    that.getCity(options.provinceId);

                    $(".cityList").find(`option[value="${options.city}"]`).attr("selected", true);
                    that.getArea(options.cityId);

                    $(".areaList").find(`option[value="${options.area}"]`).attr("selected", true);

                }
            }



        }

        /* 清空地址状态 */
        clearCurHosptialAddr() {
            $(".countryList").find('option[value="国家"]').prop("selected", true);
            $(".provinceList").html(`<option value="省">省</option>`);
            $(".cityList").html(`<option value="市">市</option>`);
            $(".areaList").html(`<option value="区">区</option>`);
        }

    }
    window.newCreateCase = new CreateCase();
    /* 新建病例 结束 */

})