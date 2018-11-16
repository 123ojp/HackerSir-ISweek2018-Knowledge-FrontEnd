//	if ('addEventListener' in window) {
    window.addEventListener('load', function() { document.body.className = document.body.className.replace(/\bis-preload\b/, ''); });
    document.body.className += (navigator.userAgent.match(/(MSIE|rv:11\.0)/) ? ' is-ie' : '');
//	}



  var sock = io.connect("ws://140.134.208.90:20000")
  $("#sid").on( "click", function() {
    var data = $('#nid').val() //data 接
    sock.emit("login", {username: data}) //把字改掉

//		var token = document.querySelector('[name=token]').value//接token
//		localStorage.setItem("token", token);//存token
    sock.on('result', (data) => {
      if(data.to === "login"){
        if(data.registered === false){ //要 setName
          document.getElementById("nickname").style = "" //nickname 顯示

          var nick = document.querySelector('[name=nickname]').value
          sock.emit("setName", {nickname: nick, token: data.token},function(startgame){})
          document.cookie=data.token

          location.href = "/game.html"


        }
        else{ //不用setName
          alert("是否直接進入遊戲")
          location.href = "/game.html"
        }
      }

    })
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
