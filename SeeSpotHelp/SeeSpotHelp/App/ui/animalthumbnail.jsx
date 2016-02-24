"use strict"

var React = require("react");

// A small representation of an animal to be displayed in the animal
// list. Clicking on the thumbnail will direct the user to the chosen
// animals home page.
var AnimalThumbnail = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    loadAnimalHomePage: function() {
        this.context.router.push(
            {
                pathname: "animalHomePage",
                state: {
                    group: this.props.group,
                    animal: this.props.animal
                }
            });
    },

    render: function () {
        return (
            <div>
                <div className="col-md-2 col-sm-3 col-xs-4">
                    <img className="img-rounded img-responsive animalThumbnailImg"
                         onClick={this.loadAnimalHomePage}
                         src={this.props.animal.photo} />
                    <p className="animalThumbnailText">{this.props.animal.name}</p>
                </div>
            </div>
        );
    }
});

module.exports = AnimalThumbnail;