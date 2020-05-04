import { getTextFromLocation} from"./Global.js"

export class Triangls{
    //索引值
    vi = new Array<number>();
}

export class ObjGroup {
    name: string;

    v = new Array<number>();
    ev = new Array<number>();
    vt = new Array<number>();
    vn = new Array<number>();
    f = new Array <Triangls>();

    mtl: string;
}

export class MtlGroup {
    Ns: number;
    Ka = new Array<number>();
    Kd = new Array<number>();
    Ks = new Array<number>();
    Ni: number;
    d: number;
    illum: number;
    map_Kd: string;
    map_Bump: string;
    map_Ks: string;
}

export class MtlObj {
    mtlGroups = new Map<string, MtlGroup>();
}

export class ObjModel {
    groups = new Array<ObjGroup>();
    mtlObj: MtlObj;
}

export class ObjReader {
    constructor(directory: string, filename: string) {
        this._directory = directory;
        this._filename = filename;
    }

    parseObj(){
        let objData = getTextFromLocation(this._directory + '/' + this._filename);
        if (objData.length === 0)
            return null;

        let ret = new ObjModel;

        let lines = objData.split("\n");

        let groupIndex = -1;            //组编号

        //回掉函数里没法调用类成员变量和函数，所以用了临时变量
        let directory = this._directory;    
        let parseMtl = this.parseMtl;
        
        let nomVec = new Array<number>();   //法线容器
        let texVec = new Array<number>();   //纹理坐标容器
        let callback = function (value: string, index: number, array: string[]) {
            let tokens = value.split(' ');

            if (tokens[0] === 'mtllib') {
                //暂时没有
            }
            else if (tokens[0] === 'o' || tokens[0] === 'g') {
                let oneGroup = new ObjGroup;
                oneGroup.name = tokens[1];
                ret.groups.push(oneGroup);
                ++groupIndex;
            }
            else if (tokens[0] === 'v') {
                let curGroup = ret.groups[groupIndex];
                curGroup.v.push(Number.parseFloat(tokens[1]));
                curGroup.v.push(Number.parseFloat(tokens[2]));
                curGroup.v.push(Number.parseFloat(tokens[3]));
            }
            else if (tokens[0] === 'vn') {
                nomVec.push(Number.parseFloat(tokens[1]));
                nomVec.push(Number.parseFloat(tokens[2]));
                nomVec.push(Number.parseFloat(tokens[3]));
            }
            else if (tokens[0] === 'vt') {
                texVec.push(Number.parseFloat(tokens[1]));
                texVec.push(Number.parseFloat(tokens[2]));
            }
            else if (tokens[0] === 'f') {
                let values1 = tokens[1].split("/");
                let values2 = tokens[2].split("/");
                let values3 = tokens[3].split("/");
                let values4 = tokens[4].split("/");

                let curGroup = ret.groups[groupIndex];

                let triange = new Triangls;

                let index1 = Number.parseInt(values1[0]) - 1;
                let index2 = Number.parseInt(values2[0]) - 1;
                let index3 = Number.parseInt(values3[0]) - 1;
                let index4 = Number.parseInt(values4[0]) - 1;

                triange.vi.push(index1);
                triange.vi.push(index2);
                triange.vi.push(index3);
                triange.vi.push(index1);
                triange.vi.push(index3);
                triange.vi.push(index4);

                //扩展顶点数据
                curGroup.ev.push(curGroup.v[index1 * 3 + 0]);
                curGroup.ev.push(curGroup.v[index1 * 3 + 1]);
                curGroup.ev.push(curGroup.v[index1 * 3 + 2]);
                curGroup.ev.push(curGroup.v[index2 * 3 + 0]);
                curGroup.ev.push(curGroup.v[index2 * 3 + 1]);
                curGroup.ev.push(curGroup.v[index2 * 3 + 2]);
                curGroup.ev.push(curGroup.v[index3 * 3 + 0]);
                curGroup.ev.push(curGroup.v[index3 * 3 + 1]);
                curGroup.ev.push(curGroup.v[index3 * 3 + 2]);
                curGroup.ev.push(curGroup.v[index1 * 3 + 0]);
                curGroup.ev.push(curGroup.v[index1 * 3 + 1]);
                curGroup.ev.push(curGroup.v[index1 * 3 + 2]);
                curGroup.ev.push(curGroup.v[index3 * 3 + 0]);
                curGroup.ev.push(curGroup.v[index3 * 3 + 1]);
                curGroup.ev.push(curGroup.v[index3 * 3 + 2]);
                curGroup.ev.push(curGroup.v[index4 * 3 + 0]);
                curGroup.ev.push(curGroup.v[index4 * 3 + 1]);
                curGroup.ev.push(curGroup.v[index4 * 3 + 2]);

                //扩展纹理数据
                index1 = Number.parseInt(values1[1]) - 1;
                index2 = Number.parseInt(values2[1]) - 1;
                index3 = Number.parseInt(values3[1]) - 1;
                index4 = Number.parseInt(values4[1]) - 1;
                curGroup.vt.push(texVec[index1 * 2 + 0]);
                curGroup.vt.push(texVec[index1 * 2 + 1]);
                curGroup.vt.push(texVec[index2 * 2 + 0]);
                curGroup.vt.push(texVec[index2 * 2 + 1]);
                curGroup.vt.push(texVec[index3 * 2 + 0]);
                curGroup.vt.push(texVec[index3 * 2 + 1]);
                curGroup.vt.push(texVec[index1 * 2 + 0]);
                curGroup.vt.push(texVec[index1 * 2 + 1]);
                curGroup.vt.push(texVec[index3 * 2 + 0]);
                curGroup.vt.push(texVec[index3 * 2 + 1]);
                curGroup.vt.push(texVec[index4 * 2 + 0]);
                curGroup.vt.push(texVec[index4 * 2 + 1]);

                //暂时没用
                //index1 = Number.parseInt(values1[2]) - 1;
                //index2 = Number.parseInt(values2[2]) - 1;
                //index3 = Number.parseInt(values3[2]) - 1;
                //index4 = Number.parseInt(values4[2]) - 1;
                //curGroup.vn.push(nomVec[index1 * 3 + 0]);
                //curGroup.vn.push(nomVec[index1 * 3 + 1]);
                //curGroup.vn.push(nomVec[index1 * 3 + 2]);
                //curGroup.vn.push(nomVec[index2 * 3 + 0]);
                //curGroup.vn.push(nomVec[index2 * 3 + 1]);
                //curGroup.vn.push(nomVec[index2 * 3 + 2]);
                //curGroup.vn.push(nomVec[index3 * 3 + 0]);
                //curGroup.vn.push(nomVec[index3 * 3 + 1]);
                //curGroup.vn.push(nomVec[index3 * 3 + 2]);
                //curGroup.vn.push(nomVec[index1 * 3 + 0]);
                //curGroup.vn.push(nomVec[index1 * 3 + 1]);
                //curGroup.vn.push(nomVec[index1 * 3 + 2]);
                //curGroup.vn.push(nomVec[index3 * 3 + 0]);
                //curGroup.vn.push(nomVec[index3 * 3 + 1]);
                //curGroup.vn.push(nomVec[index3 * 3 + 2]);
                //curGroup.vn.push(nomVec[index4 * 3 + 0]);
                //curGroup.vn.push(nomVec[index4 * 3 + 1]);
                //curGroup.vn.push(nomVec[index4 * 3 + 2]);

                curGroup.f.push(triange);
            }
            else if (tokens[0] === 'usemtl') {
                ret.groups[groupIndex].mtl = tokens[1];
            }
        };

        lines.forEach(callback)

        return ret;
    }

    private parseMtl(data: string){
        let lines = data.split("\n");

        let gourpIndex:string;
        let ret = new MtlObj;
        let callback = function (value: string, index: number, array: string[]) {
            let tokens = value.split(' ');

            if (tokens[0] === 'newmtl') {
                let tmpGroup = new MtlGroup;
                ret.mtlGroups.set(tokens[1],tmpGroup);
                gourpIndex = tokens[1];
            }
            else if (tokens[0] === 'Ns') {
                ret.mtlGroups.get(gourpIndex).Ns = Number.parseFloat(tokens[1]);
            }
            else if (tokens[0] === 'Ka') {
                let tmpGroup = ret.mtlGroups.get(gourpIndex);
                tmpGroup.Ka.push(Number.parseFloat(tokens[1]));
                tmpGroup.Ka.push(Number.parseFloat(tokens[2]));
                tmpGroup.Ka.push(Number.parseFloat(tokens[3]));
            }
            else if (tokens[0] === 'Kd') {
                let tmpGroup = ret.mtlGroups.get(gourpIndex);
                tmpGroup.Kd.push(Number.parseFloat(tokens[1]));
                tmpGroup.Kd.push(Number.parseFloat(tokens[2]));
                tmpGroup.Kd.push(Number.parseFloat(tokens[3]));
            }
            else if (tokens[0] === 'Ks') {
                let tmpGroup = ret.mtlGroups.get(gourpIndex);
                tmpGroup.Ks.push(Number.parseFloat(tokens[1]));
                tmpGroup.Ks.push(Number.parseFloat(tokens[2]));
                tmpGroup.Ks.push(Number.parseFloat(tokens[3]));
            }
            else if (tokens[0] === 'Ni') {
                ret.mtlGroups.get(gourpIndex).Ni = Number.parseFloat(tokens[1]);
            }
            else if (tokens[0] === 'd') {
                ret.mtlGroups.get(gourpIndex).d = Number.parseFloat(tokens[1]);
            }
            else if (tokens[0] === 'illum') {
                ret.mtlGroups.get(gourpIndex).illum = Number.parseInt(tokens[1]);
            }
            else if (tokens[0] === 'map_Kd') {
                ret.mtlGroups.get(gourpIndex).map_Kd = tokens[1];
            }
            else if (tokens[0] === 'map_Bump') {
                ret.mtlGroups.get(gourpIndex).map_Bump = tokens[1];
            }
            else if (tokens[0] === 'map_Ks') {
                ret.mtlGroups.get(gourpIndex).map_Ks = tokens[1];
            }
        };
        lines.forEach(callback);

        return ret;
    }
    private _directory : string
    private _filename: string;
}