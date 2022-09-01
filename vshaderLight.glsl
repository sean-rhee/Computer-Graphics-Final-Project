#version 300 es
in vec3 aPosition;
in vec3 aNormal;
uniform vec4 uColor;
out vec4 vColor;

uniform mat4 modelMatrix;
uniform mat4 cameraMatrix;
uniform mat4 projectionMatrix;

uniform vec4 matAmbient, matDiffuse, matSpecular;
uniform float matAlpha;

uniform vec3 lightDirection;
uniform vec4 lightAmbient, lightDiffuse, lightSpecular;

uniform vec3 lightDirection2;
uniform vec4 lightAmbient2, lightDiffuse2, lightSpecular2;

void main()
{
    gl_Position = projectionMatrix*cameraMatrix*modelMatrix*vec4(aPosition,1.0);
    
    //compute vectors in camera coordinates
    //the vertex in camera coordinates
    vec3 pos = (cameraMatrix*modelMatrix*vec4(aPosition,1.0)).xyz;

    //the ray from the vertex towards the light
    //for a directional light, this is just -lightDirection
    vec3 L = normalize((-cameraMatrix*vec4(lightDirection,0.0)).xyz);
    vec3 L2 = normalize((-cameraMatrix*vec4(lightDirection2,0.0)).xyz);
    
    //the ray from the vertex towards the camera
    vec3 E = normalize(vec3(0,0,0)-pos);
    
    //normal in camera coordinates
    vec3 N = normalize(cameraMatrix*modelMatrix*vec4(aNormal,0)).xyz;
    
    //half-way vector	
    vec3 H = normalize(L+E);
    vec3 H2 = normalize (L2+E);
    
    vec4 ambient = lightAmbient*matAmbient;
    vec4 ambient2 = lightAmbient2*matAmbient;
    
    float Kd = max(dot(L,N),0.0);
    float Kd2 = max(dot(L2,N),0.0);
    vec4 diffuse = Kd*lightDiffuse*matDiffuse;
    vec4 diffuse2 = Kd2*lightDiffuse2*matDiffuse;
    
    float Ks = pow(max(dot(N,H),0.0),matAlpha);
    float Ks2 = pow(max(dot(N,H2),0.0),matAlpha);
    vec4 specular = Ks*lightSpecular*matSpecular;
    vec4 specular2 = Ks2*lightSpecular2*matSpecular;
    
    vec4 lightColor = ambient + diffuse + specular;
    vec4 lightColor2 = ambient2 + diffuse2 + specular2;
    lightColor.a = 1.0;
    lightColor2.a = 1.0;
    
    vColor = 0.1*uColor+0.9*lightColor+0.9*lightColor2;
}