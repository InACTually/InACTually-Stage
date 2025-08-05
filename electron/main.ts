
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright (c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright (c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2024

	contributors:
	Fabian Töpfer - baniaf@uber.space
*/

import * as os from 'os'
import { app, BrowserWindow, session } from 'electron'
import express, { static as serveStatic } from 'express'
import * as path from 'path'
import singleInstance from './singleInstance'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
const isProduction = process.env.NODE_ENV !== 'development'
const platform = process.platform
const arch = os.arch() === 'x64' ? '64' : '32'


function createWindow() {
	console.log('System info', { isProduction, platform, arch })

	const mainWindow = new BrowserWindow({
		width: 1440,
		height: 1024,
		minWidth: 1024,
		minHeight: 676,
		backgroundColor: '#2a2a2a',
		autoHideMenuBar: true,
		webPreferences: {
			devTools: !isProduction,
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	if (singleInstance(app, mainWindow)) return

	!isProduction && mainWindow.webContents.openDevTools({
		mode: 'right'
	})

	return mainWindow
}


app.whenReady().then(async () => {

	const mainWindow = createWindow()
	if (!mainWindow) { console.log("[ELECTRON] couldn't create window"); return; }

	if (!isProduction) {
		mainWindow.loadURL('http://localhost:3000/')
	}
	else {
		// mainWindow.loadFile('./.output/public/index.html')
		const app = express()
		app.use('/', serveStatic(path.join(__dirname, '../public')))
		const listener = app.listen(8079, 'localhost', () => {
			const port = (listener.address() as any).port
			mainWindow.loadURL(`http://localhost:${port}`)
		})
	}

	app.on('activate', function () { if (BrowserWindow.getAllWindows().length === 0) createWindow() })

	app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })


})
