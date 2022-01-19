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

const new_font = new FontFace('EA Pirulen Rg DS', 'url("/test/pirulenrg.ttf")')
new_font.load().then(function(loadedFont) {
    document.fonts.add(loadedFont);
}).catch(function(error) {
    console.error(error)
});
