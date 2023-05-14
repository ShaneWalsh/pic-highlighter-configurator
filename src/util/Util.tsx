import * as React from 'react'

class Util extends React.Component<any,any> {
  constructor(props:any) {
    super(props);
    this.state = {
      import:"",
      imageBase:""
    }
    this.performExport = this.performExport.bind(this);
    this.performJsonExport = this.performJsonExport.bind(this);
    this.performPicture = this.performPicture.bind(this);
    this.handleImport = this.handleImport.bind(this);
    this.performImport = this.performImport.bind(this);
    this.performReset = this.performReset.bind(this);
    this.loadImageBase = this.loadImageBase.bind(this);
  }

  performExport(event:any){
    this.props.performExport();
  }

  performJsonExport(event:any){
    this.props.performJsonExport();
  }

  performPicture(event:any){
    this.props.performPicture();
  }

  performImport(event:any){
    this.props.performImport(this.state.import);
  }

  loadImageBase(event:any){
    this.props.loadImageBase(this.state.imageBase);
  }

  handleImport(event:any) {
    this.setState({
      import: event.target.value
    });
  }

  performReset(event:any){
    this.props.performReset();
  }

  render() {
    return (
      <div className='container'>
          <h5>Util</h5>
          <div className='row'>
            <button type='button' onClick={this.performReset} className="danger-zone"> Reset </button>
            {/* // TODO implement this, remove from Local Storage */}
            <button type='button' onClick={this.performReset} className="danger-zone"> Clear From Cache </button>
            <button type='button' onClick={this.performExport}> Export </button>
            <button type='button' onClick={this.performPicture}> Picture </button>
            <button type='button' onClick={this.performJsonExport}> JSON </button>
            <input type="text" value={this.props.export} className="u-full-width"/>
            <button type='button' onClick={this.performImport}> Import </button>
            <input type="text" value={this.state.import} onChange={this.handleImport} className="u-full-width"/>
            <h5>Select Old Config</h5>
            {/* TODO add logic to load keys, and present to user to select and load a config.
              Object.entries(localStorage) 
            */}
            <input type="text" value={this.state.import} onChange={this.handleImport} className="u-full-width"/>
            <button type='button' onClick={this.loadImageBase}> Load Image Base64 </button>
            <input type="text" value={this.state.imageBase} onChange={(e) => this.setState({imageBase:e.target.value})} className="u-full-width"/>
          </div>
      </div>
    );
  }
}

export default Util;