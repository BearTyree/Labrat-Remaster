// import { useEffect } from 'react';
// import { socket } from './Socket.tsx';

// components
// import NavBar from './Components/NavBar';
// import StudentNavBar from './Components/Student/NavBar.tsx';

// pages
// import Login from './Pages/Login.tsx';
// import Home from './Pages/Home.tsx';
// import Signup from './Pages/SignUp.tsx';
// import Confirmation from './Pages/Confirmation.tsx';
// import CheckEmail from './Pages/CheckEmail.tsx';
// import StudentDashboard from './Pages/StudentDashboard.tsx';
// import Project from './Pages/Student/Project.tsx';
// import Projects from './Pages/Student/Projects.tsx';
// import SRCDashboard from './Pages/SRCDashboard.tsx';
// import ChoosePassword from './Pages/ChoosePassword.tsx';
// import Teachers from './Pages/SRC/Teachers.tsx';
// import CreateTeacher from './Pages/SRC/CreateTeacher.tsx';
// import TeacherDashboard from './Pages/TeacherDashboard.tsx';
// import Classes from './Pages/Teacher/Classes.tsx';
// import CreateClass from './Pages/Teacher/CreateClass.tsx';
// import ClassProjects from './Pages/Class/Projects.tsx';

// import useCache from './Hooks/useCache.tsx';

// import { studentStore } from './GlobalStore.tsx';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

import useGetCache from './Hooks/useGetCache';
import useCheckSessionExpired from './Hooks/useCheckSessionExpired';
import useHandleSessionExpired from './Hooks/useHandleSessionExpired';

import Home from './Pages/Home.tsx';
import Loading from './Pages/Loading';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const getCache = useGetCache();
  const [cache, setCache] = useState(null);
  const checkSessionExpired = useCheckSessionExpired();
  const handleSessionExpired = useHandleSessionExpired();

  useEffect(() => {
    const start = async () => {
      const startLocation =
        location.pathname == '/loading' ? '/' : location.pathname;
      const userType = localStorage.getItem('userType');
      if (userType) {
        navigate('/loading');
      } else return;
      const sessionExpired = await checkSessionExpired();
      if (sessionExpired) {
        handleSessionExpired(startLocation);
        return;
      }
      setCache(getCache());
    };
    start();
  }, []);

  // useEffect(() => console.log(cache), [cache]);

  // const navigate = useNavigate();
  // const location = useLocation();
  // const cache = useCache();

  // const { all, setAll } = studentStore();

  // useEffect(() => {
  //   cache();
  //   const updateListener = (data: any) => {
  //     for (let key of Object.keys(data)) {
  //       switch (key) {
  //         case 'project':
  //           setAll({
  //             projects: (projects: any) => {
  //               const index = projects.findIndex(
  //                 (project: { _id: string }) => project._id == data.project._id
  //               );
  //               if (index == -1) {
  //                 return [...projects, data.project];
  //               }
  //               return [
  //                 ...projects.slice(0, index),
  //                 data.project,
  //                 ...projects.slice(index + 1),
  //               ];
  //             },
  //           });
  //       }
  //     }
  //   };

  //   socket.on('update', updateListener);
  //   console.log(import.meta.env.VITE_TEST);

  //   // Cleanup function to remove the listener
  //   return () => {
  //     socket.off('update', updateListener);
  //   };
  // }, []); // Empty dependency array ensures this effect runs only once

  // useEffect(() => {
  //   if (
  //     localStorage.getItem('userType') &&
  //     !location.pathname.includes(localStorage.getItem('userType') as string) &&
  //     !location.pathname.includes('checkEmail')
  //   ) {
  //     navigate(`/${localStorage.getItem('userType')}`);
  //   }
  // }, [location]);
  return (
    <div className={`grow flex flex-col`}>
      <Routes>
        {/* 
        ***** conditional rendering *****
        
        <Route path='/' element={<Home />}>
          <Route path='' element={test ? <Loading /> : <></>} />
        </Route>
        
        **********************************
        */}

        {/* <Route path='/' element={<NavBar />} />
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
        </Route> */}
      </Routes>
    </div>
  );
}

export default App;
