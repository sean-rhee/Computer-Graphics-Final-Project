class Plane extends Drawable {
    static vertexPositions = [
        // vec3(-1, 0, 1),
        // vec3(1, 0, 1),
        // vec3(1, 0, -1),
        // vec3(-1, 0, -1),
    ];

    static vertexTextureCoords = [
        // vec2(0, 0),
        // vec2(1, 0),
        // vec2(1, 1),
        // vec2(0, 1),
    ];

    static indices = [
        // 0, 1, 2,
        // 0, 2, 3
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
        Plane.shaderProgram = initShaders(gl, "/vshader.glsl", "/fshader.glsl");

        // Load the data into the GPU
        Plane.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Plane.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Plane.vertexPositions), gl.STATIC_DRAW);

        Plane.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, Plane.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(Plane.vertexTextureCoords), gl.STATIC_DRAW);
        Plane.uTextureUnitShader = gl.getUniformLocation(Plane.shaderProgram, "uTextureUnit");


        Plane.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Plane.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(Plane.indices), gl.STATIC_DRAW);

        // Associate our shader variables with our data buffer
        Plane.aPositionShader = gl.getAttribLocation(Plane.shaderProgram, "aPosition");
        Plane.aTextureCoordShader = gl.getAttribLocation(Plane.shaderProgram, "aTextureCoord");

        Plane.uModelMatrixShader = gl.getUniformLocation(Plane.shaderProgram, "modelMatrix");
        Plane.uCameraMatrixShader = gl.getUniformLocation(Plane.shaderProgram, "cameraMatrix");
        Plane.uProjectionMatrixShader = gl.getUniformLocation(Plane.shaderProgram, "projectionMatrix");

    }

    static initializeTexture() {
        var image = new Image();

        image.onload = function () {
            Plane.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, Plane.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);

            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        }

        image.src = "tile.jpg";
    }

    constructor(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh) {
        super(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh);
        var size = 5;
        if (Plane.shaderProgram == -1) {
            var a = vec4(-size, 0, size, 1);
            var b = vec4(size, 0, size, 1);
            var c = vec4(size, 0, -size, 1);
            var d = vec4(-size, 0, -size, 1);
            this.divideQuad(a, b, c, d, 5);
            for (let i = 0; i < Plane.vertexPositions.length; i++) {
                Plane.indices.push(i);
            }
            Plane.initialize()
            Plane.initializeTexture();
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
            Plane.vertexPositions.push(a);
            Plane.vertexPositions.push(b);
            Plane.vertexPositions.push(c);
            //Triangle #2
            Plane.vertexPositions.push(c);
            Plane.vertexPositions.push(d);
            Plane.vertexPositions.push(a);
        }
        //Triangle #1
        Plane.vertexTextureCoords.push(vec2(0.0, 0.0));
        Plane.vertexTextureCoords.push(vec2(1.0, 0.0));
        Plane.vertexTextureCoords.push(vec2(1.0, 1.0));
        //Triangle #2
        Plane.vertexTextureCoords.push(vec2(0.0, 0.0));
        Plane.vertexTextureCoords.push(vec2(1.0, 1.0));
        Plane.vertexTextureCoords.push(vec2(0.0, 1.0));
    }

    draw() {
        if (Plane.texture == -1)  //only draw when texture is loaded.
            return;

        gl.useProgram(Plane.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, Plane.positionBuffer);
        gl.vertexAttribPointer(Plane.aPositionShader, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, Plane.textureCoordBuffer);
        gl.vertexAttribPointer(Plane.aTextureCoordShader, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, Plane.texture);
        gl.uniform1i(Plane.uTextureUnitShader, 0);


        gl.uniformMatrix4fv(Plane.uModelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(Plane.uCameraMatrixShader, false, flatten(camera1.cameraMatrix));
        gl.uniformMatrix4fv(Plane.uProjectionMatrixShader, false, flatten(camera1.projectionMatrix));

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Plane.indexBuffer);

        gl.enableVertexAttribArray(Plane.aPositionShader);
        gl.enableVertexAttribArray(Plane.aTextureCoordShader);
        // gl.drawElements(gl.TRIANGLES, Plane.indices.length, gl.UNSIGNED_BYTE, 0);
        gl.drawArrays(gl.TRIANGLES, 0, Plane.vertexPositions.length);
        gl.disableVertexAttribArray(Plane.aPositionShader);
        gl.disableVertexAttribArray(Plane.aTextureCoordShader);
    }
}

