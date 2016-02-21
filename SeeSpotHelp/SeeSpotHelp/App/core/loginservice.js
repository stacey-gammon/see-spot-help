var Volunteer = require("../core/volunteer");
var LoginActions = require("../actions/loginactions");

var LoginService = function () {}

LoginService.useFirebase = true;

LoginService.loginWithFirebaseFacebook = function() {
    var ref = new Firebase("https://shining-torch-1432.firebaseio.com");
    ref.authWithOAuthPopup("facebook", function (error, authData) {
        if (error) {
            console.log("Login Failed!", error);
            LoginActions.userLogInFailed(new Error("No facebook user found"));
        } else {
            console.log("Authenticated successfully with payload:", authData);

            Volunteer.LoadVolunteer(
                authData.facebook.id, authData.facebook.name, null, LoginActions.userLoggedIn);
        }
    });
};

LoginService.loginWithFacebookAPI = function () {
    console.log("LoginService.loginWithFacebookAPI");
    var outer = this;
    this.loadVolunteer = function () {
        console.log("FacebookUser::login : loadVolunteer");
        FB.api("/me", function (response) {
            console.log("Successful login for " + response.name +
                        " with id " + response.id +
                        " and email " + response.email);
            Volunteer.LoadVolunteer(
                response.id, response.name, response.email, LoginActions.userLoggedIn);
        });
    };

    this.loginCallback = function (response) {
        console.log("FacebookUser::login : loginCallback");
        if (response.status === "connected") {
            outer.loadVolunteer();
        } else {
            console.log("No facebook login user found.");
            LoginActions.userLogInFailed(new Error("No facebook user found"));
        }
    }

    console.log("Getting fb login status");
    FB.getLoginStatus(this.loginCallback.bind(this));
};

LoginService.loginWithFacebook = function () {
    if (LoginService.useFirebase) {
        LoginService.loginWithFirebaseFacebook();
    } else {
        LoginService.loginWithFacebookAPI();
    }
}

module.exports = LoginService
