import { useEffect, useState } from 'react';
import Styles from './NavBar.module.css';
import { NavLink, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    async function checkToken() {
      if (token) {
        const response = await fetch(
          'http://localhost:3000/authenticateToken',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          console.log('Token valid');
          setValidToken(true);
        } else {
          console.log('Token not valid');
          localStorage.clear();
          setValidToken(false);
        }
      }
    }
    checkToken();
  }, []);
  return (
    <>
      <div
        className={`${Styles.navBar} fixed w-full top-0 left-0 shadow-sm justify-end px-32 flex z-50  py-2 bg-white`}
      >
        {localStorage.getItem('token') && validToken ? (
          <>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
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
              className='mx-3 mr-auto justify-self-end bg-white hover:bg-slate-50 text-black py-2 px-4 rounded-full'
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
              className='mx-3 justify-self-end bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
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
