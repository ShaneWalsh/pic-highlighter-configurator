import * as React from 'react'
import { GithubPicker } from 'react-color';
import { BlockColors } from '../core/Lookups';

const ShapeOption = (props:any) => {
    return (
        <div className="option-div" >
            <div className="row">
                <div className="six columns">
                    <label>Style</label>
                    <select value={props.currentEl.shape} onChange={(e) => {
                        props.currentEl.shape = e.target.value
                        props.elementOptionUpdated();
                    }} className="u-full-width">
                        <option value="RECT">Rect</option>
                        <option value="ROUNDEDRECT">Rounded Rect</option>
                        <option value="OVAL">Oval</option>
                        <option value="CIRCLE">Circle</option>
                        <option value="DIAMOND">Diamond</option>
                        <option value="NONE">None</option>
                    </select>
                </div>
                <div className="six columns">
                    <label>Link</label>
                    <input type="text" value={props.currentEl.link} onChange={(e) => {
                        props.currentEl.link = e.target.value;
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
            </div>

            <div className="row">
                <div className="twelve columns">
                    <label>Text</label>
                    <textarea value={props.currentEl.text} onChange={(e) => {
                        props.currentEl.updateText(e.target.value)
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
                
            </div>

            <div className="row">
                <div className="three columns">
                    <label>Text Color</label>
                    <input type="text" value={props.currentEl.textColor} onChange={(e) => {
                        props.currentEl.textColor = e.target.value;
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
                <div className="nine columns">
                    <GithubPicker 
                        width='300px'
                        color={props.currentEl.textColor}
                        colors={BlockColors}
                        triangle='hide'
                        onChangeComplete={(color) => {
                            props.currentEl.textColor = color.hex;
                            props.elementOptionUpdated();
                        }}
                    />
                </div>
                
            </div>

            <div className="row">
                <div className="six columns">
                    <label>Text Size</label>
                    <input type="text" value={props.currentEl.textSize} onChange={(e) => {
                        props.currentEl.textSize = Number(e.target.value);
                        props.currentEl.updateText(props.currentEl.text)
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
                <div className="six columns">
                    <label>Text Alignment</label>
                    <select value={props.currentEl.textAlign} onChange={(e) => {
                        props.currentEl.updateAlign(e.target.value)
                        props.elementOptionUpdated();
                    }} className="u-full-width">
                        <option value="CENTER">Center</option>
                        <option value="TOPLEFT">Top Left</option>
                        <option value="TOPCENTER">Top Center</option>
                        <option value="SIDEBARLEFT">Sidebar Left</option>
                        <option value="SIDEBARCENTER">Sidebar Center</option>
                        <option value="CODE">Code Block</option>
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="six columns">
                    <label className="label-checkbox">Fill</label>
                    <input type="checkbox" 
                        checked={props.currentEl.isFilled}
                        onChange={(e) =>  {
                            props.currentEl.isFilled = e.target.checked
                            props.elementOptionUpdated();
                        }}
                    />
                </div>
            </div>
            <div className="row">
                <div className="three columns">
                    <label>Fill Color</label>
                    <input type="text" value={props.currentEl.fillColor} onChange={(e) => {
                        props.currentEl.fillColor = e.target.value;
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
                <div className="nine columns">
                    <GithubPicker 
                        width='300px'
                        color={props.currentEl.fillColor}
                        colors={BlockColors}
                        triangle='hide'
                        onChangeComplete={(color) => {
                            props.currentEl.fillColor = color.hex;
                            props.elementOptionUpdated();
                        }}
                    />
                </div>
            </div>
            <div className="row">
                <div className="six columns">
                    <label>Line Style</label>
                    <select value={props.currentEl.lineStyle} onChange={(e) => {
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
                        props.currentEl.color = e.target.value
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

        </div>
    )
}

export default ShapeOption