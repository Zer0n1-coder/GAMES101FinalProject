attribute vec3 aPos;
//attribute vec3 aNormal;
attribute vec2 aTexCoords;

varying vec2 TexCoords;
varying vec3 Normal;
varying vec3 FragPos;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

uniform sampler2D texture_displacement;
uniform sampler2D texture_normal;

void main()
{
	FragPos = vec3(model * vec4(aPos,1.0));
	TexCoords = aTexCoords;
	Normal = normalize(texture2D(texture_normal,TexCoords).rgb * 2.0 - vec3(1.0,1.0,1.0));

	//使用位移贴图修改位移位移
	float displacement = texture2D(texture_displacement,TexCoords).g;
	vec3 pos = aPos + Normal * displacement;
	gl_Position = projection * view * model * vec4(pos,1.0);
}