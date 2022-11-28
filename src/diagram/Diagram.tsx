import { useEffect, useRef, useState } from 'react';
import { EntryPoint, LineStyle } from '../core/DiagramElement';
import { drawBorder, drawLine } from '../core/Drawing';
import { reversed } from '../core/Lib2d';

const Diagram = (props:any) => {
    const [state,updateState] = useState({
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
      })
    
    // updateState( (oldState) => {
    //     return {...oldState}
    // });

    const canvasRef = useRef(null);

 
    useEffect(() => {
        // console.log("drawing", state, props)
        draw(getCtx());
     });

    const getCtx = () => {
        return canvasRef.current.getContext('2d');
    }

    const keyDown = (event:KeyboardEvent) => {
        updateState( (oldState) => {
            const e = {...oldState}
            e.keyPressed.push(event.key);
            return e
        });
    }

    const keyUp = (event:KeyboardEvent) => {
        var name = event.key;
        if (name === 'z' && state.keyPressed.indexOf('Control') > -1) {
            props.performUndo();
        }
        updateState( (oldState) => {
            let arr:any = state.keyPressed.filter((key: string) => key !== event.key)
            return {...oldState, keyPressed:arr}
        });
    }

    const isShiftPressed = ():boolean => {
        return state.keyPressed.indexOf('Shift') > -1;
    }

    const updateMousePosition= (e:MouseEvent) => {
        const cords = getCords(e);
        const sizes = getSizes(e, cords);
        let hovered:Hovered = null;
        // TODO resolve this limitiation, where you can only drag from left to bottom right, if I dragged the other way the cords and sizes values just need to be flipped.
        if(props.placing || isShiftPressed()){
            if(state.leftClickHeld) {
                props.currentEl?.handleMove(sizes, cords);
            }
        } else if(props.selecting) { // then highlight it, and on click, emit it.
            if ( state.dragging ) { // we have clicked on something.
                if(state.draggingAll){
                    let dragCords = {
                        xOffset:(state.draggingCords.x - cords.x) * -1, 
                        yOffset:(state.draggingCords.y - cords.y) * -1 };
                    // console.log("cords x:"+cords.x +" y:"+ cords.y);
                    console.log("dragCords x:"+dragCords.xOffset +" y:"+dragCords.yOffset);
                    state.dragging.el.updateAllCords(dragCords);
                } else { // just an individual update then
                    state.dragging.el.updateCords({x:cords.x+state.draggingXOffset, y:cords.y+state.draggingYOffset});
                }
            } else { // else highlight whatever I am hovering over
                for( let ep of reversed(props.entryPoints)) {
                    hovered = tryFindHover(cords, ep);
                    if(hovered !== null) {
                        break;
                    }
                }
            }
        }
        updateState( (oldState) => {
            return {...oldState,
            beingHovered:hovered,
            mouseX:cords.x,mouseY:cords.y,
            draggingCords:cords
            }
        });
        // draw(getCtx());
    }

    /**
     * Search the entrypoint for a hover, first the EP itself, then the child elements.
     * returns the first element to be hovered on.
     */
    const tryFindHover = (cords:{x:number, y:number}, ep: any): Hovered => {
        if( ep._display ) {
            for(let el of reversed(ep.elements)) {
                if(el instanceof EntryPoint){ // Handling for SubEntryPoints
                   let hover = tryFindHover(cords, el);
                   if(hover !== null) return hover;
                } else {
                    for(let hb of el.hitboxes()){
                        if(pointInsideSprite(cords,hb)){
                            return {ep:ep,el:el}; 
                        }
                    }
                }
            }
        }
        for(let hb of ep.hitboxes()){
            if(pointInsideSprite(cords,hb)){
                return {ep:ep,el:ep}; 
            }
        }
        return null;
    }
    

    const mouseClick = (e:MouseEvent) => {
        console.log(state.mouseX + " - " + state.mouseY)
        if(e.button === 0) {
            const cords = getCords(e);
            const leftClickHeld = true;
            if(props.placing || isShiftPressed()){
                props.currentEl?.setCords(cords);
                updateState( (oldState) => {
                    return {...oldState,leftClickHeld:true,heldCords:cords}
                });
            } else if(props.selecting) {
                if(state.beingHovered){
                    // if its a resize block, then we are resizing and not moving
                    updateState( (oldState) => {
                        return {...oldState,
                            dragging:state.beingHovered,
                            draggingCords: cords,
                            draggingXOffset:state.beingHovered.el.cords.x - cords.x,
                            draggingYOffset:state.beingHovered.el.cords.y - cords.y,
                            leftClickHeld:true,heldCords:cords
                        }
                    });
                } else {
                    updateState( (oldState) => {
                        return {...oldState, leftClickHeld:true,heldCords:cords }
                    });
                }
            }
        } else if(e.button === 1) {
            console.log("1");
            e.preventDefault();
            const cords = getCords(e);
            if(props.selecting) {
                if(state.beingHovered){
                    // if its a resize block, then we are resizing and not moving
                    updateState((oldState) => {
                        return {...oldState,
                        dragging:state.beingHovered,
                        draggingCords: cords,
                        draggingAll:true,
                        draggingXOffset:state.beingHovered.el.cords.x - cords.x,
                        draggingYOffset:state.beingHovered.el.cords.y - cords.y
                }})
                }
            }
        }
        // draw(getCtx());
    }

    const mouseClickRelease = (e:MouseEvent) => {
        if(e.button === 0) {
            const cords = getCords(e);
            const sizes = getSizes(e, cords);
            if(props.placing || isShiftPressed()) {
                props.currentEl?.handleLeftRelease(sizes, cords);
                props.placedElement(props.currentEl);
            } else if(props.selecting) {
                if(state.dragging !== null) {
                    updateState( (oldState) => {
                        return {...oldState,
                            dragging:null,
                            draggingCords:null,
                            draggingAll:false,
                            draggingXOffset:null,
                            draggingYOffset:null}
                    });
                }
            }
            updateState( (oldState) => {
                return {...oldState, leftClickHeld:false}
            });
        } else if(e.button === 1) {
            if(props.selecting) {
                if(state.dragging !== null) {
                    updateState( (oldState) => {
                        return {...oldState,
                            dragging:null,
                            draggingCords:null,
                            draggingAll:false,
                            draggingXOffset:null,
                            draggingYOffset:null
                        }
                    });
                }
            }
        }
        // draw(getCtx());
    }

    // this is just a catch for the context menu, to prevent it from appearing.
    const rightClickContext= (e:MouseEvent) => { 
        e.preventDefault(); 
        // TODO cancel whatever state we are in, back to inital clean state.
        // draw(getCtx());
    }

    // disabling because i want the effect to rerender on method recreation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const doubleClick = (e:MouseEvent) => { 
        if(props.selecting) {
            if(state.beingHovered !== null) {
                props.selectElement(state.beingHovered)
                updateState( (oldState) => {
                    return {...oldState,
                        dragging:null,
                        draggingCords:null,
                        draggingAll:false,
                        beingHovered:null,
                        draggingXOffset:null,
                        draggingYOffset:null
                    }
                });
            }
        }
        // draw(getCtx()); 
    }
    const getOffset = (el:HTMLCanvasElement) => {
        const rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY
        }
    }
    const getCords = (e:MouseEvent) => {
        const v= getOffset(canvasRef.current);
        let x =  Math.floor(e.pageX)-v.left;
        let y =  Math.floor(e.pageY)-v.top;
        x = x - (x % props.scale)
        y = y - (y % props.scale)
        return {x,y}
    }
    const getSizes = (e: MouseEvent, cords:any) => {
        let sizes = {sizeX:(cords.x-state.heldCords.x ),sizeY:(cords.y-state.heldCords.y)};
        sizes.sizeX = sizes.sizeX - (sizes.sizeX % props.scale)
        sizes.sizeY = sizes.sizeY - (sizes.sizeY % props.scale)
        return sizes
    }

    // Draw everything, NO STATE CHANGES!
    const draw = (ctx:CanvasRenderingContext2D) => {
        ctx.clearRect(0,0,props.width,props.height);
        drawBase(ctx);
        // Render the current element
        if(props.currentEl) {
            props.currentEl.draw(getCtx());
        }
        if(props.entryPoints) {
            props.entryPoints.forEach((el: any) => {
                el.draw(getCtx());
            });
        }
        if(state.beingHovered !== null) {
            let hovered = state.beingHovered;
            hovered.el.drawHover(ctx)
        }
    }

    const drawBase = (canvasCtx:any) =>  {
        canvasCtx.fillStyle = props.backgroundColor;
        canvasCtx.fillRect(0,0,props.width,props.height);
        // draw the background image whatever it is
        if(props.background) {
            canvasCtx.drawImage(props.background, 0, 0, props.width, props.height);
        }
        if(props.displayGrid) {
            let grid = props.scale;
            for(let startX = grid; startX < props.width; startX += grid) {
                for(let startY = grid; startY < props.height; startY += grid) {
                    let color = (startY % 5 == 0)?"#e0e0e0":"#ededed";
                    drawLine(0,startY,props.width,startY,1,color,LineStyle.FULL,canvasCtx );
                }
                let color = (startX % 5 == 0)?"#e0e0e0":"#ededed";
                drawLine(startX,0,startX,props.height,1,color,LineStyle.FULL,canvasCtx );
            }
        }
        // border on the canvas
        drawBorder(0,0,props.width,props.height,.1,'#000000',null, "", canvasCtx)
    }
    
    const pointInsideSprite = (point:{x:number,y:number}, sprite:{x:number,y:number,sizeX:number,sizeY:number}) => {
        if(point.x > sprite.x && point.x < (sprite.x+sprite.sizeX) ){
            if(point.y > sprite.y && point.y < (sprite.y+sprite.sizeY)){
                return true;
            }
        }
    }

       // After Render of the screen.
       useEffect(() => {
        const canvas:any = canvasRef.current; // canvas
        canvas.addEventListener("mousemove", updateMousePosition, false);
        canvas.addEventListener("dblclick", doubleClick, false);
        canvas.addEventListener("mousedown", mouseClick, false);
        canvas.addEventListener("mouseup", mouseClickRelease, false);
        canvas.addEventListener("contextmenu", rightClickContext, false);

        document.addEventListener("keydown", keyDown, false);
        document.addEventListener("keyup", keyUp, false);

        console.log("Canvas Effect Setup")
        return () => {
            canvas.removeEventListener("mousemove",updateMousePosition)
            canvas.removeEventListener("dblclick", doubleClick);
            canvas.removeEventListener("mousedown", mouseClick);
            canvas.removeEventListener("mouseup", mouseClickRelease);
            canvas.removeEventListener("contextmenu", rightClickContext);
            document.removeEventListener("keydown", keyDown);
            document.removeEventListener("keyup", keyUp);
        }
        // props.placing, props.currentEl, props.entryPoints, props.selecting, props.height, props.scale, 
        // [updateMousePosition, doubleClick, mouseClick, mouseClickRelease, rightClickContext, keyUp, keyDown]
    },);


    return (
        <div id="diagram">
            <canvas id="canvas-highlighter" ref={canvasRef} width={props.width} height={props.height} ></canvas>
        </div>
    );
    
  };

export default Diagram;

export class Hovered {
    // The element
    el:any;
    // The entrypoint parent
    ep:any;
}