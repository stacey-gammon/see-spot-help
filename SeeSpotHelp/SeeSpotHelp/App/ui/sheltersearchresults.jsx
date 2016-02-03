var React = require('react');
var Router = require('react-router');
var LinkContainer = require('react-router-bootstrap').LinkContainer;

var ShelterSearchResults = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    goToGroup: function(group) {
        console.log("Going to home page for group " + group.id);
        sessionStorage.setItem("defaultGroup", JSON.stringify(group));
        this.context.router.push({ pathname: "/shelterHomePage",
                                   query: { groupId: group.id },
                                   state: { defaultGroup: group, user: this.props.user } });
    },
    generateResult: function(result) {
        return (
            <button className="btn btn-primary shelterResult" onClick={this.goToGroup.bind(this, result)}>
                {result.name} - {result.shelterName} - {result.address}
            </button>
        );
    },

    getLoggedInUser: function() {
        
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