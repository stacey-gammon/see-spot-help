'use strict'
var React = require('react');

var ShelterHomePage = React.createClass({
    render: function () {
        var query = this.props.location.query;
        var groupName = "Search for a shelter volunteer group to join!";
        if (query && query.groupName) {
            groupName = query.groupName;
        }
        return (
          <div>
            {groupName}
        {this.props.children}
          </div>
      );
}
});

module.exports = ShelterHomePage;