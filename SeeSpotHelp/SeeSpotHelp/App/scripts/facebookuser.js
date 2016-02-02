var Volunteer = require('../scripts/volunteer');

var FacebookUser = function () {
    var facebookUser = this;
    this.loading = true;
    this.volunteer = null;

    this.loadVolunteer = function() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function (response) {
            console.log('Successful login for: ' + response.name);
            facebookUser.volunteer = new Volunteer(response.name, "fakeemail", "fakeid");
            sessionStorage.setItem("volunteer", facebookUser.volunteer);
            console.log("Setting loading to false");
            facebookUser.loading = false;
        }.bind(this));
    }.bind(this);

    this.loginCallback = function(response) {
        if (response.status === 'connected') {
            console.log("connected and logged in, loading volunteer");
            facebookUser.loadVolunteer();
        } else {
            console.log("Setting loading to false, no login made.");
            facebookUser.loading = false;
        }
    }

    FB.getLoginStatus(this.loginCallback.bind(this));
}

module.exports = FacebookUser;