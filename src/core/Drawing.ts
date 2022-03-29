
export const drawBorder = (x:number,y:number,sizeX:number,sizeY:number,color:any,ctx:any) => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.strokeRect(x,y,sizeX,sizeY);
}

export const drawLine = (x:number,y:number,xx:number,yy:number,color:string,ctx:CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(xx, yy);
    ctx.strokeStyle = color;
    ctx.stroke();
}

export const drawLineDashed = (x:number,y:number,xx:number,yy:number,color:string,ctx:CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x, y);
    ctx.lineTo(xx, yy);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.setLineDash([]); // reset
}

export const  drawCircle = (x:number, y:number, radius:number, fill:any, stroke:any, strokeWidth:number, ctx:CanvasRenderingContext2D) => {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    if (fill) {
      ctx.fillStyle = fill
      ctx.fill()
    }
    if (stroke) {
      ctx.lineWidth = strokeWidth
      ctx.strokeStyle = stroke
      ctx.stroke()
    }
}

export const writeInPixels = (x:number, y:number, size:number, text:string, color:string, ctx:any) => {
	ctx.font = size + "px 'Century Gothic'";
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
}

/**
 * Calculate the shape position of the text and break it up into chunks.
 * returns chunks:[{x,y,text}]
 */
export const textToChunks = (x:number, y:number, sizeX:number, sizeY:number, textSize:number, text:string, align:string, shape:any) => {
	if(sizeX > 10 && sizeY > 10) {
    const len = text.length;
    // so, lets make a formula for how much 
    let maxLen = Math.floor(sizeX / (textSize/2)) + Math.floor(sizeX/100);
    let curLen = 0;
    let chunks = [];
    for(let i =0; curLen < len; i++) {
      // todo, improve by splitting on a word
      let max = (curLen+maxLen >= len)?len-1:curLen+maxLen;
      chunks.push({x:x + textSize,y:y+textSize+(i*textSize),text:text.substring(curLen,max) });
      curLen = curLen+max;
    }
    return chunks;
  }
}