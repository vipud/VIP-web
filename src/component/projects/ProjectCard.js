import React, { Component } from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Card, CardActions, CardMedia, CardTitle, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Vip_logo from '../../assets/viplogo.png';
import Primary, {Secondary} from '../../Theme';

import { Link, Route } from 'react-router-dom';

const style = {
  wholecard: {
    backgroundColor: "#003976",
    backgroundImage: "radial-gradient(#00539f 24%, transparent 25%), radial-gradient(#00539f 24%, transparent 25%)",
    backgroundSize: "12px 12px",
    backgroundPosition: "0 0, 6px 6px",
    margin: "1em"
  },
  card: {
    paddingBottom: "10px",
    margin: "10px",
    height: "340px",
    backgroundColor: "rgba(0,0,0,0) !important"
  },
  cardMedia:{
    maxHeight: "340px",
    maxWidth: "100%",
    objectFit: "contain"
  },
  title: {
    textAlign : 'left',
    fontSize: '2em',
    minHeight: "50px",
    overflow: "hidden",
    textOverflow:"ellipsis",
    color: Secondary
  },
  subtitle: {
    textAlign : 'left',
    fontSize: '1.5em',
    height: "50px",
    textAlign: "center",
    overflow: "hidden",
    textOverflow:"ellipsis",
    color: Secondary
  },
  cardText: {
    overflow: "hidden",
    textAlign:"right",
    textOverflow: "ellipsis",
    height: "140px"
  },
  textpart: {
    width: "65%",
    float: "left"
  },
  imagepart: {
    width: "30%",
    float: "right",
    display: "flex",
    textAlign: "center",
    itemAlign: "center"
  }

}
var adjustTheme = getMuiTheme(darkBaseTheme);

class ProjectCard extends Component {
    constructor(props) {
      super(props);
    };
    render () {
      return (
        <MuiThemeProvider muiTheme={adjustTheme}   >
          <div className="col-md-12" style={style.wholecard}>
          <Card style={style.card}>
            <div style={style.textpart}>
            <Link to={`projects/${this.props.fbkey}`}>
              <CardHeader
                title={this.props.project.teamName}
                actAsExpander={false}
                showExpandableButton={false}
                titleStyle = {style.title}
            />
            </Link>

              <CardText expandable={false} style={style.cardText}>
              <span style={style.subtitle}>{this.props.project.subtitle}</span>
              </CardText>
              <CardActions>
                <Link to={`projects/${this.props.fbkey}`}><FlatButton label="Learn more / Apply" /></Link>
              </CardActions>
              </div>
              <div style={style.imagepart}>
                {this.props.project.logo
                  ?<img src={this.props.project.logo} alt="" style = {style.cardMedia}/>
                  :<img src={Vip_logo} alt="" style = {style.cardMedia}/>
                }
              </div>
          </Card>
          </div>
        </MuiThemeProvider>
      )
    }
}

export default ProjectCard;
