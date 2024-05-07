import Styles from './NavBar.module.css';
import { NavLink, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  return (
    <div className={Styles.navBar}>
      <NavLink to='/'>home</NavLink>
      <NavLink to='/login'>login</NavLink>
      <NavLink to='/signup'>signup</NavLink>
      <button
        onClick={() => {
          localStorage.clear();
          navigate('/');
        }}
      >
        logout
      </button>
    </div>
  );
}

export default NavBar;
