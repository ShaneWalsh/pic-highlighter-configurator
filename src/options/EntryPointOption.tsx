import * as React from 'react'
import { GithubPicker } from 'react-color';
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
                <div className="six columns">
                    <label>Hover Border Color</label>
                    <GithubPicker 
                        color={props.currentEl.hoverBorderColor}
                        width={'250px'}
                        colors={['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB', '#eeeeee']}
                        onChangeComplete={(color) => {
                            props.currentEl.hoverBorderColor = color.hex;
                            props.elementOptionUpdated();
                        }}/>
                </div>
                <div className="six columns">
                    <input type="text" value={props.currentEl.hoverBorderColor} onChange={(e) => {
                        props.currentEl.hoverBorderColor = e.target.value;
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
            </div>
            <div className="row">
                <div className="six columns">
                    <label>Selected Fill</label>
                    <GithubPicker 
                        color={props.currentEl.selectedFillColor}
                        onChangeComplete={(color) => {
                            props.currentEl.selectedFillColor = color.hex;
                            props.elementOptionUpdated();
                        }} />
                </div>
                <div className="six columns">
                    <input type="text" value={props.currentEl.selectedFillColor} onChange={(e) => {
                        props.currentEl.selectedFillColor = e.target.value;
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
            </div>
            <div className="row">
                <div className="six columns">
                    <label>Selected Border</label>
                    <GithubPicker 
                        color={props.currentEl.selectedBorderColor}
                        onChangeComplete={(color) => {
                            props.currentEl.selectedBorderColor = color.hex;
                            props.elementOptionUpdated();
                        }} />
                </div>
                <div className="six columns">
                    <input type="text" value={props.currentEl.selectedBorderColor} onChange={(e) => {
                        props.currentEl.selectedBorderColor = e.target.value;
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
            </div>
            {/* <div className="row">
                <div className="six columns">
                    <label>Color</label>
                    <input type="text" value={props.currentEl.color} onChange={(e) => {
                        props.currentEl.color = e.target.value
                        props.elementOptionUpdated();
                        }}  className="u-full-width"/>
                </div>
                <div className="six columns">
                    <label>Text</label>
                    <input type="text" value={props.currentEl.text} onChange={(e) =>  {
                        props.currentEl.updateText(e.target.value)
                        props.elementOptionUpdated();
                        }}
                     className="u-full-width"/>
                </div>
            </div> */}
            
        </div>
    )
}

export default EntryPointOption