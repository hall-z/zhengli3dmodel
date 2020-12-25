window.onload = function () {

    /* 接口 */
    var getLocalStorage = app.powerLocal();
    var token = getLocalStorage.token;
    /* 新建一个对象 */
    var obj = {};
    // var vConsole = new VConsole();
    function clinicalPreferences(){
        $.ajax({
            //请求方式
            type: "GET",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            async: false,
            //请求地址
            url: app.apiUrl + "/clinical/getClinical?t=" + app.random,
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求成功
            success: function (res) {
                // console.log(result);
                if (res.code == 200) {
                    if (!res.data || res.data == "null") return false;
                    let clinicArr = JSON.parse(res.data);
                    console.log(clinicArr);
    
                    // 1.牙位记录法
                    if (clinicArr.tooth == 1) {
                        $(".subject1 ul li").eq(0).addClass("active");
                        $(".subject1 ul li").eq(1).removeClass("active");
                        $(".subject1 ul li").eq(2).removeClass("active");
                    } else if (clinicArr.tooth == 2) {
                        $(".subject1 ul li").eq(1).addClass("active");
                        $(".subject1 ul li").eq(0).removeClass("active");
                        $(".subject1 ul li").eq(2).removeClass("active");
                    } else if (clinicArr.tooth == 3) {
                        $(".subject1 ul li").eq(2).addClass("active");
                        $(".subject1 ul li").eq(0).removeClass("active");
                        $(".subject1 ul li").eq(1).removeClass("active");
                    }
                    // 2.双颌治疗
                    if (clinicArr.bimaxillary == 1) {
                        $(".subject2 ul li").eq(0).addClass("active");
                        $(".subject2 ul li").eq(1).removeClass("active");
                        $(".subject2 ul li").eq(2).removeClass("active");
                    } else if (clinicArr.bimaxillary == 2) {
                        $(".subject2 ul li").eq(1).addClass("active");
                        $(".subject2 ul li").eq(0).removeClass("active");
                        $(".subject2 ul li").eq(2).removeClass("active");
                    } else if (clinicArr.bimaxillary == 3) {
                        $(".subject2 ul li").eq(2).addClass("active");
                        $(".subject2 ul li").eq(0).removeClass("active");
                        $(".subject2 ul li").eq(1).removeClass("active");
                    }
                    // 3.被动矫治器
                    if (clinicArr.passiveAppliance == 1) {
                        $(".subject3 ul li").eq(0).addClass("active");
                        $(".subject3 ul li").eq(1).removeClass("active");
                        $(".subject3 ul li").eq(2).removeClass("active");
                    } else if (clinicArr.passiveAppliance == 2) {
                        $(".subject3 ul li").eq(1).addClass("active");
                        $(".subject3 ul li").eq(0).removeClass("active");
                        $(".subject3 ul li").eq(2).removeClass("active");
                    } else if (clinicArr.passiveAppliance == 3) {
                        $(".subject3 ul li").eq(2).addClass("active");
                        $(".subject3 ul li").eq(0).removeClass("active");
                        $(".subject3 ul li").eq(1).removeClass("active");
                    }
                    // 4.初次OrthoPlus治疗方案中是否设计片切
                    if (clinicArr.isSlice == 0){
                        $(".subject4 ul li").eq(0).removeClass("active");
                        $(".subject4 ul li").eq(1).removeClass("active");
                    } else if (clinicArr.isSlice == 1) {
                        $(".subject4 ul li").eq(0).addClass("active");
                        $(".subject4 ul li").eq(1).removeClass("active");
                    } else if (clinicArr.isSlice == 2) {
                        $(".subject4 ul li").eq(1).addClass("active");
                        $(".subject4 ul li").eq(0).removeClass("active");
                    }
                    // 5.推迟步数再开始IPR
                    if (clinicArr.delayStepsIPR == 0){
                        $(".subject5 ul li").eq(0).removeClass("active");
                        $(".subject5 ul li").eq(1).removeClass("active");
                    } else if (clinicArr.delayStepsIPR == 1) {
                        $(".subject5 ul li").eq(0).addClass("active");
                        $(".subject5 ul li").eq(1).removeClass("active");
                    } else if (clinicArr.delayStepsIPR == 2) {
                        $(".subject5 ul li").eq(1).addClass("active");
                        $(".subject5 ul li").eq(1).children("p").children("input").val(clinicArr.stepsIPR);
                        $(".subject5 ul li").eq(0).removeClass("active");
                    }
                    // 6.推迟附件粘结
                    if (clinicArr.delayEnclosure == 0){
                        $(".subject6 ul li").eq(0).removeClass("active");
                        $(".subject6 ul li").eq(1).removeClass("active");
                    } else if (clinicArr.delayEnclosure == 1) {
                        $(".subject6 ul li").eq(0).addClass("active");
                        $(".subject6 ul li").eq(1).removeClass("active");
                    } else if (clinicArr.delayEnclosure == 2) {
                        $(".subject6 ul li").eq(1).addClass("active");
                        $(".subject6 ul li").eq(1).children("p").children("input").val(clinicArr.stepsEnclosure);
                        $(".subject6 ul li").eq(0).removeClass("active");
                    }
                    // 7.推迟拔牙步数
                    if (clinicArr.extraction == 0){
                        $(".subject7 ul li").eq(0).removeClass("active");
                        $(".subject7 ul li").eq(1).removeClass("active");
                    } else if (clinicArr.extraction == 1) {
                        $(".subject7 ul li").eq(0).addClass("active");
                        $(".subject7 ul li").eq(1).removeClass("active");
                    } else if (clinicArr.extraction == 2) {
                        $(".subject7 ul li").eq(1).addClass("active");
                        $(".subject7 ul li").eq(1).children("p").children("input").val(clinicArr.delayExtraction);
                        $(".subject7 ul li").eq(0).removeClass("active");
                    }
                    // 8.缺失牙填充物
                    if (clinicArr.missingTeeth == 1) {
                        $(".subject8 ul li").eq(0).addClass("active");
                        $(".subject8 ul li").eq(1).removeClass("active");
                    } else if (clinicArr.missingTeeth == 2) {
                        $(".subject8 ul li").eq(1).addClass("active");
                        $(".subject8 ul li").eq(0).removeClass("active");
                        if (clinicArr.missTeethOtherOne == true) {
                            $(".subject8 ul li .content > div").eq(0).addClass("current");
                        }else {
                            $(".subject8 ul li .content > div").eq(0).removeClass("current");
                        }
                        if (clinicArr.missTeethOtherTwo == true) {
                            $(".subject8 ul li .content > div").eq(1).addClass("current");
                        }else {
                            $(".subject8 ul li .content > div").eq(1).removeClass("current");
                        }
                    }
                    // 9.扩弓
                    if (clinicArr.expansionBimaxillary == 1) {
                        $(".subject9 ul li").eq(0).addClass("active");
                        $(".subject9 ul li").eq(1).removeClass("active");
                        $(".subject9 ul li").eq(2).removeClass("active");
                        $(".subject9 ul li").eq(3).removeClass("active");
                    } else if (clinicArr.expansionBimaxillary == 2) {
                        $(".subject9 ul li").eq(1).addClass("active");
                        $(".subject9 ul li").eq(0).removeClass("active");
                        $(".subject9 ul li").eq(2).removeClass("active");
                        $(".subject9 ul li").eq(3).removeClass("active");
                    } else if (clinicArr.expansionBimaxillary == 3) {
                        $(".subject9 ul li").eq(2).addClass("active");
                        $(".subject9 ul li").eq(0).removeClass("active");
                        $(".subject9 ul li").eq(1).removeClass("active");
                        $(".subject9 ul li").eq(3).removeClass("active");
                    } else if (clinicArr.expansionBimaxillary == 4) {
                        $(".subject9 ul li").eq(3).addClass("active");
                        $(".subject9 ul li").eq(0).removeClass("active");
                        $(".subject9 ul li").eq(1).removeClass("active");
                        $(".subject9 ul li").eq(2).removeClass("active");
                    }
                    // 10.每个象限的扩弓量
                    if (clinicArr.expansionCount == 1) {
                        $(".subject10 ul li").eq(0).addClass("active");
                        $(".subject10 ul li").eq(1).removeClass("active");
                    } else if (clinicArr.expansionCount == 2) {
                        $(".subject10 ul li").eq(1).addClass("active");
                        $(".subject10 ul li").eq(0).removeClass("active");
                    }
                    // 11.过小牙的处理
                    if (clinicArr.denticles == 1) {
                        $(".subject11 ul li").eq(0).addClass("active");
                        $(".subject11 ul li").eq(1).removeClass("active");
                        $(".subject11 ul li").eq(2).removeClass("active");
                    } else if (clinicArr.denticles == 2) {
                        $(".subject11 ul li").eq(1).addClass("active");
                        $(".subject11 ul li").eq(0).removeClass("active");
                        $(".subject11 ul li").eq(2).removeClass("active");
                    } else if (clinicArr.denticles == 3) {
                        $(".subject11 ul li").eq(2).addClass("active");
                        $(".subject11 ul li").eq(0).removeClass("active");
                        $(".subject11 ul li").eq(1).removeClass("active");
                    }
                    // 12.上切牙排齐选择
                    if (clinicArr.incisor == 1) {
                        $(".subject12 ul li").eq(0).addClass("active");
                        $(".subject12 ul li").eq(1).removeClass("active");
    
                        if (clinicArr.incisorOtherOne == true) {
                            $(".subject12 ul li .content>div").eq(0).addClass("current");
                        } else {
                            $(".subject12 ul li .content>div").eq(0).removeClass("current");
                        }
    
                        if (clinicArr.incisorOtherTwo == true) {
                            $(".subject12 ul li .content>div").eq(1).addClass("current");
                        }else {
                            $(".subject12 ul li .content>div").eq(1).removeClass("current");
                        }
                    } else if (clinicArr.incisor == 2) {
                        $(".subject12 ul li").eq(1).addClass("active");
                        $(".subject12 ul li").eq(0).removeClass("active");
                        $(".subject12 ul li .content>div").eq(0).removeClass("current");
                        $(".subject12 ul li .content>div").eq(1).removeClass("current");
                    }
                    // 13.矫治器边缘切割
                    if (clinicArr.applianceCutting == 1) {
                        $(".subject13 ul li").eq(0).addClass("active");
                        $(".subject13 ul li").eq(1).removeClass("active");
                    } else if (clinicArr.applianceCutting == 2) {
                        $(".subject13 ul li").eq(1).addClass("active");
                        $(".subject13 ul li").eq(0).removeClass("active");
                    }
                    // 14.针对间隙关闭,应用虚拟C-Chain
                    // if (clinicArr.clearance == 0){
                    //     $(".subject14 ul li").eq(0).removeClass("active");
                    //     $(".subject14 ul li").eq(1).removeClass("active");
                    // } else if (clinicArr.clearance == 1) {
                    //     $(".subject14 ul li").eq(0).addClass("active");
                    //     $(".subject14 ul li").eq(1).removeClass("active");
                    // } else if (clinicArr.clearance == 2) {
                    //     $(".subject14 ul li").eq(1).addClass("active");
                    //     $(".subject14 ul li").eq(0).removeClass("active");
                    // }
                    // 15.未端磨牙变形
                    if (clinicArr.deformation == 1) {
                        $(".subject15 ul li").eq(0).addClass("active");
                        $(".subject15 ul li").eq(1).removeClass("active");
                        $(".subject15 ul li").eq(2).removeClass("active");
                        if (clinicArr.deformationType == true) {
                            $(".subject15 ul li .content div").eq(0).addClass("current");
                        }else {
                            $(".subject15 ul li .content div").eq(0).removeClass("current");
                        }
                    } else if (clinicArr.deformation == 2) {
                        $(".subject15 ul li").eq(1).addClass("active");
                        $(".subject15 ul li").eq(0).removeClass("active");
                        $(".subject15 ul li").eq(2).removeClass("active");
                        $(".subject15 ul li .content div").eq(0).removeClass("current");
                    } else if (clinicArr.deformation == 3) {
                        $(".subject15 ul li").eq(2).addClass("active");
                        $(".subject15 ul li").eq(0).removeClass("active");
                        $(".subject15 ul li").eq(1).removeClass("active");
                        $(".subject15 ul li .content div").eq(0).removeClass("current");
                    }
                    // 17.优化附件尺寸(前牙)
                    if (clinicArr.frontSize == 1) {
                        $(".anteriorTeeth li").eq(0).addClass("active");
                        $(".anteriorTeeth li").eq(1).removeClass("active");
                    } else if (clinicArr.frontSize == 2) {
                        $(".anteriorTeeth li").eq(1).addClass("active");
                        $(".anteriorTeeth li").eq(0).removeClass("active");
                    }
                    // 17.优化附件尺寸(后牙)
                    if (clinicArr.frontSize == 1) {
                        $(".posteriorTeeth li").eq(0).addClass("active");
                        $(".posteriorTeeth li").eq(1).removeClass("active");
                    } else if (clinicArr.frontSize == 2) {
                        $(".posteriorTeeth li").eq(1).addClass("active");
                        $(".posteriorTeeth li").eq(0).removeClass("active");
                    }
                    // 18.尖牙及磨牙矢状向关系
                    if (clinicArr.relationship == 1) {
                        $(".subject18 ul li").eq(0).addClass("active");
                        $(".subject18 ul li").eq(1).removeClass("active");
                        $(".subject18 ul li").eq(2).removeClass("active");
                        if (clinicArr.relationshipType == true) {
                            $(".subject18 ul li .content div").eq(0).addClass("current");
                        }else {
                            $(".subject18 ul li .content div").eq(0).removeClass("current");
                        }
                    } else if (clinicArr.relationship == 2) {
                        $(".subject18 ul li").eq(1).addClass("active");
                        $(".subject18 ul li").eq(0).removeClass("active");
                        $(".subject18 ul li").eq(2).removeClass("active");
                        $(".subject18 ul li .content div").eq(0).removeClass("current");
                    } else if (clinicArr.relationship == 3) {
                        $(".subject18 ul li").eq(2).addClass("active");
                        $(".subject18 ul li").eq(0).removeClass("active");
                        $(".subject18 ul li").eq(1).removeClass("active");
                        $(".subject18 ul li .content div").eq(0).removeClass("current");
                    }
                    // 19.开始牵引的步骤
                    $(".subject19 .subject-bd .boxs input").val(clinicArr.step);
                    // 特殊需求
                    $(".demand textarea").text(clinicArr.specialRequirements);
                } else {
                    //提示
                    layer.open({
                        content: e.msg,
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
    clinicalPreferences()
    if($(".subject5 ul li").eq(0).hasClass("active")){
        $(".subject5 ul li").eq(1).find("input").attr("disabled",true);
    }else if($(".subject5 ul li").eq(1).hasClass("active")) {
        $(".subject5 ul li").eq(1).find("input").attr("disabled",false);
    }
    if($(".subject6 ul li").eq(0).hasClass("active")){
        $(".subject6 ul li").eq(1).find("input").attr("disabled",true);
    }else if($(".subject6 ul li").eq(1).hasClass("active")) {
        $(".subject6 ul li").eq(1).find("input").attr("disabled",false);
    }
    if($(".subject7 ul li").eq(0).hasClass("active")){
        $(".subject7 ul li").eq(1).find("input").attr("disabled",true);
    }else if($(".subject7 ul li").eq(1).hasClass("active")) {
        $(".subject7 ul li").eq(1).find("input").attr("disabled",false);
    }
    /* 附件页面牙齿6种状态数组 */
    let annxDataA = [];
    let annxDataB = [];
    let annxDataC = [];
    let annxDataD = [];
    let annxDataE = [];
    let annxDataF = [];
    function getAnnx() {
        /* 获取临床偏好中附件信息 */
        $.ajax({
            //请求方式
            type: "GET",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            async: false,
            //请求地址
            url: app.apiUrl + "/clinical/annx?t=" + app.random,
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求成功
            success: function (res) {
                // console.log(result);
                if (res.code == 200) {
                    var data = JSON.parse(res.data);
                    // console.log(data);
                    annxDataA = [];
                    annxDataB = [];
                    annxDataC = [];
                    annxDataD = [];
                    annxDataE = [];
                    annxDataF = [];
                    data.forEach(item => {
                        /* 旋转  颊侧  */
                        if (item.type == 1 && item.category == 1) {
                            annxDataA.push(item);
                        }

                        /* 旋转  舌侧  */
                        if (item.type == 1 && item.category == 2) {
                            annxDataB.push(item);
                        }

                        /* 保持  颊侧  */
                        if (item.type == 2 && item.category == 1) {
                            annxDataC.push(item);
                        }

                        /* 保持  舌侧  */
                        if (item.type == 2 && item.category == 2) {
                            annxDataD.push(item);
                        }

                        /* 伸长  颊侧  */
                        if (item.type == 3 && item.category == 1) {
                            annxDataE.push(item);
                        }

                        /* 伸长  舌侧  */
                        if (item.type == 3 && item.category == 2) {
                            annxDataF.push(item);
                        }
                    });

                    /* 默认是 旋转  颊侧 数据渲染 */
                    if (annxDataA.length > 0) {
                        showAnnxData(annxDataA);
                    }

                } else {
                    //提示
                    layer.open({
                        content: e.msg,
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

    /* 渲染附件选中状态牙齿状况 */
    let teethGraphical = [3,4,1,2,5,6,7];
    function showAnnxData(dataArr) {
        $(".appliance-box .teeth .up li p").html("");
        $(".appliance-box .teeth .down li p").html("");
        console.log(dataArr);

        // if ($(dom).hasClass("graphical_3")) {
        //     addTwoObj[addTwoObj.length - 1].annxType = 1;
        // } else if ($(dom).hasClass("graphical_4")) {
        //     addTwoObj[addTwoObj.length - 1].annxType = 2;
        // } else if ($(dom).hasClass("graphical_1")) {
        //     addTwoObj[addTwoObj.length - 1].annxType = 3;
        // } else if ($(dom).hasClass("graphical_2")) {
        //     addTwoObj[addTwoObj.length - 1].annxType = 4;
        // } else if ($(dom).hasClass("graphical_5")) {
        //     addTwoObj[addTwoObj.length - 1].annxType = 5;
        // } else if ($(dom).hasClass("graphical_6")) {
        //     addTwoObj[addTwoObj.length - 1].annxType = 6;
        // } else if ($(dom).hasClass("graphical_7")) {
        //     addTwoObj[addTwoObj.length - 1].annxType = 7;
        // }

        dataArr.forEach(item => {
            let teethIdx = app.teethArr.indexOf(item.teethIndex);
            if(teethIdx < 0) return false;
            /* 获取对应牙齿下标 */
            let x = teethIdx >= $(".appliance-box .teeth .up li").length ? teethIdx - $(".appliance-box .teeth .up li").length : teethIdx;
            let pushImg = "";

            pushImg = `<img src="img/graphical_${teethGraphical[item.annxType-1]}.png" class="graphical_${teethGraphical[item.annxType-1]}"></img>`;
            if (teethIdx < $(".appliance-box .teeth .up li").length) {
                /* 上排牙齿 */
                $(".appliance-box .teeth .up li").eq(x).children("p").html(pushImg);

            } else {
                /* 下排牙齿 */
                $(".appliance-box .teeth .down li").eq(x).children("p").html(pushImg);

            }

        })
    }

    /* 第一个答题页面 --------------------------------------------*/
    // 给 anteriorTeeth 下面的里 注册点击事件
    $(".anteriorTeeth li").on("click", function (event) {
        event.stopPropagation();
        if(!$(this).hasClass("active")){
            $(this).parent().parent("li").removeClass("active");
            $(this).addClass("active").siblings().removeClass("active");
        }else {
            $(this).removeClass("active");
        }
    })
    // posteriorTeeth 下面的里 注册点击事件
    $(".posteriorTeeth li").on("click", function (event) {
        event.stopPropagation();
        if(!$(this).hasClass("active")){
            $(this).parent().parent("li").removeClass("active");
            $(this).addClass("active").siblings().removeClass("active");
        }else {
            $(this).removeClass("active");
        }
    })
    /* 给subject-bd 下面的li 注册点击事件 */
    $(".subject-bd > ul > li").on("click", function () {
        
        /* 排他思想 */
        let parentIdx = $(this).parent().parent().parent().index();
        console.log(parentIdx);
        if(parentIdx == 15) return false;
        
        
        if(!$(this).hasClass("active")){
            $(this).addClass("active").siblings().removeClass("active");
            if (parentIdx == 7 || parentIdx == 11 || parentIdx == 14 || parentIdx == 17) {
                $(this).siblings().children(".content").children("div").removeClass("current");
            }
            if(parentIdx == 4 || parentIdx == 5 || parentIdx == 6){
                $(this).find("input").attr("disabled",false); 
                $(this).siblings().find("input").attr("disabled",true);  
            }
        }else {
            if(parentIdx == 4 || parentIdx == 5 || parentIdx == 6){
                $(this).find("input").attr("disabled",true);
                $(this).siblings().find("input").attr("disabled",false);  
            }
            $(this).siblings().find("input").attr("disabled",false); 
            $(this).removeClass("active");
            $(this).children(".content").children("div").removeClass("current");
        }
        if(parentIdx == 4 || parentIdx == 5 || parentIdx == 6){
            if(!$(".subject5 ul li").eq(1).hasClass("active")){
                console.log($(".subject5 ul li").eq(1).find("input"));
                $(".subject5 ul li").eq(1).find("input").val(0);
            }
            if(!$(".subject6 ul li").eq(1).hasClass("active")){
                console.log($(".subject6 ul li").eq(1).find("input"));
                $(".subject6 ul li").eq(1).find("input").val(0);
            }
            if(!$(".subject7 ul li").eq(1).hasClass("active")){
                console.log($(".subject7 ul li").eq(1).find("input"));
                $(".subject7 ul li").eq(1).find("input").val(0);
            }
        }

    })
    /* 给subject-bd-box 下面的li 注册点击事件 */
    $(".subject-bd-box > ul > li >ul >li").on("click", function () {
        /* 排他思想 */
        if(!$(this).hasClass("active")){
            $(this).addClass("active").siblings().removeClass("active");
        }else {
            $(this).removeClass("active");
        }

    })
    $(".subject5 .subject-bd ul li input").on("click", function (e) {
        e.stopPropagation();
        
        // if(!$(this).parent().parent().hasClass("active")){
        //     $(this).attr("disabled",true); 
        // }else {
        //     $(this).attr("disabled",false); 
            
        // }
    })
    $(".subject6 .subject-bd ul li input").on("click", function (e) {
        e.stopPropagation();
        // if(!$(this).parent().parent().hasClass("active")){
        //     $(this).attr("disabled",true); 
        // }else {
        //     $(this).attr("disabled",false); 
            
        // }
    })
    $(".subject7 .subject-bd ul li input").on("click", function (e) {
        e.stopPropagation();
        // if(!$(this).parent().parent().hasClass("active")){
        //     $(this).attr("disabled",true); 
        // }else {
        //     $(this).attr("disabled",false); 
           
        // }
    })
    /* 点击切换 */
    $(".content > div").on("click", function (event) {
        event.stopPropagation();
        if($(this).parent().parent().hasClass("active")){
            $(this).toggleClass("current");
        }
    })
    /* 点击了解详情 */
    $(".clinical-box .subject-hd a").on("click", function () {
        $(".learnMore").fadeOut();
        if ($(this).parent().siblings(".learnMore").is(":hidden")) {
            $(this).parent().siblings(".learnMore").fadeIn();
        } else {
            $(this).parent().siblings(".learnMore").fadeOut();
        }
    });

    /* 阻止a 默认跳转 点击查看 */
    $(".subject16 .subject-bd a").on("click", function (e) {
        e.preventDefault();
        getAnnx();
        $(".clinical-box").fadeOut();
        $(".appliance-box").fadeIn();
        $(".options .p-one a").eq(0).addClass("active");
        $(".options .p-one a").eq(0).siblings().removeClass("active");
        $(".options .p-two a").eq(0).addClass("active");
        $(".options .p-two a").eq(0).siblings().removeClass("active");
    });
    /* 第一个答题页面 ------------------------------------------- */


    /* 附加页面-------------------------------------------------- */
    /* 记录附件 1旋转 2保持 3伸长 */
    let annxType = 1;
    /* 记录附件类型 1 颊侧 2 舌侧 */
    let annxCategory = 1;
    /* 附加页面 a 标签的tab切换 */
    $(".appliance-box .options .p-one a").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        annxType = $(this).index() + 1;
        // console.log(annxDataA);
        if (annxType == 1 && annxCategory == 1) {
            showAnnxData(annxDataA);
        }
        if (annxType == 1 && annxCategory == 2) {
            showAnnxData(annxDataB);
        }

        if (annxType == 2 && annxCategory == 1) {
            showAnnxData(annxDataC);
        }
        if (annxType == 2 && annxCategory == 2) {
            showAnnxData(annxDataD);
        }

        if (annxType == 3 && annxCategory == 1) {
            showAnnxData(annxDataE);
        }
        if (annxType == 3 && annxCategory == 2) {
            showAnnxData(annxDataF);
        }

    });

    /* 附加页面 a 标签的tab切换 */
    $(".appliance-box .options .p-two a").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        annxCategory = $(this).index() + 1;

        if (annxType == 1 && annxCategory == 1) {
            showAnnxData(annxDataA);
        }
        if (annxType == 1 && annxCategory == 2) {
            showAnnxData(annxDataB);
        }

        if (annxType == 2 && annxCategory == 1) {
            showAnnxData(annxDataC);
        }
        if (annxType == 2 && annxCategory == 2) {
            showAnnxData(annxDataD);
        }

        if (annxType == 3 && annxCategory == 1) {
            showAnnxData(annxDataE);
        }
        if (annxType == 3 && annxCategory == 2) {
            showAnnxData(annxDataF);
        }
    });

    /* 附加页面-------------------------------------------------- */
    /* 弹窗------------------------------------------------------- */
    /* 选择当前的图形  给当前的图片加个背景样式 */
    $("#graphical li").on("click", function () {
        $("#graphical li").removeClass("active");
        $(this).addClass("active");
    });
    /* 清除 */
    $(".clear-wz").click(function () {
        $("#graphical li").removeClass("active");
        $(toothes).children('p').html("");
    })
    /* 点击弹窗的取消 */
    $("#graphical .cancel").on("click", function () {
        $("#graphical").fadeOut();
        $(".appliance-box").fadeIn();
    })
    /* 点击弹窗的保存 */
    $("#graphical .save").on("click", function () {
        $("#graphical").fadeOut();
        $(".appliance-box").fadeIn();
        $("#graphical li").each((idx, item) => {
            if ($(item).hasClass("active")) {
                $(toothes).children("p").html($(item).html());
            }
        });

        /* 更改数据状态 */
        if (annxType == 1 && annxCategory == 1) {
            annxDataA = updateAnnx();
        }
        if (annxType == 1 && annxCategory == 2) {
            annxDataB = updateAnnx();
        }

        if (annxType == 2 && annxCategory == 1) {
            annxDataC = updateAnnx();
        }
        if (annxType == 2 && annxCategory == 2) {
            annxDataD = updateAnnx();
        }

        if (annxType == 3 && annxCategory == 1) {
            annxDataE = updateAnnx();
        }
        if (annxType == 3 && annxCategory == 2) {

            annxDataF = updateAnnx();
        }
    });

    /* 更新牙齿标记数据 */
    function updateAnnx() {
        /* 新建一个数组接收数据 */
        var addTwoObj = [];
        /* 获取牙齿对应下标和标记整理数据给后台 */
        $(".appliance-box .up li").each((idx, item) => {
            addTwoObj.push({
                teethIndex: app.teethArr[(idx)],
                type: annxType,
                category: annxCategory,
                annxType: 0,
            });
            /* 如果当前对应下标里面有牙齿对应的图片 */
            if ($(item).children("p").children().length > 0) {
                $(item).children("p").children().each((k, dom) => {
                    if ($(dom).hasClass("graphical_3")) {
                        addTwoObj[addTwoObj.length - 1].annxType = 1;
                    } else if ($(dom).hasClass("graphical_4")) {
                        addTwoObj[addTwoObj.length - 1].annxType = 2;
                    } else if ($(dom).hasClass("graphical_1")) {
                        addTwoObj[addTwoObj.length - 1].annxType = 3;
                    } else if ($(dom).hasClass("graphical_2")) {
                        addTwoObj[addTwoObj.length - 1].annxType = 4;
                    } else if ($(dom).hasClass("graphical_5")) {
                        addTwoObj[addTwoObj.length - 1].annxType = 5;
                    } else if ($(dom).hasClass("graphical_6")) {
                        addTwoObj[addTwoObj.length - 1].annxType = 6;
                    } else if ($(dom).hasClass("graphical_7")) {
                        addTwoObj[addTwoObj.length - 1].annxType = 7;
                    }
                })
            } else {
                addTwoObj.pop();
            }
        })
        /* 获取牙齿对应下标和标记整理数据给后台 */
        $(".appliance-box .down li").each((idx, item) => {
            addTwoObj.push({
                teethIndex: app.teethArr[((idx + $(".appliance-box .up li").length))],
                type: annxType,
                category: annxCategory,
                annxType: 0,
            });
            /* 如果当前对应下标里面有牙齿对应的图片 */
            if ($(item).children("p").children().length > 0) {
                $(item).children("p").children().each((k, dom) => {
                    if ($(dom).hasClass("graphical_3")) {
                        addTwoObj[addTwoObj.length - 1].annxType = 1;
                    } else if ($(dom).hasClass("graphical_4")) {
                        addTwoObj[addTwoObj.length - 1].annxType = 2;
                    } else if ($(dom).hasClass("graphical_1")) {
                        addTwoObj[addTwoObj.length - 1].annxType = 3;
                    } else if ($(dom).hasClass("graphical_2")) {
                        addTwoObj[addTwoObj.length - 1].annxType = 4;
                    } else if ($(dom).hasClass("graphical_5")) {
                        addTwoObj[addTwoObj.length - 1].annxType = 5;
                    } else if ($(dom).hasClass("graphical_6")) {
                        addTwoObj[addTwoObj.length - 1].annxType = 6;
                    } else if ($(dom).hasClass("graphical_7")) {
                        addTwoObj[addTwoObj.length - 1].annxType = 7;
                    }
                })
            } else {
                addTwoObj.pop();
            }
        });

        return addTwoObj;
    }

    /* 新建一个变量 记录点击的是哪个牙齿 */
    var toothes = null;
    /* 点击牙齿  出弹层 */
    $(".appliance-box .teethbox li").on("click", function () {
        $("#graphical").fadeIn();
        $(".appliance-box .p-one a").each((idx, item) => {
            if ($(item).hasClass("active")) {
                $(this).attr('data-id', $(item).attr("data-id"));
            }
        })
        $(".appliance-box .p-two a").each((idx, item) => {
            if ($(item).hasClass("active")) {
                $(this).attr('data-in', $(item).attr("data-id"));
            }
        })
        toothes = this;
    })
    /* 附件页面返回 */
    $(".return").on("click", function () {
        $(".clinical-box").fadeIn();
        $(".appliance-box").fadeOut();
    });

    /* 重置附件页面 */
    $(".next-step").on("click", function () {
        // $(".clinical-box").fadeIn();
        // $(".appliance-box").fadeOut();
        $(".appliance-box .teethbox li p").html("");
        $(".appliance-box .p-one a").eq(0).addClass("active").siblings().removeClass("active");
        $(".appliance-box .p-two a").eq(0).addClass("active").siblings().removeClass("active");

        /* 更改数据状态 */
        if (annxType == 1 && annxCategory == 1) {
            annxDataA = [];
        }
        if (annxType == 1 && annxCategory == 2) {
            annxDataB = [];
        }

        if (annxType == 2 && annxCategory == 1) {
            annxDataC = [];
        }
        if (annxType == 2 && annxCategory == 2) {
            annxDataD = [];
        }

        if (annxType == 3 && annxCategory == 1) {
            annxDataE = [];
        }
        if (annxType == 3 && annxCategory == 2) {
            annxDataF = [];
        }
    });

    /* 点击牙齿页面的保存  牙齿隐藏  答题页面显示 */
    $(".appliance-box .last-step").on("click", function () {

        let addTwoObj = [...annxDataA, ...annxDataB, ...annxDataC, ...annxDataD, ...annxDataE, ...annxDataF];
        /* 保存临床偏好中附件信息 */
        $.ajax({
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            async: false,
            //请求地址
            url: app.apiUrl + "/clinical/saveAnnx?t=" + app.random,
            data: JSON.stringify(addTwoObj),
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求成功
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
                layer.open({
                    content: e.responseJSON.message,
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            }
        });
        $(".appliance-box").fadeOut();
        $(".clinical-box").fadeIn();
    })

    /* 点击修改提交 */
    $(".alter").on("click", function () {

        /* 当前标签的下标 */
        $(".subject1 > .subject-bd li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                obj.tooth = idx + 1;
            }
        })
        $(".subject2 > .subject-bd li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                obj.bimaxillary = idx + 1;
            }
        })
        $(".subject3 > .subject-bd li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                obj.passiveAppliance = idx + 1;
            }
        })


        if($(".subject4 ul > li").hasClass('active')) {
            $(".subject4 ul > li").each((idx,item)=>{
                if($(item).hasClass("active")){
                    obj.isSlice = idx + 1;
                }
                
            })
        }else {
            obj.isSlice = 0;
        }

        if($(".subject5 ul > li").hasClass('active')) {
            $(".subject5 ul > li").each((idx,item)=>{
                if($(item).hasClass("active")){
                    obj.delayStepsIPR = idx + 1;
                }
                
            })
        }else {
            obj.delayStepsIPR = 0;
        }
        $(".subject5 > .subject-bd li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                // obj.stepsEnclosure = idx + 1;
                if (idx == 1) {
                    obj.stepsIPR = $(item).find("input").val();
                }
            }
        });
        // if (!obj.delayStepsIPR && !$(item).find("input").val()) {
        //     // layer.open({
        //     //     content: res.msg,
        //     //     skin: 'msg',
        //     //     time: 2 //2秒后自动关闭
        //     // });
        // }

        if($(".subject6 ul > li").hasClass('active')) {
            $(".subject6 ul > li").each((idx,item)=>{
                if($(item).hasClass("active")){
                    obj.delayEnclosure = idx + 1;
                }
                
            })
        }else {
            obj.delayEnclosure = 0;
        }

        $(".subject6 > .subject-bd li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                // obj.stepsEnclosure = idx + 1;
                if (idx == 1) {
                    obj.stepsEnclosure = $(item).find("input").val();
                }
            }
        })

        if($(".subject7 ul > li").hasClass('active')) {
            $(".subject7 ul > li").each((idx,item)=>{
                if($(item).hasClass("active")){
                    obj.extraction = idx + 1;
                }
                
            })
        }else {
            obj.extraction = 0;
        }

        $(".subject7 > .subject-bd li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                // obj.delayExtraction = idx + 1;
                if (idx == 1) {
                    obj.delayExtraction = $(item).find("input").val();
                }

            }
        });

        $(".subject8 > .subject-bd li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                obj.missingTeeth = idx + 1;
            }
        })
        
        if($(".subject8 .content > div").hasClass('current')){
            $(".subject8 .content > div").each((idx,item) => {
                if($(".subject8 .content > .current").length == 1){
                    if($(".subject8 .content .current").index() == 1){
                        obj.missTeethOtherOne = true;
                        obj.missTeethOtherTwo = false;
                    }else if($(".subject8 .content .current").index() == 2){
                        obj.missTeethOtherTwo = true;
                        obj.missTeethOtherOne = false;
                    }
                }else {
                    obj.missTeethOtherOne = true;
                    obj.missTeethOtherTwo = true;
                }
            })
        }else {
            obj.missTeethOtherOne = false;
            obj.missTeethOtherTwo = false;
        }

        $(".subject9 > .subject-bd li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                obj.expansionBimaxillary = idx + 1;
            }
        })
        $(".subject10 > .subject-bd li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                obj.expansionCount = idx + 1;
            }
        })
        $(".subject11 > .subject-bd li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                obj.denticles = idx + 1;
            }
        })
        $(".subject12 > .subject-bd li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                obj.incisor = idx + 1;
            }
        })

        if($(".subject12 .content > div").hasClass('current')){
            $(".subject12 .content > div").each((idx,item) => {
                if($(".subject12 .content > .current").length == 1){
                    if($(".subject12 .content .current").index() == 1){
                        obj.incisorOtherOne = true;
                        obj.incisorOtherTwo = false;
                    }else if($(".subject12 .content .current").index() == 2){
                        obj.incisorOtherTwo = true;
                        obj.missTeethOtherOne = false;
                    }
                }else {
                    obj.incisorOtherOne = true;
                    obj.incisorOtherTwo = true;
                }
            })
        }else {
            obj.incisorOtherOne = false;
            obj.incisorOtherTwo = false;
        }

        $(".subject13 > .subject-bd li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                obj.applianceCutting = idx + 1;
            }
        })
        // if($(".subject14 ul > li").hasClass('active')) {
        //     $(".subject14 ul > li").each((idx,item)=>{
        //         if($(item).hasClass("active")){
        //             obj.clearance = idx + 1;
        //         }
                
        //     })
        // }else {
            obj.clearance = 0;
        // }
        
        $(".subject15 > .subject-bd li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                obj.deformation = idx + 1;
            }
        })
        if($(".subject15 .content > div").hasClass('current')){
            obj.deformationType = true;
        }else {
            obj.deformationType = false;
        }
        $(".anteriorTeeth li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                obj.afterSize = idx + 1;
            }
        })
        $(".posteriorTeeth li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                obj.frontSize = idx + 1;
            }
        })
        $(".subject18 > .subject-bd li").each((idx, item) => {
            if ($(item).hasClass('active')) {
                obj.relationship = idx + 1;
            }
        })
        if($(".subject18 .content > div").hasClass('current')){
            obj.relationshipType = true;
        }else {
            obj.relationshipType = false;
        }


        /* 18提 */
        var sub = $(".subject19 .boxs input").val();
        obj.step = sub;

        /* 用str 记录 textarea 里面value 的值 */
        obj.specialRequirements = $(".demand > textarea").val();

        $.ajax({
            //请求方式
            type: "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            async: false,
            //请求地址
            url: app.apiUrl + "/clinical/saveClinical?t=" + app.random,
            data: JSON.stringify(obj),
            beforeSend: function (xhr) {
                //不携带这个会报错
                xhr.setRequestHeader("Authorization", token);
            },
            //请求成功
            success: function (res) {
                if (res.code == 200) {
                    $("body").scrollTop(0);
                    layer.open({
                        content: "提交成功",
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
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
                // console.log(e.responseJSON.message);
                layer.open({
                    content: e.responseJSON.message,
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            }
        });
    })


    /* 点击取消  清除文本内容 */
    $("#returnCancel").on("click", function () {
        // $(".demand textarea").val("");
        clinicalPreferences();
        getAnnx();
        location.href = "./management.html";
    })
}