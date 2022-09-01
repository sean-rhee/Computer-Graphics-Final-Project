class Skybox extends Drawable {
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
        for (let i = 0; i < Skybox.vertexPositions.size; i++) {
            Skybox.indices.push(i);
        }
        for (let i = 0; i < 6; i++) {
            Skybox.vertexTextureCoords.push(vec3(-1, -1, 1))
            Skybox.vertexTextureCoords.push(vec3(-1, 1, 1))
            Skybox.vertexTextureCoords.push(vec3(1, 1, 1))
            Skybox.vertexTextureCoords.push(vec3(1, -1, 1))
            Skybox.vertexTextureCoords.push(vec3(-1, -1, -1))
            Skybox.vertexTextureCoords.push(vec3(-1, 1, -1))
            Skybox.vertexTextureCoords.push(vec3(1, 1, -1))
            Skybox.vertexTextureCoords.push(vec3(1, -1, -1))
        }
        Skybox.shaderProgram = initShaders(gl, "/vshaderSkybox.glsl", "/fshaderSkybox.glsl");

        // Load the data into the GPU
        Skybox.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Skybox.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Skybox.vertexPositions), gl.STATIC_DRAW);

        Skybox.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Skybox.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Skybox.vertexTextureCoords), gl.STATIC_DRAW);
        Skybox.uTextureUnitShader = gl.getUniformLocation(Skybox.shaderProgram, "uTextureUnit");


        Skybox.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Skybox.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(Skybox.indices), gl.STATIC_DRAW);

        // Associate our shader variables with our data buffer
        Skybox.aPositionShader = gl.getAttribLocation(Skybox.shaderProgram, "aPosition");
        Skybox.aTextureCoordShader = gl.getAttribLocation(Skybox.shaderProgram, "aTextureCoord");

        Skybox.uModelMatrixShader = gl.getUniformLocation(Skybox.shaderProgram, "modelMatrix");
        Skybox.uCameraMatrixShader = gl.getUniformLocation(Skybox.shaderProgram, "cameraMatrix");
        Skybox.uProjectionMatrixShader = gl.getUniformLocation(Skybox.shaderProgram, "projectionMatrix");

    }

    static initializeTexture() {
        var image = new Image();
        var image2 = new Image();
        var image3 = new Image();
        var image4 = new Image();
        var image5 = new Image();
        var image6 = new Image();

        image6.onload = function () {
            Skybox.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, Skybox.texture);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, image2.width, image2.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image2);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, image3.width, image3.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image3);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, image4.width, image4.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image4);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, image5.width, image5.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image5);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, image6.width, image6.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image6);

            // gl.generateMipmap(gl.TEXTURE_2D);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

        }

        image.src = "./skybox/top.png";
        image2.src = "./skybox/bottom.png";
        image3.src = "./skybox/right.png";
        image4.src = "./skybox/left.png";
        image5.src = "./skybox/front.png";
        image6.src = "./skybox/back.png";
    }

    constructor(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh) {
        super(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh);
        var size = 5;
        if (Skybox.shaderProgram == -1) {
            // for (let i = 0; i < Skybox.vertexPositions.length; i++) {
            //     Skybox.indices.push(i);
            // }
            Skybox.initialize()
            Skybox.initializeTexture();
        }

    }

    draw() {
        if (Skybox.texture == -1)  //only draw when texture is loaded.
            return;

        gl.useProgram(Skybox.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, Skybox.positionBuffer);
        gl.vertexAttribPointer(Skybox.aPositionShader, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, Skybox.textureCoordBuffer);
        gl.vertexAttribPointer(Skybox.aTextureCoordShader, 3, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, Skybox.texture);
        gl.uniform1i(Skybox.uTextureUnitShader, 0);


        gl.uniformMatrix4fv(Skybox.uModelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(Skybox.uCameraMatrixShader, false, flatten(camera1.cameraMatrix));
        gl.uniformMatrix4fv(Skybox.uProjectionMatrixShader, false, flatten(camera1.projectionMatrix));

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Skybox.indexBuffer);

        gl.enableVertexAttribArray(Skybox.aPositionShader);
        gl.enableVertexAttribArray(Skybox.aTextureCoordShader);
        gl.drawElements(gl.TRIANGLES, Skybox.indices.length, gl.UNSIGNED_BYTE, 0);
        // gl.drawArrays(gl.TRIANGLES, 0, Skybox.vertexPositions.length);
        gl.disableVertexAttribArray(Skybox.aPositionShader);
        gl.disableVertexAttribArray(Skybox.aTextureCoordShader);
    }
}

