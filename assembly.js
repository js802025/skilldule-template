//retrieve the assemblies for your school


const https = require('https')

function retrieveAssemblies() {
    return new Promise((resolve, reject) => {
    const options = {
    hostname: 'amozongamer.000webhostapp.com',
    port: 443,
    path: '/witandskilldule.json',
    method: 'GET'
  }
  var data = ""
  const req = https.request(options, res => {
  //  console.log(`statusCode: ${res.statusCode}`)
    res.on('data', chunk => {
      data += chunk;
    })
    res.on('end', () => {
      var text = decodeURIComponent(data).split("+").join(" ")
      text = text.split("y,")
      var m = {}
    //  console.log(text)
      var weekdays = ["Monda", "Tuesda", "Wednesda", "Thursda", "Frida"]
      for (var e of text.slice(1)) {
        var i = e.split("\n")
        var date = new Date(i[0].split(":")[0] + " 2022")
  
        if (weekdays.includes(i.slice(-1)[0])) {
        //  console.log(i.slice(-1)[0])
          i.splice(-1)
        } else {
          i[i.length-1] = i[i.length-1].slice(0, -1)
        }
        m[date.toDateString().split(" ").slice(0, 3).join(" ")] = i.slice(1)
  
        }
    //  console.log(m)
      resolve(m)
      });
  })
  
  req.on('error', error => {
    console.error(error)
  })
  
  req.end()
})
  }

    module.exports = {retrieveAssemblies:retrieveAssemblies};