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