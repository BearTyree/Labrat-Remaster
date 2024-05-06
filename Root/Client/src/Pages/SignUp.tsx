import { useEffect } from 'react';

function Signup() {
  useEffect(() => {
    fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userType: 'student',
        username: 'dfsdsf',
        password: 'admin',
        email: '',
        classCode: 'dfsdfs',
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  return (
    <div>
      <h1>Signup</h1>
    </div>
  );
}

export default Signup;
