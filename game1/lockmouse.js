var elem;
var stop=true;
//document.addEventListener("mousemove", function(e) {
//  var movementX = e.movementX       ||
//                  e.mozMovementX    ||
//                  e.webkitMovementX ||
//                  0,
//      movementY = e.movementY       ||
//                  e.mozMovementY    ||
//                  e.webkitMovementY ||
//                  0;
//  //console.log("movementX=" + movementX, "movementY=" + movementY);
//}, false);
function fullscreenChange() {
  if (document.webkitFullscreenElement === elem ||
      document.mozFullscreenElement === elem ||
      document.mozFullScreenElement === elem) { // old API 'S'.
    elem.requestPointerLock = elem.requestPointerLock    ||
                              elem.mozRequestPointerLock ||
                              elem.webkitRequestPointerLock;
    elem.requestPointerLock();
		stop=false;
		gameStart();//start animate and userEvent
  }
}

document.addEventListener('fullscreenchange', fullscreenChange, false);
document.addEventListener('mozfullscreenchange', fullscreenChange, false);
document.addEventListener('webkitfullscreenchange', fullscreenChange, false);

function pointerLockChange() {
	if(!!document.pointerLockElement){
		console.log('pointer still lock');
	}else{
		console.log('pointer unlock');
		stop=true;
		gameStop();
	}
}

document.addEventListener('pointerlockchange', pointerLockChange, false);
document.addEventListener('mozpointerlockchange', pointerLockChange, false);
document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

function pointerLockError() {
  console.log("lock point error!");
}

document.addEventListener('pointerlockerror', pointerLockError, false);
document.addEventListener('mozpointerlockerror', pointerLockError, false);
document.addEventListener('webkitpointerlockerror', pointerLockError, false);

function lockPointer() {
  elem = document.getElementById("canvas-frame");
  elem.requestFullscreen = elem.requestFullscreen    ||
                           elem.mozRequestFullscreen ||
                           elem.mozRequestFullScreen ||
                           elem.webkitRequestFullscreen;
  elem.requestFullscreen();
}
