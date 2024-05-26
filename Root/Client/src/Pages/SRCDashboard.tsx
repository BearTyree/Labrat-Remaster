import { Outlet } from 'react-router-dom';

function SRCDashboard() {
  return (
    <div className='grow flex flex-row'>
      <Outlet />
    </div>
  );
}

export default SRCDashboard;
