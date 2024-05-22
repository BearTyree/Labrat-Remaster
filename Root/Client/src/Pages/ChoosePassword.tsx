import { useState } from 'react';

function choosePassword() {
  const [password, setPassword] = useState('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch('http://localhost:3000/setPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('token') || '',
      },
      body: JSON.stringify({
        password,
      }),
    });
  };
  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input onChange={(e) => setPassword(e.target.value)} />
        <button type='submit'>Submit</button>
      </form>
    </>
  );
}

export default choosePassword;
