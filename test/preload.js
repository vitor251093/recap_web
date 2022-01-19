const {ipcRenderer, shell} = require('electron')

global.Client = {
    closeCurrentApp: function() {
        ipcRenderer.send("close-application")
    },
    minCurrentApp: function() {
        ipcRenderer.send("minimize-application")
    },
    playCurrentApp: function() {
        ipcRenderer.send("close-application")
    },
    checkImage: function() {

    },
    openBrowser: function(url) {
        shell.openExternal(url);
    },
    requestStatusRefresh: function() {
        ipcRenderer.send("refresh-status")
    }
}

global.pirulenFont = new FontFace('EA Pirulen Rg DS', 'url("/test/pirulenrg.ttf")')
global.pirulenFont.load().then(function(loadedFont) {
    ipcRenderer.send("load-pirulen-font")
}).catch(function(error) {
    console.error(error)
});
