"use strict";

/* eslint-disable no-console */

const { app, BrowserWindow } = require("electron");
const DiscordRPC = require("discord-rpc");
const clientId = "899850654472867840";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 750,
    minHeight: 750,
    minWidth: 1280,
    maximizable: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(
    "https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fdocs.google.com%2F%3Fhl%3Des&followup=https%3A%2F%2Fdocs.google.com%2F%3Fhl%3Des&hl=es&emr=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin"
  );
  mainWindow.setMenu(null);

  mainWindow.webContents.on("did-finish-load", async () => {
    // Only needed if you want to use spectate, join, or ask to join
    DiscordRPC.register(clientId);

    const rpc = new DiscordRPC.Client({ transport: "ipc" });
    const startTimestamp = new Date();
    const title = await mainWindow.webContents.getTitle();
    rpc.on("ready", () => {
      rpc.setActivity({
        details: `${title}`,
        state: "Writing...",
        startTimestamp,
        largeImageKey: "googledoc_large",
        smallImageKey: "googledoc_small",
        instance: false,
      });

      // activity can only be set every 15 seconds
      setInterval(() => {
        rpc.setActivity({
          details: `${title}`,
          state: "Writing...",
          startTimestamp,
          largeImageKey: "googledoc_large",
          smallImageKey: "googledoc_small",
          instance: false,
        });
      }, 12000);
    });

    rpc.login({ clientId }).catch(console.error);

    
  });

  



  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

