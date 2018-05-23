'use babel';
const {shell} = require('electron')
import { CompositeDisposable } from 'atom'
import SpotifyNeonCurrentPlaylistView from './current-playlist-view'

export default class SpotifyNeonPlaylistView {
   
  constructor() {
    
    this.element = document.createElement('div');
    this.element.class = 'spotify-neon-playlist-view'
    this.element.appendChild(document.createElement('div'))
    
    this.currentPlaylistView = new SpotifyNeonCurrentPlaylistView();
    this.refresh()
  }
  
  refresh(){
    this.element.replaceChild(this.currentPlaylistView.getElement(), this.element.childNodes[0]);
  }

  toggleMenu(){
    this.isMenuOpen = !this.isMenuOpen;
    this.refresh()
  }

  serialize() {}

  destroy() {
    this.element.remove();
  }
  
  getElement(){
    return this.element;
  }

}
