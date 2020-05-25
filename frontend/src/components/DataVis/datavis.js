import React, {Component} from 'react';
import Sunburst from './Sunburst';
import './datavis.css';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import Button from 'react-bootstrap/Button';

import API from '../../api';

export default class DataVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: [new Date(), new Date()],
      startTimestamp: undefined,
      endTimestamp: undefined,
      sunburstData: null,
      showSunburst: false,
    };
  }

  getSunburstData = async(start, end) => {
    let data = null
    const myAPI = new API({url: 'http://localhost:5000'})
    myAPI.createEntity({ name: 'get'})
    await myAPI.endpoints.get.sunburstData({uuid: "5ebd070c717f9c1ca90906f41543437a30514f86546931a8acf85f38bf78edbe"}, {start_timestamp: start}, {end_timestamp: end})
      .then(response => data = response.data);
    
    return JSON.parse(JSON.stringify(data));
  }

  async componentDidMount() {
    // Get default sunburst data 
    let data = await this.getSunburstData(undefined, undefined);
    this.setState({
      sunburstData: data,
    })
  }

  onChangeDateTime = async(date) => {
    // Convert date into start and end unix timestamps
    let start = Math.floor(date[0].getTime() / 1000)
    let end = Math.floor(date[1].getTime() / 1000)
    // TODO: Need to replace with start and end vars
    let new_sunburst_data = await this.getSunburstData(1512468142, 1512512500);

    this.setState((prevState) => ({
      date,
      sunburstData: new_sunburst_data !== "No matches" ? new_sunburst_data : prevState.sunburstData,
      showSunburst: false,
    }))
  }

  toggleSunburst = () => {
    this.setState({
      showSunburst: true,
    })
  }

  displaySunburst = () => {
    let sunburst = this.state.showSunburst ? <Sunburst data={this.state.sunburstData}
      width="800" 
      height="900"           
      count_member="size"
      labelFunc={(node)=>node.data.name}
      _debug={true}
    /> : null
    console.log(this.state.sunburstData);
    return sunburst
  }

  render() {
    return (
      <div className="data-vis-page">
        <DateTimeRangePicker
          onChange={this.onChangeDateTime}
          value={this.state.date}
          maxDetail = "second"
          clearIcon = {null}
        />
        <Button 
        onClick={this.toggleSunburst}>View</Button>
        {this.displaySunburst()}
      </div>
    );
  }
}
