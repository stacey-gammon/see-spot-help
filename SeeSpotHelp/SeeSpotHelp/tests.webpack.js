// tests.webpack.js

// Use below line to run all tests.
var context = require.context('./Output/tests', true, /-test\.js?$/);
// Use a line like this to run only one test page:
//var context = require.context('./Output/tests', true, /comment-test\.js?$/);
context.keys().forEach(context);
