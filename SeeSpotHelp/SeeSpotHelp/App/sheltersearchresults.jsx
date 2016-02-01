var React = require('react');
var LinkContainer = require('react-router-bootstrap').LinkContainer;

var ShelterSearchResults = React.createClass({
    loadShelter: function(shelter) {
        
    },

    generateResult: function(result) {
        return (
            <LinkContainer to={{pathname: 'shelterHomePage', query: { shelterName: result.name } }}>
                <button className="btn btn-primary shelterResult">
                   {result.name}
                </button>
            </LinkContainer>
        );
    },

    render: function() {
        var items = this.props.results.map(this.generateResult);
        return (
            <div>
            {items}
            </div>
        );
    }
});

module.exports = ShelterSearchResults;