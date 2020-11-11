import { Menu } from 'semantic-ui-react';

/**
 * Component used to perform navigation between different app views
 */
const NavBar = () => {
    return(       
       <Menu inverted pointing widths={3}>
      <Menu.Item
        name='home'
      />
      <Menu.Item
        name='messages'
      />
      <Menu.Item
        name='friends'
      />
    </Menu>);

    
}

export default NavBar;