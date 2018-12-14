/*waiting畫面*/
var token = localStorage.getItem("token"); //把localStorage的東西拉回來
var use_bot = localStorage.getItem("use_bot")==="false" ? false : true;
var sock = io.connect(host, {transports: ["websocket"], upgrade: false});
var player;
var getProblemFlag = false;
var myScore = 0;
var otherScore = 0;
var q_ques = [];
var q_ans = [];
var q_det = [];
var info_now = 0;
var info_max = 0;
//答對變色
function changeColor(who, correct) {
    var scoreDiv = $(`#${who}_score_div`);
    var newClassName = `score_div_${correct}`;
    scoreDiv.addClass(newClassName).delay(1000).queue(next => {
        scoreDiv.removeClass(newClassName);
        next();
    });
}

function getnext() {
  getProblemFlag = false;
  setTimeout(function(){
    var re_get_problem = setInterval(
      function(){
        if (getProblemFlag){
          clearInterval(re_get_problem);
        } else {
  	  sock.emit("getProblem", {
               token: token
            });
        }
      }
    ,1000);
  },5000);
}
function timmer_start() {
  $("#timmer").show();
  var pr_width = 90;
  var count_down = setInterval(
    function(){
      $(".progress-bar").css( "width", pr_width+"%" );
      pr_width-=1;
      if (pr_width < 0){
        clearInterval(count_down);
      }
    }
  ,100);
}
// 結算
function finish_show() {
    $("#main").hide();
    $(".q_box").hide();
    $("#mainend").show();
}
function set_info_q(){
  if (info_now == info_max){
    $("#mainend").show();
    $(".info").hide();
  } else {
    $("#info_question").text(q_ques[info_now]);
    $("#info_answer").text(q_ans[info_now]);
    $("#info_detail").text(q_det[info_now]);
    info_now += 1;
  }
}

sock.on("connect", () => {

});

sock.on("hello", data => {
    $("#h1_bar").text("找尋對手中");
    sock.emit("start",{
        token: token,
        use_bot: use_bot
    });
});

sock.on("break", data => {
    if (!data.ok){
      alertify.error("抱歉遊戲爆炸了<br>on break ok return false");
    }
    q_ans.push(data.answer)
    q_det.push(data.detail)
    setTimeout(getnext(), 5000);
    $(".problem").hide();
    $(".correct_answer_text").text(data.answer); //答案這裡要更新
    $(".correct_answer").fadeIn(500);
    $(".progress-bar").css( "width", "0%" );
});


//找到隊友
sock.on("start", data => {
    if (!data.ok) {
        alertify.confirm("遊戲產生錯誤，是否回到首頁重新登入？", e => {
            if (e) {
                localStorage.removeItem("token");
                location.href = "/";
            }
            else {
                location.reload();
            }
        });
    } else {
      $("#h1_bar").text("等待題目");
      $("#loading_box").hide();
      $("#show_player").show();
      $("#score").show();
      $("#h1_bar").hide();
      $("#player_id").text(`對手 : ${data.opponent_name}`); //對手名
      sock.emit("getProblem", {
          token: token
      });
    }
});
//拿到題目
sock.on("getProblem", data => {
    if (!data.ok) {
      alertify.error(`取得題目失敗<br>${data.mesg}`);
    } else {
      $(".progress-bar").css( "width", "100%" );
      getProblemFlag = true
      q_ques.push(data.question)
      setTimeout(function(){
           timmer_start();
      },500);
      $(".q_box").show();
      $("#question_h1").text(data.question);
      $(".correct_answer").hide();
      $(".problem").fadeIn(500);
      $(".problem").each((i, e) => {
          $(e).text(data.answers[i]);
      });
    }
});
//別人回答
sock.on("otheranswer", data => {
    if (data.correct) {
        changeColor("other", "right");
    }
    else {
        changeColor("other", "error");
    }
    otherScore += data.score;
    $("#otherscore").text(otherScore);
});

//對方斷線
sock.on("offline", data => {
    alertify.success("恭喜你獲勝<br>對方斷線");
    $("#haltrank").text(data.ranking);
    $("#halt").text(myScore);
    finish_show();
})

//回收答案
sock.on("answer", data => {
    if (!data.ok){
      return
    }
    myScore += data.score;
    $("#myscore").text(myScore);
    if (data.correct) {
        alertify.success("答對了");
        changeColor("self", "right");
    }
    else {
        alertify.error("答錯了");
        changeColor("self", "error");
    }
    $(".problem").hide();
    $(".correct_answer_text").text(data.answer);
    $(".correct_answer").fadeIn(500);
})
//結束
sock.on("halt", data => {
    if (data.win) {
        alertify.success("恭喜你獲勝");
    }
    else {
        alertify.error("你輸了qq");
    }
    getProblemFlag = true;
    $("#halt").text(myScore);
    $("#haltrank").text(data.ranking);
    finish_show();
})

sock.on("cancel", data => {
    if(data.cancelled) {
        alertify.success("成功取消");
        location.href = "/";
    }
})

$(() => {
    //區塊隱藏
    $("#timmer").hide();
    $(".q_box").hide();
    $("#score").hide();
    $("#show_player").hide();
    $("#cancel").on("click", () => {
        sock.emit("cancel", {
            token: token
        });
    });
    $("#option").on("click", e => {
        var target = e.target;
        if (target.tagName.toUpperCase() === "A") {
            sock.emit("answer", {
              token: token,
              answer: target.textContent
            });
        }
    });
    $("#info").on("click", function() {
      $("#mainend").hide();
      $(".info").show();
      info_max = q_ques.length;
      info_now = 0;
      set_info_q();
    });
    $("#info_next").on("click", function() {
      set_info_q();
    });


})
