precision mediump float;

varying vec2 TexCoords;
varying vec3 Normal;
varying vec3 FragPos;

uniform sampler2D texture_displacement;
uniform sampler2D texture_normal;
uniform vec3 viewPos;

vec3 lightPos = vec3(10.0, 10.0, 10.0);
vec3 lightColor = vec3(1.0,1.0,1.0);
vec3 objectColor = vec3(0.0,0.5,0.0);

void main()
{
	//使用顶点着色器插值得到的法线,效果有差别，大家可以试试
	//vec3 norm = Normal;

	//在片元着色器内采样法线
	vec3 norm = normalize(texture2D(texture_normal,TexCoords).rgb * 2.0 - vec3(1.0,1.0,1.0));

	// ambient
    float ambientStrength = 0.5;
    vec3 ambient = ambientStrength * lightColor;

    // diffuse
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;

    // specular
    float specularStrength = 0.5;
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = specularStrength * spec * lightColor;

    vec3 result = (ambient + diffuse + specular) * objectColor;
    gl_FragColor = vec4(result, 1.0);
}