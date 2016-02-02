'use strict'

var React = require('react');
var LinkContainer = require('react-router-bootstrap').LinkContainer;

// A small representation of an animal to be displayed in the animal
// list. Clicking on the thumbnail will direct the user to the chosen
// animals home page.
var AnimalThumbnail = React.createClass({
    render: function () {
        return (
            <div>
                <LinkContainer to={{
                        pathname: "animalHomePage",
                        query: {
                            animalId: this.props.animal.id,
                            groupId: this.props.animal.volunteerGroup.id
                        }
                    }
                }>
                    <div className="col-md-2 col-sm-3 col-xs-4">
                        <img className="img-rounded img-responsive animalThumbnailImg" src={this.props.animal.photo} />
                        <p className="animalThumbnailText">{this.props.animal.name}</p>
                    </div>
                </LinkContainer>
            </div>
        );
    }
});

module.exports = AnimalThumbnail;