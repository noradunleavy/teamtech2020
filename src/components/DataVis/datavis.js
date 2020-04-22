import React, {Component} from 'react';
import Sunburst from './Sunburst';
import data from './data';
import './datavis.css';
import Calendar from 'react-date-range-calendar';

export default class DataVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  onChange = selectedDate => {
    console.log("Selected Date: ", selectedDate);
  }

  render() {
    return (
      <div className="data-vis-page">
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

        <Sunburst data={data}
          width="600" 
          height="700"           
          count_member="size"
          labelFunc={(node)=>node.data.name}
          _debug={true}
        />
      </div>
    )
  }
}
