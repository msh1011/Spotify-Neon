/**
 * This is an example of a basic node.js script that performs
 * the Implicit Grant oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow
 */
 var fs = require('fs')
var data = fs.readFileSync(__dirname + "/public/index.html");
 require("http").createServer(function (req, res) {

    res.end();
  }); 
 }).listen(7888)
