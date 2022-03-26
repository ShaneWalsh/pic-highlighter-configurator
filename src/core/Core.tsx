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
        };
        this.startEntrypoint = this.startEntrypoint.bind(this);
        this.startLine = this.startLine.bind(this);
        this.startShape = this.startShape.bind(this);
    }
    
    // User wants to create a new entrypoint
    startEntrypoint(){
        // create an entrypoint
        let entryPoint = new EntryPoint();

        this.setState(function(state:any, props:any) {
            state.entryPoints.push(entryPoint);
            return {
                currentEntryPoint:entryPoint,
                entryPoints:state.entryPoints,
                currentEl:entryPoint
            };
        });
        // options should display default values,
    }

    startLine(){
        let line = new Line();
        this.setState(function(state:any, props:any) {
            state.currentEntryPoint.elements.push(line);
            return {
                currentEl:line
            };
        });
    }

    startShape(){
        let shape = new Shape();
        this.setState(function(state:any, props:any) {
            state.currentEntryPoint.elements.push(shape);
            return {
                currentEl:shape
            };
        });
    }

    render(): React.ReactNode {
        return (
            <div id='core'>
                <div id="left">
                    <Creation 
                        startEntrypoint={this.startEntrypoint}
                        startLine={this.startLine}
                        startShape={this.startShape}
                    />
                    <Options />
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