import { Outlet } from 'react-router-dom';

function SRCDashboard() {
  return (
    <div className='grow flex flex-col'>
      <Outlet />
    </div>
  );
}

export default SRCDashboard;
