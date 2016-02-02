'use strict'

var ShelterHomePage = require('./shelterhomepage');
var ShelterSearchPage = require('./sheltersearchpage');
var AnimalHomePage = require('./animalHomePage');
var MyNavBar = require('./navbar');

var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

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
    <Route path="animalHomePage" component={AnimalHomePage} />
    <IndexRoute component={ShelterHomePage} />
  </Router>
);

ReactDOM.render(
    <Router routes={routes}/>,
    document.getElementById('content')
);