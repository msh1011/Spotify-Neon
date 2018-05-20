'use babel';
const {shell} = require('electron')
import { CompositeDisposable } from 'atom'


export default class SpotifyNeonView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('spotify-neon');
    this.element.appendChild(document.createElement('div'));
    
    document.createElement('button');
    
    
    this.refresh();
        
    atom.config.onDidChange('spotify-neon:access_token', () => {
      this.refresh()
    })
    atom.config.onDidChange('spotify-neon:song_name', () => {
      var div = document.getElementById("song_name");
      div.innerHTML = atom.config.get("spotify-neon:song_name")
    })
    atom.config.onDidChange('spotify-neon:song_artist', () => {
      var div = document.getElementById("song_artist");
      div.innerHTML = atom.config.get("spotify-neon:song_artist")
    })
    atom.config.onDidChange('spotify-neon:song_art_url', () => {
      var div = document.getElementById("song_art_url");
      div.src = atom.config.get("spotify-neon:song_art_url")
    })
    atom.config.onDidChange('spotify-neon:song_length', () => {
      clearInterval(this.progress_timer);
      document.getElementById("song_progress").offset_val = 0;
      this.progress_timer = setInterval( this.updateProgress, 100 )
    })
    atom.config.onDidChange('spotify-neon:song_progress', () => {
      var prog_ms = atom.config.get("spotify-neon:song_progress")
      var total_ms = atom.config.get("spotify-neon:song_length")
      var per = Math.floor(prog_ms/total_ms*100)
      var div = document.getElementById("song_progress")
      div.style.width = per + "%"
    })
  }
  
  refresh(){
    
    var element = document.getElementsByClassName("spotify-neon");
    
    if(atom.config.get('spotify-neon:access_token') == ""){
      const loginInfo = document.createElement('div');
      const login = document.createElement('button');
      login.type = 'button'
      login.id = "spotify_login"
      login.style.width = "100%";
      login.style.height = "100%";
      login.addEventListener('click', this.redirectLogin)
      login.innerHTML = 'Login to spotify';
      const input = document.createElement("input")
      input.type = 'text'
      input.id = 'access_token'
      input.value = ""
      input.style.width = "100%";
      input.style.height = "100%";
      input.addEventListener('click', this.checkAccessToken);
      loginInfo.appendChild(login);
      loginInfo.appendChild(input);
      this.element.replaceChild(loginInfo, this.element.childNodes[0]);
    } else {
      const songInfo = document.createElement('div');
      
      const song_art = document.createElement('img');
      song_art.id = 'song_art_url'
      song_art.src = atom.config.get("spotify-neon:song_art_url")
      song_art.style.width = "15%";
      song_art.style.height = "15%";
      song_art.style.float = "left";
      
      const song_name = document.createElement('div');
      song_name.id = 'song_name'
      song_name.innerHTML = atom.config.get("spotify-neon:song_name")
      song_name.style.width = "50%";
      song_name.style.height = "100%";
      song_name.style.marginLeft = "17%";
      song_name.style.marginTop = "2%";
      
      const song_artist = document.createElement('div');
      song_artist.id = 'song_artist'
      song_artist.innerHTML = atom.config.get("spotify-neon:song_artist")
      song_artist.style.width = "50%";
      song_artist.style.height = "100%";
      song_artist.style.marginLeft = "17%";
      song_artist.style.marginTop = "1%";
      
      const song_length = document.createElement('div')
      song_length.id = 'song_length';
      song_length.style.width = '100%'
      song_length.style.height = '.5em'
      song_length.style.position = "absolute"
      song_length.style.bottom = "0"
      song_length.style.left = "0"
      
      const song_progress = document.createElement('div')
      song_progress.id = 'song_progress';
      song_progress.style.backgroundColor = '#009688'
      song_progress.style.width = '0%'
      song_progress.style.height = '100%'
      song_progress.offset_val = 0;
      
      song_length.appendChild(song_progress);
      
      songInfo.appendChild(song_art)
      songInfo.appendChild(song_name)
      songInfo.appendChild(song_artist)
      songInfo.appendChild(song_length)
      this.element.replaceChild(songInfo, this.element.childNodes[0]);
    }
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }
  
  getElement(){
    return this.element;
  }
    
  checkAccessToken() {
    var access = document.getElementById("access_token")
    access.select();
    document.execCommand("paste");
    atom.config.set('spotify-neon:access_token', access.value);
  }

  redirectLogin() {    
    server = require("../spotify-auth/app")
    shell.openExternal("http://localhost:7888/login/")
  }

}
