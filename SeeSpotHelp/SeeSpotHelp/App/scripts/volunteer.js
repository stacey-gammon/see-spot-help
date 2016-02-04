// A volunteer that may or may not be part of a volunteer group. User sessions
// managed by facebook login and authentication.

var VolunteerGroup = require('./volunteergroup');

var Volunteer = function(name, email, id) {
    this.name = name;
    this.email = email;

    // The id is the user id given by facebook.
    this.id = id;
};

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
Volunteer.LoadVolunteer = function(anID, callback) {
    // TODO: Implement

    $.ajax({
        type: "POST",
        url: "WebServices/volunteerServices.asmx/getVolunteer",
        data: '{anID: ' + anID + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var volLit = JSON.parse(data.d);
            var newVol = new Volunteer();
            for (var prop in volLit)
                newVol[prop] = volLit[prop];
            callback(newVol);
        },

        error: function (ts) { alert(ts.responseText); }
    });
};

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
