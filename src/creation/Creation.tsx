import * as React from 'react'

class Creation extends React.Component<any,any> {
  constructor(props:any) {
    super(props);
    this.startEntrypoint = this.startEntrypoint.bind(this);
    this.startLine = this.startLine.bind(this);
    this.startShape = this.startShape.bind(this);
  }

  startEntrypoint(event:any){
    this.props.startEntrypoint();
  }

  startLine(event:any){
    this.props.startLine();
  }

  startShape(event:any){
    this.props.startShape();
  }

  render() {
    return (
      <div className='container'>
          <h5>Creation</h5>
          <div className='row'>
            <button type='button' className='five columns' onClick={this.startEntrypoint}> Entrypoint</button>
          </div>
          <div className='row'>
            <button type='button' className='four columns' onClick={this.startLine} disabled={this.props.currentEntryPoint === null}> Line </button>
            <button type='button' className='four columns' onClick={this.startShape} disabled={this.props.currentEntryPoint === null}> Shape </button>
            <button type='button' className='four columns' onClick={this.startEntrypoint} disabled={this.props.currentEntryPoint === null}> Text </button>
          </div>
      </div>
    );
  }
}

export default Creation;

// core (State)
// creation (listnerner input)
// options (listnerner input)
// canvas (listeners mouse)

/*
class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      submit: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({
      input: event.target.value
    });
  }
  handleSubmit(event) {
    // Change code below this line
    event.preventDefault();
    this.setState((state) => ({submit:state.input}))
    // Change code above this line
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input value={this.state.input} onChange={this.handleChange} />
          <button type='submit'>Submit!</button>
        </form>
        <h1>{this.state.submit}</h1>
      </div>
    );
  }
}



class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
    this.handleEnter = this.handleEnter.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  // Change code below this line
  componentDidMount() {
    document.addEventListener("keydown",this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown",this.handleKeyPress;
  }
  // Change code above this line
  handleEnter() {
    this.setState((state) => ({
      message: state.message + 'You pressed the enter key! '
    }));
  }
  handleKeyPress(event) {
    if (event.keyCode === 13) {
      this.handleEnter();
    }
  }
  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
};

*/