import { calculateChunks, drawArrowHeads, drawBorder, drawCircle, drawLine, drawOval, drawRoundRect, drawShape, writeInPixels } from "./Drawing";

export enum LineStyle {
    FULL="FULL",
    DOTTED="DOTTED"
}

export class DiagramElement {
    id:string = "replacement";
    name: string = 'replacement'; 

    color: string = '#bbb';
    strokeWidth:number=.4;
    lineStyle:LineStyle = LineStyle.FULL;

    cords:{x:number,y:number} = {x:0,y:0};

    // transient
    _isHovered=false;
    _isSelected=false;
    _hoverOverride=false;

    constructor(elements:number,code:string) {
        this.id = code+Date.now();
        this.name = elementNames[Math.floor(Math.random()*elementNames.length)]+'-'+elements
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

    isDisplay(){return true}
    setHovered(bool:boolean){this._isHovered= bool; if(!this._isHovered){this._hoverOverride = false}}
    setSelected(bool:boolean){this._isSelected= bool; this._hoverOverride = true;}
    toggleSelected(){this._isSelected = !this._isSelected; this._hoverOverride = true;}

    // Some elements can have multiple hit boxes. e.g Line
    hitboxes(){}

    // handle the import of Json and mapping it to the element.
    mapJson(jsonObj:any) {
        this.id = jsonObj["id"];
        this.name = jsonObj["name"];
        this.color = jsonObj["color"];
        this.strokeWidth = jsonObj["strokeWidth"];
        this.cords = jsonObj["cords"];
        this.lineStyle = jsonObj["lineStyle"];
        // Dont forget to set backwards compatibility if new variables are added.
    }
}

export enum Shapes {
    RECT="RECT",
    ROUNDEDRECT="ROUNDEDRECT",
    OVAL="OVAL",
    CIRCLE="CIRCLE",
    DIAMOND="DIAMOND",
    NONE="NONE"
}

export enum TextAlign {
    CENTER="CENTER",
    TOPLEFT="TOPLEFT",
    TOPCENTER="TOPCENTER",
    SIDEBARLEFT="SIDEBARLEFT",
    SIDEBARCENTER="SIDEBARCENTER",
    CODE="CODE",
}

export class Shape extends DiagramElement {
    size:{sizeX:number, sizeY:number} = {sizeX:0,sizeY:0};
    shape:Shapes = Shapes.RECT;

    link:string="";
    text:string="";
    textSize:number = 15;
    textColor:any = '#333';
    textAlign:TextAlign = TextAlign.CENTER;

    fillColor:string = "#FFFFFF";
    isFilled =false;

    _chunks:{x:number,y:number,text:string}[] = [];

    constructor(num:number,code="SH"){
        super(num,code);
    }

    setDefaults(_defaultValues: any) {
        super.setDefaults(_defaultValues);
        this.link = _defaultValues.link || "";
        this.text = _defaultValues.text || "";
        this.textSize = _defaultValues.textSize;
        this.textColor = _defaultValues.textColor;
        this.textAlign = _defaultValues.textAlign || TextAlign.CENTER;

        this.fillColor = _defaultValues.fillColor;
        this.isFilled = _defaultValues.isFilled || false;
    }

    setCords(cords:{x:number,y:number} ){
        this.cords = cords;
        this.size = {sizeX:0,sizeY:0};
        this.updateText(this.text);
    }

    updateCords(cords:{x:number,y:number} ){
        this.cords = cords;
        this.updateText(this.text);
    }
    
    handleMove(size:{sizeX:number, sizeY:number}, secondaryCords:{x:number,y:number}){
        this.size = size;
        this.updateText(this.text);
    }

    updateText(text:string) {
        this.text = text;
        //this._chunks = textToChunks(this.cords.x,this.cords.y,this.size.sizeX, this.size.sizeY,this.textSize,this.text,"","");
        this._chunks = calculateChunks(this.cords.x,this.cords.y,this.size.sizeX, this.size.sizeY,this.textSize,this.text,this.textAlign,"");
    }

    updateAlign(align:any) {
        this.textAlign = align;
        this._chunks = calculateChunks(this.cords.x,this.cords.y,this.size.sizeX, this.size.sizeY,this.textSize,this.text,this.textAlign,"");
    }

    getFill() {
        return (this.isFilled)?this.fillColor:null;
    }

    getColor() {
        return this.color;
    }

    draw(ctx:CanvasRenderingContext2D) {
        if(this.shape === Shapes.RECT){
            drawBorder(
                this.cords.x,
                this.cords.y,
                this.size.sizeX,
                this.size.sizeY,
                this.strokeWidth,
                this.getColor(),
                this.getFill(),
                this.lineStyle,
                ctx,
            )
        } else if(this.shape === Shapes.ROUNDEDRECT){
            drawRoundRect( this.cords.x, this.cords.y, this.size.sizeX, this.size.sizeY, this.strokeWidth, 5, this.getColor(), this.getFill(), this.lineStyle, ctx )
        } else if(this.shape === Shapes.OVAL){
            drawOval( this.cords.x + this.size.sizeX/2 , this.cords.y + this.size.sizeY/2, this.size.sizeX/2, this.size.sizeY/2, this.strokeWidth, this.getColor(), this.getFill(), this.lineStyle, ctx )
        } else if(this.shape === Shapes.DIAMOND){
            const left = {x:this.cords.x, y :this.cords.y+ (this.size.sizeY/2) };
            const top = {x:this.cords.x + (this.size.sizeX/2), y :this.cords.y };
            const right = {x:this.cords.x + this.size.sizeX, y :this.cords.y+ (this.size.sizeY/2) };
            const bottom = {x:this.cords.x+ (this.size.sizeX/2), y :this.cords.y+ this.size.sizeY };

            drawShape([{x:left.x,y:left.y},{x:top.x,y:top.y},{x:right.x,y:right.y},{x:bottom.x,y:bottom.y},{x:left.x,y:left.y}], this.strokeWidth, this.getColor(), this.getFill(),this.lineStyle, ctx)
            // TODO replace with a drawshape method, takes cords, connects the dots with lines, fills with provided fill value
        } else if(this.shape === Shapes.CIRCLE){
            drawCircle(
                this.cords.x + (this.size.sizeX/2),
                this.cords.y + (this.size.sizeY/2),
                this.size.sizeX/2,
                this.getFill(),
                this.getColor(),
                this.strokeWidth,
                this.lineStyle,
                ctx
            )
        }
        this._chunks.forEach(_chunks => {
            // writeInPixels(this.cords.x+this.size.sizeX/2, this.cords.y+this.size.sizeY/2,15,this.text,this.color,ctx);
            writeInPixels(_chunks.x, _chunks.y, this.textSize, _chunks.text,this.textColor,this.textAlign, this.cords, this.size, ctx);
        })
    }

    drawHover(ctx:CanvasRenderingContext2D){
        drawBorder(this.cords.x,this.cords.y,this.size.sizeX,this.size.sizeY,this.strokeWidth,highlightColor,null, "", ctx,)
    }

    hitboxes(){return [{...this.cords,...this.size}]}

    mapJson(jsonObj:any) {
        super.mapJson(jsonObj);
        this.size = jsonObj["size"];
        this.shape = jsonObj["shape"];
        this.link = jsonObj["link"];
        this.textSize = jsonObj["textSize"];
        this.textColor = jsonObj["textColor"];
        this.fillColor = jsonObj["fillColor"];
        this.isFilled = jsonObj["isFilled"];
        this.updateAlign(jsonObj["textAlign"]);
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
        this.hoverBorderColor = _defaultValues.hoverBorderColor;
        this.selectedFillColor = _defaultValues.selectedFillColor;
        this.selectedBorderColor = _defaultValues.selectedBorderColor;
    }
    shape:Shapes = Shapes.ROUNDEDRECT;
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
    isDisplay(){return this._display};
    setSelected(bool:boolean){this._isSelected= bool; this._hoverOverride = true; if(bool){this._display = true;}}
    
    draw(ctx:CanvasRenderingContext2D) {
        if(this._display) { 
            this.elements.forEach( (el:DiagramElement) => {
                if(el.isDisplay()){
                    el.draw(ctx);
                }
            });
        }
        super.draw(ctx);
    }

    drawHover(ctx:CanvasRenderingContext2D){
        drawBorder(this.cords.x,this.cords.y,this.size.sizeX,this.size.sizeY,this.strokeWidth,this.hoverBorderColor,null, "", ctx,)
        writeInPixels(this.cords.x, this.cords.y-10, 20, this.name, highlightColor, this.textAlign, this.cords, this.size, ctx);
    }

    getFill() {
        if(this.isFilled){
            if(this._isSelected){
                return this.selectedFillColor;
            } else {
                return this.fillColor;
            }
        }
        return null;
    }

    getColor() {
        if(this._isSelected){
            return this.selectedBorderColor;
        } else {
            return this.color;
        }
    }

    // TODO should be a variable thats updated when new elements are added/deleted, but then it has to be stripped from the export. Size concerns, uncessary excess data.
    getSubEntrypoints():EntryPoint[]{
        let arr:EntryPoint[] = [];
        this.elements.forEach(el => {
            if(el instanceof EntryPoint){
                arr.push(el);
            }
        })
        return arr;
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
            } else if(obj["id"].indexOf("SEP") > -1){
                const entrypoint = new EntryPoint(0);
                entrypoint.mapJson(obj);
                this.elements.push(entrypoint);
            }
        }
        // Dont forget to set backwards compatibility if new variables are added.
    }
}

export enum ArrowHeadStyle {
    FILLED="FILLED",
    UNFILLED="UNFILLED",
    ARROW="ARROW",
    NONE="NONE"
}

export enum ArrowHeadSize {
    TINY="TINY",
    SMALL="SMALL",
    MEDIUM="MEDIUM",
    LARGE="LARGE",
    HUGE="HUGE"
}

export class Line extends DiagramElement {
    constructor(num:number,code="LN"){
        super(num,code);
    }
    startArrowStyle:ArrowHeadStyle = ArrowHeadStyle.NONE;
    endArrowStyle:ArrowHeadStyle = ArrowHeadStyle.NONE;    
    startArrowSize:ArrowHeadSize = ArrowHeadSize.SMALL;
    endArrowSize:ArrowHeadSize = ArrowHeadSize.SMALL;
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

    updateCords(cordsNew:{x:number,y:number} ) {
        let diffX = this.cords.x - cordsNew.x;
        let diffY = this.cords.y - cordsNew.y;
        this.cords = cordsNew;
        for(let secCord of this.secondaryCords) {
            secCord.x = secCord.x - diffX;
            secCord.y = secCord.y - diffY;
        }
    }

    handleMove(size:{sizeX:number, sizeY:number}, secondaryCords:{x:number,y:number}) {
        this.tempCord = secondaryCords;
    }

    // Handle the mouse release
    handleLeftRelease(size:{sizeX:number, sizeY:number}, secondaryCords:{x:number,y:number}) {
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
        if(!this.cordsSet && this.tempStartCord && this.tempCord){
            drawer(
                this.tempStartCord.x,
                this.tempStartCord.y,
                this.tempCord.x,
                this.tempCord.y,
                this.strokeWidth,
                this.color,
                this.lineStyle,
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
                    this.lineStyle,
                    ctx
                )
                first = sec;
            }
            // draw the arrow heads for the two ends
            if(this.secondaryCords.length > 1) {
                if(this.startArrowStyle !== ArrowHeadStyle.NONE){
                    drawArrowHeads(this.cords.x,this.cords.y,this.secondaryCords[0].x,this.secondaryCords[0].y,this.strokeWidth,this.color,ctx,
                        true,false, this.startArrowStyle, this.endArrowStyle,this.startArrowSize,this.endArrowSize);
                }
                if(this.endArrowStyle !== ArrowHeadStyle.NONE) {
                    let secondLast = this.secondaryCords[this.secondaryCords.length-2];
                    let last = this.secondaryCords[this.secondaryCords.length-1];
                    drawArrowHeads(secondLast.x,secondLast.y,last.x,last.y,this.strokeWidth,this.color,ctx,
                        false,true, this.startArrowStyle, this.endArrowStyle,this.startArrowSize,this.endArrowSize);
                }
            } else {
                drawArrowHeads(this.cords.x,this.cords.y,first.x,first.y,this.strokeWidth,this.color,ctx,
                    (this.startArrowStyle !== ArrowHeadStyle.NONE), (this.endArrowStyle !== ArrowHeadStyle.NONE), 
                    this.startArrowStyle, this.endArrowStyle,this.startArrowSize,this.endArrowSize);
            }
            
            if(this.held && this.tempCord){
                drawer(
                    first.x,
                    first.y,
                    this.tempCord.x,
                    this.tempCord.y,
                    this.strokeWidth,
                    this.color,
                    this.lineStyle,
                    ctx
                )
            }
        }
    }

    drawHover(ctx:CanvasRenderingContext2D){
        let first = this.cords;
        for(let i = 0; i < this.secondaryCords.length; i++){
            let sec = this.secondaryCords[i];
            drawBorder(first.x-5,first.y-5,sec.x+5,sec.y+5,this.strokeWidth,"#77DD66", null,"", ctx)
            first = sec;
        }
        for(let box of this.hitboxes()){
            drawBorder(box.x,box.y,box.sizeX,box.sizeY,this.strokeWidth,"#77DD66", null, "", ctx)
        }
    }

    hitboxes(){
        let hb = [];
        let first = this.cords;
        for(let i = 0; i < this.secondaryCords.length; i++){
            let sec = this.secondaryCords[i];
            let xDiff = first.x - sec.x; // these will be positives in the end, like counters for the remaining distance.
            let yDiff = first.y - sec.y;
            let xPositive= xDiff > -1;
            let yPositive= yDiff > -1;
            xDiff = !xPositive? xDiff *-1:xDiff;
            yDiff = !yPositive? yDiff *-1:yDiff;
            let xRectSize = xDiff/10;
            let yRectSize = yDiff/10; 
            xRectSize = xRectSize < 5 ? 5 :xRectSize;
            yRectSize = yRectSize < 5 ? 5 :yRectSize;
            while (xDiff > 0 && yDiff > 0){
                hb.push({
                    x:((xPositive)?first.x-xDiff:first.x+xDiff)-5,
                    y:((yPositive)?first.y-yDiff:first.y+yDiff)-5,
                    sizeX:xRectSize+5,
                    sizeY:yRectSize+5});
                xDiff = xDiff -xRectSize;
                yDiff = yDiff -yRectSize;
            }
            first = sec;
        }
        return hb;
    }

    mapJson(jsonObj:any) {
        super.mapJson(jsonObj);
        this.startArrowStyle = jsonObj["startArrowStyle"];
        this.endArrowStyle = jsonObj["endArrowStyle"];        
        this.startArrowSize = jsonObj["startArrowSize"];
        this.endArrowSize = jsonObj["endArrowSize"];
        this.secondaryCords = jsonObj["secondaryCords"];
        // Dont forget to set backwards compatibility if new variables are added.
    }
}

const highlightColor = "#77DD66";

export const elementNames = ['Werewolf','Dragon','Chimera','Loch Ness Monster','Mermaid','Yeti','Basilisk','Sphinx','Medusa','Griffin','Centaur','Hippogriff','Fairy','Kappa','Pegasus',
'Ghoul','Pixie','Cyclops','Redcap','Manticore','Typhon','Sea Serpent','Leprechaun','Fenrir','Hippocampus','Cipactli','Imp','Minotaur','Hydra','Fomorians',
'Charybdis','Behemoth','Cerberus','Echidna','Adlet','Cacus','Hecatoncheires','Geryon','Scorpion Man','Fachan','Ogre','Humbaba','Scylla','Hadhayosh',
'Kee-wakw','Abaia','Calygreyhound','Phoenix','Tarasque','Cockatrice','Harpy','Makara','Ammit','Garuda','Winged Lion','Leviathan','Wyvern','Namazu',
'Centicore','Elf','Mares of Diomedes','Serpopard','Antero','Indus','Ahuizotl','Psoglav','Aspidochelone','Sirin','Cynocephaly','Myrmecoleon','Argus Panoptes',
'Ekek','Oozlum Bird','Hellhound','Monocerus','Leper','Ophiotaurus','Unktehila','Capacun','Mapinguari','Yali','Fish-Man','Asakku','Sleipnir',
'Ushi-oni','Longma','Nguruvilu','Lou Carcolh','Yacuruna','Bashee','Teju Jagua','Indrik','Onocentaur','Simargl','Erchitu','Huay Chay','Laestrygonians','Mboi Tui'];