import Styles from './NavBar.module.css';
import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <div className={Styles.navBar}>
      <NavLink to='/'>home</NavLink>
      <NavLink to='/login'>login</NavLink>
      <NavLink to='/signup'>signup</NavLink>
    </div>
  );
}

export default NavBar;
