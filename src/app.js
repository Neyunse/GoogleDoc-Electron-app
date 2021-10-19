"use strict";

/* eslint-disable no-console */

const { app, BrowserWindow } = require("electron");
const DiscordRPC = require("discord-rpc");
const clientId = "899850654472867840";
const rpc = new DiscordRPC.Client({ transport: "ipc" });
DiscordRPC.register(clientId);
const startTimestamp = new Date();
let mainWindow;

async function setActivity() {
  if (!rpc || !mainWindow) {
    return;
  }

  mainWindow.webContents.on("did-finish-load",()=>{

    rpc.setActivity({
      details: mainWindow.webContents.getTitle(),
      state: "Writing...",
      startTimestamp,
      largeImageKey: "googledoc_large",
      smallImageKey: "googledoc_small",
      instance: false,
    });
    rpc.on("ready", () => {
      console.log("Discord RPC: Ready");
      setInterval (async () => {
        rpc.setActivity({
          details: mainWindow.webContents.getTitle(),
          state: "Writing...",
          startTimestamp,
          largeImageKey: "googledoc_large",
          smallImageKey: "googledoc_small",
          instance: false,
        });
        clearInterval()
      }, 10e3)
    });
  })

  rpc.on("connected", () => {
    console.log("connected");
  })
  rpc.on("disconnected", () => {
    console.log("disconnected");
  })
}
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 750,
    minHeight: 750,
    minWidth: 1280,
    title: "Google Docs",
    icon: "./icon.png",
    maximizable: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.setMenu(null);

  mainWindow.loadURL(
    "https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fdocs.google.com%2F%3Fhl%3Des&followup=https%3A%2F%2Fdocs.google.com%2F%3Fhl%3Des&hl=es&emr=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin"
  );
  mainWindow.webContents.on("dom-ready", async () => {
    await setActivity();
  })
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", () => {
  rpc.login({ clientId }).catch(console.error);
  createWindow();
});

app.on("window-all-closed", () => {
  rpc.destroy();
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
