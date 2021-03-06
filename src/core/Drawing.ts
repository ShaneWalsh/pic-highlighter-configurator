
/** Sensible defaults for when a prop is not set */
const reset = (ctx:CanvasRenderingContext2D) => {
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
}

export const drawBorder = (x:number,y:number,sizeX:number,sizeY:number, width:number,color:any, fill:any, style:any, ctx:CanvasRenderingContext2D) => {
  ctx.save();     
  ctx.beginPath()
  if(style === "DOTTED") {
    ctx.setLineDash([5, 5]);
  }
  if (fill) {
    ctx.fillStyle = fill
    ctx.fillRect(x,y,sizeX,sizeY);
  }
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.strokeRect(x,y,sizeX,sizeY);
  
  ctx.closePath()
  reset(ctx);
  ctx.restore();
}

export const drawLine = (x:number,y:number,xx:number,yy:number, width:number, color:string, style:any, ctx:CanvasRenderingContext2D) => {
  ctx.save();    
  ctx.beginPath();
  if(style === "DOTTED") {
    ctx.setLineDash([5, 5]);
  }
  ctx.lineWidth = width;
  ctx.moveTo(x, y);
  ctx.lineTo(xx, yy);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

export const drawArrowHeads = (x:number,y:number,xx:number,yy:number, width:number,color:string,ctx:CanvasRenderingContext2D, start:boolean, end:boolean, startStyle:any,endStyle:any,startSize:any,endSize:any) => {
  // draw the starting arrowhead
  if(start){
    var startRadians=Math.atan((yy-y)/(xx-x));
    startRadians+=((xx>x || xx === x)?-90:90)*Math.PI/180;
    drawArrowHead(x,y,startRadians,width,color,ctx,startStyle,startSize);
  }
  // draw the ending arrowhead
  if(end){
    var endRadians=Math.atan((yy-y)/(xx-x));
    endRadians+=((xx>x || xx === x)?90:-90)*Math.PI/180;
    drawArrowHead(xx,yy,endRadians,width,color,ctx,endStyle,endSize);
  }
}

export const drawArrowHead = (x:number,y:number,radians:any, width:number,color:string,ctx:CanvasRenderingContext2D, style:any, size:any) => {
  ctx.save();
  let sizes = getSize(size);
  if(style === "TONONE") {
    ctx.beginPath();
    ctx.translate(x,y);
    ctx.rotate(radians)
    ctx.ellipse(0, sizes.wing, sizes.nose/2,sizes.wing/6, 0, 0, Math.PI*2);
    ctx.closePath();
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.translate(x,y);
    ctx.rotate(radians);
    ctx.moveTo(0,0);
    
    if(style === "ARROW"){
      ctx.lineTo(sizes.nose,sizes.wing);
      ctx.lineTo(0,0);
      ctx.lineTo(sizes.nose*-1,sizes.wing);
    } else if(style === "TOMANY"){
      ctx.lineTo(0,0);
      ctx.lineTo(sizes.nose,sizes.wing*-1);
      ctx.lineTo(0,0);
      ctx.lineTo(sizes.nose*-1,sizes.wing*-1);
      ctx.lineTo(0,0);
      ctx.lineTo(0,sizes.wing*-1);
    } else if(style === "TOONE"){
      ctx.lineTo(0,sizes.wing);
      ctx.lineTo(sizes.nose,sizes.wing);
      ctx.lineTo(sizes.nose*-1,sizes.wing);
      ctx.lineTo(0,sizes.wing);
    } else { // Full or Empty so draw the entire arrow
      ctx.lineTo(sizes.nose,sizes.wing);
      ctx.lineTo(sizes.nose*-1,sizes.wing);
    }
    ctx.closePath();
    ctx.stroke();
    if(style === "FILLED"){ ctx.fill(); }
    if(style === "UNFILLED"){ ctx.fillStyle = "#FFF";ctx.fill(); }
  }
  ctx.restore();
}

const getSize = (size:any) => {
  if(size === "TINY"){
    return {nose:5,wing:6}
  } else   if(size === "SMALL"){
    return {nose:5,wing:9}
  } else   if(size === "MEDIUM"){
    return {nose:6,wing:12 }
  } else   if(size === "LARGE"){
    return {nose:10,wing:20}
  } else   if(size === "HUGE"){
    return {nose:15,wing:30}
  }
  return {nose:5,wing:10};
}

export const  drawCircle = (x:number, y:number, radius:number, fill:any, stroke:any, strokeWidth:number, style:any, ctx:CanvasRenderingContext2D) => {
  ctx.save();  
  ctx.beginPath()
  if(style === "DOTTED") {
    ctx.setLineDash([5, 5]);
  }
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
  ctx.restore();
}

export const drawShape = (cords:{x:number,y:number}[], width:number, color:string, fill:any, style:any, ctx:CanvasRenderingContext2D) => {
  ctx.save();  
  ctx.beginPath();
  ctx.lineWidth = width;
  if(style === "DOTTED") {
    ctx.setLineDash([5, 5]);
  }
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
  ctx.restore();
}

export const drawRoundRect = (x:number, y:number, sizeX:number,sizeY:number, width:number, radius:any, color:string, fill:any, style:any, ctx:any) => {
  ctx.save();  
  ctx.beginPath();
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius:any = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  if( style === "DOTTED" ) {
    ctx.setLineDash([5, 5]);
  }
  ctx.lineWidth = width;
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + sizeX - radius.tr, y);
  ctx.quadraticCurveTo(x + sizeX, y, x + sizeX, y + radius.tr);
  ctx.lineTo(x + sizeX, y + sizeY - radius.br);
  ctx.quadraticCurveTo(x + sizeX, y + sizeY, x + sizeX - radius.br, y + sizeY);
  ctx.lineTo(x + radius.bl, y + sizeY);
  ctx.quadraticCurveTo(x, y + sizeY, x, y + sizeY - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.restore();
}

export const drawOval = (x:number, y:number, sizeX:number,sizeY:number, width:number, color:string, fill:any, style:any, ctx:any) => {
  ctx.save();  
  ctx.beginPath();
  if( style === "DOTTED" ) {
    ctx.setLineDash([5, 5]);
  }
  ctx.lineWidth = width;
  ctx.ellipse(x, y, sizeX, sizeY, 0, 0, Math.PI*2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.restore();
}

export const drawDatabase = (x:number, y:number, sizeX:number,sizeY:number, width:number, color:string, fill:any, style:any, ctx:any) => {
  ctx.save();  
  ctx.beginPath();
  if( style === "DOTTED" ) {
    ctx.setLineDash([5, 5]);
  }
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.fillStyle = fill;

  ctx.ellipse(x, y+(sizeY/2), sizeX, sizeY/2, 0, 0, Math.PI*2);
  if (fill) {ctx.fill();}
  ctx.stroke();
  // this rect is drawn over the first ellipse to add the sides
  ctx.beginPath();
  ctx.strokeRect(x-sizeX,y-(sizeY/2),sizeX*2,sizeY);
  // finally the top ellipse
  ctx.beginPath();
  ctx.ellipse(x, y-(sizeY/2), sizeX, sizeY/2, 0, 0, Math.PI*2);
  if (fill) {
    ctx.fill();
    ctx.fillRect(x-sizeX,y-(sizeY/2),sizeX*2,sizeY);
  }
  ctx.stroke();
  ctx.restore();
}

export const drawPackage = (x:number, y:number, sizeX:number,sizeY:number, width:number, color:string, fill:any, style:any, ctx:any) => {
  ctx.save();  
  ctx.beginPath();
  if( style === "DOTTED" ) {
    ctx.setLineDash([5, 5]);
  }
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.fillStyle = fill;
  let sizeYTop = (sizeY/4)
  ctx.strokeRect(x,y, (sizeX/4), sizeYTop);
  if (fill) { ctx.fillRect(x,y, (sizeX/4), sizeYTop); }
  ctx.beginPath();
  ctx.strokeRect(x,y+sizeYTop, sizeX, sizeY-sizeYTop);
  ctx.restore();
}

export const drawClass = (x:number, y:number, sizeX:number,sizeY:number, width:number, color:string, fill:any, style:any, ctx:any) => {
  ctx.save();  
  ctx.beginPath();
  if( style === "DOTTED" ) {
    ctx.setLineDash([5, 5]);
  }
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.fillStyle = fill;
  let sizeYTop = (sizeY/3)
  ctx.strokeRect(x,y, sizeX, sizeYTop);
  if (fill) {ctx.fillRect(x,y, sizeX, sizeYTop);}
  ctx.beginPath();
  ctx.strokeRect(x,y+sizeYTop, sizeX, sizeY-sizeYTop);
  if (fill) {ctx.fillRect(x,y+sizeYTop, sizeX, sizeY-sizeYTop);}
  ctx.restore();
}

export const writeInPixels = (x:number, y:number, size:number, text:string, color:string, align:string, cords:any, sizes:any, ctx:any) => {
	//ctx.font = size + "px 'Century Gothic'";
  if(align === "SIDEBARLEFT"){
    let newX = cords.x + (y-cords.y);
    let newY = cords.y + sizes.sizeY
    ctx.save();
    ctx.font = size + "px 'sans-serif'";
    ctx.fillStyle = color;
    ctx.translate( newX, newY);
    ctx.rotate(-Math.PI/2);
    ctx.fillText(text, 5, 0);
    ctx.restore();
  } else if(align === "SIDEBARCENTER"){
    let newX = cords.x + (y-cords.y);
    let newY = cords.y + (sizes.sizeY/2)
    ctx.save();
    ctx.font = size + "px 'sans-serif'";
    ctx.fillStyle = color;
    ctx.translate( newX, newY);
    ctx.rotate(-Math.PI/2);
    ctx.textAlign = 'center';
    ctx.fillText(text, 5, 0);
    ctx.restore();
  } else if (align === "CENTER" || align === "TOPCENTER") {
    ctx.save();
    ctx.font = size + "px 'sans-serif'";
    ctx.fillStyle = color;
    let textSpace = ctx.measureText(text).width;
    ctx.fillText(text, cords.x+ ((sizes.sizeX-textSpace)/2), y);
    ctx.restore();
  } else {
    ctx.save();
    ctx.font = size + "px 'sans-serif'";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
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
export const calculateChunks = (x:number, y:number, sizeX:number, sizeY:number, textSize:number, text:string, align:string, shape:any) => {
  if(sizeX > 5 && sizeY > 2) {
    if(align === "CODE"){
      let texts:any[] = text.split("\n");
      let chunks:any = [];
      let topPadding = Math.round((textSize/100) * 130);
      for(let i = 0; i < texts.length;i++) {
        chunks.push({x:x + 5,y:y+topPadding+(i*textSize),text:texts[i] });
      }
      return chunks
    } else {
      text = text.trim();
      const len = text.length;
      let maxLen = Math.floor(sizeX / (textSize/2)) + Math.floor(sizeX/100);
      if(align === "SIDEBARLEFT" || align === "SIDEBARCENTER") { // the size is actually measured by height when doing sidebar
        maxLen = Math.floor(sizeY / (textSize/2)) + Math.floor(sizeY/100);
      }
      let curLen = 0;
      let texts:any[] = [];
      // work out the chunks of text based on the space
      for(let i =0; curLen < len; i++) {
        let max = (curLen+maxLen >= len)?len:curLen+maxLen;
        while(text.charAt(max)!== ' ' && max < len && max > 2){max--;}
        let txt = text.substring(curLen,max); //.trim();

        // Check for newlines in this text and split on it.
        let newLineSplits = txt.split('\n');// .map(t => t.trim());
        if(newLineSplits.length === 1){
          curLen = max;
        } else {
          curLen = curLen + newLineSplits[0].length + 1 // +1 to get past the \n
        }
        texts.push(newLineSplits[0]);
        if(i > 10000) return []; // sanity fallback
      }
      texts = texts.map(t => t.trim()).filter(t => t.length > 0); // trim everything. We cannot do it above, because we need the full lenghts for measuring
      // then do the alignment
      let chunks:any = [];
      // for standard style
      if(align === "TOPLEFT" || align === "SIDEBARLEFT" || align === "SIDEBARCENTER") {
        let topPadding = Math.round((textSize/100) * 90);
        for(let i = 0; i < texts.length;i++) {
          chunks.push({x:x + 5,y:y+topPadding+(i*textSize),text:texts[i] });
        }
      } else if(align === "CENTER") {
        // TODO
        let halfText = textSize/2;
        let startingY = 5 + (sizeY/2);
        let startingX = (sizeX/2);
        // Lets work out the starting Y
        if(texts.length % 2 === 0 && texts.length > 1){ // even
          let even = texts.length/2;
          startingY = (startingY+halfText) - (textSize * even);
        } else if((texts.length % 2 === 1 && texts.length > 1)){
          let odd = Math.floor(texts.length/2); // round down.
          startingY = startingY - (textSize * odd);
        }
        // X will be worked out independently for each line
        for(let i = 0; i < texts.length;i++) {
          let txt = texts[i];
          let centeringAdjustment = 0;
          if(txt.length < 10) centeringAdjustment = halfText;
          let percentage = ((txt.length/maxLen)*100); // whats this text % of the total length is this string? Then half it.
          let widthOffset = ((sizeX/2)/100)*percentage; // now take this half percentage from the startingX which is centered.
          chunks.push({x:x+(startingX - widthOffset)-centeringAdjustment ,y:y+startingY+(i*textSize),text:texts[i] });
        }
      } else if(align === "TOPCENTER") {
        // TODO
        let halfText = textSize/2;
        let startingY = Math.round((textSize/100) * 90);
        let startingX = (sizeX/2);
        // X will be worked out independently for each line
        for(let i = 0; i < texts.length;i++) {
          let txt = texts[i];
          let centeringAdjustment = 0;
          if(txt.length < 10) centeringAdjustment = halfText;
          let percentage = ((txt.length/maxLen)*100); // whats this text % of the total length is this string? Then half it.
          let widthOffset = ((sizeX/2)/100)*percentage; // now take this half percentage from the startingX which is centered.
          chunks.push({x:x+(startingX - widthOffset)-centeringAdjustment ,y:y+startingY+(i*textSize),text:texts[i] });
        }
      }

      return chunks;
    }
  } else {
    return [];
  }
}