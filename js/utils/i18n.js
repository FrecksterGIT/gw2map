import i18next from "i18next";
import en from "../../locales/en.json";
import de from "../../locales/de.json";
import fr from "../../locales/fr.json";
import es from "../../locales/es.json";

i18next.init({
	lng: "en",
	debug: false,
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

export {i18next};
