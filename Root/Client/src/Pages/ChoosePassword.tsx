import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function choosePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/setPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('token') || '',
      },
      body: JSON.stringify({
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.message == 'success') {
        navigate(`/${localStorage.getItem('userType')}`);
      }
    } else {
      if (data.message == 'jwt expired') {
        localStorage.clear();
        navigate('/login');
      }
    }
  };
  return (
    <div className='grow bg-slate-50 flex items-center justify-center h-full'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-sm w-full'>
        <h1 className='text-xl font-bold text-center mb-6'>Set Password</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            placeholder='password'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className='mt-8 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            type='submit'
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default choosePassword;
