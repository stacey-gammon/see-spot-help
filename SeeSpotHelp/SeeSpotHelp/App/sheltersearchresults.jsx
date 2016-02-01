var React = require('react');

var ShelterSearchResults = React.createClass({
    loadShelter: function(shelter) {
        // TODO(sgammon): Implement
    },
    generateResult: function(result) {
        return <button onClick={this.loadShelter.bind(null, result.name)}>
                       {result.name}
               </button>
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