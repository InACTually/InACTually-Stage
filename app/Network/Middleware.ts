
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright(c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright(c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2023-2025

	contributors:
	Lars Engeln - mail@lars-engeln.de
	Fabian Töpfer - baniaf@uber.space
*/

import type RoomManager from "../RoomManager";
import { RoomNodeType, toRoomNodeType } from "../RoomNodes/RoomNodeRegistry";
import type IInteractionPublisher from "./IInteractionPublisher";
import type IRoomNodePublisher from "./IRoomNodePublisher";
import NetworkManager from "./NetworkManager";
import Message, { MsgMethod, MsgType } from "./Message";

export default class Middleware implements IRoomNodePublisher, IInteractionPublisher {

	public isOffline = ref<boolean>(true);
	private m_networkManager = new NetworkManager;
	private m_roomManager = {} as RoomManager;

	private m_sessionUID = this.createUID();
	private m_warmedUp = false;

	private m_subscriptions = {} as Map<string, Map<string, Array<{ handle: string, cb: { (msg: any): void } }>>>;

	private m_ownRequests = {} as Map<string, boolean>;
	private m_waitingForResponse = {} as Map<string, { (msg: any): void }>;
	private m_requestsWithoutResponse = [] as string[];

	private m_onMessageCallbacks = [] as { (message: any): void }[];

	public log = reactive<{ in: any[], out: any[] }>({ in: [], out: [] });

	constructor() {
		this.m_subscriptions = new Map<string, Map<string, Array<{ handle: string, cb: { (msg: any): void } }>>>();
		this.m_ownRequests = new Map<string, boolean>();
		this.m_waitingForResponse = new Map<string, { (msg: any): void }>();
		this.m_onMessageCallbacks = [] as { (message: any): void }[];
	}

	public setup(roomManager: RoomManager) {
		this.m_roomManager = roomManager;
	}

	public connect(port: number) {
		this.m_networkManager.connect(port, this.onOpen.bind(this), this.onMsg.bind(this), this.onError.bind(this), this.onClose.bind(this));
	}

	protected onOpen() {
		console.log("[Middleware] backend connected");
		this.isOffline.value = false;
	}

	public onMsg(event: any) {
		this.m_onMessageCallbacks.forEach((callback: { (message: any): void }) => {
			callback(event.data);
		});



		let msg = new Message();
		let json = JSON.parse(event.data);
		msg.fromJson(json);

		if (!msg.getUID()) {
			console.warn("Message received without msg uid", msg);
			return;
		}

		this.writeLog(msg.fromMsgType(msg.getType()) + " " + msg.fromMsgMethod(msg.getMethod()), msg, true);

		let isOwnRequest = this.m_ownRequests.get(msg.getUID());

		if (isOwnRequest) {
			this.m_ownRequests.delete(msg.getUID());

			let cb = this.m_waitingForResponse.get(msg.getUID());

			if (cb) {
				//message is just response to formerly send request
				cb(msg.getData())
				this.m_waitingForResponse.delete(msg.getUID());
			}

			return;
		}

		//message contains new information and needs to be managed here 
		//this does not need new responses  
		this.m_requestsWithoutResponse.push(msg.getUID());


		//checks if error state
		let errored = false;

		switch (msg.getMethod()) {
			case MsgMethod.MM_ERROR:
				this.onErrorMsg("onMsg - Engine at " + json.where + "(" + msg.getType() + ")", json.what);
				errored = true;
				break;
			case MsgMethod.MM_WARNING:
				this.onErrorMsg("onMsg - Engine at " + json.where + "(" + msg.getType() + ")", json.what, true);
				errored = true;
				break;
			/*case MsgMethod.MM_INFO:
				console.info("Server - " + msg.getType() + "]:", json.info);
				errored = true;
				break;*/
			case MsgMethod.MM_UNKNOWN: // if we check for errors here, why not directly checking if it unknown
				this.onErrorMsg("onMsg", "unknown msgMethod");
				errored = true;
				break;
		}

		if (errored)
			return;

		switch (msg.getType()) {
			case MsgType.MT_ROOMNODE:
				this.onRoomNodeMsg(msg);
				break;
			case MsgType.MT_PROCNODE:
				this.onProcNodeMsg(msg);
				break;
			case MsgType.MT_INTERACTION:
				this.onInteractionMsg(msg);
				break;
			case MsgType.MT_APP:
				this.onAppMsg(msg);
				break;
			case MsgType.MT_ASSET:
				this.onAssetMsg(msg);
				break;
			case MsgType.MT_DESCRIPTION:
				this.onDescriptionMsg(msg);
				break;
			default:
				this.onErrorMsg("onMsg", "unknown msgType")
		}
	}

	protected onRoomNodeMsg(msg: Message) {
		let data = msg.getData();

		switch (msg.getMethod()) {
			case MsgMethod.MM_CREATE: {
				let roomNodeType = toRoomNodeType(data.name);
				this.m_roomManager.createRoomNodeByType(
					roomNodeType,
					data.uid,
					data.position,
					data.orientation,
					data.params
				);
				break;
			}
			case MsgMethod.MM_UPDATE: {
				this.m_roomManager.updateRoomNodeByUID(
					data.uid,
					data,
					false
				);
				break;
			}
			case MsgMethod.MM_DELETE: {
				let roomNodeType = toRoomNodeType(data.name);
				this.m_roomManager.deleteRoomNodeByUID(
					roomNodeType,
					data.uid,
					false
				);
				break;
			}

		}
	}

	protected onProcNodeMsg(msg: Message) {
		switch (msg.getMethod()) {
			case MsgMethod.MM_SUBSCRIBE:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			case MsgMethod.MM_UNSUBSCRIBE:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			case MsgMethod.MM_CREATE:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			case MsgMethod.MM_DELETE:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			case MsgMethod.MM_CONNECT:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			case MsgMethod.MM_DISCONNECT:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			case MsgMethod.MM_REQUEST:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			case MsgMethod.MM_UPDATE:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			case MsgMethod.MM_REMOTEPROCEDURECALL:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			default:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported");
		}
	}

	protected onInteractionMsg(msg: Message) {
		switch (msg.getMethod()) {
			case MsgMethod.MM_CREATE:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			case MsgMethod.MM_UPDATE:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			case MsgMethod.MM_DELETE:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			default:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported");
		}
	}

	protected onAppMsg(msg: Message) {
		switch (msg.getMethod()) {
			case MsgMethod.MM_UPDATE:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			case MsgMethod.MM_REMOTEPROCEDURECALL:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			default:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported");
		}
	}

	protected onAssetMsg(msg: Message) {
		switch (msg.getMethod()) {
			case MsgMethod.MM_UPLOAD:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported, yet");
				break;

			default:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported");
		}
	}

	protected onDescriptionMsg(msg: Message) {
		if (msg.getMethod() !== MsgMethod.MM_UPDATE) {
			this.onErrorMsg("onDescriptionMsg", "msgMethod was not update?!");
			return;
		}

		if (this.checkEmpty(msg.getData().name, "description", "data.name")) {
			return;
		}

		switch (msg.getData().name) {
			case "full":
				this.m_roomManager.fromJson(msg.getData().roomDescription);
				this.onFullDescriptionCallback(msg.getData());
				break;

			case "room":
				if (this.checkEmpty(msg.getData().roomDescription, "description", "data.roomDescription"))
					return;
				this.m_roomManager.fromJson(msg.getData().roomDescription);
				break;

			case "proc":
				if (this.checkEmpty(msg.getData().procDescription, "description", "data.procDescription"))
					return;
				msg.getData().procDescription; // do something
				break;

			case "procNodeTypes":
				if (this.checkEmpty(msg.getData().procNodeTypes, "description", "data.procNodeTypes"))
					return;
				msg.getData().procNodeTypes; // do something
				break;

			default:
				console.debug("[Middleware] " + msg.fromMsgMethod(msg.getMethod()) + " on " + msg.fromMsgType(msg.getType()) + " is not supported");
		}

		this.m_warmedUp = true;
	}

	protected checkEmpty(value: any, where: string, what: string): boolean {
		if (value === undefined) {
			this.onErrorMsg(where, what + " was empty.");
			return true;
		}
		return false;
	}

	protected onErrorMsg(where: string, what: string, isWarning = false) {
		if (isWarning)
			console.warn("[Middleware] " + where + ":", what);
		else
			console.error("[Middleware] " + where + ":", what);
	}

	protected onError(err: any) {
		console.error("[Middleware] error", err);
		this.loadTestData();
	}

	protected onClose() {
		this.isOffline.value = true;
		console.log("[Middleware] socket closed")
	}

	protected loadTestData() {
		console.log("[Middleware] trying to load test data");
		this.onMsg({ data: JSON.stringify(this.testRoomData) });
		this.onMsg({ data: JSON.stringify(this.testBodyCreateData) });
		this.onMsg({ data: JSON.stringify(this.testBodyPoseData) });
	}

	protected sendMsg(msg: Message) {
		if (!this.m_warmedUp)
			return;

		this.m_ownRequests.set(msg.getUID(), true);
		this.m_networkManager.sendJson(msg.toJson());
		this.writeLog(msg.getType() + " " + msg.getMethod(), msg, false);
	}

	public writeLog(title: string, payload: any, isInput: boolean) {
		let date = new Date();
		if (isInput) {
			this.log.in.push({ title: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ": " + title, payload: payload })
			if (this.log.in.length > 50) {
				this.log.in.shift();
			}
		} else {
			this.log.out.push({ title: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ": " + title, payload: payload })
			if (this.log.out.length > 50) {
				this.log.out.shift();
			}
		}
	}

	// ###

	public async createRoomNode(data: any, cb: { (msg: any): void }) {
		let msg = new Message(this.createUID(), MsgType.MT_ROOMNODE, MsgMethod.MM_CREATE);
		msg.setData(data);

		this.m_waitingForResponse.set(msg.getUID(), cb);

		if (!this.m_networkManager.isConnected()) {
			this.onMsg({ data: JSON.stringify(msg.toJson()) });
		}
		this.sendMsg(msg);
	}

	public async updateRoomNode(data: any, cb: { (msg: any): void }) {
		let msg = new Message(this.createUID(), MsgType.MT_ROOMNODE, MsgMethod.MM_UPDATE);
		msg.setData(data);

		this.m_waitingForResponse.set(msg.getUID(), cb);

		if (!this.m_networkManager.isConnected()) {
			this.onMsg({ data: JSON.stringify(msg.toJson()) });
		}

		//console.log(msg);
		this.sendMsg(msg);
	}

	public async deleteRoomNode(data: any, cb: { (msg: any): void }) {
		let msg = new Message(this.createUID(), MsgType.MT_ROOMNODE, MsgMethod.MM_DELETE);
		msg.setData(data);

		this.m_waitingForResponse.set(msg.getUID(), cb);

		if (!this.m_networkManager.isConnected()) {
			this.onMsg({ data: JSON.stringify(msg.toJson()) });
		}
		this.sendMsg(msg);
	}

	// ###

	// public deleteProcNode(uid: string) {
	//     if (uid !== "") {
	//         let msg = {
	//             "msgType": "deleteProcNode",
	//             "uid": uid
	//         }
	//         this.m_networkManager.sendJson(msg);
	//         this.writeLog("deleteProcNode", msg, false);

	//     }
	// }
	// public async createProcNode(nodeName: string, cb: { (uid: string): void }) {
	//     let msgID = this.createUID();
	//     let msg = {
	//         "msgType": "createProcNode",
	//         "msgID": msgID,
	//         "nodeName": nodeName
	//     };
	//     this.m_waitingForResponse.set(msgID, cb);
	//     this.m_networkManager.sendJson(msg);
	//     this.writeLog("createProcNode", msg, false);

	// }

	// public async connectProcNodes(fromUID: string, outputName: string, toUID: string, inputName: string) {
	//     let msg = {
	//         "msgType": "connectProcNodes",
	//         "fromUID": fromUID,
	//         "toUID": toUID,
	//         "outputName": outputName,
	//         "inputName": inputName
	//     };
	//     this.m_networkManager.sendJson(msg);
	//     this.writeLog("connectProcNodes", msg, false);

	// }
	// public async disconnectProcNodes(fromUID: string, outputName: string, toUID: string, inputName: string) {
	//     let msg = {
	//         "msgType": "disconnectProcNodes",
	//         "fromUID": fromUID,
	//         "toUID": toUID,
	//         "outputName": outputName,
	//         "inputName": inputName
	//     };
	//     this.m_networkManager.sendJson(msg);
	//     this.writeLog("disconnectProcNodes", msg, false);

	// }

	// public async getParameterOfProcNode(uid: string, cb: { (params: {}): void }) {
	//     let msgID = this.createUID();
	//     let msg = {
	//         "msgType": "getParameterOfProcNode",
	//         "msgID": msgID,
	//         "uid": uid
	//     };
	//     this.m_waitingForResponse.set(msgID, cb);
	//     this.m_networkManager.sendJson(msg);
	//     this.writeLog("getParameterOfProcNode", msg, false);

	// }

	// public async setParameterOfProcNode(uid: string, params: {}) {
	//     let msg = {
	//         "msgType": "setParameterOfProcNode",
	//         "uid": uid,
	//         "params": params
	//     };
	//     this.m_networkManager.sendJson(msg);
	//     this.writeLog("setParameterOfProcNode", msg, false);

	// }

	// public subscribeToProcNode(uid: string, valueName: string, onValue: (msg: any) => void): string {
	//     let msg = {
	//         "msgType": "subscribeToProcNode",
	//         "uid": uid,
	//         "valueName": valueName
	//     }
	//     if (!this.m_subscriptions.has(uid))
	//         this.m_subscriptions.set(uid, new Map<string, Array<{ handle: string, cb: { (msg: any): void } }>>());
	//     if (!this.m_subscriptions.get(uid)?.has(valueName))
	//         this.m_subscriptions.get(uid)?.set(valueName, new Array<{ handle: string, cb: { (msg: any): void } }>());

	//     let handle = this.createUID();

	//     this.m_subscriptions.get(uid)?.get(valueName)?.push({ handle: handle, cb: onValue });
	//     this.m_networkManager.sendJson(msg);

	//     return handle;
	// }

	// public unsubscribeFromProcNode(handle: string) {
	//     let uid = "";
	//     let name = "";
	//     this.m_subscriptions.forEach((nodeEntry, nodeUID) => {
	//         nodeEntry.forEach((valueEntry, valueName) => {
	//             let index = valueEntry.findIndex((val) => { return val.handle === handle; });
	//             if (index >= 0) {
	//                 valueEntry.splice(index, 1);
	//                 if (valueEntry.length === 0) {
	//                     uid = nodeUID;
	//                     name = valueName;
	//                 }

	//             }
	//         });
	//     });

	//     if (uid !== "") {
	//         let msg = {
	//             "msgType": "unsubscribeFromProcNode",
	//             "uid": uid,
	//             "valueName": name
	//         }
	//         this.m_networkManager.sendJson(msg);
	//     }
	// }

	// public remoteProcedureCall(uid: string, functionName: string, cb: { (data: {}): void }) {
	//     let msgID = this.createUID();
	//     let msg = {
	//         "msgType": "rpc",
	//         "msgID": msgID,
	//         "uid": uid,
	//         "functionName": functionName
	//     }
	//     this.m_waitingForResponse.set(msgID, cb);
	//     this.m_networkManager.sendJson(msg);
	// }

	/**
	 * Sends a request to the C++ backend to get all the different NodeTypes
	 * @param cb Callback function, which will be called, when the C++ backend sends a response
	 */

	// ###

	protected requestDescription(name: string, cb: { (data: {}): void }) {
		let msg = new Message(this.createUID(), MsgType.MT_DESCRIPTION, MsgMethod.MM_REQUEST);
		let data = {
			"name": name
		}
		msg.setData(data);

		this.m_waitingForResponse.set(msg.getUID(), cb);

		if (!this.m_networkManager.isConnected()) {
			this.onMsg({ data: JSON.stringify(msg.toJson()) });
		}
		this.sendMsg(msg);
	}

	public requestProcNodeTypes(cb: { (data: {}): void }) {
		this.requestDescription("procNodeTypes", cb);
	}

	public requestFullDescription(cb: { (data: {}): void }) {
		this.requestDescription("full", cb);
	}

	public requestRoomDescription(cb: { (data: {}): void }) {
		this.requestDescription("room", cb);
	}

	public requestProcDescription(cb: { (data: {}): void }) {
		this.requestDescription("proc", cb);
	}

	public onFullDescriptionCallback = (data: any): void => { };

	// ###

	public createUID() {
		let str = Date.now().toString();
		let half = Math.round(str.length * 0.5);
		let part1 = str.substring(0, half);
		let part2 = str.substring(half);
		let salt = (Math.round(Math.random() * 3839) + 256);
		let uid = "" + parseInt(part1).toString(16) + "-" + parseInt(part2).toString(16) + salt.toString(16);
		return uid;
	}

	private testRoomData = {
		"data": {
			"name": "full",
			"procDescription": {
				"containers": [{
					"level": 0, "name": "Root", "params": {
						"containers": [], "links": [],
						"nodes": []
					}
				}]
			},
			"roomDescription": {
				"actionspaceManager": { "nodes": [] },
				"audioManager": { "mixer": { "type": 0 }, "speakers": [], "subwoofers": [] },
				"bodyTrackingManager": { "name": "bodyTrackingManager" },
				"cameraManager": { "availableDevices": [{ "deviceName": "Surface Camera Front" }, { "deviceName": "Azure Kinect 4K Camera" }, { "deviceName": "OBS Virtual Camera" }], "nodes": [] },
				"computerManager": { "nodes": [] }, "displayManager": { "nodes": [] },
				"dmxManager": {
					"availableDevices": [{ "deviceName": "Pico Beam 60" }, { "deviceName": "Shark Zoom Wash One" }, { "deviceName": "Robe 150" }, { "deviceName": "Wash TMH-46" }, { "deviceName": "Pico Spot 45" }, { "deviceName": "LED Bar 18" }, { "deviceName": "Dimmer" }],
					"nodes": [{ "caption": "kleine", "isFixed": false, "isLookingAt": true, "isSmoothing": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "markerID": -1, "name": "movinghead", "orientation": { "w": -0.6963642239570618, "x": -0.12278788536787033, "y": -0.6963642239570618, "z": 0.12278788536787033 }, "params": { "color": { "b": 0.0, "g": 0.0, "r": 1.0 }, "dimmer": 0.023000000044703484, "dimmerMul": 1.0, "fixtureName": "Wash TMH-46", "isPanFlipped": false, "isTiltFlipped": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "pan": 251.17942810058594, "speed": 0.041999999433755875, "startAddress": 360, "strobe": 0.0, "tilt": 220.0, "uv": 0.0, "zoom": 0.0 }, "position": { "x": 0.30000001192092896, "y": 3.0, "z": 5.5 }, "radius": 0.5, "uid": "2a2ea-504c11cb1" }, { "caption": "andere", "isFixed": false, "isLookingAt": true, "isSmoothing": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "markerID": -1, "name": "movinghead", "orientation": { "w": -3.090862321641907e-08, "x": -0.7071068286895752, "y": -3.090862321641907e-08, "z": 0.7071068286895752 }, "params": { "color": { "b": 0.0, "g": 0.0, "r": 1.0 }, "dimmer": 1.0, "dimmerMul": 1.0, "fixtureName": "Pico Spot 45", "gobo": 0, "goboShake": 0.0, "isPanFlipped": false, "isTiltFlipped": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "pan": 267.29248046875, "speed": 0.041999999433755875, "startAddress": 100, "strobe": 0.0, "tilt": 161.30050659179688, "uv": 0.0, "zoom": 0.0 }, "position": { "x": 8.300000190734863, "y": 3.0, "z": 6.400000095367432 }, "radius": 0.5, "uid": "2a499-91631a316" }, { "caption": "rohr", "isFixed": false, "isLookingAt": true, "isSmoothing": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "markerID": -1, "name": "movinghead", "orientation": { "w": -4.371138828673793e-08, "x": 1.0, "y": 0.0, "z": -0.0 }, "params": { "color": { "b": 1.0, "g": 1.0, "r": 1.0 }, "dimmer": 0.07000000029802322, "dimmerMul": 1.0, "fixtureName": "Shark Zoom Wash One", "isPanFlipped": true, "isTiltFlipped": true, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "pan": 239.59890747070313, "speed": 0.0, "startAddress": 400, "strobe": 0.0, "tilt": 142.138427734375, "uv": 0.0, "zoom": 0.0 }, "position": { "x": 4.199999809265137, "y": 3.0, "z": 9.0 }, "radius": 0.5, "uid": "2a499-9271a6808" }, { "caption": "riss", "isFixed": true, "isLookingAt": true, "isSmoothing": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "markerID": -1, "name": "movinghead", "orientation": { "w": -4.371138828673793e-08, "x": 1.0, "y": 0.0, "z": -0.0 }, "params": { "color": { "b": 1.0, "g": 1.0, "r": 1.0 }, "dimmer": 1.0, "dimmerMul": 1.0, "fixtureName": "Shark Zoom Wash One", "isPanFlipped": true, "isTiltFlipped": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "pan": 219.1699981689453, "speed": 0.041999999433755875, "startAddress": 420, "strobe": 0.0, "tilt": 151.01412963867188, "uv": 0.0, "zoom": 0.0 }, "position": { "x": 5.699999809265137, "y": 3.0, "z": 9.0 }, "radius": 0.5, "uid": "2a499-92aa77e57" }, { "caption": "movinghead", "isFixed": true, "isLookingAt": true, "isSmoothing": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "markerID": -1, "name": "movinghead", "orientation": { "w": -4.371138828673793e-08, "x": -0.0, "y": 0.0, "z": 1.0 }, "params": { "color": { "b": 0.0, "g": 0.0, "r": 1.0 }, "dimmer": 0.6100000143051147, "dimmerMul": 1.0, "fixtureName": "Shark Zoom Wash One", "isPanFlipped": true, "isTiltFlipped": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "pan": 302.23968505859375, "speed": 0.041999999433755875, "startAddress": 440, "strobe": 0.0, "tilt": 168.5517578125, "uv": 0.0, "zoom": 0.0 }, "position": { "x": 6.900000095367432, "y": 3.0, "z": 0.20000000298023224 }, "radius": 0.5, "uid": "2a6cc-7305dec20" }, { "caption": "movinghead", "isFixed": false, "isLookingAt": true, "isSmoothing": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "markerID": -1, "name": "movinghead", "orientation": { "w": -4.371138828673793e-08, "x": -0.0, "y": 0.0, "z": 1.0 }, "params": { "color": { "b": 0.6704132556915283, "g": 0.6704132556915283, "r": 0.9454545378684998 }, "dimmer": 0.20999999344348907, "dimmerMul": 1.0, "fixtureName": "Pico Beam 60", "isPanFlipped": false, "isTiltFlipped": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "pan": 308.150634765625, "speed": 0.041999999433755875, "startAddress": 220, "strobe": 0.0, "tilt": 159.93470764160156, "uv": 0.0, "zoom": 0.0 }, "position": { "x": 7.900000095367432, "y": 3.0, "z": 0.20000000298023224 }, "radius": 0.5, "uid": "2a6cc-7453566d1" }, { "caption": "movinghead", "isFixed": false, "isLookingAt": true, "isSmoothing": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "markerID": -1, "name": "movinghead", "orientation": { "w": 3.090862321641907e-08, "x": -0.7071068286895752, "y": -3.090862321641907e-08, "z": -0.7071068286895752 }, "params": { "color": { "b": 0.20606058835983276, "g": 0.4081542491912842, "r": 1.0 }, "dimmer": 0.9700000286102295, "dimmerMul": 1.0, "fixtureName": "Pico Spot 45", "gobo": 0, "goboShake": 0.0, "isPanFlipped": false, "isTiltFlipped": true, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "pan": 275.8499755859375, "speed": 0.041999999433755875, "startAddress": 120, "strobe": 0.0, "tilt": 140.24923706054688, "uv": 0.0, "zoom": 0.0 }, "position": { "x": 0.30000001192092896, "y": 3.0, "z": 6.400000095367432 }, "radius": 0.5, "uid": "2a6cc-75f58c3b5" }, { "caption": "movinghead", "isFixed": false, "isLookingAt": true, "isSmoothing": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "markerID": -1, "name": "movinghead", "orientation": { "w": -4.371138828673793e-08, "x": -0.0, "y": 0.0, "z": 1.0 }, "params": { "color": { "b": 0.0, "g": 0.0, "r": 1.0 }, "dimmer": 0.5699999928474426, "dimmerMul": 1.0, "fixtureName": "Shark Zoom Wash One", "isPanFlipped": true, "isTiltFlipped": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "pan": 256.7034912109375, "speed": 0.041999999433755875, "startAddress": 460, "strobe": 0.0, "tilt": 165.67572021484375, "uv": 0.0, "zoom": 0.05000000074505806 }, "position": { "x": 1.2999999523162842, "y": 3.0, "z": 0.20000000298023224 }, "radius": 0.5, "uid": "2a6cc-77681ff8f" }, { "caption": "movinghead", "isFixed": false, "isLookingAt": true, "isSmoothing": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "markerID": -1, "name": "movinghead", "orientation": { "w": -0.6644630432128906, "x": -0.2418447732925415, "y": 0.6644630432128906, "z": -0.2418447732925415 }, "params": { "color": { "b": 1.0, "g": 1.0, "r": 1.0 }, "dimmer": 0.28999999165534973, "dimmerMul": 1.0, "fixtureName": "Wash TMH-46", "isPanFlipped": false, "isTiltFlipped": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "pan": 280.71990966796875, "speed": 0.041999999433755875, "startAddress": 300, "strobe": 0.0, "tilt": 188.91830444335938, "uv": 0.0, "zoom": 0.0 }, "position": { "x": 8.300000190734863, "y": 3.0, "z": 5.5 }, "radius": 0.5, "uid": "2a6cc-9271cad65" }, { "caption": "movinghead", "isFixed": false, "isLookingAt": true, "isSmoothing": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "markerID": -1, "name": "movinghead", "orientation": { "w": -4.371138828673793e-08, "x": 1.0, "y": 0.0, "z": 0.0 }, "params": { "color": { "b": 1.0, "g": 1.0, "r": 1.0 }, "dimmer": 0.47999998927116394, "dimmerMul": 1.0, "fixtureName": "Pico Beam 60", "isPanFlipped": false, "isTiltFlipped": true, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "pan": 216.41598510742188, "speed": 0.041999999433755875, "startAddress": 200, "strobe": 0.0, "tilt": 142.73948669433594, "uv": 0.0, "zoom": 0.0 }, "position": { "x": 6.0, "y": 3.0, "z": 9.0 }, "radius": 0.5, "uid": "2a6cd-d66ae499" }, { "caption": "movinghead", "isFixed": true, "isLookingAt": true, "isSmoothing": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "markerID": -1, "name": "movinghead", "orientation": { "w": -4.371138828673793e-08, "x": 1.0, "y": 0.0, "z": -0.0 }, "params": { "color": { "b": 1.0, "g": 1.0, "r": 1.0 }, "dimmer": 0.25, "dimmerMul": 1.0, "fixtureName": "Pico Beam 60", "isPanFlipped": false, "isTiltFlipped": true, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "pan": 245.3647918701172, "speed": 0.041999999433755875, "startAddress": 240, "strobe": 0.0, "tilt": 130.64698791503906, "uv": 0.0, "zoom": 0.0 }, "position": { "x": 3.9000000953674316, "y": 3.0, "z": 9.0 }, "radius": 0.5, "uid": "2a6cd-d7a47b3b" }, { "caption": "movinghead", "isFixed": true, "isLookingAt": true, "isSmoothing": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "markerID": -1, "name": "movinghead", "orientation": { "w": -4.371138828673793e-08, "x": -0.0, "y": 0.0, "z": 1.0 }, "params": { "color": { "b": 0.7939394116401672, "g": 0.7939394116401672, "r": 1.0 }, "dimmer": 0.3799999952316284, "dimmerMul": 1.0, "fixtureName": "Pico Beam 60", "isPanFlipped": false, "isTiltFlipped": false, "lookAt": { "x": 2.8263936042785645, "y": 0.0, "z": 6.658849239349365 }, "pan": 248.63693237304688, "speed": 0.041999999433755875, "startAddress": 260, "strobe": 0.0, "tilt": 156.60836791992188, "uv": 0.0, "zoom": 0.0 }, "position": { "x": 0.30000001192092896, "y": 3.0, "z": 0.20000000298023224 }, "radius": 0.5, "uid": "2a6cd-d8b56902" }]
				}, "kinectManager": { "availableDevices": [], "nodes": [{ "caption": "000130301412", "isFixed": false, "isLookingAt": false, "isSmoothing": false, "lookAt": { "x": 0.0, "y": 0.0, "z": 0.0 }, "markerID": -1, "name": "000130301412", "orientation": { "w": 1.0, "x": 0.0, "y": 0.0, "z": 0.0 }, "params": { "isProvidingPointCloud": false }, "position": { "x": 0.9679861068725586, "y": 1.4803099632263184, "z": -0.5997467041015625 }, "radius": 0.5, "uid": "2a2e8-971d907d4" }, { "caption": "000186601412", "isFixed": false, "isLookingAt": false, "isSmoothing": false, "lookAt": { "x": 0.0, "y": 0.0, "z": 0.0 }, "markerID": -1, "name": "000186601412", "orientation": { "w": 1.0, "x": 0.0, "y": 0.0, "z": 0.0 }, "params": { "isProvidingPointCloud": false }, "position": { "x": 3.9679861068725586, "y": 1.4803099632263184, "z": -0.5997467041015625 }, "radius": 0.5, "uid": "2a2e8-971d907d5" }] }, "markerManager": {}, "objectManager": {}, "positionManager": { "nodes": [{ "caption": "position", "isFixed": false, "isLookingAt": false, "isSmoothing": false, "lookAt": { "x": 0.0, "y": 0.0, "z": 0.0 }, "markerID": -1, "name": "position", "orientation": { "w": 1.0, "x": 0.0, "y": 0.0, "z": 0.0 }, "params": { "controlPoints": [[0.0, 0.0, 0.0]], "degree": 1, "loop": false }, "position": { "x": 4.0, "y": 0.0, "z": 4.0 }, "radius": 0.20000000298023224, "uid": "2a6cd-279fbb623" }] },
				"roomParams": { "camera": { "eyepoint": { "x": -13.231184005737305, "y": 10.060953140258789, "z": 9.358683586120605 }, "lookAt": { "x": 0.0, "y": 0.0, "z": 0.0 } } }, "stage": { "size": { "x": 12.0, "y": 3.5, "z": 11.0 } }
			}
		},
		"method": "update", "timestamp": 1752241525966, "type": "description", "uid": "2ac78-1748cef6a"
	}

	private testBodyCreateData = { "data": { "name": "body", "uid": "2ac78-174a0f541", "position": { "x": 0, "y": 0, "z": 0 } }, "method": "create", "timestamp": 1752241526220, "type": "roomNode", "uid": "2ac78-304c0d2eb" };
	private testBodyPoseData = {
		"data": {
			"params": {
				"body": {
					"joints": [
						{ "confidenceLevel": 2, "orientation": { "w": 0.679, "x": 0.575, "y": 0.349, "z": -0.295 }, "position": { "x": 4.81, "y": 0.96, "z": 4.53 }, "type": 0 },
						{ "confidenceLevel": 2, "orientation": { "w": 0.630, "x": 0.561, "y": 0.401, "z": -0.357 }, "position": { "x": 4.76, "y": 1.29, "z": 4.50 }, "type": 1 },
						{ "confidenceLevel": 2, "orientation": { "w": 0.761, "x": 0.592, "y": 0.210, "z": -0.163 }, "position": { "x": 4.74, "y": 1.52, "z": 4.49 }, "type": 2 },
						{ "confidenceLevel": 2, "orientation": { "w": 0.373, "x": -0.169, "y": 0.831, "z": 0.376 }, "position": { "x": 4.57, "y": 1.43, "z": 4.54 }, "type": 3 },
						{ "confidenceLevel": 2, "orientation": { "w": 0.874, "x": -0.296, "y": 0.365, "z": 0.124 }, "position": { "x": 4.43, "y": 1.21, "z": 4.66 }, "type": 4 },
						{ "confidenceLevel": 2, "orientation": { "w": 1.000, "x": 0.000, "y": 0.000, "z": 0.000 }, "position": { "x": 4.24, "y": 1.01, "z": 4.48 }, "type": 5 },
						{ "confidenceLevel": 2, "orientation": { "w": -0.666, "x": 0.216, "y": 0.680, "z": 0.220 }, "position": { "x": 4.91, "y": 1.46, "z": 4.49 }, "type": 6 },
						{ "confidenceLevel": 2, "orientation": { "w": 0.930, "x": 0.015, "y": -0.368, "z": 0.006 }, "position": { "x": 5.15, "y": 1.29, "z": 4.49 }, "type": 7 },
						{ "confidenceLevel": 2, "orientation": { "w": 1.000, "x": 0.000, "y": 0.000, "z": 0.000 }, "position": { "x": 5.38, "y": 1.30, "z": 4.24 }, "type": 8 },
						{ "confidenceLevel": 2, "orientation": { "w": 0.018, "x": -0.016, "y": 0.743, "z": 0.669 }, "position": { "x": 4.67, "y": 0.53, "z": 4.47 }, "type": 9 },
						{ "confidenceLevel": 1, "orientation": { "w": 1.000, "x": 0.000, "y": 0.000, "z": 0.000 }, "position": { "x": 4.67, "y": 0.00, "z": 4.52 }, "type": 10 },
						{ "confidenceLevel": 2, "orientation": { "w": 0.589, "x": -0.567, "y": -0.415, "z": -0.400 }, "position": { "x": 4.91, "y": 0.56, "z": 4.58 }, "type": 11 },
						{ "confidenceLevel": 1, "orientation": { "w": 1.000, "x": 0.000, "y": 0.000, "z": 0.000 }, "position": { "x": 4.92, "y": 0.03, "z": 4.57 }, "type": 12 },
						{ "confidenceLevel": 2, "orientation": { "w": 1.000, "x": 0.000, "y": 0.000, "z": 0.000 }, "position": { "x": 4.73, "y": 1.60, "z": 4.47 }, "type": 13 }
					],
					"uid": "2ac78-174a0f541"
				}
			},
			"uid": "2ac78-174a0f541"
		},
		"method": "update",
		"timestamp": 1752241526292,
		"type": "roomNode",
		"uid": "2ac78-174a14365"
	};

}


