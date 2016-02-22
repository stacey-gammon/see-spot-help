"use strict"

var ServerResponse = require("./serverresponse");
var AJAXServices = require('./AJAXServices');

// A volunteer group represents a group of volunteers at a given
// shelter.  The most common scenario will be a one to mapping of
// shelter to volunteer group, though it is possible for there to
// be multiple groups linked to a single shelter. An example of this
// is if there are two separate volunteer groups for each animal
// type - i.e. cat volunteers and dog volunteers. Another scenario
// is if a random person creates a volunteer group for a shelter, then
// stops using the app.  It will just sit there unused and the real
// volunteers will have to create a separate group.

// Creates a new volunteer group with the given fields.
// @param name {string} The group name.
// @param shelter {string} The shelter name.
// @param address {string} The street address of the shelter.
// @param city {string} The city of the sheleter.
// @param state {string} The state the shelter belongs in.
// @param zipCode {string} The zip code the shelter resides in.
// @param id {string} the id of the group.
var VolunteerGroup = function(name, shelter, address, city, state, zipCode, id) {
    this.name = name;
    this.shelter = shelter;
    this.address = address;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
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
    group.copyFieldsFrom(obj);
    return group;
};

VolunteerGroup.prototype.copyFieldsFrom = function (other) {
    for (var prop in other) {
        this[prop] = other[prop];
    }
}

VolunteerGroup.PermissionsEnum = Object.freeze(
    {
        MEMBER: 0,
        NONMEMBER: 1,
        ADMIN: 2,
        PENDINGMEMBERSHIP: 3,
        MEMBERSHIPDENIED: 4
    }
);

// Creates and returns a new volunteer group based on the fields supplied
// by the user during an input form.
// @param inputFields { { fieldName : InputField} } - A object where the keys
// are the field name (e.g. "groupName", "shelterName") and the values are
// InputFields which hold the values given by the user.
VolunteerGroup.createFromInputFields = function(inputFields, adminId) {
    var volunteerGroup = new VolunteerGroup();
    volunteerGroup.updateFromInputFields(inputFields);
    volunteerGroup.userPermissionsMap[adminId] = VolunteerGroup.PermissionsEnum.ADMIN;
    return volunteerGroup;
};

// Creates and returns a new volunteer group based on the fields supplied
// by the user during an input form.
// @param inputFields { { fieldName : InputField} } - A object where the keys
// are the field name (e.g. "groupName", "shelterName") and the values are
// InputFields which hold the values given by the user.
VolunteerGroup.prototype.updateFromInputFields = function (inputFields) {
    this.name = inputFields["name"].value;
    this.shelter = inputFields["shelter"].value;
    this.address = inputFields["address"].value;
    this.city = inputFields["city"].value;
    this.state = inputFields["state"].value;
    this.zipCode = inputFields["zipCode"].value;
};

VolunteerGroup.getFakeGroups = function() {
    var fakeGroups = {
        "123": new VolunteerGroup(
            "Friends of Saratoga County Humane Society",
            "Saratoga County Humane Society",
            "96 Broadway", "Saratoga Springs", "NY", "12866",
            "123"),
        "456": new VolunteerGroup(
            "Friends of Newark AHS",
            "Newark Humane Society",
            "96 Street lane", "Newark", "NJ", "12345",
            "456"),
        "789": new VolunteerGroup(
            "Dog Walkers at Halfway Hounds",
            "Halfway Hounds",
            "96 Street lane", "Park Ridge", "NJ", "12345",
            "789")
    };
    return fakeGroups;
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
    console.log("VolunteerGroup.prototype.getUserPermissions for " + userId);
    if (this.userPermissionsMap.hasOwnProperty(userId)) {
        return this.userPermissionsMap[userId];
    } else {
        return VolunteerGroup.PermissionsEnum.NONMEMBER;
    }
};

VolunteerGroup.prototype.requestToJoin = function(user) {
    // TODO: Implement and hook into server-side.
}

// Returns a volunteer group object for the given id.  null if
// no volunteer group with that id exists.
VolunteerGroup.loadVolunteerGroup = function(groupId) {
    // TODO: Implement and hook into database.
    return VolunteerGroup.getFakeGroups()[groupId];
};

VolunteerGroup.prototype.insertWithFirebase = function (user, callback) {
    console.log("VolunteerGroup.insertWithFirebase");
    var outer = this;
    var onFailure = function (response) {
        console.log("failed");
        callback(null, new ServerResponse("failed"));
    }
    // TODO: Race condition here. Set rules for unique name in groupsByName.
    var onSuccess = function (getResponse) {
        console.log("VolunteerGroup.insertWithFirebase: onSuccess, response:");
        console.log(getResponse);
        if (getResponse != null) {
            callback(null, new ServerResponse("Volunteer group with that name already exists"));
        } else {
            outer.id = null;
            outer.id = AJAXServices.PushFirebaseData("groups", outer).id;
            console.log("Pushing new group");
            AJAXServices.UpdateFirebaseData(
                "groupPermissions/" + user.id + "/" + outer.id,
                { permission : VolunteerGroup.PermissionsEnum.ADMIN });
            AJAXServices.SetFirebaseData("groupsByName/" + outer.name, outer);
            AJAXServices.UpdateFirebaseData("users/" + user.id, { defaultGroupId : outer.id });
            callback(outer, new ServerResponse());
        }
    }
    var dataServices = new AJAXServices(onSuccess, onFailure);
    dataServices.GetFirebaseData("groupsByName/" + this.name);
};

// Attempts to insert the current instance into the database as
// a new volunteer group.
// @param callback {Function(VolunteerGroup, ServerResponse) }
//     callback is expected to take as a first argument the potentially
//     inserted volunteer group (null on failure) and a server
//     response to hold error and success information.
VolunteerGroup.prototype.insert = function (user, callback) {
    console.log("VolunteerGroup::insert");

    if (AJAXServices.useFirebase) {
        return this.insertWithFirebase(user, callback);
    }

    var LoadedGroupWithData = function (response) {
        console.log("VolunteerGroup::LoadedGroupWithData");
        if (response.d.result) {
            var loadedGroup = VolunteerGroup.castObject(response.d.volunteerGroup);
            console.log("Calling callback function now:");

            user.groups.push(updatedGroup);
            callback(loadedGroup, new ServerResponse());
        } else {
            console.log("Volunteer::LoadVolunteerWithData: Error occurred");
            callback(null, new ServerResponse(response.d));
        }
    };

    //Invoked when the server has an error (just an example)
    var FailedCallback = function (error) {
        console.log("VolunteerGroup:Insert:FailedCallback");
        var errorString = 'Message:==>' + error.responseText + '\n\n';
        callback(null, new ServerResponse(errorString));
    };

    var ajax = new AJAXServices(LoadedGroupWithData,
                                FailedCallback);
    ajax.CallJSONService(
        "../../WebServices/VolunteerGroupServices.asmx",
        "insert",
        {
            adminId: user.id,
            name: this.name,
            shelterName: this.shelter,
            shelterAddress: this.address,
            shelterState: this.state,
            shelterCity: this.city,
            shelterZip: this.zipCode
        });
};

// Attempts to update the current volunteer group into the database.
// @param callback {Function(VolunteerGroup, ServerResponse) }
//     callback is expected to take as a first argument the potentially
//     updated volunteer group (null on failure) and a server
//     response to hold error and success information.
VolunteerGroup.prototype.update = function (callback) {
    console.log("VolunteerGroup::update");

    if (AJAXServices.useFirebase) {
        var ref = new Firebase(AJAXServices.firebaseUrl + "/groups/" + this.id);
        ref.once("value", function (data) {
            console.log("Updating group data");
            if (data.name != this.name) {
                AJAXServices.SetFirebaseData("groupsByName/" + data.name, null);
                AJAXServices.SetFirebaseData("groupsByName/" + this.name, this);
            }
            AJAXServices.UpdateFirebaseData("groups/" + this.id, this);
        });
        return;
    }


    var UpdatedGroup = function (response) {
        console.log("VolunteerGroup::UpdatedGroup");
        if (response.d.result) {
            var updatedGroup = VolunteerGroup.castObject(response.d.volunteerGroup);
            console.log("Calling callback function now:");

            //callback(updatedGroup, new ServerResponse());
        } else {
            console.log("Volunteer::LoadVolunteerWithData: Error occurred");
            callback(null, new ServerResponse(response.d));
        }
    };

    //Invoked when the server has an error (just an example)
    var FailedCallback = function (error) {
        console.log("VolunteerGroup:Insert:FailedCallback");
        var errorString = 'Message:==>' + error.responseText + '\n\n';
        callback(null, new ServerResponse(errorString));
    };

    var ajax = new AJAXServices(UpdatedGroup,
                                FailedCallback);
    ajax.CallJSONService(
        "../../WebServices/VolunteerGroupServices.asmx",
        "update",
        {
            groupId: this.id,
            name: this.name,
            shelterName: this.shelter,
            shelterAddress: this.address,
            shelterState: this.state,
            shelterCity: this.city,
            shelterZip: this.zipCode
        });
};

module.exports = VolunteerGroup;
