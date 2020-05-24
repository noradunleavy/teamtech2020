import React, {Component} from 'react';
import Sunburst from './Sunburst';
import data from './data';
import './datavis.css';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';

import API from '../../api';

export default class DataVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: [new Date(), new Date()],
      sunburstData: null,
    };
  }

  async componentDidMount() {
    const myAPI = new API({url: 'http://localhost:5000'})
    myAPI.createEntity({ name: 'get'})
    // Call GET endpoint for sunburst data and store in this.state.sunburstData
    await myAPI.endpoints.get.sunburstData({uuid: '5ebd070c717f9c1ca90906f41543437a30514f86546931a8acf85f38bf78edbe'}, {start_timestamp: 1512468142 }, {end_timestamp: 1512512500 })
        .then(response => this.setState({
          sunburstData: response.data,
        }));
        
    console.log(this.state.sunburstData);
  }

  onChangeDateTime = date => this.setState({date})

  render() {
    return (
      
      <div className="data-vis-page">
        <DateTimeRangePicker
          onChange={this.onChangeDateTime}
          value={this.state.date}
          maxDetail = "second"
          />
        <Sunburst data={data}
          width="800" 
          height="900"           
          count_member="size"
          labelFunc={(node)=>node.data.name}
          _debug={true}
        />
      </div>
    );
  }
}
