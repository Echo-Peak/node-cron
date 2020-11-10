(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['luxon'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('luxon'), require('child_process'));
	} else {
		root.Cron = factory(root.luxon);
	}
})(this, function (luxon, childProcess) {
  var exports = {};
  let events = require('events');
  
  class CronEventEmitter extends events{}
  const Events = new CronEventEmitter();

	var spawn = childProcess && childProcess.spawn;
	const CronTime = require('./time')(luxon, Events);
	const CronJob = require('./job')(CronTime, spawn, Events);

	/**
	 * Extend Luxon DateTime
	 */
	luxon.DateTime.prototype.getWeekDay = function () {
		return this.weekday === 7 ? 0 : this.weekday;
	};

	exports.job = (
		cronTime,
		onTick,
		onComplete,
		startNow,
		timeZone,
		context,
		runOnInit,
		utcOffset,
		unrefTimeout
	) =>
		new CronJob(
			cronTime,
			onTick,
			onComplete,
			startNow,
			timeZone,
			context,
			runOnInit,
			utcOffset,
			unrefTimeout
		);

	exports.time = (cronTime, timeZone) => new CronTime(cronTime, timeZone);

	exports.sendAt = cronTime => exports.time(cronTime).sendAt();

	exports.timeout = cronTime => exports.time(cronTime).getTimeout();

	exports.CronJob = CronJob;
  exports.CronTime = CronTime;
  exports.Events = Events;

	return exports;
});
