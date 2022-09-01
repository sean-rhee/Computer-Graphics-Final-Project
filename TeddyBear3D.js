class TeddyBear3D extends Drawable {
    static vertexPositions = []
    static vertexColors = []
    static indices = []

    static shaderProgram = -1;
    static positionBuffer = -1;
    static colorBuffer = -1;
    static indexBuffer = -1;
    
    static indicesBuffer = -1;

    static aPositionShader = -1;
    static aColorShader = -1

    static uModelMatrixShader = -1;
    static uCameraMatrixShader = -1;
    static uProjectionMatrixShader = -1;

    static initialize() {
        TeddyBear3D.shaderProgram = initShaders(gl, "/cowvshader.glsl", "/cowfshader.glsl");
        // Load the data into the GPU
        TeddyBear3D.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, TeddyBear3D.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(TeddyBear3D.vertexPositions), gl.STATIC_DRAW );
        
        TeddyBear3D.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, TeddyBear3D.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(TeddyBear3D.vertexColors), gl.STATIC_DRAW);

        TeddyBear3D.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TeddyBear3D.indexBuffer)
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(TeddyBear3D.indices), gl.STATIC_DRAW );

        // Associate our shader variables with our data buffer
        TeddyBear3D.aPositionShader = gl.getAttribLocation(TeddyBear3D.shaderProgram, "aPosition");
        TeddyBear3D.aColorShader = gl.getAttribLocation(TeddyBear3D.shaderProgram, "aColor")

        TeddyBear3D.uModelMatrixShader = gl.getUniformLocation(TeddyBear3D.shaderProgram, "modelMatrix");
        TeddyBear3D.uCameraMatrixShader = gl.getUniformLocation(TeddyBear3D.shaderProgram, "cameraMatrix");
        TeddyBear3D.uProjectionMatrixShader = gl.getUniformLocation(TeddyBear3D.shaderProgram, "projectionMatrix");
    }

    constructor(tx, ty, tz, scale, rotX, rotY, rotZ, fname) {
        super(tx, ty, tz, scale, rotX, rotY, rotZ);

        if (TeddyBear3D.shaderProgram == -1)

            var smf_file = loadFileAJAX(fname); 
            var lines = smf_file.split('\n');
            console.log("hello")
            for (var line = 0; line < lines.length; line++) {
                var strings = lines[line].trimRight().split(' ');
                switch (strings[0]) {
                    case ('v'):
                        var v = vec3(parseFloat(strings[1]), parseFloat(strings[2]), parseFloat(strings[3]))
                        TeddyBear3D.vertexPositions.push(v)
                        TeddyBear3D.vertexColors.push(vec4(Math.random(), Math.random(), Math.random(), 1.0))

                        break;
                    case ('f'):
                        TeddyBear3D.indices.push(parseInt(strings[1]) - 1)
                        TeddyBear3D.indices.push(parseInt(strings[2]) - 1)
                        TeddyBear3D.indices.push(parseInt(strings[3]) - 1)
                        break;
                }
            }
            TeddyBear3D.initialize()

    }

    draw() {


        gl.useProgram(TeddyBear3D.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, TeddyBear3D.positionBuffer);
        gl.vertexAttribPointer(TeddyBear3D.aPositionShader, 3, gl.FLOAT, false, 0, 0);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, TeddyBear3D.colorBuffer);
        gl.vertexAttribPointer(TeddyBear3D.aColorShader, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, (TeddyBear3D.indexBuffer))

        gl.uniformMatrix4fv(TeddyBear3D.uModelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(TeddyBear3D.uCameraMatrixShader, false, flatten(camera1.cameraMatrix));
        gl.uniformMatrix4fv(TeddyBear3D.uProjectionMatrixShader, false, flatten(camera1.projectionMatrix));

        gl.enableVertexAttribArray(TeddyBear3D.aColorShader);
        gl.enableVertexAttribArray(TeddyBear3D.aPositionShader);
        gl.drawElements(gl.TRIANGLES, TeddyBear3D.indices.length,  gl.UNSIGNED_INT, 0);
        gl.disableVertexAttribArray(TeddyBear3D.aPositionShader);
        console.log("cow drwn")
    }
}

