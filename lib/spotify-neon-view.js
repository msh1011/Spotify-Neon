'use babel';
const {shell} = require('electron')

export default class SpotifyNeonView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('spotify-neon');

    // Create message element
    
    
    const login = document.createElement('button');
    login.type = 'button'
    login.id = "spotify_login"
    login.style.width = "100%";
    login.style.height = "100%";
    login.addEventListener('click', this.redirectLogin)
    var t = document.createTextNode('Login to spotify');
    t.color = "#000000"
    login.appendChild(t);
    this.element.appendChild(login);
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

  redirectLogin() {
    var client_id = '440c317502fc46c6b8fd0b173c49c3b9'; // Your client id
    var redirect_uri = 'http://localhost:7888/callback/'; // Your redirect uri

    var scope = 'user-read-private user-read-email';

    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(123);
    
    server = require("../spotify-auth/app")
    shell.openExternal(url)
  }

}
