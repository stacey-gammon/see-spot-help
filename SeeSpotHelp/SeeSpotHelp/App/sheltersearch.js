var FakeData = require('./fakedata');

var ShelterSearch = {
    GetShelterSearchResults: function (searchText) {
        var results = [];
        var fakeGroups = FakeData.GetFakeVolunteerGroupData();
        for (var i = 0; i < fakeGroups.length; i++) {
            if (fakeGroups[i].name.indexOf(searchText) > -1) {
                results.push(fakeGroups[i]);
            }
        }
        return results;
    }
}

module.exports = ShelterSearch;
