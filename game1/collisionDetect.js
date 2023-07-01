var collidableMeshList=[];
function checkCollision(moveObj){
	var originPoint = moveObj.position.clone();
	log.useText('...');
	var iscollision= false;
	var normals = [];
	for(var i=0;i<moveObj.geometry.vertices.length;i++){
		var localVertex = moveObj.geometry.vertices[i].clone();
		var globalVertex = localVertex.applyMatrix4(moveObj.matrix);
		var directionVector = globalVertex.sub(moveObj.position);
		var ray = new THREE.Raycaster(originPoint,directionVector.clone().normalize(),0,50);//set near far to optimize
		var collisionResult = ray.intersectObjects(collidableMeshList);
		if(collisionResult.length>0&&collisionResult[0].distance<directionVector.length()){
			iscollision = true;
			log.addText('hit! ');
			if(collisionResult[0].face){
				var normal = collisionResult[0].face.normal;
				log.addText(`normal:${normal.x} ${normal.y} ${normal.z}\n`);
				normals.push(normal);
			}
		}
	}
	return {
		iscollision:iscollision,
		normals:normals,
	};
}
