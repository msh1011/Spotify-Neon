'use babel';
const { shell } = require('electron')
import { CompositeDisposable } from 'atom'
import SpotifyNeonCurrentPlaylistView from './current-playlist-view'

export default class SpotifyNeonSongView {

	constructor(serializedState) {
		this.element = document.createElement('div');
		this.element.class = 'spotify-neon-song-view'

		this.create();

		atom.config.onDidChange('spotify-neon.song_name', () => {
			var div = document.getElementById("song_name");
			div.innerHTML = atom.config.get("spotify-neon.song_name")
		})
		atom.config.onDidChange('spotify-neon.song_artist', () => {
			var div = document.getElementById("song_artist");
			div.innerHTML = atom.config.get("spotify-neon.song_artist")
		})
		atom.config.onDidChange('spotify-neon.song_art_url', () => {
			var div = document.getElementById("song_art_url");
			div.src = atom.config.get("spotify-neon.song_art_url")
		})
		atom.config.onDidChange('spotify-neon.song_length', () => {
			clearInterval(this.progress_timer);
			document.getElementById("song_progress").offset_val = 0;
			this.progress_timer = setInterval(this.updateProgress, 100)
		})
		atom.config.onDidChange('spotify-neon.song_progress', () => {
			var prog_ms = atom.config.get("spotify-neon.song_progress")
			var total_ms = atom.config.get("spotify-neon.song_length")
			var per = Math.floor(prog_ms / total_ms * 100)
			var div = document.getElementById("song_progress")
			div.style.width = per + "%"
		})
	}

	create() {

		const songInfo = this.element

		const song_art = document.createElement('img');
		song_art.id = 'song_art_url'
		song_art.src = atom.config.get("spotify-neon.song_art_url")
		song_art.style.width = "15%";
		song_art.style.height = "15%";
		song_art.style.float = "left";

		const song_name = document.createElement('div');
		song_name.id = 'song_name'
		song_name.innerHTML = atom.config.get("spotify-neon.song_name")


		const song_artist = document.createElement('div');
		song_artist.id = 'song_artist'
		song_artist.innerHTML = atom.config.get("spotify-neon.song_artist")
		song_artist.style.marginTop = "1%";

		const button_open_playlist = document.createElement('button')
		button_open_playlist.id = 'button_open_playlist'
		button_open_playlist.className = 'icon'
		button_open_playlist.innerHTML = '▲'
		button_open_playlist.addEventListener('click', this.toggleMenu)


		const button_container = document.createElement('div');
		button_container.id = 'button_container'
		button_container.style.justifyContent = 'center'
		button_container.style.alignItems = 'center'
		button_container.style.width = '22.5%'
		button_container.style.height = '40%'


		const button_rewind = document.createElement('button');
		button_rewind.id = 'button_rewind'
		button_rewind.className = 'icon icon-previous'
		button_rewind.addEventListener('mousedown', this.prevTrack)
		button_rewind.style.width = '30%'

		const button_forward = document.createElement('button');
		button_forward.id = 'button_forward'
		button_forward.className = 'icon icon-next'
		button_forward.addEventListener('mousedown', this.nextTrack)
		button_forward.style.width = '30%'

		const button_play_pause = document.createElement('button');
		button_play_pause.id = 'button_play_pause'
		if (atom.config.get("spotify-neon.song_isplaying")) {
			button_play_pause.className = 'icon icon-pause'
		} else {
			button_play_pause.className = 'icon icon-play'
		}
		button_play_pause.addEventListener('mousedown', this.togglePlay)
		button_play_pause.style.width = '30%'
		button_play_pause.style.marginLeft = '3%'
		button_play_pause.style.marginRight = '3%'

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
		songInfo.appendChild(button_open_playlist)
		songInfo.appendChild(song_length)
	}

	serialize() {}

	destroy() {
		this.element.remove();
	}

	getElement() {
		return this.element;
	}

	toggleMenu() {
		atom.commands.dispatch(atom.views.getView(atom.workspace), "spotify-neon:toggle-menu")
	}

	togglePlay() {
		atom.commands.dispatch(atom.views.getView(atom.workspace), "spotify-neon:toggle-playback")
	}
	prevTrack() {
		atom.commands.dispatch(atom.views.getView(atom.workspace), "spotify-neon:prev-track")
	}
	nextTrack() {
		atom.commands.dispatch(atom.views.getView(atom.workspace), "spotify-neon:next-track")
	}
}
