import Styles from './App.module.css';
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

function App() {
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className={`${Styles.app} grow flex flex-col`}>
      <NavBar />
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
