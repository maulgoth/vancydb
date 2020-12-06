import { Menu } from 'semantic-ui-react';

/**
 * Component used to perform navigation between different app views
 */
const NavBar = () => {
    return(       
       <Menu inverted pointing widths={3}>
      <Menu.Item
        name='Chart'
        href="/chart"
      />
      <Menu.Item
        name='Map'
        href="/map"
      />
      <Menu.Item
        name='HPI'
        href="/hpi"
      />
    </Menu>);

    
}

export default NavBar;