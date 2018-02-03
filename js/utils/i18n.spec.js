import I18N from "./i18n";

beforeAll(() => {
	I18N.init({
		lng: "en",
		resources: {
			en: {
				namespace1: {
					text1: "text 1.1",
					text2: "text 1.2"
				},
				namespace2: {
					text1: "text 2.1",
					text2: "text 2.2"
				}
			}
		}
	});
});

describe("I18N", () => {
	it("known keys resolve correctly", () => {
		expect(I18N.t("namespace1:text1")).toBe("text 1.1");
		expect(I18N.t("namespace2:text2")).toBe("text 2.2");
	});
	it("unknown key should return the unaltered key", () => {
		expect(I18N.t("namespace3:text1")).toBe("namespace3:text1");
	});
});
