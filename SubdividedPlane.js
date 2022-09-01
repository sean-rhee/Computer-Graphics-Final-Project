class SubdividedPlane extends Drawable {
    static vertexPositions = [];
    static vertexColors = [];

    static vertexTextureCoords = [];

    static indices = [];

    static vertexNormals = [];

    static positionBuffer = -1;
    static textureCoordBuffer = -1;
    static indexBuffer = -1;
    static colorBuffer = -1;
    static normalBuffer = -1;

    static shaderProgram = -1;
    static aPositionShader = -1;
    static aNormalShader = -1;
    static aColorShader = -1;
    static aTextureCoordShader = -1;

    static uModelMatrixShader = -1;
    static uCameraMatrixShader = -1;
    static uProjectionMatrixShader = -1;

    static uMatAmbientShader = -1;
    static uMatDiffuseShader = -1;
    static uMatSpecularShader = -1;
    static uMatAlphaShader = -1;

    static uLightDirectionShader = -1;
    static uLightStatusShader = -1;
    static uLightAmbientShader = -1;
    static uLightDiffuseShader = -1;
    static uLightSpecularShader = -1;
    static uLightAlphaShader = -1;
    static uLightCutoffShader = -1;

    static texture = -1;
    static uTextureUnitShader = -1;

    static computeNormals() {
        var normalSum = [];
        var counts = [];

        //initialize sum of normals for each vertex and how often its used.
        for (var i = 0; i < Plane.vertexPositions.length; i++) {
            normalSum.push(vec3(0, 0, 0));
            counts.push(0);
        }

        //for each triangle
        for (var i = 0; i < Plane.indices.length; i += 3) {
            var a = Plane.indices[i];
            var b = Plane.indices[i + 1];
            var c = Plane.indices[i + 2];

            var edge1 = subtract(SubdividedPlane.vertexPositions[b], Plane.vertexPositions[a]);
            var edge2 = subtract(SubdividedPlane.vertexPositions[c], Plane.vertexPositions[b]);
            var N = cross(edge1, edge2);

            normalSum[a] = add(normalSum[a], normalize(N));
            counts[a]++;
            normalSum[b] = add(normalSum[b], normalize(N));
            counts[b]++;
            normalSum[c] = add(normalSum[c], normalize(N));
            counts[c]++;
        }

        for (var i = 0; i < Plane.vertexPositions.length; i++)
            SubdividedPlane.vertexNormals[i] = mult(1.0 / counts[i], normalSum[i]);
    }


    static initialize() {
        SubdividedPlane.computeNormals();
        SubdividedPlane.shaderProgram = initShaders(gl, "/vshaderLight.glsl", "/fshaderLight.glsl");

        // Load the data into the GPU
        SubdividedPlane.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, SubdividedPlane.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(SubdividedPlane.vertexPositions), gl.STATIC_DRAW);

        SubdividedPlane.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, SubdividedPlane.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(SubdividedPlane.vertexColors), gl.STATIC_DRAW);

        // SubdividedPlane.textureCoordBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, SubdividedPlane.textureCoordBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(SubdividedPlane.vertexTextureCoords), gl.STATIC_DRAW);
        // SubdividedPlane.uTextureUnitShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "uTextureUnit");

        SubdividedPlane.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, SubdividedPlane.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(SubdividedPlane.vertexNormals), gl.STATIC_DRAW);


        SubdividedPlane.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SubdividedPlane.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(SubdividedPlane.indices), gl.STATIC_DRAW);

        // Associate our shader variables with our data buffer
        SubdividedPlane.aPositionShader = gl.getAttribLocation(SubdividedPlane.shaderProgram, "aPosition");
        // SubdividedPlane.aTextureCoordShader = gl.getAttribLocation(SubdividedPlane.shaderProgram, "aTextureCoord");
        SubdividedPlane.aColorShader = gl.getAttribLocation(SubdividedPlane.shaderProgram, "aColor");
        SubdividedPlane.aNormalShader = gl.getAttribLocation(SubdividedPlane.shaderProgram, "aNormal");

        SubdividedPlane.uModelMatrixShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "modelMatrix");
        SubdividedPlane.uCameraMatrixShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "cameraMatrix");
        SubdividedPlane.uProjectionMatrixShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "projectionMatrix");

        SubdividedPlane.uMatAmbientShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "matAmbient");
        SubdividedPlane.uMatDiffuseShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "matDiffuse");
        SubdividedPlane.uMatSpecularShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "matSpecular");
        SubdividedPlane.uMatAlphaShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "matAlpha");
        SubdividedPlane.uLightDirectionShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightDirection");
        SubdividedPlane.uLightAlphaShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightAlpha");
        SubdividedPlane.uLightCutoffShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightCutoff");
        SubdividedPlane.uLightStatusShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightStatus");
        SubdividedPlane.uLightAmbientShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightAmbient");
        SubdividedPlane.uLightDiffuseShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightDiffuse");
        SubdividedPlane.uLightSpecularShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "lightSpecular");
        SubdividedPlane.uLight1DirectionShader = gl.getUniformLocation(SubdividedPlane.shaderProgram, "light1Direction");

    }

    // static initializeTexture() {
    //     var image = new Image();

    //     image.onload = function () {
    //         SubdividedPlane.texture = gl.createTexture();
    //         gl.bindTexture(gl.TEXTURE_2D, SubdividedPlane.texture);
    //         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);

    //         gl.generateMipmap(gl.TEXTURE_2D);
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    //     }

    //     image.src = "tile.jpg";
    // }

    constructor(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh) {
        super(tx, ty, tz, scale, rotX, rotY, rotZ, amb, dif, sp, sh);
        var size = 5;
        if (SubdividedPlane.shaderProgram == -1) {
            var a = vec4(-size, 0, size, 1);
            var b = vec4(size, 0, size, 1);
            var c = vec4(size, 0, -size, 1);
            var d = vec4(-size, 0, -size, 1);
            SubdividedPlane.divideQuad(a, b, c, d, 5);
            for (let i = 0; i < SubdividedPlane.vertexPositions.length; i++) {
                SubdividedPlane.indices.push(i);
            }
            SubdividedPlane.initialize()
            // SubdividedPlane.initializeTexture();
        }

    }

    static divideQuad(a, b, c, d, depth) {
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
            SubdividedPlane.divideQuad(a, v1, v5, v4, depth - 1);
            SubdividedPlane.divideQuad(v1, b, v2, v5, depth - 1);
            SubdividedPlane.divideQuad(v2, c, v3, v5, depth - 1);
            SubdividedPlane.divideQuad(v3, d, v4, v5, depth - 1);
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

            for (let i = 0; i < 6; i++) {
                SubdividedPlane.vertexColors.push(vec4(0, 1, 1, 1));
            }
        }
        //Triangle #1
        SubdividedPlane.vertexTextureCoords.push(vec2(0.0, 0.0));
        SubdividedPlane.vertexTextureCoords.push(vec2(1.0, 0.0));
        SubdividedPlane.vertexTextureCoords.push(vec2(1.0, 1.0));
        //Triangle #2
        SubdividedPlane.vertexTextureCoords.push(vec2(0.0, 0.0));
        SubdividedPlane.vertexTextureCoords.push(vec2(1.0, 1.0));
        SubdividedPlane.vertexTextureCoords.push(vec2(0.0, 1.0));
    }

    draw() {
        if (SubdividedPlane.texture == -1)  //only draw when texture is loaded.
            return;

        gl.useProgram(SubdividedPlane.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, SubdividedPlane.positionBuffer);
        gl.vertexAttribPointer(SubdividedPlane.aPositionShader, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, SubdividedPlane.colorBuffer);
        gl.vertexAttribPointer(SubdividedPlane.aColorShader, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, SubdividedPlane.normalBuffer);
        gl.vertexAttribPointer(SubdividedPlane.aNormalShader, 3, gl.FLOAT, false, 0, 0);

        // gl.bindBuffer(gl.ARRAY_BUFFER, SubdividedPlane.textureCoordBuffer);
        // gl.vertexAttribPointer(SubdividedPlane.aTextureCoordShader, 2, gl.FLOAT, false, 0, 0);

        // gl.activeTexture(gl.TEXTURE0);
        // gl.bindTexture(gl.TEXTURE_2D, SubdividedPlane.texture);
        // gl.uniform1i(SubdividedPlane.uTextureUnitShader, 0);

        gl.uniform4fv(SubdividedPlane.uMatAmbientShader, this.matAmbient);
        gl.uniform4fv(SubdividedPlane.uMatDiffuseShader, this.matDiffuse);
        gl.uniform4fv(SubdividedPlane.uMatSpecularShader, this.matSpecular);
        gl.uniform1f(SubdividedPlane.uMatAlphaShader, this.matAlpha);

        gl.uniform3fv(SubdividedPlane.uLightDirectionShader, light2.direction);
        gl.uniform4fv(SubdividedPlane.uLightAmbientShader, light2.ambient);
        gl.uniform4fv(SubdividedPlane.uLightDiffuseShader, light2.diffuse);
        gl.uniform4fv(SubdividedPlane.uLightSpecularShader, light2.specular);
        gl.uniform1f(SubdividedPlane.uLightAlphaShader, light2.alpha);
        gl.uniform1f(SubdividedPlane.uLightCutoffShader, light2.cutoff);
        gl.uniform1f(SubdividedPlane.uLightStatusShader, light2.status);
        gl.uniform3fv(SubdividedPlane.uLight1DirectionShader, light1.direction);

        gl.uniformMatrix4fv(SubdividedPlane.uModelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(SubdividedPlane.uCameraMatrixShader, false, flatten(camera1.cameraMatrix));
        gl.uniformMatrix4fv(SubdividedPlane.uProjectionMatrixShader, false, flatten(camera1.projectionMatrix));

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SubdividedPlane.indexBuffer);

        gl.enableVertexAttribArray(SubdividedPlane.aPositionShader);
        // gl.enableVertexAttribArray(SubdividedPlane.aTextureCoordShader);
        gl.enableVertexAttribArray(SubdividedPlane.aColorShader);
        gl.enableVertexAttribArray(SubdividedPlane.aNormalShader);
        gl.drawElements(gl.TRIANGLES, SubdividedPlane.indices.length, gl.UNSIGNED_BYTE, 0);
        // gl.drawArrays(gl.TRIANGLES, 0, SubdividedPlane.vertexPositions.length);
        gl.disableVertexAttribArray(SubdividedPlane.aPositionShader);
        gl.disableVertexAttribArray(SubdividedPlane.aColorShader);
        gl.disableVertexAttribArray(SubdividedPlane.aNormalShader);
        // gl.disableVertexAttribArray(SubdividedPlane.aTextureCoordShader);
    }
}

