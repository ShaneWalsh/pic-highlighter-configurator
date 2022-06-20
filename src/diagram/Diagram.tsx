import * as React from 'react'
import { EntryPoint, LineStyle } from '../core/DiagramElement';
import { drawBorder, drawLine } from '../core/Drawing';
import { reversed } from '../core/Lib2d';

class Diagram extends React.Component<any,any> {
    constructor(props:any) {
      super(props);

      this.state = {
        canvas: null,
        ctx:null,
        mouseX:0,
        mouseY:0,
        leftClickHeld:false,
        heldCords:{x:0,y:0},
        beingHovered:null,

        dragging:null,
        draggingCords:null,
        draggingAll:false,
        draggingXOffset:null, // TODO deprecate
        draggingYOffset:null, // TODO deprecate

        keyPressed:[]
      };
      this.updateMousePosition = this.updateMousePosition.bind(this);
      this.mouseClick = this.mouseClick.bind(this);
      this.mouseClickRelease = this.mouseClickRelease.bind(this);
      this.rightClickContext = this.rightClickContext.bind(this);
      this.doubleClick = this.doubleClick.bind(this);
    }

    // After Render of the screen.
    componentDidMount() {
        const canvasRef:any = document.getElementById('canvas-highlighter');
        const canvasCtx = canvasRef.getContext('2d');
        canvasRef.addEventListener("mousemove", this.updateMousePosition, false);
        canvasRef.addEventListener("dblclick", this.doubleClick, false);
        canvasRef.addEventListener("mousedown", this.mouseClick, false);
        canvasRef.addEventListener("mouseup", this.mouseClickRelease, false);
        canvasRef.addEventListener("contextmenu", this.rightClickContext, false);

        document.addEventListener("keydown", this.keyDown.bind(this), false);
        document.addEventListener("keyup", this.keyUp.bind(this), false);

        this.drawBase(canvasCtx);
        
        this.setState({
            canvas:canvasRef,
            ctx:canvasCtx
        })
        this.draw(canvasCtx);
    }

    componentWillUnmount() {
      document.removeEventListener("mousemove",this.updateMousePosition);
      document.removeEventListener("dblclick", this.doubleClick);
      document.removeEventListener("mousedown", this.mouseClick);
      document.removeEventListener("mouseup", this.mouseClickRelease);
      document.removeEventListener("contextmenu", this.rightClickContext);

      document.removeEventListener("keydown", this.keyDown);
      document.removeEventListener("keyup", this.keyUp);
    }

    keyDown(event:KeyboardEvent) {
        this.setState(function(state:any, props:any) {
            state.keyPressed.push(event.key);
            return {
                keyPressed:state.keyPressed
            };
        });
    }

    keyUp(event:KeyboardEvent) {
        var name = event.key;
        if (name === 'z' && this.state.keyPressed.indexOf('Control') > -1) {
            this.props.performUndo();
        }
        this.setState(function(state:any, props:any) {
            let arr:any = state.keyPressed.filter((key: string) => key !== event.key)
            return {
                keyPressed:arr
            };
        });
    }

    isShiftPressed():boolean{
        return this.state.keyPressed.indexOf('Shift') > -1;
    }

    updateMousePosition(e:MouseEvent) {
        const cords = this.getCords(e);
        const sizes = this.getSizes(e, cords);
        let hovered = null;
        // TODO resolve this limitiation, where you can only drag from left to bottom right, if I dragged the other way the cords and sizes values just need to be flipped.
        if(this.props.placing || this.isShiftPressed()){
            if(this.state.leftClickHeld) {
                this.props.currentEl?.handleMove(sizes, cords);
            }
        } else if(this.props.selecting) { // then highlight it, and on click, emit it.
            if ( this.state.dragging ) { // we have clicked on something.
                if(this.state.draggingAll){
                    let dragCords = {
                        xOffset:(this.state.draggingCords.x - cords.x) * -1, 
                        yOffset:(this.state.draggingCords.y - cords.y) * -1 };
                    // console.log("cords x:"+cords.x +" y:"+ cords.y);
                    console.log("dragCords x:"+dragCords.xOffset +" y:"+dragCords.yOffset);
                    this.state.dragging.el.updateAllCords(dragCords);
                } else { // just an individual update then
                    this.state.dragging.el.updateCords({x:cords.x+this.state.draggingXOffset, y:cords.y+this.state.draggingYOffset});
                }
            } else { // else highlight whatever I am hovering over
                for( let ep of reversed(this.props.entryPoints)) {
                    hovered = this.tryFindHover(cords, ep);
                    if(hovered !== null) {
                        break;
                    }
                }
            }
        }
        this.setState({
            beingHovered:hovered,
            mouseX:cords.x,mouseY:cords.y,
            draggingCords:cords
        })
        this.draw(this.state.ctx);
    }

    /**
     * Search the entrypoint for a hover, first the EP itself, then the child elements.
     * returns the first element to be hovered on.
     */
    tryFindHover(cords:{x:number, y:number}, ep: any): Hovered {
        if( ep._display ) {
            for(let el of reversed(ep.elements)) {
                if(el instanceof EntryPoint){ // Handling for SubEntryPoints
                   let hover = this.tryFindHover(cords, el);
                   if(hover !== null) return hover;
                } else {
                    for(let hb of el.hitboxes()){
                        if(this.pointInsideSprite(cords,hb)){
                            return {ep:ep,el:el}; 
                        }
                    }
                }
            }
        }
        for(let hb of ep.hitboxes()){
            if(this.pointInsideSprite(cords,hb)){
                return {ep:ep,el:ep}; 
            }
        }
        return null;
    }
    

    mouseClick(e:MouseEvent) {
        console.log(this.state.mouseX + " - " + this.state.mouseY)
        if(e.button === 0) {
            const cords = this.getCords(e);
            this.setState({leftClickHeld:true,heldCords:cords});
            if(this.props.placing || this.isShiftPressed()){
                this.props.currentEl?.setCords(cords);
            } else if(this.props.selecting) {
                if(this.state.beingHovered){
                    // if its a resize block, then we are resizing and not moving
                    this.setState({
                        dragging:this.state.beingHovered,
                        draggingCords: cords,
                        draggingXOffset:this.state.beingHovered.el.cords.x - cords.x,
                        draggingYOffset:this.state.beingHovered.el.cords.y - cords.y
                    })
                }
            }
        }
        else if(e.button === 1) {
            console.log("1");
            e.preventDefault();
            const cords = this.getCords(e);
            if(this.props.selecting) {
                if(this.state.beingHovered){
                    // if its a resize block, then we are resizing and not moving
                    this.setState({
                        dragging:this.state.beingHovered,
                        draggingCords: cords,
                        draggingAll:true,
                        draggingXOffset:this.state.beingHovered.el.cords.x - cords.x,
                        draggingYOffset:this.state.beingHovered.el.cords.y - cords.y
                    })
                }
            }
        }
        this.draw(this.state.ctx);
    }

    mouseClickRelease(e:MouseEvent) {
        if(e.button === 0) {
            const cords = this.getCords(e);
            const sizes = this.getSizes(e, cords);
            if(this.props.placing || this.isShiftPressed()) {
                this.props.currentEl?.handleLeftRelease(sizes, cords);
                this.props.placedElement(this.props.currentEl);
            } else if(this.props.selecting) {
                if(this.state.dragging !== null) {
                    this.setState({
                        dragging:null,
                        draggingCords:null,
                        draggingAll:false,
                        draggingXOffset:null,
                        draggingYOffset:null
                    })
                }
            }
            this.setState({leftClickHeld:false})
        } else if(e.button === 1) {
            if(this.props.selecting) {
                if(this.state.dragging !== null) {
                    this.setState({
                        dragging:null,
                        draggingCords:null,
                        draggingAll:false,
                        draggingXOffset:null,
                        draggingYOffset:null
                    })
                }
            }
        }
        this.draw(this.state.ctx);
    }

    // this is just a catch for the context menu, to prevent it from appearing.
    rightClickContext(e:MouseEvent){ 
        e.preventDefault(); 
        // TODO cancel whatever state we are in, back to inital clean state.
        this.draw(this.state.ctx);
    }
    doubleClick(e:MouseEvent){ 
        if(this.props.selecting) {
            if(this.state.beingHovered !== null) {
                this.props.selectElement(this.state.beingHovered)
                this.setState({
                    dragging:null,
                    draggingCords:null,
                    draggingAll:false,
                    beingHovered:null,
                    draggingXOffset:null,
                    draggingYOffset:null
                })
            }
        }
        this.draw(this.state.ctx); 
    }
    getOffset(el:HTMLCanvasElement) {
        const rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY
        }
    }
    getCords(e:MouseEvent){
        const v= this.getOffset(this.state.canvas);
        let x =  Math.floor(e.pageX)-v.left;
        let y =  Math.floor(e.pageY)-v.top;
        x = x - (x % this.props.scale)
        y = y - (y % this.props.scale)
        return {x,y}
    }
    getSizes(e: MouseEvent, cords:any) {
        let sizes = {sizeX:(cords.x-this.state.heldCords.x ),sizeY:(cords.y-this.state.heldCords.y)};
        sizes.sizeX = sizes.sizeX - (sizes.sizeX % this.props.scale)
        sizes.sizeY = sizes.sizeY - (sizes.sizeY % this.props.scale)
        return sizes
    }

    // Draw everything, NO STATE CHANGES!
    draw(ctx:CanvasRenderingContext2D) {
        ctx.clearRect(0,0,this.props.width,this.props.height);
        this.drawBase(ctx);
        // Render the current element
        if(this.props.currentEl) {
            this.props.currentEl.draw(this.state.ctx);
        }
        if(this.props.entryPoints) {
            this.props.entryPoints.forEach((el: any) => {
                el.draw(this.state.ctx);
            });
        }
        if(this.state.beingHovered !== null) {
            let hovered = this.state.beingHovered;
            hovered.el.drawHover(ctx)
        }
    }

    drawBase(canvasCtx:any) {
        canvasCtx.fillStyle = this.props.backgroundColor;
        canvasCtx.fillRect(0,0,this.props.width,this.props.height);
        // draw the background image whatever it is
        if(this.props.background) {
            canvasCtx.drawImage(this.props.background, 0, 0, this.props.width, this.props.height);
        }
        if(this.props.displayGrid) {
            let grid = this.props.scale;
            for(let startX = grid; startX < this.props.width; startX += grid) {
                for(let startY = grid; startY < this.props.height; startY += grid) {
                    drawLine(0,startY,this.props.width,startY,1,"#e0e0e0",LineStyle.FULL,canvasCtx );
                }
                drawLine(startX,0,startX,this.props.height,1,"#e0e0e0",LineStyle.FULL,canvasCtx );
            }
        }
        // border on the canvas
        drawBorder(0,0,this.props.width,this.props.height,.1,'#000000',null, "", canvasCtx)
    }
    
    pointInsideSprite(point:{x:number,y:number}, sprite:{x:number,y:number,sizeX:number,sizeY:number}) {
        if(point.x > sprite.x && point.x < (sprite.x+sprite.sizeX) ){
            if(point.y > sprite.y && point.y < (sprite.y+sprite.sizeY)){
                return true;
            }
        }
    }

    render() {
        return (
            <div id="diagram">
                <canvas id="canvas-highlighter" width={this.props.width} height={this.props.height} ></canvas>
            </div>
        );
    }
  };

export default Diagram;

export class Hovered {
    // The element
    el:any;
    // The entrypoint parent
    ep:any;
}