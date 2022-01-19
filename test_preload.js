const ipc = require('electron').ipcRenderer

global.Client = {
    closeCurrentApp: function() {
        ipc.send("close-application")
    },
    minCurrentApp: function() {

    },
    playCurrentApp: function() {
        ipc.send("close-application")
    },
    checkImage: function() {

    },
    openBrowser: function() {

    },
    requestStatusRefresh: function() {

    }
}