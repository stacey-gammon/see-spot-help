
var VolunteerGroup = require('./volunteergroup');
var Animal = require('./animal');

function FakeData() {}

FakeData.fakeVolunteerGroupData = {
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

FakeData.getFakeAnimalData = function () {
    return {
        "123": {
            "dogId1": new Animal(
                "Cococo",
                "Dog",
                "Pitbull",
                1,
                this.fakeVolunteerGroupData["123"],
                Animal.StatusEnum.ADOPTABLE,
                "dogId1"),
            "dogId2": new Animal(
                "Fluffy",
                "Dog",
                "Newfoundland",
                5,
                this.fakeVolunteerGroupData["123"],
                Animal.StatusEnum.ADOPTABLE,
                "dogId2"),
            "dogId4": new Animal(
                "Max",
                "Dog",
                "Lab",
                10,
                this.fakeVolunteerGroupData["123"],
                Animal.StatusEnum.ADOPTABLE,
                "dogId4")
            },
        "456": {
            "dogId3": new Animal(
                "Jack",
                "Dog",
                "Russel Terrier",
                2,
                this.fakeVolunteerGroupData["456"],
                Animal.StatusEnum.ADOPTABLE,
                "dogId3")
        }
    };
}

FakeData.getFakeAnimalDataForGroup = function(groupId) {
    return this.getFakeAnimalData()[groupId];
};

module.exports = FakeData;