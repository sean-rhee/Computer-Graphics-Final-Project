class Box extends Drawable {
    static vertexPositions = [
        vec3(-10, -10, 10),
        vec3(-10, 10, 10),
        vec3(10, 10, 10),
        vec3(10, -10, 10),
        vec3(-10, -10, -10),
        vec3(-10, 10, -10),
        vec3(10, 10, -10),
        vec3(10, -10, -10)
    ];

    static vertexTextureCoords = [

    ];

    static indices = [
        0, 3, 2,
        0, 2, 1,
        2, 3, 7,
        2, 7, 6,
        0, 4, 7,
        0, 7, 3,
        1, 2, 6,
        1, 6, 5,
        4, 5, 6,
        4, 6, 7,
        0, 1, 5,
        0, 5, 4
    ];

    static positionBuffer = -1;
    static textureCoordBuffer = -1;
    static indexBuffer = -1;

    static shaderProgram = -1;
    static aPositionShader = -1;
    static aTextureCoordShader = -1;

    static uModelMatrixShader = -1;
    static uCameraMatrixShader = -1;
    static uProjectionMatrixShader = -1;

    static texture = -1;
    static uTextureUnitShader = -1;


    static initialize() {
        for (let i = 0; i < Box.vertexPositions.size; i++) {
            Box.indices.push(i);
        }
        for (let i = 0; i < 6; i++) {
            Box.vertexTextureCoords.push(vec3(-1, -1, 1))
            Box.vertexTextureCoords.push(vec3(-1, 1, 1))
            Box.vertexTextureCoords.push(vec3(1, 1, 1))
            Box.vertexTextureCoords.push(vec3(1, -1, 1))
            Box.vertexTextureCoords.push(vec3(-1, -1, -1))
            Box.vertexTextureCoords.push(vec3(-1, 1, -1))
            Box.vertexTextureCoords.push(vec3(1, 1, -1))
            Box.vertexTextureCoords.push(vec3(1, -1, -1))
        }
        Box.shaderProgram = initShaders(gl, "/vshaderSkybox.glsl", "/fshaderSkybox.glsl");

        // Load the data into the GPU
        Box.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Box.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Box.vertexPositions), gl.STATIC_DRAW);

        Box.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Box.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Box.vertexTextureCoords), gl.STATIC_DRAW);
        Box.uTextureUnitShader = gl.getUniformLocation(Box.shaderProgram, "uTextureUnit");


        Box.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Box.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(Box.indices), gl.STATIC_DRAW);

        // Associate our shader variables with our data buffer
        Box.aPositionShader = gl.getAttribLocation(Box.shaderProgram, "aPosition");
        Box.aTextureCoordShader = gl.getAttribLocation(Box.shaderProgram, "aTextureCoord");

        Box.uModelMatrixShader = gl.getUniformLocation(Box.shaderProgram, "modelMatrix");
        Box.uCameraMatrixShader = gl.getUniformLocation(Box.shaderProgram, "cameraMatrix");
        Box.uProjectionMatrixShader = gl.getUniformLocation(Box.shaderProgram, "projectionMatrix");

    }

    static initializeTexture() {
        var image = new Image();

        image.onload = function () {
            Box.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, Box.texture);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);

            // gl.generateMipmap(gl.TEXTURE_2D);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

        }

        image.src = "crate.jpg";
    }

    constructor(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh) {
        super(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh);
        var size = 5;
        if (Box.shaderProgram == -1) {
            // for (let i = 0; i < Box.vertexPositions.length; i++) {
            //     Box.indices.push(i);
            // }
            Box.initialize()
            Box.initializeTexture();
        }

    }

    draw() {
        if (Box.texture == -1)  //only draw when texture is loaded.
            return;

        gl.useProgram(Box.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, Box.positionBuffer);
        gl.vertexAttribPointer(Box.aPositionShader, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, Box.textureCoordBuffer);
        gl.vertexAttribPointer(Box.aTextureCoordShader, 3, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, Box.texture);
        gl.uniform1i(Box.uTextureUnitShader, 0);


        gl.uniformMatrix4fv(Box.uModelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(Box.uCameraMatrixShader, false, flatten(camera1.cameraMatrix));
        gl.uniformMatrix4fv(Box.uProjectionMatrixShader, false, flatten(camera1.projectionMatrix));

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Box.indexBuffer);

        gl.enableVertexAttribArray(Box.aPositionShader);
        gl.enableVertexAttribArray(Box.aTextureCoordShader);
        gl.drawElements(gl.TRIANGLES, Box.indices.length, gl.UNSIGNED_BYTE, 0);
        // gl.drawArrays(gl.TRIANGLES, 0, Box.vertexPositions.length);
        gl.disableVertexAttribArray(Box.aPositionShader);
        gl.disableVertexAttribArray(Box.aTextureCoordShader);
    }
}

