import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Project() {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState('New Project');
  const [projectDescription, setProjectDescription] = useState('');

  return (
    <div className='grow bg-slate-50 flex p-10 justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full'>
        <h1 className='text-xl font-bold text-center mb-6'>New Project</h1>
        <form>
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
            ></textarea>
          </div>
          <button
            className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            type='submit'
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default Project;
