/* ------------------------------
DEFINE GLOBALS
--------------------------------*/

var scene,
  camera,
	clock = new THREE.Clock(),
	fog,
	keyboard = new THREEx.KeyboardState(),
	controls,
	renderer,
	projector,
	mouse = new THREE.Vector2(),
	offset = new THREE.Vector3(),
	INTERSECTED, 
	SELECTED, 
	objArray = [],
	uv,
	count = 0,
	matrix = [],
	start,
	enter,
	map = new FOUR.Map();




