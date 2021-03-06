const timetools = {
	COUNTDOWN_TIME: 300,

	now() {
		return new Date();
	},

	diffTime(timeEndString) {
		let timeStart = this.now();
		let timeEnd = Date.parse(timeEndString) / 1000;
		return Math.floor((timeStart - new Date(timeEnd * 1000)) / 1000);
	},

	// eslint-disable-next-line complexity, max-statements
	toDDHHMMSS(timeToFormat) {
		var sec_num = timeToFormat,
			days,
			hours,
			minutes,
			seconds,
			time = "-";
		if (sec_num) {
			days = Math.floor(sec_num / 86400);
			sec_num -= days * 86400;
			hours = Math.floor(sec_num / 3600);
			sec_num -= hours * 3600;
			minutes = Math.floor(sec_num / 60);
			sec_num -= minutes * 60;
			seconds = sec_num;

			if (hours < 10) {
				hours = "0" + hours;
			}
			if (minutes < 10) {
				minutes = "0" + minutes;
			}
			if (seconds < 10) {
				seconds = "0" + seconds;
			}
			time =
				(days > 0 ? days + "d " : "") +
				(hours > 0 || days > 0 ? hours + "h " : "") +
				(minutes > 0 || hours > 0 || days > 0 ? minutes + "m " : "") +
				seconds +
				"s";
		}
		return time;
	},

	toMMSS(sec_num) {
		var hours = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - hours * 3600) / 60);
		var seconds = sec_num - hours * 3600 - minutes * 60;

		if (hours < 10) {
			hours = "0" + hours;
		}
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		return minutes + ":" + seconds;
	},

	getPassedTime(time) {
		return this.toDDHHMMSS(this.diffTime(time));
	},

	getCountdown(time) {
		return this.toMMSS(this.COUNTDOWN_TIME - this.diffTime(time));
	},

	toTime(timeAsString) {
		let time = new Date(Date.parse(timeAsString));
		return time.toLocaleTimeString();
	}
};

export default timetools;
