'use babel';

import SpotifyNeonView from './spotify-neon-view';
import SpotifyNeonBackground from '../background/spotify-neon-background';
import { CompositeDisposable } from 'atom';

export default {
  spotifyNeonBackground: null,
  spotifyNeonView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.spotifyNeonView = new SpotifyNeonView(state.spotifyNeonViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.spotifyNeonView.getElement(),
      visible: false
    });
    
    this.spotifyNeonBackground = new SpotifyNeonBackground();
    
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'spotify-neon:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.spotifyNeonView.destroy();
  },

  serialize() {
    return {
      spotifyNeonViewState: this.spotifyNeonView.serialize()
    };
  },

  toggle() {
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};