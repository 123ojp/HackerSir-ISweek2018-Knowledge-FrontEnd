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


//找到隊友
sock.on('start', (data) => {
  $("#h1_bar").html("等待題目")
  $("#loading_box").hide()
  $("#show_player").show()
  $("#score").show()
  $("#h1_bar").hide()
  $("#player_id") = data.opponent_name //對手名
  sock.emit('getProblem')
})
//拿到題目
sock.on('getProblem', (data) => {
  $(".q_box").show()
  $("#question_h1").html(data.problem.question)
  $("#S0").html(data.problem.answers[0])
  $("#S1").html(data.problem.answers[1])
  $("#S2").html(data.problem.answers[2])
  $("#S3").html(data.problem.answers[3])
})
//別人回答
sock.on('otheranswer', (data) => {
  if (data.correct){
    alertify.log('對方答對了');
  } else {
    alertify.log('對方答錯了');
  }
  $("#otherscore").html(data.score)
})

//對方斷線
sock.on('offline', (data) => {

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

  //
  // /*遊戲畫面*/
  //
  // document.getElementById("mainwaiting").style = "display:none"
  // document.getElementById("main").style = ""
  // document.getElementById("mainend").style = "display:none"
  //
  // var data = document.querySelector('[name=question]').value
  // sock.emit("getProblem", {
  //   token: token
  // })
  //
  // sock.on('result', (data) => {
  //
  //   if (data.to === "getProblem") { //確認接到的回覆是哪個問題的
  //     document.getElementById("question").textContent = data.question //題目
  //     for (var i = 0; i < 4; i++) {
  //       document.getElementsByName("S" + i).textContent = data.answers[i] //陣列接選項
  //     }
  //   }
  // }) //接完題目
  //
  // function getanswer(theanswer) { //送出answer
  //   theanswer = theanswer.textContent
  //   sock.emit("answer", {
  //     answer: theanswer,
  //     token: token
  //   })
  //
  //   sock.on('result', (data) => {
  //     if (data.correct === true) {
  //       document.getElementById("myscore").textContent = data.score
  //     }
  //   })
  //   sock.on('otheranswer', (data) => {
  //     if (data.correct === true) {
  //       document.getElementById("otherscore").textContent = data.score
  //     }
  //   })
  //
  // }
  //
  // /*結束畫面*/
  //
  // sock.on('halt', (data) => { //結束畫面 mainend
  //   document.getElementById("mainwaiting").style = "display:none"
  //   document.getElementById("main").style = "display:none"
  //   document.getElementById("mainend").style = ""
  //   if (data.win === true) {
  //     document.getElementById("halt").textContent = "恭喜你贏了!!!"
  //     document.getElementById("haltrank").textContent = data.ranking
  //   } else { //data.win ===false
  //     document.getElementById("halt").textContent = "輸了沒關係，再接再厲"
  //     document.getElementById("haltrank").textContent = data.ranking
  //   }
  // })
  // sock.on('offline', (data) => {
  //   location.href = "/index.html"
  // })
