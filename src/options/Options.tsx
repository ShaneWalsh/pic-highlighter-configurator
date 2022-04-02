
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

    return (
      <div>
          <h6>Entrypoints Display</h6>
          <button type='button' onClick={this.props.startSelection}>Select Element</button>
          {entryPoints}
          <div>
            <h5>Element Options</h5>
            {opt}
            <div className='row'>
              <button type='button' onClick={this.props.performDeleteElement} className="danger-zone"> Delete Element</button>
            </div>
          </div>
      </div>
    )
  }
}

export default Options;