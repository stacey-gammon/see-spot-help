var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var MenuItem = ReactBootstrap.MenuItem;
var Link = ReactRouter.Link;

var MyNavBar = React.createClass({
    render: function() {
        return (
            <Navbar inverse fluid staticTop>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav navbar>
                        <NavItem ><Link to="shelterHomePage" >Saratoga County Humane Society</Link></NavItem>
                        <NavItem ><Link to="shelterSearchPage" >Search</Link></NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
});

module.exports = MyNavBar;