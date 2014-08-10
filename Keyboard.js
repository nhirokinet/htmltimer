$(window).keydown(function(e){
	if(e.which >= 48 && e.which < 58) { // 0-9
		if(mainDisplay.currentMode == MODE_DOWNTIMER) {
			if(wallTimer.downtimerStatus() == STATUS_RUNNING) {
				return;
			}
			wallTimer.reset();
			timerInput += String.fromCharCode(e.which);

			var tmIn = timerInput;
			if(tmIn.length <= 4) {
				mainDisplay.fixDisplay = true;

				while(tmIn.length < 4) {
					tmIn = '0' + tmIn;
				}

				var m = (tmIn.charCodeAt(0) - 48) * 10 + (tmIn.charCodeAt(1) - 48);
				var s = (tmIn.charCodeAt(2) - 48) * 10 + (tmIn.charCodeAt(3) - 48);
				wallTimer.setDowntimer(m*60+s);

				mainDisplay.fixDisplayContent = [m, s, 0];

			}
		}

		if(mainDisplay.currentMode == MODE_DEADLINE) {
			wallTimer.reset();
			dltimerInput += String.fromCharCode(e.which);
			
			var tmIn = dltimerInput;

			if(tmIn.length <= 6) {
				mainDisplay.fixDisplay = true;
				
				while(tmIn.length < 6) {
					tmIn = '0' + tmIn;
				}

				var h = (tmIn.charCodeAt(0) - 48) * 10 + (tmIn.charCodeAt(1) - 48);
				var m = (tmIn.charCodeAt(2) - 48) * 10 + (tmIn.charCodeAt(3) - 48);
				var s = (tmIn.charCodeAt(4) - 48) * 10 + (tmIn.charCodeAt(5) - 48);

				var curDate = new Date();
				var deadline = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), h ,m, s);
				wallTimer.startByDeadline(deadline);

				mainDisplay.fixDisplayContent = [h, m, s];
			}

		}
	}

	if(e.which == 32 || e.which == 83) { // Space or S
		timerInput = '';
		if(mainDisplay.currentMode == MODE_DOWNTIMER) {
			switch(wallTimer.downtimerStatus()) {
		       		case STATUS_WAITING:
					mainDisplay.fixDisplay = false;
					wallTimer.startDowntimer();
					break;

				case STATUS_RUNNING:
					mainDisplay.fixDisplay = false;
					wallTimer.stopDowntimer();
					break;

				case STATUS_STOPPED:
					mainDisplay.fixDisplay = false;
					wallTimer.restartDowntimer();
					break;
			}
		}
		
		if(mainDisplay.currentMode == MODE_UPTIMER) {
			if(wallTimer.uptimerStatus() == STATUS_WAITING) {
				mainDisplay.fixDisplay = false;
				wallTimer.startUptimer();
			} else if(wallTimer.uptimerStatus() == STATUS_RUNNING) {
				wallTimer.stopUptimer();
			} else if(wallTimer.uptimerStatus() == STATUS_STOPPED) {
				wallTimer.restartUptimer();
			}
		}

		if(mainDisplay.currentMode == MODE_DEADLINE) {
			if (mainDisplay.fixDisplay) {
				mainDisplay.fixDisplay = false;
			} else {
				dltimerInput = '';
				mainDisplay.fixDisplay = true;
			}
		}
	}

	if(e.which == 67) { // C
		mainDisplay.fixDisplay = false;
		mainDisplay.currentMode = MODE_CLOCK;
		timerInput = '';
	}

	if(e.which == 68) { // D
		mainDisplay.fixDisplay = false;
		mainDisplay.currentMode = MODE_DOWNTIMER;
		timerInput = '';
	}

	if(e.which == 85) { // U
		mainDisplay.fixDisplay = false;
		mainDisplay.currentMode = MODE_UPTIMER;
		timerInput = '';
	}

	if(e.which == 77) { // M
		if(subSecondDigits == 2) {
			subSecondDigits = 0;
		} else if(subSecondDigits == 0) {
			subSecondDigits = 2;
		}
	}

	if(e.which == 65) { // A
		if(firstAreaDigits == 2) {
			firstAreaDigits = 1;
		} else if(firstAreaDigits == 1) {
			firstAreaDigits = 2;
		}
	}

	if(e.which == 76) { // L
		if(wallTimer.deadlineTimerFinish == -1) {
			mainDisplay.fixDisplay = true;
		} else {
			mainDisplay.fixDisplay = false;
		}
		mainDisplay.currentMode = MODE_DEADLINE;
		timerInput = '';
	}

	if(e.which == 82) { // R
		this.wallTimer.reset();
		timerInput = '';
	}

	if(e.which == 72) { // H
		$('.subdisplay').each (function () {
			if($(this).hasClass('subdisplayhidden')) {
				$(this).removeClass('subdisplayhidden');
			} else {
				$(this).addClass('subdisplayhidden');
			}
				
		});
	}

});

