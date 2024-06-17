import { IoCaretBackOutline } from 'react-icons/io5';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function CreateTeacher() {
  const [teacherName, setTeacherName] = useState('');
  const [oldTeacherName, setOldTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [oldTeacherEmail, setOldTeacherEmail] = useState('');

  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const pathSegments = location.pathname.split('/');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      pathSegments[pathSegments.length - 1] === 'create' &&
      (teacherName == '' || teacherEmail == '')
    ) {
      navigate('/src');
      return;
    }
    const response = await fetch('http://localhost:3000/updateTeacher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        id: params.id,
        name: teacherName,
        email: teacherEmail,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      navigate('/src');
    } else {
      alert(data.message);
    }
  };

  useEffect(() => {
    console.log(params);
    const getTeacherDetails = async () => {
      const response = await fetch(`http://localhost:3000/getTeacher`, {
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
        setTeacherName(data.teacher.name);
        setOldTeacherName(data.teacher.name);
        setTeacherEmail(data.teacher.email);
        setOldTeacherEmail(data.teacher.email);
      } else {
        if (data.message == 'jwt expired') {
          localStorage.clear();
          navigate('/login');
          alert('Session expired. Please log in again.');
        }
      }
    };
    if (params.status == 'edit') {
      getTeacherDetails();
    }
  }, [params.id, params.status, params, navigate]);

  const handleBack = () => {
    if (teacherName + teacherEmail == oldTeacherName + oldTeacherEmail) {
      navigate('/src');
    } else {
      if (
        window.confirm('Changes are unsaved, are you sure you want to go back?')
      ) {
        navigate('/src');
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this teacher?'))
      return;
    const response = await fetch('http://localhost:3000/deleteTeacher', {
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
      navigate('/src');
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
          <div className='flex align-middle justify-center'>
            <h1 className='text-xl font-bold text-center mb-6'>New Teacher</h1>
          </div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className='mb-4'>
              <label
                htmlFor='teacher name'
                className='block text-sm font-medium text-gray-700'
              >
                Teacher Name
              </label>
              <input
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                onChange={(e) => {
                  setTeacherName(e.target.value);
                }}
                type='text'
                placeholder='Teacher Name'
              />
            </div>
            <div className='mb-6'>
              <label
                htmlFor='teacher name'
                className='block text-sm font-medium text-gray-700'
              >
                Teacher Email
              </label>
              <input
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                onChange={(e) => {
                  setTeacherEmail(e.target.value);
                }}
                type='text'
                placeholder='Teacher Email'
              />
            </div>

            <button
              className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              type='submit'
            >
              Create Teacher
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

export default CreateTeacher;
