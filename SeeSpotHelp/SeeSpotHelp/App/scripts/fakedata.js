
var VolunteerGroup = require('volunteergroup');

function FakeData() {}

FakeData.fakeVolunteerGroupData = {
    "123": new VolunteerGroup(
            "Friends of Saratoga County Humane Society",
            "Saratoga County Humane Society",
            "123",
            "Saratoga Springs, NY"),
    "456": new VolunteerGroup(
            "Friends of Newark AHS",
            "Newark Humane Society",
            "456",
            "Newark, NJ"),
    "789": new VolunteerGroup(
            "Dog Walkers at Halfway Hounds",
            "Halfway Hounds",
            "789",
            "Park Ridge, NJ")
};

FakeData.getFakeAnimalData = function () {
    return {
        "123": {
            "dogId1": {
                "name": "Coco",
                "age": "5",
                "breed": "pitbull",
                "id": "dogId1",
                "group": this.fakeVolunteerGroupData["123"],
                "photo": "./images/coco.png"
            },
            "dogId2": {
                "name": "Fluffy",
                "age": "1",
                "breed": "Newfoundland",
                "id": "dogId2",
                "group": this.fakeVolunteerGroupData["123"],
                "photo": "./images/fluffy.png"
            },
            "dogId4": {
                "name": "Max",
                "age": "10",
                "breed": "Lab",
                "id": "dogId4",
                "group": this.fakeVolunteerGroupData["123"],
                "photo": "./images/max.png"
            }
        },
        "456": {
            "dogId3": {
                "name": "Jack",
                "age": "7",
                "id": "dogId3",
                "group": this.fakeVolunteerGroupData["456"],
                "photo": "./images/jack.png"
            }
        }
    };
}

FakeData.getFakeAnimalDataForGroup = function(groupId) {
    return this.getFakeAnimalData()[groupId];
};

module.exports = FakeData;