//returns 7 day schedule in form of array of arrays
function retrieveSchedule() {
    return [[], [[["8:10", "9:00"], "F", false, F], [["9:05", "9:55"], "Clark 1", false, CLARK], [["10:00", "10:50"], "E", false, E], [["10:50", "11:30"], "MX", true, MAIN], [["11:35", "12:25"], "C", false, C], [["12:30", "13:00"], "Lunch", true, MAIN], [["13:05", "13:25"], "Advisory", true, ADV], [["13:30", "14:20"], "A", false, A], [["14:25", "15:15"], "B", false, B]],
    [[["8:10", "9:00"], "Clark 2", false, CLARK], [["9:00", "9:50"], "D", false, D], [["9:55", "10:45"], "F", false, F], [["10:50", "11:35"], "A Sci", false, A], [["11:40", "12:25"], "Webster 2", false, WEBSTER], [["12:30", "12:55"], "Lunch", true, MAIN], [["13:05", "13:55"], "E", false, E], [["14:00", "14:50"], "B", false, B] ,[["14:55", "15:45"], "C Sci", false, CLARK]],
    [[["8:10", "9:00"], "Clark 3", false, CLARK], [["9:05", "9:55"], "A", false, A], [["10:00", "10:50"], "B", false, B], [["10:50", "11:30"], "Graderoom", true, MAIN], [["11:35", "12:25"], "D", false, D], [["12:30", "13:00"], "Lunch", true, MAIN], [["13:05", "13:55"], "C", false, C], [["14:00", "14:50"], "F", false, F], [["14:55", "15:45"], "Webster 3", false, WEBSTER], [["15:40", "16:25"], "GJ", false, WEBSTER]],
    [[["8:10", "9:00"], "Clark 4", false, CLARK], [["9:05", "9:55"], "C", false, C], [["10:00", "10:50"], "D", false, D], [["10:55", "11:15"], "Advisory", true, MAIN], [["11:20", "12:10"], "A", false, A], [["12:15", "12:45"], "Lunch", true, MAIN], [["12:50", "13:40"], "B Sci", false, B], [["13:45", "14:35"], "F", false, F], [["14:40", "15:30"], "E", false, E], [["15:35", "16:25"], "Webster 4", false, WEBSTER]],
    [[["8:10", "9:00"], "B", false, B], [["9:05", "9:55"], "A", false, A], [["10:00", "10:50"], "E", false, E], [["10:50", "11:30"], "MX", true, MAIN], [["11:35", "12:25"], "D", false, D], [["12:30", "13:00"], "Lunch", true, MAIN], [["13:05", "13:45"], "SG", true, MAIN], [["13:50", "14:40"], "C", false, C], [["14:45", "15:35"], "Webster 5", false, WEBSTER], [["15:35", "16:25"], "GJ", false, WEBSTER]], []]
}

//example of dynamic schedule from portal
// function retrieveSchedule() {
//   ical.fromURL("webcal://fwparker.myschoolapp.com/podium/feed/iCal.aspx?z=qRHeq4eSEKl49Vhw4x9RyQS7VaQZksoR8uZ4o3eoFTIig8EdG3BPgVOo0%2fd6blUi5FEYUMY7C3J2zqACcfAwRA%3d%3d", {}, function(err, data) {
//     var week = [];
//     var date = new Date();
//     for (let day = 0; day < 5; day++) {
//       var tempDate = new Date();
//       tempDate.setDate(date.getDate()-(date.getDay()-1)+day);
//       tempDate.setHours(0,0,0,0)
//       week.push(tempDate)
//     }
//     if (err) console.log(err);
//     for (let d in data) {
//       if (data[d].hasOwnProperty("start")) {
//         var tDate = new Date(data[d].start);
//         tDate.setHours(0,0,0,0)
//       //  console.log(tDate)
//         if (tDate.getTime() === week[0].getTime()) {
//           console.log(data[d])
//         }
//     }}
//     console.log(week)
//     console.log(new Date().toString());
// });
// }


module.exports = { retrieveSchedule: retrieveSchedule };