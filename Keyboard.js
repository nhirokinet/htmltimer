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
		mainDisplay.startStop();
	}

	if(e.which == 67) { // C
		mainDisplay.modeClock();
	}

	if(e.which == 68) { // D
		mainDisplay.modeDownTimer();
	}

	if(e.which == 85) { // U
		mainDisplay.modeUpTimer();
	}

	if(e.which == 76) { // L
		mainDisplay.modeDeadlineTimer();
	}

	if(e.which == 77) { // M
		mainDisplay.toggleSubSeconds();
	}

	if(e.which == 65) { // A
		mainDisplay.toggleFirstAreaDigits();
	}

	if(e.which == 82) { // R
		mainDisplay.reset();
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

