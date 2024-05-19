import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Project() {
  const navigate = useNavigate();
  const params = useParams();
  const [projectName, setProjectName] = useState('New Project');
  const [projectDescription, setProjectDescription] = useState('');

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
        setProjectDescription(data.project.description);
      } else {
        alert(data.message);
      }
    };
    if (params.status == 'edit') {
      getProjectDetails();
    }
  }, [params.id, params.status, params]);

  return (
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
        </form>
      </div>
    </div>
  );
}

export default Project;
