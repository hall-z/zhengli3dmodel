/* 年月日插件 */
var pcx = pcx || {};
var that = null;
/* 获取本地存储的数据 */
var getLocalStorage = app.powerLocal();
var token = getLocalStorage.token;
var isDoctorType = getLocalStorage.type;
let editObj = {};
var judgment = 1;



$(function () {
    /* 临床分类解码展示数据 */
    var textArr = ["拥挤", "牙列间隙", "前突", "前牙反𬌗", "开𬌗", "深覆𬌗", "深覆盖", "后牙锁𬌗", "后牙反𬌗"];
    pcx.dc = new Lunar();
    var date1 = new ruiDatepicker().init("#beginDate");
    var date2 = new ruiDatepicker().init("#finishDate");
    var date3 = new ruiDatepicker().init("#datumDate");
    var date4 = new ruiDatepicker().init("#onsetDate");
    /* 判断是医生还是员工身份 设置员工权限*/
    if (isDoctorType == 2) {
        $(".menu-box .menu-list li").eq(1).hide();
        $(".menu-box .menu-list li").eq(3).hide();
        $(".menu-box .menu-list li").eq(4).hide();
        // 0: {saleName: "新增病例", rightCode: 1}
        // 1: {saleName: "上传和修改患者资料，照片", rightCode: 2}
        // 2: {saleName: "修改3D方案", rightCode: 3}
        // 3: {saleName: "批准3D方案", rightCode: 4}
        // 4: {saleName: "病例重启", rightCode: 5}
        // 5: {saleName: "后续生产申请", rightCode: 6}
        // 6: {saleName: "附件模板申请", rightCode: 7}
        // 7: {saleName: "备用矫治器申请", rightCode: 8}
        // 8: {saleName: "保持器申请", rightCode: 9}
        /* tbea */
        $(".new-case").addClass("close no-event");
        // $(".case-particulars .compile-btn").css("pointer-events", "none !important");
        $("#patientPicture input").addClass("no-event");
        $("#XlightPage input").addClass("no-event");
        $("#handlePic input").addClass("no-event");
        $("#schemePrecept").addClass("no-event");
        $("#supplementRestart").addClass("no-event");
        $("#subsequentProduction .content-btn").addClass("no-event no-btn");
        $("#adjunct .content-btn").addClass("no-event no-btn");
        $("#maintenanceStart .content-btn").addClass("no-event no-btn");
        $("#maintainStartBd .content-btn").addClass("no-event no-btn");
        /* 获取员工权限 */
        app.getStaffLimint(function (data) {
            data.forEach(item => {
                switch (item.rightCode) {
                    case 1:
                        $(".new-case").removeClass("close no-event");
                        break;
                    case 2:
                        $("#patientPicture input").removeClass("no-event");
                        $("#XlightPage input").removeClass("no-event");
                        $("#handlePic input").removeClass("no-event");
                        // $(".case-particulars .compile-btn").css("pointer-events", "auto !important");
                        window.editBaseInfo = true;
                        break;
                    case 3:
                        $("#schemePrecept").removeClass("no-event");
                        break;
                    case 4:
                        $("#schemePrecept").removeClass("no-event");
                        break;
                    case 5:
                        $("#supplementRestart").removeClass("no-event");
                        break;
                    case 6:
                        $("#subsequentProduction .content-btn").removeClass("no-event no-btn");
                        break;
                    case 7:
                        $("#adjunct .content-btn").removeClass("no-event no-btn");
                        break;
                    case 8:
                        $("#maintenanceStart .content-btn").removeClass("no-event no-btn");
                        break;
                    case 9:
                        $("#maintainStartBd .content-btn").removeClass("no-event no-btn");
                        break;
                    default:
                        break;
                }
            })
        });
    } else {
        window.editBaseInfo = true;
    }
    /* 记录收货地址列表的数组 */
    let shippingAddress = [];

    /* 处理时间戳转为年月日的方法 */
    function timestampToTime (timestamp) {
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '/';

        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';

        let D = date.getDate() + '';

        let h = date.getHours() + ':';

        let m = date.getMinutes() + ':';

        let s = date.getSeconds();

        return Y + M + D; //时分秒可以根据自己的需求加上

    }
    /* 病例列表tab切换 */
    app.tab({
        top: ".case-tab-box",
        bottom: ".case-message",
        active: "active",
        callback: function () {
            isFiltra = false;
        },
    })
    /* 病例详情tab切换 */
    app.tab({
        top: ".supplement-tab-top",
        bottom: ".supplement-tab-bottom",
        active: "active",
        callback: function () { },
    });



    /* 设置病例信息模块的高度 */
    let caseMsg = document.querySelector(".case-message");
    let nav = document.querySelector(".nav");
    let searchBox = document.querySelector(".search-box");
    caseMsg.style.height = document.documentElement.clientHeight - nav.clientHeight - searchBox.clientHeight + "px";
    /*除了这个建议在 css 里面加媒体查询*/
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {
        //shu
        if (window.orientation === 180 || window.orientation === 0) {

            setTimeout(() => {
                caseMsg.style.height = document.documentElement.clientHeight - nav.clientHeight - searchBox.clientHeight + "px";
                console.log("shu", document.documentElement.clientHeight, nav.clientHeight, searchBox.clientHeight);
            }, 200);

        }
        //heng
        if (window.orientation === 90 || window.orientation === -90) {

            setTimeout(() => {
                caseMsg.style.height = ocument.documentElement.clientHeight - nav.clientHeight - searchBox.clientHeight + "px";
                console.log("heng", document.documentElement.clientHeight, nav.clientHeight, searchBox.clientHeight);
            }, 200);
        }
    }, false);

    /* /设置病例信息模块的高度 */
    /* 获取搜索框 */
    let searchText = document.querySelector(".search-text");
    /* 获取文字盒子 */
    // let hint = document.querySelector(".hint-box");
    /* 通过form表单的submit事件 监测到回车按钮点击 */
    var oForm = document.getElementsByTagName("form")[0];
    oForm.onsubmit = function () {
        if (listTotal <= 0) {
            //提示
            $(".search-text").val("");
            layer.open({
                content: "您搜索的内容不存在",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return false;
        }
        $.ajax({
            type: "POST",
            async: false,
            url: app.apiUrl + "/caseInfo/getCaseAll?t=" + app.random,
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                type: listType,
                pageNum: 0,
                pageSize: listTotal,
                patientName: searchText.value.trim(),
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                if (res.code == 200) {
                    let listData = JSON.parse(res.data);
                    listDataArr = listData.rows;
                    let listliArr = [];
                    console.log(listData)
                    listData.rows.forEach(item => {
                        let imgSrc = "img/xin.png";
                        if (item.follow) {
                            imgSrc = "img/star.png"
                        } else {
                            imgSrc = "img/xin.png";
                        }


                        // if (item.outerNo && item.outerNo.includes(searchText.value.trim()) || (item.patientName && item.patientName.includes(searchText.value.trim()))) {
                        // if ((item.patientName && item.patientName.includes(searchText.value.trim()))) {
                        let listli = `
                                <li id=${item.caseId} doctorId=${item.doctorId}>
                                    <div class="case-header">
                                        <img src="${item.headUrl && item.headUrl.startsWith("http") ? item.headUrl : "img/default-header.png"}">
                                    </div>
                                    <div class="particular">
                                        <div class="particular-msg">
                                            <p><span>${item.patientName}</span><em class="serial"></em></p>
                                            <em>${timestampToTime(parseInt(item.createTime))}</em>
                                            <p><img src="img/state.png"><span>${item.statusTypeName ? item.statusTypeName : ""}</span></p>
                                            <p class="remark"><span>备注:</span><em>${item.remark}</em></p>
                                        </div>
                                        <div class="attention" data-statu="${item.follow}">
                                            <img src=${imgSrc}>
                                        </div>
                                    </div>
                                </li>`
                        listliArr.push(listli);
                        // }
                    })

                    if (listliArr.length == 0) {
                        //提示
                        $(".search-text").val("");

                        layer.open({
                            content: "您搜索的内容不存在",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                        return false;
                    } else {
                        $(".case-tab-box .active span").text(listliArr.length);
                    }
                    $(".case-message ul").html(listliArr.join(""));
                    /* 搜索清空下拉内容 */
                    $(".update").html('');
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
        return false;
    };

    // /* 给搜索框注册聚焦事件 文字盒子隐藏 */
    // searchText.onfocus = function () {
    //     hint.style.display = "none";
    // }
    /* 给搜索框注册失焦事件 判断是否为空  文字盒子出现 */
    // hint.onclick = function () {
    //     if (searchText.value.trim() == "") {
    //         // hint.style.display = "block";
    //         applyList();
    //         return false;
    //     }
    //     $.ajax({
    //         type: "POST",
    //         async: false,
    //         url: app.apiUrl + "/caseInfo/getCaseAll",
    //         contentType: "application/json;charset=UTF-8",
    //         data: JSON.stringify({
    //             type: listType,
    //             pageNum: 0,
    //             pageSize: listTotal,
    //         }),
    //         beforeSend: function (xhr) {
    //             xhr.setRequestHeader("Authorization", token);
    //         },
    //         /* 成功的回调 */
    //         success: function (res) {
    //             if (res.code == 200) {
    //                 let listData = JSON.parse(res.data);
    //                 listDataArr = listData.rows;
    //                 let listliArr = [];
    //                 console.log(listData)
    //                 listData.rows.forEach(item => {
    //                     let imgSrc = "img/xin.png";
    //                     if (item.follow) {
    //                         imgSrc = "img/star.png"
    //                     } else {
    //                         imgSrc = "img/xin.png";
    //                     }

    //                     if (item.outerNo.includes(searchText.value.trim()) || (item.patientName && item.patientName.includes(searchText.value.trim()))) {
    //                         let listli = `
    //                         <li id=${item.caseId} doctorId=${item.doctorId}>
    //                             <div class="case-header">
    //                                 <img src="${item.headUrl && item.headUrl.startsWith("http") ? item.headUrl : "img/default-header.png"}">
    //                             </div>
    //                             <div class="particular">
    //                                 <div class="particular-msg">
    //                                     <p><span>${item.patientName}</span><em class="serial">${item.outerNo}</em></p>
    //                                     <em>${timestampToTime(parseInt(item.createTime))}</em>
    //                                     <p><img src="img/state.png"><span>${item.statusTypeName ? item.statusTypeName : ""}</span></p>
    //                                     <p class="remark"><span>备注:</span><em>${item.remark}</em></p>
    //                                 </div>
    //                                 <div class="attention" data-statu="${item.follow}">
    //                                     <img src=${imgSrc}>
    //                                 </div>
    //                             </div>
    //                         </li>`
    //                         listliArr.push(listli);
    //                     }
    //                 })

    //                 if (listliArr.length == 0) {
    //                     //提示
    //                     $(".search-text").val("");
    //                     hint.style.display = "block";
    //                     layer.open({
    //                         content: "您搜索的内容不存在",
    //                         skin: 'msg',
    //                         time: 2 //2秒后自动关闭
    //                     });
    //                     return false;
    //                 } else {
    //                     $(".case-tab-box .active span").text(listliArr.length);
    //                 }
    //                 $(".case-message ul").html(listliArr.join(""));
    //                 /* 搜索清空下拉内容 */
    //                 $(".update").html('');
    //             } else {
    //                 //提示
    //                 layer.open({
    //                     content: res.msg,
    //                     skin: 'msg',
    //                     time: 2 //2秒后自动关闭
    //                 });
    //             }
    //         },
    //         //请求失败，包含具体的错误信息
    //         error: function (e) {
    //             //提示
    //             layer.open({
    //                 content: e.responseJSON.message,
    //                 skin: 'msg',
    //                 time: 2 //2秒后自动关闭
    //             });
    //         }
    //     })

    // }

    /* 病例详情 开始 */
    /* 给每个病例模块注册点击事件 点击病例详情淡入 病例管理淡出 */
    // 声明变量来记录点击该病例的id 姓名性别 医院id等
    let presentCaseId, datumName, datumSex, datumHosId, datumHosName, datumSiteId, datumDate, caseInfoId, presentStageName, presentStageCount, listthat, consigneeTel;
    $(".case-message").on("click", "li", function () {
        listthat = this;
        presentCaseId = this.id;
        $.ajax({
            async: false,
            type: "POST",
            url: app.apiUrl + "/caseInfo/getCaseInfo?t=" + app.random,
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                caseId: presentCaseId,
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                let sexImg = "";
                let brandImg = "";
                if (res.code == 200) {
                    let particularsDatabase = JSON.parse(res.data);
                    // console.log(particularsDatabase)
                    datumName = particularsDatabase.patientName;
                    datumSex = particularsDatabase.sex;
                    datumHosId = particularsDatabase.hospitalId;
                    datumSiteId = particularsDatabase.deliveryAddressId;
                    datumHosName = particularsDatabase.hospitalName;
                    // datumDate = timestampToTime(parseInt(particularsDatabase.createTime));
                    presentStageName = particularsDatabase.stageName;
                    presentStageCount = particularsDatabase.stageCount;
                    caseInfoId = particularsDatabase.caseId;
                    let caseType = calculator(particularsDatabase.caseType);
                    console.log(caseType)
                    // caseType.reverse();
                    let caseTypeSrc = "";
                    caseType.reverse().forEach(item => {

                        caseTypeSrc += textArr[item] + ",";
                    })
                    caseTypeSrc = caseTypeSrc.substr(0, caseTypeSrc.length - 1);
                    if (particularsDatabase.sex == 1) {
                        sexImg = `<img src="img/sexn.png" class="img1">`;
                    } else {
                        sexImg = `<img src="img/sex.png">`;
                    }
                    let followFlag;
                    if ($(listthat).find(".attention").children("img").attr("src") == "img/star.png") {
                        followFlag = "true";
                    } else {
                        followFlag = "false";
                    }
                    if (particularsDatabase.caseBrand == "正丽科技自主创立品牌") {
                        brandImg = "img/MA.png";
                    } else {
                        brandImg = "img/SM.png";
                    }
                    let particularsData = `
                            <div class="specific-top">
                                                                                                                                                                                                                                                                                                                                                                                        <div class="definite">
                                                                                                                                                                                                                                                                                                                                                                                            <div class="specific-header">
                                                                                                                                                                                                                                                                                                                                                                                                <img src="${particularsDatabase.headUrl && particularsDatabase.headUrl.startsWith("http") ? particularsDatabase.headUrl : "img/default-header.png"}" >
                                    </div>

                                                                                                                                                                                                                                                                                                                                                                                            <div class="specific-number">
                                                                                                                                                                                                                                                                                                                                                                                                <p>
                                                                                                                                                                                                                                                                                                                                                                                                    <span class="specific-name">${particularsDatabase.patientName}</span>
                                                                                                                                                                                                                                                                                                                                                                                                    <span class="case-attention" data-statu="${followFlag}"><img src=${$(listthat).find(".attention").children("img").attr("src")}></span>
                                        </p>
                                                                                                                                                                                                                                                                                                                                                                                                    <p>
                                                                                                                                                                                                                                                                                                                                                                                                        <span class="sex-box">
                                                                                                                                                                                                                                                                                                                                                                                                            ${sexImg}
                                                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                                                                        <span class="age-box">
                                                                                                                                                                                                                                                                                                                                                                                                            ${particularsDatabase.age}岁
                                            </span>
                                                                                                                                                                                                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                                                                                                                                                                                                    <p>
                                                                                                                                                                                                                                                                                                                                                                                                        <span class="meaning">
                                                                                                                                                                                                                                                                                                                                                                                                        
                                            </span>
                                                                                                                                                                                                                                                                                                                                                                                                        <span class="sequence">
                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                                                                    </p>
                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                            <div class="unfold">
                                                                                                                                                                                                                                                                                                                                                                                                <img src="img/management-jt-x.png">
                                </div>
                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                            <!-- 展开部分 -->
                            <div class="spread">
                                                                                                                                                                                                                                                                                                                                                                                                <!-- 地址及备注 -->
                                <div class="site">
                                                                                                                                                                                                                                                                                                                                                                                                    <p>
                                                                                                                                                                                                                                                                                                                                                                                                        <span>诊所</span>:
                                        <span>${particularsDatabase.hospitalName}</span>
                                                                                                                                                                                                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                                                                                                                                                                                                    <p>
                                                                                                                                                                                                                                                                                                                                                                                                        <span>备注</span>:
                                        <span class="comment">${particularsDatabase.remark}</span>

                                                                                                                                                                                                                                                                                                                                                                                                        <span class="staff-hide compile">
                                                                                                                                                                                                                                                                                                                                                                                                            <img src="img/compile.png">
                                        </span>
                                    </p>
                                                                                                                                                                                                                                                                                                                                                                                                        <em class="change">确认</em>
                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                    <!-- /地址及备注 -->
                                <!-- 品牌、类别及到期日 -->
                                <div class="due">
                                                                                                                                                                                                                                                                                                                                                                                                        <p class="parting">

                                                                                                                                                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                                                                                                                                                                        <div class="due-box">
                                                                                                                                                                                                                                                                                                                                                                                                            <p>
                                                                                                                                                                                                                                                                                                                                                                                                                <span>品牌</span>:
                                            <span>
                                                                                                                                                                                                                                                                                                                                                                                                                    <img src="${brandImg}">
                                            </span>
                                        </p>
                                                                                                                                                                                                                                                                                                                                                                                                                <p>
                                                                                                                                                                                                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                                                                                                                                <p>
                                                                                                                                                                                                                                                                                                                                                                                                                    <span>临床分类</span>:
                                            <span class="classification">${caseTypeSrc}</span>
                                                                                                                                                                                                                                                                                                                                                                                                                </p>
                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                        <!-- /品牌、类别及到期日 -->
                                <!-- 编辑资料按钮 -->
                                <div class="${window.editBaseInfo ? "compile-btn" : "compile-btn no-event"}">
                                                                                                                                                                                                                                                                                                                                                                                                            <img src="img/compileicon.png">
                                                                                                                                                                                                                                                                                                                                                                                                                编辑资料
                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                            <!-- /编辑资料按钮 -->
                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                        <!-- /展开部分 -->
                    `
                    $(".specific").html(particularsData);
                    /* 病例重启设置 id */
                    $("#supplementRestart").attr("data-id", particularsDatabase.caseId);
                    $(".case-management").hide();
                    $(".case-particulars").show();
                    $(".spread .change").hide();
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
        $.ajax({
            type: "POST",
            url: app.apiUrl + "/caseInfo/caseProcess?t=" + app.random,
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                caseId: listthat.id
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                if (res.code == 200) {
                    let courseData = JSON.parse(res.data);
                    let cousresImg = "img/face.png";
                    let courseArr = [];
                    let courseDataParticulars;
                    console.log(courseData);
                    let firstCousres = '';
                    courseData.forEach((item, index) => {
                        if (index == 0) {
                            cousresImg = "img/await.png";
                        } else {
                            cousresImg = "img/face.png";
                        }
                        // console.log(courseData)
                        if (index == 0) {
                            firstCousres = `<img src="${cousresImg}" class="await">
                            <div class="production-bd">
                                <div class="production-text">
                                    <h5>${item.processName}</h5>
                                    <p>${item.startTime && timestampToTime(item.startTime)}</p>
                                </div>
                            </div>`;
                            if ("takeNo" in item) {
                                consigneeTel = item.phone;
                                firstCousres = `<img src="${cousresImg}" class="await">
                                <div class="production-bd">
                                    <div class="production-text">
                                        <h5>${item.processName}</h5>
                                        <p>${item.startTime && timestampToTime(item.startTime)}</p>
                                    </div>
                                    <button class="production-btn" data-receiver="${item.receiver}"  data-takeNo="${item.takeNo}" data-tel="${consigneeTel}">查看</button>
                                </div>`;
                            } else if (item.status == 24) {
                                firstCousres = (`<img src="${cousresImg}" class="await">
                                        <div class="production-bd">
                                            <div class="production-text">
                                                <h5 class="zz">${item.processName}</h5>
                                                <p>${item.startTime && timestampToTime(item.startTime)}</p>
                                            </div>
                                            <button class="${item.planFlag ? "production-btn1" : "production-btn1 gray"}"><a href="javaScript:;"></a>Web OrthoPlus</button>
                                        </div>`);
                            } else if (item.status == 25) {
                                firstCousres = (`<img src="${cousresImg}" class="await">
                                        <div class="production-bd">
                                            <div class="production-text">
                                                <h5 class="zz">${item.processName}</h5>
                                                <p>${item.startTime && timestampToTime(item.startTime)}</p>
                                            </div>
                                            <button class="${item.planFlag ? "production-btn1" : "production-btn1 gray"}"><a href="javaScript:;"></a>Web OrthoPlus</button>
                                        </div>`);
                            } else if (item.type == 6 && item.status != 26) {
                                firstCousres = (`<img src="${cousresImg}" class="await">
                                        <div class="production-bd">
                                            <div class="production-text">
                                                <h5 class="zz">${item.processName}</h5>
                                                <p>${item.startTime && timestampToTime(item.startTime)}</p>
                                            </div>
                                            <button class="${item.planFlag ? "production-btn1" : "production-btn1 gray"}"><a href="javaScript:;"></a>Web OrthoPlus</button>
                                        </div>`);
                            }

                            $(".course .production").html(firstCousres);
                        } else {
                            if ("takeNo" in item) {
                                consigneeTel = item.phone;
                                courseArr.push(
                                    `<li>
                                        <img src="${cousresImg}" class="await">
                                        <div class="production-bd">
                                            <div class="production-text">
                                                <h5 class="zz">${item.processName}</h5>
                                                <p>${item.startTime && timestampToTime(item.startTime)}</p>
                                            </div><button class="production-btn" data-receiver="${item.receiver}"  data-takeNo="${item.takeNo}" data-tel="${consigneeTel}">查看</button>
                                        </div>
                                    </li>
                                    `);
                            } else if (item.status == 24) {
                                courseArr.push(
                                    `<li>
                                    <img src="${cousresImg}" class="await">
                                        <div class="production-bd">
                                            <div class="production-text">
                                                <h5 class="zz">${item.processName}</h5>
                                                <p>${item.startTime && timestampToTime(item.startTime)}</p>
                                            </div>
                                            <button class="${item.planFlag ? "production-btn1" : "production-btn1 gray"}"><a href="javaScript:;"></a>Web OrthoPlus</button>
                                        </div>
                                    </li>
                                    `);
                            } else if (item.status == 25) {
                                courseArr.push(
                                    `<li>
                                    <img src="${cousresImg}" class="await">
                                        <div class="production-bd">
                                            <div class="production-text">
                                                <h5 class="zz">${item.processName}</h5>
                                                <p>${item.startTime && timestampToTime(item.startTime)}</p>
                                            </div>
                                            <button class="${item.planFlag ? "production-btn1" : "production-btn1 gray"}"><a href="javaScript:;"></a>Web OrthoPlus</button>
                                        </div>
                                    </li>
                                    `);
                            } else if (item.type == 6 && item.status != 26) {
                                courseArr.push(
                                    `<li>
                                    <img src="${cousresImg}" class="await">
                                        <div class="production-bd">
                                            <div class="production-text">
                                                <h5 class="zz">${item.processName}</h5>
                                                <p>${item.startTime && timestampToTime(item.startTime)}</p>
                                            </div>
                                            <button class="${item.planFlag ? "production-btn1" : "production-btn1 gray"}"><a href="javaScript:;"></a>Web OrthoPlus</button>
                                        </div>
                                    </li>
                                    `);
                            } else {
                                courseArr.push(
                                    `<li>
                                        <img src="${cousresImg}" class="await">
                                        <div class="production-bd">
                                            <div class="production-text">
                                                <h5>${item.processName}</h5>
                                                <p>${item.startTime && timestampToTime(item.startTime)}</p>
                                            </div>
                                        </div>
                                    </li>`
                                )
                            }
                        }


                    })
                    $(".spread1").html(courseArr.join(""));

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
    });

    /* 点击病例详情中的星型图标 切换关注状态 开始 */
    $(".case-particulars .specific").on("click", ".case-attention", function () {
        //声明一个变量记录切换图片
        let that = this;
        let followFlag = $(that).attr("data-statu");
        // console.log($(that).attr("data-statu").length)
        // console.log(followFlag)
        let followFlag1 = true;
        if (followFlag == "true") {
            followFlag1 = false;
        } else {
            followFlag1 = true;
        }
        $.ajax({
            type: "POST",
            url: app.apiUrl + "/caseInfo/follow?t=" + app.random,
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                caseId: presentCaseId,
                follow: followFlag1,
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                if (res.code == 200) {
                    if (followFlag == "true") {
                        $(that).children("img").attr("src", "img/xin.png");
                        $(that).attr("data-statu", "false");
                    } else {
                        $(that).children("img").attr("src", "img/star.png");
                        $(that).attr("data-statu", "true");
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

    })
    /* 点击病例详情中的星型图标 切换关注状态 结束 */

    /* 点击病例详情中备注的小图标 改变标签 */
    $(".case-particulars .specific").on("click", ".staff-hide", function () {
        let iptSrc = "" + $(".case-particulars .site p:nth-of-type(2) span:nth-of-type(2)").html();
        let ipt = `<textarea>${iptSrc.replace(/<br>/g, "\r\n")}</textarea>`;
        $(".case-particulars .site p:nth-of-type(2) span:nth-of-type(2)").html(ipt);
        $(this).hide();
        $(".case-particulars .site .change").show();
    })
    $(".case-particulars .site .change").hide();
    /* 点击确认 保存修改的备注 将改变的备注传到服务器*/
    $(".case-particulars .specific ").on("click", ".change", function () {
        let iptVal = $(".case-particulars .site textarea").val().trim().replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
        $(".case-particulars .site p:nth-of-type(2) span:nth-of-type(2)").html(iptVal);
        $(this).hide();
        $(".case-particulars .site .staff-hide").show();
        $.ajax({
            type: "POST",
            url: app.apiUrl + "/caseInfo/modifyRemark",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                caseId: presentCaseId,
                remark: iptVal
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                if (res.code == 200) {


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
    })
    /* 病例详情 结束 */

    /* 新建病例 开始 */
    /* 病例列表隐藏 新建病例显示 */
    $(".new-case").on("click", function () {
        /* 获取未完成的病例 */
        $.ajax({
            /* 请求异步问题 */
            async: false,
            //请求方式
            type: "GET",
            //请求地址
            url: app.apiUrl + "/caseInfo/getCaseNotComplete",
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求成功
            success: function (res) {
                if (res.code == 200) {

                    if (res.data != "您没有未完成病例") {
                        var data = JSON.parse(res.data);
                        console.log(data);
                        $("body").addClass("beyond");
                        //询问框
                        layer.open({
                            content: '上次新建病例未完成，已帮您保存数据，是否从离开时继续？',
                            btn: ['否，新建病例', '是，继续新建'],
                            yes: function (index) {
                                layer.close(index);
                                $("body").removeClass("beyond");
                                location.href = "./newcase.html?new=1";
                                // that.getCancelCase();
                                // that.createCaseBegin();
                            },
                            no: function (index) {
                                layer.close(index);
                                $("body").removeClass("beyond");
                                location.href = "./newcase.html?new=2&data=" + res.data;
                                // that.createCaseAgain(data);
                            }
                        });
                    } else {
                        /* 没有未完成的病例 直接去新建 */
                        // that.createCaseBegin();
                        location.href = "./newcase.html?new=1";
                    }

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

    });
    /* 新建病例结束 */

    /* 重启病例开始 */
    /* 点击重启病例*/
    $("#supplementRestart").on("click", function () {
        // $(".case-particulars").hide();
        // $(".management-box").show();
        /* 删除之前未完成的病例 重新启动 */
        let caseId = $(this).attr("data-id");
        location.href = "./newcase.html?new=3&caseId=" + caseId;
        // that.isBegianCase = true;

        // that.againCaseId = {
        //     caseId: caseId
        // }
        // that.createCaseBegin(caseId);
    });

    /* 筛选选项 开始*/
    /* 给筛选按钮注册点击事件 筛选区域淡入 选项区域做动画*/
    $(".filtrate").on("click", function () {
        $(".screen-box").show();
        $(".options-box").css("animation", "fadeInRight .5s forwards");
        $.ajax({
            type: "POST",
            url: app.apiUrl + "/caseInfo/caseBrands",
            contentType: "application/json;charset=UTF-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                if (res.code == 200) {
                    let trademarkData = JSON.parse(res.data);
                    trademarkData.forEach((item, index) => {
                        $(".brand-box li").eq(index).attr("id", JSON.parse(item.id));
                    })

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
    });
    /* 给筛选区域注册点击事件 筛选区域淡出 选项区域做动画*/
    $(".screen-box").on("click", function () {
        $(".options-box").css("animation", "fadeOutRight .5s forwards");
        $(".screen-box").hide();
    })

    /* 给所有的按钮添加点击事件  通过排他思想添加样式 */
    $(".options-box li").on("click", function (e) {
        $(this).parent().children().removeClass("active");
        $(this).addClass("active");
        e.stopPropagation();
    });
    /* 点击重置按钮 清空选中样式 */
    $(".replacement").on("click", function () {
        $(".options-box li").removeClass("active");
        $("#beginDate").val("");
        $("#finishDate").val("");
        $(this).addClass("active");
    })
    /* 点击确认按钮 返回病例管理 重新渲染病例数据*/
    let isFiltra = false;
    $(".affirm").on("click", function () {
        let sexIndex = $(".sex-box .active").index() + 1 || 0;
        let stageIndex = $(".stage-box .active").index();
        let brandIndex = parseInt($(".brand-box .active").attr("id")) || 0;
        let beginDateVal = $("#beginDate").val();
        let finishDateVal = $("#finishDate").val();
        beginDateVal = beginDateVal.replace("年", "/");
        beginDateVal = beginDateVal.replace("月", "/");
        beginDateVal = beginDateVal.slice(0, beginDateVal.length - 2);
        finishDateVal = finishDateVal.replace("年", "/");
        finishDateVal = finishDateVal.replace("月", "/");
        finishDateVal = finishDateVal.slice(0, finishDateVal.length - 2);
        let startTime = new Date(beginDateVal).getTime();
        let endTime = new Date(finishDateVal + " 23:59:59").getTime();

        if (startTime > endTime) {
            layer.open({
                content: "请选择正确的时间",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return false;
        }
        $.ajax({

            type: "POST",
            url: app.apiUrl + "/caseInfo/screen",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                type: listType,
                sex: sexIndex,
                brand: brandIndex,
                status: [stageIndex],
                startTime: startTime,
                endTime: endTime,
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },

            /* 成功的回调 */
            success: function (res) {
                if (res.code == 200) {
                    console.log(res)
                    let data = JSON.parse(res.data);
                    if (data.length == 0) {
                        //提示
                        layer.open({
                            content: "暂无符合条件的病例",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    } else {
                        isFiltra = true;
                        $(".update").html('暂无数据');
                    }
                    let srceen = [];
                    data.forEach(item => {
                        let imgSrc = "img/xin.png";
                        if (item.follow) {
                            imgSrc = "img/star.png"
                        } else {
                            imgSrc = "img/xin.png";
                        }
                        let stateImg;
                        if (item.statusType == 2) {
                            stateImg = `<img src="img/gather.png">`
                        } else if (item.statusType == 3) {
                            stateImg = `<img src="img/quality.png">`
                        } else if (item.statusType == 4) {
                            stateImg = `<img src="img/communication.png">`
                        } else if (item.statusType == 5) {
                            stateImg = `<img src="img/state.png">`
                        } else if (item.statusType == 6) {
                            stateImg = `<img src="img/affirm.png">`
                        } else if (item.statusType == 7) {
                            stateImg = `<img src="img/face.png">`
                        } else if (item.statusType == 8) {
                            stateImg = `<img src="img/production.png">`
                        } else if (item.statusType == 9) {
                            stateImg = `<img src="img/shipments.png">`
                        } else if (item.statusType == 10) {
                            stateImg = `<img src="img/sign.png">`
                        } else if (item.statusType == 11) {
                            stateImg = `<img src="img/finish.png">`
                        }
                        srceen.push(`
                        <li id=${item.caseId} doctorId=${item.doctorId}>
                            <div class="case-header">
                                <img src="${item.headUrl && item.headUrl.startsWith("http") ? item.headUrl : "img/default-header.png"}">
                            </div>
                            <div class="particular">
                                <div class="particular-msg">
                                    <p><span>${item.patientName}</span><em class="serial"></em></p>
                                    <em>${timestampToTime(parseInt(item.createTime))}</em>
                                    <p>${stateImg ? stateImg : ""}<span>${item.statusTypeName ? item.statusTypeName : ""}</span></p>
                                    <p class="remark"><span>备注:</span><em>${item.remark}</em></p>
                                </div>
                                <div class="attention" data-statu="${item.follow}">
                                    <img src=${imgSrc}>
                                </div>
                            </div>
                        </li>`);
                    })
                    $(".case-tab-box li").eq(listType - 1).children("span").text(data.length);
                    $(".case-message ul").eq(listType - 1).html(srceen.join(""));
                    $(".options-box").css("animation", "fadeOutRight .5s forwards");
                    $(".screen-box").hide();
                    $(".screen-box .active").removeClass("active");
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
    })
    /* 筛选 结束 */



    /* 点击展开按钮 控制展开内容展开收起 */
    let flag = 0; /* 声明一个变量来切换图片 */
    $(".specific").on("click", ".unfold", function () {
        $(".spread").slideToggle();
        /* 切换图片 */
        if (flag == 0) {
            $(".unfold img").attr("src", "img/management-jt-s.png");
            flag = 1;
        } else {
            $(".unfold img").attr("src", "img/management-jt-x.png");
            flag = 0;
        }
    })
    /* 点击展开按钮 控制展开内容展开收起 */
    let flag1 = 0; /* 声明一个变量来切换图片 */
    $(".unfold1").on("click", function () {
        $(".spread1").slideToggle();
        /* 切换图片 */
        if (flag1 == 0) {
            $(".unfold1 img").attr("src", "img/management-jt-s.png");
            flag1 = 1;
        } else {
            $(".unfold1 img").attr("src", "img/management-jt-x.png");
            flag1 = 0;
        }
    });

    /* 点击小箭头 选择步数弹层显示 */
    $("#newlyBuildBtn").on("click", function () {
        $("#stepNumber").show();
    })

    /* 返回病例详情页面 */
    $("#subsequentProduction .left-arrow").on("click", function () {
        $(".case-particulars").show();
        $("#subsequentProduction").hide();
    })


    /* 点击保持器按钮  保持器页面显示 */
    $("#supplementMaintain").on("click", function () {
        $("#maintainStart").show();
        $(".case-particulars").hide();
        getAddrList();
        getSupplementMaintainList();
    });
    // presentStageName,presentStageCount
    /*  通过ajax请求动态渲染保质矫治器列表 */
    function getSupplementMaintainList () {
        $.ajax({
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/zhengLiRetainer/zhengLiRetainerRecord",
            //数据，json字符串
            data: JSON.stringify({
                caseInfoId: caseInfoId,
                stageName: presentStageName,
                stageCount: presentStageCount,
            }),
            //请求成功
            success: function (result) {
                if (result.code == 200) {
                    standby = JSON.parse(result.data);
                    // console.log(standby)
                    let liArr = [];
                    if (standby.length > 0) {
                        standby.forEach(item => {
                            if (item.state == 2) {
                                src = "img/toothed-gear.png"
                                productionText = "未批准"
                            } else if (item.state == 3) {
                                productionText = "生产中";
                                src = "img/shipments.png";
                            } else if (item.state == 4) {
                                productionText = "已完成";
                                src = "img/face.png";
                            } else if (item.state == 5) {
                                productionText = "订单取消";
                                src = "img/close.png";
                            } else if (item.state == 0) {
                                src = "img/examine.png"
                                productionText = "审批中"
                            } else if (item.state == 1) {
                                src = "img/state.png"
                                productionText = "已批准"
                            }
                            let li = `<li id=${item.id}>
                                    <span>${timestampToTime(item.time)}</span>
                                    <span>${item.upArchCount + item.downArchCount}副</span>
                                    <div>
                                        <img src=${src}><span>${productionText}</span>
                                    </div>
                                </li>`;
                            liArr.push(li);
                        });
                        $("#maintainStart .appliance-list").html(liArr.join(""));
                    } else {
                        $("#maintainStart .appliance-list").html("<li><span>暂无数据</span></li>");
                    }
                } else {
                    layer.open({
                        content: result.msg,
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
            }

        })
    }
    /* 点击保持器中的申请发货 新建保持器页面显示 */
    $("#maintainStartBd .text-c").on("click", function () {
        $("#maintainStartBd").hide();
        $("#maintainStartCtrl").show();
        startBdLayerData();

        /* 更新新建保持器页面显示 */
        $("#genres .choice-dental-arch li").eq(0).addClass("active").siblings().removeClass("active");
        $("#maintainStartCtrl ul li").eq(0).children("span").eq(1).text("术前保持器");
        $("#dentalArch .choice-dental-arch li").eq(0).addClass("active").siblings().removeClass("active");
        $("#maintainStartCtrl ul li").eq(1).children("#dikaryon").text("双颌");
        $("#maintainStartCtrl ul .list-number input").val("");
        $("#maintainStartCtrl ul .list-number input").attr("disabled", false);
        $("#maintainStartCtrl ul li").eq(5).find(".elect").text("选择需要放置假牙空泡的牙位");
        $("#maintainStartCtrl ul .fixation span").eq(1).text("无");
        checkedJudgment = 1;
        judgment = 1;
        $("#specialLay ul li").removeClass("active");
        $("#maintainStartCtrl .special-tips ol li").eq(0).addClass("active");
        $("#maintainStartCtrl .special-tips ol li").eq(1).removeClass("active");

        $("#lingualSide .retaining-appliance li").eq(0).addClass("active").siblings().removeClass("active");

        /* 保持器中的双颌输入 */
        $("#maintainStartCtrl .list-number").eq(0).show();
        $("#maintainStartCtrl .list-number").eq(1).show();
        $("#dentalArch li").eq(0).addClass("active").siblings().removeClass("active");

        addressExpressageFlag = 5;
        getAddrList();
    });

    function startBdLayerData () {
        /* 渲染设计说明和双颌弹层数据 */
        $.ajax({
            //请求方式
            type: "get",
            //请求地址
            url: app.apiUrl + "/zhengLiRetainer/zhengLiDesign",
            data: {
                "dentalArch": 1,
            },
            async: false,
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    var resData = JSON.parse(res.data);
                    // console.log(resData);
                    var resArrTwo = [];
                    var resArrThree = [];
                    var resArr = [];
                    let topArr = [];
                    let btmArr = [];
                    // window.zhengLiDesigns = resData;
                    resData.forEach(item => {
                        if (item.jaw == 2) {
                            /* 上颌数据 */
                            topArr.push(item);
                        } else {
                            /* 下颌数据 */
                            btmArr.push(item);
                        }
                    });

                    /* 渲染默认第一条数据 */
                    resArr.push(`
                <div class="list-explain-t">
                    <p>${topArr[0].explain}</p>
                    <div class="right-arrow" id="maxillaryBtn">
                        <img src="img/right-arrow.png" alt="">
                    </div>
                </div>
                <div class="list-explain-b">
                    <p>${btmArr[0].explain}</p>
                    <div class="right-arrow" id="mandibleBtn">
                        <img src="img/right-arrow.png" alt="">
                    </div>
                </div>
                `);
                    $("#lisExplainCtrl").html(resArr.join(""))
                    topArr.forEach((value, idx) => {
                        resArrTwo.push(`<li class="${idx == 0 ? 'active' : ''}" data-id =${value.id} data-jaw=${value.jaw}>
                                <div class="picture">
                                    <img src="img/unchecked.png">
                                    <img src="img/face.png" class="dn">
                                </div>
                                <span>${value.explain}</span>
                                ${idx == 2 ? '<div>上颌 <input  type="tel" maxlength="3" disabled="true"  oninput="value=value.replace(/[^\d]/g,"")"></div>' : ''}
                            </li >`);
                    });
                    btmArr.forEach((dom, idx) => {
                        resArrThree.push(`<li class="${idx == 0 ? 'active' : ''}" data-id =${dom.id} data-jaw=${dom.jaw}>
                        <div class="picture">
                            <img src="img/unchecked.png">
                            <img src="img/face.png" class="dn">
                        </div>
                        <span>${dom.explain}</span>
                        ${idx == 2 ? '<div>下颌 <input type="tel" maxlength="3" disabled="true" oninput="value=value.replace(/[^\d]/g,"")"></div>' : ''}
                    </li >`);

                    });
                    $("#employTopLay .design-specification").html(resArrTwo.join(""));
                    $("#employDownLay .design-specification").html(resArrThree.join(""));
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
            }
        });
    }
    /* 点击保持器页面中的列表 保持器发货记录页面显示 */
    $("#maintainStartBd .preoperative").on("click", "li", function () {
        /* 请求保持器详情数据 */
        if ($(this).attr("id")) {

            $.ajax({
                //请求方式
                type: "get",
                //请求地址
                url: app.apiUrl + "/zhengLiRetainer/zhengLiDetails",
                data: {
                    id: this.id
                },
                async: false,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                //请求成功
                success: function (result) {
                    if (result.code == 200) {
                        let data = JSON.parse(result.data)
                        console.log(data);

                        if (data.state == 0) {
                            $("#maintainStartRecords .right-text").text("审批中");
                        } else if (data.state == 1) {
                            $("#maintainStartRecords .right-text").text("已批准");
                        } else if (data.state == 2) {
                            $("#maintainStartRecords .right-text").text("未批准");
                        } else if (data.state == 3) {
                            $("#maintainStartRecords .right-text").text("生产中");
                        } else if (data.state == 4) {
                            $("#maintainStartRecords .right-text").text("已完成");
                        } else if (data.state == 5) {
                            $("#maintainStartRecords .right-text").text("订单取消");
                        }



                        let typeStr = $("#genres .choice-dental-arch li").eq(data.type - 1).text();
                        $("#maintainStartRecords li").eq(0).children("span").eq(1).text(typeStr);

                        let dentalArchStr = $("#dentalArch .choice-dental-arch li").eq(data.dentalArch - 1).text();
                        $("#maintainStartRecords li").eq(1).children("span").eq(1).text(dentalArchStr);

                        if (data.upArchCount) {
                            $("#maintainStartRecords .list-number").eq(0).children("p").text(data.upArchCount);
                        }

                        if (data.downArchCount) {
                            $("#maintainStartRecords .list-number").eq(1).children("p").text(data.downArchCount);
                        }

                        /* 渲染设计说明数据 */
                        let zhengLiDesignsUpArr = [];
                        let zhengLiDesignsDownArr = [];
                        if (data.zhengLiDesigns.length > 0) {
                            data.zhengLiDesigns.forEach(item => {
                                if (item.jaw == 2) {
                                    if (item.id == 3) {
                                        zhengLiDesignsUpArr.push(`<p>${item.explain}
                                        <span>上颌</span><span>${data.upSteps}</span></p>`);
                                    } else {
                                        zhengLiDesignsUpArr.push(`<p>${item.explain}</p>`);
                                    }

                                } else if (item.jaw == 3) {
                                    if (item.id == 7) {
                                        zhengLiDesignsDownArr.push(`<p>${item.explain}
                                        <span>下颌</span><span>${data.downSteps}</span></p>`);
                                    } else {
                                        zhengLiDesignsDownArr.push(`<p>${item.explain}</p>`);
                                    }

                                }
                            });

                            $("#maintainStartRecords .list-explain-t").html(zhengLiDesignsUpArr.join(""));
                            $("#maintainStartRecords .list-explain-b").html(zhengLiDesignsDownArr.join(""));
                        };

                        let zhengLiBridgesStr = [];
                        $(".specialxl .up li").removeClass("active");
                        $(".specialxl .down li").removeClass("active");
                        if (data.zhengLiBridges.length > 0) {
                            data.zhengLiBridges.forEach(item => {
                                let teethIdx = app.teethArr.indexOf(item.teethIndex);
                                if (teethIdx >= 0) {
                                    let x = teethIdx >= $(".specialxl .up li").length ? teethIdx - $(".specialxl .up li").length : teethIdx;
                                    // console.log(x,teethIdx);

                                    if (teethIdx < $(".specialxl .up li").length) {
                                        /* 上排牙齿 */
                                        $(".specialxl .up li").eq(x).addClass("active");

                                    } else {
                                        /* 下排牙齿 */
                                        $(".specialxl .down li").eq(x).addClass("active");

                                    }
                                    zhengLiBridgesStr.push(item.teethIndex);
                                }
                            });

                            zhengLiBridgesStr.sort((x, y) => {
                                return x - y;
                            });

                            $("#maintainStartRecords .specialxl span").eq(1).text(zhengLiBridgesStr.join("、"));

                        }


                        if (data.fixedRetainers.length > 0) {
                            data.fixedRetainers.forEach(item => {
                                $("#maintainStartRecords .fixation span").eq(1).text(item.retainer);
                            })
                        }

                        $("#maintainStartRecords li .site-name").html(data.deliveryName);
                        $("#maintainStartRecords li .site").children("span").eq(1).html(data.contactNumber);
                        $("#maintainStartRecords .address").text(data.address);

                        if (dentalArchStr == "上颌") {
                            $("#maintainStartRecords .list-number").eq(1).hide();
                            $("#maintainStartRecords .list-number").eq(0).show();
                        } else if (dentalArchStr == "下颌") {
                            $("#maintainStartRecords .list-number").eq(0).hide();
                            $("#maintainStartRecords .list-number").eq(1).show();
                        } else if (dentalArchStr == "双颌") {
                            $("#maintainStartRecords .list-number").eq(0).show();
                            $("#maintainStartRecords .list-number").eq(1).show();
                        }

                    } else {
                        layer.open({
                            content: result.msg,
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
            $("#maintainStartBd").hide();
            $("#maintainStartRecords").show();
        }
    })
    /* 点击保持器发货记录页面中的返回按钮 保持器页面显示 */
    $("#maintainStartRecords .left-arrow").on("click", function () {
        $("#maintainStartBd").show();
        $("#maintainStartRecords").hide();
    })
    /* 点击新建保持器中的返回按钮 保持器页面显示 */
    $("#maintainStartCtrl .left-arrow,#maintainStartCtrl .abolish").on("click", function () {
        $("#maintainStartBd").show();
        $("#maintainStartCtrl").hide();
    })
    /* 点击保持器页面中的返回按钮 病例详情显示 */
    $("#maintainStartBd .left-arrow").on("click", function () {
        $("#maintainStart").hide();
        $(".case-particulars").show();

    })
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

    /* 3d方案 开始 */


    /* 控制进度条灰色 1 代表灰色 0代表蓝色 */
    let planArrayObj = {
        up: [
            {
                type: 0
            },
            {
                type: 1
            },
            {
                type: 0
            },
            {
                type: 0
            },
            {
                type: 1
            },
            {
                type: 0
            },
            {
                type: 1
            },
            {
                type: 0
            },
            {
                type: 0
            },
            {
                type: 0
            }
        ],
        down: [
            {
                type: 0
            },
            {
                type: 1
            },
            {
                type: 0
            },
            {
                type: 0
            },
            {
                type: 1
            },
            {
                type: 0
            },
            {
                type: 1
            },
            {
                type: 0
            },
            {
                type: 0
            },
            {
                type: 0
            }]
    };

    // let threeCase = ["方案修改中", "方案待确认", "方案已确认", "方案需修改"];
    let threeCase = ['方案修改中', '方案需修改', '方案待确认', '方案已确认'];
    /* 导航栏信息 开始 */
    let modelNavList = [
        {
            url: "../img/img/WEB-OrthoPlus_25.png",
            str: "上颌"
        }, {
            url: "../img/img/WEB-OrthoPlus_27.png",
            str: "下颌"
        }, {
            url: "../img/img/WEB-OrthoPlus_29.png",
            str: "上颌"
        }, {
            url: "../img/img/WEB-OrthoPlus_31.png",
            str: "下颌"
        }, {
            url: "../img/img/WEB-OrthoPlus_33.png",
            str: "右侧"
        }, {
            url: "../img/img/WEB-OrthoPlus_35.png",
            str: "正面"
        }, {
            url: "../img/img/WEB-OrthoPlus_37.png",
            str: "左侧"
        }, {
            url: "../img/img/1yc.png",
            str: "附件"
        }, {
            url: "../img/img/2lb.png",
            str: "编号"
        }, {
            url: "../img/img/3IPR.png",
            str: "IPR"
        }, {
            url: "../img/img/4sy.png",
            str: "牙弓宽度"
        }
        , {
            url: "../img/img/5bc.png",
            str: "测量"
        }
        , {
            url: "../img/img/6wg.png",
            str: "网格"
        }, {
            url: "../img/img/7qy.png",
            str: "叠加"
        }, {
            url: "../img/img/8zb.png",
            str: "咬合面"
        }, {
            url: "../img/img/WEB-OrthoPlus_19.png",
            str: "移动量"
        }, {
            url: "../img/img/WEB-OrthoPlus_21.png",
            str: "Bolton"
        }, {
            url: "../img/img/WEB-OrthoPlus_23.png",
            str: "偏好"
        }
    ]
    let modelNavListS = "";
    modelNavList.forEach((item, index) => {
        modelNavListS += `
        <li>
            <img src="${item.url}">
            <span>${item.str}</span>
        </li>`;
    })
    document.querySelector(".model3d-nav>ul").innerHTML = modelNavListS;
    /* 点击显示弹层开始 */
    $(".model3d-nav>ul>li").click((e) => {
        $(e.currentTarget).addClass("active").siblings().removeClass("active");
        $(".amount").hide();
        $(".analyse").hide();
        $(".preference").hide();
        if ($(e.currentTarget).index() == 15) {
            $(".amount").show();
        } else if ($(e.currentTarget).index() == 16) {
            $(".analyse").show();
        } else if ($(e.currentTarget).index() == 17) {
            $(".preference").show();
        }
    })
    /* 点击显示弹层结束 */
    /* 点击关闭弹窗开始 */
    $(".model-close").click((e) => {
        $(e.currentTarget).parent().parent().hide();

    })
    $(".amount").on("touchstart", (e) => {
        monolayerMove(e);
    })
    $(".analyse").on("touchstart", (e) => {
        monolayerMove(e);
    })
    $(".preference").on("touchstart", (e) => {
        monolayerMove(e);
    })

    /* 点击关闭弹窗结束 */

    /* 点击返回 */
    $(".model3d-back").click(() => {
        $("#threeDimensional").hide();
        $(".case-particulars").show();
        $(".nav").show();
        $("body").css("overflowY", "auto");
    })

    /* 拖动弹框开始 */
    function monolayerMove (e) {
        console.log(e.currentTarget, e, e.target);
        let el = e.currentTarget;
        let startL = el.offsetLeft;
        let startT = el.offsetTop;
        let startY = e.pageY;
        let startX = e.pageX;
        // document.querySelector(".moveAmount").onmousemove = (e) => {
        el.ontouchmove = (e) => {
            let moveX = e.pageX - startX + startL;
            let moveY = e.pageY - startY + startT;
            if (moveX <= 0) {
                moveX = 0;
            } else if (moveX >= document.querySelector(".model3d-toothBox").clientWidth - el.clientWidth) {
                moveX = document.querySelector(".model3d-toothBox").clientWidth - el.clientWidth;
            }
            if (moveY <= document.querySelector(".model3d-top").clientHeight + document.querySelector(".model3d-nav").clientHeight) {
                moveY = document.querySelector(".model3d-top").clientHeight + document.querySelector(".model3d-nav").clientHeight;
            } else if (moveY >= document.body.clientHeight - document.querySelector(".model3d-step").clientHeight - el.clientHeight) {
                moveY = document.body.clientHeight - document.querySelector(".model3d-step").clientHeight - el.clientHeight;
            }
            /* 判断是否是偏好及Bolton弹层 */
            if (el == document.querySelector(".analyse") || el == document.querySelector(".preference")) {
                el.style.margin = "0";
            }
            el.style.left = moveX + "px";
            el.style.top = moveY + "px";
        };

        // el.ontouchend = () => {
        //     document.querySelector("body").ontouchmove = null;
        // };
    }
    /* 拖动弹框结束 */

    /* 侧边导航栏点击事件 开始 */
    $(".model3d-toothNav li").on("click", (e) => {
        $(".sidenavBox").removeClass("dn").css("animation", "fadeInRight 1s forwards");
        $(".sidenav-bd").children().eq($(e.currentTarget).index()).show();
        $(".sidenav-title ul").children().eq($(e.currentTarget).index()).addClass("active");
        $(".sidenav-bd").children().eq($(e.currentTarget).index()).siblings().hide();
        $(".sidenav-title ul").children().eq($(e.currentTarget).index()).siblings().removeClass("active");
    })
    /* 侧边导航栏点击事件 结束 */

    /* 选择方案 开始 */
    $(".modelchoice .xuanz").on("click", () => {
        $(".modelchoice ul").slideToggle();
    })
    $(".modelchoice ul").on("click", (e) => {
        if (e.target.tagName == "LI" && !e.target.className) {
            $(".modelchoice .xuanz").children("span").text($(e.target).text());
        }
        $(".modelchoice ul").slideUp();
    })
    /* 选择方案 结束 */

    /* 侧边栏导航点击切换 开始 */
    $(".sidenav .sidenav-title li").on("click", (e) => {
        $(e.currentTarget).addClass("active").siblings().removeClass("active");
        $(".sidenav-bd").children().eq($(e.currentTarget).index()).show().siblings().hide();
    })
    /* 侧边栏导航点击切换 结束 */

    /* 点击按钮收起侧边栏 开始 */
    $(".shouq").on("click", () => {
        $(".sidenavBox").css("animation", "fadeOutRight 1s forwards");
    })
    /* 点击按钮收起侧边栏 结束 */

    /* 点击切换移动方式 开始 */
    $(".model3d-tooth ul li").on("click", (e) => {
        $(e.currentTarget).addClass("active").siblings().removeClass("active");
    })
    /* 点击切换移动方式 结束 */

    /* 点击切换照片开始 */
    let mxArr = [
        "img/13.png",
        "img/14.png",
        "img/15.png"
    ]
    let knArr = [
        "img/16.png",
        "img/17.png",
        "img/18.png"
    ]
    let XArr = [
        "img/21.png",
        "img/22.png",
        "img/23.png",
        "img/24.png"
    ]
    var swiper = new Swiper('.swiper-container', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        on: {
            transitionStart: function () {
                judge(this.activeIndex);
            },
        },
    });
    let zhaopArr = [...mxArr, ...knArr, ...XArr];
    let zhaopS = '';
    zhaopArr.forEach((item, index) => {
        zhaopS += `
            <div  class="swiper-slide">
                <img src="${item}">
            </div>
        `
    })
    $(".swiper-wrapper").html(zhaopS);
    function judge (idx) {
        $(".picture-title ul li").removeClass("active");
        if (idx >= 0 && idx < mxArr.length) {
            $(".picture-title ul li").eq(0).addClass("active");
        } else if (idx >= mxArr.length && idx < mxArr.length + knArr.length) {
            $(".picture-title ul li").eq(1).addClass("active");
        } else if (idx >= mxArr.length + knArr.length && idx < zhaopArr.length) {
            $(".picture-title ul li").eq(2).addClass("active");
        }
    }
    $(".picture-title ul li").click((e) => {
        if ($(e.currentTarget).index() === 0) {
            swiper.slideTo(0);
        } else if ($(e.currentTarget).index() === 1) {
            swiper.slideTo(mxArr.length);
        } else if ($(e.currentTarget).index() === 2) {
            swiper.slideTo(mxArr.length + XArr.length - 1);
        }
    })
    /* 点击切换照片结束 */

    /* 导航栏信息 结束 */
    /* 分步信息 开始 */
    let stepMsgList = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53
    ]
    let stepMsgListS = "";
    let stepNum = 0;

    stepMsgList.forEach((item, index) => {
        stepMsgListS += `
            <li data-index="${item}"></li>
        `;
    })
    document.querySelector(".model3d-stepNum").innerHTML = `
    <div>
        <div class="stepBiao">
            <img src="img/img/progress.png">
            <span>${stepNum}</span>
        </div>
        <div>
            <ul>
                ${stepMsgListS}
            </ul>
            <div class="stepNumBox">
                ${stepNum}/${stepMsgList.length}
            </div>
        </div>
        <div>
            <ul>
                ${stepMsgListS}
            </ul>
            <div class="stepNumBox">
                0/${stepMsgList.length}
            </div>
        </div>
    </div>
    `;
    /* 改变当前步数 开始 */
    $(".model3d-step-start div").on("click", (e) => {
        stepNumChange($(e.currentTarget).index());
    })
    /* 改变当前步数 结束 */
    /* 根据改变的步数修改当前页面显示 开始 */
    function stepNumChange (idx) {
        if (idx === 0) {
            stepNum = 0;
        } else if (idx === 1 && stepNum != 0) {
            stepNum--;
        } else if (idx === 3 && stepNum < stepMsgList.length) {
            stepNum++;
        } else if (idx === 4) {
            stepNum = stepMsgList.length;
        } else if (idx === 2) {
            // 功能未定
        }

        [...$(".model3d-stepNum>div>div:nth-of-type(2) li")].filter((item, index) => {
            return index < stepNum;
        }).forEach((item, index) => {
            $(item).addClass("active");
            $(".model3d-stepNum>div>div:nth-of-type(3) li").eq(index).addClass("active");
        });

        [...$(".model3d-stepNum>div>div:nth-of-type(2) li")].filter((item, index) => {
            return index >= stepNum;
        }).forEach((item, index) => {
            $(item).removeClass("active");
            $(".model3d-stepNum>div>div:nth-of-type(3) li").eq(stepMsgList.length - 1 - index).removeClass("active");
        })

        if (stepNum < stepMsgList.length) {
            $(".stepBiao").css("left", $(".model3d-stepNum>div>div:nth-of-type(2) li").eq(stepNum).position().left - 9 + "px");
        } else {
            $(".stepBiao").css("left", $(".model3d-stepNum>div>div:nth-of-type(2) li").eq(stepNum - 1).position().left + $(".model3d-stepNum>div>div:nth-of-type(2) li").eq(0).width() - 9 + "px");
        }
        $(".stepBiao span").text(stepNum);
        $(".model3d-stepNum .stepNumBox").text(`${stepNum} / ${stepMsgList.length}`)
    }
    /* 根据改变的步数修改当前页面显示 结束 */
    /* 分步信息 结束 */



    /* 记录3d路径 */
    let threeUrl = null;
    /* 单双颌  双颌 */
    let doubleFlag = true;
    /* 记录上颌还是下颌  默认上颌 */
    let upFlag = true;
    /* 点击3D方案按钮 3D方案页面显示 */
    $("#schemePrecept").on("click", function () {
        //zxl修改 暂时注释开始

        // $.ajax({
        //     //请求方式
        //     type: "get",
        //     //请求地址
        //     url: app.apiUrl + "/caseInfo/plans",
        //     //数据，json字符串
        //     data: {
        //         caseId: presentCaseId,
        //     },
        //     beforeSend: function (xhr) {
        //         //不携带这个会报错
        //         xhr.setRequestHeader("Authorization", token);
        //     },
        //     //请求成功
        //     success: function (res) {
        //         if (res.code == 200) {
        //             if (!res.data) {
        //                 layer.open({
        //                     content: "暂无数据",
        //                     skin: "msg",
        //                     time: 2 //2秒自动关闭
        //                 });
        //                 return false;
        //             };
        // $("#threeDimensional").show();
        // $(".case-particulars").hide();

        //             threeInitDom();
        //             let data = JSON.parse(res.data);
        //             $(".base-tips span").eq(0).text(threeCase[data[0].status]);
        //             threeUrl = data[0].url;
        //             /* 渲染方案列表 */
        //             let caseArr = [];
        //             data.forEach((item, idx) => {
        //                 caseArr.push(`<li data-url="${item.url}" class="${idx == 0 ? "active" : ""}">${item.planNo}.${threeCase[item.status]}</li>`);
        //             });

        //             $(".threed").html(caseArr.join(""));
        //         } else {
        //             layer.open({
        //                 content: res.msg,
        //                 skin: "msg",
        //                 time: 2 //2秒自动关闭
        //             })
        //         }
        //     },
        //     //请求失败，包含具体的错误信息
        //     error: function (e) {
        //         layer.open({
        //             content: e.responseJSON.message,
        //             skin: "msg",
        //             time: 2 //2秒自动关闭
        //         })

        //     }
        // });


        $("#threeDimensional").show();
        $(".case-particulars").hide();
        $(".nav").hide();
        $("body").css("overflowX", "auto");
        //zxl修改结束

    });

    /* 渲染3d方案的dom */
    function threeInitDom (curIndex) {
        let strUpArr = [];
        let strDownArr = [];
        let strNumArr = [];

        let upIsDownArr = upFlag ? planArrayObj.up : planArrayObj.down;
        /* 上部横条 */
        upIsDownArr.forEach((item, idx) => {
            strUpArr.push(`<li data-type="${item.type}" class="${idx == 0 ? "init" : ""}">
                        <div>
                            <img src="img/line-pre.png" class="line-pre">
                            <span>${idx != 0 ? idx + 1 : 0}</span>
                        </div>
                    </li>`);
            /* 数字记录 */
            if (idx == 0) {
                strNumArr.push(`<li>0</li>`);
            } else {
                strNumArr.push(`<li>${(idx + 1) % 5 == 0 ? idx + 1 : ""}</li>`);
            }
        });


        /* 下部横条 */
        let downStr = '';
        if (doubleFlag) {
            /* 双颌 */
            planArrayObj.down.forEach((item, dix) => {
                strDownArr.push(`<li data-type="${item.type}"></li>`);
            });
            downStr = `<div class="base-line-top down">
                <ul>${strDownArr.join("")}</ul>
                <div class="b-l-num"><span>0</span>/<span>${strDownArr.length}</span></div>
            </div>`;
        }


        let upStr = `<div class="${upFlag ? "base-line-top top-event" : "base-line-top top-event down"}">
                        <ul>${strUpArr.join("")}</ul>
                        <div class="b-l-num"><span>0</span>/<span>${strUpArr.length}</span></div>
                    </div>`;
        /* 数字序号 */
        let numStr = `<div class="base-line-btm">
                        <ul>${strNumArr.join("")}</ul>
                    </div>`;

        $(".base-btm-line").html(upStr + downStr + numStr);



        // if(doubleFlag){
        //     let bottomwidth = 0.85 / (planArrayObj.down.length) * 100;
        //     $(".base-btm-line .base-line-top li").css("width", bottomwidth + "%");
        // }

        let topwidth = 0.85 / (planArrayObj.up.length) * 100;
        $(".base-btm-line ul li").css("width", topwidth + "%");


    }

    /* 点击3D方案中的返回按钮 3D方案页面隐藏 病例详情页面显示 */
    $("#threeDimensional .back").on("click", function () {
        $("#threeDimensional").hide();
        $(".case-particulars").show();
    });
    /* 3d方案 tab 切换 */
    let sigleFlag = null;
    $("#threeDimensional .scheme-top li").on("click", function () {
        sigleFlag = $("#threeDimensional .scheme-top .active").index();
        $(this).addClass("active").siblings().removeClass("active");
        $(".base-3d img").attr("src", "img/plan-3d.png");
        let idx = $(this).index();
        if (idx == 0 || idx == 2 || idx == 3 || idx == 4) {
            doubleFlag = true;
            upFlag = true;


        } else {
            doubleFlag = false;
        }

        if (idx == 1 && sigleFlag == 1) {
            upFlag = !upFlag;
        } else {
            upFlag = true;
        }


        if (idx == 5) upFlag = false;
        if (idx == 6) upFlag = true;
        threeInitDom();

    });
    /* 3d 方案切换 */
    $("#threeDimensional .base-tips").on("click", function () {
        $("#threeDimensionalLayer").show();
    });
    /* 3d 方案切换 */
    $("#threeDimensionalLayer").on("click", function () {
        $("#threeDimensionalLayer").hide();
    });
    /* 点击方案列表切换 可获取当前的 3d url */
    $("#threeDimensionalLayer").on("click", "li", function () {
        $(this).addClass("active").siblings().removeClass("active");
        let caseText = $(this).text().substr($(this).text().indexOf(".") + 1);
        $(".base-tips p span").eq(0).text(caseText);
        /* 获取记录 3d 路径 */
        threeUrl = $(this).attr("data-url");
        console.log(threeUrl);
    });

    /* 3d方案 点击下方进度条切换 */
    $(".base-btm-line").on("click", ".base-line-top>ul>li", function (e) {


        // if(e.target)
        $(".top-event li").eq(0).removeClass("init");
        $(".top-event li").eq(0).find("span").text(1);
        let idx = $(this).index();
        $(".base-line-top>ul>li").eq(idx).addClass("active").siblings().removeClass("active");
        $(".base-line-top li").removeClass("cur hscur");
        $(".base-line-top .b-l-num span").eq(0).text(idx + 1);
        if (doubleFlag) $(".down .b-l-num span").eq(0).text(idx + 1);
        for (var i = 0; i <= idx; i++) {
            if ($(".base-line-top li").eq(i).attr("data-type") == 0) {
                $(".base-line-top li").eq(i).addClass("cur");
                $(".base-btm-line .down li").eq(i).addClass("cur");
            } else {
                $(".base-line-top li").eq(i).addClass("hscur");
                $(".base-btm-line .down li").eq(i).addClass("hscur");
            }


        }

    });



    /* 点击治疗概况 治疗概况弹层显示 */
    $("#schemeSurvey").on("click", function () {
        //loading带文字
        let index = layer.open({
            type: 2,
            content: '处理中，请稍候',
            shadeClose: false,
        });
        $.ajax({
            //请求方式
            type: "get",
            //请求地址
            url: app.apiUrl + "/caseInfo/getSurvey",
            //数据，json字符串
            data: {
                caseId: presentCaseId,
            },
            //请求成功
            success: function (res) {
                layer.close(index);
                if (res.code == 200) {
                    let data = JSON.parse(res.data);

                    $("#surveyPage .overview-b iframe").attr("src", `${'pdf/web/viewer.html?file=' + app.imgUrl + data.url}`);
                    $("#surveyPage .section-download").hide();
                    $("#surveyPage").show();
                    $("body").addClass("beyond");

                } else {
                    // $("#surveyPage .overview-b iframe").attr("src",                     "pdf/web/viewer.html?file=http://case.magicalign.com:8605/output/MA20112400009/FirstDesign/1/1/PDF/MA20112400009.PDF"
                    // );
                    // "pdf/web/viewer.html?file=http://case.magicalign.com:8605/output/MA20112400009/FirstDesign/1/1/PDF/MA20112400009.PDF"
                    // $("#surveyPage .section-download").hide();
                    // $("#surveyPage").show();
                    // $("body").addClass("beyond");
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })

            }
        });
    });

    // $("#surveyPage .section-download a").on("click", function (e) {
    //     e.preventDefault();
    //     let url = $(this).attr("href");
    //     fetch(url, {
    //         credentials: 'include',
    //     }).then(res => res.blob().then(blob => {
    //         const a = document.createElement('a');
    //         const url = window.URL.createObjectURL(blob);
    //         a.href = url;
    //         a.download = url;
    //         a.click();
    //         window.URL.revokeObjectURL(url);
    //     }));
    // })
    /* 点击治疗概况中的关闭按钮 治疗概况弹层隐藏 */
    $("#closeBtn").on("click", function () {
        $("#surveyPage").hide();
        $("body").removeClass("beyond");
    })
    /* 点击上传患者照片中的关闭按钮  上传患者照片弹层隐藏 */
    // $("#patientPicture .clear").on("click", function () {
    //     $("#patientPicture").hide();
    // })

    /* 点击矫治器生产流程按钮  矫治器生产流程弹层显示 */
    $("#additionFlow").on("click", function () {
        $("#annexationPage").show();
        $("body").addClass("beyond");
        $("#annexationPage .flow").show();
    })
    /* 点击矫治器生产流程中的关闭按钮 矫治器生产流程弹层隐藏 */
    $("#annexationPage .flow .divisible").on("click", function () {
        $("#annexationPage").hide();
        $("body").removeClass("beyond");
        $("#annexationPage .flow").hide();
    });

    /* 印膜查看图片 */
    /* 点击图片 */
    let scanimgFlag = false;
    $(".scan .check").on("click", function () {
        if (scanimgFlag) {
            $(".scan .scanning-plate-img").css({
                "width": "auto",
                "height": "auto",
                "position": "absolute",
                "top": "50%",
                "left": "50%",
                "transform": "translate(-50%,-50%)",
            });
            scanimgFlag = false;
        } else {
            $(".scan .scanning-plate-img").css("width", "100%").css("height", "100%");
            scanimgFlag = true;
        }
        $(this).children("img").toggle();
    });

    /* 点击查看印模按钮 查看印模弹层显示 */
    $("#additionScan").on("click", function () {
        //loading带文字
        layer.open({
            type: 2,
            content: '处理中，请稍候',
            shadeClose: false,
        });
        $.ajax({
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/applianceReplace/getImpression",
            async: true,
            data: JSON.stringify({
                caseInfoId: caseInfoId,
                stageName: presentStageName,
                stageCount: presentStageCount,
            }),
            //请求成功

            success: function (res) {
                if (res.code == 200) {
                    var data = JSON.parse(res.data);
                    // console.log(data);
                    let which = 0;
                    if (data) {
                        $("#annexationPage .scan .scanning-plate-img").attr("src", app.imgUrl + data[which].path);
                        $("#annexationPage .scan .download a").attr("href", app.imgUrl + data[which].path);
                        $("#annexationPage .scan .download a").attr("download", data[which].path);
                        $("#annexationPage .pagingBtn span").text(which + 1 + "/" + data.length);
                        $("#annexationPage .pagingBtnS").on("click", function () {
                            if (which == 0) {
                                return false;
                            }
                            which--;
                            $("#annexationPage .scan .scanning-plate-img").attr("src", app.imgUrl + data[which].path);
                            $("#annexationPage .scan .download a").attr("href", app.imgUrl + data[which].path);
                            $("#annexationPage .scan .download a").attr("download", data[which].path);
                            $("#annexationPage .pagingBtn span").text(which + 1 + "/" + data.length);
                        })
                        $("#annexationPage .pagingBtnX").on("click", function () {
                            if (which == data.length - 1) {
                                return false;
                            }
                            which++;
                            $("#annexationPage .scan .scanning-plate-img").attr("src", app.imgUrl + data[which].path);
                            $("#annexationPage .scan .download a").attr("href", app.imgUrl + data[which].path);
                            $("#annexationPage .scan .download a").attr("download", data[which].path);
                            $("#annexationPage .pagingBtn span").text(which + 1 + "/" + data.length);
                        })
                        $("#annexationPage").show();
                        $("#annexationPage .scan").show();
                        $("body").addClass("beyond");
                    }
                    layer.closeAll();
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })

            }
        });
    });
    /* 点击查看印模中的关闭按钮  查看印模弹层隐藏 */
    $("#annexationPage .scan .divisible").on("click", function () {
        $("#annexationPage").hide();
        $("#annexationPage .scan").hide();
        $("body").removeClass("beyond");
    })


    /* 附件模板 开始 */
    /* 记录新建附件模板中的上颌数量 */
    let dentalNum = 0;
    /* 记录新建附件模板中的下颌数量 */
    let dentalNum1 = 0;
    /* 获取新建附件模板选择牙弓点击的下标 */
    let dentalIndex = 0;
    /* 点击附件模板 病例详情页面隐藏  附件模板页面显示 通过ajax请求动态创建申请列表*/
    let stateText = ""; //记录病例阶段
    let src = ""; //记录图片路径
    let attachmentList = []; //申请列表的数据
    let dentalFlag = "";
    /* 点击tab 附件模板 跳到附件模板信息 */
    $("#supplementAdjunct").on("click", function () {
        $(".case-particulars").hide();
        $("#adjunct").show();
        getAddrList();
        // presentStageName,presentStageCount
        $.ajax({
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/attachmentTemplate/attachmentTemplateRecord",
            async: false,
            data: JSON.stringify({
                caseInfoId: caseInfoId,
                stageName: presentStageName,
                stageCount: presentStageCount,
            }),
            //请求成功

            success: function (result) {
                if (result.code == 200) {
                    attachmentList = JSON.parse(result.data);
                    // console.log(attachmentList)
                    let liArr = [];
                    if (attachmentList.length > 0) {
                        attachmentList.forEach(item => {
                            // console.log(item)
                            if (item.state == 2) {
                                src = "img/toothed-gear.png"
                                stateText = "未批准"
                            } else if (item.state == 3) {
                                stateText = "生产中";
                                src = "img/shipments.png";
                            } else if (item.state == 4) {
                                stateText = "已完成";
                                src = "img/face.png";
                            } else if (item.state == 5) {
                                stateText = "订单取消";
                                src = "img/close.png";
                            } else if (item.state == 0) {
                                src = "img/examine.png"
                                stateText = "审批中"
                            } else if (item.state == 1) {
                                src = "img/state.png"
                                stateText = "已批准"
                            }
                            let li = `<li id=${item.id}>
                                        <span>${timestampToTime(item.time)}</span>
                                        <span>${item.lower + item.upper}副</span>
                                        <div>
                                            <img src=${src} alt=""><span>${stateText}</span>
                                        </div>
                                    </li>`;
                            liArr.push(li);
                        })
                        $("#adjunct .appliance-list").html(liArr.join(""));
                    } else {
                        $("#adjunct .appliance-list").html(`<li><span>暂无数据</span></li>`);
                    }

                } else {
                    layer.open({
                        content: result.msg,
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })

            }
        });
    });

    var strfive = "";
    /* 附件模版和保持器中记录双颌 1 上颌 2 下颌 3 变量 */
    let checkedJudgment = 1;
    let allAddrListId = null;
    /* 点击附件模板中的申请发货 新建附件模板页面显示 通过ajax请求获取到地址列表*/
    $("#adjunct .text-c").on("click", function () {
        $("#newAttachment").show();
        $("#adjunct").hide();
        /* 附件模版里面的申请发货 */
        $("#dentalRelationBtn p").text("双颌");
        checkedJudgment = 1;
        judgment = 1;
        $("#newAttachment .list-number").eq(0).show();
        $("#newAttachment .list-number").eq(1).show();
        $("#dentalArch li").eq(0).addClass("active").siblings().removeClass("active");
        /* 渲染地址列表第一条 */
        $.ajax({
            //请求方式
            type: "get",
            //请求地址
            url: app.apiUrl + "/deliveryAddress/getAddressList?t=" + app.random,
            async: false,
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    shippingAddress = JSON.parse(res.data);
                    // console.log(shippingAddress)
                    // shippingAddress.forEach(item => {})
                    console.log(allAddrList[0]);

                    if (allAddrList[0]) {


                        allAddrListId = allAddrList[0].id;
                        console.log(allAddrListId);
                        editAddrInfo = allAddrList[0];
                    }
                    let site = ` 
                    <div class="site-t">
                                <span class="Sitename">${shippingAddress[0] ? shippingAddress[0].deliveryName : ""}</span>
                                <span class="phone">${shippingAddress[0] ? shippingAddress[0].contactNumber : ""}</span>
                            </div>
                            <div class="site-b">
                                <p>
                                    ${shippingAddress[0] ? shippingAddress[0].city : ""} <span>${shippingAddress[0] ? shippingAddress[0].area : ""}</span>${shippingAddress[0] ? shippingAddress[0].address : ""}
                                </p>
                            </div>`
                    $("#newAttachment .list-site>div:nth-of-type(1)").html(site);
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
            }
        });


        /* 渲染设计说明和双颌弹层数据 */
        $.ajax({
            //请求方式
            type: "get",
            //请求地址
            url: app.apiUrl + "/attachmentTemplate/designExplains",
            async: false,
            data: {
                "dentalArch": 1,
            },
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    var resData = JSON.parse(res.data);
                    // console.log(resData);
                    var resArrTwo = [];
                    var resArrThree = [];
                    var resArr = [];
                    let topArr = [];
                    let btmArr = [];
                    resData.forEach(item => {
                        if (item.jaw == 2) {
                            /* 上颌数据 */
                            topArr.push(item);
                        } else {
                            /* 下颌数据 */
                            btmArr.push(item);
                        }
                    })


                    /* 渲染默认第一条数据 */
                    resArr.push(`
                    <div class="list-explain-t">
                                        <p>${topArr[0].explain}</p>
                                        <div class="right-arrow" id="maxillaryBtn">
                                            <img src="img/right-arrow.png" alt="">
                        </div>
                                        </div>
                                        <div class="list-explain-b">
                                            <p>${btmArr[0].explain}</p>
                                            <div class="right-arrow" id="mandibleBtn">
                                                <img src="img/right-arrow.png" alt="">
                        </div>
                                            </div>
                    `);
                    $("#lisExplain").html(resArr.join(""))
                    topArr.forEach((value, idx) => {
                        resArrTwo.push(`
                                <li class="${idx == 0 ? 'active' : ''}" data-id=${value.id} data-jaw=${value.jaw}>
                                    <div class="picture">
                                        <img src="img/unchecked.png">
                                        <img src="img/face.png" class="dn">
                                    </div>
                                    <span>${value.explain}</span>
                                </li>
                            `);
                    });
                    btmArr.forEach((dom, idx) => {

                        resArrThree.push(`
                        <li class="${idx == 0 ? 'active' : ''}" data-id=${dom.id} data-jaw=${dom.jaw}>
                            <div class="picture">
                                <img src="img/unchecked.png">
                                <img src="img/face.png" class="dn">
                            </div>
                            <span>${dom.explain}</span>
                        </li>
                    `)

                    })
                    $("#employTopLay .design-specification").html(resArrTwo.join(""));
                    $("#employDownLay .design-specification").html(resArrThree.join(""));
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
            }
        });
    });

    /* 上颌弹层出现 */
    let employTopLayObj = {};
    $("#lisExplain,#lisExplainCtrl").on("click", ".list-explain-t", function () {
        if (judgment == 2 || judgment == 1) {
            $("#employTopLay").show();
            employTopLayObj.idx = $("#employTopLay .design-specification .active").index();
        }
    });
    /* 下颌弹层取消按钮 */
    $("#employTopLay .cancel").on("click", function () {
        $("#employTopLay .design-specification li").eq(employTopLayObj.idx).addClass("active").siblings().removeClass("active");
    });
    /* 下颌弹层出现 */
    let employDownLayObj = {};
    $("#lisExplain,#lisExplainCtrl").on("click", ".list-explain-b", function () {
        if (judgment == 3 || judgment == 1) {
            $("#employDownLay").show();
            employDownLayObj.idx = $("#employDownLay .design-specification .active").index();
        }
    });
    /* 下颌弹层取消按钮 */
    $("#employDownLay .cancel").on("click", function () {
        $("#employDownLay .design-specification li").eq(employDownLayObj.idx).addClass("active").siblings().removeClass("active");
    })
    /* 给附件模板中列表中的li添加点击事件 */
    $("#adjunct .appliance-list").on("click", "li", function () {
        $.ajax({
            //请求方式
            type: "get",
            //请求地址
            url: app.apiUrl + "/attachmentTemplate/details",
            data: {
                id: this.id
            },
            async: false,
            //请求成功
            success: function (result) {
                if (result.code == 200) {
                    let data = JSON.parse(result.data)
                    // console.log(data);
                    let dentalArchType = "双颌";
                    let dentalArchLower = 0;
                    let dentalArchUpper = 0;
                    if (data.dentalArch == 1) {
                        dentalArchType = "双颌";
                        dentalArchLower = data.lower;
                        dentalArchUpper = data.upper;
                    } else if (data.dentalArch == 2) {
                        dentalArchType = "上颌";
                        dentalArchUpper = data.upper;

                    } else if (data.dentalArch == 3) {
                        dentalArchType = "下颌";
                        dentalArchLower = data.lower;
                    }

                    let upStr = [];
                    let downStr = [];
                    /* 处理上下颌数据 */
                    /* 处理上下颌数据 可能有其他问题*/
                    console.log(typeof data.attachmentDesigns)
                    data.attachmentDesigns.forEach(item => {
                        upStr.push(`<p>${item.explain}</p>`);
                    })
                    data.address = data.address.split(" ");
                    let rendergraph = `
                            <li class="list-dentalarch">
                                <h3>选择牙弓</h3>
                                <p>${dentalArchType}</p>
                            </li>
                            <li class="list-number">
                                <h3>上颌数量</h3>
                                <p>${dentalArchUpper}</p>
                            </li>
                            <li class="list-number">
                                <h3>下颌数量</h3>
                                <p>${dentalArchLower}</p>
                            </li>
                            <li class="list-explain">
                                <h3>设计说明</h3>
                                <div>
                                    ${upStr.join("")}
                                </div>
                            </li>
                            <li class="list-cause">
                                <h3>原因</h3>
                                <div class="text-field">${data.reason.trim()}</div>
                            </li>
                            <li class="list-site">
                                <h3>收货地址</h3>
                                <div>
                                    <div class="site-t">
                                        <span class="Sitename"> ${data.deliveryName}</span>
                                        <span class="phone"> ${data.contactNumber}</span>
                                    </div>
                                    <div class="site-b">
                                        <p>
                                            ${data.address}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        `
                    $("#attachmentDelivery .content-fomr").html(rendergraph);
                    $("#attachmentDelivery .right-text").text(stateText);
                    if (dentalArchType == "上颌") {
                        $("#attachmentDelivery .list-number").eq(1).hide();
                        $("#attachmentDelivery .list-number").eq(0).show();
                    } else if (dentalArchType == "下颌") {
                        $("#attachmentDelivery .list-number").eq(0).hide();
                        $("#attachmentDelivery .list-number").eq(1).show();
                    } else if (dentalArchType == "双颌") {
                        $("#attachmentDelivery .list-number").eq(0).show();
                        $("#attachmentDelivery .list-number").eq(1).show();
                    }
                } else {
                    layer.open({
                        content: result.msg,
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })

            }
        });
        $("#attachmentDelivery").show();
        $("#adjunct").hide();
    })
    /* 点击附件模板发货记录中的返回按钮返回附件模板 */
    $("#attachmentDelivery .left-arrow").on("click", function () {
        $("#attachmentDelivery").hide();
        $("#adjunct").show();
    })
    /* 点击新建模板中的返回按钮返回附件模板 */
    $("#newAttachment .left-arrow").on("click", function () {
        $("#newAttachment").find("input").val("");
        $("#newAttachment").find("textarea").val("");
        $("#newAttachment").hide();
        $("#adjunct").show();
    })
    /* 点击附件模板中的返回按钮返回病例详情页面 */
    $("#adjunct .left-arrow").on("click", function () {
        $(".case-particulars").show();
        $("#adjunct").hide();
    })
    /* 选择牙弓 开始*/
    let dentalArchObj = {};
    $("#dentalRelationBtn").on("click", function () {
        $("#dentalArch").show();
        dentalArchObj.idx = $("#dentalArch .choice-dental-arch .active").index();
        dentalFlag = true;
    })

    $("#dentalArch li").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        checkedJudgment = $(this).index() + 1;
        // console.log(checkedJudgment);
    })
    /* 点击选择牙弓弹层上的保存按钮  选择牙弓弹层隐藏 */
    $("#dentalArch .save").on("click", function () {
        let textTwo = $("#dentalArch .active").text();
        if ($("#dentalArch .ul .active")) {
            $("#dentalRelationBtn p").text(textTwo);
            $("#newMaintenanceStart .list-dentalarch p").text(textTwo);
            $("#maintainStartCtrl #dikaryon").text(textTwo);
        }
        if (checkedJudgment != judgment) {
            $("#newMaintenanceStart .list-number input").val("");
            $("#newMaintenanceStart .list-step p").text("");
        }

        if ($("#dentalRelationBtn p").text() == "双颌") {
            judgment = 1;
            $("#maintainStartCtrl input").eq(0).attr("disabled", false);
            $("#maintainStartCtrl input").eq(1).attr("disabled", false);


            $("#newAttachment .list-number").eq(0).show();
            $("#newAttachment .list-number").eq(1).show();
            /* 保持器中的双颌输入 */
            $("#maintainStartCtrl .list-number").eq(0).show();
            $("#maintainStartCtrl .list-number").eq(1).show();

            $(".list-explain-b").show();
            $(".list-explain-t").show();
        }
        if ($("#dentalRelationBtn p").text() == "上颌") {
            judgment = 2;
            $("#maintainStartCtrl input").eq(0).attr("disabled", false);
            $("#maintainStartCtrl input").eq(1).attr("disabled", true);

            $("#maintainStartCtrl input").eq(1).val("");

            $("#newAttachment .list-number").eq(0).show();
            $("#newAttachment .list-number").eq(1).hide();
            /* 保持器中的双颌输入 */
            $("#maintainStartCtrl .list-number").eq(0).show();
            $("#maintainStartCtrl .list-number").eq(1).hide();


            $(".list-explain-t").show();
            $(".list-explain-b").hide();
        }
        if ($("#dentalRelationBtn p").text() == "下颌") {
            judgment = 3;
            $("#maintainStartCtrl input").eq(1).attr("disabled", false);
            $("#maintainStartCtrl input").eq(0).attr("disabled", true);

            $("#maintainStartCtrl input").eq(0).val("");

            $("#newAttachment .list-number").eq(0).hide();
            $("#newAttachment .list-number").eq(1).show();

            /* 保持器中的双颌输入 */
            $("#maintainStartCtrl .list-number").eq(0).hide();
            $("#maintainStartCtrl .list-number").eq(1).show();

            $(".list-explain-b").show();
            $(".list-explain-t").hide();
        }

        $("#stepNumberDouble input").eq(0).val("");
        $("#stepNumberDouble input").eq(1).val("");

        $("#stepNumberDouble input").eq(2).val("");
        $("#stepNumberDouble input").eq(3).val("");
        $("#dentalArch").hide();
    })
    /* 选择牙弓 结束*/

    /* 给设计说明弹层中的li添加点击事件 排他思想 tbea*/
    $("#employTopLay,#employDownLay").on("click", "li", function () {
        $(this).addClass("active").siblings().removeClass("active");
        if ($(this).index() != 2) {
            $(this).children().children("input").val("");
            $("#employTopLay input").attr("disabled", true);
            $("#employDownLay input").attr("disabled", true);
        }

        if ($(this).hasClass("active") && $(this).index() == 2) {
            $("#employTopLay input").attr("disabled", false);
            $("#employDownLay input").attr("disabled", false);
        }
    });

    $("#employTopLay,#employDownLay").on("click", "div", function (e) {
        e.stopPropagation();
    });
    /* 点击设计说明弹层中的保存按钮  改变上颌或下颌的文字 */
    $("#employTopLay .save").on("click", function () {
        /* 获取选中的li中的文字 */
        let text = "";
        for (var i = 0; i < $("#employTopLay .active").length; i++) {
            text += $("#employTopLay .active").eq(i).children("span").text().trim() + "<br />";
        }
        $("#lisExplain .list-explain-t p").html(text);
        $("#lisExplainCtrl .list-explain-t p").html(text);
        $("#employTopLay").hide();
    });
    $("#employDownLay .save").on("click", function () {
        /* 获取选中的li中的文字 */
        let text = "";
        for (var i = 0; i < $("#employDownLay .active").length; i++) {
            text += $("#employDownLay .active").eq(i).children("span").text().trim() + "<br />";
        }
        $("#lisExplain .list-explain-b p").html(text);
        $("#lisExplainCtrl .list-explain-b p").html(text);
        $("#employDownLay").hide();
    });
    /* 设计说明 结束*/

    /* 点击新建附件模板中提交按钮 通过ajax请求将数据提交到后台 */
    let checkCensoredWord = new CensoredWord(); //检测敏感词
    $("#newAttachment .submit-btn").on("click", function () {
        /* 获取数量 */
        var dentalIndex;
        var dentalNumT = 0;
        if ($("#dentalRelationBtn p").text() == "双颌") {
            dentalIndex = 1;
            dentalNumT = Number($("#newAttachment .list-number #newAttachmentUp").val().trim());
            dentalNumT1 = Number($("#newAttachment .list-number #newAttachmentDown").val().trim());
            if (!dentalNumT || !dentalNumT1 || isNaN(dentalNumT) || isNaN(dentalNumT1)) {
                layer.open({
                    content: "请输入数量",
                    skin: "msg",
                    time: 2 //2秒自动关闭
                });
                return false;
            }
        } else if ($("#dentalRelationBtn p").text() == "上颌") {
            dentalIndex = 2;
            dentalNumT = Number($("#newAttachment .list-number #newAttachmentUp").val().trim());
            dentalNumT1 = 0;
            if (!dentalNumT || isNaN(dentalNumT)) {
                layer.open({
                    content: "请输入数量",
                    skin: "msg",
                    time: 2 //2秒自动关闭
                });
                return false;
            }
        } else if ($("#dentalRelationBtn p").text() == "下颌") {
            dentalIndex = 3;
            dentalNumT1 = Number($("#newAttachment .list-number #newAttachmentDown").val().trim());
            dentalNumT = 0;
            if (!dentalNumT1 || isNaN(dentalNumT1)) {
                layer.open({
                    content: "请输入数量",
                    skin: "msg",
                    time: 2 //2秒自动关闭
                });
                return false;
            }
        }


        /* 处理设计说明参数 */
        let designExplains = [];
        let activeLiArr = [];
        $("#employTopLay .design-specification li").each((k, item) => {
            if ($(item).hasClass("active")) {
                activeLiArr.push(item);
            }
        });
        let activeLiArr2 = [];
        $("#employDownLay .design-specification li").each((val, item) => {
            if ($(item).hasClass("active")) {
                activeLiArr2.push(item);
            }
        });

        let activeLiArr3 = null;
        if (judgment == 2) {
            activeLiArr3 = activeLiArr;
        } else if (judgment == 3) {
            activeLiArr3 = activeLiArr2;
        } else {
            activeLiArr3 = activeLiArr.concat(activeLiArr2);
        }
        // console.log(activeLiArr3);
        if (activeLiArr3.length > 0) {
            activeLiArr3.forEach((item, idx) => {
                designExplains.push(
                    {
                        "effective": true,
                        "explain": $(item).children("span").text(),
                        "id": Number($(item).attr("data-id")),
                        "jaw": Number($(item).attr("data-jaw")),
                    }
                )
            })
        };
        // console.log(designExplains);
        // return false;
        /* 获取到牙弓的类型 */
        let dentalType = $("#dentalRelationBtn").children("p").text().trim();
        /* 获取到填写的原因 */
        let reason = $("#newAttachment .text-field").val().replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
        // console.log(reason);
        // attachmentDelivery

        /* 判断是否填写 开始 */
        if (dentalType == "") {
            layer.open({
                content: "请选择牙弓类型",
                skin: "msg",
                time: 2 //2秒自动关闭
            });
            return false;
        }
        /* 判断是否填写 结束 */
        /* 检测敏感词 开始*/
        if (reason) {
            let response = checkCensoredWord.check(reason);
            if (!response.result) {
                response.wordList.forEach(item => {
                    reason = reason.replace(item, "**");
                })
            }
        }
        /* 检测敏感词 结束*/
        // presentStageName,presentStageCount
        /* ajax请求所需的参数 */
        // console.log(allAddrListId);
        // return false;
        let saveAddress = {
            caseInfoId: caseInfoId,
            dentalArch: dentalIndex,
            lower: Number(dentalNumT1),
            upper: Number(dentalNumT),
            addressId: allAddrListId,
            stageName: presentStageName,
            stageCount: presentStageCount,
            designExplains: designExplains,
            reason: reason,
        };
        // console.log(saveAddress);

        /* ajax请求 将填写的数据传到服务器 */
        $.ajax({
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            async: false,
            url: app.apiUrl + "/attachmentTemplate/createAttachmentTemplate",
            data: JSON.stringify(saveAddress),
            //请求成功
            success: function (result) {
                if (result.code == 200) {
                    let liArr = [];
                    attachmentList.forEach(item => {
                        // console.log(item)
                        if (item.state == 2) {
                            src = "img/toothed-gear.png"
                            stateText = "生产中"
                        } else if (item.state == 3) {
                            stateText = "已完成";
                            src = "img/face.png";
                        } else if (item.state == 0) {
                            src = "img/toothed-gear.png"
                            stateText = "未批准"
                        } else if (item.state == 1) {
                            src = "img/toothed-gear.png"
                            stateText = "已批准"
                        }
                        let li = `<li id=${item.id}>
                                            <span>${timestampToTime(item.time)}</span>
                                            <span>${item.lower + item.upper}副</span>
                                            <div>
                                                <img src=${src} alt=""><span>${stateText}</span>
                            </div>
                        </li>`;
                        liArr.push(li);
                    })
                    $("#adjunct .appliance-list").html(liArr.join(""));
                    $("#newAttachment").hide();
                    $("#adjunct").show();
                } else {
                    layer.open({
                        content: result.msg,
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
            }
        });
        /* 通过ajax请求再次渲染附件模板的列表 */
        // presentStageName,presentStageCount
        $.ajax({
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/attachmentTemplate/attachmentTemplateRecord",
            data: JSON.stringify({
                caseInfoId: caseInfoId,
                stageName: presentStageName,
                stageCount: presentStageCount,
            }),
            //请求成功

            success: function (result) {
                if (result.code == 200) {
                    attachmentList = JSON.parse(result.data);
                    // console.log(attachmentList)
                    let liArr = [];
                    attachmentList.forEach(item => {

                        if (item.state == 2) {
                            src = "img/toothed-gear.png"
                            stateText = "未批准"
                        } else if (item.state == 3) {
                            stateText = "生产中";
                            src = "img/shipments.png";
                        } else if (item.state == 4) {
                            stateText = "已完成";
                            src = "img/face.png";
                        } else if (item.state == 5) {
                            stateText = "订单取消";
                            src = "img/close.png";
                        } else if (item.state == 0) {
                            src = "img/examine.png"
                            stateText = "审批中"
                        } else if (item.state == 1) {
                            src = "img/state.png"
                            stateText = "已批准"
                        }
                        let li = `<li id=${item.id}>
                                                    <span>${timestampToTime(item.time)}</span>
                                                    <span>${item.lower + item.upper}副</span>
                                                    <div>
                                                        <img src=${src} alt=""><span>${stateText}</span>
                                    </div>
                                </li>`;
                        liArr.push(li);
                    })
                    // console.log($("#adjunct .appliance-list").html(liArr.join("")));
                    $("#adjunct .appliance-list").html(liArr.join(""));
                    $("#newAttachment").find("input").val("");
                    $("#newAttachment").find("textarea").val("");
                    $("#newAttachment .list-dentalarch").children("p").text("双颌");
                    $("#newAttachment .list-explain").find("p").eq(0).text("上颌使用最近的orthoplus方案里最后一步主动非过矫正矫治步骤");
                    $("#newAttachment .list-explain").find("p").eq(1).text("下颌使用最近的orthoplus方案里最后一步主动非过矫正矫治步骤");
                } else {
                    layer.open({
                        content: result.msg,
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })

            }
        });
    })
    $("#newAttachment .cancel-btn").on("click", function () {
        $("#newAttachment").find("input").val("");
        $("#newAttachment").find("textarea").val("");
        $("#newAttachment").hide();
        $("#adjunct").show();
    })

    /* 附件模板 结束 */


    /* 后续生产 开始 */
    /* 点击返回病例详情页面 */
    $("#productPageBox .left-arrow").on("click", function () {
        $("#subsequentProduction").show();
        $("#productPageBox").hide();
    })
    /* 点击取消 返回后续生产页面 */
    $("#productPageBox .cancel").on("click", function () {
        $("#subsequentProduction").show();
        $("#productPageBox").hide();
    })
    /* 点击选择步数的小箭头 选择步数弹层显示 */
    $("#newlyBuildBtn1").on("click", function () {
        $("#stepNumber").show();
        stepFlag = true;
    })
    /* 返回后续生产列表 */
    $("#deliverGoods .left-arrow").on("click", function () {
        $("#deliverGoods").hide();
        $("#subsequentProduction").show();
    })
    /* 点击后续生产 后续页面显示 */
    // presentStageName,presentStageCount
    let productionText = "";
    $("#supplementFollowUp").on("click", function () {
        getAddrList();
        /* 通过ajax请求 动态渲染后续生产记录列表 */
        $.ajax({
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/production/deliverGoodsRecord",
            async: false,
            //数据，json字符串
            data: JSON.stringify({
                caseInfoId: caseInfoId,
                stageName: presentStageName,
                stageCount: presentStageCount,
            }),
            //请求成功
            success: function (result) {
                if (result.code == 200) {
                    production = JSON.parse(result.data);
                    let liArr = [];
                    if (production.length > 0) {
                        production.forEach(item => {
                            if (item.productionState == 2) {
                                src = "img/toothed-gear.png"
                                productionText = "未批准"
                            } else if (item.productionState == 3) {
                                productionText = "生产中";
                                src = "img/shipments.png";
                            } else if (item.productionState == 4) {
                                productionText = "已完成";
                                src = "img/face.png";
                            } else if (item.productionState == 5) {
                                productionText = "订单取消";
                                src = "img/close.png";
                            } else if (item.productionState == 0) {
                                src = "img/examine.png"
                                productionText = "审批中"
                            } else if (item.productionState == 1) {
                                src = "img/state.png"
                                productionText = "已批准"
                            }
                            let li = `<li id=${item.id}>
                                    <span>${timestampToTime(item.createTime)}</span>
                                    <span>${item.upperEnd - item.upperStart + 1 + item.lowerEnd - item.lowerStart + 1}副</span>
                                    <div>
                                        <img src=${src}><span>${productionText}</span>
                                    </div>
                                </li>`;
                            liArr.push(li);
                        })
                        $("#subsequentProduction .appliance-list").html(liArr.join(""));
                    } else {
                        $("#subsequentProduction .appliance-list").html("<li><span>暂无数据</span></li>");
                    }

                    $("#subsequentProduction").show();
                    $(".case-particulars").hide();
                } else {
                    layer.open({
                        content: result.msg,
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
            }

        })

    })

    /* 点击后续生产中的申请发货 */
    let frontStep = 0, frontdownStep = 0; //记录开始的步数
    let belowStep = 0, belowdownStep = 0; //记录结束的步数
    // let stepFlag = true; // 用于判断是从哪里点进来选择步数
    /* 点击选择步数弹窗的保存按钮 获取到填写的步数 */
    $("#stepNumber .save").on("click", function () {

        if (!$("#stepNumber input").eq(0).val() || !$("#stepNumber input").eq(1).val() || !$("#stepNumber input").eq(2).val() || !$("#stepNumber input").eq(3).val()) {
            layer.open({
                content: "请输入步数",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        frontStep = Number($("#stepNumber input").eq(0).val());
        belowStep = Number($("#stepNumber input").eq(1).val());

        frontdownStep = Number($("#stepNumber input").eq(2).val());
        belowdownStep = Number($("#stepNumber input").eq(3).val());

        if (frontStep > belowStep || isNaN(frontStep) || isNaN(belowStep) || frontdownStep > belowdownStep || isNaN(frontdownStep) || isNaN(belowdownStep)) {
            layer.open({
                content: "请输入正确的步数",
                skin: "msg",
                time: 2 //2秒自动关闭
            });
            return false;
        }

        $("#productPageBox .steps span:nth-of-type(2)").text(`上颌${frontStep}-${belowStep}步、下颌${frontdownStep}-${belowdownStep}步`);
        $("#stepNumber").hide();
    });

    /* 点击选择步数 双颌 弹窗的保存按钮 获取到填写的步数 */
    $("#stepNumberDouble .save").on("click", function () {
        if (judgment == 1 || judgment == 2) {
            if (!$("#stepNumberDouble input").eq(0).val() || !$("#stepNumberDouble input").eq(1).val()) {
                layer.open({
                    content: "请输入步数",
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
                return false;
            }
        };

        if (judgment == 1 || judgment == 3) {
            if (!$("#stepNumberDouble input").eq(2).val() || !$("#stepNumberDouble input").eq(3).val()) {
                layer.open({
                    content: "请输入步数",
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
                return false;
            }
        };
        frontStep = Number($("#stepNumberDouble input").eq(0).val());
        belowStep = Number($("#stepNumberDouble input").eq(1).val());

        frontdownStep = Number($("#stepNumberDouble input").eq(2).val());
        belowdownStep = Number($("#stepNumberDouble input").eq(3).val());
        if (judgment == 1 || judgment == 2) {
            if (frontStep > belowStep || isNaN(frontStep) || isNaN(belowStep)) {
                layer.open({
                    content: "请输入正确的步数",
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
                return false;
            }
        };
        if (judgment == 1 || judgment == 3) {
            if (frontdownStep > belowdownStep || isNaN(frontdownStep) || isNaN(belowdownStep)) {
                layer.open({
                    content: "请输入正确的步数",
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
                return false;
            }
        }
        if (judgment == 1) {
            $("#newMaintenanceStart .list-step>p").text(`上颌${frontStep}-${belowStep}步，下颌${frontdownStep}-${belowdownStep}步`);
            $("#newMaintenanceStart .list-number input").val(belowStep + 1 - frontStep + belowdownStep + 1 - frontdownStep);
        } else if (judgment == 2) {
            $("#newMaintenanceStart .list-step>p").text(`上颌${frontStep}-${belowStep}步`);
            $("#newMaintenanceStart .list-number input").val(belowStep + 1 - frontStep);
        } else {
            $("#newMaintenanceStart .list-step>p").text(`下颌${frontdownStep}-${belowdownStep}步`);
            $("#newMaintenanceStart .list-number input").val(belowdownStep + 1 - frontdownStep);
        }

        $("#stepNumberDouble").hide();
    })
    /* 点击后续生产中的保存 通过ajax请求提交填写的数据到后台 并且重新渲染后续生产中数据列表*/
    $("#productPageBox .submit").on("click", function () {
        let remarks = $("#productPageBox .remarks").val().replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
        let steps = $("#productPageBox .steps span:nth-of-type(2)").text().trim();
        /* 判断是否填写步数 */
        if (steps == "") {
            layer.open({
                content: "请输入步数",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }
        /* 将填写的数据存到对象中 */
        // presentStageName,presentStageCount
        productionData = {
            addressId: allAddrListId,
            caseInfoId: caseInfoId,
            caseStageId: 1,
            lowerEnd: belowdownStep,
            lowerStart: frontdownStep,
            remark: remarks,
            stageCount: presentStageCount,
            stageName: presentStageName,
            upperEnd: belowStep,
            upperStart: frontStep
        }
        /* 点击后续生产保存  提交数据到后台 */
        $.ajax({
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            async: false,
            url: app.apiUrl + "/production/deliverGoodsApply",
            data: JSON.stringify(productionData),
            //请求成功
            success: function (result) {
                if (result.code == 200) {
                    console.log(result);
                } else {
                    layer.open({
                        content: result.msg,
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
            }
        });
        /* 点击保存重新渲染后续生产的列表 */
        // presentStageName,presentStageCount
        $.ajax({
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/production/deliverGoodsRecord",
            //数据，json字符串
            data: JSON.stringify({
                caseInfoId: caseInfoId,
                stageName: presentStageName,
                stageCount: presentStageCount,
            }),
            //请求成功
            success: function (result) {
                if (result.code == 200) {
                    production = JSON.parse(result.data);
                    // console.log(production)
                    let liArr = [];
                    production.forEach(item => {
                        if (item.productionState == 2) {
                            src = "img/toothed-gear.png"
                            productionText = "未批准"
                        } else if (item.productionState == 3) {
                            productionText = "生产中";
                            src = "img/shipments.png";
                        } else if (item.productionState == 4) {
                            productionText = "已完成";
                            src = "img/face.png";
                        } else if (item.productionState == 5) {
                            productionText = "订单取消";
                            src = "img/close.png";
                        } else if (item.productionState == 0) {
                            src = "img/examine.png"
                            productionText = "审批中"
                        } else if (item.productionState == 1) {
                            src = "img/state.png"
                            productionText = "已批准"
                        }
                        let li = `<li id=${item.id}>
                                <span>${timestampToTime(item.createTime)}</span>
                                <span>${item.upperEnd - item.upperStart + 1 + item.lowerEnd - item.lowerStart + 1}副</span>
                                <div>
                                    <img src=${src}><span>${productionText}</span>
                                </div>
                            </li>`;
                        liArr.push(li);
                    })
                    $("#subsequentProduction .appliance-list").html(liArr.join(""));
                    $("#productPageBox").hide();
                    $("#subsequentProduction").show();
                    $("#productPageBox .steps span:nth-of-type(2)").text("");
                    $("#productPageBox .remarks").val("");
                    $("#stepNumber input").val("");
                } else {
                    layer.open({
                        content: result.msg,
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
            }

        })
    });
    /* 点击申请后续生产 通过ajax请求获取到地址列表*/
    $("#subsequentProductionBtn").on("click", function () {
        $.ajax({
            //请求方式
            type: "get",
            //请求地址
            url: app.apiUrl + "/deliveryAddress/getAddressList?t=" + app.random,
            //请求成功
            async: false,
            success: function (res) {
                if (res.code == 200) {
                    let productionSite = JSON.parse(res.data);
                    // console.log(productionSite)

                    if (allAddrList[0]) {
                        allAddrListId = allAddrList[0].id;
                        editAddrInfo = allAddrList[0];
                    }
                    let site = `
                            <div class="contact">
                                <span class="name">${productionSite[0] ? productionSite[0].deliveryName : ""}</span>
                                <span class="number">${productionSite[0] ? productionSite[0].contactNumber : ""}</span>
                            </div>
                            <div class="detailed-address">
                                <span>${productionSite[0] ? productionSite[0].city : ""} ${productionSite[0] ? productionSite[0].area : ""}  ${productionSite[0] ? productionSite[0].address : ""}</span>
                            </div>
                        `
                    $("#productPageBox .address .information>div:nth-of-type(1)").html(site);
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
            }
        });

        $("#productPageBox .steps>span").eq(1).text("");
        $("#productPageBox .remarks").val("");
        $("#stepNumber input").val("");

        $("#productPageBox").show();
        $("#subsequentProduction").hide();
    })
    /* 点击后续生产列表  后续生产发货记录页面显示 通过ajax请求获取到当前点击病例的具体信息 */
    let productionData = ""; //记录后续生产的详情数据
    $("#subsequentList").on("click", "li", function () {
        if ($(this).attr("id")) {
            $.ajax({
                //请求方式
                type: "get",
                //请求地址
                url: app.apiUrl + "/production/details",
                data: {
                    "id": this.id
                },
                async: false,
                //请求成功
                success: function (result) {
                    if (result.code == 200) {

                        productionData = JSON.parse(result.data);
                        // console.log(productionData)
                        // let addressArr = productionData.address.split(" ");
                        let productionState = productionData.productionState;
                        let productionHint = "";
                        let productionSrc = "";
                        if (productionState == 2) {
                            productionHint = "未批准"
                        } else if (productionState == 3) {
                            productionHint = "生产中";
                        } else if (productionState == 0) {
                            productionHint = "审批中";
                        } else if (productionState == 1) {
                            productionHint = "已批准";
                        } else if (productionState == 4) {
                            productionHint = "已完成";
                        } else if (productionState == 5) {
                            productionHint = "订单取消";
                        }
                        let subsequentProductionType = "";
                        if (productionData.dentalArch == 1) {
                            subsequentProductionType = "双颌";
                        } else if (productionData.dentalArch == 2) {
                            subsequentProductionType = "上颌";
                        } else if (productionData.dentalArch == 3) {
                            subsequentProductionType = "下颌";
                        }
                        let productionDom = `
                        <li class="steps">
                            <span>
                                <p>上颌选择步数</p>
                            </span>
                            <span>第${productionData.upperStart}步———第${productionData.upperEnd}步</span>
                        </li>
                        <li class="steps">
                            <span>
                                <p>下颌选择步数</p>
                            </span>
                            <span>第${productionData.lowerStart}步———第${productionData.lowerEnd}步</span>
                        </li>
                        <li class="remarksbox">
                            <span>
                                <p>备注</p>
                            </span>
                            <div class="remarks">${productionData.remark}</div>
                        </li>
                        <li class="address address1">
                            <span class="receiving-goods">
                                <p>收货地址</p>
                            </span>
                            <div class="information">
                                <div class="contact">
                                    <span class="name">${productionData.deliveryName}</span>
                                    <span class="number">${productionData.contactNumber}</span>
                                </div>
                                <div class="detailed-address">
                                    <span>${productionData.address}</span>
                                </div>
                            </div>
                        </li>
                            `
                        $("#deliverGoods .newly-build").html(productionDom);
                        $("#deliverGoods .right-text").text(productionHint);
                        if (subsequentProductionType == "双颌") {
                            $("#deliverGoods .content-fomr .list-number").eq(0).show();
                            $("#deliverGoods .content-fomr .list-number").eq(1).show();
                        }
                        if (subsequentProductionType == "上颌") {
                            $("#deliverGoods .content-fomr .list-number").eq(0).show();
                            $("#deliverGoods .content-fomr .list-number").eq(1).hide();
                        }
                        if (subsequentProductionType == "下颌") {
                            $("#deliverGoods .content-fomr .list-number").eq(0).hide();
                            $("#deliverGoods .content-fomr .list-number").eq(1).show();
                        }

                    } else {
                        layer.open({
                            content: result.msg,
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
                    layer.open({
                        content: e.responseJSON.message,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    })
                }
            });
            $("#deliverGoods").show();
            $("#subsequentProduction").hide();
        };
    })

    /* 备用矫治器 开始 */
    /* 点击保质矫治器 保质矫治器页面显示 通过ajax请求动态渲染保质矫治器列表*/
    let standby = "";
    $("#supplementCorrect").on("click", function () {
        getAddrList();
        getSupplementCorrectList();
        $("#maintenanceStart").show();
        $(".case-particulars").hide();
    });

    /*  通过ajax请求动态渲染保质矫治器列表 */
    // presentStageName,presentStageCount
    function getSupplementCorrectList () {
        $.ajax({
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/applianceReplace/protectiveApplianceRecord",
            //数据，json字符串
            data: JSON.stringify({
                caseInfoId: caseInfoId,
                stageName: presentStageName,
                stageCount: presentStageCount,
            }),
            async: false,
            //请求成功
            success: function (result) {
                if (result.code == 200) {
                    standby = JSON.parse(result.data);
                    // console.log(standby)
                    let liArr = [];
                    if (standby.length > 0) {
                        standby.forEach(item => {
                            if (item.productionState == 2) {
                                src = "img/toothed-gear.png"
                                productionText = "未批准"
                            } else if (item.productionState == 3) {
                                productionText = "生产中";
                                src = "img/shipments.png";
                            } else if (item.productionState == 4) {
                                productionText = "已完成";
                                src = "img/face.png";
                            } else if (item.productionState == 5) {
                                productionText = "订单取消";
                                src = "img/close.png";
                            } else if (item.productionState == 0) {
                                src = "img/examine.png"
                                productionText = "审批中"
                            } else if (item.productionState == 1) {
                                src = "img/state.png"
                                productionText = "已批准"
                            }
                            let li = `<li id=${item.id}>
                            <span>${timestampToTime(item.createTime)}</span>
                            <span>${item.count}副</span>
                            <div>
                                <img src=${src}><span>${productionText}</span>
                            </div>
                        </li>`;
                            liArr.push(li);
                        });
                        $("#maintenanceStart .appliance-list").html(liArr.join(""));
                    } else {
                        $("#maintenanceStart .appliance-list").html("<li><span>暂无数据</span></li>");
                    }


                } else {
                    layer.open({
                        content: result.msg,
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
            }

        })
    }
    let maintainFile = "";
    /* 点击保质矫治器中的申请发货按钮 新建保质矫治器页面显示 */
    $("#maintenanceStart .text-c").on("click", function () {
        $("#newMaintenanceStart").show();
        $("#maintenanceStart").hide();
        maintainFile = "";
        /* 更新新建保质矫治器页面信息 */
        $("#newMaintenanceStart .list-step p").text("");
        $("#newMaintenanceStart .list-number input").val("");
        $("#newMaintenanceStart .list-cause textarea").val("");
        $("#dentalArch .choice-dental-arch li").eq(0).addClass("active").siblings().removeClass("active");
        $("#newMaintenanceStart .list-dentalarch p").text("双颌");
        $("#newMaintenanceStart .add-change .show-change").attr("src", "");
        $("#newMaintenanceStart .add-change .add").show();
        $("#stepNumberDouble input").val("");//清空步数弹窗里面的内容
        $("#jzqPic img").attr("src", "");
        judgment = 1;//再次点击新建把judgment改回来


        addressExpressageFlag = 4;
        getAddrList();
    })
    /* 点击保质矫治器中的数据列表 保质矫治器发货记录显示 */
    $("#maintenanceStart .appliance-list").on("click", "li", function () {
        $("#jzqPic img").attr("src", "");
        /* 判断有数据渲染 请求接口 */
        if ($(this).attr("id")) {

            $.ajax({
                //请求方式
                type: "get",
                //请求地址
                url: app.apiUrl + "/applianceReplace/details",
                data: {
                    id: this.id
                },
                async: false,
                beforeSend: function (xhr) {
                    //不携带这个会报错
                    xhr.setRequestHeader("Authorization", token);
                },
                //请求成功
                success: function (result) {
                    if (result.code == 200) {
                        let data = JSON.parse(result.data)
                        // console.log(data);
                        if (data.productionState == 0) {
                            $("#maintenanceDeliver .right-text").text("审批中");
                        } else if (data.productionState == 1) {
                            $("#maintenanceDeliver .right-text").text("已批准");
                        } else if (data.productionState == 2) {
                            $("#maintenanceDeliver .right-text").text("未批准");
                        } else if (data.productionState == 3) {
                            $("#maintenanceDeliver .right-text").text("生产中");
                        } else if (data.productionState == 4) {
                            $("#maintenanceDeliver .right-text").text("已完成");
                        } else if (data.productionState == 5) {
                            $("#maintenanceDeliver .right-text").text("订单取消");
                        }

                        let typeStr = $("#genres .choice-dental-arch li").eq(data.type - 1).text();
                        $("#maintenanceDeliver .list-dentalarch>p").text(typeStr);

                        let lowerStr = "", upperStr = "";
                        if (data.upperStart) {
                            upperStr = `上颌${data.upperStart}-${data.upperEnd}步`;
                        }

                        if (data.upperStart && data.lowerStart) {
                            upperStr += "、";
                        }
                        if (data.lowerStart) {
                            lowerStr = `下颌${data.lowerStart}-${data.lowerEnd}步`;
                        }

                        $("#maintenanceDeliver .list-step>p").text(upperStr + lowerStr);


                        $("#maintenanceDeliver .list-number div").html(data.count);

                        $("#maintenanceDeliver .list-cause div p").html(data.remark);
                        // app.image2Base64(app.imgUrl + data.path, function (imgsrc) {
                        if (data.path) $("#jzqPic img").attr("src", app.imgUrl + data.path);
                        // });


                        let dentalArchStr = $("#dentalArch .choice-dental-arch li").eq(data.dentalArch - 1).text();
                        $("#maintenanceDeliver .list-dentalarch").children("p").text(dentalArchStr);

                        $("#maintenanceDeliver .Sitename").html(data.deliveryName);
                        $("#maintenanceDeliver .phone").children("span").eq(1).html(data.contactNumber);
                        $("#maintenanceDeliver .site-b p").html(data.address);

                    } else {
                        layer.open({
                            content: result.msg,
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

            $("#maintenanceDeliver").show();
            $("#maintenanceStart").hide();
        }

    });

    /* 点击矫治器详情图片放大查看 */
    $("#jzqPic").on("click", function () {
        let url = $(this).children("img").attr("src");
        if (!url) return false;
        var image = new Image();
        image.src = url;
        image.onload = function () {
            var viewer = new Viewer(image, {
                hidden: function () {
                    viewer.destroy();
                },
                viewed: function () {
                    // $(".viewer-footer").prepend(`<a href="${url}" download="下载图片" class="viewer-download">下载图片</a><br>`);
                }
            });
            viewer.show();
        };

    });
    /* 点击选择牙弓的小箭头 选择牙弓弹层显示 */
    $("#newMaintenanceStart .list-dentalarch").on("click", function () {
        $("#dentalArch").show();
        dentalArchObj.idx = $("#dentalArch .choice-dental-arch .active").index();
        dentalFlag = false;
    })
    /* 点击选择步数的小箭头 选择步数弹层显示 */
    $("#newMaintenanceStart .list-step").on("click", function () {
        $("#stepNumberDouble").show();
        if (judgment == 1) {
            $("#stepNumberDouble .choice").show();
            $("#stepNumberDouble p").show();
        } else if (judgment == 2) {
            $("#stepNumberDouble .choice").eq(1).hide();
            $("#stepNumberDouble .choice").eq(0).show();
            $("#stepNumberDouble p").eq(0).show();
            $("#stepNumberDouble p").eq(1).hide();
        } else {
            $("#stepNumberDouble .choice").eq(0).hide();
            $("#stepNumberDouble .choice").eq(1).show();
            $("#stepNumberDouble p").eq(1).show();
            $("#stepNumberDouble p").eq(0).hide();
        }

        // stepFlag = false;
    })
    /* 点击保质矫治器发货记录中的返回按钮 保质矫治器页面显示 */
    $("#maintenanceDeliver .left-arrow").on("click", function () {
        $("#maintenanceDeliver").hide();
        $("#maintenanceStart").show();
    })
    /* 点击新建保质矫治器中的返回按钮 保质矫治器页面显示 */
    $("#newMaintenanceStart .left-arrow").on("click", function () {
        $("#newMaintenanceStart").hide();
        $("#maintenanceStart").show();
    })
    /* 点击新建保质矫治器中的取消按钮 保质矫治器页面显示 */
    $("#newMaintenanceStart .cancel-btn").on("click", function () {
        $("#newMaintenanceStart").hide();
        $("#maintenanceStart").show();
    });

    /* 上传备用矫治器照片 */
    $("#newMaintenanceStart .add-change input").on("change", function () {

        var file = this.files[0];
        console.log(file);
        let iptDom = this;

        var filepath = this.value;
        if (!filepath) return false;

        lrz(iptDom.files[0])
            .then(function (rst) {
                console.log(rst);
                // if (window.FileReader) {
                //     var reader = new FileReader();
                //     reader.readAsDataURL(rst.origin);
                //     //监听文件读取结束后事件
                //     reader.onloadend = function (e) {
                $(iptDom).prev().hide();
                $(iptDom).next().attr("src", rst.base64);
                // };
                // }
                console.log(rst.origin);

                maintainFile = rst.origin;
            });

        // var filetypes = [".jpg", ".png", ".jpeg", ".svg", '.gif'];



    });
    let maintainData = {}; //存放新建保质器填写的数据
    /* 备用矫治器新建 提交按钮 */
    /* 点击新建保质矫治器中的保存按钮 保质矫治器页面显示 */
    // presentStageName,presentStageCount
    $("#newMaintenanceStart .submit-btn").on("click", function () {
        /* 判断选择牙弓类型 */
        let maintenanceNum = null;
        console.log(maintainFile);

        let maintenanceCause = $("#newMaintenanceStart .list-cause textarea").val().replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
        maintainData = {
            caseInfoId: caseInfoId,
            stageName: presentStageName,
            stageCount: presentStageCount,
            dentalArch: judgment,
            addressId: allAddrListId,
            remark: maintenanceCause,
            file: maintainFile,
            upperStart: 0,
            upperEnd: 0,
            lowerStart: 0,
            lowerEnd: 0,
        }

        /* 选择步数内容 */
        if (judgment == 1) {
            maintainData.upperStart = frontStep;
            maintainData.upperEnd = belowStep;
            maintainData.lowerStart = frontdownStep;
            maintainData.lowerEnd = belowdownStep;
            maintainData.count = belowStep + 1 - frontStep + belowdownStep + 1 - frontdownStep;
        } else if (judgment == 2) {
            maintainData.upperStart = frontStep;
            maintainData.upperEnd = belowStep;
            maintainData.count = belowStep + 1 - frontStep;
        } else if (judgment == 3) {
            maintainData.lowerStart = frontdownStep;
            maintainData.lowerEnd = belowdownStep;
            maintainData.count = belowdownStep + 1 - frontdownStep
        }

        let stepInner = $("#newMaintenanceStart .list-step p").text();
        if (!stepInner) {
            layer.open({
                content: "请选择填写步数",
                skin: "msg",
                time: 2 //2秒自动关闭
            });
            return false;
        }
        if (!maintainData.count) {
            layer.open({
                content: "请输入数量",
                skin: "msg",
                time: 2 //2秒自动关闭
            });
            return false;
        }


        // console.log(maintainData);

        let maintainFormData = new FormData();
        for (var k in maintainData) {
            maintainFormData.append(k, maintainData[k]);
        }
        var indexFlag = layer.open({
            type: 2,
            content: '处理中，请稍候',
            shadeClose: false,
        });
        $.ajax({
            //请求方式
            type: "POST",
            dataType: 'JSON',
            cache: false, // 不缓存
            processData: false, // jQuery不要去处理发送的数据
            contentType: false,
            // async: false,
            //请求地址
            url: app.apiUrl + "/applianceReplace/createProtectiveAppliance?t=" + app.random,
            data: maintainFormData,
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求成功
            success: function (result) {
                if (result.code == 200) {
                    // console.log(result);
                    getSupplementCorrectList();
                    layer.close(indexFlag);
                } else {
                    layer.open({
                        content: result.msg,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    });
                    layer.close(indexFlag);
                }
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                });
                layer.close(indexFlag);

            }
        });

        $("#newMaintenanceStart").hide();
        $("#maintenanceStart").show();
    })
    /* 点击保质矫治器中的返回按钮 保质矫治器页面隐藏 病例详情页面显示 */
    $("#maintenanceStart .left-arrow").on("click", function () {
        $("#maintenanceStart").hide();
        $(".case-particulars").show();
    })
    /* 备用矫治器 结束 */

    /* 查看物流进程 开始*/
    /* 点击查看按钮 物流进程页面显示*/
    $(".course").on("click", ".production-btn", function () {
        $(".case-particulars").hide();
        $(".logistics").show();
        $("body").scrollTop(0);
        let takeno = $(this).attr("data-takeno");
        let consigneeTel = $(this).attr("data-tel");
        let receiverName = $(this).attr("data-receiver");
        $(".logistics .logistics-tel").children("span").eq(1).text(consigneeTel);
        $(".logistics .logistics-name").children("span").eq(1).text(receiverName);
        $(".logistics .logistics-odd").children("p").children("span").eq(1).text(takeno);
        $.ajax({
            /* 请求异步问题 */
            async: false,
            //请求方式
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/caseInfo/getSF",
            //数据，json字符串
            data: JSON.stringify({
                takeNo: takeno,
                phone: consigneeTel,
            }),
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求成功
            success: function (res) {
                if (res.code == 200) {


                    let data = JSON.parse(res.data);
                    console.log(data);

                    // console.log(data);
                    let logisticsList = [];
                    data.forEach((item, index) => {
                        item.date = item.date.replace("-", "/");
                        item.date = item.date.replace("-", "/");
                        item.date = item.date.replace("-", "/");
                        if (index == data.length - 1) {
                            logisticsList.push(`<li class="active">
                                <p>
                                    <span>${item.date}</span>
                                    <span>${item.time}</span>
                                </p>
                                <p>
                                    <span></span>
                                    <em></em>
                                </p>
                                <p>
                                    <span>${item.desc}</span>
                                    <span>${item.next}</span>
                                </p>
                            </li>`)
                        } else {
                            logisticsList.push(`<li>
                                <p>
                                    <span>${item.date}</span>
                                    <span>${item.time}</span>
                                </p>
                                <p>
                                    <span></span>
                                    <em></em>
                                </p>
                                <p>
                                    <span>${item.desc}</span>
                                    <span>${item.next}</span>
                                </p>
                            </li>`)
                        }
                        $(".logistics-message-list").html(logisticsList.join(""))
                    })
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
    });

    /* Web OrthoPlus 按钮显示 3d 方案 */
    $(".course").on("click", ".production-btn1", function () {
        $(".case-particulars").hide();
        $("#threeDimensional").show();
    })
    $(".logistics .back-img").on("click", function () {
        $(".case-particulars").show();
        $(".logistics").hide();
    })
    /* 查看物流进程 结束*/




    /* 委托加工单 开始 */

    /* 点击委托加工单  委托加工单页面显示 */
    $("#schemeWorksheet").on("click", function () {
        $("#consignment").show();
        $(".case-particulars").hide();
        $.ajax({
            type: "post",
            url: app.apiUrl + "/caseInfo/getEntrust",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                caseId: presentCaseId,
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                if (res.code == 200) {
                    var entrust = JSON.parse(res.data);
                    console.log(entrust);
                    console.log(entrust.prescpMolarRight);
                    /* 磨牙关系 左侧 */
                    if (entrust.molarLeft == 1) {
                        entrust.molarLeft = "|类";
                    } else if (entrust.molarLeft == 2) {
                        entrust.molarLeft = "||类";
                    } else if (entrust.molarLeft == 3) {
                        entrust.molarLeft = "|||类";
                    }
                    /* 磨牙关系 右侧 */
                    if (entrust.molarRight == 1) {
                        entrust.molarRight = "|类";
                    } else if (entrust.molarRight == 2) {
                        entrust.molarRight = "||类";
                    } else if (entrust.molarRight == 3) {
                        entrust.molarRight = "|||类";
                    }
                    /* 尖牙关系 左侧 */
                    if (entrust.canineLeft == 1) {
                        entrust.canineLeft = "中性";
                    } else if (entrust.canineLeft == 2) {
                        entrust.canineLeft = "近中";
                    } else if (entrust.canineLeft == 3) {
                        entrust.canineLeft = "远中";
                    }
                    /* 尖牙关系 右侧 */
                    if (entrust.canineRight == 1) {
                        entrust.canineRight = "中性";
                    } else if (entrust.canineRight == 2) {
                        entrust.canineRight = "近中";
                    } else if (entrust.canineRight == 3) {
                        entrust.canineRight = "远中";
                    }
                    /* 病例列表 */
                    /* 矫治牙列 */
                    if (entrust.prescpDentition == 1) {
                        entrust.prescpDentition = "上颌";
                    } else if (entrust.prescpDentition == 2) {
                        entrust.prescpDentition = "下颌";
                    } else if (entrust.prescpDentition == 3) {
                        entrust.prescpDentition = "全颌";
                    }
                    /* 覆颌 */
                    let prescpOverbiteStr = "保持";
                    if (entrust.prescpOverbite == 1) {
                        entrust.prescpOverbite = "保持";
                        // console.log(entrust.prescpOverbite);
                    } else if (entrust.prescpOverbite == 2) {
                        entrust.prescpOverbite = "改善";
                        prescpOverbiteStr = "改善" + entrust.prescpOverbiteData + "mm";
                        // console.log(entrust.prescpOverbiteData);
                    }
                    /* 覆盖 */
                    let prescpOverjetStr = "保持";
                    if (entrust.prescpOverjet == 1) {
                        entrust.prescpOverjet = "保持";
                    } else if (entrust.prescpOverjet == 2) {
                        entrust.prescpOverjet = "改善";
                        prescpOverjetStr = "改善" + entrust.prescpOverjetData + "mm";
                        // console.log(entrust.prescpOverjetData);
                    }

                    /* 磨牙关系2 右侧*/
                    let prescpMolarRightStr = "保持";
                    if (entrust.prescpMolarRight == 1) {
                        entrust.prescpMolarRight = "保持";
                    } else if (entrust.prescpMolarRight == 2) {
                        entrust.prescpMolarRight = "理想";
                        prescpMolarRightStr = "理想";
                    } else if (entrust.prescpMolarRight == 3) {
                        entrust.prescpMolarRight = "改善";
                        prescpMolarRightStr = "改善" + entrust.prescpMolarRightData + "mm";

                        if (entrust.prescpMolarRightData > 0) {
                            entrust.prescpMolarRightData = "近中(+)" + entrust.prescpMolarRightData;
                            prescpMolarRightStr = "改善" + entrust.prescpMolarRightData + "mm";
                        } else if (entrust.prescpMolarRightData < 0) {
                            entrust.prescpMolarRightData = "远中(-)" + entrust.prescpMolarRightData;
                            prescpMolarRightStr = "改善" + entrust.prescpMolarRightData + "mm";
                        }
                    }

                    /* 磨牙关系2 左侧*/
                    let prescpMolarLeftStr = "保持";
                    if (entrust.prescpMolarLeft == 1) {
                        entrust.prescpMolarLeft = "保持";
                    } else if (entrust.prescpMolarLeft == 2) {
                        entrust.prescpMolarLeft = "理想";
                        prescpMolarLeftStr = "理想";
                    } else if (entrust.prescpMolarLeft == 3) {
                        entrust.prescpMolarLeft = "改善";
                        prescpMolarLeftStr = "改善" + entrust.prescpMolarLeftData + "mm";

                        if (entrust.prescpMolarLeftData > 0) {
                            entrust.prescpMolarLeftData = "近中(+)" + entrust.prescpMolarLeftData;
                            prescpMolarLeftStr = "改善" + entrust.prescpMolarLeftData + "mm";
                        } else if (entrust.prescpMolarLeftData < 0) {
                            entrust.prescpMolarLeftData = "远中(-)" + entrust.prescpMolarLeftData;
                            prescpMolarLeftStr = "改善" + entrust.prescpMolarLeftData + "mm";
                        }
                        entrust.prescpMolarLeftData;
                    }
                    /* 尖牙关系2 右侧*/
                    let prescpCanineRightStr = "保持";
                    if (entrust.prescpCanineRight == 1) {
                        entrust.prescpCanineRight = "保持";
                    } else if (entrust.prescpCanineRight == 2) {
                        entrust.prescpCanineRight = "理想";
                        prescpCanineRightStr = "理想";
                    } else if (entrust.prescpCanineRight == 3) {
                        entrust.prescpCanineRight = "改善";
                        prescpCanineRightStr = "改善" + entrust.prescpCanineRightData + "mm";

                        if (entrust.prescpCanineRightData > 0) {
                            entrust.prescpCanineRightData = "近中(+)" + entrust.prescpCanineRightData;
                            prescpCanineRightStr = "改善" + entrust.prescpCanineRightData + "mm";
                        } else if (entrust.prescpCanineRightData < 0) {
                            entrust.prescpCanineRightData = "远中(-)" + entrust.prescpCanineRightData;
                            prescpCanineRightStr = "改善" + entrust.prescpCanineRightData + "mm";
                        }
                    }
                    /* 尖牙关系2 左侧*/
                    let prescpCanineLeftStr = "保持";
                    if (entrust.prescpCanineLeft == 1) {
                        entrust.prescpCanineLeft = "保持";
                    } else if (entrust.prescpCanineLeft == 2) {
                        entrust.prescpCanineLeft = "理想";
                        prescpCanineLeftStr = "理想";
                    } else if (entrust.prescpCanineLeft == 3) {
                        entrust.prescpCanineLeft = "改善";
                        prescpCanineLeftStr = "改善" + entrust.prescpCanineLeftData + "mm";

                        if (entrust.prescpCanineLeftData > 0) {
                            entrust.prescpCanineLeftData = "近中(+)" + entrust.prescpCanineLeftData;
                            prescpCanineLeftStr = "改善" + entrust.prescpCanineLeftData + "mm";
                        } else if (entrust.prescpCanineLeftData < 0) {
                            entrust.prescpCanineLeftData = "远中(-)" + entrust.prescpCanineLeftData;
                            prescpCanineLeftStr = "改善" + entrust.prescpCanineLeftData + "mm";
                        }
                    }
                    /* 后牙反/锁 颌 */
                    if (entrust.prescpPosteriorCrossBite == 0) {
                        entrust.prescpPosteriorCrossBite = "";
                    } else if (entrust.prescpPosteriorCrossBite == 1) {
                        entrust.prescpPosteriorCrossBite = "保持";
                    } else if (entrust.prescpPosteriorCrossBite == 2) {
                        entrust.prescpPosteriorCrossBite = "纠正";
                    }
                    /* 中线关系 上颌*/
                    if (entrust.fprescpUpperMiddle == 0) {
                        entrust.fprescpUpperMiddle = "";
                    } else if (entrust.fprescpUpperMiddle == 34) {
                        entrust.fprescpUpperMiddle = "保持";
                    } else if (entrust.fprescpUpperMiddle > 0) {
                        entrust.fprescpUpperMiddle = "左" + entrust.fprescpUpperMiddle + "mm"
                    } else if (entrust.fprescpUpperMiddle < 0) {
                        entrust.fprescpUpperMiddle = "右" + entrust.fprescpUpperMiddle + "mm"
                    }


                    /* 中线关系 下颌*/
                    if (entrust.fprescpLowerMiddle == 0) {
                        entrust.fprescpLowerMiddle = "";
                    } else if (entrust.fprescpLowerMiddle == 34) {
                        entrust.fprescpLowerMiddle = "保持";
                    } else if (entrust.fprescpLowerMiddle > 0) {
                        entrust.fprescpLowerMiddle = "左" + entrust.fprescpLowerMiddle + "mm"
                    } else if (entrust.fprescpLowerMiddle < 0) {
                        entrust.fprescpLowerMiddle = "右" + entrust.fprescpLowerMiddle + "mm"
                    }
                    /* 牙列间隙 */
                    if (entrust.nprescpSpacing == 0) {
                        entrust.nprescpSpacing = "";
                    } else if (entrust.nprescpSpacing == 1) {
                        entrust.nprescpSpacing = "全部关闭";
                    } else if (entrust.nprescpSpacing == 2) {
                        entrust.nprescpSpacing = "保留间隙";
                    }
                    // var textArr = ["拥挤", "牙列间隙", "前突", "开𬌗", "前牙反𬌗", "后牙反𬌗", "深覆𬌗", "深覆盖", "后牙锁𬌗"];

                    var arr = calculator(entrust.diagnosisType);
                    console.log(entrust.diagnosisType);

                    var strFour = "";
                    console.log(strFour, arr);
                    arr.reverse().forEach(value => {
                        strFour += textArr[value] + "，";
                    });

                    console.log(prescpMolarRightStr);


                    strFour = strFour.substr(0, strFour.length - 1);
                    var entrustArr = [`
                        <div class="back">
                                                            <img src="img/fh.png" alt="">
                        </div>
                                                            <div class="diagnose">
                                                                <p>委托加工单一诊断</p>
                                                                <div class="teeth">
                                                                    <p>磨牙关系</p>
                                                                    <div class="teeth-t" id="relationBtnTop">
                                                                        <p>左侧</p>
                                                                        <div>
                                                                            <span>${entrust.molarLeft}</span>
                                                                           
                                    </div>

                                                                        </div>
                                                                        <div class="teeth-t" id="relationBtnBottom">
                                                                            <p>右侧</p>
                                                                            <div>
                                                                                <span>${entrust.molarRight}</span>
                                                                                
                                    </div>

                                                                            </div>
                                                                        </div>
                                                                        <div class="teeth">
                                                                            <p>尖牙关系</p>
                                                                            <div class="teeth-t" id="canineBtnL">
                                                                                <p>左侧</p>
                                                                                <div>
                                                                                    <span>${entrust.canineLeft}</span>
                                                                                   
                                    </div>

                                                                                </div>
                                                                                <div class="teeth-t" id="canineBtnR">
                                                                                    <p>右侧</p>
                                                                                    <div>
                                                                                        <span>${entrust.canineRight}</span>
                                                                                       
                                    </div>

                                                                                    </div>
                                                                                </div>
                                                                                <div class="teeth-b" id="malocclusionBtn">
                                                                                    <p>病例分类</p>
                                                                                    <div>
                                                                                        <span>${strFour}</span>
                                                                                       
                                </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="diagnose">
                                                                                    <p>委托加工单一矫治目标</p>
                                                                                    <div class="teeth-b" id="correctBtn">
                                                                                        <p>矫治牙列</p>
                                                                                        <div>
                                                                                            <span>${entrust.prescpDentition}</span>
                                                                                          
                                </div>

                                                                                        </div>
                                                                                        <div class="teeth-b">
                                                                                            <p>覆𬌗</p>
                                                                                            <div id="coveringBtn">
                                                                                                <span>${prescpOverbiteStr}</span>
                                                                                            </div>

                                                                                        </div>
                                                                                        <div class="teeth-b">
                                                                                            <p>覆盖</p>
                                                                                            <div id="coverageBtn">
                                                                                                <span>${prescpOverjetStr}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="teeth">
                                                                                            <p>磨牙关系(上颌第一磨牙相对下颌第一磨牙的位置关系)</p>
                                                                                            <div class="teeth-t" id="molarBtnL">
                                                                                                <p>左侧</p>
                                                                                                <div>
                                                                                                    <span>${prescpMolarLeftStr}</span>
                                                                                                   
                                    </div>
                                                                                                </div>
                                                                                                <div class="teeth-t" id="molarBtnR">
                                                                                                    <p>右侧</p>
                                                                                                    <div>
                                                                                                        <span>${prescpMolarRightStr}</span>
                                                                                                       
                                    </div>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div class="teeth">
                                                                                                    <p>尖牙关系(上颌尖牙相对下颌尖牙的位置关系)</p>
                                                                                                    <div class="teeth-t" id="cuspidBtnL">
                                                                                                        <p>左侧</p>
                                                                                                        <div>
                                                                                                            <span>${prescpCanineLeftStr}</span>
                                                                                                            
                                    </div>

                                                                                                        </div>
                                                                                                        <div class="teeth-t" id="cuspidBtnR">
                                                                                                            <p>右侧</p>
                                                                                                            <div>
                                                                                                                <span>${prescpCanineRightStr}</span>
                                                                                                               
                                    </div>

                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="teeth-b" id="backteethBtn">
                                                                                                            <p>后牙反𬌗</p>
                                                                                                            <div>
                                                                                                                <span>${entrust.prescpPosteriorCrossBite}</span>
                                                                                                                
                                </div>

                                                                                                            </div>
                                                                                                            <div class="clearance">
                                                                                                                <p>间隙获得 (左右滑动选择更多牙位)</p>
                                                                                                                <p>
                                                                                                                    <span> <span>EX</span> 拔牙</span>
                                                                                                                    <span> <span>EXP</span> 扩弓</span>
                                                                                                                    <span> <span>DM</span> 磨牙</span>
                                                                                                                </p>
                                                                                                                <p>
                                                                                                                    <span>IPR</span> 可邻面去釉牙齿
                                </p>
                                                                                                                <div class="teeths w">
                                                                                                                    <p class="right">右</p>
                                                                                                                    <div class="teethbox" id="toothJudge">
                                                                                                                        <ul class="up">
                                                                                                                            <li>
                                                                                                                                <p></p>
                                                                                                                                <img src="img/18.png">
                                                                                                                                    <a href="javascript:;">18</a>
                                            </li>
                                                                                                                                <li>
                                                                                                                                    <p></p>
                                                                                                                                    <img src="img/17.png">
                                                                                                                                        <a href="javascript:;">17</a>
                                            </li>
                                                                                                                                    <li>
                                                                                                                                        <p></p>
                                                                                                                                        <img src="img/16.png">
                                                                                                                                            <a href="javascript:;">16</a>
                                            </li>
                                                                                                                                        <li>
                                                                                                                                            <p></p>
                                                                                                                                            <img src="img/15.png">
                                                                                                                                                <a href="javascript:;">15</a>
                                            </li>
                                                                                                                                            <li>
                                                                                                                                                <p></p>
                                                                                                                                                <img src="img/14.png">
                                                                                                                                                    <a href="javascript:;">14</a>
                                            </li>
                                                                                                                                                <li>
                                                                                                                                                    <p></p>
                                                                                                                                                    <img src="img/13.png">
                                                                                                                                                        <a href="javascript:;">13</a>
                                            </li>
                                                                                                                                                    <li>
                                                                                                                                                        <p></p>
                                                                                                                                                        <img src="img/12.png">
                                                                                                                                                            <a href="javascript:;">12</a>
                                            </li>
                                                                                                                                                        <li>
                                                                                                                                                            <p></p>
                                                                                                                                                            <img src="img/11.png">
                                                                                                                                                                <a href="javascript:;">11</a>
                                            </li>
                                                                                                                                                            <li>
                                                                                                                                                                <p></p>
                                                                                                                                                                <img src="img/21.png">
                                                                                                                                                                    <a href="javascript:;">21</a>
                                            </li>
                                                                                                                                                                <li>
                                                                                                                                                                    <p></p>
                                                                                                                                                                    <img src="img/22.png">
                                                                                                                                                                        <a href="javascript:;">22</a>
                                            </li>
                                                                                                                                                                    <li>
                                                                                                                                                                        <p></p>
                                                                                                                                                                        <img src="img/23.png">
                                                                                                                                                                            <a href="javascript:;">23</a>
                                            </li>
                                                                                                                                                                        <li>
                                                                                                                                                                            <p></p>
                                                                                                                                                                            <img src="img/24.png">
                                                                                                                                                                                <a href="javascript:;">24</a>
                                            </li>
                                                                                                                                                                            <li>
                                                                                                                                                                                <p></p>
                                                                                                                                                                                <img src="img/25.png">
                                                                                                                                                                                    <a href="javascript:;">25</a>
                                            </li>
                                                                                                                                                                                <li>
                                                                                                                                                                                    <p></p>
                                                                                                                                                                                    <img src="img/26.png">
                                                                                                                                                                                        <a href="javascript:;">26</a>
                                            </li>
                                                                                                                                                                                    <li>
                                                                                                                                                                                        <p></p>
                                                                                                                                                                                        <img src="img/27.png">
                                                                                                                                                                                            <a href="javascript:;">27</a>
                                            </li>
                                                                                                                                                                                        <li>
                                                                                                                                                                                            <p></p>
                                                                                                                                                                                            <img src="img/28.png">
                                                                                                                                                                                                <a href="javascript:;">28</a>
                                            </li>
                                        </ul>
                                                                                                                                                                                        <ul class="down">
                                                                                                                                                                                            <li>
                                                                                                                                                                                                <a href="javascript:;">48</a>
                                                                                                                                                                                                <img src="img/48.png">
                                                                                                                                                                                                    <p></p>
                                            </li>
                                                                                                                                                                                                <li>
                                                                                                                                                                                                    <a href="javascript:;">47</a>
                                                                                                                                                                                                    <img src="img/47.png">
                                                                                                                                                                                                        <p></p>
                                            </li>
                                                                                                                                                                                                    <li>
                                                                                                                                                                                                        <a href="javascript:;">46</a>
                                                                                                                                                                                                        <img src="img/46.png">
                                                                                                                                                                                                            <p></p>
                                            </li>
                                                                                                                                                                                                        <li>
                                                                                                                                                                                                            <a href="javascript:;">45</a>
                                                                                                                                                                                                            <img src="img/45.png">
                                                                                                                                                                                                                <p></p>
                                            </li>
                                                                                                                                                                                                            <li>
                                                                                                                                                                                                                <a href="javascript:;">44</a>
                                                                                                                                                                                                                <img src="img/44.png">
                                                                                                                                                                                                                    <p></p>
                                            </li>
                                                                                                                                                                                                                <li>
                                                                                                                                                                                                                    <a href="javascript:;">43</a>
                                                                                                                                                                                                                    <img src="img/43.png">
                                                                                                                                                                                                                        <p></p>
                                            </li>
                                                                                                                                                                                                                    <li>
                                                                                                                                                                                                                        <a href="javascript:;">42</a>
                                                                                                                                                                                                                        <img src="img/42.png">
                                                                                                                                                                                                                            <p></p>
                                            </li>
                                                                                                                                                                                                                        <li>
                                                                                                                                                                                                                            <a href="javascript:;">41</a>
                                                                                                                                                                                                                            <img src="img/41.png">
                                                                                                                                                                                                                                <p></p>
                                            </li>
                                                                                                                                                                                                                            <li>
                                                                                                                                                                                                                                <a href="javascript:;">31</a>
                                                                                                                                                                                                                                <img src="img/31.png">
                                                                                                                                                                                                                                    <p></p>
                                            </li>
                                                                                                                                                                                                                                <li>
                                                                                                                                                                                                                                    <a href="javascript:;">32</a>
                                                                                                                                                                                                                                    <img src="img/32.png">
                                                                                                                                                                                                                                        <p></p>
                                            </li>
                                                                                                                                                                                                                                    <li>
                                                                                                                                                                                                                                        <a href="javascript:;">33</a>
                                                                                                                                                                                                                                        <img src="img/33.png">
                                                                                                                                                                                                                                            <p></p>
                                            </li>
                                                                                                                                                                                                                                        <li>
                                                                                                                                                                                                                                            <a href="javascript:;">34</a>
                                                                                                                                                                                                                                            <img src="img/34.png">
                                                                                                                                                                                                                                                <p></p>
                                            </li>
                                                                                                                                                                                                                                            <li>
                                                                                                                                                                                                                                                <a href="javascript:;">35</a>
                                                                                                                                                                                                                                                <img src="img/35.png">
                                                                                                                                                                                                                                                    <p></p>
                                            </li>
                                                                                                                                                                                                                                                <li>
                                                                                                                                                                                                                                                    <a href="javascript:;">36</a>
                                                                                                                                                                                                                                                    <img src="img/36.png">
                                                                                                                                                                                                                                                        <p></p>
                                            </li>
                                                                                                                                                                                                                                                    <li>
                                                                                                                                                                                                                                                        <a href="javascript:;">37</a>
                                                                                                                                                                                                                                                        <img src="img/37.png">
                                                                                                                                                                                                                                                            <p></p>
                                            </li>
                                                                                                                                                                                                                                                        <li>
                                                                                                                                                                                                                                                            <a href="javascript:;">38</a>
                                                                                                                                                                                                                                                            <img src="img/38.png">
                                                                                                                                                                                                                                                                <p></p>
                                            </li>
                                        </ul>
                                                                                                                                                                                                                                                        <div class="vertical"></div>
                                                                                                                                                                                                                                                        <div class="level"></div>
                                    </div>
                                                                                                                                                                                                                                                    <p class="left">左</p>
                                </div>
                            </div>

                                                                                                                                                                                                                                            <div class="special">
                                                                                                                                                                                                                                                <p>特殊要求 (左右滑动选择更多牙位)</p>
                                                                                                                                                                                                                                                <p>
                                                                                                                                                                                                                                                    <span> <span>NM</span> 不可移动牙齿</span>
                                                                                                                                                                                                                                                    <span> <span>NA</span> 无附件</span>
                                                                                                                                                                                                                                                    <span> <span>M</span> 缺失牙</span>
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                <div class="teeths">
                                                                                                                                                                                                                                                    <p class="right">右</p>
                                                                                                                                                                                                                                                    <div class="teethbox" id="teethboxJudge">
                                                                                                                                                                                                                                                        <ul class="up">
                                                                                                                                                                                                                                                            <li>
                                                                                                                                                                                                                                                                <p></p>
                                                                                                                                                                                                                                                                <img src="img/18.png">
                                                                                                                                                                                                                                                                    <a href="javascript:;">18</a>
                                            </li>
                                                                                                                                                                                                                                                                <li>
                                                                                                                                                                                                                                                                    <p></p>
                                                                                                                                                                                                                                                                    <img src="img/17.png">
                                                                                                                                                                                                                                                                        <a href="javascript:;">17</a>
                                            </li>
                                                                                                                                                                                                                                                                    <li>
                                                                                                                                                                                                                                                                        <p></p>
                                                                                                                                                                                                                                                                        <img src="img/16.png">
                                                                                                                                                                                                                                                                            <a href="javascript:;">16</a>
                                            </li>
                                                                                                                                                                                                                                                                        <li>
                                                                                                                                                                                                                                                                            <p></p>
                                                                                                                                                                                                                                                                            <img src="img/15.png">
                                                                                                                                                                                                                                                                                <a href="javascript:;">15</a>
                                            </li>
                                                                                                                                                                                                                                                                            <li>
                                                                                                                                                                                                                                                                                <p></p>
                                                                                                                                                                                                                                                                                <img src="img/14.png">
                                                                                                                                                                                                                                                                                    <a href="javascript:;">14</a>
                                            </li>
                                                                                                                                                                                                                                                                                <li>
                                                                                                                                                                                                                                                                                    <p></p>
                                                                                                                                                                                                                                                                                    <img src="img/13.png">
                                                                                                                                                                                                                                                                                        <a href="javascript:;">13</a>
                                            </li>
                                                                                                                                                                                                                                                                                    <li>
                                                                                                                                                                                                                                                                                        <p></p>
                                                                                                                                                                                                                                                                                        <img src="img/12.png">
                                                                                                                                                                                                                                                                                            <a href="javascript:;">12</a>
                                            </li>
                                                                                                                                                                                                                                                                                        <li>
                                                                                                                                                                                                                                                                                            <p></p>
                                                                                                                                                                                                                                                                                            <img src="img/11.png">
                                                                                                                                                                                                                                                                                                <a href="javascript:;">11</a>
                                            </li>
                                                                                                                                                                                                                                                                                            <li>
                                                                                                                                                                                                                                                                                                <p></p>
                                                                                                                                                                                                                                                                                                <img src="img/21.png">
                                                                                                                                                                                                                                                                                                    <a href="javascript:;">21</a>
                                            </li>
                                                                                                                                                                                                                                                                                                <li>
                                                                                                                                                                                                                                                                                                    <p></p>
                                                                                                                                                                                                                                                                                                    <img src="img/22.png">
                                                                                                                                                                                                                                                                                                        <a href="javascript:;">22</a>
                                            </li>
                                                                                                                                                                                                                                                                                                    <li>
                                                                                                                                                                                                                                                                                                        <p></p>
                                                                                                                                                                                                                                                                                                        <img src="img/23.png">
                                                                                                                                                                                                                                                                                                            <a href="javascript:;">23</a>
                                            </li>
                                                                                                                                                                                                                                                                                                        <li>
                                                                                                                                                                                                                                                                                                            <p></p>
                                                                                                                                                                                                                                                                                                            <img src="img/24.png">
                                                                                                                                                                                                                                                                                                                <a href="javascript:;">24</a>
                                            </li>
                                                                                                                                                                                                                                                                                                            <li>
                                                                                                                                                                                                                                                                                                                <p></p>
                                                                                                                                                                                                                                                                                                                <img src="img/25.png">
                                                                                                                                                                                                                                                                                                                    <a href="javascript:;">25</a>
                                            </li>
                                                                                                                                                                                                                                                                                                                <li>
                                                                                                                                                                                                                                                                                                                    <p></p>
                                                                                                                                                                                                                                                                                                                    <img src="img/26.png">
                                                                                                                                                                                                                                                                                                                        <a href="javascript:;">26</a>
                                            </li>
                                                                                                                                                                                                                                                                                                                    <li>
                                                                                                                                                                                                                                                                                                                        <p></p>
                                                                                                                                                                                                                                                                                                                        <img src="img/27.png">
                                                                                                                                                                                                                                                                                                                            <a href="javascript:;">27</a>
                                            </li>
                                                                                                                                                                                                                                                                                                                        <li>
                                                                                                                                                                                                                                                                                                                            <p></p>
                                                                                                                                                                                                                                                                                                                            <img src="img/28.png">
                                                                                                                                                                                                                                                                                                                                <a href="javascript:;">28</a>
                                            </li>
                                        </ul>
                                                                                                                                                                                                                                                                                                                        <ul class="down toothBottm">
                                                                                                                                                                                                                                                                                                                            <li>
                                                                                                                                                                                                                                                                                                                                <a href="javascript:;">48</a>
                                                                                                                                                                                                                                                                                                                                <img src="img/48.png">
                                                                                                                                                                                                                                                                                                                                    <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                <li>
                                                                                                                                                                                                                                                                                                                                    <a href="javascript:;">47</a>
                                                                                                                                                                                                                                                                                                                                    <img src="img/47.png">
                                                                                                                                                                                                                                                                                                                                        <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                    <li>
                                                                                                                                                                                                                                                                                                                                        <a href="javascript:;">46</a>
                                                                                                                                                                                                                                                                                                                                        <img src="img/46.png">
                                                                                                                                                                                                                                                                                                                                            <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                        <li>
                                                                                                                                                                                                                                                                                                                                            <a href="javascript:;">45</a>
                                                                                                                                                                                                                                                                                                                                            <img src="img/45.png">
                                                                                                                                                                                                                                                                                                                                                <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                            <li>
                                                                                                                                                                                                                                                                                                                                                <a href="javascript:;">44</a>
                                                                                                                                                                                                                                                                                                                                                <img src="img/44.png">
                                                                                                                                                                                                                                                                                                                                                    <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                                <li>
                                                                                                                                                                                                                                                                                                                                                    <a href="javascript:;">43</a>
                                                                                                                                                                                                                                                                                                                                                    <img src="img/43.png">
                                                                                                                                                                                                                                                                                                                                                        <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                                    <li>
                                                                                                                                                                                                                                                                                                                                                        <a href="javascript:;">42</a>
                                                                                                                                                                                                                                                                                                                                                        <img src="img/42.png">
                                                                                                                                                                                                                                                                                                                                                            <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                                        <li>
                                                                                                                                                                                                                                                                                                                                                            <a href="javascript:;">41</a>
                                                                                                                                                                                                                                                                                                                                                            <img src="img/41.png">
                                                                                                                                                                                                                                                                                                                                                                <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                                            <li>
                                                                                                                                                                                                                                                                                                                                                                <a href="javascript:;">31</a>
                                                                                                                                                                                                                                                                                                                                                                <img src="img/31.png">
                                                                                                                                                                                                                                                                                                                                                                    <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                                                <li>
                                                                                                                                                                                                                                                                                                                                                                    <a href="javascript:;">32</a>
                                                                                                                                                                                                                                                                                                                                                                    <img src="img/32.png">
                                                                                                                                                                                                                                                                                                                                                                        <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                                                    <li>
                                                                                                                                                                                                                                                                                                                                                                        <a href="javascript:;">33</a>
                                                                                                                                                                                                                                                                                                                                                                        <img src="img/33.png">
                                                                                                                                                                                                                                                                                                                                                                            <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                                                        <li>
                                                                                                                                                                                                                                                                                                                                                                            <a href="javascript:;">34</a>
                                                                                                                                                                                                                                                                                                                                                                            <img src="img/34.png">
                                                                                                                                                                                                                                                                                                                                                                                <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                                                            <li>
                                                                                                                                                                                                                                                                                                                                                                                <a href="javascript:;">35</a>
                                                                                                                                                                                                                                                                                                                                                                                <img src="img/35.png">
                                                                                                                                                                                                                                                                                                                                                                                    <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                                                                <li>
                                                                                                                                                                                                                                                                                                                                                                                    <a href="javascript:;">36</a>
                                                                                                                                                                                                                                                                                                                                                                                    <img src="img/36.png">
                                                                                                                                                                                                                                                                                                                                                                                        <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                                                                    <li>
                                                                                                                                                                                                                                                                                                                                                                                        <a href="javascript:;">37</a>
                                                                                                                                                                                                                                                                                                                                                                                        <img src="img/37.png">
                                                                                                                                                                                                                                                                                                                                                                                            <p></p>
                                            </li>
                                                                                                                                                                                                                                                                                                                                                                                        <li>
                                                                                                                                                                                                                                                                                                                                                                                            <a href="javascript:;">38</a>
                                                                                                                                                                                                                                                                                                                                                                                            <img src="img/38.png">
                                                                                                                                                                                                                                                                                                                                                                                                <p></p>
                                            </li>
                                        </ul>
                                                                                                                                                                                                                                                                                                                                                                                        <div class="vertical"></div>
                                                                                                                                                                                                                                                                                                                                                                                        <div class="level"></div>
                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                    <p class="left">左</p>
                                </div>
                            </div>

                                                                                                                                                                                                                                                                                                                                                                            <div class="teeth">
                                                                                                                                                                                                                                                                                                                                                                                <p>中线</p>
                                                                                                                                                                                                                                                                                                                                                                                <div class="teeth-t" id="centerLineBtnT">
                                                                                                                                                                                                                                                                                                                                                                                    <p>上颌</p>
                                                                                                                                                                                                                                                                                                                                                                                    <div>
                                                                                                                                                                                                                                                                                                                                                                                        <span>${entrust.fprescpUpperMiddle}</span>
                                                                                                                                                                                                                                                                                                                                                                                        
                                    </div>

                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                    <div class="teeth-t" id="centerLineBtnB">
                                                                                                                                                                                                                                                                                                                                                                                        <p>下颌</p>
                                                                                                                                                                                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                                                                                                                                                            <span>${entrust.fprescpLowerMiddle}</span>
                                                                                                                                                                                                                                                                                                                                                                                            
                                    </div>

                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                    <div class="teeth-b" id="gapBtn">
                                                                                                                                                                                                                                                                                                                                                                                        <p>牙列间隙</p>
                                                                                                                                                                                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                                                                                                                                                            <span>${entrust.nprescpSpacing}</span>
                                                                                                                                                                                                                                                                                                                                                                                            
                                </div>

                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                        <div class="explain">
                                                                                                                                                                                                                                                                                                                                                                                            <p>附加说明</p>
                                                                                                                                                                                                                                                                                                                                                                                            <div>${entrust.strPrescpInstruction}</div>
                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                    </div>`];
                    $("#consignment").html(entrustArr.join(""))
                    /* 间隙获得 */
                    entrust.clearanceVOS.forEach(value => {
                        let teethIdx = app.teethArr.indexOf(value.teethIndex);
                        if (value.ex == true) {
                            $("#toothJudge").get(0).querySelectorAll("li")[teethIdx].querySelector("p").innerHTML += "<span>EX</span>";
                        }
                        if (value.exp == true) {
                            $("#toothJudge").get(0).querySelectorAll("li")[teethIdx].querySelector("p").innerHTML += "<span>EXP</span>";
                        }
                        if (value.dm == true) {
                            $("#toothJudge").get(0).querySelectorAll("li")[teethIdx].querySelector("p").innerHTML += "<span>DM</span>";
                        }
                        if (value.ipr == true) {
                            $("#toothJudge").get(0).querySelectorAll("li")[teethIdx].querySelector("p").innerHTML += "<span>IPR</span>";
                        }
                    })
                    /* 磨牙关系 */
                    entrust.teethVOS.forEach(value => {
                        let teethIdx = app.teethArr.indexOf(value.teethIndex);
                        if (value.nm == true) {
                            $("#teethboxJudge").get(0).querySelectorAll("li")[teethIdx].querySelector("p").innerHTML += "<span>NM</span>";;
                        }
                        if (value.na == true) {
                            $("#teethboxJudge").get(0).querySelectorAll("li")[teethIdx].querySelector("p").innerHTML += "<span>NA</span>";
                        }
                        if (value.m == true) {
                            $("#teethboxJudge").get(0).querySelectorAll("li")[teethIdx].querySelector("p").innerHTML += "<span>M</span>";
                        }
                    })
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
    })
    /* 点击委托加工单中的返回按钮 委托加工单页面隐藏 病例详情页面显示 */
    $("#consignment").on("click", ".back", function () {
        $("#consignment").hide();
        $(".case-particulars").show();
    })

    /* 委托加工单 结束 */



    /* ***********************************************************保持器 开始 *************************************************************/

    /* 点击选择类型  术前保持器弹层显示 */
    let genresObj = {};
    $("#innerPreoperative").parent().on("click", function () {
        $("#genres").show();
        genresObj.idx = $("#genres .choice-dental-arch .active").index();
    });
    /* 点击弹层取消 回到初始状态 */
    $("#genres .cancel").on("click", function () {
        $("#genres .choice-dental-arch li").eq(genresObj.idx).addClass("active").siblings().removeClass("active");
    })

    /* 给术前保持器中的li注册点击事件 添加样式 */
    $("#genres li").on("click", function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    })
    /* 点击术前保持器中的保存按钮 更改选择类型中的文字 */
    $("#genres .save").on("click", function () {
        $("#innerPreoperative").parent().children("span:nth-of-type(2)").text($("#genres ul .active").text());
        $("#genres").hide();
    })
    /* 点击选择牙弓的小箭头 选择牙弓弹层显示 */
    $("#innerDentalArch").parent().on("click", function () {
        $("#dentalArch").show();
        dentalArchObj.idx = $("#dentalArch .choice-dental-arch .active").index();
    });
    /* 取消弹层展示当前选中项 */
    $("#dentalArch .cancel").on("click", function () {
        $("#dentalArch .choice-dental-arch li").eq(dentalArchObj.idx).addClass("active").siblings().removeClass("active");
    })

    // /* 点击设计说明上颌 设计说明上颌弹层显示 */
    // let employTopLayObj = {};
    // $("#employTop").on("click", function () {
    //     $("#employTopLay").show();
    //     console.log(employTopLayObj.idx);

    //     employTopLayObj.idx = $("#employTopLay .design-specification .active").index();
    // });

    // $("#employTopLay .cancel").on("click",function(){
    //     $("#employTopLay .design-specification li").eq(employTopLayObj.idx).addClass("active").siblings().removeClass("active");
    // })


    /* 点击特殊说明选项 看是否能出牙位弹窗 */
    $("#maintainStartCtrl  .special-tips li").on("click", function (e) {
        // e.stopPropagation();
        $(this).addClass("active").siblings().removeClass("active");
    });
    /* 点击特殊说明小箭头 特殊说明弹层显示 */
    let specialLayUpArr = [];
    let specialLayDownArr = [];
    $("#special").parent().on("click", function () {
        if ($("#maintainStartCtrl  .special-tips li.active").index() != 0) {

            $("#specialLay").show();
            specialLayUpArr = [];
            specialLayDownArr = [];
            [...$("#specialLay .up li")].forEach((item, idx) => {
                if ($(item).hasClass("active")) {
                    specialLayUpArr.push(idx);
                }
            });
            [...$("#specialLay .down li")].forEach((item, idx) => {
                if ($(item).hasClass("active")) {
                    specialLayDownArr.push(idx);
                }
            });
        } else {
            $("#specialLay li").removeClass("active");
            $("#maintainStartCtrl li .elect").text("选择需要放置假牙空泡的牙位");
        }
    });

    /* 弹层取消 */
    $("#specialLay .cancel").on("click", function () {
        console.log(specialLayUpArr, specialLayDownArr);

        $("#specialLay .up li").removeClass("active");
        $("#specialLay .down li").removeClass("active");
        specialLayUpArr.forEach(item => {
            $("#specialLay .up li").eq(item).addClass("active");
        });
        specialLayDownArr.forEach(item => {
            $("#specialLay .down li").eq(item).addClass("active");
        });

    })

    /* 点击固定舌侧保持器中的小箭头 固定舌侧保持器弹层显示 */
    let lingualSideObj = {};
    $("#immobilization").parent().on("click", function () {
        $("#lingualSide").show();
        lingualSideObj.idx = $("#lingualSide .retaining-appliance .active").index();
    });
    /* 给点击li进行排他 */
    $("#lingualSide .cancel").on("click", function () {
        $("#lingualSide .retaining-appliance li").eq(lingualSideObj.idx).addClass("active").siblings().removeClass("active");
    });

    /* 给点击li进行排他 */
    $("#lingualSide li").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
    });
    $("#lingualSide .save").on("click", function () {
        $("#immobilization").parent().children("span:nth-of-type(2)").text($("#lingualSide ul .active").text());
        $("#lingualSide").hide();
    })
    /* 给特殊说明点击的li添加样式 */
    $("#specialLay  li").on("click", function () {
        $(this).toggleClass("active");
    });
    /* 记住桥体编号 */
    window.bridgesArr = [];

    /* 点击特殊说明上的确认 将选择的牙齿编号输出到特殊说明模块上 */
    $("#specialLay .save").on("click", function () {
        let activeNum = document.querySelectorAll("#specialLay .active");
        let activeArr = [];
        for (var i = 0; i < activeNum.length; i++) {
            activeArr.push(activeNum[i].querySelector("a").innerText);
        }
        window.bridgesArr = activeArr;
        if (activeArr.length > 0) {
            $("#maintainStartCtrl li .elect").text(activeArr.join("、"));
        } else {
            $("#maintainStartCtrl li .elect").text("选择需要放置桥体的牙位");
        }
        $("#specialLay").hide();
    });


    /* 新建保持器提交 */
    $("#maintainStartCtrl .submit").on("click", function () {

        /* ajax请求所需的参数 */
        let ctrlPostData = {
            caseStageId: 1,
            caseInfoId: caseInfoId,
            type: null,
            dentalArch: null,
            upSteps: 0,
            downSteps: 0,
            upArchCount: null,
            downArchCount: null,
            zhengLiDesigns: [],
            specialDescription: 0,
            bridges: [],
            fixedRetainers: [],
            addressId: null,
            stageCount: presentStageCount,
            stageName: presentStageName,
        };

        /* 选择类型 */
        ctrlPostData.type = $("#genres .choice-dental-arch .active").index() + 1;

        /* 选择牙弓 */
        ctrlPostData.dentalArch = $("#dentalArch .choice-dental-arch .active").index() + 1;

        /* 上颌数量 下颌数量 */
        ctrlPostData.upArchCount = Number($("#maintainStartCtrl .list-number").eq(0).find("input").val());
        ctrlPostData.downArchCount = Number($("#maintainStartCtrl .list-number").eq(1).find("input").val());

        ctrlPostData.upSteps = Number($("#employTopLay li input").val());
        ctrlPostData.downSteps = Number($("#employDownLay li input").val());

        /* 处理设计说明参数 */
        let designExplains = [];
        let activeLiArr = [];
        $("#employTopLay .design-specification li").each((k, item) => {
            if ($(item).hasClass("active")) {
                activeLiArr.push(item);
            }
        });
        let activeLiArr2 = [];
        $("#employDownLay .design-specification li").each((val, item) => {
            if ($(item).hasClass("active")) {
                activeLiArr2.push(item);
            }
        });

        let activeLiArr3 = null;
        if (judgment == 2) {
            activeLiArr3 = activeLiArr;
        } else if (judgment == 3) {
            activeLiArr3 = activeLiArr2;
        } else {
            activeLiArr3 = activeLiArr.concat(activeLiArr2);
        }
        if (activeLiArr3.length > 0) {
            activeLiArr3.forEach((item, idx) => {
                designExplains.push(
                    {
                        "effective": true,
                        "explain": $(item).children("span").text(),
                        "id": Number($(item).attr("data-id")),
                        "jaw": Number($(item).attr("data-jaw")),
                    }
                )
            })
        };

        ctrlPostData.zhengLiDesigns = designExplains;

        let bridgeArr = [];
        $("#specialLay .teeth .up li").each((k, val) => {
            if ($(val).hasClass("active")) {
                bridgeArr.push({
                    // id: k + 1,
                    id: 0,
                    zlRetainerId: 0,
                    teethIndex: app.teethArr[(k)],
                    // description: bridgesArr[bridgeArr.length],
                    stageCount: presentStageCount,
                    stageName: presentStageName,

                });
            }
        });

        $("#specialLay .teeth .down li").each((k, val) => {
            if ($(val).hasClass("active")) {
                bridgeArr.push({
                    id: 0,
                    zlRetainerId: 0,
                    // id: (k + 1) + $("#specialLay .teeth .up li").length,
                    // description: bridgesArr[bridgeArr.length],
                    teethIndex: app.teethArr[((k + $("#specialLay .teeth .up li").length))],
                    stageCount: presentStageCount,
                    stageName: presentStageName,
                });
            }
        });


        ctrlPostData.bridges = bridgeArr;
        // ctrlPostData.zhengLiBridges = bridgeArr;

        ctrlPostData.fixedRetainers.push({
            id: $("#lingualSide .retaining-appliance .active").index() + 1
        });


        /* 收获地址 id */
        ctrlPostData.addressId = $("#ctrlAmend").attr("data-id");
        // console.log(ctrlPostData);


        if (ctrlPostData.dentalArch == 1 && (!ctrlPostData.upArchCount || !ctrlPostData.downArchCount) || isNaN(ctrlPostData.upArchCount) || isNaN(ctrlPostData.downArchCount)) {
            layer.open({
                content: "请输入牙弓数量",
                skin: "msg",
                time: 2 //2秒自动关闭
            });
            return false;
        } else if (ctrlPostData.dentalArch == 2 && (!ctrlPostData.upArchCount) || isNaN(ctrlPostData.upArchCount)) {
            layer.open({
                content: "请输入牙弓数量",
                skin: "msg",
                time: 2 //2秒自动关闭
            });
            return false;
        } else if (ctrlPostData.dentalArch == 3 && (!ctrlPostData.downArchCount) || isNaN(ctrlPostData.downArchCount)) {
            layer.open({
                content: "请输入牙弓数量",
                skin: "msg",
                time: 2 //2秒自动关闭
            });
            return false;
        }

        console.log(ctrlPostData);

        /* ajax请求 将填写的数据传到服务器 */
        $.ajax({
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/zhengLiRetainer/createZhengLiRetainer",
            data: JSON.stringify(ctrlPostData),
            async: false,
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    // console.log(res.data);

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
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
            }
        });

        /* 通过ajax请求再次保持器模板的列表 */
        getSupplementMaintainList();
        $("#maintainStartCtrl").hide();
        $("#maintainStartBd").show();


    })
    /* 保持器 结束 */








    /* 周小玲 修改开始 */
    /* 获取病例列表 开始 */
    let listDataArr = [];
    let listType = 1;
    /* tab切换 按类别重新渲染病例列表 */
    let pageSize = 10;
    let listTotal = null;
    /* 将渲染病例列表的ajax请求封装为函数 方便复用 */
    let cureNum = null;
    // for (var i = 3; i > 0; i--) {
    //     listType = i;
    applyList();
    $(".case-tab-box").children("li").eq(0).children("span").text(cureNum);
    // }
    /* 将渲染病例列表的ajax请求封装为函数 方便复用 */
    function applyList () {
        $.ajax({
            type: "POST",
            async: false,
            url: app.apiUrl + "/caseInfo/getCaseAll?t=" + app.random,
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                type: listType,
                pageNum: 1,
                pageSize: pageSize,
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                if (res.code == 200) {
                    let listData = JSON.parse(res.data);
                    listTotal = listData.total;
                    // console.log(listData)
                    listDataArr = listData.rows;
                    let listliArr = [];
                    cureNum = listData.total;
                    $(".case-tab-box .active span").text(listData.total);
                    if (listDataArr.length > 0) {
                        listData.rows.forEach(item => {
                            maintenanceDeliver
                            let imgSrc = "img/xin.png";
                            if (item.follow) {
                                imgSrc = "img/star.png"
                            } else {
                                imgSrc = "img/xin.png";
                            }
                            let stateImg;
                            if (item.statusType == 2) {
                                stateImg = `<img src="img/gather.png">`
                            } else if (item.statusType == 3) {
                                stateImg = `<img src="img/quality.png">`
                            } else if (item.statusType == 4) {
                                stateImg = `<img src="img/communication.png">`
                            } else if (item.statusType == 5) {
                                stateImg = `<img src="img/state.png">`
                            } else if (item.statusType == 6) {
                                stateImg = `<img src="img/affirm.png">`
                            } else if (item.statusType == 7) {
                                stateImg = `<img src="img/face.png">`
                            } else if (item.statusType == 8) {
                                stateImg = `<img src="img/production.png">`
                            } else if (item.statusType == 9) {
                                stateImg = `<img src="img/shipments.png">`
                            } else if (item.statusType == 10) {
                                stateImg = `<img src="img/sign.png">`
                            } else if (item.statusType == 11) {
                                stateImg = `<img src="img/finish.png">`
                            }

                            let listli = `
                                <li id=${item.caseId} doctorId=${item.doctorId}>
                                    <div class="case-header">
                                        <img src="${item.headUrl && item.headUrl.startsWith("http") ? item.headUrl : "img/default-header.png"}">
                                    </div>
                                    <div class="particular">
                                        <div class="particular-msg">
                                            <p><span>${item.patientName}</span><em class="serial"></em></p>
                                            <em>${timestampToTime(parseInt(item.createTime))}</em>
                                            <p>${stateImg ? stateImg : ""}<span>${item.statusTypeName ? item.statusTypeName : ""}</span></p>
                                            <p class="remark"><span>备注:</span><em>${item.remark}</em></p>
                                        </div>
                                        <div class="attention" data-statu="${item.follow}">
                                            <img src=${imgSrc}>
                                        </div>
                                    </div>
                                </li>`
                            listliArr.push(listli);
                        });
                        $(".update").html('↓上拉刷新');
                    } else {
                        $(".update").html('暂无数据');
                    }
                    $(".case-message ul").html(listliArr.join(""));

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
    };
    getApplyNum();
    /* 获取首页列表数量 */
    function getApplyNum () {
        $.ajax({
            type: "get",
            async: false,
            url: app.apiUrl + "/caseInfo/getTypeCount?t=" + app.random,
            contentType: "application/json;charset=UTF-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                if (res.code == 200) {
                    let listData = JSON.parse(res.data);
                    $(".case-tab-box").children("li").eq(1).children("span").text(listData.handle);
                    $(".case-tab-box").children("li").eq(2).children("span").text(listData.complete);

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
    };
    // applyList();
    /* 点击tab切换 根据类型重新渲染病例列表数据 */
    $(".case-tab-box li").on("click", function () {
        listType = $(this).index() + 1;
        // hint.style.display = "block";
        searchText.value = "";
        pageSize = 10;
        applyList();
        $(".case-message").scrollTop(0);
        update($(".case-message ul").eq($(this).index()));
        console.log(listTotal, pageSize);
        // if (listTotal == pageSize) {
        //     $(".update").html('暂无数据');
        // } else {
        //     $(".update").html('↓上拉刷新');
        // }
    })
    /* 给返回按钮注册点击事件 点击病例详情淡出 病例管理淡入*/
    $(".backtrack div").on("click", function () {
        $(".case-management").show();
        $(".case-particulars").hide();
        applyList();
    });
    /* 获取病例列表 结束 */
    /* 点击病例列表中星型按钮切换图片做选中样式 ajax请求将改变的状态传过去*/

    $(".case-message ul ").on("click", ".attention", function () {
        event.stopPropagation();
        let that = this;
        let followFlag = $(that).attr("data-statu");
        // console.log($(that).attr("data-statu").length)
        // console.log(followFlag)
        let followFlag1 = true;
        if (followFlag == "true") {
            followFlag1 = false;
        } else {
            followFlag1 = true;
        }
        //声明一个变量记录切换图片
        $.ajax({
            type: "POST",
            url: app.apiUrl + "/caseInfo/follow?t=" + app.random,
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                caseId: parseInt($(that).parents("li").attr("id")),
                follow: followFlag1,
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                if (res.code == 200) {
                    if (followFlag == "true") {
                        $(that).children("img").attr("src", "img/xin.png");
                        $(that).attr("data-statu", "false");
                    } else {
                        $(that).children("img").attr("src", "img/star.png");
                        $(that).attr("data-statu", "true");
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
    });
    update($(".case-message ul").eq(0));
    /* 上拉刷新 开始 */
    function update (element) {
        var start = 0,
            end = 0,
            ele = $(element)[0];//DOM对象转化为jQuery对象
        ele.addEventListener("touchstart", touchstart, false);
        ele.addEventListener("touchmove", touchmove, false);
        ele.addEventListener("touchend", touchend, false);
        if ($(".case-message .update").length == 0) {
            $('<div class="update">↓上拉刷新</div>').appendTo($(".case-message"));
            if (listTotal <= 10) {
                $(".update").hide();
            } else {
                $(".update").show();
            }
        }


        function touchstart (ev) {
            var touch = ev.targetTouches[0];
            start = touch.pageY;
        }

        function touchmove (ev) {
            if (searchText.value.trim() != "" || isFiltra) {
                return false;
            }
            var touch = ev.targetTouches[0];
            end = start - touch.pageY;
            $(this).css("top", (-end + "px"))
            if ($(".update").html() == '暂无数据' || $(".update").is(":hidden")) {
                return false;
            }
            if ($("body").height() - $(".update").offset().top > -40) {
                if (end > 0 && $(document).scrollTop() == 0) {
                    $(".update").show();
                    end > 60 ? $(".update").html('↑释放更新 ') : $(".update").html('↓上拉刷新');
                }
            }
        }
        function touchend (ev) {
            if (searchText.value.trim() != "" || isFiltra) {
                return false;
            }
            if ($("body").height() - $(".update").offset().top > -40) {
                if (parseInt(end) > 0 && $(document).scrollTop() == 0) {
                    $(".update").html('<span class="loading"></span>加载中...');
                    if (listTotal - pageSize > 10) {
                        pageSize += 10;
                    } else {
                        pageSize += listTotal - pageSize;
                    }


                    applyList();


                    // if (listTotal == pageSize) {
                    //     $(".update").html('暂无数据');
                    // } else {
                    //     $(".update").html('↓上拉刷新');
                    // }

                }
            }

        }
    }
    /* 上拉刷新 结束 */

    /* 周小玲 修改结束 */

    // ------------------------------------------------------------------------戴鑫----------------------------------------------
    /* 点击矫治器生产流程下载按钮  矫治器生产流程请求接口 */
    $(".download").on("click", function () {
        let date = $('.date input').attr("data-date").replace("-", "/").replace("-", "/"); //起始日期
        let step_start = $('.step-start input').val() //开始矫治器的步骤
        let stop_end = $('.stop-end input').val() //最后矫治器的步骤
        let day = $('.day input').val() //每副矫治器的天数
        $.ajax({
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url: app.apiUrl + "/caseInfo/getProces?t=" + app.random,
            async: false,
            data: JSON.stringify({
                startTime: new Date(date).getTime(), //起始日期
                startSteps: step_start, //开始矫治器的步骤
                endSteps: stop_end, //最后矫治器的步骤
                days: day, //每副矫治器的天数
            }),
            //请求成功
            success: function (result) {
                if (result.code == 200) {
                    let _C = result.data
                    let a = document.createElement("a"); // 生成一个a元素
                    let event = new MouseEvent("click"); // 创建一个单击事件
                    a.download = _C; // 设置图片名称
                    a.href = _C; // 将生成的URL设置为a.href属性
                    a.dispatchEvent(event); // 触发a的单击事件
                } else {

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
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })

            }
        });
    })

    /* 失去焦点事件，当用户输入完最后一个天数后表格自动填充完整 */
    $('.create-table').on('click', () => {
        function dateToStr (data) {
            let y = data.getFullYear();
            let m = data.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            let d = data.getDate();
            // d = d < 10 ? '0' + d : d
            // let str = y.toString() + '-' + m + '-' + d
            let str = y.toString() + "年" + m + "月" + d + "日";
            return str;
        }
        function disposeDate (date, day) {

            date = date.replace("-", "/").replace("-", "/");
            let fnDate = new Date(date);
            let nowDate = fnDate.setDate(fnDate.getDate() + day);
            return dateToStr(new Date(nowDate));
        }
        // let date = $('.date input').val().split('/').reverse().join('/') //起始日期
        let date = $('.date input').attr("data-date"); //起始日期
        let start = $('.step-start input').val() //开始矫治器的步骤
        let end = $('.stop-end input').val() //最后矫治器的步骤
        let day = $('.day input').val() //每副矫治器的天数
        let length = end - start + 1; //时间差
        let str = '';
        if (!date) {
            return false;
        }
        for (let i = start, k = 0; k < length; i++, k++) {
            str += `<tr><td>${Number(i)}</td><td>${disposeDate(date, k * day)}</td></tr>`
        }
        $('.flow-box .flow-inner table tbody').html('');
        $('.flow-box .flow-inner table tbody').append(str);
    })
    // ------------------------------------------------------------------------戴鑫----------------------------------------------
    /*
        记录哪个环节获取照片 1编辑资料 2患者照片 3x光片
    */
    let postEightFlag = null;

    /* 编辑资料 开始 */
    /* 地址列表点击确认为哪条 */
    let preserveAddressId;
    /* 点击编辑按钮 编辑资料页面显示 病例详情页面隐藏*/
    let editInfoUser = false;
    $(".specific").on("click", ".compile-btn", function () {
        let site1;
        let siteId;
        //loading带文字
        layer.open({
            type: 2,
            content: '处理中，请稍候',
            shadeClose: false,
        });
        editInfoUser = true;
        postEightFlag = 1;

        var infoPerson = new Promise(function (resolve) {
            $.ajax({
                type: "get",
                url: app.apiUrl + "/caseInfo/getStepTwo?t=" + app.random,
                data: {
                    caseId: presentCaseId
                },
                success: function (res) {
                    if (res.code == 200) {
                        var data = JSON.parse(res.data);
                        //addressId: 95
                        // birthday: 1598979588522
                        // caseId: 379
                        // hospitalId: 1
                        // patientName: "hah"
                        // sex: 1
                        datumDate = timestampToTime(parseInt(data.birthday));
                        datumDate = datumDate.replace("/", "-").replace("/", "-");

                        // $(".modification-box ul .birth-date").attr("data-date", datumDate);
                        // $(".modification-box ul .birth-date").val(datumDate);
                        $("#datumDate").attr("data-date", datumDate);
                        $("#datumDate").val(datumDate);

                        resolve(data);
                        getEightStepData();
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
            });
        })
        infoPerson.then((addId) => {
            $.ajax({
                async: false,
                //请求方式
                type: "get",
                //请求地址
                url: app.apiUrl + "/deliveryAddress/getAddressList?t=" + app.random,
                //请求成功
                success: function (res) {
                    if (res.code == 200) {
                        site1 = JSON.parse(res.data);

                        datumSiteId = site1.findIndex(item => {
                            return item.id == addId.addressId;
                        });

                        siteId = addId.addressId;

                        $(".modification-info").show();
                        $(".case-particulars").hide();
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
                    layer.open({
                        content: e.responseJSON.message,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                }
            });
            let sexBox;
            if (datumSex == 1) {
                sexBox = `
                        <div>
                            <p class="active">
                                <span></span>
                            </p>
                            男
                        </div>
                        <div>
                            <p>
                                <span></span>
                            </p>
                            女
                        </div>
                `

            } else if (datumSex == 2) {
                sexBox = `
                
                    <div>
                        <p>
                            <span></span>
                        </p>
                        男
                    </div>
                    <div>
                        <p class="active">
                            <span></span>
                        </p>
                        女
                    </div>
                `
            }
            let siteName = `
                <div class="consignee-tel">
                                                                                                                                                                                                                                                                                                                                                                                                                    <span>${site1[datumSiteId].deliveryName}</span>
                                                                                                                                                                                                                                                                                                                                                                                                                    <span>${site1[datumSiteId].contactNumber}</span>
                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                <div class="consignee-site">
                                                                                                                                                                                                                                                                                                                                                                                                                    ${site1[datumSiteId].country}${site1[datumSiteId].province} ${site1[datumSiteId].city}${site1[datumSiteId].area}${site1[datumSiteId].address}
                                                                                                                                                                                                                                                                                                                                                                                                                </div>`;
            $(".modification-box ul .patient-name").val(datumName);
            $(".modification-box ul .patient-sex").html(sexBox);
            $(".modification-box ul .hospital-name").children("p").text(datumHosName);

            $(".modification-box ul .consignee-name").html(siteName);
            preserveAddressId = siteId;
            $(".modification-box ul .consignee").children("span").attr("id", siteId);
            showHospitalData(addId.hospitalId);

        });
    });


    /* 编辑资料性别排他 */
    $(".modification-box ul").on("click", ".patient-sex div", function () {
        $(".modification-box .patient-sex p").removeClass("active");
        $(this).children("p").addClass("active");
    })

    /* 上传文件 开始*/
    let file1 = null;
    let fileFlag = false;
    $('.uploading-box input').on("change", function (e) {
        e.stopPropagation();
        var file = this.files[0];
        file1 = this.files[0];
        let iptDom = this;
        fileFlag = true;
        var filetypes = [".rar", ".zip"];
        var filepath = this.value;
        var filemaxsize = 1024 * 100;//100M
        $(".uploading-bd").attr("data-fileNumber", "12");
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
        var size = file.size / 1024;
        if (size > filemaxsize) {
            //提示
            layer.open({
                content: "文件大小不能大于" + filemaxsize / 1024 + "M！",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            this.value = "";
            return false;
        }

        $(".uploading-box .add-file-tips").hide();
        $(".uploading-box .del-file-tips").show();
        $(".uploading-box .del-file-tips").siblings("span").html(file.name);
        $('.uploading-box input').addClass("no-event");
    });
    $(".uploading-box .del-file-tips").hide();
    /* 上传文件 结束 */

    /* 删除文件 开始 */
    let delFile = false;
    $(".uploading-box .uploading-bd").on("click", function () {
        if (fileFlag) delFile = true;
        $(".uploading-box .del-file-tips").hide();
        $(".uploading-box .add-file-tips").show();
        $('.uploading-box input').removeClass("no-event");
        $('.uploading-box input').val("");
        $(".uploading-box .del-file-tips").siblings("span").html("文件名称.zip");
        eightStep.caseId = presentCaseId;
        eightStep.stageName = presentStageName;
        eightStep.stageCount = presentStageCount;
        eightStep.fileNumber = $(".uploading-bd").attr("data-fileNumber");
        eightStep.add = "N";

        $(".uploading-bd").attr("data-fileNumber", "");


    })
    /* 删除文件 结束 */


    /* 点击就诊医院的修改 医院列表显示 */
    let hospitalSiteData = [];
    let hospitalData;
    $(".hospital-name").on("click", function () {
        getHospitalInfo();
        $("#hospitalAddressList").show();
        $(".modification-info ").hide();
    })
    let updateHospitalData1 = {};
    let preserveHospitalId;
    /* 获取医院数据 */
    function showHospitalData (id) {
        $.ajax({
            async: false,
            //请求方式
            type: "get",
            //请求地址
            url: app.apiUrl + "/hospital/hospitalList?t=" + app.random,
            //请求成功
            success: function (res) {

                if (res.code == 200) {
                    var data = JSON.parse(res.data);
                    preserveHospitalId = JSON.parse(res.data)[0].id;
                    // getHospitalInfo();
                    /* 记录医院地址列表 */
                    hospitalData = data;
                    //  console.log(data);
                    var index = data.findIndex(item => {
                        return item.id == id;
                    });
                    console.log(hospitalData[index]);
                    showHospitalDefault(hospitalData[index], id);

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
                layer.open({
                    content: e.responseJSON.message,
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            }
        });
    }
    let hospitalFlag = true;
    /* 点击医院列表中数据中的编辑 编辑医院页面显示 */
    $("#hospitalAddressList .content-box").on("click", ".edit-box", function (e) {
        e.stopPropagation();
        $("#caseHospitalPage .delete").show();
        $("#hospitalAddressList").hide();
        $("#caseHospitalPage").show();
        $("#caseHospitalPage .centre-text").text("修改就诊医院");
        hospitalFlag = true;
        /* 显示选中的地址 */

        hospitalData.forEach(item => {
            if (item.id == $(this).parent().parent().attr("data-id")) {
                updateHospitalData1 = item;
                setCurHosptialAddr(item);
            }
        });

    });

    /* 点击 新建医院地址 */
    $("#hospitalAddressList .preserve").on("click", function () {
        $("#hospitalAddressList").hide();
        $("#caseHospitalPage").show();
        $("#caseHospitalPage .delete").hide();
        clearCurHosptialAddr();
        hospitalFlag = false;
        $("#caseHospitalPage #hospitalAddr input").val("");
        $("#caseHospitalPage #designation input").val("");
        $("#caseHospitalPage .centre-text").text("新建就诊医院");
    });

    /* 点击医院地址修改里面 保存按钮 也可能新增保存 */
    $("#caseHospitalPage .save").on("click", function () {
        var updateHospitalData = {};
        /* 新增还是修改 true 修改*/
        if (hospitalFlag) {
            hospitalData.forEach(item => {
                if (item.id == $(this).attr("data-id")) {
                    // updateHospitalData = item;
                    updateHospitalData.hospitalId = $(this).attr("data-id");
                }
            });

        }
        updateHospitalData.address = $("#caseHospitalPage #hospitalAddr input").val();
        updateHospitalData.hospitalName = $("#caseHospitalPage #designation input").val();

        /* 获取国家省市区数据 */
        updateHospitalData.country = $("#caseHospitalPage .countryList").val();
        updateHospitalData.countriesId = $("#caseHospitalPage .countryList").find(`option[value="${updateHospitalData.country}"]`).attr("data-id");
        updateHospitalData.province = $("#caseHospitalPage .provinceList").val();
        updateHospitalData.provinceId = $("#caseHospitalPage .provinceList").find(`option[value="${updateHospitalData.province}"]`).attr("data-id");
        updateHospitalData.city = $("#caseHospitalPage .cityList").val();
        updateHospitalData.cityId = $("#caseHospitalPage .cityList").find(`option[value="${updateHospitalData.city}"]`).attr("data-id");
        updateHospitalData.area = $("#caseHospitalPage .areaList").val();
        updateHospitalData.areaId = $("#caseHospitalPage .areaList").find(`option[value="${updateHospitalData.area}"]`).attr("data-id");

        Object.assign(updateHospitalData1, updateHospitalData);

        if (updateHospitalData1.country.includes("国家") || !updateHospitalData1.country) {
            //提示未输入
            layer.open({
                content: "请选择国家",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return false;
        }

        if (updateHospitalData1.country == "中国" &&
            (!updateHospitalData1.province || !updateHospitalData1.city || !updateHospitalData1.area) ||
            (updateHospitalData1.province == "省" || updateHospitalData1.city == "市" || updateHospitalData1.area == "区") ||
            (updateHospitalData1.province.indexOf("省") == 0 || updateHospitalData1.city.indexOf("区") == 0 || updateHospitalData1.area.indexOf("区") == 0)
        ) {
            //提示未输入
            layer.open({
                content: "请选择省市区",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return false;
        }

        if (!updateHospitalData1.address) {
            //提示未输入
            layer.open({
                content: "请输入详细地址",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return false;
        }

        if (!updateHospitalData1.hospitalName) {
            //提示未输入
            layer.open({
                content: "请输入医院名称",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return false;
        }

        // console.log(that.updateHospitalData);


        /* 修改 改地址 */
        if (hospitalFlag) {
            updateHospital(updateHospitalData1);
        } else {
            /* 新增 改地址 */
            saveHospital(updateHospitalData1);
        }
        $("#hospitalAddressList").show();
        $("#caseHospitalPage").hide();

    })
    /* 医院列表点击确认为哪条 */
    $("#hospitalAddressList .content-box").on("click", "li", function (e) {
        e.stopPropagation();
        /* 显示选中的地址 */
        hospitalData.forEach(item => {
            // console.log(hospitalData, $(this).attr("data-id"))
            if (item.id == $(this).attr("data-id")) {
                showHospitalDefault(item);
                preserveHospitalId = $(this).attr("data-id");
            }
        });
        $("#hospitalAddressList").hide();
        $(".modification-info").show();
    });
    /* 点击删除 删除该医院地址 */
    $("#caseHospitalPage .delete").on("click", function () {
        delHospitalAddr({
            hospitalId: $(this).attr("data-id"),
        });

        $("#hospitalAddressList").show();
        $("#caseHospitalPage").hide();
    })
    /* 点击返回按钮返回编辑资料页面 */
    $("#hospitalAddressList .left-arrow").on("click", function () {
        $("#hospitalAddressList").hide();
        $(".modification-info ").show();
    })
    /* 点击返回按钮返回医院列表页面 */
    $("#caseHospitalPage .left-arrow").on("click", function () {
        $("#caseHospitalPage").hide();
        $("#hospitalAddressList").show();
    })


    /* 修改医院地址 */
    function updateHospital (data) {
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
                    getHospitalInfo();
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

    /* 选择国家数据 */
    $(".countryList").on("change", function () {
        $(".cityList").html(`<option value="市">市</option>`);
        $(".areaList").html(`<option value="区">区</option>`);
        if (!$(this).children('option:selected').attr("data-id") || $(this).children('option:selected').val() == "国家") {
            $(".provinceList").html(`<option value="">省</option>`);
            return false;
        }
        editObj.country = $(this).children('option:selected').val();
        editObj.countriesId = $(this).children('option:selected').attr("data-id");
        editObj.province = null;
        editObj.provinceId = null;
        editObj.city = null;
        editObj.cityId = null;
        editObj.area = null;
        editObj.areaId = null;
        getProvince($(this).children('option:selected').attr("data-id"));
    });

    /* 选择省数据 */
    $(".provinceList").on("change", function () {
        $(".areaList").html(`<option value="区">区</option>`);
        if (!$(this).children('option:selected').attr("data-id") || $(this).children('option:selected').val() == "省") {
            $(".cityList").html(`<option value="市">市</option>`);
            return false;
        }
        editObj.province = $(this).children('option:selected').val();
        editObj.provinceId = $(this).children('option:selected').attr("data-id");
        editObj.city = null;
        editObj.cityId = null;
        editObj.area = null;
        editObj.areaId = null;
        getCity($(this).children('option:selected').attr("data-id"));
    });

    /* 选择市数据 */
    $(".cityList").on("change", function () {
        if (!$(this).children('option:selected').attr("data-id") || $(this).children('option:selected').val() == "市") {
            $(".areaList").html(`<option value="区">区</option>`);
            return false;
        }
        editObj.city = $(this).children('option:selected').val();
        editObj.cityId = $(this).children('option:selected').attr("data-id");
        editObj.area = null;
        editObj.areaId = null;
        getArea($(this).children('option:selected').attr("data-id"));
    });

    /* 选择区数据 */
    $(" .areaList").on("change", function () {
        editObj.area = $(this).children('option:selected').val();
        editObj.areaId = $(this).children('option:selected').attr("data-id");
    });





    /* 获取就诊医院 */
    function getHospitalInfo () {
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
                    // console.log(hospitalData);
                    /* 记录医院地址列表 */
                    hospitalData = data;
                    showHospitalDefault(hospitalData[0]);
                    /* 渲染所有医院地址 */
                    var strArr = [];
                    if (data.length > 0) data.forEach(function (item) {
                        strArr.push(`<li data-id="${item.id}">
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
                    $("#hospitalAddressList .content-bg").html(strArr.join("").trim());
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
                    content: res.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
            }
        });
    }

    /* 渲染医院第一条地址 */
    function showHospitalDefault (options) {
        if (options) {
            // console.log(options)
            $(".modification-info .hospital-name p").html(options.country + options.province + options.city + options.area + options.address + options.hospitalName);
            $(".modification-info .hospital-name").parents("li").attr("data-id", options.id);
            // console.log(options)
        }

    }
    /* 点击修改收货地址 */
    $(".consignee-box .consignee").on("click", function () {
        $("#addressExpressage").show();
        $(".modification-info").hide();
        addressExpressageFlag = 1;
        getAddrList();
    })
    let allAddrList = [];
    let modifAddrId;
    let addrStatus = true;
    /* 地址列表点击 编辑 */
    $("#addressExpressage .content-bg").on("click", ".edit-box", function (e) {
        e.stopPropagation();
        $("#addressExpressageRevise .cancel").show();
        $("#addressExpressage").hide();
        $("#addressExpressageRevise").show();
        $("#addressExpressageRevise .centre-text").text("修改收货地址");
        modifAddrId = $(this).parent().parent().attr("data-id");
        addrStatus = true;
        /* 显示选中的地址 */
        allAddrList.forEach(item => {
            // console.log(item)
            if (item.id == $(this).parent().parent().attr("data-id")) {
                showAddrDefault(item);
            }
        });

    })


    let addressExpressageFlag = 1; //记录返回的位置
    /* 后续生产中的修改 */
    $("#productPageBox ul").on("click", ".information", function () {
        addressExpressageFlag = 2;
        $("#addressExpressage").show();
        $("#productPageBox").hide();
        getAddrList();
    })
    /* 附件模板中的修改 */
    $("#newAttachment ul").on("click", ".list-site", function () {
        addressExpressageFlag = 3;
        $("#addressExpressage").show();
        $("#newAttachment").hide();
        getAddrList();
    })
    /* 备用矫治器中的修改 */
    $("#newMaintenanceStart ul").on("click", ".list-site", function () {
        addressExpressageFlag = 4;
        $("#addressExpressage").show();
        $("#newMaintenanceStart").hide();
        getAddrList();
    })
    /* 保持器中的修改 */
    $("#maintainStartCtrl ul").on("click", "#ctrlAmend", function () {
        addressExpressageFlag = 5;
        $("#addressExpressage").show();
        $("#maintainStartCtrl").hide();
        getAddrList();
    })
    /* 通过addressExpressageFlag变量的值来判断该返回哪个页面 */
    $("#addressExpressage .left-arrow").on("click", function () {
        if (addressExpressageFlag == 1) {
            $("#addressExpressage").hide();
            $(".modification-info").show();
        } else if (addressExpressageFlag == 2) {
            $("#addressExpressage").hide();
            $("#productPageBox").show();
        } else if (addressExpressageFlag == 3) {
            $("#newAttachment").show();
            $("#addressExpressage").hide();
        } else if (addressExpressageFlag == 4) {
            $("#addressExpressage").hide();
            $("#newMaintenanceStart").show();
        } else if (addressExpressageFlag == 5) {
            $("#addressExpressage").hide();
            $("#maintainStartCtrl").show();
        }
    })
    /* 地址列表点击确认为哪条 */
    $("#addressExpressage .content-bg").on("click", "li", function (e) {
        allAddrListId = $(this).attr("data-id")
        e.stopPropagation();
        /* 显示选中的地址 */
        allAddrList.forEach(item => {
            // console.log(allAddrList, $(this).attr("data-id"))
            if (item.id == $(this).attr("data-id")) {
                showAddrDefault(item);
                preserveAddressId = $(this).attr("data-id");
            }
        });
        if (addressExpressageFlag == 1) {
            $("#addressExpressage").hide();
            $(".modification-info").show();
        } else if (addressExpressageFlag == 2) {
            $("#addressExpressage").hide();
            $("#productPageBox").show();
        } else if (addressExpressageFlag == 3) {
            $("#addressExpressage").hide();
            $("#newAttachment").show();
        } else if (addressExpressageFlag == 4) {
            $("#addressExpressage").hide();
            $("#newMaintenanceStart").show();
        } else if (addressExpressageFlag == 5) {
            $("#addressExpressage").hide();
            $("#maintainStartCtrl").show();
        }
    });
    let baseEditInfo = 1;
    /* 修改地址 删除按钮 */
    $("#addressExpressageRevise .cancel").on("click", function () {
        removeAddr(modifAddrId);
        $("#addressExpressageRevise").hide();
        if (baseEditInfo == 1) {
            $("#addressExpressage").show();
        } else {
            // $("#address-list").show();
        }

    });

    /* 修改地址 新增地址 保存按钮 */
    $("#addressExpressageRevise .preserve").on("click", function () {
        /* 新增还是修改 true 修改*/
        if (addrStatus) {
            var editObj1 = {
                address: $(".receiverDetail").val(),
                contactNumber: $(".receiverTel").val(),
                deliveryName: $(".receiverName").val(),
                id: modifAddrId,
            };
        } else {
            var editObj1 = {
                address: $(".receiverDetail").val(),
                contactNumber: $(".receiverTel").val(),
                deliveryName: $(".receiverName").val(),
            };
        }

        Object.assign(editObj, editObj1);
        if (!editObj.deliveryName) {
            //提示
            layer.open({
                content: "请输入用户名",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return false;
        }
        if (!app.userNameReg.test(editObj.deliveryName)) {
            //提示
            layer.open({
                content: "请输入正确格式的用户名",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return false;
        }
        if (!editObj.contactNumber) {
            //提示未输入
            layer.open({
                content: "请输入电话号码",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return false;
        }
        if (!app.telReg.test(editObj.contactNumber)) {
            //提示未输入
            layer.open({
                content: "请输入正确的电话号码",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return false;
        }
        // that.editObj.country = $(".countryList").val();

        // console.log(editObj.country);
        if (!editObj.country || editObj.country.includes("国家")) {
            //提示未输入
            layer.open({
                content: "请选择国家",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return false;
        }

        if (editObj.country == "中国" &&
            (!editObj.province || !editObj.city || !editObj.area) ||
            (editObj.province == "省" || editObj.city == "市" || editObj.area == "区") ||
            (editObj.province.indexOf("省") == 0 || editObj.city.indexOf("市") == 0 || editObj.area.indexOf("区") == 0)
        ) {
            //提示未输入
            layer.open({
                content: "请选择省市区",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return false;
        }

        if (!editObj.address) {
            //提示未输入
            layer.open({
                content: "请输入详细地址",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return false;
        }

        // console.log(editObj);

        if (addrStatus) {
            modifAddr(editObj);
        } else {
            addAddr(editObj);
        }

        $("#addressExpressage").show();
        $("#addressExpressageRevise").hide();
    });

    /* 新增地址 */
    $("#addressExpressage .preserve").on("click", function () {

        $("#addressExpressageRevise").show();
        $("#addressExpressage").hide();
        $("#addressExpressageRevise .cancel").hide();
        $("#addressExpressageRevise .centre-text").text("新增收货地址");
        $(".countryList").find('option[value="国家"]').prop("selected", true);
        $(".provinceList").html(`<option>省</option>`);
        $(".cityList").html(`<option>市</option>`);
        $(".areaList").html(`<option>区</option>`);
        $(".receiverDetail").val("");
        $(".receiverTel").val("");
        $(".receiverName").val("");
        addrStatus = false;
        editObj = {};

    })


    /* 返回地址列表 */
    $("#addressExpressageRevise .left-arrow").on("click", function () {
        $("#addressExpressageRevise").hide();
        $("#addressExpressage").show();
    })

    /* 点击编辑资料的保存按钮 将修改的信息上传 */
    $(".modification-info .preserve-btn").on("click", function () {
        let preserveName = $(".modification-info li:nth-of-type(1)").children("input").val();
        let preserveSex = $(".modification-info li:nth-of-type(2)").children("div").find(".active").parent().index() + 1;
        let preserveBirthday = $(".modification-info li:nth-of-type(4)").children("input").attr("data-date").replace("-", "/").replace("-", "/");
        preserveBirthday = new Date(preserveBirthday).getTime();

        if (fileFlag && delFile) {
            eightStep.caseId = presentCaseId;
            eightStep.stageName = presentStageName;
            eightStep.stageCount = presentStageCount;
            eightStep.fileNumber = 12;
            delImg(eightStep);
            fileFlag = false;
            delFile = false;
        }

        if (file1) {
            eightStep.caseId = presentCaseId;
            eightStep.stageName = presentStageName;
            eightStep.stageCount = presentStageCount;
            eightStep.file = file1;
            eightStep.add = "Y";
            eightStep.fileNumber = $(".uploading-bd").attr("data-fileNumber");
            if ($(".uploading-bd").attr("data-fileNumber") == 12) {
                postEightStep();
            };
        }

        if (preserveName == "") {
            layer.open({
                content: "请输入姓名",
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            return false;
        }
        /* 添加生日判断 */
        let curTime = new Date().getTime();
        if (preserveBirthday > curTime) {
            layer.open({
                content: "请选择正确的出生日期",
                skin: "msg",
                time: 2 //2秒自动关闭
            })
            return false;
        }


        $.ajax({
            type: "POST",
            url: app.apiUrl + "/caseInfo/stepTwo?t=" + app.random,
            contentType: "application/json;charset=UTF-8",
            async: false,
            data: JSON.stringify({
                caseId: presentCaseId,
                patientName: preserveName,
                sex: preserveSex,
                birthday: preserveBirthday,
                hospitalId: preserveHospitalId,
                addressId: preserveAddressId,
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                if (res.code == 200) {
                    console.log("编辑资料");
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
        $(".case-particulars").show();
        $(".modification-info").hide();
        applyList();
        $.ajax({
            async: false,
            type: "POST",
            url: app.apiUrl + "/caseInfo/getCaseInfo?t=" + app.random,
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                caseId: presentCaseId,
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                let sexImg = "";
                let brandImg = "";
                if (res.code == 200) {
                    let particularsDatabase = JSON.parse(res.data);
                    // console.log(particularsDatabase)
                    datumName = particularsDatabase.patientName;
                    datumSex = particularsDatabase.sex;
                    datumHosId = particularsDatabase.hospitalId;
                    datumSiteId = particularsDatabase.deliveryAddressId;
                    datumHosName = particularsDatabase.hospitalName;
                    // datumDate = timestampToTime(parseInt(particularsDatabase.createTime));
                    if (particularsDatabase.sex == 1) {
                        sexImg = "img/sexn.png";
                    } else {
                        sexImg = "img/sex.png";
                    }
                    if (particularsDatabase.caseBrand == "正丽科技自主创立品牌") {
                        brandImg = "img/MA.png";
                    } else {
                        brandImg = "img/SM.png";
                    }
                    let particularsData = `
                            <div class="specific-top">
                                                                                                                                                                                                                                                                                                                                                                                                                <div class="definite">
                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="specific-header">
                                                                                                                                                                                                                                                                                                                                                                                                                        <img src="${particularsDatabase.headUrl}" >
                                    </div>

                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="specific-number">
                                                                                                                                                                                                                                                                                                                                                                                                                            <p>
                                                                                                                                                                                                                                                                                                                                                                                                                                <span class="specific-name">${particularsDatabase.patientName}</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                <img src=${$(listthat).find(".attention").children("img").attr("src")}>
                                        </p>
                                                                                                                                                                                                                                                                                                                                                                                                                                <p>
                                                                                                                                                                                                                                                                                                                                                                                                                                    <span class="sex-box">
                                                                                                                                                                                                                                                                                                                                                                                                                                        <img src=${sexImg}>
                                            </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                        <span class="age-box">
                                                                                                                                                                                                                                                                                                                                                                                                                                            ${particularsDatabase.age}岁
                                            </span>
                                        </p>
                                                                                                                                                                                                                                                                                                                                                                                                                                    <p>
                                                                                                                                                                                                                                                                                                                                                                                                                                        <span class="meaning">
                                                                                                                                                                                                                                                                                                                                                                                                                                         
                                            </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                        <span class="sequence">
                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                    </p>
                                    </div>
                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="unfold">
                                                                                                                                                                                                                                                                                                                                                                                                                                <img src="img/management-jt-x.png">
                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                            <!-- 展开部分 -->
                            <div class="spread">
                                                                                                                                                                                                                                                                                                                                                                                                                                <!-- 地址及备注 -->
                                <div class="site">
                                                                                                                                                                                                                                                                                                                                                                                                                                    <p>
                                                                                                                                                                                                                                                                                                                                                                                                                                        <span>诊所</span>:
                                        <span>${particularsDatabase.hospitalName}</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                                                                                                                                                                                                                                    <p>
                                                                                                                                                                                                                                                                                                                                                                                                                                        <span>备注</span>:
                                        <span class="comment">${particularsDatabase.remark}</span>

                                                                                                                                                                                                                                                                                                                                                                                                                                        <span class="staff-hide compile">
                                                                                                                                                                                                                                                                                                                                                                                                                                            <img src="img/compile.png">
                                        </span>
                                    </p>
                                                                                                                                                                                                                                                                                                                                                                                                                                        <em class="change">确认</em>
                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                    <!-- /地址及备注 -->
                                <!-- 品牌、类别及到期日 -->
                                <div class="due">
                                                                                                                                                                                                                                                                                                                                                                                                                                        <p class="parting">

                                                                                                                                                                                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="due-box">
                                                                                                                                                                                                                                                                                                                                                                                                                                            <p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                <span>品牌</span>:
                                            <span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                    <img src="${brandImg}">
                                            </span>
                                        </p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                <p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                <p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                    <span>临床分类</span>:
                                            <span class="classification">${particularsDatabase.clinical}</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                </p>
                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                        <!-- /品牌、类别及到期日 -->
                                <!-- 编辑资料按钮 -->
                                <div class="compile-btn">
                                                                                                                                                                                                                                                                                                                                                                                                                                            <img src="img/compileicon.png">
                                                                                                                                                                                                                                                                                                                                                                                                                                                编辑资料
                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                            <!-- /编辑资料按钮 -->
                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                        <!-- /展开部分 -->
                    `
                    $(".specific").html(particularsData);
                    $(".case-management").hide();
                    $(".case-particulars").show();
                    $(".spread .change").hide();
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

    });

    /* 点击返回按钮 编辑资料页面隐藏 病例详情页面显示*/
    $(".backtrack1 div").on("click", function () {
        $(".modification-info").hide();
        $(".case-particulars").show();
    });
    /* 点击取消按钮  编辑资料页面隐藏 病例详情页面显示*/
    $(".preserve-box .cancel-btn").on("click", function () {
        $(".case-particulars").show();
        $(".modification-info").hide();
    });
    /* 编辑资料 结束 */
    let editAddrInfo;
    /* 获取地址列表 */
    // getAddrList();
    function getAddrList () {
        $.ajax({
            type: "get",
            url: app.apiUrl + "/deliveryAddress/getAddressList?t=" + app.random,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                if (res.code == 200) {
                    let data = JSON.parse(res.data);
                    allAddrList = data;
                    var lis = [];
                    if (allAddrList.length > 0) allAddrList.forEach((value) => {
                        lis.push(`<li data-id="${value.id}"><div class="border-bottom-box"><div class="address-name"><span>${value.deliveryName}</span><span class="phone">${value.contactNumber}</span></div><div class="address-position"><span class="message">${value.country + value.province + value.city + value.area + value.address}<span></div><div class="edit-box">编辑</div></div></li>`);
                    })
                    if (allAddrList[0]) {
                        allAddrListId = allAddrList[0].id;
                        editAddrInfo = allAddrList[0];
                    }
                    $("#addressExpressage .content-bg").html(lis.join(""));

                    /* 如果有地址 id 进去修改的 就渲染对应的数据 */
                    if (allAddrList.length > 0) {
                        // console.log(allAddrList)
                        showAddrDefault(allAddrList[0]);
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




    /* 删除图片 */
    function delImg (data) {
        /* 获取保存第一步 */
        console.log(data);

        // return false;
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
                // if (res.code == 200) {
                //     // var data = JSON.parse(res.data);
                //     console.log(data.fileNumber);
                //     /* 删除之后清空图片 */
                //     // $(".teeth-phone .phone-close").eq(Number(data.fileNumber) - 1).hide();
                // } else {
                //     layer.open({
                //         content: res.msg,
                //         skin: "msg",
                //         time: 2 //2秒自动关闭
                //     })
                // }
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
    /* 渲染基本信息地址第一条地址 */
    function showAddrDefault (options) {
        console.log(options);
        if (addressExpressageFlag == 1) {
            $(".consignee-tel span").eq(0).html(options.deliveryName);
            $(".consignee-tel span").eq(1).html(options.contactNumber);
            $(".consignee-site").html(options.country + options.province + options.city + options.area + options.address);
            $(".delivery-address").attr("data-id", options.id);
        } else if (addressExpressageFlag == 2) {
            $("#productPageBox .contact span").eq(0).html(options.deliveryName);
            $("#productPageBox .contact span").eq(1).html(options.contactNumber);
            $(".detailed-address span").html(options.country + options.province + options.city + options.area + options.address);
            $(".delivery-address").attr("data-id", options.id);
        } else if (addressExpressageFlag == 3) {
            $("#newAttachment .list-site>div:nth-of-type(1) div:nth-of-type(1) span").eq(0).html(options.deliveryName);
            $("#newAttachment .list-site>div:nth-of-type(1) div:nth-of-type(1) span").eq(1).html(options.contactNumber);
            $("#newAttachment site-b").html(`<p>${options.province + options.city + options.area + options.address}</p>`);
            $("#newAttachment .list-site").attr("data-id", options.id);
        } else if (addressExpressageFlag == 4) {
            $("#newMaintenanceStart .list-site").find(".site-t").children("span").eq(0).html(options.deliveryName);
            $("#newMaintenanceStart .list-site").find(".site-t").children("span").eq(1).html(options.contactNumber);
            $("#newMaintenanceStart .site-b").html(`<p>${options.country + options.province + options.city + options.area + options.address}</p>`);
            $("#newMaintenanceStart .list-site").attr("data-id", options.id);
        } else if (addressExpressageFlag == 5) {
            $("#maintainStartCtrl .site").children("span").eq(0).html(options.deliveryName);
            $("#maintainStartCtrl .site").children("span").eq(1).html(options.contactNumber);
            $("#maintainStartCtrl .address").html(options.country + options.province + options.city + options.area + options.address);
            $("#maintainStartCtrl li:last-of-type").attr("data-id", options.id);
        }

        editObj.country = options.country;
        editObj.province = options.province;
        editObj.city = options.city;
        editObj.area = options.area;
        editObj.address = options.address;
        setAddrDefault(options);
    }

    /* 设置修改地址的默认选中地址值 */
    function setAddrDefault (options) {
        // console.log(options.country);
        $("#addressExpressageRevise li:nth-of-type(1)").children("input").val(options.deliveryName);
        $("#addressExpressageRevise li:nth-of-type(2)").children("input").val(options.contactNumber);
        $("#addressExpressageRevise li:last-of-type").children("input").val(options.address);
        if (options.country) {
            /* 显示当前选中的 地址 */
            $("#addressExpressageRevise .countryList").find(`option[value="${options.country}"]`).prop("selected", true);
            var countryId = $("#addressExpressageRevise .countryList").find(`option[value="${options.country}"]`).attr("data-id");
            // console.log(options.country)
        }
        /* 如果是中国就去请求省市区  */
        if (options.country == "中国") {
            getProvince(countryId);

            $(".provinceList").find(`option[value="${options.province}"]`).prop("selected", true);
            var provinceId = $(".provinceList").find(`option[value="${options.province}"]`).attr("data-id");
            getCity(provinceId);

            $(".cityList").find(`option[value="${options.city}"]`).prop("selected", true);
            var cityId = $(".cityList").find(`option[value="${options.city}"]`).attr("data-id");
            getArea(cityId);

            $(".areaList").find(`option[value="${options.area}"]`).prop("selected", true);

        }
    }

    /* 删除收获地址 */
    function removeAddr (id) {
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
                    getAddrList();
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
    function modifAddr (data) {
        allAddrList.forEach((item, idx) => {
            if (item.id == data.id) {
                allAddrList[idx] = data;
            }
        });

        $.ajax({
            type: "POST",
            url: app.apiUrl + "/deliveryAddress/addDeliveryAddressList?t=" + app.random,
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(allAddrList),
            async: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                if (res.code == 200) {
                    getAddrList();
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
    function addAddr (data) {
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
                    getAddrList();
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


    /* 删除就诊医院地址 */
    function delHospitalAddr (data) {
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

                    getHospitalInfo();

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
                    content: res.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                })
            }
        });
    }

    /* 新增医院地址 */
    function saveHospital (data) {
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
                    getHospitalInfo();
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

    /* 设置地址状态 */
    function setCurHosptialAddr (options) {
        console.log(options);
        $("#hospitalAddr input").val(options.address);
        $("#designation input").val(options.hospitalName);
        $(".delete").attr("data-id", options.id);
        $(".modification-hospital .save").attr("data-id", options.id);
        if (options.country != "中国") {
            clearCurHosptialAddr();
        } else {
            /* 显示当前选中的 地址 */
            $("#addressExpressageRevise .countryList").find(`option[value="${options.country}"]`).attr("selected", true);
            $("#caseHospitalPage .countryList").find(`option[value="${options.country}"]`).attr("selected", true);

            /* 如果是中国就去请求省市区  */
            if (options.country == "中国") {
                getProvince(options.countriesId);

                $("#addressExpressageRevise .provinceList").find(`option[value="${options.province}"]`).attr("selected", true);
                $("#caseHospitalPage .provinceList").find(`option[value="${options.province}"]`).attr("selected", true);
                getCity(options.provinceId);

                $("#addressExpressageRevise .cityList").find(`option[value="${options.city}"]`).attr("selected", true);
                $("#caseHospitalPage .cityList").find(`option[value="${options.city}"]`).attr("selected", true);
                getArea(options.cityId);

                $("#addressExpressageRevise .areaList").find(`option[value="${options.area}"]`).attr("selected", true);
                $("#caseHospitalPage .areaList").find(`option[value="${options.area}"]`).attr("selected", true);
            }
        }
    }
    /* 清空地址状态 */
    function clearCurHosptialAddr () {
        $("#caseHospitalPage .countryList").find('option[value="国家"]').prop("selected", true);
        $("#caseHospitalPage .provinceList").html(`<option value="省">省</option>`);
        $("#caseHospitalPage .cityList").html(`<option value="市">市</option>`);
        $("#caseHospitalPage .areaList").html(`<option value="区">区</option>`);
    }
    getCountry()
    /* 省市区三级联动 国家 */
    function getCountry () {
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
    function getProvince (id) {
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
    function getCity (id) {
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
    function getArea (id) {
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
    };


    /* x光片 上传 */
    /* 上传所有图片 */
    let flagNoe = false;
    $("#XlightPage .section-c>p").on("click", function () {
        if (flagNoe) {
            $("#XlightPage div img:nth-of-type(2)").css({
                "width": "auto",
                "height": "auto",
                "position": "absolute",
                "top": "50%",
                "left": "50%",
                "transform": "translate(-50%,-50%)",
            });
            flagNoe = false;
        } else {
            $("#XlightPage div img:nth-of-type(2)").css("width", "100%").css("height", "100%");
            flagNoe = true;
        }

    });

    /* 点击X光片 上传X光片弹层显示 */
    $("#schemeRadiography").on("click", function () {

        postData = {
            caseId: presentCaseId
        }
        if (postData) {
            postEightFlag = 3;
            getEightStepData(postData);
        }
        $("#XlightPage").show();
        $('#XlightPage div[class ^= "panorama"]>img:nth-of-type(2)').css({
            "width": "auto",
            "height": "auto",
            "position": "absolute",
            "top": "50%",
            "left": "50%",
            "transform": "translate(-50%,-50%)",
        });
        $("body").addClass("beyond");
        var panoramaArr = document.querySelectorAll('#XlightPage div[class ^= "panorama"]');
        panoramaArr.forEach(item => {
            $(item).children(".replace-delete").hide();
            if ($(item).children("img").eq(1).attr("src")) {
                $(item).children("input").addClass("no-event");
                // $(item).children(".replace-delete").show();
                // app.image2Base64($(item).children("img").eq(1).attr("src"), function (url) {
                //     $(item).find(".replace-delete a").attr("href", url);
                //     $(item).find(".replace-delete a").attr("download", url);
                // });
            }
        })
    })

    /* 点击 图片盒子 判断input是否有 no-event */
    $('#XlightPage div[class ^= "panorama"]').on("click", function () {
        if ($(this).children("input").hasClass("no-event") && $(this).children("img").eq(1).attr("src")) {
            $("#handlePic").attr("data-index", $(this).attr("data-index"));
            $("#handlePic").attr("data-flag", $(this).index());
            $("#handlePic").show();
        }
    })

    /* 点击上传X光片弹层中的关闭按钮 上传X光片弹层隐藏 */
    $("#XlightPage .clear").on("click", function () {
        $("#XlightPage").hide();
    })

    $('#XlightPage div input').on("change", function (e) {
        var file = this.files[0];
        // console.log(file);
        let iptDom = this;

        // var filetypes = [".jpg", ".png", ".jpeg", ".svg", '.gif'];
        var filepath = this.value;
        if (!filepath) { return false; }

        // console.log(rst);
        if (window.FileReader) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            //监听文件读取结束后事件  判断是替换图片还是上传图片
            reader.onloadend = function (e) {
                $(iptDom).prev().hide();
                $(iptDom).next().attr("src", e.target.result);

                $(iptDom).siblings("img").eq(0).hide();
                $(iptDom).siblings("p").hide();
                eightStep.fileNumber = $(iptDom).parent().attr("data-index");
                $(iptDom).addClass("no-event");

                eightStep.caseId = presentCaseId;
                eightStep.stageName = presentStageName;
                eightStep.stageCount = presentStageCount;
                eightStep.file = file;
                eightStep.add = "Y";
                postEightStep();
            }

        }
    });
    /* 点击图片 */
    $("#conceal").on("click", function () {
        $(this).children().children("img").toggle();
    });

    $(".choose div").on("click", function () {
        $(".choose div span").removeClass("circle");
        $(this).find("span").addClass("circle");
    })
    /* 点击合成图片  下载合成图片模块显示 */
    /* 点击下载合成图片模块 下载合成模块 未完成*/
    $(".choose .choose-t").on("click", function () {
        $(".downloadCompoundBtn").show();
        $(".downloadCompoundBtn").hide();
        html2canvas(document.getElementById('screenshotDom')).then(function (canvas) {

            dataURL = canvas.toDataURL("image/png");
            console.log(dataURL);
            $(".downloadCompoundBtn").show();
            $(".downloadCompoundBtn a").attr("href", dataURL).attr("download", "合成图片");
        });
    })
    /* 点击单张图片  下载合成图片模块隐藏 */
    $(".choose .choose-l").on("click", function () {
        $(".downloadCompoundBtn").hide();
    })


    /* 点击上传x光片中的关闭按钮  上传患者照片弹层隐藏 */
    $("#XlightPage .clear").on("click", function () {
        $("#XlightPage").hide();
        $(".choose div span").removeClass("circle");
        $(".choose .choose-l").find("span").addClass("circle");
        $("body").removeClass("beyond");
    });



    /* tbea 修改开始 */
    /* 患者照片 上传开始 */
    let eightStep = {};
    /* 获取第8步接口 */
    function getEightStepData () {
        //loading带文字
        layer.open({
            type: 2,
            content: '处理中，请稍候',
            shadeClose: false,
        });
        $.ajax({
            type: "get",
            url: app.apiUrl + "/caseInfo/getStepEight?t=" + app.random,
            data: {
                caseId: presentCaseId,
            },
            // async: true,
            success: function (res) {
                if (res.code == 200) {
                    var data = JSON.parse(res.data);

                    if (postEightFlag == 2) {
                        /* 患者照片 */
                        $('#patientPicture li input').prev().prev().show();
                        $('#patientPicture li input').next().attr("src", "");
                        $('#patientPicture li input').prev().show();
                        $('#patientPicture li input').removeClass("no-event");
                    } else if (postEightFlag == 3) {

                        /* x光片 */
                        $('#XlightPage div[class ^= "panorama"]>input').prev().prev().show();
                        $('#XlightPage div[class ^= "panorama"]>input').next().attr("src", "");
                        $('#XlightPage div[class ^= "panorama"]>input').prev().show();
                        $('#XlightPage div[class ^= "panorama"]>input').removeClass("no-event");

                    }


                    let dataStr = "";
                    let wenjian = "文件名称.zip";
                    let comOne = 0;
                    let comTwo = 0;
                    let comThree = 0;
                    if (data.length > 0) {
                        let dataLoad = 0;
                        new Promise(function (resolve, reject) {
                            data.forEach(item => {
                                console.log(item);

                                dataStr += item.fileNumber + ",";

                                if (Number(item.fileNumber) <= 8) {
                                    comTwo += 1;
                                } else if (Number(item.fileNumber) <= 11 && Number(item.fileNumber) >= 9) {
                                    comThree += 1;
                                }

                                /* 编辑资料 */
                                if (editInfoUser) {
                                    if (item.fileNumber == 12) {
                                        wenjian = item.path;
                                    }
                                    resolve();
                                    /* 患者照片 x光片 */
                                } else {
                                    if (Number(item.fileNumber) >= 9 && Number(item.fileNumber) <= 11 && postEightFlag == 3) {
                                        // app.image2Base64(app.imgUrl + item.path, function (url) {

                                        dataLoad += 1;
                                        if (dataLoad >= comThree) {
                                            resolve();
                                        }
                                        $('#XlightPage div[class ^= "panorama"]>input').eq(Number(item.fileNumber) - 9).next().attr("src", app.imgUrl + item.path);
                                        // $('#XlightPage div[class ^= "panorama"]>input').eq(Number(item.fileNumber) - 9).next().attr("src", url);
                                        // });

                                        $('#XlightPage div[class ^= "panorama"]>input').eq(Number(item.fileNumber) - 9).parent().children("img").eq(0).hide();
                                        $('#XlightPage div[class ^= "panorama"]>input').eq(Number(item.fileNumber) - 9).prev().hide();
                                        $('#XlightPage div[class ^= "panorama"]>input').eq(Number(item.fileNumber) - 9).addClass("no-event");
                                    } else if (postEightFlag == 3 && comThree == 0) {
                                        resolve();
                                    }
                                    if (Number(item.fileNumber) <= 8 && postEightFlag == 2) {
                                        $('#patientPicture li>input').eq(Number(item.fileNumber) - 1).parent().children("img").eq(0).hide();
                                        // app.image2Base64(app.imgUrl + item.path, function (url) {

                                        dataLoad += 1;

                                        if (dataLoad >= comTwo) {
                                            resolve();
                                        }
                                        $('#patientPicture li>input').eq(Number(item.fileNumber) - 1).next().attr("src", app.imgUrl + item.path);
                                        // $('#patientPicture li>input').eq(Number(item.fileNumber) - 1).next().attr("src", url);
                                        // });
                                        $('#patientPicture li>input').eq(Number(item.fileNumber) - 1).prev().hide();
                                        $('#patientPicture li>input').eq(Number(item.fileNumber) - 1).addClass("no-event");
                                    } else if (postEightFlag == 2 && comTwo == 0) {
                                        resolve();
                                    }

                                    if (Number(item.fileNumber) == 12) {
                                        dataLoad += 1;
                                        resolve();
                                    }
                                }


                            });
                        }).then(function () {
                            layer.closeAll();
                            editInfoUser = false;
                        })
                        console.log(dataLoad, comTwo, comThree);


                    } else {
                        layer.closeAll();
                        editInfoUser = false;
                    }

                    /* 处理编辑资料文件 */
                    if (dataStr.includes("12")) {
                        $(".modification-box .uploading-bd .del-file-tips").show();
                        $(".modification-box .uploading-bd .add-file-tips").hide();
                        $('.uploading-box input').addClass("no-event");
                        $(".uploading-bd").attr("data-fileNumber", "12");
                        fileFlag = true;
                    } else {
                        $(".modification-box .uploading-bd .del-file-tips").hide();
                        $(".modification-box .uploading-bd .add-file-tips").show();
                        $('.uploading-box input').removeClass("no-event");
                        $(".uploading-bd").attr("data-fileNumber", " ");
                    }
                    wenjian = wenjian + "";
                    wenjian = wenjian.slice(wenjian.lastIndexOf("/") + 1, wenjian.length)
                    $(".uploading-bd span").text(wenjian);

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

    /* 上传所有图片 */
    $('#patientPicture li input').on("change", function (e) {
        var file = this.files[0];
        let iptDom = this;
        var filepath = this.value;
        if (!filepath) { return false; }

        // console.log(rst);
        if (window.FileReader) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function (e) {
                layer.closeAll();
                $(iptDom).prev().hide();

                $(iptDom).next().attr("src", e.target.result);
                $(iptDom).parent().children("img").eq(0).hide();
                /* 请求上传的接口 */
                $(iptDom).parent().children(".replace-delete").show();
                $(iptDom).siblings("img").eq(0).hide();
                $(iptDom).siblings("p").hide();


                eightStep.fileNumber = $(iptDom).parent().attr("data-index");
                $(iptDom).addClass("no-event");

                eightStep.caseId = presentCaseId;
                eightStep.stageName = presentStageName;
                eightStep.stageCount = presentStageCount;
                eightStep.file = file;
                eightStep.add = "Y";
                /* 请求上传的接口 */
                postEightStep();
            }
        }
    });
    /* 点击患者照片的原始大小 */
    let imgFlag = false;
    $("#patientPicture .section-c>p").on("click", function () {
        if (imgFlag) {
            $("#patientPicture ul li img:nth-of-type(2)").css({
                "width": "auto",
                "height": "auto",
                "position": "absolute",
                "top": "50%",
                "left": "50%",
                "transform": "translate(-50%,-50%)",
            });
            imgFlag = false;
        } else {
            $("#patientPicture ul li img:nth-of-type(2)").css("width", "100%").css("height", "100%");
            imgFlag = true;
        }

        $(this).children("span").children("img").toggle();

    })
    /* 上传数据 */
    /* 获取第8步接口 */
    function postEightStep () {
        var eightFormdata = new FormData();
        for (var k in eightStep) {
            eightFormdata.append(k, eightStep[k]);
        };
        let curlayer = layer.open({
            type: 2
            , content: '处理中，请稍候',
            shadeClose: false,
        });
        /* 获取保存第二步 */
        $.ajax({
            /* 请求异步问题 */
            // async: false,
            //请求方式
            type: "POST",
            dataType: 'json',
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
                    // console.log(res);
                    layer.close(curlayer);
                } else {
                    layer.open({
                        content: res.msg,
                        skin: "msg",
                        time: 2 //2秒自动关闭
                    });
                    layer.close(curlayer);
                }
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                layer.open({
                    content: e.responseJSON.message,
                    skin: "msg",
                    time: 2 //2秒自动关闭
                });
                layer.close(curlayer);
            }
        });
    }


    let postData = null;
    /* 牙况照片显示 上传文件隐藏 */
    $("#schemePicture").on("click", function () {
        $("#patientPicture li>img:nth-of-type(2)").css({
            "width": "auto",
            "height": "auto",
            "position": "absolute",
            "top": "50%",
            "left": "50%",
            "transform": "translate(-50%,-50%)",
        });
        postData = {
            caseId: presentCaseId
        };
        $("body").addClass("beyond");
        if (postData) {
            postEightFlag = 2;
            getEightStepData(postData);
        }
        var panoramaArr = document.querySelectorAll('#patientPicture li');
        panoramaArr.forEach(item => {
            $(item).children(".replace-delete").hide();
            if ($(item).children("img").eq(1).attr("src")) {
                // console.log(item)
                $(item).children("input").addClass("no-event");
                // $(item).children(".replace-delete").show();
                // app.image2Base64($(item).children("img").eq(1).attr("src"), function (url) {
                //     $(item).find(".replace-delete a").attr("href", url);
                //     $(item).find(".replace-delete a").attr("download", url);
                // });
            }
        });
        $("#patientPicture").show();
        $(".downloadCompoundBtn").hide();
    })
    /* 点击 图片盒子 判断input是否有 no-event */
    $("#patientPicture ul li").on("click", function () {
        if ($(this).children("input").hasClass("no-event") && $(this).children("img").eq(1).attr("src")) {
            console.log($(this).index());

            $("#handlePic").attr("data-index", $(this).attr("data-index"));
            $("#handlePic").attr("data-flag", $(this).attr("data-flag") - 1);
            $("#handlePic").show();
        }
    });

    /* 点击替换图片上传和查看大图弹层消失 */
    $("#handlePic").on("click", function (e) {
        e.stopPropagation();
        $("#handlePic").hide();
    });

    // $("body").on("click"," .viewer-footer a",function(e){
    //     e.preventDefault();
    //     layer.open({
    //         content: "长按图片保存",
    //         skin: 'msg',
    //         time: 2 //2秒后自动关闭
    //     })
    // });

    /* 点击查看大图 处理图片展示 */
    $("#watchPic").on("click", function (e) {
        e.stopPropagation();
        let idx = $("#handlePic").attr("data-index");
        let k = $("#handlePic").attr("data-flag");
        var image = new Image();

        if (idx < 9) {
            // console.log($("#patientPicture li").eq(idx).children("img").eq(1).attr("src"));
            image.src = $("#patientPicture li").eq(k).children("img").eq(1).attr("src");
        } else {


            // console.log(k);
            image.src = $("#XlightPage .section-c>div").eq(k).children("img").eq(1).attr("src");
        }

        // app.image2Base64(image.src, function (url) {
        var viewer = new Viewer(image, {
            hidden: function () {
                viewer.destroy();
            },
            viewed: function () {
                // $(".viewer-footer").prepend(`<a href="${image.src}" download="下载图片" class="viewer-download">长按图片区域下载图片</a><br>`);
            }
        });
        viewer.show();
        // });



        $("#handlePic").hide();
    });



    /* 点击替换图片 处理再次上传图片 */
    // new ImgUploader({
    //     el: document.querySelector('#replacePic input'),
    //     callback: function (res) {
    //         console.log('callback', res);
    //         // var file = this.files[0];
    //         // var filepath = this.value;
    //         // let iptDom = this;
    //         // if (!filepath) { return false; }

    //         let idx = $("#handlePic").attr("data-index");
    //         let k = $("#handlePic").attr("data-flag");
    //         if (idx < 9) {

    //             $("#patientPicture ul li").eq(k).children("img").eq(1).attr("src", res.img);
    //             $("#patientPicture ul li").eq(k).children("input").addClass("no-event");
    //         } else {
    //             $("#XlightPage .section-c>div").eq(k).children("img").eq(1).attr("src", res.img);
    //             $("#XlightPage .section-c>div").children("input").addClass("no-event");
    //         }
    //         // console.log(  $("#patientPicture ul li").eq(k).children("img").eq(1));
    //         eightStep.fileNumber = idx;
    //         eightStep.caseId = presentCaseId;
    //         eightStep.stageName = presentStageName;
    //         eightStep.stageCount = presentStageCount;
    //         eightStep.add = "N";
    //         eightStep.file = app.base64ToBlob(res.img);
    //         /* 请求上传的接口 */
    //         postEightStep();
    //         // app.sendFn(res.img).then((data) => {
    //         //     eightStep.file = data;
    //         //     /* 请求上传的接口 */
    //         //     postEightStep();
    //         // })


    //     }
    // });
    $("#replacePic input").on("change", function () {
        var file = this.files[0];
        // console.log(file);
        // var filetypes = [".jpg", ".png", ".jpeg", ".svg", '.gif'];
        var filepath = this.value;
        let iptDom = this;
        if (!filepath) { return false; }

        let idx = $("#handlePic").attr("data-index");
        let k = $("#handlePic").attr("data-flag");


        lrz(iptDom.files[0])
            .then(function (rst) {
                // console.log(rst);
                if (idx < 9) {

                    $("#patientPicture ul li").eq(k).children("img").eq(1).attr("src", rst.base64);
                    $("#patientPicture ul li").eq(k).children("input").addClass("no-event");
                } else {
                    $("#XlightPage .section-c>div").eq(k).children("img").eq(1).attr("src", rst.base64);
                    $("#XlightPage .section-c>div").children("input").addClass("no-event");
                }
                // console.log(  $("#patientPicture ul li").eq(k).children("img").eq(1));
                eightStep.fileNumber = idx;
                eightStep.caseId = presentCaseId;
                eightStep.stageName = presentStageName;
                eightStep.stageCount = presentStageCount;

                eightStep.file = file;
                eightStep.add = "N";
                /* 请求上传的接口 */
                postEightStep();
                // console.log(rst.origin);
            });
    })

    /* 切换展示合成照 */
    $(".choose div").on("click", function () {
        $(".choose div span").removeClass("circle");
        $(this).find("span").addClass("circle");
    })


    /* 点击上传患者照片中的关闭按钮  上传患者照片弹层隐藏并且更新头像信息 */
    $("#patientPicture .clear").on("click", function () {
        $("#patientPicture").hide();
        $(".choose div span").removeClass("circle");
        $(".choose .choose-l").find("span").addClass("circle");
        $("body").removeClass("beyond");
        $.ajax({
            async: false,
            type: "POST",
            url: app.apiUrl + "/caseInfo/getCaseInfo?t=" + app.random,
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                caseId: presentCaseId,
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            /* 成功的回调 */
            success: function (res) {
                let sexImg = "";
                let brandImg = "";
                if (res.code == 200) {
                    let particularsDatabase = JSON.parse(res.data);
                    // console.log(particularsDatabase)
                    datumName = particularsDatabase.patientName;
                    datumSex = particularsDatabase.sex;
                    datumHosId = particularsDatabase.hospitalId;
                    datumSiteId = particularsDatabase.deliveryAddressId;
                    datumHosName = particularsDatabase.hospitalName;
                    // datumDate = timestampToTime(parseInt(particularsDatabase.createTime));
                    presentStageName = particularsDatabase.stageName;
                    presentStageCount = particularsDatabase.stageCount;
                    caseInfoId = particularsDatabase.caseId;
                    let caseType = calculator(particularsDatabase.caseType);
                    console.log(caseType)
                    // caseType.reverse();
                    let caseTypeSrc = "";
                    caseType.reverse().forEach(item => {
                        caseTypeSrc += textArr[item] + ",";
                    })
                    caseTypeSrc = caseTypeSrc.substr(0, caseTypeSrc.length - 1);
                    if (particularsDatabase.sex == 1) {
                        sexImg = `<img src="img/sexn.png" class="img1">`;
                    } else {
                        sexImg = `<img src="img/sex.png">`;
                    }
                    let followFlag;
                    if ($(listthat).find(".attention").children("img").attr("src") == "img/star.png") {
                        followFlag = "true";
                    } else {
                        followFlag = "false";
                    }
                    if (particularsDatabase.caseBrand == "正丽科技自主创立品牌") {
                        brandImg = "img/MA.png";
                    } else {
                        brandImg = "img/SM.png";
                    }
                    let particularsData = `
                        <div class="specific-top">
                                                                                                                                                                                                                                                                                                                                                                                    <div class="definite">
                                                                                                                                                                                                                                                                                                                                                                                        <div class="specific-header">
                                                                                                                                                                                                                                                                                                                                                                                            <img src="${particularsDatabase.headUrl && particularsDatabase.headUrl.startsWith("http") ? particularsDatabase.headUrl : "img/default-header.png"}" >
                                </div>

                                                                                                                                                                                                                                                                                                                                                                                        <div class="specific-number">
                                                                                                                                                                                                                                                                                                                                                                                            <p>
                                                                                                                                                                                                                                                                                                                                                                                                <span class="specific-name">${particularsDatabase.patientName}</span>
                                                                                                                                                                                                                                                                                                                                                                                                <span class="case-attention" data-statu="${followFlag}"><img src=${$(listthat).find(".attention").children("img").attr("src")}></span>
                                    </p>
                                                                                                                                                                                                                                                                                                                                                                                                <p>
                                                                                                                                                                                                                                                                                                                                                                                                    <span class="sex-box">
                                                                                                                                                                                                                                                                                                                                                                                                        ${sexImg}
                                                                                                                                                                                                                                                                                                                                                                                                    </span>
                                                                                                                                                                                                                                                                                                                                                                                                    <span class="age-box">
                                                                                                                                                                                                                                                                                                                                                                                                        ${particularsDatabase.age}岁
                                        </span>
                                                                                                                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                                                                                                                <p>
                                                                                                                                                                                                                                                                                                                                                                                                    <span class="meaning">
                                                                                                                                                                                                                                                                                                                                                                                                    
                                        </span>
                                                                                                                                                                                                                                                                                                                                                                                                    <span class="sequence">
                                                                                                                                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                                                                                                                                                                    </span>
                                                                                                                                                                                                                                                                                                                                                                                                </p>
                                </div>
                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                        <div class="unfold">
                                                                                                                                                                                                                                                                                                                                                                                            <img src="img/management-jt-x.png">
                            </div>
                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                        <!-- 展开部分 -->
                        <div class="spread">
                                                                                                                                                                                                                                                                                                                                                                                            <!-- 地址及备注 -->
                            <div class="site">
                                                                                                                                                                                                                                                                                                                                                                                                <p>
                                                                                                                                                                                                                                                                                                                                                                                                    <span>诊所</span>:
                                    <span>${particularsDatabase.hospitalName}</span>
                                                                                                                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                                                                                                                <p>
                                                                                                                                                                                                                                                                                                                                                                                                    <span>备注</span>:
                                    <span class="comment">${particularsDatabase.remark}</span>

                                                                                                                                                                                                                                                                                                                                                                                                    <span class="staff-hide compile">
                                                                                                                                                                                                                                                                                                                                                                                                        <img src="img/compile.png">
                                    </span>
                                </p>
                                                                                                                                                                                                                                                                                                                                                                                                    <em class="change">确认</em>
                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                <!-- /地址及备注 -->
                            <!-- 品牌、类别及到期日 -->
                            <div class="due">
                                                                                                                                                                                                                                                                                                                                                                                                    <p class="parting">

                                                                                                                                                                                                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                                                                                                                                                                                                    <div class="due-box">
                                                                                                                                                                                                                                                                                                                                                                                                        <p>
                                                                                                                                                                                                                                                                                                                                                                                                            <span>品牌</span>:
                                        <span>
                                                                                                                                                                                                                                                                                                                                                                                                                <img src="${brandImg}">
                                        </span>
                                    </p>
                                                                                                                                                                                                                                                                                                                                                                                                            <p>
                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                            </p>
                                                                                                                                                                                                                                                                                                                                                                                                            <p>
                                                                                                                                                                                                                                                                                                                                                                                                                <span>临床分类</span>:
                                        <span class="classification">${caseTypeSrc}</span>
                                                                                                                                                                                                                                                                                                                                                                                                            </p>
                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                    <!-- /品牌、类别及到期日 -->
                            <!-- 编辑资料按钮 -->
                            <div class="${window.editBaseInfo ? "compile-btn" : "compile-btn no-event"}">
                                                                                                                                                                                                                                                                                                                                                                                                        <img src="img/compileicon.png">
                                                                                                                                                                                                                                                                                                                                                                                                            编辑资料
                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                        <!-- /编辑资料按钮 -->
                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                    <!-- /展开部分 -->
                `
                    $(".specific").html(particularsData);
                    /* 病例重启设置 id */
                    $("#supplementRestart").attr("data-id", particularsDatabase.caseId);
                    $(".case-management").hide();
                    $(".case-particulars").show();
                    $(".spread .change").hide();
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
    /* 患者照片 上传结束 */


    /* 查看物流进程 开始*/
    $(".logistics .back-img").on("click", function () {
        $(".case-particulars").show();
        $(".logistics").hide();
    })
    /* 查看物流进程 结束*/
});




//  * 2N 次方
//  * @param val 需要解密的代码
//  * @param str 如果需要返回对应的字符串就随便传个STR,如果需要返回索引就不传str
//  */
function calculator (val) {

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
function fn (val) {
    var lengthTooth = document.querySelectorAll("#teethbox li");
    for (var i = 0; i < lengthTooth.length; i++) {
        lengthTooth[i].attributes("data-index", i);
    }
}

function forin (obj) {
    var str = ""
    for (k in obj) {
        str += (k + '=' + ('"' + obj[k] + '"'))
    }
    // console.log(str)
    return str;
}

function judge () {
    $("#tooth li").forEach(value => {
        if (value.getAttribute("") == true) {

        }
        if (value.getAttribute("") == true) {

        }
        if (value.getAttribute("") == true) {

        }
        if (value.getAttribute("") == true) {

        }
        if (value.getAttribute("") == true) {

        }
    })
}

/* 替换小数点文字 */
function replaceDotNumber (data) {
    let reg = /^\d{1,4}[\.]?[\d]*$/;
    let res = reg.test(data) ? data : "";
    event.target.value = res;
}