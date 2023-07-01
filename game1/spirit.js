var spirit={
	initx:0,
	inity:40,
	initz:-80,
	tall:1,
	scale:0.3,
	theta:Math.PI/2,
	rotateOffsetY:0,//Math.PI/2
	viewdis:6,
	rotateSensitive:0.0001,
	mode:'tps',
	modeSet:function (m){
		this.mode=m;
		switch (m){
			case 'fps':
				this.tall=0.3;
				this.viewdis=0.3;
				this.mesh.children[0].visible=false;
				break;
			case 'tps':
				this.tall=1;
				this.viewdis=5;
				this.mesh.children[0].visible=true;
				break;	
		}
	},
	switchlight:function (){
		if(spirit.mesh.children[1]){
			if(spirit.mesh.children[1].visible==false){
				spirit.mesh.children[1].visible=true;
				setTimeout(()=>{
					spirit.mesh.children[1].visible=false;
				},5000);//after 5s close light
			}else{
				spirit.mesh.children[1].visible=false;
			}
		}
	},

	status:new Map(),
};
function initSpirit(){
	var geometry=new THREE.BoxGeometry(2,2.5,4);
	var material = new THREE.MeshBasicMaterial({
		color:0xaaaa00,visible:false,
	});
	var cube = new THREE.Mesh(geometry,material);
	cube.position.set(spirit.initx,spirit.inity,spirit.initz);
	spirit.mesh=cube;
	scene.add(spirit.mesh);
	var loader = new THREE.GLTFLoader();
	loader.load("snowCow/snowCow.gltf",(e)=>{
		console.log(e);
		cow = e.scene.children[0];
		//cow.scale.set(1,1,1);
		cow.position.set(0,0,2)
		cow.scale.set(1,1,1);
		cow.rotateX(-Math.PI/2);
		//animation
		mixer = new THREE.AnimationMixer(cow);
		var clips = e.animations;
		var walk = THREE.AnimationClip.findByName(clips,'walk');
		var jump = THREE.AnimationClip.findByName(clips,'jump');
		var slide = THREE.AnimationClip.findByName(clips,'slide');
		var attack = THREE.AnimationClip.findByName(clips,'attack');

		walkAction = mixer.clipAction(walk);
		jumpAction = mixer.clipAction(jump);
		slideAction = mixer.clipAction(slide);
		attackAction = mixer.clipAction(attack);

		walkAction.setLoop(THREE.LoopRepeat);
		walkAction.repetitions=1;
		jumpAction.setLoop(THREE.LoopRepeat);
		jumpAction.repetitions=1;
		slideAction.setLoop(THREE.LoopRepeat);
		slideAction.repetitions=1;
		attackAction.setLoop(THREE.LoopRepeat);
		attackAction.repetitions=1;

		spirit.mesh.add(cow);
		let light = new THREE.PointLight(0xff8800,0.4,100);
		spirit.mesh.add(light);//children[1]=>light
		light.visible=false;
		log.useText('model load finished!');
		document.getElementById('startbtn').disabled=false;
	},undefined,(e)=>{
		console.error(e);
	});
}
