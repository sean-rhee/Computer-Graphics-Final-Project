class Cylinder extends Drawable {
	static vertexPositions = [];
	static vertexColors = [];
	static indices = [];

	static shaderProgram = -1;

	static positionBuffer = -1;
	static colorBuffer = -1;
	static indexBuffer = -1;

	static aPositionShader = -1;
	static aColorShader = -1;

	static uModelMatrixShader = -1;
	static uCameraMatrixShader = -1;
	static uProjectionMatrixShader = -1;

	static size = 30;

	static initialize() {
		Cylinder.shaderProgram = initShaders(gl, "/vshaderFlat.glsl", "/fshaderFlat.glsl");

		//Parametric vertex points
		for (var x = 0; x < this.size; x++) {
			for (var z = 0; z <= this.size; z++) {
				//var xRad = x * (Math.PI / 180);
				//var zRad = z * (Math.PI / 180);
				var xRad = (360 / this.size) * x * (Math.PI / 180);
				var zRad = (360 / this.size) * z * (Math.PI / 180);
				var v = vec3((4+2*Math.cos(zRad)) * Math.cos(xRad), (4+2*Math.cos(zRad))*Math.sin(xRad), 2*Math.sin(zRad));
				//var v = vec3(x,0,z);

				Cylinder.vertexPositions.push(v);
				Cylinder.vertexColors.push(vec4(Math.random(), Math.random(), Math.random(), 1));
			}
		}
		for (var x = 0; x < this.size - 1; x++) {
			for (var z = 0; z <= this.size - 1; z++) {
				Cylinder.indices.push(z + x * this.size);
				Cylinder.indices.push(z + x * this.size + 1);
				Cylinder.indices.push(z + (x + 1) * this.size);

				Cylinder.indices.push(z + x * this.size + 1);
				Cylinder.indices.push(z + (x + 1) * this.size);
				Cylinder.indices.push(z + (x + 1) * this.size + 1);
			}
		}
		
		for (var z = 0; z < this.size - 1; z++) {
			Cylinder.indices.push(this.size * (this.size-1) + z);
			Cylinder.indices.push(this.size * (this.size-1) + z + 1);
			Cylinder.indices.push(z);

			Cylinder.indices.push(z + 1);
			Cylinder.indices.push(this.size * (this.size-1) + z + 1);
			Cylinder.indices.push(z);
		}

		//Cylinder.vertexPositions.push(Cylinder.vertexPositions[0]);
		//console.log(Cylinder.vertexPositions);

		// Load the data into the GPU
		Cylinder.positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, Cylinder.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(Cylinder.vertexPositions), gl.STATIC_DRAW);

		Cylinder.colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, Cylinder.colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(Cylinder.vertexColors), gl.STATIC_DRAW);

		Cylinder.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cylinder.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(Cylinder.indices), gl.STATIC_DRAW);

		// Associate our shader variables with our data buffer
		Cylinder.aPositionShader = gl.getAttribLocation(Cylinder.shaderProgram, "aPosition");
		Cylinder.aColorShader = gl.getAttribLocation(Cylinder.shaderProgram, "aColor");

		Cylinder.uModelMatrixShader = gl.getUniformLocation(Cylinder.shaderProgram, "modelMatrix");
		Cylinder.uCameraMatrixShader = gl.getUniformLocation(Cylinder.shaderProgram, "cameraMatrix");
		Cylinder.uProjectionMatrixShader = gl.getUniformLocation(Cylinder.shaderProgram, "projectionMatrix");
	}

	constructor(tx, ty, tz, scale, rotX, rotY, rotZ) {
		super(tx, ty, tz, scale, rotX, rotY, rotZ);
		if (Cylinder.shaderProgram == -1) {
			Cylinder.initialize();
		}
	}

	draw() {

		gl.useProgram(Cylinder.shaderProgram);

		gl.bindBuffer(gl.ARRAY_BUFFER, Cylinder.positionBuffer);
		gl.vertexAttribPointer(Cylinder.aPositionShader, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, Cylinder.colorBuffer);
		gl.vertexAttribPointer(Cylinder.aColorShader, 4, gl.FLOAT, false, 0, 0);

		gl.uniformMatrix4fv(Cylinder.uModelMatrixShader, false, flatten(this.modelMatrix));
		gl.uniformMatrix4fv(Cylinder.uCameraMatrixShader, false, flatten(camera1.cameraMatrix));
		gl.uniformMatrix4fv(Cylinder.uProjectionMatrixShader, false, flatten(camera1.projectionMatrix));

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cylinder.indexBuffer);

		gl.enableVertexAttribArray(Cylinder.aPositionShader);
		gl.enableVertexAttribArray(Cylinder.aColorShader);
		gl.drawElements(gl.TRIANGLES, Cylinder.indices.length, gl.UNSIGNED_INT, 0);
		//gl.drawArrays( gl.TRIANGLES, 0, Cylinder.vertexPositions.length);
		gl.disableVertexAttribArray(Cylinder.aPositionShader);
		gl.disableVertexAttribArray(Cylinder.aColorShader);
	}
}

