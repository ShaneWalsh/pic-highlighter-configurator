import * as React from 'react'
import { GithubPicker } from 'react-color';
import { BlockColors } from '../core/Lookups';
import ShapeOption from './ShapeOption';

const EntryPointOption = (props:any) => {
    return (
        <div className="option-div" >
            <div className="row">
                <div className="six columns">
                    <label>EP Name</label>
                    <input type="text" value={props.currentEl.name} onChange={(e) =>  {
                        props.currentEl.name = e.target.value
                        props.elementOptionUpdated();
                        }}
                     className="u-full-width"/>
                </div>
                <div className="six columns">
                    <label className="label-checkbox">Selected By Default</label>
                    <input type="checkbox" 
                        checked={props.currentEl.isSelectedByDefault}
                        onChange={(e) =>  {
                            props.currentEl.isSelectedByDefault = e.target.checked
                            props.elementOptionUpdated();
                        }}
                    />
                </div>
            </div>
            <div className="row">
                <div className="six columns">
                    <label className="label-checkbox">Hoverable</label>
                    <input type="checkbox" 
                        checked={props.currentEl.isHoverable}
                        onChange={(e) =>  {
                            props.currentEl.isHoverable = e.target.checked
                            props.elementOptionUpdated();
                        }}
                    />
                </div>
                <div className="six columns">
                    <label className="label-checkbox">Selectable</label>
                    <input type="checkbox" 
                        checked={props.currentEl.isSelectable}
                        onChange={(e) =>  {
                            props.currentEl.isSelectable = e.target.checked
                            props.elementOptionUpdated();
                        }}
                    />
                </div>
            </div>
            
            <ShapeOption currentEl={props.currentEl} elementOptionUpdated={props.elementOptionUpdated}/>

            <div className="row">
                <div className="three columns">
                    <label>Hover Border Color</label>
                    <input type="text" value={props.currentEl.hoverBorderColor} onChange={(e) => {
                        props.currentEl.hoverBorderColor = e.target.value;
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
                <div className="nine columns">
                    <GithubPicker 
                        width='300px'
                        color={props.currentEl.hoverBorderColor}
                        colors={BlockColors}
                        triangle='hide'
                        onChangeComplete={(color) => {
                            props.currentEl.hoverBorderColor = color.hex;
                            props.elementOptionUpdated();
                        }} />
                </div>
            </div>
            <div className="row">
                <div className="three columns">
                    <label>Selected Fill</label>
                    <input type="text" value={props.currentEl.selectedFillColor} onChange={(e) => {
                        props.currentEl.selectedFillColor = e.target.value;
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
                <div className="nine columns">
                    <GithubPicker 
                        width='300px'
                        color={props.currentEl.selectedFillColor}
                        colors={BlockColors}
                        triangle='hide'
                        onChangeComplete={(color) => {
                            props.currentEl.selectedFillColor = color.hex;
                            props.elementOptionUpdated();
                        }} />
                </div>
            </div>
            <div className="row">
                <div className="three columns">
                    <label>Selected Border</label>
                    <input type="text" value={props.currentEl.selectedBorderColor} onChange={(e) => {
                        props.currentEl.selectedBorderColor = e.target.value;
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
                <div className="nine columns">
                    <GithubPicker 
                        width='300px'
                        color={props.currentEl.selectedBorderColor}
                        colors={BlockColors}
                        triangle='hide'
                        onChangeComplete={(color) => {
                            props.currentEl.selectedBorderColor = color.hex;
                            props.elementOptionUpdated();
                        }} />
                </div>
            </div>
            
        </div>
    )
}

export default EntryPointOption