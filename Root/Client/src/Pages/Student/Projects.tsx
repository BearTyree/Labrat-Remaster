import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface Project {
  _id: string;
  name: string;
  description: string;
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
    <div className=' bg-slate-50 grow h-x'>
      <div className='pt-16 px-32'>
        <h1 className='text-4xl text-left pt-16'>Projects</h1>
      </div>
      <div className='flex px-32 py-16'>
        <input className='mr-2 mt-1 w-96 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500' />
        <button className='mr-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
          Search
        </button>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
          onClick={async () => {
            const id = await newProject();

            navigate('/student/project/' + id + '/create');
          }}
        >
          New Project
        </button>
      </div>
      <div className='pb-16 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-32'>
        {projects.map((project: Project) => {
          return (
            <div
              className='cursor-pointer transition hover:scale-105 p-4 shadow-lg rounded-md h-24 bg-white'
              key={project._id}
              onClick={() => {
                navigate('/student/project/' + project._id + '/edit');
              }}
            >
              <h1>{project.name}</h1>
              <p className='font-light'>{project.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Projects;
