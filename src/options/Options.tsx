
import * as React from 'react'
import { EntryPoint } from '../core/DiagramElement';
import EntryPointOption from './EntryPointOption';

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
          <input type="checkbox"
              checked={ep._display}
              onChange={() => this.toggleDisplay(ep)}
          />
          <span className="label-body">{ep.name}</span>
      </span>
    )
    let opt = null;
    if(this.props.currentEl instanceof EntryPoint) {
      opt = <EntryPointOption currentEl={this.props.currentEl} elementOptionUpdated={this.props.elementOptionUpdated}/>
    }

    return (
      <div>
          <h6>Entrypoints Display</h6>
          {entryPoints}
          <div>
            <h5>Options</h5>
            {opt}
          </div>
      </div>
    )
  }
}

export default Options;