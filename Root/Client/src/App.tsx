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
import Teacher from './Pages/SRC/Teacher.tsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

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
          <Route path='teacher/:id/:status' element={<Teacher />} />
          <Route path='choosePassword' element={<ChoosePassword />} />
        </Route>
        <Route path='/checkEmail' element={<CheckEmail />} />
      </Routes>
    </div>
  );
}

export default App;
