var mainTimer;

var mainDisplay = new MainDisplay();
mainDisplay.currentMode = MODE_DOWNTIMER;
mainDisplay.blinkColon = defaultBlinkColon;

var wallTimer = new WallTimer();

var timerInput = '';
var dltimerInput = '';
wallTimer.setDowntimer(initialDowntimer);

mainDisplay.wallTimer = wallTimer;


mainTimer = setInterval('mainDisplay.refreshDisplay()', timerInterval);

