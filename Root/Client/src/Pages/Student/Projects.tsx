import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface Project {
  _id: string;
  name: string;
}

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
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
      return data.id;
    } else {
      console.log('Project not created');
      if (data.message == 'jwt expired') {
        localStorage.clear();
        navigate('/login');
        alert('Session expired. Please log in again.');
      }
    }
  };
  const getProjects = async () => {
    const response = await fetch('http://localhost:3000/getProjects', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      setProjects(data.projects);
    } else {
      console.log('Projects not found');
      console.log(data);
      if (data.message == 'jwt expired') {
        localStorage.clear();
        navigate('/login');
        alert('Session expired. Please log in again.');
      }
    }
  };

  useEffect(() => {
    getProjects();
  }, []);
  return (
    <div className='bg-slate-50 grow'>
      {' '}
      {projects.map((project: Project) => {
        return (
          <div key={project._id}>
            <h1>{project.name}</h1>
          </div>
        );
      })}
      <button
        onClick={async () => {
          const id = await newProject();

          navigate('/student/project/' + id);
        }}
      >
        New Project
      </button>
    </div>
  );
}

export default Projects;
