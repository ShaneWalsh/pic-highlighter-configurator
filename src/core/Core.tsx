import * as React from 'react'
import Creation from '../creation/Creation';
import Diagram from '../diagram/Diagram';
import Options from '../options/Options';
import Util from '../util/Util';
import { EntryPoint, Line, Shape } from './DiagramElement';

// TODO interfaces for types!
// interface Props {
//     ... // your props validation
//   }
  
//   interface State {
//     ... // state types
//   }

/*
    TODO MVP
    Background pic from base64
    Import + Export full support via fields
    ~color inherit
    Options, dynamic, bound to the elements

    Text... With and without boxes. 
        On hover display full text option?

    OOS
    Line ArrowHead shape, fill
    Selection, edit existing elements. Hitboxes for checking.
    Adding Background Toggle to Creation, so you can add elements freely that will always be displayed. Not highlight elements bound to entrypoints
    Node Server
        Selecting BG pic from pc, loaded through nodejs server, then base64 encoded on UI added to export.
        Save Config to file, load config from file.
*/

/**
 * Main Component, will hold the state of the current diagram
 */
class Core extends React.Component<any,any> {
    width = 1024;
    height = 800;
    constructor(props:any) {
        super(props);
        this.state = {
            
            currentEntryPoint: null,
            entryPoints:[],
            currentEl: null,
            _elementsNum:0,
            export:""
        };
        this.startEntrypoint = this.startEntrypoint.bind(this);
        this.startLine = this.startLine.bind(this);
        this.startShape = this.startShape.bind(this);
        this.performExport = this.performExport.bind(this);
        this.performImport = this.performImport.bind(this);
        this.performReset = this.performReset.bind(this);
        this.toggleDisplay = this.toggleDisplay.bind(this);
        this.elementOptionUpdated = this.elementOptionUpdated.bind(this);
    }
    
    // User wants to create a new entrypoint
    startEntrypoint(){
        // create an entrypoint
        let entryPoint = new EntryPoint(this.state._elementsNum);
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
        line.color = this.state.currentEntryPoint.color;
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
        shape.color = this.state.currentEntryPoint.color;
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
    performExport(){
        console.log(JSON.stringify(this.state));
        let exportValue = {...this.state};
        delete exportValue.export;
        delete exportValue.currentEntryPoint;
        delete exportValue.currentEl;
        delete exportValue._elementsNum;
        this.setState({
            export:JSON.stringify(exportValue)
        });
    }
    performImport(importValue:any){
        console.log(JSON.parse(importValue));
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
                    />
                    <Options 
                        currentEl={this.state.currentEl}
                        entryPoints={this.state.entryPoints}
                        toggleDisplay={this.toggleDisplay}
                        elementOptionUpdated={this.elementOptionUpdated}
                    />
                    <Util                         
                        performExport={this.performExport}
                        export={this.state.export}
                        performImport={this.performImport}
                        performReset={this.performReset}
                    />
                    <Diagram 
                        width={this.width}
                        height={this.height}
                        currentEl={this.state.currentEl}
                        entryPoints={this.state.entryPoints}
                    />
                </div>
                <div id="diagram">
                    <canvas id="canvas-highlighter" width={this.width} height={this.height} ></canvas>
                </div>
            </div>
        )
    }
}

export default Core;