function getScore() {
  $.ajax({
     type: "get",
     url: "/getRanking", // 填入網路應用程式網址
     success: function(j) {
      if (j.length >= 1){
        $("#firstplace").text(j[0]['nickname']);
      } else {
        $("#firstplace").text("No one Here!");
      }
      if (j.length >= 2){
        $("#secendplace").text(j[1]['nickname']);
        $("#score_div3").show();
      } else {
        $("#score_div2").hide();
      }
      if (j.length >= 3){
        $("#thridplace").text(j[2]['nickname']);
        $("#score_div3").show();
      } else {
        $("#score_div3").hide();
      }
       for (i = 1 ; i<=j.length ; i++ ) {
         $("#name"+i).text(j[i-1]['nickname']);
         $("#score"+i).text(j[i-1]['ranking']);
       }
     }
  });
}
setInterval(getScore(),60000);
