

/**
 * Component used to perform navigation between different app views
 */
const NavBar = () => {
    return(
        <Menu pointing secondary vertical>
        <Menu.Item
          name='home'
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='messages'
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='friends'
          onClick={this.handleItemClick}
        />
      </Menu>
    );
}

export default NavBar;