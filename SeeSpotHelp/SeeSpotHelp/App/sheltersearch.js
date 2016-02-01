var FakeData = require('./fakedata');

function ShelterSearch() {}

ShelterSearch.getShelterSearchResults = function(searchText)
{
    var results = [];
    for (var key in FakeData.fakeVolunteerGroupData) {
        if (!FakeData.fakeVolunteerGroupData.hasOwnProperty(key)) {
            continue;
        }
        var fakeGroup = FakeData.fakeVolunteerGroupData[key];
        if (fakeGroup.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
            results.push(fakeGroup);
        }
    }
    return results;
};

module.exports = ShelterSearch;
