const MODE_CLOCK = 0;
const MODE_DOWNTIMER = 1;
const MODE_UPTIMER = 2;
const MODE_DEADLINE = 3;

function MainDisplay() {};

MainDisplay.prototype.fixDisplay = false;
MainDisplay.prototype.fixDisplayContent = [0,0,0];

MainDisplay.prototype.hideAll = false;
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
	if (this.rightestLimitTwoDigits() && subSecondDigits < 2) {
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

		$('#maindisplay10').text(this.fillZero(display1, firstAreaDigits));
		$('#maindisplay20').text(this.fillZero(display2, 2));
		var rightD = subSecondDigits;
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

		if(subSecondDigits == 0 || !this.displayRightest()) {
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
	
	if(milliSecondsInput >= Math.pow(10, firstAreaDigits) * 60000) {
		var remainSec = Math.floor((milliSecondsInput + 999 * roundup) / 1000 );
		return new Array (
				Math.floor(remainSec / 3600),
				Math.floor(Math.floor(remainSec / 60) % 60),
				Math.floor(remainSec % 60)
				);

	} else {
		var milliseconds = Math.floor((milliSecondsInput - 1 * roundup) / Math.pow(10, 3-subSecondDigits) + 1 * roundup) * Math.pow(10, 3-subSecondDigits);

		var remainSec = Math.floor(milliseconds / 1000 );

		return new Array (
				Math.floor(remainSec / 60),
				Math.floor(remainSec % 60),
				Math.floor(milliseconds % 1000 / Math.pow(10, 3-subSecondDigits))
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
			var colon;
			if(remainingTime>0) {
				colon = remainingTime % 1000 >= 500;
			} else {
				colon = remainingTime % 1000 > -500;
			}
			colon = this.wallTimer.downtimerStatus() != STATUS_RUNNING || colon;;

			mainDisplay.updateDisplay(
					disparray[0],disparray[1],disparray[2],
					colon,
					blinkAfterTime && remainingTime < 0 && (remainingTime % 1000 < -500),
					remainingTime < warningThreshold * 1000,
					running);


			break;

		case MODE_UPTIMER:
			var remainingTime = this.wallTimer.milliSecondsForUptimer();
			var running = this.wallTimer.uptimerStatus() == STATUS_RUNNING;

			if(remainingTime >= 0) {
				var remainSec = Math.floor((remainingTime) / 1000 );

				mainDisplay.updateDisplay(Math.floor(remainSec / 60),
						Math.floor(remainSec % 60),
						Math.floor(remainingTime%1000 / Math.pow(10, 3 - subSecondDigits)),
						this.wallTimer.uptimerStatus() != STATUS_RUNNING || remainingTime%1000 < 500,
						false, false, running);


			} else {
				mainDisplay.updateDisplay(0,0,0,true,false,false, running);
			}

			break;

		case MODE_DEADLINE:
			var remainingTime = this.wallTimer.milliSecondsForDeadline();
			var disparray = this.milliSecondsToThreeArray(remainingTime);
			var colon;

			if(remainingTime>0) {
				colon = remainingTime % 1000 >= 500;
			} else {
				colon = remainingTime % 1000 > -500;
			}

			mainDisplay.updateDisplay(
					disparray[0],disparray[1],disparray[2],
					colon,
					blinkAfterTime && remainingTime < 0 && (remainingTime % 1000 < -500),
					remainingTime < warningThreshold * 1000,
					!this.fixDisplay);
			break;
	}
}

