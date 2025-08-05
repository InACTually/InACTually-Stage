
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright (c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright (c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2023

	contributors:
	Fabian Töpfer - baniaf@uber.space
*/

let initialized = ref<boolean>(false);

export default function () {

	onMounted(() => {
		if (!initialized.value) {
			/*window.addEventListener("keyup",(event)=>{
				if(event.key == "s"){
					const data = JSON.stringify(bodyManager.log)
					const blob = new Blob([data], {type: 'text/plain'})
					const e = document.createEvent('MouseEvents'),
					a = document.createElement('a');
					a.download = "test.json";
					a.href = window.URL.createObjectURL(blob);
					a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
					e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					a.dispatchEvent(e);
				}
				if(event.key == "p"){
					bodyManager.play();
				}
			})*/
			initialized.value = true;
		}
	})

	return {
		initialized
	}
}
