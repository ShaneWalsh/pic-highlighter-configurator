import { hasPointerEvents } from "@testing-library/user-event/dist/utils";
import { drawBorder, drawCircle, drawLine, drawLineDashed, drawShape, textToChunks, writeInPixels } from "./Drawing";


export class DiagramElement {
    id:string = "replacement";
    name: string = 'replacement'; 

    color: string = '#bbb';
    strokeWidth:number=.4;

    cords:{x:number,y:number} = {x:0,y:0};

    constructor(elements:number,code:string) {
        this.id = code+Date.now();
        this.name = code+elements; 
    }

    setDefaults(_defaultValues: any) {
        this.color = _defaultValues.color; 
        this.strokeWidth = _defaultValues.strokeWidth; 
    }

    // Handle the first click
    setCords(cords:{x:number,y:number} ) {
        this.cords = cords;
    }

    // Handle the mouse move
    handleMove(size:{sizeX:number, sizeY:number}, secondaryCords:{x:number,y:number}) {
        // childImplToDecide
    }

    // Handle the mouse release
    handleLeftRelease(size:{sizeX:number, sizeY:number}, secondaryCords:{x:number,y:number}) {
        // childImplToDecide
    }

    draw(ctx:CanvasRenderingContext2D) {}  

    // When the editor hovers over them in selecting mode
    drawHover(ctx:CanvasRenderingContext2D){}

    // Some elements can have multiple hit boxes. e.g Line
    hitboxes(){}

    // handle the import of Json and mapping it to the element.
    mapJson(jsonObj:any) {
        this.id = jsonObj["id"];
        this.name = jsonObj["name"];
        this.color = jsonObj["color"];
        this.strokeWidth = jsonObj["strokeWidth"];
        this.cords = jsonObj["cords"];
        // Dont forget to set backwards compatibility if new variables are added.
    }
}

export enum Shapes {
    RECT="RECT",
    CIRCLE="CIRCLE",
    DIAMOND="DIAMOND",
    NONE="NONE"
}

export class Shape extends DiagramElement {
    size:{sizeX:number, sizeY:number} = {sizeX:0,sizeY:0};
    shape:Shapes = Shapes.RECT;

    text:string="";
    textSize:number = 15;
    textColor:any = '#333'

    fillColor:string = "#FFFFFF";
    isFilled =false;

    _chunks:{x:number,y:number,text:string}[] = [];

    constructor(num:number,code="SH"){
        super(num,code);
    }

    setDefaults(_defaultValues: any) {
        super.setDefaults(_defaultValues);
        this.text = _defaultValues.text || "";
        this.textSize = _defaultValues.textSize;
        this.textColor = _defaultValues.textColor;

        this.fillColor = _defaultValues.fillColor;
        this.isFilled = _defaultValues.isFilled || false;
    }

    setCords(cords:{x:number,y:number} ){
        this.cords = cords;
        this.size = {sizeX:0,sizeY:0};
        this.updateText(this.text);
    }
    
    handleMove(size:{sizeX:number, sizeY:number}, secondaryCords:{x:number,y:number}){
        this.size = size;
        this.updateText(this.text);
    }

    updateText(text:string) {
        this.text = text;
        this._chunks = textToChunks(this.cords.x,this.cords.y,this.size.sizeX, this.size.sizeY,this.textSize,this.text,"","");
    }

    getFill(): any {
        return (this.isFilled)?this.fillColor:null;
    }

    draw(ctx:CanvasRenderingContext2D) {
        if(this.shape === Shapes.RECT){
            drawBorder(
                this.cords.x,
                this.cords.y,
                this.size.sizeX,
                this.size.sizeY,
                this.strokeWidth,
                this.color,
                this.getFill(),
                ctx,
            )
        } else if(this.shape === Shapes.DIAMOND){
            const left = {x:this.cords.x, y :this.cords.y+ (this.size.sizeY/2) };
            const top = {x:this.cords.x + (this.size.sizeX/2), y :this.cords.y };
            const right = {x:this.cords.x + this.size.sizeX, y :this.cords.y+ (this.size.sizeY/2) };
            const bottom = {x:this.cords.x+ (this.size.sizeX/2), y :this.cords.y+ this.size.sizeY };

            drawShape([{x:left.x,y:left.y},{x:top.x,y:top.y},{x:right.x,y:right.y},{x:bottom.x,y:bottom.y},{x:left.x,y:left.y}], this.strokeWidth, this.color, this.getFill(), ctx)
            // TODO replace with a drawshape method, takes cords, connects the dots with lines, fills with provided fill value
        } else if(this.shape === Shapes.CIRCLE){
            drawCircle(
                this.cords.x + (this.size.sizeX/2),
                this.cords.y + (this.size.sizeY/2),
                this.size.sizeX/2,
                this.getFill(),
                this.color,
                this.strokeWidth,
                ctx
            )
        }
        this._chunks.forEach(_chunks => {
            // writeInPixels(this.cords.x+this.size.sizeX/2, this.cords.y+this.size.sizeY/2,15,this.text,this.color,ctx);
            writeInPixels(_chunks.x, _chunks.y, this.textSize, _chunks.text,this.textColor,ctx);
        })
    }

    drawHover(ctx:CanvasRenderingContext2D){
        drawBorder(this.cords.x,this.cords.y,this.size.sizeX,this.size.sizeY,this.strokeWidth,"#77DD66",null,ctx,)
    }

    hitboxes(){return [{...this.cords,...this.size}]}

    mapJson(jsonObj:any) {
        super.mapJson(jsonObj);
        this.size = jsonObj["size"];
        this.shape = jsonObj["shape"];
        this.textSize = jsonObj["textSize"];
        this.textColor = jsonObj["textColor"];
        this.fillColor = jsonObj["fillColor"];
        this.isFilled = jsonObj["isFilled"];
        this.updateText(jsonObj["text"]);
        // Dont forget to set backwards compatibility if new variables are added.
    }
}

export class EntryPoint extends Shape {
    constructor(num:number,code="EP"){
        super(num,code);
    }

    setDefaults(_defaultValues: any) {
        super.setDefaults(_defaultValues);
    }
    // All of the elements related to this entrypoint
    elements:DiagramElement[]=[]

    isHoverable =true; // if not hoverable, it will not highlight the box when hovered over, and not display the elements(TODO extract second part to new Variable?).
    hoverBorderColor = "#000";

    isSelectable =true;
    isSelectedByDefault = false; // when this is true, it will be selected on first draw. Could be used as a BG in absence of an image.

    selectedFillColor = "#FFFFFF"; // when this is true, and not selected, a light colored outline with display where is.
    selectedBorderColor = "#FFFFFF"; // when this is true, and not selected, a light colored outline with display where is.
    
    _display=true;
    toggleDisplay(){this._display = !this._display}
    
    // TEXT OOS
    draw(ctx:CanvasRenderingContext2D) {
        drawBorder(
            this.cords.x,
            this.cords.y,
            this.size.sizeX,
            this.size.sizeY,
            this.strokeWidth,
            this.color,
            this.getFill(),
            ctx
        );
        this.elements.forEach( (el:DiagramElement) => {
            el.draw(ctx)
        });
        this._chunks.forEach(_chunks => {
            // writeInPixels(this.cords.x+this.size.sizeX/2, this.cords.y+this.size.sizeY/2,15,this.text,this.color,ctx);
            writeInPixels(_chunks.x, _chunks.y, this.textSize, _chunks.text,this.textColor,ctx);
        })
    }
    mapJson(jsonObj:any) {
        super.mapJson(jsonObj);
        
        this.isHoverable = jsonObj["isHoverable"];
        this.hoverBorderColor = jsonObj["hoverBorderColor"];
        this.isSelectable = jsonObj["isSelectable"];
        this.isSelectedByDefault = jsonObj["isSelectedByDefault"];
        this.selectedFillColor = jsonObj["selectedFillColor"];
        this.selectedBorderColor = jsonObj["selectedBorderColor"];
        for(let obj of jsonObj.elements) {
            if(obj["id"].indexOf("LN") > -1) {
                const line = new Line(0);
                line.mapJson(obj);
                this.elements.push(line);
            } else if(obj["id"].indexOf("SH") > -1){
                const shape = new Shape(0);
                shape.mapJson(obj);
                this.elements.push(shape);
            }
        }
        // Dont forget to set backwards compatibility if new variables are added.
    }
}

export enum LineStyle {
    FULL="FULL",
    DOTTED="DOTTED"
}

export class Line extends DiagramElement {
    constructor(num:number,code="LN"){
        super(num,code);
    }
    lineStyle:LineStyle = LineStyle.FULL;
    secondaryCords:{x:number,y:number}[] = [];
    
    // Transiant variables
    tempStartCord:{x:number,y:number}=null;
    tempCord:{x:number,y:number} = null;
    cordsSet=false;
    held=false;

    setCords(cords:{x:number,y:number} ){
        if(!this.cordsSet){
            this.tempStartCord = cords;
        }
        this.held = true;
    }

    handleMove(size:{sizeX:number, sizeY:number}, secondaryCords:{x:number,y:number}){
        this.tempCord = secondaryCords;
    }

    // Handle the mouse release
    handleLeftRelease(size:{sizeX:number, sizeY:number}, secondaryCords:{x:number,y:number}){
        if(this.cordsSet) {
            this.secondaryCords.push(secondaryCords);
        } else {
            this.cords = this.tempStartCord;
            this.secondaryCords.push(secondaryCords);

            this.cordsSet = true;
            this.tempCord = null;
            this.tempStartCord = null;
        }
        this.held = false;
    }

    draw(ctx:CanvasRenderingContext2D){
        let drawer = drawLine;
        if(this.lineStyle === LineStyle.DOTTED){
            drawer = drawLineDashed;
        }
        if(!this.cordsSet && this.tempStartCord && this.tempCord){
            drawer(
                this.tempStartCord.x,
                this.tempStartCord.y,
                this.tempCord.x,
                this.tempCord.y,
                this.strokeWidth,
                this.color,
                ctx
            )
        } else {
            let first = this.cords;
            for(let i = 0; i < this.secondaryCords.length; i++){
                let sec = this.secondaryCords[i];
                drawer(
                    first.x,
                    first.y,
                    sec.x,
                    sec.y,
                    this.strokeWidth,
                    this.color,
                    ctx
                )
                first = sec;
            }
            if(this.held && this.tempCord){
                drawer(
                    first.x,
                    first.y,
                    this.tempCord.x,
                    this.tempCord.y,
                    this.strokeWidth,
                    this.color,
                    ctx
                )
            }
        }
    }

    drawHover(ctx:CanvasRenderingContext2D){
        let first = this.cords;
        for(let i = 0; i < this.secondaryCords.length; i++){
            let sec = this.secondaryCords[i];
            drawBorder(first.x-5,first.y-5,sec.x+5,sec.y+5,this.strokeWidth,"#77DD66", null, ctx,)
            first = sec;
        }
    }

    hitboxes(){
        let hb = [];
        let first = this.cords;
        for(let i = 0; i < this.secondaryCords.length; i++){
            let sec = this.secondaryCords[i];
            hb.push({x:first.x-5,y:first.y-5,sizeX:sec.x+5,sizeY:sec.y+5});
            first = sec;
        }
        return hb;
    }

    mapJson(jsonObj:any) {
        super.mapJson(jsonObj);
        this.lineStyle = jsonObj["lineStyle"];
        this.secondaryCords = jsonObj["secondaryCords"];
        // Dont forget to set backwards compatibility if new variables are added.
    }
}