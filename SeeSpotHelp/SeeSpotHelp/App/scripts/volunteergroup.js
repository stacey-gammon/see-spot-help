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

VolunteerGroup.PermissionsEnum = Object.freeze(
    {
        MEMBER: 0,
        ADMIN: 1,
        NONMEMBER: 2
    }
);

VolunteerGroup.prototype.GetUserPermissions = function (userId) {
    return this.PermissionsEnum.MEMBER;

    // TODO: Use once loadVolunteerGroup is working.
    var permissions = userPermissionsMap[userId];
    if (!permissions) return this.PermissionsEnum.NONMEMBER;
    return permissions;
}

VolunteerGroup.prototype.SaveVolunteerGroup = function() {
    // TODO: Implement and hook into database.
}

// Returns a volunteer group object for the given id.  null if
// no volunteer group with that id exists.
VolunteerGroup.loadVolunteerGroup = function (groupId) {
    // TODO: Implement and hook into database.
    return FakeData.fakeVolunteerGroupData[groupId];
};

module.exports = VolunteerGroup;
