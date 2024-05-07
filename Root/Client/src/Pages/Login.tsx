import { useEffect } from 'react';

function Login() {
  useEffect(() => {
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'ert@gmail.com',
        password: 'ert',
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  return (
    <div>
      <h1>Login</h1>
    </div>
  );
}

export default Login;
