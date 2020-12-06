import { Menu } from 'semantic-ui-react';

/**
 * Component used to perform navigation between different app views
 */
const NavBar = () => {
    return(       
       <Menu inverted pointing widths={4}>
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
      <Menu.Item
        name='Address'
        href="/address"
      />
    </Menu>);

    
}

export default NavBar;