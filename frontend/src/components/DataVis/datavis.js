import React, {Component, useContext} from 'react';
import Sunburst from './Sunburst';
import ReactVirtualizedTable from './Anomalies';
import './datavis.css';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import Button from 'react-bootstrap/Button';
import { UserContext } from "../UserContext.js";
import UserForm from '../UUIDForm';
// import { AnomalyButton } from '@material-ui/core';

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
      date: [new Date(), new Date()],
      startTimestamp: undefined,
      endTimestamp: undefined,
      sunburstData: null,
      defaultSunburstData: null,
      showSunburst: false,
      showAnomalies: false,
      anomalyData: null,
      showErrorMessage: false,
    };
    this.tableRef = React.createRef();
  }

  // 5ebd070c717f9c1ca90906f41543437a30514f86546931a8acf85f38bf78edbe

  getSunburstData = async(start, end) => {
    let data = null
    const myAPI = new API({url: 'https://teamtech2020.herokuapp.com'})
    myAPI.createEntity({ name: 'get'})
    await myAPI.endpoints.get.sunburstData({uuid: this.context.uuid}, {start_timestamp: start}, {end_timestamp: end})
      .then(response => data = response.data);
    
    return JSON.parse(JSON.stringify(data));
  }

  getAnomalyData = async(start, end) => {
    let anomalyData = null
    const myAPI = new API({url: 'https://teamtech2020.herokuapp.com'})
    myAPI.createEntity({ name: 'get'})
    await myAPI.endpoints.get.anomalyData({uuid: this.context.uuid}, {start_timestamp: start}, {end_timestamp: end})
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
    console.log('here');

    let new_anomaly_data = await this.getAnomalyData(this.state.startTimestamp, this.state.endTimestamp);

    console.log(new_anomaly_data);

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

  render() {
    return (
      <div className="data-vis-page">
        <br/>
        <UserForm />
        <DateTimeRangePicker
          onChange={this.onChangeDateTime}
          value={this.state.date}
          maxDetail = "second"
          clearIcon = {null}
        />
        <Button onClick={this.toggleSunburst.bind(this)}>View</Button>
        { this.state.showErrorMessage && this.state.showSunburst && <p className="error-message">No matches found for this range. Showing all entries.</p> }
        { this.state.showSunburst && this.displaySunburst() }

        <div className="container" style={styles.container}>
          <Button className="anomaly_button" justify="center"
            onClick = {this.toggleAnomalies.bind(this)}>
            Anomalies
          </Button>
        </div> 
        {this.displayAnomalies()}
      </div>
    );
  }
}
