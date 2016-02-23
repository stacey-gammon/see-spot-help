var React = require('react');
var ReactRouterBootstrap = require('react-router-bootstrap');
var ReactBootstrap = require('react-bootstrap');
var FacebookLogin = require('./facebooklogin');
var LoginStore = require("../stores/loginstore");

var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var MyNavBar = React.createClass({
    getInitialState: function () {
        return {
            user: LoginStore.user
        }
    },

    componentDidMount: function () {
        LoginStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        LoginStore.removeChangeListener(this.onChange);
    },

    onChange: function () {
        this.setState(
            {
                user: LoginStore.user
            });
    },

    render: function() {
        console.log("MyNavBar::render , user = ");
        console.log(this.state.user);
        return (
            <Navbar ref="mynavbar" className="navbar navbar-light bg-faded">
                <Nav className="nav navbar-nav navbar-custom">
                    <LinkContainer to={{ pathname: "shelterHomePage", state: { user: this.state.user } }}>
                        <NavItem>
                            <span className="glyphicon glyphicon-home" />
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer to={{ pathname: "profilePage", state: { user: this.state.user } }}>
                        <NavItem>
                            <span className="glyphicon glyphicon-user" />
                        </NavItem>
                    </LinkContainer>
                    <LinkContainer  to={{ pathname: "shelterSearchPage", state: { user: this.state.user } }}>
                    <NavItem>
                        <span className="glyphicon glyphicon-search" />
                    </NavItem>
                    </LinkContainer>
                    </Nav>
            </Navbar>
        );
    }
});

module.exports = MyNavBar;
