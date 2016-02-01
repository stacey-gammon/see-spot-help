
var FakeData = {
    GetFakeVolunteerGroupData: function() {
        return {
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
        }
    },
    GetFakeUser: function() {
        return {
            "name": "Susy Q",
            "volunteerGroup": GetFakeVolunteerGroupData()["123"]
        }
    }
}

module.exports = FakeData;