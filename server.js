//main file, run this
//shouldnt need to change anything here (for a basic setup)

const express = require('express')
const CookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const classroom = require('./classroom');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { URLSearchParams } = require('url');
const {lunchMenu} = require('./lunchMenu')
const {retrieveAssemblies} = require('./assembly')
const {retrieveHomework} = require('./homework')
const {retrieveSchedule} = require('./schedule')
const {processClasses} = require('./processclasses')
const config = require('./config.json')


const fs = require("fs")
const app = express()
const port = process.env.PORT || 80
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
function timeString(time) {
  currentDate = new Date()

  startDate = new Date(currentDate.getTime());
  startDate.setHours(time[0].split(":")[0]);
  startDate.setMinutes(time[0].split(":")[1]);

  endDate = new Date(currentDate.getTime());
  endDate.setHours(time[1].split(":")[0]);
  endDate.setMinutes(time[1].split(":")[1]);

  return startDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).split(" ")[0] + "-"+ endDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).split(" ")[0]

}
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
var lunch;

lunchMenu().then(menu => {
  lunch = menu
}).catch(err => { console.log(err)})

var assemblies;

retrieveAssemblies().then(a => {
  assemblies = a
}).catch(err => { console.log(err)})





function setClassroom(req, res, token) {
  if (token.hasOwnProperty("access_token")) {
  user = JSON.parse(req.cookies.userID)
  user.settings.classroom = token
  res.cookie("userID", JSON.stringify(user), {maxAge:31556952000})
  res.redirect("/")
}
}

MAIN = config.color.MAIN
A = config.color.A
B = config.color.B
C = config.color.C
D = config.color.D
E = config.color.E
F = config.color.F
CLARK = config.color.CLARK
WEBSTER = config.color.WEBSTER
ADV = config.color.ADV
colors = {"A":A, "B":B, "C":C, "D":D, "E":E, "F":F, "Lunch":MAIN, "Clark":CLARK, "Webster":WEBSTER}

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/web'));
app.use(CookieParser())
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(port)
var io = require("socket.io")(server)


//22-23
var master = retrieveSchedule()

//skilldule chats stuff
if (config.discord.use_skilldule_chats) {
client.login(config.discord.token)
// });
function leaveChannels(u) {
  return new Promise((resolve, reject) => {
  if (u.settings.hasOwnProperty("discord")) {
  var classes = u.classes
 
        client.guilds.fetch(config.discord.guild_id).then((guild) => {
          client.users.fetch(u.settings.discord).then((us) => {
        //  console.log(us)
          classes.forEach((c, i) => {
            var name = c[0]
            name = name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

            name = name.split(" -").slice(0, -1).join(" -").replaceAll(" ", "-").replaceAll(":", "").replaceAll("&", "").split("-")
            name = name.filter(e => {
              return e != ""
            })
            name = (name.join("-") +"-"+c[1].split(" ").at(-1)).toLowerCase()
            console.log(name)
            var channel = guild.channels.cache.find(ch => ch.name === name)
            if (channel != undefined) {
              console.log(name)
              channel.permissionOverwrites.edit(us, {SEND_MESSAGES: false, VIEW_CHANNEL: false, READ_MESSAGE_HISTORY: false}).then(() => {
                if (i === classes.length -1 ) {
                  resolve()
                }
            }) 
          } else {
            if (i === classes.length -1 ) {
              resolve()
            }
          }
        })
        })
      })

  } else {
    resolve()
  }
})

}

function joinChannels(u) {
  return new Promise((resolve, reject) => {
  if (u.settings.hasOwnProperty("discord")) {
  var classes = u.classes
 
        client.guilds.fetch(config.discord.guild_id).then((guild) => {
          client.users.fetch(u.settings.discord).then((us) => {
          classes.forEach((c, i) => {
            var name = c[0]
            name = name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
            name = name.split(" -").slice(0, -1).join(" -").replaceAll(" ", "-").replaceAll(":", "").split("-")
            name = name.filter(e => {
              return e != ""
            })
            name = (name.join("-") +"-"+c[1].split(" ").at(-1)).toLowerCase()
            var channel = guild.channels.cache.find(ch => ch.name === name)
            if (channel != undefined) {
              channel.permissionOverwrites.edit(us, {SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true}).then(() => {
                if (i === classes.length -1 ) {
                  resolve()
                }
            }) 
          } else {
            guild.channels.create(name, {
              type: "text",
              permissionOverwrites: [{
                id: guild.roles.everyone,
                deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
              }]
            }).then(channel => {
              let category = guild.channels.cache.find(c => c.name == "Classes" && c.type == "GUILD_CATEGORY");
              channel.setParent(category).then(() => {
              channel.permissionOverwrites.edit(us, {SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true}).then(() => {
                if (i === classes.length -1) {
                  res.redirect("/")
                }
              })
            })
            })
            
          }
        })
        })
      })

  } else {
    resolve()
  }
})

}

}


app.get('/', (req, res) => {
  if ("userID" in req.cookies) {
  var user;
  u = JSON.parse(req.cookies.userID)
  if ("classes" in u) {
    user = processClasses(u)
  } else {
    user = u
  }
  //april fools moment
    if (new Date().getMonth() === 3 && new Date().getDate() === 1) {
      master[new Date().getDay()] = [[["8:10", "9:00"], "F", false, F], [["9:05", "9:55"], "B", false, B], [["10:00", "10:50"], "A", false, A], [["10:50", "11:30"], "MX", true, MAIN], [["11:35", "12:25"], "C", false, C], [["12:30", "13:00"], "Lunch", true, MAIN], [["13:05", "13:45"], "SG", true, MAIN], [["13:50", "14:40"], "B", false, B], [["14:45", "15:35"], "Webster 5", false, WEBSTER], [["15:35", "16:25"], "GJ", false, WEBSTER]]
    }
    var currPeriod;
    var nextPeriod;
    master[new Date().getDay()].forEach((block, i) => {
      let startTime = block[0][0];
      let endTime = block[0][1];


      currentDate = new Date()
      startDate = new Date(currentDate.getTime());
      startDate.setHours(startTime.split(":")[0]);
      startDate.setMinutes(startTime.split(":")[1]);

      endDate = new Date(currentDate.getTime());
      endDate.setHours(endTime.split(":")[0]);
      endDate.setMinutes(endTime.split(":")[1]);


      valid = startDate <= currentDate && endDate >= currentDate
      if (valid) {
        currPeriod = i
        master[new Date().getDay()].slice(i+1).every((nextClass, x) => {
          let userHasClass;
          if (nextClass[1] in user || nextClass[2] === true) { userHasClass = true } else { userHasClass = false}
        if (userHasClass) {
          nextPeriod = x+i+1
          return false;
        }
        return true;
        });

      }
    });
    if (nextPeriod >= master[new Date().getDay()].length) {
      nextPeriod = undefined
    }
    if (typeof currPeriod === "undefined") {

      var previousEnd = new Date()
      previousEnd.setHours(0,0,0,0);
      master[new Date().getDay()].every((block, i) => {
        let userHasClass;
        let startTime = block[0][0];
        let endTime = block[0][1];
        if (block[1] in user || block[2] === true) { userHasClass = true } else { userHasClass = false}

        currentDate = new Date()
        startDate = new Date(currentDate.getTime());
        startDate.setHours(startTime.split(":")[0]);
        startDate.setMinutes(startTime.split(":")[1]);

        endDate = new Date(currentDate.getTime());
        endDate.setHours(endTime.split(":")[0]);
        endDate.setMinutes(endTime.split(":")[1]);
        if (startDate > currentDate && currentDate > previousEnd && userHasClass) {
          nextPeriod = i
          return false;
        }
        if (userHasClass) { previousEnd = endDate}
        return true;
      });
    }
    day = new Date().getDay();
    dayName = "Today"
    if (typeof currPeriod === "undefined" && typeof nextPeriod === "undefined" && master[day].length > 0) {
      day++;
      dayName = "Tomorrow"
    }
    //console.log(user)
    //homework = retrieveHomework(user, res, master, currPeriod, nextPeriod, timeString, day, colors, dayName, res);
    try {
    if (user.settings.hasOwnProperty("classroom")) {
      fs.readFile(config.gc.path_to_credentials, (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Classroom API.
        credentials = JSON.parse(content)
        classroom.refreshAccessToken(credentials, user.settings.classroom, user, res, master, currPeriod, nextPeriod, timeString, day, colors, dayName, req, lunch, assemblies, retrieveHomework);

      });

    } else {
      homework = retrieveHomework(user, res, master, currPeriod, nextPeriod, timeString, day, colors, dayName, req, {}, {}, lunch, assemblies);
    }
  } catch {
    res.clearCookie("userID")
    res.redirect("/")
  }
  } else {
    res.render("home.ejs", {config:config})
  }
})

app.get('/setSchedule', (req, res) => {
  var schedule = req.query.schedule.replace("undefined", "")
  if (isJson(schedule)) {
    res.cookie("userID", schedule.replace(/AND/g, "&"), {maxAge:31556952000})
  }

  res.redirect("/")
})

app.get('/setSettings', (req, res) => {
  var settings = {}
  var settingslist = ["rnumber", "tname", "period", "pe", "homework"]
  for (var [key, value] of Object.entries(req.query)) {
    if (value === "true" || value === "false") {
      settings[key] = JSON.parse(value)
    } else {
      if (!settingslist.includes(key)) {
        if (settings.hasOwnProperty("gcconfig")) {
          settings.gcconfig[key] = value
        } else {
          settings.gcconfig = {}
          settings.gcconfig[key] = value
        }
      } else {
        settings[key] = value
      }

    }

  }
  user = JSON.parse(req.cookies.userID)
  settings.classroom = user.settings.classroom;
  user.settings = settings
  res.cookie("userID", JSON.stringify(user), {maxAge:31556952000})

  res.redirect("/")
})

app.get("/processInput", (req, res) => {
  if (isJson(req.query.classes)) {
  classes = JSON.parse(req.query.classes)
  //new skilldule check
  if (classes.constructor == Array) {
    if (req.cookies.userID != undefined) {
    
      user = JSON.parse(req.cookies.userID)
      leaveChannels(user).then(() => {
        user.classes = classes
      delete user.settings.gcconfig
      res.cookie("userID", JSON.stringify(user), {maxAge:31556952000})
      joinChannels(user).then(() => {
        res.redirect("/")
      })
      })
      
    } else {
      classes = {"classes":classes, "settings":{"tname":true, "rnumber":false, "period":false}, "version":"v3"}
      res.cookie("userID", JSON.stringify(classes), {maxAge:31556952000})
      res.redirect("/")
    }

  }

}
  
})
app.get("/setVersion", (req, res) => {
  user = JSON.parse(req.cookies.userID)
  user.version = req.query.version
  res.cookie("userID", JSON.stringify(user), {maxAge:31556952000})
  res.redirect("/")
})
if (config.gc.use_gc) {
app.get("/connectClassroom", (req, res) => {
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Classroom API.
    credentials = JSON.parse(content)
    classroom.getToken(credentials, req.query.code, req, res, setClassroom)
})
})
}

if (config.discord.use_skilldule_chats) {
app.get("/connectDiscord", (req, res) => {
  const params =  new URLSearchParams()
  params.append('client_id', config.discord.client_id)
  params.append('client_secret', config.discord.client_secret)
  params.append('grant_type', "authorization_code")
  params.append('code', req.query.code)
  params.append('redirect_uri', config.general.base_url+"/connectDiscord")
  params.append('scope', "identify guilds.join")
  fetch("https://discord.com/api/v10/oauth2/token", { method:"POST", body: params}).then(response => response.json()).then((response) => {
    console.log(response)
    fetch("https://discord.com/api/v6/users/@me", { headers: { Authorization: "Bearer " + response.access_token}}).then(e => e.json()).then((user) => {
      fetch("https://discord.com/api/guilds/"+config.discord.guild_id+"/members/" + user.id, { method:"PUT", headers: { Authorization: "Bot OTkyODgwMzc3MTI5NTk4OTk3.GxTUuh.hyomLjQd-pmHtiM41T6R4aiudujSxD-myESn6Q", "Content-Type":"application/json"}, body: JSON.stringify({access_token: response.access_token})}).then(a => {
          client.users.fetch(user.id).then((us) => {
          var u = JSON.parse(req.cookies.userID)
          u.settings.discord = user.id
          res.cookie("userID", JSON.stringify(u), {maxAge:31556952000})
          joinChannels(u).then(() => {
            res.redirect("/")
          })
          
      })
   })
})
  })
})
}

app.get("/setup", (req, res) => {
  res.render("setup.ejs")
})