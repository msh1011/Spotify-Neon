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
		var view = document.createElement('div')
		view.className = 'views'
		this.element.appendChild(view)
		this.element.appendChild(this.currentSongView.getElement());

		atom.commands.add('atom-workspace', {
			'spotify-neon:toggle-menu': () => this.toggleMenu()
		});
		this.refresh()
	}

	refresh() {
		if (this.isMenuOpen) {
			this.playlistView.getElement().style.display = 'block'
		} else {
			this.playlistView.getElement().style.display = 'none'
		}
		this.element.replaceChild(this.playlistView.getElement(), this.element.childNodes[0]);
	}


	toggleMenu() {
		this.isMenuOpen = !this.isMenuOpen;
		var icon = document.getElementById("button_open_playlist")
		if (this.isMenuOpen) {
			icon.className = 'icon icon-down'
		} else {
			icon.className = "icon icon-up"
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
