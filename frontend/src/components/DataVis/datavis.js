import React, {Component} from 'react';
import Sunburst from './Sunburst';
import './datavis.css';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';

import API from '../../api';

export default class DataVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: [new Date(), new Date()],
      startTimestamp: 0,
      endTimestamp: 0,
      sunburstData: null,
    };
  }

  async componentDidMount() {
    const myAPI = new API({url: 'http://localhost:5000'})
    myAPI.createEntity({ name: 'get'})
    // Call GET endpoint for sunburst data and store in this.state.sunburstData
    await myAPI.endpoints.get.sunburstData({uuid: '5ebd070c717f9c1ca90906f41543437a30514f86546931a8acf85f38bf78edbe'}, {start_timestamp: this.state.startTimestamp }, {end_timestamp: this.state.endTimestamp })
        .then(response => this.setState({
          sunburstData: JSON.parse(JSON.stringify(response.data)),
        }));
    console.log(this.state.sunburstData);
  }

  onChangeDateTime = date => {
    let start = Math.floor(date[0].getTime() / 1000)
    let end = Math.floor(date[1].getTime() / 1000)
    this.setState({
      date,
      startTimestamp: start,
      endTimestamp: end,
    })
  }

  render() {
    return (
      <div className="data-vis-page">
        <DateTimeRangePicker
          onChange={this.onChangeDateTime}
          value={this.state.date}
          maxDetail = "second"
          />
        {this.state.sunburstData !== null && 
          <Sunburst data={this.state.sunburstData}
            width="800" 
            height="900"           
            count_member="size"
            labelFunc={(node)=>node.data.name}
            _debug={true}
          />
        }
      </div>
    );
  }
}
