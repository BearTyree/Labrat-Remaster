import { Outlet } from 'react-router-dom';
import SideBar from '../Components/Student/SideBar';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mainStore } from '../GlobalStore';

function StudentDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const controller = new AbortController();
    controller.signal.addEventListener('abort', () => {
      console.log('Aborted');
    });
    async function checkToken() {
      if (token) {
        try {
          const response = await fetch(
            'http://localhost:3000/authenticateToken',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              signal: controller.signal,
            }
          );

          if (response.ok) {
            console.log('Token valid');
          } else {
            localStorage.clear();
            navigate('/login');
            alert('token invalid');
          }
        } catch (err) {}
      } else {
        navigate('/login');
      }
    }
    checkToken();

    return () => {
      controller.abort();
      controller.signal.removeEventListener('abort', () => {
        console.log('aborted');
      });
    };
  }, []);
  return (
    <div className='grow flex flex-row'>
      <SideBar />
      <Outlet />
    </div>
  );
}

export default StudentDashboard;
