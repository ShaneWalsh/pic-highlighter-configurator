import * as React from 'react'

class Diagram extends React.Component<any,any> {
    constructor(props:any) {
      super(props);
      this.state = {
        canvas: null,
        ctx:null,
        mouseX:0,
        mouseY:0,
        leftClickHeld:false,
        heldCords:{x:0,y:0}
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
        canvasCtx.fillStyle = 'green';
        canvasCtx.fillRect(10, 10, 150, 100);
        
        this.setState({
            canvas:canvasRef,
            ctx:canvasCtx
        })
    }

    componentWillUnmount() {
      document.removeEventListener("mousemove",this.updateMousePosition);
    }

    updateMousePosition(e:MouseEvent) {
        const cords = this.getCords(e);
        // logic here?

        // TODO resolve this limitiation, where you can only drag from left to bottom right, if I dragged the other way the cords and sizes values just need to be flipped.
        if(this.state.leftClickHeld) {
            this.props.currentEl?.setSecondary({sizeX:(cords.x-this.state.heldCords.x ),sizeY:(cords.y-this.state.heldCords.y)}, cords);
        }

        this.setState({
            mouseX:cords.x,mouseY:cords.y
        })
        this.draw();
    }

    mouseClick(e:MouseEvent) {
        console.log(this.state.mouseX + " - " + this.state.mouseY)
        if(e.button == 0) {
            const cords = this.getCords(e);
            this.setState({leftClickHeld:true,heldCords:cords});
            this.props.currentEl?.setCords(cords);
            // if in editing mode maybe we want to emit the position we clicked on?
            // in creation mode with selected element, 
        }
        else if(e.button == 2) {
            console.log("Button 2")
        }
        this.draw();
    }

    mouseClickRelease(e:MouseEvent) {
        if(e.button == 0) {
            this.setState({leftClickHeld:false})
        }
        this.draw();
    }

    // this is just a catch for the context menu, to prevent it from appearing.
    rightClickContext(e:MouseEvent){ 
        e.preventDefault(); 
        // TODO cancel whatever state we are in, back to inital clean state.
        this.draw();
    }
    doubleClick(e:MouseEvent){ this.draw(); }
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

    // Draw everything, NO STATE CHANGES!
    draw() {
        const ctx = this.state.ctx;
        ctx.clearRect(0,0,920,512);

        // TODO replace with an Image
        ctx.fillStyle = 'grey';
        ctx.fillRect(0,0,920,512);
        
        // Anything selected, being hovered etc from viewer

        // Render the current state of the entrypoints etc
        if(this.props.currentEl){
            this.props.currentEl.draw(this.state.ctx);
        }
        if(this.props.entryPoints) {
            this.props.entryPoints.forEach((el: any) => {
                el.draw(this.state.ctx);
            });
        }
    }

    render() {
        return (
            <div>
                {this.props.currentEl?.name}
            </div>
        );
    }
  };

export default Diagram;
