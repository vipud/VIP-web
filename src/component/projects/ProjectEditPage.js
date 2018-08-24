import React, { Component } from 'react';
import { Prompt } from 'react-router';
import { withRouter } from 'react-router-dom';

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

//Ensure that, if the team name is changed, it's updated in the advisors section

//Maybe switch from having a single "data" section in state, splitting it up into its regular headers (except for logo)

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

        teamName: '',
        currData: {},
        edited: false,
        slugArray: []
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
      this.popElement = null;

      this.setPopElementRef = element =>{
          this.popElement = element
      };
    }
    
    componentDidMount() {
      //Takes info from database and shoves it into this.data
        firebase.database().ref(`Teams/${this.state.fbkey}`).once('value').then( (snap) => {
          /*let faculty = {};*/
          Object.keys(snap.val()).forEach((key)=>{
            if(key === "teamName"){
              this.setState({
                teamName: snap.val()[key]
              })
            }
          });
          this.setState({
            currData: snap.val()
          })
        });
        firebase.database().ref(`Slugs/${this.state.fbkey}`).once('value').then( (snap) => {
          this.setState({
            slugArray: snap.val()
          })
        });
      }

      textChangedHandler = (event, key) => {
        //Allows team info to be changed, updates state
        this.setState({edited: true});
        const data = {...this.state.currData};

        data[key] = event.target.value;

        this.setState({currData: data});
      }

      /*returnToProject = () => {
        write thing that redirects user to ProjectPage
      */

    imageChangedHandler =(imageUploadUrl) =>{
      if(imageUploadUrl !== null) {
        const data = {...this.state.currData};

        data['logo'] = imageUploadUrl;
      
        this.setState({edited: true, currData: data});
      }
    }

    cancel = () => {
      this.setState({
        edited: false
      });
      this.props.history.goBack();
    }

  firebasewrite = () => {
    const rootRef = firebase.database().ref(`Teams/`+ this.state.fbkey);
    //Takes all the shit in this.data and shoves it back into the database where it came from
    
    if (this.state.teamName !== this.state.currData.teamName) {
      const slugRef = firebase.database().ref(`Slugs/` + this.state.fbkey);
      let newSlugArray = [];
      let newSlug = this.state.currData.teamName.split(" ").join("-");
      newSlugArray = [newSlug, ...this.state.slugArray];
      console.log(newSlugArray);
      slugRef.set({
      ...newSlugArray
      })
    }
    
    rootRef.set({
        teamName : this.state.currData.teamName,
        subtitle : this.state.currData.subtitle,
        researchIssues : this.state.currData.researchIssues,
        researchAreas : this.state.currData.researchAreas,
        majorsPreparationandInterests: this.state.currData.majorsPreparationandInterests,
        keyElements: this.state.currData.keyElements,
        goals: this.state.currData.goals,
        leadFacultyAcademicTitle: this.state.currData.leadFacultyAcademicTitle,
        leadFacultyAcademicUnit: this.state.currData.leadFacultyAcademicUnit,
        leadFacultyDegree: this.state.currData.leadFacultyDegree,
        leadFacultyName : this.state.currData.leadFacultyName,
        leadFacultyEmail : this.state.currData.leadFacultyEmail,
        logo: this.state.currData.logo
        //logo: this.state.teamLogo,
    }).then(() => {
      this.setState({
        edited:false
      });
      this.props.history.goBack();
    });
}

//<ASUTeamLogoUpload imageUploadUrl = {this.imageChangedHandler}/>


	render(){
    //let questionsArray = this.state.questionsArray;
    //alert(JSON.stringify(questionsArray));
    //console.log("this seriously started rendering before it had the data");
    //let faculty;
    let data = Object.keys(this.state.currData).reverse().map((key) => {
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
          value={this.state.currData[key]}
          onChange={(event) => { this.textChangedHandler(event, key)}}
          /><br /></div>
      );
    });
    //console.log(this.state.currData);



		return (
            <div style={{margin: 'auto',textAlign: 'center'}}>
                <MuiThemeProvider>
                    <div>   
            <Card>
              {(this.state.application) ?
                <CardTitle title="Edit Application Page">
                  {this.state.currData && data}
                </CardTitle>
                :
                <CardTitle title="Edit Project Page">
                  {this.state.currData && data}
                </CardTitle>
              }
            </Card>
              <br/>
              <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div>
                    <RaisedButton label="Cancel" style={style} backgroundColor={Primary} onClick={() => this.cancel()} />
                    <RaisedButton label="Apply Changes"  style={style} backgroundColor={Primary} onClick={this.firebasewrite}/> <br />
                </div>
              </MuiThemeProvider>
              <ASUTeamLogoUpload imageUploadUrl = {this.imageChangedHandler}/>

        </div>
            </MuiThemeProvider>

        <TeamApplyModalComponent />
        <Prompt
          when={this.state.edited}
          message="You have unsaved changes. Are you sure you want to leave?"
        />
      </div>
    )
	}
}



export default withRouter(ProjectEditPage);
