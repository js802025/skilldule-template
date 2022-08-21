// sciences = {"A Science":["A", "A Sci"], "B Science":["B", "B Sci"], "C Science":["C", "A Sci"], "D Science":["D", "CL1"], "E Science":["E", "Clark 3"],"F Science":["F", "W5"]}
// courses = document.getElementById("coursesContainer")
//
// out = {"settings":{"tname":true, "rnumber":false}, "version":"1"}
//
// for (let c = 0; c < courses.children.length; c++) {
//     if (!courses.children[c].getElementsByTagName("h3")[0].innerText.includes("Independent Study")) {
//     params = {}
//     block = courses.children[c].getElementsByTagName("h3")[0].innerText.split("(").slice(-1)[0].replace(")", "")
//     block = block.split(", ")
//     if (block[0] in sciences) {
//       params.color = sciences[block[0]][0]
//       block = sciences[block[0]]
//
//
//     }
//     name = courses.children[c].getElementsByTagName("h3")[0].innerText.split(" -").slice(0, -1).join(" -")
//     if (!courses.children[c].getElementsByTagName("h3")[0].innerText.split(" -")[0].includes("Advanced Choral Ensemble")) {
//     block.forEach(function (b) {
//         out[b.replaceAll("CL", "Clark ").replaceAll("W", "Webster ")] = [name, courses.children[c].getElementsByClassName("group-owner-name")[0].innerText, params, courses.children[c].getElementsByTagName("h5")[0].innerText.split(" |")[0]]
//     })
//   } else {
//     out["Webster 3"] = ["Grape Jam", courses.children[c].getElementsByClassName("group-owner-name")[0].innerText, params, courses.children[c].getElementsByTagName("h5")[0].innerText.split(" |")[0]]
//     out["Webster 5"] = ["Grape Jam", courses.children[c].getElementsByClassName("group-owner-name")[0].innerText, params, courses.children[c].getElementsByTagName("h5")[0].innerText.split(" |")[0]]
//     out["GJ"] = ["Grape Jam", courses.children[c].getElementsByClassName("group-owner-name")[0].innerText]
//   }
// }}
// console.log(JSON.stringify(out))

courses = document.getElementById("coursesContainer")

out = []
for (let c = 0; c < courses.children.length; c++) {
    try {
    o = [courses.children[c].getElementsByTagName("h3")[0].innerText, courses.children[c].getElementsByClassName("group-owner-name")[0].innerText, courses.children[c].getElementsByTagName("h5")[0].innerText.split(" |")[0]]
    out.splice(out.length, 0, o);
    } catch(err) {
      //pass
    }
}
console.log(JSON.stringify(out))



courses = document.getElementsByClassName("rZXyy")
out = []
for (let c = 0; c < courses.length; c++) {
  try {
    if (courses[c].getElementsByClassName("eDfb1d")[0].children[1].innerText != "") {
      o = [courses[c].getElementsByClassName("z3vRcc-ZoZQ1")[0].innerText+" - 1 ("+courses[c].getElementsByClassName("eDfb1d")[0].children[1].innerText+")", courses[c].getElementsByClassName("jJIbcc")[0].innerText]
      out.splice(out.length, 0, o);
    }
  } catch (err) {
      console.log(err)
  }
}
console.log(JSON.stringify(out))
