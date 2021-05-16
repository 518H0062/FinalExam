
export default class AddSpark extends Component {
    constructor(props) {
      super(props);
  
      this.onChange = this.onChange.bind(this);
  
      this.state ={
        content: '',
      };
    }
  
    onChange(html) {
      this.setState ({ content: html });
        console.log(html)
      }
  
    render() {
      return (
        <div>
        <Col xs={12} md={6}>
          <form ref={(input) => this.sparkForm = input} onSubmit={(e) => this.createSpark(e)}>
  
              <ControlLabel>Select your city</ControlLabel>
              <select id="formControlsCity" placeholder="Choose your city" onChange={this.onChange} className="form-control" onClick={ moreOptions } ref={(input) => this.city = input}>
                <option value="select">Choose your city</option>
                <option value="Beijing">Beijing</option>
                <option value="Shanghai">Shanghai</option>
                <option value="Chengdu & Chongqing">Chengdu & Chongqing</option>
              </select>
         
              <ControlLabel>Select your person</ControlLabel>
              <select id="formControlsPerson" placeholder="Choose your person" className="form-control" ref={(input) => this.person = input}>
                <option value="select">First select your city</option>
              </select>
      
  
              <ControlLabel>Select your location</ControlLabel>
              <select id="formControlsLocation" placeholder="Choose your location" className="form-control" ref={(input) => this.location = input}>
                <option value="select">First select your city</option>
              </select>
  
              <ControlLabel>Title</ControlLabel>
              <input type="text" label="Title" placeholder="Enter your title" className="form-control" ref={(input) => this.title = input}/>
            
  
              <ControlLabel>Content</ControlLabel>
                <div className='_quill'>
                  <ReactQuill
                    ref='editor'
                    onChange={this.onChange}
                  />
                </div>
                <br />
  
            <Button type="submit">Submit</Button>
          </form>
        </Col>
        <Col xs={12} md={6}>
        <h3>Preview</h3>
          {this.state.content}
        </Col>
  
        </div>
    )}
  }
  
  