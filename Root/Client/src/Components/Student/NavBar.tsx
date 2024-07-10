import { NavLink, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();

  return (
    <>
      <div
        className={
          'fixed w-full top-0 left-0 shadow-sm justify-end flex z-50  py-2 bg-white'
        }
      >
        <NavLink
          className='ml-4 mx-3 mr-auto justify-self-end bg-white hover:bg-slate-50 text-black py-2 px-4 rounded-full'
          to={'/student'}
        >
          Home
        </NavLink>
        <button
          className='mr-4 flex justify-center align-middle text-center bg-white hover:bg-slate-50 text-black py-2 px-4 rounded-full'
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>
      <div className='h-14'></div>
    </>
  );
}

export default NavBar;
