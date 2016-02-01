'use strict'
var React = require('react');
var ShelterSearchBox = require('./sheltersearchbox');
var FakeData = require('./fakedata');

var ShelterHomePage = React.createClass({
    render: function () {
        var query = this.props.location.query;
        if (query && query.groupId) {
            var activeGroup = FakeData.GetFakeVolunteerGroupData()[query.groupId];
            localStorage.setItem('activeGroup', JSON.stringify(activeGroup));
        }
        var group = JSON.parse(localStorage.getItem('activeGroup'));
        if (group) {
            return (
              <div>
                <h1>{group.name}</h1>
                  <h2>{group.shelterName} - {group.address}</h2>
                  <hr/>
            {this.props.children}
              </div>
          );
        } else {
            return (
                <div>
                    <ShelterSearchBox/>
                </div>
            );
        }
    }
});

module.exports = ShelterHomePage;
