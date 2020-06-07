import React, {Component} from 'react';
import Sunburst from './Sunburst';
import ReactVirtualizedTable from '../Anomalies';
import './datavis.scss';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import Button from 'react-bootstrap/Button';
import ErrorModal from '../error';

import API from '../../api';

const flaskApiUrl = "https://teamtech2loca020.herokuapp.com";

const styles = {
  container: {
    textAlign: "center"
  },
  noTable: {
    display: "none"
  }
};

export default class DataVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: [null, null],
      defaultDate: [new Date('December 1, 2017 00:0:00'), new Date('December 31, 2017 00:00:00')],
      startTimestamp: undefined,
      endTimestamp: undefined,
      sunburstData: null,
      defaultSunburstData: null,
      showSunburst: false,
      showAnomalies: false,
      anomalyData: null,
      defaultAnomalyData: null,
      usernameInput: "",
      uuid: null,
      showErrorModal: false,
      errorText: "",
      token: '',
    };
    this.tableRef = React.createRef();
  }

  handleModalClose = () => {
    this.setState({
      showErrorModal: false,
    })
  }

  getSunburstData = async(start, end, uuid, token) => {
    let data = null
    const myAPI = new API({url: flaskApiUrl})
    myAPI.createEntity({ name: 'get'})
    await myAPI.endpoints.get.sunburstData({uuid: uuid}, {start_timestamp: start}, {end_timestamp: end}, {token: token})
      .then(response => data = response.data);
    
    return JSON.parse(JSON.stringify(data));
  }

  getAnomalyData = async(start, end, uuid, token) => {
    let anomalyData = null
    const myAPI = new API({url: flaskApiUrl})
    myAPI.createEntity({ name: 'get'})
    await myAPI.endpoints.get.anomalyData({uuid: uuid}, {start_timestamp: start}, {end_timestamp: end}, {token: token})
      .then(response => anomalyData = response.data);
    return JSON.parse(JSON.stringify(anomalyData));
  }

  onChangeDateTime = async(selectedDate) => {
    // Convert date into start and end unix timestamps
    let start = Math.floor(selectedDate[0].getTime() / 1000)
    let end = Math.floor(selectedDate[1].getTime() / 1000)

    this.setState({
      date: selectedDate,
      showSunburst: false,
      showAnomalies: false,
      startTimestamp: start,
      endTimestamp: end,
    })
  }

  async toggleSunburst() {
    // GET the new sunburst data
    let new_sunburst_data = await this.getSunburstData(this.state.startTimestamp, this.state.endTimestamp, this.state.uuid, this.state.token);

    this.setState((prevState) => ({
      showSunburst: true,
      sunburstData: new_sunburst_data !== "No matches" ? new_sunburst_data : prevState.defaultSunburstData,
      showErrorModal: new_sunburst_data === "No matches" ? true : false,
      errorText: new_sunburst_data === "No matches" ? "No matches found. Showing all entries." : "",
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
    let new_anomaly_data = await this.getAnomalyData(this.state.startTimestamp, this.state.endTimestamp, this.state.uuid, this.state.token);

    this.setState({
      showAnomalies: true, 
      anomalyData: new_anomaly_data === "No matches" ? this.state.defaultAnomalyData : new_anomaly_data,
      showErrorModal: new_anomaly_data === "No matches" ? true: false,
      errorText: new_anomaly_data === "No matches" ? "No anomalies found. Showing all entries." : "",
    }, () => {
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

  handleInputChange = (input) => {
    this.setState({
      usernameInput: input,
    })
  }

  async getUUID() {
    // GET corresponding uuid from inputted username
    let result = null
    const myAPI = new API({url: flaskApiUrl})
    myAPI.createEntity({ name: 'get'})
    await myAPI.endpoints.get.username({username: this.state.usernameInput})
      .then(response => result = response.data);
    let token = result.token

    let defaultSunburstData = null;
    let defaultAnomalyData = null;
    if (result !== "No matches") {
      // GET default sunburst data 
      defaultSunburstData = await this.getSunburstData(undefined, undefined, result["uuid"], token);
      // GET default anomaly data
      defaultAnomalyData = await this.getAnomalyData(undefined, undefined, result["uuid"], token);
    }

    // Check if username was found. If not, display error modal.
    if(result !== "No matches") {
      this.setState({
        uuid: result["uuid"],
        showSunburst: false,
        showAnomalies: false,
        defaultSunburstData,
        defaultAnomalyData,
        token,
      })
    } else {
      this.setState({
        showErrorModal: true,
        errorText: "No user found.",
        showSunburst: false,
        showAnomalies: false,
        defaultSunburstData,
        defaultAnomalyData,
        uuid: null,
      })
    }
  }

  render() {
    return (
      <div className="data-vis-page">
        <br/>

        <div className="username-wrapper">
          <div className="form-group">
            <span className = "uuid-prompt">Username:</span>
            <input class="form-field" type="text" placeholder="Please input your username" onChange={e => this.handleInputChange(e.target.value)}/>
          </div>
          <Button className="view_button" onClick={this.getUUID.bind(this)}>Submit</Button>
        </div>

        {this.state.uuid === null ? null : <div className="datavis-options-container">
          <DateTimeRangePicker
            value = {this.state.date[0] === null ? this.state.defaultDate : this.state.date}
            onChange={this.onChangeDateTime}
            maxDetail = "second"
            clearIcon = {null}
          />
          <Button className="view_button" justify="center" onClick={this.toggleSunburst.bind(this)}>
            View App Usage
          </Button>
          <Button className="view_button" justify="center" onClick = {this.toggleAnomalies.bind(this)}>
            View Anomalies
          </Button>
        </div>}

        {this.state.showSunburst && this.displaySunburst()}
        {this.displayAnomalies()}

        <ErrorModal showErrorModal={this.state.showErrorModal} errorText={this.state.errorText} handleModalClose={this.handleModalClose} />
      </div>
    );
  }
}
