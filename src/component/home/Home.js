import React, { Component } from 'react';
import firebase from '../../firebase';
import { Link } from 'react-router-dom'

//Components
import ProjectList from '../projects/ProjectList';
import AnnouncementList from '../announcements/AnnouncementList';
import ApplicationButton from '../projects/Application/ApplicationButton';

//Style
import {Secondary} from '../../Theme';

const style = {
  title:{
    textAlign:'center', 
    color:Secondary, 
    paddingTop:'20px'
  }, 
  card:{
    marginBottom: '20px'
  }
}

class Home extends Component {
  constructor(){
    super();
    this.state = {
      Announcement:''
    }
  }
  componentDidMount(){
    firebase.database().ref('Announcement').on('value', (snap)=>{
      this.setState({
        Announcement:snap.val()
      });
    });
  }
  render() {
    return(
      <div>
        <Link to ="/project/apply"><ApplicationButton /></Link>
        <div className="col-md-12 vip-banner large-banner" style = {style.card}>
          <h1 className="yellow title">VERTICALLY</h1>
          <h1 className="yellow title">INTEGRATED</h1>
          <h1 className="yellow title">PROJECTS</h1>
          <h1 className="yellow title">AT UD</h1>
          <p className="white subtitle">Accelerate your future. Contribute real research.</p>
          <p className="white subtitle">Do awe-inspiring projects&hellip; all as part of your degree.</p>
        </div>
        <div className="col-md-12 vip-banner small-banner" style = {style.card}>
          <h1 className="yellow subtitle">VIP @ UD</h1>
        </div>
        {this.state.Announcement &&
          <div>
            <h1 style = {style.title}>Announcements</h1>
            <AnnouncementList pageLength = {2} />
          </div>
        }
        <h1 style = {style.title}>Active Projects</h1>
        <ProjectList />
      </div>
    );
  }
}

export default Home;
