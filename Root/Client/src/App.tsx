import Styles from './App.module.css';
import NavBar from './Components/NavBar';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login.tsx';
import Home from './Pages/Home.tsx';

function App() {
  return (
    <div className={Styles.app}>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
