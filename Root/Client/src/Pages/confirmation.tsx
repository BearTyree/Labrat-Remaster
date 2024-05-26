import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Confirmation() {
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    console.log(params);
    async function verifyEmail() {
      console.log(params);
      const response = await fetch('http://localhost:3000/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: params.email,
          emailVerificationCode: params.code,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.userType);
        switch (data.message) {
          case 'success':
            navigate(`/${data.userType}`);
            break;
          case 'choose password':
            navigate(`/${data.userType}/choosePassword`);
            break;
        }
      } else {
        alert(data.message);
      }
    }
    verifyEmail();
  }, []);

  return <div>Confirmation</div>;
}

export default Confirmation;
