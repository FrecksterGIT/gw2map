import * as timetools from "./timetools";

const inputTime = "2018-01-03T09:40:27Z";

describe("timetools", () => {
	it("should have a COUNTDOWN_TIME of 300 seconds", () => {
		expect(timetools.COUNTDOWN_TIME).toBe(300);
	});
	it("should format dates correctly - can fail depending on locale", () => {
		expect(timetools.toTime(inputTime)).toBe("10:40:27 AM");
	});
	it("should give a correct countdowntime", () => {
		expect(timetools.getCountdown(inputTime)).toMatch(/^\d+:\d+$/);
	});
	it("should give a correct holding time", () => {
		expect(timetools.getPassedTime(inputTime)).toMatch(/^\d+d \d+h \d+m \d+s$/);
	});
});
