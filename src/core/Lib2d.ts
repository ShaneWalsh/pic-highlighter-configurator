
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