
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright(c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright(c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2023-2024

	contributors:
	Lars Engeln - mail@lars-engeln.de
	Fabian Töpfer - baniaf@uber.space
*/

export default class NetworkManager {

	connection = {} as WebSocket;
	private static instance: NetworkManager;

	public isReady = ref(false);

	public static getInstance(): NetworkManager {
		if (!NetworkManager.instance) {
			NetworkManager.instance = new NetworkManager();
		}

		return NetworkManager.instance;
	}


	public async connect(port: number, onOpen: { (): void }, onMsg: { (event: any): void }, onError: { (err: any): void }, onClose: { (): void }) {
		return new Promise<WebSocket>((resolve, reject) => {
			this.connection = new WebSocket("wss://" + window.location.hostname + ":" + port + "/");
			// this.connection = new WebSocket("wss://192.168.0.42:" + port + "/");
			//this.connection = new WebSocket("wss://192.168.137.78:" + port + "/");
			this.connection.onopen = () => {
				onOpen();
				this.isReady.value = true;
				resolve(this.connection);
			}

			this.connection.onmessage = (event) => {
				onMsg(event);
			};

			this.connection.onerror = (err) => {
				onError(err);
				reject();
			}

			this.connection.onclose = () => {
				onClose();
				reject();
			}
		})

	}

	public sendJson(json: any) {
		if (!this.isConnected())
			return;

		json.timestamp = Date.now();

		let msg = JSON.stringify(json);

		this.connection.send(msg);
	}

	public isConnected() {
		return this.connection.readyState == 1;
	}

	public isReadyCallback: { (isReady: boolean): void } = (isReady) => { };
}

