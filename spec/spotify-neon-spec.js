'use babel';

import SpotifyNeon from '../lib/spotify-neon';
describe('SpotifyNeon', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('spotify-neon');
  });

  describe('when the spotify-neon.toggle event is triggered', () => {
    it('hides and shows the song information', () => {
      expect(workspaceElement.querySelector('.spotify-neon')).not.toExist();
      atom.commands.dispatch(workspaceElement, 'spotify-neon.toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.spotify-neon')).toExist();

        let spotifyNeonElement = workspaceElement.querySelector('.spotify-neon');
        expect(spotifyNeonElement).toExist();

        let spotifyNeonPanel = atom.workspace.panelForItem(spotifyNeonElement);
        expect(spotifyNeonPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'spotify-neon.toggle');
        expect(spotifyNeonPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.spotify-neon')).not.toExist();
      atom.commands.dispatch(workspaceElement, 'spotify-neon.toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        let spotifyNeonElement = workspaceElement.querySelector('.spotify-neon');
        expect(spotifyNeonElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'spotify-neon.toggle');
        expect(spotifyNeonElement).not.toBeVisible();
      });
    });
  });
});
