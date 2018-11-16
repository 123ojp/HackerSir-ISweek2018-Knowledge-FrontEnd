/*waiting畫面*/

var token = localStorage.getItem("token"); //把localStorage的東西拉回來
var use_bot = localStorage.getItem("use_bot");
var sock =  io.connect(host,{transports: ['websocket'], upgrade: false})
var player;


//區塊隱藏
$("#q_box").hide()
$("#score").hide()
$("#show_player").hide()
sock.on('connect', function() {

})

sock.on('hello', (data) => {
  sock.emit('start',{
    token:token
  })
})
// 結算
function finish_show(){
  $("#main").hide()
  $(".q_box").hide()
  $("#mainend").show()
}

//找到隊友
sock.on('start', (data) => {
  $("#h1_bar").html("等待題目")
  $("#loading_box").hide()
  $("#show_player").show()
  $("#score").show()
  $("#h1_bar").hide()
  $("#player_id").html("對手 : "+data.opponent_name) //對手名
  sock.emit('getProblem',{
    token:token
  })
})
//拿到題目
sock.on('getProblem', (data) => {
  $(".q_box").show()
  $("#question_h1").html(data.question)
  $("#S0").html(data.answers[0])
  $("#S1").html(data.answers[1])
  $("#S2").html(data.answers[2])
  $("#S3").html(data.answers[3])
  $("#option").on("click", function(e) {
      console.log("Send anwser");
      var target = e.target;
      if (target.tagName.toUpperCase() === "A") {
          $("#option").off("click");
          sock.emit("answer", {
              token: token,
              answer: target.textContent
          });
      }
  });

})
//別人回答
sock.on('otheranswer', (data) => {
  if (data.correct){
    alertify.success('對方答對了');
  } else {
    alertify.error('對方答錯了');
  }
  $("#otherscore").html(data.score)
})

//對方斷線
sock.on('offline', (data) => {
  alertify.success('恭喜你獲勝<br>對方斷線');
  $("#haltrank").html(data.ranking)
  finish_show()
})

//回收答案
sock.on('answer', (data) => {
  $("#halt").html(data.score)
  $("#myscore").html(data.score)
  if (data.correct) {
    alertify.success('答對了');
  } else {
    alertify.error('答錯了');
  }
  sock.emit('getProblem',{
    token:token
  })
})
//結束
sock.on('halt', (data) => {
  if (data.win){
    alertify.success('恭喜你獲勝');
  } else {
    alertify.error('你輸了qq');
  }
  $("#haltrank").html(data.ranking)
  finish_show()
})

$("#cancel").on("click", function() {
    sock.emit('cancel', {
      token: token
    })
});
sock.on('cancel', (data) => {
  if(data.cancelled === true){
    alertify.log('成功取消');
    location.href = "/";
  }
})
$(function(){

})
