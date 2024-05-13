import { NavLink } from 'react-router-dom';

function SideBar() {
  return (
    <>
      <div
        className={` fixed h-full flex flex-col py-3 border-none bg-white z-10 px-2 shadow-2xl`}
      >
        <NavLink
          className={({ isActive }) =>
            (isActive ? 'bg-sky-200' : 'bg-white hover:bg-slate-50') +
            ' ' +
            'h-min py-2 text-black text-left pr-32 px-4 rounded-lg  mt-2'
          }
          to='/student'
        >
          Button 1
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            (isActive ? 'bg-sky-200' : 'bg-white hover:bg-slate-50') +
            ' ' +
            'h-min py-2 text-black text-left pr-32 px-4 rounded-lg my-2'
          }
          to='/student/test'
        >
          test
        </NavLink>
      </div>
      <div className='w-52'></div>
    </>
  );
}

export default SideBar;
