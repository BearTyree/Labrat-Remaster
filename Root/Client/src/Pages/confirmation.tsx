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
        navigate(`/login`);
      } else {
        alert(data.message);
      }
    }
    verifyEmail();
  }, []);

  return <div>dgfgd</div>;
}

export default Confirmation;
