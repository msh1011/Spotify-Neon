'use babel';
const {shell} = require('electron')
import { CompositeDisposable } from 'atom'


export default class SpotifyNeonView {

  constructor(serializedState) {
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
    atom.config.onDidChange('spotify-neon:song_isplaying', () => {
      var div = document.getElementById("button_play_pause")
      if(atom.config.get("spotify-neon:song_isplaying")) {
        div.src = 'atom://spotify-neon/styles/pause.svg'
      } else {
        div.src = 'atom://spotify-neon/styles/play.svg'
      }
      atom.config.set("spotify-neon:inform-outdated", true);
    })
  }
  
  refresh(){
    
    var element = document.getElementsByClassName("spotify-neon");
    var access_token = atom.config.get("spotify-neon:access_token");
    if(access_token == "" || access_token == undefined){
      const loginInfo = document.createElement('div');
      const login = document.createElement('button');
      login.type = 'button'
      login.id = "spotify_login"
      login.style.width = "100%";
      login.style.height = "100%";
      login.addEventListener('click', this.redirectLogin)
      login.innerHTML = 'Login to spotify';
      loginInfo.appendChild(login);
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
      
      const button_container = document.createElement('div');
      button_container.id = 'button_container'
      button_container.style.justifyContent = 'center'
      button_container.style.alignItems = 'center'
      button_container.style.width = '30%'
      button_container.style.height = '40%'
      button_container.style.position = "absolute"
      button_container.style.top = "30%"
      button_container.style.right = "0"
      
            
      const button_rewind = document.createElement('input');
      button_rewind.id = 'button_rewind'
      button_rewind.type = 'image'
      button_rewind.src = 'atom://spotify-neon/styles/end.svg'
      button_rewind.addEventListener('click', this.prevTrack)
      button_rewind.style.width = '25%'
      button_rewind.style.backgroundColor = 'red'
      
      const button_forward = document.createElement('input');
      button_forward.id = 'button_forward'
      button_forward.type = 'image'
      button_forward.src = 'atom://spotify-neon/styles/end.svg'
      button_forward.addEventListener('click', this.nextTrack)
      button_forward.style.width = '25%'
      button_forward.style.backgroundColor = 'blue'

      const button_play_pause = document.createElement('input');
      button_play_pause.id = 'button_play_pause'
      button_play_pause.type = 'image'
      if(atom.config.get("spotify-neon:song_isplaying")) {
        button_play_pause.src = 'atom://spotify-neon/styles/pause.svg'
      } else {
        button_play_pause.src = 'atom://spotify-neon/styles/play.svg'
      }
      button_play_pause.addEventListener('click', this.togglePlay)
      button_play_pause.style.width = '25%'
      button_play_pause.style.marginLeft = '3%'
      button_play_pause.style.marginRight = '3%'
      button_play_pause.style.backgroundColor = 'green'
      
      button_container.appendChild(button_rewind)
      button_container.appendChild(button_play_pause)
      button_container.appendChild(button_forward)
      
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
      songInfo.appendChild(button_container)
      songInfo.appendChild(song_length)
      this.element.replaceChild(songInfo, this.element.childNodes[0]);
    }
  }

  serialize() {}

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
  
  togglePlay (){
    atom.commands.dispatch(atom.views.getView(atom.workspace), "spotify-neon:toggle-playback")
  }
  prevTrack(){
    atom.commands.dispatch(atom.views.getView(atom.workspace), "spotify-neon:prev-track")
  }
  nextTrack(){
    atom.commands.dispatch(atom.views.getView(atom.workspace), "spotify-neon:next-track")
  }
}
