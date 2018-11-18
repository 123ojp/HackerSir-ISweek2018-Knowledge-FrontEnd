/*waiting畫面*/
var token = localStorage.getItem("token"); //把localStorage的東西拉回來
var use_bot = localStorage.getItem("use_bot");
var sock = io.connect(host, {transports: ["websocket"], upgrade: false});
var player;
//答對變色
function changeColor(who, correct) {
    var scoreDiv = $(`#${who}_score_div`);
    var newClassName = `score_div_${correct}`;
    scoreDiv.addClass(newClassName).delay(1000).queue(next => {
        $(scoreDiv).removeClass(newClassName);
        next();
    });
}

// 結算
function finish_show() {
    $("#main").hide();
    $(".q_box").hide();
    $("#mainend").show();
}

sock.on("connect", () => {

});

sock.on("hello", data => {
    $("#h1_bar").text("找尋對手中");
    sock.emit("start",{
        token: token
    });
});

//找到隊友
sock.on("start", data => {
    if (!data.ok) {
        alertify.confirm("遊戲產生錯誤，是否回到首頁重新登入？", e => {
            if (e) {
                location.href = "/";
            }
            else {
                location.reload();
            }
        });
    }
    $("#h1_bar").text("等待題目");
    $("#loading_box").hide();
    $("#show_player").show();
    $("#score").show();
    $("#h1_bar").hide();
    $("#player_id").text(`對手 : ${data.opponent_name}`); //對手名
    sock.emit("getProblem", {
        token: token
    });
});
//拿到題目
sock.on("getProblem", data => {
    $(".q_box").show();
    $("#question_h1").text(data.question);
    $(".problem").each((i, e) => {
        $(e).text(data.answers[i]);
    });
    $("#option").on("click", e => {
        var target = e.target;
        if (target.tagName.toUpperCase() === "A") {
            $("#option").off("click");
            sock.emit("answer", {
            token: token,
            answer: target.textContent
            });
        }
    });
});
//別人回答
sock.on("otheranswer", data => {
    if (data.correct) {
        changeColor("other", "right");
    }
    else {
        changeColor("other", "error");
    }
    $("#otherscore").text(data.score);
});

//對方斷線
sock.on("offline", data => {
    alertify.success("恭喜你獲勝<br>對方斷線");
    $("#haltrank").text(data.ranking);
    finish_show();
})

//回收答案
sock.on("answer", data => {
    $("#halt").text(data.score);
    $("#myscore").text(data.score);
    if (data.correct) {
        alertify.success("答對了");
        changeColor("self", "right");
    }
    else {
        alertify.error("答錯了");
        changeColor("self", "error");
    }
    sock.emit("getProblem", {
        token: token
    });
})
//結束
sock.on("halt", data => {
    if (data.win) {
        alertify.success("恭喜你獲勝");
    }
    else {
        alertify.error("你輸了qq");
    }
    $("#haltrank").text(data.ranking);
    finish_show();
})

sock.on("cancel", data => {
    if(data.cancelled) {
        alertify.log("成功取消");
        location.href = "/";
    }
})

$(() => {
    //區塊隱藏
    $(".q_box").hide();
    $("#score").hide();
    $("#show_player").hide();
    $("#cancel").on("click", () => {
        sock.emit("cancel", {
            token: token
        });
    });
})
