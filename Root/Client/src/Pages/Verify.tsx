import { useNavigate } from 'react-router-dom';

function Verify() {
  const navigate = useNavigate();
  const handleClick = async () => {
    const response = await fetch('http://localhost:3000/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(localStorage.getItem('email')),
    });
    const data = await response.json();
    if (response.ok) {
      navigate(`/${localStorage.getItem('userType')}`);
    } else {
      alert(data.message);
    }
  };
  return (
    <div>
      <h1>Click the link in your email to verify.</h1>
      <h2>Check your spam folder if you don't see it.</h2>
      <button
        onClick={() => {
          handleClick();
        }}
      >
        Click Here if Verified
      </button>
    </div>
  );
}

export default Verify;
