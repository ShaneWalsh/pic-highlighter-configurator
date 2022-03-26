import { drawBorder, drawCircle, drawLine } from "./Drawing";


export class DiagramElement {
    id:string = 'ep'+Date.now();
    name: string = 'GenericRandomlyGenerated'; 
    color: string = '#FF0000';
    cords:{x:number,y:number} = {x:0,y:0};

    setCords(cords:{x:number,y:number} ){
        this.cords = cords;
    }

    setSecondary(size:{sizeX:number, sizeY:number}, secondaryCords:{x:number,y:number}){
        // childImplToDecide
    }

    draw(ctx:CanvasRenderingContext2D){
        
    }  
}

enum Shapes {
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
    
    setSecondary(size:{sizeX:number, sizeY:number}, secondaryCords:{x:number,y:number}){
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
    secondaryCords:{x:number,y:number} = {x:0,y:0};

    setCords(cords:{x:number,y:number} ){
        this.cords = cords;
        this.secondaryCords =cords;
    }

    setSecondary(size:{sizeX:number, sizeY:number}, secondaryCords:{x:number,y:number}){
        this.secondaryCords = secondaryCords;
    }

    draw(ctx:CanvasRenderingContext2D){
        drawLine(
            this.cords.x,
            this.cords.y,
            this.secondaryCords.x,
            this.secondaryCords.y,
            this.color,
            ctx
        )
    }
}