var ServerResponse = require("./serverresponse");

// A volunteer group represents a group of volunteers at a given
// shelter.  The most common scenario will be a one to mapping of
// shelter to volunteer group, though it is possible for there to
// be multiple groups linked to a single shelter. An example of this
// is if there are two separate volunteer groups for each animal
// type - i.e. cat volunteers and dog volunteers. Another scenario
// is if a random person creates a volunteer group for a shelter, then
// stops using the app.  It will just sit there unused and the real
// volunteers will have to create a separate group.

var VolunteerGroup = function(name, shelter, address, id) {
    this.name = name;
    this.shelter = shelter;
    this.address = address;
    this.id = id;

    // Mapping of user id to permission enum, one entry per
    // member in the volunteer group.
    this.userPermissionsMap = {};
};

// Casts the given obj as a volunteer group.  Careful -
// obj must have originally been a type of VolunteerGroup
// for this to work as expected.  Helpful when passing around
// objects via React state and props.  Can use this to restore the
// original class, complete with functions, from an object with only
// properties.
VolunteerGroup.castObject = function(obj) {
    var group = new VolunteerGroup();
    for (var prop in obj) group[prop] = obj[prop];
    return group;
};

VolunteerGroup.PermissionsEnum = Object.freeze(
    {
        MEMBER: 0,
        ADMIN: 1,
        PENDINGMEMBERSHIP: 2,
        NONMEMBER: 3
    }
);

// Creates and returns a new volunteer group based on the fields supplied
// by the user during an input form.
// @param inputFields { { fieldName : InputField} } - A object where the keys
// are the field name (e.g. "groupName", "shelterName") and the values are
// InputFields which hold the values given by the user.
VolunteerGroup.createFromInputFields = function(inputFields, adminId) {
    var volunteerGroup = new VolunteerGroup();
    volunteerGroup.name = inputFields["groupName"].value;
    volunteerGroup.shelter = inputFields["shelterName"].value;
    volunteerGroup.address = inputFields["address"].value;
    volunteerGroup.userPermissionsMap[adminId] = VolunteerGroup.PermissionsEnum.ADMIN;

    return volunteerGroup;
};

VolunteerGroup.getFakeGroups = function() {
    return {
        "123": new VolunteerGroup(
            "Friends of Saratoga County Humane Society",
            "Saratoga County Humane Society",
            "Saratoga Springs, NY",
            "123"),
        "456": new VolunteerGroup(
            "Friends of Newark AHS",
            "Newark Humane Society",
            "Newark, NJ",
            "456"),
        "789": new VolunteerGroup(
            "Dog Walkers at Halfway Hounds",
            "Halfway Hounds",
            "Park Ridge, NJ",
            "789")
    };
};

VolunteerGroup.search = function (searchText) {
    var results = [];
    var fakeGroups = VolunteerGroup.getFakeGroups();
    for (var key in fakeGroups) {
        if (!fakeGroups.hasOwnProperty(key)) {
            continue;
        }
        var fakeGroup = fakeGroups[key];
        if (fakeGroup.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
            results.push(fakeGroup);
        }
    }
    return results;
};

VolunteerGroup.prototype.getUserPermissions = function (userId) {
    console.log("VolunteerGroup.prototype.getUserPermissions");
    if (this.userPermissionsMap.hasOwnProperty(userId)) {
        return this.userPermissionsMap[userId];
    } else {
        return VolunteerGroup.PermissionsEnum.NONMEMBER;
    }
};

VolunteerGroup.prototype.requestToJoin = function(user) {
    // TODO: Implement and hook into server-side.
}

// Inserts a new volunteer group if one does not exist in the database,
// otherwise updates the existing one with the current values.
VolunteerGroup.prototype.saveVolunteerGroup = function() {
    // TODO: Implement and hook into database.
};

// Returns a volunteer group object for the given id.  null if
// no volunteer group with that id exists.
VolunteerGroup.loadVolunteerGroup = function(groupId) {
    // TODO: Implement and hook into database.
    return VolunteerGroup.getFakeGroups()[groupId];
};

// Attempts to insert the current instance into the database as
// a new volunteer group.
// @param callback {Function(VolunteerGroup, ServerResponse) }
//     callback is expected to take as a first argument the potentially
//     inserted volunteer group (null on failure) and a server
//     response to hold error and success information.
VolunteerGroup.prototype.insert = function (callback) {
    // TODO: Implement and hook into database.
    callback(this, new ServerResponse());
};

module.exports = VolunteerGroup;
