import Promise from "bluebird";
import I18N from "../utils/i18n";
import worldsDataEn from "../static-cache/worlds_en.json";
import worldsDataDe from "../static-cache/worlds_de.json";
import worldsDataFr from "../static-cache/worlds_fr.json";
import worldsDataEs from "../static-cache/worlds_es.json";

const getWorlds = () => {
	switch (I18N.getCurrentLanguage()) {
		case "de":
			return Promise.resolve(worldsDataDe);
		case "fr":
			return Promise.resolve(worldsDataFr);
		case "es":
			return Promise.resolve(worldsDataEs);
		default:
			return Promise.resolve(worldsDataEn);
	}
};

export {getWorlds};
