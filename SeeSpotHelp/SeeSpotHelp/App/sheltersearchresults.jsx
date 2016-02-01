var React = require('react');
var LinkContainer = require('react-router-bootstrap').LinkContainer;

var ShelterSearchResults = React.createClass({
    generateResult: function(result) {
        return (
            <LinkContainer to={{ pathname: 'shelterHomePage', query: { groupId: result.id } }}>
                <button className="btn btn-primary shelterResult">
                   {result.name} - {result.shelterName} - {result.address}
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