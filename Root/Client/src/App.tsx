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

function App() {
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
          <Route path='project/:id' element={<Project />} />
        </Route>
        <Route path='/checkEmail' element={<CheckEmail />} />
      </Routes>
    </div>
  );
}

export default App;
