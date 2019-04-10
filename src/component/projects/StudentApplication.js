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
        courseOptions: '',
        courseValue: 0,
        semester:'',
        creditOptions:[],
        level:["Freshman", "Sophomore", "Junior", "Senior"],
        returning:false,
        value:"default",
        levelValue: 0,
        sections: '',
        notIncluded:['errorText','error','other', 'course', 'credits']
      };
      this.handleMenuChange = this.handleMenuChange.bind(this);
      this.handleCreditChange = this.handleCreditChange.bind(this);
      this.handleCourseChange = this.handleCourseChange.bind(this);
      this.handleCheck = this.handleCheck.bind(this);
      this.handleLevelChange = this.handleLevelChange.bind(this);
    }

    componentDidMount() {
        let data = {};
        console.log(this.state.fbkey);
        firebase.database().ref(`Teams/`+this.state.fbkey).once(`value`).then( (snap) => {
          console.log(snap.val);
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
          data['level'] = "Freshman";
          this.setState({
            questionsArray: snap.val(),
            data:data,
            empty:empty,
            notIncluded:notIncluded
          });
        });

        firebase.database().ref(`Courses`).on('value', (snap) => {
          //console.log(snap.val()[0].courseNum.replace('x', 1));
          let optionsLen = snap.val().length;
          let courseOptions = new Array(optionsLen);
          for (var i = 0; i < optionsLen; i ++) {
            //console.log(snap.val()[i].courseNum.replace('x', 1));
            courseOptions[i] = snap.val()[i].courseNum.replace('x', 1);
          }
          this.setState({
            courses:snap.val(),
            courseOptions: courseOptions
          });
        });

        firebase.database().ref(`Sections`).on('value', (snap) => {
          //do something about this?
          console.log(snap.val());
          this.setState({sections:snap.val()});
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
      
      var optionsLen
      let courseOptions;
      let coursesLen = this.state.courses.length;
      if(!checked) {
        optionsLen = coursesLen * 4; 
        courseOptions = new Array(optionsLen);
      }
      else {
        optionsLen = coursesLen; 
        courseOptions = new Array(optionsLen);
      }
      console.log(optionsLen);
      console.log(this.state.courses[0].courseNum);
      for (let i = 0; i < optionsLen; i ++) {
        if(!checked) {
          for (let j = 0; j < 4; j++) {
            courseOptions[j] = this.state.courses[i].courseNum.replace('x', j);
            console.log(this.state.courses[i].courseNum.replace('x', (j+1)));
          }
        }
        else {
          courseOptions[i] = this.state.courses[i].courseNum.replace('x', 1);
        }
      }
      obj['courseOptions'] = courseOptions;
      this.setState({
        data:obj,
        returning:!checked,
        courseOptions: courseOptions
      });
    }

    handleCreditChange(event, index) {
      //check this
      let obj  = this.state.data;
      obj['credits'] = this.state.creditOptions[index];
      this.setState({
        data:obj
      });
    }

    handleMenuChange(event, index, value) {
      //i dunno, fix this
      let obj  = this.state.data;
      //console.log(value);
      obj['course'] = value !== 'default' ?this.state.courses[value].course : 'any';
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
    //things should probably be done here
    let obj = this.state.data;
    obj["level"] = this.state.level[index];
    this.setState({
      levelValue: index,
      data:obj
    });
  }

  handleCourseChange(event, index){
    var creditOptions;
    let obj = this.state.data;
    obj["course"] = this.state.courses[index];
    console.log(this.state.courses[index])
    if(this.state.returning) {
      var N = index%4 + 1; 
      creditOptions = new Array(N);
      for (let i = 0; i < N; i++) {
        creditOptions[i] = i + 1;
      }
    }
    else {
      creditOptions = [1]
    }
    console.log(creditOptions);
    this.setState({
      courseValue: index,
      data: obj
    })
  }

  firebasewrite = () => {

    let empty = checkEmpty(this.state.error, this.state.data, this.state.data.email, this.state.notIncluded);
    console.log(this.state.data);
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

    const actions = [
      <Link to = '/'><FlatButton
        label="Close"
        primary={true}
      /></Link>,
    ];

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
                          onChange={this.handleChange}/><br /></div>)
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
                <SelectField floatingLabelText="Level" value={this.state.levelValue} onChange={this.handleLevelChange}>
                      {this.state.level.map((key, index) => {
                        return <MenuItem value = {index} primaryText = {key} key = {key}/>
                      })}
                </SelectField>
                {this.state.courses //to do: map courses from firebase
                ?<div>
                  <SelectField floatingLabelText="Course" value={this.state.value} onChange={this.handleCourseChange}>
                    <MenuItem value = {"default"} primaryText = 'please select a course'/>
                    {Object.keys(this.state.courses).map((key, index) => {
                      return <MenuItem value = {index} primaryText = {this.state.courseOptions[index] + '-'} key = {key}/>
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
                modal={true}
                open={this.state.open}
                actions = {actions}
                />
            </div>
		  </MuiThemeProvider>
		</div> )
	}
}



export default StudentApplication;
