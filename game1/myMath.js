function towardsxyz(t,a){
	//theta,alpha=>towards:vec3
	let tt = Math.tan(t);
	let ta = Math.tan(a);
  let x=Math.sqrt(1/(tt**2+ta**2*tt**2+ta**2+1));
  let tmptheta = t;
  if(t<0){
    tmptheta *= -1;
  }
  if(tmptheta*2>=Math.PI&&tmptheta*2<=3*Math.PI){
    x*=-1;
  }
	let z=-x*tt;
	let y=ta*Math.sqrt(x**2+z**2);
	let tmpalpha = a;
	if(tmpalpha*2>=Math.PI&&tmpalpha*2<=3*Math.PI){
		y*=-1;
	}
	var vec3= new THREE.Vector3(x,y,z);
	return vec3;
}
function faceProject(direction,normal){
	if(direction.dot(normal)>=0){//get away from the face or parallel
		return direction;
	}
	//note that this.cross(v) change this!so we clone first
	let dxn = direction.clone().cross(normal);
	let nxdxnNormal = normal.cross(dxn).normalize();
	return nxdxnNormal.multiplyScalar(direction.dot(nxdxnNormal));
}
function vecAngle(v1,v2){
	return v1.dot(v2)/(v1.length()*v2.length());
}
