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
		var angleRads = look * (Math.PI / 180);
		this.v = normalize(subtract(mult(Math.cos(angleRads), this.v), mult(Math.sin(angleRads), this.n)));
		this.n = normalize(add(mult(Math.sin(angleRads), this.v), mult(Math.cos(angleRads), this.n)));
		this.updateCameraMatrix();
	}
	lookHorizontal(look) {
		var angleRads = look * (Math.PI / 180);
		this.u = normalize(subtract(mult(Math.cos(angleRads), this.u), mult(Math.sin(angleRads), this.n)));
		this.n = normalize(add(mult(Math.sin(angleRads), this.u), mult(Math.cos(angleRads), this.n)));
		this.updateCameraMatrix();
	}
	roll(roll) {
		var angleRads = roll * (Math.PI / 180);
		this.v = normalize(subtract(mult(Math.cos(angleRads), this.v), mult(Math.sin(angleRads), this.u)));
		this.u = normalize(add(mult(Math.sin(angleRads), this.v), mult(Math.cos(angleRads), this.u)));
		this.updateCameraMatrix();
	}
}

var camera1 = new Camera(vec3(0, 2, 4), vec3(1, 0, 0), vec3(0, 1, 0), vec3(0, 0, 1));
var camera2 = new Camera(vec3(-4.5, 3.5, 3), normalize(vec3(1, 0, 1)), normalize(vec3(0, 1, -1)), vec3(0, 0, 1));
// var light1 = new Light(vec3(0, 0, 0), vec3(0, 1, -1), vec4(0.4, 0.4, 0.4, 1.0), vec4(1, 1, 1, 1), vec4(1, 1, 1, 1), 0, 0, 1);
var light1 = new Light(vec3(10, 0, 0), vec3(-1, 0, 0), vec4(0.4, 0.4, 0.4, 1.0), vec4(1, 1, 1, 1), vec4(1, 1, 1, 0), 0, 0, 1);
var light2 = new Light(vec3(0, 2, 5), normalize(vec3(0, -1, -1)), vec4(0.4, 0.4, 0.4, 1.0), vec4(1, 1, 1, 1), vec4(1, 1, 1, 1), 15, (30 * Math.PI) / 180,1);

class Drawable {
	constructor(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh) {
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

	updateModelMatrix() {
		let t = translate(this.tx, this.ty, this.tz);

		let s = scale(this.scale, this.scale, this.scale);

		let rx = rotateX(this.modelRotationX);
		let ry = rotateY(this.modelRotationY);
		let rz = rotateZ(this.modelRotationZ);

		this.modelMatrix = mult(t, mult(s, mult(rz, mult(ry, rx))));
	}

	getModelMatrix() {
		return this.modelMatrix;
	}

	setModelMatrix(mm) {
		this.modelMatrix = mm;
	}
}

var tri;
var subdividedPlane;
var skybox;
var creepyWall1, creepyWall2, creepyWall3, creepyWall4;
var door1, door2;
var cylinder;
var grassPlane;
var box;

window.onload = function init() {
	canvas = document.getElementById("gl-canvas");
	gl = canvas.getContext('webgl2');
	if (!gl) { alert("WebGL 2.0 isn't available"); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

	var pos = vec3(0, 0, 0);
	var rot = vec3(0, 0, 0);
	var scale = 1.0;
	var amb = vec4(0.5, 0.5, 0.5, 1.0);
	var dif = vec4(0.5, 0.5, 0.2, 1.0);
	var spec = vec4(0.5, 1.0, 1.0, 1.0);
	var shine = 100.0
	tri = new Plane(pos[0], pos[1], pos[2], scale, rot[0], rot[1], rot[2], amb, dif, spec, shine);
	skybox = new Skybox(pos[0], pos[1], pos[2], scale + 3, rot[0], rot[1]+90, rot[2], amb, dif, spec, shine);
	cylinder = new Cylinder(pos[0]+3, pos[1] + 1, pos[2], scale*.1, rot[0], rot[1], rot[2], amb, dif, spec, shine);

	//Messy lighting LOL
	subdividedPlane = new SubdividedPlane(pos[0] , pos[1] + .1, pos[2] , scale*.2, rot[0], rot[1], rot[2], vec4(0.5, 0.5, 0.5, 1.0), vec4(0.5, 0.5, 0.2, 1.0), vec4(0.5, 0.5, 0.5, 0.5), 1);
	// subdividedPlane2 = new SubdividedPlane(pos[0] , pos[1] + .1, pos[2] + 2, scale*.2, rot[0], rot[1]+45, rot[2], vec4(0.2, 0.2, 0.2, 1.0), vec4(0.6, 0.1, 0.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0), 1);
	// subdividedPlane3 = new SubdividedPlane(pos[0] , pos[1] + .1, pos[2] + 3, scale*.2, rot[0], rot[1], rot[2], vec4(0.2, 0.2, 0.2, 1.0), vec4(0.6, 0.1, 0.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0), 1);
	// subdividedPlane4 = new SubdividedPlane(pos[0] + 6, pos[1] + .1, pos[2] - 5, scale, rot[0], rot[1], rot[2], amb, dif, spec, shine);
	// subdividedPlane5 = new SubdividedPlane(pos[0] + 8.75, pos[1] + .1, pos[2] + 5.5, scale, rot[0], rot[1] - 90, rot[2], amb, dif, spec, shine);
	// subdividedPlane6 = new SubdividedPlane(pos[0] + 8.75, pos[1] + .1, pos[2] + 4, scale, rot[0], rot[1] - 90, rot[2], amb, dif, spec, shine);

	//Left Walls
	LeftDoorLeftWall = new CreepyWall(pos[0]-1,pos[1],pos[2]+3,scale+1,rot[0],rot[1]+90,rot[2],amb,dif,spec,shine);
	LeftDoorRightWall = new CreepyWall(pos[0]-1,pos[1],pos[2]-2,scale+1,rot[0],rot[1]+90,rot[2],amb,dif,spec,shine);
	LeftBackWall = new CreepyWall(pos[0]-5,pos[1],pos[2]+1,scale+1,rot[0],rot[1]+90,rot[2],amb,dif,spec,shine);
	LeftRightWall = new CreepyWall(pos[0]-3,pos[1],pos[2]-1,scale+1,rot[0],rot[1],rot[2],amb,dif,spec,shine); 
	LeftLeftWall = new CreepyWall(pos[0]-3,pos[1],pos[2]+3,scale+1,rot[0],rot[1],rot[2],amb,dif,spec,shine);
	LeftRoof = new CreepyWall(pos[0]-3,pos[1]+4,pos[2]-1,scale+1,rot[0]+90,rot[1],rot[2],amb,dif,spec,shine);

	//Right Walls 
	RightDoorRightWall = new CreepyWall(pos[0]+1,pos[1],pos[2]+3,scale+1,rot[0],rot[1]+90,rot[2],amb,dif,spec,shine);
	RightDoorLeftWall = new CreepyWall(pos[0]+1,pos[1],pos[2]-2,scale+1,rot[0],rot[1]+90,rot[2],amb,dif,spec,shine);
	RightBackWall = new CreepyWall(pos[0]+5,pos[1],pos[2]+1,scale+1,rot[0],rot[1]+90,rot[2],amb,dif,spec,shine);
	RightRightWall = new CreepyWall(pos[0]+3,pos[1],pos[2]-1,scale+1,rot[0],rot[1],rot[2],amb,dif,spec,shine); 
	RightLeftWall = new CreepyWall(pos[0]+3,pos[1],pos[2]+3,scale+1,rot[0],rot[1],rot[2],amb,dif,spec,shine); 
	RightRoof = new CreepyWall(pos[0]+3,pos[1]+4,pos[2]-1,scale+1,rot[0]+90,rot[1],rot[2],amb,dif,spec,shine);

	BackWall1 = new CreepyWall(pos[0]-2.5,pos[1],pos[2]-4,scale+1,rot[0],rot[1],rot[2],amb,dif,spec,shine);
	BackWall2 = new CreepyWall(pos[0]+2.5,pos[1],pos[2]-4,scale+1,rot[0],rot[1],rot[2],amb,dif,spec,shine);

	FrontWall = new CreepyWall(pos[0],pos[1],pos[2]+5,scale+1,rot[0],rot[1],rot[2],amb,dif,spec,shine)

	cow = new Cow3D(pos[0]-3,pos[1]+1,pos[2]+1,3,0,0,0,"./cow")
	teddybear = new TeddyBear3D(pos[0]-.25,pos[1]+1.5,pos[2]-10,.05,0,0,0,"./teddybear")

	door1 = new Door3D(pos[0]-1.5,pos[1],pos[2],scale,rot[0],rot[1],rot[2],amb,dif,spec,shine);
	door2 = new Door3D(pos[0]+1.5,pos[1],pos[2],scale,rot[0],rot[1]-180,rot[2],amb,dif,spec,shine);
	door3 = new Door3D(pos[0],pos[1],pos[2]-4,scale,rot[0],rot[1],rot[2],amb,dif,spec,shine);

	grassPlane = new GrassPlane(pos[0], pos[1], pos[2]-10, scale, rot[0], rot[1], rot[2], amb, dif, spec, shine);
	box = new Box(pos[0]+2, pos[1]+1, pos[2]-9, scale*.05, rot[0], rot[1], rot[2], amb, dif, spec, shine);
	box2 = new Box(pos[0]+2, pos[1]+2, pos[2]-9, scale*.05, rot[0], rot[1], rot[2], amb, dif, spec, shine)
	box3 = new Box(pos[0]-3, pos[1]+1, pos[2]-8, scale*.05, rot[0], rot[1], rot[2], amb, dif, spec, shine)
	box4 = new Box(pos[0]-3, pos[1]+1, pos[2]-7, scale*.05, rot[0], rot[1], rot[2], amb, dif, spec, shine)
    
    render();
};

var currentCamera = 1;
var tempCamera;

window.addEventListener("keydown", moveCamera);
function moveCamera(event) {
	// console.log(event.code)
	if (currentCamera == 1) {
		switch (event.code) {
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
				camera1.lookHorizontal(2);
				break;
			case "ArrowRight":
				camera1.lookHorizontal(-2);
				break;
			case "ArrowUp":
				camera1.lookVertical(-2);
				event.preventDefault();
				break;
			case "ArrowDown":
				camera1.lookVertical(2);
				event.preventDefault();
				break;
			case "ShiftLeft":
				camera1.moveZ(-0.3);
				break;
			case "Space":
				camera1.moveZ(0.3);
				event.preventDefault();
				break;
			case "KeyZ":
				camera1.roll(-1);
				break;
			case "KeyX":
				camera1.roll(1);
				break;
			case "Enter":
				if (currentCamera == 1) {
					currentCamera = 2;
					tempCamera = camera1;
					camera1 = camera2;
				}
				else {
					currentCamera = 1;
					camera2 = camera1;
					camera1 = tempCamera;
				}
		}
	}
	else {
		if (event.code == "Enter") {
			if (currentCamera == 1) {
				currentCamera = 2;
				tempCamera = camera1;
				camera1 = camera2;
			}
			else {
				currentCamera = 1;
				camera2 = camera1;
				camera1 = tempCamera;
			}
		}
	}
}

var sunX = 4;
var sunY = 1;
var day = true;
var rise = true;

var theta = 0
var teddy = -10 
function render(){
	theta += .5;
    setTimeout(function(){
	requestAnimationFrame(render);
		if (day) {
			sunX -= .25;
			sunY += .25;
			if (sunX == 0) {
				day = false;
			}
		}
		else {
			sunX += .25;
			sunY += .25;
			if (sunX >= 4) {
				day = true;
				sunY = 1;
			}
		}
		var sunPos = vec3(sunX*20, sunY*20, 0);
		switch (sunY) {
			case 1:
				light1.direction = vec3(-1*20, 0, 0);
				break;
			case 2:
				light1.direction = vec3(-1*20, -1*20, 0);
				break;
			case 3:
				light1.direction = vec3(0, -1*20, 0);
				break;
			case 4:
				light1.direction = vec3(1*20, -1*20, 0);
				break;
			case 5:
				light1.direction = vec3(1*20, 0, 0);
				break;
			case 6:
				light1.direction = vec3(1*20, 1*20, 0);
				break;
			case 7:
				light1.direction = vec3(0, 1*20, 0);
				break;
			case 8:
				light1.direction = vec3(-1*20, 1*20, 0);
				break;

		}
		light1.location = sunPos;
    	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        tri.draw();
		// gl.disable(gl.DEPTH_TEST);
		skybox.draw();
		// gl.enable(gl.DEPTH_TEST);

		subdividedPlane.draw();
		// subdividedPlane2.draw();
		// subdividedPlane3.draw();
		// subdividedPlane4.draw();
		// subdividedPlane5.draw();
		// subdividedPlane6.draw();

		door1.draw();
		door2.draw();
		door3.draw();
		cow.draw();

		cow.modelRotationY = theta;
		cow.updateModelMatrix();

		cylinder.draw();
		cylinder.modelRotationZ = theta*5;
		cylinder.updateModelMatrix();

		RightLeftWall.draw();
		RightRightWall.draw();
		RightBackWall.draw();
		RightDoorLeftWall.draw();
		RightDoorRightWall.draw();
		RightRoof.draw();

		LeftDoorRightWall.draw();
		LeftDoorLeftWall.draw();
		LeftBackWall.draw();
		LeftRightWall.draw();
		LeftLeftWall.draw();
		LeftRoof.draw();
		BackWall1.draw();
		BackWall2.draw();
		FrontWall.draw();

		// console.log("vrp", camera1.vrp)
		// console.log("u", camera1.u)
		// console.log("v", camera1.v)
		// console.log("n", camera1.n)

		if (camera1.vrp[2] < -4){
			teddybear.draw()

			teddybear.tz = teddy;
			teddybear.updateModelMatrix();

			teddy += .07;
		}
		if (door3.modelRotationY > -90 && camera1.vrp[2] < -1) {
			door3.modelRotationY -= 5;
			door3.tx += .0275;
			door3.tz -= .0275;
			door3.updateModelMatrix();
		}

		grassPlane.draw();
		box.draw();
		box2.draw();
		box3.draw();
		box4.draw();
    });  //10fps
}


