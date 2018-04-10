import React, {Component} from 'react';
import firebase from '../../firebase';
import _ from 'lodash';
import {checkEmpty} from '../../Validation';
import {Link} from 'react-router-dom';

//Material ui Components
import {Card, CardTitle} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';


//Components 
import MuiButton from '../MuiButton';




//styles
const style = {
  card:{
    backgroundColor:'#f8f8f8'
  },
  radioButton:{
    display:"inline-block",
    width: '70px',
    marginLeft: '0px'
  },
  submit:{
    display:'flex', 
    justifyContent:'center',
    margin:'20px'
  },
  title:{
    textAlign:'center'
  },
  textfield:{
    display:'flex',
    justifyContent:'center',
    flexDirection:'column'
  },
  text:{
    alignSelf:'center'
  }
}

//variables
const TeamFormPath = 'StudentApplication_Raw_Data';

class ApplicationWithoutTeam extends Component{
  constructor(){
    super();
    this.state = {
      creditOptions:[1,2],
      data:{},
      error:{},
      errorEmail:'',
      formQuestions:'',
      levels:["Freshman", "Sophomore", "Junior", "Senior", "Graduate"],
      notIncluded:[],
      returning:false,
      teams:'',  
    }
    this.handleCheck = this.handleCheck.bind(this);
    this.handleCourseChange = this.handleCourseChange.bind(this);
    this.handleCreditChange = this.handleCreditChange.bind(this);
    this.handleLevelChange = this.handleLevelChange.bind(this);
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentDidMount(){
    let data = {};
    let notIncluded = this.state.notIncluded;
    firebase.database().ref('Teams').once('value').then((snap)=>{
      this.setState({
        teams:_.toArray(snap.val())
      });
    });
    firebase.database().ref('Semester/application').once('value').then((snap)=>{
      data['semester'] = snap.val();
    });
    firebase.database().ref(`Courses`).on('value', (snap) => {
      this.setState({
        courses:snap.val()
      });
    });
    firebase.database().ref('FormQuestions/Student Application').once('value').then((snap)=>{
      Object.keys(snap.val()).forEach((question)=>{
        data[snap.val()[question].id] = '';
        if(!snap.val()[question].required){
          notIncluded.push(snap.val()[question].id);
        }
      });

      data['course'] = '';
      data['credits'] = '';
      data['level'] = '';
      data['returning'] = 'false';
      data['teamName'] = '';
      
      this.setState({
        formQuestions:snap.val(),
        data:data,
        notIncluded:notIncluded
      });
    });
  }

  handleLevelChange(event, index, value){
    let data = this.state.data;
    data['level'] = this.state.levels[value];
    this.setState({
      data:data,
      levelValue:value
    });
  }

  handleCheck(event, index, value){
    let checked = this.state.returning;
    let data = this.state.data;
    data['returning'] = (!checked).toString();
    this.setState({
      data:data,
      returning:!checked
    });
  }

  handleCreditChange(event, index, value){
    let data = this.state.data;
    data['credits'] = event.target.value;
    this.setState({
      data:data,
      credit:parseInt(event.target.value)
    });
  }

  handleCourseChange(event, index, value){
    let data = this.state.data;
    console.log(value);
    data['course'] = this.state.courses[this.state.data['teamName']][value].course;
    this.setState({
      data:data,
      courseValue:value
    });
  }

  handleMenuChange(event, index, value){
    let data = this.state.data;
    data['teamName'] = this.state.teams[value].teamName;
    this.setState({
      data:data,
      value:value
    })
  }

  handleSubmit(){
    console.log(this.state.data);
    let validation = checkEmpty(this.state.error, this.state.data, this.state.data['email'], this.state.notIncluded);
    if(validation[0]){
      firebase.database().ref(`${TeamFormPath}`).push(this.state.data);
      this.setState({
        open:true
      });
    }else{
      this.setState({
        error:validation[1],
        errorEmail:validation[2],
      });
    }
  }

  handleTextChange(event, index, value){
    let data = this.state.data;
    data[event.target.id] = event.target.value;
    this.setState({
      data:data
    });
  }

  render(){
    let courses = this.state.courses;
    let formQuestions = this.state.formQuestions;
    let levels = this.state.levels;
    let teams = this.state.teams;

    const actions = [
      <Link to = '/'><FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      /></Link>,
    ];

    return(
      <div>
        <MuiThemeProvider>
            <div>
              {formQuestions && teams && courses &&
              <Card style = {style.card}>
                <CardTitle title = 'Application Form' style = {style.title} />
                <div style = {style.textfield}>
                  {Object.keys(formQuestions).map((question)=>{
                    if(formQuestions[question].id === 'email'){
                      return <TextField 
                              hintText={formQuestions[question].hint} 
                              floatingLabelText={formQuestions[question].text} 
                              value = {this.state.data[formQuestions[question].id]}
                              id = {formQuestions[question].id}
                              style = {style.text}
                              errorText = {this.state.errorEmail} 
                              onChange = {this.handleTextChange}
                            />
                    }else{
                      return <TextField 
                                hintText={formQuestions[question].hint} 
                                floatingLabelText={formQuestions[question].text} 
                                value = {this.state.data[formQuestions[question].id]} 
                                id = {formQuestions[question].id}
                                style = {style.text}
                                errorText = {this.state.error[formQuestions[question].id]} 
                                onChange = {this.handleTextChange}
                              />
                    }
                  })}
                  <div style = {{display:'flex', justifyContent:'center', flexDirection:'column'}}>
                    <SelectField floatingLabelText="Select a Team" value={this.state.value} onChange={this.handleMenuChange}  errorText={this.state.error['team']} style = {style.text}>
                      {Object.keys(teams).map((team)=>(
                        <MenuItem value = {team} primaryText={teams[team].teamName} />
                      ))
                      }
                    </SelectField>
                    <SelectField floatingLabelText="Select Your Level" value={this.state.levelValue} onChange={this.handleLevelChange} errorText={this.state.error['level']} style = {style.text}>
                      {levels.map((level, index)=>(
                        <MenuItem value = {index} primaryText={level} key = {index}/>
                      ))
                      }
                    </SelectField>
                  </div>
                  {this.state.data['teamName'] &&
                    <div style = {{display:'flex', justifyContent:'center', flexDirection:'column'}}>
                      <SelectField floatingLabelText="Select A Course" value={this.state.courseValue} onChange={this.handleCourseChange} errorText={this.state.error['course']} style = {style.text}>
                        {Object.keys(courses[this.state.data['teamName']]).map((course, index)=>{
                          return <MenuItem value = {course} primaryText={courses[this.state.data['teamName']][course].course} key = {index}/>;
                        })
                        }
                      </SelectField>
                      <h4 style = {{color:'#acb1b4', alignSelf:'center'}}>Select Credits</h4>
                      <RadioButtonGroup valueSelected = {this.state.credit} onChange = {this.handleCreditChange} style = {style.text}>
                        {this.state.creditOptions.map((option)=>(
                          <RadioButton value = {option} label = {option} key = {option} style = {style.radioButton} />
                        ))}
                      </RadioButtonGroup>
                    </div>
                  }
                    <Checkbox label="Check if you're returning to VIP" checked={this.state.returning} style = {{marginTop:'20px', marginBottom:'20px', alignSelf:'center', width:'256px'}} onCheck = {this.handleCheck} />
                </div>
              </Card>
              }
            </div>
        </MuiThemeProvider>
        <MuiButton label = "Apply" style = {style.submit} onClick = {this.handleSubmit}/>
        <Dialog
          title="Applied!"
          actions={actions}
          modal={true}
          open={this.state.open}
        >
          Thank you for applying!
        </Dialog>
      </div>);
  }
}

export default ApplicationWithoutTeam;