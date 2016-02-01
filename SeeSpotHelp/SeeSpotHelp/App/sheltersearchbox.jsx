'use strict'

var React = require('react');
var ShelterSearch = require('./sheltersearch');
var ShelterSearchResults = require('./sheltersearchresults');

var ShelterSearchBox = React.createClass({
    shelterSearch: function () {
        var searchText = document.getElementById('shelterSearchText').value;
        var results = ShelterSearch.getShelterSearchResults(searchText);
        this.setState({
            results: results
        });
    },
    getInitialState:function(){
        return{
            results: []
        }
    },
    render: function() {
        return (
            <div>
                <div className="input-group">
                    <input type="text" className="form-control"
                            id="shelterSearchText"
                            placeholder="Search for a shelter or volunteer group..."/>
                    <span className="input-group-btn">
                        <button type="button" className="btn btn-primary"
                           onClick={this.shelterSearch}>
                           <span className="glyphicon glyphicon-search"></span>
                        </button>
                    </span>
                </div>
                <ShelterSearchResults results={this.state.results}/>
            </div>
        );
    }
});

module.exports = ShelterSearchBox;