/* eslint-env mocha */
import * as guilds from "./guilds";
import sinon from "sinon";
import fetch from "isomorphic-fetch";

const GUILD_ID = "d5666a91-2c0a-4417-a8aa-f79c1587d642";
window.fetch = fetch;

describe("data/guilds", function() {
	it("return guild infos as object", function(done) {
		const spy = sinon.spy(window, "fetch");
		guilds
			.getGuild(GUILD_ID)
			.then(result => {
				result.should.have.a.property("name", "Art Of Skills");
				expect(window.fetch.calledOnce).to.equal(true);
				spy.restore();
				done();
			})
			.catch(function(err) {
				spy.restore();
				done(err);
			});
	});
	it("get known guilds from cache", function(done) {
		const spy = sinon.spy(window, "fetch");
		guilds
			.getGuild(GUILD_ID)
			.then(result => {
				result.should.have.a.property("name", "Art Of Skills");
				expect(window.fetch.calledOnce).to.equal(false);
				spy.restore();
				done();
			})
			.catch(function(err) {
				spy.restore();
				done(err);
			});
	});
});
