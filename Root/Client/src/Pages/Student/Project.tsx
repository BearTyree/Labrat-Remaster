import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IoCaretBackOutline } from 'react-icons/io5';

function Project() {
  const navigate = useNavigate();
  const params = useParams();
  const [projectName, setProjectName] = useState('New Project');
  const [oldProjectName, setOldProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [oldProjectDescription, setOldProjectDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/updateProject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        id: params.id,
        name: projectName,
        description: projectDescription,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      navigate('/student');
    } else {
      alert(data.message);
    }
  };

  useEffect(() => {
    console.log(params);
    const getProjectDetails = async () => {
      const response = await fetch(`http://localhost:3000/getProject`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: params.id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setProjectName(data.project.name);
        setOldProjectName(data.project.name);
        setProjectDescription(data.project.description);
        setOldProjectDescription(data.project.description);
      } else {
        if (data.message == 'jwt expired') {
          localStorage.clear();
          navigate('/login');
          alert('Session expired. Please log in again.');
        }
      }
    };
    if (params.status == 'edit') {
      getProjectDetails();
    }
  }, [params.id, params.status, params, navigate]);

  const handleBack = () => {
    if (
      projectName + projectDescription ==
      oldProjectName + oldProjectDescription
    ) {
      navigate('/student');
    } else {
      if (
        window.confirm('Changes are unsaved, are you sure you want to go back?')
      ) {
        navigate('/student');
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?'))
      return;
    const response = await fetch('http://localhost:3000/deleteProject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        id: params.id,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      navigate('/student');
    } else {
      alert(data.message);
      console.log(data);
    }
  };

  return (
    <>
      <div
        onClick={() => handleBack()}
        className='px-2 py-2 fixed ml-72 mt-8 z-20 cursor-pointer bg-slate-50 rounded-full p-0 flex justify-center items-center'
      >
        <IoCaretBackOutline size='3em' color='DarkGray' />
      </div>
      <div className='grow bg-slate-50 flex p-10 justify-center'>
        <div className='bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full'>
          <h1 className='text-xl font-bold text-center mb-6'>
            {params.status == 'edit' ? 'Edit ' + projectName : 'New Project'}
          </h1>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className='mb-4'>
              <label
                htmlFor='project name'
                className='block text-sm font-medium text-gray-700'
              >
                Project Name
              </label>
              <input
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                onChange={(e) => {
                  setProjectName(e.target.value);
                }}
                type='text'
                placeholder='Project Name'
                {...(params.status == 'edit' ? { value: projectName } : {})}
              />
            </div>
            <div className='mb-6'>
              <label
                htmlFor='project description'
                className='block text-sm font-medium text-gray-700'
              >
                Project Description
              </label>
              <textarea
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Project Description'
                onChange={(e) => {
                  setProjectDescription(e.target.value);
                }}
                {...(params.status == 'edit'
                  ? { value: projectDescription }
                  : {})}
              ></textarea>
            </div>
            <button
              className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              type='submit'
            >
              {params.status == 'create' ? 'Create Project' : 'Update Project'}
            </button>
          </form>{' '}
          <button
            className='mt-6 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
            onClick={() => {
              handleDelete();
            }}
          >
            {params.status == 'create' ? 'Cancel' : 'Delete Project'}
          </button>
        </div>
      </div>
    </>
  );
}

export default Project;
