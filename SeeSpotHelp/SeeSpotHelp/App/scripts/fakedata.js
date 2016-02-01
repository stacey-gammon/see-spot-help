
function FakeData() {}

FakeData.fakeVolunteerGroupData = {
    "123": {
        "name": "Friends of Saratoga County Humane Society",
        "shelterName": "Saratoga County Humane Society",
        "id": "123",
        "address": "Saratoga Springs, NY"
    },
    "456": {
        "name": "Friends of Newark AHS",
        "shelterName": "Newark Humane Society",
        "id": "456",
        "address": "Newark, NJ"
    },
    "789": {
        "name": "Dog Walkers at Halfway Hounds",
        "shelterName": "Halfway Hounds",
        "id": "789",
        "address": "Park Ridge, NJ"
    }
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