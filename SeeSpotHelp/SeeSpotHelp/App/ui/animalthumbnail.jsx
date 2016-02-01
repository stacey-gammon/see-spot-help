'use strict'

var React = require('react');
var Link = require('react-router').Link;

// A small representation of an animal to be displayed in the animal
// list. Clicking on the thumbnail will direct the user to the chosen
// animals home page.
var AnimalThumbnail = React.createClass({
    render: function () {
        return (
            <div>
                <Link to={{
                        pathname: "animalHomePage",
                        query: {
                            animalId: this.props.animal.id,
                            groupId: this.props.animal.volunteerGroup.id
                        }
                    }
                }>{this.props.animal.name}</Link>
            </div>
        );
    }
});

module.exports = AnimalThumbnail;