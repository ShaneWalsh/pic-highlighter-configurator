
import * as React from 'react'
import { EntryPoint, Line, Shape } from '../core/DiagramElement';
import EntryPointOption from './EntryPointOption';
import LineOption from './LineOption';
import ShapeOption from './ShapeOption';

class Options extends React.Component<any,any> {
  constructor(props:any) {
    super(props);
    this.toggleDisplay = this.toggleDisplay.bind(this);
  }

  toggleDisplay(ep:any):void {
    this.props.toggleDisplay(ep);
  }

  render() {
    const entryPoints = this.props.entryPoints?.map((ep:any) => 
      <span key={ep.id}>
          <span className={this.props.currentEntryPoint === ep?'label-checkbox active-ep':'label-checkbox'}>{ep.name}</span>
          <input type="checkbox"
              checked={ep._display}
              onChange={() => this.toggleDisplay(ep)}
          />
      </span>
    )
    let opt = null;
    if(this.props.currentEl instanceof EntryPoint) {
      opt = <EntryPointOption currentEl={this.props.currentEl} elementOptionUpdated={this.props.elementOptionUpdated}/>
    } else if(this.props.currentEl instanceof Line) {
      opt = <LineOption currentEl={this.props.currentEl} elementOptionUpdated={this.props.elementOptionUpdated}/>
    } else if(this.props.currentEl instanceof Shape) {
      opt = <ShapeOption currentEl={this.props.currentEl} elementOptionUpdated={this.props.elementOptionUpdated}/>
    }

    // Sub EntryPoints
    // TODO seems like a bad pattern to call a method and not a property. Problem is I dont want these exported though.
    const subEntryPoints = this.props.currentEntryPoint?.getSubEntrypoints().map((ep:any) => 
      <span key={ep.id}>
          <span className={this.props.currentEntryPoint === ep?'label-checkbox active-ep':'label-checkbox'}>{ep.name}</span>
          <input type="checkbox"
              checked={ep._display}
              onChange={() => this.toggleDisplay(ep)}
          />
      </span>
    );

    return (
      <div>
          <button type='button' onClick={this.props.performDeleteElement} className="danger-zone"> Delete Element</button>
          <button type='button' onClick={this.props.startSelection}>Select Element</button>
          <div className='row'>
            <span className='display-span'>Entrypoints Display: </span>
            {entryPoints}
          </div>
          <div className='row'>
            <span className='display-span'>Sub Entrypoints: </span>
            {subEntryPoints}
          </div>
          <div>
            <h5>Element Options</h5>
            {opt}
            <div className='row'>
              
            </div>
          </div>
      </div>
    )
  }
}

export default Options;