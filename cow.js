class Cow3D extends Drawable {
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
        Cow3D.shaderProgram = initShaders(gl, "/cowvshader.glsl", "/cowfshader.glsl");
        // Load the data into the GPU
        Cow3D.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Cow3D.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Cow3D.vertexPositions), gl.STATIC_DRAW );
        
        Cow3D.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Cow3D.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Cow3D.vertexColors), gl.STATIC_DRAW);

        Cow3D.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Cow3D.indexBuffer)
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(Cow3D.indices), gl.STATIC_DRAW );

        // Associate our shader variables with our data buffer
        Cow3D.aPositionShader = gl.getAttribLocation(Cow3D.shaderProgram, "aPosition");
        Cow3D.aColorShader = gl.getAttribLocation(Cow3D.shaderProgram, "aColor")

        Cow3D.uModelMatrixShader = gl.getUniformLocation(Cow3D.shaderProgram, "modelMatrix");
        Cow3D.uCameraMatrixShader = gl.getUniformLocation(Cow3D.shaderProgram, "cameraMatrix");
        Cow3D.uProjectionMatrixShader = gl.getUniformLocation(Cow3D.shaderProgram, "projectionMatrix");
    }

    constructor(tx, ty, tz, scale, rotX, rotY, rotZ, fname) {
        super(tx, ty, tz, scale, rotX, rotY, rotZ);

        if (Cow3D.shaderProgram == -1)

            var smf_file = loadFileAJAX(fname); 
            var lines = smf_file.split('\n');
            for (var line = 0; line < lines.length; line++) {
                var strings = lines[line].trimRight().split(' ');
                switch (strings[0]) {
                    case ('v'):
                        var v = vec3(parseFloat(strings[1]), parseFloat(strings[2]), parseFloat(strings[3]))
                        Cow3D.vertexPositions.push(v)
                        Cow3D.vertexColors.push(vec4(.58, .294, .20, 1.0))
                        break;
                    case ('f'):
                        Cow3D.indices.push(parseInt(strings[1]) - 1)
                        Cow3D.indices.push(parseInt(strings[2]) - 1)
                        Cow3D.indices.push(parseInt(strings[3]) - 1)
                        break;
                }
            }
            Cow3D.initialize()

    }

    draw() {


        gl.useProgram(Cow3D.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, Cow3D.positionBuffer);
        gl.vertexAttribPointer(Cow3D.aPositionShader, 3, gl.FLOAT, false, 0, 0);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, Cow3D.colorBuffer);
        gl.vertexAttribPointer(Cow3D.aColorShader, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, (Cow3D.indexBuffer))

        gl.uniformMatrix4fv(Cow3D.uModelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(Cow3D.uCameraMatrixShader, false, flatten(camera1.cameraMatrix));
        gl.uniformMatrix4fv(Cow3D.uProjectionMatrixShader, false, flatten(camera1.projectionMatrix));

        gl.enableVertexAttribArray(Cow3D.aColorShader);
        gl.enableVertexAttribArray(Cow3D.aPositionShader);
        gl.drawElements(gl.TRIANGLES, Cow3D.indices.length,  gl.UNSIGNED_INT, 0);
        gl.disableVertexAttribArray(Cow3D.aPositionShader);
        console.log("cow drwn")
    }
}

