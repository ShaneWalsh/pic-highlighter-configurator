
/** Sensible defaults for when a prop is not set */
const reset = (ctx:CanvasRenderingContext2D) => {
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
}

export const drawBorder = (x:number,y:number,sizeX:number,sizeY:number, width:number,color:any, fill:any, ctx:CanvasRenderingContext2D) => {
    ctx.beginPath()
    if (fill) {
      ctx.fillStyle = fill
      ctx.fillRect(x,y,sizeX,sizeY);
    }
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.strokeRect(x,y,sizeX,sizeY);
    
    ctx.closePath()
    reset(ctx);
}

export const drawLine = (x:number,y:number,xx:number,yy:number, width:number, color:string,ctx:CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.moveTo(x, y);
    ctx.lineTo(xx, yy);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath()
}

export const drawLineDashed = (x:number,y:number,xx:number,yy:number, width:number,color:string,ctx:CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x, y);
    ctx.lineTo(xx, yy);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath()
    reset(ctx);
}

export const drawArrowHeads = (x:number,y:number,xx:number,yy:number, width:number,color:string,ctx:CanvasRenderingContext2D, start:boolean, end:boolean, startStyle:any,endStyle:any) => {
    // draw the starting arrowhead
    if(start){
      var startRadians=Math.atan((yy-y)/(xx-x));
      startRadians+=((xx>x)?-90:90)*Math.PI/180;
      drawArrowHead(x,y,startRadians,width,color,ctx,startStyle);
    }
    // draw the ending arrowhead
    if(end){
      var endRadians=Math.atan((yy-y)/(xx-x));
      endRadians+=((xx>x)?90:-90)*Math.PI/180;
      drawArrowHead(xx,yy,endRadians,width,color,ctx,endStyle);
    }
}

export const drawArrowHead = (x:number,y:number,radians:any, width:number,color:string,ctx:CanvasRenderingContext2D, style:any) => {
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.translate(x,y);
  ctx.rotate(radians);
  ctx.moveTo(0,0);
  if(style == "ARROW"){
    ctx.lineTo(10,20);
    ctx.lineTo(0,0);
    ctx.lineTo(-10,20);
  } else { // Full or Empty so draw the entire arrow
    ctx.lineTo(10,20);
    ctx.lineTo(-10,20);
  }
  ctx.closePath();
  ctx.stroke();
  if(style == "FILLED"){ ctx.fill(); }
  ctx.restore();
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
    ctx.closePath()
}

export const drawShape = (cords:{x:number,y:number}[], width:number, color:string, fill:any, ctx:CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.lineWidth = width;
  let cord1=cords[0];
  ctx.moveTo(cord1.x, cord1.y);
  for(let i =1; i < cords.length;i++){
    cord1 = cords[i];
    ctx.lineTo(cord1.x, cord1.y);
  }
  ctx.closePath()
  if(fill){
    ctx.fillStyle = fill;
    ctx.fill();
  }
  ctx.strokeStyle = color;
  ctx.stroke();
}

export const writeInPixels = (x:number, y:number, size:number, text:string, color:string, ctx:any) => {
	//ctx.font = size + "px 'Century Gothic'";
	ctx.font = size + "px 'sans-serif'";
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
}

/**
 * Calculate the shape position of the text and break it up into chunks.
 * TODO add alignments, the below is the topLeft alignment already.
 * Need to add Center Alignment. Text moves left first for the entire width, then starts moving up with new lines added.
 * returns chunks:[{x,y,text}]
 */
export const textToChunks = (x:number, y:number, sizeX:number, sizeY:number, textSize:number, text:string, align:string, shape:any) => {
	if(sizeX > 5 && sizeY > 2) {
    text = text.trim();
    const len = text.length;
    // so, lets make a formula for how much 
    let maxLen = Math.floor(sizeX / (textSize/2)) + Math.floor(sizeX/100);
    let curLen = 0;
    let chunks = [];
    let topPadding = Math.round((textSize/100) * 90);
    for(let i =0; curLen < len; i++) {
      // TODO newline support, so it can be formatted nicer.
      let max = (curLen+maxLen >= len)?len:curLen+maxLen;
      while(text.charAt(max)!== ' ' && max < len && max > 2){max--;}
      chunks.push({x:x + 5,y:y+topPadding+(i*textSize),text:text.substring(curLen,max).trim() });
      curLen = max;
      if(i > 1000) return []; // sanity fallback
    }
    return chunks;
  } else {
    return [];
  }
}

/**
 * Calc how many chunks there will be
 * Then calculate the postions of them, factoring in alignment
 * OOS shape support.
 * returns chunks:[{x,y,text}]
 */
const calculateChunks = (x:number, y:number, sizeX:number, sizeY:number, textSize:number, text:string, align:string, shape:any) => {
  if(sizeX > 5 && sizeY > 2) {
    text = text.trim();
    const len = text.length;
    let maxLen = Math.floor(sizeX / (textSize/2)) + Math.floor(sizeX/100);
    let curLen = 0;
    let texts = [];
    // work out the chunks of text based on the space
    for(let i =0; curLen < len; i++) {
      // TODO newline support, so it can be formatted nicer.
      let max = (curLen+maxLen >= len)?len:curLen+maxLen;
      while(text.charAt(max)!== ' ' && max < len && max > 2){max--;}
      texts.push(text.substring(curLen,max).trim());
      curLen = max;
      if(i > 1000) return []; // sanity fallback
    }
    // then do the alignment
    let chunks:any = [];
    // for standard style
    if(align === "TOPLEFT") {
      let topPadding = Math.round((textSize/100) * 90);
      for(let i = 0; i < texts.length;i++) {
        chunks.push({x:x + 5,y:y+topPadding+(i*textSize),text:texts[i] });
      }
    } else if(align === "CENTER") {
      // TODO
    }

    return chunks;
  } else {
    return [];
  }
}