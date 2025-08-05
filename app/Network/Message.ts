
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright(c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright(c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2024-2025

	contributors:
	Lars Engeln - mail@lars-engeln.de
	Fabian Töpfer - baniaf@uber.space
*/

export enum MsgType {
	MT_UNKNOWN = -1,

	MT_DESCRIPTION,

	MT_APP,
	MT_ASSET,
	MT_INTERACTION,
	MT_PROCNODE,
	MT_ROOMNODE
}
export enum MsgMethod {
	MM_UNKNOWN = -2,

	MM_ERROR = -1,
	MM_WARNING = 0,

	MM_CREATE = 1,
	MM_REQUEST,
	MM_UPDATE,
	MM_DELETE,

	MM_CONNECT,
	MM_DISCONNECT,
	MM_SUBSCRIBE,
	MM_UNSUBSCRIBE,

	MM_UPLOAD,
	MM_REMOTEPROCEDURECALL
}

export default class Message {
	protected m_isValid = true;
	protected m_uid = "";
	protected m_type = MsgType.MT_UNKNOWN;
	protected m_method = MsgMethod.MM_UNKNOWN;
	protected m_timestamp = Date.now();
	protected m_data = {} as any;

	public constructor(uid: string = "", type = MsgType.MT_UNKNOWN, method = MsgMethod.MM_UNKNOWN) {
		this.setUID(uid);
		this.setType(type);
		this.setMethod(method);
	}

	public toJson(): any {
		let json: any = {} as any;
		json.uid = this.getUID();
		json.type = this.fromMsgType(this.getType());
		json.method = this.fromMsgMethod(this.getMethod());
		json.timestamp = Date.now();
		json.data = this.getData();
		return json;
	}

	public fromJson(json: any): boolean {
		this.m_isValid = false;

		if (json.type === undefined) {
			this.missingError("recieveJson", "type");
			return false;
		}
		if (json.method === undefined) {
			this.missingError("recieveJson", "method");
			return false;
		}
		if (json.timestamp === undefined) {
			this.missingError("recieveJson", "timestamp");
			return false;
		}
		if (json.data === undefined) {
			this.missingError("recieveJson", "data");
			return false;
		}

		this.setType(this.toMsgType(json.type));
		this.setMethod(this.toMsgMethod(json.method));
		this.m_timestamp = json.timestamp;
		this.setData(json.data);

		if (this.m_method === MsgMethod.MM_UNKNOWN) {
			this.missingError("recieveJson", "method is unknown");
			return false;
		}
		if (this.m_method !== MsgMethod.MM_ERROR && this.m_type === MsgType.MT_UNKNOWN) {
			this.missingError("recieveJson", "type is unknown");
			return false;
		}


		if (this.m_method !== MsgMethod.MM_CONNECT
			&& this.m_method !== MsgMethod.MM_DISCONNECT
			&& this.m_method !== MsgMethod.MM_REQUEST
			&& this.m_type !== MsgType.MT_DESCRIPTION
			&& this.m_type !== MsgType.MT_APP) {

			if (this.getData().uid === undefined) {
				this.missingError("recieveJson", "data.uid");
				return false;
			}
		}

		if (json.uid !== undefined)
			this.setUID(json.uid);

		this.m_isValid = true;

		return this.isValid();
	}

	public isValid(): boolean { return this.m_isValid; };

	public getUID(): string { return this.m_uid; };
	public setUID(uid: string) { this.m_uid = uid; };
	public getType(): MsgType { return this.m_type; };
	public setType(type: MsgType) { this.m_type = type; };
	public getMethod(): MsgMethod { return this.m_method; };
	public setMethod(method: MsgMethod) { this.m_method = method; };
	public getData(): any { return this.m_data; };
	public setData(data: any) { this.m_data = data; };

	public getTimestamp(): number { return this.m_timestamp; };

	public missingError(where: string, what: string) {
		console.error("[Message] " + where + ": Could not get " + what + " from JSON Message.",);
	}

	public toMsgType(type: string): MsgType {
		switch (type) {
			case "procNode":
				return MsgType.MT_PROCNODE;

			case "roomNode":
				return MsgType.MT_ROOMNODE;

			case "app":
				return MsgType.MT_APP;

			case "interaction":
				return MsgType.MT_INTERACTION;

			case "asset":
				return MsgType.MT_ASSET;

			case "description":
				return MsgType.MT_DESCRIPTION;

			default:
				return MsgType.MT_UNKNOWN;
		}
	}
	public fromMsgType(type: MsgType): string {
		switch (type) {
			case MsgType.MT_PROCNODE:
				return "procNode";

			case MsgType.MT_ROOMNODE:
				return "roomNode";

			case MsgType.MT_APP:
				return "app";

			case MsgType.MT_INTERACTION:
				return "interaction";

			case MsgType.MT_ASSET:
				return "asset";

			case MsgType.MT_DESCRIPTION:
				return "description";

			default:
				return "unknown";
		}
	}

	public toMsgMethod(method: string): MsgMethod {
		switch (method) {
			case "update":
				return MsgMethod.MM_UPDATE;

			case "rpc":
				return MsgMethod.MM_REMOTEPROCEDURECALL;

			case "create":
				return MsgMethod.MM_CREATE;

			case "delete":
				return MsgMethod.MM_DELETE;

			case "connect":
				return MsgMethod.MM_CONNECT;

			case "disconnect":
				return MsgMethod.MM_DISCONNECT;

			case "subscribe":
				return MsgMethod.MM_SUBSCRIBE;

			case "unsubscribe":
				return MsgMethod.MM_UNSUBSCRIBE;

			case "request":
				return MsgMethod.MM_REQUEST;

			case "upload":
				return MsgMethod.MM_UPLOAD;

			case "error":
				return MsgMethod.MM_ERROR;

			case "warning":
				return MsgMethod.MM_WARNING;

			default:
				return MsgMethod.MM_UNKNOWN;
		}
	}
	public fromMsgMethod(method: MsgMethod): string {
		switch (method) {
			case MsgMethod.MM_UPDATE:
				return "update";

			case MsgMethod.MM_REMOTEPROCEDURECALL:
				return "rpc";

			case MsgMethod.MM_CREATE:
				return "create";

			case MsgMethod.MM_DELETE:
				return "delete";

			case MsgMethod.MM_CONNECT:
				return "connect";

			case MsgMethod.MM_DISCONNECT:
				return "disconnect";

			case MsgMethod.MM_SUBSCRIBE:
				return "subscribe";

			case MsgMethod.MM_UNSUBSCRIBE:
				return "unsubscribe";

			case MsgMethod.MM_REQUEST:
				return "request";

			case MsgMethod.MM_UPLOAD:
				return "upload";

			case MsgMethod.MM_ERROR:
				return "error";

			case MsgMethod.MM_WARNING:
				return "warning";

			default:
				return "unknown";
		}
	}
}
