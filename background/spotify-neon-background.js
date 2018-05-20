'use babel';

export default class SpotifyNeonBackground {

  constructor() {
    var timer = setInterval(this.fetchData, 1000);
  }

  fetchData(){
    var access_token = atom.config.get("spotify-neon:access_token");
    if(access_token == ""){
      return;
    }
    var playerUrl = 'https://api.spotify.com/v1/me/player';
    var playerHeader = { 
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    };
    fetch(playerUrl, playerHeader)
    .then(response => response.json())
    .then(response => {
      if(response.error != undefined){
        server = require("../spotify-auth/app")
        fetch("http://localhost:7888/refresh")
        return;
      }
      atom.config.set("spotify-neon:song_name", response.item.name);
      atom.config.set("spotify-neon:song_artist", response.item.artists[0].name);
      atom.config.set("spotify-neon:song_art_url", response.item.album.images[0].url);
      atom.config.set("spotify-neon:song_progress", response.progress_ms);
      atom.config.set("spotify-neon:song_length", response.item.duration_ms);
    });
  }
  
  serialize() {}

  destroy() {
  }
}
