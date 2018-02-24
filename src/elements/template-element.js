import Promise from "bluebird";
import stache from "can-stache";

export default class TemplateElement extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: "open"});
	}

	connectedCallback() {
		const tpl = stache(this.getTemplate());
		this.initViewModel().then(vm => {
			const elm = tpl({context: vm});
			this.shadowRoot.appendChild(elm);
			this.templateRendered();
		});
	}

	initViewModel() {
		return Promise.resolve({});
	}

	templateRendered() {
		// do nothing here. might want to do something in extended classes
	}

	getTemplate() {
		throw new Error("need to specify a template");
	}
}
