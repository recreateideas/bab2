// Modules to control application life and create native browser window
require('dotenv').config({path:'./.env'});                                                             // <---------------------  0

// process.env['APP_PATH'] = app.getAppPath();


const { app, BrowserWindow, Menu, MenuItem, remote } = require('electron'),
  path = require('path');

/************* Show/Hide the DevTools **************** */                                                           // <---------------------  1
const  { default: installExtension, REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
/**************************************************** */
require('electron-reload')('.');                                                                                    // <---------------------  2


require('electron-context-menu')({
  labels: {
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    copyImageAddress: 'Copy Image Address',
    inspect: 'Inspect Element'
  },
});

const template = [{
  label: "Application",
  submenu: [
      { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
      { type: "separator" },
      { label: "Quit", accelerator: "Command+Q", click: function () { app.quit(); } }
  ]
}, {
  label: "Edit",
  submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
  ]
}
];


// Menu = require('electron').Menu;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }
})

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1311, height: 800, autoHideMenuBar: true,
    useContentSize: true,
    resizable: false,
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./public/index.html')
  mainWindow.webContents.session.clearCache(function() {
  });

  /************* Show/Hide the DevTools **************** */       // <---------------------  3
  mainWindow.webContents.openDevTools()
  addReactReduxDevTools();                                       // <---------------------  4
  /************************************************* */

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    hiddenWindow = null;
    app.quit()
  })

    /************* Show/ Hide server window **************** */  
    // hiddenWindow = new BrowserWindow( {show: false})                  // <---------------------  5
  hiddenWindow = new BrowserWindow()
  hiddenWindow.webContents.openDevTools()
    /************************************************* */ 
    console.log(__dirname);
  hiddenWindow.loadURL(path.join('file://', __dirname, '/src/server/electron_server.html'))                // <---------------------  6
  // hiddenWindow.loadURL(path.join('file://', __dirname, '/public/electron_server.html'))


}
/************* Show/Hide REDUX Devtools  **************** */              // <---------------------  7
function addReactReduxDevTools() {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
  installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
}
/************************************ */

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
