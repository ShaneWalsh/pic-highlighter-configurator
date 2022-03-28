import * as React from 'react'

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
                        <option value="CIRCLE">Circle</option>
                        <option value="DIAMOND">Diamond</option>
                    </select>
                </div>
                <div className="six columns">
                    <label>Color</label>
                    <input type="text" value={props.currentEl.color} onChange={(e) => {
                        props.currentEl.color = e.target.value
                        props.elementOptionUpdated();
                        }}  className="u-full-width"/>
                </div>
            </div>
        </div>
    )
}

export default ShapeOption