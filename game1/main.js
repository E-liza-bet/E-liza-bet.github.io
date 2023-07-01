var cube;
var stats,log;
var clock = new THREE.Clock();
var center = {
	x:document.getElementById('canvas-frame').clientWidth/2,
	y:document.getElementById('canvas-frame').clientHeight/2,
};
var mixer;
function gameStart(){
	initCallback();
	animate();
}
function gameStop(){
	drawbackCallback();	
}
async function threeStart(){
	initThree();
	initLog();
	initCamera();
	initScene();
	initLight();
	await initSpirit();
	initObject();
	initResize();
	renderer.clear();
	initStates();
}

function initThree(){
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(center.x*2,center.y*2);
	document.getElementById('canvas-frame').appendChild(renderer.domElement);
	renderer.setClearColor(0xbbbbff,1.0);
}
function initCamera(){
	camera = new THREE.PerspectiveCamera(50,center.x/center.y,1,300);
	camera.position.set(spirit.initx,spirit.tall+spirit.inity,spirit.initz-spirit.viewdis);
	camera.lookAt(0,0,100);
}
function initScene(){
	scene = new THREE.Scene();
}
function initLight(){
	light1 = new THREE.AmbientLight(0xffffff,0.7);
	light2 = new THREE.DirectionalLight(0xff5522,0.8);
	var targetObj = new THREE.Object3D();
	targetObj.position.set(10,0,0)
	light2.position.set(-20,0,0);
	light2.target = targetObj;
	light3 = new THREE.PointLight(0x00ff00,0.7,100);
	light3.position.set(50,50,50);
	light4 = new THREE.SpotLight(0x0000ff,1,300,Math.PI/4);
	light4.position.set(0,100,0);
	light5 = new THREE.PointLight(0xff000,0.9,100);
	light5.position.set(100,50,100);
	scene.add(light1);
	//scene.add(light2);
	//scene.add(light3);
	//scene.add(light4);
	//scene.add(light5);
}
function objGrid(){
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial({
		color:0xff0033
	});
	geometry.vertices.push(new THREE.Vector3(0,-20,0));
	geometry.vertices.push(new THREE.Vector3(0,20,0));
	for(var i=-20;i<21;i+=2){
		let line = new THREE.Line(geometry,material,THREE.LineSegments);
		line.position.x = i;
		scene.add(line);
	}
	for(var j=-20;j<21;j+=2){
		let line = new THREE.Line(geometry,material,THREE.LineSegments);
		line.rotation.z = 90*Math.PI/180;
		line.position.y = j;
		scene.add(line);
	}
}
function objBox(){
	var geometry=new THREE.BoxBufferGeometry(20,50,15);
	var material = new THREE.MeshLambertMaterial({
		color:0xbbaa11,
	});
	var cube = new THREE.Mesh(geometry,material);
	cube.position.set(0,0,-20);
	collidableMeshList.push(cube);
	scene.add(cube);
}
function initMap(){
	var block = {
		x:10,y:5,z:10,
	};
	let startpos = {};
	let limitSize = map.length;
	startpos.x=-block.x*50/2;
	startpos.z=-block.z*50/2;
	for(var i=0;i<limitSize;i++){
		for(var j=0;j<limitSize;j++){
			if(map[i][j]){
				randHex = Math.random()*0xffffff;
				let geometry = new THREE.BoxBufferGeometry(block.x,block.y+Math.random()*40,block.z);
				let material = new THREE.MeshLambertMaterial({
					color:randHex,
				});
				let cube = new THREE.Mesh(geometry,material);
				cube.position.set(startpos.x+j*block.x,2,startpos.z+i*block.z);
				collidableMeshList.push(cube);
				scene.add(cube);
			}
		}
	}
}
function objEnv(){
	//big bottom ground
	var geometry = new THREE.BoxBufferGeometry(2000,10,2000);
	var material = new THREE.MeshLambertMaterial({
		color:0xffffff,
	});
	var plane = new THREE.Mesh(geometry,material);
	plane.position.set(0,-10,0);
	collidableMeshList.push(plane);
	scene.add(plane);
	initMap();
}
function initObject(){
	objEnv();
}
function initCallback(){
	document.addEventListener('keydown',keyDown);
  document.addEventListener('keyup',keyUp);
	document.addEventListener('mousemove',mouseMove);
	document.addEventListener('mousedown',mouseDown);
	document.addEventListener('mouseUp',mouseUp);
}
function drawbackCallback(){
	document.removeEventListener('keydown',keyDown);
  document.removeEventListener('keyUp',keyUp);
	document.removeEventListener('mousemove',mouseMove);
	document.removeEventListener('mousedown',mouseDown);
	document.removeEventListener('mouseup',mouseUp);
}
function initStates(){
	stats = new Stats();
	stats.setMode(0);//fps
	stats.dom.style.position = 'absolute';
	stats.dom.style.left = '0px';
	stats.dom.style.top = '0px';
	document.getElementById('canvas-frame').appendChild(stats.dom);
}
function initLog(){
	log = myPanel();
	bloodTrough = BloodTrough();
	bloodTrough.update();
	log.dom.style.position = 'absolute';
	log.dom.style.left = '100px';
	log.dom.style.top = '0px';
	log.useText('it may take some time...');
	document.getElementById('canvas-frame').appendChild(log.dom);
	document.getElementById('canvas-frame').appendChild(bloodTrough.dom);
}
function initResize(){
	window.addEventListener('resize',(e)=>{
	center.x=document.getElementById('canvas-frame').clientWidth/2;
	center.y=document.getElementById('canvas-frame').clientHeight/2;
	camera.aspect = center.x/center.y;
	camera.updateProjectionMatrix();
	renderer.setSize(center.x*2,center.y*2);
	},false);
}

function animate(){
	if(!stop){
		requestAnimationFrame(animate);
		spiritMoveCheck(0.8);
		var dt = clock.getDelta();
		mixer.update(dt);
		renderer.render(scene,camera);
		stats.update();
	}
}
