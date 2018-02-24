import timetools from './timetools';

const inputTime = '2018-01-03T09:40:27Z';

describe('timetools', () => {
	it('should have a COUNTDOWN_TIME of 300 seconds', () => {
		timetools.COUNTDOWN_TIME.should.equal(300);
	});
	it('should format dates correctly - can fail depending on locale', () => {
		timetools.toTime(inputTime).should.equal('10:40:27 AM');
	});
	it('should give a correct countdowntime', () => {
		timetools.getCountdown(inputTime).should.match(/^\d+:\d+$/);
	});
	it('should give a correct holding time', () => {
		timetools.getPassedTime(inputTime).should.match(/^\d+d \d+h \d+m \d+s$/);
	});
});
