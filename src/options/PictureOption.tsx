import * as React from 'react'

const PictureOption = (props:any) => {
    return (
        <div className="option-div" >
            <div className="row">
            
                <div className="twelve columns">
                    <label>Picture</label>
                    <input type="text" value={props.currentEl.pictureBase} onChange={(e) => {
                        props.currentEl.updatePictureBase(e.target.value)
                        props.elementOptionUpdated();
                    }}  className="u-full-width"/>
                </div>
            </div>
        </div>
    )
}

export default PictureOption