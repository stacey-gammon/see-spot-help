'use strict'

var React = require('react');
var AnimalGroup = require('./animalgroup');
var ShelterSearchBox = require('./sheltersearchbox');
var ShelterInfoBox = require('./shelterinfobox');
var ShelterActionsBox = require('./shelteractionsbox');
var FakeData = require('./fakedata');

var ShelterHomePage = React.createClass({
    render: function () {
        var query = this.props.location.query;
        if (query && query.groupId) {
            var activeGroup = FakeData.fakeVolunteerGroupData[query.groupId];
            localStorage.setItem('activeGroup', JSON.stringify(activeGroup));
        }
        var group = JSON.parse(localStorage.getItem('activeGroup'));
        if (group) {
            var animals = FakeData.getFakeAnimalDataForGroup(group.id);
            return (
                <div>
                    <ShelterInfoBox group={group}/>
                    <ShelterActionsBox />
                    <hr/>
                    <AnimalGroup animals={animals}/>
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
