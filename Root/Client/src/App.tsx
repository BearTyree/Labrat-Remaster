import NavBar from './Components/NavBar';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login.tsx';
import Home from './Pages/Home.tsx';
import Signup from './Pages/SignUp.tsx';
import Confirmation from './Pages/Confirmation.tsx';
import CheckEmail from './Pages/CheckEmail.tsx';
import StudentDashboard from './Pages/StudentDashboard.tsx';
import Project from './Pages/Student/Project.tsx';
import Projects from './Pages/Student/Projects.tsx';
import SRCDashboard from './Pages/SRCDashboard.tsx';
import ChoosePassword from './Pages/ChoosePassword.tsx';
import Teachers from './Pages/SRC/Teachers.tsx';
import CreateTeacher from './Pages/SRC/CreateTeacher.tsx';
import TeacherDashboard from './Pages/TeacherDashboard.tsx';
import Classes from './Pages/Teacher/Classes.tsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import CreateClass from './Pages/Teacher/CreateClass.tsx';
import ClassProjects from './Pages/Class/Projects.tsx';
import StudentNavBar from './Components/Student/NavBar.tsx';
import useSessionExpired from './Hooks/useSessionExpired.tsx';
import useCache from './Hooks/useCache.tsx';
import { socket } from './Socket.tsx';
import { studentStore } from './GlobalStore.tsx';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const cache = useCache();

  socket.on('connect', () => {
    console.log('ssadf');
  });

  const { all, setAll } = studentStore();
  socket.on('update', (data) => {
    for (let key of Object.keys(data)) {
      switch (key) {
        case 'project':
          setAll({
            projects: (projects: any) => {
              const index = projects.findIndex(
                (project: { _id: string }) => project._id == data.project._id
              );
              return [
                ...projects.slice(0, index),
                data.project,
                ...projects.slice(index + 1),
              ];
            },
          });
          console.log(all().projects);
      }
    }
  });

  useSessionExpired();

  useEffect(() => {
    if (
      localStorage.getItem('userType') &&
      !location.pathname.includes(localStorage.getItem('userType') as string) &&
      !location.pathname.includes('checkEmail')
    ) {
      console.log('here');
      navigate(`/${localStorage.getItem('userType')}`);
    }
  }, [location]);
  return (
    <div className={`grow flex flex-col`}>
      <Routes>
        <Route path='/' element={<NavBar />} />
        <Route path='/login' element={<NavBar />} />
        <Route path='/signup' element={<NavBar />} />
        <Route path='/confirmation/:email/:code' element={<NavBar />} />
        <Route path='/student/*' element={<StudentNavBar />} />
        <Route path='/src' element={<NavBar />} />
        <Route path='/teacher' element={<NavBar />} />
        <Route path='/checkEmail' element={<NavBar />} />
      </Routes>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/confirmation/:email/:code' element={<Confirmation />} />
        <Route path='/student' element={<StudentDashboard />}>
          <Route path='' element={<Projects />} />
          <Route path='project/:id/:status' element={<Project />} />
        </Route>
        <Route path='/src' element={<SRCDashboard />}>
          <Route path='' element={<Teachers />} />
          <Route path='teacher/:id/create' element={<CreateTeacher />} />
          <Route path='teacher/:id/classes/:status?' element={<Classes />} />
          <Route
            path='teacher/:id/class/:classId/:create'
            element={<CreateClass />}
          />
          <Route
            path='teacher/:id/class/:classId'
            element={<ClassProjects />}
          />
          <Route path='choosePassword' element={<ChoosePassword />} />
        </Route>
        <Route path='/checkEmail' element={<CheckEmail />} />
        <Route path='/teacher' element={<TeacherDashboard />}>
          <Route path='choosePassword' element={<ChoosePassword />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
