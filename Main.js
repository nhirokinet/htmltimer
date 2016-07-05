var wallTimer = new WallTimer();
wallTimer.setDowntimer(initialDowntimer);

var mainDisplay = new MainDisplay();
mainDisplay.currentMode = MODE_DOWNTIMER;
mainDisplay.blinkColon = defaultBlinkColon;
mainDisplay.wallTimer = wallTimer;
mainDisplay.expireSound = new Audio("./expire.ogg");

var timerInput = '';
var dltimerInput = '';

var mainTimer = setInterval('mainDisplay.refreshDisplay()', timerInterval);
