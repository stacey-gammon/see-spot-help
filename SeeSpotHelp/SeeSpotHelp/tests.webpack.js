// tests.webpack.js
var context = require.context('./App', true, /-test\.jsx?$/);
context.keys().forEach(context);