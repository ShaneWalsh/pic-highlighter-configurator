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
                        <option value="NONE">None</option>
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

            <div className="row">
                <div className="six columns">
                    <label>Text</label>
                    <input type="text" value={props.currentEl.text} onChange={(e) => {
                        props.currentEl.updateText(e.target.value)
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
                <div className="six columns">
                    <label>Text Size</label>
                    <input type="text" value={props.currentEl.textSize} onChange={(e) => {
                        props.currentEl.textSize = Number(e.target.value);
                        props.currentEl.updateText(props.currentEl.text)
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
            </div>

            <div className="row">
                <div className="six columns">
                    <label>Text Color</label>
                    <input type="text" value={props.currentEl.textColor} onChange={(e) => {
                        props.currentEl.textColor = e.target.value;
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
            </div>

            <div className="row">
                <div className="six columns">
                    <label>Fill Color</label>
                    <input type="text" value={props.currentEl.fillColor} onChange={(e) => {
                        props.currentEl.fillColor = e.target.value;
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
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

        </div>
    )
}

export default ShapeOption