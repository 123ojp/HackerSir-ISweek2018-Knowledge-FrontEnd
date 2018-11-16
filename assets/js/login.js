var sock = io.connect("ws://140.134.208.90:20000")

$("#sid").on("click", function() {
    var data = $('#nid').val() //data 接
    var reS = /^[demp]{1}[0-9]{7}$/i;
    var reT = /^[t]{1}[0-9]{5}$/i;
    if (!reS.test(data) && !reT.test(data)) {
        alertify.error("NID格式錯誤，請重新輸入。");
    }
    else if (data == "") {
        alertify.error("請輸入暱稱。");
    } else {
        sock.emit("login", {
            username: data
        }) //把字改掉
        //		var token = document.querySelector('[name=token]').value//接token
        //		localStorage.setItem("token", token);//存token
        //  setName nickname token
        sock.on('result', (data) => {
            if(data.to === "login"){
                if (!data.ok) { //if 登入失敗
                    alertify.error('登入失敗'+data.mesg);
                }
                if (!data.registered) { //要 setName
                    $("#nickform").style = "" //nickname 顯示
                    $("#title").html("請設定暱稱")
                    localStorage.setItem("token", data.token)
                }
                else { //不用setName
                  alertify.confirm('是否直接進入遊戲？', function (e) {
                    if (e) {
                      location.href = "/game.html";
                    }
                  });
                }
            }
        });
    }
});
    $("#start").on("click", function() {
            var nickname = $('#nickname').val() //data 接

            sock.emit("setName", {
                nickname: nickname,
                token: "dd"
            }) //把字改掉

            //  setName nickname token

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
