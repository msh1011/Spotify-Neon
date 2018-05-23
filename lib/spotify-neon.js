'use babel';

import SpotifyNeonView from './spotify-neon-view';
import SpotifyNeonBackground from '../background/spotify-neon-background';
import { CompositeDisposable } from 'atom';

export default {
  spotifyNeonBackground: null,
  spotifyNeonView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.spotifyNeonView = new SpotifyNeonView(state.spotifyNeonViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.spotifyNeonView.getElement(),
      visible: false
    });
    
    this.spotifyNeonBackground = new SpotifyNeonBackground();
    
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'spotify-neon:toggle': () => this.toggle()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'spotify-neon:next-track': () => this.nextTrack()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'spotify-neon:prev-track': () => this.prevTrack()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'spotify-neon:toggle-playback': () => this.togglePlayback()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'spotify-neon:toggle-playback': () => this.togglePlayback()
    }));
  },
  
  togglePlayback(){
    var url = ""
    var pause_url = 'https://api.spotify.com/v1/me/player/pause'
    var play_url = 'https://api.spotify.com/v1/me/player/play'
    if(atom.config.get("spotify-neon.song_isplaying")){
        url = pause_url
    } else {
        url = play_url
    }
    var access_token = atom.config.get("spotify-neon.access_token");
    var playerHeader = { 
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }
    fetch(url, playerHeader)
    .then(response => {
      if(response.ok){
        atom.config.set("spotify-neon.song_isplaying", !atom.config.get("spotify-neon.song_isplaying"))
        var div = document.getElementById("button_play_pause")
        if(atom.config.get("spotify-neon.song_isplaying")) {
          button_play_pause.className = 'icon icon-play'
        } else {
          button_play_pause.className = 'icon icon-pause'
        }
      }
    })
  },
  prevTrack(){
    var url = "https://api.spotify.com/v1/me/player/previous"
    var access_token = atom.config.get("spotify-neon.access_token");
    var playerHeader = { 
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }
    fetch(url, playerHeader)
  },
  nextTrack(){
    var url = "https://api.spotify.com/v1/me/player/next"
    var access_token = atom.config.get("spotify-neon.access_token");
    var playerHeader = { 
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }
    fetch(url, playerHeader)
  },
  

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.spotifyNeonView.destroy();
  },

  serialize() {
    return {
      spotifyNeonViewState: this.spotifyNeonView.serialize()
    };
  },

  toggle() {
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
