import ReactDataGrid from 'react-data-grid';
import React, {Component} from 'react';
import Checkbox from 'material-ui/Checkbox';
import MuiButton from '../../MuiButton';
import firebase from '../../../firebase';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import update from 'react-addons-update';
import {Link} from 'react-router-dom';
const { Toolbar, Data: { Selectors } } = require('react-data-grid-addons');

const style = {
  Checkbox : {
    width:'200px',
    textAlign:'center'
  },
  numberOfRecords:{
    float:'right', color:"#d6dedb"}
}

class StudentApplicationTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roster:this.props.roster,
      columns:[],
      rows:'',
      sortColumn: null,
      sortDirection: null,
      filters:{},
      selectedIndexes :[],
      techElective:false
    }
    this.getRows = this.getRows.bind(this);
    this.rowGetter = this.rowGetter.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.getSize = this.getSize.bind(this);
    this.handleGridSort = this.handleGridSort.bind(this);
    this.onClearFilters = this.onClearFilters.bind(this);
    this.createRows = this.createRows.bind(this);
    this.createColumns = this.createColumns.bind(this);
    this.onRowsSelected = this.onRowsSelected.bind(this);
    this.onRowsDeselected = this.onRowsDeselected.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleRemoveRow = this.handleRemoveRow.bind(this);
    this.handleRemoveFb = this.handleRemoveFb.bind(this);
    this.handleDeny = this.handleDeny.bind(this);
    this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this);
    this.changeTechElective = this.changeTechElective.bind(this);
  }

  componentDidMount() {
    this.createColumns();
    this.createRows();
  }

  createColumns() {
    let keys = Object.keys(this.state.roster);
    let columns = Object.keys(this.state.roster[keys[0]]);
    let temp = [];
    columns.forEach((i) => {
      if(i==='name') {
        temp.unshift({
        key:i,
        name:i.split('_').join(' '),
        filterable:true,
        sortable:true,
        resizable: true,
        editable:true
      });
      }else{
      temp.push({
        key:i,
        name:i.split('_').join(' '),
        filterable:true,
        sortable:true,
        resizable: true,
        editable:true
      })}
    });
    this.setState({
      columns:temp
    });
  }

  createRows() {
    let roster = this.state.roster;
    let keys = Object.keys(this.state.roster);
    let columnKeys = Object.keys(roster[keys[0]]);
    let rows = [];
    for (let i = 0; i < keys.length; i++) {
      let rowObject = {}
      columnKeys.forEach((key) => {
        rowObject[key] = roster[keys[i]][key]
      });
      rows.push(rowObject);
    }
    this.setState({rows:rows});
  }

  getRows() {
    return Selectors.getRows(this.state);
  }

  getSize() {
    return this.getRows().length;
  }

  rowGetter(rowIdx) {
    const rows = this.getRows();
    return rows[rowIdx];
  }

  handleGridSort(sortColumn, sortDirection) {
    this.setState({ sortColumn: sortColumn, sortDirection: sortDirection });
  }

  handleFilterChange(filter) {
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }

    this.setState({ filters: newFilters });
  }

  onClearFilters() {
    this.setState({ filters: {} });
  }
  
  handleAccept() {
    let keys = Object.keys(this.state.roster);
    this.state.selectedIndexes.forEach((i) => {
      if(this.state.rows[i]["course"].substring(0, 4)==="CISC"){
        if(this.state.techElective){
          this.state.rows[i]["techElective"] = "true";
        }else{
          this.state.rows[i]["techElective"] = "false";
        }
      }
      console.log(this.state.rows[i]);
      firebase.database().ref(`Student_Add_Pending/${this.state.rows[i].teamName}/${this.state.rows[i].semester}`).push(this.state.rows[i]);
      this.handleRemoveFb(keys[i]);
    });
    this.handleRemoveRow();
  }

  handleDeny() {
    let keys = Object.keys(this.state.roster);
    this.state.selectedIndexes.forEach((i) => {
    firebase.database().ref(`RejectedStudents/${this.state.rows[i].teamName}/${this.state.rows[i].semester}`).child(keys[i]).set(this.state.rows[i]);    
      this.handleRemoveFb(keys[i], i);
    });
    this.handleRemoveRow();
  }

  handleRemoveRow() {
    let remove = [];
    this.state.selectedIndexes.forEach((i)=> {
      remove.push(this.state.rows[i]);
    });
    remove.forEach((i)=> {
      this.state.rows.splice(this.state.rows.indexOf(i),1);
    });
    this.setState({
      selectedIndexes:[]
    })
  }

  handleRemoveFb(uuid, index) {
    firebase.database().ref('StudentApplication').child(uuid).remove();
  }

  onRowsSelected(rows) {
    let temp = this.state.selectedIndexes;
    rows.forEach((i) => {
      temp.push(i.rowIdx);
    });
    this.setState({
      selectedIndexes:temp
    })
  }

  onRowsDeselected(rows) {
    let temp = this.state.selectedIndexes;
    rows.forEach((i) => {
      temp.splice(temp.indexOf(i.rowIdx),1);
    });
    this.setState({
      selectedIndexes:temp
    })
  }

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let rows = this.state.rows.slice();

    console.log(updated);
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});
      rows[i] = updatedRow;
    }

    this.setState({ rows });
  };

  changeTechElective(){
    this.setState((prevState)=>{
      return{techElective:!prevState.techElective};
    });
    
  }

  render() {
    return  (
      <div>
        <h1 style={{textAlign:'center'}}>Student Applicants</h1>
        <ReactDataGrid
          rowKey="id"
          columns={this.state.columns}
          rowGetter={this.rowGetter}
          rowsCount={this.getSize()}
          minHeight={400}
          onGridRowsUpdated={this.handleGridRowsUpdated}
          rowSelection={{
            showCheckbox: true,
            onRowsSelected: this.onRowsSelected,
            onRowsDeselected: this.onRowsDeselected,
            selectBy: {
              indexes: this.state.selectedIndexes,
            }
          }}/>
        <p style={style.numberOfRecords}>(Number of Records {this.getSize()})</p>
        <MuiThemeProvider>
          <div>
            <FlatButton label = "Accept" onClick = {this.handleAccept} />
            <FlatButton label = "Deny" onClick = {this.handleDeny} />
            <Checkbox label="Tech Elective" onCheck = {this.changeTechElective} style = {style.Checkbox} labelPosition = 'left'/>
          </div>
        </MuiThemeProvider>
      </div>);
  }
};

export default StudentApplicationTable;