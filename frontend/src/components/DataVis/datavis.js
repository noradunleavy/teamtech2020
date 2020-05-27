import React, {Component, useContext} from 'react';
import Sunburst from './Sunburst';
import './datavis.css';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import Button from 'react-bootstrap/Button';
import { UserContext } from "../UserContext.js";
import UserForm from '../UUIDForm';

import API from '../../api';

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
      showErrorMessage: false,
    };
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

  async componentDidMount() {
    // Get default sunburst data 
    let data = await this.getSunburstData(undefined, undefined);
    this.setState({
      defaultSunburstData: data,
    })
  }

  onChangeDateTime = async(date) => {
    // Convert date into start and end unix timestamps
    let start = Math.floor(date[0].getTime() / 1000)
    let end = Math.floor(date[1].getTime() / 1000)
    
    let new_sunburst_data = await this.getSunburstData(start, end);
    this.setState((prevState) => ({
      date,
      sunburstData: new_sunburst_data !== "No matches" ? new_sunburst_data : prevState.defaultSunburstData,
      showSunburst: false,
      showErrorMessage: new_sunburst_data == "No matches" ? true : false,
    }))
  }

  toggleSunburst = () => {
    this.setState({
      showSunburst: true,
    })
  }

  displaySunburst = () => <Sunburst
    data={this.state.sunburstData}
    width="800" 
    height="900"           
    count_member="size"
    labelFunc={(node)=>node.data.name}
    _debug={false}
  />

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
        <Button onClick={this.toggleSunburst}>View</Button>
        { this.state.showErrorMessage && this.state.showSunburst && <p className="error-message">No matches found for this range. Showing all entries.</p> }
        { this.state.showSunburst && this.displaySunburst() }
      </div>
    );
  }
}
