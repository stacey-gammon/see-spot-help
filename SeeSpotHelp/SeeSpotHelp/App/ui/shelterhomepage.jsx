'use strict'

var React = require('react');
var AnimalList = require('./animallist');
var ShelterSearchBox = require('./sheltersearchbox');
var ShelterInfoBox = require('./shelterinfobox');
var ShelterActionsBox = require('./shelteractionsbox');
var FakeData = require('../scripts/fakedata');

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
            console.log("Animals are = " + animals);
            return (
                <div>
                    <ShelterInfoBox group={group}/>
                    <ShelterActionsBox />
                    <hr/>
                    <AnimalList animals={animals}/>
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
