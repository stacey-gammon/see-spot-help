'use strict'
var React = require('react');
var ShelterSearchBox = require('./sheltersearchbox');

var ShelterSearchPage = React.createClass({
    render: function() {
        return (
          <div>
            <ShelterSearchBox />
            {this.props.children}
          </div>
      );
}
});

module.exports = ShelterSearchPage;