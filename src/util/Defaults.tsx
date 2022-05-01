import * as React from 'react'

const Defaults = (props:any) => {
    return (
      <div className='container'>
          <h5>Default Settings</h5>

          <div className='row'>
            <div className="six columns">
              <label>Canvas Width</label>
              <input type="text" value={props.defaults.width} onChange={(e) => {
                const defaults = {...props.defaults, width:e.target.value}
                props.defaultsUpdated(defaults);
              }}  className="u-full-width"/>
            </div>
            <div className="six columns">
              <label>Canvas Height</label>
              <input type="text" value={props.defaults.height} onChange={(e) => {
                const defaults = {...props.defaults, height:e.target.value}
                props.defaultsUpdated(defaults);
              }}  className="u-full-width"/>
            </div>
          </div>          
          <div className='row'>
            <div className="six columns">
              <label>BG Color</label>
              <input type="text" value={props.defaults.backgroundColor} onChange={(e) => {
                const defaults = {...props.defaults, backgroundColor:e.target.value}
                props.defaultsUpdated(defaults);
              }}  className="u-full-width"/>
            </div>
            <div className="six columns">
              <label>Move Scale</label>
              <input type="text" value={props.defaults.scale} onChange={(e) => {
                const defaults = {...props.defaults, scale:e.target.value}
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
            <div className="six columns">
              <label>Hover Fill Color</label>
              <input type="text" value={props.defaults.hoverBorderColor} onChange={(e) => {
                const defaults = {...props.defaults, hoverBorderColor:e.target.value}
                props.defaultsUpdated(defaults);
              }}  className="u-full-width"/>
            </div>
          </div>

          <div className='row'>
            <div className="six columns">
              <label>Selected Fill Color</label>
              <input type="text" value={props.defaults.selectedFillColor} onChange={(e) => {
                const defaults = {...props.defaults, selectedFillColor:e.target.value}
                props.defaultsUpdated(defaults);
              }}  className="u-full-width"/>
            </div>
            <div className="six columns">
              <label>Selected Border</label>
              <input type="text" value={props.defaults.selectedBorderColor} onChange={(e) => {
                const defaults = {...props.defaults, selectedBorderColor:e.target.value}
                props.defaultsUpdated(defaults);
              }}  className="u-full-width"/>
            </div>
          </div>
      </div>
    );
  
}

export default Defaults;