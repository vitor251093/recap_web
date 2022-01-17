// Modules to control application life and create native browser window
const electron = require('electron')
const {BrowserWindow, protocol} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const electronApp = electron.app
electronApp.commandLine.appendSwitch("disable-http-cache")

const theme = "darkui";

const appDir = path.dirname(require.main.filename);
const rootDir = url.pathToFileURL(appDir)

function startWindow(file, {width, height, backgroundColor, title}) {
    let win = new BrowserWindow({
            width: width,
            height: height,
            minWidth: width,
            minHeight: height,
            maxWidth: width,
            maxHeight: height,
            backgroundColor: backgroundColor,
            title: title,
            maximizable: false,
            closable: true,
            fullscreenable: false,
            show: true, 
            autoHideMenuBar: true,
            webPreferences: {
                webviewTag: false,
                devTools: true,
                nodeIntegration: false,
                contextIsolation: false,
                enableRemoteModule: true
            }
        })
    win.loadFile(file)
    return win
}

function startGameLauncherWindow(title) {
    var win = startWindow(`bootstrap/launcher/${theme}/index.html`, {
        width: 800, height: 600, backgroundColor:"#FFF", title: title
    })
    win.webContents.session.webRequest.onBeforeRequest({urls:[
        "file:///bootstrap/launcher/notes",
        "file:///ingame/*"
    ]}, (details, callback) => {
        if (details.url === "file:///bootstrap/launcher/notes") {
            return callback({redirectURL: rootDir + details.url.substring("file://".length) + ".html"});
        }
        if (details.url.startsWith("file:///ingame/")) {
            return callback({redirectURL: rootDir + details.url.substring("file://".length)});
        }
    });
    return win
}

electronApp.on('ready', function() {
    startGameLauncherWindow(electronApp.name)
})

electronApp.on('window-all-closed', function () {
    electronApp.quit()
})
