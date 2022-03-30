import * as React from 'react'

class Util extends React.Component<any,any> {
  constructor(props:any) {
    super(props);
    this.state = {
      import:""
    }
    this.performExport = this.performExport.bind(this);
    this.handleImport = this.handleImport.bind(this);
    this.performImport = this.performImport.bind(this);
    this.performReset = this.performReset.bind(this);
  }

  performExport(event:any){
    this.props.performExport();
  }

  performImport(event:any){
    this.props.performImport(this.state.import);
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
          <h5>Defaults</h5>
          {/* Width, color etc Any new EP then will inherit these.*/}
          <h5>Util</h5>
          <div className='row'>
            <button type='button' onClick={this.performReset} className="danger-zone"> Reset </button>
            <button type='button' onClick={this.performExport}> Export </button>
            <input type="text" value={this.props.export} className="u-full-width"/>
            <button type='button' onClick={this.performImport}> Import </button>
            <input type="text" value={this.state.import} onChange={this.handleImport} className="u-full-width"/>
          </div>
      </div>
    );
  }
}

export default Util;