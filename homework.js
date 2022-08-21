const ical = require('node-ical');
const classroom = require('./classroom');

const config = require('./config.json');
const fs = require("fs")


//probably not a great example but this works for now
async function retrieveHomework(classes, res, master, currPeriod, nextPeriod, timeString, day, colors, dayName, req, gc_courses, oAuth2Client, lunch, assemblies) {
    if (classes.settings.hasOwnProperty("homework") && classes.settings.homework != "") {
    ical.fromURL(classes.settings.homework, {}, async function(err, data) {
      var homework = {};
      var hclasses = {}
      var dates = {}
      var date = new Date();
      date.setHours(0,0,0,0);
      if (err) console.log(err);
      for (var [k, v] of Object.entries(classes)) {
        if (k != "settings" && k != "version") {
          if (!homework.hasOwnProperty(v[0])) {
            if (k.includes("Clark")) {
              k = "Clark"
            } else if (k.includes("Webster")) {
              k = "Webster"
            }
            if (!v[2].main) {
              homework[v[0]] = {"hw":{}, block:k}
              hclasses[v[0]] = {"hw":[], block:k}
            }
          }
        }
      }
  
      for (let d in data) {
        if (data[d].hasOwnProperty("start")) {
          var tDate = new Date(data[d].start);
          tDate.setHours(0,0,0,0)
        var dateString = tDate.toDateString().split(" ").slice(0, 3).join(" ")
          if (tDate >= date.getTime()) {
            var summary = decodeEntities(data[d].summary).split(": ")
            var assignment = summary.slice(1).join(": ")
            console.log(summary)
            summary[0] = summary[0].split(" -").slice(0, -1).join(" -")
            if (homework[summary[0]]["hw"].hasOwnProperty(dateString)) {
              homework[summary[0]]["hw"][dateString].push("• "+assignment)
            } else {
              homework[summary[0]]["hw"][dateString] = ["• "+assignment]
            }if (dates.hasOwnProperty(dateString)) {
              if (!classes.settings.hasOwnProperty("gcconfig") || classes.settings.gcconfig[summary[0]] === "Portal") {
              dates[dateString][summary[0]]["hw"].push("• "+assignment)
            }
            } else {
              if (!classes.settings.hasOwnProperty("gcconfig") || classes.settings.gcconfig[summary[0]] === "Portal") {
              dates[dateString] = JSON.parse(JSON.stringify(hclasses));
              dates[dateString][summary[0]]["hw"].push("• "+assignment)
            }
            }
          }
      }}
      if (classes.settings.hasOwnProperty("gcconfig")) {
        for (course of Object.keys(homework)) {
          if (classes.settings.gcconfig[course] != "Portal") {
            courseWork = await classroom.getCourseWork(oAuth2Client, classes.settings.gcconfig[course])
            works = {}
            for (work of courseWork){
              homework[course].hw = {}
              gchomework = JSON.parse(JSON.stringify(homework))
              if (work.hasOwnProperty("dueDate")) {
              tDate = new Date(work.dueDate.year.toString()+"-"+work.dueDate.month.toString()+"-"+work.dueDate.day.toString())
            } else {
              tDate = new Date("1970-1-1");
            }
              var dateString = tDate.toDateString().split(" ").slice(0, 3).join(" ")
              if (tDate >= date) {
                if (works.hasOwnProperty(dateString)) {
                  works[dateString].push("• "+work.title + "<br><a target='_blank' class='text-white' href='"+work.alternateLink+"'>View on Classroom</a>")
                } else {
                  works[dateString] = ["• "+work.title + "<br><a target='_blank' class='text-white' href='"+work.alternateLink+"'>View on Classroom</a>"]
                }if (dates.hasOwnProperty(dateString)) {
                  dates[dateString][course]["hw"].push("• "+work.title + "<br><a target='_blank' class='text-white' href='"+work.alternateLink+"'>View on Classroom</a>")
                } else {
                  dates[dateString] = JSON.parse(JSON.stringify(hclasses));
                  dates[dateString][course]["hw"].push("• "+work.title + "<br><a target='_blank' class='text-white' href='"+work.alternateLink+"'>View on Classroom</a>")
                }
              }
            }
            homework[course].hw = works
  
          }
        }
      } else {
        if (Object.entries(gc_courses).length > 0) {
        gcconfig = {}
        for (let course of Object.keys(homework)) {
          gcconfig[course] = "Portal"
        }
        user = JSON.parse(req.cookies.userID)
        user.settings.gcconfig = gcconfig
        res.cookie("userID", JSON.stringify(user), {maxAge:31556952000})
        res.redirect("/")
        return;
      }}
     homework["Lunch"] = {"hw":lunch, block:"Lunch"}
     homework["MX"] = {"hw":assemblies, block:"Lunch"}
     var ordered_dates = Object.entries(dates).sort(function(a, b) {
       let date1 = new Date(a[0]);
       let date2 = new Date(b[0])
       if (date1 <= date2) {
         return -1
       } else {
         return 1
       }
     })
  if (config.gc.use_gc) {
     fs.readFile(config.gc.path_to_credentials, function(err, data){
       credentials = JSON.parse(data)
       classroom_link = classroom.getAuthUrl(credentials)
       res.render('index.ejs', {master : master, user : classes, currPeriod:currPeriod, nextPeriod:nextPeriod, timeString:timeString, day:day, colors:colors, dayName:dayName, homework:homework, dates:ordered_dates, gc_courses:gc_courses, classroom_link:classroom_link, config:config})
  
   })}
   else {
      res.render('index.ejs', {master : master, user : classes, currPeriod:currPeriod, nextPeriod:nextPeriod, timeString:timeString, day:day, colors:colors, dayName:dayName, homework:homework, dates:ordered_dates, gc_courses:gc_courses, classroom_link:"", config:config})
   }
   });
  } else {
    var homework = {};
    var hclasses = {};
    var dates = {};
    var date = new Date();
    date.setHours(0,0,0,0)
    for (var [k, v] of Object.entries(classes)) {
      if (k != "settings" && k != "version") {
        if (!homework.hasOwnProperty(v[0])) {
          if (k.includes("Clark")) {
            k = "Clark"
          } else if (k.includes("Webster")) {
            k = "Webster"
          }
          if (!v[2].main) {
          homework[v[0]] = {"hw":{"Setup Homework":["Go to settings and follow directions."]}, block:k}
          hclasses[v[0]] = {"hw":[], block:k}
          }
        }
      }
    }
  if (classes.settings.hasOwnProperty("gcconfig")) {
    for (course of Object.keys(homework)) {
      if (classes.settings.gcconfig[course] != "Portal") {
        courseWork = await classroom.getCourseWork(oAuth2Client, classes.settings.gcconfig[course])
        works = {}
        for (work of courseWork){
          homework[course].hw = {}
          gchomework = JSON.parse(JSON.stringify(homework))
          if (work.hasOwnProperty("dueDate")) {
          tDate = new Date(work.dueDate.year.toString()+"-"+work.dueDate.month.toString()+"-"+work.dueDate.day.toString())
        } else {
          tDate = new Date("1970-1-1");
        }
          var dateString = tDate.toDateString().split(" ").slice(0, 3).join(" ")
          if (tDate >= date) {
            if (works.hasOwnProperty(dateString)) {
              works[dateString].push("• "+work.title + "<br><a target='_blank' class='text-white' href='"+work.alternateLink+"'>View on Classroom</a>")
            } else {
              works[dateString] = ["• "+work.title + "<br><a target='_blank' class='text-white' href='"+work.alternateLink+"'>View on Classroom</a>"]
            }if (dates.hasOwnProperty(dateString)) {
              dates[dateString][course]["hw"].push("• "+work.title + "<br><a target='_blank' class='text-white' href='"+work.alternateLink+"'>View on Classroom</a>")
            } else {
              dates[dateString] = JSON.parse(JSON.stringify(hclasses));
              dates[dateString][course]["hw"].push("• "+work.title + "<br><a target='_blank' class='text-white' href='"+work.alternateLink+"'>View on Classroom</a>")
            }
          }
        }
        homework[course].hw = works
  
      }
    }
  } else {
    if (Object.entries(gc_courses).length > 0) {
    gcconfig = {}
  //  console.log(homework)
    for (let course of Object.keys(homework)) {
      gcconfig[course] = "Portal"
    }
    user = JSON.parse(req.cookies.userID)
    user.settings.gcconfig = gcconfig
    res.cookie("userID", JSON.stringify(user), {maxAge:31556952000})
    res.redirect("/")
    return;
  }
  }
    homework["Lunch"] = {"hw":lunch, block:"Lunch"}
    homework["MX"] = {"hw":assemblies, block:"Lunch"}
    var ordered_dates = Object.entries(dates).sort(function(a, b) {
      let date1 = new Date(a[0]);
      let date2 = new Date(b[0])
      if (date1 <= date2) {
        return -1
      } else {
        return 1
      }
    })
  if (config.gc.use_gc) {
  fs.readFile(config.gc.path_to_credentials, function(err, data){
    credentials = JSON.parse(data)
    // Display the file content
    classroom_link = classroom.getAuthUrl(credentials)
    res.render('index.ejs', {master : master, user : classes, currPeriod:currPeriod, nextPeriod:nextPeriod, timeString:timeString, day:day, colors:colors, dayName:dayName, homework:homework, dates:ordered_dates, gc_courses:gc_courses, classroom_link:classroom_link, config:config})
  
  });
  } else {
    res.render('index.ejs', {master : master, user : classes, currPeriod:currPeriod, nextPeriod:nextPeriod, timeString:timeString, day:day, colors:colors, dayName:dayName, homework:homework, dates:ordered_dates, gc_courses:gc_courses, classroom_link:"", config:config})
  }
} 
  }

  module.exports = {retrieveHomework:retrieveHomework};