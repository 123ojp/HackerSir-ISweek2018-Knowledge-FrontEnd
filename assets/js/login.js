
var sock =  io.connect(host,{transports: ['websocket'], upgrade: false})

function playGame(){
  alertify.confirm('是否直接進入遊戲？', function (e) {
    if (e) {
      location.href = "/game.html";
    }
  });
}
//如果已經有token
if(localStorage.getItem("token")!=null && localStorage.getItem("token")!="undefined"){
  playGame()
}
//使用bot listiner
$('#use_bot').change(function(){
    if($(this).is(':checked')) {
        // Checkbox is checked..
        localStorage.setItem("use_bot", true)
    } else {
        localStorage.setItem("use_bot", false)
    }
});
sock.on("connect", function() {
    $("#sid").removeAttr("disabled");
    $("#start").removeAttr("disabled");
});
//送出學號
$("#sid").on("click", function() {
    if(localStorage.getItem("token")!=null && localStorage.getItem("token")!="undefined"){
      playGame()
      return
    }
    var data = $('#nid').val() //data 接
    var reS = /^[demp]{1}[0-9]{7}$/i;
    var reT = /^[t]{1}[0-9]{5}$/i;
    if (!reS.test(data) && !reT.test(data)) {
        alertify.error("NID格式錯誤，請重新輸入。");
    }
    else if (data === "") {
        alertify.error("請輸入NID。");
    } else {
        sock.emit("login", {
            username: data
        }) //把字改掉
        //		var token = document.querySelector('[name=token]').value//接token
        //		localStorage.setItem("token", token);//存token
        //  setName nickname token
    }
});
sock.on('login', (data) => {
  alertify.error("請輸入NID。");
        if (!data.ok) { //if 登入失敗
            alertify.error('登入失敗<br>'+data.mesg);
        }
        if (!data.registered) { //要 setName
            $("#nidform").hide();
            $("#nickform").show(); //nickname 顯示
            $("#title").html("請設定暱稱");
            localStorage.setItem("token", data.token);
        }
        else { //不用setName
          playGame();
        }

});
sock.on("setName", (data) => {
    if (!data.ok){
        alertify.error("SetNameError.");
    }
    else {
        playGame();
    }
});
$("#start").on("click", function() {
        var nickname = $('#nickname').val() //data 接

        sock.emit("setName", {
            nickname: nickname,
            token: localStorage.getItem("token"),
        }) //把字改掉

        //  setName nickname token

});
$(function(){
    $("#nickform").hide();
});

        // 	document.querySelector('#submit').addEventListener('click', function(ev){
        // 		var data = document.querySelector('[name=name]').value //data 接
        // 		sock.emit("login", {username: data}) //把字改掉
        //
        // 		var token = document.querySelector('[name=token]').value//接token
        // 		localStorage.setItem("token", token);//存token
        //
        //
        // 		sock.on('result', (data) => {
        // 			if(data.to === "login"){
        // 				if(data.registered === false){ //要 setName
        // 					document.getElementById("nickname").style = "" //nickname 顯示
        //
        // 					var nick = document.querySelector('[name=nickname]').value
        // 					sock.emit("setName", {nickname: nick, token: data.token},function(startgame){})
        // 					document.cookie=data.token
        //
        // 					location.href = "/game.html"
        //
        //
        // 				}
        // 				else{ //不用setName
        // 					alert("是否直接進入遊戲")
        // 					location.href = "/game.html"
        // 				}
        // 			}
        //
        // 		})
        // 	})
