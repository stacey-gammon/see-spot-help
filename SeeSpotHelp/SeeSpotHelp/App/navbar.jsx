var React = require('react');
var ReactRouterBootstrap = require('react-router-bootstrap');
var ReactBootstrap = require('react-bootstrap');

var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var MyNavBar = React.createClass({
    render: function() {
        return (
            <Navbar inverse fluid staticTop>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav navbar>
                        <LinkContainer to="shelterHomePage">
                        <NavItem>Saratoga County Humane Society</NavItem>
                        </LinkContainer>
                        <LinkContainer to="shelterSearchPage">
                        <NavItem>Search</NavItem>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
});

module.exports = MyNavBar;