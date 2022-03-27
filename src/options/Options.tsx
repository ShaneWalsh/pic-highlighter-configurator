
import * as React from 'react'

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

    return (
        <div>
            <h6>Entrypoints Display</h6>
            {entryPoints}
        </div>
    )
  }
}

export default Options;