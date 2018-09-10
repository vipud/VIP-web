import React from 'react';
import { Switch, Route } from 'react-router-dom';

// import ASUTeamFormComponent from './Application/ASUTeamFormComponent';
import ProjectApplication from './ProjectApplication';
import ProjectPage from './ProjectPage';
import ProjectList from './ProjectList';
import ProjectEditPage from './ProjectEditPage';
import StudentApplication from './StudentApplication';
import ApplicationWithoutTeam from '../projects/ApplicationWithoutTeam';

import userStore from '../../stores/UserStore';

const Projects = ( {match} ) => (
  <div>
    <Switch>
      {/*<AdvisorRoute exact path={`${match.url}/application`} user={userStore} component={ ASUTeamFormComponent }/>*/}
      <Route exact path={`${match.url}/:projectid/apply`} component={ StudentApplication }/>
      <Route exact path={`${match.url}/application`} authed={userStore.authed} component={ ProjectApplication }/>
      <Route exact path={`${match.url}/:projectId/edit`} component={ ProjectEditPage } />
      <Route path={`${match.url}/:projectId`} component={ ProjectPage }/>
      <Route exact path={match.url} component={ ProjectList }/>
      <Route exact path={`${match.url}/applying`} component = {ApplicationWithoutTeam } />
    </Switch>
  </div>
)

export default Projects;
