import React, {Component} from 'react';
import Sunburst from './Sunburst';
import data from './data';
import './datavis.css';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
//import Calendar from 'react-date-range-calendar';
//import 'bootstrap/dist/css/bootstrap.css';
//require('react-datetime-range-picker/dist/style.css');  
//require('react-datetime-range-picker/dist/index.js');

export default class DataVisualization extends Component {
  //constructor(props) {
    //super(props);
    //this.state = {date: new Date()};
  //}

  state = 
  {
    date: [new Date(), new Date()]
  }

  onChange = date => this.setState({date})
  //onChange = selectedDate => {
    //console.log("Selected Date: ", selectedDate);
  

  render() {
    return (
      
      <div className="data-vis-page">
        <DateTimeRangePicker
          onChange={this.onChange}
          value={this.state.date}
          maxDetail = "second"
          />
        <Sunburst data={data}
          width="800" 
          height="900"           
          count_member="size"
          labelFunc={(node)=>node.data.name}
          //labelFunc= {(node)=>node.data.timestamp}
          _debug={true}
        />
      </div>
    );
  }
}

/*
<Calendar
          value={this.state.date}
          onSelect={(startDate, endDate, validDateRange) => {
            console.log(
              startDate,
              " this is the start date",
              endDate,
              " this is the end date value.......",
              " and this is the validDateRange",
              validDateRange
            );
          }}
          onChange={this.onChange}
        />
*/