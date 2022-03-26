import { drawBorder, drawCircle, drawLine } from "./Drawing";


export class DiagramElement {
    id:string = 'ep'+Date.now();
    name: string = 'GenericRandomlyGenerated'; 
    color: string = '#FF0000';
    cords:{x:number,y:number} = {x:0,y:0};

    // Handle the first click
    setCords(cords:{x:number,y:number} ){
        this.cords = cords;
    }

    // Handle the mouse move
    handleMove(size:{sizeX:number, sizeY:number}, secondaryCords:{x:number,y:number}){
        // childImplToDecide
    }

    // Handle the mouse release
    handleLeftRelease(size:{sizeX:number, sizeY:number}, secondaryCords:{x:number,y:number}){
        // childImplToDecide
    }

    draw(ctx:CanvasRenderingContext2D){
        
    }  
}

export enum Shapes {
    RECT="RECT",
    CIRCLE="CIRCLE"
}

export class Shape extends DiagramElement {
    size:{sizeX:number, sizeY:number} = {sizeX:0,sizeY:0};
    shape:Shapes = Shapes.CIRCLE;

    setCords(cords:{x:number,y:number} ){
        this.cords = cords;
        this.size = {sizeX:0,sizeY:0};
    }
    
    handleMove(size:{sizeX:number, sizeY:number}, secondaryCords:{x:number,y:number}){
        this.size = size;
    }

    draw(ctx:CanvasRenderingContext2D) {
        if(this.shape === Shapes.RECT){
            drawBorder(
                this.cords.x,
                this.cords.y,
                this.size.sizeX,
                this.size.sizeY,
                this.color,
                ctx,
            )
        } else if(this.shape === Shapes.CIRCLE){
            drawCircle(
                this.cords.x + (this.size.sizeX/2),
                this.cords.y + (this.size.sizeY/2),
                this.size.sizeX/2,
                null,
                this.color,
                1,
                ctx
            )
        }
    }
}

export class EntryPoint extends Shape {
    // All of the elements related to this entrypoint
    elements:DiagramElement[]=[]

    isHoverable =true;
    isSelectable =true;
    
    // OOS
    isFilled =false;
    fillColor:string = '';
    
    // TEXT OOS
    draw(ctx:CanvasRenderingContext2D) {
        this.elements.forEach( (el:DiagramElement) => {
            el.draw(ctx)
        });
        drawBorder(
            this.cords.x,
            this.cords.y,
            this.size.sizeX,
            this.size.sizeY,
            this.color,
            ctx
        )
    }
}

export class Line extends DiagramElement {
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
        if(!this.cordsSet && this.tempStartCord && this.tempCord){
            drawLine(
                this.tempStartCord.x,
                this.tempStartCord.y,
                this.tempCord.x,
                this.tempCord.y,
                this.color,
                ctx
            )
        } else {
            let first = this.cords;
            for(let i = 0; i < this.secondaryCords.length; i++){
                let sec = this.secondaryCords[i];
                drawLine(
                    first.x,
                    first.y,
                    sec.x,
                    sec.y,
                    this.color,
                    ctx
                )
                first = sec;
            }
            if(this.held && this.tempCord){
                drawLine(
                    first.x,
                    first.y,
                    this.tempCord.x,
                    this.tempCord.y,
                    this.color,
                    ctx
                )
            }
        }
    }
}