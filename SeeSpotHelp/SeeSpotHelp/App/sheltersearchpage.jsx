﻿'use strict'
var React = require('react');

var ShelterSearchPage = React.createClass({
    render: function() {
        return (
          <div>
            Shelter Search Page
    {this.props.children}
          </div>
      );
}
});

module.exports = ShelterSearchPage;