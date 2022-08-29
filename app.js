var canvas;
var gl;
var angle = 0.0;

class Light{
    constructor(loc,dir,amb,sp,dif,alpha,cutoff,type){
    	this.location = loc;
    	this.direction = dir;
    	this.ambient = amb;
    	this.specular = sp;
    	this.diffuse = dif;
    	this.alpha = alpha;
    	this.cutoff = cutoff;
    	this.type = type;
    	this.status = 1;
    }
    turnOff(){this.status = 0;}
       
    turnOn(){this.status = 1;}
}

class Camera{
    constructor(vrp,u,v,n){
    	this.vrp = vrp;
    	this.u = normalize(u);
    	this.v = normalize(v);
    	this.n = normalize(n);
    	
    	this.projectionMatrix = perspective(90.0,1.0,0.1,100);
    	
    	this.updateCameraMatrix();
    }
    
    updateCameraMatrix(){
    	let t = translate(-this.vrp[0],-this.vrp[1],-this.vrp[2]);
    	let r = mat4(this.u[0], this.u[1], this.u[2], 0,
    		this.v[0], this.v[1], this.v[2], 0,
    		this.n[0], this.n[1], this.n[2], 0,
    		0.0, 0.0, 0.0, 1.0);
    	this.cameraMatrix = mult(r,t);
    }
    
    getModelMatrix(){
    	return this.modelMatrix;
    }
    
    setModelMatrix(mm){
    	this.modelMatrix = mm;
    }
	moveX(move) {
		this.vrp[0] += move;
		this.updateCameraMatrix();
	}
	moveY(move) {
		this.vrp[2] += move;
		this.updateCameraMatrix();
	}
	moveZ(move) {
		this.vrp[1] += move;
		this.updateCameraMatrix();
	}
	lookVertical(look) {
		var angleRads = look * (Math.PI/180);
		this.v = normalize(subtract(mult(Math.cos(angleRads), this.v), mult(Math.sin(angleRads), this.n)));
		this.n = normalize(add(mult(Math.sin(angleRads), this.v), mult(Math.cos(angleRads), this.n)));
		this.updateCameraMatrix();
	}
	lookHorizontal(look) {
		var angleRads = look * (Math.PI/180);
		this.u = normalize(subtract(mult(Math.cos(angleRads), this.u), mult(Math.sin(angleRads), this.n)));
		this.n = normalize(add(mult(Math.sin(angleRads), this.u), mult(Math.cos(angleRads), this.n)));
		this.updateCameraMatrix();
	}
	roll(roll) {
		var angleRads = roll * (Math.PI/180);
		this.v = normalize(subtract(mult(Math.cos(angleRads), this.v), mult(Math.sin(angleRads), this.u)));
		this.u = normalize(add(mult(Math.sin(angleRads), this.v), mult(Math.cos(angleRads), this.u)));
		this.updateCameraMatrix();
	}
}

var camera1 = new Camera(vec3(0,2,5), vec3(1,0,0), vec3(0,1,0), vec3(0,0,1));
var light1 = new Light(vec3(0,0,0),vec3(0,1,-1),vec4(0.4,0.4,0.4,1.0), vec4(1,1,1,1), vec4(1,1,1,1),0,0,1);

class Drawable{
    constructor(tx,ty,tz,scale,rotX, rotY, rotZ, amb, dif, sp, sh){
    	this.tx = tx;
    	this.ty = ty;
    	this.tz = tz;
    	this.scale = scale;
    	this.modelRotationX = rotX;
    	this.modelRotationY = rotY;
    	this.modelRotationZ = rotZ;
    	this.updateModelMatrix();
    	
    	this.matAmbient = amb;
    	this.matDiffuse = dif;
    	this.matSpecular = sp;
    	this.matAlpha = sh;
    	
    	
    }
    	
    updateModelMatrix(){
        let t = translate(this.tx, this.ty, this.tz);		     
	   		     
    	let s = scale(this.scale,this.scale,this.scale);
    	
    	let rx = rotateX(this.modelRotationX);
    	let ry = rotateY(this.modelRotationY);
    	let rz = rotateZ(this.modelRotationZ);
	
	this.modelMatrix = mult(t,mult(s,mult(rz,mult(ry,rx))));
    }
    
    getModelMatrix(){
    	return this.modelMatrix;
    }
    
    setModelMatrix(mm){
    	this.modelMatrix = mm;
    }    
}

var tri;

window.onload = function init(){
    canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    var pos = vec3(0,0,0);
    var rot = vec3(0,0,0);
    var scale = 1.0;
    var amb = vec4(0.2,0.2,0.2,1.0);
    var dif = vec4(0.6,0.1,0.0,1.0);
    var spec = vec4(1.0,1.0,1.0,1.0);
    var shine = 100.0
    tri = new Plane(pos[0],pos[1],pos[2],scale,rot[0],rot[1],rot[2],amb,dif,spec,shine);
    
    render();
};

window.addEventListener("keydown", moveCamera);
function moveCamera(event) {
	switch(event.code) {
		case "KeyW":
			camera1.moveY(-0.3);
			break;
		case "KeyS":
			camera1.moveY(0.3);
			break;
		case "KeyA":
			camera1.moveX(-0.3);
			break;
		case "KeyD":
			camera1.moveX(0.3);
			break;
		case "ArrowLeft":
			camera1.lookHorizontal(1);
			break;
		case "ArrowRight":
			camera1.lookHorizontal(-1);
			break;
		case "ArrowUp":
			camera1.lookVertical(-1);
			break;
		case "ArrowDown":
			camera1.lookVertical(1);
			break;
		case "ShiftLeft":
			camera1.moveZ(-0.3);
			break;
		case "Space":
			camera1.moveZ(0.3);
			break;
		case "KeyZ":
			camera1.roll(-1);
			break;
		case "KeyX":
			camera1.roll(1);
			break;
	}
}


function render(){
    setTimeout(function(){
	requestAnimationFrame(render);
    	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        tri.draw();
    }, 100 );  //10fps
}


