import React, { Component } from 'react';

import firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DropDownMenu from 'material-ui/DropDownMenu';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import {Card, CardTitle} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';

import {checkEmpty} from '../../Validation';
import Primary, {university} from '../../Theme';
import TeamApplyModalComponent from './Application/TeamApplyModalComponent';
import TextFieldComponent from './Application/TextFieldComponent';
import {Link} from 'react-router-dom';

const TeamFormPath = 'StudentApplication_Raw_Data';
var db = 'Student Application';
const style = {
  margin: "10px"
};

const styles = {
  radioButton:{
    display:"inline-block",
    width: '70px',
    marginLeft: '0px'
  },
};

// Create an array in this.state. then populate the array with TeamApplication key values. Then access them in the TextFieldComponent with the ids in loop.
class StudentApplication extends Component{
  constructor(props) {
      super(props);
      this.state = {
        data:{},
        fbkey: this.props.match.params.projectid,
        errorText:'',
        error:{},
        courses:'',
        semester:'',
        creditOptions:[1,2],
        level:["Freshman", "Sophomore", "Junior", "Senior"],
        returning:false,
        value:"default",
        levelValue:0,
        notIncluded:['fbkey', 'errorText','error','other', 'course', 'credits']
      };
      this.handleMenuChange = this.handleMenuChange.bind(this);
      this.handleCreditChange = this.handleCreditChange.bind(this);
      this.handleCheck = this.handleCheck.bind(this);
      this.handleLevelChange = this.handleLevelChange.bind(this);
    }

    componentDidMount() {
        let data = {};
        firebase.database().ref(`Teams/`+this.state.fbkey).once(`value`).then( (snap) => {
          data['teamName'] = snap.val().teamName;
            this.setState({
                title: snap.val().teamName,
            });
        });

        firebase.database().ref('Semester').once('value').then((snap)=>{
          data['semester'] = snap.val().application;
        });

        firebase.database().ref(`FormQuestions/${db}`).once('value').then( (snap) => {

          let empty = {};
          let notIncluded = this.state.notIncluded;
          Object.keys(snap.val()).forEach((i)=>{
            data[snap.val()[i].id] = ''
            empty[snap.val()[i].id] = ''
            if(!snap.val()[i].required) {
              notIncluded.push(snap.val()[i].id);
            }
          });
          data['course'] = '';
          data['credits'] = 1;
          data['returning'] = "false";
          this.setState({
            questionsArray: snap.val(),
            data:data,
            empty:empty,
            notIncluded:notIncluded
          });
        });

        firebase.database().ref(`Courses`).on('value', (snap) => {
          this.setState({courses:snap.val()});
        });
    }

    getdata =(childdata) =>{
      this.setState({
        teamLogo: childdata,
      });
    }

    handleCheck(){
      let checked = this.state.returning;
      let obj = this.state.data;
      obj['returning'] = (!checked).toString();
      this.setState({
        data:obj,
        returning:!checked
      });
    }

    handleCreditChange(event, index) {
      let obj  = this.state.data;
      obj['credits'] = this.state.creditOptions[index];
      this.setState({
        data:obj
      });
    }

    handleMenuChange(event, index, value) {
      let obj  = this.state.data;
      obj['course'] = this.state.courses[this.state.title][Object.keys(this.state.courses[this.state.title])[value]].course;
      this.setState({
        value:value,
        data:obj,
      });
    }

    handleChange = (event) => {
    var str = event.target.id;
    var res = str.split("-");
    var key = res[2].charAt(0).toLowerCase() + res[2].slice(1);
    var val = event.target.value;
    var obj  = this.state.data;
    obj[key] = val;
    if(key==="topics") {
     var str = event.target.value;
     var res=str.split(",");
     this.setState({
        topics : res,
      })
    }
    else {
        this.setState({
          data:obj
        });
    }
  }

  handleLevelChange(event, index){
    let level = this.state.level;
    let obj = this.state.data;
    obj["level"] = this.state.level[index];
    this.setState({
      levelValue:index,
      data:obj
    });
  }

  firebasewrite = () => {

    let empty = checkEmpty(this.state.error, this.state.data, this.state.data.email, this.state.notIncluded);
    console.log(empty[0]);
    if(empty[0]) {
      if(`${db}`==='General Information'){
          const rootRef = firebase.database().ref().child('GeneralInformation');
          rootRef.push(
          this.state.data
      );
      } else if(`${db}`==='Academic Information'){
          const rootRef = firebase.database().ref().child('AcademicInformation');
          rootRef.push(
          this.state.data
          );
      } else if(`${db}`==='Student Application'){
          const rootRef = firebase.database().ref(`${TeamFormPath}`);
          rootRef.push(
          this.state.data
      );
      }
      console.log("ran");

      this.setState({
          id:'',
          program: '',
          gradeType: '',
          name: '',
          email: '',
          major: '',
          gpa:'',
          errorText:'',
          error:[],
          open:true,
          data:this.state.empty

      });
    }
    console.log(this.state.data);
    this.setState({
      errorText:empty[2],
      error:empty[1]
    });
  }

	render(){
    let questionsArray = this.state.questionsArray;
		return (
		<div>
		  <MuiThemeProvider>
            <div>
              <Card>
                <CardTitle title={this.state.title + ' Application Form'} style={{textAlign:"center"}} />
                  <div className="row" style={{position:"relative", left:"43%"}}>
                  {this.state.questionsArray
                  ? (Object.keys(this.state.questionsArray).map((id) => {
                    if(questionsArray[id].id==="email") {
                      return(
                        <div key={id}>
                          <TextField
                          value = {this.state.data[questionsArray[id].id]}
                          floatingLabelText={questionsArray[id].text}
                          errorText={this.state.errorText}
                          onChange={ this.handleChange}/><br /></div>)
                    }
                    return(
                  <div key = {id}>
                    <TextField
                      value = {this.state.data[questionsArray[id].id]}
                      floatingLabelText={questionsArray[id].text}
                      errorText={this.state.error[questionsArray[id].id]}
                      onChange={ this.handleChange}/><br/>
                  </div>)}))
                    : (<h2>Loading..</h2>) }
                <br/>
                {this.state.courses[this.state.title]
                ?<div>
                  <SelectField floatingLabelText="Course" value={this.state.value} onChange={this.handleMenuChange}>
                    <MenuItem value = {"default"} primaryText = 'please select a course'/>
                    {Object.keys(this.state.courses[this.state.title]).map((key, index) => {
                      return <MenuItem value = {index} primaryText = {this.state.courses[this.state.title][key].course} key = {key}/>
                    })}
                  </SelectField>
                  {this.state.creditOptions.length > 0 &&
                    <p style = {{color:'#b2b2b2'}}>Credits</p>
                  }
                  <RadioButtonGroup defaultSelected = {0} floatingLabelText = "Credits" onChange = {this.handleCreditChange}>
                    {this.state.creditOptions.map((key, index)=>(
                      <RadioButton value={index} label = {key} disabled = {this.state.creditOptions.length === 1} style = {styles.radioButton}/>
                    ))
                    }
                  </RadioButtonGroup>
                </div>
                :<h1/>
                  }
                    <SelectField floatingLabelText="Level" value={this.state.levelValue} onChange={this.handleLevelChange}>
                      {this.state.level.map((key, index) => {
                        return <MenuItem value = {index} primaryText = {key} key = {key}/>
                      })}
                    </SelectField>
                  <Checkbox label="Check if you're returning to VIP" checked={this.state.returning} style = {{marginTop:'20px', marginBottom:'20px'}} onCheck = {this.handleCheck} />
                </div>
              </Card><br/>
              <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div style={{margin: 'auto',textAlign: 'center'}}>
                  <RaisedButton label="Apply"  style={style} backgroundColor={Primary} onClick={this.firebasewrite}
                  data-toggle="modal" data-target="#myModal" /> <br />
                </div>
              </MuiThemeProvider>
              <Dialog
                title="Applied"
                modal={false}
                open={this.state.open}
                onRequestClose={()=>{this.setState({open:false})}}
                />
            </div>
		  </MuiThemeProvider>
		</div> )
	}
}



export default StudentApplication;
