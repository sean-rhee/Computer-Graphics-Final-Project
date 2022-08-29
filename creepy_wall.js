class CreepyWall extends Drawable {
    static vertexPositions = [
        vec3(-1, 2, 0),
        vec3(1, 2, 0),
        vec3(1, 0, 0),
        vec3(-1, 0, 0),
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
    //     for (var i = 0; i < CreepyWall.vertexPositions.length; i++) {
    //         normalSum.push(vec3(0, 0, 0));
    //         counts.push(0);
    //     }

    //     //for each triangle
    //     for (var i = 0; i < CreepyWall.indices.length; i += 3) {
    //         var a = CreepyWall.indices[i];
    //         var b = CreepyWall.indices[i + 1];
    //         var c = CreepyWall.indices[i + 2];

    //         var edge1 = subtract(CreepyWall.vertexPositions[b], CreepyWall.vertexPositions[a]);
    //         var edge2 = subtract(CreepyWall.vertexPositions[c], CreepyWall.vertexPositions[b]);
    //         var N = cross(edge1, edge2);

    //         normalSum[a] = add(normalSum[a], normalize(N));
    //         counts[a]++;
    //         normalSum[b] = add(normalSum[b], normalize(N));
    //         counts[b]++;
    //         normalSum[c] = add(normalSum[c], normalize(N));
    //         counts[c]++;
    //     }

    //     for (var i = 0; i < CreepyWall.vertexPositions.length; i++)
    //         this.vertexNormals[i] = mult(1.0 / counts[i], normalSum[i]);
    // }


    static initialize() {
        // CreepyWall.computeNormals();
        CreepyWall.shaderProgram = initShaders(gl, "/vshader.glsl", "/fshader.glsl");

        // Load the data into the GPU
        CreepyWall.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, CreepyWall.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(CreepyWall.vertexPositions), gl.STATIC_DRAW);

        CreepyWall.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, CreepyWall.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(CreepyWall.vertexTextureCoords), gl.STATIC_DRAW);
        CreepyWall.uTextureUnitShader = gl.getUniformLocation(CreepyWall.shaderProgram, "uTextureUnit");

        // CreepyWall.normalBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, CreepyWall.normalBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(CreepyWall.vertexNormals), gl.STATIC_DRAW);

        CreepyWall.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CreepyWall.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(CreepyWall.indices), gl.STATIC_DRAW);

        // Associate our shader variables with our data buffer
        CreepyWall.aPositionShader = gl.getAttribLocation(CreepyWall.shaderProgram, "aPosition");
        CreepyWall.aTextureCoordShader = gl.getAttribLocation(CreepyWall.shaderProgram, "aTextureCoord");

        CreepyWall.uModelMatrixShader = gl.getUniformLocation(CreepyWall.shaderProgram, "modelMatrix");
        CreepyWall.uCameraMatrixShader = gl.getUniformLocation(CreepyWall.shaderProgram, "cameraMatrix");
        CreepyWall.uProjectionMatrixShader = gl.getUniformLocation(CreepyWall.shaderProgram, "projectionMatrix");

        // CreepyWall.uMatAmbientShader = gl.getUniformLocation(CreepyWall.shaderProgram, "matAmbient");
        // CreepyWall.uMatDiffuseShader = gl.getUniformLocation(CreepyWall.shaderProgram, "matDiffuse");
        // CreepyWall.uMatSpecularShader = gl.getUniformLocation(CreepyWall.shaderProgram,"matSpecular");
        // CreepyWall.uMatAlphaShader = gl.getUniformLocation(CreepyWall.shaderProgram,"matAlpha");
        // CreepyWall.uLightDirectionShader = gl.getUniformLocation(CreepyWall.shaderProgram,"lightDirection");
        // CreepyWall.uLightAlphaShader = gl.getUniformLocation(CreepyWall.shaderProgram,"lightAlpha");
        // CreepyWall.uLightCutoffShader = gl.getUniformLocation(CreepyWall.shaderProgram,"lightCutoff");
        // CreepyWall.uLightStatusShader = gl.getUniformLocation(CreepyWall.shaderProgram,"lightStatus");
        // CreepyWall.uLightAmbientShader = gl.getUniformLocation(CreepyWall.shaderProgram,"lightAmbient");
        // CreepyWall.uLightDiffuseShader = gl.getUniformLocation(CreepyWall.shaderProgram,"lightDiffuse");
        // CreepyWall.uLightSpecularShader = gl.getUniformLocation(CreepyWall.shaderProgram,"lightSpecular");
        // CreepyWall.uLight1DirectionShader = gl.getUniformLocation(CreepyWall.shaderProgram,"light1Direction");

    }

    static initializeTexture() {
        var image = new Image();

        image.onload = function () {
            CreepyWall.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, CreepyWall.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);

            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        }

        image.src = "creepy_wall_texture.jpg";
    }

    constructor(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh) {
        super(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh);
        var size = 5;
        if (CreepyWall.shaderProgram == -1) {
            for (let i = 0; i < CreepyWall.vertexPositions.length; i++) {
                CreepyWall.indices.push(i);
            }
            CreepyWall.initialize()
            CreepyWall.initializeTexture();
        }

    }

    draw() {
        if (CreepyWall.texture == -1)  //only draw when texture is loaded.
            return;

        gl.useProgram(CreepyWall.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, CreepyWall.positionBuffer);
        gl.vertexAttribPointer(CreepyWall.aPositionShader, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, CreepyWall.textureCoordBuffer);
        gl.vertexAttribPointer(CreepyWall.aTextureCoordShader, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, CreepyWall.texture);
        gl.uniform1i(CreepyWall.uTextureUnitShader, 0);


        gl.uniformMatrix4fv(CreepyWall.uModelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(CreepyWall.uCameraMatrixShader, false, flatten(camera1.cameraMatrix));
        gl.uniformMatrix4fv(CreepyWall.uProjectionMatrixShader, false, flatten(camera1.projectionMatrix));

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CreepyWall.indexBuffer);

        gl.enableVertexAttribArray(CreepyWall.aPositionShader);
        gl.enableVertexAttribArray(CreepyWall.aTextureCoordShader);
        gl.drawElements(gl.TRIANGLES, CreepyWall.indices.length, gl.UNSIGNED_BYTE, 0);
        // gl.drawArrays(gl.TRIANGLES, 0, CreepyWall.vertexPositions.length);
        gl.disableVertexAttribArray(CreepyWall.aPositionShader);
        gl.disableVertexAttribArray(CreepyWall.aTextureCoordShader);
    }
}

