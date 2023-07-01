//mouse
var theta=Math.PI/2,alpha=0;
var towards=new THREE.Vector3(0,0,1);

function mouseDown(e){
	if(e.button==0){
		playIfNotRun(attackAction,1);
		let origin = spirit.mesh.position.clone();
		let t = towardsxyz(theta,alpha+0.3);//add some degree in alpha
		origin.add(t.clone().multiplyScalar(8));
		let x=origin.x;
		let y=origin.y;
		let z=origin.z;
		let geometry = new THREE.BoxBufferGeometry(7,7,7);//3 3 12
		let attackShape = new THREE.Mesh(geometry);
		attackShape.lookAt(t);
		attackShape.name = 'block';
		attackShape.position.set(x,y,z);
		scene.add(attackShape);
		console.log(attackShape);
		collidableMeshList.push(attackShape);
	}else if(e.button==2){
		let origin = spirit.mesh.position.clone();
		let t = towardsxyz(theta,alpha+0.3);//add some degree in alpha
		origin.add(t.clone().multiplyScalar(8));
		let x=origin.x;
		let y=origin.y;
		let z=origin.z;
		let geometry = new THREE.BoxGeometry(7,7,7);//3 3 12
		let attackShape = new THREE.Mesh(geometry);
		attackShape.lookAt(t);
		attackShape.name = 'attack';
		attackShape.position.set(x,y,z);
		scene.add(attackShape);
		console.log(attackShape);
		collidableMeshList.push(attackShape);
	}
}
function mouseUp(e){
	if(e.button==0){
		playIfNotRun(attackAction,0);
	}
}
function tpcameraUpdate(){
	let mesh=spirit.mesh;
	let px = mesh.position.x-towards.x*spirit.viewdis;
	let py = mesh.position.y-towards.y*spirit.viewdis+spirit.tall;
	let pz = mesh.position.z-towards.z*spirit.viewdis;
	camera.position.set(px,py,pz);
	camera.lookAt(mesh.position.x,mesh.position.y+spirit.tall,mesh.position.z);
}

//---keyboard
keyStatus = {
	'a':false,'d':false,'w':false,'s':false,'f':false,'space':false
}

function mouseMove(e){
	//preventDefault
	//if(e.preventDefault){
	//	e.preventDefault();
	//}else{
	//	window.event.returnValue = false;
	//}
	//compat
  let movementX = e.movementX       ||
                 	e.mozMovementX    ||
                 	e.webkitMovementX ||
                 	0,
			movementY = e.movementY       ||
                 	e.mozMovementY    ||
                 	e.webkitMovementY ||
                 	0;
	//
	alpha -= movementY*0.001;//mouse move sensitive 0.001
  alpha %=(Math.PI*2);
	theta -= movementX*0.001;
  theta %= (Math.PI*2);
	spirit.mesh.rotateY(theta-spirit.theta);//spirit rotate with mouse
	spirit.theta = theta;
	towards = towardsxyz(theta,alpha);
	tpcameraUpdate();
}
function keyDown(e){
	//preventDefault
	if(e.preventDefault){
		e.preventDefault();
	}else{
		window.event.returnValue = false;
	}
	if(e.key in keyStatus){
		keyStatus[e.key] = true;
	}else if(e.keyCode==32){
		keyStatus['space']=true;	
	}else if(e.key=='m'){
		if(spirit.mode=='fps'){
			spirit.modeSet('tps');
		}else{
			spirit.modeSet('fps');
		}
	}else if(e.key=='l'){
			spirit.switchlight();
	}
}
function keyUp(e){
//preventDefault
	if(e.preventDefault){
		e.preventDefault();
	}else{
		window.event.returnValue = false;
	}
	if(e.key in keyStatus){
		keyStatus[e.key] = false;
	}else if(e.keyCode==32){
		keyStatus['space']=false;
	}
}

var gravity={
	direction:new THREE.Vector3(0,-0.5,0),
	scale:0.5,
}
function spiritMoveCheck(scale){
	var mesh=spirit.mesh;
	var direction = towards.clone();
	var planeSpeed = direction.clone().setY(0).length();
	var movement = new THREE.Vector3(0,0,0);
	//consider keyStatus
	var isWalk = false;
	var isSlide = false;

	if(keyStatus.a){
		movement.add(leftTrans(direction));
		isSlide = true;
	}
	if(keyStatus.d){
		movement.add(rightTrans(direction));
		isSlide = true;
	}
	if(keyStatus.w){
		movement.add(forwardTrans(direction));
		isWalk = true;
	}
	if(keyStatus.s){
		movement.add(backwardTrans(direction));
		isWalk = true;
	}
	//spane direction normalize
	movement = movement.normalize().multiplyScalar(planeSpeed*0.5);
	
	//jump
	if(spirit.status.has('ON_THE_JUMP')){
		movement.add(goUp());
	}else{
		//walk animate
		playIfNotRun(walkAction,isWalk);
		playIfNotRun(slideAction,isSlide);
	}
	if(keyStatus.space){
		if(spirit.status.has('ON_THE_GROUND')){
			movement.add(goUp());
			scale*=4;
			spirit.status.set('ON_THE_JUMP',1);
			spirit.status.delete('ON_THE_GROUND');
			jumpAction.play();
			setTimeout(()=>{
				spirit.status.delete('ON_THE_JUMP');
			},500);//jump up to 3 sec
		}
	}

	//consider gravity
	movement = movement.add(goDown());
	var ans = checkCollision(mesh);
	log.addText(`movement:${movement.x} ${movement.y} ${movement.z}\n`);
	if(ans.iscollision){
		log.addText(`pre direction:${direction.x} ${direction.y} ${direction.z}\n`);
		let d = movement;
		for(var i=0;i<ans.normals.length;i++){
			if(vecAngle(ans.normals[i],spirit.mesh.up)>0.7){
				spirit.status.set('ON_THE_GROUND',1);
				jumpAction.stop();
			}
			d=faceProject(d,ans.normals[i]);
		}
		log.addText(`after faceProject:${d.x} ${d.y} ${d.z}\n`);
		spiritMove(mesh,d,scale);
		//tpcameraUpdate();
		//return;
	}else{
		spiritMove(mesh,movement,scale);
	}
	tpcameraUpdate();
}

function spiritMove(mesh,direction,scale){
	mesh.position.add(direction.multiplyScalar(scale));
}
function leftTrans(direction){
	return new THREE.Vector3(direction.z,0,-direction.x);
}
function rightTrans(direction){
	return new THREE.Vector3(-direction.z,0,direction.x);
}
function forwardTrans(direction){
	return new THREE.Vector3(direction.x,0,direction.z);
}
function backwardTrans(direction){
	return new THREE.Vector3(-direction.x,0,-direction.z);
}
function goUp(scale=1){
	return gravity.direction.clone().multiplyScalar(-2*scale);
}
function goDown(){
	return gravity.direction.clone();
}
function spiritDrop(mesh,scale){
	if(mesh.position.y>=spirit.tall){
		mesh.position.y -=1*scale;
	}
}

function playIfNotRun(action,condition){
	if(condition){
		if(!action.isRunning()){
			action.stop();
			action.play();
		}	
	}else{
		if(!action.isRunning()){
			action.stop();
		}
	}
}
