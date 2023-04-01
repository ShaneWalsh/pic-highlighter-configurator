import * as React from 'react'
import { GithubPicker } from 'react-color';
import { BlockColors } from '../core/Lookups';

const LineOption = (props:any) => {
    return (
        <div className="option-div" >
            <div className="row">
                <div className="six columns">
                    <label>Style</label>
                    <select  value={props.currentEl.lineStyle} onChange={(e) => {
                        props.currentEl.lineStyle = e.target.value
                        props.elementOptionUpdated();
                        }} className="u-full-width">
                        <option value="FULL">Full</option>
                        <option value="DOTTED">Dotted</option>
                    </select>
                </div>
                <div className="six columns">
                    <label>Line Width</label>
                    <input type="text" value={props.currentEl.strokeWidth} onChange={(e) => {
                        props.currentEl.strokeWidth = e.target.value;
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
            </div>
            <div className="row">
                <div className="three columns">
                    <label>Line Color</label>
                    <input type="text" value={props.currentEl.color} onChange={(e) => {
                        props.currentEl.color = e.target.value;
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
                <div className="nine columns">
                    <GithubPicker 
                        width='300px'
                        color={props.currentEl.color}
                        colors={BlockColors}
                        triangle='hide'
                        onChangeComplete={(color) => {
                            props.currentEl.color = color.hex;
                            props.elementOptionUpdated();
                        }}
                    />
                </div>
            </div>
            <div className="row">
                <div className="six columns">
                    <label>Start Arrow</label>
                    <select value={props.currentEl.startArrowStyle} onChange={(e) => {
                        props.currentEl.startArrowStyle = e.target.value
                        props.elementOptionUpdated();
                    }} className="u-full-width">
                        <option value="FILLED">Filled</option>
                        <option value="UNFILLED">Unfilled</option>
                        <option value="ARROW">Arrow</option>
                        <option value="TOMANY">ToMany</option>
                        <option value="TOONE">ToOne</option>
                        <option value="TONONE">ToNone</option>
                        <option value="NONE">None</option>
                    </select>
                </div>
                <div className="six columns">
                    <label>Start Arrow Size</label>
                    <select value={props.currentEl.startArrowSize} onChange={(e) => {
                        props.currentEl.startArrowSize = e.target.value
                        props.elementOptionUpdated();
                    }} className="u-full-width">
                        <option value="TINY">Tiny</option>
                        <option value="SMALL">Small</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LARGE">Large</option>
                        <option value="HUGE">Huge</option>
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="six columns">
                    <label>End Arrow</label>
                    <select value={props.currentEl.endArrowStyle} onChange={(e) => {
                        props.currentEl.endArrowStyle = e.target.value
                        props.elementOptionUpdated();
                    }} className="u-full-width">
                         <option value="FILLED">Filled</option>
                        <option value="UNFILLED">Unfilled</option>
                        <option value="ARROW">Arrow</option>
                        <option value="TOMANY">ToMany</option>
                        <option value="TOONE">ToOne</option>
                        <option value="TONONE">ToNone</option>
                        <option value="NONE">None</option>
                    </select>
                </div>
                <div className="six columns">
                    <label>End Arrow Size</label>
                    <select value={props.currentEl.endArrowSize} onChange={(e) => {
                        props.currentEl.endArrowSize = e.target.value
                        props.elementOptionUpdated();
                    }} className="u-full-width">
                        <option value="TINY">Tiny</option>
                        <option value="SMALL">Small</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LARGE">Large</option>
                        <option value="HUGE">Huge</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default LineOption