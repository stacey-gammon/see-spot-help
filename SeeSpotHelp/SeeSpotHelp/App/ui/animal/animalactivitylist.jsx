'use strict'

var React = require('react');
var AnimalActivityStore = require("../../stores/animalactivitystore");
var VolunteerStore = require("../../stores/volunteerstore");

var AnimalActivityList = React.createClass({
    getInitialState: function() {
        return {
            animal: this.props.animal
        };
    },

    componentDidMount: function () {
        AnimalActivityStore.addChangeListener(this.onChange);
        // In case a user changes their name on us, update the note.
        VolunteerStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        AnimalActivityStore.removeChangeListener(this.onChange);
        VolunteerStore.removeChangeListener(this.onChange);
    },

    onChange: function () {
        this.setState(
            {
                animal: this.props.animal
            });
    },

    generateAnimalNote: function (note) {
        console.log("generateAnimalNote, note = ", note);
        return (
            <a>
                <div className="list-group-item">
                    {note.toDisplayString(VolunteerStore.getVolunteerById(note.byUserId))}
                </div>
            </a>
        );
    },

    render: function () {
        var notes = AnimalActivityStore.getActivityByAnimalId(this.props.animal.id);
            console.log("AnimalActivityList:render with notes:", notes);
        var displayNotes = [];
        for (var i = 0; i < notes.length; i++) {
            displayNotes.push(this.generateAnimalNote(notes[i]));
        }
        return (
            <div className="list-group">
                {displayNotes}
            </div>
        );
    }
});

module.exports = AnimalActivityList;
