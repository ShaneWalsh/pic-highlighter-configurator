
import * as React from 'react'
import { EntryPoint, Line, Picture, Shape } from '../core/DiagramElement';
import EntryPointOption from './EntryPointOption';
import LineOption from './LineOption';
import PictureOption from './PictureOption';
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
          <span className={ep.isThisOrChildSelected()?'label-checkbox active-ep':'label-checkbox'}>{ep.name}</span>
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
    } else if(this.props.currentEl instanceof Picture) {
      opt = <PictureOption currentEl={this.props.currentEl} elementOptionUpdated={this.props.elementOptionUpdated}/>
    } else if(this.props.currentEl instanceof Shape) {
      opt = <ShapeOption currentEl={this.props.currentEl} elementOptionUpdated={this.props.elementOptionUpdated}/>
    }

    // Sub EntryPoints
    // TODO seems like a bad pattern to call a method and not a property. Problem is I dont want these exported though.
    let subEntryPointsToDraw:any[] = [];
    let selectedEP:EntryPoint = this.props.entryPoints.find((ep:EntryPoint) => ep.isThisOrChildSelected());
    if(selectedEP){
      let subEPCollection:EntryPoint[] = selectedEP.getSubEntrypoints();
      while(subEPCollection.length > 0) {
        subEntryPointsToDraw.push (
          <div className='row'>
            <span className='display-span'>Sub Entrypoints: </span>
            {subEPCollection.map(subEp => 
                      <span key={subEp.id}>
                      <span className={subEp.isThisOrChildSelected()?'label-checkbox active-ep':'label-checkbox'}>{subEp.name}</span>
                      <input type="checkbox"
                          checked={subEp._display}
                          onChange={() => this.toggleDisplay(subEp)}
                      />
                  </span>
              )}
          </div>
        )
        let arr:EntryPoint[] = [];
        subEPCollection.filter(subEp=>subEp.isDisplay()).forEach(ep => {
          arr = arr.concat(ep.getSubEntrypoints());
        });
        subEPCollection = arr//.filter((ep:EntryPoint) => ep.isThisOrChildSelected());
      }
    }

    return (
      <div>
          <button type='button' onClick={this.props.performDeleteElement} className="danger-zone"> Delete Element</button>
          <button type='button' onClick={this.props.startSelection}>Select Element</button>
          <button type='button' onClick={this.props.hideDisplay}>Hide Display</button>
          <button type='button' onClick={this.props.toFront} disabled={this.props.currentEl === null}>To Front</button>
          <button type='button' onClick={this.props.toBack} disabled={this.props.currentEl === null}>To Back</button>
          <div className='row'>
            <span className='display-span'>Entrypoints Display: </span>
            {entryPoints}
          </div>
            {subEntryPointsToDraw}
          <div className='row'>
            <button type='button' onClick={this.props.toggleGrid}>Toggle Grid</button>
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