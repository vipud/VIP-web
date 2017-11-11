import React, { Component } from 'react';
import ProjectList from '../projects/ProjectList';
import AnnouncementList from '../announcements/AnnouncementList';
import {Secondary} from '../../Theme';
class Home extends Component {
  render() {
    return(
      <div>
        <div className="col-md-12 vip-banner large-banner">
          <h1 className="yellow title">VERTICALLY</h1>
          <h1 className="yellow title">INTEGRATED</h1>
          <h1 className="yellow title">PROJECTS</h1>
          <h1 className="yellow title">AT UD</h1>
          <p className="white subtitle">Accelerate your future. Contribute real research.</p>
          <p className="white subtitle">Do awe-inspiring projects&hellip; all as part of your degree.</p>
        </div>
        <div className="col-md-12 vip-banner small-banner">
          <h1 className="yellow subtitle">VIP @ UD</h1>
        </div>
        <h1 style = {{textAlign:'center', color:Secondary}}>Announcements</h1>
        <AnnouncementList pageLength = {2} />
        <h1 style = {{textAlign:'center', color:Secondary}}>Active Projects</h1>
        <ProjectList />
      </div>
    );
  }
}

export default Home;
