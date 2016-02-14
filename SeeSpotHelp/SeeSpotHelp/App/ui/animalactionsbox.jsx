"use strict"

var React = require("react");
var AjaxServices = require("../core/AJAXServices");
var TakePhotoButton = require("./takephotobutton");
var LoginStore = require("../stores/loginstore");

// Actions to display on the animal home page, such as Add Activity,
// Edit and Delete.
var AnimalActionsBox = React.createClass({
    getInitialState: function() {
        return {
            walking: false,
            user: LoginStore.user
        }
    },

    componentDidMount: function () {
        LoginStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        LoginStore.removeChangeListener(this.onChange);
    },

    onChange: function () {
        this.setState(
            {
                user: LoginStore.user
            });
    },

    alertNotImplemented: function () {
        alert('Sorry, that functionality is not implemented yet!');
    },

    endWalk: function() {
        var startWalk = this.state.startWalkTime;
        var totalWalkTimeInMinutes = (Date.now() - startWalk) / (1000 * 60);
        this.setState({ walking: false });

        // TODO(stacey): Temporary, implement this feature fully.
        console.log("You walked the dog for " + totalWalkTimeInMinutes + " minutes");
    },

    startWalk: function() {
        this.setState({walking: true, startWalkTime: Date.now() });
        var walkButton = document.getElementById('walkButton');
        walkButton.text = "End Walk";
        walkButton.onClick = this.endWalk;
    },

    isMemberOfGroup: function () {
        return this.state.user &&
               this.props.group &&
               this.state.user.isMemberOf(this.props.group.id);
    },

    render: function () {
         console.log("AnimalActionsBox::render");
        var walkFunction = this.state.walking ? this.endWalk : this.startWalk;
        var walkText = this.state.walking ? "End walk" : "Walk";
        return (
            <div>
                <button className="btn btn-info buttonPadding walkAnimalButton"
                        id="walkButton"
                        disabled={!this.isMemberOfGroup()}
                        onClick={walkFunction}>
                    {walkText}
                </button>
                <button className="btn btn-info buttonPadding addAnimalNoteButton"
                        disabled={!this.isMemberOfGroup()}>
                    Add Note
                </button>
                <button className="btn btn-info buttonPadding editAnimalButton"
                        onClick={this.alertNotImplemented}
                        disabled={!this.isMemberOfGroup()}>
                    Edit
                </button>
                <TakePhotoButton className="takePhotoButton"
                                 group={this.props.group}
                                 animal={this.state.animal}/>
            </div>
        );
    }
});

module.exports = AnimalActionsBox;