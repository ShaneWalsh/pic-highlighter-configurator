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
    TODO MVP
    ¬Background pic from base64 or URL
    ~Import + Export full support via fields
        - export pic along with the config
        - be able to import the same details?
            - update the pic highligher tool to work the same.
    ~color inherit
    ~Options, dynamic, bound to the elements

    ~Text... With and without boxes. 
    
    ~fill
        - need to rewrite the drawing functions.

    white out?
        - default value + option to change.
        ~ I mean its just a white rect with the same fill, maybe just a button then like text?

    ~ delete option

    ~Selection, edit existing elements. Hitboxes for checking and editing.
        - tabbed header around creation, so its creation and editing modes.
            - edit V0.1 could just be selecting an elements so it can be resized and edited
                - longer term, specific point manipulation via dragging etc

    ~Arrows fix selection
    ~Arrows fix drawing arrows end of a line.

    ~text Align in center

    ~Line ArrowHead shape,
        End [] , Shape DDSelect
        Start [] , Shape DDSelect

    ~copy pasta link? (Highlighter task)
        ~Add a button in one of the corners, looks like a copy symbol and copy data to the users board.
            - implemented with a right click on the element.
        ~add link option to shapes.

    ¬ Adding Background Toggle to Creation, so you can add elements freely that will always be displayed. Not highlight elements bound to entrypoints
        // Can just use default selected EP with no option to hover or select, then its a background and not an EP.
    
    OOS
    ~ Code Block
        ~ Code Text Alignment.
    ~ Color picker
    Front to back, would be very handy when editing.
    ~ Name Diagrams
        ~ Auto cache exports in browser, load them up on load? Allow the user to select them from a dropdown?
           Save all configs you have done on the machine, allow loading them?
        Undo would be very handy.
            ~ Keep Track of all exports/changes in local, so can roll back.
            Needs more hooks for the Engine, like clicks, attribute changes.
    
    ~Add settings option, so allow resizing in 5px. Or whatever number they want? Default is 1? so as it is now. Might help with uniform shapes though to jump in sizes.
    ~How to hide Sub entrypoints.
    How to make it clearer to the user what can be selected/hovered?
            Rounded rect by default for EP, rect for shapes? Subtle difference?
    Little icon for links? Blue arrow > in the bottom so people can see it more clearly.

    UI rethink perhaps?
        Add few modes to the diagrammer. Change the Border color based on the mode so its easy to tell.
            New Element mode, clicking will draw an element?
            Selection mode?
            

    subentryPoint?
        - on deselect parent, all his children should be deselected. Does not go back up the chain though.
        - SEP do not know they are SEP.

    undo and redo support?
        - Could be implmented with export and import logic, already existing mostly.
    copy paste support?
    subEntrypoints? 

    github website exposure? React-Pages.

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

    Usage Feedback
        Editing
            To the front, to the back options on selected element. For ordering?
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
            Add Pic Export, DL\
            Copy Notification in some form. popup, or floating, disolving update.
            Selectbox for cached diagrams
        Text
            ~Better text centering.
            various fonts?
        Shapes
            DB Shape is a must have
            Class Shape, add TextSized line for Class shape. Two text boxes? No alignment?
            Package Shape, Small box left
        Arrows
            To many (To-Many Arrow is an inverted Arrow….)
            To one |

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
        this.selectElement = this.selectElement.bind(this);
        this.placedElement = this.placedElement.bind(this);

        this.performExport = this.performExport.bind(this);
        this.performImport = this.performImport.bind(this);
        this.performReset = this.performReset.bind(this);
        this.performUndo = this.performUndo.bind(this);

        this.toggleDisplay = this.toggleDisplay.bind(this);
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
        // TODO move current element to the back of whatever array its in
    }   
    
    toBack(){
        // TODO move current element to the front of whatever array its in
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
    
    performExport(){
        console.log(JSON.stringify(this.state));
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
            if(state.currentEntryPoint === state.currentEl){ // we are deleting the ep, so nothing should be selected.
                entryPoints = entryPoints.filter((e:any) => e !== ep);
                ep = null;
                el = null;
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
                        performDeleteElement={this.performDeleteElement}
                    />
                    <Defaults 
                        defaultsUpdated={this.defaultsUpdated}
                        defaults={this.state._defaultValues}
                    />
                    <Util                         
                        performExport={this.performExport}
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
                        currentEl={this.state.currentEl}
                        entryPoints={this.state.entryPoints}
                    />
                </div>
            </div>
        )
    }
}

export default Core;