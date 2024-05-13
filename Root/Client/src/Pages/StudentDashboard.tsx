import { Outlet } from 'react-router-dom';
import SideBar from '../Components/Student/SideBar';

function StudentDashboard() {
  return (
    <div className='grow flex flex-row'>
      <SideBar />
      <Outlet />
    </div>
  );
}

export default StudentDashboard;
