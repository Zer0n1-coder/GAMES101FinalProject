import { Shader } from './Shader.js'
import { gl, gles } from './Global.js'
import { loopsubdivision } from './LoopSubdivision.js'

export class Vertex {
    Position = new Array<number>(3);    //3
    Normal = new Array<number>(3);       //3
    TexCoords = new Array<number>(2);    //2

    static sizeof() {
        return Float32Array.BYTES_PER_ELEMENT * 5;
    }

    //连续数据
    data() {
        let ret = new Array<number>();
        ret = ret.concat(this.Position);
        //ret = ret.concat(this.Normal);
        ret = ret.concat(this.TexCoords);
        return ret;
    }
}

export class Texture {
    id: WebGLTexture;
    type : string;
    path : string;
};

export class Mesh {
    vertices: Vertex[];
    indices: number[];
    VAO: WebGLVertexArrayObjectOES;
    drawSum: number;

    constructor(vertices: Vertex[], indices: number[]) {
        this.vertices = vertices;
        this.indices = indices;
    }
    Draw(shader: Shader): void {
        // draw mesh
        gles.bindVertexArrayOES(this.VAO);
        //gl.drawElements(gl.TRIANGLES, this.nums, gl.UNSIGNED_SHORT, 0);
        gl.drawArrays(gl.TRIANGLES, 0, this.drawSum);
        gles.bindVertexArrayOES(null);
    }

    setupMesh(shader: Shader) {
        this.VAO = gles.createVertexArrayOES();
        this.VBO = gl.createBuffer();
        this.EBO = gl.createBuffer();

        gles.bindVertexArrayOES(this.VAO);

        //因为数据是分开的，需要先合并一次
        let tmpVec = new Array<number>();
        //let tmpVertices = new Array<number>();
        for (let i = 0; i < this.vertices.length; ++i) {
            tmpVec = tmpVec.concat(this.vertices[i].data());
            //tmpVertices = tmpVertices.concat(this.vertices[i].Position);
        }
        //用来测试loop细分
        //let data = loopsubdivision(tmpVertices, this.indices);

        this.drawSum = this.vertices.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tmpVec), gl.STATIC_DRAW);
        
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data[1]), gl.STATIC_DRAW);

        shader.use();
        // vertex Positions
        let aPos = shader.getAttribLocation('aPos');
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, Vertex.sizeof(), 0);
        gl.enableVertexAttribArray(aPos);
        // vertex normals,暂时没用
        //let aNormal = shader.getAttribLocation('aNormal');
        //gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, Vertex.sizeof(), 3 * Float32Array.BYTES_PER_ELEMENT);
        //gl.enableVertexAttribArray(aNormal);
        // vertex texture coords
        let aTexCoords = shader.getAttribLocation('aTexCoords');
        gl.vertexAttribPointer(aTexCoords, 2, gl.FLOAT, false, Vertex.sizeof(), 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(aTexCoords);    

        gles.bindVertexArrayOES(null);
    }

    private VBO: WebGLBuffer;
    private EBO: WebGLBuffer;
}