var Firebase = require('firebase');

// Initialize Firebase
var devConfig = {
  apiKey: "AIzaSyCTMUD7ilylF5erNiGtsoSDp6kReVOBWXY",
  authDomain: "shelter-helpers-dev.firebaseapp.com",
  databaseURL: "https://shelter-helpers-dev.firebaseio.com",
  storageBucket: "shelter-helpers-dev.appspot.com",
};
var releaseConfig = {
  apiKey: "AIzaSyBZk2PjHJAM-HYyiUegWFhMnbbCfZAr_e4",
  authDomain: "shelter-helpers-release.firebaseapp.com",
  databaseURL: "https://shelter-helpers-release.firebaseio.com",
  storageBucket: "shelter-helpers-release.appspot.com",
};
var liveConfig = {
  apiKey: "AIzaSyAmUDL3vRmv7RsLJIe9oMKLqHhmvuOmBCc",
  authDomain: "shining-torch-1432.firebaseapp.com",
  databaseURL: "https://shining-torch-1432.firebaseio.com",
  storageBucket: "shining-torch-1432.appspot.com",
};

export default function InitializeFirebase() {
  Firebase.initializeApp(devConfig);
}
