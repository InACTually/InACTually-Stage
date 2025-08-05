
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright(c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright(c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2025

	contributors:
	Lars Engeln - mail@lars-engeln.de
*/

export default class Parameter<T = number | string | boolean> {
	private m_value: Ref<T>;
	private m_name: string;
	private m_min: T;
	private m_max: T;
	private m_publishParams: (params: any) => void;

	constructor(name: string, value: T, min: T, max: T, publishParams: (params: any) => void) {
		this.m_name = name;
		this.m_value = ref(value) as Ref<T>;
		this.m_min = min;
		this.m_max = max;
		this.m_publishParams = publishParams;
	}

	public get value(): Ref<T> {
		return this.m_value;
	}

	public set value(newValue: T) {
		if (newValue < this.m_min) {
			newValue = this.m_min;
		} else if (newValue > this.m_max) {
			newValue = this.m_max;
		}
		this.m_value.value = newValue;
		this.m_publishParams({ [this.m_name]: newValue });
	}

	public get(): T {
		return this.value.value;
	}

	public get name(): string {
		return this.m_name;
	}

	public get min(): T {
		return this.m_min;
	}

	public get max(): T {
		return this.m_max;
	}
}
