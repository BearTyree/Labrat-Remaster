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
    <div className={Styles.navBar}>
      {localStorage.getItem('token') && validToken ? (
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
        >
          logout
        </button>
      ) : (
        <>
          {' '}
          <NavLink to='/'>home</NavLink>
          <NavLink to='/login'>login</NavLink>
          <NavLink to='/signup'>signup</NavLink>
        </>
      )}
    </div>
  );
}

export default NavBar;
