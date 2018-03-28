// service
import React, { Component } from 'react';
import {fetchRole} from './component/login/auth';
import firebase from './firebase';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { observer } from "mobx-react";
import appStore from './stores/AppStore';
import userStore from './stores/UserStore';
import './style/App.css';

// page component
import AdminPage from './component/admin/AdminPage';
import Advisor from './component/advisor/Advisor';
import Announcement from './component/announcements/Announcement';
import DashBoard from './component/DashBoard';
import Footer from './component/Footer';
import Header from './component/Header';
import Home from './component/home/Home';
import LoginPage from './component/login/LoginPage';
import PeerReview from './component/peerReview/PeerReview';
import Projects from './component/projects/Projects';
import Resource from './component/resource/Resource';
import Student from './component/student/Student';
import ApplicationWithoutTeam from './component/projects/ApplicationWithoutTeam';
// import TestPlot from './component/peerReview/analytics/TestPlot';
import { AdminRoute, PublicRoute,PrivateRoute, AdvisorRoute, StudentRoute } from './component/Route';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Primary from './Theme';

injectTapEventPlugin();


const NotInTheSystem = () => (
  <div>
    <MuiThemeProvider>
    <Paper zDepth = {1} style = {{padding:'20px'}}>
      <h4 style={{color: Primary}}>Sorry, we do not have your data in the system. Please contact an administrator or apply for a team.</h4>
    </Paper>
    </MuiThemeProvider>
  </div>
)

@observer
class App extends Component {
  constructor () {
    super()
    this.state = {
      shouldRedirect: false,
      redirectPath: "",
    }
  }

  componentDidMount () {
    this.userStateChange = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        userStore.login()
        userStore.fetchUserInfo(user.email, user.displayName, user.photoURL)
        fetchRole(user.email).then(role => {
          userStore.fetchUserRole(role);
          appStore.finishLoading()
          if (!sessionStorage.getItem("loggedin")) { //first time login
            this.setState({
              shouldRedirect: true,
              redirectPath: "/" + role.toString()
            })
          }
        sessionStorage.setItem('loggedin', true);
        }).catch((noRole) => { //unable to retrieve role from db
          userStore.fetchUserRole(noRole);
          appStore.finishLoading()
          this.setState({
            shouldRedirect: true,
            redirectPath: "/"
          })
        })
      } else {
        appStore.finishLoading()
        userStore.logout()
      }
      
    })
  }

  componentWillUnmount () {
    this.userStateChange()
    sessionStorage.clear();
  }


  render() {
    return (
      <Router>
        <div>
          <Header user={userStore} />
            {appStore.loading === true 
            ? (<h2>Loading...</h2>)
            : (
              <div className="App">
                <Route exact path="/" component={Home}/>
                <Route path="/announcement" component={Announcement}/>
                <Route path="/projects" component={Projects}/>
                <Route path="/project/apply" component = {ApplicationWithoutTeam} />
                <Route path="/peer-review" component={PeerReview}/>
                {/* <Route path="/Test-Plot" component={TestPlot}/> */}
                <Route path="/resource/:category" component={Resource}/>
                <PublicRoute path="/login" authed={userStore.authed} component={LoginPage} />
                <PrivateRoute path="/dashboard" authed={userStore.authed} component={DashBoard} />
                {/* <UnEnrolledRoute path="/not_in_system" user={userStore} component={NotInTheSystem} /> */}
                <AdminRoute path="/admin" user={userStore} component={AdminPage}/>
                <AdvisorRoute path="/advisor" user={userStore} component={Advisor} />
                <StudentRoute path='/student' user={userStore} component={Student} />
                {/*<Route path="/admin" component={AdminPage} />*/}
                {this.state.shouldRedirect && (
                  <Redirect to={this.state.redirectPath}/>
                )}
              </div>
            )}
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;