import { useState } from 'react';

function Signup() {
  const [userType, setUserType] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userType,
        username,
        password,
        email,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Success');
      return;
    } else {
      alert(data.message);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>user type:</p>
        <select
          name='User Type'
          id='UserType'
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
        <p>username:</p>
        <input
          type='text'
          id='username'
          onChange={(e) => setUsername(e.target.value)}
        />
        <p>password:</p>
        <input
          type='password'
          id='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>email:</p>
        <input
          type='email'
          id='email'
          onChange={(e) => setEmail(e.target.value)}
        />
        {userType === 'student' ? <p>class:</p> : null}
        {userType === 'student' ? <input type='text' id='class' /> : null}
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default Signup;
