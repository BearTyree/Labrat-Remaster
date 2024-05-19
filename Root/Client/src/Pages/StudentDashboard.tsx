import { Outlet } from 'react-router-dom';
import SideBar from '../Components/Student/SideBar';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const navigate = useNavigate();

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
        } else {
          console.log('Token not valid');
          localStorage.clear();
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    }
    checkToken();
  }, []);
  return (
    <div className='grow flex flex-row'>
      <SideBar />
      <Outlet />
    </div>
  );
}

export default StudentDashboard;
