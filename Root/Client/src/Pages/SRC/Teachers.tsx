import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
interface Teacher {
  _id: string;
  name: string;
  email: string;
}

function Teachers() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const newTeacher = async () => {
    const response = await fetch('http://localhost:3000/newTeacher', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        name: 'New Teacher',
        email: 'New Teacher',
      }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Teacher created');
      return data.id;
    } else {
      console.log('Teacher not created');
      console.log(data);
      if (data.message == 'jwt expired') {
        localStorage.clear();
        navigate('/login');
        alert('Session expired. Please log in again.');
      }
    }
  };

  const getTeachers = async () => {
    const response = await fetch('http://localhost:3000/getTeachers', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      setTeachers(data.teachers);
    } else {
      console.log('Teachers not found');
      console.log(data);
      if (data.message == 'jwt expired') {
        localStorage.clear();
        navigate('/login');
        alert('Session expired. Please log in again.');
      }
    }
  };

  useEffect(() => {
    getTeachers();
  }, []);
  return (
    <div className=' bg-slate-50 grow h-x'>
      <div className='pt-16 px-32'>
        <h1 className='text-4xl text-left pt-16'>Teachers</h1>
      </div>
      <div className='flex px-32 py-16'>
        <input className='mr-2 mt-1 w-96 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500' />
        <button className='mr-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
          Search
        </button>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
          onClick={async () => {
            const id = await newTeacher();
            navigate('/src/teacher/' + id + '/create');
          }}
        >
          New Teacher
        </button>
      </div>
      <div className='pb-16 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-32'>
        {teachers.map((teacher: Teacher) => {
          return (
            <div
              className='cursor-pointer transition hover:scale-105 p-4 shadow-lg rounded-md h-24 bg-white'
              key={teacher._id}
              onClick={() => {
                navigate('/src/teacher/' + teacher._id + '/edit');
              }}
            >
              <h1>{teacher.name}</h1>
              <p className='font-light'>{teacher.email}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Teachers;
