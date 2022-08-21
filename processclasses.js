//process classes from the input script and returns classes formmatted:
//{Period: [name, teacher_name, params, room_number]}

//Available params:
//color: "A", "B", "C", "D", "E", "F"
//main: true/false - used to indicate an alternative main class if the user doesnt have one.


//this function processes classes obtained from a script run on the progress page of a my school apps portal
//modify this function to suit your schools naming formats
function processClasses(user) {
    sciences = {"A Science":["A", "A Sci"], "B Science":["B", "B Sci"], "C Science":["C", "C Sci"], "D Science":["D", "CL1"], "E Science":["E", "Clark 3"],"F Science":["F", "W5"]}
    var out = {}
    classes = user.classes
    for (let c = 0; c < classes.length; c++) {
        if (!classes[c][0].includes("Independent Study")) {
        params = {}
        block = classes[c][0].split("(").slice(-1)[0].replace(")", "")
        block = block.split(", ")
        if (block[0] in sciences) {
          params.color = sciences[block[0]][0]
          block = sciences[block[0]]
  
  
        }
        name = classes[c][0].split(" -").slice(0, -1).join(" -")
        if (!classes[c][0].split(" -")[0].includes("Advanced Choral Ensemble")) {
        if (!name.includes("Phys Ed")) {
        block.forEach(function (b) {
          
          out[b.replace(/CL/g, "Clark ").replace(/W/g, "Webster ")] = [name, classes[c][1], params, classes[c][2]]
        })
      } else {
          if (!user.settings.pe) {
            block.forEach(function (b) {
  
              out[b.replace(/CL/g, "Clark ").replace(/W/g, "Webster ")] = [name, classes[c][1], params, classes[c][2]]
            })
          }
      }
      } else {
        out["Webster 3"] = ["Grape Jam", classes[c][1], params, classes[c][2]]
        out["Webster 5"] = ["Grape Jam", classes[c][1], params, classes[c][2]]
        out["GJ"] = ["Grape Jam", classes[c][1], params, classes[c][2]]
      }
    }}

    //add alternative main class if user doesnt have one for certain periods here

    //keep this
    out.settings = user.settings
    out.version = user.version
    return out;
  }

  module.exports = {processClasses:processClasses}