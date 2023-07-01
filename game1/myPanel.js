var myPanel = function(){
	//ax:absolute direction x
	var container = document.createElement('div');
	container.style.cssText = 'pointer-events:none;position:fixed;top:0;left:0;opacity:0.8;z-index:1200;color:aqua;';
	container.addEventListener('click',(e)=>{
		e.preventDefault();
	});
	var canvas = document.createElement('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	container.appendChild(canvas);
	var ctx = canvas.getContext('2d');
	function addDom(dom){
		container.appendChild(dom);
		return panel;
	}
	function clear(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
	}
	function rectangle(startx,starty,width,height,color){
		ctx.fillStyle=color;
		ctx.fillRect(startx,starty,width,height); 
	}
	function useImg(imgsrc){
		var img = new Image(imgsrc);
		ctx.drawImage(img);
	}
	function useText(text){
		container.innerText=text;
	}
	function addText(text){
		container.innerText+=text;
	}
	return {
		dom:container,
		ctx:ctx,
		addDom:addDom,
		useImg:useImg,
		useText:useText,
		clear:clear,
		addText:addText,
		rectangle:rectangle,
	};
}

function BloodTrough(){
	var panel = myPanel();
	var ext = {};
	ext.life = 100;
	ext.update = function (){
		panel.clear();
		panel.rectangle(100,0,ext.life*10,30,'#FF0000');
	};
	return Object.assign(panel,ext);
}
