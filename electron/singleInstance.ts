
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

import { App, BrowserWindow } from 'electron'

export default (app: App, win: BrowserWindow) => {
	const gotTheLock = app.requestSingleInstanceLock()

	if (!gotTheLock) {
		app.quit()
		return true
	}

	app.on('second-instance', (_, _argv) => {
		if (win) {
			win.show()
			if (win.isMinimized()) win.restore()
			win.focus()
		}
	})

	app.on('open-url', function (event, url) {
		event.preventDefault()
		win.webContents.send('deeplink', url)
	})
}
