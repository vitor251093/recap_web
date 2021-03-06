// Modules to control application life and create native browser window
const electron = require('electron')
const {BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const electronApp = electron.app
electronApp.commandLine.appendSwitch("disable-http-cache")
electronApp.commandLine.appendSwitch("disable-site-isolation-trials")

const darksporeVersion = "5.3.0.127"
const theme = "darkui";

const appDir = path.dirname(require.main.filename);
const rootDir = url.pathToFileURL(appDir)

let mainWindow = null
let registrationWindow = null

function startWindow(file, {width, height, backgroundColor, title, frame}) {
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
            frame: frame,
            autoHideMenuBar: true,
            webPreferences: {
                webviewTag: false,
                devTools: true,
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                preload: path.join(__dirname, 'test', 'preload.js')
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
        {key:"host", value:"test/mock"},
        {key:"isDev", value:"true"}
    ]
    variables.forEach(v => newStrObj.str = newStrObj.str.split("{{" + v.key + "}}").join(v.value))
    return newStrObj.str
}
function redirectRequestsToRunLocally(win) {
    win.webContents.session.webRequest.onBeforeRequest({urls:[
        "file:///bootstrap/launcher/notes",
        "file:///ingame/*",
        "file:///test/*",
        "file:///*.js",
        "https://test/mock/*",
        "http://test/mock/*"
    ]}, (details, callback) => {
        let fileUrl = details.url
        if (fileUrl === "file:///bootstrap/launcher/notes") {
            fileUrl = rootDir + fileUrl.substring("file://".length) + ".html"
        }
        if (fileUrl.startsWith("file:///ingame/")) {
            fileUrl = rootDir + fileUrl.substring("file://".length)
        }
        if (fileUrl.startsWith("file:///test/")) {
            fileUrl = rootDir + fileUrl.substring("file://".length)
        }
        if (fileUrl.startsWith("https://test/")) {
            fileUrl = rootDir + fileUrl.substring("https:/".length)
            let method = url.parse(fileUrl, true).query["method"];
            if (method) {
                fileUrl = fileUrl.split("?").shift() + "/" + method
            }
        }
        if (fileUrl.startsWith("http://test/")) {
            fileUrl = rootDir + fileUrl.substring("http:/".length)
            let method = url.parse(fileUrl, true).query["method"];
            if (method) {
                fileUrl = fileUrl.split("?").shift() + "/" + method
            }
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
}

function startGameLauncherWindow(title) {
    var win = startWindow(`bootstrap/launcher/${theme}/index.html`, {
        width: 800, height: 600, backgroundColor:"#FFF", title: title, frame: false
    })
    redirectRequestsToRunLocally(win)
    return win
}

function startRegistrationWindow(title) {
    var win = startWindow(`ingame/register.html`, {
        width: 800, height: 600, backgroundColor:"#FFF", title: title, frame: true
    })
    redirectRequestsToRunLocally(win)
    return win
}

let refreshMainWindowStatus = () => {
    mainWindow.webContents.executeJavaScript("setPatcherStatus(true); setServerStatus(true, false, 0);");
}

ipcMain.on('main-window-load-pirulen-font', (event) => {
    mainWindow.webContents.executeJavaScript("document.fonts.add(global.pirulenFont)");
    mainWindow.webContents.executeJavaScript("document.getElementById('Patch_Content_Frame').contentWindow.document.fonts.add(global.pirulenFont)");
})
ipcMain.on('main-window-refresh-status', (event) => {
    refreshMainWindowStatus()
})
ipcMain.on('main-window-minimize-application', (event) => {
    mainWindow.minimize()
})
ipcMain.on('close-application', (event) => {
    electronApp.quit()
})

electronApp.on('ready', function() {
    mainWindow = startGameLauncherWindow("Darkspore - Launcher")
    mainWindow.webContents.on('did-finish-load', refreshMainWindowStatus);

    registrationWindow = startRegistrationWindow("Darkspore - Registration window")
})

electronApp.on('window-all-closed', function () {
    electronApp.quit()
})
