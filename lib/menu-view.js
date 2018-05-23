'use babel';
const { shell } = require('electron')
import { CompositeDisposable } from 'atom'
import SpotifyNeonSongView from './current-song-view';
import SpotifyNeonPlaylistView from './playlist-view'

export default class SpotifyNeonMenuView {

	constructor() {
		this.isMenuOpen = false;

		this.element = document.createElement('div');
		this.element.class = 'spotify-neon-menu-view'

		this.currentSongView = new SpotifyNeonSongView();
		this.playlistView = new SpotifyNeonPlaylistView();

		this.element.appendChild(document.createElement('div'))
		this.element.appendChild(this.currentSongView.getElement());

		atom.commands.add('atom-workspace', {
			'spotify-neon:toggle-menu': () => this.toggleMenu()
		});

	}

	refresh() {
		if (this.isMenuOpen) {
			this.element.replaceChild(this.playlistView.getElement(), this.element.childNodes[0]);
		} else {
			this.element.replaceChild(document.createElement('div'), this.element.childNodes[0]);
		}
	}


	toggleMenu() {
		this.isMenuOpen = !this.isMenuOpen;
		var icon = document.getElementById("button_open_playlist")
		if (this.isMenuOpen) {
			icon.innerHTML = "▼"
		} else {
			icon.innerHTML = "▲"
		}
		this.refresh()
	}

	serialize() {}

	destroy() {
		this.element.remove();
	}

	getElement() {
		return this.element;
	}

}
