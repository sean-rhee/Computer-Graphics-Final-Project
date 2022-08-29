class Door3D extends Drawable {
    static vertexPositions = [
        vec3(-.5, 4, 0),
        vec3(.5, 4, 0),
        vec3(.5, 0, 0),
        vec3(-.5, 0, 0),
    ];

    static vertexTextureCoords = [
        vec2(0, 0),
        vec2(1, 0),
        vec2(1, 1),
        vec2(0, 1),
    ];

    vertexNormals = []

    static indices = [
        0, 1, 2,
        0, 2, 3
    ];

    static positionBuffer = -1;
    static textureCoordBuffer = -1;
    static indexBuffer = -1;
    static normalBuffer = -1;

    static shaderProgram = -1;
    static aPositionShader = -1;
    static aTextureCoordShader = -1;
    static aNormalShader = -1;

    static uModelMatrixShader = -1;
    static uCameraMatrixShader = -1;
    static uProjectionMatrixShader = -1;

    static texture = -1;
    static uTextureUnitShader = -1;

    // static uMatAmbientShader = -1;
    // static uMatDiffuseShader = -1;
    // static uMatSpecularShader = -1;
    // static uMatAlphaShader = -1;

    // static uLightDirectionShader = -1;
    // static uLightStatusShader = -1;
    // static uLightAmbientShader = -1;
    // static uLightDiffuseShader = -1;
    // static uLightSpecularShader = -1;
    // static uLightAlphaShader = -1;
    // static uLightCutoffShader = -1;

    // static computeNormals() {
    //     var normalSum = [];
    //     var counts = [];

    //     //initialize sum of normals for each vertex and how often its used.
    //     for (var i = 0; i < Door3D.vertexPositions.length; i++) {
    //         normalSum.push(vec3(0, 0, 0));
    //         counts.push(0);
    //     }

    //     //for each triangle
    //     for (var i = 0; i < Door3D.indices.length; i += 3) {
    //         var a = Door3D.indices[i];
    //         var b = Door3D.indices[i + 1];
    //         var c = Door3D.indices[i + 2];

    //         var edge1 = subtract(Door3D.vertexPositions[b], Door3D.vertexPositions[a]);
    //         var edge2 = subtract(Door3D.vertexPositions[c], Door3D.vertexPositions[b]);
    //         var N = cross(edge1, edge2);

    //         normalSum[a] = add(normalSum[a], normalize(N));
    //         counts[a]++;
    //         normalSum[b] = add(normalSum[b], normalize(N));
    //         counts[b]++;
    //         normalSum[c] = add(normalSum[c], normalize(N));
    //         counts[c]++;
    //     }

    //     for (var i = 0; i < Door3D.vertexPositions.length; i++)
    //         this.vertexNormals[i] = mult(1.0 / counts[i], normalSum[i]);
    // }


    static initialize() {
        // Door3D.computeNormals();
        Door3D.shaderProgram = initShaders(gl, "/vshader.glsl", "/fshader.glsl");

        // Load the data into the GPU
        Door3D.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Door3D.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Door3D.vertexPositions), gl.STATIC_DRAW);

        Door3D.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Door3D.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Door3D.vertexTextureCoords), gl.STATIC_DRAW);
        Door3D.uTextureUnitShader = gl.getUniformLocation(Door3D.shaderProgram, "uTextureUnit");

        // Door3D.normalBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, Door3D.normalBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(Door3D.vertexNormals), gl.STATIC_DRAW);

        Door3D.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Door3D.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(Door3D.indices), gl.STATIC_DRAW);

        // Associate our shader variables with our data buffer
        Door3D.aPositionShader = gl.getAttribLocation(Door3D.shaderProgram, "aPosition");
        Door3D.aTextureCoordShader = gl.getAttribLocation(Door3D.shaderProgram, "aTextureCoord");

        Door3D.uModelMatrixShader = gl.getUniformLocation(Door3D.shaderProgram, "modelMatrix");
        Door3D.uCameraMatrixShader = gl.getUniformLocation(Door3D.shaderProgram, "cameraMatrix");
        Door3D.uProjectionMatrixShader = gl.getUniformLocation(Door3D.shaderProgram, "projectionMatrix");

        // Door3D.uMatAmbientShader = gl.getUniformLocation(Door3D.shaderProgram, "matAmbient");
        // Door3D.uMatDiffuseShader = gl.getUniformLocation(Door3D.shaderProgram, "matDiffuse");
        // Door3D.uMatSpecularShader = gl.getUniformLocation(Door3D.shaderProgram,"matSpecular");
        // Door3D.uMatAlphaShader = gl.getUniformLocation(Door3D.shaderProgram,"matAlpha");
        // Door3D.uLightDirectionShader = gl.getUniformLocation(Door3D.shaderProgram,"lightDirection");
        // Door3D.uLightAlphaShader = gl.getUniformLocation(Door3D.shaderProgram,"lightAlpha");
        // Door3D.uLightCutoffShader = gl.getUniformLocation(Door3D.shaderProgram,"lightCutoff");
        // Door3D.uLightStatusShader = gl.getUniformLocation(Door3D.shaderProgram,"lightStatus");
        // Door3D.uLightAmbientShader = gl.getUniformLocation(Door3D.shaderProgram,"lightAmbient");
        // Door3D.uLightDiffuseShader = gl.getUniformLocation(Door3D.shaderProgram,"lightDiffuse");
        // Door3D.uLightSpecularShader = gl.getUniformLocation(Door3D.shaderProgram,"lightSpecular");
        // Door3D.uLight1DirectionShader = gl.getUniformLocation(Door3D.shaderProgram,"light1Direction");

    }

    static initializeTexture() {
        var image = new Image();

        image.onload = function () {
            Door3D.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, Door3D.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);

            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        }

        image.src = "door.jpg";
    }

    constructor(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh) {
        super(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh);
        var size = 5;
        if (Door3D.shaderProgram == -1) {
            for (let i = 0; i < Door3D.vertexPositions.length; i++) {
                Door3D.indices.push(i);
            }
            Door3D.initialize()
            Door3D.initializeTexture();
        }

    }

    draw() {
        if (Door3D.texture == -1)  //only draw when texture is loaded.
            return;

        gl.useProgram(Door3D.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, Door3D.positionBuffer);
        gl.vertexAttribPointer(Door3D.aPositionShader, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, Door3D.textureCoordBuffer);
        gl.vertexAttribPointer(Door3D.aTextureCoordShader, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, Door3D.texture);
        gl.uniform1i(Door3D.uTextureUnitShader, 0);


        gl.uniformMatrix4fv(Door3D.uModelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(Door3D.uCameraMatrixShader, false, flatten(camera1.cameraMatrix));
        gl.uniformMatrix4fv(Door3D.uProjectionMatrixShader, false, flatten(camera1.projectionMatrix));

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Door3D.indexBuffer);

        gl.enableVertexAttribArray(Door3D.aPositionShader);
        gl.enableVertexAttribArray(Door3D.aTextureCoordShader);
        gl.drawElements(gl.TRIANGLES, Door3D.indices.length, gl.UNSIGNED_BYTE, 0);
        // gl.drawArrays(gl.TRIANGLES, 0, Door3D.vertexPositions.length);
        gl.disableVertexAttribArray(Door3D.aPositionShader);
        gl.disableVertexAttribArray(Door3D.aTextureCoordShader);
    }
}

