import * as React from 'react'
import Creation from '../creation/Creation';
import Diagram, { Hovered } from '../diagram/Diagram';
import Options from '../options/Options';
import Defaults from '../util/Defaults';
import Util from '../util/Util';
import { ArrowHeadStyle, EntryPoint, Line, Shape, Shapes, TextAlign } from './DiagramElement';
import { elementNames } from './Lookups';

// TODO interfaces for types!
// interface Props {
//     ... // your props validation
//   }
  
//   interface State {
//     ... // state types
//   }

/*

    How to make it clearer to the user what can be selected/hovered?
            Rounded rect by default for EP, rect for shapes? Subtle difference?

    UI rethink perhaps?
        Add few modes to the diagrammer. Change the Border color based on the mode so its easy to tell.
            New Element mode, clicking will draw an element?
            Selection mode?

    ~github website exposure? React-Pages.

    V1.1
    Add Color picker to tool
    http://casesandberg.github.io/react-color/
    Add oval shape, Hexagon Shape.
    Add class shapes, where text auto appears on top, only supports left or center top.

    Right click to start a new element of the same type? For improved usability.
    After dragging and creating the element, the selected element should then have draggable sections in the corners to increase size or x,y

    Add theme buttons to defaults to set some nice default themes for you? Just changes the defaults?
        Also go down to shapes and lines?

    Node Server
        Selecting BG pic from pc, loaded through nodejs server, then base64 encoded on UI added to export.
        Save Config to file, load config from file.

    Usage Feedback V 1.0
        Display all Sub EP, in the current selection chain, not just current level. Maybe work backwards up.
        ToMany Arrow To one Arrow
        Display Sub EP of one level down from Selected Element?
        Move element up to Parent EP, or simply selection dropdown to pick the EP? Handy for refactoring WIP diagrams.
        Convert Element to EP, as SubEP of current EP.
        Toggleable Drawing/Aligning Grid

        Editing
            Copy paste, whole EP.
            Change Owner EP, select box of all available?
            Control for keyboard usage, copy, paste onto the current EP. Or copy EP, again add to the same level as the current EP? C+D delete?
            Resizing, Last few Hovered Item, display Extension/resize points?
                Display Resize over the corners or actual points, then if on click, check if hovered, and if on a Resize point then we are in resize state and not move state.
                    Different codes, TL, TR, BL, BR, P(point)
                    Call a different method on the elements for this resizing.
        QOL
            Little icon for links? Blue arrow > in the bottom so people can see it more clearly.
            Control Right click to Open Hyperlink in new tab.
            How to make it clearer to the user what can be selected/hovered?
            UNDO, better support. Requires redux to track changes?
            
        Util
            Copy Notification in some form. popup, or floating, disolving update.
            Selectbox for cached diagrams

        Text
            various fonts?

        Shapes
            badge
            fully rounded sides, like a button of old.

        Arrows
            To many (To-Many Arrow is an inverted Arrow….)
            To one |
            To Zero 0

    Dreams
        Line to Shape connection points? 
        Shape to EP conversion Button?
        Middle Mouse Press and Drag, to move EVERYTHING
        Selection Drag to Move All Selected Elements

*/

/**
 * Main Component, will hold the state of the current diagram
 */
class Core extends React.Component<any,any> {
    version = "1.0.0"
    undoStack:any = [];

    constructor(props:any) {
        super(props);

        let src = null;//'https://i.ibb.co/ThXk4sV/class.jpg';
        let background = this.loadImage(src);

        this.state = {
            currentEntryPoint: null,
            entryPoints:[],
            currentEl: null,
            _selecting:true,
            _placing:false,
            _background:background, // image
            _elementsNum:0,
            _defaultValues:{
                highlighterName: elementNames[Math.floor(Math.random()*elementNames.length)]+'-'+Date.now(),
                width : 1024,
                height : 800,
                scale : 4, // how many pixels each is resizing is by.
                grid : 8,
                displayGrid:false,

                color : "#000",
                strokeWidth : .6, 

                textColor : "#000",
                textSize: 15,

                fillColor : "#fff",
                hoverBorderColor :"#77DD66",
                selectedFillColor :"#c1e1c5",
                selectedBorderColor :"#265828",
                backgroundColor :"#F8F8F8"
            },
            src:src,
            export:""
        };
        this.startEntrypoint = this.startEntrypoint.bind(this);
        this.startSubEntrypoint = this.startSubEntrypoint.bind(this);
        this.startLine = this.startLine.bind(this);
        this.startShape = this.startShape.bind(this);
        this.startText = this.startText.bind(this);
        this.startCodeBlock = this.startCodeBlock.bind(this);

        this.startSelection = this.startSelection.bind(this);
        this.toFront = this.toFront.bind(this);
        this.toBack = this.toBack.bind(this);
        this.selectElement = this.selectElement.bind(this);
        this.placedElement = this.placedElement.bind(this);

        this.performExport = this.performExport.bind(this);
        this.performPicture = this.performPicture.bind(this);
        this.performImport = this.performImport.bind(this);
        this.performReset = this.performReset.bind(this);
        this.performUndo = this.performUndo.bind(this);

        this.toggleDisplay = this.toggleDisplay.bind(this);
        this.toggleGrid = this.toggleGrid.bind(this);
        this.performDeleteElement = this.performDeleteElement.bind(this);
        this.elementOptionUpdated = this.elementOptionUpdated.bind(this);
        this.defaultsUpdated = this.defaultsUpdated.bind(this);
    }
    componentDidMount() {
        let latestConfig:any = localStorage.getItem("latest");
        if(latestConfig && latestConfig.length > 0){
            this.performImport(latestConfig)
        }
    }
    // User wants to create a new entrypoint
    startEntrypoint() {
        if(this.state.currentEntryPoint){
            this.state.currentEntryPoint.setSelected(false);
        }
        let entryPoint = new EntryPoint(this.state._elementsNum);
        entryPoint.setDefaults(this.state._defaultValues);
        entryPoint.setSelected(true);
        this.state.entryPoints.push(entryPoint);
        this.setState(function(state:any, props:any) {
            return {
                _selecting:false,
                _placing:true,
                currentEntryPoint:entryPoint,
                entryPoints:state.entryPoints,
                currentEl:entryPoint,
                _elementsNum:state._elementsNum+1
            };
        });
        this.triggerCache();
    }    
    
    // User wants to create a new entrypoint
    startSubEntrypoint() {
        if(this.state.currentEntryPoint){
            this.state.currentEntryPoint.setSelected(false);
        }
        let entryPoint = new EntryPoint(this.state._elementsNum, "SEP");
        entryPoint.name = this.state.currentEntryPoint.name +"-"+ entryPoint.name;
        entryPoint.setDefaults(this.state._defaultValues);
        entryPoint.setSelected(true);
        this.state.currentEntryPoint.elements.push(entryPoint);
        this.setState(function(state:any, props:any) {
            return {
                _selecting:false,
                _placing:true,
                currentEntryPoint:entryPoint,
                entryPoints:state.entryPoints,
                currentEl:entryPoint,
                _elementsNum:state._elementsNum+1
            };
        });
        this.triggerCache();
    }

    startLine(){
        let line = new Line(this.state._elementsNum);
        line.setDefaults(this.state.currentEntryPoint);
        line.endArrowStyle = ArrowHeadStyle.ARROW;
        this.state.currentEntryPoint.elements.push(line);
        this.setState(function(state:any, props:any) {
            return {
                _selecting:false,
                _placing:true,
                currentEl:line,
                _elementsNum:state._elementsNum+1
            };
        });
        this.triggerCache();
    }

    startShape(){
        let shape = new Shape(this.state._elementsNum);
        shape.setDefaults({...this.state.currentEntryPoint, text:"", link:""});
        this.state.currentEntryPoint.elements.push(shape);
        this.setState(function(state:any, props:any) {
            return {
                _selecting:false,
                _placing:true,
                currentEl:shape,
                _elementsNum:state._elementsNum+1
            };
        });
        this.triggerCache();
    }

    startText(){
        let shape = new Shape(this.state._elementsNum);
        shape.setDefaults({...this.state.currentEntryPoint, text:""});
        shape.shape = Shapes.NONE;
        shape.textAlign = TextAlign.CODE;
        shape.text = "Text";
        this.state.currentEntryPoint.elements.push(shape);
        this.setState(function(state:any, props:any) {
            return {
                _selecting:false,
                _placing:true,
                currentEl:shape,
                _elementsNum:state._elementsNum+1
            };
        });
        this.triggerCache();
    }

    startCodeBlock() {
        let shape = new Shape(this.state._elementsNum);
        shape.setDefaults({...this.state.currentEntryPoint, text:"CODE"});
        shape.shape = Shapes.RECT;
        shape.textAlign = TextAlign.CODE;
        shape.textColor = '#444';
        shape.fillColor = '#fff';
        shape.textSize = 18;
        shape.isFilled = true;
        this.state.currentEntryPoint.elements.push(shape);
        this.setState(function(state:any, props:any) {
            return {
                _selecting:false,
                _placing:true,
                currentEl:shape,
                _elementsNum:state._elementsNum+1
            };
        });
        this.triggerCache();
    }

    startSelection(){
        let eps = this.cleanEP();
        this.setState({
            currentEntryPoint: null,
            currentEl: null,
            entryPoints:eps,
            _selecting:true,
            _placing:false
        });
        this.triggerCache();
    }

    toFront(){
        if(this.state.currentEl instanceof EntryPoint) {
            if(this.state.entryPoints.includes(this.state.currentEl)) {
                let arr = this.state.entryPoints.filter((el:any) => el !== this.state.currentEl);
                arr.push(this.state.currentEl);
                this.setState({ entryPoints:arr });
            } else {
                this.state.currentEntryPoint.moveElementToFront(this.state.currentEl);
            }    
        } else {
            this.state.currentEntryPoint.moveElementToFront(this.state.currentEl);
        }
        this.triggerCache();
        
    }   
    
    toBack() {
        if(this.state.currentEl instanceof EntryPoint) {
            if(this.state.entryPoints.includes(this.state.currentEl)) {
                let front = [this.state.currentEl];
                let arr = this.state.entryPoints.filter((el:any) => el !== this.state.currentEl);
                arr = front.concat(arr)
                this.setState({ entryPoints:arr });
            } else {
                this.state.currentEntryPoint.moveElementToBack(this.state.currentEl);
            }
        } else {
            this.state.currentEntryPoint.moveElementToBack(this.state.currentEl);
        }
        this.triggerCache();
        
    }

    // TODO loop through EP and any EP with no cords 0,0 or size 0,0 and no elements, remove it from the list
    cleanEP() {
        let eps = [];
        for(let i = 0; i < this.state.entryPoints.length;i++){
            let ep = this.state.entryPoints[i];
            if(ep.cords.x === 0 && ep.cords.y === 0 && ep.size.sizeX === 0 && ep.size.sizeY === 0){
                continue;
            }
            eps.push(ep);
            ep.setSelected(false);
        }
        return eps;
    }

    selectElement(hovered:Hovered){
        this.state.currentEntryPoint?.setSelected(false);
        hovered.ep.setSelected(true);
        this.setState({
            currentEntryPoint: hovered.ep,
            currentEl: hovered.el,
            _selecting:true,
            _placing:false
        });
        this.triggerCache();
    }

    placedElement(placed:any){
        this.setState({
            _placing:false,
            _selecting:true
        });
        this.triggerCache();
    }
    
    elementOptionUpdated(){ // hack to trigger a state change for any field change
        this.setState({currentEl:this.state.currentEl});
    }    
    
    defaultsUpdated(defaults:any){ // hack to trigger a state change for any field change
        this.setState({_defaultValues:defaults});
    }
    
    performExport() {
        // console.log(JSON.stringify(this.state));
        let exportValue = {...this.state};
        delete exportValue.export;
        delete exportValue.currentEntryPoint;
        delete exportValue.currentEl;
        delete exportValue._elementsNum;
        delete exportValue._background;
        exportValue.version = this.version;
        
        // base64 encode src if its not already base64 encoded.
        if(exportValue.src !== null && exportValue.src.indexOf("data:image") === -1){
            let image = new Image();
            image.crossOrigin = "Anonymous";
            image.src = exportValue.src;
            image.onload = () =>{
                exportValue.src = this.imgToBase64(image);
                this.setState({
                    export:JSON.stringify(exportValue)
                });
            }
        } else {
            this.setState({
                export:JSON.stringify(exportValue)
            });
        }
    }

    performPicture() {
        var link = document.createElement('a');
        link.download = this.state._defaultValues.highlighterName+'.png';
        let can:any = document.getElementById('canvas-highlighter');
        link.href = can.toDataURL();
        link.click();
    }
    
    imgToBase64(img:any) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL();
    }
    
    // import logic to map json to system entities
    performImport(importValue:any){
        const jsonObj = JSON.parse(importValue);
        console.log(jsonObj);
        let newState = [];
        for(let element of jsonObj.entryPoints){
            let ep = new EntryPoint(0);
            ep.mapJson(element)
            newState.push(ep)
        }
        this.clearStack();
        this.setState({
            currentEntryPoint: null,
            currentEl: null,
            src:jsonObj.src,
            _background : this.loadImage(jsonObj.src),
            entryPoints:newState,
            _defaultValues:jsonObj._defaultValues
        })
    }  
    loadImage(src:any) {
        if(src !== null){
            let background = new Image();
            background.src = src;
            return background;
        }
        return null;
    }
    // delete the current element
    performDeleteElement(){
        this.setState(function(state:any, props:any):any {
            let entryPoints = state.entryPoints;
            let ep = state.currentEntryPoint;
            let el = state.currentEl;
            if(state.currentEntryPoint === el) { // we are deleting the ep, so nothing should be selected.
                if(entryPoints.includes(el)){
                    entryPoints = entryPoints.filter((e:any) => e !== ep);
                    ep = null;
                    el = null;
                } else { // its a sub element, so we have to find it.
                    removeSubEntrypoint(el, entryPoints);
                    ep = null;
                    el = null;
                }
                // remove from entrypoints.
            } else { // we are deleting an element on the EP, so set it as the active element after deletion.
                state.currentEntryPoint.elements = state.currentEntryPoint.elements.filter( (v:any) => v !== state.currentEl)
                el = ep;
            }
            return {
                entryPoints:entryPoints,
                currentEntryPoint: ep,
                currentEl: el
            };
        });
    }

    performReset(){
        this.setState({
            currentEntryPoint: null,
            entryPoints:[],
            currentEl: null,
            _defaultValues:{
                highlighterName: elementNames[Math.floor(Math.random()*elementNames.length)]+'-'+Date.now(),
                width : 1024,
                height : 800,
                scale : 4,
                color : "#000",
                strokeWidth : .6, 
                textColor : "#000",
                textSize: 15,
                fillColor : "#fff",
                hoverBorderColor :"#77DD66",
                selectedFillColor :"#c1e1c5",
                selectedBorderColor :"#265828",
                backgroundColor :"#F8F8F8"
            },
        });
        this.clearStack();
    }
    
    /**
     * trigger all caching logic, stack for undo and local storage for reloading later.
     */
    triggerCache() {
        this.performExport();
        this.cacheLocalStorage();
        this.cacheUndoStack();
    }

    toggleGrid() {
        let d = this.state._defaultValues;
        d.displayGrid = !d.displayGrid;
        this.setState({
            _defaultValues:d
        });
    }

    cacheUndoStack() {
        this.undoStack.push(this.state.export);
    }

    performUndo(){
        if(this.undoStack.length > 0){
            let v = this.undoStack.pop();
            this.performImport(v);
        }
    }

    clearStack(){
        this.undoStack = [];
    }

    /**
     * Will get a freash 
     */
    cacheLocalStorage() {
        localStorage.setItem(this.state._defaultValues.highlighterName, this.state.export);
        localStorage.setItem("latest", this.state.export);
    }
    // TODO work out a better way to do this checkbox change handling.
    // Currently I have to pass the click evnet all the way up here so I can trigger a state change, to trigger a rerender.
    toggleDisplay(ep:any){
        ep.toggleDisplay();
        this.setState(function(state:any, props:any) {
            return {
                entryPoints:state.entryPoints
            };
        });
    }

    render(): React.ReactNode {
        return (
            <div id='core'>
                <div id="left">
                    <Creation 
                        currentEntryPoint={this.state.currentEntryPoint}
                        startEntrypoint={this.startEntrypoint}
                        startSubEntrypoint={this.startSubEntrypoint}
                        startLine={this.startLine}
                        startShape={this.startShape}
                        startText={this.startText}
                        startCodeBlock={this.startCodeBlock}
                    />
                    <Options 
                        currentEl={this.state.currentEl}
                        currentEntryPoint={this.state.currentEntryPoint}
                        entryPoints={this.state.entryPoints}
                        toggleDisplay={this.toggleDisplay}
                        elementOptionUpdated={this.elementOptionUpdated}
                        startSelection={this.startSelection}
                        toFront={this.toFront}
                        toBack={this.toBack}
                        performDeleteElement={this.performDeleteElement}
                        toggleGrid={this.toggleGrid}
                    />
                    <Defaults 
                        defaultsUpdated={this.defaultsUpdated}
                        defaults={this.state._defaultValues}
                    />
                    <Util                         
                        performExport={this.performExport}
                        performPicture={this.performPicture}
                        export={this.state.export}
                        performImport={this.performImport}
                        performReset={this.performReset}
                    />
                    <Diagram
                        selecting={this.state._selecting}
                        placing={this.state._placing}
                        placedElement={this.placedElement}
                        selectElement={this.selectElement}
                        performUndo={this.performUndo}
                        backgroundColor={this.state._defaultValues.backgroundColor}
                        background={this.state._background}
                        width={this.state._defaultValues.width}
                        height={this.state._defaultValues.height}
                        scale={this.state._defaultValues.scale}
                        grid={this.state._defaultValues.grid}
                        displayGrid={this.state._defaultValues.displayGrid}
                        currentEl={this.state.currentEl}
                        entryPoints={this.state.entryPoints}
                    />
                </div>
            </div>
        )
    }
}

export default Core;

function removeSubEntrypoint(subEP: any, entryPoints:any) {
    for(let i = 0; i < entryPoints.length; i++) {
        let entrypoint = entryPoints[i];
        let elements = entrypoint.elements
        entrypoint.elements = removeSubEntrypointLoop(subEP, elements);
    }
}

function removeSubEntrypointLoop(subEP: any, elements:any) {
    if(elements.includes(subEP)){
        return elements.filter((el:any) => el !== subEP);
    } else {
        for(let i = 0; i < elements.length; i++) {
            let element = elements[i];
            if(element instanceof EntryPoint){
                element.elements = removeSubEntrypointLoop(subEP, element.elements);
            }
        }
        return elements;
    }
}