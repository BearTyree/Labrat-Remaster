import { useState } from 'react';
import { IoCaretBackOutline } from 'react-icons/io5';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

function CreateClass() {
  const [className, setClassName] = useState('');
  const [oldClassName, setOldClassName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [oldClassCode, setOldClassCode] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const pathSegments = location.pathname.split('/');

  const handleBack = (changesSaved: boolean) => {
    const segments = location.pathname.split('/');
    segments.pop();
    const newPath = segments.join('/');
    if (className + classCode == oldClassName + oldClassCode || changesSaved) {
      navigate(newPath);
    } else {
      if (
        window.confirm('Changes are unsaved, are you sure you want to go back?')
      ) {
        navigate(newPath);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (className == '' || classCode == '') {
      handleBack(true);
      return;
    }
    const response = await fetch('http://localhost:3000/updateClass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        id: params.classId,
        name: className,
        code: classCode,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      handleBack(true);
    } else {
      alert(data.message);
    }
  };

  return (
    <>
      <div
        onClick={() => handleBack(false)}
        className='px-2 py-2 fixed ml-72 mt-8 z-20 cursor-pointer bg-slate-50 rounded-full p-0 flex justify-center items-center'
      >
        <IoCaretBackOutline size='3em' color='DarkGray' />
      </div>

      <div className='grow bg-slate-50 flex p-10 justify-center'>
        <div className='bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full'>
          <div className='flex align-middle justify-center'>
            <h1 className='text-xl font-bold text-center mb-6'>New Class</h1>
          </div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className='mb-4'>
              <label
                htmlFor='class name'
                className='block text-sm font-medium text-gray-700'
              >
                Class Name
              </label>
              <input
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                onChange={(e) => {
                  setClassName(e.target.value);
                }}
                type='text'
                placeholder='Class Name'
              />
            </div>
            <div className='mb-6'>
              <label
                htmlFor='class name'
                className='block text-sm font-medium text-gray-700'
              >
                Class Code
              </label>
              <input
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                onChange={(e) => {
                  setClassCode(e.target.value);
                }}
                type='text'
                placeholder='Class Code'
              />
            </div>

            <button
              className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              type='submit'
            >
              Create Class
            </button>
          </form>{' '}
          <button
            className='mt-6 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
            onClick={() => {
              handleDelete();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateClass;
