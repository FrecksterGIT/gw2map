/* eslint-env mocha */

import changes from "./changes";
import sinon from "sinon";

describe("changes", function() {
	it("should handle map change", function() {
		let change = {
			path: ["maps"],
			rhs: []
		};
		const spy = sinon.spy(changes, "handleMapChange");
		changes.handleChange(change, {});
		expect(changes.handleMapChange.called).to.equal(true);
		spy.restore();
	});
	it("should handle score change", function() {
		let change = {
			path: ["scores"]
		};
		const spy = sinon.spy(changes, "handleScoreChange");
		changes.handleChange(change, {});
		expect(changes.handleScoreChange.called).to.equal(true);
		spy.restore();
	});
});
