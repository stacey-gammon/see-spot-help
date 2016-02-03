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

VolunteerGroup.prototype.getUserPermissions = function(userId) {
    return VolunteerGroup.PermissionsEnum.MEMBER;

    // TODO: Use once loadVolunteerGroup is working.
    var permissions = userPermissionsMap[userId];
    if (!permissions) return this.PermissionsEnum.NONMEMBER;
    return permissions;
};

VolunteerGroup.prototype.saveVolunteerGroup = function() {
    // TODO: Implement and hook into database.
};

// Returns a volunteer group object for the given id.  null if
// no volunteer group with that id exists.
VolunteerGroup.loadVolunteerGroup = function(groupId) {
    // TODO: Implement and hook into database.
    return VolunteerGroup.getFakeGroups()[groupId];
};

module.exports = VolunteerGroup;
