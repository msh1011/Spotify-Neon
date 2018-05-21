'use babel';

export default class SpotifyNeonBackground {

  constructor() {
    var timer = setInterval(this.fetchData, 1000);
  }

  fetchData(){
    var access_token = atom.config.get("spotify-neon:access_token");
    if(access_token == "" || access_token == undefined){
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
      // console.log(response)
      atom.config.set("spotify-neon:song_name", response.item.name);
      atom.config.set("spotify-neon:song_artist", response.item.artists[0].name);
      atom.config.set("spotify-neon:song_art_url", response.item.album.images[0].url);
      if(!atom.config.get("spotify-neon:inform-outdated")){
        atom.config.set("spotify-neon:song_isplaying", response.is_playing);
      }
      atom.config.set("spotify-neon:inform-outdated", false);
      atom.config.set("spotify-neon:song_progress", response.progress_ms);
      atom.config.set("spotify-neon:song_length", response.item.duration_ms);
    });
  }
  
  serialize() {}

  destroy() {
  }
}
