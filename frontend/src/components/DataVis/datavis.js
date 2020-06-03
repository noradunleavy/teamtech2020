import React, {Component} from 'react';
import Sunburst from './Sunburst';
import ReactVirtualizedTable from './Anomalies';
import './datavis.css';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import Button from 'react-bootstrap/Button';
import { UserContext } from "../UserContext.js";
import UserForm from '../UUIDForm';

import API from '../../api';

const flaskApiUrl = {
  url: 'https://teamtech2020.herokuapp.com'
};

const styles = {
  container: {
    textAlign: "center"
  },
  noTable: {
    display: "none"
  }
};

export default class DataVisualization extends Component {

  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      date: [null, null],
      defaultDate: [new Date('December 1, 2017 00:00:00'), new Date('December 31, 2017 00:00:00')],
      startTimestamp: undefined,
      endTimestamp: undefined,
      sunburstData: null,
      defaultSunburstData: null,
      showSunburst: false,
      showAnomalies: false,
      anomalyData: null,
      showErrorMessage: false,
      uuid: null,
    };
    this.tableRef = React.createRef();
  }

  getSunburstData = async(start, end) => {
    let data = null
    const myAPI = new API({url: 'https://teamtech2020.herokuapp.com'})
    myAPI.createEntity({ name: 'get'})
    console.log(this.state.uuid);
    await myAPI.endpoints.get.sunburstData({uuid: this.state.uuid}, {start_timestamp: start}, {end_timestamp: end})
      .then(response => data = response.data);
    
    return JSON.parse(JSON.stringify(data));
  }

  getAnomalyData = async(start, end) => {
    let anomalyData = null
    const myAPI = new API({url: 'https://teamtech2020.herokuapp.com'})
    myAPI.createEntity({ name: 'get'})
    await myAPI.endpoints.get.anomalyData({uuid: this.state.uuid}, {start_timestamp: start}, {end_timestamp: end})
      .then(response => anomalyData = response.data);
      
    return JSON.parse(JSON.stringify(anomalyData));
  }

  async componentDidMount() {
    // Get default sunburst data 
    let data = await this.getSunburstData(undefined, undefined);
    this.setState({
      defaultSunburstData: data,
    })
  }

  onChangeDateTime = async(selectedDate) => {
    // Convert date into start and end unix timestamps
    let start = Math.floor(selectedDate[0].getTime() / 1000)
    let end = Math.floor(selectedDate[1].getTime() / 1000)

    this.setState({
      date: selectedDate,
      showSunburst: false,
      startTimestamp: start,
      endTimestamp: end,
    })
  }

  async toggleSunburst() {
    // GET the new sunburst data
    let new_sunburst_data = await this.getSunburstData(this.state.startTimestamp, this.state.endTimestamp);

    this.setState((prevState) => ({
      showSunburst: true,
      sunburstData: new_sunburst_data !== "No matches" ? new_sunburst_data : prevState.defaultSunburstData,
      showErrorMessage: new_sunburst_data == "No matches" ? true : false,
    }));
  }

  displaySunburst = () => <Sunburst
    data={this.state.sunburstData}
    width="800" 
    height="900"           
    count_member="size"
    labelFunc={(node)=>node.data.name}
    _debug={false}
  />

  async toggleAnomalies() {
    let new_anomaly_data = await this.getAnomalyData(this.state.startTimestamp, this.state.endTimestamp);
    this.setState({showAnomalies: true, anomalyData: new_anomaly_data}, () => {
      setTimeout(() => {
        this.tableRef.current.scrollIntoView({behavior:"smooth"})
      }, 100);
    });     
  }
  
  displayAnomalies() {
    return (
      <div ref={this.tableRef} style={this.state.showAnomalies ? {} : styles.noTable}>
        <ReactVirtualizedTable
          data={this.state.anomalyData}
        />;
      </div>
    )
  }

  handleInputChange = async(input) => {
    let result = null
    const myAPI = new API({url: 'https://teamtech2020.herokuapp.com'})
    myAPI.createEntity({ name: 'get'})
    await myAPI.endpoints.get.username({username: input})
      .then(response => result = response.data);
    
    if(result !== "No matches") {
      this.setState({
        uuid: result["uuid"],
        showSunburst: false,
      })
    } else {
      this.setState({
        uuid: null,
        showSunburst: false,
      })
    }
  }

  render() {
    return (
      <div className="data-vis-page">
        <br/>
        {/* <UserForm/> */}
        <div className="form-group">
          <span className = "uuid-prompt">Username:</span>
          <input class="form-field" type="text" placeholder="Please input your username" onChange={e => this.handleInputChange(e.target.value)}/>
          {this.state.uuid === null ? <p className="error-message">No user found.</p> : null}
        </div>
        <div className="dateContainer" style = {styles.container}>
        <DateTimeRangePicker
          value = {this.state.date[0] === null ? this.state.defaultDate : this.state.date}
          onChange={this.onChangeDateTime}
          maxDetail = "second"
          clearIcon = {null}
        />
        </div>
        <div className="viewContainer" style={styles.container}>
        <Button className="view_button" justify="center"
        onClick={this.toggleSunburst.bind(this)}>
        View Sunburst
        </Button>
        </div> 
        <div className="errorContainer" style={styles.container}>
        { this.state.showErrorMessage && this.state.showSunburst && <p className="error-message">No matches found for this range. Showing all entries.</p> }
        </div>
        { this.state.showSunburst && this.displaySunburst() }
       

        <div className="container" style={styles.container}>
          <Button className="anomaly_button" justify="center"
            onClick = {this.toggleAnomalies.bind(this)}>
            View Anomalies
          </Button>
        </div> 
        {this.displayAnomalies()}
      </div>
    );
  }
}
