'use strict'
var React = require('react');

var ShelterHomePage = React.createClass({
    render: function() {
        return (
          <div>
            Shelter Home Page
        {this.props.children}
          </div>
      );
}
});

module.exports = ShelterHomePage;