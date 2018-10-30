var sock = io.connect("ws://127.0.0.1:3000")
document.querySelector('#submit').addEventListener('click', function(ev){
	var data = document.querySelector('[name=question]').value
	sock.emit("start", {opponent_name: data})

	sock.on('result', (data) => { 
		if(data.to === "start"){
			if(data.registered === false){
				document.getElementById("nickname").style = ""

				var nick = document.querySelector('[name=nickname]').value
				sock.emit("setName", {nickname: nick, token: data.token})
				document.cookie=data.token
			   }
			else{
				alert("是否直接進入遊戲")
			}
		}

	})
})
