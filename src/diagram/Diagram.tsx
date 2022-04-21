import * as React from 'react'
import { drawBorder } from '../core/Drawing';
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
        draggingXOffset:null,
        draggingYOffset:null
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

        this.drawBase(canvasCtx);
        
        this.setState({
            canvas:canvasRef,
            ctx:canvasCtx
        })
        this.draw(canvasCtx);
    }

    componentWillUnmount() {
      document.removeEventListener("mousemove",this.updateMousePosition);
    }

    updateMousePosition(e:MouseEvent) {
        const cords = this.getCords(e);
        const sizes = this.getSizes(e, cords);
        let hovered = null;
        // TODO resolve this limitiation, where you can only drag from left to bottom right, if I dragged the other way the cords and sizes values just need to be flipped.
        if(!this.props.selecting){
            if(this.state.leftClickHeld) {
                this.props.currentEl?.handleMove(sizes, cords);
            }
        } else { // then highlight it, and on click, emit it.
            if ( this.state.dragging ) { // we have clicked on something.
                this.state.dragging.el.updateCords({x:cords.x+this.state.draggingXOffset, y:cords.y+this.state.draggingYOffset});
            } else { // else highlight whatever I am hovering over
                for( let ep of reversed(this.props.entryPoints)) {
                    if( ep._display ) {
                        hovered = this.tryFindHover(cords, ep);
                        if(hovered !== null) break;
                    }
                }
            }
        }
        this.setState({
            beingHovered:hovered,
            mouseX:cords.x,mouseY:cords.y
        })
        this.draw(this.state.ctx);
    }

    /**
     * Search the entrypoint for a hover, first the EP itself, then the child elements.
     * returns the first element to be hovered on.
     */
    tryFindHover(cords:{x:number, y:number}, ep: any): Hovered {
        // TODO, loop on these elements backwards, so the latest drawn can be first selected, as elements are sometimes layered.
        for(let el of reversed(ep.elements)) {
            for(let hb of el.hitboxes()){
                if(this.pointInsideSprite(cords,hb)){
                    return {ep:ep,el:el}; 
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
        if(e.button == 0) {
            const cords = this.getCords(e);
            this.setState({leftClickHeld:true,heldCords:cords});
            if(!this.props.selecting){
                this.props.currentEl?.setCords(cords);
            } else {
                if(this.state.beingHovered){
                    this.setState({
                        dragging:this.state.beingHovered,
                        draggingXOffset:this.state.beingHovered.el.cords.x - cords.x,
                        draggingYOffset:this.state.beingHovered.el.cords.y - cords.y
                    })
                }
            }
        }
        else if(e.button == 2) {
            console.log("Button 2")
        }
        this.draw(this.state.ctx);
    }

    mouseClickRelease(e:MouseEvent) {
        if(e.button == 0) {
            const cords = this.getCords(e);
            const sizes = this.getSizes(e, cords);
            if(!this.props.selecting) {
                this.props.currentEl?.handleLeftRelease(sizes, cords)
            } else {
                if(this.state.dragging !== null) {
                    this.setState({
                        dragging:null,
                        draggingXOffset:null,
                        draggingYOffset:null
                    })
                }
            }
            this.setState({leftClickHeld:false})
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
        const x =  Math.floor(e.pageX)-v.left;
        const y =  Math.floor(e.pageY)-v.top;
        return {x,y}
    }
    getSizes(e: MouseEvent, cords:any) {
        return {sizeX:(cords.x-this.state.heldCords.x ),sizeY:(cords.y-this.state.heldCords.y)}
    }

    // Draw everything, NO STATE CHANGES!
    draw(ctx:CanvasRenderingContext2D) {
        ctx.clearRect(0,0,this.props.width,this.props.height);
        this.drawBase(ctx);
        // Render the current element
        if(this.props.currentEl){
            this.props.currentEl.draw(this.state.ctx);
        }
        if(this.props.entryPoints) {
            this.props.entryPoints.forEach((el: any) => {
                if(el._display) {
                    el.draw(this.state.ctx);
                }
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
        if(this.props.background){
            canvasCtx.drawImage(this.props.background, 0, 0, this.props.width, this.props.height);
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