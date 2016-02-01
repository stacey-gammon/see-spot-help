'use strict'
var React = require('react');

var ShelterHomePage = React.createClass({
    render: function () {
        var query = this.props.location.query;
        var shelterName = "Search for a shelter to join one!";
        if (query && query.shelterName)
            shelterName = query.shelterName;
        return (
          <div>
            {shelterName}
        {this.props.children}
          </div>
      );
}
});

module.exports = ShelterHomePage;