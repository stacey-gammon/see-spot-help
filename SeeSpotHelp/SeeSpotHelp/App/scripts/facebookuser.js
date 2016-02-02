var Volunteer = require('../scripts/volunteer');

// Attempts to load a facebook user asynchronously.
var FacebookUser = function (callback) {
    this.loading = true;
    this.volunteer = null;
    this.loggedIn = false;

    // Helpful to reference this outer class from the inner functions.
    var facebookUser = this;

    this.loadVolunteer = function() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function (response) {
            console.log('Successful login for: ' + response.name);
            facebookUser.volunteer = new Volunteer(
                response.name,
                "fakeemail",
                "fakeid");
            facebookUser.loading = false;
            facebookUser.loggedIn = true;
        });
    };

    this.loginCallback = function(response) {
        if (response.status === 'connected') {
            facebookUser.loadVolunteer();
        } else {
            facebookUser.loading = facebookUser.loggedIn = false;
        }
    }

    FB.getLoginStatus(this.loginCallback.bind(this));
}

module.exports = FacebookUser;