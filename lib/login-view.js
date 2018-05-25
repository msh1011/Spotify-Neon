'use babel';
const { shell } = require('electron')
import { CompositeDisposable } from 'atom'

export default class SpotifyNeonLoginView {

	constructor(serializedState) {
		this.element = document.createElement('div');
		this.element.class = 'spotify-neon-login-view'

		this.create();
	}

	create() {

		var loginInfo = this.element

		const login = document.createElement('button');
		login.type = 'button'
		login.id = "spotify_login"
		login.innerHTML = 'Login to spotify';
		login.style.width = "100%";
		login.style.height = "100%";
		login.addEventListener('click', this.redirectLogin)

		loginInfo.appendChild(login);
	}

	serialize() {}

	destroy() {
		this.element.remove();
	}

	getElement() {
		return this.element;
	}

	redirectLogin() {
		server = require("../spotify-auth/app")
		shell.openExternal("http://localhost:7888/login/")
	}
}
