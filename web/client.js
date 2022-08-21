
var baseUrl;
$(function () {
  $("#baseUrl").html()
  if (!document.cookie.includes("userID")) {
//     var myModal = new bootstrap.Modal(document.getElementById('setSchedule'), {
//   keyboard: false,
//   backdrop: "static"
// });
  myModal.show();
  } else {
    document.getElementById("qrcode").src = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data="+baseUrl+"/setSchedule?schedule="+ getCookie("userID").replaceAll("%26", "AND");
    console.log(baseUrl+"/setSchedule?schedule="+ getCookie("userID").replace("%26", "AND"))
    if (JSON.parse(decodeURIComponent(getCookie("userID"))).version != "v3") {
      var myModal = new bootstrap.Modal(document.getElementById('v3'), {
    keyboard: false,
    backdrop: "static"
  });
    myModal.show();

    }
  }
})

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function copyCode() {
  // var text = `courses = document.getElementById("coursesContainer")

  // out = []
  // for (let c = 0; c < courses.children.length; c++) {
  //     try {
  //     o = [courses.children[c].getElementsByTagName("h3")[0].innerText, courses.children[c].getElementsByClassName("group-owner-name")[0].innerText, courses.children[c].getElementsByTagName("h5")[0].innerText.split(" |")[0]]
  //     out.splice(out.length, 0, o);
  //     } catch(err) {
  //       //pass
  //     }
  // }
  // console.log(JSON.stringify(out))
  var text = document.getElementById("grabber").innerHTML;

try {
  navigator.clipboard.writeText(text).then(function() {
    document.getElementById("copyCode").innerText = "Copied!"
    document.getElementById("copyCode").classList.remove("btn-primary")
    document.getElementById("copyCode").classList.add("btn-success")
  }, function(err) {
    console.error("Async: Could not copy text ", err);;
  })
} catch (err) {
  document.getElementById("code").classList.remove("hidden")
}
}

function copyLink() {
  var text = baseUrl+"/setSchedule?schedule="+ getCookie("userID").replaceAll("%26", "AND");
  navigator.clipboard.writeText(text).then(function() {
    document.getElementById("copyLink").innerText = "Copied!"
    document.getElementById("copyLink").classList.remove("btn-primary")
    document.getElementById("copyLink").classList.add("btn-success")
  }, function(err) {
    console.error("Async: Could not copy text ", err);;
  })
}

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}
