import en from "../../locales/en.json";
import de from "../../locales/de.json";
import fr from "../../locales/fr.json";
import es from "../../locales/es.json";

let instance = false;
export default class I18N {
	constructor(options) {
		this.options = this.options || {};
		if (options) {
			this.options = Object.assign(this.options, options);
		}
		this.options.lng = this.options.lng || "en";

		this.active = {};
		this.flattenResources();
		this.initCurrentLang();
	}

	static init(options) {
		if (!instance) {
			instance = new I18N(options);
		}
		return instance;
	}
	static getCurrentLanguage() {
		if (!instance) {
			throw new Error("you need to initialize the i18n module before using it.");
		}
		return instance.options.lng;
	}
	static t(key) {
		if (!instance) {
			throw new Error("you need to initialize the i18n module before using it.");
		}
		return instance.translate(key);
	}

	initCurrentLang() {
		if (this.options.resources[this.options.lng]) {
			this.active = this.options.resources[this.options.lng];
		}
	}
	*entries(obj) {
		for (let key of Object.keys(obj)) {
			yield [key, obj[key]];
		}
	}
	flattenResources() {
		for (let [key, value] of this.entries(this.options.resources)) {
			this.options.resources[key] = this.flattenResource(value);
		}
	}
	flattenResource(languageResource) {
		let result = [];
		for (let [namespace, values] of this.entries(languageResource)) {
			for (let [entrykey, translation] of this.entries(values)) {
				result[namespace + ":" + entrykey] = translation;
			}
		}
		return result;
	}

	translate(key) {
		return this.active[key];
	}
}

I18N.init({
	lng: "en",
	resources: {
		en: {
			gw2: en
		},
		de: {
			gw2: de
		},
		fr: {
			gw2: fr
		},
		es: {
			gw2: es
		}
	}
});
