function getScore() {
  $.ajax({
     type: "get",
     url: "/getRanking", // 填入網路應用程式網址
     success: function(e) {
       j = JSON.parse(e);
      $("#firstplace").text(j[0]['nickname']);
      $("#secendplace").text(j[1]['nickname']);
      $("#thridplace").text(j[2]['nickname']);
       for (i = 1 ; i<=j.length ; i++ ) {
         $("#name"+i).text(j[i-1]['nickname']);
         $("#score"+i).text(j[i-1]['ranking']);
       }
     }
  });
}
setInterval(getScore(),60000);
