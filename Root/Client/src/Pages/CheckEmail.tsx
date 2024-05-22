import { useNavigate } from 'react-router-dom';

function CheckEmail() {
  const navigate = useNavigate();
  const handleClick = async () => {
    navigate('/login');
  };
  return (
    <div className='items-center justify-center h-full grow flex bg-slate-50'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-sm w-full'>
        <h1 className='text-xl font-bold text-center mb-6'>
          Click the link in your email to verify.
        </h1>
        <p>Check your spam folder if you don't see it.</p>
        <h2>You can close this page now.</h2>

        <button
          className='mt-8 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={() => {
            handleClick();
          }}
        >
          Click Here if Verified
        </button>
      </div>
    </div>
  );
}

export default CheckEmail;
