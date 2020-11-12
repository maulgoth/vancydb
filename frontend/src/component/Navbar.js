import { Menu } from 'semantic-ui-react';

/**
 * Component used to perform navigation between different app views
 */
const NavBar = () => {
    return(       
       <Menu inverted pointing widths={2}>
      <Menu.Item
        name='Chart'
        href="/chart"
      />
      <Menu.Item
        name='Map'
        href="/map"
      />
    </Menu>);

    
}

export default NavBar;