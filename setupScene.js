// animation callback function
requestAnimFrame = ( function() {
  return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback, element ) {
			window.setTimout(callback,20);
		};
}) ();

// draw the scene
function render() { 
	requestAnimFrame(render); 
	renderer.render(scene, camera); 
	controls.update();
} 

function action() {
	enter.remove();
	render();
}

function createScene() {

// remove the start button
start.remove();

/* ----------------- SCENE SETUP ---------------- */

// @Jon: add try/catch blocks to setup + firefox capability

/* create the scene and camera objects */
scene = new THREE.Scene(); 
scene.fog = new THREE.Fog( 0x000000, 0.005 );
camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight, .9, 1250);  
renderer = new THREE.WebGLRenderer( {antialias:true} ); 
renderer.setSize(window.innerWidth, window.innerHeight); 
renderer.shadowMapEnabled = true;
projector = new THREE.Projector();
var d = document.body.appendChild(renderer.domElement);
d.id = "canvas";
controls = new FOUR.Controls();
/* ----------------------------------------------*/


/* ----------------- LIGHTING --------------- */
var directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(400,600,400);
scene.add(directionalLight);

var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 400, 600, 400 );
spotLight.castShadow = true;
spotLight.shadowMapWidth = 1024;
spotLight.shadowMapHeight = 1024;
spotLight.shadowCameraNear = 500;
spotLight.shadowCameraFar = 4000;
spotLight.shadowCameraFov = 30;
scene.add( spotLight );

/* ----------------- CONTROLS ---------------- */

//camera.position.set(0,200,100);

renderer.domElement.addEventListener('mousemove', hoverAction, false);
renderer.domElement.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('keydown', function(e) {
	if(e.keyCode === 27) {
		if(controls.pause === true) {
			controls.unpauseControls();
		}
		else controls.pauseControls();
	}
}, false);

//skybox = new FOUR.Skybox(1000);

/* 
*	Generate the map area
*	(Throws "Enter" button on load complete)
*/
// map.generateArea();
map.load();
} // end of createScene()

function init() {
	start = new FOUR.StartButton();
}

window.onload=init;
