'use babel';

export default class SpotifyNeonInfo {

  var instance;

  constructor() {
    
  }
  
  createInstance() {
    var object = {
      song = {
        name: "",
        artist: "",
        duration: 0
      },
      progress: 0
    }
    instance = object;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getInstance() {
    if (!instance) {
      instance = createInstance();
    }
    return instance;
  }
}
