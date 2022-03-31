import * as React from 'react'
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