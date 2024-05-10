import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const navigate = useNavigate();
  const newProject = async () => {
    const response = await fetch('http://localhost:3000/newProject', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        name: 'New Project',
      }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Project created');
    } else {
      console.log('Project not created');
      if (data.message == 'jwt expired') {
        localStorage.clear();
        navigate('/login');
        alert('Session expired. Please log in again.');
      }
    }
  };

  return (
    <div>
      <button onClick={() => newProject()}>New Project</button>
      {}
    </div>
  );
}

export default StudentDashboard;
