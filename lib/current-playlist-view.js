'use babel';
const { shell } = require('electron')
import { CompositeDisposable } from 'atom'


export default class SpotifyNeonCurrentPlaylistView {

	constructor() {
		this.playlist = {}
		this.element = document.createElement('div');
		this.element.class = 'spotify-neon-current-playlist-view'
		this.element.appendChild(document.createElement('div'))

		atom.config.onDidChange('spotify-neon.current-playlist-url', () => {
			this.refresh()
		})
		this.refresh()
	}

	refresh() {
		var access_token = atom.config.get("spotify-neon.access_token");
		var url = atom.config.get('spotify-neon.current-playlist-url');
		if (url == "") {
			return
		}
		var header = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + access_token
			}
		}
		fetch(url, header)
			.then(response => response.json())
			.then(response => {
				if (response.ok) {
					this.playlist = response;
					var songs = document.createElement('div')
					songs.className = 'current-playlist-songs'
					songs.style.overflowX = 'auto'
					// console.log(this.playlist)
					for (var song in this.playlist.tracks.items) {
						var track = document.createElement("button")
						track.className = 'current-playlist-track'
						if (this.playlist.type == "album") {
							this.playlist.tracks.items[song].track = {
								name: this.playlist.tracks.items[song].name,
								artists: this.playlist.tracks.items[song].artists,
								uri: this.playlist.tracks.items[song].uri
							}
						}
						track.addEventListener('click',
							this.playTrack(this.playlist.uri, this.playlist.tracks.items[song].track.uri))

						var name = document.createElement("div")
						name.className = 'current-playlist-track-name'
						name.innerHTML = this.playlist.tracks.items[song].track.name

						var artist = document.createElement("div")
						artist.className = 'current-playlist-track-artist'
						artist.innerHTML = this.playlist.tracks.items[song].track.artists[0].name

						track.appendChild(name)
						track.appendChild(artist)
						songs.appendChild(track)
					}
					this.element.replaceChild(songs, this.element.childNodes[0])
				}
			})
	}
	playTrack(playlistUri, trackUri) {
		return function(t) {
			var access_token = atom.config.get("spotify-neon.access_token");
			var url = 'https://api.spotify.com/v1/me/player/play'
			var header = {
				method: 'PUT',
				body: JSON.stringify({ context_uri: playlistUri, offset: { uri: trackUri } }),
				headers: {
					"Accept": "application/json",
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + access_token
				}
			}
			fetch(url, header)
		}
	};

	serialize() {}

	destroy() {
		this.element.remove();
	}

	getElement() {
		return this.element;
	}
}
