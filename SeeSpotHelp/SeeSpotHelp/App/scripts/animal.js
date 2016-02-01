// An animal that is currently being managed by a volunteer group.

var Animal = function(name, type, breed, age, volunteerGroup, status, id) {
    this.name = name;
    this.type = type;
    this.breed = breed;
    this.age = age;
    this.volunteerGroup = volunteerGroup;
    this.status = status;
    this.id = id;
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

module.exports = Animal;
