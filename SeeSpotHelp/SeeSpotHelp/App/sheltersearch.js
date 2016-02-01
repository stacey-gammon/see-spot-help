var FakeData = require('./fakedata');

var ShelterSearch = {
    GetShelterSearchResults: function (searchText) {
        console.log("Search for " + searchText);
        var results = [];
        var fakeShelters = FakeData.GetFakeShelterData();
        for (var i = 0; i < fakeShelters.length; i++) {
            if (fakeShelters[i].name.indexOf(searchText) > -1) {
                results.push(fakeShelters[i]);
            }
        }
        console.log("Resurning " + results);
        return results;
    }
}

module.exports = ShelterSearch;
