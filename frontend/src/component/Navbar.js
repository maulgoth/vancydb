import { Menu } from 'semantic-ui-react';

/**
 * Component used to perform navigation between different app views
 */
const NavBar = () => {
    return(       
       <Menu inverted pointing widths={2}>
      <Menu.Item
        name='home'
      />
      <Menu.Item
        name='Login'
      />
    </Menu>);

    
}

export default NavBar;