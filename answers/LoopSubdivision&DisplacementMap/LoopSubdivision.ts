
//找到边相对的点
function findPointOfSide(indexes: number[],point1: number, point2: number, flagPoint: number) {
    let triangleNum = indexes.length / 3;
    for (let i = 0; i < triangleNum; ++i) {
        let index1 = indexes[i * 3 + 0];
        let index2 = indexes[i * 3 + 1];
        let index3 = indexes[i * 3 + 2];

        if (((index1 === point1 && index2 === point2) || (index1 === point2 && index2 === point1)) && index3 !== flagPoint)
            return index3;

        if (((index1 === point1 && index3 === point2) || (index1 === point2 && index3 === point1)) && index2 !== flagPoint)
            return index2;

        if (((index3 === point1 && index2 === point2) || (index3 === point2 && index2 === point1)) && index1 !== flagPoint)
            return index1;
    }
}

//计算边上产生的新点
function getNewPoints(vertices: number[], indexes: number[]) {
    let ret = new Map<string, number[]>(); //记录每个边上产生的新点

    let triangleNum = indexes.length / 3;
    for (let i = 0; i < triangleNum; ++i) {
        //三角形三个点以及索引值
        let index1 = indexes[i * 3 + 0];
        let index2 = indexes[i * 3 + 1];
        let index3 = indexes[i * 3 + 2];
        let point1 = [vertices[index1 * 3 + 0], vertices[index1 * 3 + 1], vertices[index1 * 3 + 2]];
        let point2 = [vertices[index2 * 3 + 0], vertices[index2 * 3 + 1], vertices[index2 * 3 + 2]];
        let point3 = [vertices[index3 * 3 + 0], vertices[index3 * 3 + 1], vertices[index3 * 3 + 2]];

        if (!ret.has(index1.toString() + ',' + index2.toString()) && !ret.has(index2.toString() + ',' + index1.toString())) {
            //index1和index2所形成的边,该边所对应的两个点
            let oppositeIndex1 = index3;
            let oppositeIndex2 = findPointOfSide(indexes, index1, index2, oppositeIndex1);
            let tmpPoint = [vertices[oppositeIndex2 * 3 + 0], vertices[oppositeIndex2 * 3 + 1], vertices[oppositeIndex2 * 3 + 2]];

            //计算该边产生的新点
            let newPoint1 = [(point1[0] + point2[0]) * 3 / 8 + (point3[0] + tmpPoint[0]) / 8,
            (point1[1] + point2[1]) * 3 / 8 + (point3[1] + tmpPoint[1]) / 8,
            (point1[2] + point2[2]) * 3 / 8 + (point3[2] + tmpPoint[2]) / 8];
            ret.set(index1.toString() + ',' + index2.toString(), newPoint1);
        }
        if (!ret.has(index1.toString() + ',' + index3.toString()) && !ret.has(index3.toString() + ',' + index1.toString())) {
            //index1和index3所形成的边,该边所对应的两个点
            let oppositeIndex1 = index2;
            let oppositeIndex2 = findPointOfSide(indexes, index1, index3, oppositeIndex1);
            let tmpPoint = [vertices[oppositeIndex2 * 3 + 0], vertices[oppositeIndex2 * 3 + 1], vertices[oppositeIndex2 * 3 + 2]];

            //计算该边产生的新点
            let newPoint2 = [(point1[0] + point3[0]) * 3 / 8 + (point2[0] + tmpPoint[0]) / 8,
            (point1[1] + point3[1]) * 3 / 8 + (point2[1] + tmpPoint[1]) / 8,
            (point1[2] + point3[2]) * 3 / 8 + (point2[2] + tmpPoint[2]) / 8];
            ret.set(index1.toString() + ',' + index3.toString(), newPoint2);
        }
        if (!ret.has(index3.toString() + ',' + index2.toString()) && !ret.has(index2.toString() + ',' + index3.toString())) {
            //index2和index3所形成的边,该边所对应的两个点
            let oppositeIndex1 = index1;
            let oppositeIndex2 = findPointOfSide(indexes, index2, index3, oppositeIndex1);
            let tmpPoint = [vertices[oppositeIndex2 * 3 + 0], vertices[oppositeIndex2 * 3 + 1], vertices[oppositeIndex2 * 3 + 2]];

            //计算该边产生的新点
            let newPoint3 = [(point2[0] + point3[0]) * 3 / 8 + (point1[0] + tmpPoint[0]) / 8,
            (point2[1] + point3[1]) * 3 / 8 + (point1[1] + tmpPoint[1]) / 8,
            (point2[2] + point3[2]) * 3 / 8 + (point1[2] + tmpPoint[2]) / 8];
            ret.set(index2.toString() + ',' + index3.toString(), newPoint3);
        }
    }

    return ret;
}

//找到一个点相邻的其他顶点
function findPointsOfPoint(indexes: number[], pointIndex: number) {
    let ret = new Array<number>();
    let triangleNum = indexes.length / 3;
    for (let i = 0; i < triangleNum; ++i) {
        let index1 = indexes[i * 3 + 0];
        let index2 = indexes[i * 3 + 1];
        let index3 = indexes[i * 3 + 2];

        if (pointIndex === index1) {
            ret.push(index2);
            ret.push(index3);
        }
        else if (pointIndex === index2) {
            ret.push(index1);
            ret.push(index3);
        }
        else if (pointIndex === index3) {
            ret.push(index1);
            ret.push(index2);
        }
    }

    //去重
    ret = [...new Set(ret)]; 

    return ret;
}

//变更原有顶点的坐标
function changeOldPoints(vertices: number[], indexes: number[]) {
    let ret = new Array<number>(vertices.length);

    let pointNum = indexes.length;
    for (let i = 0; i < pointNum; ++i) {
        let index = indexes[i];
        let aroundPoints = findPointsOfPoint(indexes, index);

        let n = aroundPoints.length;
        let u: number;
        if (n === 3)
            u = 3 / 16;
        else
            u = 3 / (8 * n);

        let original_point = [vertices[index * 3 + 0], vertices[index * 3 + 1], vertices[index * 3 + 2]];
        let neighbour_point_sum = [0.0,0.0,0.0];
        for (let pointIndex of aroundPoints)
            neighbour_point_sum = [
                neighbour_point_sum[0] + vertices[pointIndex * 3 + 0],
                neighbour_point_sum[1] + vertices[pointIndex * 3 + 1],
                neighbour_point_sum[2] + vertices[pointIndex * 3 + 2]];
        let changePoint = [
            original_point[0] * (1 - n * u) + u * neighbour_point_sum[0],
            original_point[1] * (1 - n * u) + u * neighbour_point_sum[1],
            original_point[2] * (1 - n * u) + u * neighbour_point_sum[2]
        ];

        ret[index * 3 + 0] = changePoint[0];
        ret[index * 3 + 1] = changePoint[1];
        ret[index * 3 + 2] = changePoint[2];
    }

    return ret;
}

//寻找key所在位置
function findIndex(key: string, map: Map<string, number[]>) {
    let index = 0;
    for (let value of map) {
        if (value[0] === key)
            return index;
        else
            ++index;
    }
    return -1;
}

//loop细分算法
export function loopsubdivision(vertices: number[], indexes: number[]) {

    let newPoints = getNewPoints(vertices, indexes);           //每条边上对应的新顶点
    let changedPoints = changeOldPoints(vertices, indexes);   //旧顶点转换的新顶点

    //塞入原索引值
    let outIndexes = new Array<number>();
    outIndexes = outIndexes.concat(indexes);

    //塞入变更后的顶点，数量与原顶点相同
    let outVertices = new Array<number>();
    outVertices = outVertices.concat(changedPoints);
    //塞入新增顶点
    for (let value of newPoints)
        outVertices = outVertices.concat(value[1]); 
    
    let triangleNum = indexes.length / 3;
    let startIndex = vertices.length / 3;       //新索引值要增加偏移值，即在原有坐标的数量
    for (let i = 0; i < triangleNum; ++i) {
        let index1 = indexes[i * 3 + 0];
        let index2 = indexes[i * 3 + 1];
        let index3 = indexes[i * 3 + 2];
        
        let newIndex1: number;
        if (newPoints.has(index1.toString() + ',' + index2.toString()))
            newIndex1 = findIndex(index1.toString() + ',' + index2.toString(), newPoints);
        else
            newIndex1 = findIndex(index2.toString() + ',' + index1.toString(), newPoints);
        
        let newIndex2: number;
        if (newPoints.has(index2.toString() + ',' + index3.toString()))
            newIndex2 = findIndex(index2.toString() + ',' + index3.toString(), newPoints);
        else
            newIndex2 = findIndex(index3.toString() + ',' + index2.toString(), newPoints);
        
        let newIndex3: number;
        if (newPoints.has(index3.toString() + ',' + index1.toString()))
            newIndex3 = findIndex(index3.toString() + ',' + index1.toString(), newPoints);
        else
            newIndex3 = findIndex(index1.toString() + ',' + index3.toString(), newPoints);

        outIndexes.push(index1);
        outIndexes.push(newIndex1 + startIndex);
        outIndexes.push(newIndex3 + startIndex);

        outIndexes.push(newIndex1 + startIndex);
        outIndexes.push(index2);
        outIndexes.push(newIndex2 + startIndex);

        outIndexes.push(newIndex3 + startIndex);
        outIndexes.push(newIndex2 + startIndex);
        outIndexes.push(index3);

        outIndexes.push(newIndex1 + startIndex);
        outIndexes.push(newIndex2 + startIndex);
        outIndexes.push(newIndex3 + startIndex);
    }
    return [outVertices, outIndexes];
}