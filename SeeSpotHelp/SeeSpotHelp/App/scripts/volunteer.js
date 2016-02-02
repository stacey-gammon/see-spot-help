// A volunteer that may or may not be part of a volunteer group. User sessions
// managed by facebook login and authentication.

var FakeData = require('./fakedata');

var Volunteer = function (name, email, id) {
    this.name = name;
    this.email = email;

    // The id is the user id given by facebook.
    this.id = id;
}

// Using this.id, attempt to load the volunteer from the
// database.  If no such volunteer exists, AddNewVolunteer
// will be called with some basic defaults supplied by
// facebook.
Volunteer.prototype.LoadVolunteer = function () {
    // TODO: Implement
}

Volunteer.prototype.AddNewVolunteer = function() {
    // TODO: Implement
}

// Returns the default volunteer group this volunteer belongs to,
// if any. If the volunteer does not exist yet in the server db, they
// will be inserted. Returns null if user is not attached to any
// groups.
Volunteer.prototype.GetDefaultVolunteerGroup = function () {
    // TODO: implement
    return FakeData.fakeVolunteerGroupData["123"];
}

// Updates the default volunteer group associated with the current
// volunteer.
Volunteer.prototype.SetDefaultVolunteerGroup = function (groupId) {
    // TODO: implement
}

module.exports = Volunteer;
