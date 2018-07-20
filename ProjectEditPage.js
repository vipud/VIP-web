import React, { Component } from 'react';

import firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import {Card, CardteamName, CardTitle} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {checkEmpty} from '../../Validation';
import {university} from '../../Theme';
import ASUTeamLogoUpload from './Application/ASUTeamLogoUpload';
import TeamApplyModalComponent from './Application/TeamApplyModalComponent';
import TextFieldComponent from './Application/TextFieldComponent';//Do I need? Why?
import {Link} from 'react-router-dom';
import Primary from '../../Theme';

//TO DO:
//Group different types of data together under headers? Faculty[array], topics{object}, members[array], media[array] (images)? 
//After grouping, edit only pieces of data as to lessen potential data loss

//After gaining access to ASU code, go through and make sure code fits within existing structure!!

const style = {
  margin: "10px"
};

function lowerFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

// Create an array in this.state. then populate the array with TeamApplication key values. Then access them in the TextFieldComponent with the ids in loop.
class ProjectEditPage extends Component{ 
  constructor(props) {
    super(props);
    this.state = {
        fbkey: this.props.match.params.projectId,

        data: ''
        /*teamName: '', 
        subtitle: '',
        researchIssues: '',
        researchAreas: '',
        majorsPreparationandInterests: '',
        keyElements: '',
        goals: '',
        faculty: '', e.g. [ 0: {leadFacultyName, leadFacultyEmail, etc...}, 1: {secondaryFacultyName...} ...]
        student members? Would not show up on main project page, but could potentially show up to other students, 
          faculty members, etc. That way admins can change roster on the project page itself?
        */
      };
    }
    componentDidMount() {
      //Takes info from database and shoves it into this.data
        firebase.database().ref(`Teams/${this.state.fbkey}`).once('value').then( (snap) => {
          /*let faculty = {};
          Object.keys(snap.val()).forEach((key)=>{
            if(key.substring(0,4)==="lead"){
              faculty[key] = snap.val()[key].split(",");
            }
          });*/
          this.setState({
            data:snap.val(),
            //faculty:faculty
          });
        });
      }

      textChangedHandler = (event, key) => {
        //Allows team info to be changed, updates state
        const data = {...this.state.data};

        data[key] = event.target.value;
    
        this.setState({data: data});
      }

    imageChangedHandler =(imageUploadUrl) =>{
      if(imageUploadUrl !== null) {
        const data = {...this.state.data};

        data['logo'] = imageUploadUrl;
      
        this.setState({data: data});
      }
    }

    /*handleChange = (event) => {
    console.log(this.state.data);
    var str = event.target.id;
    var res = str.split("-");
    var key = res[2].charAt(0).toLowerCase() + res[2].slice(1);
    var val = event.target.value;
    var obj  = this.state.data;
    console.log(key);
    obj[key] = val;
    if(key==="topics"){
     var str = event.target.value;
     var res=str.split(",");
     this.setState({
        topics : res,
      });
    }
    else{
        console.log(obj);
        this.setState(obj);
    }
    console.log(obj);
  }*/


  firebasewrite = () => {
    //Takes all the shit in this.data and shoves it back into the database where it came from
    const rootRef = firebase.database().ref(`Teams/`+this.state.fbkey);
    rootRef.set({
        teamName : this.state.data.teamName,
        subtitle : this.state.data.subtitle,
        researchIssues : this.state.data.researchIssues,
        researchAreas : this.state.data.researchAreas,
        majorsPreparationandInterests: this.state.data.majorsPreparationandInterests,
        keyElements: this.state.data.keyElements,
        goals: this.state.data.goals,
        leadFacultyAcademicTitle: this.state.data.leadFacultyAcademicTitle,
        leadFacultyAcademicUnit: this.state.data.leadFacultyAcademicUnit,
        leadFacultyDegree: this.state.data.leadFacultyDegree,
        leadFacultyName : this.state.data.leadFacultyName,
        leadFacultyEmail : this.state.data.leadFacultyEmail,
        logo: this.state.data.logo
        //logo: this.state.teamLogo,
    });
}

//<ASUTeamLogoUpload imageUploadUrl = {this.imageChangedHandler}/>


	render(){
    //let questionsArray = this.state.questionsArray;
    //alert(JSON.stringify(questionsArray));

    //let faculty;
    let data = Object.keys(this.state.data).reverse().map((key) => {
      if(key === "logo"){
        return/*(
          <div key={key}>
            <h3 style = {{color:Primary, marginBottom:'30px', marginTop:'40px'}}><strong>{"Edit " + key.charAt(0).toUpperCase() + key.slice(1).split(/(?=[A-Z]|and)+/).join(" ")}</strong></h3>
            <ASUTeamLogoUpload imageUploadUrl = {this.imageChangedHandler}/>
          </div>
        )*/;
      }
      return(
        <div key={key}>
          <h3 style = {{color:Primary, marginBottom:'30px', marginTop:'40px'}}><strong>{"Edit " + key.charAt(0).toUpperCase() + key.slice(1).split(/(?=[A-Z]|and)+/).join(" ")}</strong></h3>
        <TextField 
          style={{width: '50%'}}
          value={this.state.data[key]}
          onChange={(event) => { this.textChangedHandler(event, key)}}
          /><br /></div>
      );
    });
    console.log(this.state.data);



		return (
            <div style={{margin: 'auto',textAlign: 'center'}}>
                <MuiThemeProvider>
                    <div>   
            <Card>
              <CardTitle title="Edit Project Page">
                {this.state.data && data}
              </CardTitle>
            </Card>
              <br/>
              <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div>
                  <RaisedButton label="Submit Changes"  style={style} backgroundColor={Primary} onClick={this.firebasewrite}
                  data-toggle="modal" data-target="#myModal" /> <br />
                </div>
              </MuiThemeProvider>
              <ASUTeamLogoUpload imageUploadUrl = {this.imageChangedHandler}/>

        </div>
            </MuiThemeProvider>

        <TeamApplyModalComponent />
      </div>)
	}
}



export default ProjectEditPage;