const MODE_CLOCK = 0;
const MODE_DOWNTIMER = 1;
const MODE_UPTIMER = 2;
const MODE_DEADLINE = 3;

function MainDisplay() {};

MainDisplay.prototype.fixDisplayContent = [0,0,0];
MainDisplay.prototype.hideAll = false;
MainDisplay.prototype.downtimerAlreadyExpired = false;
MainDisplay.prototype.deadlinetimerAlreadyExpired = false;
MainDisplay.prototype.firstAreaDigits = 2;
MainDisplay.prototype.subSecondDigits = 2;

MainDisplay.prototype.fillZero = function(input, digits)
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

MainDisplay.prototype.rightestLimitTwoDigits = function ()
{
	if (this.currentMode == MODE_CLOCK) {
		return true;
	}
	return false;
}

MainDisplay.prototype.displayRightest = function ()
{
	if (this.rightestLimitTwoDigits() && this.subSecondDigits < 2) {
		return false;
	}

	return true;
}

MainDisplay.prototype.updateDisplay = function(display1, display2, display3, colon, hideAll, warning, running)
{
	if (running) {
		$('.status-running').addClass('statusactivated');
		$('.status-running').removeClass('statusdeactivated');

		$('.status-stopped').addClass('statusdeactivated');
		$('.status-stopped').removeClass('statusactivated');
	} else {
		$('.status-running').addClass('statusdeactivated');
		$('.status-running').removeClass('statusactivated');

		$('.status-stopped').addClass('statusactivated');
		$('.status-stopped').removeClass('statusdeactivated');

	}

	switch (this.currentMode) {
		case MODE_CLOCK:
			$('.mode-clock').addClass('modeactivated');
			$('.mode-clock').removeClass('modedeactivated');
			$('.mode-downtimer').removeClass('modeactivated');
			$('.mode-downtimer').addClass('modedeactivated');
			$('.mode-uptimer').removeClass('modeactivated');
			$('.mode-uptimer').addClass('modedeactivated');
			$('.mode-deadline').removeClass('modeactivated');
			$('.mode-deadline').addClass('modedeactivated');
			break;
		case MODE_DOWNTIMER:
			$('.mode-clock').removeClass('modeactivated');
			$('.mode-clock').addClass('modedeactivated');
			$('.mode-downtimer').addClass('modeactivated');
			$('.mode-downtimer').removeClass('modedeactivated');
			$('.mode-uptimer').removeClass('modeactivated');
			$('.mode-uptimer').addClass('modedeactivated');
			$('.mode-deadline').removeClass('modeactivated');
			$('.mode-deadline').addClass('modedeactivated');

			break;
		case MODE_UPTIMER:
			$('.mode-clock').removeClass('modeactivated');
			$('.mode-clock').addClass('modedeactivated');
			$('.mode-downtimer').removeClass('modeactivated');
			$('.mode-downtimer').addClass('modedeactivated');
			$('.mode-uptimer').addClass('modeactivated');
			$('.mode-uptimer').removeClass('modedeactivated');
			$('.mode-deadline').removeClass('modeactivated');
			$('.mode-deadline').addClass('modedeactivated');
			break;
		case MODE_DEADLINE:
			$('.mode-clock').removeClass('modeactivated');
			$('.mode-clock').addClass('modedeactivated');
			$('.mode-downtimer').removeClass('modeactivated');
			$('.mode-downtimer').addClass('modedeactivated');
			$('.mode-uptimer').removeClass('modeactivated');
			$('.mode-uptimer').addClass('modedeactivated');
			$('.mode-deadline').addClass('modeactivated');
			$('.mode-deadline').removeClass('modedeactivated');
			break;
	}

	if(this.currentMode == MODE_DOWNTIMER) {
		$('.statusbar').text(this.wallTimer.getStatusTextAsDowntimer());
	} else if(this.currentMode == MODE_DEADLINE) {
		$('.statusbar').text(this.wallTimer.getStatusTextAsDeadlinetimer());
	} else if(this.currentMode == MODE_UPTIMER) {
		$('.statusbar').text(this.wallTimer.getStatusTextAsUptimer());
		
	} else {
		$('.statusbar').text('');
	}

	if(hideAll){
		$('#maindisplay').removeClass('displayenabled');
		$('#maindisplay').addClass('displaydisabled');
	} else {
		$('#maindisplay').addClass('displayenabled');
		$('#maindisplay').removeClass('displaydisabled');
		
		if(warning) {
			$('#maindisplay').addClass('warning');
		} else {
			$('#maindisplay').removeClass('warning');
		}

		$('#maindisplay10').text(this.fillZero(display1, this.firstAreaDigits));
		$('#maindisplay20').text(this.fillZero(display2, 2));
		var rightD = this.subSecondDigits;
		if (rightD>2 && this.rightestLimitTwoDigits()) {
			rightD = 2;
		}

		$('#maindisplay30').text(this.fillZero(display3, rightD));
		
		if(!this.blinkColon || colon) {
			$('.colon').addClass('lampenabled');
			$('.colon').removeClass('lampdisabled');
		} else {
			$('.colon').removeClass('lampenabled');
			$('.colon').addClass('lampdisabled');
		}

		if(this.subSecondDigits == 0 || !this.displayRightest()) {
			$('#maindisplay25').addClass('displaydisabled');
			$('#maindisplay30').text("");

		} else {
			$('#maindisplay25').removeClass('displaydisabled');

		}
	}
}

MainDisplay.prototype.milliSecondsToThreeArray = function (milliSecondsInput)
{
	var roundup  = true;
	if(milliSecondsInput < 0) {
		milliSecondsInput = -milliSecondsInput;
		roundup = !roundup;
	}
	
	var milliseconds = Math.floor((milliSecondsInput - 1 * roundup) / Math.pow(10, 3-this.subSecondDigits) + 1 * roundup) * Math.pow(10, 3-this.subSecondDigits);
	var remainSec = Math.floor(milliseconds / 1000 );

	if(remainSec >= Math.pow(10, this.firstAreaDigits) * 60) {
		remainSec = Math.floor((milliSecondsInput + 999 * roundup) / 1000 );
		return new Array (
				Math.floor(remainSec / 3600),
				Math.floor(Math.floor(remainSec / 60) % 60),
				Math.floor(remainSec % 60)
				);

	} else {
		return new Array (
				Math.floor(remainSec / 60),
				Math.floor(remainSec % 60),
				Math.floor(milliseconds % 1000 / Math.pow(10, 3-this.subSecondDigits))
				);
	}
	
}

MainDisplay.prototype.refreshDisplay  = function ()
{
	if (this.fixDisplay) {
		this.updateDisplay(this.fixDisplayContent[0], this.fixDisplayContent[1], this.fixDisplayContent[2], true, false, false, false);
		return;
	}

	switch (this.currentMode) {
		case MODE_CLOCK:
			var curDate = new Date();
			this.updateDisplay(curDate.getHours(), curDate.getMinutes(), curDate.getSeconds(), curDate.getMilliseconds()<500, false, false, true);
			break;

		case MODE_DOWNTIMER:
			var running = this.wallTimer.downtimerStatus() == STATUS_RUNNING;
			var remainingTime = this.wallTimer.milliSecondsForDowntimer();
			var disparray = this.milliSecondsToThreeArray(remainingTime);

			if(remainingTime < 0) {
				if (this.downtimerAlreadyExpired == false) {
					this.downtimerAlreadyExpired = true;
					this.expireSound.play();
				}
			}

			var colon;
			if(remainingTime>0) {
				colon = remainingTime % 1000 >= 500;
			} else {
				colon = remainingTime % 1000 > -500;
			}

			colon = this.wallTimer.downtimerStatus() != STATUS_RUNNING || colon;;

			this.updateDisplay(
					disparray[0],disparray[1],disparray[2],
					colon,
					blinkAfterTime && remainingTime < 0 && (remainingTime % 1000 < -500) && this.wallTimer.downtimerStatus() == STATUS_RUNNING,
					remainingTime < warningThreshold * 1000,
					running);


			break;

		case MODE_UPTIMER:
			var remainingTime = this.wallTimer.milliSecondsForUptimer();
			var running = this.wallTimer.uptimerStatus() == STATUS_RUNNING;

			if(remainingTime >= 0) {
				var remainSec = Math.floor((remainingTime) / 1000 );

				this.updateDisplay(Math.floor(remainSec / 60),
						Math.floor(remainSec % 60),
						Math.floor(remainingTime%1000 / Math.pow(10, 3 - this.subSecondDigits)),
						this.wallTimer.uptimerStatus() != STATUS_RUNNING || remainingTime%1000 < 500,
						false, false, running);


			} else {
				this.updateDisplay(0,0,0,true,false,false, running);
			}

			break;

		case MODE_DEADLINE:
			var remainingTime = this.wallTimer.milliSecondsForDeadline();
			var disparray = this.milliSecondsToThreeArray(remainingTime);

			if(remainingTime < 0) {
				if (this.deadlinetimerAlreadyExpired == false) {
					this.deadlinetimerAlreadyExpired = true;
					this.expireSound.play();
				}
			}

			var colon;
			if(remainingTime>0) {
				colon = remainingTime % 1000 >= 500;
			} else {
				colon = remainingTime % 1000 > -500;
			}

			this.updateDisplay(
					disparray[0],disparray[1],disparray[2],
					colon,
					blinkAfterTime && remainingTime < 0 && (remainingTime % 1000 < -500),
					remainingTime < warningThreshold * 1000,
					!this.fixDisplay);
			break;
	}
}

MainDisplay.prototype.modeClock = function ()
{
	this.fixDisplay = false;
	this.currentMode = MODE_CLOCK;
	timerInput = '';
	dltimerInput = '';
}

MainDisplay.prototype.modeDownTimer = function ()
{
	this.fixDisplay = false;
	this.currentMode = MODE_DOWNTIMER;
	timerInput = '';
	dltimerInput = '';
}

MainDisplay.prototype.modeUpTimer = function ()
{
	this.fixDisplay = false;
	this.currentMode = MODE_UPTIMER;
	timerInput = '';
	dltimerInput = '';
}

MainDisplay.prototype.modeDeadlineTimer = function ()
{
	if(this.wallTimer.deadlineTimerFinish == -1) {
		this.fixDisplay = true;
	} else {
		this.fixDisplay = false;
	}
	this.currentMode = MODE_DEADLINE;
	timerInput = '';
	dltimerInput = '';
}

MainDisplay.prototype.reset = function()
{
	this.timerAlreadyExpired = false;
	timerInput = '';
	dltimerInput = '';
	this.wallTimer.reset();
}

MainDisplay.prototype.startStop = function ()
{
	timerInput = '';
	if(this.currentMode == MODE_DOWNTIMER) {
		switch(this.wallTimer.downtimerStatus()) {
			case STATUS_WAITING:
				this.downtimerAlreadyExpired = false;
				this.fixDisplay = false;
				this.wallTimer.startDowntimer();
				break;

			case STATUS_RUNNING:
				this.fixDisplay = false;
				this.wallTimer.stopDowntimer();
				break;

			case STATUS_STOPPED:
				if (this.wallTimer.downtimerTmpSeconds > 0) {
					this.downtimerAlreadyExpired = false;
				}
				this.fixDisplay = false;
				this.wallTimer.restartDowntimer();
				break;
		}
	}

	if(this.currentMode == MODE_UPTIMER) {
		if(this.wallTimer.uptimerStatus() == STATUS_WAITING) {
			this.fixDisplay = false;
			this.wallTimer.startUptimer();
		} else if(this.wallTimer.uptimerStatus() == STATUS_RUNNING) {
			this.wallTimer.stopUptimer();
		} else if(this.wallTimer.uptimerStatus() == STATUS_STOPPED) {
			this.wallTimer.restartUptimer();
		}
	}

	if(this.currentMode == MODE_DEADLINE) {
		if (this.fixDisplay) {
			if (this.wallTimer.milliSecondsForDeadline() > 0) {
				this.deadlinetimerAlreadyExpired = false;
			}
			this.fixDisplay = false;
		} else {
			dltimerInput = '';
			this.fixDisplay = true;
		}
	}
}

MainDisplay.prototype.toggleSubSeconds = function ()
{
	if(this.subSecondDigits == 2) {
		this.subSecondDigits = 0;
	} else if(this.subSecondDigits == 0) {
		this.subSecondDigits = 2;
	}
}

MainDisplay.prototype.toggleFirstAreaDigits = function ()
{
	if(this.firstAreaDigits == 2) {
		this.firstAreaDigits = 1;
	} else if(this.firstAreaDigits == 1) {
		this.firstAreaDigits = 2;
	}
}
