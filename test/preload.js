const {ipcRenderer, shell} = require('electron')

global.Client = {
    closeWindow: function() {
        ipcRenderer.send("close-application")
    },
    closeCurrentApp: function() {
        ipcRenderer.send("close-application")
    },
    minCurrentApp: function() {
        ipcRenderer.send("main-window-minimize-application")
    },
    playCurrentApp: function() {
        ipcRenderer.send("close-application")
    },
    checkImage: function() {

    },
    openBrowser: function(url) {
        shell.openExternal(url);
    },
    openExternalBrowser: function(url) {
        shell.openExternal(url);
    },
    requestStatusRefresh: function() {
        ipcRenderer.send("main-window-refresh-status")
    }
}

global.pirulenFont = new FontFace('EA Pirulen Rg DS', 'url("/test/pirulenrg.ttf")')
global.pirulenFont.load().then(function(loadedFont) {
    ipcRenderer.send("main-window-load-pirulen-font")
}).catch(function(error) {
    console.error(error)
});
