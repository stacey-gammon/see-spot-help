var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

var Page1 = React.createClass({
    render: function() {
        return (
          <div>
            Page1
    {this.props.children}
          </div>
      );
}
});

var Page2 = React.createClass({
    render: function() {
        return (
          <div>
            Page 2
            {this.props.children}
          </div>
      );
    }
});

var Home = React.createClass({
    render: function() {
        return (
          <div>
            <ul>
              <li><Link to="page1">Page1</Link></li>
              <li><Link to="page2">Page2</Link></li>
            </ul>
            {this.props.children}
          </div>
      );
    }
});

var routes = (
  <Router path="/" component={Home}>
    <Route path="page1" component={Page1}/>
    <Route path="page2" component={Page2}/>
  </Router>
);

ReactDOM.render(
    <Router routes={routes}/>,
    document.getElementById('content')
);