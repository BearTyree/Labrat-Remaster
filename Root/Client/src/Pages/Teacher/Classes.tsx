import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MdModeEdit } from 'react-icons/md';
import EditTeacher from '../SRC/EditTeacher';
interface Class {
  _id: string;
  name: string;
  code: string;
}

function Classes() {
  const params = useParams();
  const navigate = useNavigate();

  const [classes, setClasses] = useState<Class[]>([]);
  const [teacherName, setTeacherName] = useState('');

  const getClasses = async () => {
    const response = await fetch('http://localhost:3000/getClasses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teacherId: params.id,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      setClasses(data.classes);
    } else {
      console.log('Classes not found');
      console.log(data);
      if (data.message == 'jwt expired') {
        localStorage.clear();
        navigate('/login');
        alert('Session expired. Please log in again.');
      }
    }
  };

  const createClass = async () => {
    const response = await fetch('http://localhost:3000/newClass', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teacherId: params.id,
        name: 'New Class',
        code: null,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Class created');
      console.log(data);
      return data.newClass._id;
    } else {
      console.log('Class not created');
      console.log(data);
      if (data.message == 'jwt expired') {
        localStorage.clear();
        navigate('/login');
        alert('Session expired. Please log in again.');
      }
    }
  };

  useEffect(() => {
    getClasses();
  }, [params.id, navigate]);

  useEffect(() => {
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
      } else {
        if (data.message == 'jwt expired') {
          localStorage.clear();
          navigate('/login');
          alert('Session expired. Please log in again.');
        }
      }
    };
    getTeacherDetails();
  }, [params.id, navigate]);

  return (
    <>
      {params.status === 'edit' ? (
        <div className='fixed inset-0 flex justify-center items-center'>
          <div className=' bg-black opacity-15 h-full w-full fixed -z-10'></div>
          <EditTeacher />
        </div>
      ) : null}
      <div className=' bg-slate-50 grow h-x'>
        <div className='pt-16 px-32'>
          <h1 className='text-4xl text-left pt-16 flex align-middle'>
            {teacherName} Classes &nbsp;
            <MdModeEdit
              className='cursor-pointer'
              onClick={() => {
                navigate('./edit');
              }}
            />
          </h1>
        </div>
        <div className='flex px-32 py-16'>
          <input className='mr-2 mt-1 w-96 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500' />
          <button className='mr-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
            Search
          </button>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
            onClick={async () => {
              const id = await createClass();
              getClasses();
              const segments = location.pathname.split('/');
              segments.pop();
              let newPath = segments.join('/');
              newPath += '/class/' + id + '/create';
              navigate(newPath);
            }}
          >
            New Class
          </button>
        </div>
        <div className='pb-16 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-32'>
          {classes.map((cls: Class) => {
            return (
              <div
                className='cursor-pointer transition hover:scale-105 p-4 shadow-lg rounded-md h-24 bg-white'
                key={cls._id}
              >
                <h1>{cls.name}</h1>
                <p className='font-light'>{cls.code}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Classes;
