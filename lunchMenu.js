//all processing for the lunch menu is done here
//change the code to match your schools lunch menu

const { DownloaderHelper } = require('node-downloader-helper');

const pdfparse = require("pdf-parse")
const fs = require("fs")
function lunchMenu() {
    return new Promise((resolve, reject) => {
    const dl = new DownloaderHelper("https://fwparker.myschoolapp.com/ftpimages/1048/download/download_6209679.pdf", __dirname)
    dl.on("end", function() {
      let dataBuffer = fs.readFileSync(dl.getDownloadPath())
      pdfparse(dataBuffer).then(function(data) {
        var text = data.text.split("Monday:")[1]
        var l = {}
        var week = text.split("Tuesday:")
        l["Monday"] = week[0].split("\n").slice(1)
        week = week[1].split("Wednesday:")
        l["Tuesday"] = week[0].split("\n").slice(1)
        week = week[1].split("Thursday:")
        l["Wednesday"] = week[0].split("\n").slice(1)
        week = week[1].split("Friday:")
        l["Thursday"] = week[0].split("\n").slice(1)
        l["Friday"] = week[1].split("\n").slice(1)
        resolve(l)
      })
  
    })
    dl.start()
  })
}

  module.exports = {lunchMenu:lunchMenu};