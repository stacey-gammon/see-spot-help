var LoginStore = require("../stores/loginstore");
var AjaxServices = require('./AJAXServices');
var ServerResponse = require('./serverresponse');

// An animal that is currently being managed by a volunteer group.

var Animal = function(name, type, breed, age, volunteerGroup, status, photo, id, groupId) {
    this.name = name;
    this.type = type;
    this.breed = breed;
    this.age = age;
    this.volunteerGroup = volunteerGroup;
    this.status = status ? status : Animal.StatusEnum.ADOPTABLE;
    this.photo = photo;
    this.id = id;
    this.groupId = volunteerGroup ? volunteerGroup.id : "";
}

Animal.StatusEnum = Object.freeze(
    {
        ADOPTABLE: 0,  // Animal is currently up for adoption.
        RESCUEONLY: 1,  // Animal can be adopted to rescue groups only.
        MEDICAL: 2,  // Animal is not up for adoption due to medical reasons.
        ADOPTED: 3,  // Animal has been adopted, YAY!
        PTS: 4,  // Animal has been put to sleep. :*(
        NLL: 5,  // Animal is No Longer Living due to other reasons.  Can be
        // used instead of PTS if people would prefer not to specify,
        // or if animal died of other causes.
        OTHER: 6 // In case I'm missing any other circumstances...
    }
);

Animal.castObject = function (obj) {
    var animal = new Animal();
    animal.copyFieldsFrom(obj);
    return animal;
};

Animal.prototype.copyFieldsFrom = function (other) {
    for (var prop in other) {
        this[prop] = other[prop];
    }
}

// Attempts to insert the current instance into the database as
// a animal
// @param callback {Function(Animal, ServerResponse) }
//     callback is expected to take as a first argument the potentially
//     inserted animal (null on failure) and a server
//     response to hold error and success information.
Animal.prototype.insert = function (callback) {
    console.log("Animal::insert animal:");
    console.log(this);

    var SuccessCallback = function (response) {
        console.log("Animal::SuccessCallback");
        if (response.d.result) {
            var animal = Animal.castObject(response.d.animal);
            callback(animal, new ServerResponse());
        } else {
            console.log("Animal::SuccessCallback: Error occurred");
            callback(null, new ServerResponse(response.d));
        }
    };

    var FailureCallback = function (error) {
        console.log("Animal:Insert:FailureCallback");
        var errorString = 'Message:==>' + error.responseText + '\n\n';
        callback(null, new ServerResponse(errorString));
    };

    var ajax = new AjaxServices(SuccessCallback, FailureCallback);
    ajax.CallJSONService(
        "../../WebServices/AnimalServices.asmx",
        "insert",
        {
            name: this.name,
            type: this.type,
            breed: this.breed,
            age: this.age,
            status: this.status,
            groupId: Number(this.groupId)
        });
};

// Attempts to update the current animal into the database.
// @param callback {Function(Animal, ServerResponse) }
//     callback is expected to take as a first argument the potentially
//     updated animal (null on failure) and a server
//     response to hold error and success information.
Animal.prototype.update = function (callback) {
    console.log("Animal::update");

    var SuccessCallback = function (response) {
        console.log("Animal::SuccessCallback");
        if (response.d.result) {
            var animal = Animal.castObject(response.d.animal);
            callback(animal, new ServerResponse());
        } else {
            console.log("Animal::SuccessCallback: Error occurred");
            callback(null, new ServerResponse(response.d));
        }
    };

    var FailureCallback = function (error) {
        console.log("Animal:Insert:FailureCallback");
        var errorString = 'Message:==>' + error.responseText + '\n\n';
        callback(null, new ServerResponse(errorString));
    };

    var ajax = new AjaxServices(SuccessCallback, FailureCallback);
    ajax.CallJSONService(
        "../../WebServices/AnimalServices.asmx",
        "update",
        {
            id: this.id,
            name: this.name,
            type: this.type,
            breed: this.breed,
            age: this.age,
            status: this.status,
            groupId: this.groupId
        });
};

module.exports = Animal;
