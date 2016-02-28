// tests.webpack.js

// Use below line to run all tests.
var context = require.context('./App', true, /-test\.jsx?$/);
// Use a line like this to run only one test page:
//var context = require.context('./App/tests', true, /AddNewGrouppage-test\.jsx?$/);
context.keys().forEach(context);
