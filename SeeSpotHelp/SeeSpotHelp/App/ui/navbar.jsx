var React = require('react');
var ReactRouterBootstrap = require('react-router-bootstrap');
var ReactBootstrap = require('react-bootstrap');
var FacebookLogin = require('./facebooklogin');

var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var MyNavBar = React.createClass({
    render: function() {
        console.log("MyNavBar::render , user = ");
        console.log(this.props.user);
        return (
            <Navbar className="navbar navbar-light bg-faded">
                <Nav className="nav navbar-nav navbar-custom">
                    <LinkContainer to={{pathname: "shelterHomePage", state: this.props.user}}>
                        <NavItem>
                            <span className="glyphicon glyphicon-home" />
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer  to={{pathname: "shelterSearchPage", state: this.props.user}}>
                    <NavItem>
                        <span className="glyphicon glyphicon-search" />
                    </NavItem>
                    </LinkContainer>
                    </Nav>
                <Nav className="nav navbar-nav navbar-right navbar-right-custom ">
                    <NavItem>
                        <FacebookLogin />
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }
});

module.exports = MyNavBar;
