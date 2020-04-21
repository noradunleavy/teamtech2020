import React, {Component} from 'react';
//import ReactDOM from 'react-dom';
import Sunburst from './Sunburst';
import data from './data';
import './datavis.css';
//import DropdownButton from 'react-bootstrap/DropdownButton';
//import Dropdown from 'react-bootstrap/Dropdown';
import Calendar from 'react-date-range-calendar';
//import 'react-calendar/dist/Calendar.css';
//import { CalendarPicker, RangePicker } from 'react-minimal-datetime-range';
//import 'react-minimal-datetime-range/lib/react-minimal-datetime-range.min.css';


export default class DataVisualization extends React.Component {
  onChange = date=> this.ListeningStateChangedEvent({date})
  state = { date: new Date()}
  render() {
    return (
      <div>
        <Calendar
          onChange={this.onChange}
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
          onChange={selectedDate => {
            console.log("here is the selected date", selectedDate);
          }}
        />
      <Sunburst data={data}
      width="1500" 
      height="900"           
      count_member="size"
      labelFunc={(node)=>node.data.name}
      _debug={true}
       />

      </div>
    )
  }
}
/*

  
const options = [
'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];
const defaultOption = options[0];

class DataVisualization extends React.Component {

  onSelect(event){
    console.log(event);
  }


  render() {
    return (
      <div>
        <DropdownButton 
        id="dropdown-item-button" 
        title="Choose a TimeStamp"
        >
          <Dropdown.Item as="button">Monday</Dropdown.Item>
          <Dropdown.Item as="button">Tuesday</Dropdown.Item>
          <Dropdown.Item as="button">Wednesday</Dropdown.Item>
          <Dropdown.Item as="button">Thursday</Dropdown.Item>
          <Dropdown.Item as="button">Friday</Dropdown.Item>
          <Dropdown.Item as="button">Saturday</Dropdown.Item>
          <Dropdown.Item as="button">Sunday</Dropdown.Item>
        </DropdownButton>
        
        <Sunburst
           data={data}
           width="880"
           height="880"
           count_member="size"
           labelFunc={(node)=>node.data.name}
           _debug={true}
         />
      </div>
    );
  }
}

ReactDOM.render(
  <DataVisualization/>,
  document.querySelector('#app')
);
*/
//export default DataVisualization;
