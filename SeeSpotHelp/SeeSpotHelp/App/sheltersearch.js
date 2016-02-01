var FakeData = require('./fakedata');

var ShelterSearch = {
    GetShelterSearchResults: function (searchText) {
        var results = [];
        var fakeGroupHash = FakeData.GetFakeVolunteerGroupData();
        for (var key in fakeGroupHash) {
            if (!fakeGroupHash.hasOwnProperty(key)) {
                continue;
            }
            var fakeGroup = fakeGroupHash[key];
            if (fakeGroup.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                results.push(fakeGroup);
            }
        }
        return results;
    }
}

module.exports = ShelterSearch;
