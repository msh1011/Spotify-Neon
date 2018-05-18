'use babel';

import SpotifyNeonView from './spotify-neon-view';
import { CompositeDisposable } from 'atom';

export default {

  spotifyNeonView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.spotifyNeonView = new SpotifyNeonView(state.spotifyNeonViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.spotifyNeonView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
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
