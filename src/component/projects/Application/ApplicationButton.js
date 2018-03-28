import React, { Component } from 'react';

//Components 
import MuiButton from '../../MuiButton';

//style
const style = {
  button:{
    display:'flex',
    justifyContent:'center',
    marginBottom:'20px'
  }
}

class ApplicationButton extends Component {
  constructor(){
    super();
    this.state = {

    }
  }

  render(){
    return(<MuiButton label= "Click Here to Apply" style = {style.button}/>);
  }
}

export default ApplicationButton;