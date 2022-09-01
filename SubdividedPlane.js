class SubdividedPlane extends Drawable {
    static vertexPositions = [];

    static indices = [];

    static vertexNormals = [];

    static shaderProgram = -1;

    static positionBuffer = -1;
    static indexBuffer = -1;
    static normalBuffer = -1;

    static aPositionShader = -1;
    static uColorFrameShader = -1;
    static aNormalShader = -1;

    static uModelMatrixShader = -1;
    static uCameraMatrixShader = -1;
    static uProjectionMatrixShader = -1;

    static uMatAmbientShader = -1;
    static uMatDiffuseShader = -1;
    static uMatSpecularShader = -1;
    static uMatAlphaShader = -1;

    static uLightDirectionShader = -1;
    static uLightAmbientShader = -1;
    static uLightDiffuseShader = -1;
    static uLightSpecularShader = -1;

    static uLightDirectionShader2 = -1;
    static uLightAmbientShader2 = -1;
    static uLightDiffuseShader2 = -1;
    static uLightSpecularShader2 = -1;

    static onShaders = true;

    static computeNormals() {
        // var normalSum = [];
        // var counts = [];

        for(var i = 0; i < this.vertexPositions.length; i++) {
            this.vertexNormals.push(vec3(0, 1, 0));
        }
    }

    static initialize() {
        SubdividedPlane.computeNormals();
        console.log(this.vertexPositions);

        // Load the data into the GPU
        SubdividedPlane.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, SubdividedPlane.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(SubdividedPlane.vertexPositions), gl.STATIC_DRAW);

        SubdividedPlane.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, SubdividedPlane.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(SubdividedPlane.vertexNormals), gl.STATIC_DRAW);

        // SubdividedPlane.indexBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SubdividedPlane.indexBuffer);
        // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(SubdividedPlane.indices), gl.STATIC_DRAW);

        SubdividedPlane.uColorFrameShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "uColor");

        // Associate our shader variables with our data buffer
        SubdividedPlane.aPositionShader = gl.getAttribLocation(SubdividedPlane.shaderProgram, "aPosition");

        SubdividedPlane.aNormalShader = gl.getAttribLocation(SubdividedPlane.shaderProgram, "aNormal");

        SubdividedPlane.uModelMatrixShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "modelMatrix");
        SubdividedPlane.uCameraMatrixShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "cameraMatrix");
        SubdividedPlane.uProjectionMatrixShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "projectionMatrix");

        SubdividedPlane.uMatAmbientShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "matAmbient");
        SubdividedPlane.uMatDiffuseShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "matDiffuse");
        SubdividedPlane.uMatSpecularShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "matSpecular");
        SubdividedPlane.uMatAlphaShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "matAlpha");

        SubdividedPlane.uLightDirectionShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightDirection");
        SubdividedPlane.uLightAmbientShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightAmbient");
        SubdividedPlane.uLightDiffuseShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightDiffuse");
        SubdividedPlane.uLightSpecularShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightSpecular");

        SubdividedPlane.uLightDirectionShader2 = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightDirection2");
        SubdividedPlane.uLightAmbientShader2 = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightAmbient2");
        SubdividedPlane.uLightDiffuseShader2 = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightDiffuse2");
        SubdividedPlane.uLightSpecularShader2 = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightSpecular2");
    }

    constructor(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh) {
        super(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh);
        var size = 5;
        if (SubdividedPlane.shaderProgram == -1) {
            var a = vec4(-size, 0, size, 1);
            var b = vec4(size, 0, size, 1);
            var c = vec4(size, 0, -size, 1);
            var d = vec4(-size, 0, -size, 1);
            this.divideQuad(a, b, c, d, 5);
            SubdividedPlane.shaderProgram = initShaders(gl, "/vshaderLight.glsl", "/fshaderLight.glsl");
            SubdividedPlane.initialize();
        }

    }

    divideQuad(a, b, c, d, depth) {
        if (depth > 0) {
            var v1 = mult(0.5, add(a, b));
            v1[3] = 1.0;
            var v2 = mult(0.5, add(b, c));
            v2[3] = 1.0;
            var v3 = mult(0.5, add(c, d));
            v3[3] = 1.0;
            var v4 = mult(0.5, add(d, a));
            v4[3] = 1.0;
            var v5 = mult(0.5, add(a, c));
            v5[3] = 1.0;
            this.divideQuad(a, v1, v5, v4, depth - 1);
            this.divideQuad(v1, b, v2, v5, depth - 1);
            this.divideQuad(v2, c, v3, v5, depth - 1);
            this.divideQuad(v3, d, v4, v5, depth - 1);
        }
        else {
            //Triangle #1
            SubdividedPlane.vertexPositions.push(a);
            SubdividedPlane.vertexPositions.push(b);
            SubdividedPlane.vertexPositions.push(c);
            //Triangle #2
            SubdividedPlane.vertexPositions.push(c);
            SubdividedPlane.vertexPositions.push(d);
            SubdividedPlane.vertexPositions.push(a);
        }
    }

    draw() {

        gl.useProgram(SubdividedPlane.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, SubdividedPlane.positionBuffer);
        gl.vertexAttribPointer(SubdividedPlane.aPositionShader, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, SubdividedPlane.normalBuffer);
        gl.vertexAttribPointer(SubdividedPlane.aNormalShader, 3, gl.FLOAT, false, 0, 0);

        gl.uniform4f(SubdividedPlane.uColorFrameShader, 0, 1, 0, 1);

        gl.uniformMatrix4fv(SubdividedPlane.uModelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(SubdividedPlane.uCameraMatrixShader, false, flatten(camera1.cameraMatrix));
        gl.uniformMatrix4fv(SubdividedPlane.uProjectionMatrixShader, false, flatten(camera1.projectionMatrix));

        gl.uniform4fv(SubdividedPlane.uMatAmbientShader, this.matAmbient);
        gl.uniform4fv(SubdividedPlane.uMatDiffuseShader, this.matDiffuse);
        gl.uniform4fv(SubdividedPlane.uMatSpecularShader, this.matSpecular);
        gl.uniform1f(SubdividedPlane.uMatAlphaShader, this.matAlpha);


        gl.uniform3fv(SubdividedPlane.uLightDirectionShader, light1.direction);
        gl.uniform4fv(SubdividedPlane.uLightAmbientShader, light1.ambient);
        gl.uniform4fv(SubdividedPlane.uLightDiffuseShader, light1.diffuse);
        gl.uniform4fv(SubdividedPlane.uLightSpecularShader, light1.specular);

        gl.uniform3fv(SubdividedPlane.uLightDirectionShader2, light2.direction);
        gl.uniform4fv(SubdividedPlane.uLightAmbientShader2, light2.ambient);
        gl.uniform4fv(SubdividedPlane.uLightDiffuseShader2, light2.diffuse);
        gl.uniform4fv(SubdividedPlane.uLightSpecularShader2, light2.specular);

        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SubdividedPlane.indexBuffer);

        gl.enableVertexAttribArray(SubdividedPlane.aPositionShader);
        gl.enableVertexAttribArray(SubdividedPlane.aNormalShader);
        gl.drawArrays(gl.TRIANGLES, 0, SubdividedPlane.vertexPositions.length);
        //gl.drawElements(gl.TRIANGLES, SubdividedPlane.indices.length, gl.UNSIGNED_BYTE, 0);
        gl.disableVertexAttribArray(SubdividedPlane.aPositionShader);
        gl.disableVertexAttribArray(SubdividedPlane.aNormalShader);
    }
}

