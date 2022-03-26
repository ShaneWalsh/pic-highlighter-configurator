
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