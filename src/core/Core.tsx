import * as React from 'react'
import Creation from '../creation/Creation';
import Diagram from '../diagram/Diagram';
import Options from '../options/Options';
import Defaults from '../util/Defaults';
import Util from '../util/Util';
import { EntryPoint, Line, Shape, Shapes } from './DiagramElement';

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
        ~ I mean its just a white rect with the same fill, true, maybe just a button then like text?

    Selection, edit existing elements. Hitboxes for checking and editing.
        - tabbed header around creation, so its creation and editing modes.
            - edit V0.1 could just be selecting an elements so it can be resized and edited
                - longer term, specific point manipulation

    OOS
    Line ArrowHead shape,
        End [] , Shape DDSelect
        Start [] , Shape DDSelect

    copy pasta link? 
        Add a button in one of the corners, looks like a copy symbol and copy data to the users board.
        - add link option to shapes.

    Right click to start a new element of the same type? For improved usability.

    Text
        Better positioning and formula
        alignment support
            various fonts?

    ¬ Adding Background Toggle to Creation, so you can add elements freely that will always be displayed. Not highlight elements bound to entrypoints
        // Can just use default selected EP with no option to hover or select, then its a background and not an EP.
    
    Node Server
        Selecting BG pic from pc, loaded through nodejs server, then base64 encoded on UI added to export.
        Save Config to file, load config from file.
*/

/**
 * Main Component, will hold the state of the current diagram
 */
class Core extends React.Component<any,any> {
    constructor(props:any) {
        super(props);

        let src = null;//'https://i.ibb.co/ThXk4sV/class.jpg';
        let background = this.loadImage(src);
        

        this.state = {
            currentEntryPoint: null,
            entryPoints:[],
            src:src,
            currentEl: null,
            _background:background, // image
            _elementsNum:0,
            _defaultValues:{
                width : 1024,
                height : 800,

                color : "#000",
                strokeWidth : .6, 

                textColor : "#000",
                textSize: 15,

                fillColor : "#fff",
                hoverBorderColor :"#77DD66",
                selectedFillColor :"#fff",
                selectedBorderColor :"#265828"
            },
            export:""
        };
        this.startEntrypoint = this.startEntrypoint.bind(this);
        this.startLine = this.startLine.bind(this);
        this.startShape = this.startShape.bind(this);
        this.startText = this.startText.bind(this);

        this.performExport = this.performExport.bind(this);
        this.performImport = this.performImport.bind(this);
        this.performReset = this.performReset.bind(this);

        this.toggleDisplay = this.toggleDisplay.bind(this);
        this.elementOptionUpdated = this.elementOptionUpdated.bind(this);
        this.defaultsUpdated = this.defaultsUpdated.bind(this);
    }
    
    // User wants to create a new entrypoint
    startEntrypoint(){
        // create an entrypoint
        let entryPoint = new EntryPoint(this.state._elementsNum);
        entryPoint.setDefaults(this.state._defaultValues);
        this.state.entryPoints.push(entryPoint);
        this.setState(function(state:any, props:any) {
            return {
                currentEntryPoint:entryPoint,
                entryPoints:state.entryPoints,
                currentEl:entryPoint,
                _elementsNum:state._elementsNum+1
            };
        });
        // options should display default values,
    }

    startLine(){
        let line = new Line(this.state._elementsNum);
        line.setDefaults(this.state.currentEntryPoint);
        this.state.currentEntryPoint.elements.push(line);
        this.setState(function(state:any, props:any) {
            return {
                currentEl:line,
                _elementsNum:state._elementsNum+1
            };
        });
    }

    startShape(){
        let shape = new Shape(this.state._elementsNum);
        shape.setDefaults({...this.state.currentEntryPoint, text:""});
        this.state.currentEntryPoint.elements.push(shape);
        this.setState(function(state:any, props:any) {
            return {
                currentEl:shape,
                _elementsNum:state._elementsNum+1
            };
        });
    }

    startText(){
        let shape = new Shape(this.state._elementsNum);
        shape.setDefaults({...this.state.currentEntryPoint, text:""});
        shape.shape = Shapes.NONE;
        this.state.currentEntryPoint.elements.push(shape);
        this.setState(function(state:any, props:any) {
            return {
                currentEl:shape,
                _elementsNum:state._elementsNum+1
            };
        });
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

        //delete exportValue._defaultValues;
        // TODO add base64 copy of the background image if there is one.
        let image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = exportValue.src;
        image.onload = () =>{
            exportValue.src = this.imgToBase64(image);
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

    performReset(){
        this.setState({
            currentEntryPoint: null,
            entryPoints:[],
            currentEl: null,
        });
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
                        startLine={this.startLine}
                        startShape={this.startShape}
                        startText={this.startText}
                    />
                    <Options 
                        currentEl={this.state.currentEl}
                        entryPoints={this.state.entryPoints}
                        toggleDisplay={this.toggleDisplay}
                        elementOptionUpdated={this.elementOptionUpdated}
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
                        background={this.state._background}
                        width={this.state._defaultValues.width}
                        height={this.state._defaultValues.height}
                        currentEl={this.state.currentEl}
                        entryPoints={this.state.entryPoints}
                    />
                </div>
            </div>
        )
    }
}

export default Core;