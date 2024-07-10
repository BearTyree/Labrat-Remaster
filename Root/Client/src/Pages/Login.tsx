import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../Socket.tsx';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    async function checkToken() {
      if (token) {
        const response = await fetch(
          'http://localhost:3000/authenticateToken',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          navigate('/student');
        } else {
          console.log('Token not valid');
          localStorage.clear();
        }
      }
    }
    checkToken();
  }, []);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      switch (data.message) {
        case 'success':
          localStorage.setItem('token', data.token);
          localStorage.setItem('userType', data.userType);
          socket.emit('token', data.token);
          navigate(`/${data.userType}`);
          return;
        case 'not verified':
          navigate('/checkEmail');
          return;
      }
    } else {
      alert(data.message);
    }
  };

  return (
    <div className='bg-slate-50 flex grow items-center justify-center h-full'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-sm w-full'>
        <h1 className='text-xl font-bold text-center mb-6'>Login</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              required
            />
          </div>
          <div className='mb-6'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              onChange={(e) => setPassword(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
