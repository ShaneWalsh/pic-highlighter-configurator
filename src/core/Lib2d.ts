
export const loadImage = (src:any) => {
    let imga = new Image();
    if(src.indexOf("data:image") > -1){
        imga.src = src;
    }
    return imga;
}

