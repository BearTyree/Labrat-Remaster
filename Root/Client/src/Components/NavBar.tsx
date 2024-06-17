import { useEffect, useState } from 'react';
import Styles from './NavBar.module.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
  }, [location]);
  return (
    <>
      <div
        className={`${Styles.navBar} fixed w-full top-0 left-0 shadow-sm justify-end flex z-50  py-2 bg-white`}
      >
        {(token && localStorage.getItem('userType') == 'student') ||
        localStorage.getItem('userType') == 'src' ||
        (token && localStorage.getItem('userType') == 'teacher') ? (
          <>
            <NavLink
              className='ml-4 mx-3 mr-auto justify-self-end bg-white hover:bg-slate-50 text-black py-2 px-4 rounded-full'
              to={`/${localStorage.getItem('userType')}`}
            >
              Home
            </NavLink>
            <button
              className='mr-4 flex justify-center align-middle text-center bg-white hover:bg-slate-50 text-black py-2 px-4 rounded-full'
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {' '}
            <NavLink
              className='ml-32 mx-3 mr-auto justify-self-end bg-white hover:bg-slate-50 text-black py-2 px-4 rounded-full'
              to='/'
            >
              Home
            </NavLink>
            <NavLink
              className='mx-3 justify-self-end bg-white hover:bg-slate-50 text-black py-2 px-4 rounded-full'
              to='/login'
            >
              Login
            </NavLink>
            <NavLink
              className='mr-32 mx-3 justify-self-end bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
              to='/signup'
            >
              Signup
            </NavLink>
          </>
        )}
      </div>
      <div className='h-14'></div>
    </>
  );
}

export default NavBar;
