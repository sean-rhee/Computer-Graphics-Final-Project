class Skybox extends Drawable {
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

    static indices = [
        0, 1, 2,
        0, 2, 3
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
        Skybox.shaderProgram = initShaders(gl, "/vshader.glsl", "/fshader.glsl");

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

        image.onload = function () {
            Skybox.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, Skybox.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);

            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        }

        image.src = "night_skybox_top.png";
    }

    constructor(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh) {
        super(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh);
        var size = 5;
        if (Skybox.shaderProgram == -1) {
            for (let i = 0; i < Skybox.vertexPositions.length; i++) {
                Skybox.indices.push(i);
            }
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
        gl.vertexAttribPointer(Skybox.aTextureCoordShader, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, Skybox.texture);
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

