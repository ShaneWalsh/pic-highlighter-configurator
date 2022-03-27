import * as React from 'react'

const EntryPointOption = (props:any) => {
    return (
        <div className="option-div" >
            <div className="row">
                <div className="six columns">
                    <label>Name</label>
                    <input type="text" value={props.currentEl.name} onChange={(e) =>  {
                        props.currentEl.name = e.target.value
                        props.elementOptionUpdated();
                        }}
                     className="u-full-width"/>
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
                    <label>Hoverable</label>
                    <input type="checkbox" className="u-full-width"
                        checked={props.currentEl.isHoverable}
                        onChange={(e) =>  {
                            props.currentEl.isHoverable = e.target.checked
                            props.elementOptionUpdated();
                        }}
                    />
                </div>
                <div className="six columns">
                    <label>Selectable</label>
                    <input type="checkbox" className="u-full-width"
                        checked={props.currentEl.isSelectable}
                        onChange={(e) =>  {
                            props.currentEl.isSelectable = e.target.checked
                            props.elementOptionUpdated();
                        }}
                    />
                </div>
            </div>
            
        </div>
    )
}

export default EntryPointOption