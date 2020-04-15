import React, {Component} from 'react';
import { Helmet } from "react-helmet";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import { Switch, Route, Router, BrowserRouter, Redirect, UseHistory } from 'react-router-dom';
import Settings from '../settings.js';
import { render } from '@testing-library/react';
import Sunburst from 'react-sunburst-d3-v4';
import data from './data';
import './datavis.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
//import 'react-dropdown/style.css';

const options = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];
const defaultOption = options[0];
class DataVisualization extends Component {
  onSelect(event){
    console.log(event);
  }

  
  render() {
    return (
      <div>
        <DropdownButton 
        id="dropdown-item-button" 
        title="Choose a TimeStamp"
        alignCenter
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
          onSelect={this.onSelect}
          scale="linear"
          tooltipContent={<div class="sunburstTooltip" style="position:absolute; color:'black'; z-index:10; background: #e2e2e2; padding: 5px; text-align: center;" />} // eslint-disable-line
          tooltip
          tooltipPosition="right"
          keyId="anagraph"
          width="600"
          height="600"
        />
      </div>

    );
  }
}

export default DataVisualization;
