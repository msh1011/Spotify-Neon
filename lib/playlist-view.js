'use babel';
const { shell } = require('electron')
import { CompositeDisposable } from 'atom'
import SpotifyNeonplistView from './current-playlist-view'
import SpotifyNeonSelectedPlaylistView from './select-playlist-view'

export default class SpotifyNeonPlaylistView {

	constructor() {

		this.element = document.createElement('div');
		this.element.class = 'spotify-neon-playlist-view'
		this.element.appendChild(document.createElement('div'))
		this.element.appendChild(document.createElement('div'))
		this.element.appendChild(document.createElement('div'))

		this.plistView = new SpotifyNeonplistView();
		this.selectedView = new SpotifyNeonSelectedPlaylistView();
		this.refresh()
		atom.config.onDidChange('spotify-neon.access_token', () => {
			this.refresh()
		})
	}

	refresh() {
		var access_token = atom.config.get("spotify-neon.access_token");
		if(access_token == ""){
			return;
		}
		var playlistSidebar = document.createElement('div')
		playlistSidebar.id = 'playlist_nav'
		playlistSidebar.className = 'playlist_nav'
		var playlist_nav_close = document.createElement('a')
		playlist_nav_close.className = 'playlist_nav_close'
		playlist_nav_close.href = 'javascript:void(0)'
		playlist_nav_close.innerHTML = '&times;'
		playlist_nav_close.addEventListener('mousedown', this.closePlaylist)
		playlistSidebar.appendChild(playlist_nav_close)

		var ListHeader = document.createElement('div')
		ListHeader.className = 'playlistHeader'
		ListHeader.innerHTML = 'Playlists'
		playlistSidebar.appendChild(ListHeader)

		playlistSidebar.appendChild(document.createElement('div'))

		var AlbumHeader = document.createElement('div')
		AlbumHeader.className = 'playlistHeader'
		AlbumHeader.innerHTML = 'Albums'
		playlistSidebar.appendChild(AlbumHeader)

		playlistSidebar.appendChild(document.createElement('div'))

		var url = 'https://api.spotify.com/v1/me/playlists?limit=50'
		var header = {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + access_token
			}
		}
		fetch(url, header)
			.catch(err => {})
			.then(response => response.json())
			.then(response => {
				if (response.items != undefined) {
					var playlists = document.createElement('div')
					playlists.className = 'user-playlists'
					playlists.style.overflowX = 'auto'

					for (var list in response.items) {
						var plist = document.createElement("a")
						plist.className = 'current-playlist'
						plist.href = 'javascript:void(0)'
						plist.addEventListener('click',
							this.openPlaylist.bind(this, response.items[list]))

						var name = document.createElement("div")
						name.className = 'playlist-name'
						name.innerHTML = response.items[list].name
						if (response.items[list].uri == atom.config.get('spotify-neon.current-playlist-uri')) {
							plist.className = "current-playlist active_playlist"
						}
						plist.appendChild(name)
						playlists.appendChild(plist)
					}
					playlistSidebar.replaceChild(playlists, playlistSidebar.childNodes[2]);
				}
			})
		var AlbumUrl = 'https://api.spotify.com/v1/me/albums?limit=50'
		fetch(AlbumUrl, header)
			.then(response => response.json())
			.then(response => {
				if (response.items != undefined) {
					var playlists = document.createElement('div')
					playlists.className = 'user-playlists'
					playlists.style.overflowX = 'auto'

					for (var list in response.items) {
						var plist = document.createElement("a")
						plist.className = 'current-playlist'
						plist.href = 'javascript:void(0)'
						plist.addEventListener('click',
							this.openPlaylist.bind(this, response.items[list].album))

						var name = document.createElement("div")
						name.className = 'playlist-name'
						name.innerHTML = response.items[list].album.name
						if (response.items[list].album.uri == atom.config.get('spotify-neon.current-playlist-uri')) {
							plist.className = "current-playlist active_playlist"
						}
						plist.appendChild(name)
						playlists.appendChild(plist)
					}
					playlistSidebar.replaceChild(playlists, playlistSidebar.childNodes[4]);
				}
			})
			

		this.element.replaceChild(playlistSidebar, this.element.childNodes[0]);
		this.element.replaceChild(this.plistView.getElement(), this.element.childNodes[1]);
		this.element.replaceChild(this.selectedView.getElement(), this.element.childNodes[2]);
	}


	closePlaylist() {
		document.getElementById("playlist_nav").style.width = "0em";
	}

	openPlaylist(playlist) {
		var currentPlaylist = atom.config.get('spotify-neon.current-playlist-url')
		if (playlist.href == currentPlaylist) {
			this.closePlaylist()
			atom.config.set('spotify-neon.selected-playlist-url', "")
		} else {
			atom.config.set('spotify-neon.selected-playlist-url', playlist.href)
		}
	}

	toggleMenu() {
		this.isMenuOpen = !this.isMenuOpen;
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
