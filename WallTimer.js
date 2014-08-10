const STATUS_WAITING = 1;
const STATUS_RUNNING = 2;
const STATUS_STOPPED = 3;

function WallTimer() {};

WallTimer.prototype.uptimerStart = -1;
WallTimer.prototype.downtimerFinish = -1;
WallTimer.prototype.downtimerSeconds = 3;
WallTimer.prototype.deadlineTimerFinish = -1;

WallTimer.prototype.fillZero = function (input, digits)
{
	var ret = input.toString();

	if(digits == 0) {
		return "";
	}

	if(ret.length > digits) {
		ret = "";
		for(var i=0; i<digits; i++) {
			ret += "-";
		}

		return ret;
	}

	while(ret.length < digits) {
		ret = "0" + ret;
	}

	return ret;
}

WallTimer.prototype.dateToString = function (d)
{
	var yy = d.getFullYear();
	var mm = d.getMonth()+1;
	var dd = d.getDate();

	var h = d.getHours();
	var m = d.getMinutes();
	var s = d.getSeconds();
	var ms = d.getMilliseconds();

	return this.fillZero(yy, 4) + "-" + this.fillZero(mm,2) + "-" + this.fillZero(dd,2) + " " + this.fillZero(h,2) + ":" + this.fillZero(m,2) + ":" + this.fillZero(s,2) + "." + this.fillZero(ms,3);


}
WallTimer.prototype.getStatusTextAsUptimer = function ()
{
	if(this.uptimerStart == -1) {
		return "Waiting: " + this.uptimerSeconds + " Secs.";
	}
	if(this.uptimerStart == -2) {
		return "Temporary: " + this.uptimerTmpSeconds/1000 + " Secs.";
	}

	return "Start at " +this.dateToString(new Date(this.uptimerStart));
	
}

WallTimer.prototype.getStatusTextAsDowntimer = function ()
{
	if(this.downtimerFinish == -1) {
		return "Waiting: " + this.downtimerSeconds + " Secs.";
	}
	if(this.downtimerFinish == -2) {
		return "Remaining: " + this.downtimerTmpSeconds/1000 + " Secs.";
	}

	return "Finish at " + this.dateToString(new Date(this.downtimerFinish));
	
}

WallTimer.prototype.getStatusTextAsDeadlinetimer = function ()
{
	if(this.deadlinetimerFinish == -1) {
		return "Waiting";
	}

	return "Finish at " + this.dateToString(new Date(this.deadlineTimerFinish));
	
}

WallTimer.prototype.milliSecondsForDowntimer = function ()
{
	if(this.downtimerFinish == -1) {
		return this.downtimerSeconds * 1000;
	}
	if(this.downtimerFinish == -2) {
		return this.downtimerTmpSeconds;
	}

	var remainingTime = this.downtimerFinish - new Date().getTime();
	return remainingTime;
}

WallTimer.prototype.milliSecondsForUptimer = function ()
{
	if(this.uptimerStart == -1) {
		return -1;
	}

	if(this.uptimerStart == -2) {
		return this.uptimerTmpSeconds;
	}

	return new Date().getTime() - this.uptimerStart;
}

WallTimer.prototype.setDowntimer = function (seconds)
{
	this.downtimerSeconds = seconds;
}

WallTimer.prototype.startDowntimer = function (seconds)
{
	this.downtimerFinish = new Date().getTime() + Math.floor(this.downtimerSeconds * 1000);
}

WallTimer.prototype.stopDowntimer = function ()
{
	this.downtimerTmpSeconds = this.milliSecondsForDowntimer();
	this.downtimerFinish = -2;
}

WallTimer.prototype.restartDowntimer = function ()
{
	this.downtimerFinish = new Date().getTime() + this.downtimerTmpSeconds;
}

WallTimer.prototype.startUptimer = function ()
{
	this.uptimerStart = new Date().getTime();
}

WallTimer.prototype.stopUptimer = function ()
{
	this.uptimerTmpSeconds = this.milliSecondsForUptimer();
	this.uptimerStart = -2;
}

WallTimer.prototype.restartUptimer = function ()
{
	this.uptimerStart = new Date().getTime() - this.uptimerTmpSeconds;
}

WallTimer.prototype.downtimerStatus = function ()
{
	if(this.downtimerFinish == -1) {
		return STATUS_WAITING;
	}

	if(this.downtimerFinish == -2) {
		return STATUS_STOPPED;
	}

	return STATUS_RUNNING;
}

WallTimer.prototype.uptimerStatus = function ()
{
	if(this.uptimerStart == -1) {
		return STATUS_WAITING;
	}

	if(this.uptimerStart == -2) {
		return STATUS_STOPPED;
	}

	return STATUS_RUNNING;
}

WallTimer.prototype.reset = function ()
{
	this.uptimerStart = -1;
	this.downtimerFinish = -1;
}

// give me deadline as date object.
WallTimer.prototype.startByDeadline = function (deadline)
{
	this.deadlineTimerFinish = deadline.getTime();
}

WallTimer.prototype.milliSecondsForDeadline = function ()
{

	return this.deadlineTimerFinish - new Date().getTime();
}

