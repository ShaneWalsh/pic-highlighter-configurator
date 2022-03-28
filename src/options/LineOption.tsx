import * as React from 'react'

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

export default LineOption