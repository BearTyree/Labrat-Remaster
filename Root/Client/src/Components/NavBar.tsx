import Styles from './NavBar.module.css';
import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <div className={Styles.navBar}>
      <NavLink to='/'>Home</NavLink>
      <NavLink to='/login'>login</NavLink>
    </div>
  );
}

export default NavBar;
