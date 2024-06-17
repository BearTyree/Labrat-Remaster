import { Outlet } from 'react-router-dom';

function TeacherDashboard() {
  return (
    <div className='grow flex flex-col'>
      <Outlet />
    </div>
  );
}

export default TeacherDashboard;
