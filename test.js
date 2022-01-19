// Modules to control application life and create native browser window
const electron = require('electron')
const {BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const electronApp = electron.app
electronApp.commandLine.appendSwitch("disable-http-cache")

const darksporeVersion = "5.3.0.127"
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
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                preload: path.join(__dirname, 'test_preload.js')
            }
        })
    win.loadFile(file, {query:{version:darksporeVersion}})
    return win
}

function replaceVariablesInString(str) {
    let newStrObj = {str}
    const variables = [
        {key:"recap-version", value:"0.0.1"},
        {key:"game-mode", value:"Singleplayer"},
        {key:"host", value:"localhost"},
        {key:"isDev", value:"true"}
    ]
    variables.forEach(v => newStrObj.str = newStrObj.str.split("{{" + v.key + "}}").join(v.value))
    return newStrObj.str
}

function startGameLauncherWindow(title) {
    var win = startWindow(`bootstrap/launcher/${theme}/index.html`, {
        width: 800, height: 600, backgroundColor:"#FFF", title: title
    })
    win.webContents.session.webRequest.onBeforeRequest({urls:[
        "file:///bootstrap/launcher/notes",
        "file:///ingame/*",
        "file:///*.js",
        "https://localhost/*",
        "http://localhost/*"
    ]}, (details, callback) => {
        let fileUrl = details.url
        if (fileUrl === "file:///bootstrap/launcher/notes") {
            fileUrl = rootDir + fileUrl.substring("file://".length) + ".html"
        }
        if (fileUrl.startsWith("file:///ingame/")) {
            fileUrl = rootDir + fileUrl.substring("file://".length)
        }

        if (fileUrl.startsWith("file://") && fileUrl.endsWith(".html")) {
            let filePath = url.fileURLToPath(fileUrl)
            let fileContents = fs.readFileSync(filePath, {encoding:"utf8"})
            return callback({redirectURL: "data:text/html," + encodeURIComponent(replaceVariablesInString(fileContents))});
        }
        else if (fileUrl.startsWith("file://") && fileUrl.endsWith(".js")) {
            let filePath = url.fileURLToPath(fileUrl)
            let fileContents = fs.readFileSync(filePath, {encoding:"utf8"})
            return callback({redirectURL: "data:text/javascript," + encodeURIComponent(replaceVariablesInString(fileContents))});
        }
        else {
            return callback({redirectURL: fileUrl});
        }
    });
    return win
}

ipcMain.on('close-application', (event) => {
    electronApp.quit()
})

electronApp.on('ready', function() {
    let mainWindow = startGameLauncherWindow(electronApp.name)
    mainWindow.webContents.on('did-finish-load', function() {
        setTimeout(() => {
            mainWindow.webContents.executeJavaScript("setPatcherStatus(true); setServerStatus(true, false, 0);");
        }, 1000)
    });
})

electronApp.on('window-all-closed', function () {
    electronApp.quit()
})
