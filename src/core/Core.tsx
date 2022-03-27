import * as React from 'react'
import Creation from '../creation/Creation';
import Diagram from '../diagram/Diagram';
import Options from '../options/Options';
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
    Options, dynamic, bound to the elements
    Text... With and without boxes. 
        On hover display full text option?
    Background pic from base64

    OOS
    Line ArrowHead shape, fill
    Selection. Hitboxes for checking.
    Adding Background Toggle to Creation, so you can add elements freely that will always be displayed. Not highlight elements bound to entrypoints
    Selecting BG pic from pc, loaded through nodejs server, then base64 encoded on UI added to export.
    Save Config to file, load config from file.
*/

/**
 * Main Component, will hold the state of the current diagram
 */
class Core extends React.Component<any,any> {
    constructor(props:any) {
        super(props);
        this.state = {
            
            currentEntryPoint: null,
            entryPoints:[],
            currentEl: null,
            _elementsNum:0
        };
        this.startEntrypoint = this.startEntrypoint.bind(this);
        this.startLine = this.startLine.bind(this);
        this.startShape = this.startShape.bind(this);
        this.performExport = this.performExport.bind(this);
        this.performReset = this.performReset.bind(this);
        this.toggleDisplay = this.toggleDisplay.bind(this);
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
        this.setState(function(state:any, props:any) {
            state.currentEntryPoint.elements.push(line);
            return {
                currentEl:line,
                _elementsNum:state._elementsNum+1
            };
        });
    }

    startShape(){
        let shape = new Shape(this.state._elementsNum);
        this.setState(function(state:any, props:any) {
            state.currentEntryPoint.elements.push(shape);
            return {
                currentEl:shape,
                _elementsNum:state._elementsNum+1
            };
        });
    }

    performExport(){
        console.log(JSON.stringify(this.state))
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
                        performExport={this.performExport}
                        performReset={this.performReset}
                    />
                    <Options 
                        entryPoints={this.state.entryPoints}
                        toggleDisplay={this.toggleDisplay}
                    />
                    <Diagram 
                        currentEl={this.state.currentEl}
                        entryPoints={this.state.entryPoints}
                    />
                </div>
                <div id="diagram">
                    <canvas id="canvas-highlighter" width="920" height="512" ></canvas>
                </div>
            </div>
        )
    }
}

export default Core;