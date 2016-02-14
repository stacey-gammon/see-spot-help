// A volunteer that may or may not be part of a volunteer group. User sessions
// managed by facebook login and authentication.

var VolunteerGroup = require('./volunteergroup');
var AjaxServices = require('./AJAXServices');
var volunteerCallback;

var Volunteer = function(name, email, id) {
    this.name = name;
    this.email = email;

    // The id is the user id given by facebook.
    this.id = id;
    this.groups = [];
};

Volunteer.prototype.isMemberOf = function (groupId) {
    for (var i = 0; i < this.groups.length; i++) {
        if (this.groups[i].id == groupId) return true;
    }
    return false;
}

// Casts the given obj as a Volunteer.  Careful - obj must have
// originally been a type of Volunteer for this to work as expected.
// Helpful when passing around objects via React state and props.
// Can use this to restore the original class, complete with functions,
// from an object with only properties.
Volunteer.castObject = function (obj) {
    var volunteer = new Volunteer();
    for (var prop in obj) volunteer[prop] = obj[prop];
    return volunteer;
};

// Using this.id, attempt to load the volunteer from the
// database.  If no such volunteer exists, AddNewVolunteer
// will be called with some basic defaults supplied by
// facebook.
Volunteer.LoadVolunteer = function (anID, name, email, callback) {
    console.log("Volunteer::LoadVolunteer");
    if (jQuery.isEmptyObject(name)) { name = ""; }
    if (jQuery.isEmptyObject(email)) { email = ""; }

    var LoadedVolunteerWithData = function (response) {
        console.log("Volunteer::LoadVolunteerWithData");
        if (response.d.result) {
            var loadedVolunteer = Volunteer.castObject(response.d.volunteerData);
            console.log("Calling callback function now:");
            callback(loadedVolunteer);
            // TODO: Change so all callbacks look something like this:
            // callback(loadedVolunteer, new ServerResponse(Success));
        } else {
            console.log("Volunteer::LoadVolunteerWithData: Error occurred");
            ShowErrorMessage(response.d);
        }
        //hideThrobber();
    };

    //Invoked when the server has an error (just an example)
    var FailedCallback = function (error) {
        console.log("Volunteer::FailedCallback");
        var errorString = '';
        errorString += 'Message:==>' + error.responseText + '\n\n';

        // just in case...
        //hideThrobber();

        // TODO: Change so callbacks look something like this:
        // outer.callback(null, new ServerResponse(Failed));
        alert(errorString);
    };

    var ajax = new AjaxServices(LoadedVolunteerWithData,
                                FailedCallback);
    ajax.CallJSONService(
        "../../WebServices/volunteerServices.asmx",
        "getVolunteer",
        { anID: anID, name: name, email: email });
};

function ShowErrorMessage(serverResponse) {

    var msg = '';

    for (i = 0; i < serverResponse.messages.length; i++) {
        if (serverResponse.messages[i] != null) {
            msg += serverResponse.messages[i] + '\n\r';
        }
    }
    //hideThrobber();

    alert(msg);
}

Volunteer.prototype.AddNewVolunteer = function() {
    // TODO: Implement

};

// Returns the default volunteer group this volunteer belongs to,
// if any. If the volunteer does not exist yet in the server db, they
// will be inserted. Returns null if user is not attached to any
// groups.
Volunteer.prototype.getDefaultVolunteerGroup = function() {
    // TODO: implement
    return VolunteerGroup.getFakeGroups()["123"];
};

// Updates the default volunteer group associated with the current
// volunteer.
Volunteer.prototype.setDefaultVolunteerGroup = function(groupId) {
    // TODO: implement
};

module.exports = Volunteer;
