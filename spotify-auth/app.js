

var fs = require('fs');
var client_id = '440c317502fc46c6b8fd0b173c49c3b9';
var client_secret = '62bed183903b4c7994ec27683c9fa197';
var redirect_uri = 'http://localhost:7888/callback/';
var data = fs.readFileSync(__dirname + "/public/index.html");
require("http").createServer(function (req, res) {
    if(req.url.startsWith('/callback')){
        var code = /[A-Za-z0-9\-\_]{358}/g.exec(req.url)[0];
        var authUrl = 'https://accounts.spotify.com/api/token';
        var bodyUri = 'redirect_uri=' + encodeURIComponent(redirect_uri) +
                        '&code=' + encodeURIComponent(code) + 
                        '&grant_type=' + encodeURIComponent("authorization_code");
        var authHeader = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
          },
          body: bodyUri,
          method: 'POST',
          json: true,
        };
        fetch(authUrl, authHeader)
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            atom.config.set("spotify-neon.access_token", response.access_token)
            atom.config.set("spotify-neon.refresh_token", response.refresh_token)
        });
    }
    if(req.url.startsWith('/refresh')){
        var refreshUrl = 'https://accounts.spotify.com/api/token';
        var bodyUri = 'refresh_token=' + encodeURIComponent(atom.config.get("spotify-neon.refresh_token")) +
                        '&grant_type=' + encodeURIComponent("refresh_token");
        var refreshHeader = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            body: bodyUri,
            json: true
        };
        fetch(refreshUrl, refreshHeader)
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
           console.log(response)
            atom.config.set("spotify-neon.access_token", response.access_token)
            if(response.refresh_token != undefined){
                atom.config.set("spotify-neon.refresh_token", response.refresh_token)
            }
        });
    }
    if(req.url.startsWith('/login')){
        var scope = 'user-read-private user-read-email user-modify-playback-state user-read-currently-playing user-read-playback-state';
        var auth = 'https://accounts.spotify.com/authorize?' +
            'response_type=code' + 
            '&client_id=' + encodeURIComponent(client_id) +
            '&scope=' + encodeURIComponent(scope) +
            '&redirect_uri=' + encodeURIComponent(redirect_uri) +
            '&state=' + encodeURIComponent(123);
        res.writeHead(302, {'Location': auth});
    }
    res.write(data);
    res.end()
 }).listen(7888)
