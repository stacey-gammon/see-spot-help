'use strict'

var React = require('react');
var Link = require('react-router').Link;

var AnimalThumbnail = React.createClass({
    render: function () {
        return (
            <div>
                <Link to={{
                        pathname: "animalHomePage",
                        query: {
                            animalId: this.props.animal.id,
                            groupId: this.props.animal.group.id
                        }
                    }
                }>{this.props.animal.name}</Link>
            </div>
        );
    }
});

module.exports = AnimalThumbnail;