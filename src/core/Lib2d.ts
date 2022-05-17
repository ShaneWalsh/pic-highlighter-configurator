
export const loadImage = (src:any) => {
    let imga = new Image();
    if(src.indexOf("data:image") > -1){
        imga.src = src;
    }
    return imga;
}

export const reversed = (array:any) => {
    let arr = [];
    for(let i = (array.length-1); i > -1;i--){
        arr.push(array[i])
    }
    return arr;
}

/**
 *  Calculates length of a line on Cartesian grid, then returns point that is X number of pixels down the line.
 *
 * @param  {Number} fromX - starting x point
 * @param  {Number} fromY - starting y point
 * @param  {Number} toX - ending x point for vector
 * @param  {Number} toY - ending y point for vector
 * @param  {Number} pxDistance - Number of pixels down line toward ending point to return
 * @return {Object} Returns x/y coords of point on line based on number of pixels given
 */ 
 export const stortenLineDistance = (fromX:number, fromY:number, toX:number, toY:number, pxDistance:number) => {

    //if line is vertical
    if(fromX === toX) return {x: toX, y: toY > fromY ? fromY + pxDistance : fromY - pxDistance};

    //if line is horizontal
    if(fromY === toY) return {y: toY, x: toX > fromX ? fromX + pxDistance : fromX - pxDistance};

    //get each side of original triangle length
    var adjacent   = toY - fromY;
    var opposite   = toX - fromX;
    var hypotenuse = Math.sqrt(Math.pow(opposite, 2) + Math.pow(adjacent,2));

    //find the angle
    var angle = Math.acos(adjacent/hypotenuse);

    //calculate new opposite and adjacent sides
    var newOpposite = Math.sin(angle) * pxDistance;
    var newAdjacent = Math.cos(angle) * pxDistance;

    //calculate new x/y, see which direction it's going
    var y = fromY - newAdjacent,
        x = fromX + newOpposite;

    return {y: y, x: x};
}

export const distance = (x1:number,x2:number,y1:number ,y2:number) => {
    var a = x1 - x2;
    var b = y1 - y2;
    var c = Math.sqrt( a*a + b*b );
    return c;
}
