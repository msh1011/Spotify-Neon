'use babel';
const {shell} = require('electron')
import { CompositeDisposable } from 'atom'
import SpotifyNeonMenuView from './menu-view';
import SpotifyNeonLoginView from './login-view';



export default class SpotifyNeonView {
   
  constructor(serializedState) {
    this.element = document.createElement('div');
    this.element.classList.add('spotify-neon');
    this.element.appendChild(document.createElement('div'))
    
    this.loginView = new SpotifyNeonLoginView();
    this.currentMenuView = new SpotifyNeonMenuView();
    
    this.refresh();
        
    atom.config.onDidChange('spotify-neon.access_token', () => {
      this.refresh()
    })
  }
  
  refresh(){
    
    var element = this.element
    var access_token = atom.config.get("spotify-neon.access_token");
    if(access_token == "" || access_token == undefined){
      this.element.replaceChild(this.loginView.getElement(), this.element.childNodes[0]);
    } else {
      this.element.replaceChild(this.currentMenuView.getElement(), this.element.childNodes[0]);
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
    atom.config.set('spotify-neon.access_token', access.value);
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
