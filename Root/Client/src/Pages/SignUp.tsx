import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();

  const [userType, setUserType] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [classCode, setClassCode] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/student');
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userType,
        name,
        password,
        email,
        classCode,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      navigate('/student');
      return;
    } else {
      alert(data.message);
    }
  };
  return (
    <div>
      <div className='flex items-center justify-center h-screen bg-gradient-to-r from-cyan-500 to-blue-500'>
        <div className='bg-white p-8 rounded-lg shadow-lg max-w-sm w-full'>
          <h1 className='text-xl font-bold text-center mb-6'>Signup</h1>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label
                htmlFor='userType'
                className='block text-sm font-medium text-gray-700'
              >
                User Type
              </label>
              <select
                name='User Type'
                id='UserType'
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value='' disabled selected hidden>
                  Please Choose a Roll...
                </option>
                <option value='student'>student</option>
                <option value='teacher'>teacher</option>
                <option value='admin'>admin</option>
                <option value='src'>src</option>
              </select>
            </div>
            <div className='mb-4'>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                Name
              </label>
              <input
                type='text'
                id='name'
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <input
                type='password'
                id='password'
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className='mb-6'>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <input
                type='email'
                id='email'
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='mb-6'>
              {userType === 'student' ? (
                <label
                  htmlFor='class'
                  className='block text-sm font-medium text-gray-700'
                >
                  Class Code
                </label>
              ) : null}
              {userType === 'student' ? (
                <input
                  type='text'
                  id='class'
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  onChange={(e) => setClassCode(e.target.value)}
                />
              ) : null}
            </div>
            <button
              className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              type='submit'
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
