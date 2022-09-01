#version 300 es
in vec3 aPosition;
in vec3 aNormal;
in vec4 aColor;

out vec4 vColor;

uniform mat4 modelMatrix, cameraMatrix, projectionMatrix;

uniform vec4 matAmbient, matDiffuse, matSpecular;
uniform float matAlpha;

uniform vec3 lightDirection, light1Direction;
uniform vec4 lightAmbient, lightDiffuse, lightSpecular;

uniform float lightAlpha, lightCutoff, lightStatus;

void main()
{
    gl_Position = projectionMatrix*cameraMatrix*modelMatrix*vec4(aPosition,1.0);
    
    //compute vectors in camera coordinates
    //the vertex in camera coordinates
    vec3 pos = (cameraMatrix*modelMatrix*vec4(aPosition,1.0)).xyz;

    //the ray from the vertex towards the light
    //for a directional light, this is just -lightDirection
    vec3 L = normalize((-cameraMatrix*vec4(lightDirection,0.0)).xyz);
    vec3 LSECOND = normalize(-light1Direction.xyz);
    
    //the ray from the vertex towards the camera
    vec3 E = normalize(vec3(0,0,0)-pos);
    
    //normal in camera coordinates
    vec3 N = normalize(cameraMatrix*modelMatrix*vec4(aNormal,0)).xyz;
    
    //half-way vector	
    vec3 H = normalize(L+E);
    vec3 HSECOND = normalize(LSECOND+E);
    
    vec4 ambient = lightAmbient*matAmbient;
    
    float Kd = max(dot(L,N),0.0);
    vec4 diffuse = Kd*lightDiffuse*matDiffuse;

    float Kd1 = max(dot(LSECOND, N), 0.0);
    vec4 diffuseSECOND = Kd1*lightDiffuse*matDiffuse;
    
    float Ks = pow(max(dot(N,H),0.0),matAlpha);
    vec4 specular = Ks*lightSpecular*matSpecular;

    float Ks1 = pow(max(dot(N,HSECOND),0.0),matAlpha);
    vec4 specular1 = Ks1*lightSpecular*matSpecular;
    
    vec4 lightColor = ambient + diffuse + specular;
    lightColor.a = 1.0;
    
    vec4 lcolor1 = ambient + diffuseSECOND + specular1;
    lightColor.a = 1.0;
    lcolor1.a = 1.0;

    lcolor1 = 0.1*aColor+0.9*lcolor1;

    vec4 lcolor2;

    //divide directional light by distance
    // new things
    
    if (lightStatus > 0.0) {
      float l = dot(normalize(-E), normalize(lightDirection));
      float theta = abs(acos(l));
   
      float offAngle;
      if (theta >= lightCutoff) {
        offAngle = 0.0;
        lcolor2 = vec4(0.0, 0.0, 0.0, 1.0);
      }
      else {
        offAngle = pow(max(abs(l), 0.0), lightAlpha);
        float dist = 1.0/(pow(length(normalize(pos - vec3(0.0, 0.0, 0.0))), 2.0));
        lcolor2 = 0.01*aColor;
        lcolor2 += (offAngle * dist)*lightColor;
      }
    }

    vColor = lcolor1 + lcolor2;
}