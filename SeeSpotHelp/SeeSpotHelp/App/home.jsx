'use strict'

var ShelterHomePage = require('./shelterhomepage');
var ShelterSearchPage = require('./sheltersearchpage');
var MyNavBar = require('./navbar');

var React = require('react');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

var Home = React.createClass({
    render: function() {
        return (
          <div>
            <MyNavBar/>
            {this.props.children}
          </div>
      );
    }
});

var routes = (
  <Router path="/" component={Home}>
    <Route path="shelterSearchPage" component={ShelterSearchPage}/>
    <Route path="shelterHomePage" component={ShelterHomePage}/>
  </Router>
);

ReactDOM.render(
    <Router routes={routes}/>,
    document.getElementById('content')
);