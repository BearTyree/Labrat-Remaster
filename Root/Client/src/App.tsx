import Styles from './App.module.css';
import NavBar from './Components/NavBar';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login.tsx';
import Home from './Pages/Home.tsx';
import Signup from './Pages/SignUp.tsx';
import Confirmation from './Pages/confirmation.tsx';

function App() {
  return (
    <div className={Styles.app}>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/confirmation' element={<Confirmation />} />
      </Routes>
    </div>
  );
}

export default App;
