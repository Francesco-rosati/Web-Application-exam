import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import API from './API';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { LoginPage } from './components/LoginComponents';
import Home from './components/Home';
import Error from './components/Error';

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  )
}

function App2() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [success, setSuccess] = useState({ state: false, message: "" });
  const [error, setError] = useState({ state: false, message: "" });
  const [student, setStudent] = useState({});
  const [typeOfPlan, setTypeOfPlan] = useState({});
  const [currentCFU, setCurrentCFU] = useState(0);
  const [courses, setCourses] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);
  const [incompatibilities, setIncompatibilities] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dirtyCourses, setDirtyCourses] = useState(true);
  const [dirtyStudyPlan, setDirtyStudyPlan] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const student = await API.getUserInfo();
        setLoggedIn(true);
        setStudent(student);
      } catch (err) {
        setError({ state: false, message: "" });
      }
    };
    checkAuth();
  }, []);

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(student => {
        setLoggedIn(true);
        setStudent(student);
        navigate('/');
        setSuccess({ state: true, message: "Hello " + student.name + "!" });
      })
      .catch(err => {
        setError({ state: true, message: err });
      });
  }

  const doLogOut = async () => {
    await API.logOut()
      .then(() => { setLoggedIn(false); setStudent({}); setEditMode(false); setDirtyStudyPlan(true); setSuccess({ state: true, message: "Logout successfully done!" }); })
      .catch(err => setError({ state: true, message: err.message + " logout!" }));
  }

  useEffect(() => {
    if (dirtyCourses) {
      setLoading(true);
      API.getAllCourses()
        .then((courses) => { setCourses(courses); setLoading(false); setDirtyCourses(false);})
        .catch(err => setError({ state: true, message: err.error }));
    }
  }, [dirtyCourses]);

  useEffect(() => {
    API.getAllIncompatibilities()
      .then((incompatibilities) => { setIncompatibilities(incompatibilities); })
      .catch(err => setError({ state: true, message: err.error }));
  }, []);

  useEffect(() => {
    if (loggedIn && dirtyStudyPlan) {
      setLoading(true);
      API.getStudentStudyPlan()
        .then((studyPlan) => { setLoading(false); setStudyPlan(studyPlan.courses); setDirtyStudyPlan(false); setCurrentCFU(studyPlan.courses.reduce((acc, currValue) => acc + currValue.credits, 0)); setTypeOfPlan(Object.assign({}, { type: studyPlan.type })); })
        .catch(err => setError({ state: true, message: err.error }));
    }
  }, [loggedIn, dirtyStudyPlan]);

  //Use effect to manage success toast
  useEffect(() => {
    if (success.state === true) {
      toast.success(success.message, { position: "top-center" });
      setSuccess({ state: false, message: "" });
    }
  }, [success.state]);

  //Use effect to manage error toast
  useEffect(() => {
    if (error.state === true) {
      toast.error(error.message, { position: "top-center" });
      setError({ state: false, message: "" });
    }
  }, [error.state]);

  function saveNewStudyPlan(tempStudyPlan) {

    let doControls = true;

    //Controlling that new study plan is changed respect to the previous one
    //I want to avoid useless controls
    if (JSON.stringify(studyPlan) === JSON.stringify(tempStudyPlan)) {
      doControls = false;
    }

    if (loggedIn && doControls) {

      const tempStudyPlanCodes = tempStudyPlan.map(el => el.code);

      const maxStudents = courses.filter(el => tempStudyPlanCodes.includes(el.code))
        .filter(el => el.maxStudents !== null)
        .map(el => {
          if (studyPlan.length !== 0 && studyPlan.map(el => el.code).includes(el.code)) {
            return { currentStudents: (el.currentStudents - 1), maxStudents: el.maxStudents };
          }
          return { currentStudents: el.currentStudents, maxStudents: el.maxStudents };
        })
        .filter(el => ((el.currentStudents + 1) > el.maxStudents));

      const propaedeuticities = courses.filter(el => tempStudyPlanCodes.includes(el.code))
        .filter(el => el.propaedeuticity !== null)
        .map(el => el.propaedeuticity);

      //Control on min credits
      if ((typeOfPlan.type === 1 && currentCFU < 40) || (typeOfPlan.type === 0 && currentCFU < 20)) {
        setError({ state: true, message: "Your study plan doesn't respect the minimum threshold of credits!" });
        return;
      }

      //Control on max credits
      if ((typeOfPlan.type === 1 && currentCFU > 80) || (typeOfPlan.type === 0 && currentCFU > 40)) {
        setError({ state: true, message: "Your study plan doesn't respect the maximum threshold of credits!" });
        return;
      }

      //Control on max students
      if (maxStudents.length !== 0) {
        setError({ state: true, message: "A course you want to insert has already reached the maximum number of students!" });
        return;
      }

      //Control on propedeuticities
      for (let el of propaedeuticities) {
        if (!tempStudyPlanCodes.includes(el)) {
          setError({ state: true, message: "Found some courses without their propaedeuticity!" });
          return;
        }
      }

      //Control on incompatibilities
      for (let el of tempStudyPlanCodes) {
        const currentInc = incompatibilities.filter(inc => inc.code === el).map(inc => inc.incompatibleCourse);
        for (let inc of currentInc) {
          if (tempStudyPlanCodes.includes(inc)) {
            setError({ state: true, message: "Found some incompatible courses in the study plan!" });
            return;
          }
        }
      }

      setStudyPlan([...tempStudyPlan]);
      API.storeNewStudyPlan(tempStudyPlan.map(el => el.code), typeOfPlan.type)
        .then(() => { setEditMode(false); setDirtyCourses(true); setDirtyStudyPlan(true); setSuccess({ state: true, message: "Study plan successfully updated!" }); })
        .catch(err => { setDirtyCourses(true); setDirtyStudyPlan(true); setError({ state: true, message: err.error }); })

    }
    else {
      setEditMode(false);
    }
  }

  function deleteAllStudyPlan() {

    if (loggedIn) {
      API.deleteAllCoursesStudent()
        .then(() => { setStudyPlan([]); setCurrentCFU(0); setDirtyStudyPlan(true); setDirtyCourses(true); setSuccess({ state: true, message: "Study plan successfully deleted!" }); })
        .catch(err => setError({ state: true, message: err.error }))
    }
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home
          loggedIn={loggedIn}
          student={student}
          currentCFU={currentCFU}
          setCurrentCFU={setCurrentCFU}
          typeOfPlan={typeOfPlan}
          setTypeOfPlan={setTypeOfPlan}
          doLogOut={doLogOut}
          courses={courses}
          incompatibilities={incompatibilities}
          studyPlan={studyPlan}
          saveNewStudyPlan={saveNewStudyPlan}
          deleteAllStudyPlan={deleteAllStudyPlan}
          loading={loading}
          editMode={editMode}
          setEditMode={setEditMode}
          setLoading={setLoading}
          setSuccess={setSuccess}
          setError={setError} />} />
        <Route path='/login' element={loggedIn ? <Navigate to='/' /> : <LoginPage login={doLogIn} />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
