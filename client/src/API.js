//API calls

const APIURL = new URL('http://localhost:3001/api/');

//POST /api/studentSessions
async function logIn(credentials) {
  let response = await fetch(new URL('studentSessions', APIURL), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const student = await response.json();
    return student;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

//DELETE /api/sessions/currentStudent
async function logOut() {
  await fetch(new URL('sessions/currentStudent', APIURL), { method: 'DELETE', credentials: 'include' });
}

//GET /api/sessions/currentStudent
async function getUserInfo() {
  const response = await fetch(new URL('sessions/currentStudent', APIURL), { credentials: 'include' });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  //It is an object with the error coming from the server
  }
}

//GET /api/courses
async function getAllCourses() {
  const response = await fetch(new URL('courses', APIURL), { credentials: 'include' });
  const coursesJson = await response.json();
  if (response.ok) {
    return coursesJson.map((el) => ({ code: el.code, name: el.name, credits: el.credits, currentStudents: el.currentStudents, maxStudents: el.maxStudents, propaedeuticity: el.propaedeuticity }));
  } else {
    throw coursesJson;  //It is an object with the error coming from the server
  }
}

//GET /api/incompatibilities
async function getAllIncompatibilities() {
  const response = await fetch(new URL('incompatibilities', APIURL), { credentials: 'include' });
  const incompatibilitiesJson = await response.json();
  if (response.ok) {
    return incompatibilitiesJson.map((el) => ({ code: el.code, incompatibleCourse: el.incompatibleCourse }));
  } else {
    throw incompatibilitiesJson;  //It is an object with the error coming from the server
  }
}

//GET /api/coursesStudent
async function getStudentStudyPlan() {
  const response = await fetch(new URL('coursesStudent', APIURL), { credentials: 'include' });
  const studyPlanJson = await response.json();
  if (response.ok) {
    return studyPlanJson;
  } else {
    throw studyPlanJson;  //It is an object with the error coming from the server
  }
}

//POST /api/newCoursesStudent
async function storeNewStudyPlan(newStudyPlan, type) {
  let response = await fetch(new URL('newCoursesStudent', APIURL), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({codes: newStudyPlan, type: type}),
  });
  if (response.ok) {
    return true;
  } else {
    const errDetail = await response.json();
    throw errDetail;
  }
}

//DELETE /api/allCoursesStudent
async function deleteAllCoursesStudent() {
  const response = await fetch(new URL('allCoursesStudent', APIURL), { method: "DELETE", credentials: 'include' });
  if (response.ok) {
    return true;
  }
  else{
    const deleteJson = await response.json();
    throw deleteJson;
  }

}

const API = { logIn, logOut, getUserInfo, getAllCourses, getAllIncompatibilities, getStudentStudyPlan, storeNewStudyPlan, deleteAllCoursesStudent };
export default API;