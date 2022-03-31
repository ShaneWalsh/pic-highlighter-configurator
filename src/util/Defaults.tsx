import * as React from 'react'

const Defaults = (props:any) => {
    return (
      <div className='container'>
          <h5>Defaults</h5>

          <div className='row'>
            <div className="six columns">
              <label>Width</label>
              <input type="text" value={props.defaults.width} onChange={(e) => {
                const defaults = {...props.defaults, width:e.target.value}
                props.defaultsUpdated(defaults);
              }}  className="u-full-width"/>
            </div>
            <div className="six columns">
              <label>Height</label>
              <input type="text" value={props.defaults.height} onChange={(e) => {
                const defaults = {...props.defaults, height:e.target.value}
                props.defaultsUpdated(defaults);
              }}  className="u-full-width"/>
            </div>
          </div>

          <div className='row'>
            <div className="six columns">
              <label>Color</label>
              <input type="text" value={props.defaults.color} onChange={(e) => {
                const defaults = {...props.defaults, color:e.target.value}
                props.defaultsUpdated(defaults);
              }}  className="u-full-width"/>
            </div>
            <div className="six columns">
              <label>Stroke Width</label>
              <input type="text" value={props.defaults.strokeWidth} onChange={(e) => {
                const defaults = {...props.defaults, strokeWidth:e.target.value}
                props.defaultsUpdated(defaults);
              }}  className="u-full-width"/>
            </div>
          </div>

          <div className='row'>
            <div className="six columns">
              <label>Text Color</label>
              <input type="text" value={props.defaults.textColor} onChange={(e) => {
                const defaults = {...props.defaults, textColor:e.target.value}
                props.defaultsUpdated(defaults);
              }}  className="u-full-width"/>
            </div>
            <div className="six columns">
              <label>Text Size</label>
              <input type="text" value={props.defaults.textSize} onChange={(e) => {
                const defaults = {...props.defaults, textSize:e.target.value}
                props.defaultsUpdated(defaults);
              }}  className="u-full-width"/>
            </div>
          </div>

          <div className='row'>
            <div className="six columns">
              <label>Fill Color</label>
              <input type="text" value={props.defaults.fillColor} onChange={(e) => {
                const defaults = {...props.defaults, fillColor:e.target.value}
                props.defaultsUpdated(defaults);
              }}  className="u-full-width"/>
            </div>
          </div>

      </div>
    );
  
}

export default Defaults;