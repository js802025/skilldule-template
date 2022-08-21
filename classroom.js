const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const assembly = require('./assembly');


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/classroom.courses.readonly', 'https://www.googleapis.com/auth/classroom.coursework.me'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
module.exports.authorize = authorize;
module.exports.getAuthUrl = getAuthUrl;
module.exports.getToken = getToken;
module.exports.listCourses = listCourses;
module.exports.getCourseWork = getCourseWork;
module.exports.refreshAccessToken = refreshAccessToken;


// Load client secrets from a local file.


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, token, callback) {

    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
      oAuth2Client.setCredentials(token);
      callback(oAuth2Client);
    };


/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAuthUrl(credentials) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: "consent"
    });
    return authUrl

}

function getToken(credentials, code, req, res, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    oAuth2Client.getToken(code, (err, token) => {
      callback(req, res, token)
    });
  }
async function refreshAccessToken(credentials, refreshToken, user, res, master, currPeriod, nextPeriod, timeString, day, colors, dayName, req, callback, lunch, assemblies, config) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  console.log(refreshToken)
  oAuth2Client.setCredentials(refreshToken);
  var courses = await listCourses(oAuth2Client)
  // var courseWork = {}
  // for (courseId of Object.keys(courses)) {
  //   courseWork[courseId] = await getCourseWork(oAuth2Client, courseId)
  // }
//  console.log(courseWork)
  callback(user, res, master, currPeriod, nextPeriod, timeString, day, colors, dayName, req, courses, oAuth2Client, lunch, assemblies, config)// => Store access token
	};


function listCourses(auth) {
  return new Promise((resolve, reject) => {
    const classroom = google.classroom({version: 'v1', auth});
    classroom.courses.list({courseStates:["ACTIVE"]}, (err, res) => {
      if (err) return console.error('The API returned an error: ' + err);
      const courses = res.data.courses;
      if (courses && courses.length) {
        //console.log('Coursework:');
        var c = {}
        courses.forEach((course) => {
        //  console.log(`${JSON.stringify(course)} (${course.id})`);
          c[course.id] = course.name
        });
        resolve(c);
      } else {
      //  reject()
        console.log('No courses found.');
      }
    });
  })

}
/**
 * Lists the first 10 courses the user has access to.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getCourseWork(auth, courseId) {
  return new Promise((resolve, reject) => {
    const classroom = google.classroom({version: 'v1', auth});
    // classroom.courses.get({
    //   pageSize: 10,
    // }, (err, res) => {
    //   if (err) return console.error('The API returned an error: ' + err);
    //   const courses = res.data.courses;
    //   if (courses && courses.length) {
    //     console.log('Coursework:');
    //     courses.forEach((course) => {
    //       console.log(`${JSON.stringify(course)} (${course.id})`);
    //     });
    //   } else {
    //     console.log('No courses found.');
    //   }
    // });

    var params = {courseId:courseId}
    var c = classroom.courses.courseWork.list(params, (err, res) => {
    if (err) {
      console.error(err);
      throw err;
    }
    if (err) return console.error('The API returned an error: ' + err);
      const cwork = res.data.courseWork;
      if (cwork && cwork.length) {
      //  console.log(cwork)

        resolve(cwork)

      } else {
        console.log('No courses found.');
  }

})



})

}
